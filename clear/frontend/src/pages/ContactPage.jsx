import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { submitContactAPI } from '../services/api';

const ContactPage = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await submitContactAPI(form);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Gửi lời nhắn thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const faqsVi = [
    {
      q: 'Quy trình nhận và giao hàng diễn ra như thế nào?',
      a: 'Bạn chỉ cần đặt lịch online hoặc qua điện thoại, đối tác nhượng quyền tại địa phương của chúng tôi sẽ đến lấy đồ giặt vào khung giờ bạn chọn. Đồ sẽ được giặt sạch, gấp gọn và giao lại trong vòng 24 giờ.',
    },
    {
      q: 'Chi phí dịch vụ giặt ủi Jim\'s là bao nhiêu?',
      a: 'Giá phụ thuộc vào loại hình và khối lượng đồ giặt. Chúng tôi cung cấp báo giá miễn phí trong vòng 2 giờ sau khi nhận được yêu cầu. Chi phí minh bạch, không phí ẩn.',
    },
    {
      q: 'Đồ giặt của tôi có được bảo hiểm không?',
      a: 'Có! Tất cả dịch vụ đều được bảo đảm theo chính sách Cam Kết Chất Lượng Jim\'s và các đối tác đều có bảo hiểm đầy đủ.',
    },
    {
      q: 'Jim\'s phục vụ những khu vực nào?',
      a: 'Chúng tôi phục vụ tất cả các bang và vùng lãnh thổ trên Toàn Sài Gòn bao gồm VIC, NSW, QLD, SA, WA, TAS và ACT.',
    },
    {
      q: 'Công ty có sử dụng nước giặt thân thiện môi trường không?',
      a: 'Chắc chắn rồi! Chúng tôi sử dụng các sản phẩm nước giặt sản xuất tại Sài Gòn, an toàn cho da, trẻ em và thân thiện với môi trường.',
    },
  ];

  const faqsEn = [
    {
      q: 'How does the pick-up and delivery work?',
      a: 'Simply book online or call us, and one of our local franchisees will pick up your laundry at your preferred time. We\'ll return it clean and folded within 24 hours.',
    },
    {
      q: 'How much does Jim\'s Laundry Service cost?',
      a: 'Pricing depends on the type and volume of laundry. We offer free quotes within 2 hours of your request. All pricing is transparent with no hidden fees.',
    },
    {
      q: 'Is my laundry covered if something goes wrong?',
      a: 'Yes! All services are backed by the Jim\'s Work Guarantee, and all franchisees are fully insured for your complete peace of mind.',
    },
    {
      q: 'What areas do you service?',
      a: 'We service all states and territories across Sài Gòn including VIC, NSW, QLD, SA, WA, TAS and ACT.',
    },
    {
      q: 'Do you use eco-friendly detergents?',
      a: 'Absolutely! We use Sài Gònn-made, environmentally friendly detergents that are safe for your family, pets and the environment.',
    },
  ];

  const faqs = lang === 'vi' ? faqsVi : faqsEn;

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <h1>{t.contactPage.heroTitle}</h1>
          <p>{t.contactPage.heroSubtitle}</p>
        </div>
      </div>

      <section className="contact-page">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <h2>{t.contactPage.infoTitle}</h2>
              <p>{t.contactPage.infoDesc}</p>
              <div className="contact-details">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    ),
                    title: lang === 'vi' ? 'Điện thoại' : 'Call Us',
                    text: '131 546'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    ),
                    title: 'Email',
                    text: 'admin@jimslaundryservices.com.au'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    ),
                    title: lang === 'vi' ? 'Giờ làm việc' : 'Office Hours',
                    text: 'Thứ 2 - Chủ Nhật: 7am–9pm AEST'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    ),
                    title: lang === 'vi' ? 'Khu vực phục vụ' : 'Service Area',
                    text: 'Toàn bộ các bang & vùng lãnh thổ Sài Gòn'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" rx="2"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    ),
                    title: lang === 'vi' ? 'Giao nhận' : 'Delivery',
                    text: 'Giao & nhận hàng miễn phí Toàn Sài Gòn'
                  },
                ].map(d => (
                  <div key={d.title} className="contact-detail">
                    <div className="contact-detail-icon">{d.icon}</div>
                    <div className="contact-detail-text">
                      <strong>{d.title}</strong>
                      <span>{d.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" onClick={() => navigate('/booking')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    <path d="M5 3v4"/>
                    <path d="M19 17v4"/>
                  </svg>
                  {t.hero.btnQuote}
                </button>
                <a href="tel:131546" className="btn btn-cyan" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {lang === 'vi' ? 'Gọi 131 546 Ngay' : 'Call 131 546 Now'}
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div className="contact-success-icon-box">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>
                    {t.contactPage.successTitle}
                  </h3>
                  <p style={{ color: 'var(--text-gray)', marginBottom: 24 }}>
                    {t.contactPage.successDesc}
                  </p>
                  <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                    {lang === 'vi' ? 'Gửi Tin Nhắn Khác' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <>
                  <h3>{t.contactPage.formTitle}</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{t.contactPage.fullName} <span className="required-star">*</span></label>
                        <input name="name" value={form.name} onChange={handle} required placeholder="Nguyễn Văn A" />
                      </div>
                      <div className="form-group">
                        <label>{t.bookingPage.phone}</label>
                        <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="0400 000 000" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{t.bookingPage.email} <span className="required-star">*</span></label>
                      <input name="email" type="email" value={form.email} onChange={handle} required placeholder="email@example.com" />
                    </div>
                    <div className="form-group">
                      <label>{t.contactPage.subject}</label>
                      <select name="subject" value={form.subject} onChange={handle}>
                        <option value="">-- {lang === 'vi' ? 'Chọn chủ đề' : 'Select subject'} --</option>
                        <option>{lang === 'vi' ? 'Hỏi về dịch vụ' : 'Service Enquiry'}</option>
                        <option>{lang === 'vi' ? 'Hỏi về giá' : 'Pricing Question'}</option>
                        <option>{lang === 'vi' ? 'Hỏi về nhượng quyền' : 'Franchise Enquiry'}</option>
                        <option>{lang === 'vi' ? 'Góp ý / Phản hồi' : 'Feedback'}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t.contactPage.message} <span className="required-star">*</span></label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handle}
                        required
                        placeholder={lang === 'vi' ? 'Chúng tôi có thể giúp gì cho bạn?' : 'How can we help you?'}
                        style={{ minHeight: 120 }}
                      />
                    </div>
                    {errorMessage && (
                      <div style={{ color: '#dc2626', background: '#fee2e2', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 14 }}>
                        ⚠️ {errorMessage}
                      </div>
                    )}
                    <button type="submit" className="btn-next" disabled={loading} style={{ width: '100%' }}>
                      {loading ? 'Đang gửi...' : t.contactPage.btnSend}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 60 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 32, textAlign: 'center' }}>
              {t.contactPage.faqTitle}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800, margin: '0 auto' }}>
              {faqs.map((faq, i) => (
                <details key={i} style={{
                  background: 'white',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  padding: '18px 22px',
                  cursor: 'pointer',
                }}>
                  <summary style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--primary)',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    {faq.q}
                    <span style={{ color: 'var(--cyan)', fontSize: 20 }}>+</span>
                  </summary>
                  <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-body)', lineHeight: 1.7 }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;

