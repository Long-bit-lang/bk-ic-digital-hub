// BK-IC Admin Members Management Page
// Implements Specification 2.1: Quản lý tài khoản, Email sinh viên, Khôi phục mật khẩu & Hướng dẫn đăng nhập
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, UserRole, MemberStatus, UnitId, AccountStatus } from '../../types';
import { api } from '../../services/api';
import { extractAcademicYear } from '../../utils/academicYear';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  X, 
  Save, 
  CheckCircle2,
  KeyRound,
  HelpCircle,
  AlertCircle,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Send,
  Inbox,
  Shield,
  RefreshCw,
  LogIn,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
  ArrowRight,
  Server,
  Settings
} from 'lucide-react';

export const AdminMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, users, addUser, updateUser, deleteUser, resetMemberPassword, sendMemberInvite, switchUser, verifyMemberEmail } = useApp();

  const [search, setSearch] = useState('');
  const [committeeFilter, setCommitteeFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showOutboxModal, setShowOutboxModal] = useState(false);
  const [outboxEmails, setOutboxEmails] = useState<any[]>([]);
  const [isLoadingOutbox, setIsLoadingOutbox] = useState(false);

  // Success dialog after creating an account (Answers user's question directly in UI)
  const [createdAccountSuccess, setCreatedAccountSuccess] = useState<{
    member: User;
    inviteLink?: string;
    initialPassword?: string;
    message: string;
  } | null>(null);

  // Quick invite link viewer for existing pending_setup member
  const [quickInviteModal, setQuickInviteModal] = useState<{
    member: User;
    inviteLink: string;
  } | null>(null);

  // Reset password modal state (Requirement B & D)
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetResult, setResetResult] = useState<{ success: boolean; message: string; resetLink?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Provisioning method state: 'invite' (via email/token) or 'direct' (admin sets policy-compliant password)
  const [provisionMode, setProvisionMode] = useState<'invite' | 'direct'>('invite');
  const [directPassword, setDirectPassword] = useState('Bkic@2026!');
  const [showDirectPassword, setShowDirectPassword] = useState(false);

  // In-app deletion modal state (replaces blocked window.confirm in iframe)
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Real SMTP Configuration Modal State
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<{ isConfigured: boolean; source: string; host: string; port: number; user: string; from: string } | null>(null);
  const [smtpFormData, setSmtpFormData] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromName: 'BK-IC Digital Hub',
    fromEmail: '',
    enabled: true
  });
  const [testEmailTarget, setTestEmailTarget] = useState('nminhtri1408@gmail.com');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [testSmtpResult, setTestSmtpResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);

  const [formData, setFormData] = useState<{
    fullName: string;
    studentId: string;
    email: string;
    phone: string;
    faculty: string;
    classId: string;
    academicYear: string;
    unit: UnitId;
    role: UserRole;
    position: string;
    status: MemberStatus;
    accountStatus: AccountStatus;
    emailVerified?: boolean;
  }>({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    faculty: 'Khoa Công nghệ Thông tin',
    classId: '24T_CLC',
    academicYear: 'K24 (2024-2029)',
    unit: 'BDH',
    role: 'member',
    position: 'Thành viên Ban Điều hành',
    status: 'active',
    accountStatus: 'pending_setup',
    emailVerified: false
  });

  const loadOutbox = async () => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'sysadmin')) {
      return;
    }
    setIsLoadingOutbox(true);
    try {
      const res = await api.auth.getEmailOutbox();
      if (res.success && Array.isArray(res.emails)) {
        setOutboxEmails(res.emails);
      }
    } catch (err: any) {
      console.warn('Could not load email outbox:', err?.message || err);
    } finally {
      setIsLoadingOutbox(false);
    }
  };

  const loadSmtpStatus = async () => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'sysadmin')) {
      return;
    }
    try {
      const res = await api.auth.getSmtpStatus();
      if (res.success) {
        setSmtpStatus(res);
        if (res.host) {
          setSmtpFormData(prev => ({
            ...prev,
            host: res.host || 'smtp.gmail.com',
            port: res.port || 587
          }));
        }
      }
    } catch (err: any) {
      console.warn('Could not load SMTP status:', err?.message || err);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSmtp(true);
    try {
      const cleanData = {
        ...smtpFormData,
        host: (smtpFormData.host || 'smtp.gmail.com').trim().replace(/^[a-zA-Z]+:\/\//, '').split(':')[0].split(/\s+/)[0],
        user: smtpFormData.user.trim(),
        pass: smtpFormData.pass.trim()
      };
      const res = await api.auth.saveSmtpConfig(cleanData);
      await loadSmtpStatus();
      setFeedbackToast({
        type: 'success',
        message: res.message || 'Đã lưu cấu hình máy chủ gửi thư SMTP!'
      });
      setTimeout(() => setFeedbackToast(null), 4000);
      setShowSmtpModal(false);
    } catch (err: any) {
      alert(err.message || 'Không thể lưu cấu hình SMTP');
    } finally {
      setIsSavingSmtp(false);
    }
  };

  const handleTestSmtp = async () => {
    if (!testEmailTarget.trim()) {
      alert('Vui lòng nhập địa chỉ email nhận thư kiểm thử.');
      return;
    }
    setIsTestingSmtp(true);
    setTestSmtpResult(null);
    try {
      const cleanCustomConfig = smtpFormData.user && smtpFormData.pass ? {
        ...smtpFormData,
        host: (smtpFormData.host || 'smtp.gmail.com').trim().replace(/^[a-zA-Z]+:\/\//, '').split(':')[0].split(/\s+/)[0],
        user: smtpFormData.user.trim(),
        pass: smtpFormData.pass.trim()
      } : undefined;

      const res = await api.auth.testSmtp({
        to: testEmailTarget.trim(),
        customConfig: cleanCustomConfig
      });
      setTestSmtpResult(res);
      await loadOutbox();
    } catch (err: any) {
      setTestSmtpResult({
        success: false,
        message: err.message || 'Lỗi khi gửi email kiểm thử'
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'sysadmin')) {
      loadOutbox();
      loadSmtpStatus();
    }
  }, [currentUser]);

  const userList = Array.isArray(users) ? users : [];
  const filteredUsers = userList.filter((u) => {
    if (!u) return false;
    const matchSearch = (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
                        (u.studentId || '').toLowerCase().includes(search.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
                        (u.memberId && u.memberId.toLowerCase().includes(search.toLowerCase()));
    const matchCommittee = committeeFilter === 'all' || u.unit === committeeFilter || u.committee === committeeFilter;
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchAccount = accountStatusFilter === 'all' || (u.accountStatus || 'active') === accountStatusFilter;
    return matchSearch && matchCommittee && matchRole && matchAccount;
  });

  const generateRandomStrongPassword = () => {
    const specials = ['@', '#', '$', '!', '&', '*'];
    const spec = specials[Math.floor(Math.random() * specials.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const pass = `Bkic${spec}${num}`;
    setDirectPassword(pass);
  };

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setProvisionMode('invite');
    generateRandomStrongPassword();
    setFormData({
      fullName: '',
      studentId: '',
      email: '',
      phone: '',
      faculty: 'Khoa Công nghệ Thông tin',
      classId: '24T_CLC',
      academicYear: 'K24 (2024-2029)',
      unit: 'BDH',
      role: 'member',
      position: 'Thành viên Ban Điều hành',
      status: 'active',
      accountStatus: 'pending_setup'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      fullName: user.fullName,
      studentId: user.studentId,
      email: user.email,
      phone: user.phone || '',
      faculty: user.faculty,
      classId: user.classId,
      academicYear: user.academicYear,
      unit: (user.unit === 'BN' || user.unit === 'BDH' || user.unit === 'BTV') ? user.unit : 'BDH',
      role: user.role,
      position: user.position,
      status: user.status,
      accountStatus: user.accountStatus || 'active',
      emailVerified: Boolean(user.emailVerified || (user.accountStatus === 'active' && user.passwordHash))
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.studentId.trim() || !formData.email.trim()) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc: Họ và tên, MSSV, Email sinh viên.');
      return;
    }

    if (editingUserId) {
      await updateUser(editingUserId, formData);
      setShowModal(false);
    } else {
      try {
        const payload: any = {
          ...formData,
          password: provisionMode === 'direct' ? directPassword.trim() : undefined,
          joinDate: new Date().toISOString().split('T')[0]
        };

        const res = await addUser(payload);
        setShowModal(false);
        await loadOutbox();

        // Open clear guidance modal answering "Làm sao để đăng nhập tài khoản vừa tạo được"
        setCreatedAccountSuccess({
          member: res.member,
          inviteLink: res.inviteLink,
          initialPassword: res.initialPassword,
          message: res.message
        });
      } catch (err: any) {
        alert(err.message || 'Lỗi khi tạo tài khoản');
      }
    }
  };

  const handleOpenDelete = (user: User) => {
    if (user.role === 'admin' && user.email === 'admin.bkic@dut.udn.vn') {
      setFeedbackToast({
        type: 'error',
        message: 'Không thể xóa tài khoản Quản trị viên cấp cao của hệ thống!'
      });
      setTimeout(() => setFeedbackToast(null), 4000);
      return;
    }
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    const res = await deleteUser(userToDelete.id);
    setIsDeleting(false);
    setUserToDelete(null);
    setFeedbackToast({
      type: res.success ? 'success' : 'error',
      message: res.message
    });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Trigger secure reset password flow (Requirement B.3, B.4, B.5)
  const handleConfirmResetPassword = async () => {
    if (!resetModalUser) return;
    setIsResetting(true);
    setResetResult(null);

    const res = await resetMemberPassword(resetModalUser.id);
    setIsResetting(false);
    setResetResult(res);

    if (res.success) {
      await loadOutbox();
    }
  };

  // Manually verify email directly from table
  const handleVerifyEmail = async (u: User) => {
    try {
      const res = await verifyMemberEmail(u.id);
      setFeedbackToast({
        type: res.success ? 'success' : 'error',
        message: res.message
      });
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch (err: any) {
      setFeedbackToast({
        type: 'error',
        message: err.message || 'Lỗi khi xác thực email'
      });
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  // Get activation link for pending account directly from table
  const handleGetPendingInviteLink = async (u: User) => {
    try {
      const res = await sendMemberInvite(u.id);
      if (res.success && res.inviteLink) {
        setQuickInviteModal({
          member: u,
          inviteLink: res.inviteLink
        });
      } else {
        const match = outboxEmails.find(
          (m: any) => m.to.toLowerCase() === u.email.toLowerCase() && m.resetLink
        );
        if (match) {
          setQuickInviteModal({
            member: u,
            inviteLink: match.resetLink
          });
        } else {
          alert('Chưa tìm thấy liên kết kích hoạt. Bạn có thể bấm Đặt lại mật khẩu để tạo liên kết mới 15 phút.');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Không thể tạo liên kết');
    }
  };

  const copyToClipboard = (text: string, isPass: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isPass) {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Export CSV without plaintext passwords (Requirement A.5)
  const handleExportCSV = () => {
    const headers = [
      'Mã thành viên',
      'MSSV',
      'Họ và tên',
      'Email sinh viên',
      'Xác minh email',
      'Trạng thái tài khoản',
      'Khoa đào tạo',
      'Lớp sinh hoạt',
      'Ban chuyên trách',
      'Vai trò hệ thống',
      'Vị trí chức vụ',
      'Trạng thái thành viên',
      'Lần đăng nhập cuối',
      'Thời điểm tạo tài khoản'
    ];

    const rows = filteredUsers.map(u => [
      `"${u.memberId || `BKIC-${u.unit || 'BDH'}-${u.studentId}`}"`,
      `"${u.studentId}"`,
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.emailVerified ? 'Đã xác minh' : 'Chưa xác minh'}"`,
      `"${u.accountStatus === 'active' ? 'Đang hoạt động' : u.accountStatus === 'pending_setup' ? 'Chờ thiết lập MK' : u.accountStatus === 'disabled' ? 'Vô hiệu hóa' : 'Đang hoạt động'}"`,
      `"${u.faculty}"`,
      `"${u.classId}"`,
      `"${u.unit || u.committee || 'BDH'}"`,
      `"${u.role}"`,
      `"${u.position}"`,
      `"${u.status === 'active' ? 'Đang sinh hoạt' : u.status === 'paused' ? 'Bảo lưu' : 'Đã rời'}"`,
      `"${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'}"`,
      `"${u.createdAt ? new Date(u.createdAt).toLocaleString('vi-VN') : u.joinDate || 'N/A'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh_sach_tai_khoan_bkic_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Chưa ghi nhận';
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-lg transition animate-in fade-in ${
          feedbackToast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackToast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span className="font-semibold">{feedbackToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Quản trị Tài khoản & Email Thành viên</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng <strong>{users.length}</strong> hồ sơ tài khoản sinh viên đã liên kết ({filteredUsers.length} tài khoản phù hợp bộ lọc). Mật khẩu được mã hóa PBKDF2/SHA-512 an toàn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Real SMTP Mail Server Configuration */}
          <button
            type="button"
            onClick={() => {
              loadSmtpStatus();
              setShowSmtpModal(true);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
              smtpStatus?.isConfigured
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Cấu hình tài khoản gửi email thật qua SMTP (Gmail, Brevo, SendGrid)"
          >
            <Server className="h-4 w-4" />
            <span>{smtpStatus?.isConfigured ? 'Email Thật: Đang Bật' : 'Cấu hình Gửi Email (SMTP)'}</span>
          </button>

          {/* Outbox drawer button (Requirement D: testing & verification) */}
          <button
            type="button"
            onClick={() => {
              loadOutbox();
              setShowOutboxModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition"
            title="Xem các email bảo mật đã phát hành trong môi trường kiểm thử"
          >
            <Inbox className="h-4 w-4 text-indigo-400" />
            <span>Hộp thư thử nghiệm ({outboxEmails.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Cách đăng nhập & Cấp tài khoản</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>Xuất CSV (Không lưu mật khẩu)</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>Cấp tài khoản mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={committeeFilter}
            onChange={(e) => setCommitteeFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả các Ban (BN, BDH, BTV)</option>
            <option value="BN">Ban Chủ nhiệm (BN)</option>
            <option value="BDH">Ban Điều hành (BDH)</option>
            <option value="BTV">Ban Thành viên (BTV)</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên (Admin)</option>
            <option value="leader">Trưởng ban (Leader)</option>
            <option value="member">Thành viên (Member)</option>
            <option value="applicant">Ứng viên (Applicant)</option>
          </select>

          <select
            value={accountStatusFilter}
            onChange={(e) => setAccountStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái tài khoản</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending_setup">Chờ thiết lập mật khẩu</option>
            <option value="disabled">Đã vô hiệu hóa</option>
          </select>
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo Mã TV, Tên, MSSV, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table: Minimum account attributes per Section 2.1 A */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Mã TV & Thành viên</th>
                <th className="py-3.5 px-4">Email sinh viên & Xác minh</th>
                <th className="py-3.5 px-4">Trạng thái tài khoản</th>
                <th className="py-3.5 px-4">Ban & Chức vụ</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Đăng nhập gần nhất</th>
                <th className="py-3.5 px-4 text-right">Thao tác & Đăng nhập</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Không tìm thấy thành viên phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const displayMemberId = u.memberId || `BKIC-${u.unit || 'BDH'}-${u.studentId}`;
                  const isVerified = Boolean(u.emailVerified || (u.accountStatus === 'active' && u.passwordHash && !u.resetTokenHash));
                  const accStatus = u.accountStatus || 'active';

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      {/* Mã thành viên & Tên & MSSV */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{u.fullName}</div>
                        <div className="text-[11px] font-mono text-blue-400 font-medium">{displayMemberId}</div>
                        <div className="text-[11px] font-mono text-slate-500">MSSV: {u.studentId} · {u.faculty}</div>
                      </td>

                      {/* Email sinh viên & Trạng thái xác thực */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-200">{u.email}</div>
                        <div className="mt-1">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Email đã xác thực</span>
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <AlertCircle className="h-3 w-3" />
                                <span>Chưa xác thực</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleVerifyEmail(u)}
                                className="text-[10px] text-blue-400 hover:text-blue-300 underline font-medium"
                                title="Xác thực email ngay cho tài khoản này"
                              >
                                Xác thực ngay
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Trạng thái tài khoản */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {accStatus === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>Hoạt động</span>
                            </span>
                          )}
                          {accStatus === 'pending_setup' && (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                <Clock className="h-3 w-3" />
                                <span>Chờ thiết lập MK</span>
                              </span>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => handleGetPendingInviteLink(u)}
                                  className="text-[10px] text-blue-400 hover:text-blue-300 underline font-medium"
                                  title="Lấy link thiết lập mật khẩu để đăng nhập"
                                >
                                  Lấy link kích hoạt →
                                </button>
                              </div>
                            </div>
                          )}
                          {accStatus === 'disabled' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                              <X className="h-3 w-3" />
                              <span>Vô hiệu hóa</span>
                            </span>
                          )}
                          <div className="text-[10px] text-slate-500">
                            Thành viên: {u.status === 'active' ? 'Đang sinh hoạt' : u.status === 'paused' ? 'Bảo lưu' : 'Đã rời'}
                          </div>
                        </div>
                      </td>

                      {/* Ban & Vị trí */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200">
                          {u.unit === 'BN' ? 'Ban Chủ nhiệm' : u.unit === 'BDH' ? 'Ban Điều hành' : u.unit === 'BTV' ? 'Ban Thành viên' : (u.committee || 'Ban Điều hành')}
                        </span>
                        <div className="text-[11px] text-slate-400">{u.position}</div>
                      </td>

                      {/* Vai trò */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          u.role === 'admin'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : u.role === 'leader'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : u.role === 'member'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Lần đăng nhập gần nhất */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300 font-mono text-[11px]">
                          {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : 'Chưa đăng nhập'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Tạo: {u.createdAt ? formatDateTime(u.createdAt) : u.joinDate || 'Ban đầu'}
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        {/* Quick switch to test login perspective directly */}
                        <button
                          onClick={async () => {
                            await switchUser(u.id);
                            if (u.role === 'admin') navigate('/admin');
                            else if (u.role === 'applicant') navigate('/pending-approval');
                            else navigate('/portal');
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                          title="Đăng nhập thử tài khoản này ngay (Chuyển phiên)"
                        >
                          <LogIn className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setResetModalUser(u);
                            setResetResult(null);
                            setCopiedLink(false);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                          title="Gửi email liên kết đặt lại mật khẩu an toàn (15 phút)"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition"
                          title="Chỉnh sửa hồ sơ"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(u)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CẤP TÀI KHOẢN THÀNH CÔNG - HƯỚNG DẪN ĐĂNG NHẬP (TRẢ LỜI TRỰC TIẾP CHO NGƯỜI DÙNG) */}
      {createdAccountSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-emerald-500/50 p-6 sm:p-7 space-y-5 text-white shadow-2xl my-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cấp Tài khoản Thành công!</h3>
                  <p className="text-xs text-slate-400">Hướng dẫn đăng nhập tài khoản vừa tạo</p>
                </div>
              </div>
              <button
                onClick={() => setCreatedAccountSuccess(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Thông tin hồ sơ vừa tạo */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Họ và tên:</span>
                <span className="font-semibold text-white">{createdAccountSuccess.member.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email đăng nhập:</span>
                <span className="font-mono font-medium text-blue-400">{createdAccountSuccess.member.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mã thành viên:</span>
                <span className="font-mono text-slate-300">{createdAccountSuccess.member.memberId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ban & Vai trò:</span>
                <span className="text-slate-300">Ban {createdAccountSuccess.member.unit} · {createdAccountSuccess.member.role}</span>
              </div>
            </div>

            {/* Hướng dẫn đăng nhập tùy theo phương thức */}
            {createdAccountSuccess.inviteLink ? (
              <div className="rounded-2xl bg-blue-500/10 border border-blue-500/30 p-4 space-y-3 text-xs">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>Cách đăng nhập tài khoản này (Phương thức Thư mời):</span>
                </div>
                
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    <strong>Bước 1:</strong> Mở liên kết kích hoạt bên dưới (hoặc thành viên nhấn vào email nhận được).
                  </li>
                  <li>
                    <strong>Bước 2:</strong> Thành viên tự nhập mật khẩu mới (tối thiểu 8 ký tự, chữ hoa, thường, số, ký tự đặc biệt).
                  </li>
                  <li>
                    <strong>Bước 3:</strong> Tài khoản kích hoạt ngay lập tức. Đăng nhập tại <code>/login</code> bằng Email sinh viên và mật khẩu vừa đặt!
                  </li>
                </ol>

                <div className="pt-2 border-t border-blue-500/20 space-y-2">
                  <div className="text-[11px] text-blue-300 font-medium flex items-center justify-between">
                    <span>Liên kết kích hoạt & thiết lập mật khẩu (15 phút):</span>
                    <span className="text-[10px] text-blue-400 font-mono">Dùng 1 lần</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdAccountSuccess.inviteLink}
                      className="flex-1 bg-slate-900 border border-blue-500/40 rounded-xl px-2.5 py-1.5 font-mono text-[11px] text-blue-200 truncate"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdAccountSuccess.inviteLink!)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium text-[11px] flex items-center gap-1 shrink-0"
                    >
                      {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedLink ? 'Đã chép' : 'Sao chép link'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <a
                    href={createdAccountSuccess.inviteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Mở thiết lập mật khẩu ngay</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-3 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Cách đăng nhập tài khoản này (Đã kích hoạt mật khẩu):</span>
                </div>

                <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    Tài khoản đã ở trạng thái <strong>Đang hoạt động</strong> ngay lập tức.
                  </li>
                  <li>
                    Thành viên truy cập màn hình <strong>Đăng nhập</strong>: nhập Email sinh viên và Mật khẩu khởi tạo bên dưới.
                  </li>
                  <li>
                    Khuyến nghị thành viên đổi mật khẩu sau lần đăng nhập đầu tiên.
                  </li>
                </ol>

                <div className="p-3 bg-slate-900 border border-emerald-500/40 rounded-xl space-y-1">
                  <div className="text-[11px] text-slate-400">Mật khẩu khởi tạo:</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-emerald-300">
                      {createdAccountSuccess.initialPassword}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdAccountSuccess.initialPassword!, true)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-300 text-[11px] flex items-center gap-1 border border-slate-700"
                    >
                      {copiedPassword ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedPassword ? 'Đã sao chép' : 'Sao chép MK'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedAccountSuccess(null);
                      navigate('/login');
                    }}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Vào màn hình Đăng nhập</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Switch Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={async () => {
                  await switchUser(createdAccountSuccess.member.id);
                  setCreatedAccountSuccess(null);
                  if (createdAccountSuccess.member.role === 'admin') navigate('/admin');
                  else if (createdAccountSuccess.member.role === 'applicant') navigate('/pending-approval');
                  else navigate('/portal');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <UserCheck className="h-4 w-4" />
                <span>Trải nghiệm phiên đăng nhập tài khoản này ngay</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatedAccountSuccess(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK INVITE LINK VIEWER FOR PENDING ACCOUNT */}
      {quickInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-400" />
                <span>Liên kết Kích hoạt Tài khoản</span>
              </h3>
              <button
                onClick={() => setQuickInviteModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tài khoản của <strong className="text-white">{quickInviteModal.member.fullName}</strong> ({quickInviteModal.member.email}) đang ở trạng thái <strong>Chờ thiết lập mật khẩu</strong>. Sử dụng liên kết bảo mật dưới đây để kích hoạt tài khoản:
            </p>

            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
              <div className="text-[11px] text-slate-400">Liên kết kích hoạt (Hiệu lực 15 phút):</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={quickInviteModal.inviteLink}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-sky-200 truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(quickInviteModal.inviteLink)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium text-[11px] flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLink ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-2">
              <a
                href={quickInviteModal.inviteLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <span>Mở liên kết thiết lập</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setQuickInviteModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RESET PASSWORD VIA SECURE EMAIL LINK (Requirement B.3 - B.10) */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-400" />
                <span>Khôi phục Mật khẩu Tài khoản Thành viên</span>
              </h3>
              <button
                onClick={() => setResetModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-1.5 text-xs">
              <div className="text-slate-400">Thành viên: <strong className="text-white">{resetModalUser.fullName}</strong></div>
              <div className="text-slate-400 font-mono">Email: <span className="text-blue-400">{resetModalUser.email}</span></div>
              <div className="text-slate-400 font-mono">Mã TV: <span className="text-slate-300">{resetModalUser.memberId || `BKIC-${resetModalUser.unit || 'BDH'}-${resetModalUser.studentId}`}</span></div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-2xl">
              <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>Chính sách bảo mật hệ thống BK-IC (Mục 2.1 B & C):</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li>Admin / BTV <strong>không xem hoặc đặt lại mật khẩu thủ công</strong> dạng văn bản rõ.</li>
                <li>Hệ thống sẽ tạo mã token bảo mật SHA-256 có thời hạn <strong>15 phút</strong> (chỉ dùng 1 lần).</li>
                <li>Thư điện tử chuẩn BK-IC Digital Hub sẽ được gửi đến email thành viên để họ tự thiết lập mật khẩu tuân thủ tiêu chuẩn mật khẩu an toàn.</li>
                <li>Quá trình này <strong>không làm thay đổi</strong> vai trò, đơn vị, chức vụ hoặc trạng thái của thành viên.</li>
              </ul>
            </div>

            {/* Reset Result Feedback & Test Link (Requirement D) */}
            {resetResult && (
              <div className={`p-4 rounded-2xl text-xs space-y-2 ${
                resetResult.success
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/60 border border-red-500/40 text-red-200'
              }`}>
                <div className="flex items-center gap-2 font-semibold">
                  {resetResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span>{resetResult.message}</span>
                </div>

                {resetResult.resetLink && (
                  <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                    <div className="text-[11px] text-emerald-300 font-medium">
                      Liên kết kiểm thử (Môi trường Test/Dev - Hiệu lực 15 phút):
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={resetResult.resetLink}
                        className="flex-1 bg-slate-900 border border-emerald-500/30 rounded-xl px-2.5 py-1.5 font-mono text-[11px] text-emerald-100"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(resetResult.resetLink!)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-white font-medium text-[11px] flex items-center gap-1"
                      >
                        {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedLink ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                      <a
                        href={resetResult.resetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium text-[11px] flex items-center gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Mở trang đặt lại</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setResetModalUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleConfirmResetPassword}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang phát hành mã bảo mật...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Phát hành mã & Gửi Email khôi phục</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT MEMBER (CẤP TÀI KHOẢN MỚI) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5 text-white shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                  <span>{editingUserId ? 'Chỉnh sửa Hồ sơ Thành viên' : 'Cấp Tài khoản Mới cho Thành viên'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Liên kết tài khoản đăng nhập chính xác với hồ sơ thành viên BK-IC
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    MSSV *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Email sinh viên (@dut.udn.vn) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Provisioning Mode Selector (Requirement 2.1 A.6 & A.7) */}
              {!editingUserId ? (
                <div className="space-y-3 pt-1">
                  <div className="text-xs font-semibold text-slate-300">
                    Phương thức khởi tạo xác thực ban đầu:
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setProvisionMode('invite')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        provisionMode === 'invite'
                          ? 'border-blue-500 bg-blue-500/15 text-white'
                          : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-blue-400">
                        <Mail className="h-4 w-4" />
                        <span>Thư mời kích hoạt</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        Khuyến nghị: Thành viên nhận link 15 phút tự đặt mật khẩu riêng.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProvisionMode('direct')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        provisionMode === 'direct'
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-400">
                        <KeyRound className="h-4 w-4" />
                        <span>Đặt mật khẩu ban đầu</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        Admin cấp mật khẩu mạnh trực tiếp, đăng nhập được ngay lập tức.
                      </p>
                    </button>
                  </div>

                  {provisionMode === 'direct' && (
                    <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-300 text-xs">
                          Mật khẩu khởi tạo an toàn *
                        </label>
                        <button
                          type="button"
                          onClick={generateRandomStrongPassword}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Tạo ngẫu nhiên</span>
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showDirectPassword ? 'text' : 'password'}
                          required
                          value={directPassword}
                          onChange={(e) => setDirectPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-emerald-300 pr-9 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDirectPassword(!showDirectPassword)}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                        >
                          {showDirectPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 leading-relaxed">
                        Quy tắc bắt buộc: Tối thiểu 8 ký tự, có chữ hoa, thường, số và ký tự đặc biệt (!@#$...). Không dùng ngày sinh hay MSSV.
                      </div>
                    </div>
                  )}

                  {provisionMode === 'invite' && (
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">
                        Khi nhấn Tạo tài khoản, hệ thống sẽ phát hành mã kích hoạt 15 phút và hiển thị liên kết để bạn có thể gửi cho thành viên hoặc mở thiết lập mật khẩu ngay.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Trạng thái tài khoản
                    </label>
                    <select
                      value={formData.accountStatus}
                      onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value as AccountStatus })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="pending_setup">Chờ thiết lập mật khẩu</option>
                      <option value="disabled">Vô hiệu hóa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Trạng thái thành viên
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as MemberStatus })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="active">Đang sinh hoạt</option>
                      <option value="paused">Bảo lưu</option>
                      <option value="left">Đã rời CLB</option>
                    </select>
                  </div>
                  <div className="col-span-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.emailVerified)}
                        onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                      />
                      <span>Email đã được xác thực hợp lệ</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Khoa đào tạo
                  </label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-400">
                      Lớp sinh hoạt
                    </label>
                    <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ban phân công *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as UnitId })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="BDH">Ban Điều hành (BDH)</option>
                    <option value="BTV">Ban Thành viên (BTV)</option>
                    <option value="BN">Ban Chủ nhiệm (BN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Vai trò hệ thống *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="member">Thành viên (Member)</option>
                    <option value="leader">Trưởng ban (Leader)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                    <option value="applicant">Ứng viên (Applicant)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Vị trí chức danh trong ban
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-xs"
                >
                  {editingUserId ? 'Lưu thay đổi' : 'Cấp tài khoản & Hoàn tất'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EMAIL OUTBOX DRAWER / TEST VERIFICATION (Requirement D) */}
      {showOutboxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 space-y-4 text-white shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Hộp thư Outbox Thử nghiệm Hệ thống BK-IC</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadOutbox}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Tải lại hộp thư"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingOutbox ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setShowOutboxModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Theo Mục 2.1.D, chức năng quên mật khẩu & cấp tài khoản chỉ hoàn tất khi email thực sự được phát hành, liên kết có thể sử dụng và đổi mật khẩu thành công. Dưới đây là các email đặt lại mật khẩu và thư mời đã gửi đi:
            </p>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {outboxEmails.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Chưa có email nào trong hộp thư gửi đi. Hãy thực hiện "Quên mật khẩu" hoặc "Cấp tài khoản mới" để kiểm tra.
                </div>
              ) : (
                outboxEmails.map((email: any) => (
                  <div key={email.id} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-white">{email.recipientName}</span>{' '}
                          <span className="text-slate-400 font-mono">({email.to})</span>
                          {email.deliveryMethod === 'smtp' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium">
                              ✓ Đã gửi qua máy chủ
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium">
                              Lưu trữ Outbox
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-blue-400 font-medium mt-0.5">{email.subject}</div>
                        {email.deliveryError && email.deliveryMethod !== 'smtp' && (
                          <div className="text-[10.5px] text-amber-300/90 font-mono mt-1">
                            Lý do: {email.deliveryError}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {formatDateTime(email.sentAt)}
                      </span>
                    </div>

                    {email.resetLink && (
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                        <div className="truncate font-mono text-[11px] text-slate-400 max-w-sm">
                          {email.resetLink}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(email.resetLink)}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Sao chép</span>
                          </button>
                          <a
                            href={email.resetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Mở liên kết</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOutboxModal(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold text-xs hover:bg-blue-500"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: ADMIN ACCOUNT CREATION GUIDE */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-400" />
                <span>Hướng dẫn: Làm sao để đăng nhập tài khoản vừa tạo?</span>
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="font-semibold text-blue-400">Cách 1: Kích hoạt bằng Thư mời (Khuyến nghị bảo mật - Mục 2.1 A.7):</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Khi tạo tài khoản, hệ thống sinh ra một liên kết kích hoạt (hiệu lực 15 phút). Để đăng nhập:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
                  <li>Mở <strong>"Hộp thư thử nghiệm"</strong> hoặc copy link trong popup tạo thành công.</li>
                  <li>Mở liên kết đó và tự đặt mật khẩu riêng theo chính sách (8+ ký tự, hoa, thường, số, ký tự đặc biệt).</li>
                  <li>Sau khi đặt mật khẩu, quay lại trang Đăng nhập và đăng nhập bình thường!</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="font-semibold text-emerald-400">Cách 2: Đặt mật khẩu an toàn ban đầu trực tiếp:</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Trong biểu mẫu Cấp tài khoản mới, chọn thẻ <strong>"Đặt mật khẩu ban đầu"</strong> &gt; Nhập mật khẩu hợp lệ (ví dụ: <code className="text-emerald-300 font-mono">Bkic@2026!</code>). Tài khoản sẽ hoạt động ngay lập tức và thành viên có thể đăng nhập ngay với Email và Mật khẩu này!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="font-semibold text-amber-400">Cách 3: Trải nghiệm tài khoản nhanh (Không cần đăng xuất):</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Tại danh sách tài khoản thành viên, nhấn vào biểu tượng <LogIn className="h-3.5 w-3.5 text-emerald-400 inline mx-0.5" /> ở cột Thao tác. Hệ thống sẽ chuyển ngay phiên làm việc sang tài khoản đó để bạn kiểm tra giao diện và phân quyền thực tế.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold text-xs hover:bg-blue-500"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: CONFIRM DELETE MEMBER (REPLACES BLOCKED WINDOW.CONFIRM) */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-red-500/50 p-6 space-y-4 text-white shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Xác nhận Xóa Tài khoản</h3>
                <p className="text-xs text-slate-400">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Họ và tên:</span>
                <span className="font-semibold text-white">{userToDelete.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email đăng nhập:</span>
                <span className="font-mono text-blue-400">{userToDelete.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mã TV / MSSV:</span>
                <span className="font-mono text-slate-300">{userToDelete.memberId || userToDelete.studentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Đơn vị:</span>
                <span className="text-slate-300">Ban {userToDelete.unit} · {userToDelete.role}</span>
              </div>
            </div>

            <p className="text-xs text-red-300/90 leading-relaxed bg-red-500/10 border border-red-500/20 p-3 rounded-2xl">
              Bạn có chắc chắn muốn xóa tài khoản của thành viên này? Dữ liệu tài khoản sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu và hệ thống sẽ tự động ghi vết Audit Log.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xác nhận Xóa tài khoản</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: REAL SMTP EMAIL SERVER CONFIGURATION & TESTING */}
      {showSmtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 space-y-4 text-white shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cấu hình Hòm thư Gửi Email Thật (SMTP)</h3>
                  <p className="text-xs text-slate-400">Gửi email quên mật khẩu & thư mời trực tiếp về Gmail của thành viên</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSmtpModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current Status Badge */}
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-3 border ${
              smtpStatus?.isConfigured
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
            }`}>
              {smtpStatus?.isConfigured ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
              )}
              <div className="leading-snug">
                <div className="font-semibold">
                  {smtpStatus?.isConfigured ? 'Máy chủ gửi thư thật đang hoạt động!' : 'Chưa kết nối máy chủ gửi thư thật'}
                </div>
                <div className="text-[11px] opacity-90 mt-0.5">
                  {smtpStatus?.isConfigured
                    ? `Email đang phát qua tài khoản: ${smtpStatus.user} (${smtpStatus.host}:${smtpStatus.port})`
                    : 'Các email phát hành tạm thời được lưu trong "Hộp thư thử nghiệm" nội bộ. Cấu hình bên dưới để thư tự động gửi về Gmail thật!'}
                </div>
              </div>
            </div>

            {/* SMTP Configuration Form */}
            <form onSubmit={handleSaveSmtp} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Máy chủ SMTP (Host) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="smtp.gmail.com"
                    value={smtpFormData.host}
                    onChange={(e) => setSmtpFormData({ ...smtpFormData, host: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Cổng (Port) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="587"
                    value={smtpFormData.port}
                    onChange={(e) => setSmtpFormData({ ...smtpFormData, port: parseInt(e.target.value) || 587 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Email tài khoản gửi (Gmail) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="clb.bkic@gmail.com"
                    value={smtpFormData.user}
                    onChange={(e) => setSmtpFormData({ ...smtpFormData, user: e.target.value, fromEmail: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Mật khẩu ứng dụng (App Password) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="16 ký tự mã ứng dụng Google"
                    value={smtpFormData.pass}
                    onChange={(e) => setSmtpFormData({ ...smtpFormData, pass: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tên người gửi hiển thị
                  </label>
                  <input
                    type="text"
                    placeholder="BK-IC Digital Hub"
                    value={smtpFormData.fromName}
                    onChange={(e) => setSmtpFormData({ ...smtpFormData, fromName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="secure-toggle"
                    checked={smtpFormData.secure}
                    onChange={(e) => setSmtpFormData({ ...smtpFormData, secure: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="secure-toggle" className="text-slate-300 text-xs">
                    Sử dụng SSL (Port 465)
                  </label>
                </div>
              </div>

              {/* Step-by-step Gmail App Password Guide */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-300 space-y-1.5 text-[11px] leading-relaxed">
                <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Cách lấy "Mật khẩu ứng dụng" Google (Chỉ mất 1 phút):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-300">
                  <li>Truy cập <code className="text-blue-300 font-mono">myaccount.google.com</code> &gt; chọn tab <strong>Bảo mật</strong>.</li>
                  <li>Bật <strong>Xác minh 2 bước</strong> cho tài khoản Google của bạn (nếu chưa bật).</li>
                  <li>Tại thanh tìm kiếm cài đặt, gõ <strong>"Mật khẩu ứng dụng"</strong> (App Passwords).</li>
                  <li>Đặt tên ứng dụng (ví dụ: <code>BK-IC Hub</code>) &gt; bấm <strong>Tạo</strong> &gt; copy mã 16 chữ số dán vào ô Mật khẩu ở trên.</li>
                </ol>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingSmtp}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSavingSmtp ? 'Đang lưu...' : 'Lưu Cấu hình SMTP'}</span>
                </button>
              </div>
            </form>

            {/* Test Email Section */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                <Send className="h-4 w-4 text-emerald-400" />
                <span>Gửi Thử Email Kiểm tra Kết nối Ngay</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn (ví dụ: nminhtri1408@gmail.com)"
                  value={testEmailTarget}
                  onChange={(e) => setTestEmailTarget(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  disabled={isTestingSmtp}
                  onClick={handleTestSmtp}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition flex items-center gap-1.5 shrink-0 shadow-sm disabled:opacity-50"
                >
                  {isTestingSmtp ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Gửi thử ngay</span>
                    </>
                  )}
                </button>
              </div>

              {testSmtpResult && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  testSmtpResult.success
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/80 border border-red-500/50 text-red-200'
                }`}>
                  {testSmtpResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{testSmtpResult.message}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSmtpModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
