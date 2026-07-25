"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Plus, Leaf, Droplets, Shield, Sparkles, Star, ChevronRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetFeaturedProductsQuery, useGetCategoriesQuery, Product } from "@/store/apis/productsApi";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";

/* ─── HERO CAROUSEL SLIDES (Picture Post Style) ───────────────── */
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    link: "/shop",
    alt: "Dulcis Premium Skincare Collection Banner"
  },
  {
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800",
    link: "/shop?category=creams",
    alt: "Nourishing Creams & Moisturizers Banner"
  },
  {
    image: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?auto=format&fit=crop&q=80&w=800",
    link: "/shop?category=serums",
    alt: "Targeted Organic Serums Banner"
  },
  {
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800",
    link: "/shop?category=haircare",
    alt: "Sulfate-Free Haircare Systems Banner"
  }
];

function MobileHeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = heroSlides.length;

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide((index + totalSlides) % totalSlides);
  }, [totalSlides]);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide]);

  // Reset auto-play on manual navigation
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAutoPlay();
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <div
      className="relative w-full aspect-[4/5] sm:aspect-[16/10] bg-[#f8f9fa] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Slide Image wrapped entirely in a Link */}
      <Link href={slide.link} className="block w-full h-full relative cursor-pointer">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={currentSlide === 0}
            />
          </motion.div>
        </AnimatePresence>
      </Link>

      {/* Dots Indicator Overlay */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-auto">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => { goToSlide(i); resetAutoPlay(); }}
            className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "w-6 bg-white shadow-sm" : "w-2 bg-white/50"
              }`}
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>

      {/* Chevrons Overlay */}
      <button
        onClick={() => { prevSlide(); resetAutoPlay(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-black/15 active:bg-black/35 rounded-full flex items-center justify-center text-white backdrop-blur-xs transition-colors"
        aria-label="Previous Banner"
      >
        <ChevronRight className="h-4.5 w-4.5 rotate-180" />
      </button>

      <button
        onClick={() => { nextSlide(); resetAutoPlay(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-black/15 active:bg-black/35 rounded-full flex items-center justify-center text-white backdrop-blur-xs transition-colors"
        aria-label="Next Banner"
      >
        <ChevronRight className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { data: featuredProducts } = useGetFeaturedProductsQuery();
  const { data: categories } = useGetCategoriesQuery();

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizConcern, setQuizConcern] = useState("");
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  // Testimonial active state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3); // 3 testimonials total
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const startQuiz = () => {
    setQuizStep(1);
    setQuizConcern("");
    setRecommendedProduct(null);
  };

  const selectConcern = (concern: string) => {
    setQuizConcern(concern);
    setQuizStep(2);
  };

  const selectSkinType = () => {
    let matchedId = "prod-1";
    if (quizConcern === "acne") matchedId = "prod-7";
    if (quizConcern === "dryness") matchedId = "prod-2";
    if (quizConcern === "dullness") matchedId = "prod-3";
    if (quizConcern === "aging") matchedId = "prod-8";
    if (quizConcern === "hair") matchedId = "prod-5";

    let matchedProd: Product | undefined;
    if (featuredProducts) {
      matchedProd = featuredProducts.find((p) => p.id === matchedId);
    }

    if (!matchedProd) {
      const fallbackCatalog: Record<string, Product> = {
        "prod-1": { id: "prod-1", name: "Dulcis Hydrate + Glow Niacinamide Serum", price: 29.00, category: "serums", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", description: "Vibrant daily serum with 10% niacinamide and zinc PCA.", details: "", rating: 4.8, reviewsCount: 142, stock: 50, featured: true },
        "prod-7": { id: "prod-7", name: "Dulcis Clarifying Salicylic Serum", price: 30.00, category: "serums", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600", description: "Targeted 2% BHA salicylic acid serum.", details: "", rating: 4.9, reviewsCount: 220, stock: 20, featured: false },
        "prod-2": { id: "prod-2", name: "Dulcis Daily Renew Gel Moisturizer", price: 28.00, category: "creams", image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600", description: "Ultra-lightweight hydrating gel moisturizer.", details: "", rating: 4.9, reviewsCount: 185, stock: 35, featured: true },
        "prod-3": { id: "prod-3", name: "Dulcis Radiance Vitamin C Serum", price: 32.00, category: "serums", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600", description: "Stabilized 15% Vitamin C serum.", details: "", rating: 4.7, reviewsCount: 96, stock: 45, featured: true },
        "prod-8": { id: "prod-8", name: "Dulcis Ceramide Barrier Cream", price: 34.00, category: "creams", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600", description: "Rich lipid face cream.", details: "", rating: 4.8, reviewsCount: 132, stock: 15, featured: false },
        "prod-5": { id: "prod-5", name: "Dulcis Volumizing Biotin Shampoo", price: 22.00, category: "haircare", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600", description: "Sulfate-free biotin shampoo.", details: "", rating: 4.7, reviewsCount: 115, stock: 25, featured: false },
      };
      matchedProd = fallbackCatalog[matchedId];
    }

    setRecommendedProduct(matchedProd || null);
    setQuizStep(3);
  };

  const addQuizToCart = () => {
    if (recommendedProduct) {
      dispatch(
        addToCart({
          id: recommendedProduct.id,
          name: recommendedProduct.name,
          price: recommendedProduct.price,
          image: recommendedProduct.image,
          category: recommendedProduct.category,
          stock: recommendedProduct.stock,
        })
      );
      dispatch(setCartOpen(true));
    }
  };

  const handleAddToCart = (product: { id: string; name: string; price: number; image: string; category: string; stock: number }) => {
    dispatch(addToCart(product));
    dispatch(setCartOpen(true));
  };

  const editorialProducts = [
    { id: "prod-1", name: "Hydrate + Glow Niacinamide Serum", price: 29.00, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=500", description: "Balance excess lipids and refine skin texture.", category: "serums", stock: 50 },
    { id: "prod-2", name: "Daily Renew Gel Moisturizer", price: 28.00, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=500", description: "Flood skin cells with weightless, active hydration.", category: "creams", stock: 35 },
    { id: "prod-3", name: "Radiance Vitamin C Serum", price: 32.00, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=500", description: "Diminish dark spots and unlock cellular brilliance.", category: "serums", stock: 45 },
  ];

  const trustBadges = [
    { icon: Leaf, label: "Clean & Safe", desc: "Thoughtfully chosen ingredients" },
    { icon: Shield, label: "Dermatologist Tested", desc: "Safe for all skin types" },
    { icon: Droplets, label: "Cruelty Free", desc: "Never tested on animals" },
    { icon: Sparkles, label: "Sustainable", desc: "Eco-conscious packaging" },
  ];

  const testimonials = [
    { name: "Emily R.", location: "New York, USA", text: "The Niacinamide serum balanced my skin within ten days. The lack of synthetic fillers means it absorbs immediately, leaving a completely flat matte barrier.", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" },
    { name: "Jessica M.", location: "Toronto, Canada", text: "I'm highly allergic to synthetic silicones. The Dulcis gel moisturizer relies on plant squalane and green tea hydrosols. Pure genius.", rating: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
    { name: "Priya S.", location: "London, UK", text: "Dulcis has completely transformed my hair volume. The biotin shampoo cleanses without dry stripping my scalp. Incredible botanical chemistry.", rating: 5, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" },
  ];

  return (
    <div className="w-full font-sans antialiased">

      {/* ═══════════════ 1. HERO SECTION (Desktop Only) ═══════════════ */}
      <section className="relative bg-gradient-hero overflow-hidden hidden md:block py-20 lg:py-28 min-h-[90vh] flex items-center">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-teal/5 blur-[120px] pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px] pointer-events-none animate-pulse-soft" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col gap-7 text-left"
            >

              <h1 className="text-5xl sm:text-6xl lg:text-[70px] font-display font-extrabold tracking-tight leading-[1.05] text-foreground">
                Glow Naturally.<br />
                <span className="text-gradient">Healthy Skin</span> Starts Here
              </h1>

              <p className="text-base text-muted-foreground max-w-md leading-relaxed">
                Organic skincare formulated with natural ingredients for everyday use. Clean, effective, and built for your beauty routine.
              </p>

              <div className="flex flex-row items-center gap-4 mt-2">
                <Link href="/shop">
                  <button className="bg-teal text-white hover:bg-teal-light text-xs font-extrabold uppercase tracking-widest py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300">
                    Shop Collection
                  </button>
                </Link>
                <button
                  onClick={() => {
                    const element = document.getElementById("quiz-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white/10 backdrop-blur-md border border-teal/20 text-teal hover:bg-teal/8 text-xs font-extrabold uppercase tracking-widest py-4 px-8 rounded-full transition-all duration-300 hover:scale-102"
                >
                  Learn More
                </button>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-6 mt-4 pt-6 border-t border-border-custom">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=50",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=50",
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=50",
                  ].map((src, i) => (
                    <div key={i} className="relative h-9.5 w-9.5 rounded-full border-2 border-white overflow-hidden shadow-sm">
                      <Image src={src} alt="Customer" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">100% Satisfaction Guarantee</p>
                  <p className="text-xs text-muted-foreground">Certified botanical bio-active solutions</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
            >
              <Image
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200"
                alt="Dulcis botanical serum bottle"
                fill
                className="object-cover"
                priority
              />
              {/* Glassmorphic floating card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-white/80 border border-white/50 shadow-sm flex-shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100"
                      alt="Niacinamide Serum"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs font-extrabold text-foreground line-clamp-1">Hydrate + Glow Niacinamide Serum</h4>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">$29.00</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(editorialProducts[0])}
                  className="h-10 w-10 bg-teal text-white rounded-full flex items-center justify-center hover:bg-teal-light active:scale-95 transition-all shadow-md flex-shrink-0"
                  aria-label="Add to cart"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 2A. MOBILE HERO CAROUSEL ═══════════════ */}
      <section className="md:hidden">
        <MobileHeroCarousel />
      </section>

      {/* ═══════════════ 2B. CATEGORY NAVIGATION (Desktop & Mobile) ═══════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-border-custom relative z-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-row justify-between items-end mb-10">
            <div>
              <span className="text-[10px] font-bold text-teal uppercase tracking-widest block mb-1">Curated Collections</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Shop by Category</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-teal uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1">
              See All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Desktop Grid Layout (Visible on md+) */}
          <div className="hidden md:grid grid-cols-4 gap-8 justify-items-center">
            {categories
              ?.filter((cat) => cat.id !== "all")
              .map((cat) => {
                const categoryImages: Record<string, string> = {
                  serums: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300",
                  creams: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=300",
                  sunblock: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=300",
                  haircare: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=300",
                };

                return (
                  <Link key={cat.id} href={`/shop?category=${cat.id}`} className="group flex flex-col items-center gap-4 text-center cursor-pointer">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border border-border-custom bg-[#f0f7f4] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:border-teal/20">
                      <Image
                        src={categoryImages[cat.id] || categoryImages.serums}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground uppercase tracking-widest group-hover:text-teal transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
          </div>

          {/* Mobile Horizontal Scroll Layout (Visible on mobile only) */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
            {categories
              ?.filter((cat) => cat.id !== "all")
              .map((cat) => {
                const categoryImages: Record<string, string> = {
                  serums: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300",
                  creams: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=300",
                  sunblock: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=300",
                  haircare: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=300",
                };

                return (
                  <Link key={cat.id} href={`/shop?category=${cat.id}`} className="flex flex-col items-center gap-2 flex-shrink-0 w-24">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#111] relative group cursor-pointer border border-border-custom active:scale-95 transition-transform">
                      <Image
                        src={categoryImages[cat.id] || categoryImages.serums}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider text-center line-clamp-1 leading-snug">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
          </div>

        </div>
      </section>
      {/* ═══════════════ 3. BESTSELLER PRODUCTS ═══════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4"
          >
            <div>
              <span className="text-xs font-semibold text-teal uppercase tracking-wider">Curated Essentials</span>
              <h2 className="text-3xl font-display font-bold text-foreground mt-1">Our Bestsellers</h2>
              <p className="text-sm text-muted-foreground mt-1">Curated essentials for every skin type.</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-teal hover:text-primary flex items-center gap-1 transition-colors">
              View All Products
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto py-6 md:grid md:grid-cols-3 md:gap-7 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
            {editorialProducts.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-full md:flex-shrink flex flex-col text-left group rounded-[24px] overflow-hidden bg-white border border-border-custom hover-lift card-shadow hover:shadow-xl transition-all duration-300 h-full"
              >
                <div className="relative aspect-[4/5] bg-gradient-to-b from-[#f0f7f4] to-[#e8f0ec] overflow-hidden">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Heart Favorite Icon */}
                  <button
                    className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm hover:text-red-500 hover:scale-110 active:scale-90 transition-all text-muted-foreground"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-5 flex flex-col gap-1 flex-1">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-teal">{prod.category}</span>
                  <h3 className="text-xs sm:text-sm font-display font-bold text-foreground line-clamp-1 leading-snug">{prod.name}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{prod.description}</p>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mt-1 text-amber-400">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground">(184)</span>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-border-custom">
                    <span className="text-sm sm:text-base font-extrabold text-foreground">
                      ${prod.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="px-4 py-2 bg-teal text-white hover:bg-teal-light rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 2B. PRODUCT FOCUS PILLARS (Editorial) ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background)] border-b border-border-custom relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x md:divide-border-custom">
            {[
              {
                num: "01",
                icon: Droplets,
                title: "Bio-Active Hydration",
                desc: "Floods cellular layers with weightless moisture, maintaining a plump, healthy skin barrier for 24 hours.",
                label: "Moisture Lock"
              },
              {
                num: "02",
                icon: Leaf,
                title: "Clean Botanical Sourcing",
                desc: "Formulated without sulfates, parabens, or synthetic additives. Only clinical-grade organic extracts.",
                label: "Pure Efficacy"
              },
              {
                num: "03",
                icon: Sparkles,
                title: "Cellular Radiance",
                desc: "Stimulates natural cell renewal to noticeably enhance skin tone, luminosity, and texture within weeks.",
                label: "Visible Results"
              },
            ].map((pillar, i) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative p-8 md:p-12 flex flex-col text-left group transition-all duration-300"
                >
                  {/* Large Background Pillar Number */}
                  <div className="absolute top-6 right-8 font-display text-5xl font-extrabold text-teal/8 select-none group-hover:text-teal/15 transition-colors duration-300">
                    {pillar.num}
                  </div>

                  {/* Icon wrapper */}
                  <div className="h-12 w-12 rounded-2xl bg-teal/5 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-all duration-500 mb-6 shadow-sm">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <span className="text-[10px] font-bold text-teal uppercase tracking-widest leading-none mb-2 block">{pillar.label}</span>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ 2C. BRAND STORY SECTION ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Story Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 relative aspect-square rounded-[32px] overflow-hidden shadow-xl border border-border-custom"
            >
              <Image
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"
                alt="Dulcis botanical skincare philosophy"
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>

            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 flex flex-col gap-6 text-left"
            >
              <span className="text-xs font-semibold text-teal uppercase tracking-wider">Our Philosophy</span>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
                Crafted with Nature
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We believe skincare should nourish, not overwhelm your lipid barrier. By blending bio-active science with pure botanical chemistry, we build clean formulations that respect your skin's natural balance.
              </p>

              {/* Cruelty-free/organic metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                {[
                  { label: "100% Cruelty Free", desc: "No animal testing ever." },
                  { label: "Organic Ingredients", desc: "Pure plant squalane & green tea." },
                  { label: "Dermatology Grade", desc: "Zero harsh synthetic fillers." },
                  { label: "Eco-Conscious", desc: "100% recyclable glass containers." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ═══════════════ 4. SKINCARE ROUTINE ═══════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-border-custom">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mb-14"
          >
            <span className="text-xs font-semibold text-teal uppercase tracking-wider">Simple Steps, Powerful Results</span>
            <h2 className="text-3xl font-display font-bold text-foreground mt-1">Your Routine. Your Glow.</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Simple steps for healthy, radiant skin every day. Follow the Dulcis three-step cycle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Cleanse", desc: "Gentle yet effective for fresh skin. Clear dirt and excess lipids to prepare cells.", image: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?auto=format&fit=crop&q=80&w=400" },
              { step: "02", title: "Treat", desc: "Target concerns with powerful actives. Saturate deeper skin structures with niacinamide.", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400" },
              { step: "03", title: "Moisturize", desc: "Lock in hydration and nourish deeply. Re-establish lipid barriers with plant squalane.", image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-4"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#f0f7f4]">
                  <Image
                    src={item.image}
                    alt={`${item.title} step`}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-4 left-4 text-xs font-bold bg-teal text-white py-1.5 px-4 rounded-full">
                    Step {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 5. SKIN QUIZ ═══════════════ */}
      <section id="quiz-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-teal relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-accent/5 blur-xl" />

        <div className="mx-auto max-w-2xl relative z-10">
          <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-2xl">
            <AnimatePresence mode="wait">
              {quizStep === 0 && (
                <motion.div
                  key="quiz-intro"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5 text-left"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-teal uppercase tracking-wider">Personalized Match</span>
                    <h2 className="text-2xl font-display font-bold text-foreground">Not Sure What Your Skin Needs?</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Take our quick skin quiz and get a personalized routine just for you.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 my-1">
                    {[
                      "Personalized Routine",
                      "Expert Recommendations",
                      "Visible Results",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-foreground font-medium">
                        <CheckCircle2 className="h-5 w-5 text-teal flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={startQuiz}
                    className="w-full bg-teal text-white py-3.5 text-sm font-semibold rounded-full transition-all hover:bg-teal-light shadow-md flex items-center justify-center gap-2"
                  >
                    Take Skin Quiz
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {quizStep === 1 && (
                <motion.div
                  key="quiz-q1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-teal uppercase tracking-wider">Question 1 of 2</span>
                    <button onClick={() => setQuizStep(0)} className="text-xs font-semibold text-muted-foreground hover:text-teal transition-colors">Back</button>
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">What is your main skin concern?</h3>

                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: "Acne Congestion & Pores", val: "acne" },
                      { label: "Dehydration & Flakiness", val: "dryness" },
                      { label: "Dullness & Discoloration", val: "dullness" },
                      { label: "Fine Lines & Barrier Damage", val: "aging" },
                      { label: "Frizz & Hair Thinning", val: "hair" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => selectConcern(opt.val)}
                        className="w-full text-left py-3.5 px-5 border border-border-custom rounded-xl hover:border-teal hover:bg-teal/5 bg-transparent text-sm font-medium transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizStep === 2 && (
                <motion.div
                  key="quiz-q2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-teal uppercase tracking-wider">Question 2 of 2</span>
                    <button onClick={() => setQuizStep(1)} className="text-xs font-semibold text-muted-foreground hover:text-teal transition-colors">Back</button>
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">What is your skin sensitivity level?</h3>

                  <div className="flex flex-col gap-2.5">
                    {["Highly Sensitive & Redness Prone", "Slightly Reactive / Normal", "Resistant / Dry-Oil Combo"].map((type) => (
                      <button
                        key={type}
                        onClick={() => selectSkinType()}
                        className="w-full text-left py-3.5 px-5 border border-border-custom rounded-xl hover:border-teal hover:bg-teal/5 bg-transparent text-sm font-medium transition-all"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizStep === 3 && (
                <motion.div
                  key="quiz-result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5 text-center items-center"
                >
                  <span className="text-xs font-semibold text-teal uppercase tracking-wider">Your Match</span>
                  <h3 className="text-xl font-display font-bold text-foreground">We Found Your Perfect Match!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Based on your skin profile, we recommend this formulation:
                  </p>

                  {recommendedProduct && (
                    <div className="w-full max-w-sm rounded-2xl border border-border-custom p-5 bg-[var(--background)] text-left flex gap-4 my-2">
                      <div className="relative h-18 w-18 bg-white rounded-xl flex-shrink-0 border border-border-custom overflow-hidden">
                        <Image
                          src={recommendedProduct.image}
                          alt={recommendedProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-grow min-w-0">
                        <div>
                          <h4 className="font-bold text-sm text-foreground line-clamp-1">{recommendedProduct.name}</h4>
                          <span className="text-sm font-extrabold text-teal mt-0.5 block">${recommendedProduct.price.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={addQuizToCart}
                          className="w-full mt-3 bg-teal text-white py-2.5 text-xs font-semibold rounded-full hover:bg-teal-light transition-all shadow-sm"
                        >
                          Add to My Routine
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={startQuiz}
                    className="text-xs font-semibold text-teal hover:underline mt-2"
                  >
                    Retake Quiz
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════ 6. TESTIMONIALS (Autoplay Slider) ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-border-custom relative overflow-hidden">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center gap-12">

          <div className="max-w-xl">
            <span className="text-xs font-semibold text-teal uppercase tracking-wider">Real People. Real Results.</span>
            <h2 className="text-4xl font-display font-bold text-foreground mt-1">What Our Customers Say</h2>
          </div>

          <div className="relative w-full min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {testimonials.map((t, idx) => {
                if (idx !== activeTestimonial) return null;
                return (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-6 max-w-2xl px-4"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-5 w-5 fill-current" />
                      ))}
                    </div>

                    <blockquote className="text-xl sm:text-2xl font-display font-medium text-foreground italic leading-relaxed">
                      &quot;{t.text}&quot;
                    </blockquote>

                    <div className="flex flex-col items-center gap-2 mt-2">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-teal/20 shadow-md">
                        <Image src={t.image} alt={t.name} fill className="object-cover" />
                      </div>
                      <div>
                        <cite className="not-italic text-base font-extrabold text-foreground block">{t.name}</cite>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.location} · Verified Buyer</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2.5 justify-center mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-6 bg-teal" : "w-2.5 bg-teal/20"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 7. NEWSLETTER SECTION ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-teal relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative z-10 flex flex-col items-center gap-6">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-accent-hover bg-white/10 px-4 py-2 rounded-full shadow-xs">
            Join the Dulcis Club
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white leading-tight">
            Join 20,000+ Glow Seekers
          </h2>
          <p className="text-base text-white/80 max-w-lg leading-relaxed">
            Get professional skincare tips, priority access to new formulas, and exclusive members-only updates.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to Dulcis updates!");
            }}
            className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-4"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm font-medium transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-teal hover:bg-white/95 text-sm font-extrabold uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 shrink-0"
            >
              Subscribe →
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
