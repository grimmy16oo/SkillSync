import { ArrowRight, Layers3 } from "lucide-react";

function Hero({ onAuth }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <header className="brand">
        <span className="brand-mark">
          <Layers3 size={23} strokeWidth={1.8} />
        </span>
        <span>SkillSync</span>
      </header>
      <svg
        className="wordmark"
        viewBox="0 0 1600 230"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden="true"
      >
        <text x="50%" y="78%" textAnchor="middle">
          SKILLSYNC
        </text>
      </svg>
      <div className="hero-card">
        <div className="hero-copy">
          <h1 className="hero-title" id="hero-title">
            Expand your skillset through give and take
          </h1>
          <p>
            SkillSync is an expertise sharing platform that lets you take and
            offer courses for free.
          </p>
          <div className="hero-actions">
            <button
              className="action join-left"
              onClick={() => onAuth("login")}
            >
              Login
              <ArrowRight aria-hidden="true" size={17} />
            </button>
            <button
              className="action join-right"
              onClick={() => onAuth("signup")}
            >
              Sign up
              <ArrowRight aria-hidden="true" size={17} />
            </button>
          </div>
        </div>
      </div>
      <span className="card-handle" aria-hidden="true" />
    </section>
  );
}

export default Hero;
