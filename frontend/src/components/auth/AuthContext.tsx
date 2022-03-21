/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Contents of this file are very much inspired from https://github.com/remix-run/react-router/tree/main/examples/auth
 */
import React, { createContext, useContext, useEffect } from "react";
import { LocalAPIError, MemberType } from "../../api/localAPI";
import { useMemberByUsername } from "../../api/localAPIHooks";
import { useAlert } from "../alert/AlertContext";
import { timeoutAlert, unknownErrorAlert, usernameNotFoundAlert } from "../alert/standardAlerts";

// Context type to pass along with promises
export type AuthContextType = {
  /**
   * Currently logged-in user. If no user is logged in, the user is null.
   */
  loggedInMember : MemberType | null

  // Whether a user is currently logged in
  isLoggedIn : boolean

  // Whether there is currently a query being fetched
  isFetching : boolean

  /**
   * Log in user with the localAPI.
   * @param {MemberType} member User to log in
   */
  login : (username : string) => void

  /**
   * Logs out the user, setting it to null.
   */
  logout : () => void
}

// Actual context, store of the current state
const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export default AuthContext;

// Custom hook to use the AuthContext
export const useAuth = () : AuthContextType => {
  return useContext(AuthContext);
};

// AuthContext provider
export const AuthContextProvider : React.FC = (props) => {
  const alert = useAlert();  // Alert context, used to display an error message on a failed login attempt

  const [loggedInMember, setLoggedInMember] = React.useState<MemberType | null>(null);
  const [username, setUsername] = React.useState<string>("");

  // Callback function to set the alert upon a failed member error
  const onMemberSuccess = (data : MemberType, username : string) : void => {
    setLoggedInMember(data); // Set user as logged in
    setUsername("");
    alert.hide(); // Remove any current alerts
  };

  // Callback function to set the alert upon a failed member error
  const onMemberError = (error : LocalAPIError, username : string) : void => {
    setUsername("");

    switch (error.status) {  // Determine the error type
      case 404:  // Username not found
        alert.set(usernameNotFoundAlert(username, error.toString()));  // Set the alert
        return;
      case 408:  // Request timeout
        alert.set(timeoutAlert(error.toString()));  // Set alert
    }

    // All other checks failed, this is an unexpected error so set the alert to an unknown error
    console.log(error);
    alert.set(unknownErrorAlert(error.toString()));
  };

  // Query the member based on the username state (set by login function) and disabled by default
  const memberRes = useMemberByUsername(username,
    {
      onSuccess: onMemberSuccess,
      onError: onMemberError,
    },
    {enabled: false},  // Do not call this query by default, instead call it with refetch (to use with buttons)
  );

  // Extra trick to make sure the member is only refetched when the username is truthy (not an empty string). This is
  // needed because we first need a re-render of this component with the new username before react-query uses the
  // updated username value.
  useEffect(() => {
    if (username) {
      memberRes.refetch();
    }
  }, [username]);

  // Login function to log a user in
  const login = (username : string) => {
    logout();  // First log out the user
    setUsername(username);
    // memberRes.refetch();  // Refresh the call to the API with the new username
  };

  // Logout function to log a user out
  const logout = () : void => {
    // setUsername("");  // Disable the username to prevent next username queries
    setLoggedInMember(null);  // Set the user to null to log it out
    memberRes.remove();  // Remove query to cancel any current requests
  };

  return (
    <AuthContext.Provider value={{
      loggedInMember: loggedInMember,
      isLoggedIn: !!loggedInMember,  // True when loggedInMember is not null
      isFetching: memberRes.isFetching,
      login: login,
      logout: logout,
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};