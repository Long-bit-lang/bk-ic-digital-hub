// BK-IC Digital Hub — Admin Partnership Proposals Management
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { PartnershipRequest, PartnershipRequestStatus } from '../../types';
import {
  Handshake,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  X,
  Save,
  MessageSquare,
  AlertCircle,
  FileText,
  User,
  Filter,
  RefreshCw,
  Loader2,
  Tag
} from 'lucide-react';

export const AdminPartnershipRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Detail Modal
  const [selectedReq, setSelectedReq] = useState<PartnershipRequest | null>(null);
  const [newStatus, setNewStatus] = useState<PartnershipRequestStatus>('received');
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Load requests
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.cms.getPartnershipRequests();
      if (res.success && res.requests) {
        setRequests(res.requests);
      } else {
        setError('Không thể tải danh sách đề xuất hợp tác.');
      }
    } catch (err: any) {
      console.error('[Admin Partnership Load Error]', err);
      setError(err.message || 'Lỗi khi tải dữ liệu từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Open review modal
  const handleOpenDetail = (req: PartnershipRequest) => {
    setSelectedReq(req);
    setNewStatus(req.status);
    setInternalNotes(req.notes || '');
    setUpdateSuccess(false);
  };

  // Update status & notes
  const handleSaveUpdate = async () => {
    if (!selectedReq) return;
    setIsUpdating(true);
    try {
      const res = await api.cms.updatePartnershipRequest(selectedReq.id, {
        status: newStatus,
        notes: internalNotes
      });
      if (res.success && res.request) {
        setUpdateSuccess(true);
        // Update local state
        setRequests(prev => prev.map(r => (r.id === res.request.id ? res.request : r)));
        setSelectedReq(res.request);
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái đề xuất.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper for type labels
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sponsor':
        return { label: 'Tài trợ', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'expert_mentoring':
        return { label: 'Đồng hành chuyên môn', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'problem_solving':
        return { label: 'Đặt hàng bài toán', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'media_coop':
        return { label: 'Truyền thông', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
      case 'academic_partner':
        return { label: 'Học thuật / Nhà trường', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'recruitment_partner':
        return { label: 'Tuyển dụng / Thực tập', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'companion_project':
        return { label: 'Dự án đồng hành', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'business_coop':
        return { label: 'Hợp tác doanh nghiệp', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
      default:
        return { label: 'Khác', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  // Helper for status badge
  const getStatusBadge = (status: PartnershipRequestStatus) => {
    switch (status) {
      case 'received':
        return { label: 'Mới tiếp nhận', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'reviewing':
        return { label: 'Đang xem xét', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'contacted':
        return { label: 'Đã liên hệ', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'approved':
        return { label: 'Đã chấp thuận', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'rejected':
        return { label: 'Đã từ chối', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default:
        return { label: status, color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchType = typeFilter === 'all' || r.partnershipType === typeFilter;
    const q = search.toLowerCase().trim();
    const matchSearch = !q ||
      r.organizationName.toLowerCase().includes(q) ||
      r.representativeName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.includes(q)) ||
      r.id.toLowerCase().includes(q);
    return matchStatus && matchType && matchSearch;
  });

  // Counters
  const countTotal = requests.length;
  const countReceived = requests.filter(r => r.status === 'received').length;
  const countReviewing = requests.filter(r => r.status === 'reviewing').length;
  const countContacted = requests.filter(r => r.status === 'contacted').length;
  const countApproved = requests.filter(r => r.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Quản lý Đề xuất Hợp tác
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
              {requests.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tiếp nhận, thẩm định và quản lý các yêu cầu hợp tác từ doanh nghiệp, chuyên gia và đối tác của BK-IC.
          </p>
        </div>

        <button
          onClick={loadRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Tổng đề xuất</span>
          <p className="text-2xl font-extrabold text-white mt-1 font-mono">{countTotal}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-sky-400">Mới tiếp nhận</span>
          <p className="text-2xl font-extrabold text-sky-400 mt-1 font-mono">{countReceived}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-amber-400">Đang xem xét</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">{countReviewing}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-emerald-400">Đã liên hệ / Đồng ý</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{countContacted + countApproved}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên tổ chức, người đại diện, email hoặc SĐT..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="received">Mới tiếp nhận</option>
            <option value="reviewing">Đang xem xét</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="approved">Đã chấp thuận</option>
            <option value="rejected">Đã từ chối</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả hình thức</option>
            <option value="sponsor">Tài trợ</option>
            <option value="expert_mentoring">Đồng hành chuyên môn</option>
            <option value="problem_solving">Đặt hàng bài toán</option>
            <option value="media_coop">Truyền thông</option>
            <option value="academic_partner">Học thuật / Nhà trường</option>
            <option value="recruitment_partner">Tuyển dụng / Thực tập</option>
          </select>
        </div>
      </div>

      {/* Main Table / List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-400" />
            <p className="mt-2 text-xs">Đang tải danh sách đề xuất hợp tác...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 space-y-2">
            <AlertCircle className="h-6 w-6 mx-auto" />
            <p className="text-xs">{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Handshake className="h-8 w-8 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">Chưa có đề xuất hợp tác nào</p>
            <p className="text-xs text-slate-500">Các yêu cầu từ form /partnership sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Tổ chức / Doanh nghiệp</th>
                  <th className="py-3.5 px-4">Người đại diện</th>
                  <th className="py-3.5 px-4">Hình thức</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Thời gian</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRequests.map((req) => {
                  const typeObj = getTypeLabel(req.partnershipType);
                  const statusObj = getStatusBadge(req.status);
                  const dateFormatted = new Date(req.submittedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">
                          {req.organizationName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {req.id}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">
                          {req.representativeName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {req.position ? `${req.position} • ` : ''}{req.email}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${typeObj.color}`}>
                          {typeObj.label}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusObj.color}`}>
                          {statusObj.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {dateFormatted}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(req)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-semibold transition cursor-pointer"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Action Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Chi tiết Đề xuất Hợp tác
                </h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {selectedReq.id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Organization & Representative Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tổ chức / Doanh nghiệp</span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    {selectedReq.organizationName}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Người đại diện</span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    {selectedReq.representativeName} {selectedReq.position ? `(${selectedReq.position})` : ''}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Email liên hệ</span>
                  <a
                    href={`mailto:${selectedReq.email}`}
                    className="text-blue-400 hover:underline block mt-0.5 font-mono"
                  >
                    {selectedReq.email}
                  </a>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Số điện thoại</span>
                  <a
                    href={`tel:${selectedReq.phone}`}
                    className="text-slate-200 hover:underline block mt-0.5 font-mono"
                  >
                    {selectedReq.phone}
                  </a>
                </div>
              </div>

              {/* Proposal Content */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block">
                  Nội dung đề xuất hợp tác:
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed text-xs">
                  {selectedReq.proposalContent}
                </div>
              </div>

              {/* Attachment if present */}
              {selectedReq.attachmentUrl && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Tài liệu đính kèm:</span>
                  <a
                    href={selectedReq.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline"
                  >
                    <span>Xem tài liệu đính kèm</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* Status & Notes Management */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Xử lý &amp; Ghi chú Nội bộ
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cập nhật trạng thái
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as PartnershipRequestStatus)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="received">Mới tiếp nhận (received)</option>
                      <option value="reviewing">Đang xem xét (reviewing)</option>
                      <option value="contacted">Đã liên hệ (contacted)</option>
                      <option value="approved">Đã chấp thuận (approved)</option>
                      <option value="rejected">Từ chối (rejected)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Thời gian tiếp nhận
                    </label>
                    <input
                      type="text"
                      disabled
                      value={new Date(selectedReq.submittedAt).toLocaleString('vi-VN')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ghi chú nội bộ BCN / Ban Đối ngoại (Không hiển thị cho đối tác)
                  </label>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Ghi nhận đầu mối liên hệ, tiến độ làm việc hoặc lưu ý riêng..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              {updateSuccess ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Đã lưu trạng thái thành công!</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-500">Mọi thao tác cập nhật đều được ghi nhận vào Audit Log</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={handleSaveUpdate}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>Lưu cập nhật</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

