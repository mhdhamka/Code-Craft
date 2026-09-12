import { motion } from "motion/react";
import { Play, Loader2 } from "lucide-react";
import { useCodeEditorStore } from "../store/useCodeEditorStore";

export function RunButton() {
  const { runCode, isRunning } = useCodeEditorStore();

  return (
    <motion.button
      id="run-code-button"
      type="button"
      onClick={() => runCode()}
      disabled={isRunning}
      whileHover={isRunning ? undefined : { scale: 1.02 }}
      whileTap={isRunning ? undefined : { scale: 0.98 }}
      className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs text-white shadow-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer overflow-hidden border border-emerald-400/30"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 transition-all" />

      <div className="relative flex items-center gap-2">
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span className="font-semibold tracking-wide">Executing...</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span className="font-semibold tracking-wide">Run Code</span>
          </>
        )}
      </div>
    </motion.button>
  );
}
