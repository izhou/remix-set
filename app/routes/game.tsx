import Game from "~/components/game" 
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/game.css";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function SetRoute() {
  return (
    <> 
      <h1>Set: Zen Mode</h1>
      <Game title="Set: Zen Mode"/>
    </>
  );
}