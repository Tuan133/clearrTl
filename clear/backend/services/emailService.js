/**
 * ============================================================
 * TLaundry - Email Notification Service
 * ============================================================
 * Sử dụng Nodemailer + Gmail SMTP
 *
 * Biến môi trường cần thiết trong .env:
 *   EMAIL_HOST      = smtp.gmail.com
 *   EMAIL_PORT      = 587
 *   EMAIL_USER      = your-gmail@gmail.com
 *   EMAIL_PASS      = xxxx xxxx xxxx xxxx  (Gmail App Password 16 ký tự)
 *   EMAIL_FROM_NAME = TLaundry
 *   ADMIN_EMAIL     = admin@yourdomain.com
 * ============================================================
 */

import nodemailer from 'nodemailer';

// ─── Khởi tạo Transporter ────────────────────────────────────────────────────
const createTransporter = () => {
  const debugMode = process.env.EMAIL_DEBUG === 'true';
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // TLS (STARTTLS) — không dùng SSL port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Bỏ qua lỗi TLS certificate trong môi trường dev
    },
    debug: debugMode,
    logger: debugMode,
  });
};

// ─── Helper: Tên người gửi hiển thị ─────────────────────────────────────────
const FROM_ADDRESS = () =>
  `"${process.env.EMAIL_FROM_NAME || 'TLaundry'}" <${process.env.EMAIL_USER}>`;

// ─── Helper: Kiểm tra email service có được cấu hình không ─────────────────
const isEmailConfigured = () =>
  !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

// ─── Helper: Format ngày giờ Việt Nam ────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return 'Chưa xác định';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // Trả nguyên nếu không parse được
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ─── Helper: Format tiền tệ VND ──────────────────────────────────────────────
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Chưa xác định';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// ─── HTML Base Layout ─────────────────────────────────────────────────────────
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

          <!-- Header -->
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

