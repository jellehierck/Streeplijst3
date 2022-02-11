import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { ProductType } from "../../api/API";

type ProductCardProps = {
  product : ProductType,
  onClick : VoidFunction  // TODO: Replace with more sensible stuff to handle the products related to the ShoppingCart
}

// React component
const ProductCard : React.FC<ProductCardProps> = (props) => {

  // Get media URL
  const media = () => {
    if (props.product.media) {
      return props.product.media;
    }
  };

  return (
    <Card onClick={() => props.onClick()}
          className="p-2">
      <Card.Img variant="top" src={media()} />
      <Card.Body className="p-2">
        <Card.Title className="mb-auto">
          {props.product.name}
        </Card.Title>

        {/* Button control */}
        <ButtonGroup className="d-flex pt-2">
          {/* Add item */}
          <Button variant="outline-success"
                  className="py-2 px-3"
                  onClick={() => {
                  }}>
            <FontAwesomeIcon icon={["fas", "plus"]} />
          </Button>

          {/* Price display */}
          <Button variant="secondary"
                  className="w-100 p-2"
                  disabled>
            €{props.product.price}
          </Button>

          {/* Remove item */}
          <Button variant="outline-danger"
                  className="py-2 px-3"
                  onClick={() => {
                  }}>
            <FontAwesomeIcon icon={["fas", "minus"]} />
          </Button>

        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};


// Exports
export default ProductCard;