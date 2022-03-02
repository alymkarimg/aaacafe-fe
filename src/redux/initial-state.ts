import { initialState as auth } from ".//modules/auth";
import { initialState as data } from "./modules/data";
import { initialState as editableAreas } from "./modules/editableAreas";

/**
 * Defines initial state by combining initial state from all modules
 */

export const initialState = {
  auth,
  data,
  editableAreas,
};
