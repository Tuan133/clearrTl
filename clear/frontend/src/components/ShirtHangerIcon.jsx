import React from 'react';

/**
 * ShirtHangerIcon — Áo trắng trên móc, màu brand hồng
 * BƯỚC 3: "Chúng tôi đến lấy đồ giặt"
 * Redesign: Bỏ xanh lá → trắng tinh tế + accent hồng brand
 */
const ShirtHangerIcon = ({ size = 80 }) => {
  const w = size;
  const h = size * 1.1;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 132"
      width={w}
      height={h}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <style>{`
          @keyframes shSway {
            0%   { transform: rotate(0deg); }
            20%  { transform: rotate(2.5deg); }
            50%  { transform: rotate(-2deg); }
            80%  { transform: rotate(1.5deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes shFloat {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-3px); }
          }
          @keyframes shGlint {
            0%, 85%, 100% { opacity: 0; }
            90%            { opacity: 1; }
          }
          @keyframes shSparkle {
            0%,100% { opacity: 0; transform: scale(0.5); }
            50%     { opacity: 1; transform: scale(1); }
          }
          .sh-group {
            transform-origin: 60px 12px;
            animation: shSway 3.5s ease-in-out infinite, shFloat 3s ease-in-out infinite;
          }
          .sh-glint { animation: shGlint 3s ease-in-out infinite; }
          .sh-spark1 { transform-origin: 20px 55px; animation: shSparkle 2s ease-in-out 0s infinite; }
          .sh-spark2 { transform-origin: 100px 60px; animation: shSparkle 2s ease-in-out 0.7s infinite; }
          .sh-spark3 { transform-origin: 60px 90px; animation: shSparkle 2s ease-in-out 1.4s infinite; }
        `}</style>

        {/* Shirt body — trắng tinh */}
        <linearGradient id="shBodyG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5EEF8" />
        </linearGradient>

        {/* Shirt sleeve */}
        <linearGradient id="shSleeveG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EDE0F0" />
        </linearGradient>

        {/* Collar — hồng nhạt */}
        <linearGradient id="shCollarG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FCE4EC" />
          <stop offset="100%" stopColor="#F8BBD9" />
        </linearGradient>

        {/* Brand stripe — hồng đậm */}
        <linearGradient id="shStripeG2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c2185b" />
          <stop offset="50%"  stopColor="#e91e63" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>

        {/* Hanger — chrome bạc cao cấp */}
        <linearGradient id="shHangerG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#EEEEEE" />
          <stop offset="35%"  stopColor="#BDBDBD" />
          <stop offset="65%"  stopColor="#9E9E9E" />
          <stop offset="100%" stopColor="#757575" />
        </linearGradient>

        {/* Hanger hook */}
        <linearGradient id="shHookG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#c2185b" />
          <stop offset="50%"  stopColor="#e91e63" />
          <stop offset="100%" stopColor="#880e4f" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id="shShadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(194,24,91,0.18)" />
        </filter>

        {/* Hanger glow */}
        <filter id="shHangerGlow2" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ===== ENTIRE GROUP (sways + floats) ===== */}
      <g className="sh-group" filter="url(#shShadow2)">

        {/* ── HANGER ── */}
        {/* Hook top — brand pink */}
        <path
          d="M60 2 C60 2 65 2 67 6 C69 10 65 14 60 14 C55 14 52 11 52 7"
          fill="none"
          stroke="url(#shHookG2)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#shHangerGlow2)"
        />
        {/* Hook tip */}
        <circle cx="60" cy="2" r="2.5" fill="#e91e63" />

        {/* Hanger rod — left */}
        <path
          d="M60 14 Q30 20 16 44"
          fill="none"
          stroke="url(#shHangerG2)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        {/* Hanger rod — right */}
        <path
          d="M60 14 Q90 20 104 44"
          fill="none"
          stroke="url(#shHangerG2)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* Shoulder tips */}
        <circle cx="16" cy="44" r="3.5" fill="#9E9E9E" />
        <circle cx="104" cy="44" r="3.5" fill="#9E9E9E" />

        {/* Rod highlight (glint) */}
        <path
          d="M60 14 Q78 17 90 30"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="sh-glint"
        />

        {/* ── SHIRT ── */}
        {/* Left sleeve */}
        <path d="M18 48 L6 78 L28 84 L36 60 Z" fill="url(#shSleeveG2)" />
        {/* Left sleeve highlight */}
        <path d="M19 50 L10 75 L16 77 L26 54 Z" fill="rgba(255,255,255,0.4)" />
        {/* Left sleeve shadow */}
        <path d="M26 60 L28 84" stroke="rgba(194,24,91,0.08)" strokeWidth="1.5" fill="none"/>
        {/* Left cuff */}
        <path d="M6 78 L28 84" stroke="rgba(194,24,91,0.2)" strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* Right sleeve */}
        <path d="M102 48 L114 78 L92 84 L84 60 Z" fill="url(#shSleeveG2)" />
        {/* Right sleeve highlight */}
        <path d="M101 50 L110 75 L104 77 L94 54 Z" fill="rgba(255,255,255,0.4)" />
        {/* Right cuff */}
        <path d="M114 78 L92 84" stroke="rgba(194,24,91,0.2)" strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* Shirt body */}
        <path d="M36 56 L28 84 L28 126 L92 126 L92 84 L84 56 Z" fill="url(#shBodyG2)" />

        {/* Outer border subtle */}
        <path d="M36 56 L28 84 L28 126 L92 126 L92 84 L84 56 Z"
          fill="none" stroke="rgba(194,24,91,0.1)" strokeWidth="1.2"/>
        <path d="M18 48 L6 78 L28 84 L36 60 Z"
          fill="none" stroke="rgba(194,24,91,0.1)" strokeWidth="1"/>
        <path d="M102 48 L114 78 L92 84 L84 60 Z"
          fill="none" stroke="rgba(194,24,91,0.1)" strokeWidth="1"/>

        {/* Collar — V-neck hồng nhạt */}
        <path
          d="M36 56 Q48 50 60 42 Q72 50 84 56 L76 62 Q68 56 60 50 Q52 56 44 62 Z"
          fill="url(#shCollarG2)"
        />
        {/* Collar inner shadow */}
        <path
          d="M44 62 Q52 57 60 52 Q68 57 76 62 Q68 58 60 55 Q52 58 44 62 Z"
          fill="rgba(0,0,0,0.05)"
        />

        {/* Brand stripe — hồng ngang giữa thân */}
        <rect x="36" y="72" width="56" height="10" fill="url(#shStripeG2)" />
        {/* Stripe top/bottom edge */}
        <rect x="36" y="72" width="56" height="2.5" fill="rgba(255,255,255,0.2)"/>

        {/* Body bottom hem */}
        <line x1="28" y1="126" x2="92" y2="126" stroke="rgba(194,24,91,0.15)" strokeWidth="2" />

        {/* Side seam lines */}
        <line x1="36" y1="62" x2="32" y2="110" stroke="rgba(0,0,0,0.05)" strokeWidth="1.2" />
        <line x1="84" y1="62" x2="88" y2="110" stroke="rgba(0,0,0,0.05)" strokeWidth="1.2" />

        {/* Center stitch */}
        <line x1="60" y1="82" x2="60" y2="124" stroke="rgba(194,24,91,0.08)" strokeWidth="0.8" strokeDasharray="3,3" />

        {/* Chest highlight sheen */}
        <path
          d="M38 58 Q60 54 82 58 L82 70 Q60 66 38 70 Z"
          fill="rgba(255,255,255,0.25)"
        />

        {/* Pocket detail */}
        <rect x="44" y="85" width="18" height="13" rx="2" fill="rgba(194,24,91,0.06)" stroke="rgba(194,24,91,0.15)" strokeWidth="0.8" />
        <line x1="44" y1="89" x2="62" y2="89" stroke="rgba(194,24,91,0.1)" strokeWidth="0.8" />

        {/* Care label at bottom */}
        <rect x="56" y="120" width="8" height="6" rx="1" fill="rgba(194,24,91,0.2)" />
        <line x1="60" y1="120" x2="60" y2="126" stroke="rgba(194,24,91,0.12)" strokeWidth="0.6" />

      </g>

      {/* Sparkles (bên ngoài group để không sway cùng) */}
      {/* Sparkle left */}
      <g className="sh-spark1">
        <path d="M20 52 L21.2 55.5 L25 55.5 L22.1 57.7 L23.3 61.2 L20 59 L16.7 61.2 L17.9 57.7 L15 55.5 L18.8 55.5 Z"
          fill="#e91e63" opacity="0.8"/>
      </g>
      {/* Sparkle right */}
      <g className="sh-spark2">
        <path d="M100 57 L101 60 L104.5 60 L101.7 62 L102.7 65 L100 63.2 L97.3 65 L98.3 62 L95.5 60 L99 60 Z"
          fill="#c2185b" opacity="0.85"/>
      </g>
      {/* Sparkle bottom center */}
      <g className="sh-spark3">
        <path d="M60 88 L60.8 90.5 L63.5 90.5 L61.4 92 L62.2 94.5 L60 93 L57.8 94.5 L58.6 92 L56.5 90.5 L59.2 90.5 Z"
          fill="#e91e63" opacity="0.7"/>
      </g>
    </svg>
  );
};

export default ShirtHangerIcon;
