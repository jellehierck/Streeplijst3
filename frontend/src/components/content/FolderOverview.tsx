import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { ContentContainer } from "../layout/Layout";
import ShoppingCart from "../shopping-cart/ShoppingCart";

type FolderOverviewProps = {}

// React component
const FolderOverview : React.FC<FolderOverviewProps> = (props) => {
  const navigate = useNavigate();

  return (
    <ContentContainer sidebarContent={<ShoppingCart />}>
      <Button variant="primary"
              onClick={() => navigate("/folders/1")}>
        Folder 1
      </Button>
      <Button variant="primary"
              onClick={() => navigate("/folders/2")}>
        Folder 2
      </Button>
      <Button variant="primary"
              onClick={() => navigate("/folders/3")}>
        Folder 3
      </Button>
    </ContentContainer>
  );
}


// Exports
export default FolderOverview;