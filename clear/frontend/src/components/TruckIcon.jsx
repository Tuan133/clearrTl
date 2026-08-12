import React from 'react';

/**
 * TruckIcon — Premium laundry van icon
 * Style: Clean white mini-van với brand color #c2185b (hồng đậm)
 * Mood: Chuyên nghiệp, hiện đại, uy tín — đúng tinh thần "Giặt Ủi Di Động Cá Nhân Hóa"
 */
const TruckIcon = ({ size = 80 }) => {
  const w = size;
  const h = size * 0.72;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 115"
      width={w}
      height={h}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <style>{`
          @keyframes vanBounce {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-2.5px); }
          }
          @keyframes vanWheelSpin {
            to { transform: rotate(360deg); }
          }
          @keyframes vanSparkle {
            0%,100% { opacity: 0; transform: scale(0.5); }
            50%     { opacity: 1; transform: scale(1.2); }
          }
          @keyframes vanBubble1 {
            0%   { opacity: 0; transform: translate(0,0) scale(0.5); }
            40%  { opacity: 0.9; }
            100% { opacity: 0; transform: translate(-6px,-20px) scale(1.1); }
          }
          @keyframes vanBubble2 {
            0%   { opacity: 0; transform: translate(0,0) scale(0.4); }
            40%  { opacity: 0.85; }
            100% { opacity: 0; transform: translate(4px,-26px) scale(1); }
          }
          @keyframes vanBubble3 {
            0%   { opacity: 0; transform: translate(0,0) scale(0.3); }
            45%  { opacity: 0.8; }
            100% { opacity: 0; transform: translate(-2px,-18px) scale(0.9); }
          }

          .van-body      { animation: vanBounce 0.7s ease-in-out infinite; }
          .van-wheel-r   { transform-origin: 40px 82px; animation: vanWheelSpin 0.85s linear infinite; }
          .van-wheel-f   { transform-origin: 120px 82px; animation: vanWheelSpin 0.85s linear infinite; }
          .van-sparkle-1 { transform-origin: 68px 38px; animation: vanSparkle 1.8s ease-in-out 0s infinite; }
          .van-sparkle-2 { transform-origin: 80px 32px; animation: vanSparkle 1.8s ease-in-out 0.6s infinite; }
          .van-sparkle-3 { transform-origin: 92px 40px; animation: vanSparkle 1.8s ease-in-out 1.2s infinite; }
          .van-bubble-1  { transform-origin: 139px 52px; animation: vanBubble1 2s ease-out 0s infinite; }
          .van-bubble-2  { transform-origin: 139px 52px; animation: vanBubble2 2s ease-out 0.65s infinite; }
          .van-bubble-3  { transform-origin: 139px 52px; animation: vanBubble3 2s ease-out 1.3s infinite; }
        `}</style>

        {/* Van body gradient — trắng ngà sang trọng */}
        <linearGradient id="vBodyG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0EEF4" />
        </linearGradient>

        {/* Cab / front panel */}
        <linearGradient id="vCabG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E4EE" />
        </linearGradient>

        {/* Brand stripe gradient — hồng brand */}
        <linearGradient id="vStripeG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c2185b" />
          <stop offset="50%"  stopColor="#e91e63" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>

        {/* Roof gradient — xám bạc */}
        <linearGradient id="vRoofG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ECECEC" />
          <stop offset="100%" stopColor="#D8D4DF" />
        </linearGradient>

        {/* Window glass */}
        <linearGradient id="vWinG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#cde8ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#89c4f4" stopOpacity="0.8"  />
        </linearGradient>

        {/* Wheel */}
        <radialGradient id="vWheelG" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#6D6D7D" />
          <stop offset="100%" stopColor="#1A1A2E" />
        </radialGradient>

        {/* Hub cap */}
        <radialGradient id="vHubG" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c2185b" />
          <stop offset="100%" stopColor="#880e4f" />
        </radialGradient>

        {/* Headlight glow */}
        <filter id="vGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Drop shadow */}
        <filter id="vShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>

        {/* Soft glow on stripes */}
        <filter id="vStripeGlow" x="-5%" y="-50%" width="110%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Bubble soap effect */}
        <radialGradient id="vBubbleG" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="60%"  stopColor="#f8b4cc" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#e91e63" stopOpacity="0.3"/>
        </radialGradient>
      </defs>

      {/* ===== SOAP BUBBLES (top-right, trôi lên) ===== */}
      <g className="van-bubble-1">
        <circle cx="139" cy="52" r="5" fill="url(#vBubbleG)" stroke="#e91e63" strokeWidth="0.6" strokeOpacity="0.4"/>
        <ellipse cx="137" cy="50" rx="1.2" ry="0.7" fill="white" fillOpacity="0.7" transform="rotate(-30 137 50)"/>
      </g>
      <g className="van-bubble-2">
        <circle cx="139" cy="52" r="4" fill="url(#vBubbleG)" stroke="#c2185b" strokeWidth="0.5" strokeOpacity="0.4"/>
        <ellipse cx="137.5" cy="50.5" rx="1" ry="0.6" fill="white" fillOpacity="0.65" transform="rotate(-25 137.5 50.5)"/>
      </g>
      <g className="van-bubble-3">
        <circle cx="139" cy="52" r="3" fill="url(#vBubbleG)" stroke="#e91e63" strokeWidth="0.5" strokeOpacity="0.35"/>
      </g>

      {/* ===== MAIN VAN GROUP (bounce) ===== */}
      <g className="van-body">

        {/* Ground shadow */}
        <ellipse cx="80" cy="96" rx="65" ry="5.5" fill="rgba(0,0,0,0.12)" filter="url(#vShadow)" />

        {/* ── ROOF ── */}
        <rect x="22" y="22" width="110" height="8" rx="4" fill="url(#vRoofG)" />
        {/* Roof edge highlight */}
        <rect x="22" y="22" width="110" height="3" rx="3" fill="rgba(255,255,255,0.6)" />
        {/* Roof rack detail */}
        <rect x="30" y="19" width="90" height="4" rx="2" fill="#CFCBD8" />
        <rect x="34" y="20" width="4" height="2" rx="1" fill="#B8B4C0"/>
        <rect x="110" y="20" width="4" height="2" rx="1" fill="#B8B4C0"/>
        <rect x="72" y="20" width="4" height="2" rx="1" fill="#B8B4C0"/>

        {/* ── VAN BODY ── */}
        <rect x="22" y="30" width="110" height="52" rx="6" fill="url(#vBodyG)" />
        {/* Body top highlight */}
        <rect x="22" y="30" width="110" height="10" rx="6" fill="rgba(255,255,255,0.5)" />
        {/* Body bottom shadow */}
        <rect x="22" y="72" width="110" height="10" rx="0" fill="rgba(0,0,0,0.04)" />

        {/* ── BRAND STRIPE (horizontal) ── */}
        <rect x="22" y="55" width="110" height="11" fill="url(#vStripeG)" filter="url(#vStripeGlow)" />
        {/* Stripe top highlight */}
        <rect x="22" y="55" width="110" height="2.5" fill="rgba(255,255,255,0.2)" />

        {/* ── BRAND TEXT on stripe ── */}
        <text
          x="77" y="63"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          fill="white"
          letterSpacing="2.5"
          opacity="0.95"
        >
          CLEAR
        </text>

        {/* ── SPARKLE STARS (trên body, biểu trưng sạch sẽ) ── */}
        {/* Sparkle 1 */}
        <g className="van-sparkle-1">
          <path d="M68 35 L69.2 38 L72.5 38 L69.9 40 L71 43 L68 41.2 L65 43 L66.1 40 L63.5 38 L66.8 38 Z"
            fill="#e91e63" opacity="0.9" />
        </g>
        {/* Sparkle 2 — nhỏ hơn */}
        <g className="van-sparkle-2">
          <path d="M80 29 L80.8 31.5 L83.5 31.5 L81.4 33 L82.2 35.5 L80 34 L77.8 35.5 L78.6 33 L76.5 31.5 L79.2 31.5 Z"
            fill="#ff6699" opacity="0.85" />
        </g>
        {/* Sparkle 3 */}
        <g className="van-sparkle-3">
          <path d="M92 36 L93 38.5 L95.8 38.5 L93.9 40 L94.7 42.5 L92 41 L89.3 42.5 L90.1 40 L88.2 38.5 L91 38.5 Z"
            fill="#c2185b" opacity="0.9" />
        </g>

        {/* ── WINDOWS (main cargo side — frosted effect) ── */}
        {/* Window 1 */}
        <rect x="30" y="33" width="24" height="18" rx="3.5" fill="url(#vWinG)" />
        <rect x="30" y="33" width="24" height="5"  rx="3.5" fill="rgba(255,255,255,0.35)" />
        <path d="M32 35 L36 35 L32 43 Z" fill="rgba(255,255,255,0.4)" />

        {/* Window 2 */}
        <rect x="58" y="33" width="24" height="18" rx="3.5" fill="url(#vWinG)" />
        <rect x="58" y="33" width="24" height="5"  rx="3.5" fill="rgba(255,255,255,0.35)" />
        <path d="M60 35 L64 35 L60 43 Z" fill="rgba(255,255,255,0.4)" />

        {/* ── CAB / FRONT WINDSHIELD ── */}
        {/* Cab panel */}
        <rect x="110" y="30" width="22" height="52" rx="6" fill="url(#vCabG)" />
        <rect x="110" y="30" width="22" height="10" rx="6" fill="rgba(255,255,255,0.4)" />

        {/* Windshield */}
        <rect x="113" y="33" width="16" height="19" rx="4" fill="url(#vWinG)" />
        {/* Windshield inner glare */}
        <path d="M115 35 L119 35 L115 44 Z" fill="rgba(255,255,255,0.45)" />
        {/* Wiper */}
        <line x1="114" y1="52" x2="126" y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" strokeLinecap="round"/>

        {/* Front door window */}
        <rect x="113" y="55" width="13" height="9" rx="2.5" fill="rgba(173,216,255,0.65)" />

        {/* ── HEADLIGHT ── */}
        <rect x="129" y="56" width="5" height="9" rx="2.5" fill="#FFF8DC" filter="url(#vGlow)"/>
        <rect x="130" y="57.5" width="3" height="6" rx="1.5" fill="#FFE566"/>
        {/* DRL line */}
        <line x1="129" y1="56" x2="134" y2="56" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>

        {/* ── FRONT GRILLE ── */}
        <rect x="129" y="67" width="5" height="9" rx="2" fill="#E0D8E8"/>
        <line x1="130" y1="69" x2="133" y2="69" stroke="#c2185b" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="130" y1="71.5" x2="133" y2="71.5" stroke="#c2185b" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="130" y1="74" x2="133" y2="74" stroke="#c2185b" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ── SIDE MIRROR ── */}
        <path d="M130 38 L136 38 L136 44 L130 44 Z" rx="2" fill="#E8E4EE"/>
        <rect x="134" y="39" width="4" height="4" rx="1.5" fill="#D0CCD8" />
        <rect x="135" y="40" rx="1" width="2" height="2" fill="#C0BCCB" />

        {/* ── DOOR LINES (subtle) ── */}
        {/* Between window 1 & 2 */}
        <line x1="55" y1="30" x2="55" y2="82" stroke="rgba(0,0,0,0.07)" strokeWidth="1.2"/>
        {/* Between window 2 & cab */}
        <line x1="85" y1="30" x2="85" y2="82" stroke="rgba(0,0,0,0.07)" strokeWidth="1.2"/>
        {/* Cab door line */}
        <line x1="112" y1="30" x2="112" y2="82" stroke="rgba(0,0,0,0.07)" strokeWidth="1.2"/>

        {/* Door handle 1 */}
        <rect x="38" y="67" width="8" height="2" rx="1" fill="rgba(0,0,0,0.12)"/>
        {/* Door handle 2 */}
        <rect x="66" y="67" width="8" height="2" rx="1" fill="rgba(0,0,0,0.12)"/>

        {/* ── UNDERCARRIAGE ── */}
        <rect x="22" y="78" width="112" height="5" rx="2.5" fill="rgba(0,0,0,0.10)"/>

        {/* ── WHEELS ── */}
        {/* REAR WHEEL */}
        <circle cx="40" cy="82" r="14" fill="url(#vWheelG)"/>
        <circle cx="40" cy="82" r="10" fill="#2A2A3C"/>
        <g className="van-wheel-r">
          {/* Spokes */}
          <line x1="40" y1="72" x2="40" y2="92" stroke="#6D6D7D" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="30" y1="82" x2="50" y2="82" stroke="#6D6D7D" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="32.9" y1="74.9" x2="47.1" y2="89.1" stroke="#6D6D7D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="47.1" y1="74.9" x2="32.9" y2="89.1" stroke="#6D6D7D" strokeWidth="2" strokeLinecap="round"/>
        </g>
        {/* Hub cap — brand color */}
        <circle cx="40" cy="82" r="4" fill="url(#vHubG)"/>
        <circle cx="40" cy="82" r="2" fill="white" fillOpacity="0.7"/>
        {/* Tire rim highlight */}
        <circle cx="40" cy="82" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>

        {/* FRONT WHEEL */}
        <circle cx="120" cy="82" r="14" fill="url(#vWheelG)"/>
        <circle cx="120" cy="82" r="10" fill="#2A2A3C"/>
        <g className="van-wheel-f">
          <line x1="120" y1="72" x2="120" y2="92" stroke="#6D6D7D" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="110" y1="82" x2="130" y2="82" stroke="#6D6D7D" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="112.9" y1="74.9" x2="127.1" y2="89.1" stroke="#6D6D7D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="127.1" y1="74.9" x2="112.9" y2="89.1" stroke="#6D6D7D" strokeWidth="2" strokeLinecap="round"/>
        </g>
        {/* Hub cap — brand color */}
        <circle cx="120" cy="82" r="4" fill="url(#vHubG)"/>
        <circle cx="120" cy="82" r="2" fill="white" fillOpacity="0.7"/>
        <circle cx="120" cy="82" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>

      </g>{/* end van-body */}
    </svg>
  );
};

export default TruckIcon;
