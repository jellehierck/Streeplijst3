import React from "react";

import { ContentContainer } from "../layout/Layout";
import CheckoutSidebar from "../navigation/CheckoutSidebar";
import UserInformation from "../user-information/UserInformation";

type UserOverviewProps = {}

// React component
const UserOverview : React.FC<UserOverviewProps> = () => {

  return <ContentContainer sidebarContent={<CheckoutSidebar enableAutoLogoutTimer={false} />}>
    <UserInformation />
  </ContentContainer>;
};


// Exports
export default UserOverview;