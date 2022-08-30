import React from "react";

const numbers = [1, 2, 3];
const shapes = ["squiggle", "oval", "diamond"];
const fills = ["solid", "empty", "striped"];
const colors = ["r", "g", "b"];

export interface CardInterface {
  active?: boolean,
  number: typeof numbers[number];
  shape: typeof shapes[number];
  fill: typeof fills[number];
  color: typeof colors[number];
}

const svgMap: Record<typeof shapes[number], string> = {
  "squiggle": "m31 16c69-48 69 48 137 0 39-24 39 38 0 67-69 48-69-48-137 0-39 24-39-38 0-67",
  "oval": "m51 2a.98.96 0 000 96h98a.98.96 0 000-96H51",
  "diamond": "m2 50 98-48 98 48-98 48z"
}

export default function Card(props: CardInterface) {
  let color =
    props.color == "r" ? `#cd5c5c`
      : props.color == "g" ? "#64a18d"
        : "#755B7B";

  const symbols = Array.from(Array(props.number), (_, i) =>
    <div className="symbol" key={i}>
      <svg color={color} viewBox="0 0 200 100">
        {/* Shape fill */}
        <path
          d={svgMap[props.shape]}
          fill={props.fill == "empty" ? "none" : "currentcolor"}
          mask={props.fill == "striped" ? "url(#mask-stripe)" : "none"}
        ></path>
        {/* Shape outline */}
        <path
          d={svgMap[props.shape]}
          fill="none"
          strokeWidth="4px"
          stroke="currentcolor"
        ></path>
      </svg>
    </div>
  )

  return (
    <button className="card-container">
      <div className="card">
        {symbols}
      </div>
    </button>
  )
}

// Creates an array of all possible cards
export function createDeck(): Array<CardInterface> {
  let deck: Array<CardInterface> = [];
  numbers.forEach(number =>
    shapes.forEach(shape =>
      fills.forEach(fill =>
        colors.forEach(color =>
          deck.push({
            number, shape, fill, color
          })
        ))));

  return deck;
}