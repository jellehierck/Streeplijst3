import React from "react";

import { ProductType } from "../../api/localAPI";
import streeplijstConfig from "../../streeplijst/streeplijstConfig";

import { useShoppingCart } from "../shopping-cart/ShoppingCartContext";

import ProductControlButtonGroup from "../shopping-cart/ProductControlButtonGroup";
import ItemCard from "./ItemCard";

type ProductCardProps = {
  product : ProductType,
}

// React component
const ProductCard : React.FC<ProductCardProps> = (props) => {
  const cart = useShoppingCart();

  // Choose which media to render
  const media = () => {
    if (props.product.media) {  // If the folder in the props has media on it, show that
      return props.product.media;
    }

    // All other checks failed, show the missing media instead
    return streeplijstConfig.missingMedia;
  };

  return (
    <ItemCard title={props.product.name}
              media={media()}
              onClick={() => cart.add(props.product, 1)}>
      <ProductControlButtonGroup product={props.product} />
    </ItemCard>
  );
};


// Exports
export default ProductCard;