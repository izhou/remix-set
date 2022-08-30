import React from "react";
import Card from "./card";
import type { CardInterface } from "./card";

type boardProps = {
  cards: Array<CardInterface>
};

export default class Board extends React.Component<boardProps> {
  constructor(props: any) {
    super(props);
  }

  renderCard(card: CardInterface, boardIndex: number) {
    return (
      <Card active={false} number={card.number} shape={card.shape} fill={card.fill} color={card.color} key={boardIndex} />
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
          {this.props.cards.map((card, i) => this.renderCard(card, i))}
        </div>
      </div>
    )
  }
}