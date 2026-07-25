"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetProductByIdQuery, useGetProductsQuery } from "@/store/apis/productsApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/common/SkeletonLoaders";
import FrequentlyBoughtTogether from "@/components/shop/FrequentlyBoughtTogether";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = params.id as string;

  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId);
  const { data: allProducts } = useGetProductsQuery();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "ingredients" | "benefits">("details");
  const [imageLoaded, setImageLoaded] = useState(false);

  const { addViewed } = useRecentlyViewed();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = product ? wishlistItems.some((item) => item.id === product.id) : false;

  // Track this product as recently viewed
  useEffect(() => {
    if (product) {
      addViewed(product.id);
    }
  }, [product, addViewed]);

  const relatedProducts = allProducts?.filter(
    (p) => p.category === product?.category && p.id !== product?.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity,
      })
    );
    dispatch(setCartOpen(true));
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
      })
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-32 mt-4" />
            <Skeleton className="h-14 w-full mt-6 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error / Not found
  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-24 flex flex-col items-center text-center">
        <div className="h-16 w-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-6">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm">
          The product you&apos;re looking for doesn&apos;t exist or has been removed from our catalog.
        </p>
        <Button onClick={() => router.push("/shop")} variant="teal" leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-5">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="hover:text-teal transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-teal transition-colors capitalize">{product.category}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#f0f7f4] to-[#e8f0ec] border border-border-custom shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={cn(
                  "object-cover transition-all duration-700",
                  imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
                )}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Badges on image */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                {product.featured && <Badge variant="teal">Bestseller</Badge>}
                {product.stock <= 10 && product.stock > 0 && <Badge variant="warning">Low Stock</Badge>}
                {product.stock <= 0 && <Badge variant="danger">Out of Stock</Badge>}
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Category */}
            <span className="text-xs font-bold text-teal uppercase tracking-widest">{product.category}</span>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4.5 w-4.5",
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewsCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">${product.price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector + Add to Cart (Single Row) */}
            <div className="flex flex-row items-center gap-3 w-full mt-2">
              {/* Quantity */}
              <div className="flex items-center border border-border-custom rounded-xl overflow-hidden bg-white flex-shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-foreground hover:bg-teal/5 transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-foreground border-x border-border-custom py-2.5">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-foreground hover:bg-teal/5 transition-colors disabled:opacity-40"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart (No Price) */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2.5 disabled:opacity-50",
                  isAdding
                    ? "bg-accent text-white"
                    : "bg-teal text-white hover:bg-teal-light hover:shadow-lg"
                )}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {isAdding ? "Added! ✓" : "Add to Cart"}
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className={cn(
                "flex items-center justify-center gap-2 py-3 border rounded-xl text-sm font-medium transition-all w-full",
                isWishlisted
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-border-custom bg-white text-muted-foreground hover:border-red-200 hover:text-red-400"
              )}
            >
              <Heart className={cn("h-4.5 w-4.5", isWishlisted && "fill-current")} />
              {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { icon: Truck, label: "Free Shipping", desc: "Orders over $50" },
                { icon: ShieldCheck, label: "Secure Payment", desc: "SSL encrypted" },
                { icon: RotateCcw, label: "Easy Returns", desc: "30-day policy" },
                { icon: Leaf, label: "Clean Formula", desc: "Paraben-free" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)] border border-border-custom">
                  <badge.icon className="h-4.5 w-4.5 text-teal flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{badge.label}</p>
                    <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs: Centered Details / Ingredients / Benefits */}
        <div className="mt-16 border-t border-border-custom pt-10 flex flex-col items-center">
          <div className="flex gap-1 mb-8 border border-border-custom rounded-xl p-1 w-fit bg-white mx-auto">
            {(["details", "ingredients", "benefits"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all",
                  activeTab === tab
                    ? "bg-teal text-white shadow-sm"
                    : "text-muted-foreground hover:text-teal hover:bg-teal/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto text-center flex flex-col items-center"
          >
            {activeTab === "details" && (
              <div className="flex flex-col items-center gap-4 text-center w-full">
                <h3 className="text-lg font-display font-bold text-foreground">Product Details</h3>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{product.details}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-md">
                  <div className="p-4 rounded-xl border border-border-custom bg-white">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Category</p>
                    <p className="text-sm font-bold text-foreground capitalize">{product.category}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border-custom bg-white">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Stock</p>
                    <p className="text-sm font-bold text-foreground">{product.stock} units available</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="flex flex-col items-center gap-4 text-center w-full">
                <h3 className="text-lg font-display font-bold text-foreground">Key Ingredients</h3>
                {product.ingredients?.length ? (
                  <div className="flex flex-col gap-3 w-full max-w-lg">
                    {product.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-center gap-3 p-4 rounded-xl border border-border-custom bg-white text-center">
                        <Leaf className="h-4.5 w-4.5 text-teal flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{ing}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Ingredient information is currently being updated.</p>
                )}
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="flex flex-col items-center gap-4 text-center w-full">
                <h3 className="text-lg font-display font-bold text-foreground">Key Benefits</h3>
                {product.benefits?.length ? (
                  <div className="flex flex-col gap-3 w-full max-w-lg">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center justify-center gap-3 p-4 rounded-xl border border-border-custom bg-white text-center">
                        <CheckCircle2 className="h-4.5 w-4.5 text-accent flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Benefit details are currently being updated.</p>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Frequently Bought Together — Apriori-style */}
        <FrequentlyBoughtTogether
          currentProductId={product.id}
          currentProduct={product}
        />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-14 border-t border-border-custom pt-10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-semibold text-teal uppercase tracking-wider">You may also like</span>
                <h2 className="text-2xl font-display font-bold text-foreground mt-1">Related Products</h2>
              </div>
              <Link href={`/shop?category=${product.category}`} className="text-sm font-semibold text-teal hover:text-primary flex items-center gap-1 transition-colors">
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/shop/${rp.id}`}>
                  <div className="group rounded-2xl border border-border-custom bg-white overflow-hidden hover-lift card-shadow cursor-pointer">
                    <div className="relative aspect-[4/3] bg-gradient-to-b from-[#f0f7f4] to-[#e8f0ec] overflow-hidden">
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-teal">{rp.category}</span>
                      <h3 className="text-sm font-display font-semibold text-foreground line-clamp-1">{rp.name}</h3>
                      <span className="text-base font-extrabold text-foreground">${rp.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recently Viewed — tracked via localStorage */}
      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
