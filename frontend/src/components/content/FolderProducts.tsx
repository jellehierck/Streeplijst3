import React from "react";
import { useParams } from "react-router-dom";
import { useAPI } from "../../api/APIContext";

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
  const params = useParams<FolderIdType>();  // Get the folder ID from the URL
  const api = useAPI();

  if (params.folderId) {
    const folderId = parseInt(params.folderId);  // Convert folder ID from URL to integer

    const productsRes = api.getProductsInFolder(folderId);  // Get the contents of the current folder

    if (productsRes.isLoading) {  // Data is being loaded now
      return <ContentContainer sidebarContent={<ShoppingCart />}>
        <div>Products loading...</div>
      </ContentContainer>;
    }

    if (productsRes.error) {  // Some error occurred
      return <ContentContainer sidebarContent={<ShoppingCart />}>
        <div>{`Error while getting products in folder with ID ${folderId}`}</div>
        <div>{productsRes.error}</div>
      </ContentContainer>;
    }

    if (productsRes.data) {  // Data is ready
      // Create list of product cards
      const listProductCards = () => {
        return productsRes.data.map((product) => {
          if (product.published) {  // Product is published so it should be displayed
            return <ProductCard product={product}
                                key={product.id} />;
          } else { // Folder is not published and should not be displayed
            return null; // Return nothing
          }
        });
      };

      return <ContentContainer sidebarContent={<ShoppingCart />}>
        <ItemCardGrid cards={listProductCards()} />
      </ContentContainer>;
    }
  }

  return <></>;

};


// Exports
export default FolderProducts;