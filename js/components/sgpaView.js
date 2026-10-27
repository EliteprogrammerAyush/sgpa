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

  const renderMarksInput = (subject) => {
    const hasSplitMarks = Number.isFinite(subject.internalMaxMarks)
      && Number.isFinite(subject.externalMaxMarks);
    if (!hasSplitMarks) {
      const maxMarks = subject.totalMaxMarks || 100;
      return `<input type="number" min="0" max="${maxMarks}" class="form-control marks-input" data-component="total" data-id="${subject.id}" value="${subject.marks ?? ''}" placeholder="0-${maxMarks}" aria-label="Total marks, maximum ${maxMarks}" style="padding: 0.35rem 0.5rem; width: 100px; font-weight: 600;">`;
    }

    const hasBothMarks = subject.internalMarks !== null && subject.internalMarks !== undefined && subject.internalMarks !== ""
      && subject.externalMarks !== null && subject.externalMarks !== undefined && subject.externalMarks !== "";
    const totalMarks = hasBothMarks
      ? Number(subject.internalMarks) + Number(subject.externalMarks)
      : subject.marks ?? "";

    return `
      <div style="display: flex; align-items: center; gap: 0.25rem;">
        <input type="number" min="0" max="${subject.internalMaxMarks}" class="form-control marks-input" data-component="internal" data-id="${subject.id}" value="${subject.internalMarks ?? ''}" placeholder="IA/${subject.internalMaxMarks}" aria-label="Internal assessment marks, maximum ${subject.internalMaxMarks}" style="padding: 0.35rem 0.25rem; width: 82px; font-weight: 600;">
        <span aria-hidden="true">+</span>
        <input type="number" min="0" max="${subject.externalMaxMarks}" class="form-control marks-input" data-component="external" data-id="${subject.id}" value="${subject.externalMarks ?? ''}" placeholder="ETE/${subject.externalMaxMarks}" aria-label="End-term exam marks, maximum ${subject.externalMaxMarks}" style="padding: 0.35rem 0.25rem; width: 82px; font-weight: 600;">
        <span aria-hidden="true">=</span>
        <span class="text-muted" aria-label="Total marks" data-total-marks-for="${subject.id}">${totalMarks}</span>
      </div>
    `;
  };

  const sgpaResult = calculateSGPA(currentSubjects, gradingScale, {
    inputMode,
    decimalPlaces: settings.decimalPlaces,
    blockOnIncomplete: true
  });

  const updateMarksResult = (subjectId) => {
    const result = calculateSGPA(currentSubjects, gradingScale, {
      inputMode: 'marks',
      decimalPlaces: settings.decimalPlaces,
      blockOnIncomplete: true
    });
    const subjectResult = result.subjectBreakdown.find(subject => subject.id === subjectId);
    const currentSubject = currentSubjects.find(subject => subject.id === subjectId);

    if (subjectResult) {
      container.querySelectorAll(`[data-grade-point-for="${subjectId}"]`).forEach(element => {
        element.textContent = subjectResult.isMissingGrade ? '--' : subjectResult.gradePoint;
      });
      container.querySelectorAll(`[data-credit-points-for="${subjectId}"]`).forEach(element => {
        element.textContent = subjectResult.isMissingGrade ? '--' : subjectResult.creditPoints;
      });
    }

    if (currentSubject) {
      const hasSplitMarks = Number.isFinite(currentSubject.internalMaxMarks)
        && Number.isFinite(currentSubject.externalMaxMarks);
      const hasBothMarks = currentSubject.internalMarks !== null && currentSubject.internalMarks !== undefined
        && currentSubject.internalMarks !== "" && currentSubject.externalMarks !== null
        && currentSubject.externalMarks !== undefined && currentSubject.externalMarks !== "";
      const totalMarks = hasSplitMarks
        ? hasBothMarks ? Number(currentSubject.internalMarks) + Number(currentSubject.externalMarks) : currentSubject.marks ?? ''
        : currentSubject.marks ?? '';
      container.querySelectorAll(`[data-total-marks-for="${subjectId}"]`).forEach(element => {
        element.textContent = totalMarks;
      });
    }

    const score = container.querySelector('#sgpa-score');
    const scoreSubtitle = container.querySelector('#sgpa-score-subtitle');
    const totalCredits = container.querySelector('#sgpa-total-credits');
    const totalPoints = container.querySelector('#sgpa-total-points');
    const formula = container.querySelector('#sgpa-formula');
    const incompleteAlert = container.querySelector('#incomplete-grade-alert');

    if (score) score.textContent = result.isComplete ? result.sgpaFormatted : '--';
    if (scoreSubtitle) {
      scoreSubtitle.textContent = result.isComplete
        ? `${result.totalCredits} Credits Considered`
        : 'Enter all grades to view score';
    }
    if (totalCredits) totalCredits.textContent = result.totalCredits;
    if (totalPoints) totalPoints.textContent = result.totalCreditPoints;
    if (formula) formula.textContent = result.formulaExplanation;
    if (incompleteAlert) {
      incompleteAlert.style.display = result.isComplete ? 'none' : '';
      const heading = incompleteAlert.querySelector('strong');
      const details = incompleteAlert.querySelector('p');
      if (heading) heading.textContent = `Incomplete Grades (${result.missingSubjects.length} pending)`;
      if (details) {
        details.textContent = `Please select grades or enter marks for all subjects (${result.missingSubjects.map(subject => subject.code).join(', ')}) to view your SGPA.`;
      }
    }
  };

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
        <div class="col-span-12 alert alert-warning" id="incomplete-grade-alert">
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
                <th>${inputMode === 'grade' ? 'Grade' : 'IA / ETE (Total)'}</th>
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
                        ${renderMarksInput(sub)}
                      `}
                    </td>
                    <td style="font-weight: 600;" data-grade-point-for="${sub.id}">
                      ${subPoint.isMissingGrade ? '<span style="color: var(--accent-danger);">--</span>' : subPoint.gradePoint}
                    </td>
                    <td style="font-weight: 600; color: var(--primary);" data-credit-points-for="${sub.id}">
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
                      ${renderMarksInput(sub)}
                    `}
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.75rem;">Credit Points</label>
                    <div class="credit-point-value" data-credit-points-for="${sub.id}" style="font-weight: 700; font-size: 1rem; color: var(--primary);">
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
          <div class="score-value" id="sgpa-score">
            ${sgpaResult.isComplete ? sgpaResult.sgpaFormatted : '--'}
          </div>
          <div id="sgpa-score-subtitle" style="font-size: 0.8125rem; opacity: 0.9;">
            ${sgpaResult.isComplete ? `${sgpaResult.totalCredits} Credits Considered` : 'Enter all grades to view score'}
          </div>
        </div>

        <!-- Metrics -->
        <div class="card" style="padding: 1rem 1.25rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="text-muted" style="font-size: 0.875rem;">Total Credits:</span>
            <span id="sgpa-total-credits" style="font-weight: 700;">${sgpaResult.totalCredits}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span class="text-muted" style="font-size: 0.875rem;">Total Credit Points:</span>
            <span id="sgpa-total-points" style="font-weight: 700; color: var(--primary);">${sgpaResult.totalCreditPoints}</span>
          </div>
        </div>

        <!-- How it is calculated -->
        <div class="card">
          <div class="card-header" style="margin-bottom: 0.5rem; padding-bottom: 0.375rem;">
            <h3 class="card-title" style="font-size: 0.875rem;">Calculation Formula</h3>
          </div>
          <div class="formula-box" id="sgpa-formula">
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
    inp.addEventListener('input', (e) => {
      const subjectId = inp.getAttribute('data-id');
      onSubjectMarksChange(subjectId, e.target.value, inp.getAttribute('data-component'), false);
      updateMarksResult(subjectId);
    });
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
