import { prisma } from "../../utils/prisma";
import { AppError } from "../../error/AppError";
import httpStatus from "http-status";
import crypto from "crypto";
import { RedeemCodeType, RedeemCodeStatus, UserAccessStatus, ScanStatus, AccessType } from "@prisma/client";

// Generate user-friendly, high-entropy unique code avoiding ambiguous characters
function generateSecureCode(prefix: string): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude 0, 1, O, I, L, etc.
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars[crypto.randomInt(0, chars.length)];
    part2 += chars[crypto.randomInt(0, chars.length)];
  }
  return `${prefix}-${part1}-${part2}`;
}

const generateRedeemCodes = async (
  adminId: string,
  payload: {
    type: RedeemCodeType;
    quantity: number;
    scansAllowed: number;
    source: string;
    expiresAt?: Date | null;
    note?: string;
  }
) => {
  const { type, quantity, scansAllowed, source, expiresAt, note } = payload;
  const prefix = type === "CREATOR_PASS" ? "CREATOR" : "AFFILIATE";

  // Create batch record first
  const batch = await prisma.redeemCodeBatch.create({
    data: {
      name: note || `${prefix} Batch - ${new Date().toLocaleDateString()}`,
      type,
      quantity,
      scansAllowed,
      source,
      createdBy: adminId,
    },
  });

  const generatedCodes: string[] = [];
  const uniqueCodesSet = new Set<string>();

  // Generate unique codes and verify uniqueness
  while (uniqueCodesSet.size < quantity) {
    const candidateCode = generateSecureCode(prefix);
    // Ensure we don't have duplicates in this batch run
    if (!uniqueCodesSet.has(candidateCode)) {
      // Check if it already exists in the database
      const existing = await prisma.redeemCode.findUnique({
        where: { code: candidateCode },
        select: { id: true },
      });
      if (!existing) {
        uniqueCodesSet.add(candidateCode);
      }
    }
  }

  const codesArray = Array.from(uniqueCodesSet);

  // Bulk insert codes into database using createMany
  await prisma.redeemCode.createMany({
    data: codesArray.map((code) => ({
      code,
      type,
      status: RedeemCodeStatus.ACTIVE,
      maxUses: 1,
      usedCount: 0,
      scansAllowed,
      batchId: batch.id,
      expiresAt: expiresAt || null,
      note: note || null,
      source,
      createdBy: adminId,
    })),
  });

  return {
    batchId: batch.id,
    quantity,
    codes: codesArray,
  };
};

