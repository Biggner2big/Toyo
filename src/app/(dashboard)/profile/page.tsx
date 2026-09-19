"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Save, CheckCircle2, AlertCircle, KeyRound, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (profile?.full_name) {
            setFullName(profile.full_name);
          } else if (user.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setIsUpdatingProfile(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          email: user.email,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      setProfileMessage({ type: "success", text: "Profile information updated successfully!" });
    } catch (err: unknown) {
      setProfileMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to change password.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
        <p className="text-xs text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <User className="w-7 h-7 text-sky-400" />
          <span>Profile & Account Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your personal details, email address, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <Card className="p-6 bg-[#0f1624] border-slate-800">
          <CardHeader>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display name and contact identity.</CardDescription>
            </div>
            <Badge variant="primary">Active Account</Badge>
          </CardHeader>

          {profileMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                profileMessage.type === "success"
                  ? "bg-emerald-950/40 border border-emerald-800/60 text-emerald-300"
                  : "bg-rose-950/40 border border-rose-800/60 text-rose-300"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Input
                label="Email Address"
                value={email}
                disabled
                helperText="Email address is associated with your primary Supabase login."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isUpdatingProfile}
                icon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Security / Password Card */}
        <Card className="p-6 bg-[#0f1624] border-slate-800">
          <CardHeader>
            <div>
              <CardTitle>Security & Password</CardTitle>
              <CardDescription>Update your login credentials.</CardDescription>
            </div>
            <KeyRound className="w-5 h-5 text-slate-500" />
          </CardHeader>

          {passwordMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                passwordMessage.type === "success"
                  ? "bg-emerald-950/40 border border-emerald-800/60 text-emerald-300"
                  : "bg-rose-950/40 border border-rose-800/60 text-rose-300"
              }`}
            >
              {passwordMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="secondary"
                size="md"
                isLoading={isUpdatingPassword}
                icon={<Shield className="w-4 h-4" />}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
