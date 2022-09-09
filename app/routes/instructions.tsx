import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Card from "~/components/card";
import instructionsStyleUrl from "~/styles/instructions.css";
import { CardShapes, CardNumbers, CardColors, CardFills } from "~/utils/types";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: instructionsStyleUrl }];
};

export default function IndexRoute() {
  return (
    <>
      <div className="grid-footer-right"></div>
      <div className="grid-main-center">
        <h1>How to play Set</h1>

        <div>
          <p>
            Cards in Set have symbols with four different traits: shapes,
            colors, fill, and number.
          </p>
          <p>
            Find three cards where every trait is either all the same or all
            different:
          </p>
        </div>

        <div className="examples-container">
          <div className="example">
            <div>Different shapes:</div>
            <div className="example-cards">
              <Card
                data={{
                  number: CardNumbers.One,
                  shape: CardShapes.Squiggle,
                  fill: CardFills.Solid,
                  color: CardColors.Red,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.One,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Red,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.One,
                  shape: CardShapes.Diamond,
                  fill: CardFills.Solid,
                  color: CardColors.Red,
                }}
              />
            </div>
          </div>
          <div className="example">
            <div>Different colors:</div>
            <div className="example-cards">
              <Card
                data={{
                  number: CardNumbers.Two,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Red,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Two,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Green,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Two,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Blue,
                }}
              />
            </div>
          </div>
          <div className="example">
            <div>Different fills:</div>
            <div className="example-cards">
              <Card
                data={{
                  number: CardNumbers.Three,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Blue,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Three,
                  shape: CardShapes.Oval,
                  fill: CardFills.Striped,
                  color: CardColors.Blue,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Three,
                  shape: CardShapes.Oval,
                  fill: CardFills.Empty,
                  color: CardColors.Blue,
                }}
              />
            </div>
          </div>
          <div className="example">
            <div>Different numbers:</div>
            <div className="example-cards">
              <Card
                data={{
                  number: CardNumbers.One,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Green,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Two,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Green,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Three,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Green,
                }}
              />
            </div>
          </div>
          <div className="example">
            <div>Some different traits:</div>
            <div className="example-cards">
              <Card
                data={{
                  number: CardNumbers.Two,
                  shape: CardShapes.Squiggle,
                  fill: CardFills.Striped,
                  color: CardColors.Red,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.One,
                  shape: CardShapes.Oval,
                  fill: CardFills.Striped,
                  color: CardColors.Red,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Three,
                  shape: CardShapes.Diamond,
                  fill: CardFills.Striped,
                  color: CardColors.Red,
                }}
              />
            </div>
          </div>
          <div className="example">
            <div>All different traits:</div>
            <div className="example-cards">
              <Card
                data={{
                  number: CardNumbers.One,
                  shape: CardShapes.Diamond,
                  fill: CardFills.Striped,
                  color: CardColors.Red,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Two,
                  shape: CardShapes.Squiggle,
                  fill: CardFills.Empty,
                  color: CardColors.Green,
                }}
              />
              <Card
                data={{
                  number: CardNumbers.Three,
                  shape: CardShapes.Oval,
                  fill: CardFills.Solid,
                  color: CardColors.Blue,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid-footer-left">
        <Link to="/">{`< Home`}</Link>
      </div>
    </>
  );
}