const getAllRedeemCodes = async (query: {
  page?: string;
  limit?: string;
  search?: string;
  type?: RedeemCodeType;
  status?: RedeemCodeStatus;
  batchId?: string;
  source?: string;
}) => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const skip = (page - 1) * limit;

  const whereConditions: any = {};

  if (query.type) {
    whereConditions.type = query.type;
  }
  if (query.status) {
    whereConditions.status = query.status;
  }
  if (query.batchId) {
    whereConditions.batchId = query.batchId;
  }
  if (query.source) {
    whereConditions.source = { contains: query.source, mode: "insensitive" };
  }
  if (query.search) {
    whereConditions.OR = [
      { code: { contains: query.search, mode: "insensitive" } },
      { note: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [total, codes] = await Promise.all([
    prisma.redeemCode.count({ where: whereConditions }),
    prisma.redeemCode.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        batch: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    metaData: {
      total,
      pages: page,
      limit,
      totalPages,
    },
    data: codes,
  };
};

const getRedeemCodeById = async (id: string) => {
  const code = await prisma.redeemCode.findUnique({
    where: { id },
    include: {
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      batch: true,
      userAccesses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!code) {
    throw new AppError(httpStatus.NOT_FOUND, "Redeem code not found");
  }

  return code;
};

const disableRedeemCode = async (id: string) => {
  const code = await prisma.redeemCode.findUnique({
    where: { id },
  });

  if (!code) {
    throw new AppError(httpStatus.NOT_FOUND, "Redeem code not found");
  }

  const updated = await prisma.redeemCode.update({
    where: { id },
    data: { status: RedeemCodeStatus.DISABLED },
  });

  return updated;
};

const enableRedeemCode = async (id: string) => {
  const code = await prisma.redeemCode.findUnique({
    where: { id },
  });

  if (!code) {
    throw new AppError(httpStatus.NOT_FOUND, "Redeem code not found");
  }

  if (code.status === RedeemCodeStatus.USED || code.usedCount >= code.maxUses) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot enable a code that has already been redeemed.");
  }

  if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot enable an expired code.");
  }

  const updated = await prisma.redeemCode.update({
    where: { id },
    data: { status: RedeemCodeStatus.ACTIVE },
  });

  return updated;
};

const deleteRedeemCode = async (id: string) => {
  const code = await prisma.redeemCode.findUnique({
    where: { id },
  });

  if (!code) {
    throw new AppError(httpStatus.NOT_FOUND, "Redeem code not found");
  }

  if (code.usedCount > 0 || code.status === RedeemCodeStatus.USED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete a redeemed code. You can only disable it."
    );
  }

  await prisma.redeemCode.delete({
    where: { id },
  });

  return { message: "Redeem code deleted successfully." };
};

const getAllBatches = async () => {
  const batches = await prisma.redeemCodeBatch.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Calculate used code count per batch
  const enrichedBatches = await Promise.all(
    batches.map(async (batch) => {
      const usedCodesCount = await prisma.redeemCode.count({
        where: {
          batchId: batch.id,
          usedCount: { gt: 0 },
        },
      });
      return {
        ...batch,
        usedCount: usedCodesCount,
      };
    })
  );

  return enrichedBatches;
};

const getBatchDetails = async (batchId: string) => {
  const batch = await prisma.redeemCodeBatch.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    throw new AppError(httpStatus.NOT_FOUND, "Batch not found");
  }

  const codes = await prisma.redeemCode.findMany({
    where: { batchId },
    orderBy: { createdAt: "asc" },
  });

  return {
    batch,
    codes,
  };
};

const validateRedeemCode = async (codeStr: string) => {
  const code = await prisma.redeemCode.findUnique({
    where: { code: codeStr },
  });

  if (!code) {
    return {
      valid: false,
      message: "Invalid code. Please check your card and try again.",
    };
  }

  if (code.status === RedeemCodeStatus.DISABLED) {
    return {
      valid: false,
      message: "This code is not active. Please contact support.",
    };
  }

  if (code.status === RedeemCodeStatus.USED || code.usedCount >= code.maxUses) {
    return {
      valid: false,
      message: "This code has already been redeemed.",
    };
  }

  if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
    // Proactively mark it as expired in DB
    await prisma.redeemCode.update({
      where: { id: code.id },
      data: { status: RedeemCodeStatus.EXPIRED },
    });
    return {
      valid: false,
      message: "This code has expired.",
    };
  }

  return {
    valid: true,
    data: {
      type: code.type,
      scansAllowed: code.scansAllowed,
      message: `This code unlocks ${code.scansAllowed} Creator Pass scans.`,
    },
  };
};

const applyRedeemCode = async (userId: string, codeStr: string) => {
  // Validate and apply code in a transaction to prevent race conditions
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch code and lock
    const code = await tx.redeemCode.findUnique({
      where: { code: codeStr },
    });

    if (!code) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid code. Please check your card and try again.");
    }

    if (code.status === RedeemCodeStatus.DISABLED) {
      throw new AppError(httpStatus.BAD_REQUEST, "This code is not active. Please contact support.");
    }

    if (code.status === RedeemCodeStatus.USED || code.usedCount >= code.maxUses) {
      throw new AppError(httpStatus.BAD_REQUEST, "This code has already been redeemed.");
    }

    if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
      await tx.redeemCode.update({
        where: { id: code.id },
        data: { status: RedeemCodeStatus.EXPIRED },
      });
      throw new AppError(httpStatus.BAD_REQUEST, "This code has expired.");
    }

    // 2. Business rule: disallow multiple active passes with scans remaining
    const activeAccess = await tx.userAccess.findFirst({
      where: {
        userId,
        accessType: AccessType.CREATOR_PASS,
        status: UserAccessStatus.ACTIVE,
        scansRemaining: { gt: 0 },
      },
    });

    if (activeAccess) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You already have an active Creator Pass with scans remaining. Please use them before redeeming a new code."
      );
    }

    // 3. Mark code as redeemed/used
    const newUsedCount = code.usedCount + 1;
    await tx.redeemCode.update({
      where: { id: code.id },
      data: {
        usedCount: newUsedCount,
        status: newUsedCount >= code.maxUses ? RedeemCodeStatus.USED : RedeemCodeStatus.ACTIVE,
        assignedUserId: userId,
        redeemedAt: new Date(),
      },
    });

    // 4. Create UserAccess record
    const userAccess = await tx.userAccess.create({
      data: {
        userId,
        sourceCodeId: code.id,
        accessType: AccessType.CREATOR_PASS,
        scansRemaining: code.scansAllowed,
        scansUsed: 0,
        status: UserAccessStatus.ACTIVE,
        activatedAt: new Date(),
      },
    });

    return userAccess;
  });

  return {
    accessType: result.accessType,
    scansRemaining: result.scansRemaining,
    scansUsed: result.scansUsed,
    shouldShowSubscriptionPrompt: false,
  };
};

