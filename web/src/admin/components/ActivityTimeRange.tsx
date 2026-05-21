type Props = {
  startInput: string;
  endInput: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
};

export default function ActivityTimeRange({
  startInput,
  endInput,
  onStartChange,
  onEndChange,
}: Props) {
  return (
    <div className="activity-totals-range">
      <label>
        Start time:&nbsp;
        <input
          type="datetime-local"
          value={startInput}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </label>
      <label>
        End time:&nbsp;
        <input
          type="datetime-local"
          value={endInput}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </label>
    </div>
  );
}
