import React from "react";
import { Stack } from "react-bootstrap";

import AuthStatus from "../components/auth/AuthStatus";
import LogoutButton from "../components/auth/LogoutButton";
import Navigation from "../components/navigation/Navigation";

// Header for the streeplijst, containing a navigation header and information about the logged in user
const StreeplijstHeader = () => {
  return (
    <Stack direction="horizontal"
           gap={3}>
      <Navigation buttonProps={{size: "lg"}} />
      <div className="ms-auto">
        <AuthStatus />
      </div>
      <LogoutButton size="lg" />
    </Stack>
  );
};

// Exports
export default StreeplijstHeader;