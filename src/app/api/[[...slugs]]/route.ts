import { redis } from "@/lib/redis";
import { Message, messageSchema } from "@/schema";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import z from "zod";
import { authMiddleWare } from "./auth";
import { realtime } from "@/lib/realtime";

const TIME_TO_LIVE = 60 * 10;

export const getRoomKey = (roomId: string) => `meta:${roomId}`;
export const getMessagesKey = (roomId: string) => `messages:${roomId}`;
export const getHistoryKey = (roomId: string) => `history:${roomId}`;

const createRoom = async () => {
  const roomId = nanoid();
  const roomKey = getRoomKey(roomId);

  await redis.hset(roomKey, {
    createdAt: Date.now(),
    connectedUsers: [],
  });
  await redis.expire(roomKey, TIME_TO_LIVE);

  return { roomId };
};

const getRoomTTL = async (roomId: string) => {
  const ttl = await redis.ttl(getRoomKey(roomId));
  return { ttl: ttl > 0 ? ttl : 0 };
};

const deleteRoom = async (roomId: string) => {
  await Promise.all([
    redis.del(getMessagesKey(roomId)),
    redis.del(getRoomKey(roomId)),
    redis.del(roomId),
  ]);

  await realtime.channel(roomId).emit("chat.destroyRoom", { isDeleted: true });

  return { success: true };
};

const createMessage = async (
  roomId: string,
  token: string,
  text: string,
  sender: string
) => {
  const message: Message = {
    id: nanoid(),
    text,
    sender,
    timeStamp: Date.now(),
    roomId,
    token,
  };

  const messagesKey = getMessagesKey(roomId);
  const roomKey = getRoomKey(roomId);
  const historyKey = getHistoryKey(roomId);

  await redis.rpush(messagesKey, message);
  await realtime.channel(roomId).emit("chat.message", message);

  const remaining = await redis.ttl(roomKey);
  await Promise.all([
    redis.expire(messagesKey, remaining),
    redis.expire(roomKey, remaining),
    redis.expire(historyKey, remaining),
  ]);

  return message;
};

const getMessages = async (roomId: string) => {
  const messages = await redis.lrange<Message>(getMessagesKey(roomId), 0, -1);
  return messages.map(({ token, ...rest }) => rest);
};

const roomIdQuery = z.object({ roomId: z.string() });
const messageBody = messageSchema.pick({ text: true, sender: true });

const rooms = new Elysia({ prefix: "/rooms" })
  .ws("/ws", {
    message(ws, message) {
      ws.send(message);
    },
  })
  .post("/create", createRoom)
  .use(authMiddleWare)
  .get("/ttl", ({ query }) => getRoomTTL(query.roomId), {
    query: roomIdQuery,
  })
  .delete("/", ({ auth }) => deleteRoom(auth.roomId), {
    query: roomIdQuery,
  });

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleWare)
  .post(
    "/",
    ({ auth, body }) =>
      createMessage(auth.roomId, auth.token, body.text, body.sender),
    {
      query: roomIdQuery,
      body: messageBody,
    }
  )
  .get("/", ({ auth }) => getMessages(auth.roomId));

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;
