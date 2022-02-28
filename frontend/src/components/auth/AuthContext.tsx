/**
 * Contents of this file are very much inspired from https://github.com/remix-run/react-router/tree/main/examples/auth
 */
import React, { createContext, useContext } from "react";
import { getMemberByUsername, MemberType } from "../../api/localAPI";

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
   * Try to log in a user asynchronously. A promise is returned, when the user is successfully logged in its
   * information is returned. If the login was not successful, the promise is rejected with an error.
   * @param {string} username Username to try and log in.
   */
  login : (username : string) => Promise<MemberType>

  /**
   * Logs out the user, setting it null. Returns a promise which will always immediately resolve.
   * @returns {Promise<void>}
   */
  logout : () => Promise<void>
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

  const login = (username : string) : Promise<MemberType> => {
    return getMemberByUsername(username)
      .then(member => {
        setUser(member);  // Set the user
        return member;  // Return the user
      });
    // If the LocalAPI method is rejected, return the rejected Promise
  };

  const logout = () : Promise<void> => {
    setUser(null);  // Remove the user
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{user: user, login: login, logout: logout}}>
      {props.children}
    </AuthContext.Provider>
  );
};

// Exports
export default AuthContext;
export { AuthContextProvider, useAuth };
export type { AuthContextType };