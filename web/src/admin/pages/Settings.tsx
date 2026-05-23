import { useState } from "react";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import type { SettingsQuery } from "./__generated__/SettingsQuery.graphql";
import type { SettingsMutation } from "./__generated__/SettingsMutation.graphql";
import type { SettingsRenamePasskeyMutation } from "./__generated__/SettingsRenamePasskeyMutation.graphql";
import type { SettingsDeletePasskeyMutation } from "./__generated__/SettingsDeletePasskeyMutation.graphql";
import { usePasskeyRegistration } from "../components/usePasskeyRegistration";
import { browserSupportsWebAuthn } from "../../lib/passkey";

const MAX_PASSKEYS = 10;

export default function Settings() {
  const data = useLazyLoadQuery<SettingsQuery>(
    graphql`
      query SettingsQuery {
        user {
          id
          emailSummaryLocationIds
          locations {
            id
            name
          }
          passkeys {
            id
            name
            createdAt
            lastUsedAt
          }
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" },
  );

  const [commitMutation, isMutationInFlight] = useMutation<SettingsMutation>(
    graphql`
      mutation SettingsMutation($dailyLocationIds: [String!]!) {
        updateMyEmailConfig(dailyLocationIds: $dailyLocationIds) {
          id
          emailSummaryLocationIds
        }
      }
    `,
  );

  const user = data.user;
  const [selectedLocations, setSelectedLocations] = useState(
    () => new Set(user.emailSummaryLocationIds),
  );
  const [saved, setSaved] = useState(false);

  const locations = [...user.locations].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    await new Promise<void>((resolve, reject) => {
      commitMutation({
        variables: { dailyLocationIds: Array.from(selectedLocations) },
        onCompleted: () => resolve(),
        onError: reject,
        updater: (store) => {
          store.invalidateStore();
        },
      });
    });
    setSaved(true);
  }

  return (
    <>
      <PasskeysSection
        passkeys={user.passkeys}
        atCap={user.passkeys.length >= MAX_PASSKEYS}
      />

      <p>
        Choose which locations to include in your nightly activity summary
        email. Emails are sent just after midnight with the previous day&apos;s
        activity.
      </p>
      <form onSubmit={handleSubmit}>
        <dl>
          <dt>Daily email — locations</dt>
          <dd>
            {locations.length === 0 && (
              <p>No locations available to your account.</p>
            )}
            {locations.map((loc) => (
              <div key={loc.id}>
                <input
                  type="checkbox"
                  id={`loc-${loc.id}`}
                  checked={selectedLocations.has(loc.id)}
                  onChange={(e) =>
                    setSelectedLocations((prev) => {
                      const next = new Set(prev);
                      if (e.target.checked) next.add(loc.id);
                      else next.delete(loc.id);
                      return next;
                    })
                  }
                />
                &nbsp;
                <label htmlFor={`loc-${loc.id}`}>{loc.name}</label>
              </div>
            ))}
          </dd>
          <dt>&nbsp;</dt>
          <dd>
            <button type="submit" disabled={isMutationInFlight}>
              Save
            </button>
            {saved && <span>&nbsp; Saved.</span>}
          </dd>
        </dl>
      </form>
    </>
  );
}

type Passkey = SettingsQuery["response"]["user"]["passkeys"][number];

function PasskeysSection({
  passkeys,
  atCap,
}: {
  passkeys: readonly Passkey[];
  atCap: boolean;
}) {
  const register = usePasskeyRegistration();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supported = browserSupportsWebAuthn();

  const [commitRename] = useMutation<SettingsRenamePasskeyMutation>(graphql`
    mutation SettingsRenamePasskeyMutation($id: String!, $name: String!) {
      renamePasskey(id: $id, name: $name) {
        id
        name
      }
    }
  `);

  const [commitDelete] = useMutation<SettingsDeletePasskeyMutation>(graphql`
    mutation SettingsDeletePasskeyMutation($id: String!) {
      deletePasskey(id: $id)
    }
  `);

  async function handleAdd() {
    const name = window.prompt(
      "Name this passkey (e.g. the device you're using):",
      "My device",
    );
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    try {
      await register(trimmed);
    } catch {
      setError("Couldn't add a passkey. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleRename(id: string, current: string) {
    const name = window.prompt("Rename passkey:", current);
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    commitRename({
      variables: { id, name: trimmed },
      updater: (store) => store.invalidateStore(),
    });
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete passkey "${name}"? This cannot be undone.`)) {
      return;
    }
    commitDelete({
      variables: { id },
      updater: (store) => store.invalidateStore(),
    });
  }

  return (
    <>
      <h2>Passkeys</h2>
      <p>
        Passkeys let you sign in with Face ID, Touch ID, or your device PIN
        instead of an email code. You can save up to {MAX_PASSKEYS}.
      </p>
      {!supported && (
        <p className="action-panel__message action-panel__message--warning">
          This browser or device does not support passkeys.
        </p>
      )}
      {error && (
        <p className="action-panel__message action-panel__message--error">
          {error}
        </p>
      )}
      <dl>
        <dt>Your passkeys</dt>
        <dd>
          {passkeys.length === 0 && <p>No passkeys saved yet.</p>}
          {passkeys.length > 0 && (
            <ul>
              {passkeys.map((pk) => (
                <li key={pk.id}>
                  <strong>{pk.name}</strong>
                  {" — added "}
                  {formatDate(pk.createdAt)}
                  {pk.lastUsedAt
                    ? `, last used ${formatDate(pk.lastUsedAt)}`
                    : ", never used"}
                  &nbsp;
                  <button
                    type="button"
                    onClick={() => handleRename(pk.id, pk.name)}
                  >
                    Rename
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    onClick={() => handleDelete(pk.id, pk.name)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </dd>
        <dt>&nbsp;</dt>
        <dd>
          <button
            type="button"
            onClick={handleAdd}
            disabled={busy || atCap || !supported}
          >
            {busy ? "Setting up…" : "Add a passkey"}
          </button>
          {atCap && (
            <span>
              &nbsp; You&apos;ve reached the maximum of {MAX_PASSKEYS}.
            </span>
          )}
        </dd>
      </dl>
    </>
  );
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
