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

    // Function to call upon successful login
    const onLogin = () => {
      console.log(`Login successful, redirection to ${props.afterLogin}`);
      navigate(props.afterLogin); // TODO: Add a way to redirect to the last accessed page instead?
    };

    // Try to log in the user using the AuthContext
    auth.login(username, onLogin);
  };

  const loginFailed = () => {
    login("s0000000");
    // alert.set(usernameNotFoundAlert("s1779397"));
  };

  return (
    <ContentContainer>
      <SNumberPad login={login} />

      <Button variant="primary"
              onClick={loginFailed}>
        Foute login
      </Button>
    </ContentContainer>
  );
};


// Exports
export default Login;