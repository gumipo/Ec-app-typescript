import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux";
import { ProductsReducer } from "../products/reducers";
import { UsersReducer } from "../users/reducers";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import * as History from "history";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function createStore(history: History.History) {
  return reduxCreateStore(
    combineReducers({
      router: connectRouter(history),
      products: ProductsReducer,
      users: UsersReducer,
    }),
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunk))
  );
}
