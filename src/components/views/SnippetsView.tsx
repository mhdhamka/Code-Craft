import { useState, type MouseEvent } from "react";
import { Search, Grid, List, Plus, Code2, ArrowUpRight, Copy, Check, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../../constants";
import { StarButton } from "../StarButton";

export function SnippetsView() {
  const { snippets, comments, setActiveView } = useAppStore();
  const { setLanguage, editor } = useCodeEditorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique languages present in snippets
  const languages = Array.from(new Set(snippets.map((s) => s.language)));

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const handleCopyCode = async (e: MouseEvent, snippetId: string, code: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(snippetId);
      toast.success("Snippet copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleRunInEditor = (e: MouseEvent, snippet: typeof snippets[0]) => {
    e.stopPropagation();
    setLanguage(snippet.language);
    if (editor) {
      editor.setValue(snippet.code);
    }
    localStorage.setItem(`editor-code-${snippet.language}`, snippet.code);
    setActiveView("editor");
    toast.success(`Loaded "${snippet.title}" into Editor`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1" id="snippets-view-screen">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          <Code2 className="w-3.5 h-3.5" />
          <span>Explore &amp; Learn</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Community Code Snippets
        </h1>
        <p className="text-sm text-gray-400">
          Discover algorithms, data structures, and production-ready snippets shared by developers worldwide.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#12121a] p-4 rounded-2xl border border-white/10 shadow-lg">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets by title, language, or author..."
            className="w-full pl-10 pr-4 py-2 bg-[#181824] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* View mode toggle & Create action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center p-1 bg-[#181824] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-blue-600/30 text-blue-400" : "text-gray-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-blue-600/30 text-blue-400" : "text-gray-400 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveView("editor")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer border border-blue-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Snippet</span>
          </button>
        </div>
      </div>

      {/* Language filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedLanguage(null)}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            selectedLanguage === null
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-[#181824] text-gray-400 hover:text-white border border-white/10"
          }`}
        >
          All Languages ({snippets.length})
        </button>

        {languages.map((lang) => {
          const config = LANGUAGE_CONFIG[lang];
          const count = snippets.filter((s) => s.language === lang).length;
          const isSelected = selectedLanguage === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLanguage(isSelected ? null : lang)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-[#181824] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {config && (
                <img
                  src={config.logoPath}
                  alt={config.label}
                  className="w-3.5 h-3.5 object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              <span>{config?.label || lang}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Snippets Grid / List */}
      {filteredSnippets.length === 0 ? (
        <div className="p-12 text-center bg-[#12121a] rounded-2xl border border-white/10">
          <Code2 className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-200 mb-1">No snippets found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query or language filter, or share a new snippet from the Editor.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedLanguage(null);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSnippets.map((snippet) => {
            const config = LANGUAGE_CONFIG[snippet.language] || LANGUAGE_CONFIG.javascript;
            const snippetComments = comments[snippet._id] || [];
            const isCopied = copiedId === snippet._id;

            return (
              <div
                key={snippet._id}
                onClick={() => setActiveView("snippet-detail", snippet._id)}
                className="group flex flex-col bg-[#12121a] hover:bg-[#161622] border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg transition-all duration-200 cursor-pointer"
              >
                {/* Header: author & badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={snippet.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                      alt={snippet.userName}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-gray-200 truncate">
                        {snippet.userName}
                      </span>
                      <span className="block text-[10px] text-gray-500">
                        {new Date(snippet._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#1a1a28] border border-white/10">
                      <img
                        src={config.logoPath}
                        alt={config.label}
                        className="w-3.5 h-3.5 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[11px] font-mono text-gray-300">{config.label}</span>
                    </div>
                    <StarButton snippetId={snippet._id} size="sm" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                  {snippet.title}
                </h3>

                {/* Code Preview Box */}
                <div className="relative mb-4 flex-1">
                  <pre className="p-3 rounded-xl bg-[#0a0a0f] text-gray-400 font-mono text-[11px] h-32 overflow-hidden border border-white/5 leading-relaxed">
                    {snippet.code.slice(0, 300)}
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a0a0f] to-transparent rounded-b-xl" />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-1 text-gray-400">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[11px]">{snippetComments.length} comments</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(e, snippet._id, snippet.code)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Copy Code"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleRunInEditor(e, snippet)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                      title="Load and run in Monaco Editor"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      <span>Run</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredSnippets.map((snippet) => {
            const config = LANGUAGE_CONFIG[snippet.language] || LANGUAGE_CONFIG.javascript;
            const snippetComments = comments[snippet._id] || [];
            const isCopied = copiedId === snippet._id;

            return (
              <div
                key={snippet._id}
                onClick={() => setActiveView("snippet-detail", snippet._id)}
                className="group flex items-center justify-between gap-4 bg-[#12121a] hover:bg-[#161622] border border-white/10 hover:border-blue-500/40 rounded-xl p-4 shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#1a1a28] p-1.5 flex items-center justify-center ring-1 ring-white/10 flex-shrink-0">
                    <img
                      src={config.logoPath}
                      alt={config.label}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {snippet.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span>by {snippet.userName}</span>
                      <span>•</span>
                      <span>{new Date(snippet._creationTime).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{snippetComments.length} comments</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <StarButton snippetId={snippet._id} size="sm" />
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(e, snippet._id, snippet.code)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRunInEditor(e, snippet)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Run in Editor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
