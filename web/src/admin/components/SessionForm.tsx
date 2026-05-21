import { useState, type ChangeEvent } from "react";

interface SessionFormProps {
  initialName: string;
  initialConfig: string;
  initialHealthcheckUrl: string;
  isMutationInFlight: boolean;
  onSubmit: (formData: FormData) => void | Promise<void>;
}

type ConfigEditorMode = "basic" | "advanced";
type SessionMode = "scan" | "status";
type ConfigObject = Record<string, unknown>;

interface ConfigEditorModeControlProps {
  configEditorMode: ConfigEditorMode;
  onSetEditorMode: (nextEditorMode: ConfigEditorMode) => void;
}

interface BasicSessionModeFieldsProps {
  sessionMode: SessionMode;
  onChange: (nextMode: SessionMode) => void;
  smallCategories: boolean;
  onSmallCategoriesChange: (next: boolean) => void;
  configJson: string;
}

interface AdvancedConfigFieldsProps {
  configJson: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface SubmitRowProps {
  isMutationInFlight: boolean;
}

interface InitialConfigState {
  normalizedConfigJson: string;
}

function parseConfigObject(configText: string): ConfigObject {
  try {
    const parsed = JSON.parse(configText);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as ConfigObject;
    }
  } catch {
    // Ignore parse errors and fall back to empty object.
  }

  return {};
}

function withSessionMode(
  config: ConfigObject,
  sessionMode: SessionMode,
): ConfigObject {
  const next = { ...config };
  if (sessionMode === "status") {
    next.status = true;
  } else {
    delete next.status;
  }
  return next;
}

function getSessionModeFromConfig(config: ConfigObject): SessionMode {
  return config.status ? "status" : "scan";
}

function withSmallCategories(
  config: ConfigObject,
  enabled: boolean,
): ConfigObject {
  const next = { ...config };
  if (enabled) {
    next.smallCategories = true;
  } else {
    delete next.smallCategories;
  }
  return next;
}

function getSmallCategoriesFromConfig(config: ConfigObject): boolean {
  return !!config.smallCategories;
}

function initializeConfigState(initialConfig: string): InitialConfigState {
  const parsed = parseConfigObject(initialConfig);
  const sessionMode = getSessionModeFromConfig(parsed);
  const normalizedConfig = withSessionMode(parsed, sessionMode);

  return {
    normalizedConfigJson: JSON.stringify(normalizedConfig, null, 2),
  };
}

function NameField({ initialName }: { initialName: string }) {
  return (
    <>
      <dt>
        <label htmlFor="name" className="required">
          Name
        </label>
      </dt>
      <dd>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={initialName}
          required
        />
      </dd>
    </>
  );
}

function ConfigEditorModeControl({
  configEditorMode,
  onSetEditorMode,
}: ConfigEditorModeControlProps) {
  return (
    <>
      <dt>
        <span>Config Editor</span>
      </dt>
      <dd>
        <div
          className="segmented-control"
          role="group"
          aria-label="Config editor mode"
        >
          <button
            className="segment-button"
            type="button"
            onClick={() => onSetEditorMode("basic")}
            aria-pressed={configEditorMode === "basic"}
          >
            Basic
          </button>
          <button
            className="segment-button"
            type="button"
            onClick={() => onSetEditorMode("advanced")}
            aria-pressed={configEditorMode === "advanced"}
          >
            Advanced
          </button>
        </div>
      </dd>
    </>
  );
}

function BasicSessionModeFields({
  sessionMode,
  onChange,
  smallCategories,
  onSmallCategoriesChange,
  configJson,
}: BasicSessionModeFieldsProps) {
  return (
    <>
      <dt>
        <span>Mode</span>
      </dt>
      <dd>
        <div className="mode-options" role="radiogroup" aria-label="Mode">
          <label className="mode-option">
            <input
              type="radio"
              name="sessionMode"
              value="scan"
              checked={sessionMode === "scan"}
              onChange={() => onChange("scan")}
            />
            <span className="mode-option-label">Scan</span>
            <span className="mode-option-description">
              allow members to sign in and out on this computer (touchscreen or
              mouse and keyboard required)
            </span>
          </label>
          <label className="mode-option">
            <input
              type="radio"
              name="sessionMode"
              value="status"
              checked={sessionMode === "status"}
              onChange={() => onChange("status")}
            />
            <span className="mode-option-label">Status</span>
            <span className="mode-option-description">
              show a live-updating non-interactive list of who is currently
              signed in at the unit along with how long they've been signed in
              for
            </span>
          </label>
        </div>
        <input type="hidden" name="config" value={configJson} />
      </dd>
      {sessionMode === "scan" && (
        <>
          <dt>
            <span>Options</span>
          </dt>
          <dd>
            <label className="mode-option">
              <input
                type="checkbox"
                checked={smallCategories}
                onChange={(e) => onSmallCategoriesChange(e.target.checked)}
              />
              <span className="mode-option-label">Small categories</span>
              <span className="mode-option-description">
                use smaller category buttons to fit more on screen — useful on
                smaller or lower-resolution displays
              </span>
            </label>
          </dd>
        </>
      )}
    </>
  );
}

