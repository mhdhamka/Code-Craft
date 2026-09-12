/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Toaster } from "react-hot-toast";
import { NavigationHeader } from "./components/NavigationHeader";
import { Footer } from "./components/Footer";
import { CheatSheetModal } from "./components/CheatSheetModal";
import { EditorView } from "./components/views/EditorView";
import { SnippetsView } from "./components/views/SnippetsView";
import { SnippetDetailView } from "./components/views/SnippetDetailView";
import { ProfileView } from "./components/views/ProfileView";
import { useAppStore } from "./store/useAppStore";

export default function App() {
  const { activeView } = useAppStore();

  // If in editor view, render the authentic full-screen VS Code IDE
  if (activeView === "editor") {
    return (
      <>
        <EditorView />
        <CheatSheetModal />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#252526",
              color: "#cccccc",
              border: "1px solid #3c3c3c",
              borderRadius: "0.375rem",
              fontSize: "0.75rem",
              fontFamily: "inherit",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            },
            success: {
              iconTheme: {
                primary: "#007acc",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#f48771",
                secondary: "#1e1e1e",
              },
            },
          }}
        />
      </>
    );
  }

  // Secondary views (Snippets library, Snippet detail, Profile)
  return (
    <div className="min-h-screen bg-[#181818] text-gray-200 flex flex-col font-sans selection:bg-[#007acc]/40 selection:text-white relative">
      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavigationHeader />

        <main className="flex-1 flex flex-col">
          {activeView === "snippets" && <SnippetsView />}
          {activeView === "snippet-detail" && <SnippetDetailView />}
          {activeView === "profile" && <ProfileView />}
        </main>

        <Footer />
      </div>

      <CheatSheetModal />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#252526",
            color: "#cccccc",
            border: "1px solid #3c3c3c",
            borderRadius: "0.375rem",
            fontSize: "0.75rem",
            fontFamily: "inherit",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: {
              primary: "#007acc",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f48771",
              secondary: "#1e1e1e",
            },
          },
        }}
      />
    </div>
  );
}
