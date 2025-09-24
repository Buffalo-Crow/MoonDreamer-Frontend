import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./Components/App/App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/userContext";
import { ModalProvider } from "./contexts/modalContext";
import { DreamProvider } from "./contexts/dreamContext";

createRoot(document.getElementById("root")).render(
 <StrictMode> 
  <BrowserRouter>
    <UserProvider>
      <ModalProvider>
        <DreamProvider>
          <App />
        </DreamProvider>
      </ModalProvider>
    </UserProvider>
  </BrowserRouter>
 </StrictMode>
);
