import "./Profile.css";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import NavBar from "../Navbar/NavBar";
import ProfileMain from "../ProfileMain/ProfileMain";

function Profile({
  handleDreamClick,
  handleEditProfileClick,
  handleDeleteDreamClick,
  handleEditDreamClick,
  handleSignOutClick,
  dreams,
}) {
  return (
    <div className="profile">
      <ProfileHeader handleEditProfileClick={handleEditProfileClick} />
      <ProfileMain
        dreams={dreams}
        handleDeleteDreamClick={handleDeleteDreamClick}
        onEditDreamClick={handleEditDreamClick}
      />
      <NavBar
        handle
        handleSignOutClick={handleSignOutClick}
        handleDreamClick={handleDreamClick}
      />
    </div>
  );
}

export default Profile;
