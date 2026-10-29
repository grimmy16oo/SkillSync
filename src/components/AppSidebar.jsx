import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  LogOut,
  GraduationCap,
  Inbox,
  Layers3,
  Menu,
  UsersRound,
  UserRound,
  X,
} from "lucide-react";

function AppSidebar({ page, onNavigate, onLogout, user, collapsed, onToggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);
  const navigate = (destination) => {
    setMobileOpen(false);
    onNavigate(destination);
  };
  const links = [
    ["discover", "Discover", Compass],
    ["learning", "My Learning", BookOpen],
    ["teaching", "My Teaching", GraduationCap],
    ["requests", "Requests", Inbox],
    ["classroom", "Classrooms", UsersRound],
    ["profile", "Profile", UserRound],
  ];
  return (
    <aside
      className={`app-sidebar ${mobileOpen ? "mobile-open" : ""} ${collapsed ? "collapsed" : ""}`}
      aria-label="Main navigation"
    >
      <div className="sidebar-brand-row">
        <button
          className="app-sidebar-brand"
          onClick={() => navigate("home")}
          aria-label="SkillSync home"
        >
          <span>
            <Layers3 size={21} strokeWidth={1.8} />
          </span>
          <strong>SkillSync</strong>
        </button>
      </div>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={
          mobileOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={23} /> : <Menu size={23} />}
      </button>
      <nav>
        {links.map(([key, label, Icon, count]) => (
          <button
            key={key}
            data-tooltip={label}
            aria-label={collapsed ? label : undefined}
            className={`app-sidebar-link ${page === key ? "active" : ""}`}
            aria-current={page === key ? "page" : undefined}
            onClick={() => navigate(key)}
          >
            <Icon size={20} />
            <span>{label}</span>
            {count && <b>{count}</b>}
          </button>
        ))}
        {user && (
          <button
            className="app-sidebar-link sidebar-logout"
            type="button"
            data-tooltip="Log out"
            aria-label={collapsed ? "Log out" : undefined}
            onClick={onLogout}
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        )}
      </nav>
      <button
        className="sidebar-collapse-toggle"
        type="button"
        onClick={onToggleCollapse}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        <span>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
      </button>
    </aside>
  );
}

export default AppSidebar;
