import type {
  TransactionState,
  Transaction as TransactionType,
  TransactionLoading as TransactionLoadingType,
  TransactionSignedIn as TransactionSignedInType,
  TransactionSignedOut as TransactionSignedOutType,
  TransactionError as TransactionErrorType,
} from "../ScanState";
import { formatTime, formatDayDateTime } from "../../lib/time";
import { useCallback, useEffect, useRef, useState } from "react";

// ensure this is less than the transaction timeout in ScanState
const FINALIZED_TRANSACTION_TIMEOUT_MS = 10_000;
const FINALIZED_TRANSACTION_FADE_MS = 1_000;
const SCAN_INPUT_TIMEOUT_MS = 10_000;

function TransactionList(props: { transactionState: TransactionState }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div id="transactions">
      {props.transactionState.transactions
        .filter((t) => {
          if (
            t.status !== "SIGNED_IN" &&
            t.status !== "SIGNED_OUT" &&
            t.status !== "ERROR"
          ) {
            return true;
          }

          if (t.finalizedTime === undefined) {
            return true;
          }

          const elapsedMs = now - t.finalizedTime.getTime();
          return elapsedMs < FINALIZED_TRANSACTION_TIMEOUT_MS;
        })
        .map((t) => {
          let isFading = false;
          if (
            t.status === "SIGNED_IN" ||
            t.status === "SIGNED_OUT" ||
            t.status === "ERROR"
          ) {
            const elapsedMs =
              t.finalizedTime === undefined
                ? 0
                : now - t.finalizedTime.getTime();
            isFading =
              elapsedMs >=
              FINALIZED_TRANSACTION_TIMEOUT_MS - FINALIZED_TRANSACTION_FADE_MS;
          }

          return (
            <Transaction key={t.uuid} transaction={t} isFading={isFading} />
          );
        })}
    </div>
  );
}

function TransactionLoading(props: { transaction: TransactionLoadingType }) {
  return (
    <p className="transaction">
      <span className="transaction">
        Fetching information for {props.transaction.memberId}
      </span>
      <span className="loading active"></span>
    </p>
  );
}

function TransactionSignedIn(props: {
  transaction: TransactionSignedInType;
  isFading: boolean;
}) {
  const { transaction: txn, isFading } = props;
  return (
    <p className="transaction">
      <span className={`transaction success ${isFading ? "expiring" : ""}`}>
        <span className="emphasis">
          {txn.person.firstName} {txn.person.lastName}
        </span>{" "}
        signed in at {formatTime(txn.startTime)}
      </span>
      <span className="loading"></span>
    </p>
  );
}

function TransactionSignedOut(props: {
  transaction: TransactionSignedOutType;
  isFading: boolean;
}) {
  const { transaction: txn, isFading } = props;
  // if startTime is not the current day, show the date
  const startTimeStr =
    txn.startTime.toDateString() === new Date().toDateString()
      ? formatTime(txn.startTime)
      : formatDayDateTime(txn.startTime);
  const endTimeStr =
    txn.endTime === undefined
      ? "?"
      : txn.endTime.toDateString() === new Date().toDateString()
        ? formatTime(txn.endTime)
        : formatDayDateTime(txn.endTime);
  return (
    <p className="transaction">
      <span className={`transaction success ${isFading ? "expiring" : ""}`}>
        <span className="emphasis">
          {txn.person.firstName} {txn.person.lastName}
        </span>{" "}
        signed out: {startTimeStr} &ndash; {endTimeStr}
      </span>
      <span className="loading"></span>
    </p>
  );
}

function TransactionError(props: {
  transaction: TransactionErrorType;
  isFading: boolean;
}) {
  const { transaction: txn, isFading } = props;
  return (
    <p className="transaction">
      <span className={`transaction error ${isFading ? "expiring" : ""}`}>
        <span className="emphasis">Error:</span> {txn.message}
      </span>
      <span className="loading"></span>
    </p>
  );
}

function Transaction(props: {
  transaction: TransactionType;
  isFading: boolean;
}) {
  const { transaction: txn, isFading } = props;

  if (txn.status === "LOADING") {
    return <TransactionLoading transaction={txn} />;
  } else if (txn.status === "SIGNED_IN") {
    return <TransactionSignedIn transaction={txn} isFading={isFading} />;
  } else if (txn.status === "SIGNED_OUT") {
    return <TransactionSignedOut transaction={txn} isFading={isFading} />;
  } else if (txn.status === "ERROR") {
    return <TransactionError transaction={txn} isFading={isFading} />;
  } else {
    throw new Error("Unknown transaction status");
  }
}

export default function ScanScreenMain(props: {
  screenPosition: string;
  submitDisabled: boolean;
  transactionState: TransactionState;
  onSubmit: (memberId: string) => Promise<void>;
  onFocusInputReady?: (focusInput: () => void) => void;
}) {
  const { onFocusInputReady, onSubmit, screenPosition, submitDisabled } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const refocusTimeoutIdRef = useRef<number | null>(null);
  const clearTimeoutIdRef = useRef<number | null>(null);

  const clearRefocusTimeout = useCallback(() => {
    if (refocusTimeoutIdRef.current !== null) {
      window.clearTimeout(refocusTimeoutIdRef.current);
      refocusTimeoutIdRef.current = null;
    }
  }, []);

  const clearInputTimeout = useCallback(() => {
    if (clearTimeoutIdRef.current !== null) {
      window.clearTimeout(clearTimeoutIdRef.current);
      clearTimeoutIdRef.current = null;
    }
  }, []);

  const focusInput = useCallback(() => {
    clearRefocusTimeout();
    inputRef.current?.focus();
  }, [clearRefocusTimeout]);

  const scheduleInputClearTimeout = useCallback(() => {
    clearInputTimeout();
    clearTimeoutIdRef.current = window.setTimeout(() => {
      if (inputRef.current !== null) {
        inputRef.current.value = "";
      }
      clearTimeoutIdRef.current = null;
    }, SCAN_INPUT_TIMEOUT_MS);
  }, [clearInputTimeout]);

  useEffect(() => {
    focusInput();

    return () => {
      clearRefocusTimeout();
      clearInputTimeout();
    };
  }, [clearInputTimeout, clearRefocusTimeout, focusInput]);

  useEffect(() => {
    onFocusInputReady?.(focusInput);
  }, [focusInput, onFocusInputReady]);

  async function handleSubmit(data: FormData) {
    const memberId = data.get("id") as string;
    await onSubmit(memberId);
  }

  return (
    <div className="view scanview" style={{ left: screenPosition }}>
      <p className="instructions">Please enter or scan your SES ID</p>

      <form action={handleSubmit} id="scan" autoComplete="off">
        <input
          ref={inputRef}
          type="text"
          name="id"
          maxLength={8}
          onBlur={() => {
            clearRefocusTimeout();
            refocusTimeoutIdRef.current = window.setTimeout(() => {
              if (
                inputRef.current !== null &&
                document.activeElement !== inputRef.current
              ) {
                inputRef.current.focus();
              }
              refocusTimeoutIdRef.current = null;
            }, SCAN_INPUT_TIMEOUT_MS);
          }}
          onFocus={() => {
            clearRefocusTimeout();
          }}
          onChange={() => {
            scheduleInputClearTimeout();
          }}
        />
        <input type="submit" name="go" value="&gt;" disabled={submitDisabled} />
      </form>

      <TransactionList transactionState={props.transactionState} />
    </div>
  );
}
