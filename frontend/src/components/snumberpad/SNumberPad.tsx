import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
// import { Redirect } from "react-router-dom";
import { SNumberAction, useSNumber } from "./SNumberContext";

import "./SNumberPad.css";
import SNumberPadButton from "./SNumberPadButton";

// Props sent to SNumberPad
type SNumberPadProps = {}

// React component
const SNumberPad : React.FC<SNumberPadProps> = (props) => {
  // SNumber context
  const sNumber = useSNumber();

  // Handle a keypress on the input field
  const handleKeyPress = (event : KeyboardEvent) : void => {
    switch (event.key) {
      case "Enter":
        // TODO logIn(number)
        sNumber.clear();
        break;

      case "Backspace":
        sNumber.remove();  // Remove the last number
        break;

      // Any number is pressed
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        sNumber.add(+event.key);  // Convert string to number using unary operator (+)
        break;

      // One of the prefix keys is pressed
      case "s":
      case "x":
      case "m":
        sNumber.setPrefix(event.key);
        break;
    }
  };

  // Use the Effect to bind any keypresses to the s number field
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return function cleanup() {  // Unregister the event listener when this component is unloaded
      document.removeEventListener("keydown", handleKeyPress);
    };
  });

  // const [_, setUser] = useContext(UserContext);

  // To navigate to other links
  let navigate = useNavigate();

  // restartTimer error and try to fetch the member, if success, load number into localStorage
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("sNumber")),
  );
  // const [errored, setErrored] = useState(false);

  // Log in a user with this SNumberType
  // function logIn(sNumber : SNumberType) : void {
  //   setErrored(false);
  //
  //   congressus
  //     .getMemberByUsername(sNumber.prefix + sNumber.number)
  //     .then((member) => {
  //       localStorage.setItem("sNumber", sNumber.prefix + sNumber.number);
  //       setUser(member);
  //       setLoggedIn(true);
  //       navigate("/folders");  // Navigate to the folders page
  //     })
  //     .catch((e) => {
  //       // todo this is bad, dont code like this
  //       setErrored(true);
  //       // if (e.message === "invalid number") {
  //       //   setErrored(true); // show scary banner
  //       // }
  //     });
  // }

  // Return component
  return (
    <Stack direction="vertical"
           gap={0}
           className="mx-auto numpad-width">

      {/* Top row is current s number display and submit button */}
      <Row className="g-0 numpad-row">
        <Col xs={8}>
          {/* Display of the current s number */}
          <Button variant="outline-secondary"
                  className="numpad-row-height numpad-display text-start"
                  disabled>
            <h2>{sNumber.toString()}</h2>
          </Button>
        </Col>
        <Col xs={4}>
          {/* Submit button */}
          <Button variant="success"
                  className="numpad-btn">
            <h3 className="text-reset"><FontAwesomeIcon icon={["fas", "paper-plane"]} /></h3>
          </Button>
        </Col>
      </Row>

      {/* Rows of numbers */}
      <Row xs={3}
           className="g-0">
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 1}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 2}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 3}} /> </Col>
      </Row>

      <Row xs={3}
           className="g-0">
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 4}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 5}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 6}} /> </Col>
      </Row>

      <Row xs={3}
           className="g-0">
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 7}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 8}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 9}} /> </Col>
      </Row>

      {/* Row with additional controls */}
      <Row xs={3}
           className="g-0">
        <Col> <SNumberPadButton action={{type: SNumberAction.TOGGLE_PREFIX}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.ADD, nr: 0}} /> </Col>
        <Col> <SNumberPadButton action={{type: SNumberAction.REMOVE}} /> </Col>
      </Row>
    </Stack>
  );
};

// Exports
export default SNumberPad;
