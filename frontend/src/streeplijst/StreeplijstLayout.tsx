import React from "react";
import { Outlet } from "react-router-dom"

import TimedAlert from "../components/alert/TimedAlert";

import Layout from "../components/layout/Layout";
import StreeplijstHeader from "./StreeplijstHeader";

type StreeplijstLayoutProps = {
  afterLogout : string
}

// React component
const StreeplijstLayout : React.FC<StreeplijstLayoutProps> = (props) => {
  return (
    <Layout headerContent={<StreeplijstHeader afterLogout={props.afterLogout} />}
            footerContent={<TimedAlert />}>
      <Outlet />
    </Layout>
  );
}


// Exports
export default StreeplijstLayout;