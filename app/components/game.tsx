import React from "react";
import Board from "./board";
import Table from "./table";
import { CardNumbers, CardShapes, CardFills, CardColors, CardData, GameState } from "./types.d";

type GameProps = {
  title: string
}

export default class Game extends React.Component<GameProps, GameState> {
  constructor(props:GameProps) {
    super(props);

    this.state = {
      currentCards: [],
      deck: createCompleteDeck(),
      history: [],
      activeCardsIndex: [],
      isEnded: false
    };
  }

  componentDidMount() {
    this.setState((state) => {
      let shuffled = shuffleCards(state.deck);
      let currentCards = shuffled.splice(0,12);

      return {
        deck: shuffled,
        currentCards
      };
    });
  }


  componentDidUpdate() {
    // Clear error message after 10seconds
    if (this.state.errorMessage) {
      let errorMessageTimeout = setTimeout(() => {
        this.setState(() => {
          clearTimeout(errorMessageTimeout);
          return {errorMessage: undefined};
        });
      }, 1000)
    }
  }

  handleInvalidSet() {
    return this.setState({
      activeCardsIndex: [],
      errorMessage: `Sorry, this isn't a valid set.`,
    });
  }

  handleValidSet(activeCards: Array<CardData>, activeCardsIndex: Array<number>) {
    let deck = this.state.deck;
    let currentCards = this.state.currentCards;
    let history = this.state.history;

    history.push(activeCards);

    activeCardsIndex.forEach((index) => {
      let card = currentCards.length > 12 ? currentCards.pop() : deck.pop();
      currentCards[index] = card || null;
    });

    this.setState({
      currentCards,
      deck,
      history,
      activeCardsIndex: []
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

  handleClick(index: number) {
    if (this.state.isEnded) return;

    let activeCardsIndex = this.state.activeCardsIndex;

    // Toggle active card on or off.
    activeCardsIndex = activeCardsIndex.includes(index)
      ? activeCardsIndex.filter((i) => i !== index)
      : activeCardsIndex.concat([index]);

    // Detect current active cards
    let activeCards: Array<CardData> = [];
    activeCardsIndex.forEach((index) => {
      let card = this.state.currentCards[index];
      if (card !== null) activeCards.push(card);
    });

    // There are not three active cards yet, set active card state and continue.
    if (activeCards.length !== 3) return this.setState({activeCardsIndex});

    // There are three cards that are not a set 
    if (!validateSet(activeCards)) return this.handleInvalidSet();

    return this.handleValidSet(activeCards, activeCardsIndex);
  }

  render() {
    return (
      <div className="set-game">
        {/* <h1>{this.props.title}</h1> */}
        <Board 
          cards={this.state.currentCards}
          activeCardsIndex={this.state.activeCardsIndex}
          onClick={(i:number) =>{this.handleClick(i)}}
        />
        {this.state.errorMessage && <div className="error-message">{this.state.errorMessage}</div>}
        <Table sets={this.state.history} title="Found Sets"/>
      </div>
    );
  }
}

export function createCompleteDeck(): Array<CardData> {
  let deck: Array<CardData> = [];
  for (let number in CardNumbers) {
    if (!isNaN(parseInt(number))) continue;
    for (let shape in CardShapes) {
      for (let fill in CardFills) {
        for (let color in CardColors) {
          let card = {
            number: CardNumbers[number as keyof typeof CardNumbers],
            shape: CardShapes[shape as keyof typeof CardShapes],
            fill: CardFills[fill as keyof typeof CardFills],
            color: CardColors[color as keyof typeof CardColors]
          }
          deck.push(card);
        } 
      }
    }
  }
  return deck;
}

export function shuffleCards(cards: Array<CardData>): Array<CardData> {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }

  return cards;
}

export function validateSet(cards: Array<CardData>): boolean {
  return cards.length == 3 
    && (cards[0].number == cards[1].number) == (cards[0].number == cards[2].number)
    && (cards[0].shape == cards[1].shape) == (cards[0].shape == cards[2].shape)
    && (cards[0].fill == cards[1].fill) == (cards[0].fill == cards[2].fill)
    && (cards[0].color == cards[1].color) == (cards[0].color == cards[2].color);
}

export function findSets(cards: Array<CardData|null>, params: {numSets?:number, unique?: boolean} = {}): Array<Array<CardData>> {
  let sets: Array<Array<CardData>> = [];
  let filteredCards:Array<CardData> = [];

  cards.forEach((card) => {
    if (card !== null) filteredCards.push(card);
  });

  if (filteredCards.length < 3) return sets;

  parentLoop: for (let i = 0; i < filteredCards.length - 2; i++) {
    for (let j = i + 1; j < filteredCards.length - 1; j++) {
      for (let k = j + 1; k < filteredCards.length; k++) {
        // Set is found
        if (validateSet([filteredCards[i],filteredCards[j],filteredCards[k]])) {
          sets.push([filteredCards[i], filteredCards[j], filteredCards[k]]);

          // Return if we have desired number of sets
          if (params.numSets && sets.length == params.numSets) return sets;

          // If we only want unique sets, do not reuse cards at i, j, or k
          if (params.unique) {
            i = k + 1;
            continue parentLoop;
          }

          // Because there is only one distint soln to 2 cards
          continue;
        }
      }
    }
  }

  return sets;
}