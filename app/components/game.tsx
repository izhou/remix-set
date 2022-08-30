import React from "react";

const numbers =[ 1, 2, 3] as const;
const shapes =[ "squiggle", "oval", "diamond"] as const;
const fills =[ "solid", "empty", "striped"] as const;
const colors =[ "r", "g", "b"] as const;

// type Panel = 'store' | 'logs'

// const object: Record<Panel, ReactChild> = {
//   store: StoreComponent,
//   logs: LogsComponent
// }

const svg:Record<typeof shapes[number], string> = {
  "squiggle": "m31 16c69-48 69 48 137 0 39-24 39 38 0 67-69 48-69-48-137 0-39 24-39-38 0-67",
  "oval": "m51 2a.98.96 0 000 96h98a.98.96 0 000-96H51",
  "diamond": "m2 50 98-48 98 48-98 48z"
}

interface Card {
  active?: boolean,
  number: typeof numbers[number];
  shape: typeof shapes[number];
  fill: typeof fills[number];
  color: typeof colors[number];
}

function ReactCard(props:Card) {
    let color =
    props.color == "r" ? `#cd5c5c`
      : props.color == "g" ? "#64a18d"
      : "#755B7B";

  const symbols = Array(props.number).fill(
    <div className="symbol">
      <svg color={color} viewBox="0 0 200 100">
        {/* Shape fill */}
        <path 
          d={svg[props.shape]}
          fill={ props.fill == "empty" ?  "none" : "currentcolor" }
          mask={ props.fill == "striped" ? "url(#mask-stripe)" : "none" }
            ></path>
        {/* Shape outline */}
        <path
          d={svg[props.shape]}
          fill="none"
          strokeWidth="4px"
          stroke="currentcolor"
        ></path>

        </svg>
    </div>
  )

  return (
    <button className="card-container">
      <div className="card">
        {symbols}
      </div>
    </button>
  )
}

type boardProps = {
  cards: Array<Card>
};

class Board extends React.Component<boardProps> {
  constructor(props: any) {
    super(props);
  }

  renderCard(props:Card) {
    return (
      <ReactCard active={false} number={props.number} shape={props.shape} fill={props.fill} color={props.color}/>
    )
  }



  render() {
    return(
      <div className="board">
        <svg>
          <defs>
            <pattern id="pattern-stripe"
              width="6" height="1"
              patternUnits="userSpaceOnUse"
            >
              <rect width="2" height="1"  fill="white"></rect>
            </pattern>
            <mask id="mask-stripe">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-stripe)" />
            </mask>
          </defs>

        </svg>

        <div class="cards">
          {this.props.cards.map((card) => this.renderCard(card))}
        </div>
      </div>
    )
  }
}

interface gameState {
  currentCards: Array<Card>,
  deck: Array<Card>,
  activeCards: Array<Card>
}

export default class Game extends React.Component<{}, gameState> {
  constructor(props:any) {
    super(props);

    let deck = createDeck();
    let currentCards = deck.splice(0, 12);

    this.state = {
      currentCards,
      deck: deck,
      activeCards: [],
    };
  }

  render() {
    const current = this.state.currentCards;

    return (
      <div className="set-game">
        <Board cards={current}/>
      </div>
    );
  }
}

function createDeck():Array<Card> {
  let deck = [];
  numbers.forEach(number => 
    shapes.forEach(shape => 
      fills.forEach(fill => 
        colors.forEach(color =>
          deck.push({
            number, shape, fill, color
          })
  ))));

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp:Card = deck[i];
    let temp2:Card = deck[j];
    deck[i] = temp2;
    deck[j] = temp;
  }

  return deck;
}