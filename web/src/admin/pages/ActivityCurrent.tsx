import { graphql } from "relay-runtime";
import { fetchQuery, useLazyLoadQuery, useRelayEnvironment } from "react-relay";
import { useSettings } from "../../lib/settings";
import { startTransition, useEffect, useState } from "react";
import type {
  ActivityCurrentQuery,
  ActivityCurrentQuery$data,
} from "./__generated__/ActivityCurrentQuery.graphql";
import ActivityListTable from "../components/ActivityListTable";

type PeriodEdge =
  ActivityCurrentQuery$data["location"]["periods"]["edges"][number];
type Period = NonNullable<PeriodEdge>["node"];

const ACTIVITY_CURRENT_PAGE_SIZE = 100;

function normalizePeriod(period: Period): Period {
  const category = period.category
    ? {
        ...period.category,
        name: period.category.name,
      }
    : period.category;

  return {
    ...period,
    startTime: period.startTime,
    endTime: period.endTime,
    category,
  };
}

export default function ActivityCurrent() {
  const settings = useSettings();
  const relayEnvironment = useRelayEnvironment();
  const data = useLazyLoadQuery<ActivityCurrentQuery>(
    graphql`
      query ActivityCurrentQuery($location: ID!, $first: Int!, $after: String) {
        location(id: $location) {
          id
          periods(onlyActive: true, first: $first, after: $after) {
            edges {
              node {
                id
                startTime
                endTime
                category {
                  id
                  name
                }
                person {
                  id
                  firstName
                  lastName
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `,
    {
      location: settings?.locationId || "",
      first: ACTIVITY_CURRENT_PAGE_SIZE,
      after: null,
    },
  );

  const [periods, setPeriods] = useState<Period[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const nextPeriods = data.location.periods.edges
      // edges can be null if we do client side deletes from the relay store
      .filter((edge): edge is NonNullable<typeof edge> => edge.node !== null)
      .map((edge) => normalizePeriod(edge.node));
    startTransition(() => {
      setPeriods(nextPeriods);
      setHasNextPage(data.location.periods.pageInfo.hasNextPage);
      setEndCursor(data.location.periods.pageInfo.endCursor ?? null);
    });
  }, [
    data.location.id,
    data.location.periods.edges,
    data.location.periods.pageInfo,
  ]);

  function getname(p: Period) {
    return `${p.person.firstName} ${p.person.lastName}`;
  }

  async function onLoadMore() {
    if (!hasNextPage || !endCursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const next = await fetchQuery<ActivityCurrentQuery>(
        relayEnvironment,
        graphql`
          query ActivityCurrentLoadMoreQuery(
            $location: ID!
            $first: Int!
            $after: String
          ) {
            location(id: $location) {
              id
              periods(onlyActive: true, first: $first, after: $after) {
                edges {
                  node {
                    id
                    startTime
                    endTime
                    category {
                      id
                      name
                    }
                    person {
                      id
                      firstName
                      lastName
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `,
        {
          location: settings?.locationId || "",
          first: ACTIVITY_CURRENT_PAGE_SIZE,
          after: endCursor,
        },
      ).toPromise();

      const nextPeriods =
        next?.location.periods.edges.map((edge) =>
          normalizePeriod(edge.node),
        ) ?? [];
      setPeriods((previous) => [...previous, ...nextPeriods]);
      setHasNextPage(next?.location.periods.pageInfo.hasNextPage ?? false);
      setEndCursor(next?.location.periods.pageInfo.endCursor ?? null);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <ActivityListTable
      firstcol="location"
      periods={periods}
      getname={getname}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      onLoadMore={onLoadMore}
    />
  );
}
