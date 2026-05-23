import Stripe from "stripe";
import httpStatus from "http-status";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../utils/prisma";
import { AppError } from "../../error/AppError";
import { SubscriptionStatus } from "../../interface/Stripe.interface";
import { DEFAULT_PRICING_CONFIG, PricingFeature } from "./pricing.config";
import { BillingPeriod, Prisma } from "@prisma/client";

// ===== Interfaces =====
interface CreatePlanPayload {
  title: string;
  price: number;
  currency: string;
  billingPeriod: "month" | "year";
  features: any; // features object array
  isPopular?: boolean;
  benefits?: string[];
}

interface PurchaseSubscriptionPayload {
  subscriptionId: string;
  paymentMethodId?: string;
}

// ===== Create Plan =====
export const createSubscriptionIntoDb = async (payload: CreatePlanPayload) => {
  const currency = payload.currency || "usd";
  const interval: Stripe.PriceCreateParams.Recurring.Interval =
    payload.billingPeriod === "month" ? "month" : "year";

  let productId: string | null = null;
  let pricingId: string | null = null;

  // Paid plan only
  if (payload.price > 0) {
    const product = await stripe.products.create({ name: payload.title });
    productId = product.id;

    const priceData: Stripe.PriceCreateParams = {
      unit_amount: Math.round(payload.price * 100),
      currency,
      product: product.id,
    };

    priceData.recurring = { interval };

    const price = await stripe.prices.create(priceData);
    pricingId = price.id;
  }

  // Features JSON string হিসেবে save করা

  const duplicatePlan = await prisma.subscriptionPlan.findFirst({
    where: {
      name: payload.title,
    },
  });

  if (duplicatePlan) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Plan is already exist");
  }

  const plan = await prisma.subscriptionPlan.create({
    data: {
      name: payload.title,
      price: payload.price,
      currency,
      billingPeriod: interval === "month" ? "MONTHLY" : "YEARLY",
      isPopular: payload.isPopular ?? false,
      features: payload.features,
      benefits:
        payload.benefits ??
        (Array.isArray(payload.features)
          ? payload.features
              .filter((f: any) => f && typeof f === "object" && f.included)
              .map((f: any) => String(f.label))
          : []),
      productId,
      pricingId,
    },
  });

  return plan;
};

// ===== Get All Plans =====
export const getAllSubscriptionPlans = async () => {
  return prisma.subscriptionPlan.findMany({
    orderBy: { createdAt: "asc" },
  });
};

const formatMoney = (amount: number, currency: string) => {
  const upper = currency.toUpperCase();
  const symbol = upper === "GBP" ? "£" : upper === "USD" ? "$" : "";
  const formatted = Number.isFinite(amount) ? amount.toFixed(2).replace(/\.00$/, "") : String(amount);
  return `${symbol}${formatted}`;
};

const normalizeFeatureList = (value: unknown): PricingFeature[] | null => {
  if (!Array.isArray(value)) return null;
  const mapped: PricingFeature[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const label = (item as any).label;
    const included = (item as any).included;
    if (typeof label !== "string" || typeof included !== "boolean") return null;
    mapped.push({ label, included });
  }
  return mapped;
};

