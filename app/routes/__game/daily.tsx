import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  oldestDate?: string;
  newestDate?: string;
  currentDate?: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  let oldestPuzzle = await db.puzzleGame.findFirst({
    orderBy: { date: "asc" },
  });

  let newestPuzzle = await db.puzzleGame.findFirst({
    orderBy: { date: "desc" },
  });

  let currentDate = params.date || newestPuzzle?.date;

  const data: LoaderData = {
    oldestDate: oldestPuzzle?.date,
    newestDate: newestPuzzle?.date,
    currentDate,
  };

  return json(data);
};

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <div className="grid-header-left">
        <h1>Set: Daily Puzzle</h1>
      </div>

      <Outlet />
      <div className="grid-footer-right">
        <p>Choose another date:</p>
        <form method="post" action="?index">
          <input
            type="date"
            name="date"
            min={data.oldestDate}
            max={data.newestDate}
            defaultValue={data.currentDate}></input>
          <button type="submit">Go</button>
        </form>
      </div>
    </>
  );
}
