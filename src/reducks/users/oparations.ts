import {
  signInAction,
  signOutAction,
  fetchProductsInCartAction,
  fetchOrdersHistoryAction,
  Actions,
} from "./actions";
import { push } from "connected-react-router";
import { Dispatch } from "redux";
import { StoreState } from "../store/types";
import {
  Product,
  SelectedProduct,
  OrdersHistory,
  OrderedProduct,
} from "../products/types";
//import firebase
import { auth, FirebaseTimeStamp, db } from "../../firebase/index";

//userそれぞれのCartIdを作成
export const addProductToCart = (addedProduct: Product[]) => {
  return async (dispatch: Dispatch, getState: () => StoreState) => {
    const uid = getState().users.uid;
    const cartRef = db.collection("users").doc(uid).collection("cart").doc();
    addedProduct["cartId"] = cartRef.id;
    await cartRef.set(addedProduct);
    dispatch(push("/"));
  };
};

//注文履歴の取得
export const fetchOrderHistory = () => {
  return async (dispatch: Dispatch<Actions>, getState: () => StoreState) => {
    const uid = getState().users.uid;
    const list = [];
    db.collection("users")
      .doc(uid)
      .collection("orders")
      .orderBy("updated_at", "desc")
      .get()
      .then((snapshots: any) => {
        snapshots.forEach((snapshot: any) => {
          const data = snapshot.data();
          list.push(data);
        });
        dispatch(fetchOrdersHistoryAction(list));
      });
  };
};

//reduxのcart情報を更新
export const fetchProductsInCart = (products) => {
  return async (dispatch: Dispatch<Actions>) => {
    dispatch(fetchProductsInCartAction(products));
  };
};

//認証をリッスン関数
export const listenAuthState = () => {
  return async (dispatch: Dispatch) => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        db.collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();

            dispatch(
              signInAction({
                isSignedIn: true,
                uid: uid,
                role: data.role,
                username: data.username,
              })
            );
          });
      } else {
        dispatch(push("/signin"));
      }
    });
  };
};

//サインイン
export const signIn = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    //validation
    if (email === "" || password === "") {
      alert("必須項目が未入力です");
      return false;
    }

    auth.signInWithEmailAndPassword(email, password).then((result) => {
      const user = result.user;
      if (user) {
        const uid = user.uid;
        db.collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();

            dispatch(
              signInAction({
                isSignedIn: true,
                uid: uid,
                role: data.role,
                username: data.username,
              })
            );
            dispatch(push("/"));
          });
      }
    });
  };
};

//アカウント作成
export const signUp = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  return async (dispatch: Dispatch) => {
    //validation
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("必須項目が未入力です");
      return false;
    }
    if (password !== confirmPassword) {
      alert("パスワードが一致していません");
      return false;
    }

    //ユーザー作成
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;

        if (user) {
          const uid = user.uid;
          const timestamp = FirebaseTimeStamp.now();

          //ユーザーデータの作成
          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username: username,
          };

          //データベースに登録
          db.collection("users")
            .doc(uid)
            .set(userInitialData)
            .then(() => {
              dispatch(push("/"));
            });
        }
      });
  };
};

//リセットパスワード
export const resetPassword = (email: string) => {
  return async (dispatch: Dispatch) => {
    if (email === "") {
      alert("必須項目が未入力です");
      return false;
    } else {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          alert(
            "入力されたアドレスにパスワードリセット用のメールを送信しました"
          );
          dispatch(push("/signin"));
        })
        .catch(() => {
          alert("パスワードリセットに失敗しました。通信状況をお確かめください");
        });
    }
  };
};

//サインアウト
export const signOut = () => {
  return async (dispatch: Dispatch) => {
    auth.signOut().then(() => {
      dispatch(signOutAction());
      dispatch(push("/signin"));
    });
  };
};
