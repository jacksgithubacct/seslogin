import { formatSeconds } from "../../lib/time";

export type ActivityTotalsRow = {
  id: string;
  name: string;
  totalTime: number;
};

type Props = {
  title: string;
  rows: ReadonlyArray<ActivityTotalsRow>;
};

export default function ActivityTotalsTable({ title, rows }: Props) {
  return (
    <div className="activity-totals-panel">
      <h2>{title}</h2>
      <div className="activity-list">
        {rows.map((entry) => (
          <div className="activity-row" key={entry.id}>
            <div className="activity-row-name">{entry.name}</div>
            <div className="activity-row-value">
              {formatSeconds(entry.totalTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
