// import Redis, { RedisOptions } from "ioredis";
// import config from "../../../config";


// export const redisOptions: RedisOptions = {
//     host: config.redis.host || "127.0.0.1",
//     port:config.redis.port ? parseInt(config.redis.port, 10) : 6379,
//     password: config.redis.password,
//     retryStrategy: (times: number) => {
//         if (times > 5) return undefined;
//         return Math.min(times * 100, 3000);
//     },
//     connectTimeout: 10000,
//     keepAlive: 30000,
//     maxRetriesPerRequest: null,
// };
// console.log(config.redis)
// export const redis = new Redis(redisOptions);


import Redis, { RedisOptions } from "ioredis";
import config from "../../../config";

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

export const redisOptions: RedisOptions = {
  host: config.redis.host || "127.0.0.1",
  port: config.redis.port ? parseInt(config.redis.port, 10) : 6379,
  password: config.redis.password,
  retryStrategy: (times: number) => {
    if (times > 5) return undefined;
    return Math.min(times * 100, 3000);
  },
  connectTimeout: 10000,
  keepAlive: 30000,
  maxRetriesPerRequest: null,
};

export const redis =
  global.redis ||
  new Redis(redisOptions);

if (process.env.NODE_ENV !== "production") {
  global.redis = redis;
}

// redis.on("connect", () => console.log("✅ Redis connected"));
// redis.on("error", (err) => console.log("❌ Redis error:", err));

export default redis;
