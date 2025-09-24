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
    avatar: "",
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        username: currentUser.username || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [isOpen, currentUser]);

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProfileSubmit = async (e) => {
  e.preventDefault();
  if (!formData.avatar && !formData.username) return;

  let avatarUrl = currentUser.avatar; // keep existing if no new file

  try {
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
      avatarUrl = data.avatar;
    }

   
    onEditProfileData({
      username: formData.username,
      avatar: avatarUrl,
    });
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
          required
          onChange={handleEditProfileChange}
        />
      </label>{" "}
      <label className="modal__label">
        Avatar
        <input
          className="modal__input"
          type="file"
          accept="image/*"
          required
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setFormData((prev) => ({ ...prev, avatar: file }));
          }}
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfile;
