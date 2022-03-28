import React from "react";

import { FolderType } from "../../api/localAPI";
import streeplijstConfig from "../../streeplijst/streeplijstConfig";

import ItemCard from "./ItemCard";

type FolderProps = {
  folder : FolderType
  onClick : VoidFunction
}

/**
 * Card for a specific folder
 * @param props.folder Folder to display
 * @param props.onClick Function to call on clicking the card
 */
const FolderCard : React.FC<FolderProps> = (props) => {

  // Choose which media to render
  const media = () => {
    if (props.folder.media) {  // If the folder in the props has media on it, show that
      return props.folder.media;
    }

    // The passed folder prop does not have media, try to find is in the configuration
    const configMedia = streeplijstConfig.folders.find(folderConfig => folderConfig.id === props.folder.id);
    if (configMedia?.media) {  // If the media exists in the config, show that
      return configMedia.media;
    }

    console.log(configMedia);

    // All other checks failed, show the missing media instead
    return streeplijstConfig.missingMedia;
  };

  return <ItemCard title={props.folder.name}
                   media={media()}
                   onClick={() => props.onClick()} />;
};


// Exports
export default FolderCard;
