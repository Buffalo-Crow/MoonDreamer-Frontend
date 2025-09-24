import { useContext } from "react";
import "./ProfileHeader.css";
import { Link } from "react-router-dom";
import BoldLogo from "../../assets/bold_logo.svg";
import Avatar from "../../assets/avatar.svg";
import { UserContext } from "../../contexts/userContext";

function ProfileHeader({ handleEditProfileClick }) {
  const { currentUser } = useContext(UserContext);
  return (
    <header className="profile-header">
      <div className="profile-header__content">
        <h1 className="profile-header__title">MOON DREAMER</h1>
        <Link to="/home">
          <img
            className="profile-header__logo"
            src={BoldLogo}
            alt="Moon Dreamer Pink Logo"
          />
        </Link>
      </div>
      <div className="profile-header__container">
        <img
          onClick={handleEditProfileClick}
          className="profile__avatar"
          src={currentUser.avatar || Avatar}
          alt=""
        />

        <p className="profile-header__username">{currentUser.username}</p>
      </div>
    </header>
  );
}

export default ProfileHeader;
