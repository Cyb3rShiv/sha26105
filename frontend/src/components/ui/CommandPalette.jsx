import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { NAV_ITEMS } from '../navModel';
import Modal from './Modal';

/**
 * ⌘K / Ctrl+K command palette — instant keyboard navigation across
 * every view. Light-theme first, fast, and accessible.
 */
export default function CommandPalette({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_ITEMS;
    return NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // keep the highlighted row in view
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const choose = (item) => {
    if (!item) return;
    onNavigate(item.id);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[activeIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(Math.max(0, results.length - 1));
    }
  };

  return (
    <Modal open={open} onClose={onClose} label="Command palette" maxWidth="max-w-xl">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="flex items-center gap-3 px-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-4 h-4 text-teal-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={results[activeIndex] ? `cmd-${results[activeIndex].id}` : undefined}
            aria-label="Search views and actions"
            placeholder="Jump to any module — try 'monte carlo', 'optimizer', 'rbi'…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-900 placeholder:text-slate-400 py-3.5 font-mono"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[9.5px] font-mono text-slate-500 border border-slate-200 bg-white rounded px-1.5 py-0.5 shadow-xs">
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          id="command-palette-list"
          role="listbox"
          aria-label="Views"
          className="max-h-[50vh] overflow-y-auto p-2 divide-y divide-slate-100"
        >
          {results.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                id={`cmd-${item.id}`}
                role="option"
                aria-selected={isActive}
                data-active={isActive}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => choose(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive ? 'bg-teal-50/80 text-teal-950 font-medium' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-md border shrink-0 ${
                    isActive
                      ? 'bg-teal-700 border-teal-800 text-white'
                      : 'bg-white border-slate-200 text-slate-600 shadow-xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-bold truncate text-slate-900">{item.label}</span>
                  <span className="block text-[10px] font-mono text-slate-400 tracking-wider uppercase">{item.group}</span>
                </span>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
                {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
              </button>
            );
          })}

          {results.length === 0 && (
            <div className="py-10 text-center text-xs font-mono text-slate-400">
              No matching modules or actions found
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 bg-slate-50">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              <ArrowDown className="w-3 h-3" />
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              Select
            </span>
          </span>
          <span className="tracking-wider uppercase font-semibold text-slate-500">CYBERQUANT COMMAND</span>
        </div>
      </div>
    </Modal>
  );
}
