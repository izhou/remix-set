import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Set</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="game">Instructions</Link>
              <Link to="game">Zen Mode</Link>
              <Link to="game">Daily</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}