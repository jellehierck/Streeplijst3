import React, { createContext, Dispatch, useReducer } from "react";
import { MemberType } from "../../api/API";

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

// User number type, contains member information
type UserStateType = {
  member? : MemberType
}

// Initial user number
const initialUserState : UserStateType = {member: undefined};

/**
 * Reducer function for the user number
 * @param state Current user number
 * @param action Action to take on the user number
 */
const userReducerFunc = (state : UserStateType, action : UserActionType) : UserStateType => {
  const {type, payload} = action;  // Unpack the action

  // Determine how to adjust the number according to the action type
  switch (type) {
    case UserAction.LOGIN:
      return {...state, ...payload};  // Set the user as logged in
    case UserAction.LOGOUT:
      return initialUserState;  // Set no user as logged in
  }
};

// Context to pass along
type UserContextType = {
  user : UserStateType
  userDispatch : Dispatch<UserActionType>
}

// Store to keep track of user number, basically the storage of the context
const UserContext = createContext<UserContextType>({} as UserContextType);

// User context provider
const UserContextProvider : React.FC = (props) => {
  const [user, userDispatch] = useReducer<React.Reducer<UserStateType, UserActionType>>(userReducerFunc, initialUserState);

  return <UserContext.Provider value={{user: user, userDispatch: userDispatch}}>
    {props.children}
  </UserContext.Provider>
}

// Exports
export default UserContext;
export type { UserStateType, UserActionType, UserContextType };
export { UserAction, UserContextProvider };