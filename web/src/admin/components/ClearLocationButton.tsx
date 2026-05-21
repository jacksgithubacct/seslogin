import { useSettingsDispatch } from "../../lib/settings";

export default function ClearLocationButton() {
  const settingsDispatch = useSettingsDispatch();

  return (
    <button
      onClick={() => settingsDispatch?.({ type: "clear_location" })}
      style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
    >
      [DEV] Clear Location
    </button>
  );
}
