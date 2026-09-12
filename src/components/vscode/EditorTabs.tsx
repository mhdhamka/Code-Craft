import { useState, useRef, useEffect } from "react";
import {
  RotateCcw,
  Plus,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../../constants";

interface EditorTabsProps {
  onOpenShareModal: () => void;
}

export function EditorTabs({}: EditorTabsProps) {
  const {
    language,
    setLanguage,
    openTabs,
    openTab,
    closeTab,
    fontSize,
    setFontSize,
    editor,
  } = useCodeEditorStore();

  const [isNewFileMenuOpen, setIsNewFileMenuOpen] = useState(false);
  const newFileMenuRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newFileMenuRef.current && !newFileMenuRef.current.contains(e.target as Node)) {
        setIsNewFileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
    if (editor) {
      editor.setValue(currentLang.defaultCode);
      localStorage.removeItem(`editor-code-${language}`);
      toast.success(`Reset ${currentLang.label} to default`);
    }
  };

  return (
    <div className="flex flex-col bg-[#141419] border-b border-white/10 flex-shrink-0 select-none backdrop-blur-md">
      {/* Upper Tab Strip */}
      <div className="h-10 bg-[#181822] flex items-center justify-between overflow-x-auto text-xs px-1">
        {/* Left: Scrollable Tabs */}
        <div className="flex items-center h-full overflow-x-auto gap-1">
          {openTabs.map((tabLangId) => {
            const conf = LANGUAGE_CONFIG[tabLangId];
            if (!conf) return null;
            const isActive = language === tabLangId;

            return (
              <div
                key={tabLangId}
                onClick={() => setLanguage(tabLangId)}
                className={`group flex items-center h-8 px-3.5 gap-2 rounded-xl cursor-pointer transition-all relative border ${
                  isActive
                    ? "bg-[#1f1f2e] text-white font-medium border-blue-500/30 shadow-md shadow-blue-500/10"
                    : "bg-[#14141a] hover:bg-[#1b1b26] text-gray-400 hover:text-gray-200 border-white/5"
                }`}
              >
                {/* Active Top Accent Line */}
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-500 rounded-full" />
                )}

                <img
                  src={conf.logoPath}
                  alt=""
                  className="w-3.5 h-3.5 object-contain flex-shrink-0"
                  referrerPolicy="no-referrer"
                />

                <span className="truncate max-w-[120px] text-xs">{conf.fileName}</span>

                {/* Close tab button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tabLangId);
                  }}
                  className={`p-0.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-all ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  title="Close Tab"
                >
                  ✕
                </button>
              </div>
            );
          })}

          {/* Plus button to open another file */}
          <div className="relative ml-1" ref={newFileMenuRef}>
            <button
              type="button"
              onClick={() => setIsNewFileMenuOpen(!isNewFileMenuOpen)}
              className="h-8 px-2.5 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
              title="Open File for Another Language"
            >
              <Plus className="w-4 h-4" />
            </button>

            {isNewFileMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#181824] border border-white/10 shadow-2xl rounded-2xl py-1.5 z-50 text-xs max-h-64 overflow-y-auto backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 mb-1">
                  Open File
                </div>
                {Object.values(LANGUAGE_CONFIG).map((conf) => (
                  <button
                    key={conf.id}
                    type="button"
                    onClick={() => {
                      openTab(conf.id);
                      setIsNewFileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-blue-600/20 hover:text-blue-300 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <img
                      src={conf.logoPath}
                      alt=""
                      className="w-4 h-4 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-white font-medium">{conf.fileName}</span>
                    <span className="text-[10px] text-gray-400 ml-auto font-mono">{conf.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Tab Controls: Reset & Font Size */}
        <div className="flex items-center gap-2 px-2 flex-shrink-0">
          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/10"
            title="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Font Size Zoom */}
          <div className="hidden sm:flex items-center border border-white/10 rounded-xl bg-[#14141a] overflow-hidden shadow-inner">
            <button
              type="button"
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono px-2 text-gray-300 font-semibold">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize(Math.min(22, fontSize + 1))}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              title="Increase Font Size"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb line */}
      <div className="h-7 bg-[#121218] flex items-center px-4 gap-1.5 text-[11px] text-gray-400 border-t border-white/5 font-mono">
        <span className="hover:text-gray-200 transition-colors">codecraft</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="hover:text-gray-200 transition-colors">workspace</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="hover:text-gray-200 transition-colors">src</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <div className="flex items-center gap-1.5 text-white font-medium bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
          <img
            src={currentLang.logoPath}
            alt=""
            className="w-3 h-3 object-contain"
            referrerPolicy="no-referrer"
          />
          <span>{currentLang.fileName}</span>
        </div>
        <span className="text-[10px] text-gray-500 ml-2 hidden sm:inline">
          ({currentLang.label} — {currentLang.runtime.version})
        </span>
      </div>
    </div>
  );
}