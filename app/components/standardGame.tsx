import React from "react";
import Game from "./game";
import Table from "./table";
import {createCompleteDeck, shuffleCards, findSets} from "~/utils/cards";
import {Set, SetIndex, StandardGameState } from "../utils/types"

export default class StandardGame extends React.Component<{}, StandardGameState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentCards: [],
      deck: createCompleteDeck(),
      tableEntries: [],
      isEnded: false,
      errorMessage: undefined,
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

  showError(message: string) {
    this.setState({errorMessage: message}, () => {
      let errorTimeout = setTimeout(() => {
        this.setState({errorMessage: undefined});
        clearTimeout(errorTimeout);
      }, 2500);
    });
  }

  handleValidSet(activeCards:Set, activeCardsIndex: [number,number,number]) {
    let deck = this.state.deck;
    let currentCards = this.state.currentCards;
    let tableEntries = this.state.tableEntries;
    let newLength = Math.max(currentCards.length - 3, 12);

    tableEntries.push(activeCards);

    if (newLength == currentCards.length) {
      activeCardsIndex.forEach((index) => {
        currentCards[index] = deck.pop() || null;
      });
    } else {
      let replaceIndexes = activeCardsIndex.filter((index) => index < newLength);

      for (var i = 0; i < 3; i++) {
        let lastIndex = currentCards.length - 1;
        let lastCard = currentCards[lastIndex];

        if (!activeCardsIndex.includes(lastIndex)) {
          let replaceIndex = replaceIndexes[replaceIndexes.length - 1];
          currentCards[replaceIndex] = lastCard;
          replaceIndexes.pop();
        }

        currentCards.pop();
      }
    }
    
    this.setState({
      currentCards,
      deck,
      tableEntries,
    }, this.maybeEndGame);
  }

  addCards() {
    let deck = this.state.deck;
    let currentCards = this.state.currentCards;

    if (currentCards.length >= 18) return this.showError(`There are already enough cards on the table!`);

    let newCards = deck.splice(0,3);
    if (!newCards.length) return this.showError(`Sorry, there are no more cards left!`);

    this.setState({
      deck,
      currentCards: currentCards.concat(newCards),
    })
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

  restart() {

  }
  render() {
    return (
      <>
        <div className="grid-main-left">
          <p>Find all possible sets in the below 12 cards.</p>
          <Game
            currentCards={this.state.currentCards}
            handleValidSet={(activeCards: Set, activeCardsIndex: SetIndex) => this.handleValidSet(activeCards, activeCardsIndex)}
            isEnded={this.state.isEnded}
            showError={(message:string)=>{this.showError(message)}}
            errorMessage={this.state.errorMessage}
          />
          {this.state.deck.length > 0 &&
            <p className="add-more">Stuck? <button onClick={() => { this.addCards() }}>Add more cards</button></p>
          }
        </div>

        <div className="grid-main-right">
          <Table entries={this.state.tableEntries} title="Found Sets" />
        </div>

      </>
    )
  }
}