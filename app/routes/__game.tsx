import { LoaderFunction, LinksFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, Link } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import gameStylesUrl from "~/styles/game.css";
import { LoginHeader } from "~/components/loginHeader";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: gameStylesUrl }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  let user = await getUser(request);

  return json({ user });
};

export default function PlayRoute() {
  const { user } = useLoaderData();

  return (
    <>
      <LoginHeader username={user?.username} />

      <div className="grid-footer-left">
        <Link to="/">{`< Home`}</Link>
      </div>

      <Outlet />
    </>
  );
}
