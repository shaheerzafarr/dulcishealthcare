"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/store/apis/productsApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import Badge from "../ui/Badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
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
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative flex flex-col h-full rounded-2xl border border-border-custom bg-white overflow-hidden transition-all duration-300 hover-lift card-shadow cursor-pointer"
    >
      {/* Wishlist Heart */}
      <button
        onClick={handleToggleWishlist}
        className={cn(
          "absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-10 p-2 sm:p-2.5 rounded-xl border bg-white/90 backdrop-blur-sm transition-all duration-200 active:scale-90 shadow-sm",
          isWishlisted
            ? "text-red-500 fill-red-500 border-red-200"
            : "text-muted-foreground border-border-custom hover:text-red-400 hover:border-red-200"
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isWishlisted && "fill-current")} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-[#f0f7f4] to-[#e8f0ec] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={product.featured}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={cn(
            "object-cover object-center transition-all duration-700 group-hover:scale-105",
            imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full py-3 bg-teal/95 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-teal transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
          >
            <ShoppingBag className="h-4 w-4" />
            {isAdding ? "Added!" : "Quick Add to Cart"}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute bottom-2 left-2 sm:bottom-3.5 sm:left-3.5 flex flex-wrap gap-1 pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
          {product.stock <= 0 ? (
            <Badge variant="danger" className="text-[8px] sm:text-xs">Out of stock</Badge>
          ) : product.stock <= 10 ? (
            <Badge variant="warning" className="text-[8px] sm:text-xs">Low stock</Badge>
          ) : null}
          {product.featured && <Badge variant="teal" className="text-[8px] sm:text-xs">Bestseller</Badge>}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-3 sm:p-5 text-left">
        <span className="text-[9px] sm:text-[10px] font-bold text-teal uppercase tracking-widest mb-1 sm:mb-1.5">
          {product.category}
        </span>

        <h3 className="font-display font-semibold text-xs sm:text-sm text-foreground line-clamp-1 mb-0.5 sm:mb-1">
          {product.name}
        </h3>

        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 flex-1 mb-2.5 sm:mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5 sm:mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3 sm:h-3.5 sm:w-3.5",
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-foreground">{product.rating}</span>
        </div>

        {/* Price & Add Button */}
        <div className="flex justify-between items-center mt-auto pt-2.5 sm:pt-4 border-t border-border-custom">
          <span className="text-sm sm:text-lg font-extrabold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={cn(
              "px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95",
              isAdding
                ? "bg-accent text-white"
                : "bg-teal text-white hover:bg-teal-light"
            )}
          >
            {isAdding ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
