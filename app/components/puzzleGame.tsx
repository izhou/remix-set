import React from "react";
import Game from "./game";
import Table from "./table";
import { findSets } from "~/utils/cards"
import { CardData, Set, PuzzleGameState } from "../utils/types";

type PuzzleGameProps = {
  currentCards: Array<CardData>
  history: Array<string>
  updateHistory?: Function
  deleteHistory?: Function
}

export default class PuzzleGame extends React.Component<PuzzleGameProps, PuzzleGameState> {
  constructor(props: PuzzleGameProps) {
    super(props)

    let numSolutions = findSets(this.props.currentCards).length;
    let history = this.props.history;
    let isEnded = history.length == numSolutions;

    this.state = {
      numSolutions,
      history,
      isEnded
    };
  }

  handleValidSet(activeCards: Array<CardData>, activeCardsIndex: Array<number>) {
    // Hack for easy string comparison for uniqueness
    let formattedIndex = JSON.stringify(activeCardsIndex.sort());
    let history = this.state.history;

    if (history.includes(formattedIndex)) {
      return this.showError(`This set has already been found.`);
    }

    history.push(formattedIndex);

    let isEnded = history.length == this.state.numSolutions
    this.setState({ history, isEnded });
    
    if (this.props.updateHistory) this.props.updateHistory(formattedIndex);
  }

  buildTableEntries():Array<Set> {
    let currentCards = this.props.currentCards;
    return this.state.history.map((cardIndexes:string) => {
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

  deleteHistory() {
    this.setState({
      history: [],
      isEnded: false
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
            handleValidSet={(activeCards: Array<CardData>, activeCardsIndex: Array<number>) => this.handleValidSet(activeCards, activeCardsIndex)}
            showError={(message: string) => this.showError(message)}
            errorMessage={this.state.errorMessage}
            isEnded={this.state.isEnded}
          />
        </div>

        <div className="grid-main-right">
          <Table entries={this.buildTableEntries()} length={this.state.numSolutions} title="Solutions" />
          {!!this.state.history.length && <p><button onClick={() => { this.deleteHistory() }}>Restart</button></p>}
        </div>

        {this.state.isEnded && 
          <div className="end-modal">
            <div></div>
            <div>
              <h1>Congratulations!</h1>
              <p>You've found all the possible sets.</p>
            </div>
            <p><button onClick={() => { this.deleteHistory() }}>Restart</button></p>
          </div>}
      </>
    )
  }
}