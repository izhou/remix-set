import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";
import { SetIndex } from "~/utils/types";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  let puzzleDate = form.get("date");
  let stringifiedHistory = form.get("history");

  if (
    typeof puzzleDate !== "string" ||
    typeof stringifiedHistory !== "string"
  ) {
    return json(form, { status: 400 });
  }
  let history: Array<SetIndex> = JSON.parse(stringifiedHistory);
  let parsedHistory = history.map((index) => JSON.stringify(index));

  const userId = await getUserId(request);
  if (!userId) return json({ foundSets: parsedHistory });

  const puzzleHistory = await db.dailyPuzzleHistory.upsert({
    where: { userId_puzzleDate: { puzzleDate, userId } },
    update: { foundSets: parsedHistory },
    create: {
      userId,
      puzzleDate,
      foundSets: parsedHistory,
    },
  });

  return json(puzzleHistory);
};
