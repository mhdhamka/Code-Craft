import { useState } from "react";
import { Terminal, Copy, Check, AlertTriangle, CheckCircle, Clock, Loader2, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useCodeEditorStore } from "../store/useCodeEditorStore";

export function OutputPanel() {
  const { output, error, isRunning, executionResult } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = Boolean(error || output);

  const handleCopy = async () => {
    if (!hasContent) return;
    try {
      await navigator.clipboard.writeText(error || output);
      setIsCopied(true);
      toast.success("Output copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-2xl bg-[#141419]/90 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
      id="output-panel-container"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#181822] border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              Output Console
            </span>
          </div>

          {/* Status Tag */}
          {isRunning ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Executing
            </span>
          ) : error ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Failed
            </span>
          ) : output ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Success
            </span>
          ) : (
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 font-mono border border-white/5">
              Idle
            </span>
          )}

          {executionResult?.durationMs !== undefined && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 font-mono ml-2 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
              <Zap className="w-3 h-3 text-amber-400" />
              {executionResult.durationMs}ms
            </span>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          {hasContent && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer shadow-sm"
              title="Copy Output"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 bg-[#101015] font-mono text-xs overflow-auto min-h-[300px] custom-scrollbar">
        {isRunning ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
              <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-gray-200 mb-1">Executing program</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Sending code to sandboxed execution environment...
            </p>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-semibold bg-red-950/20 p-3 rounded-2xl border border-red-900/30 shadow-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Execution Error / Stderr</span>
            </div>
            <pre className="whitespace-pre-wrap text-red-300/90 leading-relaxed bg-[#141419] p-3.5 rounded-2xl border border-red-950/50 shadow-inner">
              {error}
            </pre>
          </div>
        ) : output ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-emerald-400 font-semibold bg-emerald-950/20 p-3 rounded-2xl border border-emerald-900/30 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Execution Successful</span>
              </div>
              {executionResult?.durationMs !== undefined && (
                <span className="text-[10px] text-emerald-300/70 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  Finished in {executionResult.durationMs}ms
                </span>
              )}
            </div>
            <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed bg-[#141419] p-3.5 rounded-2xl border border-white/5 selection:bg-emerald-500/30 shadow-inner">
              {output}
            </pre>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-16 text-gray-500 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 shadow-inner">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-300 mb-1">Ready for execution</p>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Click <span className="text-emerald-400 font-semibold">Run</span> above or press <kbd className="px-1.5 py-0.5 bg-white/10 text-gray-300 rounded-lg text-[10px] font-mono border border-white/5">Ctrl+Enter</kbd> to compile and execute in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}