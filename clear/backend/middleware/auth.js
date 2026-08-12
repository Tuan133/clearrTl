import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── Helper: Generate Access Token (15 phút) ──────────────────────────────────
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

// ─── Helper: Generate Refresh Token (30 ngày) ─────────────────────────────────
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

// ─── Middleware: Xác thực Access Token ────────────────────────────────────────
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password -refreshToken');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại hoặc đã bị xoá!' });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ success: false, message: 'Tài khoản đã bị khoá! Vui lòng liên hệ Admin.' });
      }

      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Access Token đã hết hạn!', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ success: false, message: 'Token không hợp lệ!', code: 'TOKEN_INVALID' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Truy cập bị từ chối! Yêu cầu đăng nhập để tiếp tục.' });
  }
};

// ─── Middleware: Phân quyền RBAC ──────────────────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Quyền hạn '${req.user?.role || 'unknown'}' không được phép truy cập tài nguyên này!`
      });
    }
    next();
  };
};

// ─── Middleware: Chỉ cho phép khách hàng hoặc Admin truy cập tài nguyên của mình ─
export const selfOrAdmin = (req, res, next) => {
  const targetId = req.params.userId || req.params.id;
  const isOwner = req.user._id.toString() === targetId;
  const isAdminOrStaff = ['ADMIN', 'STAFF'].includes(req.user.role);

  if (isOwner || isAdminOrStaff) return next();

  return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập tài nguyên này!' });
};
