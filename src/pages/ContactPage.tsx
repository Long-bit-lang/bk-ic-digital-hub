// BK-IC Contact & Collaboration Page
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  MapPin, 
  Building2, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings } = useApp();
  const [sent, setSent] = useState(false);
  const [contactData, setContactData] = useState({
    senderName: '',
    senderEmail: '',
    organization: '',
    subject: 'Hợp tác Đào tạo & Ươm tạo Khởi nghiệp',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>KẾT NỐI & HỢP TÁC ĐỔI MỚI SÁNG TẠO</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
            Liên hệ Bách Khoa Innovation Club
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Chúng mình luôn chào đón sự đồng hành từ các doanh nghiệp công nghệ, quỹ đầu tư, cựu sinh viên và các đối tác vườn ươm khởi nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900">
                Thông tin Trực tiếp
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-xs">Đơn vị chủ quản:</strong>
                    <span>Trường Đại học Bách khoa – Đại học Đà Nẵng</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-xs">Văn phòng CLB & Smart Campus:</strong>
                    <span>{siteSettings.contactAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-xs">Hòm thư điện tử chính thức:</strong>
                    <span className="font-mono text-blue-600 font-medium">{siteSettings.contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="font-semibold text-slate-800">Khung giờ tiếp sinh viên:</div>
                <div>Thứ Hai – Thứ Sáu: 08:00 – 17:00</div>
                <div>Sinh hoạt chuyên đề toàn CLB: Thứ Bảy (14:00 – 17:00)</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
                <div className="font-semibold text-slate-800">Liên kết tham chiếu:</div>
                <a
                  href="https://dut.udn.vn/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-blue-600 hover:underline"
                >
                  <span>Cổng thông tin ĐH Bách khoa (DUT)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              {sent ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Đã gửi đề nghị liên hệ!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Ban Đối ngoại & Ban Chủ nhiệm BK-IC sẽ phản hồi qua email <strong className="text-slate-800">{contactData.senderEmail}</strong> trong vòng 24 - 48 giờ làm việc.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setContactData({
                        senderName: '',
                        senderEmail: '',
                        organization: '',
                        subject: 'Hợp tác Đào tạo & Ươm tạo Khởi nghiệp',
                        message: ''
                      });
                    }}
                    className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Gửi Đề xuất Hợp tác hoặc Câu hỏi
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={contactData.senderName}
                        onChange={(e) => setContactData({ ...contactData, senderName: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email liên hệ *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={contactData.senderEmail}
                        onChange={(e) => setContactData({ ...contactData, senderEmail: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cơ quan / Doanh nghiệp / Khoa viện
                    </label>
                    <input
                      type="text"
                      placeholder="Tên doanh nghiệp hoặc lớp sinh hoạt..."
                      value={contactData.organization}
                      onChange={(e) => setContactData({ ...contactData, organization: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chủ đề liên hệ
                    </label>
                    <select
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Hợp tác Đào tạo & Ươm tạo Khởi nghiệp">Hợp tác Đào tạo & Ươm tạo Khởi nghiệp</option>
                      <option value="Tài trợ Dự án & Thiết bị Nghiên cứu">Tài trợ Dự án & Thiết bị Nghiên cứu</option>
                      <option value="Mời Diễn giả / Cố vấn Chuyên môn">Mời Diễn giả / Cố vấn Chuyên môn</option>
                      <option value="Thắc mắc về Đơn Tuyển dụng">Thắc mắc về Đơn Tuyển dụng</option>
                      <option value="Ý kiến Đóng góp Khác">Ý kiến Đóng góp Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nội dung chi tiết *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Mô tả cụ thể nội dung bạn muốn trao đổi cùng Ban Chủ nhiệm BK-IC..."
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#245BFA] py-3 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <span>Gửi tin nhắn</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
