import { Button, Card, Nav } from "react-bootstrap";
import { useContext, useState } from "react";
import { Redirect } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { Stepper } from "./Stepper";

export function Sidebar() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useContext(UserContext);

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  const logOut = () => {
    localStorage.removeItem("sNumber");

    setUser(null);
    setLoggedIn(false);
  };

  return (
    <Nav className="h-full mr-10">
      <div className="ml-2 inline-block">
        <p className="font-semibold h-8">
          {user?.first_name} ({user?.username})
        </p>
        <Button variant="danger" size="lg" onClick={logOut}>
          Log uit
        </Button>
        <Card className="mt-2 flex-row">
          <Card.Img
            className="w-16"
            src="https://congressus-paradoksutwente.s3-eu-west-1.amazonaws.com/files/a9c07cc367ca404a87184cc67c90c43c-md.jpeg"
          />
          <Card.Body>
            <Card.Title>Snelle jelle</Card.Title>
            <Stepper></Stepper>
          </Card.Body>
        </Card>
        <Card className="mt-2 flex-row">
          <Card.Img
            className="w-16"
            src="https://congressus-paradoksutwente.s3-eu-west-1.amazonaws.com/files/a9c07cc367ca404a87184cc67c90c43c-md.jpeg"
          />
          <Card.Body>
            <Card.Title>Snelle jelle</Card.Title>
            <Stepper></Stepper>
          </Card.Body>
        </Card>
        <Button className="mt-4" variant="success">
          Kopen en uitloggen
        </Button>
      </div>
    </Nav>
  );
}
