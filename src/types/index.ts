import type { Monaco } from "@monaco-editor/react";

export interface Theme {
  id: string;
  label: string;
  color: string;
}

export interface LanguageRuntime {
  language: string;
  version: string;
  judge0Id: number;
  fileExtension: string;
}

export interface Language {
  id: string;
  label: string;
  logoPath: string;
  monacoLanguage: string;
  defaultCode: string;
  fileName: string;
  runtime: LanguageRuntime;
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
  durationMs?: number;
  memoryKb?: number;
  status?: string;
  exitCode?: number;
}

export interface CodeEditorState {
  language: string;
  output: string;
  error: string | null;
  isRunning: boolean;
  theme: string;
  fontSize: number;
  editor: any | null;
  stdin: string;
  openTabs: string[];
  activeTerminalTab: "terminal" | "output" | "problems" | "debug";
  isTerminalOpen: boolean;
  isTerminalMaximized: boolean;
  isSidebarOpen: boolean;
  sidebarTab: "explorer" | "search" | "snippets" | "run" | "reference" | "settings";
  cursorPosition: { line: number; column: number };
  executionResult: ExecutionResult | null;
  setEditor: (editor: any) => void;
  getCode: () => string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  setStdin: (stdin: string) => void;
  setActiveTerminalTab: (tab: "terminal" | "output" | "problems" | "debug") => void;
  setIsTerminalOpen: (open: boolean) => void;
  setIsTerminalMaximized: (max: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  setSidebarTab: (tab: "explorer" | "search" | "snippets" | "run" | "reference" | "settings") => void;
  setCursorPosition: (pos: { line: number; column: number }) => void;
  closeTab: (langId: string) => void;
  openTab: (langId: string) => void;
  runCode: () => Promise<void>;
}

export interface Snippet {
  _id: string;
  _creationTime: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  language: string;
  code: string;
  title: string;
  starsCount?: number;
}

export interface SnippetComment {
  _id: string;
  snippetId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  _creationTime: number;
}

export interface CodeExecutionRecord {
  _id: string;
  userId: string;
  language: string;
  code: string;
  output?: string;
  error?: string;
  _creationTime: number;
}

export interface UserStats {
  totalExecutions: number;
  languagesCount: number;
  languages: string[];
  lastActive: number;
  favoriteLanguage: string;
}
