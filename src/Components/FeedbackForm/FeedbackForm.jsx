import "./FeedbackForm.css";
import { useState } from "react";

export function FeedbackForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    feedback: "",
    issues: "",
    date: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Feedback submitted:", formData);

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
            type="text"
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
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
