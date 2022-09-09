import React from "react";
import Game from "./game";
import Table from "./table";
import { findSets } from "~/utils/cards";
import { CardData, Set, SetIndex } from "../utils/types";

type PuzzleGameState = {
  numSolutions: number;
  errorMessage?: string;
  history: Array<SetIndex>;
  isEnded: boolean;
  time?: number;
};

type PuzzleGameProps = {
  currentCards: Array<CardData>;
  history: Array<SetIndex>;
  updateHistory?: Function;
  deleteHistory?: Function;
};

export default class PuzzleGame extends React.Component<
  PuzzleGameProps,
  PuzzleGameState
> {
  constructor(props: PuzzleGameProps) {
    super(props);

    let numSolutions = findSets(this.props.currentCards).length;
    let history = [...this.props.history];
    let isEnded = history.length == numSolutions;

    this.state = {
      numSolutions,
      history,
      isEnded,
    };
  }

  handleValidSet(activeCards: Set, activeCardsIndex: SetIndex) {
    let sortedIndex = activeCardsIndex.sort();
    let history = [...this.state.history];

    let stringified = JSON.stringify(sortedIndex);
    history.forEach((setIndex) => {
      // Hack for easy string comparison for uniqueness
      if (JSON.stringify(setIndex) == stringified)
        return this.showError(`This set has already been found.`);
    });

    history.push(sortedIndex);

    let isEnded = history.length == this.state.numSolutions;
    this.setState({ history, isEnded });

    if (this.props.updateHistory)
      this.props.updateHistory(JSON.stringify(sortedIndex));
  }

  buildTableEntries(): Array<Set> {
    let currentCards = this.props.currentCards;
    return this.state.history.map((indexes) => {
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
      history: [],
      isEnded: false,
    });

    if (this.props.deleteHistory) this.props.deleteHistory();
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
          {!!this.state.history.length && (
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
