/**
 * ============================================================
 * TLaundry - Unified Email Notification Service
 * ============================================================
 * Sử dụng Nodemailer + Gmail SMTP qua Port 465 (SSL an toàn & ổn định cao)
 *
 * Chiến lược gửi mail:
 *   - 1 email duy nhất đến KHÁCH HÀNG (To)
 *   - Admin/Chủ tiệm nhận BCC tự động — không cần gửi email riêng
 *
 * Biến môi trường cần thiết trong .env:
 *   EMAIL_HOST      = smtp.gmail.com
 *   EMAIL_PORT      = 465 (SSL)
 *   EMAIL_USER      = your-gmail@gmail.com
 *   EMAIL_PASS      = xxxx xxxx xxxx xxxx  (Gmail App Password 16 ký tự)
 *   EMAIL_FROM_NAME = TLaundry
 *   ADMIN_EMAIL     = admin@yourdomain.com
 *   CLIENT_URL      = http://localhost:5173
 *   EMAIL_DEBUG     = false
 * ============================================================
 */

import nodemailer from 'nodemailer';
import net from 'net';

// ─── Khởi tạo Transporter (Port 465 SSL chuyên dụng cho Gmail) ───────────────
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT) || 465;
  const isSecure = port === 465;
  const debugMode = process.env.EMAIL_DEBUG === 'true';
  const cleanPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: isSecure, // 465: true (SSL), 587: false (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: true, // Bảo mật tránh tấn công MITM (khắc phục M-03)
    },
    // Trực tiếp kết nối socket IPv4 tránh lỗi treo DNS/IPv6 của Node.js trên Windows (kết nối chỉ mất 0.1s)
    getSocket(options, callback) {
      const socket = net.connect({
        port: options.port,
        host: options.host,
        family: 4, // Ép buộc IPv4 để gửi tức thì trong 3s
      }, () => {
        callback(null, { connection: socket });
      });
      socket.on('error', (err) => callback(err));
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    debug: debugMode,
    logger: debugMode,
  });
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const FROM_ADDRESS = () =>
  `"${process.env.EMAIL_FROM_NAME || 'TLaundry'} - Giặt Ủi Chuyên Nghiệp" <${process.env.EMAIL_USER}>`;

// Khớp với EMAIL_USER để SPF, DKIM và DMARC đạt điểm tối đa (tránh rơi vào Spam)
const REPLY_TO = () =>
  process.env.EMAIL_USER;

