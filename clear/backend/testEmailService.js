/**
 * TLaundry - Email Service Test Script
 * =====================================
 * Chạy để kiểm tra email có gửi được không:
 *
 *   node testEmailService.js booking          → Test email xác nhận đơn (không gift card)
 *   node testEmailService.js booking+gift     → Test email xác nhận đơn + Gift Card kèm trong 1 mail
 *   node testEmailService.js giftcard         → Test email Gift Card độc lập cho người nhận
 *   node testEmailService.js all              → Test tất cả (2 lần gửi)
 *
 * Yêu cầu: Đã cấu hình EMAIL_USER + EMAIL_PASS trong .env
 */

import dotenv from 'dotenv';
import {
  sendBookingConfirmation,
  sendGiftCardToRecipient,
} from './services/emailService.js';

dotenv.config();

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockBooking = {
  orderCode:   'TL-889922',
  firstName:   'Nguyễn',
  lastName:    'Văn An',
  email:       process.env.TEST_EMAIL || 'thinhvatuan05@gmail.com',
  phone:       '0909 123 456',
  serviceType: 'Giặt Ủi Gia Đình',
  pickupDate:  new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày sau
  pickupTime:  'Morning (8am-12pm)',
  frequency:   'one-off',
  address:     '123 Đường Lê Lợi',
  suburb:      'Quận 1',
  state:       'TP. Hồ Chí Minh',
  notes:       'Vui lòng cẩn thận đồ len.',
  totalAmount: 250000,
};

const mockGiftCard = {
  code:           'TL-GIFT99',
  amount:         500000,
  recipientName:  'Trần Thị Bình',
  recipientEmail: process.env.TEST_EMAIL || 'thinhvatuan05@gmail.com',
  senderName:     'Lê Minh Tuấn',
  senderEmail:    'sender@gmail.com',
  deliveryDate:   new Date().toISOString(),
  message:        'Chúc mừng sinh nhật! Mong bạn luôn vui vẻ và có quần áo thơm tho mỗi ngày 🎂',
};

// ─── Runner ───────────────────────────────────────────────────────────────────

const testType = process.argv[2] || 'all';

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║       TLaundry - Email Service Test Runner         ║');
console.log('╚════════════════════════════════════════════════════╝\n');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌  EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình trong .env!');
  console.error('    Vui lòng điền Gmail + App Password vào file .env trước khi test.\n');
  process.exit(1);
}

const targetEmail = mockBooking.email;
const adminEmail  = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

console.log(`📧  Gửi từ:    ${process.env.EMAIL_USER}`);
console.log(`📩  To:        ${targetEmail}  (khách hàng)`);
console.log(`📋  BCC:       ${adminEmail}  (admin — nhận bản sao tự động)`);
console.log(`🧪  Test type: ${testType}\n`);

const run = async () => {
  // ─── Test 1: Booking không gift card ───────────────────────────────────────
  if (testType === 'booking' || testType === 'all') {
    console.log('─── [1] Xác nhận đơn giặt (không kèm gift card) ────────────────');
    console.log(`    → To: ${targetEmail} | BCC: ${adminEmail}`);
    const result = await sendBookingConfirmation(mockBooking, null);
    if (result.success) {
      console.log(`    ✅ OK — MessageID: ${result.messageId}`);
    } else {
      console.error(`    ❌ FAIL — ${result.error || result.reason}`);
    }
    console.log();
  }

  // ─── Test 2: Booking KÈM Gift Card trong cùng 1 email ──────────────────────
  if (testType === 'booking+gift' || testType === 'all') {
    console.log('─── [2] Xác nhận đơn giặt + Gift Card (cùng 1 email) ───────────');
    console.log(`    → To: ${targetEmail} | BCC: ${adminEmail}`);
    const result = await sendBookingConfirmation(mockBooking, mockGiftCard);
    if (result.success) {
      console.log(`    ✅ OK — MessageID: ${result.messageId}`);
    } else {
      console.error(`    ❌ FAIL — ${result.error || result.reason}`);
    }
    console.log();
  }

  // ─── Test 3: Gift Card độc lập (không kèm booking) ─────────────────────────
  if (testType === 'giftcard' || testType === 'all') {
    console.log('─── [3] Gift Card độc lập → người nhận ─────────────────────────');
    console.log(`    → To: ${mockGiftCard.recipientEmail} | BCC: ${adminEmail}`);
    const result = await sendGiftCardToRecipient(mockGiftCard);
    if (result.success) {
      console.log(`    ✅ OK — MessageID: ${result.messageId}`);
    } else {
      console.error(`    ❌ FAIL — ${result.error || result.reason}`);
    }
    console.log();
  }

  console.log('─────────────────────────────────────────────────────────────────');
  console.log(`✅  Test hoàn thành!\n`);
  console.log(`   📨  Kiểm tra inbox: ${targetEmail}`);
  console.log(`   📨  Kiểm tra inbox admin (BCC): ${adminEmail}`);
  console.log(`   ⚠️   Không thấy mail? Kiểm tra thư mục Spam/Junk\n`);
};

run().catch(err => {
  console.error('❌  Lỗi không mong muốn:', err.message);
  process.exit(1);
});
