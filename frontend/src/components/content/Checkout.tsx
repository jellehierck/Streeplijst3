import React from "react";
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
    console.log("Redirecting to " + streeplijstConfig.routes.afterLogout);
    auth.logout();
    navigate(streeplijstConfig.routes.afterLogout);
    alert.set(autoLogoutAlert());
  };

  return <ContentContainer sidebarContent={<AutoLogoutTimer onTimeout={onTimeout} />}>
    <UserInformation />
  </ContentContainer>;
};


// Exports
export default Checkout;