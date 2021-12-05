import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserContextProvider } from "./contexts/UserContext";
import { ShoppingCartContextProvider } from "./contexts/ShoppingCartContext";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <ShoppingCartContextProvider>
        <App />
      </ShoppingCartContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
