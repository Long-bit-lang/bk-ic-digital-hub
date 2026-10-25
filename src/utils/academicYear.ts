/**
 * Utility functions for extracting and formatting academic cohort (Khóa)
 * based on Class ID (Lớp sinh hoạt) at Trường ĐH Bách khoa - ĐH Đà Nẵng (DUT).
 *
 * Examples:
 * - 25T_KHDL -> "25" (Khóa 25)
 * - 22TDH1   -> "22" (Khóa 22)
 * - 24T_CLC  -> "24" (Khóa 24)
 * - K25_DT1  -> "25" (Khóa 25)
 */

export function extractAcademicYear(classId?: string, fallback: string = '24'): string {
  if (!classId) return fallback;
  const trimmed = classId.trim();
  // Match standard DUT class naming format starting with 2 digits or K followed by 2 digits
  const match = trimmed.match(/^(?:k|khóa\s*)?(\d{2})/i) || trimmed.match(/\b(\d{2})[A-Za-z_]/);
  if (match) {
    return match[1];
  }
  return fallback;
}

export function formatAcademicYearDisplay(
  academicYear?: string,
  classId?: string,
  role?: string
): string {
  if (role === 'admin') {
    return 'Ban Quản trị';
  }

  // 1. If academicYear is already a 2-digit cohort number (e.g., "25", "22", "24")
  if (academicYear && /^\d{2}$/.test(academicYear.trim())) {
    return `Khóa ${academicYear.trim()}`;
  }

  // 2. If academicYear contains "K25", "Khóa 25", "K24 (2024-2029)"
  const matchCohort = academicYear ? academicYear.match(/(?:k|khóa\s*)?(\d{2})/i) : null;
  if (matchCohort && matchCohort[1]) {
    return `Khóa ${matchCohort[1]}`;
  }

  // 3. Extract automatically from classId (e.g. 25T_KHDL -> Khóa 25)
  const fromClass = extractAcademicYear(classId);
  return `Khóa ${fromClass}`;
}
