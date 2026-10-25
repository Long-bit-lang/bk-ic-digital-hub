// BK-IC Member Recruitment Application & Status Tracker Page
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { extractAcademicYear } from '../utils/academicYear';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Search, 
  Clock, 
  ShieldCheck, 
  FileText, 
  User, 
  GraduationCap, 
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const JoinPage: React.FC = () => {
  const { submitApplication, applications, siteSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    faculty: 'Khoa Công nghệ Thông tin',
    classId: '',
    academicYear: 'K24 (Năm nhất)',
    interestTrack: 'Tech & Innovation',
    motivation: '',
    skills: '',
    experience: '',
    portfolioUrl: ''
  });

  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [foundApp, setFoundApp] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const dutFaculties = [
    'Khoa Công nghệ Thông tin',
    'Khoa Điện tử - Viễn thông',
    'Khoa Điện',
    'Khoa Cơ khí',
    'Khoa Cơ khí Giao thông',
    'Khoa Quản lý Dự án',
    'Khoa Kiến trúc',
    'Khoa Xây dựng Công trình Thủy',
    'Khoa Xây dựng Dân dụng & Công nghiệp',
    'Khoa Hóa',
    'Khoa Môi trường'
  ];

  const tracks = [
    {
      id: 'Tech & Innovation',
      name: 'Ban Chuyên môn & Dự án (Tech & DeepTech)',
      desc: 'Nghiên cứu phần cứng, lập trình phần mềm, AI, IoT, Robotics và phát triển prototype.'
    },
    {
      id: 'Startup & Business Model',
      name: 'Mô hình Kinh doanh & Quản trị Dự án',
      desc: 'Xây dựng Lean Canvas, nghiên cứu thị trường, định giá chi phí và lập kế hoạch gọi vốn.'
    },
    {
      id: 'Media & Community',
      name: 'Ban Truyền thông & Thương hiệu',
      desc: 'Sáng tạo nội dung số, thiết kế visual thương hiệu, chụp ảnh sự kiện và quản trị mạng xã hội.'
    },
    {
      id: 'External Relations',
      name: 'Ban Đối ngoại & Kết nối Doanh nghiệp',
      desc: 'Kết nối mạng lưới cựu sinh viên, tìm kiếm tài trợ và điều phối hợp tác với doanh nghiệp công nghệ.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.studentId || !formData.email || !formData.motivation) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    const created = await submitApplication({
      fullName: formData.fullName,
      studentId: formData.studentId,
      email: formData.email,
      phone: formData.phone,
      faculty: formData.faculty,
      classId: formData.classId || 'DUT-2026',
      academicYear: formData.academicYear,
      interestTrack: formData.interestTrack,
      motivation: formData.motivation,
      skills: formData.skills,
      experience: formData.experience,
      portfolioUrl: formData.portfolioUrl
    });

    setSubmittedAppId(created.id);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const query = searchStudentId.trim().toLowerCase();
    const match = applications.find(
      a => a.studentId.toLowerCase() === query || a.id.toLowerCase() === query || a.email.toLowerCase() === query
    );
    setFoundApp(match || null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>TUYỂN THÀNH VIÊN BK-IC GEN 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
            Gia nhập Bách Khoa Innovation Club
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Cùng chúng mình xây dựng những sản phẩm công nghệ tạo ra tác động thực tế cho cộng đồng sinh viên DUT và xã hội.
          </p>

          {/* Toggle Tab */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl mt-4">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'apply' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nộp đơn Ứng tuyển
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tra cứu Trạng thái Hồ sơ
            </button>
          </div>
        </div>

        {/* TAB 1: APPLICATION FORM */}
        {activeTab === 'apply' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            {submittedAppId ? (
              <div className="text-center py-8 space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Nộp đơn ứng tuyển thành công!
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Hội đồng Tuyển dụng BK-IC đã tiếp nhận hồ sơ của bạn. Chúng mình sẽ liên hệ qua email và số điện thoại để thông báo lịch phỏng vấn.
                  </p>
                </div>

                <div className="max-w-xs mx-auto rounded-xl bg-slate-50 border border-slate-200 p-4 font-mono text-xs text-slate-700">
                  Mã hồ sơ: <strong className="text-blue-600 text-sm">{submittedAppId}</strong>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedAppId(null);
                      setFormData({
                        fullName: '',
                        studentId: '',
                        email: '',
                        phone: '',
                        faculty: 'Khoa Công nghệ Thông tin',
                        classId: '',
                        academicYear: 'K24 (Năm nhất)',
                        interestTrack: 'Tech & Innovation',
                        motivation: '',
                        skills: '',
                        experience: '',
                        portfolioUrl: ''
                      });
                    }}
                    className="rounded-xl border border-slate-300 px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Nộp đơn khác
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('track');
                      setSearchStudentId(formData.studentId);
                      setSubmittedAppId(null);
                    }}
                    className="rounded-xl bg-[#245BFA] px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Xem tiến độ xét duyệt
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Notice */}
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Quy trình tuyển dụng minh bạch:</strong> Tất cả sinh viên đang theo học tại Trường ĐH Bách khoa - ĐHĐN đều có cơ hội bình đẳng. Đơn ứng tuyển sẽ được xem xét kỹ lưỡng bởi Ban Chủ nhiệm và Ban Nhân sự trước khi xếp lịch phỏng vấn.
                  </div>
                </div>

                {/* Section 1: Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>1. Thông tin Cá nhân & Học tập</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn An"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mã số sinh viên (MSSV) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: 102240012"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email sinh viên (hoặc Gmail cá nhân) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="an.nv@dut.udn.vn"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Số điện thoại / Zalo *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0901 234 567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Khoa đào tạo *
                      </label>
                      <select
                        value={formData.faculty}
                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      >
                        {dutFaculties.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-slate-700">
                            Lớp sinh hoạt
                          </label>
                          <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            Khóa {extractAcademicYear(formData.classId)}
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="VD: 25T_KHDL, 22TDH1..."
                          value={formData.classId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ 
                              ...formData, 
                              classId: val,
                              academicYear: extractAcademicYear(val)
                            });
                          }}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Khóa học (Nhận diện tự động)
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={`Khóa ${extractAcademicYear(formData.classId)}`}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 font-medium focus:outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Track Selection */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>2. Chọn Ban / Mảng Chuyên môn quan tâm *</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tracks.map((t) => (
                      <label
                        key={t.id}
                        className={`flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition ${
                          formData.interestTrack === t.id
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">{t.name}</span>
                          <input
                            type="radio"
                            name="interestTrack"
                            value={t.id}
                            checked={formData.interestTrack === t.id}
                            onChange={() => setFormData({ ...formData, interestTrack: t.id })}
                            className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {t.desc}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section 3: Motivation & Skills */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span>3. Động lực & Năng lực Bản thân</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vì sao bạn muốn gia nhập BK-IC? Bạn kỳ vọng sẽ đóng góp điều gì cho câu lạc bộ? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Chia sẻ lý do và mong muốn của bạn khi tham gia môi trường đổi mới sáng tạo..."
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kỹ năng / Công nghệ bạn đã từng tiếp cận
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Python, C++, Figma, SolidWorks, Tiếng Anh..."
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Link GitHub / Portfolio / CV (Nếu có)
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    (*) Các trường bắt buộc điền
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#245BFA] px-7 py-3 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                  >
                    <span>Gửi đơn Ứng tuyển</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: APPLICATION TRACKER */}
        {activeTab === 'track' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
            <div className="max-w-md mx-auto text-center space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                Kiểm tra tiến độ xét duyệt đơn
              </h2>
              <p className="text-xs text-slate-500">
                Nhập Mã số sinh viên (MSSV) hoặc Mã hồ sơ để tra cứu kết quả phỏng vấn.
              </p>
            </div>

            <form onSubmit={handleTrackSearch} className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                required
                placeholder="Nhập MSSV (vd: 102240012) hoặc Mã đơn"
                value={searchStudentId}
                onChange={(e) => setSearchStudentId(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Tra cứu</span>
              </button>
            </form>

            {searched && (
              <div className="max-w-lg mx-auto pt-4">
                {foundApp ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="text-xs text-slate-400 font-mono">{foundApp.id}</div>
                        <h4 className="text-base font-bold text-slate-900">{foundApp.fullName}</h4>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        foundApp.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : foundApp.status === 'under_review'
                          ? 'bg-blue-100 text-blue-800'
                          : foundApp.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {foundApp.status === 'approved'
                          ? 'Đã trúng tuyển chính thức'
                          : foundApp.status === 'under_review'
                          ? 'Đang chấm & xếp lịch phỏng vấn'
                          : foundApp.status === 'rejected'
                          ? 'Chưa phù hợp đợt này'
                          : 'Đang chờ xét duyệt hồ sơ'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block">MSSV:</span>
                        <span className="font-mono font-medium">{foundApp.studentId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Khoa:</span>
                        <span className="font-medium truncate">{foundApp.faculty}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Ban ứng tuyển:</span>
                        <span className="font-medium text-blue-700">{foundApp.interestTrack}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Thời gian nộp:</span>
                        <span className="font-medium">{new Date(foundApp.submittedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {foundApp.reviewNotes && (
                      <div className="rounded-xl bg-white border border-slate-200 p-3 text-xs text-slate-700">
                        <strong>Ghi chú từ Ban Tuyển dụng:</strong> {foundApp.reviewNotes}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                    Không tìm thấy hồ sơ nào tương ứng với từ khóa "{searchStudentId}". Vui lòng kiểm tra lại chính xác MSSV.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
