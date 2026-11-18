// BK-IC Digital Hub — Network Ecosystem & Partnership Invitation
// Replaces synthetic logos with verified connection groups & open collaboration call
import React from 'react';
import { PARTNERSHIP_ECOSYSTEM_GROUPS } from '../../data/partnershipData';
import { Compass, Users, ArrowRight, Handshake, Sparkles } from 'lucide-react';

interface PartnershipPartnersProps {
  onRequestClick?: () => void;
}

export const PartnershipPartners: React.FC<PartnershipPartnersProps> = ({ onRequestClick }) => {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Compass className="h-3.5 w-3.5" />
            <span>MẠNG LƯỚI KẾT NỐI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Mở rộng Cơ hội Kết nối Đa chiều
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            BK-IC chủ động thiết lập và duy trì mối liên hệ mật thiết với các lực lượng trong và ngoài khuôn viên trường, cùng nhau xây dựng không gian hỗ trợ toàn diện cho sinh viên Bách khoa.
          </p>
        </div>

        {/* 7 Network Connection Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PARTNERSHIP_ECOSYSTEM_GROUPS.map((group) => {
            const Icon = group.icon;

            return (
              <div
                key={group.id}
                className="flex flex-col justify-between p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-[#0284C7] bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full uppercase">
                      {group.tag}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#10182D]">
                    {group.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#0284C7]">
                    {group.role}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {group.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-400">
                  Mạng lưới kết nối mở rộng • BK-IC DUT
                </div>
              </div>
            );
          })}
        </div>

        {/* Open Call for Partnership Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50/60 border border-sky-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#0284C7] border border-sky-200 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>LỜI MỜI GỌI ĐỒNG HÀNH</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#075985]">
              Bạn đang tìm kiếm đối tác đồng hành tại Bách khoa Đà Nẵng?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Dù bạn là doanh nghiệp muốn đặt bài toán, chuyên gia muốn chia sẻ tri thức, hay đơn vị mong muốn phối hợp tổ chức sân chơi sáng tạo, BK-IC luôn sẵn sàng lắng nghe và trao đổi.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestClick}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <Handshake className="h-4 w-4" />
            <span>Đề xuất hợp tác ngay</span>
          </button>
        </div>
      </div>
    </section>
  );
};
