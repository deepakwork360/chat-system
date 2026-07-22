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
    <main className="min-h-screen w-full bg-background flex select-none font-sans overflow-hidden">
      {/* 🎨 LEFT GRAPHICAL PANEL (hidden on mobile) */}
      <section className="hidden lg:flex lg:w-[45%] bg-card border-r border-border flex-col relative p-12 justify-between overflow-hidden bg-dots-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60" />

        {/* Brand Logo header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-foreground">S1mple Chat</span>
        </div>

        {/* Dynamic cover illustration */}
        <div className="my-auto relative z-10 flex items-center justify-center p-4">
          <div className="relative group max-w-[340px] w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(89,180,296,0.35)] shadow-[0_20px_50px_rgba(59,130,246,0.15)]">
            <img
              src="/blue.jpg"
              alt="Auth illustration"
              className="w-full h-full object-cover select-none"
            />
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
      <section className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative bg-card/5">
        <div className="w-full max-w-md flex flex-col gap-6">

          {/* Logo on mobile view */}
          <div className="flex items-center gap-2.5 lg:hidden mb-2">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/15">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">S1mple Chat</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Get started</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Create an account and start collaborating with your coworkers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
              <Input
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="h-11 text-sm border-border bg-card/30 focus-visible:ring-1 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <Input
                placeholder="you@workplace.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11 text-sm border-border bg-card/30 focus-visible:ring-1 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
              <Input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11 text-sm border-border bg-card/30 focus-visible:ring-1 rounded-xl"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer mt-2"
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
          <div className="text-center text-xs sm:text-sm text-muted-foreground mt-2 border-t border-border/40 pt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}