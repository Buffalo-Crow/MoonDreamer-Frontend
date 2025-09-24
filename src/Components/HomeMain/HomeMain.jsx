import "./HomeMain.css";
import MoonSignDisplay from "../MoonSignDisplay/MoonSignDisplay";

// HomeMain component to display the moon sign and its details will add a toggle switch later and another user feature hence its own component

function HomeMain() {
  return (
    <div className="home-main">
      <MoonSignDisplay />
    </div>
  );
}
export default HomeMain;
