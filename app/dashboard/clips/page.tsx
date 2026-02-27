"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Clip, Source } from "@/types";
import ClipCard from "@/components/dashboard/ClipCard";
import { Film, Filter, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "suggested" | "approved" | "exported";

export default function ClipsPage() {
  const [clips, setClips] = useState<(Clip & { source_title?: string })[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [clipRes, sourceRes] = await Promise.all([
        supabase
          .from("clips")
          .select("*")
          .eq("user_id", user.id)
          .order("viral_score", { ascending: false }),
        supabase
          .from("sources")
          .select("id, title")
          .eq("user_id", user.id),
      ]);

      const sourceMap = new Map(
        (sourceRes.data || []).map((s) => [s.id, s.title])
      );

      setClips(
        (clipRes.data || []).map((c) => ({
          ...c,
          source_title: sourceMap.get(c.source_id) || "Unknown",
        }))
      );
      setSources((sourceRes.data as Source[]) || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleApprove(clipId: string) {
    const supabase = createClient();
    await supabase
      .from("clips")
      .update({ status: "approved" })
      .eq("id", clipId);
    setClips((prev) =>
      prev.map((c) => (c.id === clipId ? { ...c, status: "approved" } : c))
    );
  }

  async function handleDismiss(clipId: string) {
    const supabase = createClient();
    await supabase.from("clips").delete().eq("id", clipId);
    setClips((prev) => prev.filter((c) => c.id !== clipId));
  }

  function handleExportAll() {
    const approved = filteredClips.filter(
      (c) => c.status === "approved" || c.status === "exported"
    );
    const exportData = approved.map((c) => ({
      title: c.title,
      hook: c.hook,
      start_time: c.start_time,
      end_time: c.end_time,
      duration_seconds: c.duration_seconds,
      viral_score: c.viral_score,
      captions: {
        tiktok: c.caption_tiktok,
        instagram: c.caption_instagram,
        youtube: c.caption_youtube,
      },
      hashtags: c.hashtags,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clips-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredClips = clips.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (sourceFilter !== "all" && c.source_id !== sourceFilter) return false;
    return true;
  });

  const approvedCount = filteredClips.filter(
    (c) => c.status === "approved" || c.status === "exported"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Clip Library</h1>
          <p className="text-neutral-400 text-sm mt-1">
            All your clips across every source
          </p>
        </div>
        {approvedCount > 0 && (
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Approved ({approvedCount})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-neutral-500" />

        {/* Status filter */}
        <div className="flex gap-1">
          {(["all", "suggested", "approved", "exported"] as FilterStatus[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                  statusFilter === status
                    ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                )}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Source filter */}
        {sources.length > 1 && (
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Sources</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title || "Untitled"}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Clips */}
      {filteredClips.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredClips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onApprove={handleApprove}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-dashed border-neutral-800">
          <Film className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 text-sm">
            {clips.length === 0
              ? "No clips yet. Add a source to get started."
              : "No clips match your filters."}
          </p>
        </div>
      )}
    </div>
  );
}
