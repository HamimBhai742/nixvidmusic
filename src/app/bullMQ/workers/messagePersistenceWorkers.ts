// import { Worker } from "bullmq";
// import { redis } from "../../lib/redis/redisOptions";
// import { RedisMessage } from "../../interface/common";

// export const messagePersistenceWorker = new Worker(
//     "messagePersistenceQueue",
//     async (job) => {
//         const { conversationId } = job.data;
//         const redisKey = `chat:messages:${conversationId}`;
//         const backupKey = `chat:messages:backup:${conversationId}`;
//         let rawMessages: string[] = [];
//         let rawMessagesWithScores: (string | number)[] = [];

//         const backupExists = await redis.exists(backupKey);
//         if (backupExists) {
//             rawMessagesWithScores = await redis.zrevrange(
//                 backupKey,
//                 0,
//                 -1,
//                 "WITHSCORES"
//             );
//         } else {
//             rawMessagesWithScores = await redis.zrevrange(
//                 redisKey,
//                 0,
//                 -1,
//                 "WITHSCORES"
//             );
//             if (rawMessagesWithScores.length > 0) {
//                 const args: (string | number)[] = [];
//                 for (let i = 0; i < rawMessagesWithScores.length; i += 2) {
//                     const member = rawMessagesWithScores[i];
//                     const score = rawMessagesWithScores[i + 1];
//                     args.push(score, member);
//                 }
//                 await redis.zadd(backupKey, ...args);
//             }
//         }

//         if (!rawMessagesWithScores?.length) {
//             return `No messages to persist for ${conversationId}`;
//         }

//         rawMessages = [];
//         for (let i = 0; i < rawMessagesWithScores.length; i += 2) {
//             rawMessages.push(rawMessagesWithScores[i] as string);
//         }
//         const parsed: RedisMessage[] = rawMessages.map((msg) => JSON.parse(msg));
//         /*
//             try {
//               await prisma.$transaction(
//                 parsed.map((m) =>
//                   prisma.privateMessage.upsert({
//                     where: { id: m.id },
//                     update: {},
//                     create: {
//                       id: m.id!,
//                       senderId: m.senderId,
//                       receiverId: m.receiverId,
//                       content: m.content,
//                       imageUrl: m.imageUrl || null,
//                       createdAt: new Date(m.createdAt),
//                       updatedAt: new Date(m.createdAt),
//                       read: m.read || false,
//                       conversationId: m.conversationId,
//                     },
//                   })
//                 )
//               );
        
//               await Promise.all([redis.del(redisKey), redis.del(backupKey)]);
//               return `✅ Persisted ${parsed.length} messages for ${conversationId}`;
//             } catch (error: any) {
//               return `❌ DB error: ${error.message || error}`;
//             }
//             */
//     },
//     { connection: redis as any }
// );


