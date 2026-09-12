import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Play,
  Check,
  Search,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { useAppStore } from "../../store/useAppStore";
import { LANGUAGE_CONFIG, THEMES, CHEAT_SHEETS } from "../../constants";
import { StarButton } from "../StarButton";

interface PrimarySidebarProps {
  onOpenShareModal: () => void;
}

export function PrimarySidebar({ onOpenShareModal }: PrimarySidebarProps) {
  const {
    language,
    setLanguage,
    openTabs,
    openTab,
    closeTab,
    sidebarTab,
    runCode,
    isRunning,
    stdin,
    setStdin,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    editor,
  } = useCodeEditorStore();

  const {
    snippets,
    executions,
    setActiveView,
  } = useAppStore();

  // Accordion states for Explorer
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [workspaceFilesExpanded, setWorkspaceFilesExpanded] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const currentLang = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  const handleSelectFile = (langId: string) => {
    openTab(langId);
  };

  const handleLoadSnippet = (code: string, langId: string, title: string) => {
    openTab(langId);
    if (editor) {
      editor.setValue(code);
      localStorage.setItem(`editor-code-${langId}`, code);
    }
    toast.success(`Loaded "${title}" into editor`);
  };

  return (
    <div
      id="vscode-primary-sidebar"
      className="w-64 sm:w-72 bg-[#141419] text-[#cccccc] border-r border-white/10 flex flex-col h-full select-none overflow-hidden flex-shrink-0 backdrop-blur-md"
    >
      {/* Sidebar Header */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-white/10 bg-[#181822] text-[11px] font-bold tracking-wider uppercase text-gray-300">
        <span className="flex items-center gap-2">
          {sidebarTab === "explorer" && "Explorer: Workspace"}
          {sidebarTab === "search" && "Search"}
          {sidebarTab === "snippets" && "Community Snippets"}
          {sidebarTab === "run" && "Run & Debug"}
          {sidebarTab === "reference" && "Cheat Sheets"}
          {sidebarTab === "settings" && "Settings"}
        </span>

        {sidebarTab === "snippets" && (
          <button
            type="button"
            onClick={onOpenShareModal}
            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/20 transition-all cursor-pointer"
            title="Create & Share Snippet"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sidebar Body */}
      <div className="flex-1 overflow-y-auto text-xs custom-scrollbar">
        {/* ===================== EXPLORER TAB ===================== */}
        {sidebarTab === "explorer" && (
          <div className="py-2 space-y-1">
            {/* Section 1: OPEN EDITORS */}
            <div>
              <button
                type="button"
                onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-300 hover:bg-white/5 cursor-pointer transition-colors"
              >
                {openEditorsExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                )}
                <span>OPEN EDITORS</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-gray-400 font-mono ml-auto border border-white/5">
                  {openTabs.length}
                </span>
              </button>

              {openEditorsExpanded && (
                <div className="pl-3 pr-2 space-y-0.5 mt-1">
                  {openTabs.map((tabLangId) => {
                    const conf = LANGUAGE_CONFIG[tabLangId];
                    if (!conf) return null;
                    const isActive = language === tabLangId;

                    return (
                      <div
                        key={tabLangId}
                        onClick={() => setLanguage(tabLangId)}
                        className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer text-xs transition-all ${
                          isActive
                            ? "bg-blue-600/15 text-white font-medium border border-blue-500/30 shadow-sm"
                            : "hover:bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={conf.logoPath}
                            alt=""
                            className="w-3.5 h-3.5 object-contain flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="truncate">{conf.fileName}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(tabLangId);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-opacity"
                          title="Close Tab"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2: WORKSPACE FILES */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setWorkspaceFilesExpanded(!workspaceFilesExpanded)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-300 hover:bg-white/5 cursor-pointer transition-colors"
              >
                {workspaceFilesExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                )}
                <span>SRC FILES</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-gray-400 font-mono ml-auto border border-white/5">
                  11 files
                </span>
              </button>

              {workspaceFilesExpanded && (
                <div className="pl-3 pr-2 space-y-0.5 mt-1">
                  {Object.values(LANGUAGE_CONFIG).map((conf) => {
                    const isCurrent = language === conf.id;

                    return (
                      <div
                        key={conf.id}
                        onClick={() => handleSelectFile(conf.id)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-blue-600/15 text-white font-medium border border-blue-500/30 shadow-sm"
                            : "hover:bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={conf.logoPath}
                            alt=""
                            className="w-3.5 h-3.5 object-contain flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="truncate">{conf.fileName}</span>
                        </div>

                        <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                          {conf.runtime.version.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 3: EXECUTION ENGINE STATUS */}
            <div className="mt-4 pt-3 border-t border-white/10 px-3">
              <div className="p-3 rounded-2xl bg-[#181822] border border-white/10 shadow-inner">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                    Execution Engine
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                    Online
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-white mb-1">Judge0 CE Sandbox</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Free &amp; unlimited sandboxed compilation for 11+ programming languages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SEARCH TAB ===================== */}
        {sidebarTab === "search" && (
          <div className="p-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files and snippets..."
                className="w-full bg-[#181822] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-1">
                Matched Files
              </span>
              {Object.values(LANGUAGE_CONFIG)
                .filter(
                  (c) =>
                    !searchQuery ||
                    c.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((conf) => (
                  <button
                    key={conf.id}
                    type="button"
                    onClick={() => handleSelectFile(conf.id)}
                    className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-xl cursor-pointer text-xs transition-all border border-transparent hover:border-white/5"
                  >
                    <img
                      src={conf.logoPath}
                      alt=""
                      className="w-3.5 h-3.5 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-gray-200 font-medium">{conf.fileName}</span>
                    <span className="text-[10px] text-gray-500 ml-auto font-mono bg-white/5 px-1.5 py-0.5 rounded">
                      {conf.label}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ===================== SNIPPETS TAB ===================== */}
        {sidebarTab === "snippets" && (
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Library ({snippets.length})
              </span>
              <button
                type="button"
                onClick={() => setActiveView("snippets")}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
              >
                Browse Full View
              </button>
            </div>

            <div className="space-y-2.5">
              {snippets.map((snip) => {
                const conf = LANGUAGE_CONFIG[snip.language] || LANGUAGE_CONFIG.javascript;

                return (
                  <div
                    key={snip._id}
                    className="p-3 rounded-2xl bg-[#181822] border border-white/10 hover:border-blue-500/40 transition-all shadow-md group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={conf.logoPath}
                          alt=""
                          className="w-3.5 h-3.5 object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                          {conf.label}
                        </span>
                      </div>
                      <StarButton snippetId={snip._id} size="sm" />
                    </div>

                    <h4 className="text-xs font-semibold text-white leading-snug mb-1.5 line-clamp-1">
                      {snip.title}
                    </h4>
                    <pre className="text-[10px] text-gray-400 mb-3 font-mono line-clamp-2 bg-[#141419] p-2 rounded-xl border border-white/5">
                      {snip.code.slice(0, 80)}...
                    </pre>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] text-gray-500">by {snip.userName}</span>
                      <button
                        type="button"
                        onClick={() => handleLoadSnippet(snip.code, snip.language, snip.title)}
                        className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border border-blue-500/20"
                      >
                        Load to Editor
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== RUN & DEBUG TAB ===================== */}
        {sidebarTab === "run" && (
          <div className="p-3 space-y-4">
            {/* Run Button */}
            <div>
              <button
                type="button"
                onClick={() => runCode()}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-55 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-600/20 border border-emerald-400/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunning ? "Executing..." : `Run ${currentLang.fileName}`}</span>
              </button>
              <p className="text-[10px] text-gray-500 text-center mt-1.5">
                Shortcut: <kbd className="px-1.5 py-0.5 bg-[#181822] border border-white/10 rounded text-gray-300 font-mono">Ctrl+Enter</kbd>
              </p>
            </div>

            {/* Standard Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Standard Input (stdin)
                </span>
                {stdin && (
                  <button
                    type="button"
                    onClick={() => setStdin("")}
                    className="text-[10px] text-gray-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Optional input passed to program..."
                rows={3}
                className="w-full bg-[#181822] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>

            {/* Execution History */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-1">
                Recent Runs ({executions.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {executions.map((rec) => (
                  <div
                    key={rec._id}
                    className="p-2.5 rounded-xl bg-[#181822] border border-white/10 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-200 capitalize">{rec.language}</span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(rec._creationTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                    {rec.error ? (
                      <p className="text-[10px] text-red-400 font-mono truncate bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                        {rec.error}
                      </p>
                    ) : (
                      <p className="text-[10px] text-emerald-400 font-mono truncate bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                        ✓ {rec.output || "Success"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== REFERENCE TAB ===================== */}
        {sidebarTab === "reference" && (
          <div className="p-3 space-y-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-1">
              Language Reference
            </span>

            {CHEAT_SHEETS.map((sheet) => (
              <div
                key={sheet.language}
                className="p-3 rounded-2xl bg-[#181822] border border-white/10 shadow-md space-y-2.5"
              >
                <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {sheet.title}
                </h4>
                <div className="space-y-2">
                  {sheet.tips.map((tip, idx) => (
                    <div key={idx} className="bg-[#141419] p-2.5 rounded-xl border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-gray-300">
                          {tip.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(tip.code);
                            toast.success("Snippet copied");
                          }}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-colors"
                          title="Copy Code"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <pre className="text-[10px] text-blue-300 font-mono whitespace-pre-wrap overflow-x-auto bg-[#181822] p-2 rounded-lg border border-white/5">
                        {tip.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================== SETTINGS TAB ===================== */}
        {sidebarTab === "settings" && (
          <div className="p-3 space-y-4">
            {/* Theme Selector */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-1">
                Color Theme
              </span>
              <div className="space-y-1">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all ${
                      theme === t.id
                        ? "bg-blue-600/20 text-white font-medium border border-blue-500/30 shadow-sm"
                        : "hover:bg-white/5 text-gray-400 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-gray-200">{t.label}</span>
                    </div>
                    {theme === t.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Font Size
                </span>
                <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                  {fontSize}px
                </span>
              </div>
              <div className="px-1">
                <input
                  type="range"
                  min="12"
                  max="22"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-gray-700 rounded-lg cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}