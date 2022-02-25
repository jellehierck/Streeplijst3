import React from "react";

import { FolderType } from "../../api/localAPI";
import ItemCard from "./ItemCard";

type FolderProps = {
  folder : FolderType
  onClick : VoidFunction
}

/**
 * Card for a specific folder
 * @param props
 * @constructor
 */
const FolderCard : React.FC<FolderProps> = (props) => {
  return (
    <ItemCard title={props.folder.name}
              media={props.folder.media}
              onClick={() => props.onClick()} />
  );
};


// Exports
export default FolderCard;
