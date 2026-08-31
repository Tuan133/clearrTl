# 📚 BỘ TÀI LIỆU PHÂN TÍCH HỆ THỐNG & SƠ ĐỒ THIẾT KẾ WEBSITE TLAUNDRY

Hệ thống **TLaundry** là nền tảng ứng dụng web dịch vụ giặt ủi di động giao nhận tận nơi hàng đầu, được xây dựng theo kiến trúc Client-Server hiện đại, hướng bảo mật cao cấp và khả năng mở rộng linh hoạt.

---

## 📑 Danh Mục Tài Liệu Thiết Kế & Sơ Đồ

Thư mục này bao gồm toàn bộ các bản thiết kế, đặc tả kỹ thuật và sơ đồ hệ thống chuẩn hóa bằng **Mermaid Diagrams**:

| STT | Tài Liệu | Nội Dung Chính |
| :---: | :--- | :--- |
| **01** | [**`01_SO_DO_TONG_QUAN_HE_THONG.md`**](./01_SO_DO_TONG_QUAN_HE_THONG.md) | Kiến trúc tổng thể 3 tầng (3-Tier), mô hình thành phần Frontend/Backend/Database/Dịch vụ ngoài, luồng dữ liệu cấp cao (DFD). |
| **02** | [**`02_SO_DO_HOAT_DONG_CHI_TIET.md`**](./02_SO_DO_HOAT_DONG_CHI_TIET.md) | Sơ đồ tuần tự (Sequence Diagram) cho các quy trình: Đặt lịch giặt ủi, Xác thực JWT kép (Access + Refresh Rotation), Quản lý đơn hàng Admin. |
| **03** | [**`03_SO_DO_CO_SO_DU_LIEU_ERD.md`**](./03_SO_DO_CO_SO_DU_LIEU_ERD.md) | Sơ đồ quan hệ thực thể (ERD), từ điển dữ liệu (Data Dictionary) chi tiết của 6 Collections trong MongoDB, ràng buộc toàn vẹn & chỉ mục (Indexes). |
| **04** | [**`04_SO_DO_BAO_MAT_VA_LUONG_TRUY_CAP.md`**](./04_SO_DO_BAO_MAT_VA_LUONG_TRUY_CAP.md) | Kiến trúc an toàn thông tin nhiều lớp: Helmet, CORS, Rate Limit, Mongo-Sanitize, Zod Validation, RBAC và mã hóa mật khẩu Bcrypt. |

---

## 🛠️ Công Nghệ Nền Tảng

```
[ Frontend (Client SPA) ]
  ├── React 18 + Vite
  ├── React Router DOM v6
  ├── Context API (AuthContext, LanguageContext: VI/EN)
  └── Vanilla CSS (Modern Design System, Glassmorphism, Micro-animations)

[ Backend (RESTful API Server) ]
  ├── Node.js + Express.js (ES Modules)
  ├── Bảo mật: Helmet, CORS, Express-Rate-Limit, Express-Mongo-Sanitize, Zod
  ├── Xác thực: JWT (Access Token 15m + Refresh Token 7d + Token Rotation), BcryptJS
  └── Tích hợp Email: Nodemailer (SMTP Gmail / HTML Responsive Templates)

[ Database Layer ]
  ├── MongoDB Database (Mongoose ODM 8+)
  └── Collections: Users, Bookings, Contacts, Newsletters, Services, Pricings
```

---

## 💡 Cách Xem Sơ Đồ Mermaid

Các sơ đồ trong tài liệu được định dạng chuẩn **Mermaid Markdown**. Bạn có thể xem trực tiếp qua:
1. Trình xem Markdown tích hợp sẵn trong IDE (VS Code, Antigravity, GitHub, GitLab).
2. Plugin **Markdown Preview Mermaid Support** trên VS Code.
3. Hoặc copy mã mermaid vào [Mermaid Live Editor](https://mermaid.live).
