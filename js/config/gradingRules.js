/**
 * Default Grading Scale and Rules Configuration
 * Easily updateable for different universities or grading schemes.
 */

export const DEFAULT_GRADING_SCALE = [
  { grade: "A++", gradePoint: 10.0, minMarks: 90, maxMarks: 100, isPass: true, description: "Outstanding" },
  { grade: "A+",  gradePoint: 9.0,  minMarks: 80, maxMarks: 89,  isPass: true, description: "Excellent" },
  { grade: "A",   gradePoint: 8.5,  minMarks: 75, maxMarks: 79,  isPass: true, description: "Very Good" },
  { grade: "B+",  gradePoint: 8.0,  minMarks: 70, maxMarks: 74,  isPass: true, description: "Good" },
  { grade: "B",   gradePoint: 7.0,  minMarks: 60, maxMarks: 69,  isPass: true, description: "Above Average" },
  { grade: "C+",  gradePoint: 6.0,  minMarks: 55, maxMarks: 59,  isPass: true, description: "Average" },
  { grade: "C",   gradePoint: 5.0,  minMarks: 50, maxMarks: 54,  isPass: true, description: "Satisfactory" },
  { grade: "D+",  gradePoint: 4.0,  minMarks: 45, maxMarks: 49,  isPass: true, description: "Pass (Lower)" },
  { grade: "D",   gradePoint: 3.0,  minMarks: 40, maxMarks: 44,  isPass: true, description: "Marginal Pass" },
  { grade: "F",   gradePoint: 0.0,  minMarks: 0,  maxMarks: 39,  isPass: false, description: "Fail" }
];

export const ACADEMIC_STATUSES = [
  { code: "COMPLETED", label: "Completed", countsInCredits: true, countsInPoints: true },
  { code: "FAILED", label: "Failed / Backlog", countsInCredits: true, countsInPoints: true },
  { code: "ABSENT", label: "Absent", countsInCredits: true, countsInPoints: true },
  { code: "WITHHELD", label: "Withheld", countsInCredits: false, countsInPoints: false },
  { code: "EXEMPTED", label: "Exempted", countsInCredits: false, countsInPoints: false },
  { code: "AUDIT", label: "Audit / Non-Credit", countsInCredits: false, countsInPoints: false }
];

export const SUBJECT_TYPES = [
  { id: "theory", name: "Theory", badgeColor: "blue" },
  { id: "practical", name: "Practical / Lab", badgeColor: "emerald" },
  { id: "tutorial", name: "Tutorial", badgeColor: "purple" },
  { id: "project", name: "Project Work", badgeColor: "amber" },
  { id: "internship", name: "Internship / Seminar", badgeColor: "indigo" },
  { id: "elective", name: "Elective Subject", badgeColor: "teal" },
  { id: "fec", name: "Foundation / Value-Added (FEC)", badgeColor: "rose" },
  { id: "other", name: "Other", badgeColor: "slate" }
];
