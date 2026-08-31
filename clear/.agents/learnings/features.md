# Project Architecture & Removed Features Learnings

## Tính năng đã loại bỏ: Gift Card (Thẻ Quà Tặng)
- Dự án TLaundry hiện tại tập trung hoàn toàn vào các dịch vụ giặt ủi cốt lõi (Đặt lịch giặt sấy, bảng giá động, tra cứu đơn hàng, xác thực khách hàng, quản trị đơn hàng & phản hồi liên hệ).
- Không còn bất kỳ model, route, endpoint, validation schema hay giao diện nào liên quan đến Gift Card (`/gift-card` hay `POST /api/gift-cards`).
- Trang Admin Dashboard hiển thị 4 KPI chuẩn: Đơn hàng hôm nay, Doanh thu hôm nay, Khách hàng đăng ký, Liên hệ chưa xử lý.
