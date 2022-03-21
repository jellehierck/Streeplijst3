import React, { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import useTimeout from "../../hooks/useTimeout";
import LogoutButton from "../auth/LogoutButton";

import { ContentContainer } from "../layout/Layout";
import TimedProgressBar from "../progress-bar/TimedProgressBar";
import UserInformation from "../user/UserInformation";

type CheckoutProps = {
  // Optional time until redirect, if set to null the redirect is canceled
  timeUntilRedirect? : number
}

const defaultTimeout = 15000; // 15 seconds

// Checkout page, displays a checkout message and redirects after timeUntilRedirect ms.
const Checkout : React.FC<CheckoutProps> = ({
  timeUntilRedirect = defaultTimeout,  // Default timeout is 15 seconds
}) => {
  const [timeoutStopped, setTimeoutStopped] = React.useState<boolean>(false);

  // Function to fire upon redirect
  const onRedirect = () => {
    console.log("Timeout fired, redirecting...");
  };

  // Function to fire when the timeout is finished
  const onTimeout = () => {
    console.log("Checkout timeout fired");
    onRedirect();
  };

  // Function which cancels the timeout
  const stopTimeout = () => {
    setTimeoutStopped(true);
  };

  // Timeout hook, starts the timer when a delay is given and is canceled when the Checkout component is unmounted
  useTimeout(onTimeout, timeUntilRedirect);

  return <ContentContainer>
    <p>Je hebt betaald</p>
    <UserInformation />
    <LogoutButton />

    <Stack direction="horizontal"
           gap={3}
           className="w-100">
      <Button onClick={stopTimeout}
              variant="outline-primary">
        Stop automatisch uitloggen
      </Button>
      <TimedProgressBar timeout={timeUntilRedirect}
                        onTimeout={onTimeout}
                        stopped={timeoutStopped}
                        className="w-100"
                        labelAs="h5"
                        style={{height: "3em"}}
                        variant="primary" />
    </Stack>
  </ContentContainer>;
};


// Exports
export default Checkout;