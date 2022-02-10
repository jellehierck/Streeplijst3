import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
// import { Redirect } from "react-router-dom";
import { SNumberContext } from "./SNumberContext";

import "./SNumberPad.css";
import SNumberPadButton from "./SNumberPadButton";

// Props sent to SNumberPad
type SNumberPadProps = {}

// React component
const SNumberPad : React.FC<SNumberPadProps> = (props) => {

  const {sNumber, sNumberDispatch} = useContext(SNumberContext);

  // Handle a keypress on the input field
  const handleKeyPress = (event : KeyboardEvent) : void => {
    switch (event.key) {
      case "Enter":
        // TODO logIn(number)
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
  });

  // const [_, setUser] = useContext(UserContext);

  // To navigate to other links
  let navigate = useNavigate();

  // restartTimer error and try to fetch the member, if success, load number into localStorage
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("sNumber"))
  );
  const [errored, setErrored] = useState(false);

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
              </svg>
            </span>
          </div>
        ) : null}

        <Row className="numpad-row">
          <InputGroup className="mb-3">
            <FormControl value={sNumber.prefix + sNumber.number}
                         size="lg"
                         onChange={() => { // We ignore the onChange function as we handle this elsewhere
                         }}
                         aria-label="Student number input"
                         aria-describedby="s-number-input" />
            <Button variant="success"
                    className="btn-sq-md"
              // onClick={() => logIn(sNumber)}
            >
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
// export type { SNumberAction };
// export { SNumberPrefix }
