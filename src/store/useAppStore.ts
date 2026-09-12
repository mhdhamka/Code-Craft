import { create } from "zustand";
import type { Snippet, SnippetComment, CodeExecutionRecord, UserStats } from "../types";

const INITIAL_SNIPPETS: Snippet[] = [
  {
    _id: "snip-1",
    _creationTime: Date.now() - 1000 * 60 * 60 * 18,
    userId: "user-hamka",
    userName: "Hamka",
    userAvatar: "/photo.jpg",
    language: "python",
    title: "Fast Fibonacci with LRU Cache Memoization",
    code: `from functools import lru_cache
import time

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

start = time.time()
print("Fibonacci(35) =", fib(35))
print("Computed in:", round((time.time() - start) * 1000, 3), "ms")
`,
    starsCount: 14,
  },
  {
    _id: "snip-2",
    _creationTime: Date.now() - 1000 * 60 * 60 * 42,
    userId: "user-alex",
    userName: "Alex Rivers",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    language: "javascript",
    title: "Deep Clone Object with StructuredClone & Fallback",
    code: `function deepClone(obj) {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

const original = {
  user: "Developer",
  preferences: { theme: "dark", editor: "Monaco" },
  skills: ["TS", "React", "Rust"]
};

const copy = deepClone(original);
copy.preferences.theme = "solarized";

console.log("Original theme:", original.preferences.theme);
console.log("Cloned theme:", copy.preferences.theme);
`,
    starsCount: 9,
  },
  {
    _id: "snip-3",
    _creationTime: Date.now() - 1000 * 60 * 60 * 75,
    userId: "user-elena",
    userName: "Elena Rostova",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    language: "rust",
    title: "Concurrent Task Runner with Channels",
    code: `use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    for i in 1..=4 {
        let tx_clone = tx.clone();
        thread::spawn(move || {
            thread::sleep(Duration::from_millis(50 * i));
            tx_clone.send(format!("Worker #{} finished successfully", i)).unwrap();
        });
    }
    drop(tx);

    for message in rx {
        println!("{}", message);
    }
    println!("All workers joined!");
}
`,
    starsCount: 22,
  },
  {
    _id: "snip-4",
    _creationTime: Date.now() - 1000 * 60 * 60 * 120,
    userId: "user-marcus",
    userName: "Marcus Vance",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    language: "go",
    title: "Pipeline Pattern with Buffered Channels",
    code: `package main

import "fmt"

func generator(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    c := generator(2, 3, 4, 5)
    out := square(c)

    for res := range out {
        fmt.Println("Result:", res)
    }
}
`,
    starsCount: 17,
  },
];

const INITIAL_COMMENTS: Record<string, SnippetComment[]> = {
  "snip-1": [
    {
      _id: "comm-1",
      snippetId: "snip-1",
      userId: "user-elena",
      userName: "Elena Rostova",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      content: "The lru_cache makes a huge difference here! Great demonstration of memoization.",
      _creationTime: Date.now() - 1000 * 60 * 60 * 12,
    },
    {
      _id: "comm-2",
      snippetId: "snip-1",
      userId: "user-alex",
      userName: "Alex Rivers",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      content: "Tested it right here in Code Craft — runs in 0.05ms. Super clean.",
      _creationTime: Date.now() - 1000 * 60 * 60 * 6,
    },
  ],
  "snip-3": [
    {
      _id: "comm-3",
      snippetId: "snip-3",
      userId: "user-hamka",
      userName: "Hamka",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      content: "Don't forget to drop the original transmitter `drop(tx)` so the receiver iterator terminates correctly!",
      _creationTime: Date.now() - 1000 * 60 * 60 * 50,
    },
  ],
};

interface AppStore {
  activeView: "editor" | "snippets" | "snippet-detail" | "profile";
  selectedSnippetId: string | null;
  isCheatSheetOpen: boolean;
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  starredSnippetIds: string[];
  snippets: Snippet[];
  comments: Record<string, SnippetComment[]>;
  executions: CodeExecutionRecord[];

  setActiveView: (view: "editor" | "snippets" | "snippet-detail" | "profile", snippetId?: string) => void;
  setIsCheatSheetOpen: (open: boolean) => void;
  updateUserProfile: (name: string, email: string) => void;
  toggleStarSnippet: (snippetId: string) => void;
  createSnippet: (title: string, language: string, code: string) => Snippet;
  deleteSnippet: (snippetId: string) => void;
  addComment: (snippetId: string, content: string) => void;
  deleteComment: (snippetId: string, commentId: string) => void;
  addExecutionRecord: (language: string, code: string, output?: string, error?: string) => void;
  getUserStats: () => UserStats;
}

