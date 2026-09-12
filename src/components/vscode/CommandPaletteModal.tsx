import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import {
  Search,
  Play,
  Terminal,
  Sidebar,
  RotateCcw,
  Palette,
  Share2,
  BookOpen,
  Code2,
  FileCode,
} from "lucide-react";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { useAppStore } from "../../store/useAppStore";
import { LANGUAGE_CONFIG, THEMES } from "../../constants";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShareModal: () => void;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onOpenShareModal,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    runCode,
    isTerminalOpen,
    setIsTerminalOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    openTab,
    setTheme,
    editor,
    language,
  } = useCodeEditorStore();

  const { setIsCheatSheetOpen, setActiveView } = useAppStore();

  const currentLang = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  const commands = [
    {
      id: "run",
      label: `Run Code: Execute ${currentLang.fileName} in Judge0 Sandbox`,
      category: "Run",
      icon: Play,
      action: () => runCode(),
    },
    {
      id: "share",
      label: "CodeCraft: Share Active Code as Snippet",
      category: "Snippets",
      icon: Share2,
      action: () => onOpenShareModal(),
    },
    {
      id: "snippets_view",
      label: "View: Open Community Snippets Library",
      category: "Navigation",
      icon: Code2,
      action: () => setActiveView("snippets"),
    },
    {
      id: "toggle_terminal",
      label: "View: Toggle Integrated Terminal Panel",
      category: "Terminal",
      icon: Terminal,
      action: () => setIsTerminalOpen(!isTerminalOpen),
    },
    {
      id: "toggle_sidebar",
      label: "View: Toggle Primary Side Bar",
      category: "View",
      icon: Sidebar,
      action: () => setIsSidebarOpen(!isSidebarOpen),
    },
    {
      id: "format",
      label: "Format Document",
      category: "Editor",
      icon: FileCode,
      action: () => editor?.getAction("editor.action.formatDocument")?.run(),
    },
    {
      id: "cheatsheet",
      label: "Help: Open Language Cheat Sheets & Reference",
      category: "Help",
      icon: BookOpen,
      action: () => setIsCheatSheetOpen(true),
    },
    // Languages
    ...Object.values(LANGUAGE_CONFIG).map((conf) => ({
      id: `lang_${conf.id}`,
      label: `Language: Switch to ${conf.label} (${conf.fileName})`,
      category: "Languages",
      icon: FileCode,
      action: () => openTab(conf.id),
    })),
    // Themes
    ...THEMES.map((th) => ({
      id: `theme_${th.id}`,
      label: `Preferences: Color Theme - ${th.label}`,
      category: "Themes",
      icon: Palette,
      action: () => setTheme(th.id),
    })),
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredCommands[selectedIndex];
      if (target) {
        target.action();
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#252526] border border-[#3c3c3c] shadow-2xl rounded-lg overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-3 py-2.5 border-b border-[#3c3c3c] bg-[#1e1e1e]">
          <Search className="w-4 h-4 text-[#858585] mr-2 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or language name..."
            className="flex-1 bg-transparent text-white placeholder-[#666666] focus:outline-none text-xs"
          />
          <kbd className="text-[10px] text-[#888888] bg-[#2a2a2a] px-1.5 py-0.5 rounded border border-[#3a3a3a]">
            ESC to close
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto py-1">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-6 text-center text-[#777777]">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#094771] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-3.5 h-3.5 text-[#007acc] flex-shrink-0" />
                    <span className="truncate">{cmd.label}</span>
                  </div>
                  <span className="text-[10px] text-[#858585] uppercase tracking-wider ml-2 flex-shrink-0">
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
