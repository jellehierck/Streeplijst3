import { Button, Card, Nav } from "react-bootstrap";
import { useContext, useState } from "react";
import { Redirect } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { Stepper } from "./Stepper";
import { ShoppingCartContext } from "../contexts/ShoppingCartContext";
import { ProductType } from "../api/API";

export function Sidebar() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useContext(UserContext);
  const [cart, setCart] = useContext(ShoppingCartContext);

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  const logOut = () => {
    localStorage.removeItem("sNumber");

    setUser(null);
    setLoggedIn(false);
  };

  return (
    <Nav className="h-full mr-9">
      <div className="ml-2 inline-block">
        <p className="font-semibold h-8">
          {user?.first_name} ({user?.username})
        </p>
        <Button variant="danger" size="lg" onClick={logOut}>
          Log uit
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
            <Card className="mt-2 flex-row" key={productWithCount.e.id}>
              <Card.Img className="w-16" src={productWithCount.e.media} />
              <Card.Body>
                <Card.Title>{productWithCount.e.name}</Card.Title>
                <div className="w-full">
                  <Button variant="secondary" className="max-h-28">
                    {productWithCount.count}
                  </Button>
                  <Button
                    className=" max-h-28 float-right"
                    onClick={() => setCart([...cart, productWithCount.e])}
                  >
                    +
                  </Button>

                  <Button
                    className=" max-h-28 float-right"
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
                <p className="mt-3 text-right">
                  €
                  {(
                    (productWithCount.count * productWithCount.e.price) /
                    100
                  ).toFixed(2)}
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
        <Button className="mt-4" variant="success">
          Kopen en uitloggen
        </Button>
      </div>
    </Nav>
  );
}
