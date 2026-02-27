import {
  Sparkles,
  BarChart3,
  MessageSquare,
  Clock,
  Layers,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Viral Detection",
    description:
      "GPT-4o analyzes your transcript and identifies the moments with the highest viral potential.",
  },
  {
    icon: BarChart3,
    title: "Viral Score Ranking",
    description:
      "Every clip gets a 1-100 viral score based on emotional impact, quotability, and engagement potential.",
  },
  {
    icon: MessageSquare,
    title: "Platform Captions",
    description:
      "Auto-generated captions optimized for TikTok, Instagram Reels, and YouTube Shorts.",
  },
  {
    icon: Clock,
    title: "Synced Transcripts",
    description:
      "Word-level timestamps synced to your video. Click any moment to jump to that exact point.",
  },
  {
    icon: Layers,
    title: "Clip Library",
    description:
      "All your approved clips in one place. Filter by source, score, or platform. Batch export.",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description:
      "Export timestamps, hooks, and captions as a ready-to-use package for your editing workflow.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to ship clips faster
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            From transcript to viral clip in minutes, not hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-600/15 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
