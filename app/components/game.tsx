import React from "react";
import Board from "./board";
import { createDeck } from "./card";
import type { CardInterface } from "./card";

interface gameState {
  currentCards: Array<CardInterface>,
  deck: Array<CardInterface>,
  activeCards: Array<CardInterface>
}

export default class Game extends React.Component<{}, gameState> {
  constructor(props:any) {
    super(props);

    this.state = {
      currentCards: [],
      deck: createDeck(),
      activeCards: [],
    };
  }

  componentDidMount() {
    this.setState((state) => {
      let shuffled = shuffleDeck(state.deck);
      let current = shuffled.splice(0,12);

      return {
        deck: shuffled,
        currentCards: current
      };
    })
  }

  render() {
    const current = this.state.currentCards;

    return (
      <div className="set-game">
        <Board cards={current} />
        <div className="test">
        </div>
      </div>
    );
  }
}

function shuffleDeck(deck: Array<CardInterface>): Array<CardInterface> {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
}