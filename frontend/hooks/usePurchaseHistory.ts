"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dulcis_purchase_history";

export interface TransactionBasket {
  id: string;
  productIds: string[];
  timestamp: number;
}

const MAX_BASKETS = 200;

/**
 * Hook for managing real purchase transaction history in localStorage.
 * Each checkout creates a basket of product IDs that were bought together.
 * The Apriori algorithm mines these baskets for association rules.
 */
export function usePurchaseHistory() {
  const [baskets, setBaskets] = useState<TransactionBasket[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBaskets(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Record a new transaction basket (called on checkout)
  const recordTransaction = useCallback((productIds: string[]) => {
    if (productIds.length < 2) return; // Need at least 2 items for association

    setBaskets((prev) => {
      const newBasket: TransactionBasket = {
        id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productIds: [...new Set(productIds)], // deduplicate
        timestamp: Date.now(),
      };

      const updated = [newBasket, ...prev].slice(0, MAX_BASKETS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  }, []);

  // Get all baskets (for the Apriori algorithm)
  const getBaskets = useCallback((): string[][] => {
    return baskets.map((b) => b.productIds);
  }, [baskets]);

  // Get total transaction count
  const transactionCount = baskets.length;

  // Clear all history
  const clearHistory = useCallback(() => {
    setBaskets([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { baskets, recordTransaction, getBaskets, transactionCount, clearHistory };
}
