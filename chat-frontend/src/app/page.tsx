import Link from "next/link";
import Register from "./register/page";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1>Welcome to Chat System</h1>
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
    </main>
  );
}
