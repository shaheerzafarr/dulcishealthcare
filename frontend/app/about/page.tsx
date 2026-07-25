"use client";

import React from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Network,
  Eye,
  Droplets,
  Leaf,
  ShieldCheck,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-[var(--background)]">

      {/* ═══════════════ 1. HERO SECTION ═══════════════ */}
      <header className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white border-b border-border-custom">
        {/* Soft background glow circles */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal/5 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/10 blur-2xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center text-left">
          <div className="col-span-12 lg:col-span-6 relative z-10 flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 bg-teal/10 text-teal px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-4 sm:mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Our Formulation Commitment
            </span>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-4 sm:mb-6">
              Vibrant Science. <br />
              <span className="text-gradient italic">Organic Results.</span>
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground max-w-xl leading-relaxed mb-6 sm:mb-8">
              At Dulcis, we build daily skin and hair routines backed by clinical
              data, clean active ingredients, and absolute dermatological safety.
              We bridge the gap between botanical purity and high-performance
              efficacy.
            </p>
            <div className="flex items-center gap-3 sm:gap-6 pt-1 sm:pt-2 w-full sm:w-auto">
              <div className="flex -space-x-2.5 shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden bg-muted flex-shrink-0 shadow-sm relative">
                  <Image
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=150"
                    alt="Active Serum droplet"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-teal flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Award className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-muted-foreground uppercase leading-tight">
                CLINICALLY TESTED / BOTANICALLY DERIVED
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[460px] aspect-[4/3] sm:aspect-[4/5] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xl border border-border-custom"
            >
              <Image
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"
                alt="Minimalist laboratory botanical setting"
                fill
                className="object-cover"
                priority
              />

              {/* Floating Badge safely positioned inside bottom of image container */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/90 backdrop-blur-md p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 z-10">
                <div className="h-9 w-9 sm:h-10 sm:w-10 bg-teal/10 text-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-foreground truncate">
                    Clean Certified
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug truncate sm:whitespace-normal">
                    Dermatological guidelines compliant &amp; ethical.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ═══════════════ 2. FOUNDATIONS SECTION ═══════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background)] border-b border-border-custom">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-stretch text-left">
          
          {/* Left Column: Dark Teal Foundation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-6 bg-[#0a6b5c] text-white p-6 sm:p-12 rounded-2xl sm:rounded-[32px] shadow-xl flex flex-col justify-between gap-5 sm:gap-6"
          >
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1.5 sm:mb-2">
                Our Foundations
              </span>
              <h2 className="text-xl sm:text-3xl font-display font-extrabold leading-tight">
                Pioneering Clean Beauty
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Dulcis was founded in response to a major challenge in the cosmetics
              industry: the widespread use of synthetic fillers that temporarily mask
              issues while destroying the skin barrier.
            </p>

            <div className="flex flex-col gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              {[
                "Raw material purity analysis",
                "No synthetic silicones or parabens",
                "UV-protective amber glass packaging",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-accent flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Scientific Rigor & European Standards Cards */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-border-custom shadow-sm flex flex-col gap-2.5 sm:gap-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-display font-bold text-foreground">
                  Scientific Rigor
                </h3>
                <span className="text-[10px] sm:text-xs font-extrabold text-teal bg-teal/10 px-2.5 py-1 rounded-full">
                  STEP 01
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Partnering with leading trichologists and clinical dermatologists,
                we developed a system of bio-active, non-comedogenic serums and hair
                complexes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-border-custom shadow-sm flex flex-col gap-2.5 sm:gap-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-display font-bold text-foreground">
                  European Standards
                </h3>
                <span className="text-[10px] sm:text-xs font-extrabold text-teal bg-teal/10 px-2.5 py-1 rounded-full">
                  STEP 02
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every formula complies with the strictest European clean beauty
                standards, exceeding typical industry regulations for consumer
                safety.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ═══════════════ 3. FOUR PILLARS SECTION ═══════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-border-custom">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16 flex flex-col items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-teal uppercase tracking-widest bg-teal/8 py-1.5 px-4 rounded-full">
              Scientific Standards
            </span>
            <h2 className="text-xl sm:text-4xl font-display font-extrabold text-foreground">
              Our Four Pillars of Science
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { num: "01", icon: Network, title: "Active Synergy", desc: "We combine ingredients that complement skin pathways—like pairing Niacinamide with Zinc PCA to balance sebum." },
              { num: "02", icon: Leaf, title: "Zero Synthetics", desc: "Absolutely free from heavy silicones, petroleum mineral oil, parabens, sulfates, and chemical dye pigments." },
              { num: "03", icon: Droplets, title: "Compatibility", desc: "All formulations utilize bio-available lipids (squalane, ceramides) to perfectly match and strengthen your skin." },
              { num: "04", icon: Eye, title: "Transparency", desc: "Every bottle outlines raw active concentrations and pH levels. Zero hidden ingredients, zero proprietary blends." },
            ].map((pillar, i) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-[var(--background)] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-border-custom hover:border-teal/20 shadow-xs hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center gap-2.5 sm:gap-3"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal/10 text-teal rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-extrabold text-teal uppercase tracking-widest">
                    Pillar {pillar.num}
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════ 4. ADVISORY BOARD SECTION ═══════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background)] border-b border-border-custom">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16 flex flex-col items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-teal uppercase tracking-widest bg-teal/8 py-1.5 px-4 rounded-full">
              Scientific Advisors
            </span>
            <h2 className="text-xl sm:text-4xl font-display font-extrabold text-foreground">
              Meet the Advisory Board
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Vetting clinical formulations and safety testing under strict non-comedogenic guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 items-start">
            {[
              {
                name: "Dr. Elena Rostova, PhD",
                role: "Chief Scientific Officer (CSO)",
                desc: "Over 18 years of clinical dermatology research leading lipid barrier repair studies. Spearheads our niacinamide and vitamin C active formulations.",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
              },
              {
                name: "Prof. Sarah Jenkins, PhD",
                role: "Director of Hair Care Research",
                desc: "Renowned trichologist specializing in sulfate-free follicle stimulation. Developed our rosemary biotin shampoo complex to improve hair density.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
              },
              {
                name: "Dr. Marcus Vance, MD",
                role: "Lead Cosmetic Chemist",
                desc: "Evaluates and certifies all surfactant ratios, botanical shelf life stability, and non-comedogenic compliance tests.",
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
              }
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center px-2"
              >
                {/* Arch portrait */}
                <div className="w-full max-w-[280px] sm:max-w-xs mx-auto aspect-[3/4] mb-6 rounded-[500px_500px_0_0] overflow-hidden shadow-lg border border-border-custom relative bg-teal/5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="px-2 max-w-sm">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-teal tracking-widest uppercase mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {member.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════ 5. CLINICAL SAFETY BANNER ═══════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0a6b5c] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
          </div>
          <h2 className="font-display text-lg sm:text-3xl font-extrabold uppercase tracking-wider">
            Clinical Safety &amp; Patch Testing
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            All Dulcis formulations are manufactured in cGMP-compliant facilities within the USA and European Union. While our products are dermatologist-tested, we recommend performing a 24-hour forearm patch test before introducing new high-concentration active serums.
          </p>
        </div>
      </section>

    </div>
  );
}

