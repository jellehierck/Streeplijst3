import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import { ProductType } from "../../api/API";
import { useShoppingCart } from "./ShoppingCartContext";

type ProductControlProps = {
  product : ProductType
}

/**
 * Display price and quantity information for a product in the shopping cart, as well as buttons to increase/decrease
 * the quantity.
 * @param {ProductType} props.product Product to display for.
 * @param {number} props.quantity Quantity of the product to display.
 * @returns {JSX.Element}
 * @constructor
 */
const ProductControlButtonGroup : React.FC<ProductControlProps> = (props) => {
  const cart = useShoppingCart();

  // Function to call on the add button press
  const onAdd = () => {
    // Add the item using the cart context
    // TODO: Add a way to add more items at the same time if needed since we hardcoded one item for now
    cart.add(props.product, 1);
  };

  // Function to call on the add button press
  const onRemove = () => {
    // Add the item using the cart context
    // TODO: Add a way to remove more items at the same time if needed
    cart.remove(props.product);
  };

  // Get the current quantity
  const currQuantity = cart.getQuantity(props.product);

  // Display quantity if it is not 0
  const displayQuantity = () => {
    if (currQuantity > 0) {
      return <Button variant="secondary"
                     className="p-1"
                     disabled>
        {currQuantity}x
      </Button>;
    }
  };

  // Display price
  const displayPrice = () => {
    return <Button variant="secondary"
                   className="w-100 p-1 text-start"
                   disabled>
      €{props.product.price.toFixed(2)}
    </Button>;
  };

  const displayAddButton = () => {
    return <Button variant="outline-success"
                   className="py-1 px-3"
                   onClick={onAdd}>
      <FontAwesomeIcon icon={["fas", "plus"]} />
    </Button>;
  };

  // Display remove button only if there are items to remove
  const displayRemoveButton = () => {
    let visible = "visible";
    if (currQuantity <= 0) {
      visible = "invisible";
    }
    return <Button variant="outline-danger"
                   className={"py-1 px-3 " + visible}
                   onClick={onRemove}>
      <FontAwesomeIcon icon={["fas", "minus"]} />
    </Button>;
  };


  return (
    <ButtonGroup className="d-flex">
      {displayQuantity()}
      {displayPrice()}
      {displayAddButton()}
      {displayRemoveButton()}
    </ButtonGroup>
  );
};


// Exports
export default ProductControlButtonGroup;