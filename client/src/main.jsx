import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import App from "./App";
import './index.css'
// Ensure StateContextProvider is correctly imported
import { StateContextProvider } from "./context/index"; // Adjust the path as needed

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThirdwebProvider desiredChainId={ChainId.sepolia}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
