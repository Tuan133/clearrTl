import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { submitBookingAPI } from '../services/api';

const BookingPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    detergent: '',
    softener: '',
    deliverySpeed: 'standard',
    expressFee: 0,
    notes: '',
  });
  // Track which fields were auto-filled from account
  const [autoFilledFields, setAutoFilledFields] = useState([]);

  const STEPS = [t.bookingPage.step1, t.bookingPage.step2, t.bookingPage.step3];

  const serviceTypes = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="2" width="18" height="20" rx="3"/>
          <circle cx="12" cy="13" r="5"/>
          <path d="M12 10a3 3 0 0 0-3 3"/>
          <circle cx="7" cy="5" r="1" fill="currentColor"/>
          <circle cx="10" cy="5" r="1" fill="currentColor"/>
        </svg>
      ),
      label: t.header.domestic
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
          <path d="m12 11 2 2 4-4"/>
        </svg>
      ),
      label: t.header.dryCleaning
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16"/>
          <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
          <path d="M2 17h20"/>
          <path d="M6 8v9"/>
        </svg>
      ),
      label: t.header.linen
    },
  ];

  const detergentOptions = [
    {
      id: 'eco',
      icon: '🌿',
      nameVi: 'Nước Giặt Organic Sinh Học',
      nameEn: 'Eco-Friendly Bio Detergent',
      descVi: 'Chiết xuất thực vật tự nhiên, an toàn cho da nhạy cảm & em bé, bảo vệ môi trường.',
      descEn: 'Plant-based botanical formula, 100% hypoallergenic and gentle for all sensitive skins.',
      badgeVi: 'Khuyên Dùng',
      badgeEn: 'Recommended',
    },
    {
      id: 'perfume',
      icon: '🌸',
      nameVi: 'Nước Giặt Hương Nước Hoa Cao Cấp',
      nameEn: 'Luxury Perfume Scent Detergent',
      descVi: 'Công nghệ vi nang lưu hương, lưu giữ hương thơm quý phái, thanh lịch suốt cả tuần.',
      descEn: 'Micro-encapsulated fragrance beads infusing long-lasting luxury perfume into fabrics.',
      badgeVi: 'Thơm Lâu',
      badgeEn: 'Long-Lasting',
    },
    {
      id: 'antibacterial',
      icon: '🛡️',
      nameVi: 'Nước Giặt Kháng Khuẩn Khử Mùi',
      nameEn: 'Antibacterial & Active Shield',
      descVi: 'Khử sạch 99.9% vi khuẩn và mùi ẩm mốc, tối ưu chuyên dụng cho đồ thể thao & văn phòng.',
      descEn: 'Eliminates 99.9% bacteria & deep sweat odors, ideal for activewear and daily office clothes.',
      badgeVi: 'Kháng Khuẩn',
      badgeEn: 'Active Shield',
    },
    {
      id: 'gentle',
      icon: '🫧',
      nameVi: 'Nước Giặt Dịu Nhẹ Tiêu Chuẩn',
      nameEn: 'Classic Gentle Clean',
      descVi: 'Làm sạch sâu sợi vải êm dịu, giữ bền màu sắc ban đầu và mềm mại tự nhiên.',
      descEn: 'Deep gentle cleaning formula preserving natural fabric vibrancy and softness.',
      badgeVi: 'Tiêu Chuẩn',
      badgeEn: 'Standard',
    },
    {
      id: 'random-det',
      icon: '🎁',
      nameVi: 'Bóc Túi Mù Ngẫu Nhiên',
      nameEn: 'Mystery Detergent (Surprise)',
      descVi: 'Hãy để TLaundry chọn giúp bạn! Chúng tôi sẽ chọn loại phù hợp nhất với từng lần giặt.',
      descEn: 'Let TLaundry surprise you! We pick the best formula tailored to each wash cycle.',
      badgeVi: '🌠 Ngẫu Nhiên',
      badgeEn: '🌠 Surprise',
      isMystery: true,
    },
  ];

  const softenerOptions = [
    {
      id: 'lavender',
      icon: '🌸',
      nameVi: 'Hương Oải Hương (Lavender Relax)',
      nameEn: 'Lavender French Relax',
      scentVi: 'Thảo mộc thư thái & dễ chịu',
      scentEn: 'Calming French botanical note',
    },
    {
      id: 'morning',
      icon: '☀️',
      nameVi: 'Hương Nắng Ban Mai (Morning Fresh)',
      nameEn: 'Morning Sunlight Fresh',
      scentVi: 'Tươi mát, rạng rỡ ngày mới',
      scentEn: 'Crisp, uplifting morning scent',
    },
    {
      id: 'baby',
      icon: '👶',
      nameVi: 'Dịu Nhẹ Em Bé (Baby Hypoallergenic)',
      nameEn: 'Baby Soft (Hypoallergenic)',
      scentVi: 'Không hương liệu, dịu êm tuyệt đối',
      scentEn: 'Fragrance-free, zero irritation',
    },
    {
      id: 'none',
      icon: '🚫',
      nameVi: 'Không Sử Dụng Nước Xả Vải',
      nameEn: 'No Fabric Softener',
      scentVi: 'Giữ nguyên độ tự nhiên của vải',
      scentEn: 'Pure natural wash only',
    },
    {
      id: 'random-soft',
      icon: '🎁',
      nameVi: 'Bóc Túi Mù Ngẫu Nhiên',
      nameEn: 'Mystery Softener (Surprise)',
      scentVi: 'TLaundry sẽ chọn mùi hương bất ngờ cho bạn 🌟',
      scentEn: 'TLaundry picks a surprise scent just for you 🌟',
      isMystery: true,
    },
  ];

  const deliveryOptions = [
    {
      id: 'express',
      icon: '⚡',
      nameVi: 'Ưu tiên',
      nameEn: 'Priority Express',
      timeVi: '4 - 6 Giờ',
      timeEn: '4 - 6 Hours',
      descVi: 'Cam kết giao hàng đúng hẹn • Ưu tiên xử lý riêng biệt',
      descEn: 'Guaranteed on-time delivery • Priority dedicated processing',
      isHighlightDesc: true,
      feeVi: '+30.000₫',
      feeEn: '+$10.00 / +30.000₫',
      isFree: false,
    },
    {
      id: 'standard',
      icon: '🚚',
      nameVi: 'Tiêu chuẩn',
      nameEn: 'Standard',
      timeVi: '24 Giờ',
      timeEn: '24 Hours',
      descVi: 'Giặt sấy, là phẳng & giao trả tận nơi chuẩn 24H',
      descEn: 'Washed, dried, folded & delivered to your door in 24H',
      isHighlightDesc: false,
      feeVi: 'Miễn phí',
      feeEn: 'Free',
      isFree: true,
    },
    {
      id: 'scheduled',
      icon: '⏰',
      nameVi: 'Đặt giao sau',
      nameEn: 'Schedule For Later',
      timeVi: 'Theo lịch hẹn',
      timeEn: 'Custom Time Slot',
      descVi: 'Linh hoạt hẹn giờ lấy & giao đồ theo lịch rảnh của bạn',
      descEn: 'Choose pickup and delivery time slots that fit your day',
      isHighlightDesc: false,
      feeVi: 'Miễn phí',
      feeEn: 'Free',
      isFree: true,
    },
  ];

  // ── Auto-fill khi user đã đăng nhập và chuyển sang step 1 ──
  useEffect(() => {
    if (step === 1 && isAuthenticated && user) {
      const nameParts = (user.name || '').trim().split(' ');
      const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0] || '';
      const lastName  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      const filled = [];

      setForm(f => {
        const updated = { ...f };
        if (!f.firstName && firstName) { updated.firstName = firstName; filled.push('firstName'); }
        if (!f.lastName  && lastName)  { updated.lastName  = lastName;  filled.push('lastName');  }
        if (!f.email     && user.email) { updated.email    = user.email; filled.push('email');     }
        if (!f.phone     && user.phone) { updated.phone    = user.phone; filled.push('phone');     }
        return updated;
      });

      if (filled.length > 0) setAutoFilledFields(filled);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isAuthenticated, user]);

  const handle = (e) => {
    const { name, value } = e.target;
    // Khi user tự chỉnh sửa field đã auto-fill → xóa khỏi danh sách
    if (autoFilledFields.includes(name)) {
      setAutoFilledFields(prev => prev.filter(f => f !== name));
    }
    setForm(f => ({ ...f, [name]: value }));
  };

  // Toggle: click lại item đã chọn → bỏ chọn (tùy chọn, không bắt buộc)
  const setDetergent = (name) => setForm(f => ({ ...f, detergent: f.detergent === name ? '' : name }));
  const setSoftener  = (name) => setForm(f => ({ ...f, softener:  f.softener  === name ? '' : name }));
  const setDelivery = (speed) => setForm(f => ({
    ...f,
    deliverySpeed: speed,
    expressFee: speed === 'express' ? 30000 : 0
  }));

  const submitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await submitBookingAPI({
        serviceType: selected || (lang === 'vi' ? 'Giặt Ủi Gia Đình' : 'Domestic Laundry'),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        detergent: form.detergent,
        softener: form.softener,
        deliverySpeed: form.deliverySpeed,
        expressFee: form.expressFee,
        notes: form.notes
      });
      if (res && res.orderCode) {
        setOrderCode(res.orderCode);
      }
      setDone(true);
    } catch (err) {
      setErrorMessage(err.message || (lang === 'vi' ? 'Gửi yêu cầu thất bại. Vui lòng thử lại!' : 'Failed to submit quote request. Please try again!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <div className="page-hero" style={{ padding: '50px 0', marginBottom: 0 }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{t.bookingPage.heroTitle}</h1>
          <p>{t.bookingPage.heroSubtitle}</p>
        </div>
      </div>

      <div className="booking-container" style={{ paddingTop: 40 }}>
        {done ? (
          <div className="booking-card booking-success">
            <div className="contact-success-icon-box">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>{t.bookingPage.successTitle}</h2>
            {orderCode && (
              <div style={{ background: 'var(--light-blue)', padding: '12px 20px', borderRadius: 10, margin: '16px auto', maxWidth: 400, fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                {lang === 'vi' ? 'Mã đơn hàng của bạn:' : 'Your Order Code:'} <span style={{ color: 'var(--cyan)', fontSize: 18, letterSpacing: '1px' }}>{orderCode}</span>
              </div>
            )}
            <p>{t.bookingPage.successDesc}</p>
            {form.email && (
              <div style={{
                background: 'rgba(13, 148, 136, 0.08)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                color: '#065f57',
                padding: '12px 18px',
                borderRadius: '10px',
                margin: '16px auto 20px',
                maxWidth: 480,
                fontSize: 14,
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textAlign: 'left'
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>📧</span>
                <span>
                  {lang === 'vi' 
                    ? <>Hệ thống đã tự động gửi email xác nhận báo giá chi tiết tới <strong>{form.email}</strong>. Quý khách vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam/Quảng cáo).</>
                    : <>A quote confirmation email has been sent to <strong>{form.email}</strong>. Please check your inbox or spam folder.</>}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => { setDone(false); setStep(0); setSelected(''); }}>
                {t.bookingPage.btnSubmitAnother}
              </button>
              <button className="btn btn-outline" style={{ background: 'var(--primary)', color: 'white' }} onClick={() => navigate('/')}>
                {t.bookingPage.btnBackHome}
              </button>
            </div>
          </div>
        ) : (
          <div className="booking-card">
            {/* Step indicators */}
            <div className="booking-steps">
              {STEPS.map((s, i) => (
                <div key={s} className="booking-step-indicator">
                  <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
                </div>
              ))}
            </div>

            {/* Step 0: Service Type */}
            {step === 0 && (
              <div>
                <h2>{t.bookingPage.selectServiceTitle}</h2>
                <p className="subtitle">{t.bookingPage.selectServiceSubtitle}</p>
                <div className="service-type-label">{t.bookingPage.step1}</div>
                <div className="service-options">
                  {serviceTypes.map(s => (
                    <div
                      key={s.label}
                      className={`service-option ${selected === s.label ? 'selected' : ''}`}
                      onClick={() => setSelected(s.label)}
                    >
                      <span className="service-option-icon">{s.icon}</span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button
                    className="btn-next"
                    onClick={() => selected && setStep(1)}
                    style={{ opacity: selected ? 1 : 0.5 }}
                  >
                    {t.bookingPage.btnContinue}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Details & Options */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <h2>{t.bookingPage.detailsTitle}</h2>
                <p className="subtitle">{t.bookingPage.detailsSubtitle}</p>

                {/* Auto-fill banner */}
                {isAuthenticated && autoFilledFields.length > 0 && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    background: 'linear-gradient(135deg, rgba(10,184,184,0.1), rgba(10,184,184,0.05))',
                    border: '1px solid rgba(10,184,184,0.3)', borderRadius: 12,
                    padding: '12px 16px', marginBottom: 24
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--primary)', marginBottom: 2 }}>
                        {lang === 'vi' ? '✓ Đã tự động điền từ tài khoản của bạn' : '✓ Auto-filled from your account'}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-gray)', lineHeight: 1.5 }}>
                        {lang === 'vi'
                          ? 'Thông tin cá nhân đã được điền sẵn. Vui lòng kiểm tra lại trước khi tiếp tục.'
                          : 'Your personal details have been pre-filled. Please review them before continuing.'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      {t.bookingPage.firstName} <span className="required-star">*</span>
                      {autoFilledFields.includes('firstName') && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--primary)', fontWeight: 600, verticalAlign: 'middle' }}>⚡ Tự động điền</span>
                      )}
                    </label>
                    <input
                      name="firstName" value={form.firstName} onChange={handle} required placeholder="John"
                      style={autoFilledFields.includes('firstName') ? { borderColor: 'var(--primary)', background: 'rgba(10,184,184,0.04)' } : {}}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      {t.bookingPage.lastName} <span className="required-star">*</span>
                      {autoFilledFields.includes('lastName') && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--primary)', fontWeight: 600, verticalAlign: 'middle' }}>⚡ Tự động điền</span>
                      )}
                    </label>
                    <input
                      name="lastName" value={form.lastName} onChange={handle} required placeholder="Smith"
                      style={autoFilledFields.includes('lastName') ? { borderColor: 'var(--primary)', background: 'rgba(10,184,184,0.04)' } : {}}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      {t.bookingPage.email} <span className="required-star">*</span>
                      {autoFilledFields.includes('email') && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--primary)', fontWeight: 600, verticalAlign: 'middle' }}>⚡ Tự động điền</span>
                      )}
                    </label>
                    <input
                      name="email" type="email" value={form.email} onChange={handle} required placeholder="john@example.com"
                      style={autoFilledFields.includes('email') ? { borderColor: 'var(--primary)', background: 'rgba(10,184,184,0.04)' } : {}}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      {t.bookingPage.phone} <span className="required-star">*</span>
                      {autoFilledFields.includes('phone') && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--primary)', fontWeight: 600, verticalAlign: 'middle' }}>⚡ Tự động điền</span>
                      )}
                    </label>
                    <input
                      name="phone" type="tel" value={form.phone} onChange={handle} required placeholder="0901 234 567"
                      style={autoFilledFields.includes('phone') ? { borderColor: 'var(--primary)', background: 'rgba(10,184,184,0.04)' } : {}}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.bookingPage.address} <span className="required-star">*</span></label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handle}
                    required
                    placeholder={lang === 'vi' ? 'Số 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM' : '123 Main Street, Suite 400, Central City'}
                  />
                </div>

                {/* 1. Detergent Selection */}
                <div className="form-section-block">
                  <div className="form-section-title">
                    <span>🧺</span> {t.bookingPage.detergentTitle}
                    <span className="form-section-optional">{lang === 'vi' ? 'Tùy chọn' : 'Optional'}</span>
                  </div>
                  <div className="form-section-subtitle">{t.bookingPage.detergentSubtitle}</div>

                  <div className="laundry-grid-cards">
                    {detergentOptions.map(item => {
                      const itemName = lang === 'vi' ? item.nameVi : item.nameEn;
                      const itemDesc = lang === 'vi' ? item.descVi : item.descEn;
                      const itemBadge = lang === 'vi' ? item.badgeVi : item.badgeEn;
                      const isSelected = form.detergent === itemName;

                      return (
                        <div
                          key={item.id}
                          className={`laundry-card-choice ${isSelected ? 'active' : ''} ${item.isMystery ? 'mystery' : ''}`}
                          onClick={() => setDetergent(itemName)}
                        >
                          <span className="laundry-card-icon">{item.icon}</span>
                          <div className="laundry-card-header">
                            <span className="laundry-card-name">{itemName}</span>
                            <p className="laundry-card-desc">{itemDesc}</p>
                            {itemBadge && (
                              <span className={item.isMystery ? 'laundry-badge-mystery' : 'laundry-badge-recommend'}>{itemBadge}</span>
                            )}
                          </div>
                          <div className="laundry-card-check">
                            {isSelected ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Softener Fragrance Selection */}
                <div className="form-section-block">
                  <div className="form-section-title">
                    <span>🌸</span> {t.bookingPage.softenerTitle}
                    <span className="form-section-optional">{lang === 'vi' ? 'Tùy chọn' : 'Optional'}</span>
                  </div>
                  <div className="form-section-subtitle">{t.bookingPage.softenerSubtitle}</div>

                  <div className="softener-chips-grid">
                    {softenerOptions.map(item => {
                      const itemName = lang === 'vi' ? item.nameVi : item.nameEn;
                      const itemScent = lang === 'vi' ? item.scentVi : item.scentEn;
                      const isSelected = form.softener === itemName;

                      return (
                        <div
                          key={item.id}
                          className={`softener-chip ${isSelected ? 'active' : ''} ${item.isMystery ? 'mystery' : ''}`}
                          onClick={() => setSoftener(itemName)}
                        >
                          <span className="softener-chip-icon">{item.icon}</span>
                          <div className="softener-chip-text">
                            <span className="softener-chip-name">{itemName}</span>
                            <span className="softener-chip-scent">{itemScent}</span>
                          </div>
                          <div className="laundry-card-check">
                            {isSelected ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Delivery Method (Grab-style options list) */}
                <div className="form-section-block">
                  <div className="form-section-title">
                    <span>🚀</span> {t.bookingPage.deliveryTitle}
                  </div>
                  <div className="form-section-subtitle">{t.bookingPage.deliverySubtitle}</div>

                  <div className="grab-delivery-list">
                    {deliveryOptions.map(item => {
                      const itemName = lang === 'vi' ? item.nameVi : item.nameEn;
                      const itemTime = lang === 'vi' ? item.timeVi : item.timeEn;
                      const itemDesc = lang === 'vi' ? item.descVi : item.descEn;
                      const itemFee = lang === 'vi' ? item.feeVi : item.feeEn;
                      const isSelected = form.deliverySpeed === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`grab-delivery-item ${isSelected ? 'active' : ''} ${item.id === 'express' ? 'grab-delivery--express' : ''}`}
                          onClick={() => setDelivery(item.id)}
                        >
                          <div className="grab-delivery-left">
                            <div className="grab-delivery-heading">
                              <span className="grab-delivery-name">{itemName}</span>
                              <span className="grab-delivery-icon">{item.icon}</span>
                              <span className="grab-delivery-dot">•</span>
                              <span className="grab-delivery-time">{itemTime}</span>
                              <span className="grab-delivery-info" title={itemDesc}>i</span>
                            </div>
                            {itemDesc && (
                              <div className={`grab-delivery-subtitle ${item.isHighlightDesc ? 'highlight' : ''}`}>
                                {itemDesc}
                              </div>
                            )}
                          </div>

                          <div className="grab-delivery-right">
                            <span className={`grab-delivery-fee ${item.isFree ? 'free' : ''}`}>
                              {itemFee}
                            </span>
                            <div className="grab-delivery-radio">
                              {isSelected ? '✓' : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="form-group">
                  <label>{t.bookingPage.notes}</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handle}
                    placeholder={t.bookingPage.notesPlaceholder}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={() => setStep(0)}>{t.bookingPage.btnBack}</button>
                  <button type="submit" className="btn-next">{t.bookingPage.btnReview}</button>
                </div>
              </form>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <form onSubmit={submitBooking}>
                <h2>{t.bookingPage.confirmTitle}</h2>
                <p className="subtitle">{t.bookingPage.confirmSubtitle}</p>

                <div style={{ background: 'var(--bg-light)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
                    {[
                      [t.bookingPage.confirmService, selected || (lang === 'vi' ? 'Giặt Ủi Gia Đình' : 'Domestic Laundry')],
                      [t.bookingPage.confirmCustomer, `${form.firstName} ${form.lastName}`],
                      [t.bookingPage.confirmEmail, form.email],
                      [t.bookingPage.confirmPhone, form.phone],
                      [t.bookingPage.confirmAddress, form.address],
                      [t.bookingPage.confirmDetergent, form.detergent],
                      [t.bookingPage.confirmSoftener, form.softener],
                      [
                        t.bookingPage.confirmDelivery,
                        form.deliverySpeed === 'express' ? (
                          <span style={{ color: '#d97706', fontWeight: 800 }}>
                            ⚡ {lang === 'vi' ? 'Ưu Tiên (4 - 6 Giờ)' : 'Priority Express (4 - 6 Hours)'} (+30.000₫)
                          </span>
                        ) : form.deliverySpeed === 'scheduled' ? (
                          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                            ⏰ {lang === 'vi' ? 'Đặt Giao Sau (Theo lịch hẹn)' : 'Schedule For Later'} ({lang === 'vi' ? 'Miễn phí' : 'Free'})
                          </span>
                        ) : (
                          <span style={{ color: '#059669', fontWeight: 700 }}>
                            🚚 {lang === 'vi' ? 'Tiêu Chuẩn (24 Giờ)' : 'Standard Delivery (24 Hours)'} ({lang === 'vi' ? 'Miễn phí' : 'Free'})
                          </span>
                        )
                      ],
                    ].map(([k, v]) => (
                      <div key={k} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{k}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-dark)' }}>{v || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {form.notes && (
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed #cbd5e1' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: 4 }}>{t.bookingPage.confirmNotes}</div>
                      <div style={{ fontSize: 14, color: 'var(--text-body)', fontStyle: 'italic' }}>"{form.notes}"</div>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div style={{ color: 'var(--color-error, #dc2626)', background: '#fee2e2', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-back" disabled={loading} onClick={() => setStep(1)}>{t.bookingPage.btnBack}</button>
                  <button type="submit" className="btn-next" disabled={loading}>
                    {loading ? (lang === 'vi' ? 'Đang gửi dữ liệu...' : 'Submitting...') : t.bookingPage.btnSubmit}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default BookingPage;

