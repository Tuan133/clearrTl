import { useNavigate } from 'react-router-dom';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { useLanguage } from '../context/LanguageContext';
import { WHY_ICONS } from '../components/WhyIcons';

const instaPosts = [
  { img: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=300&q=80', label: 'Gumdale' },
  { img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80', label: 'And I was' },
  { img: 'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?w=300&q=80', label: 'CHOOSE LAUNDRY' },
  { img: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=300&q=80', label: 'Pickup service' },
];

const newsItemsVi = [
  {
    cat: 'Mẹo Giặt Ủi',
    title: 'Cách Tẩy Các Vết Bẩn Cứng Đầu Trên Quần Áo Yêu Thích',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80',
  },
  {
    cat: 'Cập Nhật Dịch Vụ',
    title: "TLaundry Mở Rộng Chi Nhánh Mới Trên Toàn Sài Gòn",
    img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=300&q=80',
  },
  {
    cat: 'Thân Thiện Môi Trường',
    title: 'Cam Kết Sử Dụng Nước Giặt Sản Xuất tại Sài Gòn & An Toàn Môi Trường',
    img: 'https://images.unsplash.com/photo-1612965607446-25e1332775ae?w=300&q=80',
  },
  {
    cat: 'Nhượng Quyền',
    title: "5 Lý Do Vì Sao Nhượng Quyền TLaundry Là Hướng Đi Kinh Doanh Thông Minh",
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80',
  },
];

const newsItemsEn = [
  {
    cat: 'Laundry Tips',
    title: 'How to Remove Tough Stains From Your Favourite Clothes',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80',
  },
  {
    cat: 'Service Updates',
    title: "TLaundry Expands to New Regions across Sài Gòn",
    img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=300&q=80',
  },
  {
    cat: 'Eco Friendly',
    title: 'Our Commitment to Using Eco-Friendly, Sài Gònn-Made Detergents',
    img: 'https://images.unsplash.com/photo-1612965607446-25e1332775ae?w=300&q=80',
  },
  {
    cat: 'Franchise',
    title: "5 Reasons Why Becoming a TLaundry Franchisee is a Smart Business Move",
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const newsItems = lang === 'vi' ? newsItemsVi : newsItemsEn;

  const serviceImages = [
    { name: t.header.domestic, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
    { name: t.header.commercial, img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=300&q=80' },
    { name: t.header.ironing, img: 'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=300&q=80' },
    { name: t.header.dryCleaning, img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&q=80' },
  ];

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">

            {/* ── Cột trái: nội dung chính ── */}
            <div className="hero-content">
              <h1>
                {t.hero.title1}{' '}
                <span>{t.hero.title2}</span>{' '}
                {t.hero.title3}
              </h1>
              <p>{t.hero.subtitle}</p>
              <button className="hero-btn" onClick={() => navigate('/booking')}>
                {t.hero.btnQuote}
              </button>
            </div>

            {/* ── Cột phải: Quick Booking Card ── */}
            <div className="hero-card">
              <div className="hero-card-title">
                {lang === 'vi' ? '📦 Đặt Dịch Vụ Nhanh' : '📦 Quick Booking'}
              </div>
              <div className="hero-card-sub">
                {lang === 'vi' ? 'Nhận & Giao tận nơi trong 24h' : 'Pickup & Delivery within 24h'}
              </div>

              <div className="hero-card-form">
                <div className="hero-card-field">
                  <label>{lang === 'vi' ? 'Dịch vụ' : 'Service'}</label>
                  <select onClick={(e) => e.stopPropagation()} onChange={(e) => {
                    if (e.target.value) navigate('/booking');
                  }}>
                    <option value="">{lang === 'vi' ? '— Chọn dịch vụ —' : '— Select service —'}</option>
                    <option>{lang === 'vi' ? 'Giặt & Sấy Gia Đình' : 'Domestic Wash & Dry'}</option>
                    <option>{lang === 'vi' ? 'Giặt Thương Mại' : 'Commercial Laundry'}</option>
                    <option>{lang === 'vi' ? 'Giặt Ủi' : 'Wash & Iron'}</option>
                    <option>{lang === 'vi' ? 'Giặt Khô' : 'Dry Cleaning'}</option>
                  </select>
                </div>

                <div className="hero-card-field">
                  <label>{lang === 'vi' ? 'Địa chỉ lấy hàng' : 'Pickup address'}</label>
                  <input
                    type="text"
                    placeholder={lang === 'vi' ? 'Nhập địa chỉ của bạn…' : 'Enter your address…'}
                    onFocus={(e) => { e.target.placeholder = ''; }}
                    onBlur={(e) => { e.target.placeholder = lang === 'vi' ? 'Nhập địa chỉ của bạn…' : 'Enter your address…'; }}
                  />
                </div>

                <div className="hero-card-divider" />

                <button className="hero-card-btn" onClick={() => navigate('/booking')}>
                  {lang === 'vi' ? 'Yêu Cầu Báo Giá Miễn Phí →' : 'Get a Free Quote →'}
                </button>
              </div>

              <div className="hero-card-badges">
                <span className="hero-card-badge">
                  <span className="hero-card-badge-dot" />
                  {lang === 'vi' ? 'Báo giá miễn phí' : 'Free quote'}
                </span>
                <span className="hero-card-badge">
                  <span className="hero-card-badge-dot" />
                  {lang === 'vi' ? 'Giao trong 24h' : '24h delivery'}
                </span>
                <span className="hero-card-badge">
                  <span className="hero-card-badge-dot" />
                  {lang === 'vi' ? 'Cam kết chất lượng' : 'Quality guaranteed'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          {[...t.trustBar, ...t.trustBar].map((item, i) => (
            <span key={i} className="trust-item">
              <span className="trust-dot" />
              <strong>{item}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* ===== REVIEWS CAROUSEL ===== */}
      <ReviewsCarousel />

      {/* ===== WHO WE ARE ===== */}
      <section className="who-we-are">
        <div className="container">
          <div className="who-grid">
            <div className="who-content">
              <span className="badge">{t.whoWeAre.badge}</span>
              <h2>
                {lang === 'vi'
                  ? <><em>Dịch Vụ Giặt Ủi</em> Di Động Nhận & Giao Tận Nơi Được Tin Tưởng Nhất tại Sài Gòn</>
                  : <><em>Mobile Laundry</em> Pick-up & Delivery — Sài Gòn's Most Trusted</>}
              </h2>
              <p>{t.whoWeAre.desc1}</p>
              <p>{t.whoWeAre.desc2}</p>
              <div className="who-features">
                {t.whoWeAre.features.map(f => (
                  <div key={f} className="who-feature">
                    <div className="who-feature-icon">✓</div>
                    {f}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/about')}>
                {t.whoWeAre.btnLearn}
              </button>
            </div>
            <div className="who-video">
              <img
                src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=700&q=80"
                alt="TLaundry team"
              />
              <div className="play-btn">
                <div className="play-circle">
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3-STEP PROMO CARDS ===== */}
      <section className="promo-grid-section">
        <div className="container">
          <div className="promo-grid">
            {t.promoCards.map((card, idx) => (
              <div key={card.num} className="promo-card">
                <img
                  className="promo-card-img"
                  src={[
                    'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=500&q=80',
                    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
                  ][idx]}
                  alt={card.title}
                />
                <div className="promo-card-body">
                  <div className="promo-num">{card.num}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <button className="btn btn-primary" onClick={() => navigate(card.href)}>
                    {card.btn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services-section">
        <div className="container">
          <div className="services-header">
            <h2>{t.servicesSection.title}</h2>
            <p>{t.servicesSection.desc}</p>
          </div>
          <span className="badge">{t.servicesSection.badge}</span>

          <div className="services-grid">
            {serviceImages.map((svc, i) => (
              <div
                key={svc.name}
                className={`service-card ${i === 0 ? 'active' : ''}`}
                onClick={() => navigate('/services')}
              >
                <div className="service-img-wrap">
                  <img src={svc.img} alt={svc.name} />
                </div>
                <div className="service-card-body">
                  <h3>{svc.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW TO BOOK ===== */}
      <section className="how-to-book">
        <div className="container">
          <div className="how-header">
            <h2>{t.howToBook.title1} <span>{t.howToBook.title2}</span></h2>
            <p>{t.howToBook.desc}</p>
            <button className="btn btn-outline" onClick={() => navigate('/booking')}>
              {t.howToBook.btn}
            </button>
          </div>

          <div className="steps-grid">
            {t.howToBook.steps.map((s, idx) => {
              const renderIcon = () => {
                if (idx === 0) return (
                  // Yêu cầu báo giá — speech bubble + quote
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="6" y="10" width="36" height="26" rx="6" fill="white" fillOpacity="0.9"/>
                    <path d="M18 36L14 44l10-8" fill="white" fillOpacity="0.9"/>
                    <circle cx="18" cy="23" r="2.5" fill="#0ab8b8"/>
                    <circle cx="26" cy="23" r="2.5" fill="#0ab8b8"/>
                    <circle cx="34" cy="23" r="2.5" fill="#0ab8b8"/>
                    <circle cx="42" cy="16" r="8" fill="#0ab8b8"/>
                    <path d="M39 16h6M42 13v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                );
                if (idx === 1) return (
                  // Hẹn giờ lấy hàng — đồng hồ + calendar
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="8" y="12" width="34" height="30" rx="5" fill="white" fillOpacity="0.9"/>
                    <rect x="8" y="12" width="34" height="9" rx="5" fill="#0ab8b8"/>
                    <circle cx="18" cy="16.5" r="2" fill="white"/>
                    <circle cx="32" cy="16.5" r="2" fill="white"/>
                    <rect x="14" y="27" width="6" height="5" rx="1.5" fill="#0ab8b8" fillOpacity="0.7"/>
                    <rect x="23" y="27" width="6" height="5" rx="1.5" fill="#0ab8b8" fillOpacity="0.7"/>
                    <rect x="32" y="27" width="6" height="5" rx="1.5" fill="#0ab8b8" fillOpacity="0.4"/>
                    <path d="M16 10v5M34 10v5" stroke="#0ab8b8" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                );
                if (idx === 2) return (
                  // Chúng tôi đến lấy — xe tải + mũi tên
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="6" y="20" width="30" height="18" rx="4" fill="white" fillOpacity="0.9"/>
                    <path d="M36 24l10 6v8H36V24Z" fill="white" fillOpacity="0.7"/>
                    <circle cx="15" cy="39" r="4" fill="#0ab8b8"/>
                    <circle cx="38" cy="39" r="4" fill="#0ab8b8"/>
                    <circle cx="15" cy="39" r="2" fill="white"/>
                    <circle cx="38" cy="39" r="2" fill="white"/>
                    <path d="M36 30h7l3 4h-10v-4Z" fill="#0ab8b8" fillOpacity="0.5"/>
                    <path d="M10 14l6-5 6 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="9" x2="16" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                );
                if (idx === 3) return (
                  // Nhận quần áo sạch — áo gấp + check
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <path d="M12 20l8-8 8 6 8-6 8 8v22H12V20Z" fill="white" fillOpacity="0.9"/>
                    <path d="M20 12c0 4-3 7-6 8M36 12c0 4 3 7 6 8" stroke="white" fillOpacity="0.6" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="22" y="28" width="12" height="14" rx="2" fill="#0ab8b8" fillOpacity="0.6"/>
                    <path d="M26 34l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="44" cy="14" r="8" fill="#0ab8b8"/>
                    <path d="M41 14l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                );
                return null;
              };
              return (
                <div key={s.step} className={`step-card step-card--${idx + 1}`}>
                  <div className="step-circle">
                    {renderIcon()}
                  </div>
                  <h3>{s.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="why-section">
        <div className="container">
          <h2>{t.whyChooseUs.title1} <strong>{t.whyChooseUs.title2}</strong></h2>
          <div className="why-grid">
            {t.whyChooseUs.items.map((label, idx) => {
              const IconComp = WHY_ICONS[idx];
              return (
                <div key={label} className="why-card">
                  <div className="why-icon">
                    {IconComp ? <IconComp size={40} /> : null}
                  </div>
                  <h3>{label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL TESTIMONIALS ===== */}
      <section className="social-testimonials">
        <div className="container">

          {/* ── Header centered ── */}
          <div className="social-header">
            <span className="badge">{t.socialTestimonials.badge}</span>
            <div className="social-stars">
              {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
            </div>
            <h2>
              {lang === 'vi'
                ? <><em>Đánh Giá</em> Từ Khách Hàng</>
                : <><em>Customer</em> Reviews</>}
            </h2>
            <p>{t.socialTestimonials.desc}</p>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate('/contact')}>
              {t.socialTestimonials.btn}
            </button>
          </div>

          {/* ── Video grid — 3 cards landscape ── */}
          <div className="social-videos">
            {[
              {
                handle: '@tlaundrysaigon',
                label: lang === 'vi' ? 'Nhận đồ tại nhà' : 'Home Pickup',
                src: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=600&q=80',
                views: '12K'
              },
              {
                handle: '@tlaundryvn',
                label: lang === 'vi' ? 'Giặt chuyên nghiệp' : 'Pro Laundry',
                src: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&q=80',
                views: '8.4K'
              },
              {
                handle: '@tlaundryhcm',
                label: lang === 'vi' ? 'Giao tận cửa' : 'Delivered Fresh',
                src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
                views: '21K'
              },
            ].map(v => (
              <div key={v.handle} className="social-video-card">
                <img src={v.src} alt={v.label} loading="lazy" />
                <div className="video-overlay">
                  {/* Top: avatar + handle */}
                  <div className="video-header">
                    <div className="video-avatar">T</div>
                    <div className="video-info">
                      <strong>{v.handle}</strong>
                      <span>TLaundry</span>
                    </div>
                  </div>
                  {/* Center: play button */}
                  <div className="play-btn-red">
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                      <circle cx="26" cy="26" r="26" fill="rgba(0,0,0,0.45)"/>
                      <circle cx="26" cy="26" r="22" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
                      <polygon points="21,17 21,35 38,26" fill="white"/>
                    </svg>
                  </div>
                  {/* Bottom: label + views */}
                  <div className="video-footer-info">
                    <span className="video-label">{v.label}</span>
                    <span className="video-views">👁 {v.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== INSTAGRAM FEED ===== */}
      <section className="instagram-section">
        <div className="container">
          <div className="instagram-header">
            <h2>{t.instagram.title}</h2>
            <div className="instagram-handle">@tlaundry.by.tnt</div>
          </div>
          <div className="instagram-grid">
            {instaPosts.map((p, i) => (
              <div key={i} className="insta-post">
                <img src={p.img} alt={p.label} />
                <div className="insta-play">
                  <svg width="44" height="44" viewBox="0 0 68 48" fill="none">
                    <rect width="68" height="48" rx="10" fill="#ff0000" fillOpacity="0.85"/>
                    <polygon points="26,14 26,34 46,24" fill="white"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className="instagram-ctas">
            <a
              href="https://www.instagram.com/tlaundry.by.tnt/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              {t.instagram.btnFollow}
            </a>
          </div>
        </div>
      </section>



      {/* ===== NEWS ===== */}
      <section className="news-section">
        <div className="container">
          <h2>{t.news.title}</h2>
          <div className="news-grid">
            {newsItems.map(n => (
              <div key={n.title} className="news-card">
                <div className="news-card-img">
                  <img src={n.img} alt={n.title} />
                </div>
                <div className="news-card-body">
                  <span className="news-category">{n.cat}</span>
                  <h3>{n.title}</h3>
                  <button className="news-read-more">{t.news.readMore}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;


