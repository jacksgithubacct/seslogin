import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";
import ActivityTotalsTable, {
  type ActivityTotalsRow,
} from "./ActivityTotalsTable";
import type { ActivityTotalsQuery } from "../pages/__generated__/ActivityTotalsQuery.graphql";

interface ActivityTotalsDisplayProps {
  locationId: string;
  startTime: number;
  endTime: number;
}

export default function ActivityTotalsDisplay({
  locationId,
  startTime,
  endTime,
}: ActivityTotalsDisplayProps) {
  const data = useLazyLoadQuery<ActivityTotalsQuery>(
    graphql`
      query ActivityTotalsDisplayQuery(
        $location: ID!
        $startTime: Int!
        $endTime: Int!
      ) {
        location(id: $location) {
          id
          periodSummaryByMember(startTime: $startTime, endTime: $endTime) {
            person {
              id
              firstName
              lastName
            }
            totalTime
          }
          periodSummaryByCategory(startTime: $startTime, endTime: $endTime) {
            category {
              id
              name
            }
            totalTime
          }
        }
      }
    `,
    {
      location: locationId,
      startTime,
      endTime,
    },
  );

  const memberRows: ReadonlyArray<ActivityTotalsRow> =
    data.location.periodSummaryByMember.map((entry) => ({
      id: entry.person.id,
      name: `${entry.person.firstName} ${entry.person.lastName}`,
      totalTime: entry.totalTime,
    }));

  const categoryRows: ReadonlyArray<ActivityTotalsRow> =
    data.location.periodSummaryByCategory.map((entry) => ({
      id: entry.category.id,
      name: entry.category.name,
      totalTime: entry.totalTime,
    }));

  return (
    <div className="activity-totals-grid">
      <ActivityTotalsTable title="Time per member" rows={memberRows} />
      <ActivityTotalsTable title="Time per category" rows={categoryRows} />
    </div>
  );
}
