import React from "react";

import Button, { ButtonProps } from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

// Extend the button props so that the request result is also passed in
interface LocalAPIRequestButtonProps extends ButtonProps {
  loading : boolean;
}

// Button meant for react-query requests (queries or mutations) which is disabled when the request is active
const LocalAPIRequestButton : React.FC<LocalAPIRequestButtonProps> = (props) => {
  // Determine whether the linked react-query request is loading
  if (!props.loading) {  // If not loading, display the button as is
    return <Button {...props} /* Destructure all properties to pass all to the Button */ >
      {props.children}
    </Button>;

  } else { // If loading, display the button as disabled and with a loading spinner
    return <Button {...props} // Destructure all properties to pass all to the Button
                   disabled={true} /* Force disable on the button */ >
      {props.children}

      {/* Also add a spinning animation */}
      <Spinner
        // size="sm"
        as="span"
        animation="border"
        role="status"
        aria-hidden="true" />
    </Button>;
  }
};

// Exports
export default LocalAPIRequestButton;