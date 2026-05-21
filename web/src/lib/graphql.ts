import { getGraphQLEndpoint } from "./api";
import {
  CLIENT_VERSION_HEADER,
  getCurrentClientVersion,
} from "./clientVersion";
import {
  blockClientUpdates,
  clearBlockClientUpdates,
} from "./clientUpdateLeases";
import { type RequestParameters, type Variables } from "relay-runtime";

let requestLeaseCounter = 0;

function nextRequestLeaseId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `graphql:${crypto.randomUUID()}`;
  }
  requestLeaseCounter += 1;
  return `graphql:${requestLeaseCounter}`;
}

export async function fetchGraphQL(
  token: string | null | undefined,
  request: RequestParameters,
  variables: Variables,
  onUnauthorized: () => void,
) {
  console.log(
    "fetchGraphQL for request ",
    request.name,
    " variables:",
    variables,
  );
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    [CLIENT_VERSION_HEADER]: getCurrentClientVersion(),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const endpoint = getGraphQLEndpoint();
  let resp: Response;
  const leaseId = nextRequestLeaseId();
  blockClientUpdates(
    leaseId,
    `GraphQL request in-flight: ${request.name ?? "unknown"}`,
  );
  try {
    resp = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: request.text, variables }),
      cache: "no-store",
    });
  } catch (error) {
    throw new Error(
      `Failed to fetch GraphQL endpoint ${endpoint}: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  } finally {
    clearBlockClientUpdates(leaseId);
  }
  if (resp.status === 401) {
    onUnauthorized();
    throw new Error("Unauthorized");
  }
  if (!resp.ok) {
    throw new Error("Response failed.");
  }
  return await resp.json();
}
