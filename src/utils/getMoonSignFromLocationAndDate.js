import { getCoordinates } from "./geolocation";
import { fetchDreamMoonSign } from "./astrologyAPI";

export async function getMoonSignFromLocationAndDate(location, date) {
  const { lat, lng } = await getCoordinates(location);
  console.log({ date, lat, lng });
  const moonSign = await fetchDreamMoonSign({ date, lat, lng });
  return moonSign;
}
