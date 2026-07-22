"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register } from "@/services/auth.service";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/chat");
    }
  }, [router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register({
        name,
        email,
        password,
      });

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background flex select-none font-sans overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 🎨 LEFT GRAPHICAL PANEL (hidden on mobile) */}
      <section className="hidden lg:flex lg:w-[45%] bg-card/40 border-r border-border/50 flex-col relative p-12 justify-between overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-primary/5 opacity-70" />

        {/* Brand Logo header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-foreground">S1mple Chat</span>
        </div>

        {/* Dynamic cover illustration */}
        <div className="my-auto relative z-10 flex items-center justify-center p-4">
          <div className="relative group max-w-[320px] w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/10 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(59,130,246,0.30)]">
            <img
              src="/blue.jpg"
              alt="Auth illustration"
              className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/90 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                Join 10k+ Teams
              </span>
            </div>
          </div>
        </div>

        {/* Catchy footer text */}
        <div className="relative z-10 flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Next-Gen Workspace Chat</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Experience lightning-fast communication, read receipts, unread message badges, group creations, and high-fidelity audio recordings.
          </p>
        </div>
      </section>

      {/* 📝 RIGHT FORM PANEL */}
      <section className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md flex flex-col gap-7 bg-card/40 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-border/50 shadow-2xl shadow-black/40">

          {/* Logo on mobile view */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-white/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-foreground">S1mple Chat</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Get started</h1>
            <p className="text-sm text-muted-foreground">
              Create an account and start collaborating with your coworkers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
              <Input
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="h-12 text-sm border-border/60 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary rounded-xl transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <Input
                placeholder="you@workplace.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 text-sm border-border/60 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary rounded-xl transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
              <Input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-12 text-sm border-border/60 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary rounded-xl transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3.5 rounded-xl font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-12 rounded-xl font-bold text-sm bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Redirection Link */}
          <div className="text-center text-sm text-muted-foreground border-t border-border/40 pt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline transition-all">
              Log in
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}