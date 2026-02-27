import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-700 mb-4">404</h1>
        <p className="text-neutral-400 mb-6">Page not found</p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
