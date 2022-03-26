import React from "react";
import { Outlet } from "react-router-dom";

import TimedAlert from "../components/alert/TimedAlert";
import Layout from "../components/layout/Layout";
import StreeplijstHeader from "./StreeplijstHeader";

// Layout of the Streeplijst which renders a header, footer and an outlet for the main content
const StreeplijstLayout = () => {
  return (
    <Layout headerContent={<StreeplijstHeader />}
            footerContent={<TimedAlert />}>
      <Outlet />
    </Layout>
  );
};


// Exports
export default StreeplijstLayout;