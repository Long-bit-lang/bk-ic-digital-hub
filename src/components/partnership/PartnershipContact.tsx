// BK-IC Digital Hub — Official Companion Project Contact Information
import React from 'react';
import { Mail, MapPin, Globe, Facebook, ArrowRight, MessageSquare } from 'lucide-react';
import { COMPANION_CONTACT_INFO } from '../../data/partnershipData';

interface PartnershipContactProps {
  onRequestClick: () => void;
}

export const PartnershipContact: React.FC<PartnershipContactProps> = ({ onRequestClick }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-sky-50/50 border-t border-slate-100 relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>KÊNH LIÊN HỆ BAN CHUYÊN MÔN</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Kết Nối Trực Tiếp Với Ban Chủ Nhiệm BK-IC
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Các bạn sinh viên và nhóm dự án cần trao đổi riêng có thể liên hệ trực tiếp qua các kênh thông tin chính thức dưới đây.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Email */}
          <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#10182D]">Thư điện tử (Email)</h3>
            <p className="mt-1 text-xs text-slate-500">Tiếp nhận pitch deck &amp; tài liệu dự án</p>
            <a
              href={`mailto:${COMPANION_CONTACT_INFO.email}`}
              className="mt-3 text-xs sm:text-sm font-bold text-[#0284C7] hover:underline break-all"
            >
              {COMPANION_CONTACT_INFO.email}
            </a>
          </div>

          {/* Address */}
          <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#10182D]">Không gian Sinh hoạt</h3>
            <p className="mt-1 text-xs text-slate-500">Khuôn viên Bách khoa Đà Nẵng</p>
            <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-snug">
              {COMPANION_CONTACT_INFO.address}
            </p>
          </div>

          {/* Fanpage */}
          <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
              <Facebook className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#10182D]">Kênh Fanpage</h3>
            <p className="mt-1 text-xs text-slate-500">Nhắn tin trực tiếp cho Admin</p>
            <a
              href={COMPANION_CONTACT_INFO.fanpageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-xs sm:text-sm font-bold text-[#0284C7] hover:underline"
            >
              facebook.com/dut.bkic
            </a>
          </div>

          {/* Website */}
          <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#10182D]">Cổng Thông tin Số</h3>
            <p className="mt-1 text-xs text-slate-500">Hệ sinh thái số hóa BK-IC Hub</p>
            <a
              href={COMPANION_CONTACT_INFO.website}
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-xs sm:text-sm font-bold text-[#0284C7] hover:underline"
            >
              bkic.dut.udn.vn
            </a>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-sky-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Bạn có ý tưởng công nghệ và muốn biến thành hiện thực?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
              Hãy gửi thông tin dự án về cho Ban Chuyên môn BK-IC để được hỗ trợ kiểm tra tính khả thi và đồng hành kỹ thuật.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestClick}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#075985] hover:bg-sky-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Điền đơn đăng ký dự án</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
