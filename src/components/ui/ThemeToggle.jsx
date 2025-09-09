import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

// Segmented pill style (sun/moon) with active side highlighted
export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.15)] backdrop-blur-md p-1 hide-when-cart-open ${className}`}
      role="group"
      aria-label="Theme selector"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        className={`h-8 w-12 rounded-full flex items-center justify-center transition-all
          ${!isDark ? 'bg-amber-100 border border-amber-300 text-amber-700 shadow-sm' : 'text-gray-500 dark:text-gray-300'}`}
        title="מצב בהיר"
      >
        <Sun className={`h-4 w-4 ${!isDark ? 'text-amber-700' : 'text-gray-500 dark:text-gray-300'}`} />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        className={`h-8 w-12 rounded-full flex items-center justify-center transition-all
          ${isDark ? 'bg-cyan-900/30 border border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.35)]' : 'text-gray-500 dark:text-gray-300'}`}
        title="מצב כהה"
      >
        <Moon className={`h-4 w-4 ${isDark ? 'text-cyan-200' : 'text-gray-500 dark:text-gray-300'}`} />
      </button>
    </div>
  );
}


