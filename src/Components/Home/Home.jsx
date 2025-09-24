import "./Home.css";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import HomeMain from "../HomeMain/HomeMain";
import NavBar from "../Navbar/NavBar";

function Home({
  handleDreamClick,
  handleEditProfileClick,
  handleSignOutClick,
}) {
  return (
    <div className="home__wrapper">
      <ProfileHeader handleEditProfileClick={handleEditProfileClick} />

      <HomeMain />

      <NavBar
        handleDreamClick={handleDreamClick}
        handleSignOutClick={handleSignOutClick}
      />
    </div>
  );
}
export default Home;
