import React from "react";
import Game from "./game";
import { findSets, shuffleCards, createCompleteDeck } from "./game"
import { CardData, PuzzleGameState } from "./types.d";

type PuzzleGameProps = {
  currentCards: Array<CardData>
}
export default class PuzzleGame extends React.Component<PuzzleGameProps, PuzzleGameState> {
  constructor(props: any) {
    super(props);

    this.state = {
      // currentCards: [],
      isEnded: false,
      solutions: [],
      solutionIndexes: [],
    };
  }

  componentDidMount() {
    this.setState(() => {
      let solutions = findSets(this.props.currentCards);

      return {
        solutions: Array(solutions.length).fill(null),
      };
    });
  }

  handleValidSet(activeCards: Array<CardData>, activeCardsIndex: Array<number>) {
    // Hack for easy string comparison for uniqueness
    let formattedIndex = JSON.stringify(activeCardsIndex.sort());
    let solutions= this.state.solutions;
    let solutionIndexes = this.state.solutionIndexes;


    if (solutionIndexes.includes(formattedIndex)) {
      return this.showError(`This set has already been found.`);
    }

    // Add found set to table, remove an empty row
    solutions.unshift(activeCards);
    solutions.pop();

    this.setState({
      solutionIndexes: [formattedIndex].concat(solutionIndexes),
      solutions
    }, this.maybeEndGame);
  }

  maybeEndGame() {
    // We have found all the possible sets
    (this.state.solutionIndexes.length == this.state.solutions.length) && this.setState({isEnded: true});
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
        tableEntries={this.state.solutions}
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