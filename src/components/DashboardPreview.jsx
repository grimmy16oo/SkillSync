import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Layers3,
  Sparkles,
  UsersRound,
} from "lucide-react";
import StatCard from "./StatCard.jsx";

function DashboardPreview({ onExplore, onOffer, onClassroom }) {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`dashboard ${revealed ? "is-revealed" : ""}`}
      id="dashboard"
      ref={sectionRef}
      aria-labelledby="dashboard-title"
    >
      <div className="dashboard-intro">
        <h2 id="dashboard-title">
          Hey, May —<span>Ready to learn something new?</span>
        </h2>
        <p>
          Discover skills, connect with CSE students, and share what you know.
        </p>
        <div className="dashboard-actions">
          <button className="action action-gradient" onClick={onExplore}>
            Explore Courses
            <ArrowRight size={17} />
          </button>
          <button className="action action-outline" onClick={onOffer}>
            Offer a Skill
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="card-grid">
        <StatCard
          className="learning-card"
          label="Learning progress"
          icon={BookOpen}
        >
          <div className="main-stat">
            <strong>3</strong>
            <span>Active Courses</span>
          </div>
          <div className="progress-title">
            <span>Python Fundamentals</span>
            <span>72%</span>
          </div>
          <div className="progress-meta">18 of 25 lessons</div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Python Fundamentals progress"
            aria-valuenow="72"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span />
          </div>
          <div className="course-chips">
            <span>
              React &amp; Web Dev <b>40%</b>
            </span>
            <span>
              Database Design <b>15%</b>
            </span>
          </div>
        </StatCard>
        <StatCard className="skills-card" label="Skills" icon={Sparkles}>
          <div className="main-stat">
            <strong>5</strong>
            <span>Skills</span>
          </div>
          <div className="skill-group">
            <span className="skill-caption">Learning · 3</span>
            <div className="skill-tiles">
              <span>Py</span>
              <span>Re</span>
              <span>DB</span>
            </div>
          </div>
          <div className="skill-group">
            <span className="skill-caption">Offering · 2</span>
            <div className="skill-tiles offering">
              <span>Fg</span>
              <span>Jv</span>
            </div>
          </div>
        </StatCard>
        <StatCard
          className="teaching-card"
          label="Teaching"
          icon={GraduationCap}
        >
          <div className="main-stat">
            <strong>2</strong>
            <span>Active Courses</span>
          </div>
          <div className="learner-count">
            <UsersRound size={16} /> <strong>8</strong> Learners
          </div>
          <div
            className="avatars"
            aria-label="Learners: RS, AH, NK, and 5 more"
          >
            <span>RS</span>
            <span>AH</span>
            <span>NK</span>
            <span>+5</span>
          </div>
        </StatCard>
        <StatCard className="requests-card" label="Requests" icon={Layers3}>
          <div className="main-stat">
            <strong>4</strong>
            <span>Pending</span>
          </div>
          <ul className="request-list">
            <li>
              <i className="dot coral" />2 waiting on you
            </li>
            <li>
              <i className="dot yellow" />1 under review
            </li>
            <li>
              <i className="dot mint" />1 new today
            </li>
          </ul>
        </StatCard>
        <StatCard
          className="upcoming-card"
          label="Upcoming"
          icon={CalendarDays}
        >
          <h4>
            React Hooks
            <br />
            Deep Dive
          </h4>
          <p className="meeting-time">
            Thu, Oct 22 <span>·</span> 6:30 PM
          </p>
          <button type="button" onClick={onClassroom} className="join-button">
            Join Meeting
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </StatCard>
        <StatCard
          className="achievements-card"
          label="Achievements"
          icon={Sparkles}
        >
          <div className="achievement-row">
            <span className="semester">This semester</span>
            <div>
              <strong>6</strong>
              <span>Completed courses</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Skills shared</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Courses taught</span>
            </div>
            <div>
              <strong>4.8</strong>
              <span>Ratings received</span>
            </div>
          </div>
        </StatCard>
      </div>
    </section>
  );
}

export default DashboardPreview;
