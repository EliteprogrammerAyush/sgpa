/**
 * Local Storage & Persistence Service
 * Handles loading, saving, importing, exporting, and clearing user data.
 */

import { DEFAULT_SETTINGS } from '../config/calculatorSettings.js';
import { DEFAULT_GRADING_SCALE } from '../config/gradingRules.js';

const STORAGE_KEYS = {
  SETTINGS: 'cgpa_calc_settings',
  GRADING_SCALE: 'cgpa_calc_grading_scale',
  SEMESTERS_DATA: 'cgpa_calc_semesters_data',
  CUSTOM_SUBJECTS: 'cgpa_calc_custom_subjects',
  TARGET_CALC: 'cgpa_calc_target_data',
  CURRENT_SEM: 'cgpa_calc_current_selected_sem'
};

export class StorageService {
  /**
   * Load user settings or defaults
   */
  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      console.error("Failed to load settings:", e);
      return { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * Save user settings
   */
  static saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }

  /**
   * Load grading scale configuration
   */
  static getGradingScale() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GRADING_SCALE);
      return data ? JSON.parse(data) : DEFAULT_GRADING_SCALE;
    } catch (e) {
      console.error("Failed to load grading scale:", e);
      return DEFAULT_GRADING_SCALE;
    }
  }

  /**
   * Save grading scale configuration
   */
  static saveGradingScale(scale) {
    try {
      localStorage.setItem(STORAGE_KEYS.GRADING_SCALE, JSON.stringify(scale));
    } catch (e) {
      console.error("Failed to save grading scale:", e);
    }
  }

  /**
   * Load all semester data (Detailed subject inputs per semester)
   * Returns object keyed by semester number, e.g. { 1: [...subjects], 4: [...subjects] }
   */
  static getSemestersData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEMESTERS_DATA);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error("Failed to load semester data:", e);
      return {};
    }
  }

  /**
   * Save semester data for a specific semester or all semesters
   */
  static saveSemestersData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.SEMESTERS_DATA, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save semester data:", e);
    }
  }

  /**
   * Save subject inputs for a specific semester number
   */
  static saveSemesterSubjects(semNumber, subjects) {
    const allData = this.getSemestersData();
    allData[semNumber] = subjects;
    this.saveSemestersData(allData);
  }

  /**
   * Load custom subjects registry
   */
  static getCustomSubjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_SUBJECTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load custom subjects:", e);
      return [];
    }
  }

  /**
   * Save custom subjects
   */
  static saveCustomSubjects(customSubjects) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SUBJECTS, JSON.stringify(customSubjects));
    } catch (e) {
      console.error("Failed to save custom subjects:", e);
    }
  }

  /**
   * Export all user data as JSON object
   */
  static exportDataJSON() {
    const payload = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      settings: this.getSettings(),
      gradingScale: this.getGradingScale(),
      semestersData: this.getSemestersData(),
      customSubjects: this.getCustomSubjects()
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Export semester results as CSV string
   */
  static exportSemesterSummaryCSV(semestersBreakdown = []) {
    let csv = "Semester,Mode,Credits,Credit Points,SGPA,Status\n";
    semestersBreakdown.forEach(sem => {
      csv += `${sem.semester},${sem.mode},${sem.credits},${sem.creditPoints},${sem.sgpaFormatted},${sem.isComplete ? 'Complete' : 'Incomplete'}\n`;
    });
    return csv;
  }

  /**
   * Import data from JSON string with schema validation
   */
  static importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error("Invalid JSON structure.");
      }

      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.gradingScale && Array.isArray(parsed.gradingScale)) this.saveGradingScale(parsed.gradingScale);
      if (parsed.semestersData && typeof parsed.semestersData === 'object') this.saveSemestersData(parsed.semestersData);
      if (parsed.customSubjects && Array.isArray(parsed.customSubjects)) this.saveCustomSubjects(parsed.customSubjects);

      return { success: true, message: "Data imported successfully!" };
    } catch (e) {
      return { success: false, message: e.message || "Failed to parse imported JSON file." };
    }
  }

  /**
   * Clear all application data from localStorage
   */
  static clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error("Failed to clear local storage:", e);
    }
  }
}
