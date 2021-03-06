import React from "react";

import { useAuth } from "./AuthContext";

type AuthStatusType = {}

// Displays the authorization status of a user and a logout button if they are logged in
const AuthStatus : React.FC<AuthStatusType> = (props) => {
  let auth = useAuth();

  // If the user is not logged in, display a message
  if (!auth.loggedInMember) {
    return (
      <p className="my-auto">
        Niet ingelogd
      </p>
    );

  } else {  // If the user is logged in, display their name and a logout button
    return (
      <p className="my-auto">
        Welkom {auth.loggedInMember.first_name}!
      </p>
    );
  }
};


// Exports
export default AuthStatus;