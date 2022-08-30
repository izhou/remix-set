import React from "react";

type CardProps = {
  active: boolean,
  number: 1|2|3,
  shape: "squiggle"|"oval"|"diamond",
  fill: "solid"|"empty"|"striped",
  color: "r"|"g"|"b",
}

function Card(props:CardProps) {
    let color =
    props.color == "r" ? `#cd5c5c`
      : props.color == "g" ? "#64a18d"
      : "#755B7B";

  const symbols = Array(props.number).fill(
    <div className="symbol">
        <svg color={color} height="100px" width="200px">
          <path 
            d={
              (props.shape == "squiggle" && "m31 16c69-48 69 48 137 0 39-24 39 38 0 67-69 48-69-48-137 0-39 24-39-38 0-67")
            || (props.shape == "oval" && "m51 2a.98.96 0 000 96h98a.98.96 0 000-96H51")
              || "m2 50 98-48 98 48-98 48z"
            } fill={
              (props.fill == "striped" && "url(#pattern-striped)")
              || (props.fill == "solid" && "currentcolor")
              ||  "none"
            }
            stroke-width="4px"
            stroke="currentcolor"
              ></path>

        </svg>
    </div>
  )

  return (
    <button className="card_container">
      <div className="card">
        {symbols}
      </div>
    </button>
  )
}

// type BoardProps = {};

// class Board extends React.Component {

//   renderCard(props:CardProps) {
//     return (
//       <Card active={false} number={props.number} shape={props.shape} fill={props.fill} color={props.color}/>
//     )
//   }

//   render() {
//     return(
//       <div className="board">
//         <div className="board-row">
          
//         </div>
//       </div>
//     )
//   }
// }


export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div className="set-game">
        <svg>
          <defs>
            <pattern id="pattern-striped" patternUnits="userSpaceOnUse" width="4" height="2">
              <path d="M0 0V2"
                stroke="currentcolor"
                stroke-width="1px" />
            </pattern>
          </defs>
        </svg>
        
        <Card active={false} number={2} shape="squiggle" fill="solid" color="r"/>
        <Card active={false} number={3} shape="oval" fill="striped" color="g" />
        <Card active={false} number={1} shape="diamond" fill="empty" color="b" />
      </div>
    );
  }
}