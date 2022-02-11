import React from "react";
import { Card } from "react-bootstrap";
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
          className="p-2"
          style={{
            borderRadius: "0.5rem",
          }}>
      <Card.Img variant="top" src={media()} />
      <Card.Body className="p-2">
        <Card.Title className="mb-auto">
          {props.product.name}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};


// Exports
export default ProductCard;