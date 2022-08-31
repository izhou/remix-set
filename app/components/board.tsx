import React from "react";
import Card from "./card";
import type { CardData } from "./types.d";

type boardProps = {
  cards: Array<CardData>,
  activeCardsIndex: Array<number>
  onClick: Function
};

export default class Board extends React.Component<boardProps> {
  constructor(props: any) {
    super(props);
  }

  renderCard(card: CardData, index: number) {
    let isActive = this.props.activeCardsIndex.includes(index);

    return (
      <Card
        data={card}
        key={index}
        onClick={() => this.props.onClick(index)}
        isActive={isActive}
        />
    )
  }

  render() {
    return (
      <div className="board">
        <svg height="0px">
          <defs>
            <pattern id="pattern-stripe"
              width="6" height="1"
              patternUnits="userSpaceOnUse"
            >
              <rect width="2" height="1" fill="white"></rect>
            </pattern>
            <mask id="mask-stripe">
              <rect x="0" y="0" width="200" height="100" fill="url(#pattern-stripe)" />
            </mask>
          </defs>
        </svg>

        <div className="cards">
          {this.props.cards.map((card, index) => this.renderCard(card, index))}
        </div>
      </div>
    )
  }
}