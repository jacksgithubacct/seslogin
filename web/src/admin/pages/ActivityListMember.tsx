import { graphql } from "relay-runtime";
import { fetchQuery, useLazyLoadQuery, useRelayEnvironment } from "react-relay";
import ActivityListTable from "../components/ActivityListTable";
import type {
  ActivityListMemberQuery,
  ActivityListMemberQuery$data,
} from "./__generated__/ActivityListMemberQuery.graphql";
import { useParams } from "react-router";
import { startTransition, useEffect, useState } from "react";

type PeriodEdge =
  ActivityListMemberQuery$data["person"]["periods"]["edges"][number];
type Period = NonNullable<PeriodEdge>["node"];

const ACTIVITY_MEMBER_PAGE_SIZE = 100;

export default function ActivityListMember() {
  const params = useParams();
  const relayEnvironment = useRelayEnvironment();
  const data = useLazyLoadQuery<ActivityListMemberQuery>(
    graphql`
      query ActivityListMemberQuery(
        $person: ID!
        $first: Int!
        $after: String
      ) {
        person(id: $person) {
          id
          firstName
          lastName
          periods(first: $first, after: $after) {
            edges {
              node {
                id
                startTime
                endTime
                nitcExportStatus
                nitcEventId
                category {
                  id
                  name
                }
                location {
                  id
                  name
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
      person: params.memberId!,
      first: ACTIVITY_MEMBER_PAGE_SIZE,
      after: null,
    },
  );

  const [periods, setPeriods] = useState<Period[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const nextPeriods = data.person.periods.edges.map((edge) => edge.node);
    startTransition(() => {
      setPeriods(nextPeriods);
      setHasNextPage(data.person.periods.pageInfo.hasNextPage);
      setEndCursor(data.person.periods.pageInfo.endCursor ?? null);
    });
  }, [data.person.id, data.person.periods.edges, data.person.periods.pageInfo]);

  function getname(p: Period) {
    return p.location?.name;
  }

  async function onLoadMore() {
    if (!hasNextPage || !endCursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const next = await fetchQuery<ActivityListMemberQuery>(
        relayEnvironment,
        graphql`
          query ActivityListMemberLoadMoreQuery(
            $person: ID!
            $first: Int!
            $after: String
          ) {
            person(id: $person) {
              id
              firstName
              lastName
              periods(first: $first, after: $after) {
                edges {
                  node {
                    id
                    startTime
                    endTime
                    nitcExportStatus
                    category {
                      id
                      name
                    }
                    location {
                      id
                      name
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
          person: params.memberId!,
          first: ACTIVITY_MEMBER_PAGE_SIZE,
          after: endCursor,
        },
      ).toPromise();

      const nextPeriods =
        next?.person.periods.edges.map((edge) => edge.node) ?? [];
      setPeriods((previous) => [...previous, ...nextPeriods]);
      setHasNextPage(next?.person.periods.pageInfo.hasNextPage ?? false);
      setEndCursor(next?.person.periods.pageInfo.endCursor ?? null);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <>
      <p>
        Activity report for: {data.person.firstName} {data.person.lastName}
      </p>
      <ActivityListTable
        firstcol="location"
        periods={periods}
        getname={getname}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore}
      />
    </>
  );
}
