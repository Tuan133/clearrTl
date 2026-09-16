import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

/**
 * ============================================================================
 * 📝 DANH SÁCH ĐÁNH GIÁ THỰC TẾ (REAL CUSTOMER REVIEWS)
 * ============================================================================
 * Hiện tại để trống `[]` theo yêu cầu (chưa có đánh giá thực tế).
 * Giao diện hiển thị các ô / button khoảng trống tinh gọn (Placeholder Slots)
 * với thiết kế chuyên nghiệp, sẵn sàng để khách hàng gửi đánh giá hoặc bạn chèn dữ liệu thật vào.
 * 
 * 👉 KHI CÓ ĐÁNH GIÁ THẬT:
 * Bạn chỉ cần thêm các object đánh giá vào mảng bên dưới theo cấu trúc mẫu:
 * 
 * {
 *   id: 1,
 *   text: "Dịch vụ giặt ủi của TLaundry thật sự tuyệt vời! Quần áo thơm tho, giao đúng hẹn.",
 *   author: 'Nguyễn Văn A',
 *   location: 'Quận 1, TP.HCM',
 *   stars: 5,
 *   color: '#0ab8b8',
 *   tag: 'Khách thường xuyên',
 * }
 * ============================================================================
 */
const initialReviewsEn = [
  // Thêm đánh giá tiếng Anh vào đây khi có dữ liệu thật
];

const initialReviewsVi = [
  // Thêm đánh giá tiếng Việt vào đây khi có dữ liệu thật
];

const GAP = 24;

const getVisible = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
};

const StarIcon = ({ filled = true, outline = false }) => (
  <span
    style={{
      color: filled ? '#f59e0b' : outline ? '#cbd5e1' : '#e2e8f0',
      fontSize: 18,
      display: 'inline-block',
      lineHeight: 1,
    }}
  >
    ★
  </span>
);

