import React from "react";

interface ErrorDisplayProps {
  title: string;
  description: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ title, description }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-red-900/10">
      <div className="absolute inset-0 bg-linear-to-r from-red-700 via-red-950/80 to-zinc-900 opacity-90" />

      <div className="relative px-6 py-5 flex flex-col gap-1.5">
        <h2 className="text-white font-semibold text-sm tracking-wide uppercase">
          {title}{" "}
        </h2>
        <p className="font-mono text-xs text-red-100/70 tracking-tight">
          {description}{" "}
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
