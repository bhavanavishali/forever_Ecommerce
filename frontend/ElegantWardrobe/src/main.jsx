import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import SearchContext from "./context/SearchContextProvider.jsx";
import SearchContextProvider from "./context/SearchContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    {/* for the whole project get support of react router dom */}
    <ShopContextProvider>
      <SearchContextProvider>
        <App />
      </SearchContextProvider>
    </ShopContextProvider>
  </BrowserRouter>
);
