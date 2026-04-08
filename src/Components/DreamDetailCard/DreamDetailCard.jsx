import {useContext} from "react";
import { UserContext } from "../../contexts/userContext";
import "./DreamDetailCard.css";
import { moonSignImages } from "../../utils/constants";
import AIInsights from "../AiInsights/AiInsights";

function formatTags(tags) {
  if (!tags) return "";

  const tagList = Array.isArray(tags)
    ? tags
    : String(tags)
        .split(/[\s,]+/)
        .map((tag) => tag.trim().replace(/^#+/, ""))
        .filter(Boolean);

  return tagList.map((tag) => `#${tag}`).join(" ");
}

function DreamDetailCard({
  dream,
  onBack,
  handleDeleteDreamClick,
  onEditDreamClick
}) {
 
 
  const {currentUser} =useContext(UserContext);
  const token = currentUser?.token;

  const { date, summary, moonSign, categories, tags } = dream;
  const moonImage = moonSignImages[moonSign?.toLowerCase()];

  return (
    
    <div className="dream-detail-card">
      <div className="dream-detail__column">
        <p>{new Date(dream.date).toLocaleDateString()}</p>
        {moonImage && (
          <img
            className="dream-detail__image"
            src={moonImage}
            alt={dream.moonSign}
          />
        )}
      </div>

      <div className="dream-detail__scrollable-content">
        <div className="dream-detail__container">
          <p className="dream-detail__summary">Summary: {dream.summary}</p>
          <p className="dream-detail__moon-sign">Moon-Sign: {dream.moonSign}</p>
          <p className="dream-detail__categories">Categories: {dream.categories}</p>
          <p className="dream-detail__tags">Tags: {formatTags(dream.tags)}</p>
        <AIInsights dreamId={dream._id} token={currentUser?.token} />
        </div>
      </div>

      <div className="dream-detail__btn-container">
        <div>
          <button
            onClick= {()=> handleDeleteDreamClick(dream)}
            className="dream-detail__delete-btn"
          ></button>
          <button
          onClick={() => onEditDreamClick(dream)}
            className="dream-detail__edit-btn"
          ></button>
        </div>
        <button className="dream-detail__back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default DreamDetailCard;
