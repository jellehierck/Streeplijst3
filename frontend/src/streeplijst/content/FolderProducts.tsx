import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { ContentContainer } from "../../components/layout/Layout";
import ShoppingCart from "../../components/shopping-cart/ShoppingCart";
import streeplijstRouteConfig from "../streeplijstRouteConfig";

type FolderProductsProps = {}

type FolderIdType = {
  folderId : string
}

// React component
const FolderProducts : React.FC<FolderProductsProps> = (props) => {
  const navigate = useNavigate();
  const params = useParams<FolderIdType>();

  return (
    <ContentContainer sidebarContent={<ShoppingCart />}>
      <p>Folder id: {params.folderId}</p>
      <Button variant="primary"
              onClick={() => navigate(streeplijstRouteConfig.onCheckout)}>
        Buy product 1
      </Button>
      <Button variant="primary"
              onClick={() => navigate(streeplijstRouteConfig.onCheckout)}>
        Buy product 2
      </Button>
    </ContentContainer>
  );
}


// Exports
export default FolderProducts;