"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Product, useGetProductsQuery } from "@/store/apis/productsApi";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { usePurchaseHistory } from "@/hooks/usePurchaseHistory";
import { cn } from "@/lib/utils";

/*  ──────────────────────────────────────────────────────────
 *  APRIORI-BASED ASSOCIATION RULE MINING
 *  ──────────────────────────────────────────────────────────
 *
 *  The classic Apriori algorithm works in two phases:
 *
 *  1. FREQUENT ITEMSET GENERATION
 *     Scan all transaction baskets and find item pairs (2-itemsets)
 *     whose support (fraction of baskets containing both items)
 *     exceeds a minimum support threshold.
 *
 *  2. ASSOCIATION RULE GENERATION
 *     From each frequent 2-itemset {A, B}, generate the rule:
 *       A → B  with confidence = support({A,B}) / support({A})
 *     Keep rules above a minimum confidence threshold.
 *
 *  In production this would run server-side on order history.
 *  Here it runs client-side on localStorage transaction data,
 *  with seed baskets providing cold-start recommendations.
 *  ────────────────────────────────────────────────────────── */

// ─── SEED BASKETS (cold-start until real purchases accumulate) ───
// These represent common skincare/haircare routines new stores
// would pre-populate. They are progressively outweighed as
// real transactions grow.
const SEED_BASKETS: string[][] = [
  // Morning routine: Serum → Moisturizer → Sunblock
  ["prod-1", "prod-2", "prod-4"],
  ["prod-3", "prod-2", "prod-4"],
  ["prod-1", "prod-8", "prod-9"],
  ["prod-3", "prod-8", "prod-4"],
  // Night routine: Serum → Cream
  ["prod-1", "prod-2", "prod-7"],
  ["prod-7", "prod-8", "prod-3"],
  ["prod-1", "prod-8"],
  // Hair routine: Shampoo → Conditioner → Mask
  ["prod-5", "prod-6", "prod-10"],
  ["prod-5", "prod-6"],
  ["prod-6", "prod-10"],
  // Cross-category bundles
  ["prod-1", "prod-4", "prod-5"],
  ["prod-2", "prod-9", "prod-6"],
  ["prod-3", "prod-4", "prod-6", "prod-10"],
  ["prod-7", "prod-2", "prod-5"],
];

// ─── APRIORI CONFIG ─────────────────────────────────────────
const MIN_SUPPORT = 0.05;       // Minimum fraction of baskets containing {A,B}
const MIN_CONFIDENCE = 0.15;    // Minimum P(B|A) to keep a rule
const MAX_RECOMMENDATIONS = 2;  // Show top N co-purchased products

interface AssociationRule {
  consequentId: string;
  confidence: number;  // P(B|A) = support({A,B}) / support({A})
  support: number;     // Number of baskets containing {A,B}
  lift: number;        // lift = confidence / P(B) — measures surprise
}

/**
 * Full Apriori-style association rule mining.
 * Operates on the combined set of seed + real transaction baskets.
 *
 * @param baskets      All transaction baskets (product ID arrays)
 * @param antecedentId The current product to find rules for
 * @returns            Sorted association rules
 */
function mineAssociationRules(
  baskets: string[][],
  antecedentId: string
): AssociationRule[] {
  const totalBaskets = baskets.length;
  if (totalBaskets === 0) return [];

  // ── Phase 1: Calculate item supports ──────────────────────
  const itemSupport: Record<string, number> = {};
  for (const basket of baskets) {
    const unique = new Set(basket);
    for (const item of unique) {
      itemSupport[item] = (itemSupport[item] || 0) + 1;
    }
  }

  const antecedentCount = itemSupport[antecedentId] || 0;
  if (antecedentCount === 0) return [];

  // ── Phase 2: Count 2-itemset co-occurrences ───────────────
  const coOccurrences: Record<string, number> = {};
  for (const basket of baskets) {
    const unique = new Set(basket);
    if (!unique.has(antecedentId)) continue;

    for (const item of unique) {
      if (item !== antecedentId) {
        coOccurrences[item] = (coOccurrences[item] || 0) + 1;
      }
    }
  }

  // ── Phase 3: Generate & filter association rules ──────────
  const rules: AssociationRule[] = [];

  for (const [consequentId, pairCount] of Object.entries(coOccurrences)) {
    const pairSupport = pairCount / totalBaskets;

    // Prune: minimum support threshold
    if (pairSupport < MIN_SUPPORT) continue;

    const confidence = pairCount / antecedentCount;

    // Prune: minimum confidence threshold
    if (confidence < MIN_CONFIDENCE) continue;

    // Lift: how much more likely B is given A vs. B alone
    const consequentProbability = (itemSupport[consequentId] || 0) / totalBaskets;
    const lift = consequentProbability > 0 ? confidence / consequentProbability : 0;

    rules.push({
      consequentId,
      confidence,
      support: pairCount,
      lift,
    });
  }

  // Sort by confidence (primary), then by lift (secondary)
  rules.sort((a, b) => b.confidence - a.confidence || b.lift - a.lift);

  return rules;
}

// ─── COMPONENT ──────────────────────────────────────────────

interface FrequentlyBoughtTogetherProps {
  currentProductId: string;
  currentProduct: Product;
}

