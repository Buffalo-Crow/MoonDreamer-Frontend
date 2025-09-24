import "./Main.css";
import MainLogo from "../../assets/logo.svg";

function Main({ handleLoginClick, handleRegisterClick }) {
  return (
    <div className="main">
      <img className="main__logo" src={MainLogo} alt="moon dreamer logo" />
      <h2 className="main__title">Welcome to Moon Dreamer</h2>
      <p className="main__description">Astrology and Dream Diary</p>
      <div className="main__buttons">
        <button onClick={handleLoginClick} className="main__login-btn">
          Login
        </button>
        <button onClick={handleRegisterClick} className="main__register-btn">
          Register
        </button>
      </div>
    </div>
  );
}

export default Main;
