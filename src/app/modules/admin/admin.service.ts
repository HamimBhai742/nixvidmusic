import { prisma } from "../../utils/prisma";
import { AccessType, RedeemCodeStatus, SubscriptionStatus, UserStatus } from "@prisma/client";

const getUserManagementOverview = async () => {
  const now = new Date();

  const [activeUsers, codesRedeemed, totalScans] = await Promise.all([
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.redeemCode.count({ where: { status: RedeemCodeStatus.USED } }),
    prisma.scanUsageLog.count({ where: { status: "SUCCESS" } }),
  ]);

  const activeSubscriptions = await prisma.userSubscription.findMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
      OR: [{ endDate: null }, { endDate: { gt: now } }],
    },
    select: {
      plan: { select: { name: true } },
    },
    take: 10000,
  });

  const planCounts = new Map<string, number>();
  for (const sub of activeSubscriptions) {
    const name = sub.plan?.name || "Unknown";
    planCounts.set(name, (planCounts.get(name) || 0) + 1);
  }

  let currentSubscriptionName: string | null = null;
  let currentSubscriptionCount = 0;
  for (const [name, count] of planCounts.entries()) {
    if (count > currentSubscriptionCount) {
      currentSubscriptionName = name;
      currentSubscriptionCount = count;
    }
  }

  return {
    cards: {
      currentSubscription: {
        name: currentSubscriptionName,
        activeSubscribers: currentSubscriptionCount,
      },
      totalScans,
      codesRedeemed,
      activeUsers,
    },
  };
};

const mapAccessStatus = (status: string) => {
  if (status === "ACTIVE") return "Active";
  if (status === "EXHAUSTED") return "Redeemed";
  if (status === "EXPIRED") return "Expired";
  return status;
};

const getRecentUserActivity = async (query: { limit?: string }) => {
  const limit = Math.min(Math.max(parseInt(query.limit || "10", 10) || 10, 1), 50);
  const now = new Date();

  const recentAccesses = await prisma.userAccess.findMany({
    where: { accessType: AccessType.CREATOR_PASS },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, name: true, email: true, plan: true, status: true } },
      sourceCode: {
        select: {
          code: true,
          status: true,
          expiresAt: true,
        },
      },
    },
  });

  const userIds = recentAccesses.map((a) => a.userId);
  const activeSubs = await prisma.userSubscription.findMany({
    where: {
      userId: { in: userIds },
      status: SubscriptionStatus.ACTIVE,
      OR: [{ endDate: null }, { endDate: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
    include: { plan: { select: { name: true } } },
    take: 10000,
  });

  const userToPlanName = new Map<string, string>();
  for (const sub of activeSubs) {
    if (!userToPlanName.has(sub.userId)) {
      userToPlanName.set(sub.userId, sub.plan?.name || "Subscription");
    }
  }

  const activities = recentAccesses.map((a) => {
    const subscriptionPlan = userToPlanName.get(a.userId) || null;
    const fallbackPlan = a.user?.plan === "PREMIUM" ? "Premium" : "Free";

    const isExpiredByDate =
      a.sourceCode?.expiresAt && new Date(a.sourceCode.expiresAt) < new Date();

    const status = isExpiredByDate ? "Expired" : mapAccessStatus(a.status);

    return {
      id: a.id,
      user: {
        id: a.user?.id ?? null,
        name: a.user?.name ?? null,
        email: a.user?.email ?? null,
        status: a.user?.status ?? null,
      },
      currentPlan: {
        name: subscriptionPlan ?? fallbackPlan,
      },
      code: a.sourceCode?.code ?? null,
      date: a.createdAt,
      status,
      meta: {
        scansRemaining: a.scansRemaining,
        scansUsed: a.scansUsed,
      },
    };
  });

  return { recentUserActivity: activities };
};

export const adminService = {
  getUserManagementOverview,
  getRecentUserActivity,
};

