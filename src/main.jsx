import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import GlobalStyle from "./Components/GlobalStyle/GlobalStyle.jsx";
import { AuthProvider } from "~/Context/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalStyle>
          <App />
        </GlobalStyle>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
