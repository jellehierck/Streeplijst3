import { Button, Card, Nav } from "react-bootstrap";
import { useContext, useState } from "react";
import { Redirect } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { Stepper } from "./Stepper";
import { ShoppingCartContext } from "../contexts/ShoppingCartContext";
import congresssus, { ProductType } from "../api/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//todo import congressus and fix functiuon
export function Sidebar() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useContext(UserContext);
  const [cart, setCart] = useContext(ShoppingCartContext);
  console.log({ user });

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  const logOut = () => {
    localStorage.removeItem("sNumber");

    setUser(null);
    setLoggedIn(false);
    setCart([]);
  };

  const emptyCart = () => {
    setCart([]);
  };
  let addSalesAndLogOut = () => {
    let items = cart
      .filter((x: ProductType, i: number) => cart.indexOf(x) === i)
      .map((x: ProductType) => {
        return {
          product_offer_id: x.product_offer_id,
          quantity: cart.reduce(
            (a: number, v: ProductType) => (v === x ? a + 1 : a),
            0
          ),
        };
      });
    congresssus.addSaleToMember(user.id, items).then(() => {
      logOut();
    });

    console.log(items);
  };

  console.log({ cart });

  return (
    <Nav className="h-full mr-5 text-center">
      <div className="ml-2 inline-block">
        <p className="font-semibold h-8">
          {user?.first_name} ({user?.username})
        </p>
        <Button className="mx-2" variant="danger" size="lg" onClick={logOut}>
          Log uit
        </Button>
        <Button variant="danger" size="lg" onClick={emptyCart}>
          <FontAwesomeIcon icon={"trash"}></FontAwesomeIcon>
        </Button>
        {cart
          .filter((x: ProductType, i: number) => cart.indexOf(x) === i)
          .map((x: ProductType) => {
            return {
              e: x,
              count: cart.reduce(
                (a: number, v: ProductType) => (v === x ? a + 1 : a),
                0
              ),
            };
          })
          .map((productWithCount: { e: ProductType; count: number }) => (
            <Card className="mt-2 flex-row w-64" key={productWithCount.e.id}>
              <Card.Img
                className="w-14 inline"
                src={productWithCount.e.media}
              />
              <Card.Body>
                <Card.Title>{productWithCount.e.name}</Card.Title>
                <div className="w-full flex">
                  <Button variant="secondary" className="max-h-28 inline">
                    {productWithCount.count}
                  </Button>

                  <Button
                    className="max-h-28 inline"
                    onClick={() => setCart([...cart, productWithCount.e])}
                  >
                    +
                  </Button>

                  <Button
                    className="max-h-28 inline"
                    onClick={() => {
                      // have to make tempcart because otherwise the state won't update
                      let tempCart = cart.slice();
                      tempCart.splice(tempCart.indexOf(productWithCount.e), 1);
                      setCart(tempCart);
                    }}
                  >
                    -
                  </Button>
                </div>
                <p className="mt-2 text-right">
                  €
                  {(
                    (productWithCount.count * productWithCount.e.price) /
                    100
                  ).toFixed(2)}{" "}
                  ({productWithCount.count})
                </p>
              </Card.Body>
            </Card>
          ))}

        <p className="mt-3 text-lg">
          Totaal: €
          {cart
            .reduce((a: number, b: ProductType) => a + b.price / 100, 0)
            .toFixed(2)}
        </p>
        {cart.length > 0 ? (
          <Button className="m-4" variant="success" onClick={addSalesAndLogOut}>
            Kopen en uitloggen
          </Button>
        ) : (
          <Button className="m-4 text-white" variant="light" disabled>
            Kopen en uitloggen
          </Button>
        )}
      </div>
    </Nav>
  );
}
