import PuzzleGame from "~/components/puzzleGame"
import { LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { DailyPuzzle } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

type LoaderData = {
  currentPuzzle: DailyPuzzle,
  allPuzzles: Array<DailyPuzzle>,
}


export const loader: LoaderFunction = async ({ params }) => {
  let allPuzzles = await db.dailyPuzzle.findMany({
    orderBy: { date: 'desc' }
  });

  let currentPuzzle = allPuzzles[0];

  const data: LoaderData = {
    currentPuzzle,
    allPuzzles,
  }

  return json(data);
}

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <PuzzleGame currentCards={JSON.parse(data.currentPuzzle.cards)} />
      {data.allPuzzles.map((puzzle) => puzzle.date !== data.currentPuzzle.date 
        && <Link to={puzzle.date} key={puzzle.date}>{puzzle.date}</Link>)
      }
    </>
  );
}