import React, { useContext, useEffect, useReducer, useState } from "react";

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
import SNumberPadButton from "./SNumberPadButton";

// Max SNumber length
const MAX_SNUMBER_LENGTH = 7;

// Possible prefixes for SNumber
const SNumberPrefix = ["s", "m", "x"] as const;

// SNumber state contents
type SNumber = {
  prefix : typeof SNumberPrefix[number];
  sNumber : string;
};

// Initial state for SNumber
const initialSNumberState : SNumber = {
  prefix: "s",
  sNumber: "",
};

/**
 * Actions which can be taken on the SNumber state.
 */
type SNumberAction =
  | { type : "add"; nr : number }
  | { type : "remove" }
  | { type : "clear" }
  | { type : "togglePrefix" }
  | { type : "setPrefix", prefix : typeof SNumberPrefix[number] };

// Props sent to SNumberPad
type SNumberPadProps = {}

// React component
const SNumberPad : React.FC<SNumberPadProps> = (props) => {

  /**
   * Reducer function for actions on the student number
   * @param currSNumber Current SNumber state
   * @param action Action object
   */
  const sNumberReducer = (currSNumber : SNumber, action : SNumberAction) : SNumber => {
    switch (action.type) {
      case "add": // Add a number to the s number
        if (currSNumber.sNumber.length < MAX_SNUMBER_LENGTH) {  // Check if SNumber is not too long
          return {
            ...currSNumber,  // Copy existing SNumber
            sNumber: currSNumber.sNumber + action.nr, // Add the new number
          };

        } else {  // There are too many characters in the s number, do not add the new number
          return {...currSNumber};
        }

      case "remove": // Remove the last number of the s number
        return {
          ...currSNumber,  // Copy existing SNumber
          sNumber: currSNumber.sNumber.slice(0, -1),  // Remove last element in string
        };

      case "clear": // Replace the entire s number with the initial s number
        return {
          ...initialSNumberState,
        };

      case "togglePrefix": // Replace first character of the s number
        const currPrefixIndex = SNumberPrefix.indexOf(currSNumber.prefix);  // Obtain index of current prefix
        return {
          ...currSNumber,
          prefix:
            SNumberPrefix[(currPrefixIndex + 1) % SNumberPrefix.length],  // Set new prefix index or wrap around to 0
        };

      case "setPrefix":  // Set the prefix to the passed value
        return {
          ...currSNumber,
          prefix: action.prefix
        };
    }
  }

  // Create reducer hook for accessing and updating the current SNumber
  const [sNumber, sNumberDispatch] = useReducer(sNumberReducer, initialSNumberState);

  // Handle a keypress on the input field
  const handleKeyPress = (event : KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
        logIn(sNumber)
        sNumberDispatch({type: "clear"});  // Clear the input field
        break;

      case "Backspace":
        sNumberDispatch({type: "remove"});  // Remove the last number
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
        sNumberDispatch({type: "add", nr: +event.key});  // Convert string to number using unary operator (+)
        break;

      // One of the prefix keys is pressed
      case "s":
      case "x":
      case "m":
        sNumberDispatch({type: "setPrefix", prefix: event.key})
        break;
    }
  };

  // Use the Effect to bind any keypresses to the s number field
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return function cleanup() {  // Unregister the event listener when this component is unloaded
      document.removeEventListener("keydown", handleKeyPress);
    }
  }, []);


  const [_, setUser] = useContext(UserContext);

  // reset error and try to fetch the member, if success, load sNumber into localStorage
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("sNumber"))
  );
  const [errored, setErrored] = useState(false);

  // Log in a user with this SNumber
  function logIn(sNumber : SNumber) : void {
    setErrored(false);

    congressus
      .getMemberByUsername(sNumber.prefix + sNumber.sNumber)
      .then((member) => {
        localStorage.setItem("sNumber", sNumber.prefix + sNumber.sNumber);
        setUser(member);
        setLoggedIn(true);
      })
      .catch((e) => {
        // todo this is bad, dont code like this
        setErrored(true);
        // if (e.message === "invalid sNumber") {
        //   setErrored(true); // show scary banner
        // }
      });
  }

  // redirect if authenticated
  if (loggedIn) return <Redirect to="/folders" />;

  // Return component
  return (
    <div className="flex justify-center">
      <div>
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
                {/*<path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />*/}
              </svg>
            </span>
          </div>
        ) : null}

        <Row className="numpad-row">
          <InputGroup className="mb-3">
            <FormControl value={sNumber.prefix + sNumber.sNumber}
                         onChange={() => {
                         }}  // We ignore the onChange function as we handle this elsewhere
                         aria-label="Student number input"
                         aria-describedby="s-number-input" />
            <Button variant="success"
                    className="btn-sq-md"
                    onClick={() => logIn(sNumber)}>
              <FontAwesomeIcon icon={["far", "check-circle"]} />
            </Button>
          </InputGroup>
        </Row>

        <Row className="numpad-row">
          <ButtonGroup className="btn-group-no-padding">
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 1}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 2}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 3}} />
          </ButtonGroup>
        </Row>

        <Row className="numpad-row">
          <ButtonGroup className="btn-group-no-padding">
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 4}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 5}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 6}} />
          </ButtonGroup>
        </Row>

        <Row className="numpad-row">
          <ButtonGroup className="btn-group-no-padding">
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 7}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 8}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 9}} />
          </ButtonGroup>
        </Row>

        <Row className="numpad-row">
          <ButtonGroup className="btn-group-no-padding">
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "togglePrefix"}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "add", nr: 0}} />
            <SNumberPadButton dispatch={sNumberDispatch}
                              action={{type: "remove"}} />
          </ButtonGroup>
        </Row>
      </div>
    </div>
  );
}

// Exports
export default SNumberPad;
export type { SNumberAction };
export { SNumberPrefix }
