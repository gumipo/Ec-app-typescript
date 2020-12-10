import { createSelector } from "reselect";
import { DefaultRootState } from "react-redux";

const usersSelector = (state: DefaultRootState) => state.users;

export const getUserId = createSelector([usersSelector], (state) => state.uid);

export const getUserName = createSelector(
  [usersSelector],
  (state) => state.username
);

export const getIsSignedIn = createSelector(
  [usersSelector],
  (state) => state.isSignedIn
);

export const getProductsInCart = createSelector(
  [usersSelector],
  (state) => state.cart
);
export const getOrdersHistory = createSelector(
  [usersSelector],
  (state) => state.orders
);
