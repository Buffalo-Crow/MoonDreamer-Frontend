import { useContext } from "react";
import { DreamContext } from "../../contexts/dreamContext";
import "./DreamPreviewList.css";
import { moonSignImages } from "../../utils/constants";
import Moon from "../../assets/Moon.svg";

function DreamPreviewList({ onSelectDream }) {
  const { dreams, filterSign } = useContext(DreamContext);
  const maxPreviewChars = window.innerWidth > 885 ? 150 : 90;

  const getPreviewSummary = (summary = "") => {
    if (summary.length <= maxPreviewChars) {
      return summary;
    }

    return `${summary.substring(0, maxPreviewChars)}...`;
  };

  const displayedDreams = (
    filterSign === "ALL"
      ? dreams
      : dreams.filter(
          (dream) =>
            dream.moonSign &&
            dream.moonSign.toLowerCase().trim() ===
              filterSign.toLowerCase().trim()
        )
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!displayedDreams.length) {
    return (
      <div className="dream-preview-list__empty">
        {filterSign === "ALL"
          ? "No dreams yet. Add your first dream to get started."
          : "No dreams found for that moon sign yet."}
      </div>
    );
  }

  return (
    <>
      <ul className="dream-preview-list">
        {displayedDreams.map((dream) => {
          const signKey = String(dream.moonSign || "").toLowerCase().trim();
          const moonIconSrc = moonSignImages[signKey] || Moon;
          const moonIconAlt = signKey ? `${signKey} moon icon` : "moon icon";

          return (
            <li
              key={dream.id || dream._id}
              className="dream-preview"
              onClick={() => onSelectDream(dream)}
            >
              <div className="dream-preview__container">
                <div className="dream-preview__content">
                  <img
                    className="dream-preview__moon-icon"
                    src={moonIconSrc}
                    alt={moonIconAlt}
                  />
                </div>
                <div className="dream-preview__text-block">
                  <p className="dream-preview__description">
                    {getPreviewSummary(dream.summary)}
                  </p>
                  <span className="dream-preview__date">
                    {new Date(dream.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default DreamPreviewList;
