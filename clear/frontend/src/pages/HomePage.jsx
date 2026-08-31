import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { useLanguage } from '../context/LanguageContext';
import { WHY_ICONS } from '../components/WhyIcons';

const customerVideos = [
  {
    id: 'video-1',
    name: 'Chị Hoàng Yến',
    handle: '@hoangyen.pham',
    roleVi: 'Trưởng phòng Marketing • Quận 1, TP.HCM',
    roleEn: 'Marketing Manager • District 1, HCMC',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
    poster: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    serviceVi: 'Giặt Sấy & Gấp Gọn Tiêu Chuẩn',
    serviceEn: 'Standard Wash, Dry & Fold',
    quoteVi: '“Đồ giặt giao về thơm phức hương hoa, từng chiếc sơ mi gấp phẳng phiu. Tiết kiệm cho mình cả buổi tối bận rộn!”',
    quoteEn: '“Clothes arrived smelling fresh with delicate floral scent, perfectly folded. Saved me entire busy evenings!”',
    duration: '0:45',
    views: '14.5K',
    rating: 5,
  },
  {
    id: 'video-2',
    name: 'Anh Minh Tuấn',
    handle: '@tuanminh.ceo',
    roleVi: 'Chủ chuỗi F&B • Thảo Điền, TP. Thủ Đức',
    roleEn: 'F&B Business Owner • Thao Dien',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80',
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    serviceVi: 'Giặt Hấp Áo Vest & Sơ Mi Cao Cấp',
    serviceEn: 'Premium Dry Cleaning & Suit Care',
    quoteVi: '“Bộ vest đắt tiền giao đi nhận về giữ nguyên form dáng, sợi vải mềm và phẳng phiu. Dịch vụ đúng chuẩn 5 sao!”',
    quoteEn: '“My expensive suits retained their perfect shape, crisp and elegant. Truly 5-star professional service!”',
    duration: '1:10',
    views: '28.2K',
    rating: 5,
  },
  {
    id: 'video-3',
    name: 'Gia đình Chị Mai Phương',
    handle: '@phuongmai.family',
    roleVi: 'Bác sĩ Nha khoa • Landmark 81, Bình Thạnh',
    roleEn: 'Dentist • Landmark 81, Binh Thanh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80',
    poster: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    serviceVi: 'Nước Giặt Organic Sinh Học Cho Bé',
    serviceEn: 'Baby Organic Hypoallergenic Formula',
    quoteVi: '“Da bé nhà mình cực kỳ nhạy cảm nhưng nước giặt organic của TLaundry êm dịu vô cùng, shipper giao tận cửa đúng giờ.”',
    quoteEn: '“Baby skin is super sensitive but TLaundry organic wash is so gentle, pickup and delivery right on time.”',
    duration: '0:55',
    views: '19.8K',
    rating: 5,
  },
];

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
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveVideo(null);
    };
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideo]);

  const newsItems = lang === 'vi' ? newsItemsVi : newsItemsEn;



  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">

            {/* ── Nội dung chính ── */}
            <div className="hero-content">
              <h1>
                <span className="hero-title-line">{t.hero.title1}</span>
                <span className="hero-title-line hero-title-line--accent">{t.hero.title2}</span>
                <span className="hero-title-line">{t.hero.title3}</span>
              </h1>
              <p className="hero-subtitle">
                <span className="hero-subtitle-line">{t.hero.sub1}</span>
                <span className="hero-subtitle-line">{t.hero.sub2}</span>
                <span className="hero-subtitle-line">{t.hero.sub3}</span>
              </p>
              <button className="hero-btn" onClick={() => navigate('/booking')}>
                {t.hero.btnQuote}
              </button>
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

      {/* ===== CUSTOMER VIDEO TESTIMONIALS ===== */}
      <section className="social-testimonials">
        <div className="container">

          {/* ── Header centered ── */}
          <div className="social-header">
            <span className="badge">{lang === 'vi' ? 'Video Thực Tế' : 'Real Stories'}</span>
            <div className="social-stars">
              {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
            </div>
            <h2>
              {lang === 'vi'
                ? <>Video <em>Đánh Giá</em> Từ Khách Hàng</>
                : <>Customer <em>Video Reviews</em></>}
            </h2>
            <p>
              {lang === 'vi'
                ? 'Lắng nghe trải nghiệm chân thực từ những khách hàng đã tin tưởng sử dụng dịch vụ giặt ủi giao nhận của TLaundry.'
                : 'Hear real stories and authentic reviews from customers who trust TLaundry for their daily laundry care.'}
            </p>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate('/booking')}>
              {lang === 'vi' ? 'Đặt Dịch Vụ Ngay →' : 'Book Service Now →'}
            </button>
          </div>

          {/* ── Video grid — 3 modern vertical cards ── */}
          <div className="customer-videos-grid">
            {customerVideos.map(v => {
              const role = lang === 'vi' ? v.roleVi : v.roleEn;
              const service = lang === 'vi' ? v.serviceVi : v.serviceEn;
              const quote = lang === 'vi' ? v.quoteVi : v.quoteEn;

              return (
                <div
                  key={v.id}
                  className="customer-video-card"
                  onClick={() => setActiveVideo(v)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Xem video đánh giá từ ${v.name}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveVideo(v); }}
                >
                  {/* Poster Image */}
                  <img src={v.poster} alt={v.name} className="customer-video-poster" loading="lazy" />

                  {/* Gradient Overlay */}
                  <div className="customer-video-overlay">
                    {/* Top: Customer Profile */}
                    <div className="customer-video-top">
                      <div className="customer-video-author">
                        <img src={v.avatar} alt={v.name} className="customer-video-avatar" />
                        <div className="customer-video-meta">
                          <div className="customer-video-name">
                            <strong>{v.name}</strong>
                            <span className="customer-video-verified" title={lang === 'vi' ? 'Khách hàng đã xác thực' : 'Verified customer'}>
                              ✓
                            </span>
                          </div>
                          <span className="customer-video-role">{role}</span>
                        </div>
                      </div>
                      <span className="customer-video-service-tag">{service}</span>
                    </div>

                    {/* Center: Glowing Pulse Play Button */}
                    <div className="customer-video-play-wrap">
                      <div className="customer-video-play-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <polygon points="6,3 20,12 6,21" />
                        </svg>
                      </div>
                      <span className="customer-video-play-hint">{lang === 'vi' ? 'Bấm để xem video' : 'Tap to watch'}</span>
                    </div>

                    {/* Bottom: Review quote + Stats */}
                    <div className="customer-video-bottom">
                      <div className="customer-video-stars">
                        {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
                        <span className="customer-video-score">5.0</span>
                      </div>
                      <p className="customer-video-quote">{quote}</p>
                      <div className="customer-video-stats">
                        <span className="customer-video-duration">⏱ {v.duration}</span>
                        <span className="customer-video-views">👁 {v.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Video Lightbox Modal ── */}
          {activeVideo && (
            <div className="video-lightbox-backdrop" onClick={() => setActiveVideo(null)}>
              <div className="video-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="video-lightbox-header">
                  <div className="video-lightbox-author">
                    <img src={activeVideo.avatar} alt={activeVideo.name} className="video-lightbox-avatar" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: 16, color: '#ffffff' }}>{activeVideo.name}</strong>
                        <span className="customer-video-verified">✓</span>
                      </div>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                        {lang === 'vi' ? activeVideo.roleVi : activeVideo.roleEn}
                      </span>
                    </div>
                  </div>
                  <button
                    className="video-lightbox-close"
                    onClick={() => setActiveVideo(null)}
                    aria-label="Đóng video"
                  >
                    ✕
                  </button>
                </div>

                {/* Video Player */}
                <div className="video-lightbox-player">
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    poster={activeVideo.poster}
                    className="video-lightbox-video"
                  />
                </div>

                {/* Quote details */}
                <div className="video-lightbox-footer">
                  <div className="customer-video-stars" style={{ marginBottom: 6 }}>
                    {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
                    <span className="customer-video-score" style={{ color: '#ffffff' }}>5.0 · {lang === 'vi' ? activeVideo.serviceVi : activeVideo.serviceEn}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14.5, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', lineHeight: 1.6 }}>
                    {lang === 'vi' ? activeVideo.quoteVi : activeVideo.quoteEn}
                  </p>
                </div>
              </div>
            </div>
          )}

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


