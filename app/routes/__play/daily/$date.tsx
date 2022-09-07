import PuzzleGame from "~/components/puzzleGame"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { DailyPuzzle, DailyPuzzleHistory } from "@prisma/client";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { CardData } from "~/utils/types";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/auth.server";


type LoaderData = {
  puzzle: DailyPuzzle,
  history: DailyPuzzleHistory
}

export const loader: LoaderFunction = async ({request, params}) => {
  if (!params.date) return redirect(`/daily`);

  let puzzle = await db.dailyPuzzle.findUnique({
    where: {date:  params.date},
  });

  // If puzzle cannot be found for that date, redirect to index
  if (!puzzle) return redirect(`/daily`);

  let userId = await getUserId(request);
  let history = userId ? await db.dailyPuzzleHistory.findUnique({
    where: {
      userId_puzzleDate: {
        puzzleDate: params.date,
        userId
      }
    }
  }) : [];

  return json({puzzle, history});
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("date");
  return redirect(`/daily/${date}`);
}

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  
  const updateHistory = async(foundSet: string) => {
    fetcher.submit(
      { date: data.puzzle.date, foundSet },
      { method: "post", action: "/daily/update-history" }
    );
  };

  return (
      <PuzzleGame 
        currentCards={JSON.parse(data.puzzle.cards)}
        updateHistory={updateHistory}
        history={data.history?.foundSets || []}
      />
  );
}