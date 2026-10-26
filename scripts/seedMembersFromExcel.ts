// Script to Seed Official Student Accounts from Personnel List into BK-IC Digital Hub
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../server/services/authSecurity.ts';
import { extractAcademicYear } from '../src/utils/academicYear.ts';
import { initFirestore } from '../server/services/firestoreSync.ts';
import type { User } from '../src/types/index.ts';
import type { DatabaseSchema } from '../server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface RawMemberInput {
  stt: number;
  fullName: string;
  studentId: string;
  classId: string;
  rawFaculty: string;
  phone: string;
  rawEmail: string;
  unit: 'BN' | 'BDH' | 'BTV';
  role: 'admin' | 'member';
  position: string;
}

const MEMBERS_DATA: RawMemberInput[] = [
  // 1-3: Ban Chủ nhiệm (BN)
  {
    stt: 1,
    fullName: 'Phạm Lê Tú',
    studentId: '105220278',
    classId: '22TDH1',
    rawFaculty: 'Điện',
    phone: '0948942592',
    rawEmail: 'phamletu80@gmail.com',
    unit: 'BN',
    role: 'admin',
    position: 'Chủ nhiệm CLB'
  },
  {
    stt: 2,
    fullName: 'Nguyễn Thiện Quốc',
    studentId: '123220065',
    classId: '22ES',
    rawFaculty: 'Điện',
    phone: '0795603557',
    rawEmail: 'quocnguyenthien2020@gmail.com',
    unit: 'BN',
    role: 'admin',
    position: 'Phó Chủ nhiệm CLB'
  },
  {
    stt: 3,
    fullName: 'Nguyễn Quỳnh Châu',
    studentId: '118230004',
    classId: '23QLCN1',
    rawFaculty: 'QLDA&CN',
    phone: '0913423377',
    rawEmail: 'quynhhchauu2005@gmail.com',
    unit: 'BN',
    role: 'admin',
    position: 'Phó Chủ nhiệm CLB'
  },

  // 4-8: Ban Điều hành (BDH)
  {
    stt: 4,
    fullName: 'Lê Anh Khoa',
    studentId: '105230195',
    classId: '23D4',
    rawFaculty: 'Điện',
    phone: '0985240515',
    rawEmail: 'leanhkhoa572005@gmail.com',
    unit: 'BDH',
    role: 'member',
    position: 'Thành viên Ban Điều hành'
  },
  {
    stt: 5,
    fullName: 'Nguyễn Đoàn Anh Thư',
    studentId: '106240046',
    classId: '24DT1',
    rawFaculty: 'ĐT&TTNT',
    phone: '0986245497',
    rawEmail: 'nguyendoananhthucpvm@gmail.com',
    unit: 'BDH',
    role: 'member',
    position: 'Thành viên Ban Điều hành'
  },
  {
    stt: 6,
    fullName: 'Nguyễn Thị Thục Trang',
    studentId: '121240105',
    classId: '24KT2',
    rawFaculty: 'Kiến trúc',
    phone: '0359477790',
    rawEmail: 'thuctrangltk@gmail.com',
    unit: 'BDH',
    role: 'member',
    position: 'Thành viên Ban Điều hành'
  },
  {
    stt: 7,
    fullName: 'Nguyễn Văn Tùng Dương',
    studentId: '101250260',
    classId: '25CDT1',
    rawFaculty: 'Cơ Khí',
    phone: '0905803999',
    rawEmail: 'duongnvt2411@gmail.com',
    unit: 'BDH',
    role: 'member',
    position: 'Thành viên Ban Điều hành'
  },
  {
    stt: 8,
    fullName: 'Nguyễn Thị Quế Trân',
    studentId: '118250119',
    classId: '25QLCN2',
    rawFaculty: ' QLDA&CN',
    phone: '0396499992',
    rawEmail: 'nguyenthiquetrankupe@gmail.com',
    unit: 'BDH',
    role: 'member',
    position: 'Thành viên Ban Điều hành'
  },

  // 9-30: Ban Thành viên (BTV)
  {
    stt: 9,
    fullName: 'Nguyễn Hoàng Long',
    studentId: '102250342',
    classId: '25T_KHDL',
    rawFaculty: 'Khoa Điện tử và Trí tuệ nhân tạo',
    phone: '0945667379',
    rawEmail: 'hoanglong280907@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 10,
    fullName: 'Nguyễn Tuấn Dũng',
    studentId: '106220169',
    classId: '22DT5',
    rawFaculty: 'ĐT&TTNT',
    phone: '0941569117',
    rawEmail: 'Nguyentuandung2608@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 11,
    fullName: 'Nguyễn Trọng Sang',
    studentId: '118240268',
    classId: '24QLCN3',
    rawFaculty: ' QLDA&CN',
    phone: '0948070914',
    rawEmail: 'sn195206@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 12,
    fullName: 'Trần Hoài Thương',
    studentId: '101230361',
    classId: '23CDT2',
    rawFaculty: 'Cơ Khí',
    phone: '0947122310',
    rawEmail: 'tranhoaithuong2310@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 13,
    fullName: 'Lê Thanh Hằng',
    studentId: '101260318',
    classId: '26CDT3',
    rawFaculty: 'Cơ Khí',
    phone: '0365620249',
    rawEmail: 'annhien25043001@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 14,
    fullName: 'Nguyễn Quang Chiến',
    studentId: '102250213',
    classId: '25T_Nhat1',
    rawFaculty: 'Công nghệ thông tin',
    phone: '0934989320',
    rawEmail: 'nguyenquanhchienpp2303@gmail.comnguy',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 15,
    fullName: 'Huỳnh Phạm Hoàng My',
    studentId: '105250318',
    classId: '25TDH1',
    rawFaculty: 'Điện',
    phone: '0779454467',
    rawEmail: 'huynhhoangmy1110@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 16,
    fullName: 'Nguyễn Đăng Lê Hoàng',
    studentId: '102240308',
    classId: '24T_Nhat1',
    rawFaculty: 'Công nghệ thông tin',
    phone: '0852237258',
    rawEmail: 'ndlhoangndl@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 17,
    fullName: 'Phạm Hưng Phát',
    studentId: '110250035',
    classId: '25X1A',
    rawFaculty: 'Xây dựng',
    phone: '0962457557',
    rawEmail: 'phamhungphat2727@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 18,
    fullName: 'Trịnh Thị Hồng Hương',
    studentId: '123260202',
    classId: '26PFIEV3',
    rawFaculty: 'Công nghệ thông tin',
    phone: '0397316554',
    rawEmail: 'trinhkay299@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 19,
    fullName: 'Nguyễn Thành Bảo',
    studentId: '101240005',
    classId: '24C1A',
    rawFaculty: 'Cơ Khí',
    phone: '0886344310',
    rawEmail: 'baovuitinh1234@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 20,
    fullName: 'Huỳnh Ngọc Thuỳ Dung',
    studentId: '102250216',
    classId: '25T_Nhat1',
    rawFaculty: 'Công nghệ thông tin',
    phone: '0935718083',
    rawEmail: 'huynhngocthuydungdng@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 21,
    fullName: 'Nguyễn Hương Giang',
    studentId: '118260013',
    classId: '26KX1',
    rawFaculty: ' QLDA&CN',
    phone: '0382127016',
    rawEmail: 'giangkelly2008@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 22,
    fullName: 'Đoàn Hoàng Thiên Phú',
    studentId: '102230313',
    classId: '23T_DT3',
    rawFaculty: 'Công nghệ thông tin',
    phone: '0385544194',
    rawEmail: 'dhtphu05@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 23,
    fullName: 'Trần Đại Nhật Hải',
    studentId: '101250111',
    classId: '25C1C',
    rawFaculty: 'Cơ Khí',
    phone: '0374889959',
    rawEmail: 'tdnh1492006@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 24,
    fullName: 'Trần Nguyên Bình',
    studentId: '123250056',
    classId: '25ECE',
    rawFaculty: 'ĐT&TTNT',
    phone: '0896219699',
    rawEmail: 'trannguyenbinh14@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 25,
    fullName: 'Lê Hồng Ngân',
    studentId: '105250375',
    classId: '25TDH2',
    rawFaculty: 'Điện',
    phone: '0347376857',
    rawEmail: 'lehongngan.tk1@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 26,
    fullName: 'Huỳnh Phước Phú',
    studentId: '102230094',
    classId: '23T_Nhat2',
    rawFaculty: 'Công nghệ thông tin',
    phone: '077454677',
    rawEmail: 'phuh15521@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 27,
    fullName: 'Huỳnh Gia Thiên',
    studentId: '107250108',
    classId: '25SHYD',
    rawFaculty: 'Hóa, Môi trường & KHSS',
    phone: '0389029576',
    rawEmail: 'huynthien665@gmail.comcom',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 28,
    fullName: 'Nguyễn Thái Minh Thông',
    studentId: '102250369',
    classId: '25T_KHDL',
    rawFaculty: 'ĐT&TTNT',
    phone: '0935088615',
    rawEmail: 'thongbin26@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 29,
    fullName: 'Nguyễn Thị Phương Hoà',
    studentId: '123250015',
    classId: '25ES',
    rawFaculty: 'Điện',
    phone: '0384224148',
    rawEmail: 'phoa49900@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  },
  {
    stt: 30,
    fullName: 'Hồ Thị Mỹ Ly',
    studentId: '118230121',
    classId: '23QLCN3',
    rawFaculty: 'QLDA&CN',
    phone: '0774473001',
    rawEmail: 'hothimyly26@gmail.com',
    unit: 'BTV',
    role: 'member',
    position: 'Thành viên Ban Thành viên'
  }
];

function normalizeFaculty(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === 'Điện') return 'Khoa Điện';
  if (trimmed === 'QLDA&CN' || trimmed === ' QLDA&CN') return 'Khoa Quản lý Dự án';
  if (trimmed === 'ĐT&TTNT') return 'Khoa Điện tử - Viễn thông';
  if (trimmed === 'Kiến trúc') return 'Khoa Kiến trúc';
  if (trimmed === 'Cơ Khí') return 'Khoa Cơ khí';
  if (trimmed === 'Công nghệ thông tin') return 'Khoa Công nghệ Thông tin';
  if (trimmed === 'Xây dựng') return 'Khoa Xây dựng';
  if (trimmed === 'Hóa, Môi trường & KHSS') return 'Khoa Hóa, Môi trường & KHSS';
  if (trimmed.startsWith('Khoa ')) return trimmed;
  return `Khoa ${trimmed}`;
}

