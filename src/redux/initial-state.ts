import { initialState as auth } from ".//modules/auth";
import { initialState as data } from "./modules/data";

/**
 * Defines initial state by combining initial state from all modules
 */

export const initialState = {
  auth,
  data,
};
