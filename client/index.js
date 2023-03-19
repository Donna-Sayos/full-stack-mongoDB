import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthContextProvider from "../client/src/context/auth/AuthProvider";
import ChatContextProvider from "./src/context/chat/ChatContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
