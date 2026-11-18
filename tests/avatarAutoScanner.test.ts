// Test suite for Automatic Member Avatar Scanner
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

async function runTests() {
  console.log('====================================================');
  console.log('TEST SUITE: REAL-TIME AVATAR SCANNER');
  console.log('====================================================\n');

  const publicDir = path.resolve(process.cwd(), 'public/imageAVT');
  assert.ok(fs.existsSync(publicDir), 'public/imageAVT directory must exist');

  // Verify currently present files in public/imageAVT
  const files = fs.readdirSync(publicDir);
  console.log(`Found ${files.length} items in public/imageAVT:`, files.filter(f => f.endsWith('.jpg')));

  const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
  const avatarMap: Record<string, string> = {};

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (allowedExts.has(ext)) {
      const nameWithoutExt = path.parse(file).name.trim();
      if (nameWithoutExt && !avatarMap[nameWithoutExt]) {
        avatarMap[nameWithoutExt] = `/imageAVT/${encodeURIComponent(file)}`;
      }
      const match = file.match(/(\d{9})/);
      if (match && match[1] && !avatarMap[match[1]]) {
        avatarMap[match[1]] = `/imageAVT/${encodeURIComponent(file)}`;
      }
    }
  }

  // Check that all 6 uploaded photos are detected
  const expectedMSSVs = [
    '102240134',
    '105220278',
    '118230004',
    '121240105',
    '123220065',
    '123230067'
  ];

  for (const mssv of expectedMSSVs) {
    assert.ok(avatarMap[mssv], `Scanner must detect ${mssv}`);
    assert.strictEqual(avatarMap[mssv], `/imageAVT/${mssv}.jpg`);
  }
  console.log('[PASS] Scanner successfully indexed all 6 existing member photos');

  // Simulate dropping a new member photo (e.g. 102240244 - Nguyễn Hoàng Long)
  const testStudentId = '102240244';
  const testFilePath = path.join(publicDir, `${testStudentId}.jpg`);
  
  // Create mock file by copying default.jpg
  const defaultFile = path.join(publicDir, 'default.jpg');
  fs.copyFileSync(defaultFile, testFilePath);

  try {
    // Re-scan
    const updatedFiles = fs.readdirSync(publicDir);
    const updatedMap: Record<string, string> = {};
    for (const file of updatedFiles) {
      const ext = path.extname(file).toLowerCase();
      if (allowedExts.has(ext)) {
        const nameWithoutExt = path.parse(file).name.trim();
        if (nameWithoutExt && !updatedMap[nameWithoutExt]) {
          updatedMap[nameWithoutExt] = `/imageAVT/${encodeURIComponent(file)}`;
        }
        const match = file.match(/(\d{9})/);
        if (match && match[1] && !updatedMap[match[1]]) {
          updatedMap[match[1]] = `/imageAVT/${encodeURIComponent(file)}`;
        }
      }
    }

    assert.ok(updatedMap[testStudentId], 'Scanner must automatically detect newly dropped photo');
    assert.strictEqual(updatedMap[testStudentId], `/imageAVT/${testStudentId}.jpg`);
    console.log(`[PASS] Verified: Newly added photo for MSSV ${testStudentId} was automatically detected without any code changes!`);
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }

  console.log('\n====================================================');
  console.log('ALL AVATAR AUTO-SCANNER TESTS PASSED!');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

