import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { getMoonSignFromLocationAndDate } from "../../utils/getMoonSignFromLocationAndDate";
import { formatDateForInput } from "../../utils/dateHelper";
import { MultiSelectDropdown } from "../MultiSelectDropDown/MultiSelectDropDown";

function parseTagsInput(tagsValue) {
  if (!tagsValue || typeof tagsValue !== "string") return [];

  return tagsValue
    .split(/[\s,]+/)
    .map((tag) => tag.trim().replace(/^#+/, ""))
    .filter(Boolean);
}

function formatTagsForInput(tagsValue) {
  if (Array.isArray(tagsValue)) {
    return tagsValue
      .map((tag) => String(tag).trim().replace(/^#+/, ""))
      .filter(Boolean)
      .map((tag) => `#${tag}`)
      .join(" ");
  }

  return tagsValue || "";
}

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
    isPublic: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Define available categories
  const categoryOptions = [
    'Nightmare',
    'Lucid Dream',
    'Travel Dream',
    'Subconscious Fquery',
    'Message From Spirit',
    'Prophetic Dream',
    'Memory',
    'Outside Interference',
    'Someone Elses Dream',

  ];

  useEffect(() => {
    if (!isOpen) return;

    // Reset errors when modal opens
    setErrors({});

    if (dreamToEdit) {
      console.log("Setting form data from dreamToEdit:", dreamToEdit);
      setFormData({
        date: formatDateForInput(dreamToEdit.date || ""),
        summary: dreamToEdit.summary || "",
        categories: dreamToEdit.categories || "",
        tags: formatTagsForInput(dreamToEdit.tags),
        location: dreamToEdit.location || "",
        moonSign: dreamToEdit.moonSign || "",
        isPublic: dreamToEdit.isPublic || false,
      });
    } else {
      setFormData({
        date: "",
        summary: "",
        categories: "",
        tags: "",
        location: "",
        moonSign: "",
        isPublic: false,
      });
    }
  }, [isOpen, dreamToEdit]);

  function handleDreamChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  // Handle category selection for multi-select dropdown
  const handleCategoryChange = (selectedCategories) => {
    // Convert array back to string format to maintain compatibility with existing code
    const categoriesString = selectedCategories.join(', ');
    setFormData((prev) => ({ ...prev, categories: categoriesString }));
  };

  // Convert string categories to array for the dropdown
  const getSelectedCategories = () => {
    if (!formData.categories) return [];
    if (Array.isArray(formData.categories)) return formData.categories;
    return formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat);
  };

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
        tags: parseTagsInput(formData.tags),
        moonSign,
        // Include the dream ID when editing
        ...(isEditMode && dreamToEdit && { 
          _id: dreamToEdit._id || dreamToEdit.id 
        })
      };

      console.log(isEditMode ? "Editing dream:" : "Adding dream:", dreamData);

      await onSubmitDream(dreamData);
      closeActiveModal();

      setFormData({
        date: "",
        summary: "",
        categories: "",
        tags: "",
        location: "",
        moonSign: "",
        isPublic: false,
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting dream:", error);
      
      // Parse validation errors from response
      if (error.response?.status === 400 && error.response?.data?.message) {
        // Try to extract field-specific error
        const message = error.response.data.message;
        // Check for Mongoose validation errors in the message
        if (message.includes('summary') && message.includes('shorter than the minimum')) {
          setErrors({ summary: 'Dream summary must be at least 15 characters' });
        } else if (message.includes('Path')) {
          setErrors({ general: 'Please check all fields and try again.' });
        } else {
          setErrors({ general: message });
        }
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Failed to submit dream. Please try again.' });
      }
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
      {errors.general && (
        <div className="modal__general-error">
          {errors.general}
        </div>
      )}
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
        {errors.date && <span className="modal__error">{errors.date}</span>}
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
        {errors.summary && <span className="modal__error">{errors.summary}</span>}
      </label>
      <label className="modal__label">
        Categories
        <MultiSelectDropdown
          options={categoryOptions}
          selectedValues={getSelectedCategories()}
          onChange={handleCategoryChange}
          placeholder="Select dream categories..."
          className="modal__input"
        />
        {errors.categories && <span className="modal__error">{errors.categories}</span>}
      </label>
      <label className="modal__label">
        Tags
        <input
          className="modal__input"
          type="text"
          name="tags"
          placeholder="#lucid #flying #ocean"
          onChange={handleDreamChange}
          value={formData.tags}
        />
        {errors.tags && <span className="modal__error">{errors.tags}</span>}
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
        {errors.location && <span className="modal__error">{errors.location}</span>}
      </label>
      <p className="modal__label-caption">
        🌙 Moon Sign will be auto-populated based on your date and location.
      </p>
      <label className="modal__checkbox-label">
        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleDreamChange}
          className="modal__checkbox"
        />
        <span className="modal__checkbox-text">
          Share this dream with the community
        </span>
      </label>
    </ModalWithForm>
  );
}

export default DreamModal;