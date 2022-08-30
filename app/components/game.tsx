import React from "react";

const numbers =[ 1, 2, 3] as const;
const shapes =[ "squiggle", "oval", "diamond"] as const;
const fills =[ "solid", "empty", "striped"] as const;
const colors =[ "r", "g", "b"] as const;

const svgMap:Record<typeof shapes[number], string> = {
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

  const symbols = Array.from(Array(props.number), (_,i) => 
    <div className="symbol" key={i}>
      <svg color={color} viewBox="0 0 200 100">
        {/* Shape fill */}
        <path 
          d={svgMap[props.shape]}
          fill={ props.fill == "empty" ?  "none" : "currentcolor" }
          mask={ props.fill == "striped" ? "url(#mask-stripe)" : "none" }
            ></path>
        {/* Shape outline */}
        <path
          d={svgMap[props.shape]}
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

  renderCard(card:Card, boardIndex:number) {
    return (
      <ReactCard active={false} number={card.number} shape={card.shape} fill={card.fill} color={card.color} key={boardIndex}/>
    )
  }

  render() {
    return(
      <div className="board">
        <svg height="0px">
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

        <div className="cards">
          {this.props.cards.map((card, i) => this.renderCard(card, i))}
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

    this.state = {
      currentCards: [],
      deck: createDeck(),
      activeCards: [],
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

  render() {
    const current = this.state.currentCards;

    return (
      <div className="set-game">
        <Board cards={current} />
      </div>
    );
  }
}

function createDeck():Array<Card> {
  let deck:Array<Card> = [];
  numbers.forEach(number => 
    shapes.forEach(shape => 
      fills.forEach(fill => 
        colors.forEach(color =>
          deck.push({
            number, shape, fill, color
          })
  ))));

  return deck;
}

function shuffleDeck(deck:Array<Card>):Array<Card> {
  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp: Card = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
}