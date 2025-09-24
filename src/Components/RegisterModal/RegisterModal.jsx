import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";


function RegisterModal({ isOpen, closeActiveModal, activeModal, onRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [usernameError, setUsernameError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let avatarUrl = "";

    if (formData.avatar instanceof File) {
      const form = new FormData();
      form.append("avatar", formData.avatar);

      const res = await fetch(`${API_URL}/api/upload-avatar`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      avatarUrl = data.avatar; // Cloudinary URL
    } else {
      throw new Error("Avatar file is required");
    }

    // Pass URL to onRegister
    onRegister({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      passwordRepeat: formData.passwordRepeat,
      avatar: avatarUrl, // only URL stored
    });
  } catch (err) {
    console.error(err);
    setBackendError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Register"
      closeActiveModal={closeActiveModal}
      buttonText="Sign Up"
      activeModal={activeModal}
      onSubmit={handleSubmit}
      isLoading={loading}
      loadingMessage="Creating account..."
      customSpinner={<div className="moon-spinner small" />}
    >
      {/* Form inputs remain unchanged */}
      <label className="modal__label">
        Username
        <input
          className="modal__input"
          autoComplete="off"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={20}
        />
        {usernameError && <span className="modal__error">{usernameError}</span>}
      </label>

      <label className="modal__label">
        Email
        <input
          className="modal__input"
          autoComplete="new-email"
          type="email"
          id="registeremail"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          minLength={5}
          maxLength={50}
        />
      </label>

      <label className="modal__label">
        Password
        <input
          className="modal__input"
          type="password"
          name="password"
          id="registerpassword"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          maxLength={20}
        />
        {passwordError && <span className="modal__error">{passwordError}</span>}
      </label>

      <label className="modal__label">
        Repeat Password
        <input
          className="modal__input"
          type="password"
          name="passwordRepeat"
          placeholder="Repeat Password"
          value={formData.passwordRepeat}
          onChange={handleChange}
          required
          minLength={8}
          maxLength={20}
        />
      </label>

      <label className="modal__label">
        Avatar
        <input
          className="modal__input"
          type="file"
          accept="image/*"
          id="avatar"
          name="avatar"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData((prev) => ({ ...prev, avatar: file })); 
            }
          }}
        />
        {avatarError && <span className="modal__error">{avatarError}</span>}
      </label>

      {backendError && <span className="modal__error">{backendError}</span>}
    </ModalWithForm>
  );
}

export default RegisterModal;
