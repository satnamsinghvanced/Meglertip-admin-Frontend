import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      theme={localStorage.getItem("darkMode") === "true" ? "dark" : "light"}
      autoClose={3000}
      toastClassName="font-semibold"
    />
  </StrictMode>
);
