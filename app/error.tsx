"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log error to monitoring service if needed
    // console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h1>
      <p className="text-red-600 mb-6">{error?.message || "An unexpected error occurred."}</p>
      <Button onClick={reset} variant="destructive">Try Again</Button>
    </div>
  );
}
