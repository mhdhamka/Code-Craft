import { useState } from "react";
import { Star, Code2, ArrowUpRight, CheckCircle, AlertTriangle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../../constants";
import { StarButton } from "../StarButton";

export function ProfileView() {
  const {
    currentUser,
    executions,
    snippets,
    starredSnippetIds,
    getUserStats,
    setActiveView,
  } = useAppStore();

  const { setLanguage, editor } = useCodeEditorStore();
  const [activeTab, setActiveTab] = useState<"executions" | "starred">("executions");
  const [expandedExecId, setExpandedExecId] = useState<string | null>(null);

  const stats = getUserStats();
  const starredSnippets = snippets.filter((s) => starredSnippetIds.includes(s._id));

  const handleRunExecution = (exec: typeof executions[0]) => {
    setLanguage(exec.language);
    if (editor) {
      editor.setValue(exec.code);
    }
    localStorage.setItem(`editor-code-${exec.language}`, exec.code);
    setActiveView("editor");
    toast.success(`Loaded ${exec.language} execution into Editor`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1" id="profile-view-screen">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-[#12121a] via-[#151522] to-[#0d0d14] border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-300" />
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="relative w-18 h-18 rounded-2xl object-cover ring-2 ring-white/20 shadow-xl bg-[#1a1a24]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5 shadow-inner">
                  Active Developer
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveView("editor")}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Code2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Open VS Code Editor</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="group p-4 bg-[#181824]/80 hover:bg-[#1c1c2b] rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-200 shadow-lg">
            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Total Executions
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {stats.totalExecutions}
              </span>
            </div>
          </div>

          <div className="group p-4 bg-[#181824]/80 hover:bg-[#1c1c2b] rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-200 shadow-lg">
            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Languages Used
            </span>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {stats.languagesCount}
              </span>
            </div>
          </div>

          <div className="group p-4 bg-[#181824]/80 hover:bg-[#1c1c2b] rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-200 shadow-lg">
            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Fav Language
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white capitalize truncate">
                {stats.favoriteLanguage}
              </span>
            </div>
          </div>

          <div className="group p-4 bg-[#181824]/80 hover:bg-[#1c1c2b] rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-200 shadow-lg">
            <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Starred Snippets
            </span>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {starredSnippets.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("executions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
            activeTab === "executions"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-blue-500/10"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Execution History</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono">
            {executions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("starred")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
            activeTab === "starred"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-blue-500/10"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Starred Snippets</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono">
            {starredSnippets.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "executions" ? (
        <div className="space-y-3">
          {executions.length === 0 ? (
            <div className="p-16 text-center bg-[#12121a] rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-1">No code executions logged yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                Run code inside the IDE to see your execution logs, outputs, and status history stored here.
              </p>
              <button
                type="button"
                onClick={() => setActiveView("editor")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
              >
                Go to Editor &amp; Run Code
              </button>
            </div>
          ) : (
            executions.map((exec) => {
              const config = LANGUAGE_CONFIG[exec.language] || LANGUAGE_CONFIG.javascript;
              const isExpanded = expandedExecId === exec._id;
              const hasError = Boolean(exec.error);

              return (
                <div
                  key={exec._id}
                  className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-md group"
                >
                  <div
                    onClick={() => setExpandedExecId(isExpanded ? null : exec._id)}
                    className="flex items-center justify-between p-4 sm:p-5 cursor-pointer bg-gradient-to-r hover:from-white/[0.02] hover:to-transparent transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1a1a28] p-2 flex items-center justify-center ring-1 ring-white/10 flex-shrink-0 shadow-inner">
                        <img
                          src={config.logoPath}
                          alt={config.label}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-bold text-white capitalize tracking-wide">
                            {config.label} Execution
                          </span>
                          {hasError ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-900/40 font-medium">
                              <AlertTriangle className="w-3 h-3" />
                              Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-900/40 font-medium">
                              <CheckCircle className="w-3 h-3" />
                              Success
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 font-mono mt-0.5 block">
                          {new Date(exec._creationTime).toLocaleTimeString()} • {new Date(exec._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunExecution(exec);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs font-semibold transition-all cursor-pointer border border-blue-500/20 shadow-sm active:scale-95"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Load in Editor</span>
                      </button>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-90 text-blue-400" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-[#0d0d14] border-t border-white/5 space-y-4 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1.5 font-semibold">
                          Code Snapshot
                        </span>
                        <pre className="p-3.5 bg-[#13131d] rounded-xl text-gray-300 border border-white/5 whitespace-pre-wrap overflow-x-auto shadow-inner">
                          {exec.code}
                        </pre>
                      </div>

                      {exec.output && (
                        <div>
                          <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1.5 font-semibold">
                            Output Log
                          </span>
                          <pre className="p-3.5 bg-[#101915] rounded-xl text-emerald-300 border border-emerald-900/40 whitespace-pre-wrap shadow-inner">
                            {exec.output}
                          </pre>
                        </div>
                      )}

                      {exec.error && (
                        <div>
                          <span className="text-[10px] text-red-400 uppercase tracking-widest block mb-1.5 font-semibold">
                            Error Log
                          </span>
                          <pre className="p-3.5 bg-[#191010] rounded-xl text-red-300 border border-red-900/40 whitespace-pre-wrap shadow-inner">
                            {exec.error}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Starred Snippets Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {starredSnippets.length === 0 ? (
            <div className="col-span-full p-16 text-center bg-[#12121a] rounded-3xl border border-white/10 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Star className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">No snippets starred yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                Explore the community hub and star your favorite code snippets for quick access anytime.
              </p>
              <button
                type="button"
                onClick={() => setActiveView("snippets")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
              >
                Browse Community Snippets
              </button>
            </div>
          ) : (
            starredSnippets.map((snippet) => {
              const config = LANGUAGE_CONFIG[snippet.language] || LANGUAGE_CONFIG.javascript;
              return (
                <div
                  key={snippet._id}
                  onClick={() => setActiveView("snippet-detail", snippet._id)}
                  className="group bg-[#12121a] hover:bg-[#161622] border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1a1a28] p-1.5 flex items-center justify-center ring-1 ring-white/10 shadow-inner">
                          <img
                            src={config.logoPath}
                            alt={config.label}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-300">{config.label}</span>
                      </div>
                      <StarButton snippetId={snippet._id} size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {snippet.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-gray-400">
                    <span className="truncate">by {snippet.userName}</span>
                    <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      View Details →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}