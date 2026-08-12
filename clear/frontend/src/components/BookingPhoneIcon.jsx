import React from 'react';

/**
 * BookingPhoneIcon — Icon điện thoại + chat bubble
 * BƯỚC 1: "Yêu cầu báo giá miễn phí"
 * Style: Điện thoại trắng hiện đại + bong bóng hồng brand
 */
const BookingPhoneIcon = ({ size = 72 }) => {
  const w = size;
  const h = size * 1.1;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 120"
      width={w}
      height={h}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <style>{`
          @keyframes phoneFloat {
            0%, 100% { transform: translateY(0px) rotate(-6deg); }
            50%       { transform: translateY(-4px) rotate(-6deg); }
          }
          @keyframes bubblePop {
            0%   { transform: scale(0.85); opacity: 0.7; }
            50%  { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(0.85); opacity: 0.7; }
          }
          @keyframes dotBlink1 {
            0%,80%,100% { opacity: 0.3; }
            40% { opacity: 1; }
          }
          @keyframes dotBlink2 {
            0%,80%,100% { opacity: 0.3; }
            55% { opacity: 1; }
          }
          @keyframes dotBlink3 {
            0%,80%,100% { opacity: 0.3; }
            70% { opacity: 1; }
          }
          @keyframes screenGlow {
            0%,100% { opacity: 0.5; }
            50%     { opacity: 0.9; }
          }
          @keyframes ringPulse {
            0%   { r: 0; opacity: 0.7; }
            100% { r: 18; opacity: 0; }
          }

          .phone-group  { transform-origin: 55px 75px; animation: phoneFloat 2.8s ease-in-out infinite; }
          .chat-bubble  { transform-origin: 80px 32px; animation: bubblePop 2.2s ease-in-out infinite; }
          .dot1 { animation: dotBlink1 1.4s ease-in-out infinite; }
          .dot2 { animation: dotBlink2 1.4s ease-in-out infinite; }
          .dot3 { animation: dotBlink3 1.4s ease-in-out infinite; }
          .screen-glow  { animation: screenGlow 2s ease-in-out infinite; }
          .ring-pulse   { animation: ringPulse 1.6s ease-out infinite; }
          .ring-pulse2  { animation: ringPulse 1.6s ease-out 0.8s infinite; }
        `}</style>

        {/* Phone body */}
        <linearGradient id="phoneBodyG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EDE8F4" />
        </linearGradient>

        {/* Phone screen */}
        <linearGradient id="phoneScreenG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FCE4EC" />
          <stop offset="100%" stopColor="#F8BBD9" />
        </linearGradient>

        {/* Chat bubble */}
        <linearGradient id="chatBubbleG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#e91e63" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id="phoneShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="rgba(194,24,91,0.2)" />
        </filter>

        {/* Glow ring filter */}
        <filter id="phoneGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Pulse rings (glow around phone) */}
      <circle cx="55" cy="78" r="0" fill="none" stroke="#e91e63" strokeWidth="2" strokeOpacity="0.4" className="ring-pulse"/>
      <circle cx="55" cy="78" r="0" fill="none" stroke="#c2185b" strokeWidth="1.5" strokeOpacity="0.3" className="ring-pulse2"/>

      {/* ===== PHONE GROUP ===== */}
      <g className="phone-group" filter="url(#phoneShadow)">

        {/* Phone body */}
        <rect x="30" y="42" width="50" height="78" rx="9" fill="url(#phoneBodyG)" />
        {/* Side frame accent */}
        <rect x="30" y="42" width="50" height="78" rx="9" fill="none" stroke="#c2185b" strokeWidth="1.5" strokeOpacity="0.25"/>

        {/* Screen area */}
        <rect x="34" y="50" width="42" height="60" rx="5" fill="url(#phoneScreenG)" />
        {/* Screen glow overlay */}
        <rect x="34" y="50" width="42" height="60" rx="5" fill="rgba(255,255,255,0.3)" className="screen-glow"/>

        {/* Notch / camera */}
        <rect x="50" y="43" width="10" height="4" rx="2" fill="#D0CAD9"/>
        <circle cx="55" cy="45" r="1.5" fill="#B8B0C4"/>

        {/* Screen content — mini UI lines */}
        <rect x="39" y="57" width="32" height="3" rx="1.5" fill="rgba(194,24,91,0.25)"/>
        <rect x="39" y="63" width="24" height="2.5" rx="1.25" fill="rgba(194,24,91,0.15)"/>
        <rect x="39" y="69" width="28" height="2.5" rx="1.25" fill="rgba(194,24,91,0.15)"/>

        {/* Price tag on screen */}
        <rect x="39" y="76" width="32" height="18" rx="4" fill="rgba(194,24,91,0.12)"/>
        <text x="55" y="86" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Inter,sans-serif" fill="#c2185b" opacity="0.9">BÁO GIÁ</text>
        <text x="55" y="93" textAnchor="middle" fontSize="5.5" fontWeight="600" fontFamily="Inter,sans-serif" fill="#c2185b" opacity="0.7">MIỄN PHÍ</text>

        {/* Home indicator */}
        <rect x="48" y="112" width="14" height="3" rx="1.5" fill="#D0CAD9"/>

        {/* Volume buttons */}
        <rect x="27" y="60" width="3" height="8" rx="1.5" fill="#D8D0E4"/>
        <rect x="27" y="72" width="3" height="8" rx="1.5" fill="#D8D0E4"/>
        {/* Power button */}
        <rect x="80" y="64" width="3" height="10" rx="1.5" fill="#D8D0E4"/>
      </g>

      {/* ===== CHAT BUBBLE (top right) ===== */}
      <g className="chat-bubble">
        {/* Bubble shadow */}
        <ellipse cx="80" cy="37" rx="20" ry="12" fill="rgba(194,24,91,0.15)" transform="translate(2,3)"/>
        {/* Main bubble */}
        <rect x="60" y="10" width="42" height="26" rx="10" fill="url(#chatBubbleG)" filter="url(#phoneGlow)"/>
        {/* Bubble tail */}
        <path d="M68 36 L62 44 L76 36 Z" fill="#c2185b"/>
        {/* Typing dots */}
        <circle cx="74" cy="23" r="3.5" fill="white" className="dot1"/>
        <circle cx="84" cy="23" r="3.5" fill="white" className="dot2"/>
        <circle cx="94" cy="23" r="3.5" fill="white" className="dot3"/>
      </g>
    </svg>
  );
};

export default BookingPhoneIcon;
