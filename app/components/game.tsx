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

  componentDidUpdate() {
    console.log(this.state);
  }

  handleClick(index:number) {
    let activeCardsIndex = this.state.activeCardsIndex;
    let updatedActiveCardsIndex = activeCardsIndex.includes(index) 
      ? activeCardsIndex.filter((i) => i !== index)
      : activeCardsIndex.concat([index]);

    if (updatedActiveCardsIndex.length == 3) {
      let cards = updatedActiveCardsIndex.map((index) => this.state.currentCards[index]);

      let winner = checkIfSet(cards[0],cards[1],cards[2]);

      if (winner) {
        let deck = this.state.deck;
        let currentCards = this.state.currentCards;
        updatedActiveCardsIndex.forEach((index) => {
          let card = deck.pop();
          if (card) currentCards[index] = card;       
        });

        this.setState({
          currentCards,
          deck,
          activeCardsIndex: []
        });  
      } else {
        this.setState({
          activeCardsIndex:[]
        });
      }
    } else {
      this.setState({
        activeCardsIndex: updatedActiveCardsIndex
      })
    }
  }

  render() {
    return (
      <div className="set-game">
        <Board 
          cards={this.state.currentCards}
          activeCardsIndex={this.state.activeCardsIndex}
          onClick={(i:number) =>{this.handleClick(i)}}
        />
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