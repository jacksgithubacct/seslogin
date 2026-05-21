import { useUserInfo } from "./useUserInfo";
import type { LoadedUserInfoType } from "./UserInfoContext";
import type { Settings } from "../../lib/settings";
import { useSettings } from "../../lib/settings";

export function getSelectedLocationId(settings: Settings | null) {
  return settings?.locationId ?? null;
}

export function getLocationById(
  locations: LoadedUserInfoType["locations"],
  locationId: string,
) {
  return locations.find((location) => location.id === locationId) ?? null;
}

export default function useSelectedLocation() {
  const settings = useSettings();
  const { locations } = useUserInfo();

  const locationId = getSelectedLocationId(settings);
  if (locationId == null) {
    throw new Error("No location selected");
  }

  const selectedLocation = getLocationById(locations, locationId);
  if (selectedLocation == null) {
    throw new Error("Selected location is not available");
  }

  return selectedLocation;
}
