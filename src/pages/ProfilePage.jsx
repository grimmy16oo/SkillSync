import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  Code2,
  Database,
  GraduationCap,
  Pencil,
  RefreshCw,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";

function ProfilePage({ onBack, onOffer }) {
  const [editOpen, setEditOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "May Chowdhury",
    university: "BRAC University",
    program: "Computer Science & Engineering, 2nd year",
    bio: "Frontend-curious CSE student. I teach UI/UX and Java to juniors and I'm currently leveling up in Python and React. Always up for a study jam.",
  });
  const submitProfile = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setProfile({
      name: String(form.get("name")),
      university: String(form.get("university")),
      program: String(form.get("program")),
      bio: String(form.get("bio")),
    });
    setEditOpen(false);
    setSaved(true);
  };
  return (
    <main className="profile-page">
      <button className="profile-back" onClick={onBack}>
        <ArrowLeft size={17} /> Back to app
      </button>
      {saved && (
        <div className="profile-saved" role="status">
          Profile changes saved.
          <button onClick={() => setSaved(false)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
      <section className="profile-hero">
        <div className="profile-cover" />
        <div className="profile-identity">
          <div className="profile-photo">
            <UserRound size={58} />
          </div>
          <div className="profile-copy">
            <div className="profile-name-line">
              <h1>{profile.name}</h1>
              <span>
                <RefreshCw size={13} /> Learner &amp; Instructor
              </span>
            </div>
            <p className="profile-school">
              <Building2 size={17} /> {profile.university} <i>·</i>{" "}
              <GraduationCap size={18} /> {profile.program}
            </p>
            <p className="profile-bio">{profile.bio}</p>
          </div>
          <div className="profile-actions">
            <button
              className="edit-profile-button"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={16} /> Edit profile
            </button>
            <button className="profile-offer-button" onClick={onOffer}>
              Offer a Skill
            </button>
          </div>
        </div>
      </section>
      <section className="profile-skills">
        <article className="profile-skill-panel learning-skills">
          <h2>
            SKILLS I'M LEARNING <span>3</span>
          </h2>
          <div className="profile-skill-list">
            <span>
              <Code2 size={17} />
              Python<b>72%</b>
            </span>
            <span>
              <Sparkles size={17} />
              React<b>40%</b>
            </span>
            <span>
              <Database size={17} />
              SQL<b>15%</b>
            </span>
          </div>
        </article>
        <article className="profile-skill-panel offering-skills">
          <h2>
            SKILLS I OFFER <span>2</span>
          </h2>
          <div className="profile-skill-list">
            <span>
              <Sparkles size={17} />
              UI/UX Design<b>5 learners</b>
            </span>
            <span>
              <Code2 size={17} />
              Java<b>3 learners</b>
            </span>
          </div>
        </article>
      </section>
      <section className="profile-stats">
        <article className="profile-stat courses">
          <span>COURSES</span>
          <strong>5</strong>
          <small>3 learning · 2 teaching</small>
        </article>
        <article className="profile-stat completed">
          <span>COMPLETED COURSES</span>
          <strong>6</strong>
          <small>2 certificates earned</small>
        </article>
        <article className="profile-stat ratings">
          <span>RATINGS</span>
          <strong>4.8</strong>
          <small>
            <Star size={16} fill="currentColor" />
            ★★★★ 31 reviews
          </small>
        </article>
        <article className="profile-review">
          <span>LATEST REVIEW</span>
          <blockquote>
            “May explains Figma like a friend, not a lecturer. Made my project
            look 10× better.”
          </blockquote>
          <small>Arif H. · UI/UX for Developers</small>
        </article>
      </section>
      {editOpen && (
        <div
          className="profile-modal-backdrop"
          onClick={() => setEditOpen(false)}
        >
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setEditOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 id="edit-profile-title">Edit profile</h2>
            <form onSubmit={submitProfile}>
              <label>
                Name
                <input name="name" defaultValue={profile.name} required />
              </label>
              <label>
                University
                <input
                  name="university"
                  defaultValue={profile.university}
                  required
                />
              </label>
              <label>
                Program and year
                <input name="program" defaultValue={profile.program} required />
              </label>
              <label>
                About me
                <textarea
                  name="bio"
                  defaultValue={profile.bio}
                  rows="4"
                  required
                />
              </label>
              <button className="profile-save-button" type="submit">
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

export default ProfilePage;
