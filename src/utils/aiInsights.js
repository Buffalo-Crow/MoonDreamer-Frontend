import { apiFetch } from "./apiFetch";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const BASE_URL = `${API_BASE}/api/insights`;


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

  const body = JSON.stringify({});
  const data = await apiFetch(url, { method: "POST", body });

  if (!data.aiResult) throw new Error("No aiResult returned from backend");
  return data.aiResult;
};

export const saveAIInsight = async (dreamId, summary) => {
  if (!dreamId) throw new Error("dreamId is required to save insight");
  
  const url = `${BASE_URL}/save`;
  const body = JSON.stringify({
    dreamIds: [dreamId],
    summary,
    scope: "single"
  });

  const data = await apiFetch(url, { 
    method: "POST", 
    body 
  });

  return data.insight;
};

export const fetchSavedInsights = async (dreamId) => {
  if (!dreamId) throw new Error("dreamId is required to fetch insights");
  
  const url = `${BASE_URL}/dream/${dreamId}`;
  const data = await apiFetch(url);
  
  return data.insights || [];
};

export const deleteInsight = async (insightId) => {
  if (!insightId) throw new Error("insightId is required to delete an insight");
  const url = `${BASE_URL}/${insightId}`;
  const data = await apiFetch(url, { method: "DELETE" });
  return data;
};

