/**
 * Target CGPA Goal View Component — Simple Human-Centered Design
 */

import { calculateTargetSGPA } from '../engine/calculatorEngine.js';

export function renderTargetCGPAView(container, state, handlers) {
  const { targetData = {}, settings } = state;
  const { onUpdateTargetInputs } = handlers;

  const currentCGPA = targetData.currentCGPA !== undefined ? targetData.currentCGPA : 8.0;
  const completedCredits = targetData.completedCredits !== undefined ? targetData.completedCredits : 60;
  const targetCGPA = targetData.targetCGPA !== undefined ? targetData.targetCGPA : 8.5;
  const remainingCredits = targetData.remainingCredits !== undefined ? targetData.remainingCredits : 20;

  const result = calculateTargetSGPA(
    currentCGPA,
    completedCredits,
    targetCGPA,
    remainingCredits,
    10.0,
    settings.decimalPlaces
  );

  const html = `
    <div class="grid grid-cols-12">
      
      <!-- Intro Card -->
      <div class="col-span-12 card" style="padding: 1.25rem;">
        <h2 class="card-title">Target CGPA Planner</h2>
        <p class="card-subtitle" style="margin-top: 0.25rem;">
          Calculate what average SGPA you need in your remaining credits to achieve your target CGPA.
        </p>
      </div>

      <!-- Inputs Form Card -->
      <div class="col-span-6 card">
        <div class="card-header">
          <h3 class="card-title">Your Details</h3>
        </div>

        <div class="form-group">
          <label class="form-label">Current CGPA</label>
          <input type="number" step="0.01" min="0" max="10" class="form-control" id="target-cur-cgpa" value="${currentCGPA}">
        </div>

        <div class="form-group">
          <label class="form-label">Completed Credits</label>
          <input type="number" step="0.5" min="0" class="form-control" id="target-comp-credits" value="${completedCredits}">
        </div>

        <div class="form-group">
          <label class="form-label">Target CGPA Goal</label>
          <input type="number" step="0.01" min="0" max="10" class="form-control" id="target-goal-cgpa" value="${targetCGPA}" style="font-weight: 700; color: var(--primary);">
        </div>

        <div class="form-group">
          <label class="form-label">Remaining Credits</label>
          <input type="number" step="0.5" min="1" class="form-control" id="target-rem-credits" value="${remainingCredits}">
        </div>
      </div>

      <!-- Right Column: Result Box -->
      <div class="col-span-6 grid" style="gap: 1.25rem;">

        <!-- Clean Score Box -->
        <div class="score-box" style="background-color: ${result.isAchievable ? 'var(--primary-light)' : 'var(--accent-danger-light)'}; border-color: ${result.isAchievable ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${result.isAchievable ? 'var(--primary)' : 'var(--accent-danger)'};">
          <div class="score-label" style="color: ${result.isAchievable ? 'var(--text-secondary)' : 'var(--accent-danger)'};">
            ${result.isAchievable ? 'Required Future SGPA' : 'Target Not Achievable'}
          </div>
          <div class="score-value">
            ${result.requiredSGPAFormatted}
          </div>
          <div style="font-size: 0.8125rem;">
            ${result.isAchievable
              ? `You need an average SGPA of ${result.requiredSGPAFormatted} across remaining ${remainingCredits} credits.`
              : result.errorMessage}
          </div>
        </div>

        <!-- Calculation Box -->
        <div class="card">
          <div class="card-header" style="margin-bottom: 0.5rem;">
            <h3 class="card-title" style="font-size: 0.875rem;">Formula Breakdown</h3>
          </div>
          <div class="formula-box">
${result.formulaExplanation}
          </div>
        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;

  const curInp = container.querySelector('#target-cur-cgpa');
  const compInp = container.querySelector('#target-comp-credits');
  const goalInp = container.querySelector('#target-goal-cgpa');
  const remInp = container.querySelector('#target-rem-credits');

  const update = () => {
    onUpdateTargetInputs({
      currentCGPA: Number(curInp.value) || 0,
      completedCredits: Number(compInp.value) || 0,
      targetCGPA: Number(goalInp.value) || 0,
      remainingCredits: Number(remInp.value) || 0
    });
  };

  [curInp, compInp, goalInp, remInp].forEach(inp => {
    if (inp) inp.addEventListener('input', update);
  });
}
