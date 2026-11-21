// BK-IC About Page — Member Album / Archive Section (GEN 1)
// Synchronized directly with Official Personnel / Member Management Records
// Modeled after the DUT AI Club Archive interface with vertical portrait cards and Lightbox inspection
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

export const DEFAULT_MEMBER_AVATAR = '/imageAVT/default.jpg';
export const AVATAR_VERSION = 'v=20261120c';

// Registered individual photos in public/imageAVT named by MSSV
export const KNOWN_AVATARS: Record<string, string> = {
  // BCN
  '105220278': '/imageAVT/105220278.jpg', // Phạm Lê Tú (Chủ nhiệm CLB)
  '123220065': '/imageAVT/123220065.jpg', // Nguyễn Thiện Quốc (Phó Chủ nhiệm CLB)
  '118230004': '/imageAVT/118230004.jpg', // Nguyễn Quỳnh Châu (Phó Chủ nhiệm CLB)
  // BDH
  '105230195': '/imageAVT/105230195.jpg', // Lê Anh Khoa
  '106240046': '/imageAVT/106240046.jpg', // Nguyễn Đoàn Anh Thư
  '123230067': '/imageAVT/106240046.jpg', // Nguyễn Đoàn Anh Thư fallback
  '121240105': '/imageAVT/121240105.jpg', // Nguyễn Thị Thục Trang
  '101250260': '/imageAVT/101250260.jpg', // Nguyễn Văn Tùng Dương
  '105240182': '/imageAVT/101250260.jpg', // Nguyễn Văn Tùng Dương fallback
  '118250119': '/imageAVT/118250119.jpg', // Nguyễn Thị Quế Trân
  '102240134': '/imageAVT/118250119.jpg', // Nguyễn Thị Quế Trân fallback
  // BTV
  '105250375': '/imageAVT/105250375.jpg', // Lê Hồng Ngân
  '121240093': '/imageAVT/105250375.jpg', // Lê Hồng Ngân fallback
  '102250342': '/imageAVT/102250342.jpg', // Nguyễn Hoàng Long
  '106220169': '/imageAVT/106220169.jpg', // Nguyễn Tuấn Dũng
  '118240268': '/imageAVT/118240268.jpg', // Nguyễn Trọng Sang
  '102240263': '/imageAVT/118240268.jpg', // Nguyễn Trọng Sang fallback
  '102240308': '/imageAVT/102240308.jpg', // Nguyễn Đăng Lê Hoàng
  '110250035': '/imageAVT/110250035.jpg', // Phạm Hưng Phát
  '101240005': '/imageAVT/101240005.jpg', // Nguyễn Thành Bảo
  '102250216': '/imageAVT/102250216.jpg', // Huỳnh Ngọc Thuỳ Dung
  '101250111': '/imageAVT/101250111.jpg', // Trần Đại Nhật Hải
  '123250056': '/imageAVT/123250056.jpg', // Trần Nguyên Bình
  '102230094': '/imageAVT/102230094.jpg', // Huỳnh Phước Phú
  '107250108': '/imageAVT/107250108.jpg', // Huỳnh Gia Thiên
  '102250369': '/imageAVT/102250369.jpg', // Nguyễn Thái Minh Thông
  '118230121': '/imageAVT/118230121.jpg'  // Hồ Thị Mỹ Ly
};

export const getMemberAvatar = (studentId: string): string => {
  const path = KNOWN_AVATARS[studentId] || DEFAULT_MEMBER_AVATAR;
  return `${path}?${AVATAR_VERSION}`;
};

