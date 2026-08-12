import React from 'react';

/**
 * WhyIcons — 8 SVG icons trắng cho section "Tại Sao Chọn Chúng Tôi?"
 * Nguyên tắc: icon trắng trên nền hồng brand, đơn giản, đọc được ở 36-40px
 * Mỗi icon đúng ngữ nghĩa với label của nó
 */

// 1. Đồng hồ + tia sét — "Báo Giá Cung Cấp Trong 2 Giờ"
export const QuoteClockIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clock body */}
    <circle cx="18" cy="21" r="14" stroke="white" strokeWidth="2.5" fill="none"/>
    {/* Clock center */}
    <circle cx="18" cy="21" r="1.8" fill="white"/>
    {/* Hour hand — 12 giờ */}
    <line x1="18" y1="21" x2="18" y2="11" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Minute hand — 2 giờ */}
    <line x1="18" y1="21" x2="24" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    {/* 12 o'clock tick */}
    <line x1="18" y1="8" x2="18" y2="10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    {/* Lightning bolt top right — "nhanh" */}
    <path d="M30 4 L26 14 L30 14 L26 24 L35 11 L30 11 Z"
      fill="white" stroke="none" opacity="0.95"/>
  </svg>
);

// 2. Tai nghe + sóng — "Trung Tâm Hỗ Trợ tại Sài Gòn"
export const HeadsetIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Headphone band */}
    <path d="M8 22 C8 12 32 12 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Left ear cup */}
    <rect x="5" y="21" width="7" height="11" rx="3.5" fill="white"/>
    {/* Right ear cup */}
    <rect x="28" y="21" width="7" height="11" rx="3.5" fill="white"/>
    {/* Mic arm */}
    <path d="M35 28 Q38 28 38 32 L35 32" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Mic end dot */}
    <circle cx="35" cy="32" r="1.8" fill="white"/>
    {/* Sound waves left */}
    <path d="M3 18 C1 20 1 22 3 24" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
    {/* Sound waves right */}
    <path d="M37 18 C39 20 39 22 37 24" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

// 3. Huy chương / Shield + star — "Tất Cả Dịch Vụ Được Bảo Hành"
export const GuaranteeIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ribbon circle */}
    <circle cx="20" cy="18" r="12" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2.5"/>
    {/* Star inside */}
    <path d="M20 10 L21.8 15.5 L27.5 15.5 L23 18.8 L24.8 24.5 L20 21.2 L15.2 24.5 L17 18.8 L12.5 15.5 L18.2 15.5 Z"
      fill="white"/>
    {/* Ribbon left */}
    <path d="M14 28 L16 38 L20 34 L24 38 L26 28" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// 4. Giọt nước + lá — "Nước Giặt Thân Thiện Môi Trường"
export const EcoDropIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Water drop */}
    <path d="M20 6 C20 6 10 18 10 24 C10 30 14.5 35 20 35 C25.5 35 30 30 30 24 C30 18 20 6 20 6 Z"
      fill="white" fillOpacity="0.9"/>
    {/* Inner leaf shape */}
    <path d="M20 16 C17 20 16 23 16 25 C16 27 17.5 28 20 28 C22.5 28 24 27 24 25 C24 23 23 20 20 16 Z"
      fill="white" fillOpacity="0.35"/>
    {/* Leaf vein */}
    <line x1="20" y1="16" x2="20" y2="28" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
    {/* Leaf on top right */}
    <path d="M26 8 C30 6 34 10 30 14 C28 16 24 14 26 8 Z" fill="white" fillOpacity="0.8"/>
    <path d="M26 8 L30 14" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    {/* Shine on drop */}
    <ellipse cx="16.5" cy="20" rx="2" ry="4" fill="white" fillOpacity="0.4" transform="rotate(-20 16.5 20)"/>
  </svg>
);

