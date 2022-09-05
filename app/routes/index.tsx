import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";

import stylesUrl from "~/styles/index.css";

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  return json({user});
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function IndexRoute() {
  const { user } = useLoaderData();
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Set</span>
        </h1>
        <div>{user && `Welcome ${user.username}`}</div>
        <nav>
          <ul>
            <li>
              <Link to="game">Instructions</Link>
              <Link to="game">Standard Game</Link>
              <Link to="daily">Daily Puzzle</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}