import { apiFetch } from "./apiFetch";

const BASE_URL = "/api/insights";

export const fetchAIInsight = async (scope, dreamId = null) => {
  let url = "";

  if (scope === "single") {
    if (!dreamId) throw new Error("dreamId is required for single insights");
    url = `${BASE_URL}/single/${dreamId}`;
  } else if (scope === "user-pattern") {
    url = `${BASE_URL}/user-pattern`;
  } else if (scope === "community") {
    url = `${BASE_URL}/community`;
  } else {
    throw new Error(`Invalid scope: ${scope}`);
  }

  const body = JSON.stringify({}); // can add extra payload if needed
  const data = await apiFetch(url, { method: "POST", body });
  
  if (!data.aiResult) throw new Error("No aiResult returned from backend");
  return data.aiResult;
};
