import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";

const TIME_TO_LIVE = 60 * 10; // 10 minutes

const rooms = new Elysia({ prefix: "/rooms" }).post("/create", async () => {
  const roomId = nanoid();

  await redis.hset(`meta-${roomId}`, {
    createdAt: Date.now(),
    connectedUsers: [],
  });

  await redis.expire(`meta-${roomId}`, TIME_TO_LIVE);

  return {
    roomId,
  };
});

const app = new Elysia({ prefix: "/api" }).use(rooms);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
