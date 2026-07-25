import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-32 px-4 text-center">
      <div className="relative h-14 w-14 flex items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal/20 opacity-75" />
        <div className="animate-spin rounded-full h-9 w-9 border-4 border-teal border-t-transparent" />
      </div>
      <p className="text-sm font-medium text-muted-foreground mt-6">
        Loading Dulcis...
      </p>
    </div>
  );
}
