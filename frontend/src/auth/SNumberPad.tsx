import React, { useReducer } from "react";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SNumberPad.css";
import congressus from "../api/API";

/**
 * Possible prefixes for an SNumber.
 */
const SNumberPrefixes = ["s", "m", "x"] as const;

/**
 * SNumber state contents.
 */
type SNumberState = {
  prefix: typeof SNumberPrefixes[number];
  sNumber: string;
};

/**
 * Initial state for the SNumber
 */
const initialSNumberState: SNumberState = {
  prefix: "s",
  sNumber: "",
};

/**
 * Actions which can be taken on the SNumber state.
 */
type SNumberAction =
  | { type: "add"; nr: number }
  | { type: "remove" }
  | { type: "clear" }
  | { type: "togglePrefix" };

// React component
function SNumberPad() {
  function logIn(sNumber: SNumberState) {
    congressus
      .getMemberByUsername(sNumber.prefix + sNumber.sNumber)
      .then((member) => console.log(member))
      .catch();
  }

  function sNumberReducer(
    currState: SNumberState,
    action: SNumberAction
  ): SNumberState {
    switch (action.type) {
      case "add": // Add a number to the s number
        return {
          ...currState,
          sNumber: currState.sNumber + action.nr,
        };

      case "remove": // Remove the last number of the s number
        return {
          ...currState,
          sNumber: currState.sNumber.slice(0, -1),
        };

      case "clear": // Replace the entire s number with the initial s number
        return {
          ...initialSNumberState,
        };
      case "togglePrefix": // Replace first character of the s number
        const indexOfCurrentPrefix = SNumberPrefixes.indexOf(currState.prefix);
        return {
          ...currState,
          prefix:
            SNumberPrefixes[
              (indexOfCurrentPrefix + 1) % SNumberPrefixes.length
            ],
        };
    }
  }

  const [sNumber, sNumberDispatch] = useReducer(
    sNumberReducer,
    initialSNumberState
  );

  return (
    <div>
      <Row className="numpad-row">
        <InputGroup className="mb-3">
          <FormControl
            value={sNumber.prefix + sNumber.sNumber}
            aria-label="Student number input"
            aria-describedby="s-number-input"
          />
          <Button
            variant="success"
            className="btn-sq-md"
            onClick={() => logIn(sNumber)}
          >
            <FontAwesomeIcon icon={["far", "check-circle"]} />
          </Button>
        </InputGroup>
      </Row>
      <Row className="numpad-row">
        <ButtonGroup
          className="btn-group-no-padding"
          aria-label="Basic example"
        >
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 1 })}
          >
            <h1>1</h1>
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 2 })}
          >
            <h1>2</h1>
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 3 })}
          >
            <h1>3</h1>
          </Button>
        </ButtonGroup>
      </Row>
      <Row className="numpad-row">
        <ButtonGroup
          className="btn-group-no-padding"
          aria-label="Basic example"
        >
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 4 })}
          >
            <h1>4</h1>
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 5 })}
          >
            <h1>5</h1>
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 6 })}
          >
            <h1>6</h1>
          </Button>
        </ButtonGroup>
      </Row>
      <Row className="numpad-row">
        <ButtonGroup
          className="btn-group-no-padding"
          aria-label="Basic example"
        >
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 7 })}
          >
            <h1>7</h1>
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 8 })}
          >
            <h1>8</h1>
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 9 })}
          >
            <h1>9</h1>
          </Button>
        </ButtonGroup>
      </Row>
      <Row className="numpad-row">
        <ButtonGroup
          className="btn-group-no-padding"
          aria-label="Basic example"
        >
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "togglePrefix" })}
          >
            {SNumberPrefixes.join("/")}
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "add", nr: 0 })}
          >
            <h1>0</h1>
          </Button>
          <Button
            variant="secondary"
            className="btn-sq-md"
            onClick={() => sNumberDispatch({ type: "remove" })}
          >
            <FontAwesomeIcon icon={["fas", "backspace"]} />
          </Button>
        </ButtonGroup>
      </Row>
    </div>
  );
}

// Exports
export default SNumberPad;
