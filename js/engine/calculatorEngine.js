/**
 * Core Calculation Engine for CGPA & SGPA Calculator
 * Framework-independent pure calculation functions.
 * Ensures maximum floating-point precision, transparent breakdowns, and strict validation.
 */

/**
 * Safely multiplies credits and grade point to prevent floating-point anomalies.
 * @param {number} credits 
 * @param {number} gradePoint 
 * @returns {number}
 */
export function calculateSubjectPoints(credits, gradePoint) {
  const c = Number(credits) || 0;
  const gp = Number(gradePoint) || 0;
  return Math.round(c * gp * 100000) / 100000;
}

/**
 * Maps numeric marks (0-100) to configured grade object.
 * @param {number} marks 
 * @param {Array} gradingScale 
 * @returns {Object|null}
 */
export function mapMarksToGrade(marks, gradingScale) {
  if (marks === null || marks === undefined || marks === "" || isNaN(marks)) return null;
  const numericMarks = Number(marks);
  for (const item of gradingScale) {
    if (numericMarks >= item.minMarks && numericMarks <= item.maxMarks) {
      return item;
    }
  }
  return null;
}

/**
 * Format number to configured decimal precision.
 * @param {number} val 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatDecimal(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return "0.00";
  return Number(val).toFixed(decimals);
}

/**
 * Calculates SGPA for a given list of subject entries.
 * @param {Array} subjects - List of subject object inputs
 * @param {Array} gradingScale - Grading scale definitions
 * @param {Object} options - Additional calculation options
 * @returns {Object} Structured SGPA result and step-by-step breakdown
 */
export function calculateSGPA(subjects = [], gradingScale = [], options = {}) {
  const decimalPlaces = options.decimalPlaces || 2;
  const blockOnIncomplete = options.blockOnIncomplete !== false;

  let totalCreditsConsidered = 0;
  let totalCreditPoints = 0;
  let missingSubjects = [];
  let subjectBreakdown = [];
  let invalidSubjects = [];

  subjects.forEach((sub, index) => {
    const name = sub.name || `Subject #${index + 1}`;
    const code = sub.code || `SUB-${index + 1}`;
    const credits = Number(sub.credits) || 0;
    const status = sub.status || "COMPLETED";

    // Non-credit or exempted or audit subjects
    const isAuditOrExempted = status === "AUDIT" || status === "EXEMPTED" || status === "WITHHELD";
    const isZeroCredit = credits === 0;

    // Resolve Grade and Grade Point
    let grade = sub.grade || "";
    let gradePoint = sub.gradePoint;
    let marks = sub.marks;

    if (options.inputMode === "marks") {
      const hasInternalMarks = sub.internalMarks !== undefined && sub.internalMarks !== null && sub.internalMarks !== "";
      const hasExternalMarks = sub.externalMarks !== undefined && sub.externalMarks !== null && sub.externalMarks !== "";

      if (typeof sub.internalMaxMarks === "number" && typeof sub.externalMaxMarks === "number" && (hasInternalMarks || hasExternalMarks)) {
        const internalMarks = Number(sub.internalMarks);
        const externalMarks = Number(sub.externalMarks);
        const validMarks = hasInternalMarks && hasExternalMarks
          && internalMarks >= 0 && internalMarks <= sub.internalMaxMarks
          && externalMarks >= 0 && externalMarks <= sub.externalMaxMarks;
        marks = validMarks ? internalMarks + externalMarks : null;
      }

      const mapped = mapMarksToGrade(marks, gradingScale);
      grade = mapped ? mapped.grade : "";
      gradePoint = mapped ? mapped.gradePoint : null;
    } else if (gradePoint === undefined || gradePoint === null) {
      const foundGrade = gradingScale.find(g => g.grade === grade);
      if (foundGrade) {
        gradePoint = foundGrade.gradePoint;
      }
    }

    // Check completeness
    const isMissingGrade = !isAuditOrExempted && !isZeroCredit && (gradePoint === undefined || gradePoint === null || grade === "");
    if (isMissingGrade) {
      missingSubjects.push({ id: sub.id, code, name });
    }

    const effectiveGP = Number(gradePoint) || 0;
    const creditPoints = calculateSubjectPoints(credits, effectiveGP);

    // Accumulate total credits & points if subject counts in academic calculation
    const countsInCalc = !isAuditOrExempted && !isZeroCredit;
    if (countsInCalc && !isMissingGrade) {
      totalCreditsConsidered += credits;
      totalCreditPoints += creditPoints;
    }

    subjectBreakdown.push({
      id: sub.id,
      code,
      name,
      credits,
      type: sub.type || "theory",
      grade: grade || "N/A",
      gradePoint: effectiveGP,
      creditPoints,
      countsInCalc,
      isMissingGrade,
      status,
      custom: !!sub.custom
    });
  });

  totalCreditsConsidered = Math.round(totalCreditsConsidered * 1000) / 1000;
  totalCreditPoints = Math.round(totalCreditPoints * 1000) / 1000;

  const isComplete = missingSubjects.length === 0;

  if (blockOnIncomplete && !isComplete) {
    return {
      isComplete: false,
      sgpa: null,
      sgpaFormatted: "--",
      totalCredits: totalCreditsConsidered,
      totalCreditPoints,
      missingSubjects,
      subjectBreakdown,
      formulaExplanation: `${missingSubjects.length} subject(s) missing grades. Complete all grades to view SGPA.`
    };
  }

  const rawSGPA = totalCreditsConsidered > 0 ? (totalCreditPoints / totalCreditsConsidered) : 0;
  const sgpaFormatted = formatDecimal(rawSGPA, decimalPlaces);

  const formulaExplanation = totalCreditsConsidered > 0
    ? `SGPA = Total Credit Points (${totalCreditPoints}) ÷ Total Credits (${totalCreditsConsidered}) = ${sgpaFormatted}`
    : `No credited subjects selected. SGPA = 0.00`;

  return {
    isComplete: true,
    sgpa: rawSGPA,
    sgpaFormatted,
    totalCredits: totalCreditsConsidered,
    totalCreditPoints,
    missingSubjects: [],
    subjectBreakdown,
    formulaExplanation
  };
}

