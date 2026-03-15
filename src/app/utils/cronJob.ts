import { prisma } from "./prisma";
import cron from "node-cron";

export const cronJob = () => {
  cron.schedule("* * * * *", async () => {
    // প্রতি 1 minute run
    await prisma.user.deleteMany({
      where: {
        status: "PENDING",
        isEmailVerified: false,
        otpExpiry: {
          lt: new Date(),
        },
      },
    });
  });
};
