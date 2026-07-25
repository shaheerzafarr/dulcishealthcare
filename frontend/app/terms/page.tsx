"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, CreditCard, Truck, RotateCcw, Scale, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "General Terms",
      content: "By accessing and using the Dulcis website, you agree to be bound by these terms and conditions. These terms apply to all visitors, users, and customers. We reserve the right to update these terms at any time, with changes becoming effective upon posting."
    },
    {
      icon: ShieldCheck,
      title: "Product Claims & Disclaimers",
      content: "All Dulcis products are dermatologist-tested and formulated under cGMP-compliant conditions. However, statements regarding active ingredients have not been evaluated by the FDA for prescription use. Our products are not intended to diagnose, treat, cure, or prevent any disease. We recommend a 24-hour patch test before first use."
    },
    {
      icon: CreditCard,
      title: "Orders & Payment",
      content: "All prices are listed in USD and are subject to change without notice. Payment is processed securely through encrypted SSL connections. We accept major credit cards and digital payment methods. Orders are confirmed via email upon successful payment processing."
    },
    {
      icon: Truck,
      title: "Shipping Policy",
      content: "We offer free standard shipping on orders over $50 within the continental United States. International shipping rates vary by destination. Processing time is 1-3 business days. Estimated delivery times are 5-7 business days for standard and 2-3 business days for express shipping."
    },
    {
      icon: RotateCcw,
      title: "Returns & Refunds",
      content: "We offer a 30-day return policy for unopened and unused products in their original packaging. To initiate a return, contact our support team with your order number. Refunds are processed within 5-10 business days after we receive the returned item. Opened products may only be returned if defective."
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: "All content on this website, including text, images, logos, product names, and formulations, are the intellectual property of Dulcis Health Care (Pvt) Ltd. Unauthorized reproduction, distribution, or use of our content without written permission is strictly prohibited."
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Liability",
      content: "Dulcis Health Care shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Individual results may vary. Users with known allergies or skin conditions should consult a dermatologist before using new skincare products."
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
          Terms & Conditions
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
          Please review our terms of service before using the Dulcis website or purchasing products.
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
          For questions about our terms, contact{" "}
          <a href="mailto:legal@dulcisbeauty.com" className="text-teal font-semibold hover:underline">
            legal@dulcisbeauty.com
          </a>
        </p>
      </div>
    </div>
  );
}
