import React, { useEffect, useState } from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faBackspace } from "@fortawesome/free-solid-svg-icons";

import { far, faCheckCircle } from "@fortawesome/free-regular-svg-icons";

import Container from "react-bootstrap/Container";

import SNumberPad from "./auth/SNumberPad";
import TestAPI from "./api/TestAPI";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import congressus, { FolderType } from "./api/API";
import { Spinner } from "react-bootstrap";
import { FoldersPage } from "./pages/FoldersPage";
import { FolderPage } from "./pages/FolderPage";

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
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<FolderType[]>([]);

  useEffect(() => {
    congressus.getFolders().then((folders) => {
      setFolders(folders);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      {/* <TestAPI /> */}
      <Router>
        <Switch>
          <Route exact path="/">
            <SNumberPad />
          </Route>
          <Route exact path="/folders">
            <FoldersPage folders={folders} />
          </Route>
          <Route exact path="/folders/:folderId">
            <FolderPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
