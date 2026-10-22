import { useState } from "react";
import { ArrowLeft, Bell, CheckCheck, Star, X } from "lucide-react";

function NotificationsPage({
  onBack,
  onAcceptRequest,
  notifications,
  setNotifications,
  preferences,
  setPreferences,
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [message, setMessage] = useState("");
  const unreadCount = notifications.filter((item) => item.unread).length;
  const visibleNotifications = notifications.filter(
    (item) =>
      activeFilter === "All" ||
      (activeFilter === "Unread" ? item.unread : item.type === activeFilter),
  );
  const groups = ["Today", "Yesterday", "This week"];
  const markRead = (id) =>
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    );
  const markAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false })),
    );
    setMessage("All notifications are marked as read.");
  };
  return (
    <main className="notifications-page">
      <section className="notifications-main">
        <div className="notifications-title-row">
          <div>
            <button className="notifications-back" onClick={onBack}>
              <ArrowLeft size={16} /> Back to app
            </button>
            <h1>Notifications</h1>
          </div>
          <button className="mark-read-button" onClick={markAllRead}>
            <CheckCheck size={17} /> Mark all as read
          </button>
        </div>
        {message && (
          <div className="notification-toast" role="status">
            {message}
            <button onClick={() => setMessage("")} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )}
        <div
          className="notification-filters"
          role="tablist"
          aria-label="Filter notifications"
        >
          {["All", "Unread", "Requests", "Meetings", "Courses"].map(
            (filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={activeFilter === filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {filter === "Unread" ? ` · ${unreadCount}` : ""}
              </button>
            ),
          )}
        </div>
        <div className="notification-groups">
          {groups.map((group) => {
            const groupItems = visibleNotifications.filter(
              (item) => item.group === group,
            );
            if (!groupItems.length) return null;
            return (
              <section className="notification-group" key={group}>
                <h2>{group.toUpperCase()}</h2>
                <div>
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article
                        className={`notification-item ${item.unread ? "unread" : ""} tone-${item.tone}`}
                        key={item.id}
                        onClick={() => markRead(item.id)}
                      >
                        <span className="unread-dot" aria-hidden="true" />
                        <span className="notification-icon">
                          {item.initials || (
                            <Icon
                              size={19}
                              fill={
                                item.type === "Courses" && item.icon === Star
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          )}
                        </span>
                        <p>{item.message}</p>
                        {item.action && item.unread && (
                          <button
                            className="notification-accept"
                            onClick={(event) => {
                              event.stopPropagation();
                              onAcceptRequest?.(item.requestId);
                              markRead(item.id);
                              setMessage("Request accepted.");
                            }}
                          >
                            {item.action}
                          </button>
                        )}
                        <time>{item.time}</time>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {visibleNotifications.length === 0 && (
            <div className="notifications-empty">
              <Bell size={25} />
              <h2>You're all caught up</h2>
              <p>No notifications in this filter.</p>
            </div>
          )}
        </div>
      </section>
      <aside className="notification-aside">
        <article className="weekly-updates">
          <span>THIS WEEK</span>
          <strong>12</strong>
          <small>updates across 4 classrooms</small>
        </article>
        <section className="notification-preferences">
          <h2>Notify me about</h2>
          {Object.entries(preferences).map(([label, enabled]) => (
            <label key={label}>
              <span>
                {label === "Requests"
                  ? "Join requests"
                  : label === "Courses"
                    ? "New materials"
                    : label}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                className={`toggle-switch ${enabled ? "enabled" : ""}`}
                onClick={() =>
                  setPreferences((current) => ({
                    ...current,
                    [label]: !current[label],
                  }))
                }
              >
                <i />
              </button>
            </label>
          ))}
        </section>
      </aside>
    </main>
  );
}

export default NotificationsPage;
