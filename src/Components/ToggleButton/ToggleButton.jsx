import "./ToggleButton.css";

function ToggleButton({ showSocialFeed, onToggle }) {
  return (
    <div className="toggle-button">
      <button 
        className={`toggle-button__option ${!showSocialFeed ? 'active' : ''}`}
        onClick={() => onToggle(false)}
      >
        🌙 Moon Sign
      </button>
      <button 
        className={`toggle-button__option ${showSocialFeed ? 'active' : ''}`}
        onClick={() => onToggle(true)}
      >
        👥 Collective
      </button>
    </div>
  );
}

export default ToggleButton;