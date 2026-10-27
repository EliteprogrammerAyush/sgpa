/**
 * Settings & Configuration View Component — Simple Human-Centered Design
 */

export function renderSettingsView(container, state, handlers) {
  const { settings, gradingScale } = state;
  const {
    onUpdateSettings,
    onSaveCustomGradingScale,
    onExportJSON,
    onExportCSV,
    onImportJSON,
    onClearAllData
  } = handlers;

  const html = `
    <div class="grid grid-cols-12">
      
      <!-- Theme & Display Preferences Card -->
      <div class="col-span-6 card">
        <div class="card-header">
          <h2 class="card-title">Preferences</h2>
        </div>

        <div class="form-group">
          <label class="form-label">Theme Mode</label>
          <select class="form-control" id="pref-theme">
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light Theme</option>
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark Theme</option>
            <option value="system" ${settings.theme === 'system' ? 'selected' : ''}>System Default</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Decimal Precision</label>
          <select class="form-control" id="pref-decimal">
            <option value="1" ${settings.decimalPlaces === 1 ? 'selected' : ''}>1 Decimal Place (e.g. 8.6)</option>
            <option value="2" ${settings.decimalPlaces === 2 ? 'selected' : ''}>2 Decimal Places (Default - e.g. 8.57)</option>
            <option value="3" ${settings.decimalPlaces === 3 ? 'selected' : ''}>3 Decimal Places (e.g. 8.571)</option>
            <option value="4" ${settings.decimalPlaces === 4 ? 'selected' : ''}>4 Decimal Places (e.g. 8.5714)</option>
          </select>
        </div>
      </div>

      <!-- Backup & Restore Card -->
      <div class="col-span-6 card">
        <div class="card-header">
          <h2 class="card-title">Backup & Restore</h2>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <label class="form-label">Export Data</label>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" id="btn-export-json">
                Export JSON
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-export-csv">
                Export CSV
              </button>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
            <label class="form-label">Import Data</label>
            <input type="file" id="file-import-json" accept=".json" style="display: none;">
            <button class="btn btn-secondary btn-sm" id="btn-import-trigger">
              Import JSON File
            </button>
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
            <label class="form-label" style="color: var(--accent-danger);">Reset Everything</label>
            <button class="btn btn-danger btn-sm" id="btn-clear-all">
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <!-- Configurable Grading Scale -->
      <div class="col-span-12 card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Grading Scale</h2>
            <div class="card-subtitle">Adjust grade points according to your university</div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Grade Point (GP)</th>
                <th>Min Marks</th>
                <th>Max Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${gradingScale.map((item, idx) => `
                <tr>
                  <td style="font-weight: 700; color: var(--primary);">${item.grade}</td>
                  <td>
                    <input type="number" step="0.1" min="0" max="10" class="form-control scale-gp" data-idx="${idx}" value="${item.gradePoint}" style="width: 75px; padding: 0.25rem 0.4rem;">
                  </td>
                  <td>
                    <input type="number" min="0" max="100" class="form-control scale-min" data-idx="${idx}" value="${item.minMarks}" style="width: 75px; padding: 0.25rem 0.4rem;">
                  </td>
                  <td>
                    <input type="number" min="0" max="100" class="form-control scale-max" data-idx="${idx}" value="${item.maxMarks}" style="width: 75px; padding: 0.25rem 0.4rem;">
                  </td>
                  <td>
                    <span class="badge ${item.isPass ? 'badge-emerald' : 'badge-rose'}">
                      ${item.isPass ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;

  const themeSelect = container.querySelector('#pref-theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      onUpdateSettings({ theme: e.target.value });
    });
  }

  const decimalSelect = container.querySelector('#pref-decimal');
  if (decimalSelect) {
    decimalSelect.addEventListener('change', (e) => {
      onUpdateSettings({ decimalPlaces: Number(e.target.value) });
    });
  }

  const btnExportJSON = container.querySelector('#btn-export-json');
  if (btnExportJSON) btnExportJSON.addEventListener('click', onExportJSON);

  const btnExportCSV = container.querySelector('#btn-export-csv');
  if (btnExportCSV) btnExportCSV.addEventListener('click', onExportCSV);

  const fileInput = container.querySelector('#file-import-json');
  const btnImportTrigger = container.querySelector('#btn-import-trigger');
  if (btnImportTrigger && fileInput) {
    btnImportTrigger.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        onImportJSON(event.target.result);
      };
      reader.readAsText(file);
    });
  }

  const btnClearAll = container.querySelector('#btn-clear-all');
  if (btnClearAll) btnClearAll.addEventListener('click', onClearAllData);

  container.querySelectorAll('.scale-gp, .scale-min, .scale-max').forEach(inp => {
    inp.addEventListener('change', () => {
      const updatedScale = [...gradingScale];
      container.querySelectorAll('tbody tr').forEach((tr, idx) => {
        const gpVal = Number(tr.querySelector('.scale-gp').value);
        const minVal = Number(tr.querySelector('.scale-min').value);
        const maxVal = Number(tr.querySelector('.scale-max').value);
        updatedScale[idx] = {
          ...updatedScale[idx],
          gradePoint: gpVal,
          minMarks: minVal,
          maxMarks: maxVal
        };
      });
      onSaveCustomGradingScale(updatedScale);
    });
  });
}
