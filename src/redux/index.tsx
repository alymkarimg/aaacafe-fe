/**
 * Root / entry for state handling
 */

import React from "react";

// Redux
import { createStore, combineReducers, applyMiddleware } from "redux";

// Providers
import { Provider } from "react-redux";

// Middlewares
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";

// Data modules
import { initialState } from "./initial-state";
import * as Auth from "./modules/auth";
import * as Data from "./modules/data";

/**
 * Combines reducers from all modules
 */

const rootReducer = combineReducers({
  auth: Auth.reducer,
  data: Data.reducer,
});

/**
 * Defines root state type from combined reducers
 */

export type State = ReturnType<typeof rootReducer>;

/**
 * Middlware array
 */

const middleware = [thunk];

/**
 * Initializes the store with combined reducers,
 * initial state, middleware and dev-tools browser extension plugin
 */

const Store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

/**
 * React component provider
 */

const StoreProvider = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => <Provider store={Store}>{children}</Provider>;

export { StoreProvider, Auth, Data };
