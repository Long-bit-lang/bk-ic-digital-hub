// BK-IC About Page — Section 04: Four Key Fields of Activity
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Rocket, Award, Network } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';

interface FieldItem {
  id: string;
  num: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  linkText: string;
  linkTo: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FIELDS: FieldItem[] = [
  {
    id: 'training',
    num: '01',
    title: 'Đào tạo và phát triển năng lực',
    description: 'Tổ chức các chương trình chia sẻ kiến thức, workshop, tọa đàm và hoạt động đào tạo nhằm trang bị tư duy khởi nghiệp, kỹ năng đổi mới sáng tạo và năng lực phát triển dự án cho sinh viên.',
    image: '/images/bkic/startup_training.jpg',
    badge: 'ĐÀO TẠO & WORKSHOP',
    linkText: 'Xem chuỗi Workshop',
    linkTo: '/activities/workshops',
    icon: BookOpen
  },
  {
    id: 'incubation',
    num: '02',
    title: 'Khởi nghiệp và phát triển ý tưởng',
    description: 'Tạo môi trường để sinh viên hình thành, hoàn thiện và thử nghiệm các ý tưởng khởi nghiệp; từng bước tiếp cận quy trình xây dựng mô hình kinh doanh và phát triển sản phẩm.',
    image: '/images/bkic/bkshark_ecosim_pitch.jpg',
    badge: 'ƯƠM TẠO Ý TƯỞNG',
    linkText: 'Dự án đồng hành',
    linkTo: '/activities/companion-projects',
    icon: Rocket
  },
  {
    id: 'competitions',
    num: '03',
    title: 'Cuộc thi và dự án đổi mới sáng tạo',
    description: 'Tham gia tổ chức, đồng hành và kết nối các cuộc thi, chương trình sáng tạo, dự án nghiên cứu và hoạt động phát triển giải pháp hướng đến những vấn đề thực tiễn.',
    image: '/images/bkic/bkshark_auditorium.jpg',
    badge: 'CUỘC THI & SÂN CHƠI',
    linkText: 'Khám phá cuộc thi',
    linkTo: '/activities/competitions',
    icon: Award
  },
  {
    id: 'networking',
    num: '04',
    title: 'Kết nối và hợp tác',
    description: 'Thúc đẩy giao lưu, chia sẻ kinh nghiệm và hợp tác giữa sinh viên với giảng viên, cựu sinh viên, chuyên gia, doanh nghiệp và các tổ chức trong hệ sinh thái đổi mới sáng tạo.',
    image: '/images/bkic/bkshark_danangbooth.jpg',
    badge: 'HỢP TÁC ĐA CHIỀU',
    linkText: 'Cổng kết nối đối tác',
    linkTo: '/partnership',
    icon: Network
  }
];

export const AboutFieldsSection: React.FC = () => {
  return (
    <section id="fields" className="relative scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="04 • LĨNH VỰC HOẠT ĐỘNG"
        title="Từ tri thức đến hành động, từ ý tưởng đến giá trị"
        subtitle="BK-IC tập trung phát triển các hoạt động xoay quanh bốn định hướng chính nhằm nâng bước sinh viên trên từng chặng đường."
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.id}
              className="group rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-7 shadow-md shadow-slate-900/5 hover:border-[#1749B5] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-4">
                {/* Photo Preview with Zoom Effect */}
                <div className="relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={field.image}
                    alt={field.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Top Left Badge & Number */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1749B5] shadow-xs">
                      {field.badge}
                    </span>
                    <span className="h-7 w-7 rounded-full bg-slate-950/60 backdrop-blur-md text-white font-mono text-xs font-bold flex items-center justify-center">
                      {field.num}
                    </span>
                  </div>

                  {/* Icon Floating at bottom left */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#10182D] group-hover:text-[#1749B5] transition-colors leading-snug">
                  {field.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed font-normal">
                  {field.description}
                </p>
              </div>

              {/* Bottom Link CTA */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={field.linkTo}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:text-[#245BFA] transition-colors"
                >
                  <span>{field.linkText}</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <span className="text-[10px] font-mono text-slate-400">DUT • 2026</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