// ══════════════════════════════════════════════════════════════════════════════
// EMAIL 1: Xác nhận đơn giặt → Gửi cho KHÁCH HÀNG
// ══════════════════════════════════════════════════════════════════════════════
const buildBookingConfirmationHtml = (booking) => {
  const {
    orderCode, firstName, lastName, email,
    serviceType, pickupDate, pickupTime,
    address, suburb, state, phone, notes, frequency
  } = booking;

  const fullName = `${firstName} ${lastName}`;
  const fullAddress = `${address}, ${suburb}, ${state}`;

  const statusBadge = `
    <span style="display:inline-block;background:#dcfce7;color:#166534;padding:4px 14px;border-radius:9999px;font-size:13px;font-weight:600;">
      ✅ Đã tiếp nhận
    </span>
  `;

  const infoRow = (label, value) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;width:45%;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;font-weight:600;">${value || '—'}</td>
    </tr>
  `;

  const body = `
    <h2 style="margin:0 0 4px;color:#1e293b;font-size:22px;font-weight:700;">Xác nhận đặt lịch thành công! 🎉</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;">Xin chào <strong>${fullName}</strong>, đơn giặt của bạn đã được tiếp nhận.</p>

    <!-- Order Code Box -->
    <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;color:#1d4ed8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Mã đơn hàng của bạn</p>
      <p style="margin:0;color:#1e40af;font-size:32px;font-weight:800;letter-spacing:4px;">${orderCode}</p>
      <p style="margin:8px 0 0;color:#3b82f6;font-size:12px;">Dùng mã này để theo dõi đơn tại website</p>
    </div>

    ${statusBadge}

    <!-- Chi tiết đơn hàng -->
    <h3 style="margin:24px 0 12px;color:#374151;font-size:16px;font-weight:600;">📋 Chi tiết lịch hẹn</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${infoRow('👤 Khách hàng', fullName)}
      ${infoRow('📱 Số điện thoại', phone)}
      ${infoRow('🧺 Dịch vụ', serviceType)}
      ${infoRow('📅 Ngày lấy đồ', formatDate(pickupDate))}
      ${infoRow('🕐 Khung giờ', pickupTime || 'Buổi sáng (8am-12pm)')}
      ${infoRow('🔄 Tần suất', frequency === 'weekly' ? 'Hàng tuần' : frequency === 'fortnightly' ? 'Hai tuần một lần' : 'Một lần')}
      ${infoRow('📍 Địa chỉ lấy đồ', fullAddress)}
      ${notes ? infoRow('📝 Ghi chú', notes) : ''}
    </table>

    <!-- Các bước tiếp theo -->
    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-top:28px;">
      <h3 style="margin:0 0 14px;color:#374151;font-size:15px;font-weight:600;">🚀 Bước tiếp theo</h3>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="color:#4b5563;font-size:14px;line-height:1.5;">
          <span style="color:#1a56db;font-weight:700;">1.</span> Nhân viên sẽ đến lấy đồ đúng khung giờ đã chọn.
        </div>
        <div style="color:#4b5563;font-size:14px;line-height:1.5;">
          <span style="color:#1a56db;font-weight:700;">2.</span> Bạn nhận được thông báo khi đồ được đưa vào giặt.
        </div>
        <div style="color:#4b5563;font-size:14px;line-height:1.5;">
          <span style="color:#1a56db;font-weight:700;">3.</span> Đồ sạch được giao trả tại địa chỉ của bạn.
        </div>
      </div>
    </div>

    <p style="margin:24px 0 0;color:#64748b;font-size:13px;text-align:center;">
      Có thắc mắc? Liên hệ chúng tôi qua <a href="mailto:support@tlaundry.vn" style="color:#1a56db;">support@tlaundry.vn</a>
    </p>
  `;

  return baseLayout(`Xác nhận đơn hàng ${orderCode} - TLaundry`, body);
};

// ══════════════════════════════════════════════════════════════════════════════
// EMAIL 2: Thông báo đơn mới → Gửi cho ADMIN/CHỦ CỬA HÀNG
// ══════════════════════════════════════════════════════════════════════════════
const buildAdminAlertHtml = (booking) => {
  const {
    orderCode, firstName, lastName, email, phone,
    serviceType, pickupDate, pickupTime,
    address, suburb, state, notes, frequency
  } = booking;

  const fullName = `${firstName} ${lastName}`;
  const fullAddress = `${address}, ${suburb}, ${state}`;

  const alertRow = (icon, label, value) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#6b7280;font-size:13px;white-space:nowrap;">
        ${icon} ${label}
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#111827;font-size:14px;font-weight:600;">
        ${value || '—'}
      </td>
    </tr>
  `;

  const body = `
    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:10px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:28px;">🔔</span>
      <div>
        <p style="margin:0;color:#92400e;font-size:16px;font-weight:700;">Đơn giặt mới vừa được đặt!</p>
        <p style="margin:4px 0 0;color:#b45309;font-size:13px;">Vui lòng xác nhận và sắp xếp lịch lấy đồ.</p>
      </div>
    </div>

    <div style="background:#eff6ff;border-radius:10px;padding:12px 20px;margin-bottom:20px;text-align:center;">
      <p style="margin:0;color:#1d4ed8;font-size:13px;">Mã đơn hàng</p>
      <p style="margin:4px 0 0;color:#1e40af;font-size:26px;font-weight:800;letter-spacing:3px;">${orderCode}</p>
    </div>

    <h3 style="margin:0 0 12px;color:#374151;font-size:15px;font-weight:600;">👤 Thông tin khách hàng</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;overflow:hidden;margin-bottom:20px;">
      ${alertRow('👤', 'Tên khách', fullName)}
      ${alertRow('📧', 'Email', email)}
      ${alertRow('📱', 'SĐT', phone)}
      ${alertRow('📍', 'Địa chỉ', fullAddress)}
    </table>

    <h3 style="margin:0 0 12px;color:#374151;font-size:15px;font-weight:600;">🧺 Chi tiết dịch vụ</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;overflow:hidden;margin-bottom:20px;">
      ${alertRow('🧺', 'Dịch vụ', serviceType)}
      ${alertRow('📅', 'Ngày lấy', formatDate(pickupDate))}
      ${alertRow('🕐', 'Khung giờ', pickupTime || 'Buổi sáng (8am-12pm)')}
      ${alertRow('🔄', 'Tần suất', frequency === 'weekly' ? 'Hàng tuần' : frequency === 'fortnightly' ? 'Hai tuần một lần' : 'Một lần')}
      ${notes ? alertRow('📝', 'Ghi chú', notes) : ''}
    </table>

    <p style="margin:0;color:#6b7280;font-size:12px;text-align:center;">
      Email này được gửi tự động từ hệ thống TLaundry lúc ${new Date().toLocaleString('vi-VN')}.
    </p>
  `;

  return baseLayout(`[Đơn mới] ${orderCode} - ${fullName}`, body);
};

