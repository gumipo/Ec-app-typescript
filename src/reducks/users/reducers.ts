import { ActionTypes, Actions } from "./actions";
import { UserState } from "./types";
import initialState from "../store/initialState";

export const UsersReducer = (
  state: UserState = initialState.users,
  action: Actions
) => {
  switch (action.type) {
    case ActionTypes.SIGN_IN:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypes.SIGN_OUT:
      return {
        ...action.payload,
      };
    case ActionTypes.FETCH_PRODUCTS_IN_CART:
      return {
        ...state,
        cart: [...action.payload],
      };
    case ActionTypes.FETCH_ORDERS_HISTORY:
      return {
        ...state,
        orders: [...action.payload],
      };
    default:
      return state;
  }
};
