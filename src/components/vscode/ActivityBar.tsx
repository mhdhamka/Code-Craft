import {
  Files,
  Search,
  Code2,
  PlaySquare,
  BookOpen,
  User,
  Settings,
} from "lucide-react";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { useAppStore } from "../../store/useAppStore";

export function ActivityBar() {
  const {
    sidebarTab,
    setSidebarTab,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useCodeEditorStore();

  const { snippets, setActiveView, activeView } = useAppStore();

  const handleTabClick = (tab: typeof sidebarTab) => {
    // If not in editor view, switch to editor view
    if (activeView !== "editor") {
      setActiveView("editor");
    }

    if (sidebarTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setSidebarTab(tab);
      setIsSidebarOpen(true);
    }
  };

  const topItems = [
    {
      id: "explorer" as const,
      label: "Explorer (Ctrl+Shift+E)",
      icon: Files,
    },
    {
      id: "search" as const,
      label: "Search (Ctrl+Shift+F)",
      icon: Search,
    },
    {
      id: "snippets" as const,
      label: "Community Snippets",
      icon: Code2,
      badge: snippets.length,
    },
    {
      id: "run" as const,
      label: "Run & Sandbox",
      icon: PlaySquare,
    },
    {
      id: "reference" as const,
      label: "Cheat Sheets & Docs",
      icon: BookOpen,
    },
  ];

  return (
    <aside
      id="vscode-activity-bar"
      className="w-12 bg-[#181818] border-r border-[#2d2d2d] flex flex-col justify-between items-center py-1 select-none z-20 flex-shrink-0"
    >
      {/* Top Activity Icons */}
      <div className="flex flex-col items-center w-full gap-1">
        {topItems.map((item) => {
          const isActive = isSidebarOpen && sidebarTab === item.id && activeView === "editor";
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`relative w-full h-12 flex items-center justify-center transition-colors cursor-pointer group ${
                isActive
                  ? "text-white"
                  : "text-[#858585] hover:text-[#d7d7d7]"
              }`}
              title={item.label}
            >
              {/* Active left border indicator */}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#007acc]" />
              )}

              <Icon className="w-5 h-5 stroke-[1.5]" />

              {/* Optional badge */}
              {item.badge !== undefined && (
                <span className="absolute top-2 right-1.5 min-w-[14px] h-[14px] bg-[#007acc] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on hover */}
              <span className="fixed left-14 px-2 py-1 bg-[#252526] text-white text-[11px] rounded shadow-lg border border-[#3c3c3c] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Icons: Profile & Settings */}
      <div className="flex flex-col items-center w-full gap-1 pb-1">
        {/* Profile */}
        <button
          type="button"
          onClick={() => {
            if (activeView === "profile") {
              setActiveView("editor");
            } else {
              setActiveView("profile");
            }
          }}
          className={`relative w-full h-12 flex items-center justify-center transition-colors cursor-pointer group ${
            activeView === "profile" ? "text-white" : "text-[#858585] hover:text-[#d7d7d7]"
          }`}
          title="Accounts & Profile"
        >
          {activeView === "profile" && (
            <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#007acc]" />
          )}
          <User className="w-5 h-5 stroke-[1.5]" />
          <span className="fixed left-14 px-2 py-1 bg-[#252526] text-white text-[11px] rounded shadow-lg border border-[#3c3c3c] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Accounts &amp; Stats
          </span>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={() => handleTabClick("settings")}
          className={`relative w-full h-12 flex items-center justify-center transition-colors cursor-pointer group ${
            isSidebarOpen && sidebarTab === "settings" && activeView === "editor"
              ? "text-white"
              : "text-[#858585] hover:text-[#d7d7d7]"
          }`}
          title="Manage Settings & Themes"
        >
          {isSidebarOpen && sidebarTab === "settings" && activeView === "editor" && (
            <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#007acc]" />
          )}
          <Settings className="w-5 h-5 stroke-[1.5]" />
          <span className="fixed left-14 px-2 py-1 bg-[#252526] text-white text-[11px] rounded shadow-lg border border-[#3c3c3c] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Settings &amp; Themes
          </span>
        </button>
      </div>
    </aside>
  );
}
