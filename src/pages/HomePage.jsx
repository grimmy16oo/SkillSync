import Hero from "../components/Hero.jsx";
import DashboardPreview from "../components/DashboardPreview.jsx";

function HomePage({ onAuth, onExplore, onOffer, onClassroom }) {
  return (
    <div className="page-shell">
      <Hero onAuth={onAuth} />
      <DashboardPreview
        onExplore={onExplore}
        onOffer={onOffer}
        onClassroom={onClassroom}
      />
    </div>
  );
}

export default HomePage;
