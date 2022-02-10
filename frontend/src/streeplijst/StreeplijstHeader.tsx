import React from "react";
import { Stack } from "react-bootstrap"

import AuthStatus from "../components/auth/AuthStatus";
import LogoutButton from "../components/auth/LogoutButton";
import Navigation from "../components/navigation/Navigation";

// Props
type StreeplijstHeaderProps = {
  afterLogout : string
}
// React component
const StreeplijstHeader : React.FC<StreeplijstHeaderProps> = (props) => {
  return (
    <Stack direction="horizontal"
           gap={3}>
      <Navigation />
      <div className="ms-auto">
        <AuthStatus />
      </div>
      <LogoutButton />
    </Stack>
  );
}

// Exports
export default StreeplijstHeader;