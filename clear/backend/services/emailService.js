/**
 * ============================================================
 * TLaundry - Unified Email Notification Service
 * ============================================================
 * Sử dụng Nodemailer + Gmail SMTP
 *
 * Chiến lược gửi mail:
 *   - 1 email duy nhất đến KHÁCH HÀNG (To)
 *   - Admin/Chủ tiệm nhận BCC tự động — không cần gửi email riêng
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
const buildBookingPlainText = (booking) => {
  const shopName  = process.env.EMAIL_FROM_NAME || 'TLaundry';
  const fullName  = `${booking.firstName} ${booking.lastName}`;
  const addressParts = [booking.address, booking.suburb, booking.state].filter(Boolean);
  const fullAddr  = addressParts.length > 0 ? addressParts.join(', ') : booking.address;
  const isExpress = booking.deliverySpeed === 'express';
  const speedLabel = isExpress ? `Giao hang cap toc 4h-6h (+${formatCurrency(booking.expressFee || 30000)})` : 'Giao tieu chuan (24h - Mien phi)';

  let text =
`Xin chao ${fullName},

Don giat cua ban da duoc ${shopName} tiep nhan thanh cong.

==================================================
MA DON HANG: ${booking.orderCode}
==================================================

CHI TIET DON HANG:
- Khach hang       : ${fullName}
- Dich vu          : ${booking.serviceType || 'Giat Ui Gia Dinh'}
- Mau nuoc giat    : ${booking.detergent || 'Organic Sinh Hoc (Eco-Friendly)'}
- Nuoc xa vai      : ${booking.softener || 'Huong Oai Huong (Lavender)'}
- Phuong thuc giao : ${speedLabel}
- Dia chi nhan     : ${fullAddr}
- Dien thoai       : ${booking.phone}${booking.totalAmount ? `
- Tong tien        : ${formatCurrency(booking.totalAmount)}` : ''}${booking.notes ? `
- Ghi chu          : ${booking.notes}` : ''}

QUY TRINH TIEP THEO:
1. Nhan vien se lien he va den lay do theo yeu cau.
2. Ban nhan thong bao khi do duoc giat theo tieu chuan cao cap.
3. Do sach thom duoc giao tra tan noi theo dung phuong thuc da chon.
`;

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
    address, suburb, state, notes, frequency, totalAmount,
    detergent, softener, deliverySpeed, expressFee
  } = booking;

  const fullName   = `${firstName} ${lastName}`;
  const addressParts = [address, suburb, state].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : address;

  const infoRow = (label, value) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;width:45%;vertical-align:top;">${label}</td>
      <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;font-weight:600;vertical-align:top;">${value || '—'}</td>
    </tr>
  `;

  const isExpress = deliverySpeed === 'express';
  const deliveryLabel = isExpress 
    ? `<span style="color:#d97706;font-weight:700;">⚡ Hỏa tốc 4h-6h (+${formatCurrency(expressFee || 30000)})</span>`
    : '🚚 Tiêu chuẩn 24h (Miễn phí)';

  return `
    <!-- PHẦN 2: CHI TIẾT ĐƠN HÀNG -->
    <h3 style="margin:0 0 14px;color:#374151;font-size:16px;font-weight:700;">📋 Chi tiết đơn hàng</h3>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${infoRow('👤 Khách hàng', fullName)}
      ${infoRow('📱 Số điện thoại', phone)}
      ${infoRow('🧺 Dịch vụ', serviceType || 'Giặt Ủi Gia Đình')}
      ${infoRow('🌿 Nước giặt', detergent || 'Organic Sinh Học')}
      ${infoRow('🌸 Nước xả', softener || 'Hương Oải Hương (Lavender)')}
      ${infoRow('🚀 Giao nhận', deliveryLabel)}
      ${infoRow('📍 Địa chỉ nhận', fullAddress)}
      ${totalAmount ? infoRow('💰 Tổng tiền', formatCurrency(totalAmount)) : ''}
      ${notes ? infoRow('📝 Ghi chú', notes) : ''}
    </table>

    <!-- Quy trình -->
    <div style="background:#f8fafc;border-radius:12px;padding:20px;">
      <h3 style="margin:0 0 14px;color:#374151;font-size:14px;font-weight:700;">🚀 Quy trình tiếp theo</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#069494;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">1</div>
          </td>
          <td style="padding:0 0 10px 10px;color:#4b5563;font-size:14px;line-height:1.5;">
            Nhân viên sẽ liên hệ và đến nhận đồ tại địa chỉ đã cung cấp.
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#069494;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">2</div>
          </td>
          <td style="padding:0 0 10px 10px;color:#4b5563;font-size:14px;line-height:1.5;">
            Đồ được phân loại, giặt sấy riêng biệt với mẫu nước giặt xả bạn đã chọn.
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#069494;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">3</div>
          </td>
          <td style="padding:0 0 0 10px;color:#4b5563;font-size:14px;line-height:1.5;">
            Quần áo thơm tho, gấp phẳng phiu và giao trả tận tay đúng hẹn.
          </td>
        </tr>
      </table>
    </div>
  `;
};

// ─── Build HTML hoàn chỉnh ────────────────────────────────────────────────────
/**
 * Tạo nội dung HTML xác nhận đơn hàng
 * @param {Object} booking - Booking document
 */
const buildUnifiedEmailHtml = (booking) => {
  const shopName = process.env.EMAIL_FROM_NAME || 'TLaundry';
  const subject = `${shopName} - Xác nhận đơn hàng #${booking.orderCode}`;

  const part1 = buildPart1_Greeting(booking);
  const part2 = buildPart2_OrderDetail(booking);

  const bodyContent = `
    ${part1}
    ${sectionDivider()}
    ${part2}
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
 *   - To   → Email khách hàng (xác nhận đặt lịch)
 *   - BCC  → Admin/Chủ tiệm (tự động nhận bản sao, không cần email riêng)
 *
 * @param {Object} booking - Booking document từ MongoDB
 */
export const sendBookingConfirmation = async (booking) => {
  if (!isEmailConfigured()) {
    console.warn('⚠️  [Email] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Bỏ qua gửi email.');
    return { success: false, reason: 'not_configured' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const { html, subject } = buildUnifiedEmailHtml(booking);

  try {
    const transporter = createTransporter();
    const plainText  = buildBookingPlainText(booking);

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

    console.log(
      `✅ [Email] Booking confirmation → To: ${booking.email} | BCC: ${adminEmail} | MsgID: ${info.messageId}`
    );

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ [Email] Failed to send booking confirmation to ${booking.email}:`, error.message);
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
