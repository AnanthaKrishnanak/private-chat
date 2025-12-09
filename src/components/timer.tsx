"use client";

import { useTTL } from "@/hooks/useTTL";
import { cn } from "@/lib/cn";
import { Timer as TimerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TIME_THRESHOLDS = {
  HIGH: 120,
  MEDIUM: 60,
  LOW: 20,
} as const;

const COLOR_CLASSES = {
  HIGH: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  LOW: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  CRITICAL: "text-red-400 bg-red-500/10 border-red-500/20",
} as const;

function formatTimeRemaining(timeRemaining: number): string {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getColorClass(time: number): string {
  if (time > TIME_THRESHOLDS.HIGH) return COLOR_CLASSES.HIGH;
  if (time > TIME_THRESHOLDS.MEDIUM) return COLOR_CLASSES.MEDIUM;
  if (time > TIME_THRESHOLDS.LOW) return COLOR_CLASSES.LOW;
  return COLOR_CLASSES.CRITICAL;
}

const Timer = () => {
  const { push } = useRouter();
  const [time, setTime] = useState<number | null>(null);
  const { data: ttl, isLoading: isTTLLoading } = useTTL();

  useEffect(() => {
    if (ttl?.ttl !== undefined) {
      setTime(ttl.ttl);
    }
  }, [ttl]);

  useEffect(() => {
    if (time === null || time < 0) return;

    if (time === 0) {
      push("/?error=room-expired");
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [time, push]);

  const displayTime = time !== null ? formatTimeRemaining(time) : "...";
  const colorClass = time !== null ? getColorClass(time) : "";

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl transition-colors duration-700",
        isTTLLoading && "animate-pulse",
        colorClass
      )}
    >
      <TimerIcon className="w-4 h-4 animate-pulse" />
      <span className="font-mono text-lg font-medium tracking-widest">
        {displayTime}
      </span>
    </div>
  );
};

export default Timer;
