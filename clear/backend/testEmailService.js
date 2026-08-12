/**
 * TLaundry - Email Service Test Script
 * =====================================
 * Chạy để kiểm tra 3 loại email có gửi được không:
 *   node testEmailService.js booking    → Test email xác nhận đơn
 *   node testEmailService.js admin      → Test email báo admin đơn mới
 *   node testEmailService.js giftcard   → Test email gift card
 *   node testEmailService.js all        → Test tất cả
 *
 * Yêu cầu: Đã cấu hình EMAIL_USER + EMAIL_PASS trong .env
 */

import dotenv from 'dotenv';
import {
  sendBookingConfirmationToCustomer,
  sendNewBookingAlertToAdmin,
  sendGiftCardToRecipient
} from './services/emailService.js';

dotenv.config();

// ─── Mock data để test ────────────────────────────────────────────────────────

const mockBooking = {
  orderCode: 'TL-889922',
  firstName: 'Nguyễn',
  lastName: 'Văn An',
  email: 'thinhvatuan05@gmail.com', // Email nhận xác nhận đơn
  phone: '0909 123 456',
  serviceType: 'Giặt Ủi Gia Đình',
  pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày sau
  pickupTime: 'Morning (8am-12pm)',
  frequency: 'one-off',
  address: '123 Đường Lê Lợi',
  suburb: 'Quận 1',
  state: 'TP. Hồ Chí Minh',
  notes: 'Vui lòng cẩn thận đồ len.',
};

const mockGiftCard = {
  code: 'TL-GIFT99',
  amount: 500000,
  recipientName: 'Trần Thị Bình',
  recipientEmail: 'thinhvatuan05@gmail.com', // Email người nhận gift card
  senderName: 'Lê Minh Tuấn',
  senderEmail: 'sender@gmail.com',
  deliveryDate: new Date().toISOString(),
  message: 'Chúc mừng sinh nhật! Mong bạn luôn vui vẻ và có quần áo thơm tho mỗi ngày 🎂',
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

console.log(`📧  Gửi từ:    ${process.env.EMAIL_USER}`);
console.log(`📩  Admin to:  ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}`);
console.log(`🧪  Test type: ${testType}\n`);

const run = async () => {
  if (testType === 'booking' || testType === 'all') {
    console.log('─── [1/3] Gửi email xác nhận booking cho khách ────────────────');
    await sendBookingConfirmationToCustomer(mockBooking);
    console.log();
  }

  if (testType === 'admin' || testType === 'all') {
    console.log('─── [2/3] Gửi email báo đơn mới cho admin ─────────────────────');
    await sendNewBookingAlertToAdmin(mockBooking);
    console.log();
  }

  if (testType === 'giftcard' || testType === 'all') {
    console.log('─── [3/3] Gửi email gift card cho người nhận ───────────────────');
    await sendGiftCardToRecipient(mockGiftCard);
    console.log();
  }

  console.log('✅  Test hoàn thành. Kiểm tra inbox của', process.env.EMAIL_USER);
  console.log('    (Nếu không thấy, hãy kiểm tra thư mục Spam/Junk)\n');
};

run().catch(err => {
  console.error('❌  Lỗi không mong muốn:', err.message);
  process.exit(1);
});
