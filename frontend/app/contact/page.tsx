"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const contactSchema = zod.object({
  fullName: zod.string().min(2, "Please enter your full name (at least 2 letters)"),
  email: zod.string().email("Please enter a valid contact email address"),
  topic: zod.enum(["order", "consultation", "compliance"]),
  message: zod.string().min(10, "Please enter a detailed message (at least 10 characters)"),
});

type ContactInput = zod.infer<typeof contactSchema>;

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      topic: "consultation",
    },
  });

  const onSubmit = (data: ContactInput) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      reset();
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex-grow w-full text-left">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center gap-3"
      >
        <span className="text-xs font-semibold tracking-wider text-teal bg-teal/8 py-2 px-5 rounded-full uppercase">
          Skincare Support Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight mt-2">
          Connect with Dulcis Advisors
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
          Have questions about skincare serums, argan conditioners, sunscreen layers, or checking your order? Drop us a message.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div className="p-6 rounded-2xl border border-border-custom bg-white flex flex-col gap-5 card-shadow">
            <h3 className="font-display font-bold text-base text-foreground pb-3 border-b border-border-custom">
              Direct Contact Details
            </h3>

            {[
              { icon: Phone, title: "Phone Hotline", info: "+1 (800) 555-DULCIS", sub: "Toll-free customer support line", color: "text-teal bg-teal/10" },
              { icon: Mail, title: "Customer Support Email", info: "support@dulcisbeauty.com", sub: "Average reply within 4 hours", color: "text-accent bg-accent/10" },
              { icon: Clock, title: "Operational Hours", info: "Mon - Fri: 8:00 AM - 6:00 PM EST", sub: "Saturday: 9:00 AM - 2:00 PM EST", color: "text-primary bg-primary/10" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="text-muted-foreground font-medium mt-0.5">{item.info}</p>
                  <p className="text-xs text-muted-foreground/70">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: "Head Office", name: "Dulcis Skincare HQ", address: "742 Lexington Avenue,\nSuites 400-500,\nNew York, NY 10022", color: "text-teal" },
              { icon: FileText, label: "Research Lab", name: "Dulcis Cosmetic Labs", address: "440 Technology Square,\nBuilding B - Biotech Lot,\nCambridge, MA 02139", color: "text-accent" },
            ].map((loc, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border-custom bg-white flex flex-col gap-3 card-shadow">
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${loc.color}`}>
                  <loc.icon className="h-4 w-4" />
                  <span>{loc.label}</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">{loc.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {loc.address}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="p-6 sm:p-8 rounded-2xl border border-border-custom bg-white card-shadow">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
                <div className="h-14 w-14 bg-teal/10 text-teal rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Message Sent Successfully
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                  A skincare advisor will review your ticket and follow up at your email address shortly.
                </p>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <h3 className="font-display font-bold text-lg text-foreground mb-1">
                  Send Us a Message
                </h3>

                <Input
                  id="fullName"
                  label="Full Name"
                  placeholder="Enter your first and last name"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />

                <Input
                  id="email"
                  label="Contact Email Address"
                  type="email"
                  placeholder="name@organization.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                {/* Topic */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label
                    htmlFor="topic"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Topic
                  </label>
                  <select
                    id="topic"
                    className="w-full h-12 px-4 border border-border-custom bg-white text-foreground text-sm rounded-xl outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all font-medium cursor-pointer"
                    {...register("topic")}
                  >
                    <option value="consultation">Skin & Haircare Routine Advice</option>
                    <option value="order">Order Status & Shipping Inquiries</option>
                    <option value="compliance">Collaborations, Press & Advisory Board</option>
                  </select>
                  {errors.topic && (
                    <span className="text-xs font-medium text-red-500 mt-0.5">
                      {errors.topic.message}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label
                    htmlFor="message"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Message Details
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Provide details about your query..."
                    className="w-full px-4 py-3 rounded-xl border border-border-custom bg-white text-sm text-foreground placeholder-muted-foreground/60 transition-all outline-none focus:border-teal focus:ring-2 focus:ring-teal/10"
                    {...register("message")}
                  />
                  {errors.message && (
                    <span className="text-xs font-medium text-red-500 mt-0.5">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  variant="teal"
                  className="w-full mt-2 h-12 rounded-full"
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
