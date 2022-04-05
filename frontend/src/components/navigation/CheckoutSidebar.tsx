import React from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";

import streeplijstConfig from "../../streeplijst/streeplijstConfig";
import { autoLogoutAlert } from "../alert/standardAlerts";

import { useAuth } from "../auth/AuthContext";
import { useAlert } from "../alert/AlertContext";

import AutoLogoutTimer from "./AutoLogoutTimer";


type CheckoutSidebarProps = {
  // Whether to enable the auto logout timer in the sidebar
  enableAutoLogoutTimer : boolean
}

// React component
const CheckoutSidebar : React.FC<CheckoutSidebarProps> = ({
  enableAutoLogoutTimer = true,
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();

  const displayLogoutTimer = () => {
    if (enableAutoLogoutTimer) {  // If the timer is enabled, display it
      // Function to fire when the auto logout timer expires
      const onTimeout = () => {
        // console.log("Redirecting to " + streeplijstConfig.routes.afterLogout);
        auth.logout();
        navigate(streeplijstConfig.routes.afterLogout);
        alert.set(autoLogoutAlert());
      };
      return <AutoLogoutTimer onTimeout={onTimeout} />;

    } else {  // Display nothing
      return <></>;
    }
  };

  // Function to fire when the user clicks the button to go back to the Streeplijst
  const onBackToProducts = () => {
    // console.log("Redirecting to " + streeplijstConfig.routes.folderOverviewPage);
    navigate(streeplijstConfig.routes.folderOverviewPage);
  };

  return <Stack direction="vertical"
                gap={5}>
    {/* Phantom component for adding more space at the top of the sidebar */}
    <div />

    {/* Auto logout timer which is only displayed if the timer is enabled */}
    {displayLogoutTimer()}

    {/* Button to redirect back to the Streeplijst */}
    <Button onClick={onBackToProducts}
            variant="success"
            size="lg">
      <h4 className="text-reset">Terug naar de streeplijst</h4>
    </Button>
  </Stack>;
};


// Exports
export default CheckoutSidebar;