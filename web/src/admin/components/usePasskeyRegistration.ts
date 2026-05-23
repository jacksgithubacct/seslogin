import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import { startRegistration } from "@simplewebauthn/browser";
import type { usePasskeyRegistrationBeginMutation } from "./__generated__/usePasskeyRegistrationBeginMutation.graphql";
import type { usePasskeyRegistrationFinishMutation } from "./__generated__/usePasskeyRegistrationFinishMutation.graphql";

/**
 * Returns a `register(name)` function that runs the full passkey enrollment
 * flow for the authenticated user: fetch a challenge, prompt the browser to
 * create a credential, then store it server-side. Used by both the post-login
 * enrollment prompt and the Settings page.
 */
export function usePasskeyRegistration() {
  const [commitBegin] = useMutation<usePasskeyRegistrationBeginMutation>(
    graphql`
      mutation usePasskeyRegistrationBeginMutation {
        beginPasskeyRegistration {
          challengeId
          optionsJson
        }
      }
    `,
  );

  const [commitFinish] = useMutation<usePasskeyRegistrationFinishMutation>(
    graphql`
      mutation usePasskeyRegistrationFinishMutation(
        $challengeId: String!
        $credentialJson: String!
        $name: String!
      ) {
        finishPasskeyRegistration(
          challengeId: $challengeId
          credentialJson: $credentialJson
          name: $name
        ) {
          id
          name
          createdAt
          lastUsedAt
        }
      }
    `,
  );

  return useCallback(
    async (name: string): Promise<void> => {
      const begin = await new Promise<{
        challengeId: string;
        optionsJson: string;
      }>((resolve, reject) => {
        commitBegin({
          variables: {},
          onCompleted: (resp) => {
            if (resp.beginPasskeyRegistration) {
              resolve(resp.beginPasskeyRegistration);
            } else {
              reject(new Error("Failed to start passkey registration"));
            }
          },
          onError: reject,
        });
      });

      const optionsJSON = JSON.parse(begin.optionsJson);
      const regResponse = await startRegistration({ optionsJSON });

      await new Promise<void>((resolve, reject) => {
        commitFinish({
          variables: {
            challengeId: begin.challengeId,
            credentialJson: JSON.stringify(regResponse),
            name,
          },
          onCompleted: () => resolve(),
          onError: reject,
          updater: (store) => {
            store.invalidateStore();
          },
        });
      });
    },
    [commitBegin, commitFinish],
  );
}
