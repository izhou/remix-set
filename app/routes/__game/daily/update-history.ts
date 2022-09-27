import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";
import { SetIndex } from "~/utils/types";
import { getSession, commitSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  let puzzleDate = form.get("date");
  let stringifiedSetIndexes = form.get("stringifiedSetIndexes");

  if (
    typeof puzzleDate !== "string" ||
    typeof stringifiedSetIndexes !== "string"
  ) {
    return json(form, { status: 400 });
  }

  let setIndexes: Array<SetIndex> = JSON.parse(stringifiedSetIndexes);
  const userId = await getUserId(request);

  // Check for saved history in the session.
  const session = await getSession(request.headers.get("Cookie"));
  let sessionHistory = session.get("history") || {};

  if (!userId) {
    // If not logged in, store history in the session
    sessionHistory[puzzleDate] = setIndexes;
  } else {
    // If logged in, clear the session and store history in the db instead.
    delete sessionHistory[puzzleDate];
    let stringifiedSetIndexes = setIndexes.map((setIndex) =>
      JSON.stringify(setIndex)
    );

    await db.puzzleGameHistory.upsert({
      where: { userId_puzzleDate: { puzzleDate, userId } },
      update: { stringifiedSetIndexes },
      create: {
        userId,
        puzzleDate,
        stringifiedSetIndexes,
      },
    });
  }

  session.set("history", sessionHistory);

  return json(
    { setIndexes },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};
