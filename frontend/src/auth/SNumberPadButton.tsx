import React from "react";

import Button from "react-bootstrap/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SNumberAction, SNumberPrefix } from "./SNumberPad";

type SNumberPadButtonProps = {
  dispatch : React.Dispatch<SNumberAction>,
  action : SNumberAction
}

// React component
const SNumberPadButton : React.FC<SNumberPadButtonProps> = (props) => {
  const {dispatch, action} = props;

  // Determines what to display based on the action passed to this button
  const buttonText = () : JSX.Element => {
    switch (action.type) {
      case "add":  // Display the number to add
        return <h1>{action.nr}</h1>;

      case "remove": // Remove the last number
        // return <h6>back</h6>
        return <FontAwesomeIcon icon={["fas", "backspace"]} />;

      case "togglePrefix": // Toggle the prefix
        return <h1>{SNumberPrefix.join("/")}</h1>;

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