import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { streeplijstRoutes } from "../../streeplijst/streeplijstRouteConfig";
import { useAuth } from "../auth/AuthContext";
import AuthStatus from "../auth/AuthStatus";
import { ContentContainer } from "../layout/Layout";
import UserInformation from "../user/UserInformation";

type UserOverviewProps = {}

// React component
const UserOverview : React.FC<UserOverviewProps> = (props) => {
  const auth = useAuth();
  const navigate = useNavigate();

  // Display buttons if a user is logged in
  const displayButtons = () => {
    if (auth.user) {
      return <Button variant="primary"
                     onClick={() => navigate(streeplijstRoutes.folderOverviewPage)}>
        Folders
      </Button>
    }
  }

  return (
    <ContentContainer>
      <AuthStatus />
      <UserInformation />
      {displayButtons()}
    </ContentContainer>
  );
}


// Exports
export default UserOverview;