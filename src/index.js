import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css"; // Tailwind or custom CSS
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from './context/AuthContext';

// Create the root element
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// Use the new render method
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);