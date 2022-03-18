import React from "react";
import { useAuth } from "../auth/AuthContext";

type UserInformationProps = {}

// React component
const UserInformation : React.FC<UserInformationProps> = (props) => {
  const auth = useAuth();

  if (auth.loggedInMember) {
    return (
      <>
        <h1>{auth.loggedInMember.username}</h1>
        <p>Hier komt te staan wat jij in het verleden allemaal gesmikkeld hebt uit de streeplijst</p>
      </>
    );
  } else {  // Return nothing if no user is logged in
    return <></>;
  }
}


// Exports
export default UserInformation;