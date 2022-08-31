import React from "react";
import { CardData, CardFills } from "./types.d";
import {CardShapes, CardColors} from "./types.d";

const svgMap: Record<CardShapes, string> = {
  [CardShapes.Squiggle]: "m31 16c69-48 69 48 137 0 39-24 39 38 0 67-69 48-69-48-137 0-39 24-39-38 0-67",
  [CardShapes.Oval]: "m51 2a.98.96 0 000 96h98a.98.96 0 000-96H51",
  [CardShapes.Diamond]: "m2 50 98-48 98 48-98 48z"
}

export default function Card(props: CardData) {
  let color =
    props.color == CardColors.Red ? `#cd5c5c`
      : props.color == CardColors.Blue ? "#64a18d"
        : "#755B7B";

  const symbols = Array.from(Array(props.number), (_, i) =>
    <div className="symbol" key={i}>
      <svg color={color} viewBox="0 0 200 100">
        {/* Shape fill */}
        <path
          d={svgMap[props.shape]}
          fill={props.fill == CardFills.Empty ? "none" : "currentcolor"}
          mask={props.fill == CardFills.Striped ? "url(#mask-stripe)" : "none"}
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
    <button className="card-container" onClick={props.onClick}>
      <div className="card" card-data={JSON.stringify(props)}>
        {symbols}
      </div>
    </button>
  )
}