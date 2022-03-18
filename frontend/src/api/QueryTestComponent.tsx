import React from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../components/auth/AuthContext";

import { useMemberByUsername, usePing } from "./localAPIHooks";

type QueryTestComponentProps = {}

// React component
const QueryTestComponent : React.FC<QueryTestComponentProps> = (props) => {
  // const memberRes = useMemberByUsername("s9999997");
  //
  // const memberDisplay = () => {
  //   if (memberRes.isLoading) {
  //     return <span>Loading...</span>;
  //   }
  //
  //   if (memberRes.data) {
  //     return <span>First name: {memberRes.data.first_name}</span>;
  //   }
  // };

  const auth = useAuth();

  // Logging in a user
  const login = (username : string) : void => {
    console.log(`Attempt login for ${username}`);

    // Try to log in the user using the AuthContext
    auth.login(username);
  };

  const memberDisplay = () => {
    if (auth.loggedInMember) {
      // console.log(`Login successful, redirection to ${props.afterLogin}`);
      return <span>Logged in user: {auth.loggedInMember.username}</span>;
    }
  };

  const pingRes = usePing();

  const pingDisplay = () => {
    if (pingRes.isLoading) {
      return <span>Loading...</span>;
    }

    if (pingRes.data) {
      return <span>Ping: {pingRes.data.message}</span>;
    }

    if (pingRes.error) {
      return <span>Error: {pingRes.error.message}</span>;
    }
  };

  return (
    <>
      {pingDisplay()}
      <hr />
      <Button variant="primary"
              onClick={() => login("s0000000")}>
        Foute login
      </Button>
      <Button variant="primary"
              onClick={() => login("s1779397")}>
        goede login
      </Button>
      <Button variant="primary"
              onClick={() => login("s9999999")}>
        goede login 2
      </Button>

      <Button variant="primary"
              onClick={() => auth.logout()}>
        logout
      </Button>
      {memberDisplay()}
    </>
  );
};


// Exports
export default QueryTestComponent;