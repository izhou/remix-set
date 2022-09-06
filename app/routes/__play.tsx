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
      <div className="grid-header-right">
        {data.user
          ? <>
            <div>Hello <strong>{data.user.username}</strong></div>
            <form action="/logout" method="post">
              <button type="submit">
                Sign Out
              </button>
            </form>
          </>
          : <Link to="/login">Sign in to save progress</Link>
        }
      </div>
      <Outlet />
    </div>
  );
}