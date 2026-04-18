import { useContext } from "react";
import { DreamContext } from "../../contexts/dreamContext";
import "./ZodiacSidebar.css";
import { zodiacSigns } from "../../utils/constants";

function ZodiacSidebar() {
  const { filterSign, setFilterSign } = useContext(DreamContext);

  const handleSignClick = (sign) => {
    setFilterSign(sign);
  };

  const handleAllClick = () => {
    setFilterSign("ALL");
  };

  return (
    <nav className="zodiac-sidebar" aria-label="Zodiac filter navigation">
      <div className="zodiac-sidebar__filters" role="group" aria-label="Filter dreams by moon sign">
        <button
          onClick={handleAllClick}
          className={`zodiac-sidebar__filter-btn ${
            filterSign === "ALL" ? "zodiac-sidebar__filter-btn_active" : ""
          }`}
          type="button"
        >
          All Dreams
        </button>

        {zodiacSigns.map((sign) => (
          <button
            key={sign}
            onClick={() => handleSignClick(sign)}
            className={`zodiac-sidebar__filter-btn ${
              filterSign === sign ? "zodiac-sidebar__filter-btn_active" : ""
            }`}
            type="button"
          >
            {sign.charAt(0).toUpperCase() + sign.slice(1)}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default ZodiacSidebar;
