import { Blocks, Code, Code2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeSelector } from "./ThemeSelector";
import { RunButton } from "./RunButton";

export function NavigationHeader() {
  const {
    activeView,
    setActiveView,
    setIsCheatSheetOpen,
    currentUser,
  } = useAppStore();

  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0d0d14]/90 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              type="button"
              onClick={() => setActiveView("editor")}
              className="flex items-center gap-3 group text-left cursor-pointer"
              id="brand-logo-btn"
            >
              <div className="relative bg-gradient-to-br from-blue-600/30 to-purple-600/20 p-2 rounded-xl ring-1 ring-white/15 group-hover:ring-blue-400/40 transition-all shadow-inner">
                <Blocks className="w-5 h-5 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <div>
                <span className="block text-base font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 text-transparent bg-clip-text">
                  Code Craft
                </span>
                <span className="block text-[10px] text-blue-400/70 font-medium tracking-wide">
                  Where Ideas Meet Precision
                </span>
              </div>
            </button>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1.5" id="nav-primary-links">
              <button
                type="button"
                onClick={() => setActiveView("editor")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === "editor"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("snippets")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeView === "snippets" || activeView === "snippet-detail"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Community Snippets</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCheatSheetOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all cursor-pointer border border-transparent"
              >
                <span>Cheat Sheets</span>
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeView === "editor" && (
              <>
                <div className="hidden sm:block">
                  <ThemeSelector />
                </div>
                <LanguageSelector />
                <RunButton />
              </>
            )}

            {/* Profile Avatar Button */}
            <button
              type="button"
              onClick={() => setActiveView("profile")}
              className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer ${
                activeView === "profile"
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
              id="profile-nav-btn"
              title="View Profile & Stats"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-white/20"
                referrerPolicy="no-referrer"
              />
              <span className="hidden lg:inline text-xs font-medium text-gray-200 pr-1">
                {currentUser.name}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
