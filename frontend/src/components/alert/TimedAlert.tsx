import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import useTimeout from "../../hooks/useTimeout";
import useUpdateEffect from "../../hooks/useUpdateEffect";
import { useAlert } from "./AlertContext";

const TimedAlert : React.FC = () => {
  // Obtain alert state from context
  const alert = useAlert();

  // Current delay state
  const [delay, setDelay] = useState<number | null>(alert.currAlert.timeout);

  // Timeout hook
  useTimeout(() => alert.hide, delay);

  // Start the timer when the Alert component is updated AFTER its initial load
  useUpdateEffect(() => {
    setDelay(alert.currAlert.timeout);
  }, [alert.currAlert]);

  const closeAlert = () => {
    setDelay(null);
    alert.hide();  // Disable the alert display
  };

  // Display the alert if alert.display is not null
  if (alert.currAlert.display) {
    return (
      <Alert variant={alert.currAlert.display.variant} onClose={() => closeAlert()} dismissible>
        {alert.currAlert.display.heading && <Alert.Heading>{alert.currAlert.display.heading}</Alert.Heading>}
        <p>
          {alert.currAlert.display.message}
        </p>
      </Alert>
    );

  } else {  // Display nothing if alert.display is null
    return null;
  }
};


// Exports
export default TimedAlert;