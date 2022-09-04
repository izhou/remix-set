import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import stylesUrl from "~/styles/game.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function DailyPuzzlesRoute() {
  return (
    <>
      <h1>Set: Puzzle Game</h1>
      <div className="daily-outlet">
        <Outlet/>
      </div>
    </>
  );
}