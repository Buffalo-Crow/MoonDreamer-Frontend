import { useContext } from "react";
import { DreamContext } from "../../contexts/dreamContext";
import "./ZodiacSidebar.css";
import { zodiacImages, zodiacSigns } from "../../utils/constants";

function ZodiacSidebar() {
  const { filterSign, setFilterSign } = useContext(DreamContext);

  const handleSignClick = (sign) => {
    setFilterSign(sign);
  };

  const handleAllClick = () => {
    setFilterSign("ALL");
  };

  return (
    <>
      <nav className="zodiac-sidebar" aria-label="Zodiac Filter Navigation">
        <ul className="zodiac-sidebar__sign_list">
          {zodiacSigns.map((sign) => (
            <li key={sign} className="zodiac-sidebar__sign-item">
              <button
                onClick={() => handleSignClick(sign)}
                className={`zodiac-sidebar__sign-button zodiac-sidebar__sign-button--${sign} ${
                  filterSign === sign ? "active" : ""
                }`}
              >
                <img
                  src={zodiacImages[sign]}
                  alt={`${sign} symbol`}
                  className="zodiac-sidebar__sign-icon"
                />
                {sign}
              </button>
            </li>
          ))}
        </ul>
        <div className="zodiac-sidebar__all-button-container">
          <button
            onClick={handleAllClick}
            className={`zodiac-sidebar__all-button ${
              filterSign === "ALL" ? "active" : ""
            }`}
          >
            All dreams
          </button>
        </div>
      </nav>
    </>
  );
}

export default ZodiacSidebar;
