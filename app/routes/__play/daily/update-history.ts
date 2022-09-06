import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId)
    return json(
      { error: `User must be signed in.`},
      { status: 400 }
    );

  const form = await request.formData();

  let puzzleDate = form.get('date');
  let foundSet = form.get('foundSet');

  if (typeof puzzleDate !== "string" || typeof foundSet !=="string") {
    return json( form, {status: 400});
  }

  const puzzleHistory = await db.dailyPuzzleHistory.upsert({
    where: { userId_puzzleDate: { puzzleDate, userId } },
    update: { foundSets: { push: foundSet } },
    create: {
      userId,
      puzzleDate,
      foundSets: foundSet
    },
  })

  return json(puzzleHistory);
};
