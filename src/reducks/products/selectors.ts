import { DefaultRootState } from "react-redux";
import { createSelector } from "reselect";

const productsSelector = (state: DefaultRootState) => state.products;

export const getProducts = createSelector(
  [productsSelector],
  (state) => state.list
);
