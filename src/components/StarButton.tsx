import type { MouseEvent } from "react";
import { Star } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import toast from "react-hot-toast";

interface StarButtonProps {
  snippetId: string;
  size?: "sm" | "md";
}

export function StarButton({ snippetId, size = "md" }: StarButtonProps) {
  const { starredSnippetIds, snippets, toggleStarSnippet } = useAppStore();

  const isStarred = starredSnippetIds.includes(snippetId);
  const snippet = snippets.find((s) => s._id === snippetId);
  const count = snippet?.starsCount ?? (isStarred ? 1 : 0);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    toggleStarSnippet(snippetId);
    if (!isStarred) {
      toast.success("Added to Starred Snippets!");
    } else {
      toast("Removed from Starred", { icon: "⭐️" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
        size === "sm" ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs"
      } ${
        isStarred
          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-200"
      }`}
      title={isStarred ? "Unstar snippet" : "Star snippet"}
    >
      <Star
        className={`${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} transition-transform group-hover:scale-110 ${
          isStarred ? "fill-amber-400 text-amber-400" : "text-gray-400 group-hover:text-amber-400"
        }`}
      />
      <span className="font-semibold font-mono">{count}</span>
    </button>
  );
}
