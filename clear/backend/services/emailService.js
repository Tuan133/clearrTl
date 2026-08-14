/**
 * ============================================================
 * TLaundry - Unified Email Notification Service
 * ============================================================
 * Sử dụng Nodemailer + Gmail SMTP
 *
 * Chiến lược gửi mail:
 *   - 1 email duy nhất đến KHÁCH HÀNG (To)
 *   - Admin/Chủ tiệm nhận BCC tự động — không cần gửi email riêng
 *   - Nếu đơn có Gift Card → hiển thị thêm Phần 3 trong cùng email
 *
 * Biến môi trường cần thiết trong .env:
 *   EMAIL_HOST      = smtp.gmail.com
 *   EMAIL_PORT      = 587
 *   EMAIL_USER      = your-gmail@gmail.com
 *   EMAIL_PASS      = xxxx xxxx xxxx xxxx  (Gmail App Password 16 ký tự)
 *   EMAIL_FROM_NAME = TLaundry
 *   ADMIN_EMAIL     = admin@yourdomain.com
 *   EMAIL_DEBUG     = false
 * ============================================================
 */

import nodemailer from 'nodemailer';

// ─── Khởi tạo Transporter ────────────────────────────────────────────────────
const createTransporter = () => {
  const debugMode = process.env.EMAIL_DEBUG === 'true';
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: debugMode,
    logger: debugMode,
  });
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const FROM_ADDRESS = () =>
  `"${process.env.EMAIL_FROM_NAME || 'TLaundry'}" <${process.env.EMAIL_USER}>`;

const REPLY_TO = () =>
  process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

