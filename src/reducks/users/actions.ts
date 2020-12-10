import { UserState } from "./types";
import { Product, OrdersHistory, SelectedProduct } from "../products/types";

export const ActionTypes = {
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  FETCH_PRODUCTS_IN_CART: "FETCH_PRODUCTS_IN_CART",
  FETCH_PRODUCTS_IN_FAVORITE: "FETCH_PRODUCTS_IN_FAVORITE",
  FETCH_ORDERS_HISTORY: "FETCH_ORDER_HISTORY",
} as const;

export const signInAction = (userState: UserState) => {
  return {
    type: ActionTypes.SIGN_IN,
    payload: {
      isSignedIn: true,
      uid: userState.uid,
      username: userState.username,
    },
  };
};
type SignInAction = ReturnType<typeof signInAction>;

export const signOutAction = () => {
  return {
    type: ActionTypes.SIGN_OUT,
    payload: {
      isSignedIn: false,
      uid: "",
      username: "",
    },
  };
};
type SignOutAction = ReturnType<typeof signOutAction>;

export const fetchProductsInCartAction = (products: SelectedProduct[]) => {
  return {
    type: ActionTypes.FETCH_PRODUCTS_IN_CART,
    payload: products,
  };
};

type FetchProductsInCartAction = ReturnType<typeof fetchProductsInCartAction>;

// export const fetchProductsInFavoriteAction = (products: SelectedProduct[]) => {
//   return {
//     type: ActionTypes.FETCH_PRODUCTS_IN_FAVORITE,
//     payload: products,
//   };
// };
// type FetchProductsInFavoriteAction = ReturnType<
//   typeof fetchProductsInFavoriteAction
// >;

export const fetchOrdersHistoryAction = (orderList: OrdersHistory[]) => {
  return {
    type: ActionTypes.FETCH_ORDERS_HISTORY,
    payload: orderList,
  };
};
type FetchOrdersHistoryAction = ReturnType<typeof fetchOrdersHistoryAction>;

export type Actions =
  | SignInAction
  | SignOutAction
  | FetchProductsInCartAction
  | FetchOrdersHistoryAction;
// | FetchProductsInFavoriteAction;
