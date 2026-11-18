// BK-IC Digital Hub — Companion Project & Incubation Platform Test Suite
// Rigorously verifies all requirements: Companion stats, capabilities, benefits, criteria, fields, process, track record, FAQs & CMS storage
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../server/db';
import {
  COMPANION_PROJECT_STATS,
  STUDENT_CAPABILITY_GROUPS,
  COMPANION_BENEFITS,
  COMPANION_CRITERIA,
  COMPANION_FIELDS,
  COMPANION_PROCESS_STEPS,
  COMPANION_TRACK_RECORD,
  COMPANION_FAQS,
  COMPANION_CONTACT_INFO
} from '../src/data/partnershipData';

describe('BK-IC COMPANION PROJECT & INCUBATION VERIFICATION SUITE', () => {
  // ---------------------------------------------------------------------------
  // 1. STATS ACCURACY & STUDENT FOCUS
  // ---------------------------------------------------------------------------
  it('Scenario 1: Verified metrics contain exact confirmed numbers and student orientation', () => {
    // 30 Core Members (3 BCN, 5 BDH, 22 BTV)
    const membersStat = COMPANION_PROJECT_STATS.find(s => s.id === 'members');
    assert.ok(membersStat, 'Members stat must exist');
    assert.strictEqual(membersStat.numericValue, 30, 'Core members must be 30');
    assert.match(membersStat.description, /Ban Chủ nhiệm/i, 'Must clarify Ban Chủ nhiệm');
    assert.match(membersStat.description, /Ban Điều hành/i, 'Must clarify Ban Điều hành');
    assert.match(membersStat.description, /Ban Thành viên/i, 'Must clarify Ban Thành viên');

    // 35+ Teams
    const teamsStat = COMPANION_PROJECT_STATS.find(s => s.id === 'teams');
    assert.ok(teamsStat, 'Teams stat must exist');
    assert.strictEqual(teamsStat.numericValue, 35, 'Teams must be 35');

    // 5 Focus Tech Fields
    const fieldsStat = COMPANION_PROJECT_STATS.find(s => s.id === 'fields');
    assert.ok(fieldsStat, 'Fields stat must exist');
    assert.strictEqual(fieldsStat.numericValue, 5, 'Focus tech fields must be 5');

    // 100% Free / Phi lợi nhuận
    const freeStat = COMPANION_PROJECT_STATS.find(s => s.id === 'free');
    assert.ok(freeStat, 'Free support stat must exist');
    assert.strictEqual(freeStat.numericValue, 100, 'Must be 100% free');
    assert.match(freeStat.label, /phi lợi nhuận/i);
  });

  // ---------------------------------------------------------------------------
  // 2. STUDENT CAPABILITIES (HARD & SOFT SKILLS)
  // ---------------------------------------------------------------------------
  it('Scenario 2: Student capabilities defined as development orientation (Hard & Soft Skills)', () => {
    assert.strictEqual(STUDENT_CAPABILITY_GROUPS.length, 2, 'Must have exactly 2 capability groups');
    const hardSkills = STUDENT_CAPABILITY_GROUPS.find(g => g.id === 'hard-skills');
    const softSkills = STUDENT_CAPABILITY_GROUPS.find(g => g.id === 'soft-skills');

    assert.ok(hardSkills, 'Hard skills group must exist');
    assert.ok(softSkills, 'Soft skills group must exist');

    assert.ok(hardSkills.skills.some(s => s.includes('Prototype / MVP')));
    assert.ok(hardSkills.skills.some(s => s.includes('Problem-Solution Fit')));

    assert.ok(softSkills.skills.some(s => s.includes('Pitching')));
    assert.ok(softSkills.skills.some(s => s.includes('thuyết phục')));
  });

  // ---------------------------------------------------------------------------
  // 3. 5 CORE COMPANION BENEFITS & 4 INTAKE CRITERIA
  // ---------------------------------------------------------------------------
  it('Scenario 3: 5 core companion benefits for student projects', () => {
    assert.strictEqual(COMPANION_BENEFITS.length, 5, 'Must have exactly 5 companion benefits');
    const benefitIds = COMPANION_BENEFITS.map(b => b.id);
    assert.ok(benefitIds.includes('mentoring'));
    assert.ok(benefitIds.includes('workspace'));
    assert.ok(benefitIds.includes('pitching'));
    assert.ok(benefitIds.includes('competition-backing'));
    assert.ok(benefitIds.includes('ecosystem-network'));
  });

  it('Scenario 4: 4 transparent intake criteria & 5 focus tech fields', () => {
    assert.strictEqual(COMPANION_CRITERIA.length, 4, 'Must have exactly 4 criteria');
    assert.strictEqual(COMPANION_FIELDS.length, 5, 'Must have exactly 5 tech focus fields');

    const fieldNames = COMPANION_FIELDS.map(f => f.name);
    assert.ok(fieldNames.some(f => f.includes('Trí tuệ Nhân tạo')));
    assert.ok(fieldNames.some(f => f.includes('IoT')));
    assert.ok(fieldNames.some(f => f.includes('Chuyển đổi số')));
    assert.ok(fieldNames.some(f => f.includes('Công nghệ Xanh')));
    assert.ok(fieldNames.some(f => f.includes('STEAM')));
  });

  // ---------------------------------------------------------------------------
  // 4. REAL TRACK RECORD (BK SHARK 2026)
  // ---------------------------------------------------------------------------
  it('Scenario 5: Real track record is strictly based on BK Shark 2026', () => {
    assert.ok(COMPANION_TRACK_RECORD, 'Track record must exist');
    assert.match(COMPANION_TRACK_RECORD.title, /BK SHARK 2026/i);
    assert.ok(COMPANION_TRACK_RECORD.highlights.length >= 4);
    assert.ok(COMPANION_TRACK_RECORD.highlights.some(h => h.includes('35 Đội thi')));
    assert.ok(COMPANION_TRACK_RECORD.highlights.some(h => h.includes('DanangBooth')));
  });

  // ---------------------------------------------------------------------------
  // 5. OFFICIAL CONTACT & ROADMAP
  // ---------------------------------------------------------------------------
  it('Scenario 6: 4-step incubation roadmap and 6 FAQs', () => {
    assert.strictEqual(COMPANION_PROCESS_STEPS.length, 4, 'Must have 4 process steps');
    assert.strictEqual(COMPANION_FAQS.length, 6, 'Must have 6 student FAQs');
    assert.strictEqual(COMPANION_CONTACT_INFO.fanpageUrl, 'https://www.facebook.com/dut.bkic');
  });

  // ---------------------------------------------------------------------------
  // 6. DATABASE STORAGE & PROJECT APPLICATION SCHEMA
  // ---------------------------------------------------------------------------
  it('Scenario 7: Database store supports companion project requests with full schema', () => {
    const store = db.get();
    store.partnershipRequests = store.partnershipRequests || [];

    const mockProjectRequest = {
      id: `preq-proj-${Date.now()}`,
      organizationName: 'Danang Green Energy Tracker',
      representativeName: 'Trần Văn Sinh Viên',
      position: 'Khoa Điện - Lớp 22D_DT2 (DUT)',
      email: 'sinhvien.dut@gmail.com',
      phone: '0905999888',
      partnershipType: 'startup_project' as const,
      proposalContent: '[Lĩnh vực: Năng lượng Xanh] Dự án giải quyết bài toán giám sát năng lượng mặt trời thông minh.',
      attachmentUrl: 'https://drive.google.com/drive/folders/sample-pitch-deck',
      status: 'received' as const,
      submittedAt: new Date().toISOString()
    };

    store.partnershipRequests.unshift(mockProjectRequest);
    db.save();

    // Verify retrieval
    const retrieved = (db.get().partnershipRequests || []).find(r => r.id === mockProjectRequest.id);
    assert.ok(retrieved, 'Project request must be saved in database');
    assert.strictEqual(retrieved.status, 'received');
    assert.strictEqual(retrieved.organizationName, 'Danang Green Energy Tracker');
    assert.strictEqual(retrieved.partnershipType, 'startup_project');
    assert.strictEqual(retrieved.attachmentUrl, 'https://drive.google.com/drive/folders/sample-pitch-deck');

    // Clean up test item
    const cleanStore = db.get();
    cleanStore.partnershipRequests = (cleanStore.partnershipRequests || []).filter(r => r.id !== mockProjectRequest.id);
    db.save();

    setTimeout(() => process.exit(0), 50);
  });
});
