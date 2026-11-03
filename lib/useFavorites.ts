'use client';

// imports
import { useCallback, useMemo, useSyncExternalStore } from 'react';

// storage
const KEY = 'favorites';
const listeners = new Set<() => void>();

// subscribe
function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

// snapshots
const getSnapshot = () => localStorage.getItem(KEY) ?? '[]';
const getServerSnapshot = () => '[]';

// parse json
function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// favorites hook
export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const favorites = useMemo(() => parse(raw), [raw]);

  // toggle favorite
  const toggle = useCallback((code: string) => {
    const current = parse(getSnapshot());
    const next = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    localStorage.setItem(KEY, JSON.stringify(next));
    listeners.forEach((l) => l());
  }, []);

  return { favorites, toggle };
}