function HealthcheckUrlField({
  initialHealthcheckUrl,
}: {
  initialHealthcheckUrl: string;
}) {
  return (
    <>
      <dt>
        <label htmlFor="healthcheckUrl">Health Check URL</label>
      </dt>
      <dd>
        <input
          type="url"
          name="healthcheckUrl"
          id="healthcheckUrl"
          defaultValue={initialHealthcheckUrl}
          placeholder="https://hc-ping.com/..."
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="url"
          inputMode="url"
        />
        <p className="field-help-text">
          Optional. SES Activity can ping this URL approximately every 5 minutes
          or so while the kiosk using this session remains connected to the
          system. Perfect for use with something like{" "}
          <a href="https://healthchecks.io/" target="_blank" rel="noreferrer">
            healthchecks.io
          </a>{" "}
          to automatically notify you when the kiosk isn't working.
        </p>
      </dd>
    </>
  );
}

function AdvancedConfigFields({
  configJson,
  onChange,
}: AdvancedConfigFieldsProps) {
  return (
    <>
      <dt>
        <label htmlFor="config">Config (JSON object)</label>
      </dt>
      <dd>
        <textarea
          name="config"
          id="config"
          rows={8}
          value={configJson}
          onChange={onChange}
          spellCheck={false}
        />
      </dd>
    </>
  );
}

function SubmitRow({ isMutationInFlight }: SubmitRowProps) {
  return (
    <>
      <dt>&nbsp;</dt>
      <dd>
        <button type="submit" disabled={isMutationInFlight}>
          Save
        </button>
      </dd>
    </>
  );
}

export default function SessionForm({
  initialName,
  initialConfig,
  initialHealthcheckUrl,
  isMutationInFlight,
  onSubmit,
}: SessionFormProps) {
  const initialState = initializeConfigState(initialConfig);
  const [configEditorMode, setConfigEditorMode] =
    useState<ConfigEditorMode>("basic");
  const [configJson, setConfigJson] = useState<string>(
    initialState.normalizedConfigJson,
  );
  const parsedConfig = parseConfigObject(configJson);
  const sessionMode = getSessionModeFromConfig(parsedConfig);
  const smallCategories = getSmallCategoriesFromConfig(parsedConfig);

  function setEditorMode(nextEditorMode: ConfigEditorMode) {
    if (configEditorMode === nextEditorMode) {
      return;
    }
    setConfigEditorMode(nextEditorMode);
  }

  function handleBasicSessionModeChange(nextMode: SessionMode) {
    const nextConfig = withSessionMode(parseConfigObject(configJson), nextMode);
    setConfigJson(JSON.stringify(nextConfig, null, 2));
  }

  function handleSmallCategoriesChange(enabled: boolean) {
    const nextConfig = withSmallCategories(
      parseConfigObject(configJson),
      enabled,
    );
    setConfigJson(JSON.stringify(nextConfig, null, 2));
  }

  function handleAdvancedConfigChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const nextConfigText = event.target.value;
    setConfigJson(nextConfigText);
  }

  return (
    <form action={onSubmit}>
      <dl>
        <NameField initialName={initialName} />
        <ConfigEditorModeControl
          configEditorMode={configEditorMode}
          onSetEditorMode={setEditorMode}
        />
        {configEditorMode === "basic" && (
          <BasicSessionModeFields
            sessionMode={sessionMode}
            onChange={handleBasicSessionModeChange}
            smallCategories={smallCategories}
            onSmallCategoriesChange={handleSmallCategoriesChange}
            configJson={configJson}
          />
        )}
        {configEditorMode === "advanced" && (
          <AdvancedConfigFields
            configJson={configJson}
            onChange={handleAdvancedConfigChange}
          />
        )}
        <HealthcheckUrlField initialHealthcheckUrl={initialHealthcheckUrl} />
        <SubmitRow isMutationInFlight={isMutationInFlight} />
      </dl>
    </form>
  );
}
