import type { ReactElement } from "react";
import { getErrorMessage, type FallbackProps } from "react-error-boundary";

export default function Bluescreen({
  error,
  resetErrorBoundary,
}: FallbackProps): ReactElement {
  return (
    <>
      <h1>A problem has been detected.</h1>
      <p>
        Your beloved website has been shut down to prevent damage to your
        fragile human brain. Feel free to touch some grass.
      </p>
      <pre>Error: {getErrorMessage(error)}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Restart
      </button>
    </>
  );
}
