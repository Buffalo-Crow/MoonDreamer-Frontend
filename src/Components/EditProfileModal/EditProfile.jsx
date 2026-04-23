import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function EditProfile({
  isOpen,
  closeActiveModal,
  activeModal,
  onEditProfileData,
}) {
  const { currentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        username: currentUser.username || "",
        profilePicture: currentUser.profilePicture || "",
      });
    }
  }, [isOpen, currentUser]);

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();

    const normalizedUsername = (formData.username || "").trim();
    const usernameChanged = normalizedUsername !== (currentUser?.username || "");
    const profilePictureChanged = formData.profilePicture instanceof File;

    if (!usernameChanged && !profilePictureChanged) {
      return;
    }

    const updates = {};

    if (usernameChanged) {
      updates.username = normalizedUsername;
    }

    try {
      if (profilePictureChanged) {
        const form = new FormData();
        form.append("profilePicture", formData.profilePicture);

        const res = await fetch(`${API_URL}/api/upload-profile-picture`, {
          method: "POST",
          body: form,
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        updates.profilePicture = data.profilePicture;
      }

      onEditProfileData(updates);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Edit Your Profile"
      closeActiveModal={closeActiveModal}
      buttonText="Submit"
      activeModal={activeModal}
      onSubmit={handleEditProfileSubmit}
    >
      <label className="modal__label">
        Username
        <input
          className="modal__input"
          type="text"
          name="username"
          placeholder="Current User Name"
          value={formData.username}
          onChange={handleEditProfileChange}
        />
      </label>{" "}
      <label className="modal__label">
        Profile Picture
        <input
          className="modal__input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setFormData((prev) => ({ ...prev, profilePicture: file }));
          }}
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfile;
