// BK-IC Unit and Position Display Formatter
// Standardizes display representations:
// - "Ban Chủ nhiệm" / 'BN' -> "BCN"
// - "Ban Điều hành" / 'BDH' -> "BĐH"
// - "Ban Thành viên" / 'BTV' -> "BTV"

export function getUnitShortName(unitId?: string | null): string {
  if (!unitId) return 'BK-IC';
  const norm = unitId.toUpperCase().trim();
  if (norm === 'BN' || norm === 'BAN CHỦ NHIỆM' || norm === 'BAN CHU NHIEM' || norm === 'BCN') return 'BCN';
  if (norm === 'BDH' || norm === 'BAN ĐIỀU HÀNH' || norm === 'BAN DIEU HANH') return 'BĐH';
  if (norm === 'BTV' || norm === 'BAN THÀNH VIÊN' || norm === 'BAN THANH VIEN') return 'BTV';
  return unitId;
}

export function getUnitFullName(unitId?: string | null): string {
  if (!unitId) return 'Bách Khoa Innovation Club';
  const norm = unitId.toUpperCase().trim();
  if (norm === 'BN' || norm === 'BCN' || norm === 'BAN CHỦ NHIỆM' || norm === 'BAN CHU NHIEM') return 'Ban Chủ nhiệm (BCN)';
  if (norm === 'BDH' || norm === 'BAN ĐIỀU HÀNH' || norm === 'BAN DIEU HANH') return 'Ban Điều hành (BĐH)';
  if (norm === 'BTV' || norm === 'BAN THÀNH VIÊN' || norm === 'BAN THANH VIEN') return 'Ban Thành viên (BTV)';
  return unitId;
}

export function formatMemberPosition(position?: string | null, unitId?: string | null, role?: string | null): string {
  if (role === 'admin' || role === 'sysadmin') {
    return 'BCN (Admin)';
  }
  const uShort = getUnitShortName(unitId);
  if (!position) {
    if (role === 'leader') return `Trưởng ban ${uShort}`;
    return `Thành viên ${uShort}`;
  }
  // Replace occurrences of full names with standardized abbreviations
  return position
    .replace(/Ban Chủ nhiệm/g, 'BCN')
    .replace(/Ban chủ nhiệm/g, 'BCN')
    .replace(/Ban Điều hành/g, 'BĐH')
    .replace(/Ban điều hành/g, 'BĐH')
    .replace(/Ban Thành viên/g, 'BTV')
    .replace(/Ban thành viên/g, 'BTV');
}
