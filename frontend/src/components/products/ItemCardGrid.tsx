import React from "react";
import Col from "react-bootstrap/Col";
import Row, { RowProps } from "react-bootstrap/Row";

interface ItemCardGridProps extends RowProps {
  cards : (JSX.Element | null)[];
}

// React component
const ItemCardGrid : React.FC<ItemCardGridProps> = ({
  cards,
  md = 2,  // Default cards per row for responsive card grid
  lg = 3,
  xl = 4,
  ...rowProps // All other props for the Row component
}) => {

  // Get a list of all card components passed, filtering out any null elements (fixes missing cards)
  const filteredCards = cards.map((card, index) => {
    if (card) {
      return <Col key={index}>
        {card}
      </Col>;
    } else {
      return null;
    }
  });

  return (
    <div className="overflow-hidden"> {/* Because we use gutters on the Row, we should hide overflow */}
      {/* Row which only allows a max number of columns depending on screen size */}
      <Row {...rowProps} // Pass all other props too
           md={md}  // Max cols on a small screen
           lg={lg}  // Max cols a middle size screen
           xl={xl}  // Max cols a large screen
           className="g-2"  // Gutter, vertical and horizontal space between columns
      >
        {filteredCards}
      </Row>
    </div>
  );
};


// Exports
export default ItemCardGrid;