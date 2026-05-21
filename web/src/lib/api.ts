export function getGraphQLEndpoint() {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:8000/";
  }
  return (
    import.meta.env.VITE_API_URL ??
    "https://xgwyxvdqtmtmto3uuz3pwxxkhy0snjye.lambda-url.ap-southeast-2.on.aws/"
  );
}
