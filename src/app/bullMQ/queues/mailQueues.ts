import { Queue } from "bullmq";

import { redisOptions } from "../../lib/redis/redisOptions";


export const otpQueueEmail = new Queue("otp-queue-email", { connection: redisOptions });

export const requestQueueEmail = new Queue("request-queue-email", { connection: redisOptions });