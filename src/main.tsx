import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

// import "./index.css";
import App from "./app.tsx";
import Bluescreen from "./bluescreen.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Bluescreen}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
