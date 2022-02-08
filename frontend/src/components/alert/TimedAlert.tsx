import React, { useContext, useState } from "react";
import { Alert } from "react-bootstrap";
import useTimeout from "../../hooks/useTimeout";
import AlertContext, { AlertAction } from "../../contexts/AlertContext";
import useUpdateEffect from "../../hooks/useUpdateEffect";

const TimedAlert : React.FC = (props) => {
  // Obtain alert state from context
  const {alert, alertDispatch} = useContext(AlertContext);

  // Current delay state
  const [delay, setDelay] = useState<number | null>(alert.timeout);

  // Timeout hook
  useTimeout(() => alertDispatch({type: AlertAction.HIDE}), delay);

  // Start the timer when the Alert component is updated AFTER its initial load
  useUpdateEffect(() => {
    setDelay(alert.timeout);
  }, [alert]);

  const closeAlert = () => {
    setDelay(null);
    alertDispatch({type: AlertAction.HIDE});  // Disable the alert display
  }

  // Display the alert if alert.display is not null
  if (alert.display) {
    return (
      <Alert variant={alert.display.variant} onClose={() => closeAlert()} dismissible>
        {alert.display.heading && <Alert.Heading>{alert.display.heading}</Alert.Heading>}
        <p>
          {alert.display.message}
        </p>
      </Alert>
    );

  } else {  // Display nothing if alert.display is null
    return null
  }
}


// Exports
export default TimedAlert;