import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";
import { SetIndex } from "~/utils/types";
import { getSession, commitSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  let puzzleDate = form.get("date");
  let jsonSets = form.get("foundSets");

  if (typeof puzzleDate !== "string" || typeof jsonSets !== "string") {
    return json(form, { status: 400 });
  }

  let foundSets: Array<SetIndex> = JSON.parse(jsonSets);
  let stringifiedSets = foundSets.map((index) => JSON.stringify(index));

  const userId = await getUserId(request);

  // Check for saved history in the session.
  const session = await getSession(request.headers.get("Cookie"));
  let sessionHistory = session.get("history") || {};

  if (sessionHistory[puzzleDate]) {
    stringifiedSets = [
      ...new Set(stringifiedSets.concat(sessionHistory[puzzleDate])),
    ];
  }

  if (!userId) {
    // If not logged in, store history in the session
    sessionHistory[puzzleDate] = stringifiedSets;
  } else {
    // If logged in, clear the session and store history in the db instead.
    delete sessionHistory[puzzleDate];
    const puzzleHistory = await db.dailyPuzzleHistory.upsert({
      where: { userId_puzzleDate: { puzzleDate, userId } },
      update: { foundSets: stringifiedSets },
      create: {
        userId,
        puzzleDate,
        foundSets: stringifiedSets,
      },
    });

    stringifiedSets = puzzleHistory.foundSets;
  }

  session.set("history", sessionHistory);

  return json(
    { foundSets: stringifiedSets },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};
