import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  Terminal as TerminalIcon,
  Trash2,
  Copy,
  Maximize2,
  Minimize2,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  CornerDownLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../../constants";

export function TerminalPanel() {
  const {
    output,
    error,
    isRunning,
    activeTerminalTab,
    setActiveTerminalTab,
    isTerminalOpen,
    setIsTerminalOpen,
    isTerminalMaximized,
    setIsTerminalMaximized,
    executionResult,
    language,
    runCode,
    stdin,
    setStdin,
  } = useCodeEditorStore();

  const [inputBuffer, setInputBuffer] = useState("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  useEffect(() => {
    if (output || error) {
      terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [output, error, isRunning]);

  if (!isTerminalOpen) return null;

  const handleCopy = () => {
    const textToCopy = error ? `${output}\n${error}` : output;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast.success("Terminal output copied");
    }
  };

  const handleClear = () => {
    useCodeEditorStore.setState({ output: "", error: null, executionResult: null });
    toast.success("Terminal cleared");
  };

  const handleSendStdin = (e: FormEvent) => {
    e.preventDefault();
    if (!inputBuffer.trim()) return;
    setStdin(inputBuffer);
    toast.success(`Set stdin: "${inputBuffer}" — executing...`);
    setInputBuffer("");
    runCode();
  };

  // Determine command string for this language
  const getCommandString = () => {
    switch (language) {
      case "python":
        return `python3 ${currentLang.fileName}`;
      case "javascript":
        return `node ${currentLang.fileName}`;
      case "typescript":
        return `tsx ${currentLang.fileName}`;
      case "java":
        return `javac ${currentLang.fileName} && java Main`;
      case "cpp":
        return `g++ -O2 ${currentLang.fileName} -o main && ./main`;
      case "csharp":
        return `csc ${currentLang.fileName} && mono Program.exe`;
      case "go":
        return `go run ${currentLang.fileName}`;
      case "rust":
        return `rustc ${currentLang.fileName} && ./main`;
      case "ruby":
        return `ruby ${currentLang.fileName}`;
      case "swift":
        return `swift ${currentLang.fileName}`;
      case "bash":
        return `bash ${currentLang.fileName}`;
      default:
        return `run ${currentLang.fileName}`;
    }
  };

  return (
    <div
      id="vscode-terminal-panel"
      className={`bg-[#181818] border-t border-[#2d2d2d] flex flex-col select-text flex-shrink-0 transition-all duration-150 ${
        isTerminalMaximized ? "h-[75vh]" : "h-64 sm:h-72"
      }`}
    >
      {/* Terminal Tab Bar */}
      <div className="h-8 bg-[#1f1f1f] border-b border-[#2d2d2d] flex items-center justify-between px-3 text-xs select-none">
        {/* Left: Terminal Tabs */}
        <div className="flex items-center gap-4 h-full">
          <button
            type="button"
            onClick={() => setActiveTerminalTab("terminal")}
            className={`h-full flex items-center gap-1.5 px-1 border-b-2 font-medium cursor-pointer transition-colors text-xs uppercase tracking-wider ${
              activeTerminalTab === "terminal"
                ? "border-[#007acc] text-white"
                : "border-transparent text-[#888888] hover:text-[#cccccc]"
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTerminalTab("output")}
            className={`h-full flex items-center gap-1.5 px-1 border-b-2 font-medium cursor-pointer transition-colors text-xs uppercase tracking-wider ${
              activeTerminalTab === "output"
                ? "border-[#007acc] text-white"
                : "border-transparent text-[#888888] hover:text-[#cccccc]"
            }`}
          >
            <span>Output</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTerminalTab("problems")}
            className={`h-full flex items-center gap-1.5 px-1 border-b-2 font-medium cursor-pointer transition-colors text-xs uppercase tracking-wider ${
              activeTerminalTab === "problems"
                ? "border-[#007acc] text-white"
                : "border-transparent text-[#888888] hover:text-[#cccccc]"
            }`}
          >
            <span>Problems</span>
            {error ? (
              <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 text-[10px] flex items-center justify-center font-bold">
                1
              </span>
            ) : (
              <span className="text-[10px] text-[#888888]">(0)</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTerminalTab("debug")}
            className={`h-full flex items-center gap-1.5 px-1 border-b-2 font-medium cursor-pointer transition-colors text-xs uppercase tracking-wider ${
              activeTerminalTab === "debug"
                ? "border-[#007acc] text-white"
                : "border-transparent text-[#888888] hover:text-[#cccccc]"
            }`}
          >
            <span>Debug Console</span>
          </button>
        </div>

        {/* Right: Terminal Actions */}
        <div className="flex items-center gap-1 text-[#888888]">
          {/* Status Indicator */}
          {isRunning ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[11px] font-mono mr-2">
              <span>Judge0 executing...</span>
            </div>
          ) : executionResult ? (
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#888888] mr-2">
              {executionResult.durationMs !== undefined && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Clock className="w-3 h-3" />
                  {executionResult.durationMs}ms
                </span>
              )}
              {executionResult.memoryKb !== undefined && (
                <span className="flex items-center gap-1 text-[#aaaaaa]">
                  <Cpu className="w-3 h-3" />
                  {executionResult.memoryKb} KB
                </span>
              )}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleCopy}
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors cursor-pointer"
            title="Copy Terminal Output"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors cursor-pointer"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors cursor-pointer"
            title={isTerminalMaximized ? "Restore Panel Size" : "Maximize Panel Size"}
          >
            {isTerminalMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsTerminalOpen(false)}
            className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal View Content */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-[#cccccc] leading-relaxed">
        {activeTerminalTab === "terminal" && (
          <div className="space-y-2">
            {/* Header info */}
            <div className="text-[#666666] text-[11px] pb-1 border-b border-[#252526] flex items-center justify-between">
              <span>CodeCraft Integrated Terminal • Judge0 CE Sandbox v1.13</span>
              <span>Bash Shell (Simulated)</span>
            </div>

            {/* If no run yet */}
            {!output && !error && !isRunning && (
              <div className="py-2 text-[#777777]">
                <p>guest@codecraft:~/workspace$ <span className="text-[#aaaaaa]"># Click &apos;Run&apos; or press Ctrl+Enter to execute {currentLang.fileName}</span></p>
                <div className="mt-3 p-2.5 rounded bg-[#1f1f1f] border border-[#2a2a2a] max-w-md">
                  <p className="text-white font-medium mb-1">Quick Execution Tip:</p>
                  <p className="text-[11px] text-[#999999]">
                    Judge0 compiles and executes code on real Linux containers in milliseconds.
                    Standard input (stdin) is supported below or in the sidebar.
                  </p>
                </div>
              </div>
            )}

            {/* Running state */}
            {isRunning && (
              <div className="py-1">
                <p className="text-[#388bfd]">
                  guest@codecraft:~/workspace$ <span className="text-white">{getCommandString()}</span>
                </p>
                <p className="text-[#e3b341] mt-1 flex items-center gap-2">
                  Connecting to Judge0 remote container...
                </p>
              </div>
            )}

            {/* Execution Result */}
            {(output || error) && !isRunning && (
              <div>
                <p className="text-[#388bfd]">
                  guest@codecraft:~/workspace$ <span className="text-white">{getCommandString()}</span>
                </p>

                {/* Stdin note if provided */}
                {stdin && (
                  <p className="text-[#888888] text-[11px] mt-0.5">
                    &lt; stdin: &quot;{stdin}&quot;
                  </p>
                )}

                {/* Output */}
                {output && (
                  <pre className="text-[#dcdcdc] whitespace-pre-wrap mt-1 font-mono selection:bg-[#264f78]">
                    {output}
                  </pre>
                )}

                {/* Error */}
                {error && (
                  <pre className="text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50 mt-2 whitespace-pre-wrap font-mono">
                    {error}
                  </pre>
                )}

                {/* Completed summary line */}
                <div className="mt-3 pt-2 border-t border-[#252526] text-[11px] flex flex-wrap items-center gap-3 text-[#777777]">
                  <span className={error ? "text-red-400 font-semibold" : "text-emerald-400 font-semibold"}>
                    {error ? "✗ Process failed" : "✓ Process exited with code 0"}
                  </span>
                  {executionResult?.durationMs !== undefined && (
                    <span>Time: {executionResult.durationMs}ms</span>
                  )}
                  {executionResult?.memoryKb !== undefined && (
                    <span>Memory: {executionResult.memoryKb} KB</span>
                  )}
                  {executionResult?.status && (
                    <span className="px-1.5 py-0.2 bg-[#252526] rounded text-[#aaaaaa]">
                      Status: {executionResult.status}
                    </span>
                  )}
                </div>

                {/* Next prompt */}
                <p className="text-[#388bfd] mt-2">
                  guest@codecraft:~/workspace$ <span className="inline-block w-2 h-3.5 bg-[#aaaaaa] ml-0.5 align-middle animate-pulse" />
                </p>
              </div>
            )}

            <div ref={terminalBottomRef} />
          </div>
        )}

        {activeTerminalTab === "output" && (
          <div>
            <pre className="text-[#cccccc] whitespace-pre-wrap">
              {output || "[No stdout produced yet]"}
            </pre>
          </div>
        )}

        {activeTerminalTab === "problems" && (
          <div className="space-y-2">
            {error ? (
              <div className="p-3 bg-red-950/20 border border-red-800/40 rounded flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-red-400 mb-1">Execution / Compilation Error</h5>
                  <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">{error}</pre>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-[#777777]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs">No problems detected in workspace.</p>
              </div>
            )}
          </div>
        )}

        {activeTerminalTab === "debug" && (
          <div className="text-[#888888] space-y-2">
            <p className="text-[11px]">Judge0 Runtime Sandbox active.</p>
            <p className="text-[11px]">Language ID: {currentLang.runtime.judge0Id}</p>
            <p className="text-[11px]">Runtime: {currentLang.runtime.language} ({currentLang.runtime.version})</p>
            <p className="text-[11px]">Target File: {currentLang.fileName}</p>
          </div>
        )}
      </div>

      {/* Terminal Input Bar (Interactive stdin) */}
      <form
        onSubmit={handleSendStdin}
        className="h-8 bg-[#1f1f1f] border-t border-[#2d2d2d] flex items-center px-2 gap-2 text-xs"
      >
        <span className="text-[#007acc] font-mono font-bold">$</span>
        <input
          type="text"
          value={inputBuffer}
          onChange={(e) => setInputBuffer(e.target.value)}
          placeholder="Type stdin or command and press Enter..."
          className="flex-1 bg-transparent text-white font-mono text-xs placeholder-[#555555] focus:outline-none"
        />
        <button
          type="submit"
          className="px-2 py-0.5 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Send</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
