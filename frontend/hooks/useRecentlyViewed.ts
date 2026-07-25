"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dulcis_recently_viewed";
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setViewedIds(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Add a product ID to recently viewed
  const addViewed = useCallback((productId: string) => {
    setViewedIds((prev) => {
      // Remove if already exists, then prepend
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, MAX_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  }, []);

  // Clear all recently viewed
  const clearViewed = useCallback(() => {
    setViewedIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { viewedIds, addViewed, clearViewed };
}
