// BK-IC Admin Content Management System (CMS)
// Manages Homepage Settings, Recruitment campaign and News/Articles CMS
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { HOME_NEWS_DATA, type NewsItem } from '../../data/homeData';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  ExternalLink,
  Newspaper,
  Edit3,
  AlertTriangle,
  Check,
  Calendar,
  Link2,
  Image as ImageIcon,
  X
} from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useApp();

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'settings' | 'news'>('news');

  // Site Settings Form State
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

  // News CMS State
  const [newsList, setNewsList] = useState<NewsItem[]>(HOME_NEWS_DATA);
  const [newsFilter, setNewsFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [newsSavedMsg, setNewsSavedMsg] = useState<string | null>(null);
  const [isUpdatingNews, setIsUpdatingNews] = useState(false);

  // Load news from API if available, fallback to HOME_NEWS_DATA
  useEffect(() => {
    let isMounted = true;
    api.cms.getNews()
      .then((res) => {
        if (isMounted && res.success && res.news && res.news.length > 0) {
          setNewsList(res.news);
        }
      })
      .catch(() => {
        // Fallback to initial HOME_NEWS_DATA
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Quick toggle status: draft <-> published
  const handleTogglePublish = async (item: NewsItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      setIsUpdatingNews(true);
      await api.cms.updateNews(item.id, { status: newStatus });
      setNewsList((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, status: newStatus } : n))
      );
      setNewsSavedMsg(
        newStatus === 'published'
          ? `Đã xuất bản bài viết "${item.title}" lên Trang chủ!`
          : `Đã chuyển bài viết "${item.title}" về trạng thái Bản thảo (Draft)!`
      );
      setTimeout(() => setNewsSavedMsg(null), 3500);
    } catch {
      // Offline fallback update
      setNewsList((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, status: newStatus } : n))
      );
      setNewsSavedMsg(`Đã cập nhật trạng thái bài viết (lưu cục bộ).`);
      setTimeout(() => setNewsSavedMsg(null), 3500);
    } finally {
      setIsUpdatingNews(false);
    }
  };

  // Save edited news item
  const handleSaveEditedNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsUpdatingNews(true);
      await api.cms.updateNews(editingItem.id, editingItem);
      setNewsList((prev) =>
        prev.map((n) => (n.id === editingItem.id ? editingItem : n))
      );
      setNewsSavedMsg(`Đã lưu thay đổi cho bài viết "${editingItem.title}" thành công!`);
      setEditingItem(null);
      setTimeout(() => setNewsSavedMsg(null), 3500);
    } catch {
      // Local fallback
      setNewsList((prev) =>
        prev.map((n) => (n.id === editingItem.id ? editingItem : n))
      );
      setNewsSavedMsg(`Đã lưu thay đổi cho bài viết (lưu cục bộ).`);
      setEditingItem(null);
      setTimeout(() => setNewsSavedMsg(null), 3500);
    } finally {
      setIsUpdatingNews(false);
    }
  };

  // Filtered news items
  const filteredNews = newsList.filter((item) => {
    if (newsFilter === 'all') return true;
    if (newsFilter === 'draft') return item.status === 'draft';
    if (newsFilter === 'published') return item.status === 'published';
    return true;
  });

  const draftCount = newsList.filter((n) => n.status === 'draft').length;
  const publishedCount = newsList.filter((n) => n.status === 'published').length;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản trị Nội dung Website & Bản tin (CMS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý bản tin từ Fanpage BK-IC, tinh chỉnh cấu hình trang chủ và cổng tuyển dụng mà không cần can thiệp mã nguồn.
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

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('news')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'news'
              ? 'bg-[#1749B5] text-white shadow-md shadow-blue-900/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Newspaper className="h-4 w-4" />
          <span>Quản lý Bản tin Trang chủ</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
            {newsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-[#1749B5] text-white shadow-md shadow-blue-900/20'
              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Cấu hình Trang chủ & Tuyển dụng</span>
        </button>
      </div>

      {/* Notification Alerts */}
      {newsSavedMsg && (
        <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-xs text-emerald-400 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{newsSavedMsg}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Đã lưu và cập nhật cấu hình hệ thống thành công!</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: NEWS CMS                                                       */}
      {/* ===================================================================== */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          {/* Subheader & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Bộ lọc trạng thái:</span>
              <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setNewsFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    newsFilter === 'all' ? 'bg-[#1749B5] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất cả ({newsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNewsFilter('draft')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    newsFilter === 'draft' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bản thảo / Chờ duyệt ({draftCount})
                </button>
                <button
                  type="button"
                  onClick={() => setNewsFilter('published')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    newsFilter === 'published' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Đã xuất bản ({publishedCount})
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Nguồn dữ liệu: <strong className="text-sky-400">Fanpage BK-IC</strong>
            </div>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {filteredNews.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 text-[11px]">
                      {item.category}
                    </span>
                    {item.status === 'published' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[11px] flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Đã xuất bản (Published)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 text-[11px] flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Bản thảo / Chờ BCN xác nhận (Draft)</span>
                      </span>
                    )}
                    {item.priority === 'low' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">
                        Chưa ưu tiên
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>Ngày đăng: {item.publishedAt}</span>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  <div className="md:col-span-3">
                    <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/60">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/bkic/bkic_launch.jpg';
                        }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-9 space-y-2">
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Verification Notes Alert */}
                    {item.verificationNotes && (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-300 flex items-start gap-2 mt-2">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <div>
                          <strong>Yêu cầu kiểm chứng BCN:</strong> {item.verificationNotes}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                        <Link2 className="h-3 w-3 text-slate-500" />
                        <span>Nguồn:</span>
                        <a
                          href={item.sourceUrl || 'https://www.facebook.com/dut.bkic'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <span>{item.source || 'Facebook Fanpage BK-IC'}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Chỉnh sửa</span>
                        </button>

                        <button
                          type="button"
                          disabled={isUpdatingNews}
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                            item.status === 'published'
                              ? 'bg-amber-600/90 hover:bg-amber-600 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{item.status === 'published' ? 'Chuyển về Bản thảo' : 'Xuất bản (Publish)'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal */}
          {editingItem && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Edit3 className="h-4 w-4 text-[#1749B5]" />
                    <span>Chỉnh sửa bài viết CMS</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditedNews} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Tiêu đề bài viết
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Tóm tắt / Nội dung chính
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Chuyên mục
                      </label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Thành tựu">Thành tựu / Thành viên</option>
                        <option value="Cuộc thi">Cuộc thi</option>
                        <option value="Tin tức CLB">Tin tức CLB</option>
                        <option value="Hoạt động CLB">Hoạt động CLB</option>
                        <option value="Sự kiện">Sự kiện</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Hợp tác">Hợp tác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Ngày đăng (DD/MM/YYYY)
                      </label>
                      <input
                        type="text"
                        value={editingItem.publishedAt}
                        onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Đường dẫn ảnh đại diện (Image URL)
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={editingItem.image}
                          onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-xs text-white focus:outline-none font-mono"
                          placeholder="/images/bkic/..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Đường dẫn nguồn (Source URL)
                      </label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={editingItem.sourceUrl || 'https://www.facebook.com/dut.bkic'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              sourceUrl: e.target.value,
                              detailUrl: e.target.value
                            })
                          }
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Ghi chú kiểm chứng BCN (Verification Notes)
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.verificationNotes || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, verificationNotes: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-amber-300 focus:outline-none leading-relaxed"
                      placeholder="Ghi chú điều kiện phê duyệt từ BCN..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Trạng thái xuất bản
                      </label>
                      <select
                        value={editingItem.status || 'draft'}
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="draft">Bản thảo / Chờ BCN xác nhận (Draft)</option>
                        <option value="published">Đã xuất bản (Published)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Mức độ ưu tiên
                      </label>
                      <select
                        value={editingItem.priority || 'normal'}
                        onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="high">Ưu tiên cao (Hiển thị đầu trang)</option>
                        <option value="normal">Bình thường</option>
                        <option value="low">Chưa ưu tiên xuất bản</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingNews}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md transition"
                    >
                      <Save className="h-4 w-4" />
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: SETTINGS CMS                                                   */}
      {/* ===================================================================== */}
      {activeTab === 'settings' && (
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
      )}
    </div>
  );
};
