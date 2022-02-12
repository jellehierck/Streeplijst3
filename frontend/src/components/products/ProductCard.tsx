import React from "react";

import { ProductType } from "../../api/API";
import ProductControlButtonGroup from "../shopping-cart/ProductControlButtonGroup";
import { useShoppingCart } from "../shopping-cart/ShoppingCartContext";
import ItemCard from "./ItemCard";

type ProductCardProps = {
  product : ProductType,
}

// React component
const ProductCard : React.FC<ProductCardProps> = (props) => {
  const cart = useShoppingCart();

  return (
    <ItemCard title={props.product.name}
              media={props.product.media}
              onClick={() => cart.add(props.product, 1)}>
      <ProductControlButtonGroup product={props.product} />
    </ItemCard>
  );
};


// Exports
export default ProductCard;