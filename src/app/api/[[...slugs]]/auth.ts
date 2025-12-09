import { redis } from "@/lib/redis";
import Elysia from "elysia";
import { connect } from "http2";

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

    const connectedUsers = await redis.hget<string[]>(
      `meta-${roomId}`,
      "connectedUsers"
    );
    if (!connectedUsers || !connectedUsers.includes(token))
      throw new AuthError("Invalid token ");

    return { auth: { token, roomId, connectedUsers } };
  });
