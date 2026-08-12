import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const valuesVi = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
      title: 'Tin Tưởng',
      desc: 'Tất cả các đối tác nhượng quyền đều được xác minh lý lịch bởi cảnh sát và có bảo hiểm đầy đủ.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>
          <path d="M20 3v4M22 5h-4"/>
        </svg>
      ),
      title: 'Chất Lượng',
      desc: 'Chúng tôi sử dụng nước giặt thân thiện môi trường cao cấp và máy móc hiện đại.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      title: 'Tiện Lợi',
      desc: 'Giao nhận miễn phí tận nơi trong 24 giờ — giải quyết việc giặt ủi nhẹ nhàng.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      ),
      title: 'Bền Vững',
      desc: 'Cam kết sử dụng các sản phẩm vệ sinh thân thiện môi trường sản xuất tại Sài Gòn.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
      title: 'Tận Tâm',
      desc: 'Trung tâm hỗ trợ tại Sài Gòn sẵn sàng giải đáp mọi thắc mắc của bạn.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          <path d="m9 8 2 2 4-4"/>
        </svg>
      ),
      title: 'Bảo Hành',
      desc: 'Được bảo chứng bởi Cam Kết Chất Lượng TLaundry — nếu chưa hài lòng, chúng tôi sẽ xử lý lại miễn phí.'
    },
  ];

  const valuesEn = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
      title: 'Trust',
      desc: 'All franchisees are police-checked and fully insured for your peace of mind.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>
          <path d="M20 3v4M22 5h-4"/>
        </svg>
      ),
      title: 'Quality',
      desc: 'We use premium eco-friendly detergents and professional-grade equipment for exceptional results.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      title: 'Convenience',
      desc: 'Free pick-up and delivery within 24 hours — laundry sorted without the hassle.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      ),
      title: 'Sustainability',
      desc: 'Committed to Sài Gònn-made, environmentally friendly cleaning products.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
      title: 'Care',
      desc: 'Sài Gònn-based call centre ready to help with any questions or special requirements.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          <path d="m9 8 2 2 4-4"/>
        </svg>
      ),
      title: 'Guarantee',
      desc: "Backed by TLaundry Work Guarantee — if you're not satisfied, we'll make it right."
    },
  ];

  const values = lang === 'vi' ? valuesVi : valuesEn;

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <h1>{lang === 'vi' ? "Về TLaundry" : "About TLaundry"}</h1>
          <p>{lang === 'vi' ? 'Dịch vụ giặt ủi di động giao nhận tận nơi uy tín hàng đầu tại Sài Gòn, thuộc tập đoàn Jim\'s Group.' : 'Sài Gòn\'s most trusted mobile laundry pick-up and delivery service, backed by the Jim\'s Group.'}</p>
        </div>
      </div>

      {/* About main */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="badge">{lang === 'vi' ? 'Câu Chuyện Của Chúng Tôi' : 'Our Story'}</span>
              <h2>{lang === 'vi' ? 'Mang Dịch Vụ Giặt Ủi Chuyên Nghiệp Đến Tận Cửa Nhà Bạn' : 'Bringing Professional Laundry Services to Your Doorstep'}</h2>
              <p>
                {lang === 'vi'
                  ? "TLaundry thuộc tập đoàn biểu tượng TLaundry Group — mạng lưới nhượng quyền thương hiệu số một tại Sài Gòn với hơn 5,000 đối tác. Chúng tôi đưa sự chuyên nghiệp vào một trong những công việc thiết yếu nhất hàng ngày: giặt ủi."
                  : "TLaundry is part of the iconic TLaundry Group — Sài Gòn's number one franchise network with over 5,000 franchisees. We bring professional care to everyday laundry."
                }
              </p>
              <p>
                {lang === 'vi'
                  ? 'Được thành lập trên nguyên tắc tin cậy, uy tín và chất lượng vượt trội, chúng tôi mang lại giải pháp giặt ủi di động cá nhân hóa cho hộ gia đình, doanh nghiệp và các cơ sở chăm sóc tại Sài Gòn.'
                  : 'Founded on principles of trust and reliability, we provide personalised mobile laundry solutions across Sài Gòn.'
                }
              </p>

              <div className="about-stats">
                {[
                  { strong: '500+', span: lang === 'vi' ? 'Đối Tác' : 'Franchisees' },
                  { strong: '24 Giờ', span: lang === 'vi' ? 'Trả Hàng' : 'Turnaround' },
                  { strong: '100K+', span: lang === 'vi' ? 'Khách Hàng' : 'Happy Customers' },
                ].map(s => (
                  <div key={s.span} className="about-stat">
                    <strong>{s.strong}</strong>
                    <span>{s.span}</span>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary" onClick={() => navigate('/booking')}>
                {t.hero.btnQuote}
              </button>
            </div>
            <div className="about-img">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80"
                alt="TLaundry team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="core-values-section">
        <div className="container">
          <div className="section-title text-center">
            <span className="badge">{lang === 'vi' ? 'Triết Lý Của TLaundry' : 'TLaundry Philosophy'}</span>
            <h2>{lang === 'vi' ? 'Giá Trị Cốt Lõi Của Chúng Tôi' : 'Our Core Values'}</h2>
          </div>
          <div className="values-grid">
            {values.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon-box">
                  {v.icon}
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;


