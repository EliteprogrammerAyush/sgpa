/**
 * Main Application Bootstrap & Controller
 */

import { StorageService } from './services/storageService.js';
import { CS_BRANCHES, getPredefinedSubjects } from './config/subjects.js';
import { renderNavbar } from './components/navbar.js';
import { renderSGPAView } from './components/sgpaView.js';
import { renderCGPAView } from './components/cgpaView.js';
import { renderTargetCGPAView } from './components/targetCgpaView.js';
import { renderCatalogView } from './components/catalogView.js';
import { renderSettingsView } from './components/settingsView.js';
import { renderCustomSubjectModal } from './components/customSubjectModal.js';
import { renderTestRunnerModal } from './components/testRunnerModal.js';

class App {
  constructor() {
    this.activeTab = 'sgpa';
    this.currentSemester = 1;
    this.inputMode = 'grade'; // 'grade' or 'marks'

    // Load persisted state or defaults
    this.settings = StorageService.getSettings();
    this.gradingScale = StorageService.getGradingScale();
    this.semestersData = StorageService.getSemestersData();
    this.customSubjects = StorageService.getCustomSubjects();
    this.targetData = { currentCGPA: 8.0, completedCredits: 60, targetCGPA: 8.5, remainingCredits: 20 };

    this.inputMode = this.settings.inputMode || 'grade';
    this.applyTheme(this.settings.theme);

    // Initialize initial semester subject list if empty
    this.ensureSemesterSubjectDefaults(this.currentSemester);
  }

