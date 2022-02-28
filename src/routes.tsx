import React from "react";
import Data from "./pages/Data";
import Home from "./pages/Home";

export interface IRoute {
  title: string;
  path: string;
  page: React.ReactElement;
  exact?: boolean;
}

export const routes: IRoute[] = [
  {
    title: "home",
    path: "/",
    page: <Home />,
    exact: true,
  },
  {
    title: "data",
    path: "/data",
    page: <Data />,
    exact: true,
  },
];
