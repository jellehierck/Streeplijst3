import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";
import { APIContextProvider } from "./api/APIContext";

import { AlertContextProvider } from "./components/alert/AlertContext";
import { AuthContextProvider } from "./components/auth/AuthContext";
import { SNumberContextProvider } from "./components/snumberpad/SNumberContext";
import { ShoppingCartContextProvider } from "./components/shopping-cart/ShoppingCartContext";

import StreeplijstRoutes from "./streeplijst/StreeplijstRoutes";

import QueryTestComponent from "./api/QueryTestComponent";
import TimedAlert from "./components/alert/TimedAlert";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBackspace,
  faMinus,
  faPaperPlane,
  faPlus,
  fas,
  faShoppingCart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// Initialize a font-awesome library to use icons easily throughout the project
// src: https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
library.add(  // Solid icons
  fas,
  faBackspace,
  faMinus,
  faPlus,
  faTrash,
  faShoppingCart,
  faPaperPlane,
);

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AlertContextProvider> {/* Context provider for alerts */}
        <AuthContextProvider>  {/* Context provider for authentication of users */}
          <APIContextProvider> {/* Context provider for API data except for authentication */}
            <ShoppingCartContextProvider> {/* Context provider for the shopping cart */}
              {/* <QueryTestComponent /> */}
              {/* <TimedAlert /> */}
              <BrowserRouter> {/* react-router-dom base, enables routing */}
                <StreeplijstRoutes /> {/* The Streeplijst app, TODO: we could also add the Bierstreeplijst here */}
              </BrowserRouter>
            </ShoppingCartContextProvider>
          </APIContextProvider>
        </AuthContextProvider>
      </AlertContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

  );

  // const [loading, setLoading] = useState(true);
  // const [folders, setFolders] = useState<FolderType[]>([]);
  //
  // useEffect(() => {
  //   congressus.getFolders().then((folders) => {
  //     setFolders(folders);
  //     setLoading(false);
  //   });
  // }, []);
  //
  // if (loading) return <Spinner animation="border" />;
  //
  // return (
  //   <div className="container my-8">
  //     {/* <TestAPI /> */}
  //     <Router>
  //       <Switch>
  //         <Route exact path="/">
  //           <SNumberPad />
  //         </Route>
  //         <Route exact path="/folders">
  //           <FoldersPage folders={folders} />
  //         </Route>
  //         <Route exact path="/folders/:folderId">
  //           <FolderPage />
  //         </Route>
  //       </Switch>
  //     </Router>
  //   </div>
  // );
}

export default App;
