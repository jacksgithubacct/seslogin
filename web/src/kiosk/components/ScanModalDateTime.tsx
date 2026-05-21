import { useEffect, useState } from "react";

export function Inner(props: {
  show: boolean;
  onSave: (field: string, value: string) => void;
  onClose: () => void;
  field: string;
}) {
  const [value, setValue] = useState<string>("");

  function button(key: string) {
    if (key === "DEL") {
      setValue(value.slice(0, -1));
    } else {
      if (validate(Number(key))) {
        const newValue = value + key;
        setValue(newValue);
        if (newValue.length === 4) {
          props.onSave(props.field, newValue);
        }
      }
    }
  }

  function validate(key: number): boolean {
    const position = value.length;
    if (position == 0 && key > 2) return false;
    if (position == 1 && value.charAt(0) == "2" && key > 3) return false;
    if (position == 2 && key > 5) return false;

    return true;
  }

  function char(index: number): string {
    if (index < value.length) {
      return value.charAt(index);
    }
    return "\xa0"; // non-breaking space
  }

  function current(index: number): boolean {
    return index === value.length;
  }

  return (
    <div
      className="modal-container"
      style={{
        display: props.show ? "flex" : "none",
      }}
    >
      <div className="modal">
        <div id="keypad">
          <table>
            <tbody>
              <tr>
                <th colSpan={3}>
                  <span className={current(0) ? "current" : ""}>{char(0)}</span>
                  <span className={current(1) ? "current" : ""}>{char(1)}</span>
                  :
                  <span className={current(2) ? "current" : ""}>{char(2)}</span>
                  <span className={current(3) ? "current" : ""}>{char(3)}</span>
                </th>
              </tr>
              <tr>
                <td>
                  <button onClick={() => button("1")}>1</button>
                </td>
                <td>
                  <button onClick={() => button("2")}>2</button>
                </td>
                <td>
                  <button onClick={() => button("3")}>3</button>
                </td>
              </tr>
              <tr>
                <td>
                  <button onClick={() => button("4")}>4</button>
                </td>
                <td>
                  <button onClick={() => button("5")}>5</button>
                </td>
                <td>
                  <button onClick={() => button("6")}>6</button>
                </td>
              </tr>
              <tr>
                <td>
                  <button onClick={() => button("7")}>7</button>
                </td>
                <td>
                  <button onClick={() => button("8")}>8</button>
                </td>
                <td>
                  <button onClick={() => button("9")}>9</button>
                </td>
              </tr>
              <tr>
                <td>
                  <button className="cancel" onClick={props.onClose}>
                    &times;
                  </button>
                </td>
                <td>
                  <button onClick={() => button("0")}>0</button>
                </td>
                <td>
                  <button className="delete" onClick={() => button("DEL")}>
                    DEL
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ScanModalDateTime(props: {
  getShowFunction: (show: (field: string) => void) => void;
  onSave: (field: string, value: string) => void;
  onClose?: () => void;
}) {
  const [field, setField] = useState<string | null>(null);
  const shouldShow = field !== null;

  function show(field: string) {
    setField(field);
  }

  useEffect(() => {
    props.getShowFunction(show);
  });

  function onSave(field: string, value: string) {
    props.onSave(field, value);
    setField(null);
  }

  function onClose() {
    setField(null);
    if (props.onClose) {
      props.onClose();
    }
  }

  return (
    <>
      <div
        className="modal-background"
        style={{
          display: shouldShow ? "block" : "none",
          opacity: shouldShow ? 0.5 : 0,
        }}
      ></div>
      {field && (
        <Inner
          show={shouldShow}
          onSave={onSave}
          onClose={onClose}
          field={field}
        />
      )}
    </>
  );
}
