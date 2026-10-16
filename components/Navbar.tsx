'use client';

import React from 'react';
import { Download, Terminal, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  pageTheme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenExport: () => void;
  onOpenInfoModal: () => void;
}

export function Navbar({
  pageTheme,
  onToggleTheme,
  onOpenExport,
  onOpenInfoModal,
}: NavbarProps) {
  const isDark = pageTheme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--surface-border)] bg-[var(--header-bg)] backdrop-blur-md transition-colors duration-200">
      <div className="w-full px-4 h-13 flex items-center justify-between">
        {/* Brand & Studio Engine Status */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[var(--surface-subtle)] border border-[var(--surface-border)] flex items-center justify-center text-[var(--text-secondary)]">
            <Terminal size={14} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-tight text-[var(--text-primary)]">
              native-splash
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] border border-[var(--surface-border)] rounded px-1.5 py-0.5">
              studio v2.5
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-[var(--surface-border)] text-[10px] font-mono text-[var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>24 Native Motion Engines</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Page Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-hover)] transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle page theme"
          >
            {isDark ? (
              <>
                <Sun size={13} className="text-amber-400" />
                <span className="hidden sm:inline text-[11px] font-mono">Light</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-zinc-600" />
                <span className="hidden sm:inline text-[11px] font-mono">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenInfoModal}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1.5 rounded-md hover:bg-[var(--button-hover)] transition font-medium"
          >
            Architecture
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent-btn-bg)] hover:opacity-90 text-[var(--accent-btn-text)] font-semibold text-xs transition active:scale-[0.98] shadow-sm"
          >
            <Download size={13} />
            <span>Export Code</span>
            <kbd className="hidden sm:inline text-[9px] font-mono opacity-60 ml-0.5">⌘E</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
