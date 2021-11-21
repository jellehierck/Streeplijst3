import { Button, Card, Nav } from "react-bootstrap";
import { useState } from "react";
import { Redirect } from "react-router";

export function User(props: any) {
  const { member } = props;
  const [loggedIn, setLoggedIn] = useState(true);

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  const logOut = () => {
    localStorage.removeItem("sNumber");
    setLoggedIn(false);
  };
  return (
    <Nav>
      <div className="ml-2 inline-block">
        <p className="font-semibold h-8">
          {member?.first_name} ({member?.username})
        </p>
        <Button variant="danger" size="lg" onClick={logOut}>
          Log uit
        </Button>
      </div>
    </Nav>
  );
}