const QuoteIcon = () => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" style={{ opacity: 0.15, flexShrink: 0 }}>
    <path
      d="M0 22V13.4C0 9.8 0.9 6.9 2.7 4.7C4.5 2.5 7.1 1 10.5 0.2L11.8 2.8C9.8 3.4 8.2 4.4 7 5.8C5.8 7.2 5.1 8.9 4.9 11H9V22H0ZM17 22V13.4C17 9.8 17.9 6.9 19.7 4.7C21.5 2.5 24.1 1 27.5 0.2L28.8 2.8C26.8 3.4 25.2 4.4 24 5.8C22.8 7.2 22.1 8.9 21.9 11H26V22H17Z"
      fill="currentColor"
    />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="#10b981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReviewsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visible, setVisible] = useState(getVisible());
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('tlaundry_user_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    location: '',
    stars: 5,
    tag: 'Khách thường xuyên',
    text: '',
  });

  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const baseReviews = lang === 'vi' ? initialReviewsVi : initialReviewsEn;
  const reviewsList = [...baseReviews, ...userReviews];
  const hasReviews = reviewsList.length > 0;
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

  useEffect(() => {
    setCurrent(0);
  }, [visible, reviewsList.length]);

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, maxIndex));

  // Auto-play only if reviews exist and multiple pages
  useEffect(() => {
    if (!hasReviews || maxIndex === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [hasReviews, maxIndex]);

  // Handle review form submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.text.trim()) {
      alert(lang === 'vi' ? 'Vui lòng nhập tên và nội dung đánh giá!' : 'Please enter your name and review text!');
      return;
    }

    const newRev = {
      id: Date.now(),
      author: reviewForm.author.trim(),
      location: reviewForm.location.trim() || (lang === 'vi' ? 'TP. Hồ Chí Minh' : 'Sài Gòn, Vietnam'),
      stars: reviewForm.stars,
      color: '#0ab8b8',
      tag: reviewForm.tag || (lang === 'vi' ? 'Đã xác minh' : 'Verified Customer'),
      text: reviewForm.text.trim(),
    };

    const updated = [newRev, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem('tlaundry_user_reviews', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setModalSubmitted(true);
  };

  const handleOpenModal = () => {
    setModalSubmitted(false);
    setReviewForm({
      author: '',
      location: '',
      stars: 5,
      tag: lang === 'vi' ? 'Khách thường xuyên' : 'Regular Customer',
      text: '',
    });
    setModalOpen(true);
  };

  const translateX = cardWidth ? current * (cardWidth + GAP) : 0;
  const pageCount = maxIndex + 1;

  // Placeholder slots
  const placeholderSlots = [
    {
      id: 'slot-1',
      badge: lang === 'vi' ? 'Vị trí #1' : 'Slot #1',
    },
    {
      id: 'slot-2',
      badge: lang === 'vi' ? 'Vị trí #2' : 'Slot #2',
    },
    {
      id: 'slot-3',
      badge: lang === 'vi' ? 'Vị trí #3' : 'Slot #3',
    },
  ];

  return (
    <section className="testimonials-top">
      <div className="container">
        {/* Header */}
        <div className="reviews-header">
          {/* Overline */}
          <div className="reviews-overline">
            {t.reviews.overline || (lang === 'vi' ? 'Đánh giá & Phản hồi' : 'Customer Reviews & Feedback')}
          </div>

          {/* Rating badge */}
          <div className="reviews-rating-badge">
            <div className="reviews-badge-stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <span className="reviews-badge-score">
              {hasReviews ? '5.0' : t.reviews.badgeScore || '5.0★'}
            </span>
            <span className="reviews-badge-sep">·</span>
            <span className="reviews-badge-count">
              {hasReviews
                ? `${reviewsList.length} ${lang === 'vi' ? 'đánh giá' : 'reviews'}`
                : t.reviews.badgeCount || (lang === 'vi' ? 'Không gian chờ đánh giá' : 'Review Space')}
            </span>
          </div>

          {/* Display heading */}
          <h2>
            {lang === 'vi' ? (
              <>
                Xem Khách Hàng Nói Gì Về
                <br />
                <span className="reviews-accent">Dịch Vụ Giặt Ủi TLaundry</span>
              </>
            ) : (
              <>
                What Customers Say About Our <span className="reviews-accent">Laundry Service</span>
              </>
            )}
          </h2>

          {/* Thin divider */}
          <div className="reviews-divider">
            <div className="reviews-divider-dot" />
          </div>

          <p className="reviews-subtitle">
            {t.reviews.subtitle ||
              (lang === 'vi'
                ? 'Chúng tôi luôn lắng nghe và sẵn sàng phục vụ với chất lượng tốt nhất'
                : 'We value every feedback and deliver the highest standard of laundry care')}
          </p>
        </div>

        {/* Content Area: Carousel (if has real reviews) or Minimalist Placeholder Slots */}
        {hasReviews ? (
          <>
            <div className="carousel-track-wrapper" ref={wrapperRef}>
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${translateX}px)`,
                  gap: GAP,
                }}
              >
                {reviewsList.map((r) => (
                  <div
                    key={r.id}
                    className="review-card"
                    style={{ width: cardWidth || undefined, flexShrink: 0 }}
                  >
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
                        <div className="review-avatar" style={{ background: r.color || '#0ab8b8' }}>
                          {r.author ? r.author[0].toUpperCase() : 'U'}
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

            {/* Controls + Dots if multiple pages */}
            {pageCount > 1 && (
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
            )}
          </>
        ) : (
          /* ================================================================
             🔲 GIAO DIỆN KHUNG / BUTTON KHOẢNG TRỐNG (MINIMALIST BUTTON SLOTS)
             ================================================================ */
          <div className="review-placeholders-container">
            <div className="review-placeholders-grid">
              {placeholderSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="review-card review-card--placeholder"
                  onClick={handleOpenModal}
                  role="button"
                  tabIndex={0}
                  aria-label={t.reviews.placeholderBtn || 'Gửi Đánh Giá Của Bạn'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleOpenModal();
                  }}
                >
                  {/* Top Bar: Stars + Slot Number Badge */}
                  <div className="review-card-top">
                    <div className="review-stars placeholder-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="placeholder-star-dot">★</span>
                      ))}
                    </div>
                    <span className="placeholder-slot-badge">{slot.badge}</span>
                  </div>

                  {/* Center: Plus Icon Circle + Button Gửi Đánh Giá */}
                  <div className="placeholder-center-action">
                    <div className="placeholder-icon-circle">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      className="placeholder-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal();
                      }}
                    >
                      + {t.reviews.placeholderBtn || (lang === 'vi' ? 'Gửi Đánh Giá Của Bạn' : 'Submit Your Review')}
                    </button>
                  </div>

                  {/* Footer hint */}
                  <div className="placeholder-card-hint">
                    <span>{lang === 'vi' ? 'Bấm để để lại đánh giá của bạn' : 'Click to submit your review'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Bottom CTA */}
        <div className="reviews-bottom-action">
          <button className="btn btn-primary" onClick={() => navigate('/booking')}>
            {t.reviews.btnQuote}
          </button>
          {!hasReviews && (
            <button
              className="btn btn-outline"
              style={{ marginLeft: 12, borderColor: 'var(--primary)', color: 'var(--primary)' }}
              onClick={handleOpenModal}
            >
              + {t.reviews.modalTitle || (lang === 'vi' ? 'Viết Đánh Giá Mới' : 'Write a Review')}
            </button>
          )}
        </div>
      </div>

      {/* ====================================================================
          📝 MODAL VIẾT ĐÁNH GIÁ (INTERACTIVE REVIEW FORM MODAL)
          ==================================================================== */}
      {modalOpen && (
        <div className="review-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="review-modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="review-modal-header">
              <div>
                <h3 className="review-modal-title">
                  {t.reviews.modalTitle || (lang === 'vi' ? 'Gửi Đánh Giá Của Bạn' : 'Submit Your Review')}
                </h3>
                <p className="review-modal-subtitle">
                  {t.reviews.modalSubtitle ||
                    (lang === 'vi'
                      ? 'Chia sẻ cảm nhận chân thực về dịch vụ giặt ủi TLaundry'
                      : 'Share your genuine experience with TLaundry')}
                </p>
              </div>
              <button
                className="review-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Đóng modal"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="review-modal-body">
              {modalSubmitted ? (
                <div className="review-modal-success">
                  <div className="review-success-icon">✓</div>
                  <h4>{t.reviews.thankTitle || (lang === 'vi' ? '🎉 Cảm ơn bạn!' : '🎉 Thank You!')}</h4>
                  <p>
                    {t.reviews.thankDesc ||
                      (lang === 'vi'
                        ? 'Đánh giá của bạn đã được lưu và hiển thị trực tiếp lên trang web!'
                        : 'Your review has been recorded and is now visible on the website!')}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setModalOpen(false)}
                    style={{ margin: '16px auto 0' }}
                  >
                    {t.reviews.btnClose || (lang === 'vi' ? 'Đóng cửa sổ' : 'Close')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="review-form">
                  {/* Star Rating Select */}
                  <div className="form-group">
                    <label className="form-label">
                      {t.reviews.ratingLabel || (lang === 'vi' ? 'Mức độ hài lòng *' : 'Your Rating *')}
                    </label>
                    <div className="rating-select-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-select-btn ${star <= reviewForm.stars ? 'active' : ''}`}
                          onClick={() => setReviewForm((f) => ({ ...f, stars: star }))}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-score-label">
                        {reviewForm.stars} / 5 {lang === 'vi' ? 'Sao' : 'Stars'}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">
                      {t.reviews.nameLabel || (lang === 'vi' ? 'Họ & Tên *' : 'Full Name *')}
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={lang === 'vi' ? 'Ví dụ: Thanh Mai' : 'E.g. Sarah M.'}
                      value={reviewForm.author}
                      onChange={(e) => setReviewForm((f) => ({ ...f, author: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Location & Tag Row */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">
                        {t.reviews.locationLabel || (lang === 'vi' ? 'Khu vực / Quận' : 'Location')}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder={lang === 'vi' ? 'Quận 1, TP.HCM' : 'Sài Gòn, VN'}
                        value={reviewForm.location}
                        onChange={(e) => setReviewForm((f) => ({ ...f, location: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        {t.reviews.tagLabel || (lang === 'vi' ? 'Loại khách hàng' : 'Customer Type')}
                      </label>
                      <select
                        className="form-input form-select"
                        value={reviewForm.tag}
                        onChange={(e) => setReviewForm((f) => ({ ...f, tag: e.target.value }))}
                      >
                        <option value="Khách thường xuyên">
                          {lang === 'vi' ? 'Khách thường xuyên' : 'Regular Customer'}
                        </option>
                        <option value="Khách mới">{lang === 'vi' ? 'Khách mới' : 'New Customer'}</option>
                        <option value="Khách doanh nghiệp">
                          {lang === 'vi' ? 'Khách doanh nghiệp' : 'Business Client'}
                        </option>
                        <option value="Gói gia đình">{lang === 'vi' ? 'Gói gia đình' : 'Family Plan'}</option>
                        <option value="Đã xác minh">{lang === 'vi' ? 'Đã xác minh' : 'Verified'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="form-group">
                    <label className="form-label">
                      {t.reviews.commentLabel || (lang === 'vi' ? 'Nội dung đánh giá *' : 'Your Review *')}
                    </label>
                    <textarea
                      rows={4}
                      className="form-input form-textarea"
                      placeholder={
                        lang === 'vi'
                          ? 'Chia sẻ trải nghiệm của bạn về dịch vụ giặt ủi, tốc độ giao nhận, độ sạch và thơm của quần áo...'
                          : 'Share your experience about the laundry quality, delivery speed, fresh scent...'
                      }
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="review-modal-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                      {lang === 'vi' ? 'Hủy' : 'Cancel'}
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {t.reviews.btnSubmit || (lang === 'vi' ? 'Gửi Đánh Giá Ngay' : 'Submit Review')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsCarousel;
