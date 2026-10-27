/**
 * SGPA Calculator View Component — Simple Human-Centered Design
 */

import { calculateSGPA } from '../engine/calculatorEngine.js';

export function renderSGPAView(container, state, handlers) {
  const {
    currentSemester,
    currentSubjects,
    gradingScale,
    inputMode,
    settings
  } = state;

  const {
    onSemesterChange,
    onInputModeChange,
    onSubjectGradeChange,
    onSubjectMarksChange,
    onOpenCustomSubjectModal,
    onDeleteSubject,
    onSaveSemester,
    onResetSemester
  } = handlers;

  const sgpaResult = calculateSGPA(currentSubjects, gradingScale, {
    inputMode,
    decimalPlaces: settings.decimalPlaces,
    blockOnIncomplete: true
  });

  const html = `
    <div class="grid grid-cols-12">
      
      <!-- Control Bar -->
      <div class="col-span-12 card" style="padding: 1rem 1.25rem;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
          
          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div>
              <label class="form-label" style="margin-bottom: 0.2rem;">Semester</label>
              <select class="form-control" id="sem-select" style="min-width: 150px; font-weight: 600;">
                ${[1,2,3,4,5,6,7,8].map(s => `
                  <option value="${s}" ${currentSemester === s ? 'selected' : ''}>Semester ${s}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="form-label" style="margin-bottom: 0.2rem;">Grading Mode</label>
              <div style="display: flex; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <button class="btn btn-sm ${inputMode === 'grade' ? 'btn-primary' : 'btn-secondary'}" id="btn-mode-grade" style="border-radius: 0;">
                  By Grade
                </button>
                <button class="btn btn-sm ${inputMode === 'marks' ? 'btn-primary' : 'btn-secondary'}" id="btn-mode-marks" style="border-radius: 0;">
                  By Marks
                </button>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" id="btn-add-custom">
              + Custom Subject
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-reset-sem">
              Reset
            </button>
            <button class="btn btn-primary btn-sm" id="btn-save-sem">
              Save Semester
            </button>
          </div>
        </div>
      </div>

      <!-- Incomplete Grade Alert -->
      ${!sgpaResult.isComplete ? `
        <div class="col-span-12 alert alert-warning">
          <div>
            <strong>Incomplete Grades (${sgpaResult.missingSubjects.length} pending)</strong>
            <p style="margin-top: 0.15rem; font-size: 0.8125rem;">
              Please select grades or enter marks for all subjects (${sgpaResult.missingSubjects.map(s => s.code).join(', ')}) to view your SGPA.
            </p>
          </div>
        </div>
      ` : ''}

      <!-- Main Subject List Table -->
      <div class="col-span-8 card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Semester ${currentSemester} Subjects</h2>
            <div class="card-subtitle">${currentSubjects.length} subjects</div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="table-responsive table-desktop">
          <table class="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Credits</th>
                <th>${inputMode === 'grade' ? 'Grade' : 'Marks (0-100)'}</th>
                <th>Grade Point</th>
                <th>Credit × GP</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${currentSubjects.map((sub, idx) => {
                const subPoint = sgpaResult.subjectBreakdown[idx] || {};
                return `
                  <tr>
                    <td style="font-weight: 600; font-family: monospace;">${sub.code}</td>
                    <td style="font-weight: 500;">
                      ${sub.name}
                      ${sub.custom ? `<span class="badge badge-purple" style="margin-left: 0.25rem;">Custom</span>` : ''}
                    </td>
                    <td style="font-weight: 600;">${sub.credits}</td>
                    <td>
                      ${inputMode === 'grade' ? `
                        <select class="form-control grade-input" data-id="${sub.id}" style="padding: 0.35rem 0.5rem; font-weight: 600; width: 110px;">
                          <option value="">-- Grade --</option>
                          ${gradingScale.map(g => `
                            <option value="${g.grade}" ${sub.grade === g.grade ? 'selected' : ''}>${g.grade} (${g.gradePoint})</option>
                          `).join('')}
                        </select>
                      ` : `
                        <input type="number" min="0" max="100" class="form-control marks-input" data-id="${sub.id}" value="${sub.marks !== undefined && sub.marks !== null ? sub.marks : ''}" placeholder="Marks" style="padding: 0.35rem 0.5rem; width: 90px; font-weight: 600;">
                      `}
                    </td>
                    <td style="font-weight: 600;">
                      ${subPoint.isMissingGrade ? '<span style="color: var(--accent-danger);">--</span>' : subPoint.gradePoint}
                    </td>
                    <td style="font-weight: 600; color: var(--primary);">
                      ${subPoint.isMissingGrade ? '--' : subPoint.creditPoints}
                    </td>
                    <td style="text-align: right;">
                      <button class="btn btn-secondary btn-sm btn-delete-sub" data-id="${sub.id}" title="Remove Subject">
                        Remove
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right;">Total Credits:</td>
                <td style="color: var(--primary); font-weight: 700;">${sgpaResult.totalCredits}</td>
                <td colspan="2" style="text-align: right;">Total Grade Points:</td>
                <td style="color: var(--primary); font-weight: 700;">${sgpaResult.totalCreditPoints}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-subjects-list">
          ${currentSubjects.map((sub, idx) => {
            const subPoint = sgpaResult.subjectBreakdown[idx] || {};
            return `
              <div class="subject-mobile-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.375rem;">
                  <div>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${sub.code}</span>
                    <h4 style="font-size: 0.95rem; font-weight: 600;">${sub.name}</h4>
                  </div>
                  <button class="btn btn-secondary btn-sm btn-delete-sub" data-id="${sub.id}" style="padding: 0.2rem 0.5rem;">Remove</button>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                  <span class="badge badge-slate">${sub.credits} Credits</span>
                </div>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                  <div style="flex: 1;">
                    <label class="form-label" style="font-size: 0.75rem;">Grade / Marks</label>
                    ${inputMode === 'grade' ? `
                      <select class="form-control grade-input" data-id="${sub.id}">
                        <option value="">-- Select Grade --</option>
                        ${gradingScale.map(g => `<option value="${g.grade}" ${sub.grade === g.grade ? 'selected' : ''}>${g.grade} (${g.gradePoint})</option>`).join('')}
                      </select>
                    ` : `
                      <input type="number" min="0" max="100" class="form-control marks-input" data-id="${sub.id}" value="${sub.marks !== undefined && sub.marks !== null ? sub.marks : ''}" placeholder="Marks">
                    `}
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.75rem;">Credit Points</label>
                    <div style="font-weight: 700; font-size: 1rem; color: var(--primary);">
                      ${subPoint.isMissingGrade ? '--' : subPoint.creditPoints}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Column: Result Summary Card -->
      <div class="col-span-4 grid" style="gap: 1.25rem; height: fit-content;">
        
        <!-- Clean Score Box -->
        <div class="score-box">
          <div class="score-label">Semester ${currentSemester} SGPA</div>
          <div class="score-value">
            ${sgpaResult.isComplete ? sgpaResult.sgpaFormatted : '--'}
          </div>
          <div style="font-size: 0.8125rem; opacity: 0.9;">
            ${sgpaResult.isComplete ? `${sgpaResult.totalCredits} Credits Considered` : 'Enter all grades to view score'}
          </div>
        </div>

        <!-- Metrics -->
        <div class="card" style="padding: 1rem 1.25rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="text-muted" style="font-size: 0.875rem;">Total Credits:</span>
            <span style="font-weight: 700;">${sgpaResult.totalCredits}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span class="text-muted" style="font-size: 0.875rem;">Total Credit Points:</span>
            <span style="font-weight: 700; color: var(--primary);">${sgpaResult.totalCreditPoints}</span>
          </div>
        </div>

        <!-- How it is calculated -->
        <div class="card">
          <div class="card-header" style="margin-bottom: 0.5rem; padding-bottom: 0.375rem;">
            <h3 class="card-title" style="font-size: 0.875rem;">Calculation Formula</h3>
          </div>
          <div class="formula-box">
${sgpaResult.formulaExplanation}
          </div>
        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;

  // Event Listeners
  const semSelect = container.querySelector('#sem-select');
  if (semSelect) semSelect.addEventListener('change', (e) => onSemesterChange(Number(e.target.value)));

  const btnGrade = container.querySelector('#btn-mode-grade');
  if (btnGrade) btnGrade.addEventListener('click', () => onInputModeChange('grade'));

  const btnMarks = container.querySelector('#btn-mode-marks');
  if (btnMarks) btnMarks.addEventListener('click', () => onInputModeChange('marks'));

  container.querySelectorAll('.grade-input').forEach(sel => {
    sel.addEventListener('change', (e) => onSubjectGradeChange(e.target.getAttribute('data-id'), e.target.value));
  });

  container.querySelectorAll('.marks-input').forEach(inp => {
    inp.addEventListener('input', (e) => onSubjectMarksChange(inp.getAttribute('data-id'), e.target.value));
  });

  container.querySelectorAll('.btn-delete-sub').forEach(btn => {
    btn.addEventListener('click', () => onDeleteSubject(btn.getAttribute('data-id')));
  });

  const addCustomBtn = container.querySelector('#btn-add-custom');
  if (addCustomBtn) addCustomBtn.addEventListener('click', onOpenCustomSubjectModal);

  const resetBtn = container.querySelector('#btn-reset-sem');
  if (resetBtn) resetBtn.addEventListener('click', onResetSemester);

  const saveBtn = container.querySelector('#btn-save-sem');
  if (saveBtn) saveBtn.addEventListener('click', onSaveSemester);
}
