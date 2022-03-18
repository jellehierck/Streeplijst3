/**
 * Contents of this file are very much inspired from https://github.com/remix-run/react-router/tree/main/examples/auth
 */
import React, { createContext, useContext } from "react";
import { LocalAPIError, MemberType } from "../../api/localAPI";
import { useMemberByUsername } from "../../api/localAPIHooks";
import { useAlert } from "../alert/AlertContext";
import { unknownErrorAlert, usernameNotFoundAlert } from "../alert/standardAlerts";

// Context type to pass along
// type AuthContextType = {
//   user : MemberType | null
//   login : (username : string, callback : VoidFunction) => void  // Function to call after login
//   logout : (callback : VoidFunction) => void  // Function to call after logout
// }

// Context type to pass along with promises
type AuthContextType = {
  /**
   * Currently logged-in user. If no user is logged in, the user is null.
   */
  user : MemberType | null

  /**
   * Log in user with the localAPI.
   * @param {MemberType} member User to log in
   * @param {VoidFunction} onLogin Function to call upon a successul login
   */
  login : (username : string, onLogin : VoidFunction) => void

  /**
   * Logs out the user, setting it to null.
   */
  logout : () => void
}

// Actual context, store of the current state
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Custom hook to use the AuthContext
const useAuth = () : AuthContextType => {
  return useContext(AuthContext);
};

// AuthContext provider
const AuthContextProvider : React.FC = (props) => {
  const [user, setUser] = React.useState<MemberType | null>(null);
  const alert = useAlert();

  //
  const useLogin = (username : string, onLogin : VoidFunction) : void => {
    // Callback function to set the alert upon a failed member error
    const handleMemberError = (error : LocalAPIError) : void => {
      switch (error.status) {  // Determine the error type
        case 404:  // Username not found
          alert.set(usernameNotFoundAlert(username, error.toString()));  // Set the alert
          return;
      }

      // All other checks failed, this is an unexpected error so set the alert to an unknown error
      console.log(error);
      alert.set(unknownErrorAlert(error.toString()));
    };

    const options = {
      onError: handleMemberError,  // Add the default error handler
    };

    const memberRes = useMemberByUsername(username, options);  // Get the user from the localAPI

    if (memberRes.isSuccess) {  // The attempt was successful
      setUser(memberRes.data);  // Set user as logged in
      onLogin();  // Call provided function
    }
  };

  const logout = () : void => {
    setUser(null);  // Remove the user, so it is not logged in
  };

  return (
    <AuthContext.Provider value={{user: user, login: useLogin, logout: logout}}>
      {props.children}
    </AuthContext.Provider>
  );
};

// Exports
export default AuthContext;
export { AuthContextProvider, useAuth };
export type { AuthContextType };