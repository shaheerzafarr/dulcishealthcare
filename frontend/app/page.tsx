"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Plus,
  Shield,
  Sparkles,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Lock,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetProductsQuery,
  Product,
} from "@/store/apis/productsApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { setCartOpen } from "@/store/slices/uiSlice";

/* ─────────────────── static data ─────────────────── */

const dariMoochSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000",
    tagline: "DULCIS HEALTHCARE",
    title: "FOR SKIN THAT STAYS RADIANT",
    buttonText: "SHOP SERUMS",
    link: "/shop?category=serums",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=1000",
    tagline: "DULCIS HEALTHCARE",
    title: "DE-TAN & HYDRATE MOISTURIZER",
    buttonText: "SHOP CREAMS",
    link: "/shop?category=creams",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1000",
    tagline: "DULCIS HEALTHCARE",
    title: "SPF 50+ MINERAL SUNSCREEN",
    buttonText: "SHOP SUNBLOCK",
    link: "/shop?category=sunblock",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=1000",
    tagline: "DULCIS HEALTHCARE",
    title: "HAIR FOLLICLE REPAIR COMPLEX",
    buttonText: "SHOP HAIRCARE",
    link: "/shop?category=haircare",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000",
    tagline: "DULCIS HEALTHCARE",
    title: "SCIENCE MEETS NATURAL BEAUTY",
    buttonText: "EXPLORE ALL",
    link: "/shop",
  },
];

const categoryCards = [
  {
    id: "serums",
    name: "Serums",
    count: "120+ Items",
    color: "#E5ECE6",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "creams",
    name: "Creams",
    count: "90+ Items",
    color: "#E2E7ED",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "sunblock",
    name: "Sunblock",
    count: "75+ Items",
    color: "#F5EBE1",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "haircare",
    name: "Hair Care",
    count: "60+ Items",
    color: "#EAEAEA",
    image:
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "all",
    name: "All Products",
    count: "45+ Items",
    color: "#EFF4E8",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
  },
];

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Verified Buyer",
    text: "Dulcis products completely transformed my daily skincare routine. Amazing quality and super fast delivery!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Sophia Martinez",
    role: "Verified Buyer",
    text: "The Niacinamide serum balanced my skin within ten days. Clean, luxurious packaging and zero harsh additives.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Michael Chen",
    role: "Verified Buyer",
    text: "I bought the entire hair and face care set. Highly effective botanical formulas that deliver on every promise.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
];

const filterTabs = [
  { id: "all", label: "New Arrivals" },
  { id: "bestseller", label: "Best Seller" },
  { id: "trending", label: "Trending" },
  { id: "discount", label: "Discount" },
] as const;

type TabId = (typeof filterTabs)[number]["id"];

/* ─────────────────── Component ─────────────────── */

