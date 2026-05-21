import { Fragment } from "react";
import { formatSeconds } from "../../lib/time";

export type ActivityBreakdownChildRow = {
  id: string;
  name: string;
  totalTime: number;
};

export type ActivityBreakdownGroupRow = {
  id: string;
  name: string;
  totalTime: number;
  children: ReadonlyArray<ActivityBreakdownChildRow>;
};

type Props = {
  title: string;
  rows: ReadonlyArray<ActivityBreakdownGroupRow>;
};

export default function ActivityBreakdownTable({ title, rows }: Props) {
  return (
    <div className="activity-totals-panel">
      <h2>{title}</h2>
      <div className="activity-list">
        {rows.map((entry) => (
          <Fragment key={entry.id}>
            <div className="activity-row">
              <div className="activity-row-name">{entry.name}</div>
              <div className="activity-row-value">
                {formatSeconds(entry.totalTime)}
              </div>
            </div>
            {entry.children.map((child) => (
              <div
                key={`${entry.id}-${child.id}`}
                className="activity-row activity-breakdown-child"
              >
                <div className="activity-row-name activity-breakdown-indent">
                  {child.name}
                </div>
                <div className="activity-row-value">
                  {formatSeconds(child.totalTime)}
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
