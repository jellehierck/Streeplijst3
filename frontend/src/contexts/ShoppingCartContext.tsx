import React, { createContext, useState } from "react";
import { ProductType } from "../api/API";

export const ShoppingCartContext = createContext<Array<ProductType[]> | any>(
  []
);
export function ShoppingCartContextProvider(props: any) {
  const [cart, setCart] = useState<ProductType[]>([]);

  return (
    <ShoppingCartContext.Provider value={[cart, setCart]}>
      {props.children}
    </ShoppingCartContext.Provider>
  );
}
