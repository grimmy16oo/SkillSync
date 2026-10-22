import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Layers3,
  Plus,
  Star,
  TrendingUp,
  UsersRound,
  Hourglass,
  X,
} from "lucide-react";
function MyTeachingPage({
  onBack,
  onDiscover,
  onLearning,
  onOffer,
  onRequests,
  onUpdateRequest,
  courses,
  setCourses,
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [manageCourse, setManageCourse] = useState(null);
  const pendingCount = courses.reduce(
    (total, course) => total + course.pending,
    0,
  );
  const handleRequest = (courseTitle, request, accepted) => {
    onUpdateRequest({ ...request, course: courseTitle }, accepted);
    setNotice(
      accepted
        ? `${request.name} was added to ${courseTitle}.`
        : `${request.name}'s request was declined.`,
    );
  };
  const createCourse = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title")).trim();
    if (!title) return;
    setCourses((current) => [
      ...current,
      {
        title,
        category: String(form.get("category")),
        week: "Not published yet",
        tone: "lavender",
        icon: BookOpen,
        learners: 0,
        pending: 0,
        rating: "—",
        requests: [],
        draftOnly: true,
      },
    ]);
    setCreateOpen(false);
    setNotice(`${title} was saved as a draft.`);
  };
  const saveCourseDetails = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setCourses((current) =>
      current.map((course) =>
        course.title === manageCourse.title
          ? {
              ...course,
              title: String(form.get("title")).trim(),
              category: String(form.get("category")),
            }
          : course,
      ),
    );
    setManageCourse(null);
    setNotice("Course details were updated for this session.");
  };
  return (
    <main className="teaching-page">
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
          <button onClick={onLearning}>My Learning</button>
          <a className="current" href="#teaching-title" aria-current="page">
            My Teaching
          </a>
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
      <div className="teaching-content">
        <div className="teaching-heading">
          <div>
            <p>INSTRUCTOR SPACE</p>
            <h1 id="teaching-title">My Teaching</h1>
          </div>
          <button onClick={() => setCreateOpen(true)}>
            <Plus size={21} /> Create a Course
          </button>
        </div>
        {notice && (
          <p className="teaching-notice" role="status">
            {notice}
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </p>
        )}
        <section className="teaching-stats">
          <article>
            <span>ACTIVE COURSES</span>
            <strong>
              {courses.filter((course) => !course.draftOnly).length}
            </strong>
            <small>
              {
                courses.filter((course) => course.draftOnly || course.draft)
                  .length
              }{" "}
              draft in progress
            </small>
          </article>
          <article>
            <span>TOTAL LEARNERS</span>
            <strong>{courses.reduce((n, c) => n + c.learners, 0)}</strong>
            <small>
              <TrendingUp size={16} /> +3 this week
            </small>
          </article>
          <article>
            <span>PENDING REQUESTS</span>
            <strong>{pendingCount}</strong>
            <small>Oldest: 2 days ago</small>
          </article>
          <article>
            <span>AVERAGE RATING</span>
            <strong>4.8</strong>
            <small>
              <Star size={16} fill="currentColor" /> from 31 reviews
            </small>
          </article>
        </section>
        <h2 className="your-courses-title">Your courses</h2>
        <section className="teaching-course-grid">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <article
                className={`teaching-course tone-${course.tone}`}
                key={course.title}
              >
                <div className="teaching-course-heading">
                  <span className="teaching-course-icon">
                    <Icon size={24} />
                  </span>
                  <div>
                    <h3>{course.title}</h3>
                    <p>
                      {course.category} · {course.week}
                    </p>
                  </div>
                  {course.draftOnly ? (
                    <span className="active-pill draft-pill">● Draft</span>
                  ) : (
                    <span className="active-pill">● Active</span>
                  )}
                </div>
                <div className="teaching-course-stats">
                  <span>
                    <UsersRound size={20} />
                    {course.learners} learners
                  </span>
                  <span>
                    <Hourglass size={19} />
                    {course.pending} pending
                  </span>
                  <span>
                    <Star size={20} fill="currentColor" />
                    {course.rating}
                  </span>
                </div>
                {course.requests.map((request) => (
                  <div className="learner-request" key={request.name}>
                    <span className="request-avatar">{request.initials}</span>
                    <span className="request-person">
                      <strong>{request.name}</strong>
                      <small>{request.meta}</small>
                    </span>
                    <button
                      className="accept-request"
                      aria-label={`Accept ${request.name}'s request`}
                      onClick={() => handleRequest(course.title, request, true)}
                    >
                      <Check size={20} />
                    </button>
                    <button
                      className="decline-request"
                      aria-label={`Decline ${request.name}'s request`}
                      onClick={() =>
                        handleRequest(course.title, request, false)
                      }
                    >
                      <X size={19} />
                    </button>
                  </div>
                ))}
                {course.draft && (
                  <div className="draft-row">
                    <span>
                      <BookOpen size={18} />
                    </span>
                    <strong>{course.draft}</strong>
                    <small>Draft</small>
                  </div>
                )}
                <div className="teaching-course-actions">
                  <button
                    className="manage-course"
                    onClick={() => setManageCourse(course)}
                  >
                    Manage
                    <ArrowRight size={18} />
                  </button>
                  <button className="all-requests" onClick={onRequests}>
                    View all requests
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
      {createOpen && (
        <div
          className="create-course-backdrop"
          onClick={() => setCreateOpen(false)}
        >
          <section
            className="create-course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-course-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setCreateOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="learner-eyebrow">SHARE WHAT YOU KNOW</p>
            <h2 id="create-course-title">Create a course</h2>
            <form onSubmit={createCourse}>
              <label>
                Course name
                <input
                  name="title"
                  placeholder="e.g. Intro to TypeScript"
                  required
                />
              </label>
              <label>
                Category
                <select name="category">
                  <option>Programming</option>
                  <option>Web Development</option>
                  <option>Data &amp; Databases</option>
                  <option>AI / ML</option>
                  <option>Design</option>
                </select>
              </label>
              <button className="create-submit" type="submit">
                Save as draft
                <ArrowRight size={17} />
              </button>
            </form>
          </section>
        </div>
      )}
      {manageCourse && (
        <div
          className="create-course-backdrop"
          onClick={() => setManageCourse(null)}
        >
          <section
            className="create-course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-course-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setManageCourse(null)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="learner-eyebrow">COURSE SETTINGS</p>
            <h2 id="manage-course-title">Manage course</h2>
            <form onSubmit={saveCourseDetails}>
              <label>
                Course name
                <input
                  name="title"
                  defaultValue={manageCourse.title}
                  required
                />
              </label>
              <label>
                Category
                <select name="category" defaultValue={manageCourse.category}>
                  <option>Programming</option>
                  <option>Web Development</option>
                  <option>Data &amp; Databases</option>
                  <option>AI / ML</option>
                  <option>Design</option>
                </select>
              </label>
              <button className="create-submit" type="submit">
                Save changes
                <Check size={17} />
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default MyTeachingPage;