const getUserAccessStatus = async (userId: string) => {
  // Check user subscription status
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
      },
    },
  });

  const hasActiveSubscription =
    user?.plan === "PREMIUM" ||
    (user?.subscriptions &&
      user.subscriptions.some(
        (sub) => !sub.endDate || new Date(sub.endDate) > new Date()
      ));

  // Find the latest active Creator Pass
  const activeCreatorPass = await prisma.userAccess.findFirst({
    where: {
      userId,
      accessType: AccessType.CREATOR_PASS,
      status: UserAccessStatus.ACTIVE,
    },
    orderBy: { createdAt: "desc" },
  });

  const creatorPassActive = !!activeCreatorPass && activeCreatorPass.scansRemaining > 0;
  const scansRemaining = activeCreatorPass ? activeCreatorPass.scansRemaining : 0;
  const scansUsed = activeCreatorPass ? activeCreatorPass.scansUsed : 0;

  // Decide whether subscription prompt is shown
  const shouldShowSubscriptionPrompt = !hasActiveSubscription && scansRemaining <= 0;

  return {
    hasActiveSubscription: !!hasActiveSubscription,
    creatorPassActive,
    scansRemaining,
    scansUsed,
    shouldShowSubscriptionPrompt,
  };
};

const useScan = async (userId: string, scanType: string = "default") => {
  // 1. First check if user has active subscription
  const status = await getUserAccessStatus(userId);

  if (status.hasActiveSubscription) {
    // Allow scan without reducing Creator Pass credits
    await prisma.scanUsageLog.create({
      data: {
        userId,
        scanType,
        status: ScanStatus.SUCCESS,
        reason: "User has active subscription, bypass Creator Pass check.",
      },
    });

    return {
      allowed: true,
      scansRemaining: status.scansRemaining,
      shouldShowSubscriptionPrompt: false,
      message: "Scan allowed via active subscription.",
    };
  }

  // 2. If no subscription, check Creator Pass scans
  const activeCreatorPass = await prisma.userAccess.findFirst({
    where: {
      userId,
      accessType: AccessType.CREATOR_PASS,
      status: UserAccessStatus.ACTIVE,
      scansRemaining: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!activeCreatorPass) {
    // Block scan
    await prisma.scanUsageLog.create({
      data: {
        userId,
        scanType,
        status: ScanStatus.BLOCKED,
        reason: "No active Creator Pass scans remaining and no active subscription.",
      },
    });

    throw new AppError(
      httpStatus.PAYMENT_REQUIRED,
      "Your Creator Pass scans are finished. Please subscribe to continue."
    );
  }

  // 3. Decrement scans remaining
  const updatedScansRemaining = activeCreatorPass.scansRemaining - 1;
  const updatedScansUsed = activeCreatorPass.scansUsed + 1;
  const isExhausted = updatedScansRemaining <= 0;

  const [updatedAccess] = await prisma.$transaction([
    prisma.userAccess.update({
      where: { id: activeCreatorPass.id },
      data: {
        scansRemaining: updatedScansRemaining,
        scansUsed: updatedScansUsed,
        status: isExhausted ? UserAccessStatus.EXHAUSTED : UserAccessStatus.ACTIVE,
      },
    }),
    prisma.scanUsageLog.create({
      data: {
        userId,
        accessId: activeCreatorPass.id,
        scanType,
        status: ScanStatus.SUCCESS,
        reason: `Scan used. Remaining scans: ${updatedScansRemaining}`,
      },
    }),
  ]);

  return {
    allowed: true,
    scansRemaining: updatedAccess.scansRemaining,
    shouldShowSubscriptionPrompt: updatedAccess.scansRemaining <= 0,
    message: "Scan used successfully.",
  };
};

const getScanUsageHistory = async (
  userId: string,
  query: { page?: string; limit?: string }
) => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const skip = (page - 1) * limit;

  const [total, logs] = await Promise.all([
    prisma.scanUsageLog.count({ where: { userId } }),
    prisma.scanUsageLog.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    metaData: {
      total,
      pages: page,
      limit,
      totalPages,
    },
    data: logs,
  };
};

export const redeemCodeService = {
  generateRedeemCodes,
  getAllRedeemCodes,
  getRedeemCodeById,
  disableRedeemCode,
  enableRedeemCode,
  deleteRedeemCode,
  getAllBatches,
  getBatchDetails,
  validateRedeemCode,
  applyRedeemCode,
  getUserAccessStatus,
  useScan,
  getScanUsageHistory,
};
