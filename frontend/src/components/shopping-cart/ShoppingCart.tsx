import React from "react";

type CartProps = {}

// React component
const ShoppingCart : React.FC<CartProps> = (props) => {
  return (
    <>
      <p>Some items</p>
      <p>Total : €40.00</p>
    </>
  );
}


// Exports
export default ShoppingCart;