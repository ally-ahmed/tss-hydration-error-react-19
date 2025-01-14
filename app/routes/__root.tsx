import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";
import globalStyle from "@/styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      // {
      //   rel: "stylesheet",
      //   href: "https://fonts.googleapis.com/css?family=Mukta:300,400,600,700,800&display=swap",
      // },
      {
        rel: "preload",
        href: "/fonts/CalSans-SemiBold.ttf",
        as: "font",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: globalStyle,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
