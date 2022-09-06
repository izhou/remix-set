import React from "react";
import Game from "./game";
import Table from "./table";
import { findSets } from "~/utils/cards"
import { CardData, PuzzleGameState } from "../utils/types";

type PuzzleGameProps = {
  currentCards: Array<CardData>
  history: Array<string>
  updateHistory: Function
}

export default class PuzzleGame extends React.Component<PuzzleGameProps, PuzzleGameState> {
  constructor(props: PuzzleGameProps) {
    super(props)

    this.state = {
      isEnded: false,
      numSolutions: findSets(this.props.currentCards).length,
    };
  }

  handleValidSet(activeCards: Array<CardData>, activeCardsIndex: Array<number>) {
    // Hack for easy string comparison for uniqueness
    let formattedIndex = JSON.stringify(activeCardsIndex.sort());

    if (this.props.history.includes(formattedIndex)) {
      return this.showError(`This set has already been found.`);
    }

    this.props.updateHistory(formattedIndex);
  }

  maybeEndGame() {
    // We have found all the possible sets
    (this.state.numSolutions == this.props.history.length) && this.setState({isEnded: true});
  }

  buildTableEntries():Array<[CardData,CardData,CardData]> {
    let currentCards = this.props.currentCards;
    return this.props.history.map((cardIndexes:string) => {
      let indexes = JSON.parse(cardIndexes);
      return indexes.map((index:number)=> currentCards[index]);
    });
  }

  showError(message: string) {
    this.setState({ errorMessage: message }, () => {
      let errorTimeout = setTimeout(() => {
        this.setState({ errorMessage: undefined });
        clearTimeout(errorTimeout);
      }, 3000);
    });
  }

  render() {
    return (
      <>
        <Game
          currentCards={this.props.currentCards}
          handleValidSet={(activeCards: Array<CardData>, activeCardsIndex: Array<number>) => this.handleValidSet(activeCards, activeCardsIndex)}
          isEnded={this.state.isEnded}
          showError={(message: string) => this.showError(message)}
          errorMessage={this.state.errorMessage}
        />

        <Table entries={this.buildTableEntries()} length={this.state.numSolutions} title="Solutions" />
      </>
    )
  }
}