import React from "react";
import { Col } from "react-bootstrap";

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
    <div className="overflow-hidden"> {/* Because we use gutters on the Row, we should hide overflow */}
      {/* Row which only allows a max number of columns depending on screen size */}
      <Row md={2}  // Max cols on a small screen
           lg={3}  // Max cols a middle size screen
           xl={4}  // Max cols a large screen
           className="g-2"  // Gutter, vertical and horizontal space between columns
      >
        {cards}
      </Row>
    </div>
  );
};


// Exports
export default ItemCardGrid;