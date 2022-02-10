import React from "react";
import LogoutButton from "../../components/auth/LogoutButton";

import { ContentContainer } from "../../components/layout/Layout";
import ShoppingCart from "../../components/shopping-cart/ShoppingCart";
import UserInformation from "../../components/user/UserInformation";

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