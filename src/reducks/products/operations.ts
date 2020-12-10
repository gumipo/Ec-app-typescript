import { StoreState } from "./../store/types";
import { db, FirebaseTimeStamp } from "../../firebase";
import { Dispatch } from "redux";
import { push } from "connected-react-router";
import { fetchProductsAction, deleteProductAction, Actions } from "./actions";
import { Product, SelectedProduct, OrderedProduct, Size, Image } from "./types";

const productsRef = db.collection("products");

//Productの削除
export const deleteProduct = (id: string) => {
  return async (dispatch: Dispatch<Actions>, getState: () => StoreState) => {
    productsRef
      .doc(id)
      .delete()
      .then(() => {
        const prevProducts = getState().products.list;
        const nextProducts = prevProducts.filter(
          (product) => product.productId !== id
        );
        dispatch(deleteProductAction(nextProducts));
      });
  };
};

//firestoreからProducts情報を取得してactionsに投げる
export const fetchProducts = (gender: string, category: string) => {
  return async (dispatch: Dispatch<Actions>) => {
    let query = productsRef.orderBy("updated_at", "desc");
    query = gender !== "" ? query.where("gender", "==", gender) : query;
    query = category !== "" ? query.where("category", "==", category) : query;

    query.get().then((snapshots) => {
      const productList: Product[] = [];
      snapshots.forEach((snapshot) => {
        const product = snapshot.data() as Product;
        productList.push(product);
      });
      dispatch(fetchProductsAction(productList));
    });
  };
};

export const orderProduct = (
  productsInCart: SelectedProduct[],
  amount: number
) => {
  return async (dispatch: Dispatch, getState: () => StoreState) => {
    const uid = getState().users.uid;

    const userRef = db.collection("users").doc(uid);
    const timestamp = FirebaseTimeStamp.now();

    let products: OrderedProduct[] = [];
    let soldOutProducts: string[] = [];

    const batch = db.batch();

    for (const product of productsInCart) {
      const snapshot = await productsRef.doc(product.productId).get();
      const { sizes } = snapshot.data() as Product;

      const orderQuantity = product.quantity;

      const updatedSizes = sizes.map((size: Size) => {
        if (size.size === product.size.size) {
          if (size.quantity === 0) {
            soldOutProducts.push(product.name);
            return size;
          }
          return {
            size: size.size,
            quantity: size.quantity - orderQuantity,
          };
        } else {
          return size;
        }
      });
      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size.size,
      });

      batch.update(productsRef.doc(product.productId), { sizes: updatedSizes });
      batch.delete(userRef.collection("cart").doc(product.cartId));
    }

    if (soldOutProducts.length > 0) {
      const errorMessage =
        soldOutProducts.length > 1
          ? soldOutProducts.join("と")
          : soldOutProducts[0];

      alert(
        "大変申し訳ありません" +
          errorMessage +
          "が在庫切れとなった為注文処理を中断しました"
      );
      return false;
    } else {
      batch
        .commit()
        .then(() => {
          const orderRef = userRef.collection("orders").doc();
          const date = timestamp.toDate();
          const shippingDate = FirebaseTimeStamp.fromDate(
            new Date(date.setDate(date.getDate() + 3))
          );

          const history = {
            amount: amount,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shippingDate,
            updated_at: timestamp,
          };

          orderRef.set(history);
          dispatch(push("/order/history"));
        })
        .catch(() => {
          alert(
            "注文処理に失敗しました。通信環境をお確かめの上、もう一度お試しください"
          );
          return false;
        });
    }
  };
};

//firebaseに情報を登録
export const saveProduct = (
  id: string,
  name: string,
  description: string,
  category: string,
  gender: string,
  price: string,
  images: Image[],
  sizes: Size[]
) => {
  return async (dispatch: Dispatch) => {
    const timestamp = FirebaseTimeStamp.now();

    const data = {
      category: category,
      description: description,
      gender: gender,
      name: name,
      images: images,
      //10進数に変える
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timestamp,
    };

    //新規の場合
    if (id === "") {
      const ref = productsRef.doc();
      id = ref.id;
      data.id = id;
      data.created_at = timestamp;
    }

    return productsRef
      .doc(id)
      .set(data, { merge: true })
      .then(() => {
        dispatch(push("/"));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};
