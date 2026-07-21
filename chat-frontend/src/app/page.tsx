"use client";

import Link from "next/link";
import { 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Mic, 
  CheckCheck, 
  Users, 
  ShieldCheck, 
  Smartphone,
  Lock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 🧭 NAVIGATION BAR */}
      <header className="w-full border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-foreground">S1mple Chat</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                v1.0 Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold text-sm rounded-xl cursor-pointer hover:bg-muted">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-bold text-sm rounded-xl cursor-pointer bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 🚀 HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center flex flex-col items-center gap-8 relative">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border/80 text-xs font-semibold text-muted-foreground shadow-sm hover:border-primary/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground font-bold">Real-Time Messaging Engine</span>
          <span className="text-muted-foreground/60">•</span>
          <span>WebSocket Powered</span>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.15]">
          Connect, Collaborate & Chat with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
            Zero Latency
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Experience next-generation team communication equipped with instant WebSocket receipts, high-fidelity browser voice notes, group workspace channels, and touch-friendly mobile controls.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-base bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all cursor-pointer">
              Create Free Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-base border-border/80 bg-card/50 hover:bg-muted transition-all cursor-pointer">
              <Sparkles className="h-4.5 w-4.5 mr-2 text-primary" />
              Sign In to Workspace
            </Button>
          </Link>
        </div>

        {/* 📱 HERO PREVIEW MOCKUP */}
        <div className="w-full max-w-4xl mt-8 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl p-4 sm:p-6 text-left relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

          {/* Window Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-destructive/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-bold text-muted-foreground ml-2">S1mple Chat Live Preview</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              WebSocket Active
            </div>
          </div>

          {/* Simulated Chat Interface */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sidebar Preview */}
            <div className="hidden md:flex flex-col gap-2 border-r border-border/40 pr-4">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                    GS
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-foreground">General Squad</span>
                    <span className="text-[10px] text-muted-foreground">3 members</span>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              <div className="p-2.5 rounded-xl hover:bg-muted/40 flex items-center justify-between text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                    AL
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-foreground">Alice Johnson</span>
                    <span className="text-[10px] text-muted-foreground">Voice note received</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">2</span>
              </div>
            </div>

            {/* Chat Viewport Preview */}
            <div className="md:col-span-2 flex flex-col justify-between gap-4 min-h-[220px]">
              <div className="flex flex-col gap-3">
                {/* Incoming Message */}
                <div className="flex items-end gap-2 max-w-[80%]">
                  <div className="h-7 w-7 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                    AL
                  </div>
                  <div className="p-3 rounded-2xl rounded-bl-none bg-muted/80 text-foreground text-xs flex flex-col gap-1 border border-border/40">
                    <span className="text-[10px] font-bold text-purple-400">Alice Johnson</span>
                    <span>Hey team! Just pushed the live database migrations. Test the Voice Notes! 🎙️</span>
                    <span className="text-[9px] text-muted-foreground text-right">10:42 AM</span>
                  </div>
                </div>

                {/* Outgoing Message with Double Blue Ticks */}
                <div className="flex items-end justify-end gap-2 max-w-[80%] self-end">
                  <div className="p-3 rounded-2xl rounded-br-none bg-primary text-primary-foreground text-xs flex flex-col gap-1 shadow-md shadow-primary/10">
                    <span>Awesome work! The double checkmarks and instant websocket broadcasts are super fast. 🔥</span>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-primary-foreground/80">
                      <span>10:43 AM</span>
                      <CheckCheck className="h-3.5 w-3.5 text-blue-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Bar Simulator */}
              <div className="p-2 rounded-xl border border-border/60 bg-background/50 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground px-2">Type a message...</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Mic className="h-3.5 w-3.5" />
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                    ➔
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40 w-full">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for Modern Teams
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Built from the ground up with high performance, instant delivery, and mobile touch actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col gap-3 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Instant WebSockets</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time socket engine dispatches messages instantly with zero lag and optimistic state UI updates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col gap-3 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Mic className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Browser Audio Notes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Record microphone audio directly in your browser with dynamic seek scrubbing and high compression.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col gap-3 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Read Receipts & Badges</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              WhatsApp-style single check, double gray, and double blue seen receipts alongside live glowing unread badges.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col gap-3 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Group Channels</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Create multi-user group chat rooms, manage participants, inspect profiles, and view online members.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col gap-3 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Touch & Double-Tap Actions</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Double-tap message bubbles on mobile screens to trigger bottom sheet drawers for unsend or multi-select deletion.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col gap-3 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">3-Hour Unsend Limits</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Batch delete or single unsend messages with enforced 3-hour backend database window validation.
            </p>
          </div>

        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="w-full border-t border-border/40 py-8 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>© 2026 S1mple Chat. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground font-semibold">
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Sign Up</Link>
            <Link href="/chat" className="hover:text-foreground transition-colors">Chat App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
