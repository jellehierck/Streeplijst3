import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Col, Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import Row from "react-bootstrap/Row";
import LocalAPIRequestButton from "../../api/LocalAPIRequestButton";
import { useAuth } from "../auth/AuthContext";
import { SNumberAction, useSNumber } from "./SNumberContext";

import "./SNumberPad.css";
import SNumberPadButton from "./SNumberPadButton";

// Props sent to SNumberPad
type SNumberPadProps = {
  login : (username : string) => void,
}

// React component
const SNumberPad : React.FC<SNumberPadProps> = (props) => {
  // SNumber context
  const sNumber = useSNumber();
  const auth = useAuth();

  /**
   * Function is called when the submit button is pressed or the enter key is pressed.
   */
  const onSubmit = () => {
    props.login(sNumber.toString());  // Attempt the login
    sNumber.clear();
  };

  // Handle a keypress on the input field
  const handleKeyPress = (event : KeyboardEvent) : void => {
    switch (event.key) {
      case "Enter":
        // TODO: Set spinner and block login
        onSubmit();
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
          <LocalAPIRequestButton variant="success"
                                 className="numpad-btn"
                                 onClick={onSubmit}
                                 loading={auth.memberRes.isFetching}>
            <h3 className="text-reset">
              <FontAwesomeIcon icon={["fas", "paper-plane"]} />
            </h3>
          </LocalAPIRequestButton>
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
