import { Product } from "./types";

export const ActionTypes = {
  FETCH_PRODUCTS: "FETCH_PRODUCTS",
  DELETE_PRODUCT: "DELETE_PRODUCT",
} as const;

export const fetchProductsAction = (products: Product[]) => {
  return {
    type: "FETCH_PRODUCTS",
    payload: products,
  };
};
type FetchProductsAction = ReturnType<typeof fetchProductsAction>;

export const deleteProductAction = (products: Product[]) => {
  return {
    type: "DELETE_PRODUCT",
    payload: products,
  };
};

type DeleteProductAction = ReturnType<typeof deleteProductAction>;
export type Actions = FetchProductsAction | DeleteProductAction;
