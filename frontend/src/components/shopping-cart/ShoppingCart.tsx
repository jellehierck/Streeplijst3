import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, ButtonGroup, Stack } from "react-bootstrap";
import ItemCard from "../products/ItemCard";
import ProductControlButtonGroup from "./ProductControlButtonGroup";
import { useShoppingCart } from "./ShoppingCartContext";

type CartProps = {}

// React component
const ShoppingCart : React.FC<CartProps> = (props) => {
  const cart = useShoppingCart();

  return (
    <>
      {/* Top display */}
      <ButtonGroup className="d-flex">

        {/* Title (button used for styling) */}
        <Button variant="secondary"
                className="p-2 w-100 text-start"
                disabled>
          <h4 className="mb-auto">
            Shopping cart
          </h4>
        </Button>

        {/* Clear contents button */}
        <Button variant="danger"
                onClick={cart.empty}>
          <FontAwesomeIcon icon={["fas", "trash"]} />
        </Button>
      </ButtonGroup>

      {/* All ttems in the cart */}
      <Stack direction="vertical">

        {cart.items.map(item => {
          return <ItemCard title={item.product.name}>
            <ProductControlButtonGroup product={item.product} />
          </ItemCard>;
        })}

        {/*   <ItemCard title={product1.name} */}
        {/*             small> */}
        {/*     <ProductControlButtonGroup product={product1} /> */}
        {/*   </ItemCard> */}
        {/*   <ItemCard title={product2.name} */}
        {/*             small> */}
        {/*     <ProductControlButtonGroup product={product2} /> */}
        {/*   </ItemCard> */}
        {/*   <ItemCard title={product3.name} */}
        {/*             small> */}
        {/*     <ProductControlButtonGroup product={product3} /> */}
        {/*   </ItemCard> */}

      </Stack>

      {/* Checkout button */}
      <Button variant="info"
              size="lg"
              onClick={() => {
              }}
              className="w-100">
        <h3 className="mb-auto text-reset">
          <FontAwesomeIcon icon={["fas", "shopping-cart"]} /> €{cart.getTotal().toFixed(2)}
        </h3>
      </Button>

      {/* {cart */}
      {/*   .filter((x : ProductType, i : number) => cart.indexOf(x) === i) */}
      {/*   .map((x : ProductType) => { */}
      {/*     return { */}
      {/*       e: x, */}
      {/*       count: cart.reduce( */}
      {/*         (a : number, v : ProductType) => (v === x ? a + 1 : a), */}
      {/*         0, */}
      {/*       ), */}
      {/*     }; */}
      {/*   }) */}
      {/*   .map((productWithCount : { e : ProductType; count : number }) => ( */}
      {/*     <Card className="mt-2 flex-row w-64" key={productWithCount.e.id}> */}
      {/*       <Card.Img */}
      {/*         className="w-14 inline" */}
      {/*         src={productWithCount.e.media} */}
      {/*       /> */}
      {/*       <Card.Body> */}
      {/*         <Card.Title>{productWithCount.e.name}</Card.Title> */}
      {/*         <div className="w-full flex"> */}
      {/*           <Button variant="secondary" className="max-h-28 inline"> */}
      {/*             {productWithCount.count} */}
      {/*           </Button> */}

      {/*           <Button */}
      {/*             className="max-h-28 inline" */}
      {/*             onClick={() => setCart([...cart, productWithCount.e])} */}
      {/*           > */}
      {/*             + */}
      {/*           </Button> */}

      {/*           <Button */}
      {/*             className="max-h-28 inline" */}
      {/*             onClick={() => { */}
      {/*               // have to make tempcart because otherwise the number won't update */}
      {/*               let tempCart = cart.slice(); */}
      {/*               tempCart.splice(tempCart.indexOf(productWithCount.e), 1); */}
      {/*               setCart(tempCart); */}
      {/*             }} */}
      {/*           > */}
      {/*             - */}
      {/*           </Button> */}
      {/*         </div> */}
      {/*         <p className="mt-2 text-right"> */}
      {/*           € */}
      {/*           {( */}
      {/*             (productWithCount.count * productWithCount.e.price) / */}
      {/*             100 */}
      {/*           ).toFixed(2)}{" "} */}
      {/*           ({productWithCount.count}) */}
      {/*         </p> */}
      {/*       </Card.Body> */}
      {/*     </Card> */}
      {/*   ))} */}

      {/* <p className="mt-3 text-lg"> */}
      {/*   Totaal: € */}
      {/*   {cart */}
      {/*     .reduce((a : number, b : ProductType) => a + b.price / 100, 0) */}
      {/*     .toFixed(2)} */}
      {/* </p> */}
      {/* {cart.length > 0 ? ( */}
      {/*   <Button className="m-4" variant="success" onClick={addSalesAndLogOut}> */}
      {/*     Kopen en uitloggen */}
      {/*   </Button> */}
      {/* ) : ( */}
      {/*   <Button className="m-4 text-white" variant="light" disabled> */}
      {/*     Kopen en uitloggen */}
      {/*   </Button> */}
      {/* )} */}
    </>

  )
    ;
};


// Exports
export default ShoppingCart;