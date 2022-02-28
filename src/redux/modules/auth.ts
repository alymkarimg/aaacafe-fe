/**
 * Defines redux state handling for documents
 */
import { Dispatcher } from "../types";

/**
 * Type declarations
 * ---------------------------------------------------------------------
 */
export interface StateProps {
  authToken: string | undefined;
  refreshes: number;
}

/**
 * Initial State
 * ---------------------------------------------------------------------
 */

export const initialState: StateProps = {
  authToken: undefined,
  refreshes: 0,
};

/**
 * Action types
 * ---------------------------------------------------------------------
 */

enum Action {
  AUTH_RESET = "auth/reset",
  AUTH_SET_TOKEN = "auth/set-token",
}

interface ActionProps {
  type: Action;
  payload?: StateProps;
}

/**
 * Reducer
 * ---------------------------------------------------------------------
 */

export const reducer = (
  state: StateProps = initialState,
  action: ActionProps
): StateProps => {
  switch (action.type) {
    case Action.AUTH_RESET: {
      return initialState;
    }
    case Action.AUTH_SET_TOKEN: {
      return {
        ...state,
        authToken: action.payload?.authToken,
        refreshes: state.refreshes + 1,
      };
    }
    default: {
      return state;
    }
  }
};

/**
 * Actions
 * ---------------------------------------------------------------------
 */

/**
 * Reset all properties
 * @param dispatch
 */
export const reset = (dispatch: Dispatcher<StateProps>): void => {
  dispatch({
    type: Action.AUTH_RESET,
  });
};

/**
 * Refresh session / validity state
 * @param dispatch
 */
export const setToken = (
  dispatch: Dispatcher<StateProps>,
  authToken: StateProps["authToken"]
): void => {
  dispatch({
    type: Action.AUTH_SET_TOKEN,
    payload: {
      authToken,
    },
  });
};
