import { treaty } from "@elysiajs/eden";
import { App } from "@/app/api/[[...slugs]]/route";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL;

export const client = treaty<App>(API_URL as string);

export default client;
