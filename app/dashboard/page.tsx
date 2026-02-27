import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Film, Sparkles, TrendingUp } from "lucide-react";
import SourceCard from "@/components/dashboard/SourceCard";
import type { Source } from "@/types";

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: sources } = await supabase
    .from("sources")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: clipStats } = await supabase
    .from("clips")
    .select("viral_score")
    .eq("user_id", user.id);

  const totalClips = clipStats?.length ?? 0;
  const avgScore =
    totalClips > 0
      ? Math.round(
          (clipStats?.reduce((sum, c) => sum + (c.viral_score || 0), 0) ?? 0) /
            totalClips
        )
      : 0;
  const topScore =
    clipStats?.reduce(
      (max, c) => Math.max(max, c.viral_score || 0),
      0
    ) ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Your content library
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Source
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center">
              <Film className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm text-neutral-400">Total Clips</span>
          </div>
          <div className="text-2xl font-bold">{totalClips}</div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm text-neutral-400">Avg Viral Score</span>
          </div>
          <div className="text-2xl font-bold">{avgScore || "—"}</div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-neutral-400">Top Score</span>
          </div>
          <div className="text-2xl font-bold">{topScore || "—"}</div>
        </div>
      </div>

      {/* Sources grid */}
      {sources && sources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(sources as Source[]).map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-dashed border-neutral-800">
          <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Film className="w-6 h-6 text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No sources yet</h3>
          <p className="text-neutral-400 text-sm mb-6">
            Add your first video or podcast to get started
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </Link>
        </div>
      )}
    </div>
  );
}