function cleanEmail(raw: string): string {
  let email = raw.trim().toLowerCase();
  // Fix typos found in raw sheet
  if (email.endsWith('gmail.comnguy')) {
    email = email.replace(/gmail\.comnguy$/, 'gmail.com');
  }
  if (email.endsWith('gmail.comcom')) {
    email = email.replace(/gmail\.comcom$/, 'gmail.com');
  }
  return email;
}

const DEFAULT_PASSWORD = 'Bkic@2026';

async function main() {
  console.log('--- KHỞI TẠO TÀI KHOẢN SINH VIÊN CLB BK-IC TỪ DANH SÁCH NHÂN SỰ ---');

  if (!fs.existsSync(DB_FILE)) {
    console.error(`Không tìm thấy file ${DB_FILE}`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(DB_FILE, 'utf-8');
  const dbData: DatabaseSchema = JSON.parse(rawJson);

  // Preserve admin account
  const masterAdmin = dbData.users.find(u => u.id === 'usr-admin' || u.email === 'admin.bkic@dut.udn.vn');
  if (!masterAdmin) {
    console.error('Không tìm thấy tài khoản Master Admin usr-admin!');
    process.exit(1);
  }

  // Pre-generate password hash & salt for default password
  console.log(`Mật khẩu mặc định cấp cho tất cả tài khoản: "${DEFAULT_PASSWORD}"`);
  const { hash: defaultHash, salt: defaultSalt } = hashPassword(DEFAULT_PASSWORD);

  // Process 30 members
  const processedUsers: User[] = [masterAdmin];
  const nowIso = new Date().toISOString();
  const todayYmd = '2026-10-26';

  for (let i = 0; i < MEMBERS_DATA.length; i++) {
    const raw = MEMBERS_DATA[i];
    const email = cleanEmail(raw.rawEmail);
    const faculty = raw.fullName === 'Nguyễn Hoàng Long'
      ? 'Khoa Điện tử và Trí tuệ nhân tạo'
      : normalizeFaculty(raw.rawFaculty);
    const cohort = extractAcademicYear(raw.classId, '24');
    const memberId = `BKIC-${raw.unit}-${raw.studentId}`;

    // Check if user already exists
    const existing = dbData.users.find(u => u.studentId === raw.studentId || u.email === email);
    const userId = existing ? existing.id : `usr-${Date.now() + i + 100}`;

    const user: User = {
      id: userId,
      memberId,
      email,
      fullName: raw.fullName.trim(),
      studentId: raw.studentId.trim(),
      phone: raw.phone.trim(),
      faculty,
      classId: raw.classId.trim(),
      academicYear: cohort,
      role: raw.role,
      unit: raw.unit,
      committee: raw.unit,
      position: raw.position,
      joinDate: existing?.joinDate || todayYmd,
      status: 'active',
      statusEffectiveDate: todayYmd,
      accountStatus: 'active',
      emailVerified: true,
      createdAt: existing?.createdAt || nowIso,
      passwordHash: existing?.passwordHash || defaultHash,
      passwordSalt: existing?.passwordSalt || defaultSalt,
      mustChangePassword: false,
      isRecoverySession: false,
      lastLoginAt: existing?.lastLoginAt,
      statusHistory: existing?.statusHistory && existing.statusHistory.length > 0
        ? existing.statusHistory
        : [
            {
              id: `sh-${raw.studentId}`,
              previousStatus: 'active',
              newStatus: 'active',
              effectiveDate: todayYmd,
              reason: 'Khởi tạo tài khoản và kích hoạt chính thức',
              approvedBy: 'Quản trị viên Hệ thống (Admin)',
              updatedBy: 'Quản trị viên Hệ thống (Admin)',
              timestamp: nowIso
            }
          ]
    };

    // Clean undefined fields so Firestore document serializer does not complain
    const sanitizedUser: User = JSON.parse(JSON.stringify(user));
    processedUsers.push(sanitizedUser);
    console.log(`[STT ${String(raw.stt).padStart(2, '0')}] ${raw.unit.padEnd(3)} | ${raw.role.padEnd(6)} | ${memberId} | ${user.fullName.padEnd(24)} | ${user.email}`);
  }

  // Update units leaders
  if (dbData.units) {
    for (const unit of dbData.units) {
      if (unit.id === 'BN') unit.leaderName = 'Phạm Lê Tú';
      if (unit.id === 'BDH') unit.leaderName = 'Lê Anh Khoa';
      if (unit.id === 'BTV') unit.leaderName = 'Nguyễn Hoàng Long';
    }
  }

  // Assign updated users list
  dbData.users = processedUsers;

  // Save to local data/db.json
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  console.log(`\n✓ Đã cập nhật thành công ${processedUsers.length} tài khoản (1 Master Admin + 30 Thành viên) vào file ${DB_FILE}`);

  // Push to Cloud Firestore
  console.log('\n--- ĐỒNG BỘ DỮ LIỆU LÊN GOOGLE CLOUD FIRESTORE ---');
  const firestore = initFirestore();
  if (firestore) {
    const colRef = firestore.collection('bkic_data');
    const batch = firestore.batch();

    // Sync all sections
    const keys = Object.keys(dbData) as (keyof DatabaseSchema)[];
    for (const key of keys) {
      const docRef = colRef.doc(String(key));
      batch.set(docRef, {
        items: dbData[key],
        updatedAt: new Date().toISOString()
      });
    }

    // Also mirror to root 'users' collection
    for (const u of processedUsers) {
      const userRef = firestore.collection('users').doc(u.id);
      batch.set(userRef, JSON.parse(JSON.stringify(u)));
    }

    await batch.commit();
    console.log(`✓ Đã đồng bộ toàn bộ ${keys.length} phân vùng dữ liệu và ${processedUsers.length} hồ sơ người dùng lên Cloud Firestore thành công!`);

    // Verify Firestore users
    const verifyDoc = await colRef.doc('users').get();
    if (verifyDoc.exists) {
      const savedCount = verifyDoc.data()?.items?.length;
      console.log(`✓ Xác thực Firestore: Đã lưu trữ ${savedCount} tài khoản.`);
    }
  } else {
    console.warn('⚠ Không thể kết nối tới Cloud Firestore. Vui lòng kiểm tra file cấu hình credentials.');
  }

  console.log('\n=== HOÀN TẤT KHỞI TẠO VÀ KÍCH HOẠT TÀI KHOẢN ===');
}

main().catch(err => {
  console.error('Lỗi khi thực thi seed:', err);
  process.exit(1);
});