const isEmailConfigured = () =>
  !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const formatDate = (dateStr) => {
  if (!dateStr) return 'Chưa xác định';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Chưa xác định';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Tạo bản plain text từ dữ liệu booking — bắt buộc để tránh spam
 * Spam filter phạt nặng email chỉ có HTML mà không có text/plain
 */
const buildBookingPlainText = (booking, giftCard = null) => {
  const shopName  = process.env.EMAIL_FROM_NAME || 'TLaundry';
  const fullName  = `${booking.firstName} ${booking.lastName}`;
  const fullAddr  = `${booking.address}, ${booking.suburb}, ${booking.state}`;
  const freqLabel = booking.frequency === 'weekly' ? 'Hang tuan'
    : booking.frequency === 'fortnightly' ? 'Hai tuan mot lan' : 'Mot lan';

  let text =
`Xin chao ${fullName},

Don giat cua ban da duoc ${shopName} tiep nhan thanh cong.

==================================================
MA DON HANG: ${booking.orderCode}
==================================================

CHI TIET DON HANG:
- Khach hang  : ${fullName}
- Dich vu     : ${booking.serviceType || 'Giat Ui Gia Dinh'}
- Ngay lay do : ${formatDate(booking.pickupDate)}
- Khung gio   : ${booking.pickupTime || 'Buoi sang (8am-12pm)'}
- Tan suat    : ${freqLabel}
- Dia chi     : ${fullAddr}
- Dien thoai  : ${booking.phone}${booking.totalAmount ? `
- Tong tien   : ${formatCurrency(booking.totalAmount)}` : ''}${booking.notes ? `
- Ghi chu     : ${booking.notes}` : ''}

QUY TRINH TIEP THEO:
1. Nhan vien se den lay do dung khung gio da chon.
2. Ban nhan thong bao khi do duoc giat.
3. Do sach thom duoc giao tra tai dia chi cua ban.
`;

  if (giftCard) {
    text += `
==================================================
THE QUA TANG KEM THEO
==================================================
Ma the  : ${giftCard.code}
Gia tri : ${formatCurrency(giftCard.amount)}
Tu      : ${giftCard.senderName}
Loi nhan: ${giftCard.message || 'Chuc ban luon vui ve!'}

Cach su dung: Truy cap tlaundry.vn, dat dich vu va nhap ma the tai buoc thanh toan.
`;
  }

  text += `
--------------------------------------------------
Lien he ho tro: support@tlaundry.vn | 0909 000 000
${shopName} - Dich vu giat ui chuyen nghiep
`;

  return text;
};

// ─── Base Layout ─────────────────────────────────────────────────────────────
const baseLayout = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header Brand -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a56db 0%,#0ea5e9 100%);padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;padding:12px;margin-bottom:12px;">
                <span style="font-size:36px;">👕</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">TLaundry</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Dịch vụ giặt ủi chuyên nghiệp</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 8px;color:#64748b;font-size:12px;">© 2026 TLaundry. Tất cả quyền được bảo lưu.</p>
              <p style="margin:0;color:#94a3b8;font-size:11px;">
                📍 123 Đường Giặt Ủi, Quận 1, TP.HCM &nbsp;|&nbsp;
                📞 0909 000 000 &nbsp;|&nbsp;
                ✉️ support@tlaundry.vn
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── Divider giữa các phần ────────────────────────────────────────────────────
const sectionDivider = () =>
  `<hr style="border:none;border-top:2px dashed #e2e8f0;margin:36px 0;" />`;

// ─── Phần 1: Lời chào & Xác nhận đặt lịch ────────────────────────────────────
const buildPart1_Greeting = (booking) => {
  const { orderCode, firstName, lastName } = booking;
  const fullName = `${firstName} ${lastName}`;

  return `
    <!-- PHẦN 1: LỜI CHÀO & XÁC NHẬN -->
    <h2 style="margin:0 0 4px;color:#1e293b;font-size:22px;font-weight:700;">Đặt lịch thành công! 🎉</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;">
      Xin chào <strong>${fullName}</strong>, đơn giặt của bạn đã được tiếp nhận thành công.
      Chúng tôi sẽ liên hệ xác nhận và đến lấy đồ đúng lịch hẹn.
    </p>

    <!-- Order Code Box -->
    <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#1d4ed8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Mã đơn hàng của bạn</p>
      <p style="margin:0;color:#1e40af;font-size:34px;font-weight:800;letter-spacing:5px;font-family:monospace;">${orderCode}</p>
      <p style="margin:10px 0 0;color:#3b82f6;font-size:12px;">Dùng mã này để theo dõi đơn tại website</p>
    </div>

    <div style="text-align:center;margin-bottom:8px;">
      <span style="display:inline-block;background:#dcfce7;color:#166534;padding:5px 18px;border-radius:9999px;font-size:13px;font-weight:600;">
        ✅ Đã tiếp nhận &nbsp;·&nbsp; Đang chờ lấy đồ
      </span>
    </div>
  `;
};

// ─── Phần 2: Chi tiết đơn hàng ───────────────────────────────────────────────
const buildPart2_OrderDetail = (booking) => {
  const {
    firstName, lastName, phone,
    serviceType, pickupDate, pickupTime,
    address, suburb, state, notes, frequency, totalAmount
  } = booking;

  const fullName   = `${firstName} ${lastName}`;
  const fullAddress = `${address}, ${suburb}, ${state}`;

  const infoRow = (label, value) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;width:45%;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;font-weight:600;vertical-align:top;">${value || '—'}</td>
    </tr>
  `;

  const freqLabel = frequency === 'weekly'
    ? 'Hàng tuần'
    : frequency === 'fortnightly'
    ? 'Hai tuần một lần'
    : 'Một lần';

  return `
    <!-- PHẦN 2: CHI TIẾT ĐƠN HÀNG -->
    <h3 style="margin:0 0 14px;color:#374151;font-size:16px;font-weight:700;">📋 Chi tiết đơn hàng</h3>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${infoRow('👤 Khách hàng', fullName)}
      ${infoRow('📱 Số điện thoại', phone)}
      ${infoRow('🧺 Dịch vụ', serviceType)}
      ${infoRow('📅 Ngày lấy đồ', formatDate(pickupDate))}
      ${infoRow('🕐 Khung giờ', pickupTime || 'Buổi sáng (8am–12pm)')}
      ${infoRow('🔄 Tần suất', freqLabel)}
      ${infoRow('📍 Địa chỉ', fullAddress)}
      ${totalAmount ? infoRow('💰 Tổng tiền', formatCurrency(totalAmount)) : ''}
      ${notes ? infoRow('📝 Ghi chú', notes) : ''}
    </table>

    <!-- Quy trình -->
    <div style="background:#f8fafc;border-radius:12px;padding:20px;">
      <h3 style="margin:0 0 14px;color:#374151;font-size:14px;font-weight:700;">🚀 Quy trình tiếp theo</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#1a56db;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">1</div>
          </td>
          <td style="padding:0 0 10px 10px;color:#4b5563;font-size:14px;line-height:1.5;">
            Nhân viên sẽ đến lấy đồ đúng khung giờ đã chọn.
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#1a56db;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">2</div>
          </td>
          <td style="padding:0 0 10px 10px;color:#4b5563;font-size:14px;line-height:1.5;">
            Bạn nhận thông báo khi đồ đang được giặt.
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#1a56db;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">3</div>
          </td>
          <td style="padding:0 0 0 10px;color:#4b5563;font-size:14px;line-height:1.5;">
            Đồ sạch thơm được giao trả tận địa chỉ của bạn.
          </td>
        </tr>
      </table>
    </div>
  `;
};

// ─── Phần 3 (Có điều kiện): Gift Card ────────────────────────────────────────
const buildPart3_GiftCard = (giftCard) => {
  if (!giftCard) return ''; // Không render nếu không có Gift Card

  const {
    code,
    amount,
    recipientName,
    senderName,
    message: personalMessage,
    deliveryDate,
  } = giftCard;

  const formattedAmount = formatCurrency(amount);

  return `
    <!-- PHẦN 3: GIFT CARD (CÓ ĐIỀU KIỆN) -->
    <h3 style="margin:0 0 6px;color:#374151;font-size:16px;font-weight:700;">🎁 Thẻ quà tặng đính kèm</h3>
    <p style="margin:0 0 20px;color:#64748b;font-size:14px;">
      Bạn có một thẻ quà tặng kèm theo đơn hàng này. Hãy lưu lại để sử dụng!
    </p>

    <!-- Gift Card Visual — thiết kế để chụp màn hình / forward email -->
    <div style="background:linear-gradient(135deg,#1a56db 0%,#7c3aed 55%,#0ea5e9 100%);border-radius:18px;padding:36px 28px;text-align:center;margin-bottom:20px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.75);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;">✨ TLaundry Gift Card ✨</p>
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.9);font-size:14px;">Dành cho <strong>${recipientName || 'Bạn'}</strong></p>
      <p style="margin:0 0 24px;color:#ffffff;font-size:52px;font-weight:800;line-height:1;">${formattedAmount}</p>

      <!-- Mã thẻ nổi bật -->
      <div style="background:rgba(255,255,255,0.12);border:2px dashed rgba(255,255,255,0.55);border-radius:12px;padding:16px 24px;display:inline-block;min-width:240px;">
        <p style="margin:0 0 6px;color:rgba(255,255,255,0.75);font-size:10px;text-transform:uppercase;letter-spacing:3px;">Mã thẻ quà tặng</p>
        <p style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:6px;font-family:monospace;">${code}</p>
      </div>

      ${deliveryDate ? `<p style="margin:16px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">📅 Hiệu lực từ: ${formatDate(deliveryDate)}</p>` : ''}
    </div>

    <!-- Lời nhắn cá nhân -->
    <div style="background:#fdf4ff;border-left:4px solid #a855f7;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 6px;color:#7e22ce;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        💌 Lời nhắn từ ${senderName || 'người tặng'}
      </p>
      <p style="margin:0;color:#374151;font-size:15px;font-style:italic;line-height:1.7;">
        "${personalMessage || 'Chúc bạn luôn vui vẻ và có những bộ quần áo sạch sẽ thơm tho! 🌸'}"
      </p>
    </div>

    <!-- Hướng dẫn sử dụng -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin-bottom:20px;">
      <h4 style="margin:0 0 10px;color:#166534;font-size:14px;font-weight:700;">🛍️ Cách sử dụng</h4>
      <ol style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:2.1;">
        <li>Truy cập <a href="https://tlaundry.vn" style="color:#16a34a;font-weight:600;">tlaundry.vn</a> và đặt dịch vụ.</li>
        <li>Nhập mã thẻ <strong style="color:#166534;letter-spacing:2px;">${code}</strong> tại bước thanh toán.</li>
        <li>Giá trị thẻ sẽ được khấu trừ vào tổng đơn.</li>
      </ol>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:8px;">
      <a href="https://tlaundry.vn/dat-lich"
         style="display:inline-block;background:linear-gradient(135deg,#1a56db,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
        🧺 Dùng thẻ quà — Đặt lịch ngay
      </a>
    </div>
  `;
};

// ─── Build HTML hoàn chỉnh ────────────────────────────────────────────────────
/**
 * Tạo nội dung HTML gộp đủ 3 phần (hoặc 2 phần nếu không có gift card)
 * @param {Object} booking  - Booking document
 * @param {Object|null} giftCard - GiftCard document (có thể null)
 */
const buildUnifiedEmailHtml = (booking, giftCard = null) => {
  const shopName  = process.env.EMAIL_FROM_NAME || 'TLaundry';
  const titleSuffix = giftCard ? ' & Thẻ quà tặng của bạn 🎁' : '';
  const subject = `${shopName} - Xác nhận đơn hàng #${booking.orderCode}${titleSuffix}`;

  const part1 = buildPart1_Greeting(booking);
  const part2 = buildPart2_OrderDetail(booking);
  const part3 = buildPart3_GiftCard(giftCard);

  const bodyContent = `
    ${part1}
    ${sectionDivider()}
    ${part2}
    ${giftCard ? sectionDivider() : ''}
    ${part3}
    <p style="margin:28px 0 0;color:#64748b;font-size:13px;text-align:center;">
      Có thắc mắc? Liên hệ chúng tôi tại
      <a href="mailto:support@tlaundry.vn" style="color:#1a56db;font-weight:600;">support@tlaundry.vn</a>
    </p>
  `;

  return { html: baseLayout(subject, bodyContent), subject };
};


// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Gửi 1 email duy nhất:
 *   - To   → Email khách hàng (xác nhận đặt lịch + gift card nếu có)
 *   - BCC  → Admin/Chủ tiệm (tự động nhận bản sao, không cần email riêng)
 *
 * @param {Object}      booking  - Booking document từ MongoDB
 * @param {Object|null} giftCard - GiftCard document (optional, truyền null nếu không có)
 *
 * @example
 *   // Đơn thường (không có gift card)
 *   await sendBookingConfirmation(booking);
 *
 *   // Đơn kèm gift card
 *   await sendBookingConfirmation(booking, giftCard);
 */
export const sendBookingConfirmation = async (booking, giftCard = null) => {
  if (!isEmailConfigured()) {
    console.warn('⚠️  [Email] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Bỏ qua gửi email.');
    return { success: false, reason: 'not_configured' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const { html, subject } = buildUnifiedEmailHtml(booking, giftCard);

  try {
    const transporter = createTransporter();
    const plainText  = buildBookingPlainText(booking, giftCard);

    const info = await transporter.sendMail({
      from:     FROM_ADDRESS(),
      to:       booking.email,     // Khách hàng
      bcc:      adminEmail,        // Admin nhận BCC tự động
      replyTo:  REPLY_TO(),        // Reply sẽ về hộp thư admin
      subject,
      text:     plainText,         // [ANTI-SPAM] Plain text bắt buộc — Gmail phạt nặng nếu thiếu
      html,
      headers: {
        'X-Mailer':        'TLaundry Mailer 1.0',
        'X-Priority':      '3',             // 1=Cao, 3=Bình thường — tránh bị đánh dấu bulk
        'X-Entity-Ref-ID': booking.orderCode, // ID duy nhất mỗi email — giảm trùng lặp
        'Precedence':      'bulk',           // Header chuẩn cho transactional email
      },
    });

    const giftCardNote = giftCard ? ` + Gift Card [${giftCard.code}]` : '';
    console.log(
      `✅ [Email] Booking confirmation${giftCardNote} → To: ${booking.email} | BCC: ${adminEmail} | MsgID: ${info.messageId}`
    );

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ [Email] Failed to send booking confirmation to ${booking.email}:`, error.message);
    return { success: false, error: error.message };
  }
};


/**
 * Gửi email Gift Card độc lập đến người NHẬN THẺ (khi admin gửi gift card riêng,
 * không liên quan đến booking — ví dụ: quà tặng trực tiếp).
 *
 * @param {Object} giftCard - GiftCard document từ MongoDB
 */
export const sendGiftCardToRecipient = async (giftCard) => {
  if (!isEmailConfigured()) {
    console.warn('⚠️  [Email] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Bỏ qua gửi gift card email.');
    return { success: false, reason: 'not_configured' };
  }

  const {
    code, amount, recipientName, recipientEmail,
    senderName, senderEmail, deliveryDate, message: personalMessage,
  } = giftCard;

  const shopName     = process.env.EMAIL_FROM_NAME || 'TLaundry';
  const formattedAmt = formatCurrency(amount);
  const adminEmail   = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  // Build standalone gift card email
  const bodyContent = `
    <div style="text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#64748b;font-size:15px;">Xin chào <strong>${recipientName}</strong>! 🎁</p>
      <h2 style="margin:0;color:#1e293b;font-size:24px;font-weight:700;">Bạn vừa nhận được một món quà đặc biệt!</h2>
    </div>

    <!-- Gift Card Visual -->
    <div style="background:linear-gradient(135deg,#1a56db 0%,#7c3aed 55%,#0ea5e9 100%);border-radius:18px;padding:36px 28px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.75);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;">✨ TLaundry Gift Card ✨</p>
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.9);font-size:14px;">Dành cho <strong>${recipientName}</strong></p>
      <p style="margin:0 0 24px;color:#ffffff;font-size:52px;font-weight:800;line-height:1;">${formattedAmt}</p>
      <div style="background:rgba(255,255,255,0.12);border:2px dashed rgba(255,255,255,0.55);border-radius:12px;padding:16px 24px;display:inline-block;min-width:240px;">
        <p style="margin:0 0 6px;color:rgba(255,255,255,0.75);font-size:10px;text-transform:uppercase;letter-spacing:3px;">Mã thẻ quà tặng</p>
        <p style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:6px;font-family:monospace;">${code}</p>
      </div>
      ${deliveryDate ? `<p style="margin:16px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">📅 Hiệu lực từ: ${formatDate(deliveryDate)}</p>` : ''}
    </div>

    <!-- Lời nhắn -->
    <div style="background:#fdf4ff;border-left:4px solid #a855f7;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 6px;color:#7e22ce;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        💌 Lời nhắn từ ${senderName}
      </p>
      <p style="margin:0;color:#374151;font-size:15px;font-style:italic;line-height:1.7;">
        "${personalMessage || 'Chúc bạn luôn vui vẻ và có những bộ quần áo sạch sẽ thơm tho! 🌸'}"
      </p>
    </div>

    <!-- Hướng dẫn -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin-bottom:20px;">
      <h4 style="margin:0 0 10px;color:#166534;font-size:14px;font-weight:700;">🛍️ Cách sử dụng</h4>
      <ol style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:2.1;">
        <li>Truy cập <a href="https://tlaundry.vn" style="color:#16a34a;font-weight:600;">tlaundry.vn</a> và đặt dịch vụ.</li>
        <li>Nhập mã thẻ <strong style="color:#166534;letter-spacing:2px;">${code}</strong> tại bước thanh toán.</li>
        <li>Giá trị thẻ sẽ được khấu trừ vào tổng đơn.</li>
      </ol>
    </div>

    <div style="text-align:center;margin-bottom:8px;">
      <a href="https://tlaundry.vn/dat-lich"
         style="display:inline-block;background:linear-gradient(135deg,#1a56db,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:10px;font-size:15px;font-weight:700;">
        🧺 Dùng thẻ quà — Đặt lịch ngay
      </a>
    </div>

    <div style="border-top:1px solid #e5e7eb;margin-top:28px;padding-top:16px;">
      <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
        Thẻ tặng từ <strong>${senderName}</strong> (${senderEmail || ''}) &nbsp;·&nbsp;
        ${deliveryDate ? `Ngày giao: ${formatDate(deliveryDate)} &nbsp;·&nbsp;` : ''}
        Mã: <strong>${code}</strong>
      </p>
    </div>
  `;

  // Bỏ emoji ở đầu subject — một số spam filter phạt emoji đầu dòng
  const emailSubject = `The qua tang TLaundry tri gia ${formattedAmt} tu ${senderName}`;

  const plainText = `Xin chao ${recipientName},

${senderName} da tang ban mot the qua tu ${shopName}!

Gia tri the : ${formattedAmt}
Ma the      : ${code}
Loi nhan    : ${personalMessage || 'Chuc ban luon vui ve!'}

Cach su dung:
1. Truy cap tlaundry.vn va dat dich vu.
2. Nhap ma the '${code}' tai buoc thanh toan.
3. Gia tri the se duoc khau tru vao tong don.

Lien he ho tro: support@tlaundry.vn
${shopName} - Dich vu giat ui chuyen nghiep
`;

  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from:     FROM_ADDRESS(),
      to:       recipientEmail,
      bcc:      adminEmail,
      replyTo:  REPLY_TO(),
      subject:  emailSubject,
      text:     plainText,         // [ANTI-SPAM] Plain text bắt buộc
      html:     baseLayout(emailSubject, bodyContent),
      headers: {
        'X-Mailer':        'TLaundry Mailer 1.0',
        'X-Priority':      '3',
        'X-Entity-Ref-ID': code,
        'Precedence':      'bulk',
      },
    });

    console.log(`✅ [Email] Gift card [${code}] → To: ${recipientEmail} | BCC: ${adminEmail} | MsgID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ [Email] Failed to send gift card email to ${recipientEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};


// ──────────────────────────────────────────────────────────────────────────────
// BACKWARD COMPATIBILITY ALIASES
// (Giữ để không break code cũ trong server.js đang import 3 hàm riêng lẻ)
// TODO: Xóa sau khi đã cập nhật toàn bộ nơi gọi trong server.js
// ──────────────────────────────────────────────────────────────────────────────

/** @deprecated Dùng sendBookingConfirmation(booking) thay thế */
export const sendBookingConfirmationToCustomer = (booking) =>
  sendBookingConfirmation(booking, null);

/** @deprecated Đã gộp vào sendBookingConfirmation() qua BCC. Không cần gọi riêng nữa. */
export const sendNewBookingAlertToAdmin = async (booking) => {
  console.warn('⚠️  [Email] sendNewBookingAlertToAdmin() đã deprecated. Admin giờ nhận BCC tự động từ sendBookingConfirmation().');
};
