interface AdminLoginPageProps {
  onLogin: () => void | Promise<void>;
  onLogout?: () => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
  showUnauthorizedMessage?: boolean;
}

export default function AdminLoginPage({
  onLogin,
  onLogout,
  isLoading = false,
  errorMessage,
  showUnauthorizedMessage = false,
}: AdminLoginPageProps) {
  return (
    <section className="action-panel">
      <div className="action-panel__panel">
        {/* <p className="action-panel__eyebrow">Admin access</p> */}
        <h1>Please sign in to continue</h1>
        <p className="action-panel__intro">
          Please click the button below to sign in with the email address
          registered with the system. You will then receive an email with a
          secure login code you can enter to be granted access.
        </p>

        {!errorMessage ? (
          <div className="action-panel__note">
            Ensure you use the exact email address that was pre-registered.
          </div>
        ) : null}

        {showUnauthorizedMessage ? (
          <div className="action-panel__message action-panel__message--warning">
            An unauthorized error was encountered. It is possible that the email
            address you used to sign in is not registered for admin access. Try
            refreshing the page if you believe you used the correct email
            address or click the button below to try logging in with a different
            email address.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="action-panel__message action-panel__message--error">
            {errorMessage}
          </div>
        ) : null}

        {showUnauthorizedMessage || (
          <button
            type="button"
            className="action-button action-panel__button"
            onClick={onLogin}
            disabled={isLoading}
          >
            {isLoading ? "Waiting for sign-in..." : "Sign-in via email"}
          </button>
        )}

        {showUnauthorizedMessage && onLogout ? (
          <button
            type="button"
            className="action-button action-panel__button action-panel__button--secondary"
            onClick={onLogout}
            disabled={isLoading}
          >
            Log out of current account
          </button>
        ) : null}
      </div>
    </section>
  );
}
