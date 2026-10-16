'use client';

import React from 'react';
import { Download, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  pageTheme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenExport: () => void;
  onOpenInfoModal?: () => void;
}

export function Navbar({
  pageTheme,
  onToggleTheme,
  onOpenExport,
}: NavbarProps) {
  const isDark = pageTheme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--surface-border)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="w-full px-5 h-12 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs tracking-tight">
            N
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Native Splash
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--button-hover)] transition"
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-medium text-xs transition active:scale-[0.98] shadow-sm"
          >
            <Download size={13} />
            <span>Export</span>
            <kbd className="hidden sm:inline text-[10px] opacity-60 ml-0.5 font-mono">⌘E</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
