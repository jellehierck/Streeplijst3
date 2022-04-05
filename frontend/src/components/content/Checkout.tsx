import React from "react";

import { ContentContainer } from "../layout/Layout";
import CheckoutSidebar from "../navigation/CheckoutSidebar";
import UserInformation from "../user-information/UserInformation";

type CheckoutProps = {}

// Checkout page, displays a checkout message and redirects after timeUntilRedirect ms.
const Checkout : React.FC<CheckoutProps> = () => {

  return <ContentContainer sidebarContent={<CheckoutSidebar enableAutoLogoutTimer={true} />}>
    <UserInformation />
  </ContentContainer>;
};


// Exports
export default Checkout;
