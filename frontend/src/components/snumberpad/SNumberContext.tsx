import React, { createContext, Dispatch, useReducer } from "react";

// Max SNumberType length
const MAX_SNUMBER_LENGTH = 7;

// Possible prefixes for SNumberType
const SNumberPrefix = ["s", "m", "x"] as const;

// SNumberType number contents
type SNumberType = {
  prefix : typeof SNumberPrefix[number];
  number : string;
};

// Initial number for SNumberType
const initialSNumber : SNumberType = {
  prefix: "s",
  number: "",
};

// Actions which can be taken on the SNumberType number.
type SNumberActionType =
  | { type : "add"; nr : number }
  | { type : "remove" }
  | { type : "clear" }
  | { type : "togglePrefix" }
  | { type : "setPrefix", prefix : typeof SNumberPrefix[number] };

/**
 * Reducer function for actions on the student number
 * @param currSNumber Current SNumberType number
 * @param action Action object
 */
const sNumberReducer = (currSNumber : SNumberType, action : SNumberActionType) : SNumberType => {
  switch (action.type) {
    case "add": // Add a number to the s number
      if (currSNumber.number.length < MAX_SNUMBER_LENGTH) {  // Check if SNumberType is not too long
        return {
          ...currSNumber,  // Copy existing SNumberType
          number: currSNumber.number + action.nr, // Add the new number
        };

      } else {  // There are too many characters in the s number, do not add the new number
        return {...currSNumber};
      }

    case "remove": // Remove the last number of the s number
      return {
        ...currSNumber,  // Copy existing SNumberType
        number: currSNumber.number.slice(0, -1),  // Remove last element in string
      };

    case "clear": // Replace the entire s number with the initial s number
      return {
        ...initialSNumber,
      };

    case "togglePrefix": // Replace first character of the s number
      const currPrefixIndex = SNumberPrefix.indexOf(currSNumber.prefix);  // Obtain index of current prefix
      return {
        ...currSNumber,
        prefix:
          SNumberPrefix[(currPrefixIndex + 1) % SNumberPrefix.length],  // Set new prefix index or wrap around to 0
      };

    case "setPrefix":  // Set the prefix to the passed value
      return {
        ...currSNumber,
        prefix: action.prefix
      };
  }
}

// Context to pass along
type SNumberContextType = {
  sNumber : SNumberType
  sNumberDispatch : Dispatch<SNumberActionType>
}

// Store to keep track of SNumberType number, basically the storage of the context
const SNumberContext = createContext<SNumberContextType>({} as SNumberContextType);

// User context provider
const SNumberContextProvider : React.FC = (props) => {
  const [state, dispatch] = useReducer<React.Reducer<SNumberType, SNumberActionType>>(sNumberReducer, initialSNumber);

  return <SNumberContext.Provider value={{sNumber: state, sNumberDispatch: dispatch}}>
    {props.children}
  </SNumberContext.Provider>
}

// Exports
export default SNumberContextProvider;
export type { SNumberType, SNumberActionType, SNumberContextType };
export { SNumberPrefix, SNumberContext };