import "./AiInsights.css";
import { useState, useEffect } from "react";
import { fetchAIInsight, saveAIInsight, fetchSavedInsights, deleteInsight } from "../../utils/aiInsights";
import DeleteDreamModal from "../DeleteDreamModal/DeleteDreamModal";

function AIInsights({ dreamId }) {
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedInsights, setSavedInsights] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [insightToDelete, setInsightToDelete] = useState(null);
  
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

  // Add useEffect to fetch saved insights when component mounts
  useEffect(() => {
    const loadSavedInsights = async () => {
      try {
        const insights = await fetchSavedInsights(dreamId);
        setSavedInsights(insights);
      } catch (err) {
        console.error("Failed to load saved insights:", err);
      }
    };
    loadSavedInsights();
  }, [dreamId]);

  return (
    <div className="ai-insights">
      <button className="ai-insights-button" onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Insight"}
      </button>

      {error && <p className="error">{error}</p>}

      {savedInsights.length > 0 && (
        <div className="saved-insights">
          <h4>Saved Insights</h4>
          {savedInsights.map((insight, index) => (
            <div key={insight._id || index} className="saved-insight">
              <div className="saved-insight-row">
                <p>{insight.summary}</p>
                <button
                  className="dream-detail__delete-btn insight-delete-btn"
                  title="Delete"
                  onClick={() => {
                    setInsightToDelete(insight);
                    setIsDeleteOpen(true);
                  }}
                />
              </div>
              <small className="insight-date">
                {new Date(insight.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      )}

      {aiResult && (
        <div className="ai-result">
          <h4>New AI Insight</h4>
          <p>{aiResult}</p>
          <button 
            className="save-insight-button"
            onClick={async () => {
              try {
                const savedInsight = await saveAIInsight(dreamId, aiResult);
                setSavedInsights(prev => [...prev, savedInsight]);
                setAiResult(""); 
              } catch (err) {
                console.error("Failed to save insight:", err);
              }
            }}
          >
            Save Insight
          </button>
        </div>
      )}
      <DeleteDreamModal
        isOpen={isDeleteOpen}
        closeActiveModal={() => setIsDeleteOpen(false)}
        variant={"insight"}
        onConfirm={async () => {
          if (!insightToDelete) return;
          try {
            await deleteInsight(insightToDelete._id);
            setSavedInsights(prev => prev.filter(i => i._id !== insightToDelete._id));
            setIsDeleteOpen(false);
            setInsightToDelete(null);
          } catch (err) {
            console.error("Failed to delete:", err);
            alert("Failed to delete. Please try again.");
          }
        }}
      />
    </div>
  );
}


export default AIInsights;
