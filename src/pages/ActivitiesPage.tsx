// BK-IC Activities Page
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Lightbulb, 
  Rocket, 
  Code2, 
  Users, 
  Calendar, 
  Award, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const tracks = [
    {
      title: 'Chuỗi Workshop Công nghệ & Đổi mới (Innovation Workshops)',
      desc: 'Tổ chức định kỳ 2 tuần/lần với sự tham gia của các chuyên gia công nghệ hàng đầu chia sẻ về AI ứng dụng, IoT công nghiệp, Robotics, và các công nghệ cốt lõi phục vụ đề tài sinh viên.',
      frequency: '2 tuần / lần',
      skills: ['Edge AI', 'IoT & Embedded', 'CleanTech', 'Cloud Solutions']
    },
    {
      title: 'Khóa Huấn luyện Khởi nghiệp Tinh gọn (Lean Startup Bootcamp)',
      desc: 'Trang bị cho sinh viên phương pháp xây dựng sản phẩm từ con số không, kiểm chứng giả thuyết thị trường, khảo sát người dùng thực tế và tính toán bài toán tài chính đơn vị (Unit Economics).',
      frequency: 'Đầu mỗi học kỳ',
      skills: ['Lean Canvas', 'Customer Empathy', 'Value Proposition', 'MVP Testing']
    },
    {
      title: 'Không gian Nghiên cứu Thực nghiệm (Project Sprint Lab)',
      desc: 'Môi trường làm việc chung tại Smart Campus DUT với đầy đủ trang thiết bị phần cứng, máy in 3D, bộ đo kiểm vi mạch và server thử nghiệm cloud phục vụ các nhóm hoàn thiện mẫu thử.',
      frequency: 'Hàng tuần',
      skills: ['Rapid Prototyping', 'Hardware Testing', 'Agile/Scrum', 'Git Flow']
    },
    {
      title: 'Đấu trường Ý tưởng & Pitching Thử nghiệm (Demo Day)',
      desc: 'Sân chơi mô phỏng các buổi gọi vốn thực tế. Các đội sinh viên trình bày 3 phút (Elevator Pitch) và trả lời chất vấn từ các nhà đầu tư thiên thần, doanh nghiệp đối tác.',
      frequency: 'Cuối mỗi kỳ ươm tạo',
      skills: ['Pitch Deck', 'Thuyết trình Tiếng Anh', 'Định giá Dự án', 'Q&A Defense']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA]">
            <Rocket className="h-3.5 w-3.5" />
            <span>HỆ SINH THÁI HOẠT ĐỘNG TOÀN DIỆN</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
            Lộ trình Trải nghiệm tại BK-IC
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Chúng mình thiết kế một hành trình khép kín giúp mỗi sinh viên từ người chưa có kinh nghiệm có thể từng bước tự tin làm chủ công nghệ và phát triển dự án thực tế.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map((track, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs hover:border-blue-400 hover:shadow-md transition duration-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {track.frequency}
                </span>
                <span className="font-mono text-xs font-bold text-slate-300">
                  TRACK 0{i + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {track.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {track.desc}
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 mb-2">
                  Kỹ năng rèn luyện:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {track.skills.map((s, idx) => (
                    <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Regular Session Notice */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg font-bold text-slate-900">
              Sinh hoạt định kỳ Thứ Bảy hàng tuần
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tất cả thành viên chính thức tham gia sinh hoạt trực tiếp tại giảng đường DUT để báo cáo tiến độ dự án, trao đổi học thuật và điểm danh bằng hệ thống mã QR số hóa của Digital Hub.
            </p>
          </div>
          <Link
            to="/events"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#245BFA] px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            <span>Xem lịch sinh hoạt</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