export interface MemberItem {
  id: string;
  fullName: string;
  position: string;
  faculty: string;
  studentId: string;
  classId?: string;
  memberId?: string;
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

// 30 Verified Authentic GEN 1 Members from Management System (Admin excluded)
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
        id: 'usr-1792983281484',
        fullName: 'Phạm Lê Tú',
        position: 'Chủ nhiệm CLB',
        faculty: 'Khoa Điện',
        studentId: '105220278',
        classId: '22TDH1',
        memberId: 'BKIC-BN-105220278',
        avatarUrl: getMemberAvatar('105220278'),
        departmentName: 'Ban chủ nhiệm'
      },
      {
        id: 'usr-1792983281486',
        fullName: 'Nguyễn Thiện Quốc',
        position: 'Phó Chủ nhiệm CLB',
        faculty: 'Khoa Điện',
        studentId: '123220065',
        classId: '22ES',
        memberId: 'BKIC-BN-123220065',
        avatarUrl: getMemberAvatar('123220065'),
        departmentName: 'Ban chủ nhiệm'
      },
      {
        id: 'usr-1792983281487',
        fullName: 'Nguyễn Quỳnh Châu',
        position: 'Phó Chủ nhiệm CLB',
        faculty: 'Khoa Quản lý Dự án và Công nghiệp',
        studentId: '118230004',
        classId: '23QLCN1',
        memberId: 'BKIC-BN-118230004',
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
        id: 'usr-1792983281488',
        fullName: 'Lê Anh Khoa',
        position: 'Thành viên Ban Điều hành',
        faculty: 'Khoa Điện',
        studentId: '105230195',
        classId: '23D4',
        memberId: 'BKIC-BDH-105230195',
        avatarUrl: getMemberAvatar('105230195'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'usr-1792983281489',
        fullName: 'Nguyễn Đoàn Anh Thư',
        position: 'Thành viên Ban Điều hành',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '106240046',
        classId: '24DT1',
        memberId: 'BKIC-BDH-106240046',
        avatarUrl: getMemberAvatar('106240046'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'usr-1792983281490',
        fullName: 'Nguyễn Thị Thục Trang',
        position: 'Thành viên Ban Điều hành',
        faculty: 'Khoa Kiến trúc',
        studentId: '121240105',
        classId: '24KT2',
        memberId: 'BKIC-BDH-121240105',
        avatarUrl: getMemberAvatar('121240105'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'usr-1792983281491',
        fullName: 'Nguyễn Văn Tùng Dương',
        position: 'Thành viên Ban Điều hành',
        faculty: 'Khoa Cơ khí',
        studentId: '101250260',
        classId: '25CDT1',
        memberId: 'BKIC-BDH-101250260',
        avatarUrl: getMemberAvatar('101250260'),
        departmentName: 'Ban điều hành'
      },
      {
        id: 'usr-1792983281492',
        fullName: 'Nguyễn Thị Quế Trân',
        position: 'Thành viên Ban Điều hành',
        faculty: 'Khoa Quản lý Dự án',
        studentId: '118250119',
        classId: '25QLCN2',
        memberId: 'BKIC-BDH-118250119',
        avatarUrl: getMemberAvatar('118250119'),
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
        id: 'usr-1792983281510',
        fullName: 'Lê Hồng Ngân',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Điện',
        studentId: '105250375',
        classId: '25TDH2',
        memberId: 'BKIC-BTV-105250375',
        avatarUrl: getMemberAvatar('105250375'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792903694464',
        fullName: 'Nguyễn Hoàng Long',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Điện tử và Trí tuệ nhân tạo',
        studentId: '102250342',
        classId: '25T_KHDL',
        memberId: 'BKIC-BTV-102250342',
        avatarUrl: getMemberAvatar('102250342'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281494',
        fullName: 'Nguyễn Tuấn Dũng',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '106220169',
        classId: '22DT5',
        memberId: 'BKIC-BTV-106220169',
        avatarUrl: getMemberAvatar('106220169'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281495',
        fullName: 'Nguyễn Trọng Sang',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Quản lý Dự án',
        studentId: '118240268',
        classId: '24QLCN3',
        memberId: 'BKIC-BTV-118240268',
        avatarUrl: getMemberAvatar('118240268'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281496',
        fullName: 'Trần Hoài Thương',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Cơ khí',
        studentId: '101230361',
        classId: '23CDT2',
        memberId: 'BKIC-BTV-101230361',
        avatarUrl: getMemberAvatar('101230361'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281497',
        fullName: 'Lê Thanh Hằng',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Cơ khí',
        studentId: '101260318',
        classId: '26CDT3',
        memberId: 'BKIC-BTV-101260318',
        avatarUrl: getMemberAvatar('101260318'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281498',
        fullName: 'Nguyễn Quang Chiến',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102250213',
        classId: '25T_Nhat1',
        memberId: 'BKIC-BTV-102250213',
        avatarUrl: getMemberAvatar('102250213'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281500',
        fullName: 'Huỳnh Phạm Hoàng My',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Điện',
        studentId: '105250318',
        classId: '25TDH1',
        memberId: 'BKIC-BTV-105250318',
        avatarUrl: getMemberAvatar('105250318'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281501',
        fullName: 'Nguyễn Đăng Lê Hoàng',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102240308',
        classId: '24T_Nhat1',
        memberId: 'BKIC-BTV-102240308',
        avatarUrl: getMemberAvatar('102240308'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281502',
        fullName: 'Phạm Hưng Phát',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Xây dựng',
        studentId: '110250035',
        classId: '25X1A',
        memberId: 'BKIC-BTV-110250035',
        avatarUrl: getMemberAvatar('110250035'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281503',
        fullName: 'Trịnh Thị Hồng Hương',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '123260202',
        classId: '26PFIEV3',
        memberId: 'BKIC-BTV-123260202',
        avatarUrl: getMemberAvatar('123260202'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281504',
        fullName: 'Nguyễn Thành Bảo',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Cơ khí',
        studentId: '101240005',
        classId: '24C1A',
        memberId: 'BKIC-BTV-101240005',
        avatarUrl: getMemberAvatar('101240005'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281505',
        fullName: 'Huỳnh Ngọc Thuỳ Dung',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102250216',
        classId: '25T_Nhat1',
        memberId: 'BKIC-BTV-102250216',
        avatarUrl: getMemberAvatar('102250216'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281506',
        fullName: 'Nguyễn Hương Giang',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Quản lý Dự án',
        studentId: '118260013',
        classId: '26KX1',
        memberId: 'BKIC-BTV-118260013',
        avatarUrl: getMemberAvatar('118260013'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281507',
        fullName: 'Đoàn Hoàng Thiên Phú',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102230313',
        classId: '23T_DT3',
        memberId: 'BKIC-BTV-102230313',
        avatarUrl: getMemberAvatar('102230313'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281508',
        fullName: 'Trần Đại Nhật Hải',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Cơ khí',
        studentId: '101250111',
        classId: '25C1C',
        memberId: 'BKIC-BTV-101250111',
        avatarUrl: getMemberAvatar('101250111'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281509',
        fullName: 'Trần Nguyên Bình',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '123250056',
        classId: '25ECE',
        memberId: 'BKIC-BTV-123250056',
        avatarUrl: getMemberAvatar('123250056'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281511',
        fullName: 'Huỳnh Phước Phú',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Công nghệ Thông tin',
        studentId: '102230094',
        classId: '23T_Nhat2',
        memberId: 'BKIC-BTV-102230094',
        avatarUrl: getMemberAvatar('102230094'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281512',
        fullName: 'Huỳnh Gia Thiên',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Hóa, Môi trường & KHSS',
        studentId: '107250108',
        classId: '25SHYD',
        memberId: 'BKIC-BTV-107250108',
        avatarUrl: getMemberAvatar('107250108'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281513',
        fullName: 'Nguyễn Thái Minh Thông',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Điện tử - Viễn thông',
        studentId: '102250369',
        classId: '25T_KHDL',
        memberId: 'BKIC-BTV-102250369',
        avatarUrl: getMemberAvatar('102250369'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281514',
        fullName: 'Nguyễn Thị Phương Hoà',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Điện',
        studentId: '123250015',
        classId: '25ES',
        memberId: 'BKIC-BTV-123250015',
        avatarUrl: getMemberAvatar('123250015'),
        departmentName: 'Ban thành viên'
      },
      {
        id: 'usr-1792983281515',
        fullName: 'Hồ Thị Mỹ Ly',
        position: 'Thành viên Ban Thành viên',
        faculty: 'Khoa Quản lý Dự án',
        studentId: '118230121',
        classId: '23QLCN3',
        memberId: 'BKIC-BTV-118230121',
        avatarUrl: getMemberAvatar('118230121'),
        departmentName: 'Ban thành viên'
      }
    ]
  }
];

export const AboutMemberAlbumSection: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState<'bcn' | 'bdh' | 'btv'>('bcn');
  const [searchQuery, setSearchQuery] = useState('');
  const [albumData, setAlbumData] = useState<DepartmentGroup[]>(ALBUM_DATA);

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

  // Automatically fetch newly uploaded member photos & synchronized member profiles from server
  useEffect(() => {
    let isMounted = true;

    const fetchLiveAlbumData = async () => {
      try {
        const [membersRes, avatarsRes] = await Promise.all([
          fetch('/api/public/album-members').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/album/avatars').then(r => r.ok ? r.json() : null).catch(() => null)
        ]);

        if (!isMounted) return;

        if (avatarsRes?.success && avatarsRes?.avatars) {
          setAvatarRegistry((prev) => ({ ...prev, ...avatarsRes.avatars }));
        }

        if (membersRes?.success && Array.isArray(membersRes?.members) && membersRes.members.length > 0) {
          const apiMembers: any[] = membersRes.members;
          setAlbumData((prev) =>
            prev.map((dept) => {
              const unitKey = dept.id === 'bcn' ? 'BN' : dept.id === 'bdh' ? 'BDH' : 'BTV';
              const deptMembers = apiMembers.filter((m) => m.unit === unitKey);
              if (deptMembers.length === 0) return dept;
              return {
                ...dept,
                members: deptMembers.map((m) => ({
                  id: m.id,
                  fullName: m.fullName,
                  position: m.position,
                  faculty: m.faculty,
                  studentId: m.studentId,
                  classId: m.classId,
                  memberId: m.memberId,
                  avatarUrl: `/imageAVT/${m.studentId}.jpg`,
                  departmentName: dept.name
                }))
              };
            })
          );
        }
      } catch {
        // Fallback gracefully to pre-mapped ALBUM_DATA
      }
    };

    fetchLiveAlbumData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getActiveAvatar = useCallback((studentId: string): string => {
    const raw = (
      avatarRegistry[studentId] ||
      KNOWN_AVATARS[studentId] ||
      DEFAULT_MEMBER_AVATAR
    );
    return raw.includes('?') ? raw : `${raw}?${AVATAR_VERSION}`;
  }, [avatarRegistry]);

  const totalMembersCount = albumData.reduce((acc, d) => acc + d.members.length, 0);
  const activeDept = albumData.find((d) => d.id === selectedDeptId) || albumData[0];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMembers = useMemo(() => {
    if (!normalizedQuery) return activeDept.members;
    return activeDept.members.filter((m) =>
      m.fullName.toLowerCase().includes(normalizedQuery) ||
      m.faculty.toLowerCase().includes(normalizedQuery) ||
      m.studentId.toLowerCase().includes(normalizedQuery) ||
      (m.memberId && m.memberId.toLowerCase().includes(normalizedQuery)) ||
      (m.classId && m.classId.toLowerCase().includes(normalizedQuery)) ||
      m.position.toLowerCase().includes(normalizedQuery)
    );
  }, [activeDept, normalizedQuery]);

  const openMemberLightbox = useCallback((member: MemberItem) => {
    const activePhoto = getActiveAvatar(member.studentId);
    setLightboxData({
      isOpen: true,
      src: activePhoto,
      alt: member.fullName,
      title: member.fullName,
      subtitle: `${member.departmentName} • ${member.position}`,
      meta: `MSSV: ${member.studentId}${member.classId ? ` • Lớp: ${member.classId}` : ''} • ${member.faculty}${member.memberId ? ` • Mã TV: ${member.memberId}` : ''} • BK-IC GEN 1`
    });
  }, [getActiveAvatar]);

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

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold tracking-wide text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span className="uppercase font-mono text-[11px]">KHO LƯU TRỮ THÀNH VIÊN • GEN 1 ARCHIVE</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Tập thể Thành viên BK-IC
            </h3>
            <p className="text-slate-200 text-xs sm:text-base leading-relaxed max-w-2xl font-normal">
              Ghi dấu hành trình cống hiến, tài năng và ngọn lửa đam mê sáng tạo của thế hệ thành viên sáng lập (GEN 1) – những mảnh ghép tạo nên bản sắc Bách Khoa Innovation Club.
            </p>
          </div>

          {/* Compact Stat Badge Pill Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center min-w-[110px] sm:min-w-[130px] space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                {totalMembersCount}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                Thành viên GEN 1
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center min-w-[110px] sm:min-w-[130px] space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                03
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                Ban Hoạt động
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center min-w-[110px] sm:min-w-[130px] space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                GEN 1
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                Khóa Sáng lập 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Navigation Toolbar */}
      <div className="mt-8 sm:mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        {/* Search Input Bar with Icon */}
        <div className="w-full md:max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, khoa, lớp, MSSV, mã TV..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1749B5]/20 focus:border-[#1749B5] transition"
            />
          </div>
        </div>

        {/* 3 Department Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {albumData.map((dept) => {
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1749B5] uppercase tracking-wider font-mono">
              <Layers className="h-3.5 w-3.5" />
              <span>{activeDept.num} • {activeDept.name}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-[#10182D] tracking-tight">
              {activeDept.headline}
            </h4>
            <p className="text-xs sm:text-sm text-[#475467] leading-relaxed max-w-3xl">
              {activeDept.description}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-xs font-mono font-bold text-[#1749B5] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
              GEN 1 • {activeDept.shortName} ({activeDept.members.length})
            </span>
          </div>
        </div>

        {/* Member Grid — Modern 4-column cards with vertical portrait photos */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                style={{ contentVisibility: 'auto', containIntrinsicSize: '280px 420px' }}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-xs hover:border-[#1749B5] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
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
                    width={300}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.onerror = null;
                      if (!img.src.includes('default.jpg')) {
                        img.src = `${DEFAULT_MEMBER_AVATAR}?${AVATAR_VERSION}`;
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
                    <h5 className="text-sm sm:text-base font-bold text-[#10182D] group-hover:text-[#1749B5] transition-colors leading-tight line-clamp-1" title={member.fullName}>
                      {member.fullName}
                    </h5>
                    <span className="text-xs font-semibold text-[#1749B5] block mt-0.5 line-clamp-1">
                      {member.position}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-[#475467]">
                    {/* Khoa */}
                    <div className="flex items-center gap-1.5" title={`Khoa: ${member.faculty}`}>
                      <GraduationCap className="h-3.5 w-3.5 text-[#1749B5] shrink-0" />
                      <span className="line-clamp-1 text-[11px] sm:text-xs font-medium text-slate-700">{member.faculty}</span>
                    </div>

                    {/* Mã số sinh viên & Lớp */}
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-slate-400 font-medium">MSSV:</span>
                        <span className="font-semibold text-slate-800">{member.studentId}</span>
                      </div>
                      {member.classId && (
                        <span className="font-mono text-slate-600 bg-slate-100/90 border border-slate-200/60 px-1.5 py-0.5 rounded text-[10px]" title="Lớp sinh hoạt">
                          {member.classId}
                        </span>
                      )}
                    </div>

                    {/* Mã số thành viên */}
                    {member.memberId && (
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                        <span>Mã TV:</span>
                        <span className="text-slate-600 font-medium">{member.memberId}</span>
                      </div>
                    )}
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
