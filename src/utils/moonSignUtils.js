export const MOON_SIGN_KEY = "moonSignCache";

export function getCachedMoonSign(date) {
  const cache = JSON.parse(localStorage.getItem(MOON_SIGN_KEY)) || {};
  return cache[date] || null;
}

export function saveMoonSignToCache(date, moonSignData) {
  const cache = JSON.parse(localStorage.getItem(MOON_SIGN_KEY)) || {};
  cache[date] = moonSignData;
  localStorage.setItem(MOON_SIGN_KEY, JSON.stringify(cache));
}

export function clearMoonSignCache() {
  localStorage.removeItem("moonSignCache");
}