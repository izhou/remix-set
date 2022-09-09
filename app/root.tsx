import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* Generates SVG definitions needed to create stripey symbols */}
        <svg className="svg-defs">
          <defs>
            <pattern
              id="pattern-stripe"
              width="6"
              height="1"
              patternUnits="userSpaceOnUse">
              <rect width="2" height="1" fill="white"></rect>
            </pattern>
            <mask id="mask-stripe">
              <rect
                x="0"
                y="0"
                width="200"
                height="100"
                fill="url(#pattern-stripe)"
              />
            </mask>
          </defs>
        </svg>
        <div className="grid-container">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
