import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";
import { SetIndex } from "~/utils/types";
import { getSession, commitSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  let puzzleDate = form.get("date");
  let stringifiedSets = form.get("foundSets");

  if (typeof puzzleDate !== "string" || typeof stringifiedSets !== "string") {
    return json(form, { status: 400 });
  }
  let foundSets: Array<SetIndex> = JSON.parse(stringifiedSets);
  let parsedSets = foundSets.map((index) => JSON.stringify(index));

  const userId = await getUserId(request);
  if (!userId) {
    const session = await getSession(request.headers.get("Cookie"));
    let history = session.get("history") || {};

    history[puzzleDate] = parsedSets;

    session.set("history", history);
    return json(
      { foundSets: parsedSets },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }

  const puzzleHistory = await db.dailyPuzzleHistory.upsert({
    where: { userId_puzzleDate: { puzzleDate, userId } },
    update: { foundSets: parsedSets },
    create: {
      userId,
      puzzleDate,
      foundSets: parsedSets,
    },
  });

  return json(puzzleHistory);
};