/**
 * Calculates CGPA from an array of semester entries.
 * Correctly computes credit-weighted CGPA: SUM(Sem Credit Points) / SUM(Sem Credits).
 * Supports mixed mode (detailed subject-based vs direct SGPA + credits).
 * @param {Array} semesters 
 * @param {Array} gradingScale 
 * @param {Object} options 
 * @returns {Object} CGPA calculation result
 */
export function calculateCGPA(semesters = [], gradingScale = [], options = {}) {
  const decimalPlaces = options.decimalPlaces || 2;

  let grandTotalCredits = 0;
  let grandTotalCreditPoints = 0;
  let semesterBreakdown = [];
  let incompleteSemesters = [];

  semesters.forEach(sem => {
    let semCredits = 0;
    let semCreditPoints = 0;
    let semSGPA = 0;
    let isSemComplete = true;
    let entryMode = sem.mode || (sem.subjects && sem.subjects.length > 0 ? "detailed" : "direct");

    if (entryMode === "detailed" && Array.isArray(sem.subjects)) {
      const sgpaRes = calculateSGPA(sem.subjects, gradingScale, options);
      if (!sgpaRes.isComplete) {
        isSemComplete = false;
        incompleteSemesters.push({ semester: sem.semester, reason: `${sgpaRes.missingSubjects.length} subjects pending` });
      }
      semCredits = sgpaRes.totalCredits;
      semCreditPoints = sgpaRes.totalCreditPoints;
      semSGPA = sgpaRes.sgpa || 0;
    } else {
      // Direct SGPA + Credit input
      semSGPA = Number(sem.sgpa) || 0;
      semCredits = Number(sem.credits) || 0;
      semCreditPoints = calculateSubjectPoints(semCredits, semSGPA);
      if (sem.sgpa === undefined || sem.sgpa === null || sem.credits === undefined || sem.credits === null) {
        isSemComplete = false;
        incompleteSemesters.push({ semester: sem.semester, reason: "Direct SGPA or Credits missing" });
      }
    }

    if (isSemComplete) {
      grandTotalCredits += semCredits;
      grandTotalCreditPoints += semCreditPoints;
    }

    semesterBreakdown.push({
      semester: sem.semester,
      mode: entryMode,
      credits: semCredits,
      creditPoints: semCreditPoints,
      sgpa: semSGPA,
      sgpaFormatted: formatDecimal(semSGPA, decimalPlaces),
      isComplete: isSemComplete
    });
  });

  grandTotalCredits = Math.round(grandTotalCredits * 1000) / 1000;
  grandTotalCreditPoints = Math.round(grandTotalCreditPoints * 1000) / 1000;

  const rawCGPA = grandTotalCredits > 0 ? (grandTotalCreditPoints / grandTotalCredits) : 0;
  const cgpaFormatted = formatDecimal(rawCGPA, decimalPlaces);

  // Compare direct average vs credit-weighted formula to show accurate breakdown
  const validSgpaList = semesterBreakdown.filter(s => s.isComplete).map(s => s.sgpa);
  const simpleAverage = validSgpaList.length > 0
    ? (validSgpaList.reduce((a, b) => a + b, 0) / validSgpaList.length)
    : 0;

  const formulaExplanation = grandTotalCredits > 0
    ? `CGPA = Total Credit Points Across Semesters (${grandTotalCreditPoints}) ÷ Total Credits (${grandTotalCredits}) = ${cgpaFormatted}`
    : `No semesters calculated yet.`;

  return {
    cgpa: rawCGPA,
    cgpaFormatted,
    totalCredits: grandTotalCredits,
    totalCreditPoints: grandTotalCreditPoints,
    simpleAverage: formatDecimal(simpleAverage, decimalPlaces),
    isSimpleAverageDifferent: Math.abs(rawCGPA - simpleAverage) > 0.001,
    semesterBreakdown,
    incompleteSemesters,
    formulaExplanation
  };
}

