import React from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useEventListener from "../../hooks/useEventListener";

import { useAuth } from "../auth/AuthContext";
import { SNumberAction, SNumberContextProvider, useSNumber } from "./SNumberContext";

import LocalAPIRequestButton from "../../api/LocalAPIRequestButton";
import SNumberPadButton from "./SNumberPadButton";

import "./SNumberPad.css";

// Props sent to SNumberPadFrame
type SNumberPadFrameProps = {
  login : (username : string) => void,
}

// SNumberPad frame which holds all visual elements of the SNumberPad
const SNumberPadFrame : React.FC<SNumberPadFrameProps> = (props) => {
  // SNumber context
  const sNumber = useSNumber();
  const auth = useAuth();

  // Function is called when the submit button is pressed or the enter key is pressed.
  const onSubmit = React.useCallback(() => {
    props.login(sNumber.toString());  // Attempt the login
  }, [props, sNumber]);

  // Handle a keypress on the input field
  const handleKeyPress = (event : KeyboardEvent) : void => {
    switch (event.key) {
      case "Enter":
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
        sNumber.add(parseInt(event.key));
        break;

      // One of the prefix keys is pressed
      case "s":
      case "x":
      case "m":
        sNumber.setPrefix(event.key);
        break;
    }
  };

  // Use the custom event listener hook to listen to key presses in a correct way
  useEventListener(
    "keydown",
    handleKeyPress,
    () => {
      sNumber.clear();
    },
  );

  // Return component
  return <SNumberContextProvider> {/* Context provider for SNumber */}
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
  </SNumberContextProvider>;
};

// Exports
export default SNumberPadFrame;
