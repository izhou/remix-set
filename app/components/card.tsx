import React from "react";
import { CardData, CardFills } from "./types.d";
import {CardShapes} from "./types.d";

const svgMap: Record<CardShapes, string> = {
  [CardShapes.Squiggle]: "m31 16c69-48 69 48 137 0 39-24 39 38 0 67-69 48-69-48-137 0-39 24-39-38 0-67",
  [CardShapes.Oval]: "m51 2a.98.96 0 000 96h98a.98.96 0 000-96H51",
  [CardShapes.Diamond]: "m2 50 98-48 98 48-98 48z"
}

type cardProps = {
  data: CardData,
  onClick?: Function,
  isActive?: boolean
};

export default function Card(props: cardProps) {
  const symbols = Array.from(Array(props.data.number), (_, i) =>
    <div className={"symbol symbol--" + props.data.color} key={i}>
      <svg color="currentColor" viewBox="0 0 200 100">
        {/* Shape fill */}
        <path
          d={svgMap[props.data.shape]}
          fill={props.data.fill == CardFills.Empty ? "none" : "currentcolor"}
          mask={props.data.fill == CardFills.Striped ? "url(#mask-stripe)" : "none"}
        ></path>
        {/* Shape outline */}
        <path
          d={svgMap[props.data.shape]}
          fill="none"
          strokeWidth="4px"
          stroke="currentcolor"
        ></path>
      </svg>
    </div>
  )

  return (
    <button 
      className={`card-container ${props.isActive ? "card-container--active" : ""}`}
      onClick={() => {props.onClick && props.onClick()}}
    >
      <div className="card" card-data={JSON.stringify(props)}>
        {symbols}
      </div>
    </button>
  )
}