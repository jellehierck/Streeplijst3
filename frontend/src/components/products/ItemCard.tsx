import React from "react";
import { Card } from "react-bootstrap";

type BaseCardProps = {
  title : string
  media? : string | null
  onClick? : VoidFunction
  small? : boolean  // When true, less padding is added
}

/**
 * Generic card for items.
 * @param {string} props.title Title
 * @param {string | undefined | null} props.media Optional media URL. If not given or null, no image is displayed
 * @param {VoidFunction | undefined} props.onClick Optional function to call upon clicking the image or card title
 * @param {boolean | undefined} props.small When set, less padding is used around the card body
 */
const ItemCard : React.FC<BaseCardProps> = (props) => {
  // Display an image if one is provided
  const displayImage = () => {
    if (props.media) {
      return <div className="ratio ratio-1x1">
        <Card.Img variant="top"
                  src={props.media}
                  onClick={props.onClick}
                  style={{objectFit: "cover"}} />
      </div>;
    }
  };

  // Add less padding to the body when props.small is true
  const bodyPadding = () => {
    if (props.small) {
      return "p-0";
    } else {
      return "p-2";
    }
  };


  return (
    <Card className="p-2">
      {displayImage()}
      <Card.Body className={bodyPadding()}>
        <Card.Title onClick={props.onClick}>
          {props.title}
        </Card.Title>
        {props.children}
      </Card.Body>
    </Card>
  );
};


// Exports
export default ItemCard;