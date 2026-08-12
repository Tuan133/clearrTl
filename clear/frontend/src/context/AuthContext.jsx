import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginAPI, registerAPI, logoutAPI, getMeAPI, clearTokens } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True khi đang kiểm tra session

  // ─── Khởi tạo: Kiểm tra token cũ trong localStorage ────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('tlaundry_user');
      const token = localStorage.getItem('tlaundry_token');

      if (savedUser && token) {
        try {
          // Xác minh token vẫn còn hợp lệ bằng cách gọi /api/auth/me
          const res = await getMeAPI();
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('tlaundry_user', JSON.stringify(res.data));
          } else {
            clearTokens();
          }
        } catch {
          // Token hết hạn, auto-refresh sẽ xử lý hoặc clear tokens
          const parsed = JSON.parse(savedUser);
          setUser(parsed); // Giữ user tạm thời, refresh-token sẽ xử lý khi cần
        }
      }
      setLoading(false);
    };

    initAuth();

    // Lắng nghe sự kiện logout từ auto-refresh failure
    const handleAutoLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, []);

  // ─── Đăng nhập ──────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await loginAPI({ email, password });
    setUser(data.user);
    return data;
  }, []);

  // ─── Đăng ký ────────────────────────────────────────────────────────────────
  const register = useCallback(async (userData) => {
    const data = await registerAPI(userData);
    setUser(data.user);
    return data;
  }, []);

  // ─── Đăng xuất ──────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await logoutAPI();
    setUser(null);
  }, []);

  // ─── Cập nhật user state từ bên ngoài ───────────────────────────────────────
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('tlaundry_user', JSON.stringify(updatedUser));
  }, []);

  // ─── Computed values ─────────────────────────────────────────────────────────
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isStaff = user?.role === 'STAFF';
  const isAdminOrStaff = isAdmin || isStaff;
  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      isAdmin,
      isStaff,
      isAdminOrStaff,
      isCustomer,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider!');
  return context;
};

export default AuthContext;
