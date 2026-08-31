# 🛡️ SƠ ĐỒ KIẾN TRÚC BẢO MẬT & LUỒNG TRUY CẬP (SECURITY ARCHITECTURE)

Tài liệu này đặc tả cơ chế bảo mật đa tầng (Defense in Depth) được triển khai trên hệ thống **TLaundry**, giúp ngăn chặn các lỗ hổng OWASP Top 10 phổ biến như XSS, CSRF, NoSQL Injection, Brute-Force, Token Theft, và Data Leakage.

---

## 1. Sơ Đồ Các Tầng Bảo Vệ (Multi-Layer Security Architecture)

```mermaid
graph TD
    ClientReq["Yêu cầu từ Client (HTTP/HTTPS)"] --> L1

    subgraph Layer1 ["TẦNG 1: HTTP HEADER & KẾT NỐI"]
        L1["Helmet Middleware<br/>- Content-Security-Policy (CSP)<br/>- X-Content-Type-Options: nosniff<br/>- X-Frame-Options: SAMEORIGIN<br/>- Strict-Transport-Security (HSTS)"]
        L2["CORS Whitelist Policy<br/>- Chỉ chấp nhận origin hợp lệ (Localhost:5173, Production Domain)<br/>- Credentials: true"]
        L1 --> L2
    end

    subgraph Layer2 ["TẦNG 2: CHỐNG TẤN CÔNG BRUTE-FORCE & DDOS"]
        L3["Express Rate Limiting<br/>- Global Limiter: 100 req / 15 phút (Public APIs)<br/>- Auth Limiter: 20 req / 15 phút (Đăng nhập / Đăng ký)"]
        L2 --> L3
    end

    subgraph Layer3 ["TẦNG 3: VỆ SINH DỮ LIỆU ĐẦU VÀO (INPUT SANITIZATION)"]
        L4["Express-Mongo-Sanitize<br/>- Chặn tấn công NoSQL Injection ($gt, $ne, $where)"]
        L5["Zod Schema Validation & XSS Defense<br/>- Validate kiểu dữ liệu nghiêm ngặt<br/>- Cắt tỉa khoảng trắng (Trim), Chuyển chữ thường (Email)<br/>- Encode các ký tự đặc biệt nguy hiểm"]
        L3 --> L4
        L4 --> L5
    end

    subgraph Layer4 ["TẦNG 4: XÁC THỰC & PHÂN QUYỀN (RBAC & JWT)"]
        L6["Middleware `protect`<br/>- Kiểm tra Bearer Access Token trong Header<br/>- Verify chữ ký JWT bí mật"]
        L7["Middleware `authorize('ADMIN', 'STAFF')`<br/>- Kiểm tra vai trò người dùng trước khi cấp quyền truy cập"]
        L5 --> L6
        L6 --> L7
    end

    subgraph Layer5 ["TẦNG 5: TRUY XUẤT CƠ SỞ DỮ LIỆU & MÃ HÓA"]
        L8["Mongoose ODM with Bcrypt<br/>- Băm mật khẩu bằng Bcrypt 10 rounds<br/>- Schema Type Safety<br/>- Ẩn trường nhạy cảm (.select('-password -refreshToken'))"]
        L7 --> L8
    end

    subgraph Layer6 ["TẦNG 6: TẬP TRUNG XỬ LÝ LỖI (CENTRALIZED ERROR HANDLER)"]
        L9["Global Error Handler<br/>- Ẩn Stack Trace ở Production<br/>- Trả về mã lỗi JSON chuẩn hóa, thân thiện"]
        L8 --> L9
    end

    L9 --> SuccessRes["Phản Hồi Dữ Liệu An Toàn Cho Client"]
```

---

## 2. Luồng Kiểm Tra & Xử Lý Một Request Vào Hệ Thống

```mermaid
flowchart TD
    Start([Client gửi Request]) --> ChkIP{"IP vượt quá Rate Limit?"}
    ChkIP -- Có --> Ret429["Trả về 429: Too Many Requests"]
    ChkIP -- Không --> ChkOrigin{"Origin hợp lệ theo CORS?"}
    
    ChkOrigin -- Không --> Ret403CORS["Bị CORS chặn (CORS Error)"]
    ChkOrigin -- Hợp lệ --> SanitizeNoSQL["Làm sạch payload qua Mongo-Sanitize"]
    
    SanitizeNoSQL --> ValidateZod{"Kiểm tra qua Zod Schema?"}
    ValidateZod -- Lỗi Validate --> Ret400["Trả về 400: Validation Failed (Kèm chi tiết trường lỗi)"]
    
    ValidateZod -- Hợp lệ --> ChkRouteProtected{"Endpoint có yêu cầu Đăng nhập?"}
    
    ChkRouteProtected -- Không (Public) --> RunController["Thực thi Controller & Ghi nhận DB"]
    
    ChkRouteProtected -- Có (Protected) --> VerifyJWT{"Access Token hợp lệ & còn hạn?"}
    VerifyJWT -- Hết hạn --> Ret401Expired["Trả về 401: TOKEN_EXPIRED (Kích hoạt auto refresh)"]
    VerifyJWT -- Không hợp lệ/Giả mạo --> Ret401Invalid["Trả về 401: Invalid Token"]
    
    VerifyJWT -- Hợp lệ --> ChkRole{"Role có đủ quyền truy cập (RBAC)?"}
    ChkRole -- Không đủ quyền --> Ret403["Trả về 403: Forbidden (Không có quyền thực hiện)"]
    
    ChkRole -- Đủ quyền --> RunController
    
    RunController --> Success["Trả về HTTP 200/201 Thành Công"]
```

---

## 3. Các Biện Pháp Bảo Mật Trọng Điểm Đã Triển Khai

| STT | Biện Pháp Bảo Mật | Công Nghệ / Thư Viện | Mục Đích Bảo Vệ |
| :---: | :--- | :--- | :--- |
| **1** | **HTTP Security Headers** | `helmet` | Chống Clickjacking, MIME-sniffing, XSS qua header trình duyệt. |
| **2** | **CORS Whitelist** | `cors` | Giới hạn chỉ tên miền frontend được phép gọi API. |
| **3** | **Chống Brute-Force & DoS** | `express-rate-limit` | Giới hạn 20 lần thử login/15 phút nhằm vô hiệu hóa tấn công dò pass. |
| **4** | **Chống NoSQL Injection** | `express-mongo-sanitize` | Loại bỏ các toán tử MongoDB độc hại (`$where`, `$gt`) khỏi request body/params. |
| **5** | **Xác thực Schema chặt chẽ** | `zod` | Đảm bảo kiểu dữ liệu, định dạng email, độ dài mật khẩu và loại bỏ dữ liệu rác. |
| **6** | **Xác thực kép Access + Refresh**| `jsonwebtoken (JWT)` | Access Token sống ngắn (15p) giảm thiểu rủi ro khi bị chặn bắt, Refresh Token hỗ trợ duy trì đăng nhập an toàn. |
| **7** | **Băm mật khẩu một chiều** | `bcryptjs` (10 rounds) | Đảm bảo mật khẩu không bao giờ bị lộ kể cả khi Database bị truy cập trái phép. |
| **8** | **Cơ chế Env Guard & Leak Defense** | Code tự phát triển trong `server.js` | Tự động crash server nếu phát hiện dùng chuỗi secret yếu hoặc bị lộ công khai trên Git. |
| **9** | **Xử lý lỗi tập trung an toàn** | `errorHandler.js` | Che giấu chi tiết lỗi hệ thống (Database stack trace), ngăn rò rỉ thông tin nhạy cảm. |
