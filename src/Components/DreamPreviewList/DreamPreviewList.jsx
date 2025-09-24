import { useContext } from "react";
import { DreamContext } from "../../contexts/dreamContext";
import "./DreamPreviewList.css";
import Moon from "../../assets/Moon.svg";

function DreamPreviewList({ onSelectDream }) {
  const { dreams, filterSign } = useContext(DreamContext);

  const displayedDreams =
    filterSign === "ALL"
      ? [...dreams].sort((a, b) => new Date(b.date) - new Date(a.date))
      : dreams.filter(
          (dream) =>
            dream.moonSign &&
            dream.moonSign.toLowerCase().trim() ===
              filterSign.toLowerCase().trim()
        );
  console.log("Dreams in Preview List", displayedDreams);
  return (
    <>
      <ul className="dream-preview-list">
        {displayedDreams.map((dream) => (
          <li
            key={dream.id || dream._id}
            className="dream-preview"
            onClick={() => onSelectDream(dream)}
          >
            <div className="dream-preview__container">
              <div className="dream-preview__content">
                <img
                  className="dream-preview__moon-icon"
                  src={Moon}
                  alt="moon"
                />
              </div>
              <p className="dream-preview__description">
                {dream.summary.substring(0, 75)}...
              </p>
              <span className="dream-preview__date">
                {new Date(dream.date).toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default DreamPreviewList;
