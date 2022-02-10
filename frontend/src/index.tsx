import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootswatch@5.1.0/dist/lux/bootstrap.min.css"
          integrity="sha256-uVM4yw5cb/I41+eHvw16wD50J6zq1M7BsxEsSKdoTw4="
          crossOrigin="anonymous" />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
