import React from "react";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SNumberAction, SNumberActionType, SNumberPrefix, useSNumber } from "./SNumberContext";

// Properties
type SNumberPadButtonProps = {

  // Action to take on button press
  action : SNumberActionType
}

// Button in the SNumberPad
const SNumberPadButton : React.FC<SNumberPadButtonProps> = (props) => {
  // Use sNumber context
  const sNumber = useSNumber();

  // Determines what to display based on the action passed to this button
  const buttonText = () : JSX.Element => {
    switch (props.action.type) {
      case SNumberAction.ADD:  // Display the number to add
        return <h2>{props.action.nr}</h2>;

      case SNumberAction.REMOVE: // Remove the last number
        return <h2><FontAwesomeIcon icon={["fas", "backspace"]} /></h2>;

      case SNumberAction.TOGGLE_PREFIX: // Toggle the prefix
        return <h4>{SNumberPrefix.join("/")}</h4>;

      default:  // Any other action displays nothing
        return <></>;
    }
  };

  return (
    <Button className="numpad-btn"
            variant="outline-secondary"
            onClick={() => sNumber.dispatch(props.action)}>
      {buttonText()}
    </Button>
  );
};


// Exports
export default SNumberPadButton;