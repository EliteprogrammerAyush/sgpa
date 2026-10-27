/**
 * Main Application Bootstrap & Controller
 */

import { StorageService } from './services/storageService.js';
import { PREDEFINED_SUBJECTS } from './config/subjects.js';
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
    if (!this.semestersData[semNumber] || !Array.isArray(this.semestersData[semNumber].subjects)) {
      const predefined = PREDEFINED_SUBJECTS[semNumber] || [];
      const defaultSubjects = predefined.map((s, i) => ({
        id: `sem${semNumber}_def_${i}_${Date.now()}`,
        code: s.code,
        name: s.name,
        credits: s.credits,
        type: s.type,
        grade: "",
        marks: null,
        custom: false
      }));

      this.semestersData[semNumber] = {
        mode: 'detailed',
        subjects: defaultSubjects
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
    this.semestersData[this.currentSemester].subjects = subjects;
    this.semestersData[this.currentSemester].mode = 'detailed';
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
        onSubjectMarksChange: (subId, marksStr) => {
          const subs = this.getCurrentSubjects().map(s => {
            if (s.id === subId) {
              return { ...s, marks: marksStr !== '' ? Number(marksStr) : null };
            }
            return s;
          });
          this.saveCurrentSubjects(subs);
          this.render();
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
        customSubjects: this.customSubjects
      }, {
        onOpenCustomSubjectModal: () => this.openCustomSubjectModal()
      });
    } else if (this.activeTab === 'settings') {
      renderSettingsView(mainContainer, {
        settings: this.settings,
        gradingScale: this.gradingScale
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
