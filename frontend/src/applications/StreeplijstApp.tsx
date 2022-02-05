import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Spinner } from "react-bootstrap";

import congressus, { FolderType } from "../api/API";
import SNumberPad from "../components/SNumberPad";
import { FoldersPage } from "../pages/FoldersPage";
import { InsideFolderPage } from "../pages/InsideFolderPage";

type StreeplijstAppProps = {}

// React component
const StreeplijstApp : React.FC<StreeplijstAppProps> = (props) => {
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
    <div className="container my-8">
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
            <InsideFolderPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}


// Exports
export default StreeplijstApp;