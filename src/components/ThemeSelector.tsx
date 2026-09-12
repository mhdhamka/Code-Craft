import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, Moon, Sun, Laptop, Cloud, Check } from "lucide-react";
import { THEMES } from "../constants";
import { useCodeEditorStore } from "../store/useCodeEditorStore";

const THEME_ICONS: Record<string, typeof Moon> = {
  "vs-dark": Moon,
  "vs-light": Sun,
  "github-dark": Laptop,
  monokai: Laptop,
  "solarized-dark": Cloud,
};

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const CurrentIcon = THEME_ICONS[currentTheme.id] || Palette;

  return (
    <div className="relative" ref={dropdownRef} id="theme-selector-container">
      <button
        id="theme-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-3 py-2 bg-[#1e1e2e]/90 hover:bg-[#28283d] rounded-xl transition-all duration-200 border border-white/10 hover:border-purple-500/40 shadow-sm cursor-pointer"
      >
        <CurrentIcon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
        <span className="text-xs font-semibold text-gray-200 group-hover:text-white min-w-[70px] text-left">
          {currentTheme.label}
        </span>
        <div
          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
          style={{ backgroundColor: currentTheme.color }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-52 bg-[#181825] border border-white/15 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl"
            id="theme-dropdown-menu"
          >
            <div className="px-3 pb-2 mb-1 border-b border-white/10">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Select Theme</p>
            </div>

            <div className="px-1 space-y-0.5">
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                const IconComponent = THEME_ICONS[t.id] || Palette;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeSelect(t.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-xs font-medium cursor-pointer ${
                      isSelected
                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 text-gray-400" />
                    <span className="flex-1 text-left">{t.label}</span>
                    <div
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: t.color }}
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 ml-1" />}
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
