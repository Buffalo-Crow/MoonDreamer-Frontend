import "./NavBar.css";
import { useState } from "react";
import Menu from "../Menu/Menu";
import { Link } from "react-router-dom";

function NavBar({
  handleDreamClick,
  handleEditProfileClick,
  handleSignOutClick,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__list-item">
          <Link to="/profile">
            {" "}
            <button className="navbar__user-profile"></button>
          </Link>
        </li>
        <li className="navbar__list-item">
          <Link to="/home">
            <button className="navbar__home"></button>
          </Link>
        </li>
        <li className="navbar__list-item">
          <button
            onClick={handleDreamClick}
            className="navbar__add-dream"
          ></button>
        </li>
        <li>
          <button onClick={toggleMenu} className="navbar__menu"></button>{" "}
          {isMenuOpen && (
            <Menu
              onClose={closeMenu}
              onEditProfileClick={() => {
                handleEditProfileClick();
                closeMenu();
              }}
              onAddDreamClick={() => {
                handleDreamClick();
                closeMenu();
              }}
              onSignOutClick={() => {
                handleSignOutClick();
                closeMenu();
              }}
            />
          )}
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
