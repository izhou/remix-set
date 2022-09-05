import React from "react";
import Card from "./card";
import { CardData } from "~/utils/types";

type TableProps = {
  entries: Array<Array<CardData> | null>
  title: string
};

export default function Table(props: TableProps) {
  return (
    <div className="table">
      <h1 className="table--title">{props.title}</h1>

      {props.entries.map((entry, index) =>
        <div className="table--row" key={index}>
          {entry && entry.map((card, i) => <Card data={card} key={i}/>)}
        </div>
      )}
    </div>
  )
}
