import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import streeplijstRouteConfig from "../../streeplijst/streeplijstRouteConfig";
import { useAuth } from "./AuthContext";

type LogoutButtonProps = {}

// React component
const LogoutButton : React.FC<LogoutButtonProps> = (props) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Function on button click
  const onClick = () : void => {
    auth.logout();
    navigate(streeplijstRouteConfig.afterLogout);
  };

  return (
    <Button variant="outline-primary"
            onClick={() => onClick()}>
      Log out
    </Button>
  );
};


// Exports
export default LogoutButton;