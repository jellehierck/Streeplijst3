import React from "react";
import LogoutButton from "../auth/LogoutButton";

import { ContentContainer } from "../layout/Layout";
import ShoppingCart from "../shopping-cart/ShoppingCart";
import UserInformation from "../user/UserInformation";

type CheckoutProps = {}

// React component
const Checkout : React.FC<CheckoutProps> = (props) => {
  return (
    <ContentContainer sidebarContent={<ShoppingCart />}>
      <p>Je hebt betaald</p>
      <UserInformation />
      <LogoutButton />
    </ContentContainer>
  );
}


// Exports
export default Checkout;