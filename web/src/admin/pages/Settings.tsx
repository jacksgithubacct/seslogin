import { useState } from "react";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import type { SettingsQuery } from "./__generated__/SettingsQuery.graphql";
import type { SettingsMutation } from "./__generated__/SettingsMutation.graphql";

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
        }
      }
    `,
    {},
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
