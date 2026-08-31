# 🔄 SƠ ĐỒ HOẠT ĐỘNG & TUẦN TỰ CHI TIẾT (WORKFLOWS & SEQUENCE DIAGRAMS)

Tài liệu này mô tả chi tiết các luồng nghiệp vụ quan trọng nhất của hệ thống **TLaundry** bằng sơ đồ tuần tự (Sequence Diagram) và sơ đồ chuyển đổi trạng thái (State Diagram).

---

## 1. Luồng Nghiệp Vụ Đặt Lịch Giặt Ủi (Booking Process)

Quy trình khách hàng đặt lịch dịch vụ trực tuyến, xác thực dữ liệu qua Zod, lưu vào MongoDB và gửi email thông báo tự động (Asynchronous):

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng (User/Guest)
    participant UI as React Frontend (BookingPage)
    participant Sec as Security & Validator (Zod)
    participant API as Express API Server
    participant DB as MongoDB (Collection: bookings)
    participant Mail as Email Worker (Nodemailer)

    Customer->>UI: Chọn Dịch vụ (3 loại) -> Chọn Nước giặt/xả/Tốc độ -> Nhập Địa chỉ & Thời gian
    Customer->>UI: Nhấn "Xác Nhận Đặt Đơn"
    
    UI->>Sec: Gửi payload qua API Client kèm Bearer Token (nếu đã đăng nhập)
    Sec->>Sec: Kiểm tra định dạng (Zod Schema), Sanitize HTML/NoSQL Injection
    
    alt Dữ liệu không hợp lệ
        Sec-->>UI: 400 Bad Request (Danh sách lỗi cụ thể)
        UI-->>Customer: Hiển thị thông báo lỗi trên form
    else Dữ liệu hợp lệ
        Sec->>API: Chuyển tiếp Request đã làm sạch
        API->>API: Sinh mã đơn hàng ngẫu nhiên duy nhất (VD: TL-849201)
        API->>API: Trích xuất `userId` từ JWT (nếu có, nếu không gán null)
        
        API->>DB: Booking.create(newBookingData)
        DB-->>API: Trả về Document đơn hàng vừa lưu thành công
        
        Note over API,Mail: Bắn tác vụ gửi email ngầm (Fire-and-Forget)<br/>Không bắt Client chờ đợi
        API-)Mail: sendBookingConfirmation(booking, null)
        
        API-->>UI: 201 Created { success: true, orderCode: 'TL-849201', data: booking }
        UI-->>Customer: Hiển thị màn hình thành công với Mã đơn hàng & Hướng dẫn nhận hàng
        
        par Gửi Mail Khách
            Mail->>Customer: Gửi Email xác nhận đơn kèm mã đơn & chi tiết
        and Gửi BCC Quản trị
            Mail->>Mail: Gửi bản sao BCC đến hòm thư Admin quản trị
        end
    end
```

---

## 2. Luồng Xác Thực Kép & Làm Mới Token Tự Động (JWT & Refresh Token Rotation)

Hệ thống sử dụng cơ chế bảo mật xác thực 2 tầng:
- **Access Token:** Hạn sử dụng ngắn (15 phút), dùng để gọi API được bảo vệ.
- **Refresh Token:** Hạn sử dụng 7 ngày, lưu mã hóa trong MongoDB, tự động cấp mới (Rotation) khi Access Token hết hạn:

```mermaid
sequenceDiagram
    autonumber
    actor User as Người Dùng
    participant UI as React Client (api.js / AuthContext)
    participant API as Express Auth Router
    participant DB as MongoDB (Collection: users)

    User->>UI: Nhập Email & Mật Khẩu -> Nhấn "Đăng Nhập"
    UI->>API: POST /api/auth/login { email, password }
    API->>DB: User.findOne({ email })
    DB-->>API: Trả về User record (bao gồm hashed password)
    
    API->>API: bcrypt.compare(password, user.password)
    
    alt Sai mật khẩu / Tài khoản bị khoá
        API-->>UI: 401 Unauthorized / 403 Forbidden
        UI-->>User: Hiển thị thông báo lỗi đăng nhập
    else Đăng nhập thành công
        API->>API: Tạo Access Token (15m) & Refresh Token (7d)
        API->>DB: Cập nhật user.refreshToken = newRefreshToken
        API-->>UI: 200 OK { accessToken, refreshToken, user }
        UI->>UI: Lưu Access Token & Refresh Token vào LocalStorage
        UI-->>User: Đăng nhập thành công, điều hướng vào trang cá nhân
    end

    Note over UI,API: --- Khi Access Token hết hạn (Sau 15 phút) ---
    
    User->>UI: Thao tác cần bảo mật (VD: Xem My Orders)
    UI->>API: GET /api/bookings/my-orders (Kèm Access Token cũ)
    API-->>UI: 401 Unauthorized { code: 'TOKEN_EXPIRED' }
    
    Note over UI: Bộ lọc fetch interceptor chặn lại & kích hoạt Refresh Flow
    UI->>API: POST /api/auth/refresh-token { refreshToken }
    API->>DB: User.findById(decoded.id)
    DB-->>API: Trả về User
    
    API->>API: So khớp refreshToken gửi lên với DB (Chống trộm cắp token)
    API->>API: Sinh cặp token mới (Access Token mới + Refresh Token mới)
    API->>DB: Cập nhật refreshToken mới vào DB (Token Rotation)
    API-->>UI: 200 OK { accessToken: newAT, refreshToken: newRT }
    
    UI->>UI: Cập nhật Storage với token mới
    UI->>API: Tự động gửi lại request GET /api/bookings/my-orders với Access Token mới
    API-->>UI: 200 OK (Dữ liệu lịch sử đơn hàng)
    UI-->>User: Dữ liệu hiển thị mượt mà, không bị gián đoạn phiên
