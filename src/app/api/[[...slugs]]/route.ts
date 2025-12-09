import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleWare } from "./auth";
import z from "zod";
import { Message, messageSchema } from "@/schema";

const TIME_TO_LIVE = 60 * 10; // 10 minutes

const rooms = new Elysia({ prefix: "/rooms" })
  .post("/create", async () => {
    const roomId = nanoid();

    await redis.hset(`meta-${roomId}`, {
      createdAt: Date.now(),
      connectedUsers: [],
    });

    await redis.expire(`meta-${roomId}`, TIME_TO_LIVE);

    return {
      roomId,
    };
  })
  .get(
    "/ttl",
    async ({ query }) => {
      const roomId = query.roomId;
      const ttl = await redis.ttl(`meta-${roomId}`);
      return { ttl: ttl > 0 ? ttl : 0 };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleWare)
  .post(
    "/",
    async ({ auth, body }) => {
      const { roomId, roomMetaData, token } = auth;
      const { text, sender } = body;

      const message: Message = {
        id: nanoid(),
        text,
        sender,
        timeStamp: Date.now(),
        roomId,
        token,
      };

      await redis.rpush(`messages-${roomId}`, { ...message });

      const remaining = await redis.ttl(`meta-${roomId}`);
      await redis.expire(`messages-${roomId}`, remaining);
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
      body: messageSchema.pick({ text: true, sender: true }),
    }
  )
  .use(authMiddleWare)
  .get("/", async ({ auth }) => {
    const { roomId } = auth;
    const messages = await redis.lrange<Message>(`messages-${roomId}`, 0, -1);
    return messages.map((m) => {
      const { token, ...rest } = m;
      return rest;
    });
  });

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
