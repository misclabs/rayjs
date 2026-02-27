import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "./main.css";
import Bluescreen from "./bluescreen.tsx";
import App from "./app.tsx";

createRoot(document.getElementById("app-root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Bluescreen}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
