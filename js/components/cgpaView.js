/**
 * CGPA Calculator View Component — Simple Human-Centered Design
 */

import { calculateCGPA } from '../engine/calculatorEngine.js';

export function renderCGPAView(container, state, handlers) {
  const { semestersData, gradingScale, settings } = state;
  const { onUpdateDirectSemester, onNavigateToSGPA } = handlers;

  const semesterList = [];
  for (let sem = 1; sem <= 8; sem++) {
    const semData = semestersData[sem];
    if (semData && semData.mode === 'direct') {
      semesterList.push({
        semester: sem,
        mode: 'direct',
        sgpa: semData.sgpa,
        credits: semData.credits
      });
    } else if (semData && Array.isArray(semData.subjects) && semData.subjects.length > 0) {
      semesterList.push({
        semester: sem,
        mode: 'detailed',
        subjects: semData.subjects
      });
    } else {
      semesterList.push({
        semester: sem,
        mode: 'direct',
        sgpa: null,
        credits: null
      });
    }
  }

  const cgpaResult = calculateCGPA(semesterList, gradingScale, {
    decimalPlaces: settings.decimalPlaces
  });

  const completedCount = cgpaResult.semesterBreakdown.filter(s => s.isComplete && s.credits > 0).length;

  const html = `
    <div class="grid grid-cols-12">

      <!-- CGPA Clean Score Card -->
      <div class="col-span-12 score-box" style="background-color: var(--bg-card); border-color: var(--border-color);">
        <div class="score-label" style="color: var(--text-muted);">Overall Cumulative CGPA</div>
        <div class="score-value" style="color: var(--primary);">
          ${cgpaResult.totalCredits > 0 ? cgpaResult.cgpaFormatted : '--'}
        </div>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">
          Total Credits: <strong>${cgpaResult.totalCredits}</strong> across <strong>${completedCount}</strong> Semester(s)
        </div>
      </div>

      <!-- Credit-Weighted Notice -->
      ${cgpaResult.isSimpleAverageDifferent ? `
        <div class="col-span-12 alert alert-info">
          <div>
            <strong>Credit-Weighted Calculation</strong>
            <p style="margin-top: 0.15rem; font-size: 0.8125rem;">
              Your true CGPA is <strong>${cgpaResult.cgpaFormatted}</strong> based on total credit weight. Simple average of SGPAs is ${cgpaResult.simpleAverage}.
            </p>
          </div>
        </div>
      ` : ''}

      <!-- Semester Table -->
      <div class="col-span-8 card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Semester Scores</h2>
            <div class="card-subtitle">Enter SGPAs directly or click edit to calculate from subjects</div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Credits</th>
                <th>Points</th>
                <th>SGPA</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${cgpaResult.semesterBreakdown.map(s => {
                const isDetailed = s.mode === 'detailed';
                return `
                  <tr>
                    <td style="font-weight: 600;">Semester ${s.semester}</td>
                    <td>
                      ${isDetailed ? `
                        <span style="font-weight: 600;">${s.credits}</span>
                      ` : `
                        <input type="number" step="0.5" min="0" class="form-control direct-credits-input" data-sem="${s.semester}" value="${s.credits || ''}" placeholder="Credits" style="width: 75px; padding: 0.25rem 0.4rem; font-weight: 600;">
                      `}
                    </td>
                    <td style="font-weight: 600;">
                      ${s.isComplete ? s.creditPoints : '--'}
                    </td>
                    <td style="font-weight: 700; color: var(--primary);">
                      ${isDetailed ? (s.isComplete ? s.sgpaFormatted : '--') : `
                        <input type="number" step="0.01" min="0" max="10" class="form-control direct-sgpa-input" data-sem="${s.semester}" value="${s.sgpa !== undefined && s.sgpa !== null ? s.sgpa : ''}" placeholder="SGPA" style="width: 80px; padding: 0.25rem 0.4rem; font-weight: 700; color: var(--primary);">
                      `}
                    </td>
                    <td>
                      ${s.isComplete ? `<span class="badge badge-emerald">Done</span>` : `<span class="badge badge-slate">Empty</span>`}
                    </td>
                    <td style="text-align: right;">
                      <button class="btn btn-secondary btn-sm btn-open-sem" data-sem="${s.semester}">
                        Edit Subjects
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td style="text-align: right;">Total:</td>
                <td style="color: var(--primary); font-weight: 700;">${cgpaResult.totalCredits}</td>
                <td style="color: var(--primary); font-weight: 700;">${cgpaResult.totalCreditPoints}</td>
                <td style="color: var(--primary); font-weight: 700;">${cgpaResult.cgpaFormatted}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Right Column: Trend Chart & Formula -->
      <div class="col-span-4 grid" style="gap: 1.25rem;">
        
        <!-- Simple Bar Trend -->
        <div class="card">
          <div class="card-header" style="margin-bottom: 0.5rem;">
            <h3 class="card-title" style="font-size: 0.875rem;">Semester SGPA Chart</h3>
          </div>
          <div style="width: 100%; height: 160px; display: flex; align-items: flex-end; justify-content: space-around; padding-top: 1rem;">
            ${cgpaResult.semesterBreakdown.map(s => {
              const heightPct = s.isComplete && s.sgpa ? Math.min(100, (s.sgpa / 10) * 100) : 4;
              return `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem; flex: 1; height: 100%; justify-content: flex-end;">
                  <div style="font-size: 0.65rem; font-weight: 600; color: var(--primary);">
                    ${s.isComplete ? s.sgpaFormatted : ''}
                  </div>
                  <div style="width: 50%; max-width: 22px; height: ${heightPct}%; background-color: var(--primary); border-radius: 3px 3px 0 0;"></div>
                  <div style="font-size: 0.6875rem; color: var(--text-muted);">S${s.semester}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Formula Explanation -->
        <div class="card">
          <div class="card-header" style="margin-bottom: 0.5rem;">
            <h3 class="card-title" style="font-size: 0.875rem;">CGPA Formula</h3>
          </div>
          <div class="formula-box">
${cgpaResult.formulaExplanation}
          </div>
        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('.direct-sgpa-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const sem = Number(e.target.getAttribute('data-sem'));
      const val = e.target.value !== '' ? Number(e.target.value) : null;
      const creditsInp = container.querySelector(`.direct-credits-input[data-sem="${sem}"]`);
      const creditsVal = creditsInp && creditsInp.value !== '' ? Number(creditsInp.value) : 20;
      onUpdateDirectSemester(sem, val, creditsVal);
    });
  });

  container.querySelectorAll('.direct-credits-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const sem = Number(e.target.getAttribute('data-sem'));
      const creditsVal = e.target.value !== '' ? Number(e.target.value) : null;
      const sgpaInp = container.querySelector(`.direct-sgpa-input[data-sem="${sem}"]`);
      const sgpaVal = sgpaInp && sgpaInp.value !== '' ? Number(sgpaInp.value) : 0;
      onUpdateDirectSemester(sem, sgpaVal, creditsVal);
    });
  });

  container.querySelectorAll('.btn-open-sem').forEach(btn => {
    btn.addEventListener('click', () => {
      const sem = Number(btn.getAttribute('data-sem'));
      onNavigateToSGPA(sem);
    });
  });
}
