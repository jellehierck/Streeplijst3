import React from "react";

import { FolderType } from "../../api/localAPI";
import streeplijstConfig from "../../streeplijst/streeplijstConfig";

import ItemCard from "./ItemCard";

type FolderProps = {
  folder : FolderType
  onClick : VoidFunction
  media? : string
}

/**
 * Card for a specific folder
 * @param props.folder Folder to display
 * @param props.onClick Function to call on clicking the card
 */
const FolderCard : React.FC<FolderProps> = (props) => {
  return <ItemCard title={props.folder.name}
                   media={props.media}
                   onClick={() => props.onClick()} />;
};


// Exports
export default FolderCard;
