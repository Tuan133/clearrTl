# 🗄️ SƠ ĐỒ CƠ SỞ DỮ LIỆU & THỰC THỂ QUAN HỆ (ERD - DATABASE SCHEMA)

Tài liệu này đặc tả chi tiết toàn bộ mô hình dữ liệu (Database Schema), sơ đồ quan hệ thực thể (Entity Relationship Diagram - ERD) và từ điển dữ liệu của hệ thống **TLaundry** (sử dụng MongoDB & Mongoose ODM).

---

## 1. Sơ Đồ Quan Hệ Thực Thể (Entity Relationship Diagram - ERD)

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "places (1 : N)"
    
    USERS {
        ObjectId _id PK "Khóa chính"
        string name "Họ và tên"
        string email UK "Email đăng nhập (Unique)"
        string phone "Số điện thoại liên hệ"
        string password "Mật khẩu băm (Bcrypt)"
        string role "Vai trò: CUSTOMER | STAFF | ADMIN"
        boolean isActive "Trạng thái hoạt động"
        string refreshToken "Refresh token hiện tại"
        date createdAt "Thời gian tạo"
        date updatedAt "Thời gian cập nhật"
    }

    BOOKINGS {
        ObjectId _id PK "Khóa chính"
        string orderCode UK "Mã đơn hàng (VD: TL-123456)"
        string serviceType "Loại dịch vụ chọn"
        string firstName "Tên khách hàng"
        string lastName "Họ đệm"
        string email "Email nhận thông báo"
        string phone "Số điện thoại giao nhận"
        string address "Địa chỉ nhận đồ"
        string suburb "Quận/Huyện"
        string state "Tỉnh/Thành phố"
        string pickupDate "Ngày nhận hàng"
        string pickupTime "Giờ nhận hàng"
        string frequency "Tần suất: one-off | weekly | etc."
        string detergent "Loại nước giặt chọn"
        string softener "Loại nước xả vải chọn"
        string deliverySpeed "standard | express"
        number expressFee "Phí giao nhanh"
        string notes "Ghi chú thêm"
        ObjectId userId FK "Liên kết Users._id (Null nếu Guest)"
        string status "PENDING|CONFIRMED|PICKED_UP|WASHING|DELIVERING|COMPLETED|CANCELLED"
        date createdAt "Thời gian tạo đơn"
        date updatedAt "Thời gian cập nhật"
    }

    CONTACTS {
        ObjectId _id PK "Khóa chính"
        string name "Họ tên người gửi"
        string email "Email liên hệ"
        string phone "Số điện thoại"
        string subject "Tiêu đề liên hệ"
        string message "Nội dung tin nhắn"
        string status "PENDING | PROCESSED"
        date createdAt "Thời gian gửi"
    }

    NEWSLETTERS {
        ObjectId _id PK "Khóa chính"
        string email UK "Email đăng ký nhận tin (Unique)"
        date createdAt "Thời gian đăng ký"
    }

    SERVICES {
        ObjectId _id PK "Khóa chính"
        string serviceId UK "Mã định danh dịch vụ"
        string nameVi "Tên dịch vụ (Tiếng Việt)"
        string nameEn "Tên dịch vụ (Tiếng Anh)"
        string descVi "Mô tả chi tiết (Tiếng Việt)"
        string descEn "Mô tả chi tiết (Tiếng Anh)"
        string img "URL hình ảnh đại diện"
        string[] featuresVi "Danh sách tính năng nổi bật (VI)"
        string[] featuresEn "Danh sách tính năng nổi bật (EN)"
        string iconType "Loại icon biểu diễn"
        number order "Thứ tự sắp xếp hiển thị"
        boolean isActive "Đang hoạt động hay tạm ẩn"
        date createdAt "Thời gian tạo"
    }

    PRICINGS {
        ObjectId _id PK "Khóa chính"
        PricingPlan[] plans "Mảng các gói dịch vụ bảng giá"
        AdditionalItem[] additionalItems "Mảng các món giặt tính thêm"
        date updatedAt "Thời gian cập nhật gần nhất"
    }
