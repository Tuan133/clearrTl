import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { trackOrderAPI } from '../services/api';

const STATUS_MAP = {
  PENDING: {
    label: 'Chờ xác nhận',
    color: '#f59e0b',
    bg: '#fef3c7',
    icon: '🕐',
    description: 'Yêu cầu của bạn đã được ghi nhận. Đội ngũ TLaundry đang xử lý và chuẩn bị liên hệ báo giá.'
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    color: '#3b82f6',
    bg: '#dbeafe',
    icon: '✅',
    description: 'Đơn hàng đã được xác nhận. Nhân viên đã chốt thời gian lấy đồ theo lịch hẹn.'
  },
  PICKED_UP: {
    label: 'Đã lấy đồ',
    color: '#8b5cf6',
    bg: '#ede9fe',
    icon: '🚚',
    description: 'Shipper đã lấy đồ tại địa chỉ của bạn và đang trên đường chuyển về xưởng giặt.'
  },
  WASHING: {
    label: 'Đang giặt sấy',
    color: '#06b6d4',
    bg: '#cffafe',
    icon: '🫧',
    description: 'Quần áo đang được phân loại, giặt sấy và chăm sóc vải với chế độ chuyên biệt.'
  },
  DELIVERING: {
    label: 'Đang giao hàng',
    color: '#10b981',
    bg: '#d1fae5',
    icon: '🛵',
    description: 'Đồ đã được ủi thẳng, đóng gói sạch sẽ và nhân viên giao hàng đang trên đường giao tới bạn.'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: '#22c55e',
    bg: '#dcfce7',
    icon: '🎉',
    description: 'Đơn hàng đã hoàn thành trọn vẹn. Cảm ơn bạn đã tin tưởng dịch vụ của TLaundry!'
  },
  CANCELLED: {
    label: 'Đã huỷ',
    color: '#ef4444',
    bg: '#fee2e2',
    icon: '❌',
    description: 'Đơn hàng hoặc yêu cầu này đã được huỷ. Nếu có nhầm lẫn, vui lòng gọi hotline để hỗ trợ.'
  },
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PICKED_UP', 'WASHING', 'DELIVERING', 'COMPLETED'];

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTracking = useCallback(async (codeToTrack) => {
    const trimmed = (codeToTrack || '').trim();
    if (!trimmed) {
      setError('Vui lòng nhập mã đơn hàng cần tra cứu.');
      setOrder(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await trackOrderAPI(trimmed);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('Không tìm thấy thông tin cho mã đơn hàng này.');
        setOrder(null);
      }
    } catch (err) {
      setError(err.message || 'Không tìm thấy đơn hàng với mã này. Vui lòng kiểm tra lại!');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động tra cứu khi có param ?code= trên URL
  useEffect(() => {
    if (initialCode) {
      setInputCode(initialCode);
      fetchTracking(initialCode);
    }
  }, [initialCode, fetchTracking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = inputCode.trim();
    if (!clean) return;
    setSearchParams({ code: clean });
    fetchTracking(clean);
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const statusInfo = order ? (STATUS_MAP[order.status] || STATUS_MAP.PENDING) : null;

  return (
    <main className="track-page-container">
      {/* ─── Hero / Header ────────────────────────────────────────── */}
      <section className="track-hero">
        <div className="track-hero__badge">
          <span>🔍 Tra cứu trực tuyến 24/7</span>
        </div>
        <h1 className="track-hero__title">Theo Dõi Tiến Độ Đơn Hàng</h1>
        <p className="track-hero__desc">
          Nhập mã đơn hàng hoặc mã yêu cầu báo giá (VD: <code>TL-619951</code>) nhận được từ email hoặc tin nhắn để cập nhật trạng thái mới nhất theo thời gian thực.
        </p>

        {/* Search Bar Form */}
        <form className="track-search-form" onSubmit={handleSubmit}>
          <div className="track-search-input-wrap">
            <svg className="track-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="track-search-input"
              placeholder="Nhập mã đơn hàng (VD: TL-619951)..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              autoFocus={!initialCode}
            />
            {inputCode && (
              <button
                type="button"
                className="track-clear-btn"
                onClick={() => { setInputCode(''); setOrder(null); setError(''); }}
                title="Xóa mã"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="track-search-btn" disabled={loading}>
            {loading ? (
              <span className="track-btn-spinner"></span>
            ) : (
              <>
                <span>Tra Cứu</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>
      </section>

      {/* ─── Content Result ───────────────────────────────────────── */}
      <section className="track-result-section">
        {loading && (
          <div className="track-loading-card">
            <div className="track-spinner-large"></div>
            <p>Đang tìm kiếm thông tin đơn hàng #{inputCode}...</p>
          </div>
        )}

        {error && !loading && (
          <div className="track-error-card">
            <div className="track-error-icon">⚠️</div>
            <h3>Không Tìm Thấy Đơn Hàng</h3>
            <p>{error}</p>
            <div className="track-error-hints">
              <p>💡 <strong>Gợi ý:</strong></p>
              <ul>
                <li>Kiểm tra lại xem mã đơn có đúng chữ cái viết hoa và số không (VD: <code>TL-619951</code>).</li>
                <li>Mở lại email <em>"TLaundry: Xác nhận yêu cầu báo giá"</em> để xem chính xác mã đơn.</li>
                <li>Nếu cần kiểm tra trực tiếp, vui lòng liên hệ hotline: <a href="tel:131546">131 546</a>.</li>
              </ul>
            </div>
          </div>
        )}

        {order && !loading && (
          <div className="track-card">
            {/* Header Thẻ Đơn */}
            <div className="track-card__header">
              <div className="track-card__meta">
                <span className="track-card__label">MÃ ĐƠN HÀNG / YÊU CẦU</span>
                <div className="track-card__code-row">
                  <h2 className="track-card__code">{order.orderCode}</h2>
                  <button
                    className="track-copy-btn"
                    onClick={() => handleCopyCode(order.orderCode)}
                    title="Sao chép mã đơn"
                  >
                    {copied ? (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                        ✓ Đã chép
                      </span>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Sao chép
                      </>
                    )}
                  </button>
                </div>
                <div className="track-card__date">
                  📅 Ngày gửi: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Status Badge */}
              <div className="track-card__badge-wrap">
                <span
                  className="track-status-badge"
                  style={{
                    color: statusInfo.color,
                    background: statusInfo.bg,
                    borderColor: `${statusInfo.color}40`,
                  }}
                >
                  <span className="track-status-icon">{statusInfo.icon}</span>
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Trạng thái mô tả chi tiết */}
            <div className="track-status-banner" style={{ borderLeftColor: statusInfo.color }}>
              <p className="track-status-banner__text">
                <strong>Thông báo hiện tại:</strong> {statusInfo.description}
              </p>
            </div>

            {/* ─── Timeline Stepper (Chỉ hiển thị khi không bị huỷ) ─── */}
            {order.status !== 'CANCELLED' && (
              <div className="track-stepper-box">
                <div className="track-stepper-header">
                  <h3 className="track-section-title" style={{ margin: 0 }}>Tiến Trình Xử Lý</h3>
                  <span className="track-stepper-indicator">
                    Bước <strong>{Math.max(1, currentStep + 1)}</strong> / {STATUS_STEPS.length}
                  </span>
                </div>

                <div className="track-stepper-wrapper">
                  <div className="track-stepper">
                    {STATUS_STEPS.map((step, idx) => {
                      const stepItem = STATUS_MAP[step];
                      const isPassed = idx < currentStep;
                      const isCurrent = idx === currentStep;

                      let stepClass = 'track-step';
                      if (isPassed) stepClass += ' is-passed';
                      if (isCurrent) stepClass += ' is-current';

                      return (
                        <div key={step} className={stepClass}>
                          <div className="track-step__node">
                            <div className="track-step__circle">
                              {isPassed ? (
                                <span className="track-step__check">✓</span>
                              ) : (
                                <span className="track-step__icon">{stepItem.icon}</span>
                              )}
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div
                                className={`track-step__connector ${idx < currentStep ? 'is-active' : ''}`}
                              />
                            )}
                          </div>

                          <div className="track-step__content">
                            <span className="track-step__title">{stepItem.label}</span>
                            {isCurrent && (
                              <span className="track-step__current-badge">
                                Đang xử lý
                              </span>
                            )}
                            {isPassed && (
                              <span className="track-step__passed-badge">
                                Hoàn tất
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Chi Tiết Thông Tin Dịch Vụ ─── */}
            <div className="track-info-box">
              <h3 className="track-section-title">Chi Tiết Đơn Đăng Ký</h3>
              <div className="track-info-grid">
                <div className="track-info-item">
                  <span className="track-info-label">👤 Khách hàng</span>
                  <span className="track-info-val">{order.customerName}</span>
                </div>
                <div className="track-info-item">
                  <span className="track-info-label">🧺 Dịch vụ</span>
                  <span className="track-info-val font-semibold">{order.serviceType}</span>
                </div>
                <div className="track-info-item">
                  <span className="track-info-label">📅 Lịch lấy đồ</span>
                  <span className="track-info-val">
                    {order.pickupDate || 'Chưa chọn'} {order.pickupTime ? `(${order.pickupTime})` : ''}
                  </span>
                </div>
                <div className="track-info-item">
                  <span className="track-info-label">🚀 Giao nhận</span>
                  <span className="track-info-val">
                    {order.deliverySpeed === 'express' ? (
                      <span style={{ color: '#d97706', fontWeight: 700 }}>⚡ Hỏa tốc 4h-6h</span>
                    ) : (
                      <span>🚚 Tiêu chuẩn 24h</span>
                    )}
                  </span>
                </div>
                <div className="track-info-item">
                  <span className="track-info-label">🌿 Nước giặt</span>
                  <span className="track-info-val">{order.detergent || 'Organic Sinh Học'}</span>
                </div>
                <div className="track-info-item">
                  <span className="track-info-label">🌸 Nước xả vải</span>
                  <span className="track-info-val">{order.softener || 'Hương Oải Hương'}</span>
                </div>
                <div className="track-info-item">
                  <span className="track-info-label">📍 Khu vực</span>
                  <span className="track-info-val">{order.area || 'Đã ghi nhận'}</span>
                </div>
                {order.notes && (
                  <div className="track-info-item track-info-item--full">
                    <span className="track-info-label">📝 Ghi chú yêu cầu</span>
                    <span className="track-info-val">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Hỗ Trợ & Actions ─── */}
            <div className="track-actions-box">
              <div className="track-support-card">
                <div className="track-support-icon">💬</div>
                <div>
                  <h4>Cần thay đổi lịch hẹn hoặc giải đáp thắc mắc?</h4>
                  <p>Liên hệ ngay chuyên viên CSKH để được điều chỉnh kịp thời trước giờ shipper nhận đồ.</p>
                </div>
                <a href="tel:131546" className="track-hotline-btn">
                  📞 Hotline: 131 546
                </a>
              </div>

              <div className="track-footer-links">
                <button
                  type="button"
                  className="track-btn-secondary"
                  onClick={() => navigate('/booking')}
                >
                  ➕ Đặt Thêm Đơn Mới
                </button>
                <Link to="/" className="track-btn-home">
                  Trở Về Trang Chủ
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
