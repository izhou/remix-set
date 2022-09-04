import PuzzleGame from "~/components/puzzleGame"
import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { DailyPuzzle } from "@prisma/client";
import { Link, useLoaderData, Outlet } from "@remix-run/react";

import { db } from "~/utils/db.server";

import stylesUrl from "~/styles/game.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

type LoaderData = {
  currentPuzzle: DailyPuzzle,
  otherPuzzles: Array<DailyPuzzle>,
}


export const loader: LoaderFunction = async () => {
  let dailyPuzzles = await db.dailyPuzzle.findMany();
  let currentPuzzle = dailyPuzzles[0];
  dailyPuzzles.pop();

  const data: LoaderData = {
    currentPuzzle: currentPuzzle,
    otherPuzzles: dailyPuzzles
  }

  return json(data);
}

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <PuzzleGame currentCards={JSON.parse(data.currentPuzzle.cards)} />
      {data.otherPuzzles.map((puzzle) => <div>{puzzle.date}</div>)}
    </>
  );
}