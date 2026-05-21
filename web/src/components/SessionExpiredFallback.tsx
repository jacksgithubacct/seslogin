export default function SessionExpiredFallback({
  message,
  onSignInAgain,
  onRetry,
}: {
  message: string;
  onSignInAgain: () => void;
  onRetry: () => void;
}) {
  return (
    <div role="alert">
      <h2>Kiosk expired</h2>
      <p>{message}</p>
      <button className="action-button" onClick={onSignInAgain}>
        Sign in again
      </button>
      <button className="action-button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
