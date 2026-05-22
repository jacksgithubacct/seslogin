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
import {
  getAdminToken,
  setAdminToken,
  clearAdminToken,
} from "../lib/adminToken";
import { getGraphQLEndpoint } from "../lib/api";
import {
  getCurrentClientVersion,
  CLIENT_VERSION_HEADER,
} from "../lib/clientVersion";

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

  const hasStoredToken = getAdminToken() !== null;

  const [authState, setAuthState] = useState<AuthState>(
    isLoading
      ? "loading"
      : isAuthenticated || hasStoredToken
        ? "authenticated"
        : "unauthenticated",
  );
  const [accessDenied, setAccessDenied] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (authState === "loading" && !isLoading) {
      startTransition(() => {
        if (isAuthenticated || getAdminToken() !== null) {
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      });
    }
  }, [isLoading, isAuthenticated, authState]);

  function onUnauthorized() {
    clearAdminToken();
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

  function onNewTokenReceived(token: string) {
    setAdminToken(token);
    setAccessDenied(false);
    setLoginError(null);
    startTransition(() => {
      setAuthState("authenticated");
    });
  }

  async function onLogout() {
    const token = getAdminToken();
    if (token) {
      try {
        await fetch(getGraphQLEndpoint(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            [CLIENT_VERSION_HEADER]: getCurrentClientVersion(),
          },
          body: JSON.stringify({ query: "mutation { logout }" }),
          cache: "no-store",
        });
      } catch {
        // Ignore — token will expire via TTL regardless
      }
      clearAdminToken();
    }
    setAuthState("unauthenticated");
    setAccessDenied(false);
    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/`,
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
        onNewTokenReceived={onNewTokenReceived}
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
              <AdminContent onLogout={onLogout}>
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
