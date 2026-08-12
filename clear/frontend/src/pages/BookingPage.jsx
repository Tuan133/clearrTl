import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { submitBookingAPI } from '../services/api';

const BookingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', suburb: '', state: '', postcode: '',
    pickupDate: '', pickupTime: 'Morning (8am-12pm)', notes: '',
    frequency: 'one-off',
  });

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
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
          <path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>
        </svg>
      ),
      label: t.header.commercial
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a2.5 2.5 0 0 0-2.5 2.5v1.25L3 11a1.5 1.5 0 0 0 .5 2.8h17a1.5 1.5 0 0 0 .5-2.8l-6.5-4.25V5.5A2.5 2.5 0 0 0 12 3z"/>
          <path d="M12 13.8v7.2"/>
          <path d="M8 17h8"/>
        </svg>
      ),
      label: t.header.ironing
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
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20"/>
          <path d="M2 12h20"/>
        </svg>
      ),
      label: t.header.sports
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="2"/>
          <path d="M12 6v6l4 2"/>
          <path d="M8 12h8"/>
          <path d="M10 18a5 5 0 1 0 0-10"/>
        </svg>
      ),
      label: t.header.ndis
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21V5a2 2 0 0 1-2-2H7a2 2 0 0 1-2 2v16"/>
          <path d="M12 7v6M9 10h6"/>
          <path d="M3 21h18"/>
        </svg>
      ),
      label: t.header.careFacilities
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <path d="M12 11v6M9 14h6"/>
        </svg>
      ),
      label: t.header.hcp
    },
  ];

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await submitBookingAPI({
        serviceType: selected || 'Giặt Ủi Gia Đình',
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        suburb: form.suburb,
        state: form.state,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        frequency: form.frequency,
        notes: form.notes
      });
      if (res && res.orderCode) {
        setOrderCode(res.orderCode);
      }
      setDone(true);
    } catch (err) {
      setErrorMessage(err.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại!');
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
                Mã đơn hàng của bạn: <span style={{ color: 'var(--cyan)', fontSize: 18, letterSpacing: '1px' }}>{orderCode}</span>
              </div>
            )}
            <p>{t.bookingPage.successDesc}</p>
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

            {/* Step 1: Details */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <h2>{t.bookingPage.detailsTitle}</h2>
                <p className="subtitle">{t.bookingPage.detailsSubtitle}</p>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.bookingPage.firstName} <span className="required-star">*</span></label>
                    <input name="firstName" value={form.firstName} onChange={handle} required placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label>{t.bookingPage.lastName} <span className="required-star">*</span></label>
                    <input name="lastName" value={form.lastName} onChange={handle} required placeholder="Smith" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.bookingPage.email} <span className="required-star">*</span></label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label>{t.bookingPage.phone} <span className="required-star">*</span></label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle} required placeholder="0400 000 000" />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.bookingPage.address} <span className="required-star">*</span></label>
                  <input name="address" value={form.address} onChange={handle} required placeholder="123 Main Street" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.bookingPage.suburb} <span className="required-star">*</span></label>
                    <input name="suburb" value={form.suburb} onChange={handle} required placeholder="Melbourne" />
                  </div>
                  <div className="form-group">
                    <label>{t.bookingPage.state} <span className="required-star">*</span></label>
                    <select name="state" value={form.state} onChange={handle} required>
                      <option value="">-- Select --</option>
                      {['VIC','NSW','QLD','SA','WA','TAS','ACT','NT'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.bookingPage.pickupDate} <span className="required-star">*</span></label>
                    <input name="pickupDate" type="date" value={form.pickupDate} onChange={handle} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>{t.bookingPage.pickupTime}</label>
                    <select name="pickupTime" value={form.pickupTime} onChange={handle}>
                      <option>Sáng (8am-12pm)</option>
                      <option>Chiều (12pm-5pm)</option>
                      <option>Tối (5pm-7pm)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.bookingPage.frequency}</label>
                  <div className="radio-group">
                    {[
                      { val: 'one-off', label: 'Một lần' },
                      { val: 'weekly', label: 'Hàng tuần' },
                      { val: 'fortnightly', label: '2 tuần / lần' },
                      { val: 'monthly', label: 'Hàng tháng' },
                    ].map(f => (
                      <label key={f.val} className="radio-label">
                        <input type="radio" name="frequency" value={f.val} checked={form.frequency === f.val} onChange={handle} />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.bookingPage.notes}</label>
                  <textarea name="notes" value={form.notes} onChange={handle} placeholder="Ghi chú thêm nếu có..." />
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      ['Dịch vụ', selected],
                      ['Họ tên', `${form.firstName} ${form.lastName}`],
                      ['Email', form.email],
                      ['Số điện thoại', form.phone],
                      ['Địa chỉ', `${form.address}, ${form.suburb} ${form.state}`],
                      ['Ngày nhận hàng', form.pickupDate],
                      ['Khung giờ', form.pickupTime],
                      ['Tần suất', form.frequency],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{v || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div style={{ color: 'var(--color-error, #dc2626)', background: '#fee2e2', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-back" disabled={loading} onClick={() => setStep(1)}>{t.bookingPage.btnBack}</button>
                  <button type="submit" className="btn-next" disabled={loading}>
                    {loading ? 'Đang gửi dữ liệu...' : t.bookingPage.btnSubmit}
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
