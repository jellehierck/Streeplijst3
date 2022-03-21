import React from "react";
import { useNavigate } from "react-router-dom";

import { useAPI } from "../../api/APIContext";

import { ContentContainer } from "../layout/Layout";

import FolderCard from "../products/FolderCard";
import ItemCardGrid from "../products/ItemCardGrid";
import ShoppingCart from "../shopping-cart/ShoppingCart";

type FolderOverviewProps = {}

// React component
const FolderOverview : React.FC<FolderOverviewProps> = (props) => {
  const navigate = useNavigate();
  const api = useAPI();

  if (api.folderRes?.isLoading) {
    return <ContentContainer sidebarContent={<ShoppingCart />}>
      <div>Folders loading...</div>
    </ContentContainer>;
  }

  if (api.folderRes?.error) {
    return <ContentContainer sidebarContent={<ShoppingCart />}>
      <div>Error while getting folders</div>
    </ContentContainer>;
  }

  if (api.folderRes?.data) {  // If there is data now

    // Iterate all folders and return an array of FolderCard elements for each published folder
    const listFolderCards = api.folderRes.data.map((folder) => {
      if (folder.published) {  // Folder is published so it should be displayed
        return <FolderCard folder={folder}
                           onClick={() => navigate(`/folders/${folder.id}`)}
                           key={folder.id} />;

      } else {  // Folder is not published and should not be displayed
        return <></>; // Return nothing
      }
    });

    return (
      <ContentContainer sidebarContent={<ShoppingCart />}>
        <ItemCardGrid cards={listFolderCards} />
      </ContentContainer>
    );
  }


  return <></>;

};


// Exports
export default FolderOverview;