export const getPricingForFrontend = async () => {
  const config = DEFAULT_PRICING_CONFIG;

  try {
    // Ensure default plans exist in DB (idempotent)
    for (const plan of config.plans) {
      const benefits = plan.features
        .filter((f) => f.included)
        .map((f) => f.label);

      const record = await prisma.subscriptionPlan.upsert({
        where: { name: plan.name },
        update: {
          price: plan.amount,
          currency: plan.currency,
          billingPeriod: plan.billingPeriod,
          isPopular: plan.isPopular,
          features: plan.features as unknown as Prisma.InputJsonValue,
          benefits,
        },
        create: {
          name: plan.name,
          price: plan.amount,
          currency: plan.currency,
          billingPeriod: plan.billingPeriod,
          isPopular: plan.isPopular,
          features: plan.features as unknown as Prisma.InputJsonValue,
          benefits,
        },
      });

      // Backfill Stripe product/price for paid plans (one-time) if missing
      if (record.price > 0 && !record.pricingId) {
        const product = record.productId
          ? await stripe.products.retrieve(record.productId).catch(() => null)
          : null;

        const ensuredProduct =
          product && !("deleted" in product && product.deleted)
            ? product
            : await stripe.products.create({ name: record.name });

        const price = await stripe.prices.create({
          unit_amount: Math.round((record.price ?? 0) * 100),
          currency: record.currency ?? "usd",
          product: ensuredProduct.id,
          recurring: {
            interval: record.billingPeriod === BillingPeriod.YEARLY ? "year" : "month",
          },
        });

        await prisma.subscriptionPlan.update({
          where: { id: record.id },
          data: { productId: ensuredProduct.id, pricingId: price.id },
        });
      }
    }

    const dbPlans = await prisma.subscriptionPlan.findMany({
      where: { name: { in: config.plans.map((p) => p.name) } },
      orderBy: { createdAt: "asc" },
    });

    const byName = new Map(dbPlans.map((p) => [p.name, p]));

    const plans = config.plans.map((p) => {
      const db = byName.get(p.name) || null;
      const dbFeatures = db ? normalizeFeatureList((db as any).features) : null;
      const currency = db?.currency ?? p.currency;
      const amount = typeof db?.price === "number" ? db.price : p.amount;
      const billingPeriod = (db?.billingPeriod ?? p.billingPeriod) as BillingPeriod;

      return {
        id: db?.id ?? null,
        key: p.key,
        name: p.name,
        description: p.description,
        isPopular: db?.isPopular ?? p.isPopular,
        trialDays: p.trialDays ?? null,
        ctaLabel: p.ctaLabel,
        limits: p.limits ?? null,
        billingPeriod,
        price: {
          amount,
          currency,
          interval: billingPeriod === BillingPeriod.YEARLY ? "year" : "month",
          display: amount === 0 ? `${formatMoney(0, currency)}` : `${formatMoney(amount, currency)}`,
        },
        stripe: {
          productId: db?.productId ?? null,
          priceId: db?.pricingId ?? null,
        },
        features: dbFeatures ?? p.features,
        benefits:
          (Array.isArray((db as any)?.benefits) && (db as any).benefits.length
            ? (db as any).benefits
            : p.features.filter((f) => f.included).map((f) => f.label)) ?? [],
      };
    });

    return {
      plans,
      creatorPass: {
        ...config.creatorPass,
        price: {
          amount: config.creatorPass.amount,
          currency: config.creatorPass.currency,
          interval: "one_time",
          display: formatMoney(config.creatorPass.amount, config.creatorPass.currency),
        },
      },
    };
  } catch (err) {
    console.error("Failed to build pricing response:", err);
    // Fallback to static config so pricing UI can still render
    return {
      plans: config.plans.map((p) => ({
        id: null,
        key: p.key,
        name: p.name,
        description: p.description,
        isPopular: p.isPopular,
        trialDays: p.trialDays ?? null,
        ctaLabel: p.ctaLabel,
        limits: p.limits ?? null,
        billingPeriod: p.billingPeriod,
        price: {
          amount: p.amount,
          currency: p.currency,
          interval: p.billingPeriod === BillingPeriod.YEARLY ? "year" : "month",
          display: p.amount === 0 ? `${formatMoney(0, p.currency)}` : `${formatMoney(p.amount, p.currency)}`,
        },
        stripe: { productId: null, priceId: null },
        features: p.features,
        benefits: p.features.filter((f) => f.included).map((f) => f.label),
      })),
      creatorPass: {
        ...config.creatorPass,
        price: {
          amount: config.creatorPass.amount,
          currency: config.creatorPass.currency,
          interval: "one_time",
          display: formatMoney(config.creatorPass.amount, config.creatorPass.currency),
        },
      },
    };
  }
};

// ===== Purchase Subscription =====
export const purchaseSubscription = async (
  payload: PurchaseSubscriptionPayload,
  userId: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: payload.subscriptionId },
  });
  if (!plan)
    throw new AppError(httpStatus.NOT_FOUND, "Subscription plan not found");

  const existing = await prisma.userSubscription.findFirst({
    where: { userId, status: SubscriptionStatus.ACTIVE },
  });
  if (existing)
    throw new AppError(
      httpStatus.CONFLICT,
      "You already have an active subscription.",
    );

  // Free plan
  if ((plan.price ?? 0) === 0) {
    const userSubscription = await prisma.userSubscription.upsert({
      where: { userId_planId_unique: { userId, planId: plan.id } },
      update: {
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
      },
    });
    return {
      subscription: userSubscription,
      stripe: null,
    };
  }

  if (!plan.pricingId)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This plan is not configured with a Stripe price.",
    );
    
  // if (!payload.paymentMethodId)
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "paymentMethodId is required for paid plans",
  //   );

  const fullname = user.name || user.email;
  const customer = await stripe.customers.create({
    email: user.email,
    name: fullname,
  });
  const stripeCustomerId = customer.id;

  // await stripe.paymentMethods.attach(payload.paymentMethodId, {
  //   customer: stripeCustomerId,
  // });
  // await stripe.customers.update(stripeCustomerId, {
  //   invoice_settings: { default_payment_method: payload.paymentMethodId },
  // });

  const stripeSub = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: plan.pricingId }],
    payment_behavior:"default_incomplete",
    expand: ["latest_invoice"],
    metadata: { userId, subscriptionId: plan.id },
    payment_settings: { payment_method_types: ["card"] },
    trial_period_days: 7
  });
