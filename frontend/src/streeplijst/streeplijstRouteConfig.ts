export const streeplijstRoutes = {
  loginPage: "/login",
  userOverviewPage: "/user",
  folderOverviewPage: "/folders",
  folderProductsPage: "/folders/:folderId",
  checkoutPage: "/checkout",
};

// Configuration of streeplijstRoutes
const streeplijstRouteConfig = {
  startPage: streeplijstRoutes.loginPage,  // Initial page to load
  afterLogout: streeplijstRoutes.loginPage,  // Page to go to after logout
  afterLogin: streeplijstRoutes.folderOverviewPage,  // Page to go to after login
  onFolderSelect: streeplijstRoutes.folderProductsPage,  // Page to go to after selecting a folder
  onCheckout: streeplijstRoutes.checkoutPage,  // Page to go to when the checkout action is taken
  requireAuthRedirect: streeplijstRoutes.loginPage,  // Where to redirect when authorization is required
};

export default streeplijstRouteConfig;
