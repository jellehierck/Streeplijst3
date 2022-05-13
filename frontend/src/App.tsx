import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { ReactQueryDevtools } from "react-query/devtools";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { BrowserRouter } from "react-router-dom";
import { APIContextProvider } from "./api/APIContext";

import { AlertContextProvider } from "./components/alert/AlertContext";
import { AuthContextProvider } from "./components/auth/AuthContext";
import { ShoppingCartContextProvider } from "./components/shopping-cart/ShoppingCartContext";

import StreeplijstRoutes from "./streeplijst/StreeplijstRoutes";

import QueryTestComponent from "./api/QueryTestComponent";

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

const defaultOfflineCacheTime = 1000 * 60 * 60 * 24 * 30;  // Default offline storage time (30 days)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: defaultOfflineCacheTime,
    },
  },
});

// Store offline cache in local window (browser)
const localStoragePersistor = createWebStoragePersistor({storage: window.localStorage});

// Persist the query client in the local window
persistQueryClient({
  queryClient: queryClient,
  persistor: localStoragePersistor,
});

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AlertContextProvider> {/* Context provider for alerts */}
        <AuthContextProvider>  {/* Context provider for authentication of users */}
          <APIContextProvider> {/* Context provider for API data except for authentication */}
            <ShoppingCartContextProvider> {/* Context provider for the shopping cart */}

              {/* <QueryTestComponent /> */}

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
}

export default App;
