import "react-redux";
import { RouterState } from "connected-react-router";

export type StoreState = {
  products: {
    list: [];
  };
  users: {
    cart: [];
    favorite: [];
    orders: [];
    isSignedIn: false;
    uid: string;
    username: string;
    role: string;
  };
  router: RouterState;
};

declare module "react-redux" {
  interface DefaultRootState extends StoreState {}
}
