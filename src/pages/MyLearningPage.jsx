import { useState } from "react";
import {
  ArrowRight,
  Award,
  Code2,
  Compass,
  Flame,
  GraduationCap,
  Layers3,
  Play,
  Plus,
  Hourglass,
} from "lucide-react";
import { learningCourses } from "../data/demoData.jsx";

function MyLearningPage({
  onDiscover,
  onBack,
  onOffer,
  onTeaching,
  onRequests,
  onClassroom,
}) {
  const [activeTab, setActiveTab] = useState("In progress");
  const [resumeOpen, setResumeOpen] = useState(false);
  const shownCourses = learningCourses.filter(
    (course) => course.status === activeTab,
  );
  const mainCourse = learningCourses[0];
  return (
    <main className="learning-page">
      <header className="discover-top">
        <button className="discover-brand" onClick={onBack}>
          <span className="brand-mark">
            <Layers3 size={21} />
          </span>
          <span>SkillSync</span>
        </button>
        <nav className="discover-nav" aria-label="Main navigation">
          <button onClick={onBack}>Home</button>
          <button onClick={onDiscover}>Discover</button>
          <a className="current" href="#learning-title" aria-current="page">
            My Learning
          </a>
          <button onClick={onTeaching}>My Teaching</button>
          <button onClick={onRequests}>Requests</button>
        </nav>
        <div className="discover-nav-actions">
          <button className="offer-top" onClick={onOffer}>
            <Plus size={17} /> Offer a Skill
          </button>
          <span className="nav-avatar" aria-label="Signed in as May">
            M
          </span>
        </div>
      </header>
      <div className="learning-layout">
        <section className="learning-main">
          <div className="learning-title-row">
            <div>
              <p className="learner-eyebrow">LEARNER SPACE</p>
              <h1 id="learning-title">My Learning</h1>
            </div>
            <button className="find-course-button" onClick={onDiscover}>
              <Compass size={19} fill="currentColor" /> Find a new course
            </button>
          </div>
          <section className="continue-card">
            <div className="continue-icon">
              <Code2 size={38} />
            </div>
            <div className="continue-copy">
              <p>CONTINUE WHERE YOU LEFT OFF</p>
              <h2>{mainCourse.title}</h2>
              <span>
                Next lesson: Lists and Dictionaries · with{" "}
                {mainCourse.instructor}
              </span>
              <div className="continue-progress">
                <div className="progress-track">
                  <span style={{ width: `${mainCourse.percent}%` }} />
                </div>
                <strong>{mainCourse.percent}%</strong>
              </div>
            </div>
            <button
              className="resume-button"
              onClick={() => setResumeOpen((value) => !value)}
            >
              <Play size={17} fill="currentColor" />{" "}
              {resumeOpen ? "Lesson ready" : "Resume"}
            </button>
            {resumeOpen && (
              <p className="resume-notice">Next up: Lists and Dictionaries</p>
            )}
          </section>
          <div
            className="learning-tabs"
            role="tablist"
            aria-label="Filter learning courses"
          >
            {["In progress", "Completed", "Saved"].map((tab, i) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span> · {[3, 6, 4][i]}</span>
              </button>
            ))}
          </div>
          <div className="learning-course-grid">
            {shownCourses.map((course) => {
              const Icon = course.icon;
              return (
                <article
                  className={`learning-course tone-${course.tone}`}
                  key={course.title}
                >
                  <div className="learning-course-top">
                    <span className="learning-icon">
                      <Icon size={22} />
                    </span>
                    <span className="course-week">{course.week}</span>
                  </div>
                  <h2>{course.title}</h2>
                  <p>{course.instructor}</p>
                  <div className="lesson-progress">
                    <span>{course.lessons}</span>
                    {course.percent > 0 && <strong>{course.percent}%</strong>}
                  </div>
                  {course.percent > 0 && (
                    <div className="progress-track">
                      <span style={{ width: `${course.percent}%` }} />
                    </div>
                  )}
                  {course.title === "Python Fundamentals" &&
                    course.status === "In progress" && (
                      <button className="open-classroom" onClick={onClassroom}>
                        Open classroom
                        <ArrowRight size={15} />
                      </button>
                    )}
                </article>
              );
            })}
          </div>
          <div className="learning-achievements">
            <div className="achievement-tile completed">
              <GraduationCap size={34} />
              <strong>6</strong>
              <span>Courses completed</span>
            </div>
            <div className="achievement-tile streak">
              <Flame size={32} fill="currentColor" />
              <strong>12 days</strong>
              <span>Learning streak</span>
            </div>
            <div className="achievement-tile certificates">
              <Award size={33} fill="currentColor" />
              <strong>2</strong>
              <span>Certificates earned</span>
            </div>
          </div>
        </section>
        <aside className="coming-up">
          <h2>Coming up</h2>
          <div className="upcoming-list">
            <article>
              <span className="date-tile">
                <small>OCT</small>
                <strong>21</strong>
              </span>
              <span>
                <strong>Lab 7 · Loops in practice</strong>
                <small>Meeting · 5:00 PM</small>
              </span>
            </article>
            <article>
              <span className="date-tile">
                <small>OCT</small>
                <strong>22</strong>
              </span>
              <span>
                <strong>React Hooks Deep Dive</strong>
                <small>Meeting · 6:30 PM</small>
              </span>
            </article>
            <article className="due-item">
              <span className="date-tile">
                <small>OCT</small>
                <strong>23</strong>
              </span>
              <span>
                <strong>Problem Set 5 due</strong>
                <small>Python · 11:59 PM</small>
              </span>
            </article>
            <article className="pending-item">
              <span className="date-tile">
                <Hourglass size={20} />
              </span>
              <span>
                <strong>Machine Learning Basics</strong>
                <small>Join request pending</small>
              </span>
            </article>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default MyLearningPage;
