"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, ShieldAlert, Sparkles, Network, Eye, Droplets, Leaf, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════ 1. HERO SECTION ═══════════════ */}
      <header className="relative pt-36 pb-20 md:pb-28 overflow-hidden bg-white">
        {/* Soft background glow circles */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal/3 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/5 blur-2xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="col-span-12 lg:col-span-6 relative z-10 flex flex-col items-start">
            <span className="inline-block bg-teal/8 text-teal px-4.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              Our Formulation Commitment
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground mb-8">
              Vibrant Science. <br />
              <span className="text-gradient italic">Organic Results.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-10">
              At Dulcis, we build daily skin and hair routines backed by clinical data, clean active ingredients, and absolute dermatological safety. We bridge the gap between botanical purity and high-performance efficacy.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-muted flex-shrink-0 shadow-sm relative">
                  <Image
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=150"
                    alt="Active Serum droplet"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-11 h-11 rounded-full border-2 border-white bg-teal flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                CLINICALLY TESTED / BOTANICALLY DERIVED
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[480px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl border border-border-custom"
            >
              <Image
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"
                alt="Minimalist laboratory botanical setting"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              
              {/* Overlapping Floating Badge */}
              <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-[280px] z-20 border border-border-custom flex items-start gap-4">
                <div className="h-10 w-10 bg-teal/8 text-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-display font-bold text-sm text-foreground mb-0.5">Clean Certified</h4>
                  <p className="text-xs text-muted-foreground leading-snug">Dermatological guidelines compliant & ethical.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ═══════════════ 2. FOUNDATIONS SECTION ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background)] overflow-hidden border-y border-border-custom">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center text-left">
          
          {/* Image & Overlapping Card Column */}
          <div className="col-span-12 lg:col-span-5 order-2 lg:order-1 relative">
            <div className="relative rounded-[32px] overflow-hidden w-full h-[550px] shadow-lg border border-border-custom">
              <Image
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"
                alt="Premium skincare formulations and botanical setup"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Overlapping Teal Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="absolute top-1/2 -right-16 transform -translate-y-1/2 bg-[#0b3d35] p-10 rounded-[24px] shadow-2xl max-w-sm hidden lg:flex flex-col gap-6 text-white"
            >
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Our Foundations</span>
                <h2 className="text-2xl font-display font-bold leading-tight">Pioneering Clean Beauty</h2>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Dulcis was founded in response to a major challenge in the cosmetics industry: the widespread use of synthetic fillers that temporarily mask issues while destroying the skin barrier.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Raw material purity analysis",
                  "No synthetic silicones or parabens",
                  "UV-protective amber glass packaging",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Text Column */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 order-1 lg:order-2 mb-8 lg:mb-0 lg:pl-6">
            {/* Mobile Fallback Card */}
            <div className="lg:hidden bg-[#0b3d35] p-8 rounded-3xl text-white mb-10 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">Our Foundations</span>
              <h2 className="text-2xl font-display font-bold">Pioneering Clean Beauty</h2>
              <p className="text-sm text-white/85 leading-relaxed">
                Dulcis was founded to eliminate synthetic fillers and prioritize long-term skin health through clinical organics.
              </p>
            </div>

            <div className="flex flex-col gap-12 max-w-lg">
              <div className="relative pb-10 border-b border-border-custom">
                <span className="font-display text-[110px] absolute -top-12 -left-8 text-teal/4 italic select-none">01</span>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 relative z-10">Scientific Rigor</h3>
                <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">
                  Partnering with leading trichologists and clinical dermatologists, we developed a system of bio-active, non-comedogenic serums and hair complexes.
                </p>
              </div>
              <div className="relative">
                <span className="font-display text-[110px] absolute -top-12 -left-8 text-teal/4 italic select-none">02</span>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 relative z-10">European Standards</h3>
                <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">
                  Every formula complies with the strictest European clean beauty standards, exceeding typical industry regulations for consumer safety.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════ 3. FOUR PILLARS SECTION ═══════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-border-custom">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center gap-3">
            <span className="text-xs font-semibold text-teal uppercase tracking-wider bg-teal/8 py-1.5 px-4 rounded-full">
              Scientific Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-2">
              Our Four Pillars of Science
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01.", icon: Network, title: "Active Synergy", desc: "We combine ingredients that complement skin pathways—like pairing Niacinamide with Zinc PCA to balance sebum.", isStaggered: false },
              { num: "02.", icon: Leaf, title: "Zero Synthetics", desc: "Absolutely free from heavy silicones, petroleum mineral oil, parabens, sulfates, and chemical dye pigments.", isStaggered: true },
              { num: "03.", icon: Droplets, title: "Compatibility", desc: "All formulations utilize bio-available lipids (squalane, ceramides) to perfectly match and strengthen your skin.", isStaggered: false },
              { num: "04.", icon: Eye, title: "Transparency", desc: "Every bottle outlines raw active concentrations and pH levels. Zero hidden ingredients, zero proprietary blends.", isStaggered: true },
            ].map((pillar, i) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`group bg-[var(--background)] p-10 rounded-2xl border border-border-custom hover:border-teal/10 shadow-xs hover:shadow-lg transition-all duration-500 hover:-translate-y-2 text-center flex flex-col items-center gap-4 ${
                    pillar.isStaggered ? "lg:mt-12" : ""
                  }`}
                >
                  <div className="w-14 h-14 bg-teal/5 text-teal rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="font-display text-lg text-teal/40 italic block">{pillar.num}</span>
                  <h3 className="font-display font-bold text-lg text-foreground">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════ 4. ADVISORY BOARD SECTION ═══════════════ */}
      <section className="pt-24 pb-36 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center gap-3">
            <span className="text-xs font-semibold text-teal uppercase tracking-wider bg-teal/8 py-1.5 px-4 rounded-full">
              Scientific Advisors
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-2">
              Meet the Advisory Board
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Vetting clinical formulations and safety testing under strict non-comedogenic guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start md:pb-16">
            {[
              {
                name: "Dr. Elena Rostova, PhD",
                role: "Chief Scientific Officer (CSO)",
                specialty: "Clinical Dermatology & Skincare Formulation",
                desc: "Over 18 years of clinical dermatology research leading lipid barrier repair studies. Spearheads our niacinamide and vitamin C active formulations.",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
                isStaggered: false
              },
              {
                name: "Prof. Sarah Jenkins, PhD",
                role: "Director of Hair Care Research",
                specialty: "Trichology & Hair Follicle Biology",
                desc: "Renowned trichologist specializing in sulfate-free follicle stimulation. Developed our rosemary biotin shampoo complex to improve hair density.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
                isStaggered: true
              },
              {
                name: "Dr. Marcus Vance, MD",
                role: "Lead Cosmetic Chemist",
                specialty: "Green Chemistry & Cosmetic Synthesis",
                desc: "Evaluates and certifies all surfactant ratios, botanical shelf life stability, and non-comedogenic compliance tests.",
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
                isStaggered: false
              }
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`flex flex-col items-center text-center ${
                  member.isStaggered ? "md:translate-y-12" : ""
                }`}
              >
                {/* Arch portrait */}
                <div className="w-full aspect-[3/4] mb-8 rounded-[500px_500px_0_0] overflow-hidden shadow-lg border border-border-custom relative bg-teal/5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="px-4">
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">{member.name}</h3>
                  <p className="text-[10px] font-bold text-teal tracking-widest uppercase mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════ 5. CLINICAL SAFETY BANNER ═══════════════ */}
      <section className="py-24 bg-[#0b3d35] text-white text-center relative overflow-hidden">
        {/* Soft decorative background glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#bcedd7_0%,transparent_70%)]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-7 w-7 text-accent" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-widest">
            Clinical Safety & Patch Testing
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-3xl mx-auto leading-relaxed">
            All Dulcis formulations are manufactured in cGMP-compliant facilities within the USA and European Union. While our products are dermatologist-tested, we recommend performing a 24-hour forearm patch test before introducing new high-concentration active serums.
          </p>
        </div>
      </section>

    </div>
  );
}
