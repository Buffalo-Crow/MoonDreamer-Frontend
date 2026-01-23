import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./Components/App/App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/userContext";
import { ModalProvider } from "./contexts/modalContext";
import { DreamProvider } from "./contexts/dreamContext";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('SW registered:', registration);
      
      // Check for updates every 60 seconds
      setInterval(() => {
        registration.update();
      }, 60000);
      
      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, prompt user to refresh
            if (confirm('A new version of MoonDreamer is available! Reload to update?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
    })
    .catch(error => console.log('SW registration failed:', error));
  
  // Reload page when new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

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
