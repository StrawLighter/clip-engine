import { LinkIcon, Mic, Sparkles, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: LinkIcon,
    step: "01",
    title: "Paste a URL or Upload",
    description:
      "Drop a YouTube link, podcast URL, or upload a video file directly.",
  },
  {
    icon: Mic,
    step: "02",
    title: "AI Transcribes",
    description:
      "Whisper API generates a word-level transcript with precise timestamps.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Clips Detected",
    description:
      "GPT-4o identifies the top viral-worthy moments, scores them, and writes hooks.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Review & Export",
    description:
      "Approve your favorites, grab platform captions, and export your clip package.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 border-t border-neutral-800/50"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How it works
          </h2>
          <p className="text-neutral-400 text-lg">
            Four steps. One video. Ten clips.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={step.step} className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div className="pt-1">
                <div className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-1">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                <p className="text-neutral-400">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
