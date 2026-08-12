import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const reviewsEn = [
  {
    id: 1,
    text: "TLaundry is absolutely amazing! They picked up my clothes on time and returned them fresh and perfectly folded. Couldn't be happier!",
    author: 'Sarah M.',
    location: 'Melbourne, VIC',
    stars: 5,
    color: '#1a237e',
    tag: 'Regular Customer',
  },
  {
    id: 2,
    text: "Incredible service! I use TLaundry every week for my business attire. The quality is consistently excellent and the pick-up and delivery is always on time.",
    author: 'James T.',
    location: 'Sydney, NSW',
    stars: 5,
    color: '#00897b',
    tag: 'Business Client',
  },
  {
    id: 3,
    text: "I'm a busy mum and TLaundry has been a lifesaver! Fresh, clean clothes delivered right to my door. The team is so professional and friendly.",
    author: 'Emily R.',
    location: 'Brisbane, QLD',
    stars: 5,
    color: '#7b1fa2',
    tag: 'Verified Customer',
  },
  {
    id: 4,
    text: "Honestly the best laundry service I've ever used. My white shirts came back whiter than when I bought them! Will never go back to doing laundry myself.",
    author: 'David K.',
    location: 'Perth, WA',
    stars: 5,
    color: '#c62828',
    tag: 'Verified Customer',
  },
  {
    id: 5,
    text: "Super convenient and affordable. I booked online, they came the next morning, and my clothes were back the same evening. Absolutely flawless experience!",
    author: 'Olivia N.',
    location: 'Adelaide, SA',
    stars: 5,
    color: '#e65100',
    tag: 'New Customer',
  },
  {
    id: 6,
    text: "The staff are incredibly careful with delicate fabrics. My silk blouses and woollen jumpers came back in perfect condition. Highly recommend TLaundry!",
    author: 'Grace L.',
    location: 'Canberra, ACT',
    stars: 5,
    color: '#2e7d32',
    tag: 'Regular Customer',
  },
  {
    id: 7,
    text: "I was sceptical at first but TLaundry exceeded all my expectations. Fast, reliable, and the clothes smell amazing. My whole family now uses this service!",
    author: 'Michael B.',
    location: 'Gold Coast, QLD',
    stars: 5,
    color: '#4527a0',
    tag: 'Family Plan',
  },
  {
    id: 8,
    text: "As a restaurant owner, I rely on TLaundry for our uniforms and linens. Consistent quality every single time. They've never let us down in two years!",
    author: 'Angela W.',
    location: 'Hobart, TAS',
    stars: 5,
    color: '#00695c',
    tag: 'Business Client',
  },
];

const reviewsVi = [
  {
    id: 1,
    text: "Dịch vụ giặt ủi của TLaundry thật sự tuyệt vời! Họ nhận quần áo đúng giờ và trả lại thơm tho, gấp gọn hoàn hảo. Tôi vô cùng hài lòng!",
    author: 'Thanh Mai',
    location: 'Melbourne, VIC',
    stars: 5,
    color: '#1a237e',
    tag: 'Khách thường xuyên',
  },
  {
    id: 2,
    text: "Dịch vụ xuất sắc! Tôi sử dụng TLaundry hàng tuần cho trang phục công sở. Chất lượng luôn luôn tuyệt vời và giao nhận vô cùng đúng giờ.",
    author: 'Quốc Tuấn',
    location: 'Sydney, NSW',
    stars: 5,
    color: '#00897b',
    tag: 'Khách doanh nghiệp',
  },
  {
    id: 3,
    text: "Tôi là một người mẹ bận rộn và TLaundry thực sự là cứu tinh! Quần áo sạch sẽ, thơm tho được giao tận cửa. Đội ngũ rất chuyên nghiệp và thân thiện.",
    author: 'Bích Phương',
    location: 'Brisbane, QLD',
    stars: 5,
    color: '#7b1fa2',
    tag: 'Đã xác minh',
  },
  {
    id: 4,
    text: "Thành thật mà nói, đây là dịch vụ giặt ủi tốt nhất tôi từng dùng. Áo sơ mi trắng của tôi trở nên trắng hơn cả lúc mới mua! Sẽ không bao giờ tự giặt nữa.",
    author: 'Minh Khoa',
    location: 'Perth, WA',
    stars: 5,
    color: '#c62828',
    tag: 'Đã xác minh',
  },
  {
    id: 5,
    text: "Tiện lợi và giá cả phải chăng. Tôi đặt lịch online, sáng hôm sau họ đến lấy, tối cùng ngày quần áo đã được trả về. Trải nghiệm hoàn toàn hoàn hảo!",
    author: 'Hồng Nhung',
    location: 'Adelaide, SA',
    stars: 5,
    color: '#e65100',
    tag: 'Khách mới',
  },
  {
    id: 6,
    text: "Nhân viên rất cẩn thận với các loại vải mỏng manh. Áo lụa và áo len của tôi được trả về trong tình trạng hoàn hảo. Tôi thực sự khuyến nghị TLaundry!",
    author: 'Lệ Giang',
    location: 'Canberra, ACT',
    stars: 5,
    color: '#2e7d32',
    tag: 'Khách thường xuyên',
  },
  {
    id: 7,
    text: "Lúc đầu tôi còn nghi ngờ nhưng TLaundry đã vượt quá mọi kỳ vọng. Nhanh, đáng tin cậy và quần áo thơm phức. Cả gia đình tôi bây giờ đều dùng dịch vụ này!",
    author: 'Văn Đức',
    location: 'Gold Coast, QLD',
    stars: 5,
    color: '#4527a0',
    tag: 'Gói gia đình',
  },
  {
    id: 8,
    text: "Là chủ nhà hàng, tôi dựa vào TLaundry cho đồng phục và khăn trải bàn. Chất lượng nhất quán mỗi lần. Họ chưa bao giờ để tôi thất vọng trong hai năm qua!",
    author: 'Thu Hằng',
    location: 'Hobart, TAS',
    stars: 5,
    color: '#00695c',
    tag: 'Khách doanh nghiệp',
  },
];

