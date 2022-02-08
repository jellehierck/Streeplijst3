import React, { createContext, Dispatch, useReducer } from "react";
import { Variant } from "react-bootstrap/types";

// Possible action values
const enum AlertAction {
  SHOW = "SHOW",
  HIDE = "HIDE",
}

// Possible action groups to be performed on the Alert
type AlertActionType = { type : AlertAction.SHOW, payload : AlertStateType }
  | { type : AlertAction.HIDE }

type AlertStateType = {
  display : {  // What to display
    heading? : string  // Optional heading message
    message : string  // Alert message
    variant : Variant  // Bootstrap variant
  } | null  // Display may be null to not display anything
  timeout : number | null  // Optional timeout in miliseconds
}

// Initial alert state
const initialAlertState = {display: null, timeout: null};

/**
 *
 * @param state
 * @param action
 */
const alertReducer = (state : AlertStateType, action : AlertActionType) : AlertStateType => {
  switch (action.type) {
    case AlertAction.SHOW:  // Show the alert
      return action.payload;

    case AlertAction.HIDE:  // Hide the alert
      return initialAlertState;
  }
}

// Context type to pass along
type AlertContextType = {
  alert : AlertStateType
  alertDispatch : Dispatch<AlertActionType>
}

// Actual context, store of the current state
const AlertContext = createContext<AlertContextType>({} as AlertContextType);

// React component
const AlertContextProvider : React.FC = (props) => {
  const [alert, alertDispatch] = useReducer<React.Reducer<AlertStateType, AlertActionType>>(alertReducer, initialAlertState);

  return (
    <AlertContext.Provider value={{alert: alert, alertDispatch: alertDispatch}}>
      {props.children}
    </AlertContext.Provider>
  );
}


// Exports
export default AlertContext;
export { AlertContextProvider, initialAlertState, AlertAction };
export type { AlertStateType, AlertContextType, AlertActionType };