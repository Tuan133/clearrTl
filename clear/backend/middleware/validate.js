import { z } from 'zod';

// ─── Reusable Zod field primitives ────────────────────────────────────────────

const phoneVN = z
  .string()
  .trim()
  .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, 'Số điện thoại không hợp lệ (ví dụ: 0912345678)');

const emailField = z
  .string({ required_error: 'Email là bắt buộc!' })
  .trim()
  .toLowerCase()
  .email('Định dạng email không hợp lệ!');

const passwordField = z
  .string({ required_error: 'Mật khẩu là bắt buộc!' })
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
  .max(100, 'Mật khẩu quá dài!');

// ─── Auth Schemas ──────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Họ tên là bắt buộc!' })
    .trim()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự!')
    .max(100, 'Họ tên quá dài!'),
  email: emailField,
  password: passwordField,
  phone: phoneVN.optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string({ required_error: 'Mật khẩu là bắt buộc!' }).min(1, 'Mật khẩu là bắt buộc!'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Mật khẩu hiện tại là bắt buộc!' }).min(1),
  newPassword: passwordField,
});

// ─── Booking Schema ────────────────────────────────────────────────────────────

export const bookingSchema = z.object({
  firstName: z
    .string({ required_error: 'Tên là bắt buộc!' })
    .trim()
    .min(1, 'Tên là bắt buộc!')
    .max(50, 'Tên quá dài!'),
  lastName: z
    .string({ required_error: 'Họ là bắt buộc!' })
    .trim()
    .min(1, 'Họ là bắt buộc!')
    .max(50, 'Họ quá dài!'),
  email: emailField,
  phone: phoneVN,
  address: z
    .string({ required_error: 'Địa chỉ là bắt buộc!' })
    .trim()
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự!')
    .max(200, 'Địa chỉ quá dài!'),
  suburb: z.string({ required_error: 'Suburb là bắt buộc!' }).trim().min(2).max(100),
  state: z.string({ required_error: 'State là bắt buộc!' }).trim().min(2).max(50),
  pickupDate: z.string({ required_error: 'Ngày lấy hàng là bắt buộc!' }).min(1, 'Ngày lấy hàng là bắt buộc!'),
  serviceType: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(500, 'Ghi chú quá dài!').optional(),
});

// ─── Contact Schema ────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Họ tên là bắt buộc!' })
    .trim()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự!')
    .max(100, 'Họ tên quá dài!'),
  email: emailField,
  subject: z.string().trim().max(200, 'Tiêu đề quá dài!').optional(),
  message: z
    .string({ required_error: 'Nội dung tin nhắn là bắt buộc!' })
    .trim()
    .min(10, 'Nội dung phải có ít nhất 10 ký tự!')
    .max(2000, 'Nội dung quá dài!'),
});

// ─── Gift Card Schema ──────────────────────────────────────────────────────────

export const giftCardSchema = z.object({
  amount: z
    .number({ required_error: 'Mệnh giá là bắt buộc!', invalid_type_error: 'Mệnh giá phải là số!' })
    .positive('Mệnh giá phải lớn hơn 0!')
    .max(10_000_000, 'Mệnh giá không được vượt quá 10,000,000 VNĐ!'),
  recipientName: z
    .string({ required_error: 'Tên người nhận là bắt buộc!' })
    .trim()
    .min(2)
    .max(100, 'Tên người nhận quá dài!'),
  recipientEmail: emailField,
  senderName: z
    .string({ required_error: 'Tên người gửi là bắt buộc!' })
    .trim()
    .min(2)
    .max(100, 'Tên người gửi quá dài!'),
  senderEmail: emailField,
  deliveryDate: z.string({ required_error: 'Ngày giao thẻ là bắt buộc!' }).min(1, 'Ngày giao thẻ là bắt buộc!'),
  message: z.string().trim().max(500, 'Lời nhắn quá dài!').optional(),
});

// ─── Newsletter Schema ─────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: emailField,
});

// ─── Admin Create User Schema ──────────────────────────────────────────────────

export const adminCreateUserSchema = z.object({
  name: z.string({ required_error: 'Họ tên là bắt buộc!' }).trim().min(2).max(100),
  email: emailField,
  password: passwordField,
  phone: phoneVN.optional().or(z.literal('')),
  role: z.enum(['CUSTOMER', 'STAFF', 'ADMIN'], {
    required_error: 'Role là bắt buộc!',
    invalid_type_error: "Role không hợp lệ! Chỉ chấp nhận: 'CUSTOMER', 'STAFF', 'ADMIN'",
  }),
});

// ─── Middleware Factory ────────────────────────────────────────────────────────

/**
 * Tạo Express middleware từ một Zod schema.
 * - Tự động strip các field lạ (strip unknown)
 * - Trả về lỗi 422 với danh sách lỗi chi tiết nếu validation fail
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(422).json({
      success: false,
      message: errors[0]?.message || 'Dữ liệu đầu vào không hợp lệ!',
      errors,
    });
  }

  // Ghi đè req.body bằng dữ liệu đã được làm sạch & strip unknown fields
  req.body = result.data;
  next();
};
