export type Image = {
  id: string;
  path: string;
};

export type Size = {
  size: string;
  quantity: number;
};

export type Product = {
  added_at: firebase.firestore.Timestamp;
  description: string;
  images: Image[];
  name: string;
  price: number;
  productId: string;
  quantity: number;
  sizes: Size[];
  cartId: string;
  favoriteId: string;
};

export type SelectedProduct = {
  added_at: firebase.firestore.Timestamp;
  description: string;
  images: Image[];
  name: string;
  price: number;
  productId: string;
  quantity: number;
  size: Size;
  cartId: string;
  favoriteId: string;
};

export type ImageArea = {
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<never[]>>;
};

export type OrderedProduct = {
  id: string;
  images: Image[];
  name: string;
  price: number;
  size: string;
};

export type OrdersHistory = {
  products: OrderedProduct[];
  amount: number;
  created_at: number;
  id: string;
  shippingDate: firebase.firestore.Timestamp;
  updated_at: firebase.firestore.Timestamp;
};
