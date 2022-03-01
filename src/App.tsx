import React from "react";
import { StoreProvider } from "./redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./components/layout/Layout";

const App = (): React.ReactElement => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {routes.map((r, i) => {
              return (
                <Route key={i + "page-route"} path={r.path} element={r.page} />
              );
            })}
          </Routes>
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