const isEmailConfigured = () =>
  !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const escapeHtml = (unsafe) => {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Chưa xác định';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Tạo bản plain text từ dữ liệu yêu cầu báo giá — bắt buộc để chống spam filter
 */
const buildBookingPlainText = (booking) => {
  const shopName  = process.env.EMAIL_FROM_NAME || 'TLaundry';
  const fullName  = `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'Quý khách';
  const addressParts = [booking.address, booking.suburb, booking.state].filter(Boolean);
  const fullAddr  = addressParts.length > 0 ? addressParts.join(', ') : (booking.address || 'Chưa cung cấp');
  const isExpress = booking.deliverySpeed === 'express';
  const speedLabel = isExpress 
    ? `Giao hang cap toc 4h-6h (+${formatCurrency(booking.expressFee || 30000)})` 
    : (booking.deliverySpeed === 'scheduled' ? 'Dat giao sau (Theo lich hen)' : 'Giao tieu chuan (24h - Mien phi)');

  let text =
`Xin chao ${fullName},

Cam on ban da gui yeu cau bao gia tai ${shopName}. Yeu cau cua ban da duoc he thong ghi nhan thanh cong!

==================================================
MA DON HANG / YEU CAU BAO GIA: ${booking.orderCode}
==================================================

THONG TIN CHI TIET:
- Khach hang       : ${fullName}
- Email            : ${booking.email}
- So dien thoai    : ${booking.phone || 'Chua cung cap'}
- Dich vu          : ${booking.serviceType || 'Giat Ui Gia Dinh'}
- Nuoc giat / bot  : ${booking.detergent || 'Organic Sinh Hoc (Eco-Friendly)'}
- Nuoc xa vai      : ${booking.softener || 'Huong Oai Huong (Lavender)'}
- Phuong thuc giao : ${speedLabel}
- Dia chi nhan     : ${fullAddr}${booking.notes ? `
- Ghi chu them     : ${booking.notes}` : ''}

QUY TRINH TIEP THEO:
1. Doi ngu TLaundry se xem xet va lien he lai trong vong 2 gio kem bao gia ca nhan hoa.
2. Xac nhan thoi gian lay do tan noi theo lich ban da chon.
3. Do duoc giat say chuyen nghiep va giao tra tan tay sach thom, phang phiu.

--------------------------------------------------
Lien he ho tro: ${process.env.ADMIN_EMAIL || 'support@tlaundry.vn'} | Hotline: 0909 000 000
${shopName} - Dich vu giat ui & cham soc quan ao chuyen nghiep
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
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0fdfa;font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.04);border:1px solid #ccfbf1;">

          <!-- Header Brand (Teal Gradient theo phong cách TLaundry) -->
          <tr>
            <td style="background:linear-gradient(135deg,#006766 0%,#0d9488 100%);padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.18);border-radius:50%;padding:14px;margin-bottom:12px;backdrop-filter:blur(4px);">
                <span style="font-size:34px;line-height:1;">🫧</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">TLaundry</h1>
              <p style="margin:6px 0 0;color:#ccfbf1;font-size:13px;font-weight:500;">Dịch vụ giặt ủi & chăm sóc vải chuyên nghiệp</p>
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
              <p style="margin:0 0 6px;color:#64748b;font-size:12px;font-weight:600;">© 2026 TLaundry. Tất cả quyền được bảo lưu.</p>
              <p style="margin:0 0 8px;color:#94a3b8;font-size:11px;line-height:1.5;">
                Bạn nhận được email này vì đã gửi yêu cầu báo giá dịch vụ giặt ủi tại website TLaundry.<br/>
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua thư.
              </p>
              <p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.6;">
                📍 123 Đường Giặt Ủi, Quận 1, TP.HCM &nbsp;|&nbsp; 
                📞 Hotline: 0909 000 000 &nbsp;|&nbsp; 
                ✉️ <a href="mailto:${escapeHtml(REPLY_TO())}" style="color:#0d9488;text-decoration:none;">${escapeHtml(REPLY_TO())}</a>
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
  `<hr style="border:none;border-top:1px dashed #cbd5e1;margin:32px 0;" />`;

// ─── Nội dung Email Báo Giá ──────────────────────────────────────────────────
const buildQuoteEmailContent = (booking) => {
  const fullName = `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'Quý khách';
  const orderCode = booking.orderCode || 'TL-000000';
  const addressParts = [booking.address, booking.suburb, booking.state].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (booking.address || '—');
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

  const isExpress = booking.deliverySpeed === 'express';
  const isScheduled = booking.deliverySpeed === 'scheduled';
  let deliveryLabel = '🚚 Tiêu chuẩn 24h (Miễn phí)';
  if (isExpress) {
    deliveryLabel = `<span style="color:#d97706;font-weight:700;">⚡ Hỏa tốc 4h-6h (+${formatCurrency(booking.expressFee || 30000)})</span>`;
  } else if (isScheduled) {
    deliveryLabel = '⏰ Đặt giao sau (Theo lịch hẹn) (Miễn phí)';
  }

  const infoRow = (label, value) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;width:40%;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;font-weight:600;vertical-align:top;">${value || '—'}</td>
    </tr>
  `;

  return `
    <!-- Lời chào & Tiêu đề -->
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;padding:5px 16px;border-radius:9999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
        ✓ Yêu Cầu Báo Giá Đã Tiếp Nhận
      </span>
      <h2 style="margin:0 0 8px;color:#0f766e;font-size:22px;font-weight:800;">Xác Nhận Yêu Cầu Báo Giá 🎉</h2>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
        Xin chào <strong>${escapeHtml(fullName)}</strong>,<br/>
        Cảm ơn bạn đã tin tưởng dịch vụ TLaundry. Đội ngũ chuyên viên sẽ liên hệ lại trong vòng <strong>2 giờ</strong> kèm báo giá chi tiết và hướng dẫn nhận đồ.
      </p>
    </div>

    <!-- Hộp hiển thị mã đơn hàng / mã báo giá -->
    <div style="background:linear-gradient(135deg,#f0fdfa,#ccfbf1);border:2px solid #99f6e4;border-radius:14px;padding:20px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;color:#0d9488;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Mã Đơn / Yêu Cầu Báo Giá</p>
      <p style="margin:0;color:#0f766e;font-size:32px;font-weight:800;letter-spacing:4px;font-family:monospace;">${escapeHtml(orderCode)}</p>
      <p style="margin:8px 0 0;color:#047857;font-size:12px;">Dùng mã này để tra cứu trực tuyến tiến độ đơn giặt</p>
    </div>

    <!-- Bảng chi tiết yêu cầu -->
    <h3 style="margin:0 0 14px;color:#1e293b;font-size:15px;font-weight:700;display:flex;align-items:center;">
      📋 Chi tiết thông tin đã đăng ký
    </h3>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow('👤 Khách hàng', escapeHtml(fullName))}
      ${infoRow('✉️ Email nhận tin', escapeHtml(booking.email))}
      ${infoRow('📱 Số điện thoại', escapeHtml(booking.phone))}
      ${infoRow('🧺 Dịch vụ chọn', escapeHtml(booking.serviceType || 'Giặt Ủi Gia Đình'))}
      ${infoRow('🌿 Nước giặt', escapeHtml(booking.detergent || 'Organic Sinh Học (Eco-Friendly)'))}
      ${infoRow('🌸 Nước xả vải', escapeHtml(booking.softener || 'Hương Oải Hương (Lavender)'))}
      ${infoRow('🚀 Giao nhận', deliveryLabel)}
      ${infoRow('📍 Địa chỉ nhận đồ', escapeHtml(fullAddress))}
      ${booking.notes ? infoRow('📝 Ghi chú', escapeHtml(booking.notes)) : ''}
    </table>

    <!-- Nút tra cứu nhanh đơn hàng -->
    <div style="text-align:center;margin:24px 0 32px;">
      <a href="${clientUrl}/track-order?code=${encodeURIComponent(orderCode)}" 
         style="display:inline-block;background:linear-gradient(135deg,#006766 0%,#0d9488 100%);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;box-shadow:0 4px 12px rgba(13,148,136,0.35);">
        🔍 Tra Cứu Tiến Độ Đơn Hàng #${escapeHtml(orderCode)}
      </a>
    </div>

    ${sectionDivider()}

    <!-- Quy trình 3 bước tiếp theo -->
    <div style="background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
      <h3 style="margin:0 0 14px;color:#334155;font-size:14px;font-weight:700;">🚀 Quy trình tiếp theo tại TLaundry</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#0d9488;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">1</div>
          </td>
          <td style="padding:0 0 12px 10px;color:#475569;font-size:13px;line-height:1.5;">
            <strong>Liên hệ & Báo giá chi tiết:</strong> Nhân viên tư vấn xem xét số lượng đồ và gửi bảng giá chính xác trong vòng 2 giờ.
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#0d9488;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">2</div>
          </td>
          <td style="padding:0 0 12px 10px;color:#475569;font-size:13px;line-height:1.5;">
            <strong>Lấy đồ tận nhà:</strong> Shipper đến địa chỉ của bạn nhận đồ đúng theo khung giờ và địa điểm đã đăng ký.
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;padding-top:2px;">
            <div style="width:24px;height:24px;background:#0d9488;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:700;">3</div>
          </td>
          <td style="padding:0 0 0 10px;color:#475569;font-size:13px;line-height:1.5;">
            <strong>Giặt sạch & Giao đồ thơm tho:</strong> Đồ được giặt sấy theo tiêu chuẩn riêng biệt, gấp gọn gàng và giao lại đúng hẹn.
          </td>
        </tr>
      </table>
    </div>
  `;
};

// ─── Build HTML hoàn chỉnh ────────────────────────────────────────────────────
const buildUnifiedEmailHtml = (booking) => {
  const shopName = process.env.EMAIL_FROM_NAME || 'TLaundry';
  const orderCode = booking.orderCode || 'TL-000000';
  // Không dùng [brackets] trong subject — trigger spam filter
  const subject = `${shopName}: Xác nhận yêu cầu báo giá #${orderCode}`;

  const bodyContent = buildQuoteEmailContent(booking);
  return { html: baseLayout(subject, bodyContent), subject };
};

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Gửi 1 email duy nhất xác nhận yêu cầu báo giá:
 *   - To   → Email khách hàng (tự động nhận email báo giá)
 *   - BCC  → Admin/Chủ tiệm (tự động nhận bản sao)
 *
 * @param {Object} booking - Booking document từ MongoDB hoặc form payload
 */
export const sendBookingConfirmation = async (booking) => {
  if (!isEmailConfigured()) {
    console.warn('⚠️  [Email] EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình trong .env. Bỏ qua gửi email.');
    return { success: false, reason: 'not_configured' };
  }

  if (!booking || !booking.email) {
    console.warn('⚠️  [Email] Không có email người nhận. Bỏ qua.');
    return { success: false, reason: 'missing_recipient_email' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const { html, subject } = buildUnifiedEmailHtml(booking);

  try {
    const transporter = createTransporter();
    const plainText  = buildBookingPlainText(booking);

    const adminEmailForUnsubscribe = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const mailOptions = {
      from:     FROM_ADDRESS(),
      to:       booking.email,     // Email khách hàng
      replyTo:  REPLY_TO(),        // Khách bấm Reply sẽ gửi về hộp thư admin
      subject,
      text:     plainText,         // [ANTI-SPAM] Plain text bắt buộc — tăng điểm deliverability
      html,
      headers: {
        // List-Unsubscribe giúp Gmail nhận diện là transactional mail hợp lệ, KHÔNG phải spam
        'List-Unsubscribe': `<mailto:${adminEmailForUnsubscribe}?subject=Unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        // Priority cao — email giao dịch quan trọng
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        // Message-ID rõ ràng — chống bị nhầm là bulk mail
        'X-Mailer': 'TLaundry Transactional Mailer v1.0',
      },
    };

    // Thêm BCC admin nếu admin email khác email khách
    if (adminEmail && adminEmail.toLowerCase() !== booking.email.toLowerCase()) {
      mailOptions.bcc = adminEmail;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `✅ [Email] Gửi email báo giá thành công → To: ${booking.email} | MsgID: ${info.messageId}`
    );

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ [Email] Gửi email thất bại tới ${booking.email}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Alias chuyên biệt cho yêu cầu báo giá
export const sendQuoteConfirmation = sendBookingConfirmation;

// ──────────────────────────────────────────────────────────────────────────────
// BACKWARD COMPATIBILITY ALIASES
// ──────────────────────────────────────────────────────────────────────────────
export const sendBookingConfirmationToCustomer = (booking) =>
  sendBookingConfirmation(booking);

export const sendNewBookingAlertToAdmin = async () => {
  console.warn('ℹ️  [Email] Admin nhận BCC tự động từ sendBookingConfirmation().');
};
