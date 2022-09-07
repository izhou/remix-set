import { CardData, CardFills } from "../utils/types";
import {CardShapes} from "../utils/types";

const svgMap: Record<CardShapes, string> = {
  [CardShapes.Squiggle]: "m32.5 18c70-46.5 68 46.5 134.5 0 38-23 38 37 0 65-70 46.5-68-46.5-134.5 0-38 23-38-37 0-65",
  [CardShapes.Oval]: "m52 4a.96.92 0 000 92h96a.96.92 0 000-92H52",
  [CardShapes.Diamond]: "m2 50 96-46 96 46-96 46z"
}

type cardProps = {
  data?: CardData,
  onClick?: Function,
  isActive?: boolean
};

export default function Card(props: cardProps) {
  let symbols;
  if (props.data) {
    let data = props.data;
    symbols = Array.from(Array(data.number), (_, i) =>
      <div className={"symbol symbol--" + data.color} key={i}>
        <svg color="currentColor" viewBox="0 0 200 100">
          {/* Shape fill */}
          <path
            d={svgMap[data.shape]}
            fill={data.fill == CardFills.Empty ? "none" : "currentcolor"}
            mask={data.fill == CardFills.Striped ? "url(#mask-stripe)" : "none"}
          ></path>
          {/* Shape outline */}
          <path
            d={svgMap[data.shape]}
            fill="none"
            strokeWidth="6px"
            stroke="currentcolor"
          ></path>
        </svg>
      </div>
    )
  }

  return (
    <button 
      className={`card-container ${props.isActive ? "card-container--active" : ''}`}
      onClick={() => {props.onClick && props.onClick()}}
    >
      <div className="card" card-data={JSON.stringify(props)}>
        {symbols}
      </div>
    </button>
  )
}