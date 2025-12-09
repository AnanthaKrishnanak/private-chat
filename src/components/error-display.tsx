import React from "react";

interface ErrorDisplayProps {
  title: string;
  description: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ title, description }) => {
  return (
    <div className="w-full p-4 rounded-xl text-white bg-linear-to-r from-red-600 to-black shadow-lg">
      <h2 className="font-semibold text-lg mb-1">{title}</h2>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

export default ErrorDisplay;