```

---

## 3. Vòng Đời Trạng Thái Đơn Giặt (Booking State Machine)

Trạng thái đơn hàng được quản lý chặt chẽ theo tiến trình thực tế:

```mermaid
stateDiagram-v2
    [*] --> PENDING : Khách đặt đơn thành công (Chờ duyệt)
    
    PENDING --> CONFIRMED : Admin/Staff xác nhận đơn
    PENDING --> CANCELLED : Khách huỷ / Không thể phục vụ
    
    CONFIRMED --> PICKED_UP : Tài xế đã nhận đồ tại nhà khách
    CONFIRMED --> CANCELLED : Huỷ đơn
    
    PICKED_UP --> WASHING : Đồ đã về xưởng, đang giặt sấy theo yêu cầu
    
    WASHING --> DELIVERING : Hoàn tất giặt ủi, đang giao trả cho khách
    
    DELIVERING --> COMPLETED : Khách nhận đồ sạch, kết thúc đơn hàng
    
    COMPLETED --> [*]
    CANCELLED --> [*]
```

### Ý nghĩa từng trạng thái:
- **`PENDING` (Chờ xử lý):** Đơn mới khởi tạo, chờ nhân viên kiểm tra tuyến đường & lịch hẹn.
- **`CONFIRMED` (Đã xác nhận):** Đơn hợp lệ, đã phân công lịch hẹn nhận đồ.
- **`PICKED_UP` (Đã lấy hàng):** Đội ngũ shipper đã đến tận nhà lấy quần áo.
- **`WASHING` (Đang xử lý/giặt sấy):** Quần áo đang trong quy trình phân loại, tẩy điểm, giặt sấy sinh học hoặc giặt khô.
- **`DELIVERING` (Đang giao hàng):** Quần áo đã thơm tho, đóng gói cẩn thận và đang trên đường giao trả.
- **`COMPLETED` (Đã hoàn tất):** Giao hàng thành công.
- **`CANCELLED` (Đã huỷ):** Đơn hàng bị huỷ theo yêu cầu hoặc lỗi giao tiếp.

---

## 4. Luồng Xử Lý Tin Nhắn Liên Hệ & Khiếu Nại (Contact Pipeline)

```mermaid
flowchart TD
    Start([Khách gửi Form Liên Hệ]) --> API_Post["POST /api/contact"]
    API_Post --> ValidateZod{"Kiểm tra dữ liệu (Zod)"}
    ValidateZod -- Lỗi --> ErrMsg["Trả về 400 Bad Request"]
    ValidateZod -- Hợp lệ --> SaveDB[("Lưu vào MongoDB Contact (Status: PENDING)")]
    
    SaveDB --> SuccessRes["Trả về 201: Đã gửi liên hệ thành công"]
    
    SaveDB -.-> AdminNoti["Admin Dashboard hiển thị số lượng tin nhắn chưa xử lý"]
    
    AdminNoti --> AdminAction["Admin/Staff xem chi tiết tin nhắn"]
    AdminAction --> ResolveChoice{"Nhân viên xử lý liên hệ"}
    
    ResolveChoice -- Đã giải quyết xong --> PatchResolved["PATCH /api/contact/:id/resolve -> Status: PROCESSED"]
    ResolveChoice -- Cần theo dõi tiếp --> PatchUnresolved["PATCH /api/contact/:id/unresolve -> Status: PENDING"]
```
