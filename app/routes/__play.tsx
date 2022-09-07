import { User } from "@prisma/client";
import { LoaderFunction, LinksFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, Link } from "@remix-run/react";
import stylesUrl from "~/styles/game.css";
import { getUser } from "~/utils/auth.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

type LoaderData = {
  user?: User
}
export const loader: LoaderFunction = async ({ params, request }) => {
  let user = await getUser(request);

  return json({user});
}

export default function PlayRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="grid-container">
      <div className="grid-header-right login">
        {data.user
          ? <>
            <div>Hello <strong>{data.user.username}</strong></div>
            <p>
              <form action="/logout" method="post">
                <button type="submit">Sign Out</button>
              </form>
            </p>
          </>
          : <Link to="/login">Sign in to save progress</Link>
        }
      </div>

      <div className="grid-footer-left">
        <Link to="/">{`< Home`}</Link>
      </div>
      <Outlet />
    </div>
  );
}