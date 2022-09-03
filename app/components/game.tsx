import React from "react";
import Board from "./board";
import Table from "./table";
import { CardNumbers, CardShapes, CardFills, CardColors, CardData } from "./types.d";

type GameState = {
  activeCardsIndex: Array<number>,
};

type GameProps = {
  currentCards: Array<CardData | null>,
  handleValidSet: Function
  tableEntries: Array<Array<CardData>|null>,
  isEnded: boolean,
  showError: Function,
  errorMessage?: string,
};

export default class Game extends React.Component<GameProps, GameState> {
  constructor(props: any) {
    super(props);

    this.state = {
      activeCardsIndex: [],
    }
  }

  handleInvalidSet() {
    this.props.showError(`Sorry, that was an invalid set`);
    return this.setState({
      activeCardsIndex: [],
    });
  };

  handleClick(index:number) {
    if (this.props.isEnded) return;

    let activeCardsIndex = this.state.activeCardsIndex;

    // Toggle active card on or off.
    activeCardsIndex = activeCardsIndex.includes(index)
      ? activeCardsIndex.filter((i) => i !== index)
      : activeCardsIndex.concat([index]);

    // Detect current active cards
    let activeCards: Array<CardData> = [];
    activeCardsIndex.forEach((index) => {
      let card = this.props.currentCards[index];
      if (card !== null) activeCards.push(card);
    });

    // There are not three active cards yet, set active card state and continue.
    if (activeCards.length !== 3) return this.setState({ activeCardsIndex });

    // There are three cards that are not a set 
    if (!validateSet(activeCards)) return this.handleInvalidSet();

    return this.setState({
      activeCardsIndex: []
    }, this.props.handleValidSet(activeCards, activeCardsIndex));
  }

  render() {
    return (
      <div className="set-game">
        <div className="set-game--left">
          <Board
            cards={this.props.currentCards}
            activeCardsIndex={this.state.activeCardsIndex}
            onClick={(i: number) => { this.handleClick(i) }}
          />
          <div className="messages">
            {this.props.errorMessage}
          </div>
        </div>
        <Table entries={this.props.tableEntries} title="Found Sets" />
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

function allSameOrUnique(trait: Array<string>|Array<number>): boolean {
  return (trait[0] == trait[1]) 
    ? trait[0] == trait[2]
    : (trait[0] !== trait[2]) && (trait[1] !== trait[2]);
}

export function validateSet(cards: Array<CardData>): boolean {
  return cards.length == 3 
    && allSameOrUnique([cards[0].number, cards[1].number, cards[2].number])
    && allSameOrUnique([cards[0].color, cards[1].color, cards[2].color])
    && allSameOrUnique([cards[0].fill, cards[1].fill, cards[2].fill])
    && allSameOrUnique([cards[0].shape, cards[1].shape, cards[2].shape]); 
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
            filteredCards.splice(k,1)
            filteredCards.splice(j,1)
            filteredCards.splice(i,1);
            continue parentLoop;
          }

          // Because there is only one distinct soln to 2 cards
          break;
        }
      }
    }
  }

  return sets;
}