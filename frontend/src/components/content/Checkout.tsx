import React from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";

import { useAlert } from "../alert/AlertContext";
import { useAuth } from "../auth/AuthContext";

import streeplijstConfig from "../../streeplijst/streeplijstConfig";
import { autoLogoutAlert } from "../alert/standardAlerts";

import { ContentContainer } from "../layout/Layout";
import AutoLogoutTimer from "../navigation/AutoLogoutTimer";
import UserInformation from "../user-information/UserInformation";

type CheckoutProps = {}

// Checkout page, displays a checkout message and redirects after timeUntilRedirect ms.
const Checkout : React.FC<CheckoutProps> = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();

  // Function to fire when the auto logout timer expires
  const onTimeout = () => {
    // console.log("Redirecting to " + streeplijstConfig.routes.afterLogout);
    auth.logout();
    navigate(streeplijstConfig.routes.afterLogout);
    alert.set(autoLogoutAlert());
  };

  const onBackToProducts = () => {
    console.log("Redirecting to " + streeplijstConfig.routes.folderOverviewPage);
    navigate(streeplijstConfig.routes.folderOverviewPage);
  };

  // Create a stack of sidebar content for the checkout page
  const checkoutSidebarContent = () => {
    return <Stack direction="vertical"
                  gap={5}>
      <div />
      {/* Phantom component for adding more space at the top of the sidebar */}
      <AutoLogoutTimer onTimeout={onTimeout} />
      <Button onClick={onBackToProducts}
              variant="success"
              size="lg">
        <h4 className="text-reset">Terug naar de streeplijst</h4>
      </Button>
    </Stack>;
  };

  return <ContentContainer sidebarContent={checkoutSidebarContent()}>
    <UserInformation />
  </ContentContainer>;
};


// Exports
export default Checkout;
