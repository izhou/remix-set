import React from "react";
import Card from "./card";
import { Set } from "../utils/types";

type TableProps = {
  entries: Array<Set>,
  length ?: number,
  title: string

};

export default function Table(props: TableProps) {
  let entries = props.entries;
  let numEmpty = props.length ? props.length - props.entries.length : 0;

  if (numEmpty >= 0) entries = entries.concat(Array(numEmpty).fill([null, null, null]));

  return (
    entries.length ? <>
      <strong className="table--title grid-header-right"><p>{props.title}</p></strong>
      <div className="grid-main-right table-container">
        <div className="table">
          {entries.map((entry, index) => (
            <div className="table--row" key={index}>
              {entry.map((card, i) => <Card data={card} key={i} />)}
            </div>
          ))}
          <div className="table--row"></div>
        </div>
      </div>
    </> : <></>
  )
}