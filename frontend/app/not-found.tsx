"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow pt-28 pb-24 px-4 text-center">
      <div className="h-16 w-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
        The page you are looking for does not exist or has been moved to another location.
      </p>
      <Link href="/">
        <Button variant="teal" leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
}