// 5. Van + 2 mũi tên — "Giao & Nhận Miễn Phí"
export const FreePickupIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Van body */}
    <rect x="3" y="14" width="26" height="14" rx="3" fill="white" fillOpacity="0.9"/>
    {/* Van cab */}
    <rect x="29" y="17" width="8" height="11" rx="2.5" fill="white" fillOpacity="0.8"/>
    {/* Windshield */}
    <rect x="30" y="18.5" width="5.5" height="6" rx="1.5" fill="white" fillOpacity="0.3"/>
    {/* Rear window */}
    <rect x="6" y="16.5" width="7" height="6" rx="1.5" fill="white" fillOpacity="0.3"/>
    {/* Front window */}
    <rect x="15" y="16.5" width="7" height="6" rx="1.5" fill="white" fillOpacity="0.3"/>
    {/* Wheels */}
    <circle cx="10" cy="29" r="4" fill="white"/>
    <circle cx="10" cy="29" r="2" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
    <circle cx="31" cy="29" r="4" fill="white"/>
    <circle cx="31" cy="29" r="2" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
    {/* Arrow right */}
    <polyline points="35,7 38,10 35,13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="32" y1="10" x2="38" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    {/* Arrow left */}
    <polyline points="5,7 2,10 5,13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="2" y1="10" x2="8" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 6. Shield + checkmark — "Bảo Hiểm Đầy Đủ"
export const InsuranceShieldIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield outer */}
    <path d="M20 4 L34 10 L34 22 C34 30 27 36 20 38 C13 36 6 30 6 22 L6 10 Z"
      fill="white" fillOpacity="0.25" stroke="white" strokeWidth="2.3" strokeLinejoin="round"/>
    {/* Shield inner fill */}
    <path d="M20 8 L31 13 L31 22 C31 28.5 25.5 33.5 20 35.5 C14.5 33.5 9 28.5 9 22 L9 13 Z"
      fill="white" fillOpacity="0.15"/>
    {/* Checkmark */}
    <polyline points="13,21 18,27 28,15"
      stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// 7. Thẻ ID người + tick — "Nhân Viên Qua Kiểm Tra Lý Lịch"
export const BackgroundCheckIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ID card */}
    <rect x="4" y="8" width="32" height="24" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2.3"/>
    {/* Card top stripe */}
    <rect x="4" y="8" width="32" height="7" rx="4" fill="white" fillOpacity="0.2"/>
    {/* Avatar circle */}
    <circle cx="13" cy="23" r="5.5" fill="white" fillOpacity="0.9"/>
    {/* Person head */}
    <circle cx="13" cy="21" r="2.2" fill="white" fillOpacity="0.4"/>
    {/* Person body */}
    <path d="M9 27.5 C9 25 11 24 13 24 C15 24 17 25 17 27.5" fill="white" fillOpacity="0.4"/>
    {/* Lines (text placeholder) */}
    <rect x="21" y="19" width="11" height="2.5" rx="1.2" fill="white" fillOpacity="0.8"/>
    <rect x="21" y="23.5" width="8" height="2" rx="1" fill="white" fillOpacity="0.6"/>
    {/* Green check badge */}
    <circle cx="32" cy="9" r="7" fill="white"/>
    <polyline points="29,9 31.5,11.5 35.5,7"
      stroke="#c2185b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// 8. Bàn tay mở + không xích — "Không Hợp Đồng Ràng Buộc"
export const NoContractIcon = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Open hand palm */}
    <path d="M20 38 C14 38 8 34 8 27 L8 14 C8 12 10 11 12 12 L12 21"
      stroke="white" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
    <path d="M12 14 C12 12 14 11 16 12 L16 21"
      stroke="white" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
    <path d="M16 13 C16 11 18 10 20 11 L20 21"
      stroke="white" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
    <path d="M20 12 C20 10 22 9 24 10 L24 21"
      stroke="white" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
    <path d="M24 15 C24 13 26 12 28 13 L28 23 C28 30 24 35 20 38"
      stroke="white" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
    {/* Broken chain link top left */}
    <path d="M5 6 C4 4 6 2 8 3 C10 4 10 7 8 8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
    <path d="M10 9 C11 11 9 13 7 12 C5 11 5 8 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
    {/* Break gap (no connecting link) */}
    <line x1="9" y1="7" x2="9" y2="9" stroke="white" strokeWidth="1.5" strokeOpacity="0.2"/>
    {/* X mark top right — no contract */}
    <circle cx="33" cy="7" r="5.5" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.8"/>
    <line x1="30.5" y1="4.5" x2="35.5" y2="9.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="35.5" y1="4.5" x2="30.5" y2="9.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Map tiện dùng: export tất cả theo thứ tự từ t.whyChooseUs.items
export const WHY_ICONS = [
  QuoteClockIcon,
  HeadsetIcon,
  GuaranteeIcon,
  EcoDropIcon,
  FreePickupIcon,
  InsuranceShieldIcon,
  BackgroundCheckIcon,
  NoContractIcon,
];
