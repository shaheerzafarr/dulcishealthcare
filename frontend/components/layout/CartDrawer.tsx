"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingCart, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateQuantity, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { toggleCart } from "@/store/slices/uiSlice";
import { usePurchaseHistory } from "@/hooks/usePurchaseHistory";
import Button from "../ui/Button";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.cartOpen);
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalAmount = useAppSelector((state) => state.cart.totalAmount);

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { recordTransaction } = usePurchaseHistory();

  const handleQuantityChange = (id: string, currentQty: number, change: number, stock: number) => {
    const newQty = currentQty + change;
    if (newQty > 0 && newQty <= stock) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Record this basket as a real transaction for the Apriori algorithm
    const productIds = cartItems.map((item) => item.id);
    recordTransaction(productIds);

    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      dispatch(clearCart());
    }, 1500);
  };

  const resetDrawer = () => {
    setCheckoutSuccess(false);
    dispatch(toggleCart());
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
            onClick={resetDrawer}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-border-custom shadow-2xl flex flex-col p-6 rounded-l-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-custom">
              <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2.5">
                <ShoppingCart className="h-5 w-5 text-teal" />
                Shopping Cart
              </h2>
              <button
                onClick={resetDrawer}
                className="p-2 rounded-xl border border-border-custom hover:bg-teal/8 text-muted-foreground hover:text-teal transition-all"
                aria-label="Close cart drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {checkoutSuccess ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12 px-6">
                <div className="h-16 w-16 bg-accent/15 text-accent rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                  <ShieldCheck className="h-9 w-9" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Order Successfully Simulated!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  Your skincare routine items have been prepared. This was a simulated checkout since no backend is configured yet.
                </p>
                <Button onClick={resetDrawer} variant="primary" className="w-full">
                  Continue Browsing
                </Button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                <div className="h-16 w-16 bg-teal/8 rounded-2xl flex items-center justify-center mb-5">
                  <ShoppingCart className="h-8 w-8 text-teal/40" />
                </div>
                <h3 className="text-base font-display font-bold text-foreground mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-muted-foreground max-w-64 mb-6">
                  Add serums, moisturizers, or hair products to your cart to checkout.
                </p>
                <Button
                  onClick={() => {
                    dispatch(toggleCart());
                    window.location.href = "/shop";
                  }}
                  variant="outline"
                  size="sm"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3.5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3.5 rounded-2xl border border-border-custom bg-[var(--background)] relative group hover:border-teal/20 transition-all duration-200"
                    >
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-white border border-border-custom flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-col flex-1 min-w-0 pr-6">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-foreground line-clamp-1 mb-1">
                          {item.name}
                        </h4>
                        <span className="text-sm font-extrabold text-teal mb-2">
                          ${item.price.toFixed(2)}
                        </span>

                        {/* Quantity */}
                        <div className="flex items-center gap-2 mt-auto">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1, item.stock)}
                            className="p-1.5 rounded-lg bg-white border border-border-custom hover:border-teal/30 text-foreground transition-all"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1, item.stock)}
                            className="p-1.5 rounded-lg bg-white border border-border-custom hover:border-teal/30 text-foreground transition-all"
                            disabled={item.quantity >= item.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors p-1.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Checkout Panel */}
                <div className="pt-4 border-t border-border-custom mt-auto flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="text-base font-bold text-foreground">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className="text-sm font-semibold text-accent">
                      {totalAmount >= 50 ? "FREE" : "$5.99"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base border-t border-dashed border-border-custom pt-3">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-lg font-extrabold text-teal">
                      ${(totalAmount + (totalAmount >= 50 ? 0 : 5.99)).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    isLoading={isCheckingOut}
                    variant="primary"
                    className="w-full mt-2 h-12 bg-teal hover:bg-teal-light"
                  >
                    Secure Checkout
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    Secure transactions processed under encrypted SSL protocols.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
