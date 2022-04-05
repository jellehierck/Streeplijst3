import React from "react";

import Button, { ButtonProps } from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Stack, { StackDirection } from "react-bootstrap/Stack";

// Extend the button props so that the request result is also passed in
interface LocalAPIRequestButtonProps extends ButtonProps {
  // Whether the API is currently loading
  loading : boolean;

  // Optional direction to put the loading spinner in
  stackDirection? : StackDirection;

  // Optional smaller spinner size
  spinnerSize? : "sm";
}

// Button meant for react-query requests (queries or mutations) which is disabled when the request is active
const LocalAPIRequestButton : React.FC<LocalAPIRequestButtonProps> = ({
  loading,
  children,
  stackDirection,
  spinnerSize,
  ...buttonProps
}) => {
  // Determine whether the linked react-query request is loading
  if (!loading) {  // If not loading, display the button as is
    return <Button {...buttonProps} /* Destructure all properties to pass all to the Button */ >
      {children}
    </Button>;

  } else { // If loading, display the button as disabled and with a loading spinner
    return <Button {...buttonProps} // Destructure all properties to pass all to the Button
                   disabled={true} /* Force disable on the button */ >
      <Stack direction={stackDirection}
             gap={2}>
        {children}

        {/* Also add a spinning animation */}
        <Spinner size={spinnerSize}
                 as="span"
                 animation="border"
                 role="status"
                 aria-hidden="true" />
      </Stack>
    </Button>;
  }
};

// Exports
export default LocalAPIRequestButton;