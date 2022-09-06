import StandardGame from "~/components/standardGame" 
import { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/game.css";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function SetRoute() {
  return (
    <>
      <h1 className="grid-header-left">Set: Standard Game</h1>
      <StandardGame />
    </>
  );
}