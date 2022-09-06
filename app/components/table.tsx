import React from "react";
import Card from "./card";
import { CardData } from "../utils/types";

type TableProps = {
  entries: Array<[CardData, CardData, CardData]>,
  length ?: number,
  title: string
};

export default function Table(props: TableProps) {
  let entries = props.entries;
  let numEmpty = props.length ? props.length - props.entries.length : 0;

  if (numEmpty >= 0) entries = entries.concat(Array(numEmpty).fill([null, null, null]));

  return (
    entries.length ? <div className="grid-main-right table-container">
      <strong className="table--title">{props.title}</strong>
      <div className="table">
        {entries.map((entry, index) => (
          <div className="table--row" key={index}>
            {entry.map((card, i) => <Card data={card} key={i} />)}
          </div>
        ))}
      </div>
    </div> : <></>
  )
}