/**
 * Target CGPA / Required SGPA Calculator.
 * @param {number} currentCGPA 
 * @param {number} completedCredits 
 * @param {number} targetCGPA 
 * @param {number} remainingCredits 
 * @param {number} maxGradePoint 
 * @param {number} decimalPlaces 
 * @returns {Object}
 */
export function calculateTargetSGPA(currentCGPA, completedCredits, targetCGPA, remainingCredits, maxGradePoint = 10.0, decimalPlaces = 2) {
  const curCGPA = Number(currentCGPA) || 0;
  const compCredits = Number(completedCredits) || 0;
  const tarCGPA = Number(targetCGPA) || 0;
  const remCredits = Number(remainingCredits) || 0;

  if (remCredits <= 0) {
    return {
      isAchievable: false,
      requiredSGPA: null,
      requiredSGPAFormatted: "--",
      errorMessage: "Remaining credits must be greater than 0."
    };
  }

  const totalFinalCredits = compCredits + remCredits;
  const currentEarnedPoints = curCGPA * compCredits;
  const targetRequiredPoints = tarCGPA * totalFinalCredits;
  const requiredFuturePoints = targetRequiredPoints - currentEarnedPoints;

  const rawRequiredSGPA = requiredFuturePoints / remCredits;
  const requiredSGPAFormatted = formatDecimal(rawRequiredSGPA, decimalPlaces);

  const isAchievable = rawRequiredSGPA <= maxGradePoint && rawRequiredSGPA >= 0;

  let errorMessage = null;
  if (rawRequiredSGPA > maxGradePoint) {
    errorMessage = `Target is not achievable under the maximum grade point scale (${maxGradePoint}). Required SGPA is ${requiredSGPAFormatted}.`;
  } else if (rawRequiredSGPA < 0) {
    errorMessage = `Target CGPA (${tarCGPA}) is lower than what you already secured with your current CGPA. Required SGPA is below 0.00.`;
  }

  return {
    isAchievable,
    requiredSGPA: rawRequiredSGPA,
    requiredSGPAFormatted,
    currentEarnedPoints: Math.round(currentEarnedPoints * 100) / 100,
    targetRequiredPoints: Math.round(targetRequiredPoints * 100) / 100,
    requiredFuturePoints: Math.round(requiredFuturePoints * 100) / 100,
    totalFinalCredits,
    errorMessage,
    formulaExplanation: `Required Points = (${tarCGPA} × ${totalFinalCredits}) - (${curCGPA} × ${compCredits}) = ${Math.round(requiredFuturePoints * 100) / 100}\n` +
                        `Required SGPA = ${Math.round(requiredFuturePoints * 100) / 100} ÷ ${remCredits} = ${requiredSGPAFormatted}`
  };
}
