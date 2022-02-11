import React from "react";
import { Card } from "react-bootstrap";

import { FolderType } from "../../api/API";

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
    <Card key={props.folder.id}
          onClick={() => props.onClick()}
          className="p-2">
      <Card.Img variant="top" src={props.folder.media} />
      <Card.Body className="p-2">
        <Card.Title className="mb-auto">
          {props.folder.name}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};


// Exports
export default FolderCard;
