import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import Button from "react-bootstrap/Button"
import { SNumberActionType, SNumberPrefix } from "./SNumberContext";

type SNumberPadButtonProps = {
  action : SNumberActionType
  dispatch : React.Dispatch<SNumberActionType>,
}

// React component
const SNumberPadButton : React.FC<SNumberPadButtonProps> = (props) => {
  const {action, dispatch} = props;

  // Determines what to display based on the action passed to this button
  const buttonText = () : JSX.Element => {
    switch (action.type) {
      case "add":  // Display the number to add
        return <h2>{action.nr}</h2>;

      case "remove": // Remove the last number
        return <h2><FontAwesomeIcon icon={["fas", "backspace"]} /></h2>;

      case "togglePrefix": // Toggle the prefix
        return <h4>{SNumberPrefix.join("/")}</h4>;

      default:  // Any other action displays nothing
        return <></>;
    }
  }

  return (
    <Button className="btn-sq-md"
            variant="secondary"
            onClick={() => dispatch(action)}>
      {buttonText()}
    </Button>
  );
}


// Exports
export default SNumberPadButton;