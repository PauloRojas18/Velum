import React from "react";

type LogoVariant = "default" | "horizontal" | "mono" | "favicon";

interface VelumLogoProps {
  variant?: LogoVariant;
  className?: string;
  size?: number; // tamanho do SVG (width/height)
}

export default function VelumLogo({
  variant = "default",
  className = "",
  size,
}: VelumLogoProps) {
  const w = size ?? undefined;
  const h = size ?? undefined;

  if (variant === "horizontal") {
    return (
      <svg
        width={w ?? 500}
        height={h ?? 140}
        viewBox="0 0 500 140"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradH" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        <g transform="translate(10,10)">
          <rect width="120" height="120" rx="28" fill="#0B0F1A" />

          <path
            d="M30 35 L60 105 L90 35"
            stroke="url(#gradH)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M42 38 L60 75 L78 38"
            stroke="url(#gradH)"
            strokeWidth="5"
            fill="none"
            opacity="0.6"
          />
        </g>

        <text
          x="160"
          y="85"
          fontFamily="Arial, sans-serif"
          fontSize="42"
          fill="#E5E7EB"
          fontWeight="600"
        >
          Velum
        </text>
      </svg>
    );
  }

  if (variant === "mono") {
    return (
      <svg
        width={w ?? 200}
        height={h ?? 200}
        viewBox="0 0 200 200"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="200" height="200" rx="40" fill="#000000" />
        <path
          d="M50 60 L100 155 L150 60"
          stroke="#FFFFFF"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M68 62 L100 120 L132 62"
          stroke="#FFFFFF"
          strokeWidth="7"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "favicon") {
    return (
      <svg
        width={w ?? 64}
        height={h ?? 64}
        viewBox="0 0 200 200"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="200" height="200" rx="40" fill="#0B0F1A" />
        <path
          d="M50 60 L100 155 L150 60"
          stroke="#22D3EE"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // DEFAULT
  return (
    <svg
      width={w ?? 200}
      height={h ?? 200}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradDefault" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>

      <rect width="200" height="200" rx="40" fill="#0B0F1A" />

      <path
        d="M50 60 L100 155 L150 60"
        stroke="url(#gradDefault)"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M68 62 L100 120 L132 62"
        stroke="url(#gradDefault)"
        strokeWidth="7"
        fill="none"
        opacity="0.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}