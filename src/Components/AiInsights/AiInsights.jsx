import "./AiInsights.css";
import { useState } from "react";
import { fetchAIInsight } from "../../utils/aiInsights";

function AIInsights({ dreamId }) {
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError ]= useState(null);
  const handleGenerate = async () => {

  setLoading(true);
  setError(null);
  try {
    const result = await fetchAIInsight("single", dreamId);
    setAiResult(result);
  } catch (err) {
    setError("Failed to generate insight. Try again later.")
    console.error("AI insight error:", err);
  } finally{
    setLoading(false);
  }
};

  return (
   
    <div className="ai-insights">
      <button className="ai-insights-button"onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate AI Insight"}
      </button>

      {error && <p className="error">{error}</p>}

      {aiResult && (
        <div className="ai-result">
          <h4>AI Insight</h4>
          <p>{aiResult}</p>
        </div>
      )}
    </div>
  );
}


export default AIInsights;
