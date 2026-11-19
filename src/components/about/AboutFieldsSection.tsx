// BK-IC About Page — Section 04: 5 Key Fields of Activity
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Lightbulb, Cpu, Rocket, Handshake, BookOpen } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';

interface FieldItem {
  id: string;
  num: string;
  title: string;
  points: string[];
  image: string;
  badge: string;
  linkText: string;
  linkTo: string;
  icon: React.ComponentType<{ className?: string }>;
  colSpanClass: string;
}

const FIELDS: FieldItem[] = [
  {
    id: 'startup-innovation',
    num: '01',
    title: 'Khởi nghiệp và đổi mới sáng tạo',
    points: [
      'Phát triển tư duy khởi nghiệp và tinh thần đổi mới sáng tạo.',
      'Hỗ trợ hình thành, hoàn thiện và phát triển ý tưởng kinh doanh.',
      'Tổ chức các cuộc thi, chương trình tìm kiếm và phát triển ý tưởng khởi nghiệp.'
    ],
    image: '/images/bkic/bkshark_ecosim_pitch.jpg',
    badge: 'KHỞI NGHIỆP & ĐMST',
    linkText: 'Khám phá cuộc thi',
    linkTo: '/activities/cuoc-thi',
    icon: Lightbulb,
    colSpanClass: 'lg:col-span-2'
  },
  {
    id: 'research-technology',
    num: '02',
    title: 'Nghiên cứu khoa học và phát triển công nghệ',
    points: [
      'Khuyến khích nghiên cứu khoa học và sáng tạo công nghệ trong sinh viên.',
      'Hỗ trợ phát triển sản phẩm, mô hình và giải pháp công nghệ.',
      'Thúc đẩy chuyển hóa kết quả nghiên cứu thành sản phẩm có khả năng ứng dụng.'
    ],
    image: '/images/bkic/bkdn_students.jpg',
    badge: 'NGHIÊN CỨU & CÔNG NGHỆ',
    linkText: 'Dự án công nghệ',
    linkTo: '/activities/du-an',
    icon: Cpu,
    colSpanClass: 'lg:col-span-2'
  },
  {
    id: 'incubation-projects',
    num: '03',
    title: 'Ươm tạo và phát triển dự án',
    points: [
      'Hỗ trợ các dự án tiềm năng trong quá trình hình thành và phát triển.',
      'Kết nối mentor, chuyên gia và nguồn lực hỗ trợ.',
      'Định hướng xây dựng mô hình kinh doanh và phát triển sản phẩm.'
    ],
    image: '/images/bkic/bkshark_auditorium.jpg',
    badge: 'ƯƠM TẠO DỰ ÁN',
    linkText: 'Dự án đồng hành',
    linkTo: '/activities/du-an',
    icon: Rocket,
    colSpanClass: 'lg:col-span-2'
  },
  {
    id: 'enterprise-transfer',
    num: '04',
    title: 'Kết nối doanh nghiệp và chuyển giao công nghệ',
    points: [
      'Kết nối sinh viên với doanh nghiệp và cộng đồng khởi nghiệp.',
      'Mở rộng cơ hội hợp tác, thực tập và việc làm.',
      'Thúc đẩy kết nối các giải pháp công nghệ với thị trường.'
    ],
    image: '/images/bkic/bkshark_danangbooth.jpg',
    badge: 'KẾT NỐI DOANH NGHIỆP',
    linkText: 'Cổng kết nối đối tác',
    linkTo: '/partnership',
    icon: Handshake,
    colSpanClass: 'lg:col-span-3'
  },
  {
    id: 'training-workforce',
    num: '05',
    title: 'Đào tạo và phát triển nguồn nhân lực',
    points: [
      'Tổ chức các khóa đào tạo, workshop và buổi chia sẻ chuyên đề.',
      'Trang bị kỹ năng mềm, kỹ năng quản lý dự án và phát triển sản phẩm.',
      'Xây dựng đội ngũ sinh viên năng động, sáng tạo và có tư duy làm chủ.'
    ],
    image: '/images/bkic/startup_training.jpg',
    badge: 'ĐÀO TẠO & PHÁT TRIỂN',
    linkText: 'Chuỗi Workshop',
    linkTo: '/activities/workshop',
    icon: BookOpen,
    colSpanClass: 'lg:col-span-3'
  }
];

export const AboutFieldsSection: React.FC = () => {
  return (
    <section id="fields" className="relative scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="04 • LĨNH VỰC HOẠT ĐỘNG (OUR FIELDS)"
        title="5 Lĩnh vực Hoạt động Trọng tâm"
        subtitle="BK-IC tập trung vào 5 lĩnh vực trọng tâm nhằm phát triển tư duy, kết nối nguồn lực và hỗ trợ chuyển hóa ý tưởng thành dự án thực tế."
        className="max-w-4xl"
        titleClassName="text-2xl sm:text-4xl lg:text-5xl sm:whitespace-nowrap"
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
        {FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.id}
              className={`group rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-7 shadow-md shadow-slate-900/5 hover:border-[#1749B5] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${field.colSpanClass}`}
            >
              <div className="space-y-4">
                {/* Photo Preview with Zoom Effect */}
                <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={field.image}
                    alt={field.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
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
                <h3 className="text-base sm:text-lg font-bold text-[#10182D] group-hover:text-[#1749B5] transition-colors leading-snug">
                  {field.title}
                </h3>

                {/* Bullet Points */}
                <ul className="space-y-2 pt-1">
                  {field.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475467] leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1749B5] mt-2 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Link CTA */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={field.linkTo}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:text-[#245BFA] transition-colors"
                >
                  <span>{field.linkText}</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <span className="text-[10px] font-mono text-slate-400">BK-IC • DUT</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
