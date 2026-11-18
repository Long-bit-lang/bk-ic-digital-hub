// BK-IC About Page — Member Album / Archive Section (GEN 1)
// Modeled after the DUT AI Club Archive interface with vertical portrait cards and Lightbox inspection
import React, { useState } from 'react';
import { 
  Users, 
  Layers, 
  GraduationCap, 
  Search,
  ZoomIn,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ImageLightboxModal } from '../common/ImageLightboxModal';

// Discover all available avatar photos in public/imageAVT in real time via Vite
const avatarFiles =
  typeof (import.meta as any).glob === 'function'
    ? (import.meta as any).glob('../../../public/imageAVT/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
        eager: true,
        query: '?url',
        import: 'default'
      })
    : {};

// Build map: '105220278' -> '/imageAVT/105220278.jpg'
const VITE_DETECTED_AVATARS: Record<string, string> = {};
for (const [filePath, fileUrl] of Object.entries(avatarFiles)) {
  const filename = filePath.split('/').pop() || '';
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  if (nameWithoutExt && !nameWithoutExt.includes('2aObo') && nameWithoutExt !== 'default') {
    const resolvedUrl = typeof fileUrl === 'string' ? fileUrl : (fileUrl as any)?.default || `/imageAVT/${filename}`;
    VITE_DETECTED_AVATARS[nameWithoutExt] = resolvedUrl;
  }
}

export const DEFAULT_MEMBER_AVATAR = '/imageAVT/default.jpg';

// Registered individual photos in public/imageAVT named by MSSV
export const KNOWN_AVATARS: Record<string, string> = {
  '105220278': '/imageAVT/105220278.jpg', // Phạm Lê Tú (Ban Chủ nhiệm)
  '123220065': '/imageAVT/123220065.jpg', // Nguyễn Thiện Quốc (Ban Chủ nhiệm)
  '118230004': '/imageAVT/118230004.jpg', // Nguyễn Quỳnh Châu (Ban Chủ nhiệm)
  '105230195': '/imageAVT/105230195.jpg', // Lê Anh Khoa (Ban Điều hành)
  '121240105': '/imageAVT/121240105.jpg', // Nguyễn Thị Thục Trang (Ban Điều hành)
  '123230067': '/imageAVT/123230067.jpg', // Nguyễn Đoàn Anh Thư (Ban Điều hành)
  '102240134': '/imageAVT/102240134.jpg', // Nguyễn Thị Quế Trân (Ban Điều hành)
  '102250342': '/imageAVT/102250342.jpg', // Nguyễn Hoàng Long (Ban Thành viên)
  '121240093': '/imageAVT/121240093.jpg', // Lê Hồng Ngân (Ban Thành viên)
};

export const getMemberAvatar = (studentId: string): string => {
  return VITE_DETECTED_AVATARS[studentId] || KNOWN_AVATARS[studentId] || `/imageAVT/${studentId}.jpg`;
};

export interface MemberItem {
  id: string;
  fullName: string;
  position: string;
  faculty: string;
  studentId: string;
  avatarUrl: string;
  departmentName: string;
}

export interface DepartmentGroup {
  id: 'bcn' | 'bdh' | 'btv';
  num: string;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  members: MemberItem[];
}

