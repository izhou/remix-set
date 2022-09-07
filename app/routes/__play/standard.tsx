import StandardGame from "~/components/standardGame" 
import { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/game.css";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function StandardRoute() {
  return (
    <>
      <div className="grid-header-left">
        <h1>Set: Standard Game</h1>
      </div>

      <StandardGame />
    </>
  );
}