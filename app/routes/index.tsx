import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { LoginHeader } from "~/components/loginHeader";
import indexStylesUrl from "~/styles/index.css";
import Card from "~/components/card";
import { CardShapes, CardNumbers, CardColors, CardFills } from "~/utils/types";

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  return json({ user });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: indexStylesUrl }];
};

export default function IndexRoute() {
  const { user } = useLoaderData();
  return (
    <>
      <LoginHeader username={user?.username} />
      <div className="grid-main-center index-container">
        <div className="title">
          Set
          <div className="title-cards">
            <Card
              data={{
                number: CardNumbers.Three,
                shape: CardShapes.Squiggle,
                fill: CardFills.Solid,
                color: CardColors.Red,
              }}
            />
            <Card
              data={{
                number: CardNumbers.Two,
                shape: CardShapes.Oval,
                fill: CardFills.Empty,
                color: CardColors.Green,
              }}
            />
            <Card
              data={{
                number: CardNumbers.One,
                shape: CardShapes.Diamond,
                fill: CardFills.Striped,
                color: CardColors.Blue,
              }}
            />
          </div>
        </div>

        <div className="subtitle">A game of visual perception.</div>
        <br />

        <div className="game-link">
          <Link to="standard">Standard Game</Link>
        </div>
        <div className="game-link">
          <Link to="daily">Daily Puzzle</Link>
        </div>

        <br />
        <div>
          <Link to="instructions">Instructions</Link>
        </div>
      </div>
    </>
  );
}
