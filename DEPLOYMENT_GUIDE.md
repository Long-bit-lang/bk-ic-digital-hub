# HƯỚNG DẪN TRIỂN KHAI BK-IC DIGITAL HUB LÊN MÔI TRƯỜNG WEB (PRODUCTION)

Tài liệu hướng dẫn chi tiết các phương án đưa website BK-IC Digital Hub từ máy tính cá nhân lên internet để các thành viên câu lạc bộ và sinh viên Trường Đại học Bách khoa – ĐHĐN có thể truy cập 24/7.

---

## MỤC LỤC
1. [Chuẩn bị mã nguồn & Đẩy lên GitHub](#1-chuẩn-bị-mã-nguồn--đẩy-lên-github)
2. [Phương án 1: Triển khai nhanh miễn phí trên Cloud (Render / Railway)](#2-phương-án-1-triển-khai-nhanh-miễn-phí-trên-cloud-render--railway)
3. [Phương án 2: Triển khai lên VPS / Máy chủ trường Bách khoa (Khuyên dùng)](#3-phương-án-2-triển-khai-lên-vps--máy-chủ-trường-bách-khoa-khuyên-dùng)
4. [Phương án 3: Triển khai bằng Docker](#4-phương-án-3-triển-khai-bằng-docker)
5. [Cấu hình Biến môi trường (Environment Variables)](#5-cấu-hình-biến-môi-trường-environment-variables)
6. [Kiểm tra sau khi triển khai](#6-kiểm-tra-sau-khi-triển-khai)

---

## 1. Chuẩn bị mã nguồn & Đẩy lên GitHub

Để triển khai lên bất kỳ nền tảng cloud nào, bước đầu tiên bạn cần đưa code lên một kho lưu trữ Git (GitHub hoặc GitLab).

### Bước 1.1: Tạo kho lưu trữ mới trên GitHub
1. Đăng nhập vào [github.com](https://github.com).
2. Nhấn nút **New repository**.
3. Đặt tên (ví dụ: `bk-ic-digital-hub`), chọn chế độ **Private** (khuyên dùng để bảo vệ cấu hình nội bộ) hoặc **Public**.
4. Nhấn **Create repository**.

### Bước 1.2: Đẩy code từ máy tính lên GitHub
Mở Terminal tại thư mục dự án và chạy các lệnh:

```bash
# Kiểm tra trạng thái git
git status

# Đưa tất cả các thay đổi vào commit
git add .
git commit -m "feat: production ready clean database and deployment configs"

# Đổi nhánh chính thành main
git branch -M main

# Liên kết với GitHub repo của bạn (thay <username> bằng tên tài khoản GitHub của bạn)
git remote add origin https://github.com/<username>/bk-ic-digital-hub.git

# Đẩy code lên GitHub
git push -u origin main
```

*(Lưu ý: File mật khẩu `.env` đã được `.gitignore` bảo vệ tự động, không lo bị lộ mật khẩu mail lên GitHub).*

---

## 2. Phương án 1: Triển khai nhanh miễn phí trên Cloud (Render / Railway)

*Phù hợp để demo nhanh, chạy thử nghiệm cho các thành viên trải nghiệm mà không tốn chi phí thuê máy chủ.*

### Cách làm với Render.com:
1. Truy cập [render.com](https://render.com) và chọn **Sign In** (Đăng nhập bằng tài khoản GitHub).
2. Nhấn nút **New +** ở góc trên bên phải ➔ Chọn **Web Service**.
3. Chọn kho lưu trữ `bk-ic-digital-hub` bạn vừa đẩy lên.
4. Điền các thông tin cấu hình:
   - **Name:** `bkic-digital-hub`
   - **Region:** `Singapore` (để tốc độ về Việt Nam nhanh nhất)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Nhấn mở mục **Advanced** ➔ **Add Environment Variable** và thêm các dòng sau:
   - `NODE_ENV`: `production`
   - `SMTP_USER`: `hoanglong280907@gmail.com`
   - `SMTP_PASS`: `xbcc vzbc emhn qrzu`
   - `SMTP_FROM`: `BK-IC Digital Hub <hoanglong280907@gmail.com>`
6. Nhấn **Deploy Web Service**.
7. Đợi khoảng 2–3 phút, Render sẽ cấp cho bạn một đường dẫn công khai dạng:
   👉 `https://bkic-digital-hub.onrender.com`

---

## 3. Phương án 2: Triển khai lên VPS / Máy chủ trường Bách khoa (Khuyên dùng)

*Đây là giải pháp tốt nhất để đưa vào vận hành lâu dài, dữ liệu `data/db.json` được lưu cố định trên ổ cứng và có thể gắn tên miền chính thức của trường (ví dụ: `hub.bkic.dut.udn.vn` hoặc `bkic.dut.udn.vn`).*

### Bước 3.1: Chuẩn bị máy chủ (Ubuntu 22.04 / 24.04 LTS)
Đăng nhập SSH vào máy chủ VPS:
```bash
ssh root@<IP_MÁY_CHỦ>
```

Cập nhật hệ điều hành và cài đặt các công cụ cần thiết:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw certbot python3-certbot-nginx

# Cài đặt Node.js v22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt trình quản lý tiến trình PM2
sudo npm install -g pm2
```

### Bước 3.2: Tải mã nguồn và cài đặt
```bash
cd /var/www
git clone https://github.com/<username>/bk-ic-digital-hub.git bkic-hub
cd bkic-hub

# Tạo file cấu hình môi trường .env
nano .env
```
*(Dán nội dung `.env` với thông tin SMTP của bạn vào rồi lưu lại bằng `Ctrl + O` ➔ `Enter` ➔ `Ctrl + X`).*

Tiến hành cài đặt thư viện và đóng gói ứng dụng:
```bash
npm install
npm run build
```

### Bước 3.3: Khởi chạy dịch vụ với PM2
```bash
pm2 start npm --name "bkic-hub" -- start
pm2 save
pm2 startup
```
Ứng dụng sẽ chạy ngầm liên tục 24/7 và tự động khởi động lại nếu máy chủ bị reboot.

### Bước 3.4: Cấu hình Nginx làm cổng đón (Reverse Proxy) & Cấp SSL miễn phí
Tạo file cấu hình Nginx:
```bash
sudo nano /etc/nginx/sites-available/bkic-hub
```

Dán cấu hình sau (thay `hub.bkic.dut.udn.vn` bằng tên miền thật hoặc IP của bạn):
```nginx
server {
    server_name hub.bkic.dut.udn.vn;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt cấu hình và khởi động lại Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/bkic-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Cấp chứng chỉ bảo mật HTTPS miễn phí:
```bash
sudo certbot --nginx -d hub.bkic.dut.udn.vn
```

---

## 4. Phương án 3: Triển khai bằng Docker

Dự án đã được tích hợp sẵn [Dockerfile](file:///home/nhlong/Downloads/bk-ic-digital-hub%20%281%29/Dockerfile) và [docker-compose.yml](file:///home/nhlong/Downloads/bk-ic-digital-hub%20%281%29/docker-compose.yml).

Nếu máy chủ của bạn đã cài sẵn Docker:
```bash
# Khởi chạy toàn bộ hệ thống bằng 1 lệnh duy nhất:
docker compose up -d --build

# Xem nhật ký hoạt động:
docker compose logs -f
```

Thư mục `./data` sẽ tự động được gắn kết (mount) ra ngoài máy chủ, đảm bảo dữ liệu thành viên và các buổi họp không bị mất khi cập nhật container.

---

## 5. Cấu hình Biến môi trường (Environment Variables)

Khi triển khai trên bất kỳ dịch vụ nào, hãy chắc chắn khai báo đầy đủ các biến môi trường sau:

| Tên biến | Giá trị mẫu | Ý nghĩa |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Bật chế độ tối ưu hóa hiệu năng và bảo mật |
| `PORT` | `3000` | Cổng dịch vụ lắng nghe |
| `APP_URL` | `https://hub.bkic.dut.udn.vn` | Địa chỉ web chính thức (để gửi link trong email) |
| `SMTP_HOST` | `smtp.gmail.com` | Máy chủ gửi email |
| `SMTP_PORT` | `465` | Cổng SSL |
| `SMTP_SECURE` | `true` | Bật mã hóa bảo mật SSL |
| `SMTP_USER` | `hoanglong280907@gmail.com` | Tài khoản email gửi thư |
| `SMTP_PASS` | `xbcc vzbc emhn qrzu` | Mật khẩu ứng dụng Google (App Password) |
| `SMTP_FROM` | `BK-IC Digital Hub <hoanglong280907@gmail.com>` | Tên hiển thị người gửi email |

---

## 6. Kiểm tra sau khi triển khai

Ngay sau khi web khởi động thành công trên internet, bạn hãy thực hiện 3 bước kiểm tra:

1. **Kiểm tra Uptime & Health Check**:
   Mở trình duyệt truy cập:
   `https://<ten-mien-cua-ban>/api/health`
   Kết quả trả về JSON có `"status": "ok"` và `"usersCount": 1`.

2. **Đăng nhập Quản trị viên**:
   - Truy cập: `https://<ten-mien-cua-ban>/login`
   - Email: `admin.bkic@dut.udn.vn`
   - Mật khẩu: `123456`
   *(Sau khi đăng nhập lần đầu, hãy vào Cài đặt tài khoản để đổi mật khẩu quản trị bảo mật mới).*

3. **Kiểm tra gửi email thật**:
   Vào trang **Cấu hình Quản trị** (`/admin/settings`) ➔ Nhập email của bạn vào mục **Gửi thử nghiệm SMTP** ➔ Nhấn **Gửi thư thử nghiệm** để đảm bảo máy chủ gửi email kích hoạt bình thường.
