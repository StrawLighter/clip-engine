import { Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/50 py-12 px-6">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <Scissors className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-neutral-300">ClipEngine</span>
        </div>
        <div className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} ClipEngine. Ship more clips.
        </div>
      </div>
    </footer>
  );
}
