"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Globe, UserCheck } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "When you visit our website, place an order, or create an account, we may collect personal information such as your name, email address, shipping address, payment details, and browsing behavior through cookies. We collect only the minimum data necessary to provide our services and improve your experience."
    },
    {
      icon: Lock,
      title: "How We Use Your Data",
      content: "Your personal information is used to process and fulfill orders, communicate order updates, personalize your shopping experience, send marketing communications (with your opt-in consent), and improve our website functionality. We never sell your personal data to third parties."
    },
    {
      icon: Eye,
      title: "Cookies & Tracking",
      content: "We use essential cookies to operate our website and optional analytics cookies to understand how visitors interact with our site. You can manage cookie preferences through your browser settings. Third-party analytics services may collect anonymized usage data."
    },
    {
      icon: Shield,
      title: "Data Security",
      content: "All payment transactions are processed through SSL-encrypted connections. We implement industry-standard security measures including encrypted data storage, regular security audits, and access controls to protect your personal information from unauthorized access."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications by clicking the unsubscribe link in any email. For data deletion requests, contact our support team at privacy@dulcisbeauty.com."
    },
    {
      icon: Globe,
      title: "International Compliance",
      content: "Dulcis Health Care complies with GDPR (EU), CCPA (California), and other applicable data protection regulations. By using our website, you consent to the collection and use of your information as described in this policy."
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 flex-grow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold text-teal uppercase tracking-wider bg-teal/8 py-2 px-5 rounded-full">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
          At Dulcis, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: July 2026
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl border border-border-custom bg-white card-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-foreground mb-2">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-teal/5 border border-teal/15 text-center">
        <p className="text-sm text-muted-foreground">
          Questions about your privacy? Contact us at{" "}
          <a href="mailto:privacy@dulcisbeauty.com" className="text-teal font-semibold hover:underline">
            privacy@dulcisbeauty.com
          </a>
        </p>
      </div>
    </div>
  );
}
