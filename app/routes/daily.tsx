import PuzzleGame from "~/components/puzzleGame"
import { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/game.css";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function SetRoute() {
  return (
    <>
      <h1>Set: Puzzle Game</h1>
      <PuzzleGame />
    </>
  );
}