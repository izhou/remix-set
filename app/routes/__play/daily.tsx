import { User } from "@prisma/client";
import { LoaderFunction, LinksFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, Link } from "@remix-run/react";
import stylesUrl from "~/styles/game.css";
import { getUser } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

type LoaderData = {
  oldestDate?: string,
  newestDate?: string,
  currentDate?: string,
  user?: User
}
export const loader: LoaderFunction = async ({ params, request }) => {
  let user = await getUser(request);

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

  if (user) data.user = user;

  return json(data);
}

export default function DailyPuzzlesRoute() {
  const data = useLoaderData<LoaderData>();
    return (
    <>
      <div className = "grid-header-left">
        <h1>Set: Daily Puzzle</h1>
      </div>

      <Outlet/>
      <div className="grid-footer-right">
        <p>Choose another date:</p>
          <form method="post" action="?index">
            <input type="date" name="date"
              min={data.oldestDate}
              max={data.newestDate}
              defaultValue={data.currentDate}
            ></input>
            <button type="submit">Go</button>
          </form>
      </div>
    </>
  );
}