import PuzzleGame from "~/components/puzzleGame"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { DailyPuzzle } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

type LoaderData = {
  puzzle: DailyPuzzle,
}

export const loader: LoaderFunction = async ({params}) => {
  let puzzle = await db.dailyPuzzle.findUnique({
    where: {date:  params.date},
  });

  // If puzzle cannot be found for that date, redirect to index
  if (!puzzle) return redirect(`/daily`);

  return json({puzzle});
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const date = form.get("date");
  return redirect(`/daily/${date}`);
}

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
  return (
      <PuzzleGame currentCards={JSON.parse(data.puzzle.cards)} />
  );
}