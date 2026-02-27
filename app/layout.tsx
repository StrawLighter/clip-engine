import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipEngine — Turn Long-Form Content Into Viral Clips",
  description:
    "Paste a YouTube URL. Get 10 viral clips with hooks, captions, and viral scores. Ship content 10x faster.",
  openGraph: {
    title: "ClipEngine — Turn one video into 10 viral clips.",
    description:
      "AI-powered clip detection with viral scoring, platform-specific captions, and one-click export.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-neutral-950 text-neutral-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
