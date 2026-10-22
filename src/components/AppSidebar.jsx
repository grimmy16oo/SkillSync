import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  GraduationCap,
  Home,
  Inbox,
  Layers3,
  Menu,
  Settings,
  UsersRound,
  UserRound,
  X,
} from "lucide-react";

function AppSidebar({ page, onNavigate, collapsed, onToggleCollapse }) {
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
    ["home", "Home", Home],
    ["discover", "Discover", Compass],
    ["learning", "My Learning", BookOpen],
    ["teaching", "My Teaching", GraduationCap],
    ["requests", "Requests", Inbox],
    ["classroom", "Classrooms", UsersRound],
    ["notifications", "Notifications", Bell],
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
        <button
          data-tooltip="Settings"
          aria-label={collapsed ? "Settings" : undefined}
          className={`app-sidebar-link settings-link ${page === "settings" ? "active" : ""}`}
          aria-current={page === "settings" ? "page" : undefined}
          onClick={() => navigate("settings")}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
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
