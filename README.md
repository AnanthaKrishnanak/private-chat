# 🚀 Private Chat – Secure, Fast & Anonymous

A privacy-first real-time chat application built with Next.js. Experience truly anonymous messaging with auto-destructing rooms and ephemeral storage.

---

## 🔥 Features

### ⚡ Real-Time Messaging
Instant message delivery using modern WebSocket-based communication.

### 🔒 Anonymous Chat
No login. No signup. No personal data. Users can join and chat with complete anonymity.

### 🗄️ Ephemeral Storage (Redis)
Messages are temporarily stored in Redis for fast access. Nothing is written to long-term storage or databases.

### 💥 Auto-Destruct Rooms
Every chat room automatically self-destructs, removing:
- The room
- All messages inside it
- All associated metadata

When a room reaches its auto-cleanup condition (e.g., no activity or timeout), all Redis keys are deleted.

### ⏳ Auto-Delete Messages
Messages automatically expire and are removed from Redis after 10 minutes, ensuring complete privacy.

### ⚙️ Server-Side Rendering (SSR)
Faster initial loads, improved SEO, and secure data handling.

### 🌓 Dark Mode UI
The interface is optimized for a smooth, clean dark experience.

---

## 🚧 Getting Started

### Environment Variables

Create a `.env.local` file in the root directory:

```dotenv
UPSTASH_REDIS_REST_URL="your_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_redis_token"
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Edit files inside `app/` — changes update automatically.

---

## 📘 Learn More About Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Tutorial](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

## 🚀 Deploy on Vercel

Deploy instantly using Vercel: [https://vercel.com/new?filter=next.js](https://vercel.com/new?filter=next.js)
