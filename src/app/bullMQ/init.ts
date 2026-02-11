
import redisConnect from "../lib/redis/redis";
// import { conversationListQueue } from "./queues/conversationListQueue";
import { otpQueueEmail } from "./queues/mailQueues";
import { otpEmailWorker } from "./workers/mailWorkers";
// import { messagePersistenceWorker } from "./workers/messagePersistenceWorkers";

// import { aiChatWorker } from "./workers/aiChat.worker";

process.on("SIGINT", async () => {
    console.log("🚨 Gracefully shutting down...");

    await otpEmailWorker.close();
    // await conversationListQueue.close();
    // await conversationListWorker.close();
    // await assignJobWorker.close();
    // await messagePersistenceWorker.close();
    console.log("✅ Workers and Queues closed gracefully ");
    process.exit(0);
});

console.log("Workers running...");

export {
    redisConnect,
    otpEmailWorker,
    // conversationListQueue,
    // messagePersistenceWorker,
    otpQueueEmail,
    // aiChatWorker
}