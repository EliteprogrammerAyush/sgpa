/**
 * Custom Subject Adder Modal Component — Simple Human-Centered Design
 */

import { SUBJECT_TYPES } from '../config/gradingRules.js';

export function renderCustomSubjectModal(container, state, onSaveCustomSubject, onClose) {
  const { currentSemester, gradingScale } = state;

  const html = `
    <div class="modal-overlay active" id="custom-modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="card-title">Add Custom Subject</h3>
          <button class="btn-icon" id="modal-close-btn" style="border: none; background: transparent; cursor: pointer;">✕</button>
        </div>
        <div class="modal-body">
          <form id="custom-subject-form">
            <div class="form-group">
              <label class="form-label">Subject Name *</label>
              <input type="text" class="form-control" id="custom-sub-name" placeholder="e.g. Advanced Robotics" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">Subject Code *</label>
                <input type="text" class="form-control" id="custom-sub-code" placeholder="e.g. AR401" required>
              </div>

              <div class="form-group">
                <label class="form-label">Credits *</label>
                <input type="number" step="0.5" min="0" max="20" class="form-control" id="custom-sub-credits" value="3.0" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">Type</label>
                <select class="form-control" id="custom-sub-type">
                  ${SUBJECT_TYPES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Initial Grade</label>
                <select class="form-control" id="custom-sub-grade">
                  <option value="">-- Grade --</option>
                  ${gradingScale.map(g => `<option value="${g.grade}">${g.grade} (${g.gradePoint})</option>`).join('')}
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-save-btn">Add Subject</button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const close = () => {
    container.innerHTML = '';
    onClose();
  };

  container.querySelector('#modal-close-btn').addEventListener('click', close);
  container.querySelector('#modal-cancel-btn').addEventListener('click', close);

  container.querySelector('#modal-save-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const name = container.querySelector('#custom-sub-name').value.trim();
    const code = container.querySelector('#custom-sub-code').value.trim();
    const credits = Number(container.querySelector('#custom-sub-credits').value);
    const type = container.querySelector('#custom-sub-type').value;
    const grade = container.querySelector('#custom-sub-grade').value;

    if (!name || !code || isNaN(credits) || credits < 0) {
      alert("Please enter a valid subject name, code, and credits.");
      return;
    }

    onSaveCustomSubject({
      id: `custom_${Date.now()}`,
      code,
      name,
      credits,
      type,
      grade,
      semester: currentSemester,
      custom: true
    });

    close();
  });
}
