import React from "react";
import { Route, Routes } from "react-router-dom"
import ForceLogout from "../components/auth/ForceLogout";
import RequireAuth from "../components/auth/RequireAuth";
import Checkout from "../components/content/Checkout";
import FolderOverview from "../components/content/FolderOverview";
import FolderProducts from "../components/content/FolderProducts";
import Home from "../components/content/Home";
import Login from "../components/content/Login";
import UserOverview from "../components/content/UserOverview";
import StreeplijstLayout from "./StreeplijstLayout";

import streeplijstRouteConfig, { streeplijstRoutes } from "./streeplijstRouteConfig";

type StreeplijstRoutesProps = {}

// React component
const StreeplijstRoutes : React.FC<StreeplijstRoutesProps> = (props) => {
  return (
    <Routes>
      <Route path="/" element={<StreeplijstLayout afterLogout={streeplijstRouteConfig.afterLogout} />}>
        {/* Home page, currently not used but could contain some fun information or navigation */}
        <Route index  // Index: this is the default page to go to
               element={<Home />} />

        {/* Login page, first page users should see */}
        <Route path={streeplijstRoutes.loginPage}
               element={<ForceLogout>
                 <Login afterLogin={streeplijstRouteConfig.afterLogin} />
               </ForceLogout>} />

        {/* User page, displays details and history of a user */}
        <Route path={streeplijstRoutes.userOverviewPage}
               element={<RequireAuth redirect={streeplijstRouteConfig.requireAuthRedirect}>
                 <UserOverview />
               </RequireAuth>} />

        {/* Folders page, displays overview of all folders */}
        <Route path={streeplijstRoutes.folderOverviewPage}
               element={<RequireAuth redirect={streeplijstRouteConfig.requireAuthRedirect}>
                 <FolderOverview />
               </RequireAuth>} />

        {/* Products inside folder, users can select products here */}
        <Route path={streeplijstRoutes.folderProductsPage}
               element={<RequireAuth redirect={streeplijstRouteConfig.requireAuthRedirect}>
                 <FolderProducts />
               </RequireAuth>} />

        {/* Checkout page, where users are redirect after buying their products */}
        <Route path={streeplijstRoutes.checkoutPage}
               element={<RequireAuth redirect={streeplijstRouteConfig.requireAuthRedirect}>
                 <Checkout />
               </RequireAuth>} />

      </Route>
    </Routes>
  );
}


// Exports
export default StreeplijstRoutes;