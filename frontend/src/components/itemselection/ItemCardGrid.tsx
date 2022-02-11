import React from "react";
import { Col, Row } from "react-bootstrap";

type ItemCardGridProps = {
  cards : JSX.Element[]
}

// React component
const ItemCardGrid : React.FC<ItemCardGridProps> = (props) => {

  // Get a list of all card components passed
  const cards = props.cards.map((card, index) => {
    return <Col key={index}>
      {card}
    </Col>;
  });

  return (
    // Create a row which allows only a certain number of columns depending on the screen width
    <Row md={2}  // Max cols on a small screen
         lg={3}  // Max cols a middle size screen
         xl={4}  // Max cols a large screen
         className="g-2"  // Gutter, horizontal and vertical space in between columns
    >
      {cards}
    </Row>
  );
};


// Exports
export default ItemCardGrid;