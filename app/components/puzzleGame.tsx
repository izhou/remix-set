import React from "react";
import Game from "./game";
import { findSets, shuffleCards, createCompleteDeck } from "./game"
import { CardData, PuzzleGameState } from "./types.d";

export default class PuzzleGame extends React.Component<{}, PuzzleGameState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentCards: [],
      isEnded: false,
      tableEntries: [],
      solutionIndexes: [],
    };
  }

  componentDidMount() {
    this.setState(() => {
      let cards = chooseCards();
      let solutions = findSets(cards);
      console.log('solutions:' + solutions.length);

      return {
        currentCards: cards,
        tableEntries: Array(solutions.length).fill(null),
      };
    });
  }

  handleValidSet(activeCards: Array<CardData>, activeCardsIndex: Array<number>) {
    // Hack for easy string comparison for uniqueness
    let formattedIndex = JSON.stringify(activeCardsIndex.sort());
    let tableEntries= this.state.tableEntries;
    let solutionIndexes = this.state.solutionIndexes;


    if (solutionIndexes.includes(formattedIndex)) {
      return this.showError(`This set has already been found.`);
    }

    // Add found set to table, remove an empty row
    tableEntries.unshift(activeCards);
    tableEntries.pop();

    this.setState({
      solutionIndexes: [formattedIndex].concat(solutionIndexes),
      tableEntries
    }, this.maybeEndGame);
  }

  maybeEndGame() {
    // We have found all the possible sets
    (this.state.solutionIndexes.length == this.state.tableEntries.length) && this.setState({isEnded: true});
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
        currentCards={this.state.currentCards}
        handleValidSet={(activeCards: Array<CardData>, activeCardsIndex: Array<number>) => this.handleValidSet(activeCards, activeCardsIndex)}
        tableEntries={this.state.tableEntries}
        isEnded={this.state.isEnded}
        showError={(message: string) => this.showError(message)}
        errorMessage={this.state.errorMessage}
      />
    )
  }
}

function chooseCards(): Array<CardData> {
  // Start with randomized deck
  let deck = shuffleCards(createCompleteDeck());

  // Hack: guarantees that there are at least 4 solns to the daily puzzle
  let cards = findSets(deck, { numSets: 4, unique: true });
  return shuffleCards(cards.flat());
}