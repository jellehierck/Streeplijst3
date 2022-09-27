import React from "react";

// Max SNumberType length
const MAX_SNUMBER_LENGTH = 7;

// Possible prefixes for SNumberType
const SNumberPrefix = ["s", "m", "x"] as const;

// SNumberType number contents
type SNumberType = {
  // Current prefix
  prefix : typeof SNumberPrefix[number];

  // Current numerical part of the sNumber
  number : string;
};

// Initial number for SNumberType
const initialSNumber : SNumberType = {
  prefix: "s",
  number: "",
};

const enum SNumberAction {
  ADD = "ADD",
  REMOVE = "REMOVE",
  SET = "SET",
  CLEAR = "CLEAR",
  TOGGLE_PREFIX = "TOGGLE_PREFIX",
  SET_PREFIX = "SET_PREFIX"
}

// Actions which can be taken on the SNumberType number.
type SNumberActionType =
  | { type : SNumberAction.ADD, nr : number }
  | { type : SNumberAction.REMOVE }
  | { type : SNumberAction.SET, sNumber : SNumberType }
  | { type : SNumberAction.CLEAR }
  | { type : SNumberAction.TOGGLE_PREFIX }
  | { type : SNumberAction.SET_PREFIX, prefix : typeof SNumberPrefix[number] };

/**
 * Reducer function for actions on the student number
 * @param currSNumber Current SNumberType number
 * @param action Action object
 */
const sNumberReducer = (currSNumber : SNumberType, action : SNumberActionType) : SNumberType => {
  switch (action.type) {
    case SNumberAction.ADD: // Add a number to the s number
      if (currSNumber.number.length < MAX_SNUMBER_LENGTH) {  // Check if SNumberType is not too long
        return {
          ...currSNumber,  // Copy existing SNumberType
          number: currSNumber.number + action.nr, // Add the new number
        };

      } else {  // There are too many characters in the s number, do not add the new number
        return {...currSNumber};
      }

    case SNumberAction.REMOVE: // Remove the last number of the s number
      return {
        ...currSNumber,  // Copy existing SNumberType
        number: currSNumber.number.slice(0, -1),  // Remove last element in string
      };

    case SNumberAction.SET:  // Set the SNumber to a value
      return {
        ...action.sNumber,
      };

    case SNumberAction.CLEAR: // Replace the entire s number with the initial s number
      return {
        ...initialSNumber,
      };

    case SNumberAction.TOGGLE_PREFIX: // Replace first character of the s number
      const currPrefixIndex = SNumberPrefix.indexOf(currSNumber.prefix);  // Obtain index of current prefix
      return {
        ...currSNumber,
        prefix:
          SNumberPrefix[(currPrefixIndex + 1) % SNumberPrefix.length],  // Set new prefix index or wrap around to 0
      };

    case SNumberAction.SET_PREFIX:  // Set the prefix to the passed value
      return {
        ...currSNumber,
        prefix: action.prefix,
      };
  }
};

// Context to pass along
type SNumberContextType = {
  /**
   * The current sNumber
   */
  sNumber : SNumberType

  /**
   * Add a number to the student number
   * @param {number} nr Number to add
   */
  add : (nr : number) => void

  /**
   * Remove the last number from the sNumber, leaving the prefix in place.
   */
  remove : () => void

  /**
   * Set the entire sNumber
   * @param {SNumberType} sNumber New sNumber to set
   */
  set : (sNumber : SNumberType) => void


  /**
   * Clear the sNumber
   */
  clear : () => void

  /**
   * Toggle the sNumber prefix
   */
  togglePrefix : () => void

  /**
   * Set the prefix
   * @param {readonly [string, string, string][number]} prefix Prefix to set
   */
  setPrefix : (prefix : typeof SNumberPrefix[number]) => void

  /**
   * Return the sNumber as string
   */
  toString : () => string

  /**
   * Raw dispatch function
   */
  dispatch : React.Dispatch<SNumberActionType>
}

// Store to keep track of SNumberType number, basically the storage of the context
const SNumberContext = React.createContext<SNumberContextType>({} as SNumberContextType);

// Custom hook as shorthand to use the SNumberContext
const useSNumber = () => {
  return React.useContext(SNumberContext);
};

type SNumberPadContextProps = {
  children? : React.ReactNode
};

// User context provider
const SNumberContextProvider : React.FC<SNumberPadContextProps> = (props) => {
  const [sNumber, sNumberDispatch] = React.useReducer<React.Reducer<SNumberType, SNumberActionType>>(sNumberReducer, initialSNumber);

  const add = (nr : number) : void => {
    sNumberDispatch({type: SNumberAction.ADD, nr: nr});
  };

  const remove = () : void => {
    sNumberDispatch({type: SNumberAction.REMOVE});
  };

  const set = (sNumber : SNumberType) : void => {
    sNumberDispatch({type: SNumberAction.SET, sNumber: sNumber});
  };

  const clear = () : void => {
    sNumberDispatch({type: SNumberAction.CLEAR});
  };

  const togglePrefix = () : void => {
    sNumberDispatch({type: SNumberAction.TOGGLE_PREFIX});
  };

  const setPrefix = (prefix : typeof SNumberPrefix[number]) : void => {
    sNumberDispatch({type: SNumberAction.SET_PREFIX, prefix: prefix});
  };

  const toString = () : string => {
    return `${sNumber.prefix}${sNumber.number}`;
  };

  return <SNumberContext.Provider value={{
    sNumber: sNumber,
    add: add,
    remove: remove,
    set: set,
    clear: clear,
    togglePrefix: togglePrefix,
    setPrefix: setPrefix,
    toString: toString,
    dispatch: sNumberDispatch,
  }}>
    {props.children}
  </SNumberContext.Provider>;
};

// Exports
export default SNumberContext;
export type { SNumberType, SNumberActionType, SNumberContextType };
export { SNumberPrefix, SNumberContextProvider, useSNumber, SNumberAction };
