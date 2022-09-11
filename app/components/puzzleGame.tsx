import React from "react";
import Game from "./game";
import Table from "./table";
import { findSets } from "~/utils/cards";
import { CardData, Set, SetIndex } from "../utils/types";

type PuzzleGameState = {
  numSolutions: number;
  errorMessage?: string;
  isEnded: boolean;
  time?: number;
};

type PuzzleGameProps = {
  currentCards: Array<CardData>;
  foundSets: Array<SetIndex>;
  updateHistory: Function;
  deleteHistory: Function;
};

export default class PuzzleGame extends React.Component<
  PuzzleGameProps,
  PuzzleGameState
> {
  constructor(props: PuzzleGameProps) {
    super(props);

    let numSolutions = findSets(this.props.currentCards).length;
    let isEnded = this.props.foundSets.length == numSolutions;

    this.state = {
      numSolutions,
      isEnded,
    };
  }

  handleValidSet(activeCards: Set, activeCardsIndex: SetIndex) {
    let sortedIndex = activeCardsIndex.sort();
    let foundSets = [...this.props.foundSets];

    let stringified = JSON.stringify(sortedIndex);
    for (const setIndex of foundSets) {
      if (JSON.stringify(setIndex) == stringified)
        return this.showError(`This set has already been found.`);
    }

    foundSets.push(sortedIndex);

    let isEnded = foundSets.length == this.state.numSolutions;
    this.setState({ isEnded });

    this.props.updateHistory(foundSets);
  }

  buildTableEntries(): Array<Set> {
    let currentCards = this.props.currentCards;
    return this.props.foundSets.map((indexes) => {
      return indexes.map((index) => currentCards[index]) as Set;
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

  deleteHistory() {
    this.setState({
      isEnded: false,
    });

    this.props.deleteHistory();
  }

  render() {
    return (
      <>
        <div className="grid-main-left">
          <p>Find all possible sets in the below 12 cards.</p>
          <Game
            currentCards={this.props.currentCards}
            handleValidSet={(activeCards: Set, activeCardsIndex: SetIndex) =>
              this.handleValidSet(activeCards, activeCardsIndex)
            }
            showError={(message: string) => this.showError(message)}
            errorMessage={this.state.errorMessage}
            isEnded={this.state.isEnded}
          />
        </div>

        <div className="grid-main-right">
          <Table
            entries={this.buildTableEntries()}
            length={this.state.numSolutions}
            title="Solutions"
          />
          {!!this.props.foundSets.length && (
            <p>
              <button
                onClick={() => {
                  this.deleteHistory();
                }}>
                Restart
              </button>
            </p>
          )}
        </div>

        {this.state.isEnded && (
          <div className="modal end-modal">
            <div></div>
            <div>
              <h1>Congratulations!</h1>
              <p>You've found all the possible sets.</p>
            </div>
            <p>
              <button
                onClick={() => {
                  this.deleteHistory();
                }}>
                Restart
              </button>
            </p>
          </div>
        )}
      </>
    );
  }
}
