import React from "react";
import { Card } from "react-bootstrap";

type BaseCardProps = {
  title : string
  media? : string | null
  onClick? : VoidFunction
  small? : boolean  // When true, less padding is added
}

// React component
const ItemCard : React.FC<BaseCardProps> = (props) => {
  // Display an image if one is provided
  const displayImage = () => {
    if (props.media) {
      return <Card.Img variant="top" src={props.media} />;
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
    <Card onClick={props.onClick}
          className="p-2">
      {displayImage()}
      <Card.Body className={bodyPadding()}>
        <Card.Title>
          {props.title}
        </Card.Title>
        {props.children}
      </Card.Body>
    </Card>
  );
};


// Exports
export default ItemCard;