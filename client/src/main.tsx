import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  AuthState,
  ConversationsState,
  SocketState,
} from "./constants/Imports.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthState>
          <ConversationsState>
            <SocketState>
              <App />
            </SocketState>
          </ConversationsState>
        </AuthState>
      </QueryClientProvider>
    </React.StrictMode>
  </BrowserRouter>
);
