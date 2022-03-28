export type FolderConfigType = {
  name : string,
  id : number,
  media : string,
  hide? : boolean  // Whether to hide this folder or not
}

const folderConfig : FolderConfigType[] = [
  {
    name: "Chips",
    id: 1991,
    media: "https://www.paradoks.utwente.nl/_media/889901/afa76d9d15c44705a9b7ef4da818ef2c/view",
  },
  {
    name: "Frisdrank",
    id: 2600,
    media: "https://www.paradoks.utwente.nl/_media/1082576/bd4562726ede494baeb7d8c3d4472c57/view",
  },
  {
    name: "Hartig",
    id: 3914,
    media: "https://www.paradoks.utwente.nl/_media/1694492/1700e2912b05473f913c60f54e07d9f4/view",
  },
  {
    name: "Repen",
    id: 1997,
    media: "https://www.paradoks.utwente.nl/_media/889900/c3a652eaf43546d594fe27bf9c288a08/view",
  },
  {
    name: "Snoep",
    id: 1995,
    media: "https://www.paradoks.utwente.nl/_media/889891/27c764b50d084e54840a97e7c3d2d991/view",
  },
  {
    name: "Soep",
    id: 1992,
    media: "https://www.paradoks.utwente.nl/_media/889902/d1de3e30149f48238d7df0566454a55f/view",
  },
  {
    name: "Koek",
    id: 1996,
    media: "https://www.paradoks.utwente.nl/_media/889909/383efbddb06649439e13ee71a63c46e8/view",
  },
  {
    name: "Healthy",
    id: 1993,
    media: "https://www.paradoks.utwente.nl/_media/889906/447f0d874bcb48479b43dede97149183/view",
  },
  {
    name: "Lunch",
    id: 1994,
    media: "https://www.paradoks.utwente.nl/_media/889938/a1be36b57e9d4cd4aba77a0a169ad8ed/view",
  },
  {
    name: "Speciaal",
    id: 1998,
    media: "https://www.paradoks.utwente.nl/_media/889910/63b78b80f2224dff8c46bfb8456d0bc8/view",
  },
  {
    name: "Super Healthy",
    id: 2464,
    media: "https://www.paradoks.utwente.nl/_media/889906/447f0d874bcb48479b43dede97149183/view",
    hide: true,  // This folder should be hidden
  },
];

// Miscellaneous configuration options
export const mediaURLs = {
  folderMedia: folderConfig,
};

// Routes used inside the Streeplijst app
export const routeConfig = {
  loginPage: "/login",
  userOverviewPage: "/user",
  folderOverviewPage: "/folders",
  folderProductsPage: "/folders/:folderId",
  checkoutPage: "/checkout",
};


// Configuration of Streeplijst app
const streeplijstConfig = {
  // Configuration of routes (where to go after certain actions
  routes: {
    startPage: routeConfig.loginPage,  // Initial page to load
    afterLogout: routeConfig.loginPage,  // Page to go to after logout
    afterLogin: routeConfig.folderOverviewPage,  // Page to go to after login
    onFolderSelect: routeConfig.folderProductsPage,  // Page to go to after selecting a folder
    onCheckout: routeConfig.checkoutPage,  // Page to go to when the checkout action is taken
    requireAuthRedirect: routeConfig.loginPage,  // Where to redirect when authorization is required
  },

  // Image in case no media is returned by API
  missingMedia: "https://www.paradoks.utwente.nl/_media/1694726/31e7dbcb1c6242cd9cd7083e4d9ce22f/view",

  // Additional hardcoded folder configuration
  folders: folderConfig,
};

export default streeplijstConfig;
