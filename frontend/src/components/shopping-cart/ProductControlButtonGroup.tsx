import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

type ProductControlProps = {}

// React component
const ProductControlButtonGroup : React.FC<ProductControlProps> = (props) => {
  return (
    <ButtonGroup className="d-flex">

      {/* Quantity display */}
      <Button variant="secondary"
              className="p-1"
              disabled>
        1x
      </Button>

      {/* Price display */}
      <Button variant="secondary"
              className="w-100 p-1 text-start"
              disabled>
        €40.00
      </Button>

      {/* Add item */}
      <Button variant="outline-success"
              className="py-1 px-3"
              onClick={() => {
              }}>
        <FontAwesomeIcon icon={["fas", "plus"]} />
      </Button>


      {/* Remove item */}
      <Button variant="outline-danger"
              className="py-1 px-3"
              onClick={() => {
              }}>
        <FontAwesomeIcon icon={["fas", "minus"]} />
      </Button>

    </ButtonGroup>
  );
};


// Exports
export default ProductControlButtonGroup;