/**
 * Academic Rules & Formulas Configuration
 */

export const DEFAULT_ACADEMIC_RULES = {
  // SGPA formula: SUM(Credit * GradePoint) / SUM(Credits)
  sgpaFormulaDescription: "SGPA = Σ(Credit × Grade Point) / Σ(Credits Considered)",
  // CGPA formula: SUM(All Semester Credit Points) / SUM(All Semester Credits)
  cgpaFormulaDescription: "CGPA = Σ(All Semester Credit Points) / Σ(All Semester Credits)",
  
  // Decimal display configuration
  defaultDecimalPlaces: 2,
  minDecimalPlaces: 1,
  maxDecimalPlaces: 4,

  // Credit calculation behavior
  includeZeroCreditInDenominator: false, // Subjects with 0 credits do not affect denominator
  blockOnIncompleteGrades: true,         // Do not show final SGPA if required subjects have no grade

  // Backlog and improvement options
  backlogReplacementMode: "LATEST",      // "LATEST" or "HIGHEST"
};
