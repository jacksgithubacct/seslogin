import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import type { FetchFunction, GraphQLResponse } from 'relay-runtime';

const SERVER_URL = 'http://localhost:8001/';

const fetchFn: FetchFunction = async (request, variables) => {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: request.text, variables }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<GraphQLResponse>;
};

export const environment = new Environment({
  network: Network.create(fetchFn),
  store: new Store(new RecordSource()),
});
