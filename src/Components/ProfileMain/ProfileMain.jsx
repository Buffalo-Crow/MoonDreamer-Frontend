import { useState, useEffect, useContext } from "react";
import "./ProfileMain.css";
import ZodiacSidebar from "../ZodiacSidebar/ZodiacSidebar";
import DreamPreviewList from "../DreamPreviewList/DreamPreviewList";
import DreamDetailCard from "../DreamDetailCard/DreamDetailCard";
import { DreamContext } from "../../contexts/dreamContext";

function ProfileMain({ handleDeleteDreamClick, onEditDreamClick }) {
  const { selectedDream, setSelectedDream } = useContext(DreamContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 885);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 885);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`profile-main ${selectedDream ? "dream-selected" : ""}`}>
      {!(isMobile && selectedDream) && (
        <aside className="profile-main__sidebar">
          <ZodiacSidebar />
        </aside>
      )}

      <section className="profile-main__content">
        {selectedDream ? (
          <DreamDetailCard
            handleDeleteDreamClick={handleDeleteDreamClick}
            onEditDreamClick={onEditDreamClick}
            dream={selectedDream}
            onBack={() => setSelectedDream(null)}
          />
        ) : (
          <DreamPreviewList onSelectDream={setSelectedDream} />
        )}
      </section>
    </div>
  );
}

export default ProfileMain;