export default function HomePage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);

  const { data: allProducts } = useGetProductsQuery();

  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  /* quiz */
  const [quizStep, setQuizStep] = useState(0);
  const [quizConcern, setQuizConcern] = useState("");
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(
    null,
  );

  useEffect(() => {
    const t = setInterval(
      () => setActiveTestimonial((p) => (p + 1) % testimonials.length),
      5500,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % dariMoochSlides.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, []);

  /* ── helpers ── */

  const addItem = (p: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    dispatch(
      addToCart({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        stock: p.stock,
      }),
    );
    dispatch(setCartOpen(true));
  };

  const toggleWish = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        stock: p.stock,
      }),
    );
  };

  const filteredProducts = (() => {
    if (!allProducts) return [];
    switch (activeTab) {
      case "bestseller":
        return allProducts.filter((p) => p.featured).slice(0, 4);
      case "trending":
        return allProducts.filter((p) => p.rating >= 4.8).slice(0, 4);
      case "discount":
        return allProducts.filter((p) => p.price < 30).slice(0, 4);
      default:
        return allProducts.slice(0, 4);
    }
  })();

  /* quiz helpers */
  const startQuiz = () => {
    setQuizStep(1);
    setQuizConcern("");
    setRecommendedProduct(null);
  };
  const pickConcern = (c: string) => {
    setQuizConcern(c);
    setQuizStep(2);
  };
  const pickSkin = () => {
    const map: Record<string, string> = {
      acne: "prod-7",
      dryness: "prod-2",
      dullness: "prod-3",
      aging: "prod-8",
      hair: "prod-5",
    };
    const id = map[quizConcern] ?? "prod-1";
    const found = allProducts?.find((p) => p.id === id) ?? null;
    setRecommendedProduct(found);
    setQuizStep(3);
  };

  /* ─────────── JSX ─────────── */
  return (
    <div className="w-full bg-[var(--background)]">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — HERO
          - Mobile (lg:hidden): Dari Mooch style edge-to-edge Slideshow Banner
          - Desktop (hidden lg:block): Novara rounded split card
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pt-20 lg:pt-32 px-0 lg:px-8 max-w-[1360px] mx-auto">
        {/* ── MOBILE DARI MOOCH STYLE SLIDESHOW BANNER (visible on mobile lg:hidden) ── */}
        <div className="block lg:hidden w-full relative">
          {/* Banner Image Container - Aspect 4/5 full bleed */}
          <div className="relative aspect-[4/5] sm:aspect-[16/9] w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeroSlide}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={dariMoochSlides[activeHeroSlide].image}
                  alt={dariMoochSlides[activeHeroSlide].title}
                  fill
                  priority
                  className="object-cover"
                />
                {/* Dark gradient overlay at bottom for bold white text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Text & Button Overlay positioned at bottom center like Dari Mooch */}
            <div className="absolute bottom-6 left-5 right-5 z-10 flex flex-col items-center text-center text-white gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/90 drop-shadow-sm">
                {dariMoochSlides[activeHeroSlide].tagline}
              </span>

              <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight uppercase leading-none text-white drop-shadow-lg max-w-xs">
                {dariMoochSlides[activeHeroSlide].title}
              </h1>

              <Link href={dariMoochSlides[activeHeroSlide].link} className="mt-2">
                <button className="h-11 px-7 rounded-full bg-white text-slate-900 hover:bg-teal hover:text-white text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                  {dariMoochSlides[activeHeroSlide].buttonText} <ArrowRight className="h-4 w-4 text-slate-900 group-hover:text-white" />
                </button>
              </Link>
            </div>
          </div>

          {/* Dari Mooch Style Bottom Navigation Controls Bar */}
          <div className="flex items-center justify-center gap-6 py-3 bg-[#ebf2ee] border-b border-border-custom text-foreground">
            <button
              onClick={() =>
                setActiveHeroSlide(
                  (prev) => (prev - 1 + dariMoochSlides.length) % dariMoochSlides.length,
                )
              }
              className="p-1 text-muted-foreground hover:text-foreground active:scale-90 transition-all"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots indicators */}
            <div className="flex items-center gap-2">
              {dariMoochSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeHeroSlide
                      ? "w-6 bg-teal"
                      : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setActiveHeroSlide((prev) => (prev + 1) % dariMoochSlides.length)
              }
              className="p-1 text-muted-foreground hover:text-foreground active:scale-90 transition-all"
              aria-label="Next banner"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── DESKTOP HERO CARD (visible on lg screens) ── */}
        <div className="hidden lg:block relative rounded-[32px] bg-[#f0f7f4] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* ─ left text ─ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="px-14 py-20 flex flex-col items-start gap-5"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal">
                <Sparkles className="h-3.5 w-3.5" />
                New Arrival
              </span>

              <h1 className="text-[56px] leading-[1.15] font-display font-extrabold text-foreground tracking-tight">
                Modern Skincare{" "}
                <span className="text-gradient">Made Beautiful.</span>
              </h1>

              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                Premium skincare collections crafted for comfort, radiance &amp;
                lasting hydration.
              </p>

              {/* CTA row */}
              <div className="flex gap-3 pt-1">
                <Link href="/shop">
                  <button className="h-12 flex items-center justify-center gap-2 bg-teal text-white text-xs font-extrabold uppercase tracking-widest px-7 rounded-full shadow-md hover:bg-teal-light active:scale-95 transition-all">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <button
                  onClick={() =>
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="h-12 flex items-center justify-center gap-2 bg-white text-foreground text-xs font-extrabold uppercase tracking-widest px-7 rounded-full border border-border-custom shadow-2xs hover:border-teal/30 active:scale-95 transition-all"
                >
                  Explore Collections
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-teal/10 text-teal text-[10px]">
                    ↗
                  </span>
                </button>
              </div>

              {/* trust strip */}
              <div className="grid grid-cols-4 gap-x-6 gap-y-3 pt-6 mt-2 border-t border-teal/10 w-full">
                {(
                  [
                    [Shield, "Premium Quality"],
                    [Truck, "Free Shipping"],
                    [RotateCcw, "Easy Returns"],
                    [Headphones, "24/7 Support"],
                  ] as const
                ).map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-teal shrink-0" />
                    <span className="text-[11px] font-bold text-foreground whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ─ right image ─ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-auto h-full min-h-[520px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200"
                alt="Dulcis skincare hero"
                fill
                priority
                className="object-cover"
              />

              {/* floating product badge */}
              {allProducts?.[0] && (
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-lg border border-white/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-[#f0f7f4] border border-border-custom">
                      <Image
                        src={allProducts[0].image}
                        alt={allProducts[0].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {allProducts[0].name}
                      </p>
                      <p className="text-xs font-extrabold text-teal">
                        ${allProducts[0].price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => addItem(allProducts[0], e)}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal text-white hover:bg-teal-light active:scale-90 transition-all shadow-md"
                    aria-label="Add to cart"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — STATS RIBBON  (dark teal rounded bar)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-3 pt-4 sm:px-6 sm:pt-8 lg:px-8 max-w-[1360px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl sm:rounded-3xl bg-[#0a6b5c] grid grid-cols-2 md:grid-cols-4 text-white overflow-hidden"
        >
          {(
            [
              [Award, "500+", "Unique Products"],
              [Heart, "120+", "Premium Brands"],
              [Sparkles, "10K+", "Happy Customers"],
              [Headphones, "24/7", "Customer Support"],
            ] as const
          ).map(([Icon, stat, label], i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 py-5 sm:py-8 ${i % 2 !== 0 ? "border-l border-white/10" : ""
                } ${i >= 2 ? "border-t border-white/10 md:border-t-0 md:border-l" : ""}`}
            >
              <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-accent mb-0.5" />
              <span className="text-xl sm:text-3xl font-display font-extrabold">
                {stat}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-white/80">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — SHOP BY CATEGORY  (pastel cards w/ arrow pill)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="categories"
        className="px-3 py-10 sm:px-6 sm:py-20 lg:px-8 max-w-[1360px] mx-auto"
      >
        {/* header row */}
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-teal mb-0.5">
              Curated Collections
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold text-foreground">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-xs font-bold text-teal hover:text-primary transition-colors"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* card grid — 2 cols mobile, 5 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {categoryCards.map((cat, i) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/shop" : `/shop?category=${cat.id}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-4 sm:p-5 h-[220px] sm:h-[270px] overflow-hidden shadow-sm hover:shadow-xl hover-lift transition-all"
              >
                {/* Background image covering 100% of card */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark overlay gradient for high contrast text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20 group-hover:from-black/85 transition-colors" />

                {/* Text on top */}
                <div className="relative z-10">
                  <h3 className="text-sm sm:text-lg font-display font-extrabold text-white drop-shadow-md">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-white/80 font-bold uppercase tracking-wider">
                    {cat.count}
                  </span>
                </div>

                {/* Arrow pill at bottom */}
                <div className="relative z-10 flex justify-end">
                  <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/95 text-foreground backdrop-blur-sm group-hover:bg-teal group-hover:text-white shadow-md transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — BEST SELLER SPOTLIGHT  (split banner)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-3 sm:px-6 lg:px-8 max-w-[1360px] mx-auto pb-4 sm:pb-6">
        <div className="rounded-3xl sm:rounded-[32px] bg-[#f0f7f4] border border-[#e2eae0] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="px-5 py-8 sm:px-10 sm:py-14 lg:px-14 flex flex-col items-start gap-3 sm:gap-4"
            >
              <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">
                Best Seller
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-[44px] leading-[1.15] font-display font-extrabold text-foreground">
                Comfort That Completes Your Routine.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
                Sleek design. Lasting comfort. Made for modern living.
              </p>
              <span className="text-xl sm:text-3xl font-display font-extrabold text-foreground">
                $499.00
              </span>
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-teal text-white text-xs font-extrabold uppercase tracking-widest px-7 rounded-full shadow-md hover:bg-teal-light active:scale-95 transition-all">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </motion.div>

            {/* image with arch */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[220px] lg:min-h-[420px] bg-gradient-to-br from-[#e8f0ec] to-[#d8e6df]"
            >
              <div className="absolute inset-x-[12%] top-[5%] bottom-0 rounded-t-full bg-white/60 pointer-events-none" />
              <Image
                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=900"
                alt="Best seller"
                fill
                className="object-cover object-center mix-blend-multiply"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — FEATURED PRODUCTS  (tabs + cards grid)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-3 py-10 sm:px-6 sm:py-20 lg:px-8 max-w-[1360px] mx-auto">
        {/* heading row */}
        <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-teal mb-0.5">
              Top Picks
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold text-foreground">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-teal hover:text-primary flex items-center gap-1 transition-colors shrink-0"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* filter tabs — horizontal scrollable on mobile */}
        <div className="flex overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:flex-wrap gap-2 mb-6 sm:mb-8 -mx-3 px-3 sm:mx-0 sm:px-0">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${activeTab === t.id
                  ? "bg-teal text-white shadow-md"
                  : "bg-white text-foreground border border-border-custom hover:border-teal/30"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((prod) => {
              const wished = wishlistItems.some((w) => w.id === prod.id);
              return (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    href={`/shop/${prod.id}`}
                    className="group flex flex-col rounded-2xl sm:rounded-3xl bg-white border border-border-custom overflow-hidden hover-lift transition-all h-full"
                  >
                    {/* image */}
                    <div className="relative aspect-square bg-[#f4f7f5] overflow-hidden">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={(e) => toggleWish(prod, e)}
                        className={`absolute top-2 right-2 z-10 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl border backdrop-blur-sm transition-all active:scale-90 ${wished
                            ? "bg-white text-red-500 border-red-200"
                            : "bg-white/80 text-muted-foreground border-white/60 hover:text-red-500"
                          }`}
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${wished ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>

                    {/* info */}
                    <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-teal transition-colors">
                        {prod.name}
                      </h3>

                      {/* stars */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current"
                            />
                          ))}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground">
                          {prod.rating} ({prod.reviewsCount})
                        </span>
                      </div>

                      {/* price + cart btn */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-custom">
                        <span className="text-xs sm:text-base font-extrabold text-foreground">
                          ${prod.price.toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => addItem(prod, e)}
                          className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full bg-teal text-white hover:bg-teal-light active:scale-90 transition-all shadow-sm"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — PROMO BANNER  (summer sale)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-3 sm:px-6 lg:px-8 max-w-[1360px] mx-auto pb-4 sm:pb-6">
        <div className="relative rounded-3xl sm:rounded-[32px] bg-[#0a6b5c] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* text */}
            <div className="px-5 py-8 sm:px-10 sm:py-14 lg:px-14 flex flex-col items-start gap-3 sm:gap-4 text-white relative z-10">
              <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                Summer Sale
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold leading-tight">
                Up to 30% Off
                <br />
                On Selected Items
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-sm">
                Upgrade your skincare set with bio-active botanical formulas at
                seasonal prices.
              </p>
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-white text-teal text-xs font-extrabold uppercase tracking-widest px-7 rounded-full shadow-md hover:bg-white/90 active:scale-95 transition-all">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* image */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[200px]">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
                alt="Summer sale skincare"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 7 — WHY CHOOSE DULCIS  (4 benefit cards)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-3 py-10 sm:px-6 sm:py-20 lg:px-8 max-w-[1360px] mx-auto">
        <h2 className="text-center text-xl sm:text-3xl font-display font-extrabold text-foreground mb-6 sm:mb-10">
          Why Choose Dulcis?
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {(
            [
              [Award, "High Quality", "Crafted with premium bio-active materials."],
              [Truck, "Fast Delivery", "Quick & reliable shipping worldwide."],
              [RotateCcw, "Easy Returns", "Hassle-free 30-day return policy."],
              [Lock, "Secure Payment", "100% secure encrypted checkout."],
            ] as const
          ).map(([Icon, title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-border-custom hover-lift transition-all"
            >
              <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-teal/5 text-teal mb-3 sm:mb-4">
                <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1">
                {title}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 8 — TESTIMONIALS  (split: quote left · image right)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-3 sm:px-6 lg:px-8 max-w-[1360px] mx-auto pb-4 sm:pb-6">
        <div className="rounded-3xl sm:rounded-[32px] bg-white border border-border-custom overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            {/* left – quote */}
            <div className="px-5 py-8 sm:px-10 sm:py-14 lg:px-14 flex flex-col justify-center gap-4 sm:gap-5">
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-teal mb-0.5">
                  Reviews
                </span>
                <h2 className="text-xl sm:text-3xl font-display font-extrabold text-foreground">
                  What Our Customers Say
                </h2>
              </div>

              <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-teal/30" />

              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-sm sm:text-lg font-display font-medium text-foreground italic leading-relaxed"
                >
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </motion.blockquote>
              </AnimatePresence>

              {/* avatar + name */}
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden border-2 border-teal/20 shrink-0">
                  <Image
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>

              {/* dots */}
              <div className="flex gap-2 pt-1">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${i === activeTestimonial
                        ? "w-7 bg-teal"
                        : "w-2.5 bg-teal/20"
                      }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* right – lifestyle image */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[200px]">
              <Image
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800"
                alt="Happy customer"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 9 — SKIN QUIZ  (gradient card wizard)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="quiz-section"
        className="px-3 py-10 sm:px-6 sm:py-20 lg:px-8 max-w-3xl mx-auto"
      >
        <div className="rounded-3xl sm:rounded-[32px] bg-gradient-to-br from-[#0a6b5c] to-[#0082cb] p-6 sm:p-12 shadow-xl text-white relative overflow-hidden">
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {/* step 0 – intro */}
              {quizStep === 0 && (
                <motion.div
                  key="q0"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center gap-3 sm:gap-4"
                >
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Personalized Match
                  </span>
                  <h2 className="text-xl sm:text-3xl font-display font-extrabold">
                    Not Sure What Your Skin Needs?
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 max-w-sm">
                    Take our quick skin quiz and get a tailored routine just for
                    you.
                  </p>
                  <button
                    onClick={startQuiz}
                    className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-white text-teal text-xs font-extrabold uppercase tracking-widest px-7 rounded-full shadow-md hover:bg-white/90 active:scale-95 transition-all mt-2"
                  >
                    Start Skin Quiz <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {/* step 1 */}
              {quizStep === 1 && (
                <motion.div
                  key="q1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3.5"
                >
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Question 1 of 2</span>
                    <button
                      onClick={() => setQuizStep(0)}
                      className="underline hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-bold">
                    What is your primary skin concern?
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[
                      ["Acne & Pores", "acne"],
                      ["Dryness & Flakiness", "dryness"],
                      ["Dullness & Discoloration", "dullness"],
                      ["Fine Lines & Aging", "aging"],
                      ["Hair & Scalp", "hair"],
                    ].map(([label, val]) => (
                      <button
                        key={val}
                        onClick={() => pickConcern(val)}
                        className="w-full text-left py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-semibold transition-all active:scale-98"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* step 2 */}
              {quizStep === 2 && (
                <motion.div
                  key="q2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3.5"
                >
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Question 2 of 2</span>
                    <button
                      onClick={() => setQuizStep(1)}
                      className="underline hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-bold">
                    Sensitivity level?
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[
                      "Highly Sensitive",
                      "Slightly Reactive / Normal",
                      "Resistant / Combination",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={pickSkin}
                        className="w-full text-left py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-semibold transition-all active:scale-98"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* step 3 – result */}
              {quizStep === 3 && recommendedProduct && (
                <motion.div
                  key="q3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-900">
                    Match Found!
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-extrabold">
                    We Recommend
                  </h3>

                  <div className="w-full max-w-sm bg-white rounded-2xl p-3.5 flex items-center gap-3 text-foreground text-left shadow-lg">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[#f4f7f5] shrink-0">
                      <Image
                        src={recommendedProduct.image}
                        alt={recommendedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold truncate">
                        {recommendedProduct.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {recommendedProduct.description}
                      </p>
                      <p className="text-xs sm:text-sm font-extrabold text-teal mt-0.5">
                        ${recommendedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                    <button
                      onClick={(e) => addItem(recommendedProduct, e)}
                      className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 bg-white text-teal text-xs font-extrabold uppercase tracking-widest px-7 rounded-full shadow-md hover:bg-white/90 active:scale-95 transition-all"
                    >
                      Add To Cart
                    </button>
                    <button
                      onClick={startQuiz}
                      className="text-xs text-white/80 underline hover:text-white"
                    >
                      Retake
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 10 — NEWSLETTER  (dark teal rounded card)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-3 pb-10 sm:px-6 sm:pb-20 lg:px-8 max-w-[1360px] mx-auto">
        <div className="rounded-3xl sm:rounded-[32px] bg-[#0a6b5c] text-white p-6 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center gap-3 sm:gap-4">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-accent">
              Newsletter
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold leading-tight">
              Stay Updated With
              <br />
              Our Latest Offers!
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-md">
              Subscribe to get exclusive discounts, wellness guides, and
              priority access to new product drops.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to Dulcis Healthcare!");
              }}
              className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-1 sm:mt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email…"
                className="w-full sm:flex-1 h-12 px-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto h-12 flex items-center justify-center px-7 bg-white text-teal text-xs font-extrabold uppercase tracking-widest rounded-full shadow-md hover:bg-white/90 active:scale-95 transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

