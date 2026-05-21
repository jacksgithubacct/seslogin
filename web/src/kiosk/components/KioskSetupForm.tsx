import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import type { KioskSetupFormMutation } from "./__generated__/KioskSetupFormMutation.graphql";
import useKioskEnvironment from "./useKioskEnvironment";

const kioskSetupFormMutation = graphql`
  mutation KioskSetupFormMutation($code: String!) {
    authSession(code: $code)
  }
`;

export default function KioskSetupForm() {
  const { setToken } = useKioskEnvironment();
  const [commitMutation, isMutationInFlight] =
    useMutation<KioskSetupFormMutation>(kioskSetupFormMutation);

  const onSubmit = useCallback(
    async (data: FormData) => {
      const code = data.get("code")?.toString() || "";

      await new Promise<void>((resolve) =>
        commitMutation({
          variables: { code },
          onCompleted: (res: { authSession?: string | null }) => {
            if (res.authSession) {
              setToken(res.authSession);
            } else {
              alert("Login failed");
            }
            resolve();
          },
          onError: (error: Error) => {
            console.log(error);
            alert("Login failed: " + error.message);
            resolve();
          },
        }),
      );
    },
    [commitMutation, setToken],
  );

  return (
    <section className="action-panel">
      <div className="action-panel__panel">
        <h1>Setup this kiosk</h1>
        <p className="action-panel__intro">
          To setup the kiosk system on this computer you need to have someone
          with administrator access generate a kiosk setup code via the
          administrator dashboard. Enter the 6-digit kiosk setup code below to
          register this computer with the system.
        </p>

        <form action={onSubmit}>
          <input
            className="action-panel__input"
            type="text"
            name="code"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6 digit code"
            aria-label="Kiosk code"
          />
          <button
            type="submit"
            className="action-button action-panel__button"
            disabled={isMutationInFlight}
          >
            {isMutationInFlight ? "Submitting..." : "Continue"}
          </button>
        </form>
      </div>
    </section>
  );
}
