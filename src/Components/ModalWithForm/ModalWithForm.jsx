import "./ModalWithForm.css";

function ModalWithForm({
  isOpen,
  title,
  children,
  closeActiveModal,
  buttonText = "Submit",
  onSubmit,
  isLoading = false,
  loadingMessage = "Saving...",
  customSpinner = null,
}) {
  return (
    <>
      <div className={`modal ${isOpen ? "modal_open" : ""}`}>
        <div className="modal-with-form__container">
          <h2>{title}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={closeActiveModal}
          ></button>

          <form onSubmit={onSubmit} className="modal__form">
            {children}
            <div className="modal__submit-container">
              <button
                type="submit"
                className="modal__submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    {customSpinner || <span className="default-spinner" />}
                    {loadingMessage}
                  </>
                ) : (
                  buttonText
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Full-page overlay spinner */}
        {isLoading && (
          <div className="modal__spinner-overlay">
            <div className="moon-spinner" title="Loading..." />
            <p className="modal__loading-text">{loadingMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ModalWithForm;
