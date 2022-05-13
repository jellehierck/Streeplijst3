/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Contents of this file are very much inspired from https://github.com/remix-run/react-router/tree/main/examples/auth
 */
import React, { createContext, useContext, useEffect } from "react";
import { UseQueryResult } from "react-query";
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

  /**
   * Log in user with the localAPI.
   * @param {MemberType} member User to log in
   */
  login : (username : string) => void

  /**
   * Logs out the user, setting it to null.
   */
  logout : () => void

  // Query repsonse for members
  memberRes : UseQueryResult<MemberType, LocalAPIError>

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

  // Callback on successful member query
  const onMemberSuccess = (data : MemberType, username : string) : void => {
    setLoggedInMember(data); // Set user as logged in
    alert.hide(); // Remove any current alerts
    // setUsername("");  // Reset the username
  };

  // When the function has an error, display the error
  const onMemberError = (error : LocalAPIError, username : string) : void => {
    // setUsername("");  // Reset the username
    switch (error.status) {  // Determine the error type
      case 404:  // Username not found
        alert.set(usernameNotFoundAlert(username, error.toString()));  // Set the alert
        break;
      case 408:  // Request timeout
        alert.set(timeoutAlert(error.toString()));  // Set alert
        break;
      default:// All other checks failed, this is an unexpected error so set the alert to an unknown error
        console.log(error);
        alert.set(unknownErrorAlert(error.toString()));
    }
  };

  // Query the member based on the username state (set by login function) and disabled by default
  const memberRes = useMemberByUsername(username,
    {
      onSuccess: onMemberSuccess,
      onError: onMemberError,
    },
    {
      enabled: false, // Do not call this query by default, instead call it with refetch (to use with buttons)
      // staleTime: 0,
      // cacheTime: 0,
    },
  );

  // When there is data in the member query result, log in a member
  // if (memberRes.data) {
  //   setLoggedInMember(memberRes.data); // Set user as logged in
  //   setUsername("");  // Reset the username as we do not want this to be fetched again
  //   alert.hide(); // Remove any current alerts
  // }

  // Extra trick to make sure the member is only refetched when the username is truthy (not an empty string). This is
  // needed because we first need a re-render of this component with the new username before react-query uses the
  // updated username value.
  useEffect(() => {
    if (username) {
      memberRes.refetch({cancelRefetch: true}); // Refetch again while canceling any previous requests
    }
  }, [username]);

  // Login function to log a user in
  const login = (username : string) => {
    // setLoggedInMember(null);  // Set the user to null to log it out
    setUsername(username);
  };

  // Logout function to log a user out
  const logout = () : void => {
    setUsername("");
    setLoggedInMember(null);  // Set the user to null to log it out
    memberRes.remove();  // Remove query to cancel any current requests
  };

  return (
    <AuthContext.Provider value={{
      loggedInMember: loggedInMember,
      isLoggedIn: !!loggedInMember,  // True when loggedInMember is not null
      login: login,
      logout: logout,
      memberRes: memberRes,
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};