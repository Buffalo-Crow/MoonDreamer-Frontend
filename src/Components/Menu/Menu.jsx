import "./Menu.css";
import { useNavigate } from "react-router-dom";

function Menu({
  onClose,
  onSignOutClick,
}) {
  const navigate = useNavigate();
  return (
    <div className="menu-overlay">
      <div className="menu-panel">
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={onSignOutClick}>Sign Out</button>
        <button onClick={onClose}>Exit</button>
      </div>
    </div>
  );
}

export default Menu;
