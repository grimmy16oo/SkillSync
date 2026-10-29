import { useState } from "react";
import {
  Check,
  Compass,
  Inbox,
  Layers3,
  Plus,
  Hourglass,
  X,
} from "lucide-react";
import { getUserInitials } from "../app/userProfile.js";
function RequestsPage({
  onHome,
  onDiscover,
  onLearning,
  onTeaching,
  onNotifications,
  onProfile,
  onOffer,
  sentRequests,
  requestBuckets,
  onUpdateRequest,
  userName,
}) {
  const { received, accepted, declined } = requestBuckets;
  const [activeTab, setActiveTab] = useState("Received");
  const [newestFirst, setNewestFirst] = useState(true);
  const [toast, setToast] = useState("");
  const entries = {
    Received: received,
    Accepted: accepted,
    Declined: declined,
  }[activeTab];
  const sortedEntries = newestFirst ? entries : [...entries].reverse();
  const updateRequest = (request, accept) => {
    onUpdateRequest(request, accept);
    setToast(
      `${request.name}’s request was ${accept ? "accepted" : "declined"}.`,
    );
  };
  return (
    <main className="requests-page">
      <header className="discover-top request-topnav">
        <button className="discover-brand" onClick={onHome}>
          <span className="brand-mark">
            <Layers3 size={21} />
          </span>
          <span>SkillSync</span>
        </button>
        <nav className="discover-nav" aria-label="Main navigation">
          <button onClick={onHome}>Home</button>
          <button onClick={onDiscover}>Discover</button>
          <button onClick={onLearning}>My Learning</button>
          <button onClick={onTeaching}>My Teaching</button>
          <a className="current" href="#requests-title" aria-current="page">
            Requests
          </a>
          <button onClick={onNotifications}>Notifications</button>
        </nav>
        <div className="discover-nav-actions">
          <button className="offer-top" onClick={onOffer}>
            <Plus size={17} /> Offer a Skill
          </button>
          <button
            className="nav-avatar"
            aria-label="Open profile"
            onClick={onProfile}
          >
            {getUserInitials(userName)}
          </button>
        </div>
      </header>
      <section className="requests-content">
        <header className="requests-heading">
          <h1 id="requests-title">Requests</h1>
          <p>
            People who want to learn from you, and courses you've asked to join.
          </p>
        </header>
        {toast && (
          <div className="requests-toast" role="status">
            {toast}
            <button onClick={() => setToast("")} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )}
        <section className="request-stats">
          <article>
            <span>WAITING ON YOU</span>
            <strong>{received.length}</strong>
            <small>
              across {new Set(received.map((request) => request.course)).size}{" "}
              courses
            </small>
          </article>
          <article>
            <span>YOU'VE SENT</span>
            <strong>{sentRequests.length}</strong>
            <small>
              {
                sentRequests.filter((request) => request.status === "Pending")
                  .length
              }{" "}
              still pending
            </small>
          </article>
          <article>
            <span>ACCEPTED</span>
            <strong>{11 + Math.max(0, accepted.length - 1)}</strong>
            <small>this semester</small>
          </article>
          <article>
            <span>AVG. RESPONSE</span>
            <strong>6h</strong>
            <small>Learners love fast replies</small>
          </article>
        </section>
        <div className="request-columns">
          <section className="received-column">
            <div className="request-list-heading">
              <div
                className="request-tabs"
                role="tablist"
                aria-label="Filter received requests"
              >
                {["Received", "Accepted", "Declined"].map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    className={activeTab === tab ? "active" : ""}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    {tab === "Received" ? ` · ${received.length}` : ""}
                  </button>
                ))}
              </div>
              <button
                className="sort-requests"
                onClick={() => setNewestFirst((value) => !value)}
              >
                <span>☷</span>
                {newestFirst ? "Newest first" : "Oldest first"}
              </button>
            </div>
            <div className="received-list">
              {sortedEntries.length ? (
                sortedEntries.map((request) => (
                  <article
                    className={`received-request tone-${request.tone}`}
                    key={request.id}
                  >
                    <span className="received-avatar">{request.initials}</span>
                    <div className="received-copy">
                      <div className="received-person">
                        <strong>{request.name}</strong>
                        <span>{request.course}</span>
                      </div>
                      <small>{request.meta}</small>
                      {request.message && <p>“{request.message}”</p>}
                    </div>
                    {activeTab === "Received" && (
                      <div className="request-actions">
                        <button
                          className="decline-action"
                          onClick={() => updateRequest(request, false)}
                        >
                          Decline
                        </button>
                        <button
                          className="accept-action"
                          onClick={() => updateRequest(request, true)}
                        >
                          <Check size={17} /> Accept
                        </button>
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div className="empty-requests">
                  <Inbox size={25} />
                  <h2>No {activeTab.toLowerCase()} requests</h2>
                  <p>New learner requests will show up here.</p>
                </div>
              )}
            </div>
          </section>
          <aside className="sent-column">
            <h2>Sent by you</h2>
            <div className="sent-list">
              {sentRequests.map((request) => {
                const Icon = request.icon;
                return (
                  <article
                    className={`sent-request tone-${request.tone}`}
                    key={request.title}
                  >
                    <span className="sent-icon">
                      <Icon size={21} />
                    </span>
                    <span className="sent-copy">
                      <strong>{request.title}</strong>
                      <small>
                        {request.teacher} · {request.meta}
                      </small>
                    </span>
                    <b
                      className={`sent-status status-${request.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {request.status === "Pending" && <Hourglass size={14} />}
                      {request.status}
                    </b>
                  </article>
                );
              })}
            </div>
            <div className="request-discover-cta">
              <h3>Looking for something else?</h3>
              <button onClick={onDiscover}>
                <Compass size={16} fill="currentColor" /> Discover courses
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default RequestsPage;
