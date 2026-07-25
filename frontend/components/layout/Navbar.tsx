"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Menu, Search, X, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleCart, toggleMobileNav } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  if (!mounted) return null;

  const isHome = pathname === "/";

  return (
    <>
      {/* Top Promo Banner */}
      <div className="bg-gradient-teal text-white text-center py-2 px-4 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
        ✨ Free priority shipping on orders over $50.00 — Science meets nature
      </div>

      <header
        className={cn(
          "w-full transition-all duration-300 border-b",
          isHome
            ? scrolled
              ? "fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-md border-border-custom"
              : "absolute top-10 left-0 right-0 z-40 bg-transparent border-transparent"
            : scrolled
              ? "sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-md border-border-custom"
              : "sticky top-0 z-40 bg-transparent border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center active:scale-98 transition-transform">
            <div className="relative h-10 w-24 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Dulcis Health Care Logo"
                width={90}
                height={45}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-full",
                    isActive
                      ? "text-teal bg-teal/8"
                      : "text-muted-foreground hover:text-teal hover:bg-teal/5"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-teal/8 hover:text-teal transition-all active:scale-90"
              aria-label="Toggle Search bar"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Profile */}
            <Link
              href="/shop"
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-teal/8 hover:text-teal transition-all active:scale-90 hidden sm:inline-flex"
              aria-label="View Profile"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/shop?filter=wishlist"
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-teal/8 hover:text-teal transition-all relative active:scale-90"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2.5 rounded-xl bg-teal/10 text-teal hover:bg-teal hover:text-white transition-all duration-300 relative active:scale-90 shadow-sm"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white border-2 border-[var(--background)] shadow-sm animate-pulse-soft">
                  {cartQuantity}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => dispatch(toggleMobileNav())}
              className="md:hidden p-2.5 rounded-xl text-muted-foreground hover:bg-teal/8 hover:text-teal transition-all active:scale-90"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="absolute top-18 left-0 w-full bg-[var(--background)] border-b border-border-custom p-4 shadow-lg animate-fade-in-up">
            <div className="mx-auto max-w-3xl relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search serums, moisturizers, sunblocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 rounded-2xl border border-border-custom outline-none bg-white text-foreground focus:border-teal focus:ring-2 focus:ring-teal/10 text-sm"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 h-12 bg-teal text-white text-sm font-semibold rounded-2xl hover:bg-teal-light active:scale-98 transition-all shadow-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
