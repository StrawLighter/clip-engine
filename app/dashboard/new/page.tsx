"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LinkIcon,
  Upload,
  Youtube,
  Mic,
  Tv,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type InputMode = "url" | "upload";

const sourceTypes = [
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "podcast", label: "Podcast", icon: Mic },
  { value: "twitch", label: "Twitch", icon: Tv },
];

export default function NewSourcePage() {
  const [mode, setMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState("youtube");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const sourceData = {
      user_id: user.id,
      title: title || (mode === "url" ? url : "Uploaded Video"),
      source_url: mode === "url" ? url : null,
      source_type: mode === "url" ? sourceType : "upload",
      status: "pending" as const,
    };

    const { data, error: insertError } = await supabase
      .from("sources")
      .insert(sourceData)
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Kick off transcription
    fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceId: data.id }),
    });

    router.push(`/dashboard/source/${data.id}`);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Source</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Paste a URL or upload a video to start finding viral clips
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("url")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            mode === "url"
              ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
              : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
          )}
        >
          <LinkIcon className="w-4 h-4" />
          Paste URL
        </button>
        <button
          onClick={() => setMode("upload")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            mode === "upload"
              ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
              : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
          )}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1.5">
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Give this source a name"
          />
        </div>

        {mode === "url" ? (
          <>
            {/* Source Type */}
            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                Source Type
              </label>
              <div className="flex gap-2">
                {sourceTypes.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setSourceType(st.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      sourceType === st.value
                        ? "bg-violet-600/15 text-violet-300 border border-violet-500/30"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
                    )}
                  >
                    <st.icon className="w-4 h-4" />
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </>
        ) : (
          /* File Upload */
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">
              Video File
            </label>
            <div className="border-2 border-dashed border-neutral-700 rounded-xl p-10 text-center hover:border-neutral-600 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
              <p className="text-sm text-neutral-400 mb-1">
                Drag and drop your video here
              </p>
              <p className="text-xs text-neutral-600">
                MP4, MOV, WebM up to 500MB
              </p>
              <input
                type="file"
                accept="video/*,audio/*"
                className="hidden"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (mode === "url" && !url)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Start Processing
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
