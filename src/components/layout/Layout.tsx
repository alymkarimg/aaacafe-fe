import React, { useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../redux";
import Header from "../header/Header";
import Toast from "../toast/Toast";

type LayoutProps = {
  children: React.ReactElement;
};

const Layout = ({ children }: LayoutProps): React.ReactElement => {
  const toast = useSelector((state: State) => state.toast).toast;

  return (
    <div className="container">
      <Header />
      <div>{children}</div>
      <Toast
        toastList={toast.toastList}
        position={toast.position}
        autoDelete={toast.autoDelete}
        dismissTime={toast.dismissTime}
      />
    </div>
  );
};

export default Layout;
