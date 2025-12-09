import { redis } from "@/lib/redis";
import Elysia from "elysia";
import { getRoomKey } from "./route";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authMiddleWare = new Elysia({ name: "auth" })
  .error({ AuthError })
  .onError((error) => {
    if (error.code === "AuthError") {
      error.set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .derive({ as: "scoped" }, async ({ query, cookie }) => {
    const token = cookie["token"]?.value as string | undefined;
    const roomId = query.roomId as string | undefined;
    if (!token || !roomId) throw new AuthError("Missing token or roomId");

    const roomMetaData = await redis.hgetall<{
      connectedUsers: string[];
      createdAt: number;
    }>(getRoomKey(roomId));
    if (!roomMetaData || !roomMetaData.connectedUsers.includes(token))
      throw new AuthError("Invalid token ");

    return { auth: { token, roomId, roomMetaData } };
  });
