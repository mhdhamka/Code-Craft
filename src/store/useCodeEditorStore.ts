import { create } from "zustand";
import { LANGUAGE_CONFIG } from "../constants";
import type { CodeEditorState } from "../types";
import { useAppStore } from "./useAppStore";

const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 14,
      theme: "vs-dark",
      openTabs: ["javascript", "python"],
    };
  }

  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || "14";
  let savedTabs: string[] = ["javascript", "python"];
  try {
    const raw = localStorage.getItem("editor-open-tabs");
    if (raw) savedTabs = JSON.parse(raw);
  } catch {
    // fallback
  }

  const validLanguage = savedLanguage in LANGUAGE_CONFIG ? savedLanguage : "javascript";
  if (!savedTabs.includes(validLanguage)) {
    savedTabs.push(validLanguage);
  }

  return {
    language: validLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize) || 14,
    openTabs: savedTabs,
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    error: null,
    isRunning: false,
    editor: null,
    stdin: "",
    activeTerminalTab: "terminal",
    isTerminalOpen: true,
    isTerminalMaximized: false,
    isSidebarOpen: true,
    sidebarTab: "explorer",
    cursorPosition: { line: 1, column: 1 },
    executionResult: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editor: any) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) {
        editor.setValue(savedCode);
      } else {
        editor.setValue(LANGUAGE_CONFIG[get().language]?.defaultCode || "");
      }

      // Track cursor position
      editor.onDidChangeCursorPosition?.((e: any) => {
        set({
          cursorPosition: {
            line: e.position.lineNumber,
            column: e.position.column,
          },
        });
      });

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setStdin: (stdin: string) => set({ stdin }),

    setActiveTerminalTab: (activeTerminalTab) => set({ activeTerminalTab, isTerminalOpen: true }),
    setIsTerminalOpen: (isTerminalOpen) => set({ isTerminalOpen }),
    setIsTerminalMaximized: (isTerminalMaximized) => set({ isTerminalMaximized }),
    setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    setSidebarTab: (sidebarTab) => set({ sidebarTab, isSidebarOpen: true }),
    setCursorPosition: (cursorPosition) => set({ cursorPosition }),

    openTab: (langId: string) => {
      const { openTabs } = get();
      if (!openTabs.includes(langId)) {
        const nextTabs = [...openTabs, langId];
        localStorage.setItem("editor-open-tabs", JSON.stringify(nextTabs));
        set({ openTabs: nextTabs });
      }
      get().setLanguage(langId);
    },

    closeTab: (langId: string) => {
      const { openTabs, language } = get();
      if (openTabs.length <= 1) return; // Keep at least one tab

      const nextTabs = openTabs.filter((id) => id !== langId);
      localStorage.setItem("editor-open-tabs", JSON.stringify(nextTabs));

      if (language === langId) {
        const nextLang = nextTabs[nextTabs.length - 1];
        get().setLanguage(nextLang);
      }
      set({ openTabs: nextTabs });
    },

    setLanguage: (language: string) => {
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }
      localStorage.setItem("editor-language", language);

      const { openTabs } = get();
      if (!openTabs.includes(language)) {
        const nextTabs = [...openTabs, language];
        localStorage.setItem("editor-open-tabs", JSON.stringify(nextTabs));
        set({ openTabs: nextTabs });
      }

      const targetConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;
      const targetSavedCode = localStorage.getItem(`editor-code-${language}`) || targetConfig.defaultCode;
      if (get().editor) {
        get().editor.setValue(targetSavedCode);
      }

      set({
        language,
        output: "",
        error: null,
      });
    },

    runCode: async () => {
      const { language, getCode, stdin } = get();
      const code = getCode();

      if (!code || !code.trim()) {
        const errorMsg = "Error: Cannot execute empty file";
        set({ error: errorMsg, isTerminalOpen: true, activeTerminalTab: "terminal" });
        return;
      }

      set({
        isRunning: true,
        error: null,
        output: "",
        isTerminalOpen: true,
        activeTerminalTab: "terminal",
      });
      const startTime = performance.now();

      try {
        const config = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;
        const judge0Id = config.runtime.judge0Id;

        // Judge0 CE endpoint (Free, open sandbox, no token required)
        const response = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: judge0Id,
            stdin: stdin || undefined,
          }),
        });

        const durationMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
          throw new Error(`Judge0 Sandbox HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Compilation error
        if (data.compile_output) {
          const compErr = data.compile_output.trim();
          set({
            error: compErr,
            executionResult: {
              code,
              output: "",
              error: compErr,
              durationMs,
              status: data.status?.description || "Compilation Error",
              exitCode: data.status?.id || 6,
            },
          });
          useAppStore.getState().addExecutionRecord(language, code, undefined, compErr);
          return;
        }

        // Runtime error / stderr
        if (data.stderr) {
          const errOutput = data.stderr.trim();
          const stdOutput = (data.stdout || "").trimEnd();
          set({
            output: stdOutput,
            error: errOutput,
            executionResult: {
              code,
              output: stdOutput,
              error: errOutput,
              durationMs: data.time ? Math.round(parseFloat(data.time) * 1000) : durationMs,
              memoryKb: data.memory,
              status: data.status?.description || "Runtime Error",
              exitCode: data.status?.id || 11,
            },
          });
          useAppStore.getState().addExecutionRecord(language, code, stdOutput, errOutput);
          return;
        }

        // Standard Output Success
        const rawOutput = data.stdout || "";
        const cleanOutput = rawOutput.trimEnd() || "(Program completed with empty output)";
        const calcDuration = data.time ? Math.round(parseFloat(data.time) * 1000) : durationMs;

        set({
          output: cleanOutput,
          error: null,
          executionResult: {
            code,
            output: cleanOutput,
            error: null,
            durationMs: calcDuration,
            memoryKb: data.memory,
            status: data.status?.description || "Accepted",
            exitCode: 0,
          },
        });

        useAppStore.getState().addExecutionRecord(language, code, cleanOutput, undefined);
      } catch (err: any) {
        // Fallback or Network issue
        const message = err?.message || "Error communicating with execution sandbox";
        set({
          error: message,
          executionResult: { code, output: "", error: message },
        });
        useAppStore.getState().addExecutionRecord(language, code, undefined, message);
      } finally {
        set({ isRunning: false });
      }
    },
  };
});
