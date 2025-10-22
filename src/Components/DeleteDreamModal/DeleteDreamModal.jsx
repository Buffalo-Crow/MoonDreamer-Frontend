import "./DeleteDreamModal.css";

function DeleteDreamModal({
  closeActiveModal,
  isOpen,
  onConfirm,
  variant = "dream", // 'dream' or 'insight'
  title, // optional override
  subtitle, // optional override
  confirmText, // optional override
  cancelText = "Cancel",
}) {
  const defaults = variant === "insight"
    ? {
        title: "Are you sure you want to delete this insight?",
        subtitle: "This action is irreversible",
        confirmText: "Delete",
      }
    : {
        title: "Are you sure you want to delete this dream?",
        subtitle: "This action is irreversible.",
        confirmText: "Delete",
      };

  const finalTitle = title || defaults.title;
  const finalSubtitle = subtitle || defaults.subtitle;
  const finalConfirmText = confirmText || defaults.confirmText;

  return (
    <div className={`modal ${isOpen ? "modal_open" : ""}`}>
      <div className="modal__delete-container">
        <button
          type="button"
          className="modal__close  modal__delete_close-btn"
          onClick={closeActiveModal}
        ></button>
        <p className="modal__delete-caption-one">{finalTitle}</p>
        <p className="modal__delete-caption-two">{finalSubtitle}</p>
        <div>
          <div className="modal__delete-buttons">
            <button onClick={onConfirm} className="modal__button-caption_delete">
              {finalConfirmText}
            </button>
            <button
              className="modal__button-caption_cancel"
              type="button"
              onClick={closeActiveModal}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteDreamModal;
