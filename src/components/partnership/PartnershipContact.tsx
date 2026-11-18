// BK-IC Digital Hub — Official Partnership Contact Information
import React from 'react';
import { Mail, MapPin, Globe, Facebook, ArrowRight } from 'lucide-react';
import { PARTNERSHIP_CONTACT_INFO } from '../../data/partnershipData';

interface PartnershipContactProps {
  onRequestClick: () => void;
}

export const PartnershipContact: React.FC<PartnershipContactProps> = ({ onRequestClick }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-sky-50/50 border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <span>LIÊN HỆ TRỰC TIẾP</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Kết nối trực tiếp với BK-IC
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Quý đơn vị cũng có thể trao đổi trực tiếp với Ban Chủ nhiệm thông qua các kênh liên lạc chính thức.
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
            <p className="mt-1 text-xs text-slate-500">Kênh tiếp nhận tài liệu &amp; hồ sơ</p>
            <a
              href={`mailto:${PARTNERSHIP_CONTACT_INFO.email}`}
              className="mt-3 text-xs sm:text-sm font-bold text-[#0284C7] hover:underline break-all"
            >
              {PARTNERSHIP_CONTACT_INFO.email}
            </a>
          </div>

          {/* Address */}
          <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#10182D]">Văn phòng CLB</h3>
            <p className="mt-1 text-xs text-slate-500">Địa điểm làm việc &amp; sinh hoạt</p>
            <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-snug">
              {PARTNERSHIP_CONTACT_INFO.address}
            </p>
          </div>

          {/* Fanpage */}
          <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
              <Facebook className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#10182D]">Kênh Fanpage</h3>
            <p className="mt-1 text-xs text-slate-500">Cập nhật tin tức &amp; hoạt động</p>
            <a
              href={PARTNERSHIP_CONTACT_INFO.fanpageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-xs sm:text-sm font-bold text-[#0284C7] hover:underline"
            >
              facebook.com/bkic.dut
            </a>
          </div>

          {/* Website */}
          <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#10182D]">Website chính thức</h3>
            <p className="mt-1 text-xs text-slate-500">Cổng thông tin số BK-IC Hub</p>
            <a
              href={PARTNERSHIP_CONTACT_INFO.website}
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
              Sẵn sàng đồng hành cùng thế hệ tài năng Bách khoa?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
              Hãy để lại thông tin đề xuất, Ban Chủ nhiệm sẽ chủ động kết nối và đồng hành cùng Quý đơn vị.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestClick}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0284C7] text-xs sm:text-sm font-bold shadow-lg hover:bg-sky-50 transition cursor-pointer"
          >
            <span>Gửi đề xuất hợp tác ngay</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

