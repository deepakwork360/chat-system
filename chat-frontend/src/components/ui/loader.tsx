"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "orb" | "full";
  text?: string;
  className?: string;
  color?: string;
}

export function PremiumLoader({
  size = "md",
  variant = "spinner",
  text,
  className = "",
}: LoaderProps) {
  // Button & Inline Small Spinner
  if (size === "sm" && variant === "spinner") {
    return (
      <div className={`inline-flex items-center justify-center relative ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="h-4 w-4 rounded-full border-2 border-transparent border-t-white border-r-white/40 shadow-sm"
        />
      </div>
    );
  }

  // Full-page Workspace Loading Screen
  if (variant === "full") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl select-none overflow-hidden">
        {/* Background Ambient Glow Orbs */}
        <div className="absolute w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse pointer-events-none -z-10" />
        <div className="absolute w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse pointer-events-none -z-10 delay-700" />

        <div className="flex flex-col items-center gap-6 relative">
          {/* Animated Center Orb & Logo */}
          <div className="relative flex items-center justify-center">
            {/* Outer Spinning Gradient Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/30"
            >
              <div className="h-full w-full bg-background rounded-full" />
            </motion.div>

            {/* Inner Counter-Rotating Pulsing Ring */}
            <motion.div
              animate={{ rotate: -360, scale: [0.95, 1.05, 0.95] }}
              transition={{
                rotate: { repeat: Infinity, duration: 3, ease: "linear" },
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="absolute h-18 w-18 rounded-full border-2 border-dashed border-primary/50"
            />

            {/* Center Chat Icon Badge */}
            <motion.div
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="absolute h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40"
            >
              <MessageSquare className="h-6 w-6" />
            </motion.div>
          </div>

          {/* Typography */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
              S1mple Chat
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground tracking-wide">
              <span>{text || "Initializing workspace engine..."}</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="h-1.5 w-1.5 rounded-full bg-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Medium / Large Card & Content Spinner
  const sizeDimensions = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
    xl: "h-16 w-16 border-4"
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Glowing Background Pulse */}
        <motion.div
          animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className={`absolute rounded-full bg-indigo-500/20 blur-sm ${
            size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-20 w-20"
          }`}
        />

        {/* Outer Rotating Gradient Arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          className={`${sizeDimensions} rounded-full border-transparent border-t-indigo-500 border-r-purple-500 border-b-pink-500/40 shadow-sm`}
        />
      </div>

      {text && (
        <span className="text-xs font-semibold text-muted-foreground animate-pulse tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
}

export default PremiumLoader;
