import React from "react";
import Card from "./card";
import type { CardData } from "../utils/types";

type boardProps = {
  cards: Array<CardData|null>,
  activeCardsIndex: Array<number>
  onClick: Function
  errorMessage ?: string
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
        <div className="cards">
          {this.props.cards.map((card, index) => 
            card ? this.renderCard(card, index): <div className="no-card" key={index}></div>
          )}
        </div>

        <div className="error-message">{this.props.errorMessage || <>&nbsp;</>}</div>
      </div>
    )
  }
}