import { initialState as auth } from ".//modules/auth";
import { initialState as data } from "./modules/data";
import { initialState as edit } from "./modules/edit";
import { initialState as toast } from "./modules/toast";

/**
 * Defines initial state by combining initial state from all modules
 */

export const initialState = {
  auth,
  data,
  edit,
  toast,
};
