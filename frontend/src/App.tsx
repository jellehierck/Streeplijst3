import React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBackspace, fas } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle, far } from "@fortawesome/free-regular-svg-icons";
import StreeplijstApp from "./applications/StreeplijstApp";
import { ShoppingCartContextProvider } from "./contexts/ShoppingCartContext";
import { UserContextProvider } from "./contexts/UserContext";
import Header from "./components/Header";

// Initialize a font-awesome library to use icons easily throughout the project
// src: https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
library.add(
  // Solid icons
  fas,
  faBackspace,

  // Regular icons
  far,
  faCheckCircle
);

function App() {

  return (
    <UserContextProvider>
      <ShoppingCartContextProvider>
        <Header />
        <StreeplijstApp />
      </ShoppingCartContextProvider>
    </UserContextProvider>
  )

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
