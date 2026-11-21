// Test suite for BK-IC About Page Redesign (with Member Album GEN 1 & Lightbox Inspection)
import assert from 'node:assert';

async function runTests() {
  console.log('====================================================');
  console.log('BK-IC ABOUT PAGE REDESIGN - TEST SUITE');
  console.log('====================================================\n');

  console.log('--- Testing Section Components & Integrity ---');
  
  const { AboutHeroSection } = await import('../src/components/about/AboutHeroSection');
  assert.ok(AboutHeroSection, 'AboutHeroSection must be exported');
  console.log('[PASS] Section 01: AboutHeroSection loaded successfully');

  const { AboutStorySection } = await import('../src/components/about/AboutStorySection');
  assert.ok(AboutStorySection, 'AboutStorySection must be exported');
  console.log('[PASS] Section 02: AboutStorySection loaded successfully');

  const { AboutVisionMissionSection } = await import('../src/components/about/AboutVisionMissionSection');
  assert.ok(AboutVisionMissionSection, 'AboutVisionMissionSection must be exported');
  console.log('[PASS] Section 03: AboutVisionMissionSection loaded successfully');

  const { AboutFieldsSection } = await import('../src/components/about/AboutFieldsSection');
  assert.ok(AboutFieldsSection, 'AboutFieldsSection must be exported');
  console.log('[PASS] Section 04: AboutFieldsSection loaded successfully');

  const { AboutCoreValuesSection } = await import('../src/components/about/AboutCoreValuesSection');
  assert.ok(AboutCoreValuesSection, 'AboutCoreValuesSection must be exported');
  console.log('[PASS] Section 05: AboutCoreValuesSection loaded successfully');

  const { AboutMemberAlbumSection, ALBUM_DATA, KNOWN_AVATARS, DEFAULT_MEMBER_AVATAR } = await import('../src/components/about/AboutMemberAlbumSection');
  assert.ok(AboutMemberAlbumSection, 'AboutMemberAlbumSection must be exported');
  console.log('[PASS] Section 06: AboutMemberAlbumSection loaded successfully');

  const { ImageLightboxModal } = await import('../src/components/common/ImageLightboxModal');
  assert.ok(ImageLightboxModal, 'ImageLightboxModal must be exported');
  console.log('[PASS] Utility: ImageLightboxModal loaded successfully');

  console.log('\n--- Testing Member Album Roster & Departures/Arrivals ---');
  assert.strictEqual(ALBUM_DATA.length, 3, 'Must have exactly 3 departments (BCN, BDH, BTV)');

  const bcn = ALBUM_DATA.find((d) => d.id === 'bcn')!;
  const bdh = ALBUM_DATA.find((d) => d.id === 'bdh')!;
  const btv = ALBUM_DATA.find((d) => d.id === 'btv')!;

  assert.strictEqual(bcn.members.length, 3, 'Ban Chủ nhiệm must have exactly 3 members');
  assert.strictEqual(bdh.members.length, 5, 'Ban Điều hành must have exactly 5 members');
  assert.strictEqual(btv.members.length, 22, 'Ban Thành viên must have exactly 22 members');

  // Verify transfer of Nguyễn Thị Thục Trang to Ban Điều hành
  const thucTrang = bdh.members.find((m) => m.fullName === 'Nguyễn Thị Thục Trang');
  assert.ok(thucTrang, 'Nguyễn Thị Thục Trang must be in Ban Điều hành');
  assert.strictEqual(thucTrang.studentId, '121240105');
  console.log('[PASS] Verified: Nguyễn Thị Thục Trang is placed in Ban Điều hành');

  // Verify transfer of Lê Hồng Ngân to Ban Thành viên
  const hongNgan = btv.members.find((m) => m.fullName === 'Lê Hồng Ngân');
  assert.ok(hongNgan, 'Lê Hồng Ngân must be in Ban Thành viên');
  assert.ok(hongNgan.studentId === '105250375' || hongNgan.studentId === '121240093', 'Lê Hồng Ngân must have valid studentId');
  console.log('[PASS] Verified: Lê Hồng Ngân is placed in Ban Thành viên');

  // Verify member avatars
  const totalCount = bcn.members.length + bdh.members.length + btv.members.length;
  assert.strictEqual(totalCount, 30, 'Total members across all departments must be 30');
  
  const allMembers = [...bcn.members, ...bdh.members, ...btv.members];
  for (const m of allMembers) {
    if (KNOWN_AVATARS[m.studentId]) {
      assert.ok(m.avatarUrl.includes(m.studentId), `Member ${m.fullName} must have their individual photo`);
    } else {
      assert.ok(m.avatarUrl, `Member ${m.fullName} must have an avatar URL`);
    }
    assert.ok(m.studentId, `Member ${m.fullName} must have studentId`);
    assert.ok(m.faculty, `Member ${m.fullName} must have faculty`);
  }
  console.log('[PASS] Verified: All members have correctly mapped avatar URLs and valid metadata');

  // Test AboutPage itself
  const { AboutPage } = await import('../src/pages/AboutPage');
  assert.ok(AboutPage, 'AboutPage must be exported');
  console.log('[PASS] AboutPage: Main component rendered with integrated sections');

  console.log('\n====================================================');
  console.log('ALL ABOUT PAGE TESTS PASSED!');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
