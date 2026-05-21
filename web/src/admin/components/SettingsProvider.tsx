import {
  startTransition,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  settingsReducer,
  initialSettings,
  SettingsContext,
  SettingsDispatchContext,
} from "../../lib/settings";
import type { Settings } from "../../lib/settings";
import LoadingIndicator from "../../components/LoadingIndicator";

const SETTINGS_KEY = "appSettings";
let previousSettings: Settings | null = null;

export default function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    initialSettings,
    init,
  );

  const [settingsLoaded, setSettingsLoaded] = useState(false);

  function init(): Settings {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      try {
        const savedSettings = JSON.parse(settingsJson);
        return { ...initialSettings, ...savedSettings };
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
      }
    }
    return initialSettings;
  }

  useEffect(() => {
    if (previousSettings === settings) {
      console.log("Settings unchanged, not saving to localStorage");
      return;
    }
    if (previousSettings == null) {
      console.log("Initial settings loaded:", settings);
      startTransition(() => setSettingsLoaded(true));
    } else {
      console.log("Settings changed, saving to localStorage:", settings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
    previousSettings = settings;
  }, [settings]);

  useEffect(() => {
    if (settings !== null && !settingsLoaded) {
      console.log("Settings loaded, setting settingsLoaded to true");
      startTransition(() => setSettingsLoaded(true));
    }
  }, [settings, settingsLoaded]);

  if (!settingsLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <SettingsContext value={settings}>
      <SettingsDispatchContext value={dispatch}>
        {children}
      </SettingsDispatchContext>
    </SettingsContext>
  );
}
