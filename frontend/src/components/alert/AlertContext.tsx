import React, { createContext, useContext, useState } from "react";
import { Variant } from "react-bootstrap/types";

// State of the alert
type AlertStateType = {
  display : {  // What to display
    heading? : string  // Optional heading message
    message : string  // Alert message
    variant : Variant  // Bootstrap variant
  } | null  // Display may be null to not display anything
  timeout : number | null  // Optional timeout in miliseconds
}

// Initial alert state
const initialAlertState : AlertStateType = {display: null, timeout: null};

// Context type to pass along, all functions and variables present in the context
type AlertContextType = {
  currAlert : AlertStateType
  set : (alert : AlertStateType) => void
  hide : () => void
}

// Actual context, store of the current state
const AlertContext = createContext<AlertContextType>({} as AlertContextType);

/**
 * Custom hook as shorthand for using the AlertContext
 * @returns {AlertContextType}
 */
const useAlert = () => {
  return useContext(AlertContext);
};

// React component
const AlertContextProvider : React.FC = (props) => {
  const [currAlert, setCurrAlert] = useState(initialAlertState);

  /**
   * Set the alert
   * @param {AlertStateType} alert The alert configuration to set
   */
  const set = (alert : AlertStateType) => {
    setCurrAlert(alert);
  };

  /**
   * Hide the alert
   */
  const hide = () => {
    setCurrAlert(initialAlertState);
  };

  return (
    <AlertContext.Provider value={{currAlert: currAlert, set: set, hide: hide}}>
      {props.children}
    </AlertContext.Provider>
  );
};


// Exports
export default AlertContext;
export { AlertContextProvider, initialAlertState, useAlert };
export type { AlertStateType, AlertContextType };