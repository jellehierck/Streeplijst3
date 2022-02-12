import React from "react";
import { ProductType } from "../../api/API";
import ProductControlButtonGroup from "../shopping-cart/ProductControlButtonGroup";
import ItemCard from "./ItemCard";

type ProductCardProps = {
  product : ProductType,
  onClick? : VoidFunction  // TODO: Replace with more sensible stuff to handle the products related to the ShoppingCart
}

// React component
const ProductCard : React.FC<ProductCardProps> = (props) => {
  return (
    <ItemCard title={props.product.name}
              media={props.product.media}
              onClick={props.onClick}>
      <ProductControlButtonGroup product={props.product} />
    </ItemCard>
  );
};


// Exports
export default ProductCard;