import React from "react";
import Card from "./card";
import type { CardData } from "../utils/types";

type boardProps = {
  cards: Array<CardData|null>,
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
      <div className="board grid-main-left">
        {/* Generates SVG definitions needed to create stripey symbols */}
        <svg className="svg-defs">
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
          {this.props.cards.map((card, index) => 
            card ? this.renderCard(card, index): <div className="no-card" key={index}></div>
          )}
        </div>
      </div>
    )
  }
}