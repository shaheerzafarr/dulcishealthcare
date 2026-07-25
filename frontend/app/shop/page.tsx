"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  X,
  Sparkles,
  Droplets,
  Heart,
  Smile,
  ShieldAlert
} from "lucide-react";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/store/apis/productsApi";
import { useAppSelector } from "@/store";
import ProductCard from "@/components/shop/ProductCard";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import { ProductGridSkeleton, FilterSidebarSkeleton } from "@/components/common/SkeletonLoaders";
import Button from "@/components/ui/Button";

const iconMap: Record<string, React.ComponentType<any>> = {
  Activity: Smile,
  Pill: Droplets,
  Shield: Sparkles,
  Moon: Heart,
  Sparkles: Sparkles,
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const showWishlistOnly = searchParams.get("filter") === "wishlist";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchVal, setSearchVal] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchVal(searchParams.get("search") || "");
    setDebouncedSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal) {
        params.set("search", searchVal);
      } else {
        params.delete("search");
      }
      router.push(`/shop?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchVal, router, searchParams]);

  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: debouncedSearch || undefined,
  });

  const processedProducts = useMemo(() => {
    if (!products) return [];

    let list = [...products];

    if (showWishlistOnly) {
      list = list.filter((product) =>
        wishlistItems.some((wish) => wish.id === product.id)
      );
    }

    list = list.filter((product) => product.price <= priceRange);

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, showWishlistOnly, wishlistItems, priceRange, sortBy]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(searchParams.toString());
    if (catId && catId !== "all") {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    params.delete("filter");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchVal("");
    setDebouncedSearch("");
    setPriceRange(100);
    setSortBy("featured");
    router.push("/shop");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-grow w-full text-left">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-border-custom">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">
            {showWishlistOnly ? "Your Favourites" : "Product Catalog"}
          </span>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1">
            {showWishlistOnly ? "My Wishlist" : "Shop Active Formulas"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {showWishlistOnly
              ? `You have bookmarked ${wishlistItems.length} products.`
              : `Browse ${processedProducts.length} bio-active cosmetics for modern routines.`}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <ArrowUpDown className="h-4 w-4 text-teal" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-4 border border-border-custom bg-white text-foreground rounded-xl outline-none focus:border-teal text-sm font-medium transition-colors cursor-pointer"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 rounded-2xl border border-border-custom bg-white p-6 card-shadow sticky top-24">
          {categoriesLoading ? (
            <FilterSidebarSkeleton />
          ) : (
            <div className="flex flex-col gap-8 text-left">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal border-b border-border-custom pb-3 mb-4">
                  Categories
                </h3>
                <div className="flex flex-col gap-1.5">
                  {categories?.map((cat) => {
                    const Icon = iconMap[cat.icon] || Droplets;
                    const isActive = selectedCategory === cat.id && !showWishlistOnly;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
                          isActive
                            ? "bg-teal text-white shadow-sm"
                            : "text-muted-foreground hover:bg-teal/5 hover:text-teal"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal border-b border-border-custom pb-3 mb-4">
                  Price Limit
                </h3>
                <div className="flex justify-between items-center text-sm font-medium mb-3">
                  <span className="text-muted-foreground">Max:</span>
                  <span className="text-teal font-bold">${priceRange.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-teal/15 rounded-full appearance-none cursor-pointer accent-teal"
                />
              </div>

              {/* Reset */}
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="w-full"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9 flex flex-col gap-6">

          {/* Search + Mobile Filter */}
          <div className="flex gap-3 items-center w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search serums, moisturizers, sunblocks..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border-custom bg-white text-sm font-normal outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all text-foreground"
              />
            </div>

            <Button
              onClick={() => setMobileFilterOpen(true)}
              variant="outline"
              className="lg:hidden h-12 px-5 rounded-2xl gap-2"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
              <span className="text-sm font-semibold">Filter</span>
            </Button>
          </div>

          {/* Products */}
          {productsLoading ? (
            <ProductGridSkeleton count={6} />
          ) : processedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border-custom bg-white">
              <div className="h-14 w-14 bg-teal/8 text-teal rounded-2xl flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-base font-display font-bold text-foreground mb-1">
                No products match your filters
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                Try resetting your search, widening the price range, or clearing filters.
              </p>
              <Button onClick={clearAllFilters} variant="teal">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
              {processedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-80 bg-white h-full p-6 shadow-2xl flex flex-col gap-6 ml-auto overflow-y-auto rounded-l-3xl animate-fade-in-up">
            <div className="flex justify-between items-center pb-4 border-b border-border-custom">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-xl border border-border-custom hover:bg-teal/8 text-muted-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Categories */}
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal mb-3">
                Categories
              </h4>
              <div className="flex flex-col gap-1.5">
                {categories?.map((cat) => {
                  const Icon = iconMap[cat.icon] || Droplets;
                  const isActive = selectedCategory === cat.id && !showWishlistOnly;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategorySelect(cat.id);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
                        isActive
                          ? "bg-teal text-white shadow-sm"
                          : "text-muted-foreground hover:bg-teal/5 hover:text-teal"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal mb-3">
                Price Limit (${priceRange.toFixed(2)})
              </h4>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-teal/15 rounded-full appearance-none cursor-pointer accent-teal"
              />
            </div>

            <Button
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
              variant="outline"
              className="mt-auto w-full"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      )}
      {/* Recently Viewed */}
      <RecentlyViewed />

    </div>
  );
}