export const useAppStore = create<AppStore>((set, get) => {
  // Load local state
  const loadLocal = <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const savedStarred = loadLocal<string[]>("codecraft_starred_snippets", ["snip-1", "snip-3"]);
  const savedSnippets = loadLocal<Snippet[]>("codecraft_snippets", INITIAL_SNIPPETS);
  const savedComments = loadLocal<Record<string, SnippetComment[]>>("codecraft_comments", INITIAL_COMMENTS);
  const savedExecutions = loadLocal<CodeExecutionRecord[]>("codecraft_executions", [
    {
      _id: "exec-init-1",
      userId: "user-current",
      language: "javascript",
      code: "console.log('Welcome to Code Craft!');",
      output: "Welcome to Code Craft!",
      _creationTime: Date.now() - 1000 * 60 * 30,
    },
  ]);

  return {
    activeView: "editor",
    selectedSnippetId: null,
    isCheatSheetOpen: false,
    currentUser: {
      id: "user-current",
      name: "Developer",
      email: "developer@codecraft.io",
      avatar: "/photo.jpg",
    },
    starredSnippetIds: savedStarred,
    snippets: savedSnippets,
    comments: savedComments,
    executions: savedExecutions,

    setActiveView: (view, snippetId) => {
      set({
        activeView: view,
        selectedSnippetId: snippetId !== undefined ? snippetId : get().selectedSnippetId,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    setIsCheatSheetOpen: (open) => set({ isCheatSheetOpen: open }),

    updateUserProfile: (name, email) => {
      set((state) => ({
        currentUser: {
          ...state.currentUser,
          name,
          email,
        },
      }));
    },

    toggleStarSnippet: (snippetId) => {
      const { starredSnippetIds, snippets } = get();
      const isStarred = starredSnippetIds.includes(snippetId);
      const nextStarred = isStarred
        ? starredSnippetIds.filter((id) => id !== snippetId)
        : [...starredSnippetIds, snippetId];

      const nextSnippets = snippets.map((s) => {
        if (s._id === snippetId) {
          return {
            ...s,
            starsCount: Math.max(0, (s.starsCount || 0) + (isStarred ? -1 : 1)),
          };
        }
        return s;
      });

      localStorage.setItem("codecraft_starred_snippets", JSON.stringify(nextStarred));
      localStorage.setItem("codecraft_snippets", JSON.stringify(nextSnippets));

      set({
        starredSnippetIds: nextStarred,
        snippets: nextSnippets,
      });
    },

    createSnippet: (title, language, code) => {
      const { currentUser, snippets } = get();
      const newSnippet: Snippet = {
        _id: `snip-${Date.now()}`,
        _creationTime: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        language,
        code,
        title,
        starsCount: 0,
      };

      const updated = [newSnippet, ...snippets];
      localStorage.setItem("codecraft_snippets", JSON.stringify(updated));
      set({ snippets: updated });
      return newSnippet;
    },

    deleteSnippet: (snippetId) => {
      const updated = get().snippets.filter((s) => s._id !== snippetId);
      localStorage.setItem("codecraft_snippets", JSON.stringify(updated));
      set({ snippets: updated });
    },

    addComment: (snippetId, content) => {
      const { currentUser, comments } = get();
      const newComment: SnippetComment = {
        _id: `comm-${Date.now()}`,
        snippetId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content,
        _creationTime: Date.now(),
      };

      const snippetComments = comments[snippetId] || [];
      const updatedComments = {
        ...comments,
        [snippetId]: [...snippetComments, newComment],
      };

      localStorage.setItem("codecraft_comments", JSON.stringify(updatedComments));
      set({ comments: updatedComments });
    },

    deleteComment: (snippetId, commentId) => {
      const { comments } = get();
      const snippetComments = comments[snippetId] || [];
      const updatedComments = {
        ...comments,
        [snippetId]: snippetComments.filter((c) => c._id !== commentId),
      };

      localStorage.setItem("codecraft_comments", JSON.stringify(updatedComments));
      set({ comments: updatedComments });
    },

    addExecutionRecord: (language, code, output, error) => {
      const { currentUser, executions } = get();
      const newRecord: CodeExecutionRecord = {
        _id: `exec-${Date.now()}`,
        userId: currentUser.id,
        language,
        code,
        output,
        error,
        _creationTime: Date.now(),
      };

      const updated = [newRecord, ...executions].slice(0, 100);
      localStorage.setItem("codecraft_executions", JSON.stringify(updated));
      set({ executions: updated });
    },

    getUserStats: () => {
      const { executions } = get();
      const languagesMap: Record<string, number> = {};
      executions.forEach((e) => {
        languagesMap[e.language] = (languagesMap[e.language] || 0) + 1;
      });

      const languages = Object.keys(languagesMap);
      let favoriteLanguage = "javascript";
      let maxCount = 0;
      for (const [lang, count] of Object.entries(languagesMap)) {
        if (count > maxCount) {
          maxCount = count;
          favoriteLanguage = lang;
        }
      }

      return {
        totalExecutions: executions.length,
        languagesCount: languages.length,
        languages,
        lastActive: executions[0]?._creationTime || Date.now(),
        favoriteLanguage,
      };
    },
  };
});
