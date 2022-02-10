import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../components/auth/AuthContext";
import { ContentContainer } from "../../components/layout/Layout";

type LoginProps = {
  afterLogin : string
}

// React component
const Login : React.FC<LoginProps> = (props) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Logging in a user
  const login = (username : string) : void => {
    // Try to log in the user using the AuthContext
    auth.login(username, () => {
      navigate(props.afterLogin); // TODO: Add a way to redirect to the last accessed page instead
    });
  };

  return (
    <ContentContainer>
      <Button variant="primary"
              onClick={() => login("Jelle")}>
        Login
      </Button>
    </ContentContainer>
  );
}


// Exports
export default Login;