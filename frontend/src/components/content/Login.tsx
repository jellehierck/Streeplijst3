import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../alert/AlertContext";
import { usernameNotFoundAlert } from "../alert/standardAlerts";

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
  const alert = useAlert();

  // Logging in a user
  const login = (username : string) : void => {
    // Try to log in the user using the AuthContext
    auth.login(username, () => {
      navigate(props.afterLogin); // TODO: Add a way to redirect to the last accessed page instead
    });
  };

  const loginFailed = () => {
    alert.set(usernameNotFoundAlert("s1779397"));
  };

  return (
    <ContentContainer>
      <SNumberPad />

      <Button variant="primary"
              onClick={loginFailed}>
        Foute login
      </Button>
    </ContentContainer>
  );
};


// Exports
export default Login;