import React from "react";
import { useNavigate } from "react-router-dom";

import { folders } from "../../api/apiDummyData";

import FolderCard from "../itemselection/FolderCard";
import ItemCardGrid from "../itemselection/ItemCardGrid";
import { ContentContainer } from "../layout/Layout";
import ShoppingCart from "../shopping-cart/ShoppingCart";

type FolderOverviewProps = {}

// React component
const FolderOverview : React.FC<FolderOverviewProps> = (props) => {
  const navigate = useNavigate();

  // Iterate all folders and return an array of FolderCard elements for each published folder
  const listFolderCards = () => {
    return folders.map((folder) => {
      if (folder.published) {  // Folder is published so it should be displayed
        return <FolderCard folder={folder}
                           onClick={() => navigate(`/folders/${folder.id}`)}
                           key={folder.id} />;
      } else {  // Folder is not published and should not be displayed
        return <></>; // Return nothing
      }
    });
  };

  return (
    <ContentContainer sidebarContent={<ShoppingCart />}>
      <ItemCardGrid cards={listFolderCards()} />
    </ContentContainer>
  );
};


// Exports
export default FolderOverview;