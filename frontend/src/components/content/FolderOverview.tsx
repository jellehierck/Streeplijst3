import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { folders } from "../../api/apiDummyData";

import FolderCard from "../folders/FolderCard";
import { ContentContainer } from "../layout/Layout";
import ShoppingCart from "../shopping-cart/ShoppingCart";

type FolderOverviewProps = {}

// React component
const FolderOverview : React.FC<FolderOverviewProps> = (props) => {
  const navigate = useNavigate();

  // Iterate all folders and return an array of FolderCard elements for each published folder
  const displayFolders = () => {
    return folders.map((folder) => {
      if (folder.published) {  // Folder is published so it should be displayed
        return <FolderCard folder={folder}
                           onClick={() => navigate(`/folders/${folder.id}`)} />;
      } else {  // Folder is not published and should not be displayed
        return <></>; // Return nothing
      }
    });
  };

  return (
    <ContentContainer sidebarContent={<ShoppingCart />}>

      {displayFolders()}

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
};


// Exports
export default FolderOverview;