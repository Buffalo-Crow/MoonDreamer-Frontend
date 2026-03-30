import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { resetPassword } from "../../utils/auth.js";

function ForgotPasswordModal({ isOpen, closeActiveModal }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(email.trim());
      setMessage("Password reset email sent. Check your inbox & your spam folder");
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Reset Password"
      closeActiveModal={closeActiveModal}
      buttonText="Send Reset Email"
      onSubmit={handleSubmit}
      isLoading={loading}
      loadingMessage="Sending..."
    >
      <label className="modal__label">
        Email
        <input
          className="modal__input"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      {message && <span className="modal__success">{message}</span>}
      {error && <span className="modal__error">{error}</span>}
    </ModalWithForm>
  );
}

export default ForgotPasswordModal;