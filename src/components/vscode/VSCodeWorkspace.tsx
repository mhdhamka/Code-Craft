import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { TitleBar } from "./TitleBar";
import { ActivityBar } from "./ActivityBar";
import { PrimarySidebar } from "./PrimarySidebar";
import { EditorTabs } from "./EditorTabs";
import { TerminalPanel } from "./TerminalPanel";
import { StatusBar } from "./StatusBar";
import { CommandPaletteModal } from "./CommandPaletteModal";
import { ShareSnippetDialog } from "../ShareSnippetDialog";
import { useCodeEditorStore } from "../../store/useCodeEditorStore";
import { LANGUAGE_CONFIG, defineMonacoThemes } from "../../constants";

export function VSCodeWorkspace() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const {
    language,
    theme,
    fontSize,
    editor,
    setEditor,
    runCode,
    isSidebarOpen,
    setIsSidebarOpen,
    isTerminalOpen,
    setIsTerminalOpen,
  } = useCodeEditorStore();

  const currentConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run code: Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
        return;
      }

      // Command Palette: Ctrl+P, Cmd+P, or F1
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") || e.key === "F1") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Toggle Sidebar: Ctrl+B or Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarOpen(!isSidebarOpen);
        return;
      }

      // Toggle Terminal: Ctrl+` or Cmd+`
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setIsTerminalOpen(!isTerminalOpen);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode, isSidebarOpen, setIsSidebarOpen, isTerminalOpen, setIsTerminalOpen]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      localStorage.setItem(`editor-code-${language}`, value);
    }
  };

  return (
    <div
      id="vscode-main-workspace"
      className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden select-none font-sans"
    >
      {/* 1. Title Bar / Menu Bar */}
      <TitleBar
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* 2. Middle Body (Activity Bar + Sidebar + Editor + Terminal) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 2a. Activity Bar (48px) */}
        <ActivityBar />

        {/* 2b. Primary Sidebar (collapsible) */}
        {isSidebarOpen && (
          <PrimarySidebar onOpenShareModal={() => setIsShareModalOpen(true)} />
        )}

        {/* 2c. Main Editor Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] overflow-hidden">
          {/* Editor Tab Strip & Breadcrumbs */}
          <EditorTabs onOpenShareModal={() => setIsShareModalOpen(true)} />

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 w-full relative bg-[#1e1e1e]">
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
                minimap: { enabled: true, scale: 1, renderCharacters: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 8, bottom: 8 },
                renderWhitespace: "selection",
                fontFamily: 'Consolas, "Courier New", "Fira Code", monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.5,
                roundedSelection: false,
                lineNumbersMinChars: 3,
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
              loading={
                <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e] text-[#888888] text-xs font-mono">
                  Loading Editor Environment...
                </div>
              }
            />
          </div>

          {/* 2d. Bottom Terminal / Output Panel */}
          <TerminalPanel />
        </main>
      </div>

      {/* 3. Bottom Status Bar with Character Count and Shortcuts */}
      <StatusBar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* 4. Command Palette Modal (Ctrl+P / F1) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* 5. Share Snippet Modal */}
      {isShareModalOpen && (
        <ShareSnippetDialog onClose={() => setIsShareModalOpen(false)} />
      )}
    </div>
  );
}
