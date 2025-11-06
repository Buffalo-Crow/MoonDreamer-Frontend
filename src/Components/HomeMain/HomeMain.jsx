import { useState } from "react";
import "./HomeMain.css";
import MoonSignDisplay from "../MoonSignDisplay/MoonSignDisplay";
import SocialFeed from "../SocialFeed/SocialFeed";
import ToggleButton from "../ToggleButton/ToggleButton";

// HomeMain component to display the moon sign and its details will add a toggle switch later and another user feature hence its own component

function HomeMain() {
  // Default to showing social feed (true = social feed, false = moon sign)
  const [showSocialFeed, setShowSocialFeed] = useState(true);

  const handleToggle = (shouldShowSocialFeed) => {
    setShowSocialFeed(shouldShowSocialFeed);
  };

  return (
    <div className="home-main">
      <ToggleButton showSocialFeed={showSocialFeed} onToggle={handleToggle} />
      
      {showSocialFeed ? (
        <SocialFeed />
      ) : (
        <MoonSignDisplay />
      )}
    </div>
  );
}
export default HomeMain;
