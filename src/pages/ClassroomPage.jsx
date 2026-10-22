import { useState } from "react";
import {
  Download,
  Megaphone,
  MessageCircle,
  Play,
  Search,
  Video,
  X,
} from "lucide-react";
import { classroomMaterials, classroomMembers } from "../data/demoData.jsx";

function ClassroomPage({ onBack, initialTab = "Overview" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const tabs = ["Overview", "Materials", "Meetings", "Members"];
  const filteredMembers = classroomMembers.filter((member) =>
    `${member.name} ${member.role}`.toLowerCase().includes(query.toLowerCase()),
  );
  const downloadMaterial = (title) =>
    setNotice(`A download isn't attached to ${title} yet.`);
  return (
    <main className="classroom-page">
      <div className="classroom-breadcrumb">
        <button onClick={onBack}>Classrooms</button>
        <span>›</span>
        <strong>Python Fundamentals</strong>
      </div>
      <header className="classroom-heading">
        <h1>Python Fundamentals</h1>
        <div className="classroom-avatar-stack" aria-label="Class members">
          <span className="tone-coral">RS</span>
          <span className="tone-lavender">AH</span>
          <span className="tone-gold">NK</span>
          <span>+21</span>
        </div>
      </header>
      <nav
        className="classroom-tabs"
        role="tablist"
        aria-label="Classroom sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab);
              setNotice("");
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      {notice && (
        <div className="classroom-notice" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
      {activeTab === "Overview" && (
        <section className="classroom-grid">
          <article className="classroom-card about-card">
            <h2>ABOUT THIS CLASSROOM</h2>
            <p>
              A friendly, lab-first intro to Python for 1st and 2nd year CSE
              students. Weekly problem sets, live lab sessions and an
              end-of-course mini project.
            </p>
            <div className="classroom-tags">
              <span>Programming</span>
              <span>Beginner</span>
              <span>8 weeks</span>
            </div>
            <div className="instructor-block">
              <span className="classroom-person-avatar tone-mint">NR</span>
              <span>
                <small>INSTRUCTOR</small>
                <strong>Nabil Rahman</strong>
                <em>CSE, 4th year · 4.8 rating</em>
              </span>
              <button
                aria-label="Message instructor"
                onClick={() =>
                  setNotice(
                    "The classroom messaging service is not connected yet.",
                  )
                }
              >
                <MessageCircle size={21} />
              </button>
            </div>
            <h3 className="recent-materials-title">RECENT MATERIALS</h3>
            <div className="recent-materials">
              {classroomMaterials.slice(0, 2).map((material) => {
                const Icon = material.icon;
                return (
                  <article key={material.title}>
                    <span className={`material-icon tone-${material.tone}`}>
                      <Icon size={22} />
                    </span>
                    <span>
                      <strong>{material.title}</strong>
                      <small>
                        {material.type} · {material.size} · {material.time}
                      </small>
                    </span>
                    <button
                      aria-label={`Download ${material.title}`}
                      onClick={() => downloadMaterial(material.title)}
                    >
                      <Download size={20} />
                    </button>
                  </article>
                );
              })}
            </div>
          </article>
          <article className="classroom-card progress-class-card">
            <h2>YOUR PROGRESS</h2>
            <strong className="class-progress-number">72%</strong>
            <p>18 of 25 lessons done</p>
            <div className="progress-track">
              <span style={{ width: "72%" }} />
            </div>
            <small>Next up: Lists and Dictionaries</small>
          </article>
          <article className="classroom-card meeting-class-card">
            <h2>UPCOMING MEETING</h2>
            <div className="class-meeting">
              <span className="class-date">
                <small>OCT</small>
                <strong>21</strong>
              </span>
              <span>
                <strong>Lab 7 · Loops in practice</strong>
                <small>Wed · 5:00 to 6:30 PM</small>
              </span>
            </div>
            <button
              className="join-class-meeting"
              onClick={() =>
                setNotice(
                  "A meeting link is not available for this sample schedule.",
                )
              }
            >
              <Video size={19} fill="currentColor" /> Join Meeting
            </button>
          </article>
          <article className="class-announcement">
            <span>
              <Megaphone size={29} fill="currentColor" />
            </span>
            <div>
              <strong>Problem Set 5 is due Friday, 11:59 PM</strong>
              <p>
                Post questions in the classroom chat, Nabil answers every
                evening.
              </p>
            </div>
            <button onClick={() => setActiveTab("Materials")}>Open</button>
          </article>
        </section>
      )}
      {activeTab === "Materials" && (
        <section className="classroom-tab-content">
          <div className="classroom-section-heading">
            <div>
              <h2>Course materials</h2>
              <p>Files and resources shared with your classroom.</p>
            </div>
            <span>3 materials</span>
          </div>
          <div className="material-list">
            {classroomMaterials.map((material) => {
              const Icon = material.icon;
              return (
                <article className="material-row" key={material.title}>
                  <span className={`material-icon tone-${material.tone}`}>
                    <Icon size={23} />
                  </span>
                  <div>
                    <strong>{material.title}</strong>
                    <small>
                      {material.type} · {material.size} · Added{" "}
                      {material.time.toLowerCase()}
                    </small>
                  </div>
                  <button
                    onClick={() => downloadMaterial(material.title)}
                    aria-label={`Download ${material.title}`}
                  >
                    <Download size={19} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}
      {activeTab === "Meetings" && (
        <section className="classroom-tab-content">
          <div className="classroom-section-heading">
            <div>
              <h2>Class meetings</h2>
              <p>Upcoming sessions and recordings.</p>
            </div>
            <span>Thursdays &amp; Saturdays</span>
          </div>
          <div className="meeting-list">
            <article className="meeting-row upcoming">
              <span className="class-date">
                <small>OCT</small>
                <strong>21</strong>
              </span>
              <div>
                <strong>Lab 7 · Loops in practice</strong>
                <small>Wednesday · 5:00 to 6:30 PM · Live session</small>
              </div>
              <button
                onClick={() =>
                  setNotice(
                    "A meeting link is not available for this sample schedule.",
                  )
                }
              >
                <Video size={17} /> Join
              </button>
            </article>
            <article className="meeting-row">
              <span className="class-date past">
                <small>OCT</small>
                <strong>17</strong>
              </span>
              <div>
                <strong>Lab 6 · Functions and scope</strong>
                <small>Saturday · Recording available · 1h 24m</small>
              </div>
              <button
                onClick={() =>
                  setNotice("The Lab 6 recording is not attached yet.")
                }
              >
                <Play size={17} /> Watch
              </button>
            </article>
            <article className="meeting-row">
              <span className="class-date past">
                <small>OCT</small>
                <strong>14</strong>
              </span>
              <div>
                <strong>Problem solving clinic</strong>
                <small>Wednesday · Recording available · 58m</small>
              </div>
              <button
                onClick={() =>
                  setNotice("The clinic recording is not attached yet.")
                }
              >
                <Play size={17} /> Watch
              </button>
            </article>
          </div>
        </section>
      )}
      {activeTab === "Members" && (
        <section className="classroom-tab-content">
          <div className="classroom-section-heading">
            <div>
              <h2>Class members</h2>
              <p>Meet the people learning together.</p>
            </div>
            <span>24 members</span>
          </div>
          <label className="member-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search members"
            />
          </label>
          <div className="member-grid">
            {filteredMembers.map((member) => (
              <article className="member-card" key={member.name}>
                <span className={`classroom-person-avatar tone-${member.tone}`}>
                  {member.initials}
                </span>
                <span>
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                </span>
                {member.role === "Instructor" && (
                  <span className="instructor-tag">Instructor</span>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default ClassroomPage;
