import "./Header.css";
import HeaderLogoLeft from "../../assets/MoonLeft.svg";
import HeaderLogoRight from "../../assets/MoonRight.svg";

function Header() {
  return (
    <>
      <header className="header">
        <img
          className="header__logo"
          src={HeaderLogoLeft}
          alt="pink moon logo"
        />
        <h1 className="header__title">MOON DREAMER</h1>
        <img
          className="header__logo"
          src={HeaderLogoRight}
          alt="pink moon logo"
        />
      </header>
    </>
  );
}
export default Header;
