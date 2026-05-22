import {
  Environment,
  Network,
  RecordSource,
  Store,
  type FetchFunction,
} from "relay-runtime";
import { fetchGraphQL } from "./graphql";

type GetTokenFn = () => Promise<string>;

/**
 * Creates a Relay environment for admin routes.
 * getToken is called per-request; it should prefer the stored opaque token
 * and fall back to Auth0's getAccessTokenSilently.
 */
export function createAdminGraphQLEnvironment(
  getToken: GetTokenFn,
  onTokenError: () => void,
  onUnauthorized: () => void,
): Environment {
  const _fetchGraphQL: FetchFunction = async (request, variables) => {
    let authToken: string;
    try {
      authToken = await getToken();
    } catch (err) {
      console.error("Failed to get auth token:", err);
      onTokenError();
      throw new Error("Failed to get auth token", { cause: err });
    }

    return await fetchGraphQL(authToken, request, variables, () => {
      console.log("Unauthorized in admin section");
      onUnauthorized();
      throw new Error("Unauthorized from server");
    });
  };

  const environment = new Environment({
    network: Network.create(_fetchGraphQL),
    store: new Store(new RecordSource()),
  });

  return environment;
}

/**
 * Creates a Relay environment for kiosk routes that uses the cached kiosk auth token
 */
export function createKioskGraphQLEnvironment(
  getScanToken: () => string | null,
  onUnauthorized: () => void,
): Environment {
  const _fetchGraphQL: FetchFunction = async (request, variables) => {
    const authToken = getScanToken();

    if (authToken == null) {
      onUnauthorized();
      throw new Error("Failed to get auth token");
    }

    return await fetchGraphQL(authToken, request, variables, () => {
      console.log("Unauthorized in kiosk section");
      onUnauthorized();
      throw new Error("Unauthorized from server");
    });
  };

  const environment = new Environment({
    network: Network.create(_fetchGraphQL),
    store: new Store(new RecordSource(), { gcReleaseBufferSize: 0 }),
  });

  return environment;
}

export function createUnauthenticatedGraphQLEnvironment(): Environment {
  const _fetchGraphQL: FetchFunction = async (request, variables) => {
    return await fetchGraphQL(null, request, variables, () => {
      console.log("Unauthorized in unauthenticated environment");
    });
  };

  const environment = new Environment({
    network: Network.create(_fetchGraphQL),
    // note: no cache/store as this is intended for one-off requests without auth
  });

  return environment;
}

export const unauthenticatedEnvironment =
  createUnauthenticatedGraphQLEnvironment();
