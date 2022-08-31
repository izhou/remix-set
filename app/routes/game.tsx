import Game from "~/components/game" 
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/game.css";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function SetRoute() {

  return (
    <div> 
      <h1>Set Game</h1>
      <Game />
    </div>
  );
}