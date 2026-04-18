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
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal.jsx";
import TutorialOverlay, {
  getTutorialStorageKey,
} from "../TutorialOverlay/TutorialOverlay.jsx";

import {
  createDream,
  fetchDreams,
  deleteDream,
  editDreams,
} from "../../utils/dreamApi.js";
import {
  signin,
  signOut,
  register,
  getUserInfo,
  googleSignIn,
} from "../../utils/auth.js";
import { onAuthChange } from "../../utils/firebase.js";
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
    setFilterSign,
  } = useContext(DreamContext);

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { activeModal, openModal, closeModal } = useModal();
  const [dreamBeingEdited, setDreamBeingEdited] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const navigate = useNavigate();
  const tutorialStorageKey = getTutorialStorageKey(currentUser);

  // Keep user in sync with Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await getUserInfo();
          setCurrentUser(user || null);
        } catch (err) {
          console.error("Failed to fetch user info:", err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [setCurrentUser]);

  // Show onboarding once for authenticated users, after UI has had a moment to mount.
  useEffect(() => {
    if (!authReady) return;

    if (!currentUser) {
      setShowTutorial(false);
      return;
    }

    if (localStorage.getItem(tutorialStorageKey)) {
      setShowTutorial(false);
      return;
    }

    const timerId = window.setTimeout(() => {
      setShowTutorial(true);
    }, 150);

    return () => window.clearTimeout(timerId);
  }, [authReady, currentUser, tutorialStorageKey]);

  // Sync dreams when user changes (only after auth is ready)
  useEffect(() => {
    if (!authReady || !currentUser) {
      setDreams([]);
      return;
    }

    fetchDreams()
      .then((dreams) => setDreams(dreams))
      .catch((err) => {
        console.error("Failed to load dreams:", err);
        setDreams([]);
      });
  }, [authReady, currentUser, setDreams]);

  // Dream Handlers
  const handleAddDream = async (newDream) => {
    try {
      const savedDream = await createDream(newDream);
      setDreams((prev) => [savedDream, ...prev]);
      setSelectedDream(savedDream);
      setFilterSign("ALL");
      closeModal();
      navigate("/profile");
      return savedDream;
    } catch (err) {
      console.error("Failed to save dream:", err);
      throw err;
    }
  };

  async function handleEditDream(updatedDreamData) {
    try {
      const updatedDream = await editDreams(
        updatedDreamData._id,
        updatedDreamData
      );

      updateDream(updatedDream);

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
  const handleRegister = ({ username, email, password, avatar, betaAgreementAcceptance }) => {
    register({ username, email, password, avatar, betaAgreementAcceptance })
      .then(() => getUserInfo())
      .then((user) => {
        setCurrentUser(user);
        closeModal(activeModal);
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Registration flow error:", err);
      });
  };

  const handleSignIn = ({ email, password }) => {
    signin(email, password)
      .then(() => getUserInfo())
      .then((user) => {
        setCurrentUser(user);
        closeModal(activeModal);
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Login error:", err);
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(() => getUserInfo())
      .then((user) => {
        setCurrentUser(user);
        closeModal(activeModal);
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Google login error:", err);
      });
  };

  function handleSignOut() {
    signOut();
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
  const handleForgotPasswordClick = () => openModal("forgot-password");
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
        {authReady && (
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
        )}

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
          onGoogleSignIn={handleGoogleSignIn}
          onForgotPassword={handleForgotPasswordClick}
          closeActiveModal={closeModal}
          isOpen={activeModal === "login"}
        />
        <RegisterModal
          onRegister={handleRegister}
          closeActiveModal={closeModal}
          isOpen={activeModal === "register"}
        />
        <ForgotPasswordModal
          isOpen={activeModal === "forgot-password"}
          closeActiveModal={closeModal}
        />
        <SignOutModal
          onConfirm={handleSignOut}
          isOpen={activeModal === "sign-out"}
          closeActiveModal={closeModal}
        />
        {showTutorial && (
          <TutorialOverlay
            storageKey={tutorialStorageKey}
            onFinish={() => setShowTutorial(false)}
          />
        )}
      </MoonProvider>
    </div>
  );
}

export default App;