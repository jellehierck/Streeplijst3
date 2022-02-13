import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import useTimeout from "../../hooks/useTimeout";
import useUpdateEffect from "../../hooks/useUpdateEffect";
import { useAlert } from "./AlertContext";

const TimedAlert : React.FC = () => {
    // Obtain alert state from context
    const alertContext = useAlert();

    // Current delay state
    const [delay, setDelay] = useState<number | null>(alertContext.currAlert.timeout);

    // Start the timer when the alert context is updated AFTER its initial load
    useUpdateEffect(() => {
      setDelay(alertContext.currAlert.timeout);  // Start the delay
    }, [alertContext.currAlert]);

    // Stop the timer and hide the alert
    const closeAlert = () => {
      setDelay(null);  // Disable the delay
      alertContext.hide();  // Disable the alert display
    };

    // Timeout hook, starts the timer when a delay is given
    useTimeout(() => closeAlert(), delay);

    // Display the heading if one is given
    const displayHeading = () => {
      if (alertContext.currAlert.display?.heading) {
        return <Alert.Heading>
          {alertContext.currAlert.display.heading}
        </Alert.Heading>;
      }
    };

    // Display the alert if alert.display is not null
    if (alertContext.currAlert.display) {
      return (
        <Alert variant={alertContext.currAlert.display.variant}
               onClose={() => closeAlert()}
               dismissible>
          {displayHeading()}
          {alertContext.currAlert.display.message}
        </Alert>
      );

    } else {  // Display nothing if alert.display is null
      return null;
    }
  }
;


// Exports
export default TimedAlert;