const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:5001/api';

// ─── Token Management ──────────────────────────────────────────────────────────
const getAccessToken = () => localStorage.getItem('tlaundry_token');
const getRefreshToken = () => localStorage.getItem('tlaundry_refresh_token');
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('tlaundry_token', accessToken);
  if (refreshToken) localStorage.setItem('tlaundry_refresh_token', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('tlaundry_token');
  localStorage.removeItem('tlaundry_refresh_token');
  localStorage.removeItem('tlaundry_user');
};

// ─── Token Auto-Refresh Logic ─────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

// ─── Core Request Function ────────────────────────────────────────────────────
const request = async (endpoint, method = 'GET', body = null, retry = true) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();

  // Auto-refresh nếu token hết hạn (401 + TOKEN_EXPIRED)
  if (response.status === 401 && data.code === 'TOKEN_EXPIRED' && retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken) => resolve(request(endpoint, method, body, false)),
          reject
        });
      });
    }

    isRefreshing = true;
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      isRefreshing = false;
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    }

    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) throw new Error('Refresh failed');

      setTokens(refreshData.accessToken, refreshData.refreshToken);
      processQueue(null, refreshData.accessToken);
      isRefreshing = false;

      return request(endpoint, method, body, false);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      isRefreshing = false;
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    }
  }

  if (!response.ok) {
    throw new Error(data.message || 'Đã có lỗi xảy ra khi kết nối tới máy chủ!');
  }

  return data;
};

// ─── Auth APIs ────────────────────────────────────────────────────────────────
export const registerAPI = async (userData) => {
  const data = await request('/auth/register', 'POST', userData);
  if (data.success) {
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('tlaundry_user', JSON.stringify(data.user));
  }
  return data;
};

export const loginAPI = async (credentials) => {
  const data = await request('/auth/login', 'POST', credentials);
  if (data.success) {
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('tlaundry_user', JSON.stringify(data.user));
  }
  return data;
};

export const logoutAPI = async () => {
  try {
    await request('/auth/logout', 'POST');
  } catch {
    // Bỏ qua lỗi khi logout
  } finally {
    clearTokens();
  }
};

export const getMeAPI = () => request('/auth/me', 'GET');
export const updateProfileAPI = (data) => request('/auth/me', 'PUT', data);
export const changePasswordAPI = (data) => request('/auth/change-password', 'PUT', data);

// ─── Customer APIs ────────────────────────────────────────────────────────────
export const getMyOrdersAPI = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/bookings/my-orders${query ? '?' + query : ''}`, 'GET');
};

export const trackOrderAPI = (orderCode) => request(`/bookings/${orderCode}/track`, 'GET');

// ─── Admin APIs ───────────────────────────────────────────────────────────────
export const getAdminDashboardAPI = () => request('/admin/dashboard', 'GET');

export const getAllBookingsAdminAPI = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/bookings${query ? '?' + query : ''}`, 'GET');
};

export const updateBookingStatusAPI = (id, status) =>
  request(`/bookings/${id}/status`, 'PUT', { status });

export const getAllContactsAdminAPI = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/contact${query ? '?' + query : ''}`, 'GET');
};

export const resolveContactAPI = (id) => request(`/contact/${id}/resolve`, 'PATCH');
export const unresolveContactAPI = (id) => request(`/contact/${id}/unresolve`, 'PATCH');

export const getAllGiftCardsAdminAPI = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/gift-cards${query ? '?' + query : ''}`, 'GET');
};

export const getAllUsersAdminAPI = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/users${query ? '?' + query : ''}`, 'GET');
};

export const createAdminUserAPI = (userData) => request('/admin/users', 'POST', userData);
export const toggleUserActiveAPI = (id) => request(`/admin/users/${id}/toggle-active`, 'PUT');

// ─── Public APIs (Forms) ──────────────────────────────────────────────────────
export const submitBookingAPI = (bookingData) => request('/bookings', 'POST', bookingData);
export const submitContactAPI = (contactData) => request('/contact', 'POST', contactData);
export const submitGiftCardAPI = (giftCardData) => request('/gift-cards', 'POST', giftCardData);
export const subscribeNewsletterAPI = (email) => request('/newsletter', 'POST', { email });

// ─── Dynamic Data APIs ────────────────────────────────────────────────────────
export const getServicesAPI = () => request('/services', 'GET');
export const getPricingAPI = () => request('/pricing', 'GET');

// ─── Token utilities (export for AuthContext) ─────────────────────────────────
export { clearTokens, getAccessToken, getRefreshToken };