export default function FrequentlyBoughtTogether({
  currentProductId,
  currentProduct,
}: FrequentlyBoughtTogetherProps) {
  const dispatch = useAppDispatch();
  const { data: allProducts } = useGetProductsQuery();
  const { getBaskets, transactionCount } = usePurchaseHistory();
  const [addedAll, setAddedAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Combine real purchase history + seed baskets (seed weight decreases as real data grows)
  const recommendations = useMemo(() => {
    if (!allProducts) return [];

    const realBaskets = getBaskets();

    // Blend strategy: always include seed baskets but as real data grows,
    // seed influence naturally diminishes since Apriori is frequency-based.
    // With 0 real transactions → 100% seed influence
    // With 50+ real transactions → seed is <25% of total baskets
    const combinedBaskets = [...realBaskets, ...SEED_BASKETS];

    const rules = mineAssociationRules(combinedBaskets, currentProductId);

    // Take top N recommendations
    const topRules = rules.slice(0, MAX_RECOMMENDATIONS);

    const products: (Product & { confidence: number; lift: number; support: number })[] = [];
    for (const rule of topRules) {
      const product = allProducts.find((p) => p.id === rule.consequentId);
      if (product && product.stock > 0) {
        products.push({
          ...product,
          confidence: rule.confidence,
          lift: rule.lift,
          support: rule.support,
        });
      }
    }

    return products;
  }, [currentProductId, allProducts, getBaskets]);

  // Initialize selection with all recommendations
  React.useEffect(() => {
    if (recommendations.length > 0) {
      setSelectedIds(new Set([currentProductId, ...recommendations.map((r) => r.id)]));
    }
  }, [recommendations, currentProductId]);

  if (recommendations.length === 0) return null;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (id === currentProductId) return next; // Can't deselect current product
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allBundleProducts = [currentProduct, ...recommendations];
  const selectedProducts = allBundleProducts.filter((p) => selectedIds.has(p.id));
  const bundleTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleSavings = bundleTotal * 0.1; // 10% bundle discount
  const bundleFinalPrice = bundleTotal - bundleSavings;

  const handleAddBundle = () => {
    for (const product of selectedProducts) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
        })
      );
    }
    dispatch(setCartOpen(true));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  // Determine data source label
  const isUsingRealData = transactionCount > 0;

  return (
    <section className="mt-14 border-t border-border-custom pt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">Frequently Bought Together</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on {isUsingRealData ? `${transactionCount} real purchase${transactionCount > 1 ? "s" : ""}` : "curated skincare routines"}
            </p>
          </div>
        </div>

        {/* Data source indicator */}
        {isUsingRealData && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent bg-accent/8 px-3 py-1.5 rounded-full w-fit">
            <TrendingUp className="h-3 w-3" />
            <span>Live Algorithm · Auto-updating</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Product Bundle Visual — Horizontally Scrollable on Mobile */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 -mx-4 px-4 w-screen sm:w-auto sm:-mx-0 sm:px-0 sm:pb-0 sm:flex-wrap flex-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {allBundleProducts.map((product, i) => {
            const isSelected = selectedIds.has(product.id);
            const isCurrent = product.id === currentProductId;
            const isRecommendation = "confidence" in product;
            return (
              <React.Fragment key={product.id}>
                {i > 0 && (
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-teal/10 text-teal flex-shrink-0">
                    <Plus className="h-4 w-4" />
                  </div>
                )}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => toggleSelection(product.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-between rounded-2xl border-2 p-4 w-40 h-[290px] transition-all duration-200 flex-shrink-0 sm:flex-shrink",
                    isSelected
                      ? "border-teal bg-teal/5 shadow-sm"
                      : "border-border-custom bg-white opacity-50",
                    isCurrent && "cursor-default"
                  )}
                >
                  {/* Checkmark */}
                  <div className={cn(
                    "absolute top-2.5 right-2.5 h-5 w-5 rounded-full flex items-center justify-center transition-all",
                    isSelected ? "bg-teal text-white" : "bg-slate-100 text-transparent"
                  )}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-gradient-to-b from-[#f0f7f4] to-[#e8f0ec] mb-2.5">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-teal">{product.category}</span>
                    <h4 className="text-xs font-semibold text-foreground line-clamp-2 text-center mt-1 leading-snug">
                      {product.name.replace("Dulcis ", "")}
                    </h4>
                  </div>

                  <div className="flex flex-col items-center w-full mt-auto">
                    <span className="text-sm font-extrabold text-foreground">${product.price.toFixed(2)}</span>

                    {/* Confidence + Lift badges */}
                    {isRecommendation && "lift" in product && (
                      <div className="flex flex-col items-center gap-0.5 mt-1.5">
                        <span className="text-[8px] font-bold text-teal/80">
                          {Math.round(((product as any).confidence ?? 0) * 100)}% confidence
                        </span>
                        <span className="text-[7px] font-semibold text-muted-foreground">
                          {((product as any).lift ?? 0).toFixed(1)}× lift
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bundle Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-72 p-5 rounded-2xl border border-teal/20 bg-teal/5 flex flex-col gap-4 flex-shrink-0"
        >
          <div className="text-sm">
            <div className="flex justify-between items-center text-muted-foreground font-medium mb-1.5">
              <span>Bundle ({selectedProducts.length} items)</span>
              <span className="line-through">${bundleTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-accent font-bold text-xs mb-1.5">
              <span>Bundle Discount (10%)</span>
              <span>-${bundleSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-foreground font-extrabold text-lg border-t border-teal/15 pt-2.5 mt-2.5">
              <span>Total</span>
              <span>${bundleFinalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleAddBundle}
            disabled={selectedIds.size !== allBundleProducts.length}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2",
              addedAll
                ? "bg-accent text-white"
                : "bg-teal text-white hover:bg-teal-light disabled:opacity-50"
            )}
          >
            {addedAll ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Bundle Added!
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add Bundle to Cart
              </>
            )}
          </button>
          <p className="text-[10px] text-muted-foreground text-center">
            Save 10% when you buy these together
          </p>
        </motion.div>
      </div>
    </section>
  );
}