console.log(stripeSub)
  const userSubscription = await prisma.userSubscription.create({
    data: {
      userId,
      planId: plan.id,
      status: SubscriptionStatus.PENDING,
      startDate: new Date(),
      transactionId: stripeSub.id,
      paymentMethod: "stripe",
    },
  });

  const latestInvoice = stripeSub.latest_invoice as Stripe.Invoice | null;
  const clientSecret =
    (latestInvoice as any)?.confirmation_secret?.client_secret ?? null;

  return {
    subscription: userSubscription,
    stripe: {
      customerId: stripeCustomerId,
      subscriptionId: stripeSub.id,
      status: stripeSub.status,
      clientSecret,
    },
  };
};

// ===== Unsubscribe =====
export const unsubscribeSubscription = async (
  userId: string,
  planId: string,
) => {
  const userSub = await prisma.userSubscription.findFirst({
    where: { userId, planId },
  });
  if (!userSub)
    throw new AppError(httpStatus.NOT_FOUND, "User subscription not found");

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });
  if (!plan) throw new AppError(httpStatus.NOT_FOUND, "Plan not found");

  if ((plan.price ?? 0) === 0) {
    await prisma.userSubscription.delete({ where: { id: userSub.id } });
    return { success: true };
  }

  if (userSub.transactionId) {
    try {
      await stripe.subscriptions.cancel(userSub.transactionId);
      await prisma.userSubscription.delete({
        where: { id: userSub.id },
        // data: { status: SubscriptionStatus.CANCELLED, cancelAt: new Date() },
      });
    } catch (err) {
      console.error("Stripe cancel error:", err);
    }
  }

  return { success: true };
};

// ===== Stripe Webhook Handlers =====
export const handleStripeSubscriptionCreated = async (
  stripeSub: Stripe.Subscription,
) => {
  const metadata = stripeSub.metadata || {};
  const userId = metadata.userId;
  const subscriptionId = metadata.subscriptionId;

  if (!userId || !subscriptionId) return;

  const mappedStatus =
    stripeSub.status === "active" || stripeSub.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : stripeSub.status === "canceled"
        ? SubscriptionStatus.CANCELLED
        : SubscriptionStatus.PENDING;

  const currentPeriodEndSeconds = (stripeSub as any)?.current_period_end;
  const currentPeriodEnd =
    typeof currentPeriodEndSeconds === "number"
      ? new Date(currentPeriodEndSeconds * 1000)
      : null;

  const existing = await prisma.userSubscription.findFirst({
    where: { transactionId: stripeSub.id },
  });

  if (existing) {
    await prisma.userSubscription.update({
      where: { id: existing.id },
      data: {
        status: mappedStatus,
        transactionId: stripeSub.id,
        endDate: currentPeriodEnd,
        cancelAt:
          stripeSub.cancel_at && typeof stripeSub.cancel_at === "number"
            ? new Date(stripeSub.cancel_at * 1000)
            : null,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.userSubscription.create({
      data: {
        userId,
        planId: subscriptionId,
        status: mappedStatus,
        startDate: new Date(),
        endDate: currentPeriodEnd,
        cancelAt:
          stripeSub.cancel_at && typeof stripeSub.cancel_at === "number"
            ? new Date(stripeSub.cancel_at * 1000)
            : null,
        transactionId: stripeSub.id,
      },
    });
  }
};

export const handleStripeSubscriptionDeleted = async (
  stripeSub: Stripe.Subscription,
) => {
  await prisma.userSubscription.updateMany({
    where: { transactionId: stripeSub.id },
    data: { status: SubscriptionStatus.CANCELLED, cancelAt: new Date() },
  });
};

export const handleInvoicePaymentSucceeded = async (
  invoice: Stripe.Invoice,
) => {
  const subscriptionId = (invoice as any).subscription as string | undefined;
  if (!subscriptionId) return;

  await prisma.userSubscription.updateMany({
    where: { transactionId: subscriptionId },
    data: { status: SubscriptionStatus.ACTIVE },
  });
};

export const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscriptionId = (invoice as any).subscription as string | undefined;
  if (!subscriptionId) return;

  await prisma.userSubscription.updateMany({
    where: { transactionId: subscriptionId },
    data: { status: SubscriptionStatus.PENDING },
  });
};
