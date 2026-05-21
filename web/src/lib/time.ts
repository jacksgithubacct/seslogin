const fullDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
  hourCycle: "h23",
});

const shortTimeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
  hourCycle: "h23",
});

const dayOfWeekFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

export function formatFullDateTime(date: Date): string {
  return fullDateTimeFormatter.format(date);
}

export function formatTimeDiff(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  return formatSeconds(diffSecs);
}

export function formatSeconds(seconds: number): string {
  const diffMins = Math.round(seconds / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays >= 2) {
    return `${diffDays} days`;
  }
  if (diffHours >= 2) {
    return `${diffHours} hours`;
  }
  return `${diffMins} mins`;
}

export function formatTime(date: Date): string {
  return shortTimeFormatter.format(date);
}

export function formatDayDate(date: Date): string {
  return `${dayOfWeekFormatter.format(date)} ${date.getDate()}/${date.getMonth() + 1}`;
}

export function formatDayDateTime(date: Date): string {
  return `${formatDayDate(date)} ${formatTime(date)}`;
}

export function formatTimeOfDay(hours: number, minutes: number): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return shortTimeFormatter.format(d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function dateToInputDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
