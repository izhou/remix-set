import React from "react";
import Game from "./game";
import {createCompleteDeck, shuffleCards, findSets} from "./game";
import {CardData, StandardGameState } from "./types.d"

export default class StandardGame extends React.Component<{}, StandardGameState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentCards: [],
      deck: createCompleteDeck(),
      history: [],
      isEnded: false
    };
  }

  componentDidMount() {
    this.setState((state) => {
      let shuffled = shuffleCards(state.deck);
      let currentCards = shuffled.splice(0, 12);

      return {
        deck: shuffled,
        currentCards
      };
    });
  }

  handleValidSet(activeCards: Array<CardData>, activeCardsIndex: Array<number>) {
    let deck = this.state.deck;
    let currentCards = this.state.currentCards;
    let history = this.state.history;

    history.push(activeCards);

    activeCardsIndex.forEach((index) => {
      let card = currentCards.length > 12 ? currentCards.pop() : deck.pop();
      currentCards[index] = card || null;
    });

    this.setState({
      currentCards,
      deck,
      history,
    }, this.maybeEndGame);
  }

  maybeEndGame() {
    // Deck still exists, not in end game
    if (this.state.deck.length) return;

    let sets = findSets(this.state.currentCards);
    if (sets.length) return;

    // No more sets! Game has ended.
    this.setState({
      isEnded: true
    });
  }

  render() {
    return (
      <Game
        currentCards={this.state.currentCards}
        handleValidSet={(activeCards: Array<CardData>, activeCardsIndex: Array<number>) => this.handleValidSet(activeCards, activeCardsIndex)}
        history={this.state.history}
        isEnded={this.state.isEnded}
      />
    )
  }
}