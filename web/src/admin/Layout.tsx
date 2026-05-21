import { useAuth0 } from "@auth0/auth0-react";
import { Suspense, startTransition, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AdminContent from "./components/AdminContent";
import LoadingIndicator from "../components/LoadingIndicator";
import PageErrorFallback from "../components/PageErrorFallback";
import { Auth0Provider } from "@auth0/auth0-react";
import SettingsProvider from "./components/SettingsProvider";
import "./style.css";
import { UserInfoProvider } from "./components/UserInfoProvider";
import AdminRelayEnvironment from "./components/AdminRelayEnvironment";
import { Outlet } from "react-router";
import AdminLoginPage from "./components/AdminLoginPage";

export default function Layout() {
  return (
    <div id="admin">
      <ErrorBoundary FallbackComponent={PageErrorFallback}>
        <AdminAuthProvider />
      </ErrorBoundary>
    </div>
  );
}

function AdminAuthProvider() {
  return (
    <Auth0Provider
      domain="auth.seslogin.com"
      clientId="5dECCcUEKvNNVpp0cyss4O4nI4RkrJaw"
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : "",
        audience: "https://api.seslogin.com",
      }}
      cacheLocation="localstorage"
    >
      <LoginRequired />
    </Auth0Provider>
  );
}

type AuthState = "loading" | "authenticated" | "unauthenticated";

function LoginRequired() {
  const { isAuthenticated, loginWithPopup, logout, isLoading } = useAuth0();
  console.log("Auth0 loading:", isLoading, "authenticated:", isAuthenticated);
  const [authState, setAuthState] = useState<AuthState>(
    isLoading
      ? "loading"
      : isAuthenticated
        ? "authenticated"
        : "unauthenticated",
  );
  const [accessDenied, setAccessDenied] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (authState === "loading" && !isLoading) {
      startTransition(() => {
        if (isAuthenticated) {
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      });
    }
  }, [isLoading, isAuthenticated, authState]);

  function onUnauthorized() {
    setAuthState("unauthenticated");
    setAccessDenied(true);
  }

  function onTokenError() {
    setAccessDenied(false);
    setLoginError(
      "Failed to get an auth token - your session may have expired. Please try logging in again.",
    );
    setAuthState("unauthenticated");
  }

  async function onLogin() {
    setAccessDenied(false);
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      await loginWithPopup();
    } catch {
      setLoginError(
        "Login did not complete. Try again to receive a fresh email code.",
      );
    } finally {
      setIsLoggingIn(false);
      setAuthState("authenticated");
    }
  }

  function onLogout() {
    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/admin`,
      },
    });
  }

  if (authState === "loading") {
    return <LoadingIndicator />;
  }

  if (authState !== "authenticated") {
    return (
      <AdminLoginPage
        onLogin={onLogin}
        onLogout={onLogout}
        isLoading={isLoggingIn}
        errorMessage={loginError}
        showUnauthorizedMessage={accessDenied}
      />
    );
  }

  return (
    <SettingsProvider>
      <AdminRelayEnvironment
        onTokenError={onTokenError}
        onUnauthorized={onUnauthorized}
      >
        <ErrorBoundary FallbackComponent={PageErrorFallback}>
          <Suspense fallback={<LoadingIndicator />}>
            <UserInfoProvider>
              <AdminContent>
                <Suspense fallback={<LoadingIndicator />}>
                  <Outlet />
                </Suspense>
              </AdminContent>
            </UserInfoProvider>
          </Suspense>
        </ErrorBoundary>
      </AdminRelayEnvironment>
    </SettingsProvider>
  );
}
