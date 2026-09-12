import { useState, type FormEvent } from "react";
import { ArrowLeft, Play, Copy, Check, MessageSquare, Trash2, Send, Share2, Code } from "lucide-react";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../../constants";
import { StarButton } from "../StarButton";

export function SnippetDetailView() {
  const {
    selectedSnippetId,
    snippets,
    comments,
    currentUser,
    setActiveView,
    addComment,
    deleteComment,
  } = useAppStore();

  const { setLanguage, editor } = useCodeEditorStore();
  const [newComment, setNewComment] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const snippet = snippets.find((s) => s._id === selectedSnippetId);

  if (!snippet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Snippet not found</h2>
        <p className="text-xs text-gray-400 mb-6">The snippet you are looking for does not exist or was deleted.</p>
        <button
          type="button"
          onClick={() => setActiveView("snippets")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
        >
          Back to Snippets
        </button>
      </div>
    );
  }

  const config = LANGUAGE_CONFIG[snippet.language] || LANGUAGE_CONFIG.javascript;
  const snippetComments = comments[snippet._id] || [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setIsCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleRunInEditor = () => {
    setLanguage(snippet.language);
    if (editor) {
      editor.setValue(snippet.code);
    }
    localStorage.setItem(`editor-code-${snippet.language}`, snippet.code);
    setActiveView("editor");
    toast.success(`Loaded "${snippet.title}" into Editor`);
  };

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(snippet._id, newComment.trim());
    setNewComment("");
    toast.success("Comment posted");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1" id="snippet-detail-screen">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setActiveView("snippets")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-6 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Community Snippets</span>
      </button>

      {/* Snippet Header */}
      <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#1e1e2e] p-1.5 flex items-center justify-center ring-1 ring-white/10">
                <img
                  src={config.logoPath}
                  alt={config.label}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {config.label}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {snippet.code.split("\n").length} lines
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              {snippet.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <img
                src={snippet.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={snippet.userName}
                className="w-5 h-5 rounded-md object-cover ring-1 ring-white/10"
                referrerPolicy="no-referrer"
              />
              <span className="text-gray-200 font-medium">{snippet.userName}</span>
              <span>•</span>
              <span>Published {new Date(snippet._creationTime).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <StarButton snippetId={snippet._id} size="md" />

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/10 text-xs font-semibold transition-all cursor-pointer"
              title="Copy Code"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRunInEditor}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer border border-blue-400/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run in Editor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Display with line numbers */}
      <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#181824] border-b border-white/10 text-xs text-gray-400 font-mono">
          <span>{snippet.title}.{snippet.language === "python" ? "py" : snippet.language === "rust" ? "rs" : snippet.language === "go" ? "go" : "js"}</span>
          <span>UTF-8</span>
        </div>

        <div className="p-4 bg-[#0d0d14] overflow-x-auto text-xs font-mono">
          <table className="w-full border-collapse">
            <tbody>
              {snippet.code.split("\n").map((line, index) => (
                <tr key={index} className="hover:bg-white/[0.02]">
                  <td className="w-12 select-none text-right pr-4 text-gray-600 font-mono text-[11px] align-top">
                    {index + 1}
                  </td>
                  <td className="text-gray-200 whitespace-pre font-mono leading-relaxed pl-2">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/10">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">
            Discussion ({snippetComments.length})
          </h3>
        </div>

        {/* Add comment form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/15 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts, suggestions, or optimization ideas..."
                rows={3}
                className="w-full p-3.5 bg-[#181824] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {snippetComments.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">
              No comments yet. Start the conversation!
            </p>
          ) : (
            snippetComments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start gap-3 p-4 bg-[#181824] rounded-xl border border-white/5"
              >
                <img
                  src={comment.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={comment.userName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-200">
                      {comment.userName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">
                        {new Date(comment._creationTime).toLocaleDateString()}
                      </span>
                      {comment.userId === currentUser.id && (
                        <button
                          type="button"
                          onClick={() => deleteComment(snippet._id, comment._id)}
                          className="text-gray-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
