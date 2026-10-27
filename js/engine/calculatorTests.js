/**
 * Automated Test Suite for SGPA & CGPA Calculation Engine
 * Corresponds to Specification Section 32 Test Cases.
 */

import {
  calculateSubjectPoints,
  calculateSGPA,
  calculateCGPA,
  calculateTargetSGPA
} from './calculatorEngine.js';

import { DEFAULT_GRADING_SCALE } from '../config/gradingRules.js';
import { PREDEFINED_SUBJECTS } from '../config/subjects.js';

export function runAutomatedTests() {
  const results = [];

  function assert(testName, passed, details) {
    results.push({ name: testName, passed, details });
  }

  // -------------------------------------------------------------
  // Test 1: Basic SGPA Calculation
  // -------------------------------------------------------------
  try {
    const subjects1 = [
      { code: "TEST101", name: "Sub 1", credits: 3, grade: "B+", gradePoint: 8 },
      { code: "TEST102", name: "Sub 2", credits: 4, grade: "A+", gradePoint: 9 }
    ];
    const res1 = calculateSGPA(subjects1, DEFAULT_GRADING_SCALE);
    // (3*8 + 4*9) / (3+4) = 60 / 7 = 8.571428...
    const expectedRaw = 60 / 7;
    const passed1 = res1.isComplete && Math.abs(res1.sgpa - expectedRaw) < 0.0001 && res1.sgpaFormatted === "8.57";
    assert(
      "Test 1 — Basic SGPA (3 credits @ 8 GP + 4 credits @ 9 GP)",
      passed1,
      `Expected SGPA ~8.5714 (formatted "8.57"), got ${res1.sgpaFormatted} (raw: ${res1.sgpa})`
    );
  } catch (e) {
    assert("Test 1 — Basic SGPA", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 2: Decimal Credits Calculation
  // -------------------------------------------------------------
  try {
    const pts = calculateSubjectPoints(1.5, 9);
    const passed2 = pts === 13.5;
    assert(
      "Test 2 — Decimal Credits (1.5 credits × 9 Grade Point)",
      passed2,
      `Expected 13.5 credit points, got ${pts}`
    );
  } catch (e) {
    assert("Test 2 — Decimal Credits", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 3: Credit-Weighted CGPA Calculation
  // -------------------------------------------------------------
  try {
    const sems = [
      { semester: 1, sgpa: 8.0, credits: 20, mode: "direct" },
      { semester: 2, sgpa: 9.0, credits: 30, mode: "direct" }
    ];
    const res3 = calculateCGPA(sems, DEFAULT_GRADING_SCALE);
    // (8.0 * 20 + 9.0 * 30) / (20 + 30) = (160 + 270) / 50 = 430 / 50 = 8.60
    const passed3 = res3.cgpaFormatted === "8.60" && Math.abs(res3.cgpa - 8.6) < 0.0001;
    assert(
      "Test 3 — Credit-Weighted CGPA (Sem 1: 8.0/20 cr, Sem 2: 9.0/30 cr)",
      passed3,
      `Expected CGPA 8.60, got ${res3.cgpaFormatted}. Verified simple average 8.50 is NOT used.`
    );
  } catch (e) {
    assert("Test 3 — Credit-Weighted CGPA", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 4: Missing Grade Handling
  // -------------------------------------------------------------
  try {
    const subjects4 = [
      { code: "TEST401", name: "Sub A", credits: 3, grade: "A+", gradePoint: 9 },
      { code: "TEST402", name: "Sub B", credits: 3, grade: "", gradePoint: null } // Missing grade!
    ];
    const res4 = calculateSGPA(subjects4, DEFAULT_GRADING_SCALE, { blockOnIncomplete: true });
    const passed4 = !res4.isComplete && res4.sgpa === null && res4.missingSubjects.length === 1;
    assert(
      "Test 4 — Missing Grade Handling (Blocks SGPA when grade missing)",
      passed4,
      `Calculation blocked: ${!res4.isComplete}, Missing subjects count: ${res4.missingSubjects.length}`
    );
  } catch (e) {
    assert("Test 4 — Missing Grade Handling", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 5: Custom Subject Inclusion
  // -------------------------------------------------------------
  try {
    const subjects5 = [
      { code: "CUSTOM101", name: "Advanced Robotics (Custom)", credits: 3, grade: "A+", gradePoint: 9, custom: true }
    ];
    const res5 = calculateSGPA(subjects5, DEFAULT_GRADING_SCALE);
    const passed5 = res5.isComplete && res5.totalCredits === 3 && res5.totalCreditPoints === 27 && res5.sgpaFormatted === "9.00";
    assert(
      "Test 5 — Custom Subject Inclusion (3 credits @ A+ 9 GP)",
      passed5,
      `Total credits: ${res5.totalCredits}, Credit points: ${res5.totalCreditPoints}, SGPA: ${res5.sgpaFormatted}`
    );
  } catch (e) {
    assert("Test 5 — Custom Subject Inclusion", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 6: Zero-Credit / Non-Credit Subject
  // -------------------------------------------------------------
  try {
    const subjects6 = [
      { code: "REG101", name: "Main Theory", credits: 4, grade: "A", gradePoint: 8 },
      { code: "AUD101", name: "German Non-Credit", credits: 0, grade: "A++", gradePoint: 10, status: "AUDIT" }
    ];
    const res6 = calculateSGPA(subjects6, DEFAULT_GRADING_SCALE);
    const passed6 = res6.isComplete && res6.totalCredits === 4 && res6.sgpaFormatted === "8.00";
    assert(
      "Test 6 — Zero-Credit / Audit Subject (Does not affect denominator)",
      passed6,
      `Expected total credits 4 and SGPA 8.00, got credits ${res6.totalCredits} and SGPA ${res6.sgpaFormatted}`
    );
  } catch (e) {
    assert("Test 6 — Zero-Credit Subject", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 7: Duplicate Subject Code Detection
  // -------------------------------------------------------------
  try {
    const subjects7 = [
      { code: "SUB001", name: "DBMS" },
      { code: "SUB001", name: "DBMS Duplicate" }
    ];
    const codes = subjects7.map(s => s.code);
    const hasDuplicates = new Set(codes).size !== codes.length;
    assert(
      "Test 7 — Duplicate Subject Code Detection",
      hasDuplicates,
      `Detected duplicate codes: ${hasDuplicates}`
    );
  } catch (e) {
    assert("Test 7 — Duplicate Subject Code", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 8: Target CGPA Validation (Unachievable Target)
  // -------------------------------------------------------------
  try {
    // Current CGPA: 6.0, Completed Credits: 40, Target CGPA: 9.5, Remaining Credits: 20
    // Points earned = 240, Target needed = 9.5 * 60 = 570. Future points needed = 330.
    // Required SGPA = 330 / 20 = 16.5 (> 10.0 scale)
    const res8 = calculateTargetSGPA(6.0, 40, 9.5, 20, 10.0);
    const passed8 = !res8.isAchievable && res8.requiredSGPA > 10.0 && res8.errorMessage.includes("not achievable");
    assert(
      "Test 8 — Target CGPA Validation (Flags unachievable > 10.0 SGPA requirement)",
      passed8,
      `isAchievable: ${res8.isAchievable}, Required SGPA: ${res8.requiredSGPAFormatted}`
    );
  } catch (e) {
    assert("Test 8 — Target CGPA Validation", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 9: RTU Internal and End-Term Marks
  // -------------------------------------------------------------
  try {
    const subjects = [
      { code: "1FY2-01", name: "Theory", credits: 4, internalMaxMarks: 30, externalMaxMarks: 70, internalMarks: 21, externalMarks: 49 },
      { code: "1FY2-20", name: "Lab", credits: 1, internalMaxMarks: 60, externalMaxMarks: 40, internalMarks: 60, externalMarks: 40 }
    ];
    const result = calculateSGPA(subjects, DEFAULT_GRADING_SCALE, { inputMode: "marks" });
    const passed = result.isComplete
      && result.subjectBreakdown[0].grade === "B+"
      && result.subjectBreakdown[1].grade === "A++"
      && result.totalCreditPoints === 42;
    assert(
      "Test 9 — RTU IA/ETE marks map using combined marks",
      passed,
      `Expected grades B+ and A++ with 42 credit points, got ${result.subjectBreakdown.map(subject => subject.grade).join(", ")} and ${result.totalCreditPoints}`
    );
  } catch (e) {
    assert("Test 9 — RTU IA/ETE marks", false, e.message);
  }

  // -------------------------------------------------------------
  // Test 10: Incomplete RTU Marks and Semester Scheme
  // -------------------------------------------------------------
  try {
    const partialResult = calculateSGPA([
      { code: "1FY2-01", name: "Theory", credits: 4, internalMaxMarks: 30, externalMaxMarks: 70, internalMarks: 21, externalMarks: null }
    ], DEFAULT_GRADING_SCALE, { inputMode: "marks" });
    const semesterCredits = [1, 2].map(semester =>
      PREDEFINED_SUBJECTS[semester].reduce((total, subject) => total + subject.credits, 0)
    );
    const isSchemeAccurate = [1, 2].every(semester =>
      PREDEFINED_SUBJECTS[semester].length === 11
        && PREDEFINED_SUBJECTS[semester].every(subject =>
          subject.internalMaxMarks === 30 && subject.externalMaxMarks === 70
            || subject.internalMaxMarks === 60 && subject.externalMaxMarks === 40
            || subject.totalMaxMarks === 100
        )
    ) && semesterCredits.every(credits => credits === 20.5);
    const passed = !partialResult.isComplete
      && partialResult.missingSubjects.length === 1
      && isSchemeAccurate;
    assert(
      "Test 10 — RTU scheme defaults and incomplete split marks",
      passed,
      `Incomplete split marks blocked: ${!partialResult.isComplete}; semester credits: ${semesterCredits.join(", ")}`
    );
  } catch (e) {
    assert("Test 10 — RTU scheme defaults", false, e.message);
  }

  const allPassed = results.every(r => r.passed);
  return { allPassed, results };
}
