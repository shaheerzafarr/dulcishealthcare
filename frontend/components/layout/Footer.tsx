"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle2, Globe, MessageCircle, Heart } from "lucide-react";
import Button from "../ui/Button";

const newsletterSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
});

type NewsletterInput = zod.infer<typeof newsletterSchema>;

export default function Footer() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (data: NewsletterInput) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  return (
    <footer className="bg-[#0b3d35] text-white/90 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-teal to-accent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-20 rounded-xl bg-white p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Dulcis Logo"
                  width={85}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                DULCIS
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mt-1">
              Dulcis Health Care (Pvt) Ltd. pioneers bio-active serums, gel moisturizers, mineral SPF sunblocks, and nourishing hair complexes. Committed to green chemistry and sustainable packaging.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              {[Globe, MessageCircle, Heart].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Shop Dulcis
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/50 font-medium">
              <li>
                <Link href="/shop?category=serums" className="hover:text-accent transition-colors">
                  Active Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=creams" className="hover:text-accent transition-colors">
                  Moisturizers & Creams
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sunblock" className="hover:text-accent transition-colors">
                  Daily Sun Protection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=haircare" className="hover:text-accent transition-colors">
                  Nourishing Hair Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/50 font-medium">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Our Science
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Protocols
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms & Disclaimers
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Join the Glow Club
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Subscribe for clean beauty insights, new launches, and exclusive member discounts.
            </p>

            {success ? (
              <div className="flex items-center gap-2.5 text-sm font-semibold text-accent bg-accent/10 border border-accent/20 p-3.5 rounded-2xl animate-fade-in-up">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Subscribed! Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5">
                <div className="flex gap-2.5 w-full">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/8 border border-white/10 text-sm text-white placeholder-white/30 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      {...register("email")}
                    />
                  </div>
                  <Button
                    type="submit"
                    isLoading={loading}
                    variant="accent"
                    className="h-11 px-4 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {errors.email && (
                  <span className="text-xs font-semibold text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-sm text-white/40 font-medium">
              &copy; {new Date().getFullYear()} Dulcis Health Care (Pvt) Ltd. All rights reserved.
            </p>
            <p className="text-xs text-white/25 max-w-2xl leading-normal">
              Disclaimer: Dulcis formulations are dermatologist-tested. Statements regarding active ingredients have not been evaluated for prescription use. Not intended to treat chronic skin conditions without medical advice.
            </p>
          </div>
          <div className="flex items-center gap-5 text-sm text-white/40 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Head Office, NY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <span>+1 (800) 555-0199</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