const GAP = 24;

const getVisible = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
};

const StarIcon = ({ filled = true }) => (
  <span style={{ color: filled ? '#f59e0b' : '#e5e7eb', fontSize: 18 }}>★</span>
);

const QuoteIcon = () => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" style={{ opacity: 0.12, flexShrink: 0 }}>
    <path d="M0 22V13.4C0 9.8 0.9 6.9 2.7 4.7C4.5 2.5 7.1 1 10.5 0.2L11.8 2.8C9.8 3.4 8.2 4.4 7 5.8C5.8 7.2 5.1 8.9 4.9 11H9V22H0ZM17 22V13.4C17 9.8 17.9 6.9 19.7 4.7C21.5 2.5 24.1 1 27.5 0.2L28.8 2.8C26.8 3.4 25.2 4.4 24 5.8C22.8 7.2 22.1 8.9 21.9 11H26V22H17Z" fill="currentColor" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReviewsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visible, setVisible] = useState(getVisible());
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const reviewsList = lang === 'vi' ? reviewsVi : reviewsEn;
  const maxIndex = Math.max(0, reviewsList.length - visible);

  // Compute card width + visible count from real container size
  const updateLayout = useCallback(() => {
    const v = getVisible();
    setVisible(v);
    if (wrapperRef.current) {
      const w = wrapperRef.current.clientWidth;
      setCardWidth((w - GAP * (v - 1)) / v);
    }
  }, []);

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  // Reset to 0 when visible count changes to avoid out-of-bound index
  useEffect(() => {
    setCurrent(0);
  }, [visible]);

  const prev = () => setCurrent(c => Math.max(c - 1, 0));
  const next = () => setCurrent(c => Math.min(c + 1, maxIndex));

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const translateX = cardWidth ? current * (cardWidth + GAP) : 0;

  // Dot groups (one dot per "page")
  const pageCount = maxIndex + 1;

  return (
    <section className="testimonials-top">
      <div className="container">
        {/* Header */}
        <div className="reviews-header">
          {/* Overline — spaced uppercase, kiến trúc style */}
          <div className="reviews-overline">
            {lang === 'vi' ? 'Đánh giá khách hàng' : 'Customer Reviews'}
          </div>

          {/* Rating badge */}
          <div className="reviews-rating-badge">
            <div className="reviews-badge-stars">
              {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
            </div>
            <span className="reviews-badge-score">5.0</span>
            <span className="reviews-badge-sep">·</span>
            <span className="reviews-badge-count">200+ {lang === 'vi' ? 'đánh giá' : 'reviews'}</span>
          </div>

          {/* Display heading — Cormorant Garamond với italic accent */}
          <h2>
            {lang === 'vi'
              ? <>Xem Khách Hàng Nói Gì Về <em>Dịch Vụ Giặt Ủi</em> Của TLaundry</>
              : <>What Customers Say About Our <em>Laundry Service</em></>}
          </h2>

          {/* Thin divider */}
          <div className="reviews-divider">
            <div className="reviews-divider-dot" />
          </div>

          <p className="reviews-subtitle">
            {lang === 'vi'
              ? 'Hàng nghìn khách hàng tin tưởng chúng tôi mỗi tuần'
              : 'Thousands of happy customers trust us every week'}
          </p>
        </div>

        {/* Carousel */}
        <div className="carousel-track-wrapper" ref={wrapperRef}>
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${translateX}px)`,
              gap: GAP,
            }}
          >
            {reviewsList.map(r => (
              <div
                key={r.id}
                className="review-card"
                style={{ width: cardWidth || undefined, flexShrink: 0 }}
              >
                {/* Quote mark */}
                <div className="review-card-top">
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < r.stars} />
                    ))}
                  </div>
                  <QuoteIcon />
                </div>

                <p className="review-text">{r.text}</p>

                <div className="review-footer">
                  <div className="review-author">
                    <div className="review-avatar" style={{ background: r.color }}>
                      {r.author[0]}
                    </div>
                    <div className="review-info">
                      <div className="review-name-row">
                        <strong>{r.author}</strong>
                        <VerifiedIcon />
                      </div>
                      <span className="review-location">{r.location}</span>
                    </div>
                  </div>
                  <span className="review-tag">{r.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls + Dots */}
        <div className="carousel-bottom">
          <button
            className="carousel-btn"
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="carousel-dots">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="carousel-btn"
            onClick={next}
            disabled={current === maxIndex}
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn btn-primary" onClick={() => navigate('/booking')}>
            {t.reviews.btnQuote}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;
