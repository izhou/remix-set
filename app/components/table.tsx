import React from "react";
import Card from "./card";
import { CardData } from "./types.d";

type TableProps = {
  sets: Array<Array<CardData | null>>
  title: string
};

export default function Table(props: TableProps) {
  return (
    <div className="table">
      <h1 className="table--title">{props.title}</h1>

      {props.sets.map((set) =>
        <div className="table--row">
          {set.map((card) => card && <Card data={card} />)}
        </div>
      )}
    </div>
  )
}
