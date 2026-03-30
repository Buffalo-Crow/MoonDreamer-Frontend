import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function LoginModal({
  isOpen,
  closeActiveModal,
  onSignIn,
  onGoogleSignIn,
  onForgotPassword,
}) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");
    if (loading) return;
    setLoading(true);
    try {
      await onSignIn({
        email: formData.email.trim(),
        password: formData.password,
      });
      closeActiveModal();
      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error("Login failed:", err);
      setBackendError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setBackendError("");
    if (loading) return;
    setLoading(true);
    try {
      await onGoogleSignIn();
      closeActiveModal();
    } catch (err) {
      console.error("Google login failed:", err);
      setBackendError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Login to Moon Dreamer"
      closeActiveModal={closeActiveModal}
      buttonText="Login"
      onSubmit={handleSubmit}
      isLoading={loading}
      loadingMessage="Logging in..."
      customSpinner={<div className="moon-spinner small" />}
    >
      <label className="modal__label">
        Email
        <input
          className="modal__input"
          autoComplete="on"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className="modal__label">
        Password
        <input
          className="modal__input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>

      <button
        type="button"
        className="modal__google-button"
        onClick={handleGoogle}
        disabled={loading}
      >
        Continue with Google
      </button>

      <button
        type="button"
        className="modal__reset-link"
        onClick={() => {
          closeActiveModal();
          onForgotPassword();
        }}
      >
        Forgot Password?
      </button>

      {backendError && <span className="modal__error">{backendError}</span>}
    </ModalWithForm>
  );
}

export default LoginModal;
