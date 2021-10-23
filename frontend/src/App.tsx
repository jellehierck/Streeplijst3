import React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faBackspace } from "@fortawesome/free-solid-svg-icons";

import { far, faCheckCircle } from "@fortawesome/free-regular-svg-icons";

import Container from "react-bootstrap/Container";

import SNumberPad from "./auth/SNumberPad";
import TestAPI from "./api/TestAPI";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
    <Container>
      <TestAPI />
      <Router>
        <Switch>
          <Route path="/">
            <SNumberPad />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
