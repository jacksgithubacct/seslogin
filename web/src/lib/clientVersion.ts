export const CLIENT_VERSION_HEADER = "X-Client-Version";

export function getCurrentClientVersion(): string {
  return import.meta.env.VITE_CLIENT_VERSION ?? "dev";
}
