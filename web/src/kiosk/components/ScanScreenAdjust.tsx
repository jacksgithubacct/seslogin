import { useRef, useState } from "react";
import ScanModalDateTime from "./ScanModalDateTime";
import { formatDayDate, formatTimeOfDay, isSameDay } from "../../lib/time";
import type { TransactionSignedOut } from "../ScanState";
import { categories as categoriesFixture } from "../../lib/categories";

type TimeOfDay = { hours: number; minutes: number };

function dateOnly(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

function combine(date: Date, time: TimeOfDay, end: boolean): Date {
  const result = new Date(date);
  const sec = end ? 59 : 0;
  const ms = end ? 999 : 0; // this will get rounded down
  result.setHours(time.hours, time.minutes, sec, ms);
  return result;
}

function Inner(props: {
  transaction: TransactionSignedOut;
  onSubmit: (startTime: Date, endTime: Date) => void;
  onEditCategory: () => void;
  isSubmitting: boolean;
}) {
  const transaction = props.transaction;
  const [date, setDate] = useState<Date>(() => dateOnly(transaction.startTime));
  const [startTime, setStartTime] = useState<TimeOfDay>({
    hours: transaction.startTime.getHours(),
    minutes: transaction.startTime.getMinutes(),
  });
  // if endTime is not set and startTime is more than 20h ago, set endTime to startTime + 1h
  const [endTime, setEndTime] = useState<TimeOfDay>(() => {
    const end =
      transaction.endTime ||
      (transaction.startTime.getTime() < Date.now() - 20 * 60 * 60 * 1000
        ? new Date(transaction.startTime.getTime() + 60 * 60 * 1000)
        : new Date());
    return { hours: end.getHours(), minutes: end.getMinutes() };
  });
  const showDateTimeModal = useRef<(field: string) => void | null>(null);

  const startTimeStr = formatTimeOfDay(startTime.hours, startTime.minutes);
  const endTimeStr = formatTimeOfDay(endTime.hours, endTime.minutes);
  const startDayStr = formatDayDate(date);
  const isStartToday = isSameDay(date, new Date());

  function changeStartDay(delta: number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + delta);

    const today = new Date();
    if (
      newDate.getFullYear() > today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() &&
        newDate.getMonth() > today.getMonth()) ||
      (newDate.getFullYear() === today.getFullYear() &&
        newDate.getMonth() === today.getMonth() &&
        newDate.getDate() > today.getDate())
    ) {
      return;
    }

    setDate(newDate);
  }

  function showModalForField(field: string) {
    // this might not be set due to a race relating to the useEffect in ScanModalDateTime
    showDateTimeModal.current!(field);
  }

  function uponModalSave(field: string, value: string) {
    const hours = parseInt(value.slice(0, 2), 10);
    const minutes = parseInt(value.slice(2, 4), 10);
    if (field === "startTime") {
      setStartTime({ hours, minutes });
    } else if (field === "endTime") {
      setEndTime({ hours, minutes });
    }
  }

  function buildStartDate(): Date {
    return combine(date, startTime, false);
  }

  function buildEndDate(): Date {
    const endSameDay = combine(date, endTime, true);
    const start = buildStartDate();
    if (endSameDay > start) {
      return endSameDay;
    }
    const endNextDay = new Date(endSameDay);
    endNextDay.setDate(endNextDay.getDate() + 1);
    return endNextDay;
  }

  let categoryName = "Unknown";
  let subcategoryName = "Unknown";
  let categoryIcon = "unknown";

  for (const category of categoriesFixture) {
    for (const subcategory of category.subcategories || []) {
      if (subcategory.id === props.transaction.categoryId) {
        categoryName = category.name;
        subcategoryName = subcategory.name;
        categoryIcon = subcategory.icon;
        break;
      }
    }
  }

  function onSubmit() {
    props.onSubmit(buildStartDate(), buildEndDate());
  }

  return (
    <>
      <ScanModalDateTime
        getShowFunction={(show) => {
          showDateTimeModal.current = show;
        }}
        onSave={uponModalSave}
      />
      <h1 className="adjust-title">Adjust</h1>

      <div className="adjust-grid">
        <div className="adjust-row">
          <div className="adjust-label">Day:</div>
          <div className="day_selector">
            <button
              className="button day_nav"
              onClick={() => changeStartDay(-1)}
            >
              &#8592;
            </button>
            <span className="day_name">{startDayStr}</span>
            <button
              className="button day_nav"
              onClick={() => changeStartDay(1)}
              disabled={isStartToday}
            >
              &#8594;
            </button>
          </div>
        </div>
        <div className="adjust-row">
          <div className="adjust-label">Start time:</div>
          <div className="time value_start">{startTimeStr}</div>
          <div className="adjust-action">
            <button
              className="button edit_start"
              onClick={() => showModalForField("startTime")}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="adjust-row">
          <div className="adjust-label">End time:</div>
          <div className="time value_end">{endTimeStr}</div>
          <div className="adjust-action">
            <button
              className="button edit_end"
              onClick={() => showModalForField("endTime")}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="adjust-row">
          <div className="adjust-label">Category:</div>
          <div className="category_value">
            <img src={`/image/categories-cas/${categoryIcon}.png`} />
            <div className="category_text">
              <div>{categoryName}</div>
              <div>{subcategoryName}</div>
            </div>
          </div>
          <div className="adjust-action">
            <button
              className="button edit_category"
              onClick={props.onEditCategory}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <button
        className="button submit"
        onClick={onSubmit}
        disabled={props.isSubmitting}
      >
        {props.isSubmitting ? <span className="adjust-spinner" /> : "Submit"}
      </button>
    </>
  );
}

// we expose this wrapper just so we can reset inner state on UUID change without
// causing the container <div> to remount and lose CSS transition state
export default function ScanScreenAdjust(props: {
  transaction: TransactionSignedOut | null;
  uuid: string | null;
  screenPosition: string;
  onEditCategory: () => void;
  onSubmit: (startTime: Date, endTime: Date) => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="view adjustview" style={{ left: props.screenPosition }}>
      {props.transaction && (
        <Inner
          key={props.transaction.uuid}
          transaction={props.transaction}
          onEditCategory={props.onEditCategory}
          onSubmit={props.onSubmit}
          isSubmitting={props.isSubmitting}
        />
      )}
    </div>
  );
}
