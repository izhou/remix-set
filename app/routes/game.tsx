import StandardGame from "~/components/standardGame" 
import { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/game.css";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function SetRoute() {
  return (
    // <> 
    //   <h1>Set: Standard Game</h1>
    //   <StandardGame />
    // </>
    <div className="grid-container">
      <h1 className="grid-header-left">Set: Standard Game</h1>
      {/* <div className="grid-header-right">
        {data.user
          ? <>
            <div>Hello ${data.user.username}</div>
            <div>Logout</div>
          </>
          : `Login`
        }
      </div> */}

      <StandardGame />
    </div>
  );
}