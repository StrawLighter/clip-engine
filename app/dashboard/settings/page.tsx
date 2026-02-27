"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Platform } from "@/types";
import { Save, Loader2, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";

const platformOptions: { value: Platform; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram Reels" },
  { value: "youtube_shorts", label: "YouTube Shorts" },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [brandVoice, setBrandVoice] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        setBrandVoice(data.brand_voice || "");
        setPlatforms(data.default_platforms || ["tiktok", "instagram", "youtube_shorts"]);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        brand_voice: brandVoice,
        default_platforms: platforms,
      })
      .eq("id", profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function togglePlatform(platform: Platform) {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }

  async function handleManageBilling() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Customize your ClipEngine experience
        </p>
      </div>

      <div className="space-y-8">
        {/* Account */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-violet-400" />
            <h2 className="font-semibold">Account</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Email</span>
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Plan</span>
              <span className="capitalize px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-medium">
                {profile?.plan || "free"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Clips this month</span>
              <span>{profile?.clips_this_month || 0}</span>
            </div>
          </div>
        </div>

        {/* Brand Voice */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="font-semibold mb-1">Brand Voice</h2>
          <p className="text-sm text-neutral-400 mb-4">
            Describe your brand&apos;s tone and style. This helps AI generate
            better captions.
          </p>
          <textarea
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition-colors text-sm resize-none"
            placeholder="e.g., Casual and energetic. Use humor and hot takes. Speak directly to aspiring entrepreneurs..."
          />
        </div>

        {/* Default Platforms */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="font-semibold mb-1">Default Platforms</h2>
          <p className="text-sm text-neutral-400 mb-4">
            Select which platforms to generate captions for by default.
          </p>
          <div className="flex gap-2">
            {platformOptions.map((p) => (
              <button
                key={p.value}
                onClick={() => togglePlatform(p.value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  platforms.includes(p.value)
                    ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
                    : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Billing */}
        {profile?.stripe_customer_id && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold">Billing</h2>
            </div>
            <button
              onClick={handleManageBilling}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              Manage Subscription
            </button>
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
