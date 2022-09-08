import React from "react";
import Game from "./game";
import Table from "./table";
import Timer from "./timer";
import {createCompleteDeck, shuffleCards, findSets} from "~/utils/cards";
import {Set, SetIndex, CardData } from "../utils/types"

type StandardGameState = {
  currentCards: Array<CardData | null>,
  deck: Array<CardData>,
  isEnded: boolean,
  sets: Array<Set>,
  errorMessage?: string,
  paused: boolean,
  time?: string,
}

const startState = () => ({
  currentCards: [],
  deck: createCompleteDeck(),
  sets: [],
  isEnded: false,
  errorMessage: undefined,
  paused: false
});

export default class StandardGame extends React.Component<{}, StandardGameState> {
  timerRef: React.RefObject<Timer>;

  constructor(props: any) {
    super(props);

    this.state = startState();
    this.timerRef = React.createRef<Timer>();
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
    let sets = this.state.sets;
    let newLength = Math.max(currentCards.length - 3, 12);

    sets.push(activeCards);

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
      sets,
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
      isEnded: true,
      time: this.timerRef.current?.getFormattedTime()
    });
  }

  startNewGame() {
    let state = startState();

    let shuffled = shuffleCards(state.deck);
    let currentCards = shuffled.splice(0, 12);

    return this.setState({
      ...state,
      deck: shuffled,
      currentCards,
    });
  }

  togglePause() {
    this.setState({
      paused: !this.state.paused
    });
  }

  render() {
    return (
      <>
        <div className="grid-main-left">
          <p>Clear the deck by finding as many sets as possible!</p>
          <Game
            currentCards={this.state.currentCards}
            handleValidSet={(activeCards: Set, activeCardsIndex: SetIndex) => this.handleValidSet(activeCards, activeCardsIndex)}
            isEnded={this.state.isEnded}
            showError={(message:string)=>{this.showError(message)}}
            errorMessage={this.state.errorMessage}
          />
          {this.state.deck.length > 0 &&
            <p className="add-more">Stuck? <button onClick={() => { this.addCards() }}>Add more cards</button></p>}
        </div>

        {this.state.paused && <div className="modal paused-modal"><h1>PAUSED</h1></div>}

        <div className="grid-footer-right">
          {!this.state.isEnded && <p className="pause"><button onClick={() => { this.togglePause() }}>{this.state.paused ? 'Unpause' : 'Pause'}</button></p>}
          <div>Time: <Timer paused={this.state.paused || this.state.isEnded} ref={this.timerRef} /></div>
          <div>Sets found: {this.state.sets.length}</div>
          <div>Cards left in deck: {this.state.deck.length}</div>
        </div>

        <div className="grid-main-right">
          <Table entries={this.state.sets} title="Found Sets" />
        </div>

        {this.state.isEnded &&
          <div className="modal end-modal">
            <div></div>
            <div>
              <h1>Congratulations!</h1>
              <p>You've found all the possible sets in {this.state.time}</p>
              <p>See how you did against others: </p>
              <button>Save time</button>
            </div>
            <p><button onClick={() => {this.startNewGame()}}>Play again</button></p>
          </div>
        }
      </>
    )
  }
}