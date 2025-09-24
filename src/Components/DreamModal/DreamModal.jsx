import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { getMoonSignFromLocationAndDate } from "../../utils/getMoonSignFromLocationAndDate";
import { formatDateForInput } from "../../utils/dateHelper";

function DreamModal({
  isOpen,
  closeActiveModal,
  activeModal,
  onSubmitDream,
  dreamToEdit,
}) {
  const isEditMode = !!dreamToEdit;

  const [formData, setFormData] = useState({
    date: "",
    summary: "",
    categories: "",
    tags: "",
    location: "",
    moonSign: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if (!isOpen) return;

  if (dreamToEdit) {
    setFormData({
      date: formatDateForInput( dreamToEdit.date || ""),
      summary: dreamToEdit.summary || "",
      categories: dreamToEdit.categories || "",
      tags: dreamToEdit.tags || "",
      location: dreamToEdit.location || "",
      moonSign: dreamToEdit.moonSign || "",
    });
  } else {
    setFormData({
      date: "",
      summary: "",
      categories: "",
      tags: "",
      location: "",
      moonSign: "",
    });
  }
}, [isOpen, dreamToEdit]);

  function handleDreamChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

 async function handleSubmit(e) {
  e.preventDefault();
  setIsLoading(true);

  try {
    let moonSign = formData.moonSign;

    if (
      !isEditMode ||
      dreamToEdit.date !== formData.date ||
      dreamToEdit.location !== formData.location
    ) {
      moonSign = await getMoonSignFromLocationAndDate(
        formData.location,
        formData.date
      );
    }

    const dreamData = {
      ...formData,
      moonSign,
    };

    console.log(isEditMode ? "Editing dream:" : "Adding dream:", dreamData);

    
    onSubmitDream(dreamData);
    closeActiveModal();

  
    setFormData({
      date: "",
      summary: "",
      categories: "",
      tags: "",
      location: "",
      moonSign: "",
    });
  } catch (error) {
    console.error("Failed to fetch moon sign:", error);
    alert("Failed to submit dream. Please check the location and try again.");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <ModalWithForm
      isOpen={isOpen}
      title={isEditMode ? "Edit your dream" : "Add dream"}
      closeActiveModal={closeActiveModal}
      buttonText={isEditMode ? "Save Changes" : "Add Dream"}
      activeModal={activeModal}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      loadingMessage="Calculating your moon sign..."
      customSpinner={<div className="moon-spinner small" />}
    >
      <label className="modal__label">
        Date
        <input
          className="modal__input"
          type="date"
          name="date"
          placeholder="Date of Dream"
          value={formData.date}
          onChange={handleDreamChange}
          required
        />
      </label>
      <label className="modal__label">
        Summary
        <textarea
          className="modal__input"
          name="summary"
          placeholder="Describe your dream"
          value={formData.summary}
          onChange={handleDreamChange}
          rows="5"
          autoComplete="off"
          required
        />
      </label>
      <label className="modal__label">
        Categories
        <input
          className="modal__input"
          type="text"
          name="categories"
          placeholder="Add any categories of your dream"
          onChange={handleDreamChange}
          value={formData.categories}
          required
        />
      </label>
      <label className="modal__label">
        Tags
        <input
          className="modal__input"
          type="text"
          name="tags"
          placeholder="Add any tags for your dream"
          onChange={handleDreamChange}
          value={formData.tags}
          required
        />
      </label>
      <label className="modal__label">
        Location of your Dream
        <input
          className="modal__input"
          type="text"
          name="location"
          placeholder="Where did you have your dream?"
          value={formData.location}
          onChange={handleDreamChange}
          required
        />
      </label>
      <p className="modal__label-caption">
        🌙 Moon Sign will be auto-populated based on your date and location.
      </p>
    </ModalWithForm>
  );
}

export default DreamModal;
