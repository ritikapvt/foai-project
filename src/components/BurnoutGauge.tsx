import { useState, useEffect } from "react";

interface BurnoutGaugeProps {
  score: number; // 0-100
  size?: number;
}

export const BurnoutGauge = ({ score, size = 200 }: BurnoutGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getStatus = (score: number) => {
    if (score < 40) return { label: "Low stress", color: "text-good" };
    if (score < 70) return { label: "Moderate stress", color: "text-warn" };
    return { label: "High stress", color: "text-danger" };
  };

  const status = getStatus(score);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="70"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            fill="none"
            opacity="0.2"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="70"
            stroke={
              score < 40
                ? "hsl(var(--good))"
                : score < 70
                ? "hsl(var(--warn))"
                : "hsl(var(--danger))"
            }
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-heading">{Math.round(animatedScore)}%</span>
          <span className="text-sm text-muted-foreground mt-1">Burnout Level</span>
        </div>
      </div>
      <p className={`mt-4 text-lg font-semibold ${status.color}`}>{status.label}</p>
    </div>
  );
};