// ══════════════════════════════════════════════════════════════════════════════
// EMAIL 3: Gửi Gift Card → Gửi cho NGƯỜI NHẬN THẺ QUÀ TẶNG
// ══════════════════════════════════════════════════════════════════════════════
const buildGiftCardHtml = (giftCard) => {
  const {
    code, amount, recipientName, recipientEmail,
    senderName, senderEmail, deliveryDate, message: personalMessage
  } = giftCard;

  const formattedAmount = formatCurrency(amount);

  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#64748b;font-size:15px;">Xin chào <strong>${recipientName}</strong>! 🎁</p>
      <h2 style="margin:0;color:#1e293b;font-size:24px;font-weight:700;">Bạn vừa nhận được một món quà!</h2>
    </div>

    <!-- Gift Card Visual -->
    <div style="background:linear-gradient(135deg,#1a56db 0%,#7c3aed 50%,#0ea5e9 100%);border-radius:16px;padding:32px;text-align:center;margin-bottom:28px;position:relative;overflow:hidden;">
      <div style="position:relative;z-index:1;">
        <p style="margin:0 0 4px;color:rgba(255,255,255,0.8);font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:2px;">TLaundry Gift Card</p>
        <p style="margin:0 0 20px;color:#ffffff;font-size:48px;font-weight:800;">${formattedAmount}</p>
        <div style="background:rgba(255,255,255,0.15);border:2px dashed rgba(255,255,255,0.5);border-radius:10px;padding:14px 24px;display:inline-block;">
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.8);font-size:11px;text-transform:uppercase;letter-spacing:2px;">Mã thẻ quà tặng</p>
          <p style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:4px;font-family:monospace;">${code}</p>
        </div>
      </div>
    </div>

    <!-- Lời nhắn cá nhân -->
    ${personalMessage ? `
    <div style="background:#fdf4ff;border-left:4px solid #a855f7;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#7e22ce;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">💌 Lời nhắn từ ${senderName}</p>
      <p style="margin:0;color:#374151;font-size:15px;font-style:italic;line-height:1.6;">"${personalMessage}"</p>
    </div>
    ` : `
    <div style="background:#fdf4ff;border-left:4px solid #a855f7;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#7e22ce;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">💌 Từ ${senderName}</p>
      <p style="margin:0;color:#374151;font-size:15px;font-style:italic;line-height:1.6;">"Chúc bạn luôn vui vẻ và có những bộ quần áo sạch sẽ thơm tho! 🌸"</p>
    </div>
    `}

    <!-- Hướng dẫn sử dụng -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
      <h3 style="margin:0 0 12px;color:#166534;font-size:15px;font-weight:600;">🛍️ Cách sử dụng thẻ quà tặng</h3>
      <ol style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:2;">
        <li>Truy cập <a href="https://tlaundry.vn" style="color:#16a34a;">tlaundry.vn</a> và đặt dịch vụ giặt ủi.</li>
        <li>Tại bước thanh toán, nhập mã thẻ: <strong style="color:#166534;letter-spacing:2px;">${code}</strong></li>
        <li>Giá trị thẻ sẽ được trừ vào tổng đơn hàng của bạn.</li>
      </ol>
    </div>

    <div style="text-align:center;">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr>
          <td style="background:linear-gradient(135deg,#1a56db,#0ea5e9);border-radius:10px;padding:1px;">
            <a href="https://tlaundry.vn/dat-lich"
               style="display:inline-block;background:linear-gradient(135deg,#1a56db,#0ea5e9);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:9px;font-size:15px;font-weight:700;">
              🧺 Đặt dịch vụ ngay
            </a>
          </td>
        </tr>
      </table>
    </div>

    <div style="border-top:1px solid #e5e7eb;margin-top:28px;padding-top:16px;">
      <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
        Thẻ được gửi bởi <strong>${senderName}</strong> (${senderEmail}) &nbsp;·&nbsp;
        Ngày giao: ${formatDate(deliveryDate)} &nbsp;·&nbsp;
        Mã thẻ: <strong>${code}</strong>
      </p>
    </div>
  `;

  return baseLayout(`🎁 Thẻ quà tặng TLaundry từ ${senderName}`, body);
};


// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC API - Các hàm được export để dùng trong server.js
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Gửi email xác nhận đặt lịch thành công cho KHÁCH HÀNG
 * @param {Object} booking - Booking document từ MongoDB
 */
export const sendBookingConfirmationToCustomer = async (booking) => {
  if (!isEmailConfigured()) {
    console.warn('⚠️  [Email] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Bỏ qua gửi email xác nhận.');
    return;
  }

  try {
    const transporter = createTransporter();
    const html = buildBookingConfirmationHtml(booking);

    const info = await transporter.sendMail({
      from: FROM_ADDRESS(),
      to: booking.email,
      subject: `✅ Đặt lịch thành công - Mã đơn ${booking.orderCode} | TLaundry`,
      html,
    });

    console.log(`✅ [Email] Booking confirmation sent to ${booking.email} | MessageID: ${info.messageId}`);
  } catch (error) {
    // Không throw — chỉ log warning để không block API
    console.error(`❌ [Email] Failed to send booking confirmation to ${booking.email}:`, error.message);
  }
};

/**
 * Gửi email thông báo đơn giặt mới cho ADMIN / CHỦ CỬA HÀNG
 * @param {Object} booking - Booking document từ MongoDB
 */
export const sendNewBookingAlertToAdmin = async (booking) => {
  if (!isEmailConfigured()) {
    console.warn('⚠️  [Email] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Bỏ qua gửi email admin alert.');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  try {
    const transporter = createTransporter();
    const html = buildAdminAlertHtml(booking);

    const info = await transporter.sendMail({
      from: FROM_ADDRESS(),
      to: adminEmail,
      subject: `🔔 [Đơn mới] ${booking.orderCode} - ${booking.firstName} ${booking.lastName} | TLaundry`,
      html,
    });

    console.log(`✅ [Email] Admin alert sent to ${adminEmail} | MessageID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ [Email] Failed to send admin alert:`, error.message);
  }
};

/**
 * Gửi email Gift Card kèm mã thẻ và lời chúc cho NGƯỜI NHẬN
 * @param {Object} giftCard - GiftCard document từ MongoDB
 */
export const sendGiftCardToRecipient = async (giftCard) => {
  if (!isEmailConfigured()) {
    console.warn('⚠️  [Email] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình. Bỏ qua gửi email gift card.');
    return;
  }

  try {
    const transporter = createTransporter();
    const html = buildGiftCardHtml(giftCard);

    const info = await transporter.sendMail({
      from: FROM_ADDRESS(),
      to: giftCard.recipientEmail,
      subject: `🎁 ${giftCard.senderName} đã tặng bạn một thẻ quà TLaundry!`,
      html,
    });

    console.log(`✅ [Email] Gift card sent to ${giftCard.recipientEmail} | Code: ${giftCard.code} | MessageID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ [Email] Failed to send gift card email to ${giftCard.recipientEmail}:`, error.message);
  }
};
