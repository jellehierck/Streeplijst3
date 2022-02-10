/**
 * Contents of this file are very much inspired from https://github.com/remix-run/react-router/tree/main/examples/auth
 */
import React, { createContext, useContext } from "react";
import { fakeAuthProvider } from "./fakeAuth";

// User type
// TODO: Change to actual user type
type AuthUserType = {
  username : string
}

// Context type to pass along
type AuthContextType = {
  user : AuthUserType | null
  login : (username : string, callback : VoidFunction) => void  // Function to call after login
  logout : (callback : VoidFunction) => void  // Function to call after logout
}

// Actual context, store of the current state
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Custom hook to use the AuthContext
const useAuth = () : AuthContextType => {
  return useContext(AuthContext);
};

// AuthContext provider
const AuthContextProvider : React.FC = (props) => {
  const [user, setUser] = React.useState<AuthUserType | null>(null);

  const login = (username : string, callback : VoidFunction) : void => {
    return fakeAuthProvider.login(() => {
      setUser({username: username});  // Set the user
      callback();  // Call the callback
    });
  };

  const logout = (callback : VoidFunction) : void => {
    setUser(null);  // Remove the user
    callback();  // Call the callback
  };

  return (
    <AuthContext.Provider value={{user: user, login: login, logout: logout}}>
      {props.children}
    </AuthContext.Provider>
  );
}

// Exports
export default AuthContext;
export { AuthContextProvider, useAuth };
export type { AuthUserType, AuthContextType };