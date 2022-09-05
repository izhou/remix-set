import { LoaderFunction, LinksFunction, redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import stylesUrl from "~/styles/game.css";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

type LoaderData = {
  oldestDate?: string,
  newestDate?: string,
  currentDate?: string
}
export const loader: LoaderFunction = async ({ params }) => {

  let oldestPuzzle = await db.dailyPuzzle.findFirst({
    orderBy: { date: 'asc' }
  });

  let newestPuzzle = await db.dailyPuzzle.findFirst({
    orderBy: { date: 'desc' }
  });

  let currentDate = params.date || newestPuzzle?.date;

  const data: LoaderData = {
    oldestDate: oldestPuzzle?.date,
    newestDate: newestPuzzle?.date,
    currentDate,
  }

  return json(data);
}

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
    return (
    <>
      <h1>Set: Puzzle Game</h1>
      <div className="daily-outlet">
        <Outlet/>
      </div>

      <form method="post" action="?index">
        <input type="date" name="date" 
          min={data.oldestDate} 
          max={data.newestDate}
          defaultValue={data.currentDate}
        ></input>
        <button type="submit">Go</button>
      </form>
    </>
  );
}