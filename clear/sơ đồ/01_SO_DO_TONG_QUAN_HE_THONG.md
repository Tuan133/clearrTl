# 🏗️ SƠ ĐỒ TỔNG QUAN HỆ THỐNG (SYSTEM ARCHITECTURE)

Tài liệu này đặc tả kiến trúc tổng thể, mô hình phân tầng và tương tác giữa các thành phần trong hệ thống **TLaundry**.

---

## 1. Kiến Trúc 3 Tầng (3-Tier Architecture)

Hệ thống được thiết kế theo mô hình 3 tầng độc lập, giao tiếp thông qua giao thức an toàn `HTTPS / RESTful API JSON`:

```mermaid
graph TB
    subgraph ClientLayer ["1. CLIENT TIER (Giao diện người dùng)"]
        UI_Guest["Khách vãng lai (Guest)<br/>- Xem dịch vụ, bảng giá<br/>- Đặt dịch vụ<br/>- Tra cứu đơn giặt"]
        UI_Customer["Khách hàng đã đăng nhập<br/>- Quản lý hồ sơ<br/>- Lịch sử đơn hàng (My Orders)<br/>- Đổi mật khẩu"]
        UI_Admin["Quản trị viên / Nhân viên<br/>- Dashboard thống kê doanh thu<br/>- Quản lý & duyệt đơn hàng<br/>- Quản lý tin nhắn & người dùng"]
        
        SPA["React SPA (Single Page Application)<br/>Vite + React Router + Context API<br/>AuthContext | LanguageContext (VI/EN)"]
        UI_Guest --> SPA
        UI_Customer --> SPA
        UI_Admin --> SPA
    end

    subgraph APILayer ["2. APPLICATION / API TIER (Xử lý nghiệp vụ & Bảo mật)"]
        Gateway["Express Gateway & Security Filter<br/>- Helmet (HTTP Header Defense)<br/>- CORS Policy Whitelist<br/>- Rate Limiting (Anti-DDoS & Brute-force)<br/>- Mongo Sanitize (Anti-NoSQL Injection)"]
        
        AuthModule["Module Xác Thực & Phân Quyền (RBAC)<br/>- JWT Access Token (15 phút)<br/>- Refresh Token Rotation (7 ngày)<br/>- Bcrypt Password Hashing<br/>- Zod Schema Validation"]
        
        Controllers["Controllers Xử Lý Nghiệp Vụ<br/>- BookingController<br/>- AuthController / AdminController<br/>- ContactController<br/>- Service & PricingController"]
        
        EmailWorker["Email Service (Nodemailer - Async / Fire-and-Forget)<br/>- Gửi Email xác nhận đơn hàng (BCC Admin)"]
        
        SPA -- "REST API (JSON / Bearer Token)" --> Gateway
        Gateway --> AuthModule
        AuthModule --> Controllers
        Controllers -.-> EmailWorker
    end

    subgraph DataLayer ["3. DATA TIER (Lưu trữ & Dịch vụ ngoại vi)"]
        Mongoose["Mongoose ODM Layer<br/>(Schema, Validation, Indexing, Pre-save hooks)"]
        MongoDB[("MongoDB Database<br/>Collections: users, bookings, contacts,<br/>newsletters, services, pricings")]
        GmailSMTP["Dịch vụ Email Ngoài<br/>Google Gmail SMTP Server"]
        
        Controllers --> Mongoose
        Mongoose --> MongoDB
        EmailWorker -- "SMTP / TLS" --> GmailSMTP
    end
```

---

## 2. Sơ Đồ Khối Chức Năng Của Hệ Thống (Functional Block Diagram)

