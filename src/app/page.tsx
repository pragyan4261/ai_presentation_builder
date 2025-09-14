

"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { themes } from "@/lib/constants";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Set theme on mount to match system or default
  useEffect(() => {
    if (!theme) {
      setTheme("light");
    }
  }, [theme, setTheme]);

  // Pick a default theme from your themes array
  const currentTheme = themes[0];

  // Animated placeholder words
  const words = ["Edit", "Imagine", "Create"];
  const [currentWord, setCurrentWord] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start transition-colors duration-300"
      style={{
        background: "#18181B",
        color: "#F5F5F7",
        fontFamily: "Geist, sans-serif",
      }}
    >
      {/* Large AI Decks heading at top center */}
      <div className="w-full flex flex-col items-center mt-16 mb-4">
        <h1
          className="text-7xl font-extrabold tracking-tight mb-2"
          style={{
            background: "linear-gradient(90deg, #FFD600 40%, #FF6B00 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-2px",
            display: "inline-block"
          }}
        >
          AI Decks
        </h1>
        <div className="text-xl font-medium text-center mt-2 mb-6" style={{ color: "#A1A1AA", maxWidth: 600 }}>
          Effortlessly create, edit, and imagine beautiful presentations powered by AI. Unleash your creativity and productivity with a single click.
        </div>
      </div>
      {/* Card area for animation and button */}
      <div className="flex flex-col items-center gap-8 p-10 rounded-xl shadow-lg w-full max-w-xl"
        style={{
          background: "#232326",
          boxShadow: "0 4px 32px rgba(0,0,0,0.16)",
        }}
      >
        {/* Animated moving words */}
        <div className="flex items-center justify-center h-20 mb-8 w-full">
          <div className="w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[currentWord]}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="text-5xl font-extrabold text-center"
                style={{
                  background: "linear-gradient(90deg, #FFD600 40%, #FF6B00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  minWidth: "220px",
                  display: "inline-block"
                }}
              >
                {words[currentWord]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        {/* Get Started button styled like heading */}
        <Button
          size="lg"
          className="rounded-full px-8 py-4 text-2xl font-bold shadow-md mb-8"
          style={{
            background: "linear-gradient(90deg, #FFD600 40%, #FF6B00 100%)",
            color: "#18181B",
            border: "none",
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: "-1px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
          onClick={() => window.location.href = "http://localhost:3000/dashboard"}
        >
          Get Started
        </Button>
  {/* Decorative SVG background elements */}
        {/* Animated floating letters - increased density, positioned away from main card */}
        <motion.span initial={{ y: -40, opacity: 0.2 }} animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-10 left-1/6 text-6xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FFD600" }}>A</motion.span>
        <motion.span initial={{ y: 30, opacity: 0.2 }} animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute bottom-10 right-1/6 text-7xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FF6B00" }}>I</motion.span>
        <motion.span initial={{ x: -30, opacity: 0.2 }} animate={{ x: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-1/4 left-1/5 text-8xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FFD600" }}>D</motion.span>
        <motion.span initial={{ x: 40, opacity: 0.2 }} animate={{ x: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }} className="absolute bottom-10 left-1/4 text-6xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FF6B00" }}>E</motion.span>
        <motion.span initial={{ y: -20, opacity: 0.2 }} animate={{ y: [0, 25, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-1/6 right-1/6 text-5xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FFD600" }}>S</motion.span>
        <motion.span initial={{ x: 20, opacity: 0.2 }} animate={{ x: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute bottom-1/5 right-1/4 text-6xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FF6B00" }}>K</motion.span>
        <motion.span initial={{ y: 10, opacity: 0.2 }} animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute top-1/8 left-1/8 text-5xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FFD600" }}>P</motion.span>
        <motion.span initial={{ x: -20, opacity: 0.2 }} animate={{ x: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute bottom-1/8 right-1/8 text-6xl font-extrabold select-none pointer-events-none z-0" style={{ color: "#FF6B00" }}>T</motion.span>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="absolute top-10 left-10 opacity-30 z-0 pointer-events-none">
          <circle cx="60" cy="60" r="50" stroke="#FFD600" strokeWidth="8" fill="none" />
        </svg>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="absolute bottom-10 right-20 opacity-20 z-0 pointer-events-none">
          <rect x="10" y="10" width="60" height="60" rx="20" stroke="#FF6B00" strokeWidth="6" fill="none" />
        </svg>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="absolute top-32 right-32 opacity-25 z-0 pointer-events-none">
          <ellipse cx="50" cy="50" rx="40" ry="30" stroke="#FFD600" strokeWidth="5" fill="none" />
        </svg>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="absolute bottom-32 left-32 opacity-20 z-0 pointer-events-none">
          <polygon points="30,5 55,55 5,55" stroke="#FF6B00" strokeWidth="4" fill="none" />
        </svg>
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="absolute top-1/2 left-10 opacity-15 z-0 pointer-events-none">
          <rect x="15" y="15" width="60" height="60" rx="30" stroke="#FFD600" strokeWidth="3" fill="none" />
        </svg>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="absolute top-10 right-1/4 opacity-20 z-0 pointer-events-none">
          <polygon points="30,5 55,55 5,55" stroke="#FFD600" strokeWidth="3" fill="none" />
        </svg>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="absolute bottom-1/4 left-1/4 opacity-20 z-0 pointer-events-none">
          <ellipse cx="40" cy="40" rx="30" ry="20" stroke="#FF6B00" strokeWidth="4" fill="none" />
        </svg>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="absolute top-1/3 right-1/5 opacity-15 z-0 pointer-events-none">
          <rect x="20" y="20" width="60" height="60" rx="20" stroke="#FFD600" strokeWidth="3" fill="none" />
        </svg>
      </div>
    </div>
  );
}
