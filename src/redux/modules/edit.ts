import { ThunkDispatch } from "redux-thunk";
import { DispatcherProps } from "../types";
import { Auth } from "..";
import axios from "axios";

/**
 * Type declarations
 * ---------------------------------------------------------------------
 */

export interface StateProps {
  loading: number;
  error: string | null;
  edit: boolean;
  editableAreas: IEditableArea[];
  animatedBanners: IAnimatedBanner[];
}

export interface IEditableArea {
  pathname: string;
  guid: string;
  data: string;
  //other props
}

export interface IAnimatedBannerItem {
  media?: string;
  //other props
}

export interface IAnimatedBanner {
  pathname: string;
  guid: string;
  autoplay: number;
  slidesPerPage: number;
  items: IAnimatedBannerItem[];
  //other props
}

/**
 * Initial State
 * ---------------------------------------------------------------------
 */

export const initialState: StateProps = {
  loading: 0,
  error: null,
  edit: false,
  editableAreas: [],
  animatedBanners: [
    {
      pathname: "/",
      guid: "homepage_banner",
      autoplay: 0,
      slidesPerPage: 1,
      items: [
        {
          media:
            "https://images.pexels.com/photos/7919366/pexels-photo-7919366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        },
        {
          media:
            "https://images.pexels.com/photos/5618463/pexels-photo-5618463.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        },
        {
          media:
            "https://images.pexels.com/photos/5490740/pexels-photo-5490740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        },
        {
          media:
            "https://images.pexels.com/photos/5490740/pexels-photo-5490740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        },
      ],
    },
  ],
};

/**
 * Action types
 * ---------------------------------------------------------------------
 */

enum Action {
  DATA_TOGGLE = "data/toggle",
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
    case Action.DATA_TOGGLE: {
      return {
        ...state,
        edit: !state.edit,
      };
    }
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

export const toggleEditMode =
  (authToken: Auth.StateProps["authToken"], clientGroupId: string) =>
  async (
    dispatch: ThunkDispatch<StateProps, void, DispatcherProps<StateProps>>
  ): Promise<void> => {
    dispatch({
      type: Action.DATA_TOGGLE,
    });
  };

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
    let editableAreas = initialState.editableAreas;
    let animatedBanners = initialState.animatedBanners;

    // try {
    //   await (async function load(): Promise<void> {
    //     //set the api configs in services file and pass auth token for auth as header in that file
    //     const res = await axios.get<IEditableAreas[]>("/someurl");
    //     editableAreas = res.data;
    //     const res2 = await axios.get<IAnimatedBanners[]>("/someurl");
    //     animatedBanners = res2.data;
    //   })();
    // } catch (e) {
    //   error = (e as Error).message;
    // }

    dispatch({
      type: Action.DATA_LOAD,
      payload: {
        error,
        editableAreas,
        animatedBanners,
      },
    });

    dispatch({
      type: Action.DATA_LOADED,
    });
  };

export const saveAllEditableAreas =
  (authToken: Auth.StateProps["authToken"], clientGroupId: string) =>
  async (
    dispatch: ThunkDispatch<StateProps, void, DispatcherProps<StateProps>>
  ): Promise<void> => {
    dispatch({
      type: Action.DATA_LOADING,
    });

    let error = initialState.error;
    let editableAreas = initialState.editableAreas;

    try {
      await (async function load(): Promise<void> {
        //set the api configs in services file and pass auth token for auth as header in that file
        const res = await axios.get<IEditableArea[]>("/someurl");
        editableAreas = res.data;
      })();
    } catch (e) {
      error = (e as Error).message;
    }

    dispatch({
      type: Action.DATA_LOAD,
      payload: {
        error,
        editableAreas,
      },
    });

    dispatch({
      type: Action.DATA_LOADED,
    });
  };

export const saveAllAnimatedBanners =
  (authToken: Auth.StateProps["authToken"], clientGroupId: string) =>
  async (
    dispatch: ThunkDispatch<StateProps, void, DispatcherProps<StateProps>>
  ): Promise<void> => {
    dispatch({
      type: Action.DATA_LOADING,
    });

    let error = initialState.error;
    let animatedBanners = initialState.animatedBanners;

    try {
      await (async function load(): Promise<void> {
        //set the api configs in services file and pass auth token for auth as header in that file
        const res = await axios.get<IAnimatedBanner[]>("/someurl");
        animatedBanners = res.data;
      })();
    } catch (e) {
      error = (e as Error).message;
    }

    dispatch({
      type: Action.DATA_LOAD,
      payload: {
        error,
        animatedBanners,
      },
    });

    dispatch({
      type: Action.DATA_LOADED,
    });
  };