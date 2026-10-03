import React, { useId } from 'react';

interface GTecLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'white' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GTecLogo: React.FC<GTecLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md'
}) => {
  const uniqueId = useId().replace(/:/g, '');

  // Fixed dimensional specifications to guarantee rigid layout on all devices
  const iconSizes = {
    sm: 'w-8 h-8 min-w-8 min-h-8',
    md: 'w-11 h-11 min-w-11 min-h-11',
    lg: 'w-14 h-14 min-w-14 min-h-14',
    xl: 'w-20 h-20 min-w-20 min-h-20'
  };

  const textSizes = {
    sm: { main: 'text-base', sub: 'text-xs', tagline: 'text-[8px]' },
    md: { main: 'text-xl', sub: 'text-sm', tagline: 'text-[9.5px]' },
    lg: { main: 'text-2xl', sub: 'text-base', tagline: 'text-[11px]' },
    xl: { main: 'text-3xl', sub: 'text-lg', tagline: 'text-[13px]' }
  };

  const isDarkBg = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none shrink-0 whitespace-nowrap ${className}`}>
      {/* Precision Vector Emblem with fixed bounding box */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs shrink-0"
        >
          <defs>
            <linearGradient id={`gtecRingGrad-${uniqueId}`} x1="5%" y1="5%" x2="95%" y2="95%">
              <stop offset="0%" stopColor="#00B4D8" />
              <stop offset="35%" stopColor="#0077B6" />
              <stop offset="75%" stopColor="#023E8A" />
              <stop offset="100%" stopColor="#03045E" />
            </linearGradient>
            <linearGradient id={`gtecCyanGlow-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id={`circuitGrad-${uniqueId}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Outer Stylized "G" Dynamic Ring with open aperture */}
          <path
            d="M 62 10 A 50 50 0 1 1 18 84"
            stroke={`url(#gtecRingGrad-${uniqueId})`}
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Circuit tracks & upward technology arrows in bottom arc */}
          <path
            d="M 26 84 Q 45 108 74 97"
            stroke={`url(#circuitGrad-${uniqueId})`}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 36 90 Q 52 104 68 100"
            stroke={`url(#circuitGrad-${uniqueId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Arrow 1 */}
          <path
            d="M 72 95 L 80 89 L 76 99 Z"
            fill="#38BDF8"
          />
          {/* Arrow 2 */}
          <path
            d="M 82 85 L 90 79 L 86 89 Z"
            fill="#0284C7"
          />
          {/* Arrow 3 */}
          <path
            d="M 91 71 L 97 63 L 95 73 Z"
            fill="#0077B6"
          />

          {/* Integrated Laptop Icon on left side */}
          <g transform="translate(16, 32)">
            {/* Screen frame */}
            <path
              d="M 6 4 L 30 4 L 30 22 L 6 22 Z"
              fill="white"
              stroke="#03045E"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Laptop Screen Display Glow */}
            <rect x="8" y="6" width="20" height="14" rx="1" fill="#E0F2FE" />
            {/* Desktop window mimic */}
            <rect x="10" y="8" width="16" height="4" rx="0.5" fill="#38BDF8" />
            <circle cx="12" cy="10" r="0.75" fill="white" />
            <circle cx="14" cy="10" r="0.75" fill="white" />
            {/* Base / Keyboard */}
            <path
              d="M 2 22 L 34 22 L 37 28 L -1 28 Z"
              fill="#023E8A"
              stroke="#03045E"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Trackpad notch */}
            <line x1="14" y1="25" x2="22" y2="25" stroke="#90E0EF" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Integrated Modern Laser Printer on right with paper and data bursts */}
          <g transform="translate(56, 30)">
            {/* Printer Body */}
            <rect
              x="6"
              y="10"
              width="38"
              height="20"
              rx="4"
              fill={`url(#gtecCyanGlow-${uniqueId})`}
              stroke="#03045E"
              strokeWidth="2"
            />
            {/* Top Paper Feed Slot & Paper Sheet */}
            <rect x="15" y="2" width="20" height="9" rx="1" fill="white" stroke="#03045E" strokeWidth="1.5" />
            <line x1="18" y1="5" x2="32" y2="5" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
            
            {/* Output Paper Tray with Printed Lines */}
            <path
              d="M 12 26 L 38 26 L 35 37 L 15 37 Z"
              fill="white"
              stroke="#03045E"
              strokeWidth="1.5"
            />
            <line x1="18" y1="29" x2="32" y2="29" stroke="#0077B6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="33" x2="28" y2="33" stroke="#0077B6" strokeWidth="1.5" strokeLinecap="round" />

            {/* Horizontal High-Speed Data Speedlines */}
            <line x1="-2" y1="14" x2="4" y2="14" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="-3" cy="14" r="1.5" fill="#00B4D8" />
            <line x1="-5" y1="20" x2="4" y2="20" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="-6" cy="20" r="1.5" fill="#00B4D8" />
            <line x1="-1" y1="26" x2="4" y2="26" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="-2" cy="26" r="1.5" fill="#00B4D8" />
          </g>
        </svg>
      </div>

      {/* Typography Lockup with Fixed Layout on all devices */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col text-left leading-none shrink-0 whitespace-nowrap">
          <div className="flex items-baseline gap-1 sm:gap-1.5 whitespace-nowrap">
            <span
              className={`font-black tracking-tight shrink-0 ${
                isDarkBg ? 'text-white' : 'text-[#072b4f]'
              } ${textSizes[size].main}`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              G Tec.
            </span>
            <span
              className={`font-extrabold uppercase tracking-widest shrink-0 ${
                isDarkBg ? 'text-cyan-300' : 'text-[#0072BC]'
              } ${textSizes[size].sub}`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              TECHNOLOGY
            </span>
          </div>
          {variant !== 'compact' && (
            <span
              className={`uppercase font-bold tracking-[0.22em] mt-1 shrink-0 whitespace-nowrap ${
                isDarkBg ? 'text-slate-300' : 'text-[#3b5978]'
              } ${textSizes[size].tagline}`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              COMPUTER &amp; OFFICE SOLUTIONS
            </span>
          )}
        </div>
      )}
    </div>
  );
};