```mermaid
flowchart LR
    subgraph Frontend_Modules ["Module Giao Diện (Frontend)"]
        F1["Trang Chủ (Home & Reviews)"]
        F2["Trang Đặt Lịch (Booking 3 Bước)"]
        F3["Trang Về Chúng Tôi (About & Team)"]
        F4["Trang Dịch Vụ & Bảng Giá (Dynamic)"]
        F5["Trang Liên Hệ (Contact Form)"]
        F6["Lịch Sử Đơn Hàng (My Orders)"]
        F7["Trang Quản Trị (Admin Dashboard)"]
    end

    subgraph Backend_Endpoints ["API Endpoints (Backend Server)"]
        B1["/api/auth/* (Đăng ký, Đăng nhập, Profile, Refresh)"]
        B2["/api/bookings/* (Đặt đơn, Lịch sử, Tra cứu, Cập nhật trạng thái)"]
        B3["/api/contact/* (Gửi liên hệ, Xử lý phản hồi)"]
        B4["/api/services & /api/pricing (Lấy dữ liệu động)"]
        B5["/api/admin/dashboard (Thống kê realtime)"]
    end

    subgraph Database_Collections ["Cơ Sở Dữ Liệu (MongoDB)"]
        D1[("Users")]
        D2[("Bookings")]
        D3[("Contacts")]
        D4[("Newsletters")]
        D5[("Services")]
        D6[("Pricings")]
    end

    F1 & F3 --> B4
    F2 --> B2
    F4 --> B4
    F5 --> B3
    F6 --> B2
    F7 --> B1 & B2 & B3 & B5

    B1 --> D1
    B2 --> D2
    B3 --> D3
    B4 --> D5 & D6
    B5 --> D1 & D2 & D3
```

---

## 3. Sơ Đồ Luồng Dữ Liệu Cấp Cao (Data Flow Diagram - DFD Level 0)

```mermaid
graph TD
    User(("Người Dùng / Khách Hàng"))
    Admin(("Quản Trị Viên / Staff"))
    System[["HỆ THỐNG TLAUNDRY (Frontend + Backend)"]]
    Database[("Cơ Sở Dữ Liệu MongoDB")]
    MailServer["Hệ Thống Mail SMTP (Gmail)"]

    User -- "1. Gửi thông tin Đặt lịch / Mua thẻ / Đăng ký tài khoản" --> System
    System -- "2. Trả về mã đơn TL-XXXXXX, JWT Token, Dữ liệu dịch vụ" --> User
    
    Admin -- "3. Đăng nhập quản trị, Cập nhật trạng thái đơn, Quản lý user" --> System
    System -- "4. Trả về báo cáo doanh thu, danh sách đơn, kết quả xử lý" --> Admin

    System -- "5. Lưu / Truy vấn dữ liệu đơn, tài khoản, cấu hình" --> Database
    Database -- "6. Trả về kết quả truy vấn" --> System

    System -- "7. Kích hoạt gửi email xác nhận cho khách & BCC admin" --> MailServer
    MailServer -- "8. Chuyển thư đến hòm thư người nhận" --> User
```

---

## 4. Mô Hình Phân Quyền Theo Vai Trò (RBAC Matrix)

Hệ thống thiết lập 3 vai trò rõ ràng với các đặc quyền truy cập:

| Chức Năng / API | Khách Vãng Lai (Guest) | Khách Hàng (CUSTOMER) | Nhân Viên (STAFF) | Quản Trị Viên (ADMIN) |
| :--- | :---: | :---: | :---: | :---: |
| Xem Trang chủ, Dịch vụ, Bảng giá | ✅ | ✅ | ✅ | ✅ |
| Đặt đơn giặt ủi (`POST /api/bookings`) | ✅ | ✅ (Tự động gán `userId`) | ✅ | ✅ |
| Tra cứu đơn công khai (`/api/bookings/:code/track`) | ✅ | ✅ | ✅ | ✅ |
| Gửi liên hệ (`POST /api/contact`) | ✅ | ✅ | ✅ | ✅ |
| Đăng ký / Đăng nhập tài khoản | ✅ | ✅ | ✅ | ✅ |
| Xem lịch sử đơn của mình (`/api/bookings/my-orders`) | ❌ | ✅ | ✅ | ✅ |
| Cập nhật hồ sơ & Đổi mật khẩu cá nhân | ❌ | ✅ | ✅ | ✅ |
| Xem toàn bộ đơn hàng (`GET /api/bookings`) | ❌ | ❌ | ✅ | ✅ |
| Đổi trạng thái đơn giặt (`PUT /api/bookings/:id/status`) | ❌ | ❌ | ✅ | ✅ |
| Xem & Xử lý tin nhắn liên hệ (`/api/contact`) | ❌ | ❌ | ✅ | ✅ |
| Xem Dashboard thống kê doanh thu (`/api/admin/dashboard`) | ❌ | ❌ | ✅ | ✅ |
| Quản lý tài khoản người dùng (`GET /api/admin/users`) | ❌ | ❌ | ✅ | ✅ |
| Tạo tài khoản Staff/Admin mới (`POST /api/admin/users`) | ❌ | ❌ | ❌ | ✅ |
| Khoá / Mở khoá tài khoản (`PUT /api/admin/users/:id/toggle-active`) | ❌ | ❌ | ❌ | ✅ |
