import PuzzleGame from "~/components/puzzleGame"
import { LinksFunction, LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { DailyPuzzle } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

type LoaderData = {
  puzzle: DailyPuzzle,
}

export const action:ActionFunction = async({request}) =>{
  const form = await request.formData();
  const date = form.get("date");

  return redirect(`/daily/${date}`);
}

export const loader: LoaderFunction = async () => {
  // By default, show the most recent puzzle
  let puzzle = await db.dailyPuzzle.findFirst({
    orderBy: { date: 'desc' }
  });

  if (!puzzle) throw Error('no puzzles available');

  return json({ puzzle });
}

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <PuzzleGame currentCards={JSON.parse(data.puzzle.cards)} />
  );
}