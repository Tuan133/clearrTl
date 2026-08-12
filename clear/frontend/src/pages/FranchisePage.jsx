import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FranchisePage = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const benefitsVi = [
    { icon: '💰', title: 'Chi Phí Khởi Nghiệp Thấp', desc: 'Bắt đầu với khoản đầu tư hợp lý và nhanh chóng tạo doanh thu nhờ mô hình đã thành công.' },
    { icon: '📚', title: 'Đào Tạo Bài Bản', desc: 'Chương trình đào tạo ban đầu toàn diện và hỗ trợ kiến thức liên tục giúp bạn tự tin vận hành.' },
    { icon: '🗺️', title: 'Khu Vực Độc Quyền', desc: 'Khu vực địa lý riêng biệt được bảo hộ, không bị cạnh tranh từ các đối tác Jim\'s khác.' },
    { icon: '📣', title: 'Marketing Toàn Quốc', desc: 'Hưởng lợi trực tiếp từ các chiến dịch quảng cáo truyền thông quy mô lớn của Jim\'s Group.' },
    { icon: '🤝', title: 'Hỗ Trợ Liên Tục', desc: 'Được đồng hành bởi người quản lý phát triển kinh doanh và mạng lưới hỗ trợ 24/7.' },
    { icon: '📈', title: 'Thị Trường Nhu Cầu Cao', desc: 'Ngành dịch vụ giặt ủi đang bùng nổ — nắm bắt cơ hội từ nhu cầu tiện lợi ngày càng tăng.' },
  ];

  const benefitsEn = [
    { icon: '💰', title: 'Low Start-Up Costs', desc: 'Get started with an affordable investment and start earning quickly with our proven business model.' },
    { icon: '📚', title: 'Full Training Provided', desc: 'Comprehensive initial training and ongoing education to ensure your success from day one.' },
    { icon: '🗺️', title: 'Exclusive Territory', desc: 'Your own protected area with no competition from other Jim\'s Laundry franchisees.' },
    { icon: '📣', title: 'National Marketing', desc: 'Benefit from Jim\'s Group national advertising campaigns, website and social media presence.' },
    { icon: '🤝', title: 'Ongoing Support', desc: 'Access to a dedicated business development manager and 24/7 support network.' },
    { icon: '📈', title: 'Growing Market', desc: 'The laundry services industry is booming — capitalise on increasing demand for convenient solutions.' },
  ];

  const benefits = lang === 'vi' ? benefitsVi : benefitsEn;

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <h1>{t.franchisePage.heroTitle}</h1>
          <p>{t.franchisePage.heroSubtitle}</p>
        </div>
      </div>

      {/* Hero banner */}
      <section style={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        padding: '70px 0',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <span className="badge">{t.franchiseSection.badge}</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: 20, lineHeight: 1.2 }}>
                {t.franchiseSection.title}
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-body)', lineHeight: 1.8, marginBottom: 24 }}>
                {t.franchiseSection.desc}
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                  {t.franchisePage.ctaEnquire}
                </button>
                <a href="tel:131546" className="btn btn-cyan">📞 {t.header.phone}</a>
              </div>
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"
                alt="Franchise opportunity"
                style={{ width: '100%', height: 360, objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ background: 'white', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 44 }}>
            {t.franchisePage.whyTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {benefits.map(b => (
              <div key={b.title} style={{
                background: 'var(--bg-light)',
                borderRadius: 'var(--radius-lg)',
                padding: 32,
              }}>
                <div style={{ fontSize: 42, marginBottom: 16 }}>{b.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner-section">
        <div className="container">
          <h2 className="cta-banner-title">
            {t.franchisePage.btnApply}
          </h2>
          <div className="cta-banner-actions">
            <button className="btn btn-white" onClick={() => navigate('/contact')} style={{ fontSize: 15, padding: '14px 36px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                <path d="M5 3v4"/>
                <path d="M19 17v4"/>
              </svg>
              {t.franchisePage.ctaEnquire}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FranchisePage;
