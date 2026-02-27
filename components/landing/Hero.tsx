import Link from "next/link";
import { Play, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Clip Detection
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Turn one video into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
            10 viral clips
          </span>
          .
          <br />
          Automatically.
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste a YouTube URL. AI identifies the top viral-worthy moments,
          generates hooks, captions, and viral scores. Ship content 10x faster.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors text-lg"
          >
            <Zap className="w-5 h-5" />
            Start Clipping Free
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors text-lg"
          >
            <Play className="w-5 h-5" />
            See How It Works
          </a>
        </div>

        {/* Before / After demo */}
        <div className="mt-20 relative">
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Before */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-left">
              <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                Before
              </div>
              <div className="aspect-video bg-neutral-800 rounded-lg flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-3xl mb-1">🎥</div>
                  <div className="text-sm text-neutral-500">
                    1 hr 23 min podcast
                  </div>
                </div>
              </div>
              <div className="text-sm text-neutral-500">
                Hours of content sitting unwatched...
              </div>
            </div>

            {/* After */}
            <div className="rounded-xl border border-violet-500/30 bg-neutral-900 p-6 text-left ring-1 ring-violet-500/20">
              <div className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-3">
                After ClipEngine
              </div>
              <div className="space-y-2 mb-3">
                {[
                  { score: 94, hook: '"The #1 mistake founders make..."' },
                  { score: 87, hook: '"Nobody talks about this but..."' },
                  { score: 82, hook: '"I lost $50K learning this..."' },
                ].map((clip, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg bg-neutral-800/50 p-2.5"
                  >
                    <div className="w-8 h-8 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                      {clip.score}
                    </div>
                    <div className="text-sm text-neutral-300 truncate">
                      {clip.hook}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-violet-400">
                10 viral clips with hooks + captions
              </div>
            </div>
          </div>

          {/* Arrow between */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-violet-600 items-center justify-center z-10">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
