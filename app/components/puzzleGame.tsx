import React from "react";
import Game from "./game";
import { findSets, shuffleCards, createCompleteDeck } from "./game"
import { CardData, GameState } from "./types.d";

interface PuzzleGameState extends GameState {
  solutionIndexes: Array<Array<number>>
}

class PuzzleGame extends React.Component<{}, PuzzleGameState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentCards: [],
      activeCardsIndex: [],
      deck: [],
      history: [],
      isEnded: false,
      solutionIndexes: [],
    };
  }

  componentDidMount() {
    this.setState(() => {
      let cards = chooseCards();
      let solutions = findSets(cards);

      return {
        currentCards: cards,
        history: Array(solutions.length).fill(null),
      };
    });
  }

  handleValidSet(activeCards: Array<CardData>, activeCardsIndex: Array<number>) {
    let sortedIndex = activeCardsIndex.sort();
    let history = this.state.history;
    let solutionIndexes = this.state.solutionIndexes;


    if (solutionIndexes.includes(sortedIndex)) {
      return {
        activeCardsIndex: [],
        errorMessage: `This set has already been found.`,
      }
    }

    this.setState({
      solutionIndexes: solutionIndexes.concat([sortedIndex]),
      history: [activeCards].concat(history),
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
    return (<div>
      <Game title="Daily Puzzle" />
    </div>)
  };
}

function chooseCards(): Array<CardData> {
  // Start with randomized deck
  let deck = shuffleCards(createCompleteDeck());

  // Hack: cuarantees that there are at least 4 solns to the daily puzzle
  let cards = findSets(deck, { numSets: 4, unique: true }).flat();
  console.log(cards);
  return shuffleCards(cards);
}