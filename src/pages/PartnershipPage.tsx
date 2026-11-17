// BK-IC Partnership Platform — Minimalist Editorial & Corporate Collaboration
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SectionHeading } from '../components/editorial/SectionHeading';
import { Button } from '../components/editorial/Buttons';
import { CTASection } from '../components/editorial/CTASection';
import { 
  Building2, 
  Handshake, 
  Download, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase, 
  ExternalLink, 
  FileText, 
  Users, 
  Layers, 
  Award,
  Mail,
  MapPin,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

export const PartnershipPage: React.FC = () => {
  const { siteSettings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve active tab from URL path
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/companion-project')) return 'companion';
    if (path.includes('/partners')) return 'partners';
    if (path.includes('/business')) return 'business';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'overview') navigate('/partnership');
    else if (tabId === 'companion') navigate('/partnership/companion-project');
    else if (tabId === 'partners') navigate('/partnership/partners');
    else if (tabId === 'business') navigate('/partnership/business');
  };

  // Partnership Request Form State
  const [formData, setFormData] = useState({
    organizationName: '',
    representativeName: '',
    position: '',
    email: '',
    phone: '',
    partnershipType: 'business_coop' as any,
    proposalContent: '',
    attachmentUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.cms.submitPartnershipRequest(formData);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Gửi đề xuất hợp tác thất bại, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const partnerLogos = [
    { name: 'ĐH Bách khoa – ĐHĐN (DUT)', type: 'Bảo trợ & Trực thuộc' },
    { name: 'Đoàn Thanh niên – Hội Sinh viên DUT', type: 'Đơn vị Quản lý' },
    { name: 'Trung tâm Hỗ trợ SV & QHDN DUT', type: 'Cố vấn Chiến lược' },
    { name: 'Vườn ươm Doanh nghiệp Đà Nẵng (DNES)', type: 'Hệ sinh thái Đổi mới' },
    { name: 'Mạng lưới Cựu Sinh viên Bách khoa', type: 'Đồng hành & Tài trợ' }
  ];

  const partnershipTypes = [
    {
      id: 'business_coop',
      icon: Briefcase,
      title: '1. Hợp tác Doanh nghiệp & Tuyển dụng',
      desc: 'Đặt hàng bài toán kỹ thuật thực tiễn, tuyển chọn kỹ sư tài năng từ các khoa CNTT, Điện tử, Cơ khí, QLDA và tài trợ học bổng đổi mới sáng tạo.'
    },
    {
      id: 'companion_project',
      icon: Layers,
      title: '2. Đồng hành Dự án Ươm mầm (Companion Projects)',
      desc: 'Bảo trợ chuyên môn, thiết bị phần cứng, phòng Lab và kết nối các nhóm sinh viên NCKH phát triển mẫu thử (MVP) phục vụ ứng dụng sản xuất.'
    },
    {
      id: 'event_cohost',
      icon: Award,
      title: '3. Đồng tổ chức Hackathon & Cuộc thi BK Shark',
      desc: 'Đồng hành thương hiệu cùng các giải đấu lập trình, tham gia hội đồng giám khảo, thẩm định ý tưởng khởi nghiệp và tiếp cận các giải pháp tiềm năng.'
    },
    {
      id: 'sponsor',
      icon: Handshake,
      title: '4. Tài trợ Thiết bị & Quỹ Phát triển Khoa học',
      desc: 'Tài trợ bo mạch, server, tài khoản Cloud và cơ sở vật chất phòng Lab thực nghiệm tại Smart Campus 54 Nguyễn Lương Bằng.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#10182D] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1749B5]/20 bg-[#1749B5]/10 px-3.5 py-1 text-xs font-semibold text-[#1749B5] font-mono">
            <Handshake className="h-3.5 w-3.5" />
            <span>KÊNH HỢP TÁC & KẾT NỐI DOANH NGHIỆP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#10182D] leading-tight">
            Hợp tác cùng BK-IC
          </h1>
          <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed font-normal">
            Cầu nối chính thức giữa các doanh nghiệp, tổ chức và chuyên gia với nguồn nhân lực kỹ thuật xuất sắc tại Trường Đại học Bách khoa – Đại học Đà Nẵng.
          </p>
        </div>

        {/* 4-Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E2E6EE] font-mono text-xs">
          {[
            { id: 'overview', label: '1. Tổng quan Hợp tác' },
            { id: 'companion', label: '2. Dự án đồng hành & Catalogue' },
            { id: 'partners', label: '3. Đối tác chiến lược' },
            { id: 'business', label: '4. Hợp tác doanh nghiệp' }
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

        {/* TAB 1: TỔNG QUAN HỢP TÁC */}
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Value Proposition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnershipTypes.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6B9DFF] transition"
                  >
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-[#F5F6F8] text-[#1749B5] w-fit">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#10182D] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#5E6573] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <a
                      href="#request-form"
                      className="text-xs font-bold text-[#1749B5] hover:underline flex items-center gap-1 pt-2 border-t border-slate-100"
                    >
                      <span>Gửi đề xuất mảng này</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Catalogue PDF Box */}
            <div className="rounded-3xl bg-[#10182D] text-white p-8 sm:p-12 relative overflow-hidden border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-mono font-bold text-[#6B9DFF] uppercase tracking-wider">
                  TÀI LIỆU CHÍNH THỨC
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Hồ sơ Năng lực & Catalogue Hợp tác BK-IC 2026 (PDF)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Tổng hợp đầy đủ quy chế hoạt động, bảng quyền lợi đối tác, danh mục thiết bị phòng Lab và các dự án sinh viên tiêu biểu đang ươm mầm.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <a
                  href="/documents/BK-IC_Partnership_Profile_2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  download="BK-IC_Partnership_Profile_2026.pdf"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1749B5] px-5 py-3 text-xs font-bold text-white hover:bg-white hover:text-[#10182D] transition shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Tải Catalogue PDF (Bản tiếng Việt)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DỰ ÁN ĐỒNG HÀNH */}
        {activeTab === 'companion' && (
          <div className="space-y-12">
            <SectionHeading
              eyebrow="CHƯƠNG TRÌNH ĐỒNG HÀNH"
              title="Đồng hành Phát triển Dự án Đổi mới Sáng tạo"
              subtitle="Quy trình hỗ trợ toàn diện từ ý tưởng ban đầu đến sản phẩm thử nghiệm (MVP) hoàn chỉnh."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs space-y-3">
                <span className="text-xs font-mono font-bold text-[#1749B5]">BƯỚC 01</span>
                <h4 className="text-base font-bold text-[#10182D]">Tiếp nhận & Thẩm định Đề tài</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Doanh nghiệp hoặc nhóm sinh viên gửi đề xuất bài toán kỹ thuật. Hội đồng Cố vấn BK-IC tổ chức đánh giá tính khả thi và tiềm năng thị trường.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs space-y-3">
                <span className="text-xs font-mono font-bold text-[#1749B5]">BƯỚC 02</span>
                <h4 className="text-base font-bold text-[#10182D]">Thành lập Đội Kỹ sư Chuyên trách</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Tuyển chọn thành viên nòng cốt từ Ban Điều hành và các khoa chuyên môn, thiết lập lộ trình Sprint (Agile) và cấp quyền sử dụng phòng Lab.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs space-y-3">
                <span className="text-xs font-mono font-bold text-[#1749B5]">BƯỚC 03</span>
                <h4 className="text-base font-bold text-[#10182D]">Demo Day & Bàn giao Chuyển giao</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Tổ chức thẩm định sản phẩm mẫu, hỗ trợ đăng ký sở hữu trí tuệ hoặc chuyển giao công nghệ cho doanh nghiệp đối tác ứng dụng thực tế.
                </p>
              </div>
            </div>

            {/* Quick Link to PDF */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E6EE] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#1749B5]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#10182D]">Quy chế & Điều khoản Đồng hành Dự án</h4>
                  <p className="text-xs text-slate-500">Xem văn bản hướng dẫn chi tiết về bảo hộ quyền tác giả và phân chia giá trị dự án.</p>
                </div>
              </div>
              <a
                href="#request-form"
                className="px-4 py-2 rounded-xl bg-[#1749B5] text-white text-xs font-bold shrink-0"
              >
                Gửi đề xuất dự án
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: ĐỐI TÁC CHIẾN LƯỢC */}
        {activeTab === 'partners' && (
          <div className="space-y-12">
            <SectionHeading
              eyebrow="MẠNG LƯỚI ĐỐI TÁC"
              title="Cộng đồng Doanh nghiệp & Vườn ươm Đồng hành"
              subtitle="Những đơn vị đã và đang tin tưởng bảo trợ cho hoạt động nghiên cứu sáng tạo của sinh viên BK-IC."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {partnerLogos.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs space-y-2 hover:border-[#6B9DFF] transition"
                >
                  <span className="text-[10px] font-mono font-bold text-[#1749B5] uppercase">
                    {p.type}
                  </span>
                  <h4 className="text-base font-bold text-[#10182D]">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Đồng hành trong các chương trình ươm tạo, đào tạo kỹ sư và hỗ trợ tài chính cho sinh viên Bách khoa.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HỢP TÁC DOANH NGHIỆP */}
        {activeTab === 'business' && (
          <div className="space-y-12">
            <SectionHeading
              eyebrow="DÀNH CHO DOANH NGHIỆP"
              title="Quyền lợi & Quy trình Đồng hành cùng BK-IC"
              subtitle="Gia tăng nhận diện thương hiệu tuyển dụng và tiếp cận những sinh viên kỹ thuật xuất sắc nhất."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">QUYỀN LỢI 01</span>
                <h4 className="text-base font-bold text-[#10182D]">Tiếp cận Nguồn Nhân lực Chất lượng Cao</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Ưu tiên tuyển dụng các kỹ sư sinh viên đã qua rèn luyện thực tế trong các dự án của CLB, có kỹ năng làm việc nhóm và tư duy công nghệ vững.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs space-y-3">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">QUYỀN LỢI 02</span>
                <h4 className="text-base font-bold text-[#10182D]">Quảng bá Thương hiệu Tuyển dụng</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Logo và thông tin doanh nghiệp xuất hiện trên các ấn phẩm truyền thông, website BK-IC Digital Hub và các buổi hội thảo tại trường.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs space-y-3">
                <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">QUYỀN LỢI 03</span>
                <h4 className="text-base font-bold text-[#10182D]">Giải quyết Bài toán Kỹ thuật Đặt hàng</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Tận dụng trí tuệ và sự sáng tạo của sinh viên và giảng viên cố vấn để thử nghiệm các bài toán R&D với chi phí tối ưu.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4.5. FORM TIẾP NHẬN YÊU CẦU HỢP TÁC TRỰC TUYẾN */}
        <section id="request-form" className="rounded-3xl border border-[#E2E6EE] bg-white p-8 sm:p-12 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1749B5]">
              // TIẾP NHẬN ĐỀ XUẤT TRỰC TUYẾN
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10182D]">
              Form Gửi Yêu cầu Hợp tác
            </h3>
            <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
              Không yêu cầu đăng nhập. Ban Chủ nhiệm BK-IC sẽ tiếp nhận, phân loại và liên hệ phản hồi trong vòng 48 giờ làm việc.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold text-[#10182D]">Gửi Đề Xuất Hợp Tác Thành Công!</h4>
              <p className="text-xs sm:text-sm text-[#5E6573] max-w-lg mx-auto">
                Cảm ơn <strong>{formData.representativeName}</strong> và quý đơn vị <strong>{formData.organizationName}</strong>. 
                Hồ sơ đã được lưu trữ vào hệ thống quản trị với trạng thái <span className="font-mono font-bold text-emerald-700">Mới tiếp nhận</span>. Ban Chủ nhiệm CLB sẽ liên lạc qua email và số điện thoại của quý đối tác.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    organizationName: '',
                    representativeName: '',
                    position: '',
                    email: '',
                    phone: '',
                    partnershipType: 'business_coop',
                    proposalContent: '',
                    attachmentUrl: ''
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1749B5] text-white text-xs font-bold cursor-pointer"
              >
                Gửi đề xuất khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Tên Tổ chức / Doanh nghiệp *</label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="Công ty TNHH Công nghệ ABC"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Người đại diện liên hệ *</label>
                  <input
                    type="text"
                    required
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Chức vụ đại diện</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Giám đốc Nhân sự / Tech Lead"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Địa chỉ Email liên hệ *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Loại hình hợp tác mong muốn *</label>
                  <select
                    value={formData.partnershipType}
                    onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                  >
                    <option value="business_coop">Hợp tác Doanh nghiệp & Tuyển dụng</option>
                    <option value="companion_project">Đồng hành Dự án Ươm mầm (Companion Project)</option>
                    <option value="event_cohost">Đồng tổ chức Sự kiện / Hackathon / BK Shark</option>
                    <option value="sponsor">Tài trợ Học bổng, Kinh phí & Thiết bị Lab</option>
                    <option value="other">Hình thức Hợp tác khác</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">Link tài liệu đính kèm (Google Drive / Brochure / Proposal)</label>
                  <input
                    type="url"
                    value={formData.attachmentUrl}
                    onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">Nội dung đề xuất hợp tác *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.proposalContent}
                  onChange={(e) => setFormData({ ...formData, proposalContent: e.target.value })}
                  placeholder="Mô tả cụ thể nhu cầu hợp tác, mục tiêu, đề tài kỹ thuật hoặc hình thức đồng hành cùng BK-IC..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#1749B5] focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1749B5] text-white text-xs font-bold hover:bg-[#10182D] transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Đang gửi đề xuất...' : 'Gửi Yêu Cầu Hợp Tác'}</span>
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Institutional Contact Card */}
        <div className="rounded-3xl border border-[#E2E6EE] bg-white p-7 sm:p-10 shadow-xs flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              VĂN PHÒNG ĐIỀU HÀNH
            </span>
            <h4 className="text-lg font-bold text-[#10182D]">
              Trực tiếp trao đổi cùng Ban Chủ nhiệm BK-IC
            </h4>
            <div className="text-xs text-[#5E6573] space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#1749B5] shrink-0 mt-0.5" />
                <span>Văn phòng CLB, Smart Campus Trường ĐH Bách khoa – ĐHĐN (54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1749B5] shrink-0" />
                <span className="font-mono text-slate-800">bkic.dut@gmail.com</span>
              </div>
            </div>
          </div>

          <a
            href="https://dut.udn.vn/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#1749B5] hover:text-[#1749B5] transition inline-flex items-center gap-1.5"
          >
            <span>Cổng thông tin ĐH Bách khoa (DUT)</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
