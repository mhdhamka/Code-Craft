import { useState, useRef, useEffect } from "react";
import {
  GitBranch,
  AlertCircle,
  AlertTriangle,
  Terminal,
  Bell,
  Check,
  ChevronUp,
  Keyboard,
  Play,
  FileText,
  Sidebar as SidebarIcon,
  X,
} from "lucide-react";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../../constants";

interface StatusBarProps {
  onOpenCommandPalette?: () => void;
  onOpenShareModal?: () => void;
}

export function StatusBar({ onOpenCommandPalette, onOpenShareModal }: StatusBarProps) {
  const {
    language,
    openTab,
    cursorPosition,
    error,
    isTerminalOpen,
    setIsTerminalOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    isRunning,
    runCode,
    editor,
  } = useCodeEditorStore();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isShortcutsMenuOpen, setIsShortcutsMenuOpen] = useState(false);
  const [isStatsMenuOpen, setIsStatsMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    chars: 0,
    charsNoSpaces: 0,
    words: 0,
    lines: 0,
    selectedChars: 0,
  });

  const langMenuRef = useRef<HTMLDivElement>(null);
  const shortcutsMenuRef = useRef<HTMLDivElement>(null);
  const statsMenuRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  // Track character count, line count, and selection in real time
  useEffect(() => {
    const calculateStats = () => {
      let text = "";
      if (editor) {
        text = editor.getValue() || "";
      } else {
        text = localStorage.getItem(`editor-code-${language}`) || currentLang.defaultCode || "";
      }

      let selectedLength = 0;
      if (editor) {
        const selection = editor.getSelection();
        if (selection && !selection.isEmpty()) {
          const model = editor.getModel();
          if (model) {
            selectedLength = model.getValueInRange(selection).length;
          }
        }
      }

      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, "").length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const lines = text ? text.split("\n").length : 0;

      setStats({
        chars,
        charsNoSpaces,
        words,
        lines,
        selectedChars: selectedLength,
      });
    };

    calculateStats();

    if (!editor) return;

    const contentSub = editor.onDidChangeModelContent?.(calculateStats);
    const cursorSub = editor.onDidChangeCursorSelection?.(calculateStats);

    return () => {
      contentSub?.dispose?.();
      cursorSub?.dispose?.();
    };
  }, [editor, language, currentLang]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (shortcutsMenuRef.current && !shortcutsMenuRef.current.contains(e.target as Node)) {
        setIsShortcutsMenuOpen(false);
      }
      if (statsMenuRef.current && !statsMenuRef.current.contains(e.target as Node)) {
        setIsStatsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shortcutsList = [
    {
      combo: "Ctrl+Enter",
      label: "Run Code",
      desc: "Execute active file in Judge0 sandbox",
      action: () => runCode(),
    },
    {
      combo: "Ctrl+P",
      label: "Command Palette",
      desc: "Search commands, files, and settings",
      action: () => onOpenCommandPalette?.(),
    },
    {
      combo: "Ctrl+B",
      label: "Toggle Side Bar",
      desc: "Show or hide file explorer and panels",
      action: () => setIsSidebarOpen(!isSidebarOpen),
    },
    {
      combo: "Ctrl+`",
      label: "Toggle Terminal",
      desc: "Open or close integrated output console",
      action: () => setIsTerminalOpen(!isTerminalOpen),
    },
    {
      combo: "Shift+Alt+F",
      label: "Format Code",
      desc: "Auto-format document in Monaco",
      action: () => editor?.getAction("editor.action.formatDocument")?.run(),
    },
    {
      combo: "Ctrl+S",
      label: "Share Snippet",
      desc: "Publish snippet to community library",
      action: () => onOpenShareModal?.(),
    },
  ];

  return (
    <footer
      id="vscode-status-bar"
      className="h-6 bg-[#007acc] text-white flex items-center justify-between px-2 text-[11px] select-none z-30 flex-shrink-0"
    >
      {/* Left side items */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Git Branch */}
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
          title="Git Branch: main"
        >
          <GitBranch className="w-3 h-3" />
          <span>main*</span>
        </div>

        {/* Problems count */}
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
          title="Errors and Warnings"
          onClick={() => {
            setIsTerminalOpen(true);
            useCodeEditorStore.getState().setActiveTerminalTab("problems");
          }}
        >
          <AlertCircle className="w-3 h-3" />
          <span>{error ? "1" : "0"}</span>
          <AlertTriangle className="w-3 h-3 ml-0.5" />
          <span>0</span>
        </div>

        {/* Judge0 Sandbox Status */}
        <div
          className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
          title="Judge0 Cloud Sandbox (Free, Unlimited)"
        >
          <span>{isRunning ? "Running in Judge0..." : "Judge0 Sandbox"}</span>
        </div>

        {/* Quick Keyboard Shortcut Action Badges */}
        <div className="hidden lg:flex items-center gap-1 pl-1 border-l border-white/20">
          <button
            type="button"
            onClick={() => runCode()}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/25 transition-colors cursor-pointer font-medium"
            title="Execute Code (Ctrl+Enter)"
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <kbd className="font-mono text-[9px] bg-black/20 px-1 py-0.2 rounded">Ctrl+↵</kbd>
            <span>Run</span>
          </button>

          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
              title="Open Command Palette (Ctrl+P)"
            >
              <kbd className="font-mono text-[9px] bg-black/20 px-1 py-0.2 rounded">Ctrl+P</kbd>
              <span>Commands</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
            title="Toggle Primary Side Bar (Ctrl+B)"
          >
            <kbd className="font-mono text-[9px] bg-black/20 px-1 py-0.2 rounded">Ctrl+B</kbd>
            <span>Sidebar</span>
          </button>
        </div>
      </div>

      {/* Center: Helpful Keyboard Shortcuts Dropdown Trigger */}
      <div className="relative" ref={shortcutsMenuRef}>
        <button
          type="button"
          onClick={() => setIsShortcutsMenuOpen(!isShortcutsMenuOpen)}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
            isShortcutsMenuOpen ? "bg-white/30 text-white font-semibold" : "hover:bg-white/20"
          }`}
          title="View All Helpful Keyboard Shortcuts"
        >
          <Keyboard className="w-3 h-3" />
          <span className="font-medium">Shortcuts</span>
        </button>

        {/* Shortcuts Popup Menu */}
        {isShortcutsMenuOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-80 bg-[#252526] text-[#cccccc] border border-[#3c3c3c] shadow-2xl rounded-lg py-2 z-50 text-xs">
            <div className="flex items-center justify-between px-3 pb-1.5 border-b border-[#333333]">
              <span className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wider flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-[#007acc]" />
                Helpful Keyboard Shortcuts
              </span>
              <button
                type="button"
                onClick={() => setIsShortcutsMenuOpen(false)}
                className="p-0.5 text-[#888888] hover:text-white rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="p-1 space-y-0.5 max-h-72 overflow-y-auto">
              {shortcutsList.map((sc) => (
                <div
                  key={sc.combo}
                  onClick={() => {
                    sc.action();
                    setIsShortcutsMenuOpen(false);
                  }}
                  className="flex items-center justify-between p-2 rounded hover:bg-[#094771] hover:text-white transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-white block text-xs">{sc.label}</span>
                    <span className="text-[10px] text-[#888888] block">{sc.desc}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 bg-[#181818] border border-[#3c3c3c] rounded text-[10px] font-mono text-[#4ec9b0] flex-shrink-0 ml-2">
                    {sc.combo}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* CHARACTER COUNT DISPLAY FOR ACTIVE FILE */}
        <div className="relative" ref={statsMenuRef}>
          <button
            type="button"
            onClick={() => setIsStatsMenuOpen(!isStatsMenuOpen)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer font-mono ${
              isStatsMenuOpen ? "bg-white/30 text-white font-semibold" : "hover:bg-white/20"
            }`}
            title="Click to view file word & character statistics"
          >
            <FileText className="w-3 h-3" />
            {stats.selectedChars > 0 ? (
              <span>
                {stats.selectedChars} sel of {stats.chars.toLocaleString()} chars
              </span>
            ) : (
              <span>{stats.chars.toLocaleString()} chars</span>
            )}
          </button>

          {/* File Statistics Popover */}
          {isStatsMenuOpen && (
            <div className="absolute bottom-full right-0 mb-1.5 w-60 bg-[#252526] text-[#cccccc] border border-[#3c3c3c] shadow-2xl rounded-lg p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#333333]">
                <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#007acc]" />
                  Active File Statistics
                </span>
                <span className="text-[10px] text-[#888888] font-mono">{currentLang.fileName}</span>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-[#aaaaaa]">
                  <span>Total Characters:</span>
                  <span className="text-white font-bold">{stats.chars.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#aaaaaa]">
                  <span>Without Spaces:</span>
                  <span className="text-white">{stats.charsNoSpaces.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#aaaaaa]">
                  <span>Total Words:</span>
                  <span className="text-white">{stats.words.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#aaaaaa]">
                  <span>Total Lines:</span>
                  <span className="text-white">{stats.lines.toLocaleString()}</span>
                </div>
                {stats.selectedChars > 0 && (
                  <div className="flex justify-between text-amber-300 pt-1 border-t border-[#333333]">
                    <span>Selected Chars:</span>
                    <span className="font-bold">{stats.selectedChars}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888888] pt-1 border-t border-[#333333] text-[10px]">
                  <span>Approx Size:</span>
                  <span>{(stats.chars / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cursor Position */}
        <div
          className="px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer font-mono"
          title="Cursor Position: Line, Column"
        >
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </div>

        {/* Spaces */}
        <div className="hidden xl:inline-block px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer">
          Spaces: 2
        </div>

        {/* Encoding */}
        <div className="hidden sm:inline-block px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer">
          UTF-8
        </div>

        {/* LF */}
        <div className="hidden sm:inline-block px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer">
          LF
        </div>

        {/* Language selector popup */}
        <div className="relative" ref={langMenuRef}>
          <button
            type="button"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer font-medium"
            title="Select Language Mode"
          >
            <span>{currentLang.label}</span>
            <ChevronUp className="w-2.5 h-2.5" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute bottom-full right-0 mb-1 w-52 bg-[#252526] text-[#cccccc] border border-[#3c3c3c] shadow-2xl rounded py-1 z-50 text-xs max-h-72 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                Select Language Mode
              </div>
              {Object.values(LANGUAGE_CONFIG).map((conf) => (
                <button
                  key={conf.id}
                  type="button"
                  onClick={() => {
                    openTab(conf.id);
                    setIsLangMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={conf.logoPath}
                      alt=""
                      className="w-3.5 h-3.5 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-white">{conf.label}</span>
                  </div>
                  {language === conf.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Terminal button */}
        <button
          type="button"
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
          title="Toggle Terminal Panel (Ctrl+`)"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>

        {/* Notifications */}
        <div
          className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
        </div>
      </div>
    </footer>
  );
}
