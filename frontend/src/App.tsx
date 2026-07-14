import React, { useEffect, useState } from "react";
import { BrowserRouter, useRoutes, useLocation } from "react-router-dom";
import "./assets/normalize.css";
import "./assets/styles.css";
import routes from "~react-pages";
import { AuthProvider } from "./context/AuthContext";
import AIChatWidget from "./ai/components/AIChatWidget";

function AppRouter() {
  const location = useLocation();
  const [authCssLoaded, setAuthCssLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Dynamically load auth.css only for /auth/* routes
    if (location.pathname.startsWith("/auth") && !authCssLoaded) {
      import("./assets/auth.css")
        .then(() => {
          if (isMounted) setAuthCssLoaded(true);
        })
        .catch((err) => console.error("Failed to load auth.css", err));
    }

    return () => {
      isMounted = false;
    };
  }, [location.pathname, authCssLoaded]);

  return useRoutes(routes);
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <AIChatWidget />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
