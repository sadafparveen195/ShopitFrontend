import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./index.css";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <BrowserRouter>
          {/* AuthProvider should wrap others so all children have access */}
          <AuthProvider>
            <CartProvider>
                <div onContextMenu={(e) => e.preventDefault()}>
                  <App />
                </div>          
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
  </React.StrictMode>
);
