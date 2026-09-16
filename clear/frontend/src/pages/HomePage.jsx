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
  const [videoReviewModal, setVideoReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', service: '', rating: 5, file: null, dragging: false });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { setActiveVideo(null); setVideoReviewModal(false); }
    };
    if (activeVideo || videoReviewModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideo, videoReviewModal]);

  const newsItems = lang === 'vi' ? newsItemsVi : newsItemsEn;



  return (
    <>
    <main>
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
                {t.hero.sub1 && <span className="hero-subtitle-line">{t.hero.sub1}</span>}
                {t.hero.sub2 && <span className="hero-subtitle-line">{t.hero.sub2}</span>}
                {t.hero.sub3 && <span className="hero-subtitle-line">{t.hero.sub3}</span>}
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
                    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&q=80',
                  ][idx]}
                  alt={card.title}
                />
                <div className="promo-card-body">
                  <div className="promo-num">{card.num}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  {card.href === '#video-review' ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => { setReviewSubmitted(false); setReviewForm({ name: '', service: '', rating: 5, file: null, dragging: false }); setVideoReviewModal(true); }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" />
                      </svg>
                      {card.btn}
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => navigate(card.href)}>
                      {card.btn}
                    </button>
                  )}
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

      {/* ===== VIDEO REVIEW MODAL ===== */}
      {videoReviewModal && (
        <div
          className="video-lightbox-backdrop"
          onClick={() => setVideoReviewModal(false)}
          style={{ zIndex: 10000 }}
        >
          <div
            className="video-lightbox-dialog"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 520, borderRadius: 20, padding: 0, overflow: 'hidden' }}
          >
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #0891b2 100%)',
              padding: '24px 28px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>
                    {lang === 'vi' ? 'Gửi Video Đánh Giá' : 'Submit a Video Review'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                    {lang === 'vi' ? 'Chia sẻ trải nghiệm của bạn' : 'Share your experience with us'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setVideoReviewModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8,
                  width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                aria-label="Đóng"
              >✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ background: '#0f172a', padding: '24px 28px 28px' }}>
              {reviewSubmitted ? (
                /* ── Success State ── */
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), #0891b2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
                    {lang === 'vi' ? '🎉 Cảm ơn bạn!' : '🎉 Thank You!'}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 24 }}>
                    {lang === 'vi'
                      ? 'Video đánh giá của bạn đã được gửi thành công. Đội ngũ TLaundry sẽ xem xét và liên hệ với bạn trong vòng 24 giờ. Bạn sẽ nhận được phần thưởng đặc biệt!'
                      : 'Your video review has been submitted successfully. Our team will review it and contact you within 24 hours. You will receive a special reward!'}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setVideoReviewModal(false)}
                    style={{ margin: '0 auto' }}
                  >
                    {lang === 'vi' ? 'Đóng' : 'Close'}
                  </button>
                </div>
              ) : (
                /* ── Upload Form ── */
                <>
                  {/* Name */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      {lang === 'vi' ? 'Họ & Tên *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'vi' ? 'Nguyễn Văn A...' : 'John Smith...'}
                      value={reviewForm.name}
                      onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Service */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      {lang === 'vi' ? 'Dịch Vụ Đã Dùng *' : 'Service Used *'}
                    </label>
                    <select
                      value={reviewForm.service}
                      onChange={e => setReviewForm(f => ({ ...f, service: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                        color: reviewForm.service ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 14, outline: 'none',
                        boxSizing: 'border-box', cursor: 'pointer'
                      }}
                    >
                      <option value="" style={{ color: '#333' }}>{lang === 'vi' ? '-- Chọn dịch vụ --' : '-- Select service --'}</option>
                      <option value="wash-fold" style={{ color: '#333' }}>{lang === 'vi' ? 'Giặt Sấy & Gấp Gọn' : 'Wash, Dry & Fold'}</option>
                      <option value="dry-clean" style={{ color: '#333' }}>{lang === 'vi' ? 'Giặt Khô / Giặt Hấp' : 'Dry Cleaning'}</option>
                      <option value="ironing" style={{ color: '#333' }}>{lang === 'vi' ? 'Là/Ủi Quần Áo' : 'Ironing Service'}</option>
                      <option value="commercial" style={{ color: '#333' }}>{lang === 'vi' ? 'Giặt Ủi Thương Mại' : 'Commercial Laundry'}</option>
                    </select>
                  </div>

                  {/* Star Rating */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      {lang === 'vi' ? 'Xếp Hạng' : 'Your Rating'}
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 28, lineHeight: 1, padding: 2,
                            color: star <= reviewForm.rating ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                            transition: 'color 0.15s, transform 0.15s',
                            transform: star <= reviewForm.rating ? 'scale(1.1)' : 'scale(1)'
                          }}
                        >★</button>
                      ))}
                    </div>
                  </div>

                  {/* Drop Zone */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      {lang === 'vi' ? 'Tải Video Lên *' : 'Upload Video *'}
                    </label>
                    <label
                      htmlFor="video-upload-input"
                      onDragOver={e => { e.preventDefault(); setReviewForm(f => ({ ...f, dragging: true })); }}
                      onDragLeave={() => setReviewForm(f => ({ ...f, dragging: false }))}
                      onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith('video/')) setReviewForm(f => ({ ...f, file, dragging: false }));
                      }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        border: `2px dashed ${reviewForm.dragging ? 'var(--primary)' : reviewForm.file ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                        borderRadius: 12, padding: '28px 20px', cursor: 'pointer', textAlign: 'center',
                        background: reviewForm.dragging ? 'rgba(10,184,184,0.08)' : reviewForm.file ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {reviewForm.file ? (
                        <>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <div style={{ color: '#10b981', fontWeight: 600, fontSize: 14 }}>{reviewForm.file.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                            {(reviewForm.file.size / 1024 / 1024).toFixed(1)} MB
                          </div>
                        </>
                      ) : (
                        <>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 10 }}>
                            <polyline points="16 16 12 12 8 16" />
                            <line x1="12" y1="12" x2="12" y2="21" />
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                          </svg>
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                            {lang === 'vi' ? 'Kéo thả video vào đây' : 'Drag & drop your video here'}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                            {lang === 'vi' ? 'hoặc click để chọn file • MP4, MOV, AVI • Tối đa 100MB' : 'or click to browse • MP4, MOV, AVI • Max 100MB'}
                          </div>
                        </>
                      )}
                      <input
                        id="video-upload-input"
                        type="file"
                        accept="video/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) setReviewForm(f => ({ ...f, file }));
                        }}
                      />
                    </label>
                  </div>

                  {/* Reward Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                    border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10,
                    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20
                  }}>
                    <span style={{ fontSize: 20 }}>🎁</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.5 }}>
                      {lang === 'vi'
                        ? 'Video được duyệt sẽ nhận ngay voucher giảm giá 20% cho lần giặt tiếp theo!'
                        : 'Approved videos receive a 20% discount voucher for your next wash!'}
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 15, fontWeight: 700 }}
                    onClick={() => {
                      if (!reviewForm.name.trim() || !reviewForm.service || !reviewForm.file) {
                        alert(lang === 'vi' ? 'Vui lòng điền đầy đủ thông tin và chọn video!' : 'Please fill all fields and select a video!');
                        return;
                      }
                      setReviewSubmitted(true);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    {lang === 'vi' ? 'Gửi Video Đánh Giá' : 'Submit Video Review'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;


