import { useState, useEffect, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useModal } from "../../contexts/modalContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal.jsx";
import Home from "../Home/Home.jsx";
import Profile from "../Profile/Profile.jsx";
import DreamModal from "../DreamModal/DreamModal.jsx";
import EditProfile from "../EditProfileModal/EditProfile.jsx";
import SignOutModal from "../SignOutModal/SignOutModal.jsx";
import DeleteDreamModal from "../DeleteDreamModal/DeleteDreamModal.jsx";

import {
  createDream,
  fetchDreams,
  deleteDream,
  editDreams,
} from "../../utils/dreamApi.js";
import { signin, signOut, register, getUserInfo } from "../../utils/auth.js";
import { MoonProvider } from "../../contexts/moonSignContext.jsx";
import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoute.jsx";
import { DreamContext } from "../../contexts/dreamContext.jsx";
import { UserContext } from "../../contexts/userContext.jsx";
import { editProfile } from "../../utils/api.js";
import { clearMoonSignCache } from "../../utils/moonSignUtils.js";

function App() {
  const {
    dreams,
    setDreams,
    setDreamToDelete,
    dreamToDelete,
    setSelectedDream,
    updateDream,
  } = useContext(DreamContext);

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { activeModal, openModal, closeModal } = useModal();
  const [dreamBeingEdited, setDreamBeingEdited] = useState(null);
  const navigate = useNavigate();

  // Sync dreams when user changes
  useEffect(() => {
    if (!currentUser) {
      setDreams([]);
      return;
    }

    fetchDreams()
      .then((dreams) => setDreams(dreams))
      .catch((err) => {
        console.error("Failed to load dreams:", err);
        setDreams([]);
      });
  }, [currentUser, setDreams]);

  // Dream Handlers
  const handleAddDream = async (newDream) => {
    try {
      const savedDream = await createDream(newDream);
      setDreams((prev) => [savedDream, ...prev]);
    } catch (err) {
      console.error("Failed to save dream:", err);
    }
  };

  async function handleEditDream(updatedDreamData) {
    try {
      // Call the API directly first
      const updatedDream = await editDreams(
        updatedDreamData._id,
        updatedDreamData
      );

      // Then update the context state
      updateDream(updatedDream); // Pass the returned dream object

      closeModal(activeModal);
      setDreamBeingEdited(null);
    } catch (err) {
      console.error("Failed to update dream:", err);
    }
  }

  const handleDeleteDream = async () => {
    if (!dreamToDelete) return;
    try {
      await deleteDream(dreamToDelete._id);
      setDreams((prev) => prev.filter((d) => d._id !== dreamToDelete._id));
      closeModal(activeModal);
      setSelectedDream(null);
      setDreamToDelete(null);
      navigate("/profile");
    } catch (err) {
      console.error("Failed to delete dream:", err);
    }
  };

  // Register Sign in and sign out handlers
  const handleRegister = ({ username, email, password, avatar }) => {
    register({ username, email, password, avatar })
      .then(() => signin(email, password)) // auto-login after register
      .then((data) => {
        setCurrentUser({...data.user, token: data.token});
        closeModal(activeModal);
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Registration flow error:", err);
      });
  };

  const handleSignIn = ({ email, password }) => {
    signin(email, password)
      .then((data) => {
        setCurrentUser({...data.user, token: data.token});
        closeModal(activeModal);
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Login error:", err);
      });
  };

  function handleSignOut() {
    signOut(); // handles both user + token
    setCurrentUser(null);
    navigate("/");
    clearMoonSignCache();
    closeModal(activeModal);
  }

  // edit User Profile

  const handleEditProfileData = ({ username, avatar }) => {
    editProfile({ username, avatar })
      .then((res) => {
        console.log(res.data);
        setCurrentUser(res.data);
        closeModal(activeModal);
      })
      .catch((err) => console.log(err));
  };

  // ---------- Modal handlers ----------
  const handleRegisterClick = () => openModal("register");
  const handleLoginClick = () => openModal("login");
  const handleEditProfileClick = () => openModal("edit-profile");
  const handleDreamClick = () => openModal("add-dream");
  const handleDeleteDreamClick = (dream) => {
    setDreamToDelete(dream);
    openModal("delete-dream");
  };
  const handleEditDreamClick = (dream) => {
    setDreamBeingEdited(dream);
    openModal("edit-dream");
  };
  const handleSignOutClick = () => openModal("sign-out");

  return (
    <div className="app">
      <MoonProvider>
        <Routes>
          <Route
            path="/"
            element={
              <div className="app__container-landingpage">
                <Header />
                <Main
                  handleLoginClick={handleLoginClick}
                  handleRegisterClick={handleRegisterClick}
                  closeActiveModal={closeModal}
                />
                <Footer />
              </div>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home
                  handleSignOutClick={handleSignOutClick}
                  handleDreamClick={handleDreamClick}
                  handleEditProfileClick={handleEditProfileClick}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile
                  dreams={dreams}
                  setDreams={setDreams}
                  handleDreamClick={handleDreamClick}
                  handleEditProfileClick={handleEditProfileClick}
                  handleSignOutClick={handleSignOutClick}
                  handleDeleteDreamClick={handleDeleteDreamClick}
                  handleEditDreamClick={handleEditDreamClick}
                />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Modals */}
        <EditProfile
          closeActiveModal={closeModal}
          isOpen={activeModal === "edit-profile"}
          currentUser={currentUser}
          onEditProfileData={handleEditProfileData}
        />
        <DeleteDreamModal
          onConfirm={handleDeleteDream}
          closeActiveModal={closeModal}
          isOpen={activeModal === "delete-dream"}
        />
        <DreamModal
          isOpen={activeModal === "add-dream" || activeModal === "edit-dream"}
          closeActiveModal={closeModal}
          onSubmitDream={
            activeModal === "add-dream" ? handleAddDream : handleEditDream
          }
          dreamToEdit={activeModal === "edit-dream" ? dreamBeingEdited : null}
        />
        <LoginModal
          onSignIn={handleSignIn}
          closeActiveModal={closeModal}
          isOpen={activeModal === "login"}
        />
        <RegisterModal
          onRegister={handleRegister}
          closeActiveModal={closeModal}
          isOpen={activeModal === "register"}
        />
        <SignOutModal
          onConfirm={handleSignOut}
          isOpen={activeModal === "sign-out"}
          closeActiveModal={closeModal}
        />
      </MoonProvider>
    </div>
  );
}

export default App;
