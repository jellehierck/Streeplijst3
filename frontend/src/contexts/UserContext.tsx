import React, { createContext, Dispatch, useReducer } from "react";
import { MemberType } from "../api/API";

export const UserContext = createContext<MemberType | null>(null);

// Possible actions to take on the user
const enum UserAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT"
}

// Grouping of user action
type UserActionType = {
  type : UserAction
  payload? : UserStateType
}

// User state type, contains member information
type UserStateType = {
  member? : MemberType
}

// Initial user state
const initialUserState : UserStateType = {member: undefined};

/**
 * Reducer function for the user state
 * @param state Current user state
 * @param action Action to take on the user state
 */
const userReducerFunc = (state : UserStateType, action : UserActionType) : UserStateType => {
  const {type, payload} = action;  // Unpack the action

  // Determine how to adjust the state according to the action type
  switch (type) {
    case UserAction.LOGIN:
      return {...state, ...payload};  // Set the user as logged in
    case UserAction.LOGOUT:
      return initialUserState;  // Set no user as logged in
  }
};

// Context to pass along
type UserContextType = {
  state : UserStateType
  dispatch : Dispatch<UserActionType>
}

// Store to keep track of user state, basically the storage of the context
const UserStore = createContext<UserContextType>({} as UserContextType);

// User context provider
const UserContextProvider : React.FC = (props) => {
  const [state, dispatch] = useReducer<React.Reducer<UserStateType, UserActionType>>(userReducerFunc, initialUserState);

  return <UserStore.Provider value={{state, dispatch}}>
    {props.children}
  </UserStore.Provider>
}

// Exports
export default UserContextProvider;
export type { UserStateType, UserActionType, UserContextType };
export { UserAction, };