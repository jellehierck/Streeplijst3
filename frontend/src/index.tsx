import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {UserContextProvider} from "./contexts/UserContext";
import {ShoppingCartContextProvider} from "./contexts/ShoppingCartContext";

ReactDOM.render(
    <React.StrictMode>
        <UserContextProvider>
            <ShoppingCartContextProvider>
                <header className="header" role="banner">
                    {/*<div style={{width: '100vw', textAlign: 'center'}}>*/}
                    {/*  <img src="https://www.paradoks.utwente.nl/_media/1620430/7e58988fda09443a805702f84d4a7ac8/view" alt="Logo" style={{width: '20vh', display: 'inline'}}/>*/}
                    {/*</div>*/}
                    {/*<div className="header-logo">*/}
                    {/*  <a title="Logo Dienst Uitvoering Onderwijs"></a>*/}
                    {/*</div>*/}
                </header>
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
