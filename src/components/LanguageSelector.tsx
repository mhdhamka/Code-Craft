import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { LANGUAGE_CONFIG } from "../constants";
import { useCodeEditorStore } from "../store/useCodeEditorStore";

interface LanguageSelectorProps {
  hasAccess?: boolean;
}

export function LanguageSelector({ hasAccess = true }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} id="language-selector-container">
      <button
        id="language-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-3.5 py-2 bg-[#1e1e2e]/90 hover:bg-[#28283d] rounded-xl transition-all duration-200 border border-white/10 hover:border-blue-500/40 shadow-sm cursor-pointer"
      >
        <div className="w-5 h-5 rounded-md bg-[#13131f] p-0.5 flex items-center justify-center ring-1 ring-white/10 group-hover:scale-105 transition-transform">
          <img
            src={currentLanguageObj.logoPath}
            alt={currentLanguageObj.label}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-xs font-semibold text-gray-200 group-hover:text-white min-w-[70px] text-left">
          {currentLanguageObj.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 group-hover:text-gray-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-60 bg-[#181825] border border-white/15 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl"
            id="language-dropdown-menu"
          >
            <div className="px-3 pb-2 mb-1 border-b border-white/10 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Select Language</p>
              <span className="text-[10px] text-blue-400 font-mono">11 runtimes</span>
            </div>

            <div className="max-h-[290px] overflow-y-auto px-1 space-y-0.5">
              {Object.values(LANGUAGE_CONFIG).map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageSelect(lang.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-xs font-medium cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-[#13131f] p-1 flex items-center justify-center ring-1 ring-white/10 flex-shrink-0">
                      <img
                        src={lang.logoPath}
                        alt={lang.label}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="flex-1 text-left">{lang.label}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{lang.runtime.version}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
