/**
 * Subject Catalog / List View Component — Simple Human-Centered Design
 */

import { PREDEFINED_SUBJECTS } from '../config/subjects.js';

export function renderCatalogView(container, state, handlers) {
  const { customSubjects = [] } = state;
  const { onOpenCustomSubjectModal } = handlers;

  let selectedSemesterFilter = 'all';
  let selectedTypeFilter = 'all';
  let searchQuery = '';

  function renderList() {
    const listContainer = container.querySelector('#catalog-list-root');
    if (!listContainer) return;

    const allItems = [];
    Object.keys(PREDEFINED_SUBJECTS).forEach(sem => {
      PREDEFINED_SUBJECTS[sem].forEach(s => {
        allItems.push({ ...s, semester: Number(sem), custom: false });
      });
    });

    customSubjects.forEach(cs => {
      allItems.push({ ...cs, semester: Number(cs.semester || 1), custom: true });
    });

    const filtered = allItems.filter(item => {
      if (selectedSemesterFilter !== 'all' && item.semester !== Number(selectedSemesterFilter)) return false;
      if (selectedTypeFilter !== 'all' && item.type !== selectedTypeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const code = (item.code || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return code.includes(q) || name.includes(q);
      }
      return true;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem;">
          <p class="text-muted">No subjects match your search.</p>
        </div>
      `;
      return;
    }

    const html = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Semester</th>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Credits</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(item => `
              <tr>
                <td style="font-weight: 600;">Semester ${item.semester}</td>
                <td style="font-weight: 600; font-family: monospace; color: var(--primary);">${item.code}</td>
                <td style="font-weight: 500;">
                  ${item.name}
                  ${item.custom ? `<span class="badge badge-purple" style="margin-left: 0.25rem;">Custom</span>` : ''}
                </td>
                <td style="font-weight: 600;">${item.credits}</td>
                <td>
                  <span class="badge badge-slate">${item.type || 'theory'}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    listContainer.innerHTML = html;
  }

  const mainHtml = `
    <div class="grid grid-cols-12">
      
      <!-- Catalog Header & Search Controls -->
      <div class="col-span-12 card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Subject List</h2>
            <div class="card-subtitle">Browse all pre-configured subjects and custom subjects</div>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-catalog-add-custom">
            + Custom Subject
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;">
          <div>
            <label class="form-label">Search Subject</label>
            <input type="text" class="form-control" id="catalog-search" placeholder="Type DBMS, Maths, 4CIT...">
          </div>

          <div>
            <label class="form-label">Semester</label>
            <select class="form-control" id="catalog-sem-filter">
              <option value="all">All Semesters</option>
              ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}">Semester ${s}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="form-label">Type</label>
            <select class="form-control" id="catalog-type-filter">
              <option value="all">All Types</option>
              <option value="theory">Theory</option>
              <option value="practical">Practical / Lab</option>
              <option value="project">Project</option>
              <option value="elective">Elective</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Subject Table Root -->
      <div class="col-span-12" id="catalog-list-root"></div>

    </div>
  `;

  container.innerHTML = mainHtml;
  renderList();

  const searchInput = container.querySelector('#catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderList();
    });
  }

  const semFilterSelect = container.querySelector('#catalog-sem-filter');
  if (semFilterSelect) {
    semFilterSelect.addEventListener('change', (e) => {
      selectedSemesterFilter = e.target.value;
      renderList();
    });
  }

  const typeFilterSelect = container.querySelector('#catalog-type-filter');
  if (typeFilterSelect) {
    typeFilterSelect.addEventListener('change', (e) => {
      selectedTypeFilter = e.target.value;
      renderList();
    });
  }

  const addCustomBtn = container.querySelector('#btn-catalog-add-custom');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', onOpenCustomSubjectModal);
  }
}
