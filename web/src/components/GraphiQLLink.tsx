import { getGraphQLEndpoint } from "../lib/api";
import { getAdminToken } from "../lib/adminToken";

export default function GraphiQLLink() {
  const graphiQLUrl = getGraphQLEndpoint();

  function showAuthToken(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const authToken = getAdminToken() ?? "";

    const headers = {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    };

    const confirmed = prompt(
      "Opening GraphiQL - copy/paste this into the headers field:",
      JSON.stringify(headers),
    );

    if (confirmed !== null) {
      window.open(graphiQLUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <a href={graphiQLUrl} target="_blank" onClick={showAuthToken}>
      GraphiQL
    </a>
  );
}
