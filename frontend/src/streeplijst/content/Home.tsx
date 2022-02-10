import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { ContentContainer } from "../../components/layout/Layout";
import { streeplijstRoutes } from "../streeplijstRouteConfig";

type HomeProps = {}

// React component
const Home : React.FC<HomeProps> = (props) => {
  const navigate = useNavigate();

  return (
    <ContentContainer>
      <p>Streeplijst Home</p>

      <Button variant="primary"
              onClick={() => navigate(streeplijstRoutes.loginPage)}>
        Login
      </Button>

      <Button variant="primary"
              onClick={() => navigate(streeplijstRoutes.userOverviewPage)}>
        User info
      </Button>
    </ContentContainer>
  );
}


// Exports
export default Home;