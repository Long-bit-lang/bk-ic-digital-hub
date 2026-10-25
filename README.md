# BK-IC DIGITAL HUB
**Nền tảng Số & Cổng Quản trị Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo (BK-IC)**
*Trường Đại học Bách khoa – Đại học Đà Nẵng (DUT)*

---

## 1. Tổng quan & Triết lý Thiết kế

**BK-IC Digital Hub** kết hợp hai phân hệ toàn diện:
1. **Public Website (Trang công khai đẳng cấp Apple Minimalist)**: Tiếp cận sinh viên, giới thiệu 5 ban chuyên trách, hệ sinh thái hoạt động đổi mới sáng tạo, vườn ươm dự án thực tế, tư liệu lịch sử và cổng nộp đơn tuyển thành viên Gen 2026.
2. **Internal Management Hub (Cổng Thành viên & Bảng Quản trị Admin)**: Hệ thống điểm danh bằng mã QR động xoay vòng 20–30s chống gian lận, bảng chấm điểm rèn luyện 10 điểm (Chuyên cần 4đ - Cống hiến 4đ - Trách nhiệm 2đ), thu thập phản hồi ẩn danh, quản lý tuyển sinh và nhật ký kiểm toán (Audit Logs).

### Nguồn Dữ liệu Xác thực (Provenance)
- **Tên chính thức:** Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo - Bách Khoa Innovation Club (BK-IC).
- **Đơn vị chủ quản:** Trường Đại học Bách khoa – Đại học Đà Nẵng (DUT).
- **Tư liệu báo chí:** Ghi nhận tại bài viết *"Thúc đẩy liên kết trong khởi nghiệp"* xuất bản ngày 04/04/2026 trên Báo Đà Nẵng điện tử ([baodanang.vn](https://baodanang.vn/thuc-day-lien-ket-trong-khoi-nghiep-3330893.html)).

---

## 2. Kiến trúc & Cấu trúc Thư mục

```text
src/
├── components/
│   ├── brand/
│   │   └── Logo.tsx               # Logo BK-IC vector hình học & innovation node
│   ├── layout/
│   │   ├── Navbar.tsx             # Navbar mờ translucent Apple-style + Quick Role Switcher
│   │   ├── Footer.tsx             # Chân trang với minh chứng đại học DUT
│   │   └── PublicLayout.tsx       # Bố cục trang công khai
│   ├── home/
│   │   └── HeroCanvas.tsx         # Canvas tương tác mạng lưới kết nối các ý tưởng
│   ├── qr/
│   │   ├── DynamicQRProjector.tsx # Màn hình trình chiếu máy chiếu xoay vòng mã QR
│   │   └── QRScannerModal.tsx     # Hộp thoại quét QR & xác thực thời gian thực
│   ├── portal/
│   │   └── PortalLayout.tsx       # Khung giao diện thành viên (Sidebar tinh gọn)
│   └── admin/
│       └── AdminLayout.tsx        # Khung quản trị tối cao với phân quyền chặt chẽ
├── context/
│   └── AppContext.tsx             # Quản lý trạng thái toàn cục, CRUD, thuật toán token & audit logs
├── data/
│   └── initialData.ts             # Dữ liệu chuẩn DUT, dự án sinh viên và phiên sinh hoạt mẫu
├── pages/
│   ├── HomePage.tsx               # Trang chủ 11 khối nội dung chuẩn Master Prompt
│   ├── AboutPage.tsx              # Giới thiệu sứ mệnh, tầm nhìn, 5 ban chuyên trách
│   ├── ActivitiesPage.tsx         # 4 track trải nghiệm & đào tạo
│   ├── EventsPage.tsx             # Danh mục sự kiện & đăng ký tham dự
│   ├── ProjectsPage.tsx           # Vườn ươm dự án DeepTech, IoT, AI sinh viên
│   ├── NewsPage.tsx               # Báo chí & văn bản quy chế xác thực
│   ├── JoinPage.tsx               # Đơn ứng tuyển trực tuyến & Tra cứu trạng thái hồ sơ
│   ├── ContactPage.tsx            # Liên hệ trụ sở DUT & đề xuất hợp tác
│   ├── auth/
│   │   ├── LoginPage.tsx          # Đăng nhập & nút chọn nhanh vai trò thử nghiệm
│   │   └── PendingApprovalPage.tsx# Màn hình chờ duyệt dành cho ứng viên mới
│   ├── portal/
│   │   ├── PortalDashboardPage.tsx# Tổng quan thành viên, tỷ lệ chuyên cần, điểm số
│   │   ├── PortalProfilePage.tsx  # Hồ sơ học tập cá nhân (xem & sửa)
│   │   ├── PortalSessionsPage.tsx # Lịch trình sinh hoạt định kỳ
│   │   ├── PortalAttendancePage.tsx # Bảng điểm danh & gửi đơn xin phép vắng mặt
│   │   ├── PortalEvaluationsPage.tsx # Bảng điểm rèn luyện 10 điểm (Bảo mật cá nhân)
│   │   └── PortalFeedbackPage.tsx # Đánh giá sau buổi học (Hỗ trợ ẩn danh 100%)
│   └── admin/
│       ├── AdminDashboardPage.tsx # Thống kê tổng hợp, biểu đồ ban, audit stream
│       ├── AdminMembersPage.tsx   # Quản lý thành viên, phân ban & xuất CSV Excel
│       ├── AdminSessionsPage.tsx  # Quản lý buổi học & Nút trình chiếu QR máy chiếu
│       ├── AdminAttendancePage.tsx# Đối soát dữ liệu điểm danh & sửa lỗi có ghi nhận lý do
│       ├── AdminEvaluationsPage.tsx # Chấm điểm rèn luyện thanh trượt 3 tiêu chí
│       ├── AdminFeedbackPage.tsx  # Phân tích mức độ hài lòng thành viên
│       ├── AdminApplicationsPage.tsx# Phễu tuyển dụng & 1-click kết nạp thành viên
│       ├── AdminContentPage.tsx   # Hệ quản trị nội dung CMS (Trang chủ, Hero, Thông báo)
│       └── AdminSettingsPage.tsx  # Cấu hình chu kỳ xoay QR, sao lưu & khôi phục dữ liệu
├── types/
│   └── index.ts                   # Định nghĩa kiểu dữ liệu TypeScript
├── App.tsx                        # Bộ định tuyến ứng dụng toàn diện
└── index.css                      # Kiểu dáng toàn cục Tailwind v4 & phông Be Vietnam Pro
```

---

## 3. Các Tính năng Trọng tâm

### A. Hệ thống Điểm danh QR Xoay vòng Động (Dynamic Token)
- Ban tổ chức mở phiên sinh hoạt và bấm **"Trình chiếu QR Lên Máy Chiếu"**.
- Mã QR tự sinh mã bảo mật không đối xứng dựa trên `sessionId + TimeWindowSlot`.
- Mã tự động làm mới sau mỗi **20 giây** kèm thanh tiến trình đếm ngược.
- Thành viên quét mã bằng camera điện thoại hoặc nhập trực tiếp mã hiển thị.
- Hệ thống tự động so khớp giờ quét với `lateThresholdTime` để phân định **Có mặt đúng giờ** hay **Đến muộn**.
- Chặn 100% việc một thành viên điểm danh trùng lặp trong cùng một phiên.

### B. Cơ chế Đánh giá & Rèn luyện 10 Điểm
- **Chuyên cần (Attendance):** Tối đa 4.0 điểm, tính tự động theo tần suất quét mã.
- **Cống hiến Dự án (Contribution):** Tối đa 4.0 điểm, do Trưởng ban chuyên môn đánh giá.
- **Trách nhiệm & Kỷ luật (Responsibility):** Tối đa 2.0 điểm.
- Quy trình duyệt điểm: `Draft -> Submitted -> Approved -> Locked`.
- Bảo đảm tính riêng tư tuyệt đối: Thành viên chỉ xem được bảng điểm của chính mình.

### C. Cơ chế Thu thập Ý kiến Đóng góp Ẩn danh (Session Feedback)
- Đánh giá theo 3 thang điểm sao (Hữu ích, Dễ hiểu, Tổ chức) kèm 3 câu hỏi định tính.
- Nút gạt **"Chế độ Gửi Ẩn danh"**: Khi kích hoạt, ID và họ tên thành viên được loại bỏ hoàn toàn trước khi lưu vào cơ sở dữ liệu.

### D. Phân quyền Người dùng (RBAC) & Quản trị Bảo mật
Hệ thống tuân thủ mô hình phân quyền chặt chẽ:
- **Quản trị viên Hệ thống (Admin):** Toàn quyền cấu hình, phê duyệt trạng thái tài khoản, xem audit log, xuất báo cáo.
- **Ban Chủ nhiệm (BN):** Quản lý định hướng, phê duyệt bảo lưu/thay đổi trạng thái thành viên, phát hành liên kết bảo mật.
- **Ban Điều hành (BĐH):** Quản lý dự án, tổ chức meeting/workshop, phụ trách phiên sinh hoạt (PIC).
- **Ban Thành viên (BTV):** Quản lý danh sách nhân sự, đối soát điểm danh, điểm danh thủ công tại chỗ.
- **Thành viên Chính thức (Member):** Quét QR điểm danh, xem lịch sinh hoạt, gửi phản hồi sau training.
- **Ứng viên (Applicant):** Theo dõi tiến độ duyệt đơn tại `/pending-approval`.

---

## 4. Hướng dẫn Khởi chạy, Kiểm thử & Triển khai Production

### Khởi động trong môi trường phát triển (Development)
```bash
# Cài đặt các gói phụ thuộc
npm install

# Khởi động máy chủ fullstack dev (Port 3000)
npm run dev

# Chạy kiểm tra kiểu dữ liệu và syntax
npm run lint

# Chạy toàn bộ 39 kịch bản kiểm thử tự động
npm test
```

### Đóng gói và Khởi chạy Production
```bash
# 1. Đóng gói mã nguồn frontend (React + Tailwind CSS)
npm run build

# 2. Khởi động server production (Express phục vụ static build và API)
npm start
```

### Kiểm tra Trạng thái Máy chủ (Health Check Endpoint)
Endpoint công khai hỗ trợ Cloud Run uptime check và giám sát:
```bash
curl -s http://localhost:3000/api/health
```
Phản hồi mẫu:
```json
{
  "status": "ok",
  "service": "BK-IC Digital Hub Fullstack API",
  "version": "1.0.0",
  "environment": "production",
  "uptimeSec": 120,
  "timestamp": "2026-10-22T10:30:00.000Z",
  "timezone": "Asia/Ho_Chi_Minh",
  "database": {
    "status": "healthy",
    "usersCount": 174,
    "sessionsCount": 70,
    "attendanceCount": 54,
    "unitsCount": 3
  }
}
```

### Cơ chế Sao lưu & Phục hồi Cơ sở Dữ liệu (Disaster Recovery)
- Dữ liệu được lưu trữ nguyên tử qua cơ chế ghi tạm và rename `renameSync` tại `data/db.json`.
- Hệ thống tự động tạo các bản sao lưu xoay vòng định kỳ vào thư mục `data/backups/db.backup.<timestamp>.json` (duy trì tối đa 5 bản sao gần nhất).
- Khi khởi động, nếu file dữ liệu chính bị thiếu hoặc lỗi, engine tự động phát hiện và khôi phục từ bản sao lưu hợp lệ mới nhất.

### Xuất Báo cáo Excel tiếng Việt
Tất cả các tính năng xuất CSV (Danh sách thành viên, Dữ liệu điểm danh, Đơn ứng tuyển) đều được nhúng mã **Byte Order Mark (`\uFEFF`)** chuẩn UTF-8, đảm bảo mở trực tiếp trên Microsoft Excel mà không bị lỗi dấu tiếng Việt.

