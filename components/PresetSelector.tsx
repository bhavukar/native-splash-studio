'use client';

import React, { useState, useMemo } from 'react';
import { ANIMATION_TEMPLATES } from '../lib/templates';
import { AnimationTemplateId } from '../lib/types';
import { Search, Sparkles, X, Check } from 'lucide-react';

interface PresetSelectorProps {
  selectedId: AnimationTemplateId;
  onSelect: (id: AnimationTemplateId) => void;
  accentColor: string;
}

const CATEGORIES = ['All', 'Minimal', 'Modern', 'Cinematic', 'High Energy', 'Luxury'] as const;

export function PresetSelector({
  selectedId,
  onSelect,
}: PresetSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return ANIMATION_TEMPLATES.filter((tpl) => {
      const matchesCategory =
        activeCategory === 'All' || tpl.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.tagline.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Header & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Motion Library
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded-full border border-[var(--surface-border)]">
            {filteredTemplates.length} presets
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 24 native presets..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-[var(--surface-subtle)] border border-[var(--surface-border)] focus:border-zinc-500 rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-semibold shadow-sm border border-zinc-600'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Cards List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filteredTemplates.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-muted)]">
            No animation presets found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredTemplates.map((tpl) => {
            const isSelected = tpl.id === selectedId;

            return (
              <button
                key={tpl.id}
                onClick={() => onSelect(tpl.id)}
                className={`group w-full text-left p-2.5 rounded-lg border transition-all duration-150 relative ${
                  isSelected
                    ? 'bg-zinc-800/90 border-zinc-500 text-zinc-100 shadow-sm dark:bg-zinc-800/90 dark:border-zinc-500 dark:text-zinc-100 ring-1 ring-zinc-500/30'
                    : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] hover:border-zinc-500/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                    )}
                    <span className="text-xs font-medium text-[var(--text-primary)] truncate">
                      {tpl.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0 bg-[var(--surface-card)] px-1.5 py-0.5 rounded border border-[var(--surface-border)]">
                    {tpl.defaultDurationMs}ms
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2 mb-2">
                  {tpl.tagline}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1.5 border-t border-[var(--surface-border)]">
                  <span className="truncate max-w-[150px] opacity-80">
                    {tpl.category}
                  </span>
                  <span className="truncate max-w-[130px] opacity-60">
                    {tpl.androidInterpolator.replace('@android:interpolator/', '')}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
