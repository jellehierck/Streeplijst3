import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { ContentContainer } from "../layout/Layout";
import SNumberPad from "../snumberpad/SNumberPad";

type LoginProps = {
  afterLogin : string
}

// React component
const Login : React.FC<LoginProps> = (props) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Logging in a user
  const login = (username : string) : void => {
    console.log(`Attempt login for ${username}`);
    auth.login(username); // Try to log in the user using the AuthContext
  };

  React.useEffect(() => {
    if (auth.loggedInMember) {
      console.log(`Login successful, redirection to ${props.afterLogin}`);
      navigate(props.afterLogin); // TODO: Add a way to redirect to the last accessed page instead?
    }
  }, [auth.loggedInMember, navigate, props.afterLogin]);

  const loginToNonExistentUser = () => {
    login("s0000000");
  };

  return (
    <ContentContainer>
      <SNumberPad login={login} />

      <Button variant="primary"
              onClick={loginToNonExistentUser}>
        Foute login
      </Button>
    </ContentContainer>
  );
};


// Exports
export default Login;