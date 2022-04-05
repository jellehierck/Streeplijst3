import React from "react";
import { Row, Col, Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import streeplijstConfig from "./streeplijstConfig";

import { useAuth } from "../components/auth/AuthContext";

import AuthStatus from "../components/auth/AuthStatus";
import LogoutButton from "../components/auth/LogoutButton";
import Navigation from "../components/navigation/Navigation";

// Header for the streeplijst, containing a navigation header and information about the logged in user
const StreeplijstHeader = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const displayUserInformationButton = () => {
    if (auth.isLoggedIn) {
      const redirectToUserInformation = () => {
        navigate(streeplijstConfig.routes.userOverviewPage);
      };
      return <Button onClick={redirectToUserInformation}
                     className="mx-auto"
                     size="lg"
                     variant="outline-primary">
        Profiel
      </Button>;
    } else {
      return <></>;
    }
  };

  return (
    <Row>
      <Col md="auto">
        <Navigation buttonProps={{size: "lg"}} />
      </Col>
      <Col className="text-center">
        {displayUserInformationButton()}
      </Col>
      <Col md="auto">
        <Stack direction="horizontal"
               gap={3}
               className="justify-content-end">
          <AuthStatus />
          <LogoutButton size="lg" />
        </Stack>
      </Col>

    </Row>
  );
};

// Exports
export default StreeplijstHeader;