export const ALBUM_DATA: DepartmentGroup[] = [
  {
    id: 'bcn',
    num: '01',
    name: 'Ban chủ nhiệm',
    shortName: 'BCN',
    headline: 'Những người đặt nền móng đầu tiên cho BK-IC',
    description: 'Chịu trách nhiệm pháp lý, định hướng chiến lược dài hạn và đại diện câu lạc bộ trước Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa (DUT).',
    members: [
      {
        id: 'bcn-1',
        fullName: 'Phạm Lê Tú',
        position: 'Ban Chủ nhiệm',
        faculty: 'Khoa Điện',
        studentId: '105220278',
        avatarUrl: getMemberAvatar('105220278'),
        departmentName: 'Ban chủ nhiệm'
      },
      {
        id: 'bcn-2',
        fullName: 'Nguyễn Thiện Quốc',
        position: 'Ban Chủ nhiệm',
        faculty: 'Khoa Điện',
        studentId: '123220065',
        avatarUrl: getMemberAvatar('123220065'),
        departmentName: 'Ban chủ nhiệm'
      },
      {
        id: 'bcn-3',
        fullName: 'Nguyễn Quỳnh Châu',
        position: 'Ban Chủ nhiệm',
        faculty: 'Khoa Quản lý Dự án & CN',
        studentId: '118230004',
        avatarUrl: getMemberAvatar('118230004'),
        departmentName: 'Ban chủ nhiệm'
      }
    ]
  },
  {
    id: 'bdh',
    num: '02',
    name: 'Ban điều hành',
    shortName: 'BĐH',
    headline: 'Lực lượng điều phối thường nhật & ươm tạo dự án',
    description: 'Tổ chức các buổi sinh hoạt định kỳ, xây dựng học liệu kỹ thuật, quản lý tiến độ dự án đổi mới sáng tạo và điều phối các chương trình hành động của BK-IC.',
    members: [
      {
        id: 'bdh-1',
        fullName: 'Lê Anh Khoa',
        position: 'Ban Điều hành',
        faculty: 'Khoa Điện',
        studentId: '105230195',
        avatarUrl: getMemberAvatar('105230195'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'bdh-2',
        fullName: 'Nguyễn Thị Thục Trang',
        position: 'Ban Điều hành',
        faculty: 'Khoa Kiến trúc',
        studentId: '121240105',
        avatarUrl: getMemberAvatar('121240105'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'bdh-3',
        fullName: 'Nguyễn Đoàn Anh Thư',
        position: 'Ban Điều hành',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '123230067',
        avatarUrl: getMemberAvatar('123230067'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'bdh-4',
        fullName: 'Nguyễn Văn Tùng Dương',
        position: 'Ban Điều hành',
        faculty: 'Khoa Điện',
        studentId: '105240182',
        avatarUrl: getMemberAvatar('105240182'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'bdh-5',
        fullName: 'Nguyễn Thị Quế Trân',
        position: 'Ban Điều hành',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102240134',
        avatarUrl: getMemberAvatar('102240134'),
        departmentName: 'Ban điều hành'
      }
    ]
  },
  {
    id: 'btv',
    num: '03',
    name: 'Ban thành viên',
    shortName: 'BTV',
    headline: 'Cộng đồng nòng cốt nghiên cứu, sáng tạo & phát triển giải pháp',
    description: 'Trực tiếp tham gia nghiên cứu kỹ thuật, triển khai ý tưởng khởi nghiệp, xây dựng sản phẩm mẫu và đồng hành trong các cuộc thi sáng tạo công nghệ.',
    members: [
      {
        id: 'btv-1',
        fullName: 'Nguyễn Hoàng Long',
        position: 'Ban Thành viên',
        faculty: 'Khoa Điện tử và Trí tuệ nhân tạo',
        studentId: '102250342',
        avatarUrl: getMemberAvatar('102250342'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-2',
        fullName: 'Lê Hồng Ngân',
        position: 'Ban Thành viên',
        faculty: 'Khoa Kiến trúc',
        studentId: '121240093',
        avatarUrl: getMemberAvatar('121240093'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-3',
        fullName: 'Nguyễn Tuấn Dũng',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102240156',
        avatarUrl: getMemberAvatar('102240156'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-4',
        fullName: 'Nguyễn Trọng Sang',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102240263',
        avatarUrl: getMemberAvatar('102240263'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-5',
        fullName: 'Trần Hoài Thương',
        position: 'Ban Thành viên',
        faculty: 'Khoa Điện',
        studentId: '105240277',
        avatarUrl: getMemberAvatar('105240277'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-6',
        fullName: 'Lê Thanh Hằng',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102240296',
        avatarUrl: getMemberAvatar('102240296'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-7',
        fullName: 'Nguyễn Quang Chiến',
        position: 'Ban Thành viên',
        faculty: 'Khoa Điện',
        studentId: '105240173',
        avatarUrl: getMemberAvatar('105240173'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-8',
        fullName: 'Huỳnh Phạm Hoàng My',
        position: 'Ban Thành viên',
        faculty: 'Khoa Quản lý Dự án',
        studentId: '118240081',
        avatarUrl: getMemberAvatar('118240081'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-9',
        fullName: 'Nguyễn Đăng Lê Hoàng',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102240308',
        avatarUrl: getMemberAvatar('102240308'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-10',
        fullName: 'Phạm Hưng Phát',
        position: 'Ban Thành viên',
        faculty: 'Khoa Xây dựng',
        studentId: '110250035',
        avatarUrl: getMemberAvatar('110250035'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-11',
        fullName: 'Trịnh Thị Hồng Hương',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '123260202',
        avatarUrl: getMemberAvatar('123260202'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-12',
        fullName: 'Nguyễn Thành Bảo',
        position: 'Ban Thành viên',
        faculty: 'Khoa Cơ khí',
        studentId: '101240005',
        avatarUrl: getMemberAvatar('101240005'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-13',
        fullName: 'Huỳnh Ngọc Thuỳ Dung',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102250216',
        avatarUrl: getMemberAvatar('102250216'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-14',
        fullName: 'Nguyễn Hương Giang',
        position: 'Ban Thành viên',
        faculty: 'Khoa Quản lý Dự án',
        studentId: '118260013',
        avatarUrl: getMemberAvatar('118260013'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-15',
        fullName: 'Đoàn Hoàng Thiên Phú',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102230313',
        avatarUrl: getMemberAvatar('102230313'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-16',
        fullName: 'Trần Đại Nhật Hải',
        position: 'Ban Thành viên',
        faculty: 'Khoa Cơ khí',
        studentId: '101250111',
        avatarUrl: getMemberAvatar('101250111'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-17',
        fullName: 'Trần Nguyên Bình',
        position: 'Ban Thành viên',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '123250056',
        avatarUrl: getMemberAvatar('123250056'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-18',
        fullName: 'Huỳnh Phước Phú',
        position: 'Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102230094',
        avatarUrl: getMemberAvatar('102230094'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-19',
        fullName: 'Huỳnh Gia Thiên',
        position: 'Ban Thành viên',
        faculty: 'Khoa Hóa, MT & KHSS',
        studentId: '107250108',
        avatarUrl: getMemberAvatar('107250108'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-20',
        fullName: 'Nguyễn Thái Minh Thông',
        position: 'Ban Thành viên',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '102250369',
        avatarUrl: getMemberAvatar('102250369'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-21',
        fullName: 'Nguyễn Thị Phương Hoà',
        position: 'Ban Thành viên',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '123250130',
        avatarUrl: getMemberAvatar('123250130'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'btv-22',
        fullName: 'Hồ Thị Mỹ Ly',
        position: 'Ban Thành viên',
        faculty: 'Khoa Điện',
        studentId: '105250318',
        avatarUrl: getMemberAvatar('105250318'),
        departmentName: 'Ban thành viên'
      }
    ]
  }
];

export const AboutMemberAlbumSection: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<'bcn' | 'bdh' | 'btv'>('bcn');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Real-time Avatar Registry (scanned automatically from /api/album/avatars)
  const [avatarRegistry, setAvatarRegistry] = useState<Record<string, string>>(KNOWN_AVATARS);

  // Lightbox Modal State
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
    meta?: string;
  }>({
    isOpen: false,
    src: '',
    alt: ''
  });

  // Automatically fetch newly uploaded member photos from /api/album/avatars
  React.useEffect(() => {
    let isMounted = true;

    const fetchLiveAvatars = async () => {
      try {
        const res = await fetch('/api/album/avatars');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.avatars && Object.keys(data.avatars).length > 0) {
            setAvatarRegistry((prev) => ({ ...prev, ...data.avatars }));
          }
        }
      } catch {
        // Fallback gracefully to pre-mapped KNOWN_AVATARS / DEFAULT_MEMBER_AVATAR
      }
    };

    fetchLiveAvatars();

    // Re-fetch automatically on window focus (e.g. user drags a new photo into public/imageAVT and clicks back to browser)
    const handleFocus = () => {
      fetchLiveAvatars();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getActiveAvatar = (studentId: string): string => {
    return (
      VITE_DETECTED_AVATARS[studentId] ||
      avatarRegistry[studentId] ||
      KNOWN_AVATARS[studentId] ||
      `/imageAVT/${studentId}.jpg`
    );
  };

  const totalMembersCount = ALBUM_DATA.reduce((acc, d) => acc + d.members.length, 0);
  const activeDept = ALBUM_DATA.find((d) => d.id === selectedDeptId) || ALBUM_DATA[0];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMembers = activeDept.members.filter((m) => {
    if (!normalizedQuery) return true;
    return (
      m.fullName.toLowerCase().includes(normalizedQuery) ||
      m.faculty.toLowerCase().includes(normalizedQuery) ||
      m.studentId.includes(normalizedQuery)
    );
  });

  const openMemberLightbox = (member: MemberItem) => {
    const activePhoto = getActiveAvatar(member.studentId);
    setLightboxData({
      isOpen: true,
      src: activePhoto,
      alt: member.fullName,
      title: member.fullName,
      subtitle: `${member.departmentName} • ${member.faculty}`,
      meta: `MSSV: ${member.studentId} • BK-IC GEN 1`
    });
  };

  return (
    <section id="album" className="relative scroll-mt-24 py-10 sm:py-14">
      {/* Top Archive Hero Banner (Modeled directly after DUT AI Archive) */}
      <div className="rounded-[32px] bg-gradient-to-r from-[#1749B5] via-[#2052D9] to-[#0D2E7C] p-7 sm:p-10 md:p-12 text-white relative overflow-hidden shadow-xl shadow-blue-950/15">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-white/15 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-radial from-[#6B9DFF]/20 to-transparent blur-3xl pointer-events-none" />

        {/* Top Right Book Icon matching reference UI */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white/80 backdrop-blur-md hover:bg-white/20 transition-colors">
            <BookOpen className="w-5 h-5 text-white/90" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="space-y-4 max-w-2xl">
            {/* Archive Header Tag */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-mono font-medium backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#93C5FD]" />
                <span>BK-IC CLUB • ARCHIVE</span>
              </span>
            </div>

            {/* Academic Year */}
            <span className="text-xs sm:text-sm font-mono tracking-widest text-[#93C5FD] uppercase block">
              2025 - 2026
            </span>

            {/* Giant Title */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
              GEN 1
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed max-w-xl">
              Một chương trong hành trình học hỏi, sáng tạo và trưởng thành cùng BK-IC.
            </p>
          </div>

          {/* Right Stat Chips */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 lg:mt-6">
            {/* Total Members */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center min-w-[110px] sm:min-w-[130px] space-y-1">
              <div className="flex justify-center mb-1">
                <Users className="h-5 w-5 text-[#93C5FD]" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                {totalMembersCount}
              </span>
              <span className="text-[11px] font-medium text-blue-200 block">
                Thành viên
              </span>
            </div>

            {/* Department Count */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center min-w-[110px] sm:min-w-[130px] space-y-1">
              <div className="flex justify-center mb-1">
                <Layers className="h-5 w-5 text-[#93C5FD]" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                3
              </span>
              <span className="text-[11px] font-medium text-blue-200 block">
                Phòng ban
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Area: Khám phá đội ngũ - Chọn phòng ban */}
      <div className="mt-10 sm:mt-12 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold font-mono tracking-widest text-[#1749B5] uppercase block mb-1">
              KHÁM PHÁ ĐỘI NGŨ
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#10182D]">
              Chọn phòng ban
            </h3>
          </div>

          {/* Search Input Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, khoa, MSSV..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1749B5]/20 focus:border-[#1749B5] transition"
            />
          </div>
        </div>

        {/* 3 Department Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {ALBUM_DATA.map((dept) => {
            const isSelected = dept.id === selectedDeptId;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDeptId(dept.id)}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#10182D] text-white shadow-md shadow-slate-900/10'
                    : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {/* Number Circle Badge */}
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                    isSelected
                      ? 'bg-[#1749B5] text-white'
                      : 'bg-blue-50 text-[#1749B5]'
                  }`}
                >
                  {dept.num}
                </span>

                {/* Dept Name */}
                <span>{dept.name}</span>

                {/* Member Count Badge */}
                <span className={`text-[11px] font-normal ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {dept.members.length} thành viên
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Department Content Showcase */}
      <div className="mt-8 space-y-6">
        {/* Department Title & Description Header */}
        <div className="space-y-1.5 pb-4 border-b border-slate-200/80">
          <span className="text-xs font-mono font-bold tracking-wider text-[#1749B5] uppercase">
            GEN 1 • {activeDept.shortName}
          </span>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-[#10182D]">
            {activeDept.name}
          </h4>
          {activeDept.headline && (
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              {activeDept.headline}
            </p>
          )}
          <p className="text-xs sm:text-sm text-[#475467] max-w-3xl leading-relaxed">
            {activeDept.description}
          </p>
        </div>

        {/* Vertical Member Cards Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group relative rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-3 sm:p-4 shadow-xs hover:border-[#1749B5] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top: Vertical Portrait Photograph Container */}
                <div
                  onClick={() => openMemberLightbox(member)}
                  className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 cursor-zoom-in group/img"
                  title="Bấm để xem ảnh chi tiết"
                >
                  <img
                    src={getActiveAvatar(member.studentId)}
                    alt={member.fullName}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.includes('default.jpg') && !img.src.includes('2aOboRDJDH6RgX8HEcRdWxaumJGo2n0EG1RnkbvU.jpg')) {
                        img.src = DEFAULT_MEMBER_AVATAR;
                      }
                    }}
                  />

                  {/* Hover Overlay with Action Pill */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-slate-900/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                      <ZoomIn className="h-3 w-3 text-[#93C5FD]" />
                      <span>Xem chi tiết</span>
                    </span>
                    <span className="text-[10px] font-mono text-white/90 bg-slate-900/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20">
                      {member.studentId}
                    </span>
                  </div>
                </div>

                {/* Bottom: Information Block in Vertical Flow */}
                <div className="mt-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-sm sm:text-base font-bold text-[#10182D] group-hover:text-[#1749B5] transition-colors leading-tight line-clamp-1">
                      {member.fullName}
                    </h5>
                    <span className="text-xs font-semibold text-[#1749B5] block mt-0.5 line-clamp-1">
                      {member.position}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-[#475467]">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1 text-[11px] sm:text-xs">{member.faculty}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-medium">
                      MSSV: {member.studentId}
                    </div>
                  </div>

                  {/* Card Bottom Tag */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>GEN 1</span>
                    </span>
                    <span className="font-mono">DUT • 2026</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center space-y-2">
            <Users className="h-8 w-8 text-slate-300 mx-auto" />
            <h5 className="text-sm font-bold text-slate-700">Không tìm thấy thành viên phù hợp</h5>
            <p className="text-xs text-slate-400">Thử tìm kiếm với từ khóa khác.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full Detail Image Inspection */}
      <ImageLightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        src={lightboxData.src}
        alt={lightboxData.alt}
        title={lightboxData.title}
        subtitle={lightboxData.subtitle}
        meta={lightboxData.meta}
      />
    </section>
  );
};
