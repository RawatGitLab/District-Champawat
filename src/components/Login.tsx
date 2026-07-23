import React, { useState } from "react";
import { Compass, User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginProps {
  onLoginSuccess: () => void;
  theme?: "light" | "dark";
}

export default function Login({ onLoginSuccess, theme = "light" }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const envUsername = import.meta.env.VITE_GEOPORTAL_USERNAME || "champawatgeoportal";
  const envPassword = import.meta.env.VITE_GEOPORTAL_PASSWORD || "giscell5605";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError("Please enter both username and password.");
      return;
    }

    if (trimmedUser === envUsername && trimmedPass === envPassword) {
      sessionStorage.setItem("isGeoportalAuthenticated", "true");
      onLoginSuccess();
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 font-sans select-none animate-fadeIn">
      {/* Glassmorphic Login Card overlaying background application without blur */}
      <div className={`border shadow-2xl rounded-2xl max-w-md w-full p-8 relative transition-all ${
        theme === "light"
          ? "bg-slate-100/90 border-white/80 text-slate-800"
          : "bg-slate-900/90 border-slate-700/80 text-slate-100"
      }`}>
        {/* Top Icon Badge */}
        <div className="flex justify-center mb-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-sm ${
            theme === "light"
              ? "bg-indigo-100/80 text-indigo-600 border-indigo-200/60"
              : "bg-indigo-900/50 text-indigo-400 border-indigo-700/50"
          }`}>
            <Compass className="w-7 h-7" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-6">
          <h1 className={`text-xl font-extrabold tracking-tight ${theme === "light" ? "text-slate-800" : "text-white"}`}>
            Champawat Geoportal
          </h1>
          <p className={`text-xs mt-1.5 leading-relaxed font-medium px-2 ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
            Authorized Access Only. Please sign in to explore interactive district maps &amp; planners.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2 text-xs text-red-600 font-medium animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 block ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}
            >
              USERNAME
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className={`w-full rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all font-medium border ${
                  theme === "light"
                    ? "bg-slate-100/90 border-slate-300/80 text-slate-800 focus:bg-white"
                    : "bg-slate-800/90 border-slate-700 text-slate-100 focus:bg-slate-800"
                }`}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="password" 
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 block ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}
            >
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full rounded-lg pl-10 pr-10 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all font-medium border ${
                  theme === "light"
                    ? "bg-slate-100/90 border-slate-300/80 text-slate-800 focus:bg-white"
                    : "bg-slate-800/90 border-slate-700 text-slate-100 focus:bg-slate-800"
                }`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-lg text-sm shadow-md hover:shadow-indigo-500/20 transition-all duration-150 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            Explore Geoportal
          </button>
        </form>

        {/* Footer info */}
        <div className="border-t border-slate-300/60 my-6"></div>
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.25em] text-center block">
          CHAMPAWAT • GEOPORTAL
        </span>
      </div>
    </div>
  );
}
