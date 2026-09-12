import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "motion/react";
import { RotateCcw, Share2, Type } from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGE_CONFIG, defineMonacoThemes } from "../constants";
import { useCodeEditorStore } from "../store/useCodeEditorStore";
import { ShareSnippetDialog } from "./ShareSnippetDialog";

export function EditorPanel() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const {
    language,
    theme,
    fontSize,
    editor,
    setFontSize,
    setEditor,
    runCode,
  } = useCodeEditorStore();

  const currentConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  // Global shortcut for running code (Ctrl+Enter or Cmd+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode]);

  const handleRefresh = () => {
    const defaultCode = currentConfig.defaultCode;
    if (editor) {
      editor.setValue(defaultCode);
    }
    localStorage.removeItem(`editor-code-${language}`);
    toast.success(`Reset ${currentConfig.label} code template`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      localStorage.setItem(`editor-code-${language}`, value);
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#141419] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md" id="editor-panel-container">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#181822] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#14141a] border border-white/10 shadow-inner">
            <img
              src={currentConfig.logoPath}
              alt={currentConfig.label}
              className="w-4 h-4 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-gray-200 tracking-wide">
                Interactive Code Editor
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                {currentConfig.monacoLanguage}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 font-mono text-[10px] border border-white/10">Ctrl+Enter</kbd> to execute
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#14141a] rounded-xl border border-white/10 shadow-inner">
            <Type className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
              className="w-16 h-1 bg-gray-700 rounded-lg cursor-pointer accent-blue-500"
              title={`Font Size: ${fontSize}px`}
            />
            <span className="text-xs font-mono font-medium text-gray-300 min-w-[1.75rem] text-right">
              {fontSize}px
            </span>
          </div>

          {/* Reset Template */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 bg-[#14141a] hover:bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all cursor-pointer"
            title="Reset to default language code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Share Snippet */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setIsShareDialogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer border border-blue-400/30"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </motion.button>
        </div>
      </div>

      {/* Monaco Container */}
      <div className="flex-1 min-h-[500px] lg:min-h-[580px] w-full relative bg-[#141419]">
        <Editor
          height="100%"
          language={currentConfig.monacoLanguage}
          theme={theme}
          defaultValue={currentConfig.defaultCode}
          onChange={handleEditorChange}
          beforeMount={defineMonacoThemes}
          onMount={(inst) => {
            setEditor(inst);
          }}
          options={{
            minimap: { enabled: false },
            fontSize,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderWhitespace: "selection",
            fontFamily: '"Fira Code", "JetBrains Mono", Menlo, Monaco, Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            renderLineHighlight: "all",
            lineHeight: 1.6,
            letterSpacing: 0.5,
            roundedSelection: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
          loading={
            <div className="h-full w-full flex items-center justify-center bg-[#141419] text-gray-400 text-xs font-mono">
              Loading Monaco Editor...
            </div>
          }
        />
      </div>

      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}