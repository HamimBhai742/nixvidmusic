import { BillingPeriod } from "@prisma/client";

export type PricingPlanKey = "free" | "starter" | "professional" | "business";

export interface PricingFeature {
  label: string;
  included: boolean;
}

export interface PricingPlanConfig {
  key: PricingPlanKey;
  name: string;
  description: string;
  amount: number;
  currency: string;
  billingPeriod: BillingPeriod;
  isPopular: boolean;
  trialDays?: number;
  ctaLabel: string;
  limits?: {
    contractScansPerMonth?: number | "unlimited";
  };
  features: PricingFeature[];
}

export interface CreatorPassConfig {
  name: string;
  badgeText?: string;
  description: string;
  amount: number;
  currency: string;
  scansIncluded: number;
  ctaLabel: string;
  features: string[];
}

export const DEFAULT_PRICING_CONFIG: {
  plans: PricingPlanConfig[];
  creatorPass: CreatorPassConfig;
} = {
  plans: [
    {
      key: "free",
      name: "Free",
      description: "Perfect for trying out contract scans.",
      amount: 0,
      currency: "gbp",
      billingPeriod: BillingPeriod.MONTHLY,
      isPopular: false,
      ctaLabel: "Get Started",
      limits: { contractScansPerMonth: 3 },
      features: [
        { label: "Basic summary", included: true },
        { label: "Top 3 risks", included: true },
        { label: "3 contract scans / month", included: true },
        { label: "Clause breakdown", included: true },
        { label: "Risk scoring", included: false },
        { label: "Negotiation tips", included: false },
        { label: "Market analysis", included: false },
        { label: "Unlimited contracts", included: false },
        { label: "Export reports", included: false },
      ],
    },
    {
      key: "starter",
      name: "Starter",
      description: "For occasional contract reviews.",
      amount: 5.99,
      currency: "gbp",
      billingPeriod: BillingPeriod.MONTHLY,
      isPopular: false,
      ctaLabel: "Choose Starter",
      limits: { contractScansPerMonth: 5 },
      features: [
        { label: "Basic summary", included: true },
        { label: "Top risks (extended)", included: true },
        { label: "5 contract scans / month", included: true },
        { label: "Clause-by-clause breakdown", included: true },
        { label: "Detailed risk scoring", included: true },
        { label: "Negotiation tips", included: false },
        { label: "Export to PDF", included: true },
        { label: "Priority email support", included: true },
      ],
    },
    {
      key: "professional",
      name: "Professional",
      description: "Best for active creators.",
      amount: 9.99,
      currency: "gbp",
      billingPeriod: BillingPeriod.MONTHLY,
      isPopular: true,
      trialDays: 7,
      ctaLabel: "Choose Professional",
      limits: { contractScansPerMonth: 15 },
      features: [
        { label: "Everything in Free", included: true },
        { label: "Clause-by-clause breakdown", included: true },
        { label: "Advanced risk analysis", included: true },
        { label: "Risk scoring", included: true },
        { label: "Negotiation tips & strategies", included: true },
        { label: "Market analysis", included: true },
        { label: "Export & share reports", included: true },
        { label: "Custom templates", included: true },
      ],
    },
    {
      key: "business",
      name: "Business",
      description: "For agencies and teams.",
      amount: 14.99,
      currency: "gbp",
      billingPeriod: BillingPeriod.MONTHLY,
      isPopular: false,
      ctaLabel: "Choose Business",
      limits: { contractScansPerMonth: "unlimited" },
      features: [
        { label: "Unlimited contract scans", included: true },
        { label: "All Professional features", included: true },
        { label: "Team collaboration", included: true },
        { label: "API access", included: true },
        { label: "Dedicated support", included: true },
        { label: "Custom integrations", included: true },
      ],
    },
  ],
  creatorPass: {
    badgeText: "Limited Time Offer",
    name: "Creator Pass",
    description:
      "One-time purchase for creators. Get contract scans with full analysis.",
    amount: 9.99,
    currency: "gbp",
    scansIncluded: 5,
    ctaLabel: "Buy Creator Pass",
    features: ["5 contract scans", "Full risk analysis & tips", "Onboarding guide"],
  },
};