```

---

## 2. Chi Tiết Cấu Trúc Các Collections (Data Dictionary)

### 2.1. Collection: `users`
Lưu trữ thông tin người dùng, bao gồm Khách hàng, Nhân viên và Quản trị viên.

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng Buộc | Giá Trị Mặc Định | Mô Tả |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK, Auto | Auto generated | Mã định danh duy nhất của người dùng |
| `name` | `String` | Required, Trim | - | Họ và tên đầy đủ |
| `email` | `String` | Required, Unique, Lowercase | - | Địa chỉ email dùng để đăng nhập |
| `phone` | `String` | Optional, Trim | `''` | Số điện thoại liên hệ |
| `password` | `String` | Required | - | Mật khẩu đã băm (Bcrypt 10 rounds) |
| `role` | `String` | Enum | `'CUSTOMER'` | Vai trò: `CUSTOMER`, `STAFF`, `ADMIN` |
| `isActive` | `Boolean` | Required | `true` | Trạng thái kích hoạt (Admin có thể khóa) |
| `refreshToken` | `String` | Nullable | `null` | Refresh Token hiện tại (hỗ trợ Token Rotation) |
| `createdAt` | `Date` | Auto | `Date.now` | Thời điểm tạo tài khoản |
| `updatedAt` | `Date` | Auto | - | Thời điểm cập nhật cuối cùng |

---

### 2.2. Collection: `bookings`
Lưu trữ toàn bộ đơn đặt dịch vụ giặt ủi của khách hàng.

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng Buộc | Giá Trị Mặc Định | Mô Tả |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK, Auto | Auto generated | Mã định danh đơn hàng trong MongoDB |
| `orderCode` | `String` | Required, Unique | - | Mã đơn hàng công khai (VD: `TL-829104`) |
| `serviceType` | `String` | Required | `'Giặt Ủi Gia Đình'` | Loại dịch vụ khách đã chọn |
| `firstName` | `String` | Required | - | Tên khách hàng |
| `lastName` | `String` | Required | - | Họ đệm của khách hàng |
| `email` | `String` | Required | - | Email nhận biên nhận & thông báo đơn |
| `phone` | `String` | Required | - | Số điện thoại liên hệ giao nhận |
| `address` | `String` | Required | - | Địa chỉ chi tiết nhận & trả đồ |
| `suburb` | `String` | Optional | `''` | Quận / Huyện / Khu vực |
| `state` | `String` | Optional | `''` | Tỉnh / Thành phố |
| `pickupDate` | `String` | Optional | `''` | Ngày hẹn shipper đến lấy hàng |
| `pickupTime` | `String` | Optional | `''` | Khung giờ hẹn shipper đến lấy hàng |
| `frequency` | `String` | Optional | `'one-off'` | Tần suất giặt (đơn lẻ hoặc định kỳ) |
| `detergent` | `String` | Optional | Sinh học | Loại nước giặt khách chọn |
| `softener` | `String` | Optional | Lavender | Loại nước xả vải khách chọn |
| `deliverySpeed`| `String` | Enum | `'standard'` | Tốc độ: `standard` (tiêu chuẩn), `express` (giao nhanh) |
| `expressFee` | `Number` | Optional | `0` | Phụ phí giao nhanh (nếu chọn express) |
| `notes` | `String` | Optional | - | Ghi chú đặc biệt cho tài xế/tiệm |
| `userId` | `ObjectId` | FK -> `users._id` | `null` | Khóa ngoại trỏ đến User (null nếu khách vãng lai) |
| `status` | `String` | Enum | `'PENDING'` | Trạng thái đơn: `PENDING`, `CONFIRMED`, `PICKED_UP`, `WASHING`, `DELIVERING`, `COMPLETED`, `CANCELLED` |
| `createdAt` | `Date` | Auto | `Date.now` | Thời điểm đặt đơn |
| `updatedAt` | `Date` | Auto | - | Thời điểm cập nhật trạng thái đơn |

---

### 2.3. Collection: `contacts`
Lưu trữ thông tin liên hệ và tin nhắn khiếu nại/tư vấn từ khách hàng.

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng Buộc | Giá Trị Mặc Định | Mô Tả |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK, Auto | Auto generated | Khóa chính |
| `name` | `String` | Required | - | Tên người gửi liên hệ |
| `email` | `String` | Required | - | Email phản hồi |
| `phone` | `String` | Optional | - | Số điện thoại người gửi |
| `subject` | `String` | Optional | - | Tiêu đề tin nhắn |
| `message` | `String` | Required | - | Nội dung cần hỗ trợ / phản ánh |
| `status` | `String` | Enum | `'PENDING'` | Trạng thái xử lý: `PENDING`, `PROCESSED` |
| `createdAt` | `Date` | Auto | `Date.now` | Thời điểm gửi |

---

### 2.4. Collection: `newsletters`
Lưu trữ danh sách email đăng ký nhận bản tin khuyến mãi.

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng Buộc | Mô Tả |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK, Auto | Khóa chính |
| `email` | `String` | Required, Unique, Lowercase | Email đăng ký nhận ưu đãi |
| `createdAt` | `Date` | Auto | Thời điểm đăng ký |

---

### 2.5. Collection: `services`
Quản lý động danh sách các gói dịch vụ giặt ủi hiển thị trên website.

| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng Buộc | Mô Tả |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | PK, Auto | Khóa chính |
| `serviceId` | `String` | Required, Unique | Mã định danh dạng slug (VD: `domestic-laundry`) |
| `nameVi` / `nameEn` | `String` | Required | Tên dịch vụ song ngữ (Việt - Anh) |
| `descVi` / `descEn` | `String` | Required | Đoạn văn mô tả dịch vụ song ngữ |
| `img` | `String` | Required | Đường dẫn ảnh minh họa Unsplash/Cloudinary |
| `featuresVi` / `featuresEn` | `[String]` | Array | Danh sách các gạch đầu dòng tính năng |
| `iconType` | `String` | Default: `'laundry'` | Loại biểu tượng |
| `order` | `Number` | Default: `0` | Thứ tự ưu tiên hiển thị |
| `isActive` | `Boolean` | Default: `true` | Trạng thái hiển thị |

---

### 2.6. Collection: `pricings`
Quản lý bảng giá động của toàn hệ thống (Gồm các gói chính `plans` và món phụ `additionalItems`).

```json
{
  "_id": "ObjectId",
  "plans": [
    {
      "planId": "standard-wash",
      "nameVi": "Giặt Sấy Tiêu Chuẩn",
      "nameEn": "Standard Wash & Fold",
      "noteVi": "Tối thiểu 5kg",
      "noteEn": "Min 5kg",
      "featured": true,
      "featuresVi": ["Nước giặt sinh học", "Giao nhận 24h"],
      "featuresEn": ["Bio detergent", "24h delivery"],
      "iconType": "domestic",
      "order": 1
    }
  ],
  "additionalItems": [
    {
      "itemId": "ironing-shirt",
      "nameVi": "Là/Ủi Sơ Mi Cao Cấp",
      "nameEn": "Premium Shirt Ironing",
      "priceVi": "25.000đ / cái",
      "priceEn": "$2.5 / piece",
      "order": 1
    }
  ],
  "updatedAt": "Date"
}
```
