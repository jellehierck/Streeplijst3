import React from "react";
import { Button } from "react-bootstrap";
import { ButtonProps } from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import streeplijstRouteConfig from "../../streeplijst/streeplijstRouteConfig";
import { useAuth } from "./AuthContext";

interface LogoutButtonProps extends ButtonProps {
  // URL to redirect to after logout
  afterLogout? : string;
}

// Logout button which will logout the user and redirect to the afterLogout URL
const LogoutButton : React.FC<LogoutButtonProps> = ({
  afterLogout = streeplijstRouteConfig.afterLogout,  // Defaults to the configuration
  children,
  ...buttonProps// Other button props
}) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Function on button click
  const onClick = () : void => {
    auth.logout();
    navigate(afterLogout);
  };

  if (!children) {  // If no children are given, then a default text is displayed
    return <Button {...buttonProps}
                   onClick={() => onClick()}>
      Uitloggen
    </Button>;

  } else {  // If the component was rendered with children, then display the children instead
    return <Button {...buttonProps}
                   onClick={() => onClick()}>
      {children}
    </Button>;
  }

};


// Exports
export default LogoutButton;