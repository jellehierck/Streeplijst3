import React, { createContext, useState } from "react";
import { ProductType } from "../api/API";

const ShoppingCartContext = createContext<Array<ProductType[]> | any>([]);
// export shoppingCartContext;
export function ShoppingCartContextProvider(props: any) {
  const [cart, setCart] = useState<ProductType[]>([]);

  return (
    <ShoppingCartContext.Provider value={[cart, setCart]}>
      {props.children}
    </ShoppingCartContext.Provider>
  );
}
