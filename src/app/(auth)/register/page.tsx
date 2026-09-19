"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data.session) {
        // Automatically signed in
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccess("Account created successfully! Please check your email to confirm registration, or sign in directly.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 border-slate-800 shadow-2xl bg-[#0f1624]">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-800/60 text-sky-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-950/40">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
        <p className="text-xs text-slate-400">
          Sign up to begin drafting and saving pre-legal documents.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          size="lg"
          isLoading={isLoading}
        >
          Create Free Account
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </Card>
  );
}
