import { ChatContextProvider } from "@/app/ChatContext";
import { AuthContextProvider } from "@/app/AuthContext";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <Page {...pageProps} />
      </ChatContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
