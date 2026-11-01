import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  RefreshCw,
  UsersRound,
  UserRound,
} from "lucide-react";

function AuthPage({ mode, onModeChange, onBack, onAuthenticate }) {
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [skills, setSkills] = useState("");
  const [roleChoice, setRoleChoice] = useState("learner");
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
                    <strong>Add your institution</strong>
                    <small>Show your institution on your profile.</small>
                  </div>
                </article>
                <article>
                  <span className="benefit-icon mint">
                    <ArrowLeft size={20} />
                    <ArrowRight size={20} />
                  </span>
                  <div>
                    <strong>Choose your roles and skills</strong>
                    <small>Set learner and instructor roles and skills.</small>
                  </div>
                </article>
                <article>
                  <span className="benefit-icon gold">
                    <UsersRound size={22} />
                  </span>
                  <div>
                    <strong>Share a skill post</strong>
                    <small>Publish a post and attach supporting files.</small>
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
                  <span className="proof-avatar"><UserRound size={19} /></span>
                  <div>
                    <strong>Member profile</strong>
                    <small>Name, email, institution and bio</small>
                    <span className="offer-tag">PROFILE</span>
                  </div>
                </article>
                <article className="active-proof">
                  <strong>CONNECTED DATA</strong>
                  <b>Posts</b>
                  <small>Skills, roles, posts and attachments</small>
                </article>
              </div>            </>
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
            onSubmit={async (event) => {
              event.preventDefault();
              setMessage("");
              setBusy(true);
              try {
                const result = await onAuthenticate({
                  mode: isSignup ? "signup" : "login",
                  email,
                  password,
                  fullName,
                  institution,
                  roleChoice,
                  bio,
                  dateOfBirth,
                  skills,
                });
                if (result?.message) setMessage(result.message);
              } catch (error) {
                setMessage(error.message || "Authentication failed. Please try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {isSignup && (
              <>
              <div className="auth-field-row">
                <label className="field-label">
                  Full name
                  <span className="input-wrap">
                    <UserRound size={18} />
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      autoComplete="name"
                      type="text"
                      placeholder="Susmita Das"
                      required
                    />
                  </span>
                </label>
                <label className="field-label">
                  Institution
                  <span className="input-wrap">
                    <Building2 size={18} />
                    <input value={institution} onChange={(event) => setInstitution(event.target.value)} autoComplete="organization" placeholder="Your university" required />
                  </span>
                </label>
                <label className="field-label">
                  Date of birth
                  <span className="input-wrap"><input value={dateOfBirth} onChange={event => setDateOfBirth(event.target.value)} type="date" autoComplete="bday" required /></span>
                </label>
                <label className="field-label">
                  I want to join as
                  <span className="input-wrap">
                    <UsersRound size={18} />
                    <select value={roleChoice} onChange={(event) => setRoleChoice(event.target.value)} aria-label="Choose your roles">
                      <option value="learner">Learner</option>
                      <option value="instructor">Instructor</option>
                      <option value="both">Learner and instructor</option>
                    </select>
                  </span>
                </label>
              </div>
              <label className="field-label">Skills
                <span className="input-wrap"><input value={skills} onChange={event => setSkills(event.target.value)} placeholder="e.g. Python, UI design, public speaking" required /></span>
              </label>
              <label className="field-label">Bio
                <textarea className="auth-bio-input" value={bio} onChange={event => setBio(event.target.value)} rows={3} maxLength={1000} placeholder="Tell the community a little about yourself" required />
              </label>
              </>
            )}
            <label className="field-label">
              University email
              <span className="input-wrap">
                <Mail size={18} />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
            {!isSignup && (
              <label className="remember-option keep-option">
                <input type="checkbox" defaultChecked /> Keep me logged in
              </label>
            )}
            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
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
