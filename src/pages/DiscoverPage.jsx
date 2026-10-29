import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  Layers3,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { courses, categories } from "../data/demoData.jsx";
import { getUserInitials } from "../app/userProfile.js";
import DiscoverPosts from "../components/DiscoverPosts.jsx";

function DiscoverPage({
  user,
  sessionReady,
  startCoursePost,
  onComposerOpened,
  onLogin,
  onSignup,
  onBack,
  onOffer,
  onLearning,
  onTeaching,
  onRequests,
  onRequest,
  requestedCourseTitles,
  userName,
  onProfile,
  skillCatalog = [],
  profileSkills = [],
  skillRoles = [],
  skillLoadError = "",
  onCreateSkill,
  onAddSkill,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [skill, setSkill] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [newSkillId, setNewSkillId] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [skillRole, setSkillRole] = useState("learner");
  const [skillMessage, setSkillMessage] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const searchRef = useRef(null);
  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  useEffect(() => {
    if (selectedCourse) window.scrollTo(0, 0);
  }, [selectedCourse]);
  const filtered = courses.filter((course) => {
    const matchesCategory = category === "All" || course.category === category;
    const matchesSkill = !skill || course.skills.includes(skill);
    const searchText =
      `${course.title} ${course.category} ${course.skills.join(" ")} ${course.description} ${course.teacher}`.toLowerCase();
    return (
      matchesCategory &&
      matchesSkill &&
      searchText.includes(query.toLowerCase())
    );
  });
  const availableSkills = skillCatalog.map(item => item.skill_name);
  const activeSkillRole = skillRoles.includes(skillRole) ? skillRole : skillRoles[0] || "learner";
  const selectedSkillIds = new Set(profileSkills.filter(item => item.skill_type === (activeSkillRole === "instructor" ? "offering" : "learning")).map(item => item.skill_id));
  const submitNewSkill = async (event) => {
    event.preventDefault();
    if (!newSkillId) return;
    setAddingSkill(true);
    setSkillMessage("");
    try {
      const selected = skillCatalog.find(item => item.skill_id === newSkillId);
      await onAddSkill(newSkillId, activeSkillRole);
      setSkill(selected?.skill_name || "");
      setNewSkillId("");
      setAddSkillOpen(false);
    } catch (error) {
      setSkillMessage(error.message || "Unable to add this skill.");
    } finally {
      setAddingSkill(false);
    }
  };
  const submitCustomSkill = async () => {
    if (newSkillName.trim().length < 2 || !skillRoles.includes(activeSkillRole)) return;
    setAddingSkill(true);
    setSkillMessage("");
    try {
      const created = await onCreateSkill(newSkillName);
      setSkill(created.skill_name);
      setNewSkillName("");
      setAddSkillOpen(false);
      try {
        await onAddSkill(created.skill_id, activeSkillRole);
      } catch (error) {
        setSkillMessage(`“${created.skill_name}” was saved to the catalogue, but couldn't be added to your profile: ${error.message}`);
      }
    } catch (error) {
      setSkillMessage(error.message || "Unable to save this skill to the catalogue.");
    } finally {
      setAddingSkill(false);
    }
  };

  if (selectedCourse)
    return (
      <CourseDetails
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onRequest={onRequest}
        alreadyRequested={requestedCourseTitles?.includes(selectedCourse.title)}
      />
    );

  return (
    <main className="discover-page">
      <header className="discover-top">
        <button className="discover-brand" onClick={onBack}>
          <span className="brand-mark">
            <Layers3 size={21} />
          </span>
          <span>SkillSync</span>
        </button>
        <nav className="discover-nav" aria-label="Main navigation">
          <button onClick={onBack}>Home</button>
          <a className="current" href="#discover-title" aria-current="page">
            Discover
          </a>
          <button onClick={onLearning}>My Learning</button>
          <button onClick={onTeaching}>My Teaching</button>
          <button onClick={onRequests}>Requests</button>
        </nav>
        <div className="discover-nav-actions">
          <button className="offer-top" onClick={onOffer}>
            <Plus size={17} /> Offer a Skill
          </button>
          <button className="nav-avatar" aria-label={`Open ${userName}'s profile`} onClick={onProfile}>
            {getUserInitials(userName)}
          </button>
        </div>
      </header>
      <section className="discover-content" aria-labelledby="discover-title">
        <div className="discover-heading">
          <div>
            <p className="course-count">142 COURSES BY CSE STUDENTS</p>
            <h1 id="discover-title">Discover Skills</h1>
          </div>
        </div>
        <div className="search-row">
          <label className="search-box">
            <Search size={19} />
            <input
              ref={searchRef}
              aria-label="Search courses and skills"
              placeholder={'Try "React hooks", "SQL joins" or "Figma"'}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>Ctrl K</kbd>
          </label>
          <button
            className="filter-button"
            onClick={() => {
              setCategory("All");
              setSkill("");
              setQuery("");
            }}
          >
            <SlidersHorizontal size={16} /> Clear filters
          </button>
        </div>
        <div className="filter-line">
          <span className="filter-label">CATEGORY</span>
          <div className="filter-chips">
            {categories.map((item) => (
              <button
                key={item}
                className={`filter-chip ${category === item ? "active" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-line skill-filter">
          <span className="filter-label">SKILL</span>
          <div className="filter-chips">
            {availableSkills.map((item, index) => {
              const skillIcons = [
                Code2,
                Sparkles,
                Database,
                Code2,
                Pencil,
                TrendingUp,
              ];
              const SkillIcon = skillIcons[index % skillIcons.length];
              return (
                <button
                  key={item}
                  className={`skill-chip ${skill === item ? "active" : ""}`}
                  aria-pressed={skill === item}
                  onClick={() => setSkill(skill === item ? "" : item)}
                >
                  <SkillIcon size={15} />
                  {item}
                </button>
              );
            })}
            <button className="skill-chip add-discover-skill" onClick={() => { setAddSkillOpen(value => !value); setSkillMessage(""); }}>
              <Plus size={15} /> Add skill
            </button>
          </div>
        </div>
        {addSkillOpen && (
          <form className="discover-add-skill-form" onSubmit={submitNewSkill}>
            <label>
              Choose a skill from the catalogue
              <select value={newSkillId} onChange={event => setNewSkillId(event.target.value)} required>
                <option value="">Select a skill</option>
                {skillCatalog.filter(item => !selectedSkillIds.has(item.skill_id)).map(item => <option value={item.skill_id} key={item.skill_id}>{item.skill_name}{item.category ? ` · ${item.category}` : ""}</option>)}
              </select>
            </label>
            <label>
              Add this as
              <select value={activeSkillRole} onChange={event => setSkillRole(event.target.value)}>
                {skillRoles.includes("learner") && <option value="learner">Learner · I want to learn</option>}
                {skillRoles.includes("instructor") && <option value="instructor">Instructor · I can offer</option>}
              </select>
            </label>
            <label>
              Or create your own skill
              <input value={newSkillName} onChange={event => setNewSkillName(event.target.value)} maxLength={60} placeholder="e.g. Data visualization" />
            </label>
            <button type="button" onClick={submitCustomSkill} disabled={addingSkill || newSkillName.trim().length < 2 || !skillRoles.includes(activeSkillRole)}>{addingSkill ? "Saving..." : "Create and add"}</button>
            <button type="submit" disabled={addingSkill || !newSkillId || !skillRoles.includes(activeSkillRole)}>{addingSkill ? "Adding…" : "Add to profile"}</button>
            {skillMessage && <p role="alert">{skillMessage}</p>}
            {skillLoadError && <p role="alert">{skillLoadError}</p>}
            {!skillLoadError && skillCatalog.length === 0 && <p>No skills are available in the catalogue yet.</p>}
          </form>
        )}
        <div className="discover-grid">
          {filtered.map((course) => {
            const Icon = course.icon;
            return (
              <article
                className={`course-card tone-${course.tone} ${course.featured ? "featured-course" : ""}`}
                key={course.title}
              >
                <div className="course-topline">
                  <span className="course-icon">
                    <Icon size={19} />
                  </span>
                  <span className="course-category">{course.category}</span>
                </div>
                {course.featured && (
                  <div className="course-tags">
                    <span>Featured</span>
                    <span>Web Development</span>
                  </div>
                )}
                <h2>{course.title}</h2>
                <p className="course-description">{course.description}</p>
                <div className="course-teacher">
                  <span className="teacher-avatar">{course.initials}</span>
                  <span>{course.teacher}</span>
                </div>
                <div className="course-meta">
                  <span>
                    <UsersRound size={14} />
                    {course.learners} learners
                  </span>
                  <span>
                    <Star size={14} fill="currentColor" />
                    {course.rating}
                  </span>
                </div>
                <button
                  className="view-course"
                  onClick={() => setSelectedCourse(course)}
                >
                  View Course
                  <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
          {!filtered.length && (
            <div className="empty-courses">
              <Search size={24} />
              <h2>No courses found</h2>
              <p>Try another search or clear your filters.</p>
              <button
                onClick={() => {
                  setCategory("All");
                  setSkill("");
                  setQuery("");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
          <article className="teach-card">
            <span className="teach-plus">
              <Plus size={24} />
            </span>
            <h2>Teach what you know</h2>
            <p>Your batchmates are looking for it.</p>
            <button onClick={onOffer}>
              Offer a Skill
              <ArrowRight size={15} />
            </button>
          </article>
        </div>
      </section>
      <DiscoverPosts user={user} sessionReady={sessionReady} startCoursePost={startCoursePost} onComposerOpened={onComposerOpened} onLogin={onLogin} onSignup={onSignup} />
    </main>
  );
}

function CourseDetails({
  course,
  onBack,
  onRequest,
  alreadyRequested = false,
}) {
  const [requested, setRequested] = useState(alreadyRequested);
  const isReact = course.title.includes("React");
  const learningPoints = isReact
    ? [
        "Components, props and state with modern hooks",
        "Fetching data from REST APIs and handling loading states",
        "Routing, forms and reusable UI patterns",
        "Git workflow and deploying to Vercel",
        "Shipping a team project with code reviews",
      ]
    : [
        `Core ${course.skills[0] || course.category} concepts and practical foundations`,
        `Build a project using ${course.skills.join(" and ") || course.category}`,
        "Work through hands-on exercises with peer feedback",
        "Apply best practices to real-world problems",
        "Complete a portfolio-ready final project",
      ];
  return (
    <main className="course-detail-page">
      <button className="detail-back" onClick={onBack}>
        <ArrowLeft size={18} /> Back to Discover
      </button>
      <section className={`detail-hero tone-${course.tone}`}>
        <div className="detail-main">
          <div className="detail-tags">
            {course.skills.map((skillName) => (
              <span key={skillName}>{skillName}</span>
            ))}
            <span>{isReact ? "REST APIs" : course.category}</span>
            <span>Intermediate</span>
          </div>
          <h1>{course.title}</h1>
          <p className="detail-description">
            {isReact
              ? "Build real, deployable web apps with React, hooks and REST APIs. Six weeks of live builds, peer code reviews and a final team project you can put on your portfolio."
              : course.description}
          </p>
          <div className="detail-instructor">
            <span className="detail-avatar">{course.initials}</span>
            <span>
              <strong>{course.teacher}</strong>
              <small>
                {isReact
                  ? "CSE, 4th year · Frontend intern at Pathao"
                  : "CSE student · SkillSync instructor"}
              </small>
            </span>
          </div>
        </div>
        <aside className="detail-join-panel">
          <div className="detail-metrics">
            <div className="detail-metric rating">
              <strong>{course.rating}</strong>
              <span>
                <Star size={15} fill="currentColor" />{" "}
                {isReact ? "86 ratings" : "student rating"}
              </span>
            </div>
            <div className="detail-metric learners">
              <strong>{course.learners}</strong>
              <span>learners</span>
            </div>
          </div>
          <div className="certificate-note">
            <span>
              <Award size={22} />
            </span>
            <span>
              <strong>SkillSync Certificate</strong>
              <small>On completing 80% + final project</small>
            </span>
          </div>
          <button
            className={`request-join ${requested ? "requested" : ""}`}
            disabled={requested}
            onClick={() => {
              onRequest?.(course);
              setRequested(true);
            }}
          >
            {requested ? "Request sent" : "Request to Join"}
            <ArrowRight size={20} />
          </button>
          <p className="reply-note">
            {requested
              ? "Your request is listed under Requests for this session."
              : "Instructor usually replies within a day"}
          </p>
        </aside>
      </section>
      <div className="detail-grid">
        <section className="detail-panel learn-panel">
          <h2>What you'll learn</h2>
          <ul>
            {learningPoints.map((point) => (
              <li key={point}>
                <CheckCircle2 size={18} fill="currentColor" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="detail-panel facts-panel">
          <h2>Course details</h2>
          <dl>
            <div>
              <dt>Duration</dt>
              <dd>{isReact ? "6 weeks" : "4 weeks"}</dd>
            </div>
            <div>
              <dt>Sessions</dt>
              <dd>Thu &amp; Sat, live</dd>
            </div>
            <div>
              <dt>Prerequisite</dt>
              <dd>{isReact ? "HTML, CSS, JS" : "Basic computer skills"}</dd>
            </div>
            <div>
              <dt>Seats left</dt>
              <dd className="seats-left">{isReact ? "7" : "12"} of 30</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>English, Bangla</dd>
            </div>
          </dl>
        </section>
        <div className="detail-side">
          <section className="detail-panel instructor-panel">
            <h2>Instructor</h2>
            <p>
              {course.teacher} has taught{" "}
              {isReact
                ? "4 cohorts on SkillSync and builds React apps every day as a frontend intern."
                : "helps CSE students build practical skills through friendly, hands-on sessions."}
            </p>
            <div className="instructor-stats">
              <span>
                <BookOpen size={16} /> 4 courses
              </span>
              <span>
                <Star size={17} fill="currentColor" /> {course.rating} avg
              </span>
            </div>
          </section>
          <section className="detail-panel related-panel">
            <h2>Related skills</h2>
            <div className="related-skills">
              {(isReact
                ? ["TypeScript", "UI/UX", "Node.js", "Tailwind CSS"]
                : [...course.skills, "Project work", "Teamwork"]
              ).map((item, index) => (
                <span className={`related-${index % 4}`} key={item}>
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export { CourseDetails };
export default DiscoverPage;
