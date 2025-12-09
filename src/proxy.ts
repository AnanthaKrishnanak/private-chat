import { NextRequest, NextResponse } from "next/server";
import { redis } from "./lib/redis";
import { nanoid } from "nanoid";
import { getRoomKey } from "./app/api/[[...slugs]]/route";

const MAX_USERS = 2;

export const proxy = async (req: NextRequest) => {
  const roomId = extractRoomId(req);
  if (!roomId) return redirect(req, "/");

  const roomMeta = await getRoomMeta(roomId);
  if (!roomMeta) return redirect(req, "/?error=room-not-found");

  const { createdAt, connectedUsers } = roomMeta;
  const response = NextResponse.next();

  const existingToken = req.cookies.get("token")?.value;

  // Existing user has valid token, allow through
  if (existingToken && connectedUsers.includes(existingToken)) {
    return response;
  }

  // Room user capacity reached
  if (connectedUsers.length >= MAX_USERS) {
    return redirect(req, "/?error=room-full");
  }

  // New user: issue token and update metadata
  const token = nanoid();
  setUserToken(response, token);
  await updateConnectedUsers(roomId, [...connectedUsers, token]);

  return response;
};

const extractRoomId = (req: NextRequest): string | null => {
  const match = req.nextUrl.pathname.match(/^\/room\/([^/]+)$/);
  return match ? match[1] : null;
};

const redirect = (req: NextRequest, to: string) =>
  NextResponse.redirect(new URL(to, req.url));

const getRoomMeta = (roomId: string) =>
  redis.hgetall<{ createdAt: number; connectedUsers: string[] }>(
    getRoomKey(roomId)
  );

const updateConnectedUsers = (roomId: string, users: string[]) =>
  redis.hset(getRoomKey(roomId), { connectedUsers: users });

const setUserToken = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
};

export const config = {
  matcher: "/room/:path*",
};
