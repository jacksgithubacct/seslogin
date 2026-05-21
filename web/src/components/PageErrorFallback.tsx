import { useState } from "react";
import type { FallbackProps } from "react-error-boundary";

export default function PageErrorFallback({
  error,
  resetErrorBoundary,
  showDetailsByDefault = false,
}: FallbackProps & { showDetailsByDefault?: boolean }) {
  const [showDetails, setShowDetails] = useState(showDetailsByDefault);

  return (
    <div role="alert">
      <p>Something went wrong</p>
      {showDetails ? <pre style={{ color: "red" }}>{error.message}</pre> : null}
      <button className="action-button" onClick={resetErrorBoundary}>
        Try again
      </button>
      <button
        className="action-button"
        onClick={() => setShowDetails((prev) => !prev)}
      >
        {showDetails ? "Hide details" : "Show details"}
      </button>
    </div>
  );
}
