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
          className="p-3"
          style={{
            width: "15rem",
            borderRadius: "0.5rem",
          }}>
      <Card.Img variant="top" src={props.folder.media} />
      <Card.Body>
        <Card.Title>{props.folder.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};


// Exports
export default FolderCard;
