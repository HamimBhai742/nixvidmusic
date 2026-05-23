import z from "zod";

export const generateRedeemCodesSchema = z.object({
  type: z.enum(["CREATOR_PASS", "AFFILIATE"]).default("CREATOR_PASS"),
  quantity: z
    .number()
    .int()
    .positive()
    .max(1000, "Cannot generate more than 1000 codes at a time")
    .optional()
    .default(1),
  scansAllowed: z.number().int().positive().default(5),
  source: z.string().min(1, "Source is required").default("TikTok Shop"),
  expiresAt: z.string().nullable().optional().transform((val) => val ? new Date(val) : null),
  note: z.string().optional(),
});

export const validateRedeemCodeSchema = z.object({
  code: z.string().min(1, "Redeem code is required"),
});

export const applyRedeemCodeSchema = z.object({
  code: z.string().min(1, "Redeem code is required"),
});

export const useScanSchema = z.object({
  scanType: z.string().optional().default("default"),
});
