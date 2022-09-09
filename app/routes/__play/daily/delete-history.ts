import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId)
    return json({ error: `User must be signed in.` }, { status: 400 });

  const form = await request.formData();

  let puzzleDate = form.get("date");

  if (typeof puzzleDate !== "string") {
    return json(form, { status: 400 });
  }

  const puzzleHistory = await db.dailyPuzzleHistory.delete({
    where: { userId_puzzleDate: { puzzleDate, userId } },
  });

  return json(puzzleHistory);
};
