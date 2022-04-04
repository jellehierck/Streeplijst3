import React from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import TimedProgressBar from "../progress-bar/TimedProgressBar";

type AutoLogoutTimerProps = {
  // Function to call upon redirect
  onTimeout : VoidFunction

  // Optional time until redirect, if set to null the redirect is canceled
  timeUntilRedirect? : number
}

const defaultTimeout = 15000; // 15 seconds

// Auto logout timer, displays a countdown timer which fires a function on expiration. Countdown timer can also be
// stopped.
const AutoLogoutTimer : React.FC<AutoLogoutTimerProps> = ({
  onTimeout,
  timeUntilRedirect = defaultTimeout,  // Default timeout is 15 seconds
}) => {
  const [timeoutStopped, setTimeoutStopped] = React.useState<boolean>(false);

  const onCountdownFinished = () => {
    setTimeoutStopped(true);
    onTimeout();
  };

  // Function which cancels the timeout
  const stopCountdown = () => {
    setTimeoutStopped(true);
  };

  return <Stack direction="vertical"
                gap={3}
                className="w-100">
    <Button variant="secondary"
            className="pb-0 pt-3"
            disabled>
      Je wordt uitgelogd over:
    </Button>
    <TimedProgressBar timeout={timeUntilRedirect}
                      onTimeout={onCountdownFinished}
                      stopped={timeoutStopped}
                      className="w-100"
                      labelAs="h5"
                      style={{height: "3em"}}
                      variant="primary" />
    <Button onClick={stopCountdown}
            variant="outline-primary">
      Stop automatisch uitloggen
    </Button>
  </Stack>;
};


// Exports
export default AutoLogoutTimer;