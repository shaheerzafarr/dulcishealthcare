"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dulcis frontend boundary error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow py-24 px-4 text-center">
      <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Unexpected Error</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
        We encountered a temporary processing error. Please try resetting the view below.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          variant="teal"
          leftIcon={<RefreshCcw className="h-4.5 w-4.5" />}
        >
          Reset View
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
