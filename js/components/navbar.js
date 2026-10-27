/**
 * Navbar & Header Component — Simple Human-Centered Design
 */

export function renderNavbar(activeTab, currentTheme, onTabChange, onThemeToggle, onRunTests) {
  const container = document.getElementById('navbar-root');
  if (!container) return;

  const tabs = [
    { id: 'sgpa', label: 'SGPA Calculator'},
    { id: 'cgpa', label: 'CGPA Calculator' },
    { id: 'target', label: 'Target Goal' },
    { id: 'catalog', label: 'Subject List' },
    { id: 'settings', label: 'Settings' }
  ];

  const themeIcon = currentTheme === 'dark' ? '☀️' : '🌙';

  const html = `
    <nav class="navbar">
      <div class="nav-container">
        <a href="#" class="brand" id="brand-link">
          <div>
            <div class="brand-title">CGPA & SGPA Calculator</div>
            <span class="brand-subtitle">College grade calculator</span>
          </div>
        </a>

        <ul class="nav-links">
          ${tabs.map(t => `
            <li>
              <button class="nav-link ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
                ${t.label}
              </button>
            </li>
          `).join('')}
        </ul>

        <div class="nav-actions">
          <button class="btn btn-secondary btn-sm" id="btn-run-tests" title="Run accuracy test check">
            Run Tests
          </button>
          <button class="btn-icon" id="theme-toggle" title="Toggle Light/Dark mode">
            ${themeIcon}
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Bar -->
      <div class="app-container no-print" style="padding-top: 0; padding-bottom: 0.5rem;">
        <div class="nav-mobile-bar">
          ${tabs.map(t => `
            <button class="nav-link ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
              ${t.label}
            </button>
          `).join('')}
        </div>
      </div>
    </nav>
  `;

  container.innerHTML = html;

  // Event Listeners
  container.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = btn.getAttribute('data-tab');
      onTabChange(tabId);
    });
  });

  const brandLink = container.querySelector('#brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      onTabChange('sgpa');
    });
  }

  const themeBtn = container.querySelector('#theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', onThemeToggle);
  }

  const testsBtn = container.querySelector('#btn-run-tests');
  if (testsBtn) {
    testsBtn.addEventListener('click', onRunTests);
  }
}
