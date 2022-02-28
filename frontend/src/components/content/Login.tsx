import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LocalAPIError } from "../../api/localAPI";
import { useAlert } from "../alert/AlertContext";
import { unknownErrorAlert, usernameNotFoundAlert } from "../alert/standardAlerts";

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
    console.log(`Attempt login for ${username}`);
    // Try to log in the user using the AuthContext
    auth.login(username)
      .then(() => {
        console.log(`Login successful, redirection to ${props.afterLogin}`);
        navigate(props.afterLogin); // TODO: Add a way to redirect to the last accessed page instead
      })
      .catch(err => {
        // Determine the type of error to handle it correctly
        if (err instanceof LocalAPIError) {  // See if the error is a known error
          switch (err.status) {  // Determine the error type
            case 404:  // Username not found
              alert.set(usernameNotFoundAlert(username, err.toString()));  // Set the alert
              return;
          }
        }
        // All other checks failed, this is an unexpected error so set the alert to an unknown error
        alert.set(unknownErrorAlert(err.toString()));
      });
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