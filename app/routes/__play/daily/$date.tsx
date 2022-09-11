import PuzzleGame from "~/components/puzzleGame";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { DailyPuzzle, DailyPuzzleHistory } from "@prisma/client";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { CardData, SetIndex } from "~/utils/types";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";
import { getSession } from "~/sessions";

type LoaderData = {
  puzzle: DailyPuzzle;
  foundSets: Array<string>;
  userId: number;
  history: any;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.date) return redirect(`/daily`);

  let puzzle = await db.dailyPuzzle.findUnique({
    where: { date: params.date },
  });

  // If puzzle cannot be found for that date, redirect to index
  if (!puzzle) return redirect(`/daily`);

  let userId = await getUserId(request);
  let foundSets: Array<string> = [];

  if (userId) {
    let history = await db.dailyPuzzleHistory.findUnique({
      where: {
        userId_puzzleDate: {
          puzzleDate: params.date,
          userId,
        },
      },
    });

    if (history) foundSets = history.foundSets;
  } else {
    const session = await getSession(request.headers.get("Cookie"));
    let history = session.get("history") || {};

    if (history[params.date]) foundSets = history[params.date];
  }

  return json({ puzzle, foundSets, userId });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("date");
  return redirect(`/daily/${date}`);
};

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  console.log(data.history);

  const updateHistory = async (foundSets: SetIndex[]) => {
    let stringifiedSets = JSON.stringify(foundSets);

    fetcher.submit(
      { date: data.puzzle.date, foundSets: stringifiedSets },
      { method: "post", action: "/daily/update-history" }
    );
  };

  let foundSets: Array<SetIndex> = [];

  if (fetcher.submission) {
    foundSets = JSON.parse(
      fetcher.submission.formData.get("foundSets") as string
    );
  } else {
    let stringifedSets = data?.foundSets || fetcher.data?.foundSets;
    if (stringifedSets)
      foundSets = stringifedSets.map((index) => JSON.parse(index) as SetIndex);
  }

  return (
    <PuzzleGame
      currentCards={JSON.parse(data.puzzle.cards)}
      updateHistory={updateHistory}
      foundSets={foundSets}
    />
  );
}
