import React from "react";
import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { ContentContainer } from "../layout/Layout";

import { routeConfig } from "../../streeplijst/streeplijstConfig";

type HomeProps = {}

// Home page, quite empty only to serve as a placeholder for now
const Home : React.FC<HomeProps> = () => {
  const navigate = useNavigate();

  return (
    <ContentContainer>
      <Stack>
        <Button variant="outline-success"
                onClick={() => navigate(routeConfig.loginPage)}
                size="lg">
          <h1 className="text-reset">Naar de streeplijst</h1>
        </Button>
      </Stack>

      {/* <Button variant="primary" */}
      {/*         onClick={() => navigate(streeplijstRoutes.userOverviewPage)}> */}
      {/*   User info */}
      {/* </Button> */}
    </ContentContainer>
  );
};


// Exports
export default Home;