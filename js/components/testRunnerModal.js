/**
 * Accuracy Verification Test Runner Modal — Simple Human-Centered Design
 */

import { runAutomatedTests } from '../engine/calculatorTests.js';

export function renderTestRunnerModal(container, onClose) {
  const { allPassed, results } = runAutomatedTests();

  const html = `
    <div class="modal-overlay active" id="test-modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="card-title">Accuracy Test Check</h3>
          <button class="btn-icon" id="test-modal-close" style="border: none; background: transparent; cursor: pointer;">✕</button>
        </div>
        <div class="modal-body">
          <div class="alert ${allPassed ? 'alert-info' : 'alert-warning'}" style="margin-bottom: 1rem;">
            <div>
              <strong>${allPassed ? `All ${results.length} Accuracy Tests Passed` : 'Tests Failed'}</strong>
              <p style="margin-top: 0.15rem; font-size: 0.8125rem;">
                Verified SGPA/CGPA calculations, RTU IA/ETE marks, semester subject defaults, and incomplete-mark handling.
              </p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${results.map(r => `
              <div class="card" style="padding: 0.625rem 0.875rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.875rem; font-weight: 500;">${r.name}</span>
                  <span class="badge ${r.passed ? 'badge-emerald' : 'badge-rose'}">
                    ${r.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="test-modal-ok">Close</button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const close = () => {
    container.innerHTML = '';
    if (onClose) onClose();
  };

  container.querySelector('#test-modal-close').addEventListener('click', close);
  container.querySelector('#test-modal-ok').addEventListener('click', close);
}
