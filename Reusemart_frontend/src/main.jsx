import React from "react";
import ReactDOM from "react-dom/client"; 
import AppRouter from "./routes/index.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";

import { KeranjangProvider } from "./context/KeranjangContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KeranjangProvider>
      <AppRouter />
    </KeranjangProvider>
  </React.StrictMode>
)
