import React from "react";
import Header from "../header/Header";

type LayoutProps = {
  children: React.ReactElement;
};

const Layout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <div className="container">
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
