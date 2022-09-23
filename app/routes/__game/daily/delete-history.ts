import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";
import { getSession, commitSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  let puzzleDate = form.get("date");

  if (typeof puzzleDate !== "string") {
    return json(form, { status: 400 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  let sessionHistory = session.get("history") || {};

  // Clear session history
  delete sessionHistory[puzzleDate];
  session.set("history", sessionHistory);

  // Delete from DB
  const userId = await getUserId(request);

  if (userId) {
    let history = await db.puzzleGameHistory.findUnique({
      where: { userId_puzzleDate: { puzzleDate, userId } },
    });

    if (history)
      await db.puzzleGameHistory.delete({
        where: { userId_puzzleDate: { puzzleDate, userId } },
      });
  }

  return json({}, { headers: { "Set-Cookie": await commitSession(session) } });
};
