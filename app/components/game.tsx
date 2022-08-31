import React from "react";
import Board from "./board";
import { CardNumbers, CardShapes, CardFills, CardColors, CardData } from "./types.d";

interface gameState {
  currentCards: Array<CardData>,
  deck: Array<CardData>,
  activeCardsIndex: Array<number>
}

export default class Game extends React.Component<{}, gameState> {
  constructor(props:any) {
    super(props);

    this.state = {
      currentCards: [],
      deck: createDeck(),
      activeCardsIndex: [],
    };
  }

  componentDidMount() {
    this.setState((state) => {
      let shuffled = shuffleDeck(state.deck);
      let current = shuffled.splice(0,12);

      return {
        deck: shuffled,
        currentCards: current
      };
    })
  }

  handleClick(i:number) {
    return;
  }

  render() {
    const current = this.state.currentCards;

    return (
      <div className="set-game">
        <Board cards={current} onClick={(i:number) =>{this.handleClick(i)}}/>
        <div className="test">
        </div>
      </div>
    );
  }
}

function createDeck(): Array<CardData> {
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

function shuffleDeck(deck: Array<CardData>): Array<CardData> {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
}

function checkIfSet(card1: CardData, card2: CardData, card3: CardData): boolean {
  return (card1.number == card2.number) == (card1.number == card3.number)
    && (card1.shape == card2.shape) == (card1.shape == card3.shape)
    && (card1.fill == card2.fill) == (card1.fill == card3.fill)
    && (card1.color == card2.color) == (card1.color == card3.color);
}