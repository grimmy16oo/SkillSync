import { useState } from "react";
import AppSidebar from "../components/AppSidebar.jsx";

function AppLayout({ page, onNavigate, onLogout, user, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.localStorage.getItem("skillsync-sidebar-collapsed") === "true",
  );
  const toggleSidebar = () =>
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("skillsync-sidebar-collapsed", String(next));
      return next;
    });
  const layoutClasses = [
    "app-layout grid min-h-screen grid-cols-1 items-start gap-4 p-3 [min-height:100svh]",
    "min-[1101px]:gap-8 min-[1101px]:[padding:18px_20px_18px_9px]",
    "max-[760px]:gap-3 max-[760px]:p-[9px]",
    "max-[560px]:gap-2.5 max-[560px]:p-[7px]",
    sidebarCollapsed
      ? "sidebar-collapsed min-[1101px]:grid-cols-[82px_minmax(0,1fr)]"
      : "min-[1101px]:grid-cols-[276px_minmax(0,1fr)]",
  ].join(" ");

  return (
    <div className={layoutClasses}>
      <AppSidebar
        page={page}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onNavigate={onNavigate}
        onLogout={onLogout}
        user={user}
      />
      <div className="app-main min-w-0">{children}</div>
    </div>
  );
}

export default AppLayout;
