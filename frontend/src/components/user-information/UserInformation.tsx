import React from "react";

import { useAuth } from "../auth/AuthContext";

type UserInformationProps = {}

// Information about the current user, such as personal details and purchase history
const UserInformation : React.FC<UserInformationProps> = (props) => {
  const auth = useAuth();

  if (auth.loggedInMember) { // If the user is logged in,
    return <>
      <h1>Hallo {auth.loggedInMember.first_name}!</h1>
      <p>Hier komt te staan wat jij in het verleden allemaal gesmikkeld hebt uit de streeplijst</p>
    </>;

  } else {  // Return nothing if no user is logged in
    return <p>
      No user logged in
    </p>;
  }
};


// Exports
export default UserInformation;