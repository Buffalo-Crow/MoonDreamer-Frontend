import "./Menu.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { FeedbackForm } from "../FeedbackForm/FeedbackForm";

function Menu({
  onClose,
  onSignOutClick,
}) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenFeedback = () => setIsFeedbackOpen(true);
  const handleCloseFeedback = () => setIsFeedbackOpen(false);

  return (
    <>
      <div className="menu-overlay">
        <div className="menu-panel">
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={onSignOutClick}>Sign Out</button>
          <button onClick={onClose}>Exit</button>
          <button onClick={handleOpenFeedback}>Feedback</button>
        </div>
      </div>

      {isFeedbackOpen &&
        createPortal(
          <div className="menu-feedback-modal" onClick={handleCloseFeedback}>
            <div
              className="menu-feedback-modal__content"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="modal__close"
                onClick={handleCloseFeedback}
                aria-label="Close feedback form"
              />
              <FeedbackForm onClose={handleCloseFeedback} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Menu;
