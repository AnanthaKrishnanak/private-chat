import { Elysia, t } from "elysia";

const app = new Elysia({ prefix: "/api" }).get("/", "Hello Nextjs");

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
