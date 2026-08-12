import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute - Bảo vệ route, yêu cầu đăng nhập
 * @param {string[]} roles - Danh sách role được phép (nếu rỗng = tất cả role đã đăng nhập)
 */
const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Đang kiểm tra auth -> hiển thị loading spinner
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{
          width: 44,
          height: 44,
          border: '3px solid var(--color-border, #e5e7eb)',
          borderTopColor: 'var(--primary, #2563eb)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-gray, #6b7280)', fontSize: 14 }}>Đang xác thực...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Chưa đăng nhập -> redirect về /login, lưu lại URL hiện tại
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Đã đăng nhập nhưng không đủ quyền
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <main style={{ padding: '120px 24px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🚫</div>
        <h1 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: 12 }}>Không Có Quyền Truy Cập</h1>
        <p style={{ color: 'var(--text-gray)', marginBottom: 28 }}>
          Tài khoản của bạn không có quyền truy cập trang này.
        </p>
        <a href="/" className="btn btn-primary">Trở Về Trang Chủ</a>
      </main>
    );
  }

  return children;
};

export default PrivateRoute;
