// BK-IC Admin Content Management System (CMS)
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const { siteSettings, updateSiteSettings, projects, events, addProject, addEvent } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formData, setFormData] = useState({
    heroEyebrow: siteSettings.heroEyebrow,
    heroHeadline: siteSettings.heroHeadline,
    heroSubheadline: siteSettings.heroSubheadline,
    heroTagline: siteSettings.heroTagline,
    englishTagline: siteSettings.englishTagline,
    recruitmentStatus: siteSettings.recruitmentStatus,
    recruitmentDeadline: siteSettings.recruitmentDeadline,
    contactEmail: siteSettings.contactEmail,
    contactAddress: siteSettings.contactAddress
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản trị Nội dung Trang chủ & Thông tin Công khai (CMS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chỉnh sửa tiêu đề Hero, khẩu hiệu truyền thông, cổng tuyển dụng mà không cần can thiệp mã nguồn.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
        >
          <span>Xem Trang chủ</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Đã lưu và cập nhật nội dung lên website thành công!</span>
        </div>
      )}

      {/* Main CMS Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Hero Banner Text */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Nội dung Khối Hero Trang chủ</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Thẻ Eyebrow phía trên tiêu đề
            </label>
            <input
              type="text"
              value={formData.heroEyebrow}
              onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Tiêu đề chính Hero (Headline lớn)
            </label>
            <textarea
              rows={2}
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none leading-relaxed font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Đoạn văn mô tả sứ mệnh (Subheadline)
            </label>
            <textarea
              rows={3}
              value={formData.heroSubheadline}
              onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Khẩu hiệu tiếng Việt đề xuất
              </label>
              <input
                type="text"
                value={formData.heroTagline}
                onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Khẩu hiệu tiếng Anh hỗ trợ (English Tagline)
              </label>
              <input
                type="text"
                value={formData.englishTagline}
                onChange={(e) => setFormData({ ...formData, englishTagline: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none italic"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Recruitment Campaign Settings */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Globe className="h-4 w-4" />
            <span>Cấu hình Chiến dịch Tuyển dụng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Trạng thái cổng tuyển sinh viên
              </label>
              <select
                value={formData.recruitmentStatus}
                onChange={(e) => setFormData({ ...formData, recruitmentStatus: e.target.value as any })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="open">Đang mở nhận hồ sơ (Open)</option>
                <option value="closed">Đã đóng nhận hồ sơ (Closed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Hạn chót nộp đơn
              </label>
              <input
                type="date"
                value={formData.recruitmentDeadline}
                onChange={(e) => setFormData({ ...formData, recruitmentDeadline: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Address */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Thông tin Liên hệ Công khai
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Hòm thư điện tử
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Địa chỉ trụ sở / Văn phòng
              </label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition"
          >
            <Save className="h-4 w-4" />
            <span>Lưu & Xuất bản lên Website</span>
          </button>
        </div>
      </form>
    </div>
  );
};
