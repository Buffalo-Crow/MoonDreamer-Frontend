import { useEffect, useRef, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const BETA_AGREEMENT_VERSION = "2026-04";

const AGREEMENT_SECTIONS = [
  {
    id: "01",
    title: "Welcome",
    paragraphs: [
      "Thank you for participating in the beta of this dream journaling application. By creating an account or using this app in any way, you agree to the terms below.",
      "This is an early-access, work-in-progress product. Things may break, change, or disappear. Your patience and feedback are genuinely appreciated.",
    ],
  },
  {
    id: "02",
    title: "Your data & privacy",
    paragraphs: [
      "Your dream entries are yours. We do not sell, share, license, or distribute your personal data to any third party.",
      "We collect only what is necessary to make the app work: your account credentials and the journal entries you choose to save.",
      "During this beta period, we may store your data on third-party infrastructure providers used to operate the application. Those providers are not permitted to use your data independently.",
      "If you choose to delete your account, your data will be removed from our systems within a reasonable timeframe.",
    ],
    highlight:
      "We collect only what is necessary to make the app work: your account credentials and the journal entries you choose to save.",
  },
  {
    id: "03",
    title: "Intellectual property",
    paragraphs: [
      "This application, including its concept, design, code, and user experience, is the original work of its creator and is protected under applicable intellectual property law.",
      "Your own dream entries remain your intellectual property at all times.",
    ],
    bullets: [
      "Copy, reproduce, or imitate the app's concept, features, or design for commercial purposes.",
      "Reverse-engineer or decompile any part of the application.",
      "Build a competing product that substantially replicates the functionality or experience of this app.",
    ],
  },
  {
    id: "04",
    title: "Beta limitations",
    paragraphs: [
      "This is a beta product. It is provided as-is, without warranties of any kind.",
      "We are not responsible for data loss, downtime, or unexpected behavior during the testing period.",
      "We reserve the right to modify, pause, or discontinue any feature at any time and will do our best to communicate significant changes in advance.",
    ],
  },
  {
    id: "05",
    title: "Feedback",
    paragraphs: [
      "If you share feedback, suggestions, or bug reports with us, you grant us the right to use that input to improve the product without obligation to compensate or credit you for the idea.",
    ],
  },
  {
    id: "06",
    title: "Changes to this agreement",
    paragraphs: [
      "We may update these terms as the app evolves. Continued use of the application after changes are posted constitutes acceptance of the revised terms.",
    ],
  },
];


function RegisterModal({ isOpen, closeActiveModal, activeModal, onRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    avatar: "",
    acceptedBetaAgreement: false,
  });

  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [agreementError, setAgreementError] = useState("");
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [hasReachedAgreementEnd, setHasReachedAgreementEnd] = useState(false);
  const agreementContentRef = useRef(null);

  useEffect(() => {
    if (!isAgreementOpen) {
      return;
    }

    const container = agreementContentRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = 0;
    setHasReachedAgreementEnd(formData.acceptedBetaAgreement);
  }, [isAgreementOpen, formData.acceptedBetaAgreement]);

  const handleAgreementScroll = () => {
    const container = agreementContentRef.current;
    if (!container) {
      return;
    }

    const isAtBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - 12;

    if (isAtBottom) {
      setHasReachedAgreementEnd(true);
    }
  };

  const handleAgreementAccept = () => {
    setFormData((prev) => ({ ...prev, acceptedBetaAgreement: true }));
    setAgreementError("");
    setIsAgreementOpen(false);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setBackendError("");

  if (!formData.acceptedBetaAgreement) {
    setAgreementError("You must accept the beta user agreement to continue.");
    setLoading(false);
    return;
  }

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
      throw new Error("Profile Picture file is required");
    }

    // Pass URL to onRegister and wait so backend errors are shown in this modal.
    await onRegister({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      passwordRepeat: formData.passwordRepeat,
      avatar: avatarUrl, // only URL stored
      betaAgreementAcceptance: {
        accepted: true,
        version: BETA_AGREEMENT_VERSION,
      },
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
          minLength={5}
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
        Profile Picture
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

      <div className="register-agreement">
        <div className="register-agreement__header">
          <div>
            <p className="register-agreement__title">MoonDreamer Beta User Agreement</p>
            <p className="register-agreement__status">
              {formData.acceptedBetaAgreement
                ? `Accepted - version ${BETA_AGREEMENT_VERSION}`
                : "Required before you can register"}
            </p>
          </div>
          <button
            type="button"
            className="register-agreement__toggle"
            onClick={() => setIsAgreementOpen(true)}
          >
            {formData.acceptedBetaAgreement ? "Review agreement" : "Read agreement"}
          </button>
        </div>
      </div>

      {agreementError && <span className="modal__error">{agreementError}</span>}

      {backendError && <span className="modal__error">{backendError}</span>}

      {isAgreementOpen && (
        <div className="register-agreement-modal" onClick={() => setIsAgreementOpen(false)}>
          <div
            className="register-agreement-modal__dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal__close"
              aria-label="Close agreement"
              onClick={() => setIsAgreementOpen(false)}
            ></button>

            <div
              ref={agreementContentRef}
              className="register-agreement-modal__content"
              onScroll={handleAgreementScroll}
            >
              <div className="register-agreement__badge">BETA</div>
              {AGREEMENT_SECTIONS.map((section) => (
                <section key={section.id} className="register-agreement__section">
                  <h3 className="register-agreement__section-title">
                    {section.id} - {section.title}
                  </h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="register-agreement__paragraph">
                      {paragraph}
                    </p>
                  ))}
                  {section.highlight && (
                    <blockquote className="register-agreement__highlight">
                      {section.highlight}
                    </blockquote>
                  )}
                  {section.bullets && (
                    <ul className="register-agreement__list">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <p className="register-agreement__footer">Last updated: April 2026</p>
            </div>

            <div className="register-agreement-modal__actions">
              <p className="register-agreement-modal__hint">
                {hasReachedAgreementEnd || formData.acceptedBetaAgreement
                  ? "You can now accept the agreement."
                  : "Scroll to the bottom to enable acceptance."}
              </p>
              <button
                type="button"
                className="register-agreement-modal__accept"
                onClick={handleAgreementAccept}
                disabled={!hasReachedAgreementEnd && !formData.acceptedBetaAgreement}
              >
                {formData.acceptedBetaAgreement ? "Keep accepted" : "I agree and continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalWithForm>
  );
}

export default RegisterModal;