  applyTheme(theme) {
    let effectiveTheme = theme;
    if (theme === 'system' || !theme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }

  ensureSemesterSubjectDefaults(semNumber) {
    if (semNumber >= 5) {
      this.ensureBranchSubjectDefaults(semNumber);
      return;
    }

    const semesterData = this.semestersData[semNumber];
    const subjects = semesterData && semesterData.subjects;
    const predefined = getPredefinedSubjects(semNumber, this.settings.selectedBranch);
    const isDefaultSubjectList = Array.isArray(subjects)
      && subjects.length > 0
      && subjects.every(subject => !subject.custom && subject.id && subject.id.startsWith(`sem${semNumber}_def_`));
    const needsDefaultUpdate = isDefaultSubjectList
      && (subjects.length !== predefined.length || subjects.some((subject, index) => {
        const updated = predefined[index];
        return subject.code !== updated.code
          || subject.name !== updated.name
          || subject.credits !== updated.credits
          || subject.type !== updated.type
          || subject.internalMaxMarks !== updated.internalMaxMarks
          || subject.externalMaxMarks !== updated.externalMaxMarks
          || subject.totalMaxMarks !== updated.totalMaxMarks;
      }));

    if (needsDefaultUpdate) {
      const updatedSubjects = predefined.map((subject, index) => {
        const previous = subjects.find(item => item.code === subject.code)
          || subjects.find(item => item.name === subject.name);
        return {
          ...subject,
          id: previous ? previous.id : `sem${semNumber}_def_${index}_${Date.now()}`,
          grade: previous ? previous.grade : "",
          gradePoint: previous ? previous.gradePoint : null,
          marks: previous ? previous.marks : null,
          internalMarks: previous ? previous.internalMarks : null,
          externalMarks: previous ? previous.externalMarks : null,
          custom: false
        };
      });

      this.semestersData[semNumber] = { ...semesterData, mode: 'detailed', subjects: updatedSubjects };
      StorageService.saveSemestersData(this.semestersData);
    } else if (!semesterData || !Array.isArray(subjects)) {
      const defaultSubjects = predefined.map((subject, index) => ({
        ...subject,
        id: `sem${semNumber}_def_${index}_${Date.now()}`,
        grade: "",
        gradePoint: null,
        marks: null,
        internalMarks: null,
        externalMarks: null,
        custom: false
      }));

      this.semestersData[semNumber] = { mode: 'detailed', subjects: defaultSubjects };
      StorageService.saveSemestersData(this.semestersData);
    }
  }

  ensureBranchSubjectDefaults(semNumber) {
    const branchId = this.settings.selectedBranch || "cse";
    const semesterData = this.semestersData[semNumber] || {};
    const branchSubjects = { ...(semesterData.branchSubjects || {}) };
    const predefined = getPredefinedSubjects(semNumber, branchId);
    let subjects = Array.isArray(semesterData.subjects) ? semesterData.subjects : null;
    let storedBranchId = semesterData.branchId;
    let needsSave = false;

    if (!storedBranchId && subjects && subjects.length > 0) {
      const legacyCode = `${semNumber}CS01`;
      if (subjects.some(subject => subject.code === legacyCode)) {
        storedBranchId = "cse_iot";
        branchSubjects.cse_iot = subjects;
      } else {
        storedBranchId = branchId;
      }
    }

    if (storedBranchId && storedBranchId !== branchId) {
      if (subjects) branchSubjects[storedBranchId] = subjects;
      subjects = branchSubjects[branchId] || null;
      needsSave = true;
    } else if (storedBranchId === branchId && subjects) {
      branchSubjects[branchId] = subjects;
    }

    const isDefaultSubjectList = Array.isArray(subjects)
      && subjects.length > 0
      && subjects.every(subject => !subject.custom && subject.id && subject.id.startsWith(`sem${semNumber}_def_`));
    const needsDefaultUpdate = isDefaultSubjectList
      && (subjects.length !== predefined.length || subjects.some((subject, index) => {
        const updated = predefined[index];
        return subject.code !== updated.code
          || subject.name !== updated.name
          || subject.credits !== updated.credits
          || subject.type !== updated.type
          || subject.internalMaxMarks !== updated.internalMaxMarks
          || subject.externalMaxMarks !== updated.externalMaxMarks
          || subject.totalMaxMarks !== updated.totalMaxMarks;
      }));

    if (needsDefaultUpdate || !subjects || subjects.length === 0) {
      subjects = predefined.map((subject, index) => {
        const previous = (branchSubjects[branchId] || []).find(item => item.code === subject.code)
          || (branchSubjects[branchId] || []).find(item => item.name === subject.name);
        return {
          ...subject,
          id: previous ? previous.id : `sem${semNumber}_def_${index}_${Date.now()}`,
          grade: previous ? previous.grade : "",
          gradePoint: previous ? previous.gradePoint : null,
          marks: previous ? previous.marks : null,
          internalMarks: previous ? previous.internalMarks : null,
          externalMarks: previous ? previous.externalMarks : null,
          custom: false
        };
      });
      branchSubjects[branchId] = subjects;
      needsSave = true;
    }

    if (needsSave || semesterData.branchId !== branchId || semesterData.subjects !== subjects) {
      this.semestersData[semNumber] = {
        ...semesterData,
        mode: 'detailed',
        branchId,
        branchSubjects,
        subjects
      };
      StorageService.saveSemestersData(this.semestersData);
    }
  }

  getCurrentSubjects() {
    this.ensureSemesterSubjectDefaults(this.currentSemester);
    return this.semestersData[this.currentSemester].subjects || [];
  }

  saveCurrentSubjects(subjects) {
    if (!this.semestersData[this.currentSemester]) {
      this.semestersData[this.currentSemester] = { mode: 'detailed' };
    }
    const semesterData = this.semestersData[this.currentSemester];
    if (this.currentSemester >= 5) {
      const branchId = this.settings.selectedBranch || "cse";
      semesterData.branchId = branchId;
      semesterData.branchSubjects = { ...(semesterData.branchSubjects || {}), [branchId]: subjects };
    }
    semesterData.subjects = subjects;
    semesterData.mode = 'detailed';
    StorageService.saveSemestersData(this.semestersData);
  }

  render() {
    // Render Navbar
    renderNavbar(
      this.activeTab,
      this.settings.theme,
      (tabId) => this.switchTab(tabId),
      () => this.toggleTheme(),
      () => this.openTestRunner()
    );

    const mainContainer = document.getElementById('main-content-root');
    if (!mainContainer) return;

    if (this.activeTab === 'sgpa') {
      renderSGPAView(mainContainer, {
        currentSemester: this.currentSemester,
        currentSubjects: this.getCurrentSubjects(),
        gradingScale: this.gradingScale,
        inputMode: this.inputMode,
        settings: this.settings
      }, {
        onSemesterChange: (sem) => {
          this.currentSemester = sem;
          this.ensureSemesterSubjectDefaults(sem);
          this.render();
        },
        onInputModeChange: (mode) => {
          this.inputMode = mode;
          this.settings.inputMode = mode;
          StorageService.saveSettings(this.settings);
          this.render();
        },
        onSubjectGradeChange: (subId, grade) => {
          const subs = this.getCurrentSubjects().map(s => {
            if (s.id === subId) {
              const item = this.gradingScale.find(g => g.grade === grade);
              return { ...s, grade, gradePoint: item ? item.gradePoint : null };
            }
            return s;
          });
          this.saveCurrentSubjects(subs);
          this.render();
        },
        onSubjectMarksChange: (subId, marksStr, component, shouldRender = true) => {
          const subjects = this.getCurrentSubjects();
          const subject = subjects.find(item => item.id === subId);
          if (!subject) return;

          const marks = marksStr !== '' ? Number(marksStr) : null;
          if (component === 'internal') subject.internalMarks = marks;
          else if (component === 'external') subject.externalMarks = marks;
          else subject.marks = marks;

          this.saveCurrentSubjects(subjects);
          if (shouldRender) this.render();
        },
        onOpenCustomSubjectModal: () => this.openCustomSubjectModal(),
        onDeleteSubject: (subId) => {
          const subs = this.getCurrentSubjects().filter(s => s.id !== subId);
          this.saveCurrentSubjects(subs);
          this.render();
        },
        onResetSemester: () => {
          if (confirm(`Reset Semester ${this.currentSemester} back to predefined default subjects?`)) {
            delete this.semestersData[this.currentSemester];
            this.ensureSemesterSubjectDefaults(this.currentSemester);
            this.render();
          }
        },
        onSaveSemester: () => {
          this.switchTab('cgpa');
        }
      });
    } else if (this.activeTab === 'cgpa') {
      renderCGPAView(mainContainer, {
        semestersData: this.semestersData,
        gradingScale: this.gradingScale,
        settings: this.settings
      }, {
        onUpdateDirectSemester: (semNumber, sgpa, credits) => {
          this.semestersData[semNumber] = {
            mode: 'direct',
            sgpa,
            credits
          };
          StorageService.saveSemestersData(this.semestersData);
          this.render();
        },
        onNavigateToSGPA: (semNumber) => {
          this.currentSemester = semNumber;
          this.ensureSemesterSubjectDefaults(semNumber);
          this.switchTab('sgpa');
        }
      });
    } else if (this.activeTab === 'target') {
      renderTargetCGPAView(mainContainer, {
        targetData: this.targetData,
        settings: this.settings
      }, {
        onUpdateTargetInputs: (newTargetObj) => {
          this.targetData = { ...this.targetData, ...newTargetObj };
          this.render();
        }
      });
    } else if (this.activeTab === 'catalog') {
      renderCatalogView(mainContainer, {
        customSubjects: this.customSubjects,
        selectedBranch: this.settings.selectedBranch
      }, {
        onOpenCustomSubjectModal: () => this.openCustomSubjectModal()
      });
    } else if (this.activeTab === 'settings') {
      renderSettingsView(mainContainer, {
        settings: this.settings,
        gradingScale: this.gradingScale,
        branches: CS_BRANCHES
      }, {
        onUpdateSettings: (newSet) => {
          this.settings = { ...this.settings, ...newSet };
          StorageService.saveSettings(this.settings);
          this.applyTheme(this.settings.theme);
          this.render();
        },
        onSaveCustomGradingScale: (newScale) => {
          this.gradingScale = newScale;
          StorageService.saveGradingScale(this.gradingScale);
          this.render();
        },
        onExportJSON: () => {
          const jsonStr = StorageService.exportDataJSON();
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cgpa_calculator_backup_${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        },
        onExportCSV: () => {
          const csvStr = StorageService.exportSemesterSummaryCSV(
            Object.keys(this.semestersData).map(k => ({
              semester: k,
              mode: this.semestersData[k].mode,
              credits: this.semestersData[k].credits || 0,
              creditPoints: 0,
              sgpaFormatted: this.semestersData[k].sgpa || '--',
              isComplete: true
            }))
          );
          const blob = new Blob([csvStr], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `semester_summary_${new Date().toISOString().slice(0, 10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        },
        onImportJSON: (jsonStr) => {
          const res = StorageService.importDataJSON(jsonStr);
          alert(res.message);
          if (res.success) {
            window.location.reload();
          }
        },
        onClearAllData: () => {
          if (confirm("Are you sure you want to clear all saved calculations, custom subjects, and settings? This action cannot be undone.")) {
            StorageService.clearAllData();
            window.location.reload();
          }
        }
      });
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    this.render();
  }

  toggleTheme() {
    const current = this.settings.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    this.settings.theme = next;
    StorageService.saveSettings(this.settings);
    this.applyTheme(next);
    this.render();
  }

  openCustomSubjectModal() {
    const modalContainer = document.getElementById('modal-root');
    if (!modalContainer) return;

    renderCustomSubjectModal(modalContainer, {
      currentSemester: this.currentSemester,
      gradingScale: this.gradingScale
    }, (newCustomSub) => {
      // Add to current semester subjects
      const current = this.getCurrentSubjects();
      this.saveCurrentSubjects([...current, newCustomSub]);

      // Add to master custom subjects registry
      this.customSubjects.push(newCustomSub);
      StorageService.saveCustomSubjects(this.customSubjects);

      this.render();
    }, () => {});
  }

  openTestRunner() {
    const modalContainer = document.getElementById('modal-root');
    if (!modalContainer) return;
    renderTestRunnerModal(modalContainer, () => {});
  }
}

// Bootstrap App when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.render();
});
