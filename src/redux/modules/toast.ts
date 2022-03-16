import { ThunkDispatch } from "redux-thunk";
import { DispatcherProps } from "../types";
import { Auth } from "..";
import axios from "axios";
import checkIcon from "../../assets/check.svg";
import errorIcon from "../../assets/error.svg";
import infoIcon from "../../assets/info.svg";
import warningIcon from "../../assets/warning.svg";

/**
 * Type declarations
 * ---------------------------------------------------------------------
 */

export interface IToastList {
  id: number;
  backgroundColor?: string;
  title?: string;
  description?: string;
  icon?: string;
}

export interface IToast {
  toastList: IToastList[];
  position: string;
  autoDelete: boolean;
  dismissTime: number;
}

export interface StateProps {
  loading: number;
  toast: IToast;
}

/**
 * Initial State
 * ---------------------------------------------------------------------
 */

export const initialState: StateProps = {
  loading: 0,
  toast: {
    toastList: [],
    position: "top-right",
    autoDelete: true,
    dismissTime: 3000,
  },
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

export const addToast =
  (
    authToken: Auth.StateProps["authToken"],
    clientGroupId: string,
    toastType: string,
    title: string,
    description: string
  ) =>
  async (
    dispatch: ThunkDispatch<StateProps, void, DispatcherProps<StateProps>>
  ): Promise<void> => {
    dispatch({
      type: Action.DATA_LOADING,
    });

    let toast = initialState.toast;

    dispatch({
      type: Action.DATA_LOAD,
      payload: {
        toast: {
          ...toast,
          toastList: [
            ...toast.toastList,
            ...showToast(toastType, title, description),
          ],
        },
      },
    });

    dispatch({
      type: Action.DATA_LOADED,
    });
  };

const showToast = (
  toastType: string,
  title: string,
  description: string
): IToastList[] => {
  const id = Math.floor(Math.random() * 101 + 1);
  let toastProperties;
  switch (toastType) {
    case "success":
      toastProperties = {
        id,
        title,
        description,
        backgroundColor: "#5cb85c",
        icon: checkIcon,
      };
      break;
    case "danger":
      toastProperties = {
        id,
        title,
        description,
        backgroundColor: "#d9534f",
        icon: errorIcon,
      };
      break;
    case "info":
      toastProperties = {
        id,
        title,
        description,
        backgroundColor: "#5bc0de",
        icon: infoIcon,
      };
      break;
    case "warning":
      toastProperties = {
        id,
        title,
        description,
        backgroundColor: "#f0ad4e",
        icon: warningIcon,
      };
      break;

    default:
      return [];
  }

  return [toastProperties];
};
