import React, { useContext, useReducer, useState } from "react";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SNumberPad.css";
import congressus from "../api/API";
import { Redirect } from "react-router";
import { UserContext } from "../contexts/UserContext";

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
  const [_, setUser] = useContext(UserContext);

  // reset error and try to fetch the member, if success, load sNumber into localStorage
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("sNumber"))
  );
  const [errored, setErrored] = useState(false);

  function logIn(sNumber: SNumberState) {
    setErrored(false);

    congressus
      .getMemberByUsername(sNumber.prefix + sNumber.sNumber)
      .then((member) => {
        localStorage.setItem("sNumber", sNumber.prefix + sNumber.sNumber);
        setUser(member);
        setLoggedIn(true);
      })
      .catch((e) => {
        // this is bad, dont code like this
        if (e.message === "invalid sNumber") {
          setErrored(true); // show scary banner
        }
      });
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

  // redirect if authenticated
  if (loggedIn) return <Redirect to="/folders" />;

  return (
    <div className="mx-24">
      {errored ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 relative"
          role="alert"
        >
          <p className="font-bold">Wrong student number</p>
          <p>we couldn't find this student number.</p>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      ) : null}
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
