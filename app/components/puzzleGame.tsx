import React from "react";
import Game from "./game";
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
      solutions: [],
      solutionIndexes: [],
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
    (this.state.solutionIndexes.length == this.state.solutions.length) && this.setState({isEnded: true});
  }

  buildTableEntries():Array<Array<CardData>|null> {
    let solutions = findSets(this.props.currentCards);
    let entries = Array(solutions.length).fill(null);

    this.props.history.forEach((cardIndexString, index) => {
      let indexes = JSON.parse(cardIndexString);
      entries[index] = indexes.map((index:number) => this.props.currentCards[index])
    })

    return entries;
  }

  showError(message: string) {
    this.setState({ errorMessage: message }, () => {
      let errorTimeout = setTimeout(() => {
        this.setState({ errorMessage: undefined });
        clearTimeout(errorTimeout);
      }, 2500);
    });
  }

  render() {
    return (
      <Game
        currentCards={this.props.currentCards}
        handleValidSet={(activeCards: Array<CardData>, activeCardsIndex: Array<number>) => this.handleValidSet(activeCards, activeCardsIndex)}
        tableEntries={this.buildTableEntries()}
        isEnded={this.state.isEnded}
        showError={(message: string) => this.showError(message)}
        errorMessage={this.state.errorMessage}
      />
    )
  }
}