import Redis, { RedisOptions } from "ioredis";
import config from "../../../config";


export const redisOptions: RedisOptions = {
    host: config.redis.host || "127.0.0.1",
    port:config.redis.port ? parseInt(config.redis.port, 10) : 6379,
    password: config.redis.password,
    retryStrategy: (times: number) => {
        if (times > 5) return undefined;
        return Math.min(times * 100, 3000);
    },
    connectTimeout: 10000,
    keepAlive: 30000,
    maxRetriesPerRequest: null,
};
console.log(config.redis)
export const redis = new Redis(redisOptions);
