import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Code2,
  Database,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  UsersRound,
  UserRound,
} from "lucide-react";

function AuthPage({ mode, onModeChange, onBack, onLogin }) {
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [teach, setTeach] = useState(["Python", "UI/UX"]);
  const [learn, setLearn] = useState(["React", "Machine Learning"]);
  const [moreTeach, setMoreTeach] = useState(false);
  const [moreLearn, setMoreLearn] = useState(false);
  const [message, setMessage] = useState("");
  const toggleSkill = (list, setter, skill) =>
    setter(
      list.includes(skill)
        ? list.filter((item) => item !== skill)
        : [...list, skill],
    );
  const skillChip = (skill, list, setter) => (
    <button
      key={skill}
      type="button"
      className={`auth-skill ${list.includes(skill) ? "selected" : ""}`}
      aria-pressed={list.includes(skill)}
      onClick={() => toggleSkill(list, setter, skill)}
    >
      {skill}
    </button>
  );
  return (
    <main className={`auth-page ${isSignup ? "signup-mode" : "login-mode"}`}>
      <button
        className="auth-brand auth-brand-top"
        onClick={onBack}
        aria-label="SkillSync home"
      >
        <span className="auth-brand-mark">
          <RefreshCw size={22} />
        </span>
        <strong>SkillSync</strong>
      </button>
      <div className="auth-layout">
        <section className="auth-promo" aria-label="About SkillSync">
          {isSignup ? (
            <>
              <p className="auth-eyebrow">JOIN IN UNDER A MINUTE</p>
              <h2>Your skills are worth sharing.</h2>
              <div className="auth-benefits">
                <article>
                  <span className="benefit-icon">
                    <Building2 size={23} />
                  </span>
                  <div>
                    <strong>Verify with your university email</strong>
                    <small>Only students from your campus can join.</small>
                  </div>
                </article>
                <article>
                  <span className="benefit-icon mint">
                    <ArrowLeft size={20} />
                    <ArrowRight size={20} />
                  </span>
                  <div>
                    <strong>Pick what you teach and learn</strong>
                    <small>We match you with peers who fit both ways.</small>
                  </div>
                </article>
                <article>
                  <span className="benefit-icon gold">
                    <UsersRound size={22} />
                  </span>
                  <div>
                    <strong>Join a classroom</strong>
                    <small>Meetings, materials and members in one place.</small>
                  </div>
                </article>
              </div>
            </>
          ) : (
            <>
              <p className="auth-eyebrow">BY CSE STUDENTS, FOR CSE STUDENTS</p>
              <h2>
                Teach what you know.
                <br />
                Learn what you don't.
              </h2>
              <p className="auth-promo-copy">
                Swap skills with classmates across your university. One hour of
                Python for one hour of React, no fees, just peers.
              </p>
              <div className="auth-social-proof">
                <article className="learner-proof">
                  <span className="proof-avatar">RS</span>
                  <div>
                    <strong>Riya Sen wants to learn</strong>
                    <small>Java Programming · 2 min ago</small>
                    <span className="offer-tag">↔ &nbsp;Offers UI/UX</span>
                  </div>
                </article>
                <article className="active-proof">
                  <strong>ACTIVE THIS WEEK</strong>
                  <b>1,240</b>
                  <small>students swapping skills</small>
                </article>
              </div>
              <div className="auth-topic-tags">
                <span>
                  <Code2 size={15} /> Python
                </span>
                <span>
                  <Sparkles size={15} /> React
                </span>
                <span>
                  <Database size={15} /> ML Basics
                </span>
                <span>
                  <Pencil size={15} /> UI/UX
                </span>
              </div>
            </>
          )}
        </section>
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-heading">
            <h1 id="auth-title">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p>
              {isSignup ? (
                <>
                  Already have one?{" "}
                  <button
                    type="button"
                    className="text-action inline-action"
                    onClick={() => onModeChange("login")}
                  >
                    Log in
                  </button>
                </>
              ) : (
                "Log in to pick up where you left off."
              )}
            </p>
          </div>
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (isSignup) {
                setMessage(
                  "Account creation is not connected yet. Your details were not submitted.",
                );
                return;
              }
              setMessage("");
              onLogin();
            }}
          >
            {isSignup && (
              <div className="auth-field-row">
                <label className="field-label">
                  Full name
                  <span className="input-wrap">
                    <UserRound size={18} />
                    <input
                      autoComplete="name"
                      type="text"
                      placeholder="Susmita Das"
                      required
                    />
                  </span>
                </label>
                <label className="field-label">
                  Year
                  <span className="input-wrap">
                    <GraduationCap size={18} />
                    <select defaultValue="CSE, 3rd year" aria-label="Year">
                      <option>CSE, 1st year</option>
                      <option>CSE, 2nd year</option>
                      <option>CSE, 3rd year</option>
                      <option>CSE, 4th year</option>
                    </select>
                  </span>
                </label>
              </div>
            )}
            <label className="field-label">
              University email
              <span className="input-wrap">
                <Mail size={18} />
                <input
                  autoComplete="email"
                  type="email"
                  placeholder="you@university.edu"
                  required
                />
              </span>
            </label>
            <label className="field-label">
              Password
              {!isSignup && (
                <button
                  type="button"
                  className="text-action forgot-action"
                  onClick={() =>
                    setMessage("Password reset is not available yet.")
                  }
                >
                  Forgot password?
                </button>
              )}
              <span className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isSignup ? "At least 8 characters" : "Enter your password"
                  }
                  minLength={8}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </span>
            </label>
            {isSignup ? (
              <>
                <div className="password-meter" aria-label="Password strength">
                  <span className={password.length >= 1 ? "filled" : ""}></span>
                  <span className={password.length >= 6 ? "filled" : ""}></span>
                  <span
                    className={password.length >= 10 ? "filled" : ""}
                  ></span>
                  <span
                    className={password.length >= 14 ? "filled" : ""}
                  ></span>
                </div>
                <fieldset className="skill-field">
                  <legend>I can teach</legend>
                  <div className="skill-list">
                    {["Python", "Java", "UI/UX", "Databases"].map((skill) =>
                      skillChip(skill, teach, setTeach),
                    )}
                    <button
                      type="button"
                      className="auth-skill add-skill"
                      onClick={() => setMoreTeach((value) => !value)}
                    >
                      <Plus size={16} /> Add skill
                    </button>
                    {moreTeach &&
                      ["React", "Git", "Machine Learning"].map((skill) =>
                        skillChip(skill, teach, setTeach),
                      )}
                  </div>
                </fieldset>
                <fieldset className="skill-field">
                  <legend>I want to learn</legend>
                  <div className="skill-list">
                    {["React", "Machine Learning", "Git"].map((skill) =>
                      skillChip(skill, learn, setLearn),
                    )}
                    <button
                      type="button"
                      className="auth-skill add-skill"
                      onClick={() => setMoreLearn((value) => !value)}
                    >
                      <Plus size={16} /> Add skill
                    </button>
                    {moreLearn &&
                      ["Python", "Java", "UI/UX"].map((skill) =>
                        skillChip(skill, learn, setLearn),
                      )}
                  </div>
                </fieldset>
                <label className="remember-option terms-option">
                  <input type="checkbox" required /> I agree to the community
                  guidelines and privacy policy
                </label>
              </>
            ) : (
              <label className="remember-option keep-option">
                <input type="checkbox" defaultChecked /> Keep me logged in
              </label>
            )}
            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
            <button type="submit" className="auth-submit">
              {isSignup ? "Create account" : "Log in"}
              <ArrowRight size={20} />
            </button>
          </form>
          {!isSignup && (
            <>
              <div className="auth-divider">
                <span>OR</span>
              </div>
              <div className="auth-providers">
                <button
                  type="button"
                  onClick={() =>
                    setMessage("Google sign-in is not connected yet.")
                  }
                >
                  <b className="google-g">G</b>Google
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessage("GitHub sign-in is not connected yet.")
                  }
                >
                  <Code2 size={18} />
                  GitHub
                </button>
              </div>
            </>
          )}
          <p className="auth-switch">
            {isSignup ? "Already have an account?" : "New to SkillSync?"}{" "}
            <button
              type="button"
              onClick={() => onModeChange(isSignup ? "login" : "signup")}
            >
              {isSignup ? "Log in" : "Create an account"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}

export default AuthPage;
