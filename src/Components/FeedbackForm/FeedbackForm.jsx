import "./FeedbackForm.css";
import { useState } from "react";
import emailjs from "@emailjs/browser";

export function FeedbackForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    feedback: "",
    issues: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
      setStatusMessage(
        "Email service is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY."
      );
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    const templateParams = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      from_name: `${formData.firstName} ${formData.lastName}`.trim(),
      from_email: formData.email,
      feedback_date: formData.date,
      feedback: formData.feedback,
      issues: formData.issues,
      message: `Feedback:\n${formData.feedback}\n\nIssues:\n${formData.issues}`,
    };

    try {
      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        templateParams,
        emailJsPublicKey
      );

      setStatusMessage("Feedback sent. Thank you!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        feedback: "",
        issues: "",
        date: "",
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("EmailJS submit failed", error);
      setStatusMessage("Failed to send feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="feedback-form">
      <h2 className="feedback-form__title">Share Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form__body">
        <label>
          Date
          <input
            type="date"
            name="date"
            value={formData.date}
            required
            onChange={handleInputChange}
          />
        </label>
        <label>
          First Name
          <input
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Last Name
          <input
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleInputChange}
          />
        </label>
        <label>
          Feedback
          <textarea
            name="feedback"
            rows="5"
            value={formData.feedback}
            required
            onChange={handleInputChange}
          />
        </label>
        <label>
          Issues with Moondreamer
          <textarea
            name="issues"
            rows="5"
            value={formData.issues}
            required
            onChange={handleInputChange}
          />
        </label>
        <div className="feedback-form__actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
        {statusMessage && (
          <p className="feedback-form__status" role="status">
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}
