"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try it out with 3 clips per month.",
    features: [
      "3 clips per month",
      "YouTube URL support",
      "AI viral scoring",
      "Platform captions",
      "JSON export",
    ],
    cta: "Start Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Unlimited clips for serious content creators.",
    features: [
      "Unlimited clips",
      "YouTube, podcasts, uploads",
      "AI viral scoring",
      "Platform captions",
      "Priority processing",
      "Brand voice customization",
      "Batch export",
      "Calendar view",
    ],
    cta: "Go Pro",
    href: "/signup",
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-neutral-800/50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple pricing
          </h2>
          <p className="text-neutral-400 text-lg">
            Start free. Upgrade when you&apos;re hooked.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.featured
                  ? "border-violet-500/40 bg-violet-500/5 ring-1 ring-violet-500/20"
                  : "border-neutral-800 bg-neutral-900/50"
              }`}
            >
              {plan.featured && (
                <div className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-4">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-neutral-500">{plan.period}</span>
                </div>
                <p className="text-sm text-neutral-400 mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${
                        plan.featured ? "text-violet-400" : "text-neutral-500"
                      }`}
                    />
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.featured
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
