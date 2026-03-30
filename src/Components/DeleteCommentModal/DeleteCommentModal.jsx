import "./DeleteCommentModal.css";

function DeleteCommentModal({ isOpen, onClose, onConfirm, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="delete-comment-modal__overlay" onClick={onClose}>
      <div
        className="delete-comment-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="delete-comment-modal__close" onClick={onClose}>
          &times;
        </button>
        <h3 className="delete-comment-modal__title">Delete Comment</h3>
        <p className="delete-comment-modal__text">
          Are you sure you want to delete this comment?
        </p>
        <div className="delete-comment-modal__buttons">
          <button
            className="delete-comment-modal__btn delete-comment-modal__btn_cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="delete-comment-modal__btn delete-comment-modal__btn_confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCommentModal;