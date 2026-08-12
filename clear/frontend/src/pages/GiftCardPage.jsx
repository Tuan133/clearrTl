import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { submitGiftCardAPI } from '../services/api';

const GiftCardPage = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [selectedAmt, setSelectedAmt] = useState(50);
  const [customAmt, setCustomAmt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    recipientName: '', recipientEmail: '',
    senderName: '', senderEmail: '',
    message: '', deliveryDate: '',
  });
  const [ordered, setOrdered] = useState(false);
  const [cardCode, setCardCode] = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const finalAmt = customAmt ? parseInt(customAmt) : selectedAmt;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await submitGiftCardAPI({
        amount: finalAmt,
        ...form
      });
      if (res && res.code) {
        setCardCode(res.code);
      }
      setOrdered(true);
    } catch (err) {
      setErrorMessage(err.message || 'Đặt mua thẻ quà tặng thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <h1>{t.giftCardPage.heroTitle}</h1>
          <p>{t.giftCardPage.heroSubtitle}</p>
        </div>
      </div>

      <section style={{ background: 'var(--bg-light)', padding: '70px 0' }}>
        <div className="container">
          {ordered ? (
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-lg)', padding: 60, boxShadow: 'var(--shadow-lg)' }}>
              <div className="gift-card-success-badge">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 12v10H4V12"/>
                  <path d="M2 7h20v5H2z"/>
                  <path d="M12 22V7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>
                {t.giftCardPage.orderedTitle}
              </h2>
              {cardCode && (
                <div style={{ background: 'var(--light-blue)', padding: '14px 20px', borderRadius: 10, margin: '16px auto', maxWidth: 360, fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                  {lang === 'vi' ? 'Mã thẻ quà tặng của bạn:' : 'Your Gift Card Code:'} <br />
                  <span style={{ color: 'var(--cyan)', fontSize: 22, letterSpacing: '1px', display: 'inline-block', marginTop: 4 }}>{cardCode}</span>
                </div>
              )}
              <p style={{ color: 'var(--text-gray)', lineHeight: 1.7, marginBottom: 28 }}>
                {t.giftCardPage.orderedDesc} (Email: <strong>{form.recipientEmail}</strong>)
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => setOrdered(false)}>
                  {lang === 'vi' ? 'Mua Thêm Thẻ Khác' : 'Buy Another'}
                </button>
                <button className="btn btn-outline" style={{ background: 'var(--primary)', color: 'white' }} onClick={() => navigate('/')}>
                  {t.bookingPage.btnBackHome}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'start' }}>
              {/* Gift card preview */}
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, #046e6e 100%)',
                  borderRadius: 20,
                  padding: 40,
                  color: 'white',
                  boxShadow: '0 12px 32px rgba(6, 148, 148, 0.25)',
                  marginBottom: 28,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 160, height: 160, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                  }} />
                  <div className="gift-card-badge">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="2" width="18" height="20" rx="3"/>
                      <circle cx="12" cy="13" r="5"/>
                      <path d="M12 10a3 3 0 0 0-3 3"/>
                      <circle cx="7" cy="5" r="1" fill="currentColor"/>
                      <circle cx="10" cy="5" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 4 }}>TLaundry</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--white)' }}>${finalAmt}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{t.header.giftCard}</div>
                  <div style={{ marginTop: 24, fontSize: 11, opacity: 0.75, letterSpacing: '0.02em' }}>
                    {lang === 'vi' ? 'Có giá trị cho tất cả dịch vụ giặt ủi Jim\'s' : 'Valid for all Jim\'s Laundry services'}
                  </div>
                </div>

                {/* Amount selector */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 14 }}>
                  {t.giftCardPage.selectAmount}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
                  {[25, 50, 75, 100, 150, 200, 250, 500].map(amt => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmt(amt); setCustomAmt(''); }}
                      style={{
                        padding: '12px 8px',
                        border: `2px solid ${selectedAmt === amt && !customAmt ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 10,
                        background: selectedAmt === amt && !customAmt ? 'var(--light-blue)' : 'white',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <div className="form-group">
                  <label>{t.giftCardPage.customAmount}</label>
                  <input
                    type="number"
                    placeholder="Nhập số tiền..."
                    value={customAmt}
                    onChange={e => { setCustomAmt(e.target.value); setSelectedAmt(0); }}
                    min="10"
                    max="5000"
                  />
                </div>
              </div>

              {/* Form */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 36, boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 24 }}>
                  {t.giftCardPage.detailsTitle}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                    {t.giftCardPage.recipientDetails}
                  </div>
                  <div className="form-group">
                    <label>{t.giftCardPage.recipientName} <span className="required-star">*</span></label>
                    <input name="recipientName" value={form.recipientName} onChange={handle} required placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="form-group">
                    <label>{t.giftCardPage.recipientEmail} <span className="required-star">*</span></label>
                    <input name="recipientEmail" type="email" value={form.recipientEmail} onChange={handle} required placeholder="nguyenvana@example.com" />
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, marginTop: 20 }}>
                    {t.giftCardPage.senderDetails}
                  </div>
                  <div className="form-group">
                    <label>{t.giftCardPage.senderName} <span className="required-star">*</span></label>
                    <input name="senderName" value={form.senderName} onChange={handle} required placeholder="Trần Thị B" />
                  </div>
                  <div className="form-group">
                    <label>{t.giftCardPage.senderEmail} <span className="required-star">*</span></label>
                    <input name="senderEmail" type="email" value={form.senderEmail} onChange={handle} required placeholder="tranthib@example.com" />
                  </div>
                  <div className="form-group">
                    <label>{t.giftCardPage.messageLabel}</label>
                    <textarea
                      name="message" value={form.message} onChange={handle}
                      placeholder={lang === 'vi' ? 'Nhập lời chúc...' : 'Add a message...'}
                      style={{ minHeight: 80 }}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.giftCardPage.deliveryDate} <span className="required-star">*</span></label>
                    <input
                      name="deliveryDate" type="date" value={form.deliveryDate} onChange={handle}
                      required min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div style={{ background: 'var(--light-blue)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                    {lang === 'vi' ? 'Tổng tiền:' : 'Total:'} ${finalAmt || 0}.00 AUD
                  </div>

                  {errorMessage && (
                    <div style={{ color: '#dc2626', background: '#fee2e2', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 14 }}>
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <button type="submit" className="btn-next" disabled={loading} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v10H4V12"/>
                      <path d="M2 7h20v5H2z"/>
                      <path d="M12 22V7"/>
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                    </svg>
                    {loading ? 'Đang xử lý...' : t.giftCardPage.btnPurchase}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default GiftCardPage;


