import { graphql, useLazyLoadQuery } from "react-relay";
import { useEffect, useState } from "react";
import type { StatusQuery } from "./__generated__/StatusQuery.graphql";
import StatusCurrentDisplay from "../components/StatusCurrentDisplay";

const REFRESH_INTERVAL_MS = 60_000;

export default function Status() {
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFetchKey((k) => k + 1);
    }, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  const data = useLazyLoadQuery<StatusQuery>(
    graphql`
      query StatusQuery($first: Int!) {
        session {
          location {
            periods(onlyActive: true, first: $first) {
              edges {
                node {
                  id
                  startTime
                  person {
                    id
                    firstName
                    lastName
                  }
                }
              }
            }
          }
        }
      }
    `,
    { first: 100 },
    { fetchKey, fetchPolicy: "network-only" },
  );

  const periods = data.session.location.periods.edges
    .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
    .map((edge) => edge.node);

  return <StatusCurrentDisplay periods={periods} />;
}
