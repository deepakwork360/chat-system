"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Mic, 
  CheckCheck, 
  Users, 
  Smartphone,
  Lock,
  ChevronRight,
  Palette,
  MapPin,
  Image as ImageIcon,
  Phone,
  Mail,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  Database,
  Server,
  Cpu,
  ListChecks,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("8178050588");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("deepakwork360@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-foreground">S1mple Chat</span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                v2.0 Full Stack
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
              <Button className="font-bold text-sm rounded-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 hover:opacity-90 transition-all border-0">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 🚀 HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center flex flex-col items-center gap-8 relative">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 border border-border/80 text-xs font-semibold text-muted-foreground shadow-sm hover:border-primary/40 transition-colors backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground font-bold">Real-Time Full-Stack Architecture</span>
          <span className="text-muted-foreground/60">•</span>
          <span>WebSockets & Express API</span>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.15]">
          The Ultimate Enterprise-Grade{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Realtime Chat System
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          A high-concurrency web application powered by Node.js, Express, WebSockets, Prisma DB, Cloudinary storage, and Next.js 16. Designed for instant messaging, group channels, voice notes, GPS location sharing, multi-select deletion, and dynamic themes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-2xl font-bold text-base bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all cursor-pointer border-0">
              Launch Workspace Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-2xl font-bold text-base border-border/80 bg-card/60 hover:bg-muted transition-all cursor-pointer backdrop-blur-md">
              <Sparkles className="h-4.5 w-4.5 mr-2 text-indigo-500" />
              Sign In to Account
            </Button>
          </Link>
        </div>

        {/* 📱 HERO PREVIEW MOCKUP */}
        <div className="w-full max-w-4xl mt-6 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl p-4 sm:p-6 text-left relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          {/* Window Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-bold text-muted-foreground ml-2">S1mple Chat Live Workspace</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Socket Engine Active
            </div>
          </div>

          {/* Simulated Chat Interface */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sidebar Preview */}
            <div className="hidden md:flex flex-col gap-2 border-r border-border/40 pr-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-xs">
                    GC
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white">General Squad</span>
                    <span className="text-[10px] text-white/80">8 members online</span>
                  </div>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white" />
              </div>

              <div className="p-2.5 rounded-xl hover:bg-muted/50 flex items-center justify-between text-muted-foreground transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-xs">
                    DB
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-foreground">Deepak Bisht</span>
                    <span className="text-[10px] text-muted-foreground">📍 Shared Location</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">New</span>
              </div>
            </div>

            {/* Chat Viewport Preview */}
            <div className="md:col-span-2 flex flex-col justify-between gap-4 min-h-[240px]">
              <div className="flex flex-col gap-3">
                {/* Incoming Message */}
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="h-7 w-7 rounded-full bg-indigo-500/20 text-indigo-500 font-bold flex items-center justify-center text-[10px] shrink-0">
                    DB
                  </div>
                  <div className="p-3 rounded-2xl rounded-bl-none bg-card text-foreground text-xs flex flex-col gap-1.5 border border-border/60 shadow-sm">
                    <span className="text-[10px] font-bold text-indigo-500">Deepak Bisht</span>
                    <span>Hey team! Tested voice messages, double tick receipts, live GPS pins, and multi-select deletion. All working 100%! 🔥</span>
                    <span className="text-[9px] text-muted-foreground text-right">02:14 PM</span>
                  </div>
                </div>

                {/* Outgoing Message with Double Blue Ticks */}
                <div className="flex items-end justify-end gap-2 max-w-[85%] self-end">
                  <div className="p-3 rounded-2xl rounded-br-none bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white text-xs flex flex-col gap-1.5 shadow-md shadow-indigo-600/20">
                    <span>Awesome! The 6 gradient color themes and dark/light modes apply instantly across all threads. 🎨</span>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-white/90">
                      <span>02:15 PM</span>
                      <CheckCheck className="h-3.5 w-3.5 text-cyan-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Bar Simulator */}
              <div className="p-2 rounded-2xl border border-border/60 bg-background/80 flex items-center justify-between gap-2 shadow-sm">
                <span className="text-xs text-muted-foreground px-2">Type a message...</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-8 w-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                    <Mic className="h-4 w-4" />
                  </div>
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚙️ BACKEND & ARCHITECTURE FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40 w-full">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
            <Server className="h-3.5 w-3.5" /> High-Concurrency Backend Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Robust Server & Database Capabilities
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Powering scalable realtime communication with resilient WebSocket protocols and database validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Backend Feature 1 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-emerald-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/15 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">WebSocket Socket Engine</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time Socket.io engine dispatches messages instantly with zero latency, broadcast rooms, and optimistic state updates.
            </p>
          </div>

          {/* Backend Feature 2 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-blue-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/15 group-hover:scale-110 transition-transform">
              <CheckCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">WhatsApp Read Receipts</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Granular receipt states: Single tick (sent to server), Double gray ticks (delivered to client), and Double blue ticks (read by recipient).
            </p>
          </div>

          {/* Backend Feature 3 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-purple-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/15 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">Group Workspace Channels</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Create multi-user group chat rooms, inspect member rosters, track participant count, and broadcast group messages in realtime.
            </p>
          </div>

          {/* Backend Feature 4 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-rose-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/15 group-hover:scale-110 transition-transform">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">3-Hour Database Unsend Limit</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Backend database timestamp validation enforces a strict 3-hour window for message unsend and batch deletion safety.
            </p>
          </div>

          {/* Backend Feature 5 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-amber-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/15 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">JWT Auth & Bcrypt Security</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Secure JSON Web Token authentication with salted bcrypt password hashing and persistent active session management.
            </p>
          </div>

          {/* Backend Feature 6 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-cyan-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/15 group-hover:scale-110 transition-transform">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">Cloudinary File Storage</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              High-throughput cloud storage integration for profile avatars, photo attachments, documents, and audio voice files.
            </p>
          </div>

        </div>
      </section>

      {/* 🎨 FRONTEND & UI INTERACTION FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40 w-full">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold border border-indigo-500/20">
            <Sparkles className="h-3.5 w-3.5" /> Premium UI & Frontend Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Rich & Interactive User Experience
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Designed to wow users with vibrant gradients, glassmorphism, and responsive touch controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Frontend Feature 1 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-indigo-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">6 Accent Gradient Themes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select between Royal Indigo, Cyber Emerald, Sunset Flare, Midnight Fuchsia, Ocean Sapphire, and Crimson Ruby with matching dynamic ambient page backgrounds.
            </p>
          </div>

          {/* Frontend Feature 2 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-amber-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">Persistent Dark & Light Mode</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seamlessly switch between Dark Mode and crisp Light Mode. Fully persisted in browser localStorage with zero refresh flicker.
            </p>
          </div>

          {/* Frontend Feature 3 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-emerald-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">Live GPS Location Sharing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Share browser Geolocation coordinates inside chat threads with direct 1-tap Google Maps navigation buttons.
            </p>
          </div>

          {/* Frontend Feature 4 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-blue-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">Full-Screen Photo Lightbox</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inspect uploaded photo attachments in high definition using an interactive full-screen image lightbox modal.
            </p>
          </div>

          {/* Frontend Feature 5 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-purple-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">Browser Audio Voice Notes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Record microphone audio directly in your browser with live recording timers, waveform scrubbers, and audio controls.
            </p>
          </div>

          {/* Frontend Feature 6 */}
          <div className="p-6 rounded-3xl bg-card/80 border border-border/80 flex flex-col gap-3 transition-all hover:border-pink-500/50 hover:shadow-xl group backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
              <ListChecks className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mt-1">Multi-Select & Touch Actions</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Double-tap message bubbles on mobile or toggle multi-select mode to delete multiple messages across threads seamlessly.
            </p>
          </div>

        </div>
      </section>

      {/* 📞 BEAUTIFUL CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40 w-full">
        <div className="w-full max-w-4xl mx-auto rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-muted/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <Phone className="h-3.5 w-3.5" /> Get In Touch With Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Have Questions or Feedback?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              We'd love to hear from you! Reach out to us directly through phone or email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-background/60 border border-border/80 flex flex-col gap-4 shadow-sm hover:border-primary/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Support</span>
                  <span className="text-base font-extrabold text-foreground tracking-tight">+91 81780 50588</span>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <a href="tel:8178050588" className="flex-1">
                  <Button size="sm" className="w-full rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md shadow-emerald-600/20 border-0">
                    <Phone className="h-3.5 w-3.5 mr-1.5" /> Call Now
                  </Button>
                </a>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl font-bold text-xs cursor-pointer hover:bg-muted"
                  onClick={handleCopyPhone}
                >
                  {copiedPhone ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-background/60 border border-border/80 flex flex-col gap-4 shadow-sm hover:border-primary/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</span>
                  <span className="text-sm font-extrabold text-foreground tracking-tight truncate">deepakwork360@gmail.com</span>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <a href="mailto:deepakwork360@gmail.com" className="flex-1">
                  <Button size="sm" className="w-full rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 cursor-pointer shadow-md shadow-indigo-600/20 border-0">
                    <Mail className="h-3.5 w-3.5 mr-1.5" /> Send Email
                  </Button>
                </a>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl font-bold text-xs cursor-pointer hover:bg-muted"
                  onClick={handleCopyEmail}
                >
                  {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

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
            <Link href="/chat" className="hover:text-foreground transition-colors">Workspace App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
