import type { ReactElement } from "react";
import { getErrorMessage, type FallbackProps } from "react-error-boundary";

export default function Bluescreen({
  error,
  resetErrorBoundary,
}: FallbackProps): ReactElement {
  return (
    <div>
      <h1>A problem has been detected.</h1>
      <pre>Error: {getErrorMessage(error)}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Restart
      </button>
    </div>
  );
}
