import React from 'react';

/**
 * CleanClothesIcon — Quần áo sạch sẽ, gấp gọn + sparkle stars
 * BƯỚC 4: "Nhận quần áo sạch sẽ, gấp gọn mà không tốn sức"
 * Style: Stack quần áo gấp gọn trắng/hồng + ngôi sao lấp lánh brand color
 */
const CleanClothesIcon = ({ size = 72 }) => {
  const w = size;
  const h = size * 1.05;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 116"
      width={w}
      height={h}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <style>{`
          @keyframes stackFloat {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-4px); }
          }
          @keyframes starPop1 {
            0%,100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
            50%     { opacity: 1; transform: scale(1.15) rotate(15deg); }
          }
          @keyframes starPop2 {
            0%,100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
            50%     { opacity: 1; transform: scale(1) rotate(-10deg); }
          }
          @keyframes starPop3 {
            0%,100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
            50%     { opacity: 1; transform: scale(0.9) rotate(20deg); }
          }
          @keyframes ribbonShine {
            0%,100% { opacity: 0.7; }
            50%     { opacity: 1; }
          }
          @keyframes checkPop {
            0%,60%  { opacity: 0; transform: scale(0.5); }
            80%     { opacity: 1; transform: scale(1.2); }
            100%    { opacity: 1; transform: scale(1); }
          }

          .stack-group { transform-origin: 55px 80px; animation: stackFloat 2.6s ease-in-out infinite; }
          .star-1 { transform-origin: 15px 28px; animation: starPop1 2s ease-in-out 0s infinite; }
          .star-2 { transform-origin: 96px 22px; animation: starPop2 2s ease-in-out 0.65s infinite; }
          .star-3 { transform-origin: 88px 72px; animation: starPop3 2s ease-in-out 1.3s infinite; }
          .ribbon-shine { animation: ribbonShine 1.8s ease-in-out infinite; }
          .check-pop { animation: checkPop 2.4s ease-out infinite; }
        `}</style>

        {/* Bottom layer — hồng nhạt */}
        <linearGradient id="layer3G" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FCE4EC" />
          <stop offset="100%" stopColor="#F8BBD9" />
        </linearGradient>

        {/* Middle layer — hồng nhạt hơn */}
        <linearGradient id="layer2G" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FCE4EC" />
        </linearGradient>

        {/* Top layer — trắng */}
        <linearGradient id="layer1G" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F9F5FC" />
        </linearGradient>

        {/* Ribbon/band brand hồng */}
        <linearGradient id="ribbonG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c2185b" />
          <stop offset="50%"  stopColor="#e91e63" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id="stackShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="rgba(194,24,91,0.2)" />
        </filter>

        {/* Star glow */}
        <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sparkle stars — ngoài group nên không float */}
      {/* Star large — top left */}
      <g className="star-1">
        <path d="M15 24 L16.8 29.5 L22.5 29.5 L17.9 33 L19.7 38.5 L15 35 L10.3 38.5 L12.1 33 L7.5 29.5 L13.2 29.5 Z"
          fill="#e91e63" filter="url(#starGlow)" opacity="0.9"/>
      </g>
      {/* Star medium — top right */}
      <g className="star-2">
        <path d="M96 18 L97.5 23 L103 23 L98.8 26.2 L100.3 31.2 L96 28 L91.7 31.2 L93.2 26.2 L89 23 L94.5 23 Z"
          fill="#c2185b" filter="url(#starGlow)" opacity="0.85"/>
      </g>
      {/* Star small — right */}
      <g className="star-3">
        <path d="M88 68 L89.2 71.8 L93 71.8 L90 74 L91.2 77.8 L88 75.5 L84.8 77.8 L86 74 L83 71.8 L86.8 71.8 Z"
          fill="#e91e63" filter="url(#starGlow)" opacity="0.8"/>
      </g>

      {/* ===== STACK GROUP ===== */}
      <g className="stack-group" filter="url(#stackShadow)">

        {/* Ground shadow */}
        <ellipse cx="55" cy="108" rx="38" ry="4.5" fill="rgba(194,24,91,0.1)"/>

        {/* ── LAYER 3 (bottom — hồng nhạt) ── */}
        <rect x="18" y="90" width="74" height="16" rx="5" fill="url(#layer3G)"/>
        {/* Layer 3 fold lines */}
        <line x1="18" y1="97" x2="92" y2="97" stroke="rgba(194,24,91,0.12)" strokeWidth="0.8"/>
        {/* Layer 3 edge shadow */}
        <rect x="18" y="90" width="74" height="16" rx="5" fill="none" stroke="rgba(194,24,91,0.15)" strokeWidth="0.8"/>
        {/* Collar peak bottom */}
        <path d="M43 90 L55 84 L67 90 Z" fill="url(#layer3G)"/>

        {/* ── LAYER 2 (middle — trắng/hồng) ── */}
        <rect x="22" y="72" width="66" height="20" rx="5" fill="url(#layer2G)"/>
        <line x1="22" y1="80" x2="88" y2="80" stroke="rgba(194,24,91,0.1)" strokeWidth="0.8"/>
        <rect x="22" y="72" width="66" height="20" rx="5" fill="none" stroke="rgba(194,24,91,0.12)" strokeWidth="0.8"/>
        <path d="M42 72 L55 66 L68 72 Z" fill="url(#layer2G)"/>

        {/* ── LAYER 1 (top — trắng) ── */}
        <rect x="26" y="54" width="58" height="20" rx="5" fill="url(#layer1G)"/>
        {/* Top fold */}
        <rect x="26" y="54" width="58" height="6" rx="5" fill="rgba(255,255,255,0.6)"/>
        <line x1="26" y1="63" x2="84" y2="63" stroke="rgba(194,24,91,0.1)" strokeWidth="0.8"/>
        <rect x="26" y="54" width="58" height="20" rx="5" fill="none" stroke="rgba(194,24,91,0.12)" strokeWidth="0.8"/>
        {/* Collar peak top */}
        <path d="M42 54 L55 47 L68 54 Z" fill="url(#layer1G)" stroke="rgba(194,24,91,0.1)" strokeWidth="0.6"/>

        {/* ── BRAND RIBBON (ties the stack) ── */}
        <rect x="18" y="82" width="74" height="10" rx="3" fill="url(#ribbonG)" className="ribbon-shine"/>
        {/* Ribbon shine */}
        <rect x="18" y="82" width="74" height="3" rx="3" fill="rgba(255,255,255,0.22)"/>
        {/* Ribbon text */}
        <text x="55" y="89.5" textAnchor="middle" fontSize="5.5" fontWeight="700"
          fontFamily="Inter,sans-serif" fill="white" letterSpacing="2" opacity="0.95">CLEAR</text>

        {/* Ribbon bow knot */}
        {/* Bow left */}
        <path d="M35 87 C30 82 25 84 28 87 C31 90 35 88 35 87 Z" fill="#c2185b"/>
        {/* Bow right */}
        <path d="M75 87 C80 82 85 84 82 87 C79 90 75 88 75 87 Z" fill="#c2185b"/>
        {/* Knot center */}
        <ellipse cx="55" cy="87" rx="4" ry="3.5" fill="#e91e63"/>
        <ellipse cx="55" cy="87" rx="2" ry="1.5" fill="rgba(255,255,255,0.4)"/>

        {/* ── CHECK MARK (top right of stack) ── */}
        <circle cx="80" cy="55" r="9" fill="#c2185b" className="check-pop"/>
        <polyline points="75,55 79,59 85,51"
          fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          className="check-pop"/>

      </g>
    </svg>
  );
};

export default CleanClothesIcon;
