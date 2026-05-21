import { Suspense } from "react";
import { useSettings } from "../../lib/settings";
import ActivityTimeRange from "../components/ActivityTimeRange";
import ActivityTotalsDisplay from "../components/ActivityTotalsDisplay";
import LoadingIndicator from "../../components/LoadingIndicator";
import useActivityTimeRange from "../components/useActivityTimeRange";

export default function ActivityTotals() {
  const settings = useSettings();
  const {
    startInput,
    endInput,
    setStartInput,
    setEndInput,
    hasValidRange,
    queryStartTime,
    queryEndTime,
  } = useActivityTimeRange();

  return (
    <>
      <ActivityTimeRange
        startInput={startInput}
        endInput={endInput}
        onStartChange={setStartInput}
        onEndChange={setEndInput}
      />
      {!hasValidRange && (
        <p className="error">Start time must be before end time.</p>
      )}

      {hasValidRange && (
        <Suspense fallback={<LoadingIndicator />}>
          <ActivityTotalsDisplay
            locationId={settings?.locationId || ""}
            startTime={queryStartTime}
            endTime={queryEndTime}
          />
        </Suspense>
      )}
    </>
  );
}
