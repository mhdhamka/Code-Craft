import { Blocks, Github, Heart } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export function Footer() {
  const { setActiveView, setIsCheatSheetOpen } = useAppStore();

  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0f] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Blocks className="w-4 h-4" />
            </div>
            <span>
              <strong className="text-gray-200">Code Craft</strong> — Engineered with precision for modern developers.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => setActiveView("editor")}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveView("snippets")}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              Snippets
            </button>
            <button
              type="button"
              onClick={() => setIsCheatSheetOpen(true)}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              Cheat Sheets
            </button>
            <button
              type="button"
              onClick={() => setActiveView("profile")}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              Developer Profile
            </button>

            <a
              href="https://github.com/mhdhamka/Code-Craft"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span>Code Execution API: Connected</span>
          </div>
          <div>
            <span>Inspired by Visual Studio Code &amp; Monaco Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
