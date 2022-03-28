import React from "react";
import { Route, Routes } from "react-router-dom";

import ForceLogout from "../components/auth/ForceLogout";
import RequireAuth from "../components/auth/RequireAuth";
import Checkout from "../components/content/Checkout";
import FolderOverview from "../components/content/FolderOverview";
import FolderProducts from "../components/content/FolderProducts";
import Home from "../components/content/Home";
import Login from "../components/content/Login";
import UserOverview from "../components/content/UserOverview";
import StreeplijstLayout from "./StreeplijstLayout";

import streeplijstConfig, { routeConfig } from "./streeplijstConfig";

type StreeplijstRoutesProps = {}

// Streeplijst routes wrapper for react-router-dom to create pages and handle routing
const StreeplijstRoutes : React.FC<StreeplijstRoutesProps> = () => {
  return (
    <Routes>
      <Route path="/" element={<StreeplijstLayout />}>
        {/* Home page, currently not used but could contain some fun information or navigation */}
        <Route index  // Index: this is the default page to go to
               element={<Home />} />

        {/* Login page, first page users should see */}
        <Route path={routeConfig.loginPage}
               element={<ForceLogout>
                 <Login afterLogin={streeplijstConfig.routes.afterLogin} />
               </ForceLogout>} />

        {/* User page, displays details and history of a user */}
        <Route path={routeConfig.userOverviewPage}
               element={<RequireAuth redirect={streeplijstConfig.routes.requireAuthRedirect}>
                 <UserOverview />
               </RequireAuth>} />

        {/* Folders page, displays overview of all folders */}
        <Route path={routeConfig.folderOverviewPage}
               element={<RequireAuth redirect={streeplijstConfig.routes.requireAuthRedirect}>
                 <FolderOverview />
               </RequireAuth>} />

        {/* Products inside folder, users can select products here */}
        <Route path={routeConfig.folderProductsPage}
               element={<RequireAuth redirect={streeplijstConfig.routes.requireAuthRedirect}>
                 <FolderProducts />
               </RequireAuth>} />

        {/* Checkout page, where users are redirect after buying their products */}
        <Route path={routeConfig.checkoutPage}
               element={<RequireAuth redirect={streeplijstConfig.routes.requireAuthRedirect}>
                 <Checkout />
               </RequireAuth>} />

      </Route>
    </Routes>
  );
};

// Exports
export default StreeplijstRoutes;