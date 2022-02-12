import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsSpeciaal } from "../../api/apiDummyData";
import { streeplijstRoutes } from "../../streeplijst/streeplijstRouteConfig";
import { ContentContainer } from "../layout/Layout";
import ItemCardGrid from "../products/ItemCardGrid";
import ProductCard from "../products/ProductCard";
import ShoppingCart from "../shopping-cart/ShoppingCart";

type FolderProductsProps = {}

// Parameter for the
type FolderIdType = {
  folderId : string
}

// React component
const FolderProducts : React.FC<FolderProductsProps> = (props) => {
  const navigate = useNavigate();
  const params = useParams<FolderIdType>();

  // Create list of product cards
  const listProductCards = () => {
    return productsSpeciaal.map((product) => {
      return <ProductCard product={product}
                          onClick={() => navigate(streeplijstRoutes.checkoutPage)}
                          key={product.id} />;
    });
  };

  return (
    <ContentContainer sidebarContent={<ShoppingCart />}>
      <p>Folder id: {params.folderId}</p>
      <ItemCardGrid cards={listProductCards()} />
    </ContentContainer>
  );
};


// Exports
export default FolderProducts;