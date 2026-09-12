import { useState } from "react";
import { X, Copy, Check, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import { CHEAT_SHEETS, LANGUAGE_CONFIG } from "../constants";
import { useAppStore } from "../store/useAppStore";
import { useCodeEditorStore } from "../store/useCodeEditorStore";

export function CheatSheetModal() {
  const { isCheatSheetOpen, setIsCheatSheetOpen, setActiveView } = useAppStore();
  const { setLanguage, editor } = useCodeEditorStore();
  const [selectedLang, setSelectedLang] = useState<string>("python");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isCheatSheetOpen) return null;

  const currentSheet = CHEAT_SHEETS.find((c) => c.language === selectedLang) || CHEAT_SHEETS[0];
  const langConfig = LANGUAGE_CONFIG[selectedLang] || LANGUAGE_CONFIG.python;

  const handleCopy = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      toast.success("Snippet copied");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleInjectCode = (code: string) => {
    setLanguage(selectedLang);
    if (editor) {
      editor.setValue(code);
    }
    localStorage.setItem(`editor-code-${selectedLang}`, code);
    setIsCheatSheetOpen(false);
    setActiveView("editor");
    toast.success(`Loaded into Editor (${langConfig.label})`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#161622] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="cheat-sheet-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a28]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Cheat Sheets</h3>
              <p className="text-xs text-gray-400">Quick syntax references & idiomatic patterns</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCheatSheetOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-[#13131d] overflow-x-auto">
          {CHEAT_SHEETS.map((sheet) => {
            const isSelected = selectedLang === sheet.language;
            const config = LANGUAGE_CONFIG[sheet.language];
            return (
              <button
                key={sheet.language}
                type="button"
                onClick={() => setSelectedLang(sheet.language)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                {config && (
                  <img
                    src={config.logoPath}
                    alt={config.label}
                    className="w-4 h-4 object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span>{sheet.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentSheet.tips.map((tip, idx) => (
            <div
              key={tip.title}
              className="p-4 rounded-xl bg-[#11111a] border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-200">{tip.title}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(tip.code, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInjectCode(tip.code)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    <span>Run in Editor</span>
                  </button>
                </div>
              </div>

              <pre className="p-3 rounded-lg bg-[#0a0a0f] text-gray-300 font-mono text-xs overflow-x-auto border border-white/5 whitespace-pre-wrap">
                {tip.code}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
