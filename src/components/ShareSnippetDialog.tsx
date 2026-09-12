import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useCodeEditorStore } from "../store/useCodeEditorStore";
import { useAppStore } from "../store/useAppStore";
import { LANGUAGE_CONFIG } from "../constants";

interface ShareSnippetDialogProps {
  onClose: () => void;
}

export function ShareSnippetDialog({ onClose }: ShareSnippetDialogProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language, getCode } = useCodeEditorStore();
  const { createSnippet, setActiveView } = useAppStore();

  const currentConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;
  const currentCode = getCode();
  const lineCount = currentCode ? currentCode.split("\n").length : 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide a snippet title");
      return;
    }

    if (!currentCode.trim()) {
      toast.error("Editor code cannot be empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const snippet = createSnippet(title.trim(), language, currentCode);
      toast.success("Snippet shared to community!");

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore if canvas-confetti is restricted
      }

      onClose();
      // Navigate to community snippets
      setActiveView("snippets", snippet._id);
    } catch {
      toast.error("Failed to share snippet");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-[#181825] border border-white/15 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        id="share-snippet-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="text-sm font-bold text-white">Share Code Snippet</h3>
              <p className="text-xs text-gray-400">Publish your solution to the Code Craft community</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snippet Preview Summary */}
        <div className="mb-4 p-3 rounded-xl bg-[#12121a] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1e1e2e] p-1 flex items-center justify-center ring-1 ring-white/10">
              <img
                src={currentConfig.logoPath}
                alt={currentConfig.label}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-200">{currentConfig.label}</span>
              <p className="text-[11px] text-gray-400 font-mono">{lineCount} lines of code</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Public
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="snippet-title" className="block text-xs font-semibold text-gray-300 mb-1.5">
              Snippet Title
            </label>
            <input
              id="snippet-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., QuickSort with In-Place Partitioning"
              className="w-full px-3.5 py-2.5 bg-[#12121a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer border border-blue-400/30"
            >
              <span>{isSubmitting ? "Publishing..." : "Publish Snippet"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
