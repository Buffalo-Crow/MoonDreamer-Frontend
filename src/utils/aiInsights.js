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

export const fetchAIInsightStream = async (scope, dreamId = null, handlers = {}) => {
  const { onChunk, onDone, onError } = handlers;

  if (scope !== "single") {
    throw new Error("Streaming is currently available for single insights only");
  }

  if (!dreamId) {
    throw new Error("dreamId is required for single insights");
  }

  const token = localStorage.getItem("jwtToken");
  const url = `${BASE_URL}/single/${dreamId}/stream`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI stream request failed: ${response.status} ${text}`);
  }

  if (!response.body) {
    throw new Error("Streaming response body is not available");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parseEvent = (rawEvent) => {
    const lines = rawEvent.split("\n");
    let eventName = "message";
    const dataLines = [];

    lines.forEach((line) => {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    });

    if (!dataLines.length) {
      return;
    }

    const payload = JSON.parse(dataLines.join("\n"));

    if (eventName === "chunk") {
      onChunk?.(payload.token || "");
      return;
    }

    if (eventName === "done") {
      onDone?.(payload);
      return;
    }

    if (eventName === "error") {
      const message = payload?.message || "Streaming failed";
      onError?.(new Error(message));
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    events.forEach((eventChunk) => {
      if (eventChunk.trim()) {
        parseEvent(eventChunk);
      }
    });
  }

  if (buffer.trim()) {
    parseEvent(buffer);
  }
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

