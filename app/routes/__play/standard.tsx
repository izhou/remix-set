import StandardGame from "~/components/standardGame" 
import { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/game.css";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function SetRoute() {
  return (
    <>
      <div className="grid-header-left">
        <h1>Set: Daily Puzzle</h1>
      </div>

      <StandardGame />
    </>
  );
}