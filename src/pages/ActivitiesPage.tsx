// BK-IC Activities Magazine — Minimalist Editorial 6-Category Platform
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SectionHeading } from '../components/editorial/SectionHeading';
import { Button } from '../components/editorial/Buttons';
import { ActivityCard, CompetitionCard, EditorialCard } from '../components/editorial/EditorialCards';
import { CTASection } from '../components/editorial/CTASection';
import { 
  Rocket, 
  Calendar, 
  Users, 
  Award, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  X, 
  ArrowRight,
  Upload,
  Link as LinkIcon,
  Layers,
  Flame,
  FileText,
  Briefcase
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { sessions, siteSettings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Active Category resolution from pathname or state
  const getCategoryFromPath = () => {
    const path = location.pathname;
    if (path.includes('/internal')) return 'internal';
    if (path.includes('/workshops')) return 'workshops';
    if (path.includes('/competitions')) return 'competitions';
    if (path.includes('/companion-projects')) return 'projects';
    if (path.includes('/bk-shark')) return 'shark';
    if (path.includes('/recruitment')) return 'recruitment';
    return 'all';
  };

  const [activeTab, setActiveTab] = useState<string>(getCategoryFromPath());

  useEffect(() => {
    setActiveTab(getCategoryFromPath());
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'all') navigate('/activities');
    else if (tabId === 'internal') navigate('/activities/internal');
    else if (tabId === 'workshops') navigate('/activities/workshops');
    else if (tabId === 'competitions') navigate('/activities/competitions');
    else if (tabId === 'projects') navigate('/activities/companion-projects');
    else if (tabId === 'shark') navigate('/activities/bk-shark');
    else if (tabId === 'recruitment') navigate('/activities/recruitment');
  };

  // Workshop Registration Modal State
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<{ id: string; title: string } | null>(null);
  const [wsFormData, setWsFormData] = useState({ fullName: '', email: '', phone: '', organization: '', questions: '' });
  const [wsSubmitting, setWsSubmitting] = useState(false);
  const [wsSuccess, setWsSuccess] = useState(false);

  // Competition Registration Modal State
  const [compModalOpen, setCompModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<{ id: string; title: string } | null>(null);
  const [compFormData, setCompFormData] = useState({
    regType: 'individual',
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    membersCount: 1,
    projectIdeaSummary: ''
  });
  const [compSubmitting, setCompSubmitting] = useState(false);
  const [compSuccess, setCompSuccess] = useState(false);

  // Recruitment Application Form State
  const [recruitmentFormData, setRecruitmentFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    faculty: 'Khoa Công nghệ Thông tin',
    classId: '24T_CLC',
    academicYear: 'K24 (Năm nhất)',
    interestTrack: 'Ban Điều hành (Kỹ thuật & Dự án)',
    motivation: '',
    portfolioUrl: ''
  });
  const [recruitmentSubmitting, setRecruitmentSubmitting] = useState(false);
  const [recruitmentSuccess, setRecruitmentSuccess] = useState(false);

  // Handle Workshop Registration Submit
  const handleWorkshopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWsSubmitting(true);
    try {
      await api.cms.registerWorkshop({
        workshopId: selectedWorkshop?.id || 'ws-general',
        workshopTitle: selectedWorkshop?.title || 'Workshop BK-IC',
        fullName: wsFormData.fullName,
        email: wsFormData.email,
        phone: wsFormData.phone,
        organization: wsFormData.organization,
        questionsForSpeaker: wsFormData.questions
      });
      setWsSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Gửi đăng ký thất bại, vui lòng thử lại.');
    } finally {
      setWsSubmitting(false);
    }
  };

  // Handle Competition Registration Submit
  const handleCompetitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompSubmitting(true);
    try {
      await api.cms.registerCompetition({
        competitionId: selectedCompetition?.id || 'comp-general',
        competitionTitle: selectedCompetition?.title || 'Cuộc thi BK-IC',
        regType: compFormData.regType,
        teamName: compFormData.teamName,
        leaderName: compFormData.leaderName,
        leaderEmail: compFormData.leaderEmail,
        leaderPhone: compFormData.leaderPhone,
        membersCount: compFormData.membersCount,
        projectIdeaSummary: compFormData.projectIdeaSummary
      });
      setCompSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Gửi hồ sơ dự thi thất bại.');
    } finally {
      setCompSubmitting(false);
    }
  };

  // Handle Recruitment Submit
  const handleRecruitmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecruitmentSubmitting(true);
    try {
      await api.cms.submitApplication({
        fullName: recruitmentFormData.fullName,
        studentId: recruitmentFormData.studentId,
        email: recruitmentFormData.email,
        phone: recruitmentFormData.phone,
        faculty: recruitmentFormData.faculty,
        classId: recruitmentFormData.classId,
        academicYear: recruitmentFormData.academicYear,
        interestTrack: recruitmentFormData.interestTrack,
        motivation: recruitmentFormData.motivation,
        portfolioUrl: recruitmentFormData.portfolioUrl
      });
      setRecruitmentSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Nộp đơn ứng tuyển thất bại.');
    } finally {
      setRecruitmentSubmitting(false);
    }
  };

  // Static/Verified Data for the 6 categories
  const internalActivities = [
    {
      title: 'Phiên Sinh hoạt Toàn thể Thứ Ba: Ra mắt Nền tảng BK-IC Digital Hub',
      date: 'Thứ Ba, 10/11/2026',
      desc: 'Toàn thể thành viên 3 Ban (BCN, BĐH, BTV) tổng kết các dự án đang bảo trợ và tập huấn quy trình điểm danh QR độc quyền.',
      tags: ['Định kỳ', 'Nội bộ', 'Chuyển đổi số']
    },
    {
      title: 'Giải Bóng đá Thường niên BK-IC Cup 2026: Gắn kết Sức trẻ Bách khoa',
      date: 'Chủ Nhật, 01/11/2026',
      desc: 'Giải giao hữu thể thao tranh cúp vô địch giữa các đội tuyển BCN, BĐH, BTV và đại diện cựu sinh viên tại Sân bóng đá DUT.',
      tags: ['Thể thao', 'Gắn kết', 'Văn thể mỹ']
    },
    {
      title: 'Buổi Họp Chiến lược Nhiệm kỳ: Phân bổ Ngân sách & Kế hoạch Q4/2026',
      date: 'Thứ Ba, 27/10/2026',
      desc: 'Ban Chủ nhiệm phê duyệt đề án bảo trợ kinh phí mẫu thử cho 4 đội thi chuẩn bị tham gia giải Sáng tạo Kỹ thuật Sinh viên.',
      tags: ['Chiến lược', 'Quy chế', 'BCN']
    }
  ];

  const workshops = [
    {
      id: 'ws-01',
      title: 'Workshop: Kiến trúc Hệ thống Edge AI & Computer Vision trên Vi mạch Nhúng',
      speaker: 'TS. Nguyễn Văn Hùng (Khoa CNTT - DUT)',
      date: 'Thứ Ba, 24/11/2026',
      time: '17:30 - 19:30',
      location: 'Phòng Lab Thông minh, Nhà A, ĐH Bách khoa (DUT)',
      status: 'open' as const,
      statusLabel: 'Đang mở đăng ký'
    },
    {
      id: 'ws-02',
      title: 'Bootcamp: Tinh giản Hóa Quy trình Khởi nghiệp Tinh gọn (Lean Startup MVP)',
      speaker: 'CEO Vườn ươm Khởi nghiệp Đà Nẵng',
      date: 'Thứ Ba, 01/12/2026',
      time: '17:30 - 19:30',
      location: 'Hội trường C, ĐH Bách khoa (DUT)',
      status: 'open' as const,
      statusLabel: 'Đang mở đăng ký'
    },
    {
      id: 'ws-03',
      title: 'Tọa đàm: Sở hữu Trí tuệ và Thương mại hóa Bằng Sáng chế Khoa học',
      speaker: 'Luật sư Cố vấn Pháp chế BK-IC',
      date: 'Thứ Ba, 15/12/2026',
      time: '17:30 - 19:00',
      location: 'Phòng Hội thảo Smart Campus',
      status: 'upcoming' as const,
      statusLabel: 'Sắp mở đăng ký'
    }
  ];

  const competitions = [
    {
      id: 'comp-01',
      title: 'BK Innovation Hackathon 2026: Giải pháp Kỹ thuật cho Thành phố Xanh',
      organizer: 'BK-IC & Đoàn Thanh niên DUT',
      deadline: '30/11/2026',
      prize: '50.000.000 VNĐ',
      status: 'open' as const,
      description: 'Cuộc thi lập trình và chế tạo phần cứng liên tục trong 48h dành cho sinh viên toàn Đại học Đà Nẵng. Đề tài tập trung vào CleanTech và Smart City.'
    },
    {
      id: 'comp-02',
      title: 'Giải thưởng Sinh viên Nghiên cứu Khoa học & Sáng tạo Kỹ thuật',
      organizer: 'Trường ĐH Bách khoa – ĐHĐN',
      deadline: '10/12/2026',
      prize: 'Học bổng & Bằng khen cấp Trường',
      status: 'open' as const,
      description: 'Đấu trường khoa học thường niên tôn vinh các đề tài nghiên cứu công nghệ xuất sắc của sinh viên kỹ thuật Bách khoa.'
    }
  ];

  const companionProjects = [
    {
      name: 'Smart Campus IoT Grid',
      desc: 'Mạng lưới cảm biến giám sát thông minh đo lường điện năng, chất lượng không khí và lưu lượng xe ra vào tại khuôn viên 54 Nguyễn Lương Bằng.',
      lead: 'Đội Kỹ sư K22 Khoa Điện tử - Viễn thông',
      result: 'Triển khai thử nghiệm 12 node cảm biến hoạt động ổn định 24/7.'
    },
    {
      name: 'Tự động hóa Phân loại Rác thải bằng AI Edge',
      desc: 'Mô hình thùng rác phân loại thông minh tích hợp camera AI nhận diện kim loại, nhựa và rác hữu cơ đạt độ chính xác 94%.',
      lead: 'Nhóm nghiên cứu K23 Khoa CNTT & Cơ khí',
      result: 'Đạt Giải Nhì Cuộc thi Sáng tạo Khởi nghiệp Sinh viên Đà Nẵng 2026.'
    },
    {
      name: 'Nền tảng Quản trị & Check-in QR BK-IC Digital Hub',
      desc: 'Phần mềm Web nội bộ số hóa toàn diện hồ sơ thành viên, điểm danh QR chống gian lận và đánh giá rèn luyện tự động.',
      lead: 'Ban Điều hành & Ban Thành viên BK-IC',
      result: 'Vận hành chính thức cho hơn 30 thành viên nòng cốt và các sự kiện trường.'
    }
  ];

  const sharkSeasons = [
    {
      season: 'BK Shark — Mùa 2026 (Đang diễn ra)',
      status: 'Vòng Thẩm định Hồ sơ',
      highlights: '18 dự án đăng ký tham dự. 6 đội xuất sắc bước vào vòng thuyết trình trước Hội đồng Shark vào tháng 12/2026.'
    },
    {
      season: 'BK Shark — Mùa 2025',
      status: 'Đã hoàn thành',
      highlights: 'Ươm tạo thành công 3 dự án công nghệ nhận vốn tài trợ hạt giống ban đầu từ quỹ doanh nghiệp cựu sinh viên.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#10182D] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1749B5]/20 bg-[#1749B5]/10 px-3.5 py-1 text-xs font-semibold text-[#1749B5] font-mono">
            <Rocket className="h-3.5 w-3.5" />
            <span>HỆ SINH THÁI 6 PHÂN HỆ HOẠT ĐỘNG TOÀN DIỆN</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#10182D] leading-tight">
            Hoạt động & Dự án BK-IC
          </h1>
          <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed font-normal">
            Không gian học tập, tranh tài và hiện thực hóa các ý tưởng sáng tạo dành cho sinh viên kỹ thuật Bách khoa và cộng đồng công nghệ Đà Nẵng.
          </p>
        </div>

        {/* 6-Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E2E6EE] font-mono text-xs">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'internal', label: '1. Sinh hoạt nội bộ' },
            { id: 'workshops', label: '2. Workshop thường niên' },
            { id: 'competitions', label: '3. Cuộc thi sáng tạo' },
            { id: 'projects', label: '4. Dự án đồng hành' },
            { id: 'shark', label: '5. Sân khấu BK Shark' },
            { id: 'recruitment', label: '6. Tuyển thành viên' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1749B5] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-white hover:text-[#1749B5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION 3.1: SINH HOẠT NỘI BỘ */}
        {(activeTab === 'all' || activeTab === 'internal') && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                eyebrow="PHÂN HỆ 01"
                title="Sinh hoạt Nội bộ & Gắn kết"
                subtitle="Lưu trữ các phiên sinh hoạt chuyên môn định kỳ thứ Ba và các hoạt động văn thể mỹ của 3 Ban."
              />
              <span className="text-xs font-mono text-slate-400">Không bắt buộc đăng ký</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {internalActivities.map((act, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6B9DFF] transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-[#1749B5]" />
                      <span>{act.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#10182D] leading-snug">
                      {act.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                      {act.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {act.tags.map((t, i) => (
                      <span key={i} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#F5F6F8] text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3.2: WORKSHOP THƯỜNG NIÊN */}
        {(activeTab === 'all' || activeTab === 'workshops') && (
          <section className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                eyebrow="PHÂN HỆ 02"
                title="Chuỗi Workshop & Seminar Công nghệ"
                subtitle="Mở rộng cho tất cả sinh viên và người yêu công nghệ. Đăng ký trực tuyến không cần đăng nhập."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workshops.map((ws) => (
                <ActivityCard
                  key={ws.id}
                  title={ws.title}
                  type="Workshop Chuyên đề"
                  date={ws.date}
                  time={ws.time}
                  location={ws.location}
                  speaker={ws.speaker}
                  status={ws.status}
                  statusLabel={ws.statusLabel}
                  onRegister={() => {
                    setSelectedWorkshop({ id: ws.id, title: ws.title });
                    setWsSuccess(false);
                    setWorkshopModalOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3.3: CUỘC THI SÁNG TẠO */}
        {(activeTab === 'all' || activeTab === 'competitions') && (
          <section className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                eyebrow="PHÂN HỆ 03"
                title="Đấu trường Cuộc thi & Giải thưởng"
                subtitle="Đăng ký dự thi trực tiếp (Cá nhân hoặc Đội nhóm) để nhận bảo trợ kỹ thuật và giải thưởng."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {competitions.map((comp) => (
                <CompetitionCard
                  key={comp.id}
                  title={comp.title}
                  organizer={comp.organizer}
                  deadline={comp.deadline}
                  prize={comp.prize}
                  status={comp.status}
                  description={comp.description}
                  onRegister={() => {
                    setSelectedCompetition({ id: comp.id, title: comp.title });
                    setCompSuccess(false);
                    setCompModalOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3.4: DỰ ÁN ĐỒNG HÀNH */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                eyebrow="PHÂN HỆ 04"
                title="Dự án BK-IC Đồng hành & Ươm tạo"
                subtitle="Các sản phẩm phần mềm, vi mạch và sáng kiến kỹ thuật do thành viên BK-IC phát triển."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companionProjects.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E2E6EE] bg-white p-7 shadow-xs flex flex-col justify-between space-y-5 hover:border-[#6B9DFF] transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1749B5]">
                      <Layers className="h-4 w-4" />
                      <span>DỰ ÁN ĐỒNG HÀNH</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#10182D]">
                      {p.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block font-mono">Đội ngũ kỹ thuật:</span>
                      <strong className="text-slate-800">{p.lead}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono">Kết quả đạt được:</span>
                      <span className="text-emerald-700 font-semibold">{p.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3.5: BK SHARK */}
        {(activeTab === 'all' || activeTab === 'shark') && (
          <section className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                eyebrow="PHÂN HỆ 05"
                title="Sân khấu BK Shark theo Mùa"
                subtitle="Đấu trường gọi vốn ươm tạo, trình bày sản phẩm trước các nhà đầu tư và chuyên gia công nghệ."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sharkSeasons.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E2E6EE] bg-white p-8 shadow-xs space-y-4 hover:border-[#6B9DFF] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1749B5] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      <Flame className="h-4 w-4 text-amber-500" />
                      <span>{s.status}</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">BK-IC Shark Tank</span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#10182D]">
                    {s.season}
                  </h3>

                  <p className="text-sm text-[#5E6573] leading-relaxed font-normal">
                    {s.highlights}
                  </p>

                  <div className="pt-2">
                    <Link
                      to="/partnership"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:underline"
                    >
                      <span>Đăng ký tham gia với vai trò Hội đồng Đầu tư / Shark</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3.6: TUYỂN THÀNH VIÊN */}
        {(activeTab === 'all' || activeTab === 'recruitment') && (
          <section className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <SectionHeading
                eyebrow="PHÂN HỆ 06"
                title="Tuyển Thành viên Chính thức"
                subtitle="Đăng ký gia nhập cộng đồng kỹ sư đổi mới sáng tạo BK-IC. Tiếp nhận hồ sơ trực tuyến."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Guidelines & Benefits */}
              <div className="lg:col-span-5 rounded-3xl border border-[#E2E6EE] bg-white p-8 shadow-xs space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Trạng thái: {siteSettings?.recruitmentStatus === 'open' ? 'Đang mở đơn ứng tuyển' : 'Đợt tuyển tiếp theo'}</span>
                </div>

                <h3 className="text-2xl font-bold text-[#10182D]">
                  Gia nhập 3 Ban Chính thức
                </h3>

                <div className="space-y-4 text-xs text-[#5E6573] leading-relaxed">
                  <div>
                    <strong className="text-slate-800 block text-sm">1. Ban Chủ nhiệm (BCN):</strong>
                    <span>Tham gia công tác kế hoạch chiến lược, điều phối pháp lý và liên kết quan hệ đối ngoại.</span>
                  </div>
                  <div>
                    <strong className="text-slate-800 block text-sm">2. Ban Điều hành (BĐH):</strong>
                    <span>Phụ trách R&D kỹ thuật, thiết kế workshop, trực tiếp phát triển các dự án mẫu và tham gia thi tài.</span>
                  </div>
                  <div>
                    <strong className="text-slate-800 block text-sm">3. Ban Thành viên (BTV):</strong>
                    <span>Quản trị dữ liệu số, vận hành điểm danh QR, chăm lo văn hóa nội bộ và gắn kết các thế hệ.</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <span className="font-bold text-slate-800 block">Quy trình tuyển chọn 3 bước:</span>
                  <div>1. Nộp hồ sơ trực tuyến kèm link CV/Portfolio.</div>
                  <div>2. Phỏng vấn chuyên môn và giải case study.</div>
                  <div>3. Onboarding và thử thách trong dự án thực tế.</div>
                </div>
              </div>

              {/* Right Column: Interactive Application Form */}
              <div className="lg:col-span-7 rounded-3xl border border-[#E2E6EE] bg-white p-8 shadow-xs">
                {recruitmentSuccess ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#10182D]">Nộp Đơn Ứng Tuyển Thành Công!</h3>
                    <p className="text-xs sm:text-sm text-[#5E6573] max-w-md mx-auto">
                      Ban Tuyển dụng BK-IC đã tiếp nhận hồ sơ của bạn. Chúng mình sẽ liên hệ qua Email và Số điện thoại trong vòng 3-5 ngày làm việc.
                    </p>
                    <button
                      onClick={() => setRecruitmentSuccess(false)}
                      className="px-5 py-2.5 rounded-xl bg-[#1749B5] text-white text-xs font-bold"
                    >
                      Nộp hồ sơ khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRecruitmentSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-[#10182D] border-b border-slate-100 pb-3">
                      Đơn Đăng ký Ứng tuyển Thành viên
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          value={recruitmentFormData.fullName}
                          onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, fullName: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Mã sinh viên *</label>
                        <input
                          type="text"
                          required
                          value={recruitmentFormData.studentId}
                          onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, studentId: e.target.value })}
                          placeholder="102240xxx"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Địa chỉ Email *</label>
                        <input
                          type="email"
                          required
                          value={recruitmentFormData.email}
                          onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, email: e.target.value })}
                          placeholder="email@dut.udn.vn"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Số điện thoại *</label>
                        <input
                          type="tel"
                          required
                          value={recruitmentFormData.phone}
                          onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, phone: e.target.value })}
                          placeholder="09xx xxx xxx"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Khoa đào tạo tại DUT *</label>
                        <select
                          value={recruitmentFormData.faculty}
                          onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, faculty: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                        >
                          <option>Khoa Công nghệ Thông tin</option>
                          <option>Khoa Điện tử - Viễn thông</option>
                          <option>Khoa Điện</option>
                          <option>Khoa Cơ khí</option>
                          <option>Khoa Quản lý Dự án</option>
                          <option>Khoa Kiến trúc</option>
                          <option>Khoa Hóa</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Ban nguyện vọng ứng tuyển *</label>
                        <select
                          value={recruitmentFormData.interestTrack}
                          onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, interestTrack: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                        >
                          <option>Ban Điều hành (Kỹ thuật & Dự án R&D)</option>
                          <option>Ban Điều hành (Sự kiện & Workshop)</option>
                          <option>Ban Thành viên (Quản trị Dữ liệu & Điểm danh QR)</option>
                          <option>Ban Thành viên (Văn hóa & Truyền thông)</option>
                          <option>Ban Chủ nhiệm (Đối ngoại & Pháp chế)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Đường dẫn CV / Portfolio / GitHub (Google Drive / GitHub / Notion) *</label>
                      <input
                        type="url"
                        value={recruitmentFormData.portfolioUrl}
                        onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, portfolioUrl: e.target.value })}
                        placeholder="https://drive.google.com/... hoặc https://github.com/..."
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Lý do ứng tuyển & Điểm mạnh của bạn *</label>
                      <textarea
                        rows={3}
                        required
                        value={recruitmentFormData.motivation}
                        onChange={(e) => setRecruitmentFormData({ ...recruitmentFormData, motivation: e.target.value })}
                        placeholder="Chia sẻ ngắn gọn động lực và mục tiêu bạn muốn đạt được khi gia nhập BK-IC..."
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={recruitmentSubmitting}
                      className="w-full py-3 rounded-xl bg-[#1749B5] text-white text-xs font-bold hover:bg-[#10182D] transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>{recruitmentSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi Đơn Ứng Tuyển'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Global CTA Section */}
        <CTASection
          eyebrow="ĐỒNG HÀNH KỸ THUẬT"
          title="Bạn có bài toán công nghệ cần hợp tác nghiên cứu cùng BK-IC?"
          description="Chúng mình sẵn sàng kết nối các nhóm dự án sinh viên để cùng doanh nghiệp thử nghiệm giải pháp."
          primaryText="Đề xuất hợp tác ngay"
          primaryTo="/partnership"
          secondaryText="Về chúng tôi"
          secondaryTo="/about"
        />
      </div>

      {/* MODAL 1: WORKSHOP REGISTRATION */}
      {workshopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setWorkshopModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {wsSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[#10182D]">Đăng Ký Thành Công!</h3>
                <p className="text-xs text-[#5E6573]">
                  Thông tin tham dự <strong>{selectedWorkshop?.title}</strong> đã được lưu trữ. Ban Tổ chức sẽ gửi tài liệu chuẩn bị qua email của bạn.
                </p>
                <button
                  onClick={() => setWorkshopModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1749B5] text-white text-xs font-bold"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleWorkshopSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#1749B5] uppercase">Đăng ký tham gia</span>
                  <h3 className="text-lg font-bold text-[#10182D] leading-snug">
                    {selectedWorkshop?.title}
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={wsFormData.fullName}
                    onChange={(e) => setWsFormData({ ...wsFormData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={wsFormData.email}
                      onChange={(e) => setWsFormData({ ...wsFormData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={wsFormData.phone}
                      onChange={(e) => setWsFormData({ ...wsFormData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Trường / Khoa / Đơn vị công tác</label>
                  <input
                    type="text"
                    value={wsFormData.organization}
                    onChange={(e) => setWsFormData({ ...wsFormData, organization: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                    placeholder="Khoa CNTT - ĐH Bách khoa (DUT)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Câu hỏi hoặc nội dung bạn mong muốn trao đổi</label>
                  <textarea
                    rows={2}
                    value={wsFormData.questions}
                    onChange={(e) => setWsFormData({ ...wsFormData, questions: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                    placeholder="Nội dung bạn muốn diễn giả giải đáp..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={wsSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#1749B5] text-white text-xs font-bold hover:bg-[#10182D] transition cursor-pointer"
                >
                  {wsSubmitting ? 'Đang ghi nhận...' : 'Xác Nhận Đăng Ký'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: COMPETITION REGISTRATION */}
      {compModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setCompModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {compSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[#10182D]">Ghi Nhận Hồ Sơ Dự Thi!</h3>
                <p className="text-xs text-[#5E6573]">
                  Hồ sơ tham dự cuộc thi <strong>{selectedCompetition?.title}</strong> đã được nộp thành công. Ban Chuyên môn BK-IC sẽ liên lạc với trưởng nhóm để hướng dẫn các bước tiếp theo.
                </p>
                <button
                  onClick={() => setCompModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1749B5] text-white text-xs font-bold"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleCompetitionSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#1749B5] uppercase">Hồ sơ dự thi</span>
                  <h3 className="text-lg font-bold text-[#10182D] leading-snug">
                    {selectedCompetition?.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="compRegType"
                      checked={compFormData.regType === 'individual'}
                      onChange={() => setCompFormData({ ...compFormData, regType: 'individual' })}
                    />
                    <span>Dự thi Cá nhân</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="compRegType"
                      checked={compFormData.regType === 'team'}
                      onChange={() => setCompFormData({ ...compFormData, regType: 'team' })}
                    />
                    <span>Dự thi Đội nhóm</span>
                  </label>
                </div>

                {compFormData.regType === 'team' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Tên Đội thi *</label>
                      <input
                        type="text"
                        required
                        value={compFormData.teamName}
                        onChange={(e) => setCompFormData({ ...compFormData, teamName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                        placeholder="Team Innovation"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Số lượng thành viên</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={compFormData.membersCount}
                        onChange={(e) => setCompFormData({ ...compFormData, membersCount: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Họ tên Trưởng nhóm / Người đại diện *</label>
                  <input
                    type="text"
                    required
                    value={compFormData.leaderName}
                    onChange={(e) => setCompFormData({ ...compFormData, leaderName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email liên hệ *</label>
                    <input
                      type="email"
                      required
                      value={compFormData.leaderEmail}
                      onChange={(e) => setCompFormData({ ...compFormData, leaderEmail: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                      placeholder="leader@gmail.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={compFormData.leaderPhone}
                      onChange={(e) => setCompFormData({ ...compFormData, leaderPhone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mô tả tóm tắt ý tưởng / dự án dự thi</label>
                  <textarea
                    rows={3}
                    value={compFormData.projectIdeaSummary}
                    onChange={(e) => setCompFormData({ ...compFormData, projectIdeaSummary: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                    placeholder="Tóm tắt ngắn gọn vấn đề giải quyết, giải pháp công nghệ và giá trị mang lại..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={compSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#1749B5] text-white text-xs font-bold hover:bg-[#10182D] transition cursor-pointer"
                >
                  {compSubmitting ? 'Đang gửi hồ sơ...' : 'Nộp Hồ Sơ Đăng Ký Dự Thi'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
