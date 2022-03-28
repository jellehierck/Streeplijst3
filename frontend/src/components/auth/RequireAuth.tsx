import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";


// Redirect URL when not authorized
type RequireAuthProps = {
  redirect : string
  children : React.ReactNode
}

// RequireAuth element, wrap around any element to only allow the element to be rendered when a user is logged in
const RequireAuth : React.FC<RequireAuthProps> = (props) => {
  const auth = useAuth();

  // If no user is authorized, redirect to the provided redirect url
  if (!auth.loggedInMember) {
    // TODO: Add a call to the alert footer using AlertContext telling the user they should be logged in
    return <Navigate to={props.redirect}
                     replace />;
  } else {  // If a user is authorized, render the wrapped children elements
    return <>
      {props.children}
    </>;
  }
}

// Exports
export default RequireAuth;