"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ChevronRight, ShoppingBag, X } from "lucide-react";
import { motion } from "framer-motion";
import { Product, useGetProductsQuery } from "@/store/apis/productsApi";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

interface RecentlyViewedProps {
  /** Product ID to exclude from the list (e.g. the current product) */
  excludeId?: string;
}

export default function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const dispatch = useAppDispatch();
  const { viewedIds, clearViewed } = useRecentlyViewed();
  const { data: allProducts } = useGetProductsQuery();

  // Resolve IDs to full product objects, excluding the current product
  const recentProducts: Product[] = [];
  if (allProducts && viewedIds.length > 0) {
    for (const id of viewedIds) {
      if (id === excludeId) continue;
      const product = allProducts.find((p) => p.id === id);
      if (product) recentProducts.push(product);
    }
  }

  if (recentProducts.length === 0) return null;

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    dispatch(setCartOpen(true));
  };

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 my-12 py-10 px-6 sm:px-10 bg-[#f8fbf9] border border-border-custom rounded-[32px] max-w-7xl xl:mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">
            Your Browsing History
          </span>
          <h2 className="text-2xl font-display font-bold text-foreground mt-1">
            Recently Viewed
          </h2>
        </div>
        <button
          onClick={clearViewed}
          className="text-xs font-semibold text-muted-foreground hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Clear History
        </button>
      </div>

      {/* Horizontal Scroll Strip */}
      <div className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {recentProducts.slice(0, 8).map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 w-48"
          >
            <Link href={`/shop/${product.id}`} className="group block">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#f0f7f4] to-[#e8f0ec] border border-border-custom mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="192px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Quick add button */}
                <button
                  onClick={(e) => handleQuickAdd(product, e)}
                  className="absolute bottom-2.5 right-2.5 h-9 w-9 bg-teal text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-teal-light hover:scale-110"
                  aria-label="Quick add to cart"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="px-0.5">
                <span className="text-[9px] uppercase tracking-widest font-bold text-teal">{product.category}</span>
                <h3 className="text-xs font-display font-semibold text-foreground line-clamp-1 mt-0.5">{product.name}</h3>
                <span className="text-sm font-extrabold text-foreground">${product.price.toFixed(2)}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
