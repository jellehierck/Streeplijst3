import React, { useState } from "react";
import { Button } from "react-bootstrap";

export function Stepper() {
  const [quantity, setQuantity] = useState(0);
  return (
    <div className="h-full w-full">
      <Button variant="secondary" className="max-h-28">
        {quantity}
      </Button>
      <Button
        className=" max-h-28 float-right"
        onClick={() => setQuantity(quantity + 1)}
      >
        +
      </Button>

      <Button
        className=" max-h-28 float-right"
        onClick={() => (quantity > 0 ? setQuantity(quantity - 1) : null)}
      >
        -
      </Button>
    </div>
  );
}
