import React from "react";
import Board from "./board";

import { CardData, Set } from "~/utils/types";
import { validateSet } from "~/utils/cards";

type GameState = {
  activeCardsIndex: Array<number>,
};

type GameProps = {
  currentCards: Array<CardData | null>,
  handleValidSet: Function
  isEnded: boolean,
  showError: Function,
  errorMessage?: string,
};

export default class Game extends React.Component<GameProps, GameState> {
  constructor(props: any) {
    super(props);

    this.state = {
      activeCardsIndex: [],
    }
  }

  handleInvalidSet() {
    this.props.showError(`Sorry, that was an invalid set`);
    return this.setState({
      activeCardsIndex: [],
    });
  };

  handleClick(index:number) {
    if (this.props.isEnded) return;

    let activeCardsIndex = this.state.activeCardsIndex;

    // Toggle active card on or off.
    activeCardsIndex = activeCardsIndex.includes(index)
      ? activeCardsIndex.filter((i) => i !== index)
      : activeCardsIndex.concat([index]);

    // Detect current active cards
    let activeCards: Array<CardData> = [];
    activeCardsIndex.forEach((index) => {
      let card = this.props.currentCards[index];
      if (card !== null) activeCards.push(card);
    });

    // There are not three active cards yet, set active card state and continue.
    if (activeCards.length !== 3) return this.setState({ activeCardsIndex });

    // There are three cards that are not a set 
    if (!validateSet(activeCards as Set )) return this.handleInvalidSet();

    return this.setState({
      activeCardsIndex: []
    }, this.props.handleValidSet(activeCards, activeCardsIndex));
  }

  render() {
    return (
        <Board
          cards={this.props.currentCards}
          activeCardsIndex={this.state.activeCardsIndex}
          onClick={(i: number) => { this.handleClick(i) }}
          errorMessage={this.props.errorMessage}
        />
    );
  }
}