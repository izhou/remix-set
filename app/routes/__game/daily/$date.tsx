import PuzzleGame from "~/components/puzzleGame";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { PuzzleGame as PuzzleGameData } from "@prisma/client";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { SetIndex, unstringifySetIndex } from "~/utils/types";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";
import { getSession } from "~/sessions";

type LoaderData = {
  puzzle: PuzzleGameData;
  setIndexes: Array<SetIndex>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.date) return redirect(`/daily`);

  let puzzle = await db.puzzleGame.findUnique({
    where: { date: params.date },
  });

  // If puzzle cannot be found for that date, redirect to index
  if (!puzzle) return redirect(`/daily`);

  const userId = await getUserId(request);
  let setIndexes: Array<SetIndex> = [];

  // Check if history is stored in cookies
  const session = await getSession(request.headers.get("Cookie"));
  const sessionHistory = session.get("history") || {};

  if (sessionHistory[params.date]) setIndexes = sessionHistory[params.date];

  // Check if history is stored in db
  if (userId) {
    let dbHistory = await db.puzzleGameHistory.findUnique({
      where: {
        userId_puzzleDate: {
          puzzleDate: params.date,
          userId,
        },
      },
    });

    if (dbHistory) {
      const dbSetIndexes = dbHistory.stringifiedSetIndexes.map(
        (stringifiedSet) => unstringifySetIndex(stringifiedSet)
      );

      setIndexes = [...new Set(setIndexes.concat(dbSetIndexes))];
    }
  }

  return json({ puzzle, setIndexes });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("date");
  return redirect(`/daily/${date}`);
};

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const updateHistory = async (setIndexes: SetIndex[]) => {
    fetcher.submit(
      {
        date: data.puzzle.date,
        stringifiedSetIndexes: JSON.stringify(setIndexes),
      },
      { method: "post", action: "/daily/update-history" }
    );
  };

  const deleteHistory = async () => {
    fetcher.submit(
      { date: data.puzzle.date },
      { method: "post", action: "/daily/delete-history" }
    );
  };

  let setIndexes: Array<SetIndex> = [];

  if (fetcher.submission) {
    setIndexes =
      (JSON.parse(
        fetcher.submission.formData.get("stringifiedSetIndexes") as string
      ) as Array<SetIndex>) || [];
  } else {
    setIndexes = data?.setIndexes || fetcher.data?.setIndexes;
  }

  return (
    <PuzzleGame
      currentCards={data.puzzle.cards}
      updateHistory={updateHistory}
      deleteHistory={deleteHistory}
      history={setIndexes}
    />
  );
}
