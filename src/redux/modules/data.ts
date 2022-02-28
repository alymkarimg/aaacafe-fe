import { ThunkDispatch } from "redux-thunk";
import { DispatcherProps } from "../types";
import { Auth } from "..";
import axios from "axios";

/**
 * Type declarations
 * ---------------------------------------------------------------------
 */

export interface IData {
  name: string;
  //other props
}

export interface StateProps {
  loading: number;
  error: string | null;
  data: IData[];
}

/**
 * Initial State
 * ---------------------------------------------------------------------
 */

export const initialState: StateProps = {
  loading: 0,
  error: null,
  data: [],
};

/**
 * Action types
 * ---------------------------------------------------------------------
 */

enum Action {
  DATA_RESET = "data/reset",
  DATA_LOADING = "data/loading",
  DATA_LOAD = "data/load",
  DATA_LOADED = "data/loaded",
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
    case Action.DATA_RESET: {
      return initialState;
    }
    case Action.DATA_LOADING: {
      return {
        ...state,
        loading: state.loading + 1,
      };
    }
    case Action.DATA_LOADED: {
      return {
        ...state,
        loading: state.loading - 1,
      };
    }
    case Action.DATA_LOAD: {
      return {
        ...state,
        ...action.payload,
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

export const resetDataAction =
  () =>
  (
    dispatch: ThunkDispatch<StateProps, void, DispatcherProps<StateProps>>
  ): void => {
    dispatch({
      type: Action.DATA_RESET,
    });
  };

export const loadDataAction =
  (authToken: Auth.StateProps["authToken"], clientGroupId: string) =>
  async (
    dispatch: ThunkDispatch<StateProps, void, DispatcherProps<StateProps>>
  ): Promise<void> => {
    dispatch({
      type: Action.DATA_LOADING,
    });

    let error = initialState.error;
    let data = initialState.data;

    try {
      await (async function load(): Promise<void> {
        //set the api configs in services file and pass auth token for auth as header in that file
        const res = await axios.get<IData[]>("/someurl");
        data = res.data;
      })();
    } catch (e) {
      error = (e as Error).message;
    }

    dispatch({
      type: Action.DATA_LOAD,
      payload: {
        error,
        data,
      },
    });

    dispatch({
      type: Action.DATA_LOADED,
    });
  };
