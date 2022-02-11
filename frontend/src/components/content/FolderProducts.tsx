import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsSpeciaal } from "../../api/apiDummyData";
import { streeplijstRoutes } from "../../streeplijst/streeplijstRouteConfig";
import ItemCardGrid from "../itemselection/ItemCardGrid";
import ProductCard from "../itemselection/ProductCard";
import { ContentContainer } from "../layout/Layout";
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