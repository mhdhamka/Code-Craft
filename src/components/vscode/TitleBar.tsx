import { useState, useRef, useEffect } from "react";
import {
  Play,
  Share2,
  Terminal as TerminalIcon,
  Sidebar as SidebarIcon,
  Search,
  Code2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { useAppStore } from "../../store/useAppStore";
import { LANGUAGE_CONFIG } from "../../constants";

interface TitleBarProps {
  onOpenShareModal: () => void;
  onOpenCommandPalette: () => void;
}

export function TitleBar({ onOpenShareModal, onOpenCommandPalette }: TitleBarProps) {
  const {
    language,
    runCode,
    isRunning,
    isTerminalOpen,
    setIsTerminalOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    editor,
  } = useCodeEditorStore();

  const { setIsCheatSheetOpen, setActiveView } = useAppStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetCode = () => {
    if (editor) {
      editor.setValue(currentLang.defaultCode);
      localStorage.removeItem(`editor-code-${language}`);
      toast.success(`Reset ${currentLang.label} file`);
    }
  };

  return (
    <header
      id="vscode-title-bar"
      className="h-9 bg-[#1f1f1f] text-[#cccccc] border-b border-[#2d2d2d] flex items-center justify-between px-2 text-xs select-none z-30 flex-shrink-0"
    >
      {/* Left: Window Controls + Menu Items */}
      <div className="flex items-center gap-3" ref={menuRef}>
        {/* VS Code Window Dots (Mac style) */}
        <div className="flex items-center gap-1.5 px-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-[#e0443e]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-[#dea123]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-[#1aab29]" />
        </div>

        {/* CodeCraft Brand Logo */}
        <button
          type="button"
          onClick={() => setActiveView("editor")}
          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-[#333333] transition-colors text-white font-medium cursor-pointer"
        >
          <div className="w-4 h-4 bg-[#007acc] rounded flex items-center justify-center text-white font-black text-[10px]">
            <Code2 className="w-3 h-3" />
          </div>
          <span className="font-semibold text-xs tracking-tight text-white hidden sm:inline">
            CodeCraft
          </span>
        </button>

        {/* Top Dropdown Menus */}
        <div className="hidden md:flex items-center text-[#cccccc]">
          {/* File Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "file" ? null : "file")}
              className={`px-2 py-0.5 rounded hover:bg-[#333333] hover:text-white transition-colors cursor-pointer ${
                activeMenu === "file" ? "bg-[#333333] text-white" : ""
              }`}
            >
              File
            </button>
            {activeMenu === "file" && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#252526] border border-[#3c3c3c] shadow-2xl rounded py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    handleResetCode();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Reset Current File</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+R</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenShareModal();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Share Snippet...</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+S</span>
                </button>
                <div className="h-[1px] bg-[#3c3c3c] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setActiveView("snippets");
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Open Community Snippets</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "edit" ? null : "edit")}
              className={`px-2 py-0.5 rounded hover:bg-[#333333] hover:text-white transition-colors cursor-pointer ${
                activeMenu === "edit" ? "bg-[#333333] text-white" : ""
              }`}
            >
              Edit
            </button>
            {activeMenu === "edit" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#252526] border border-[#3c3c3c] shadow-2xl rounded py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    editor?.trigger("keyboard", "undo", null);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Undo</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+Z</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.trigger("keyboard", "redo", null);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Redo</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+Y</span>
                </button>
                <div className="h-[1px] bg-[#3c3c3c] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    editor?.getAction("editor.action.formatDocument")?.run();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Format Document</span>
                  <span className="text-[10px] text-[#858585]">Shift+Alt+F</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "view" ? null : "view")}
              className={`px-2 py-0.5 rounded hover:bg-[#333333] hover:text-white transition-colors cursor-pointer ${
                activeMenu === "view" ? "bg-[#333333] text-white" : ""
              }`}
            >
              View
            </button>
            {activeMenu === "view" && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#252526] border border-[#3c3c3c] shadow-2xl rounded py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onOpenCommandPalette();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Command Palette...</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+P</span>
                </button>
                <div className="h-[1px] bg-[#3c3c3c] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(!isSidebarOpen);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Toggle Primary Side Bar</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+B</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTerminalOpen(!isTerminalOpen);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Toggle Terminal Panel</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+`</span>
                </button>
              </div>
            )}
          </div>

          {/* Run Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "run" ? null : "run")}
              className={`px-2 py-0.5 rounded hover:bg-[#333333] hover:text-white transition-colors cursor-pointer ${
                activeMenu === "run" ? "bg-[#333333] text-white" : ""
              }`}
            >
              Run
            </button>
            {activeMenu === "run" && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#252526] border border-[#3c3c3c] shadow-2xl rounded py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    runCode();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between text-emerald-400 font-medium cursor-pointer"
                >
                  <span>Start Without Debugging</span>
                  <span className="text-[10px] text-[#858585]">Ctrl+Enter</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "help" ? null : "help")}
              className={`px-2 py-0.5 rounded hover:bg-[#333333] hover:text-white transition-colors cursor-pointer ${
                activeMenu === "help" ? "bg-[#333333] text-white" : ""
              }`}
            >
              Help
            </button>
            {activeMenu === "help" && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#252526] border border-[#3c3c3c] shadow-2xl rounded py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheatSheetOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Language Cheat Sheets</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.open("https://github.com/mhdhamka/Code-Craft", "_blank");
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>GitHub Repository</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Search / Command Palette Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full h-6 px-3 bg-[#2a2a2b] hover:bg-[#333333] border border-[#3c3c3c] rounded flex items-center justify-center gap-2 text-[#999999] hover:text-[#cccccc] transition-colors cursor-pointer"
          title="Open Command Palette (Ctrl+P)"
        >
          <Search className="w-3 h-3" />
          <span className="text-[11px] truncate">
            CodeCraft — {currentLang.fileName} ({currentLang.label})
          </span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-[9px] text-[#888888]">
            Ctrl+P
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Run Button in Title Bar */}
        <button
          type="button"
          onClick={() => runCode()}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-60 text-white font-medium rounded text-xs transition-colors cursor-pointer shadow-sm mr-1"
          title="Run Code (Ctrl+Enter)"
        >
          <Play className="w-3 h-3 fill-white text-white" />
          <span className="hidden sm:inline">Run</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onOpenShareModal}
          className="p-1.5 text-[#cccccc] hover:text-white hover:bg-[#333333] rounded transition-colors cursor-pointer"
          title="Share Snippet"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Primary Sidebar */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            isSidebarOpen ? "bg-[#333333] text-white" : "text-[#cccccc] hover:text-white hover:bg-[#333333]"
          }`}
          title="Toggle Primary Side Bar (Ctrl+B)"
        >
          <SidebarIcon className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Terminal Panel */}
        <button
          type="button"
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            isTerminalOpen ? "bg-[#333333] text-white" : "text-[#cccccc] hover:text-white hover:bg-[#333333]"
          }`}
          title="Toggle Terminal Panel (Ctrl+`)"
        >
          <TerminalIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}