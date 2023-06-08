import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import enUS from "antd/es/locale/en_US";
import "antd/dist/reset.css";
import "./index.css";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConfigProvider locale={enUS}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
