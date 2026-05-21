import { useState } from "react";
import { dateToInputDateTimeLocal } from "../../lib/time";

export default function useActivityTimeRange() {
  const [defaultRange] = useState(() => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      startInput: dateToInputDateTimeLocal(startDate),
      endInput: dateToInputDateTimeLocal(endDate),
      startUnix: Math.floor(startDate.getTime() / 1000),
      endUnix: Math.floor(endDate.getTime() / 1000),
    };
  });

  const [startInput, setStartInput] = useState(defaultRange.startInput);
  const [endInput, setEndInput] = useState(defaultRange.endInput);

  const parsedStartMs = Date.parse(startInput);
  const parsedEndMs = Date.parse(endInput);
  const startTime = Number.isNaN(parsedStartMs)
    ? defaultRange.startUnix
    : Math.floor(parsedStartMs / 1000);
  const endTime = Number.isNaN(parsedEndMs)
    ? defaultRange.endUnix
    : Math.floor(parsedEndMs / 1000);
  const hasValidRange = startTime < endTime;

  return {
    startInput,
    endInput,
    setStartInput,
    setEndInput,
    hasValidRange,
    queryStartTime: hasValidRange ? startTime : defaultRange.startUnix,
    queryEndTime: hasValidRange ? endTime : defaultRange.endUnix,
  };
}
