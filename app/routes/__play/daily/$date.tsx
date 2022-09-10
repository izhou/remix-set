import PuzzleGame from "~/components/puzzleGame";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { DailyPuzzle, DailyPuzzleHistory } from "@prisma/client";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { CardData, SetIndex } from "~/utils/types";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";

type LoaderData = {
  puzzle: DailyPuzzle;
  history: DailyPuzzleHistory;
  userId: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.date) return redirect(`/daily`);

  let puzzle = await db.dailyPuzzle.findUnique({
    where: { date: params.date },
  });

  // If puzzle cannot be found for that date, redirect to index
  if (!puzzle) return redirect(`/daily`);

  let userId = await getUserId(request);
  let history = userId
    ? await db.dailyPuzzleHistory.findUnique({
        where: {
          userId_puzzleDate: {
            puzzleDate: params.date,
            userId,
          },
        },
      })
    : [];

  return json({ puzzle, history, userId });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("date");
  return redirect(`/daily/${date}`);
};

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const updateHistory = async (history: SetIndex[]) => {
    let stringified_history = JSON.stringify(history);

    fetcher.submit(
      { date: data.puzzle.date, history: stringified_history },
      { method: "post", action: "/daily/update-history" }
    );
  };

  let history = fetcher.submission
    ? JSON.parse(fetcher.submission.formData.get("history") as string)
    : fetcher.data?.foundSets.map(
        (index: string) => JSON.parse(index) as SetIndex
      ) || [];

  return (
    <PuzzleGame
      currentCards={JSON.parse(data.puzzle.cards)}
      updateHistory={updateHistory}
      history={history}
    />
  );
}
