"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ShoppingBag, Phone, Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMobileNavOpen, toggleCart } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isOpen = useAppSelector((state) => state.ui.mobileNavOpen);
  const cartQuantity = useAppSelector((state) => state.cart.totalQuantity);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleLinkClick = () => {
    dispatch(setMobileNavOpen(false));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setMobileNavOpen(false))}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-full max-w-80 bg-[var(--background)] border-r border-border-custom p-6 shadow-2xl flex flex-col md:hidden rounded-r-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
              <Link href="/" className="flex items-center" onClick={handleLinkClick}>
                <div className="relative h-9 w-20 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Dulcis Skincare Logo"
                    width={80}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </Link>
              <button
                onClick={() => dispatch(setMobileNavOpen(false))}
                className="p-2 rounded-xl border border-border-custom hover:bg-teal/8 text-muted-foreground hover:text-teal transition-all"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "text-base font-semibold transition-all py-3 px-4 rounded-xl flex items-center justify-between",
                      isActive
                        ? "bg-teal/8 text-teal"
                        : "text-muted-foreground hover:bg-teal/5 hover:text-teal"
                    )}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-border-custom flex flex-col gap-4">
              <button
                onClick={() => {
                  dispatch(setMobileNavOpen(false));
                  dispatch(toggleCart());
                }}
                className="flex items-center justify-between w-full px-4 py-3.5 bg-teal text-white text-sm font-semibold rounded-2xl hover:bg-teal-light transition-colors shadow-sm"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="h-4.5 w-4.5" />
                  Shopping Cart
                </span>
                <span className="bg-accent px-2.5 py-0.5 rounded-full text-xs font-bold text-white">
                  {cartQuantity}
                </span>
              </button>

              <div className="flex flex-col gap-2.5 text-xs text-muted-foreground px-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>+1 (800) 555-DULCIS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>support@dulcisbeauty.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
