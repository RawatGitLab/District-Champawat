import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-1.5 rounded-lg border transition duration-150 cursor-pointer flex items-center justify-center bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 shadow-sm"
      title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-slate-300" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
