/* ==========================================================================
   HARSH Portfolio - Dynamic Admin System
   Features: Live Edit Admin, Dynamic Rendering, Export Config, Sorting
   ========================================================================== */

// --------------------------------------------------------------------------
// DOM Elements
// --------------------------------------------------------------------------
const adminToggle = document.getElementById('adminToggle');
const adminPanel = document.getElementById('adminPanel');
const adminClose = document.getElementById('adminClose');
const addEditModal = document.getElementById('addEditModal');
const addEditClose = document.getElementById('addEditClose');
const addEditTitle = document.getElementById('addEditTitle');
const addEditForm = document.querySelector('.add-edit-form');

// --------------------------------------------------------------------------
// Admin Panel State
// --------------------------------------------------------------------------
let currentEditing = { type: '', index: -1, item: null };
let activeTab = 'lab-editor';
let labItems = [...(portfolioData?.skills || [])];
let workItems = [...(portfolioData?.projects || [])];
let statsItems = [...(portfolioData?.stats || [])];
let settings = { ...portfolioData?.settings } || {
  contactEmail: "harsh@example.com",
  socialLinks: []
};

// --------------------------------------------------------------------------
// Initialize Portfolio
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initAdminPanel();
  initGallery();
  initStats();
  initMagneticButtons();
  renderLab();
  renderWork();
  renderStats();
  renderSocialLinks();
  initContactForm();
});

// --------------------------------------------------------------------------
// Admin Panel - Core Logic
// --------------------------------------------------------------------------
function initAdminPanel() {
  if (adminToggle) {
    adminToggle.addEventListener('click', () => {
      adminPanel.classList.add('active');
      document.body.style.overflow = 'hidden';
      loadEditorContent();
    });
  }

  if (adminClose) {
    adminClose.addEventListener('click', closeAdminPanel);
  }

  if (addEditClose) {
    addEditClose.addEventListener('click', closeAddEditModal);
  }

  if (adminPanel) {
    adminPanel.addEventListener('click', (e) => {
      if (e.target === adminPanel) closeAdminPanel();
    });
  }

  if (addEditModal) {
    addEditModal.addEventListener('click', (e) => {
      if (e.target === addEditModal) closeAddEditModal();
    });
  }

  // Tab switching
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-editor').forEach(e => e.classList.remove('active'));
      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      activeTab = tabId;
      document.getElementById(tabId).classList.add('active');
      loadEditorContent();
    });
  });
}

function closeAdminPanel() {
  adminPanel.classList.remove('active');
  document.body.style.overflow = '';
}

function loadEditorContent() {
  switch (activeTab) {
    case 'lab-editor':
      renderLabEditor();
      break;
    case 'work-manager':
      renderWorkEditor();
      break;
    case 'stats-editor':
      renderStatsEditor();
      break;
    case 'settings':
      renderSettings();
      break;
  }
}

// --------------------------------------------------------------------------
// The Lab Editor
// --------------------------------------------------------------------------
function renderLabEditor() {
  const container = document.getElementById('labEditorList');
  if (!container) return;

  const items = labItems;
  container.innerHTML = items.map((skill, idx) => `
    <div class="editor-item" data-index="${idx}">
      <div class="editor-item-content">
        <span class="editor-icon">${skill.icon}</span>
        <div class="editor-info">
          <h5>${skill.title}</h5>
          <p>${skill.description.substring(0, 60)}...</p>
        </div>
      </div>
      <div class="editor-actions">
        <button class="btn-small" onclick="openEditSkill(${idx})">✏️</button>
        <button class="btn-small btn-danger" onclick="deleteSkill(${idx})">🗑</button>
      </div>
    </div>
  `).join('');
}

function renderLab() {
  const container = document.getElementById('labTrack');
  if (!container) return;

  // Sort by featured first, then by id
  const sorted = [...labItems].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.id.localeCompare(b.id);
  });

  container.innerHTML = sorted.map(skill => {
    const colorStyle = skill.color ? ` style="--card-color: ${skill.color};"` : '';
    const colorClass = skill.color ? ' skill-color' : '';
    return `
    <article class="skill-card${colorClass}" data-id="${skill.id}"${colorStyle}>
      <div class="skill-glass"></div>
      <div class="skill-content">
        <div class="skill-icon">${skill.icon}</div>
        <h3>${skill.title}</h3>
        <p>${skill.description}</p>
        ${skill.category ? `<p class="skill-category">${skill.category}</p>` : ''}
        <div class="skill-tags">
          ${skill.tech.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `}).join('') + `
    <article class="skill-card skill-add" onclick="openAddSkillModal()">
      <div class="skill-add-content">
        <span class="skill-add-icon">+</span>
        <h3>Add Skill</h3>
      </div>
    </article>
  `;
}

function openAddSkillModal() {
  currentEditing = { type: 'skill', index: -1, item: null };
  addEditTitle.textContent = 'Add New Skill';
  renderAddEditForm('skill');
  openAddEditModal();
}

function openEditSkill(index) {
  currentEditing = { type: 'skill', index: index, item: { ...labItems[index] } };
  addEditTitle.textContent = 'Edit Skill';
  renderAddEditForm('skill', labItems[index]);
  openAddEditModal();
}



function deleteSkill(index) {
  if (confirm('Delete this skill?')) {
    labItems.splice(index, 1);
    renderLab();
    renderLabEditor();
    updateSaveStatus('Skill deleted');
  }
}

// --------------------------------------------------------------------------
// Work Manager (Projects)
// --------------------------------------------------------------------------
function renderWorkEditor() {
  const container = document.getElementById('workEditorList');
  if (!container) return;

  const items = workItems;
  container.innerHTML = items.map((project, idx) => `
    <div class="editor-item" data-index="${idx}">
      <div class="editor-item-content">
        <span class="editor-icon">${project.icon}</span>
        <div class="editor-info">
          <h5>${project.title}</h5>
          <p>${project.badge}</p>
        </div>
      </div>
      <div class="editor-actions">
        <button class="btn-small" onclick="openEditProject(${idx})">✏️</button>
        <button class="btn-small btn-danger" onclick="deleteProject(${idx})">🗑</button>
      </div>
    </div>
  `).join('');
}

function renderWork() {
  const container = document.getElementById('galleryTrack');
  if (!container) return;

  // Sort by order field, then by id
  const sorted = [...workItems].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    return a.id.localeCompare(b.id);
  });

  container.innerHTML = sorted.map((project, idx) => {
    const colorStyle = project.color ? ` style="--card-color: ${project.color};"` : '';
    const colorClass = project.color ? ' gallery-color' : '';
    return `
    <article class="gallery-item${colorClass}" data-id="${project.id}" data-index="${idx}"${colorStyle}>
      <div class="gallery-item-content">
        <div class="gallery-item-header">
          <span class="gallery-item-icon">${project.icon}</span>
          <span class="gallery-item-badge">${project.badge}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        ${project.results ? `<p class="gallery-item-results">${project.results}</p>` : ''}
        ${project.category ? `<p class="gallery-item-category">${project.category}</p>` : ''}
        <div class="gallery-item-tech">
          ${project.tech.map(t => `<span>${t}</span>`).join('')}
        </div>
        <div class="gallery-item-actions">
          <a href="#" class="btn-small btn-small-primary magnetic" data-preview="${project.previewUrl}" data-url="${project.url}">View Work</a>
          <a href="${project.url}" target="_blank" rel="noopener" class="btn-small btn-small-glass">External →</a>
        </div>
      </div>
    </article>
  `}).join('') + `
    <article class="gallery-item gallery-add" onclick="openAddProjectModal()">
      <div class="gallery-add-content">
        <span class="gallery-add-icon">+</span>
        <p>Add Project</p>
      </div>
    </article>
  `;

  initGallery();
}

function openAddProjectModal() {
  currentEditing = { type: 'project', index: -1, item: null };
  addEditTitle.textContent = 'Add New Project';
  renderAddEditForm('project');
  openAddEditModal();
}

function openEditProject(index) {
  currentEditing = { type: 'project', index: index, item: { ...workItems[index] } };
  addEditTitle.textContent = 'Edit Project';
  renderAddEditForm('project', workItems[index]);
  openAddEditModal();
}


function deleteProject(index) {
  if (confirm('Delete this project?')) {
    workItems.splice(index, 1);
    renderWork();
    renderWorkEditor();
    updateSaveStatus('Project deleted');
  }
}

// --------------------------------------------------------------------------
// Stats Editor
// --------------------------------------------------------------------------
function renderStatsEditor() {
  const container = document.getElementById('statsEditorList');
  if (!container) return;

  container.innerHTML = statsItems.map((stat, idx) => `
    <div class="editor-item" data-index="${idx}">
      <div class="editor-item-content">
        <div class="editor-info">
          <h5>${stat.label}</h5>
          <p>${stat.value}${stat.suffix}</p>
        </div>
      </div>
      <div class="editor-actions">
        <button class="btn-small" onclick="openEditStat(${idx})">✏️</button>
        <button class="btn-small btn-danger" onclick="deleteStat(${idx})">🗑</button>
      </div>
    </div>
  `).join('');
}

function renderStats() {
  const container = document.querySelector('.stats-container');
  if (!container) return;

  container.innerHTML = statsItems.map(stat => `
    <div class="stat-item">
      <span class="stat-number" data-target="${stat.value}">0</span>
      ${stat.suffix ? `<span class="stat-suffix">${stat.suffix}</span>` : ''}
      <span class="stat-label"><em>${stat.label}</em></span>
    </div>
  `).join('') + `
    <div class="stat-divider"></div>
  `;

  // Remove last divider
  if (statsItems.length > 0) {
    const lastDivider = container.lastElementChild;
    if (lastDivider && lastDivider.classList.contains('stat-divider')) {
      lastDivider.remove();
    }
  }

  initStats();
}

function openAddStatModal() {
  currentEditing = { type: 'stat', index: -1, item: null };
  addEditTitle.textContent = 'Add New Statistic';
  renderAddEditForm('stat');
  openAddEditModal();
}

function openEditStat(index) {
  currentEditing = { type: 'stat', index: index, item: { ...statsItems[index] } };
  addEditTitle.textContent = 'Edit Statistic';
  renderAddEditForm('stat', statsItems[index]);
  openAddEditModal();
}

function renderAddEditForm(type, item = null) {
  const form = addEditForm;
  if (!form) return;

  const color = item?.color || '#6089d6';
  const category = item?.category || '';
  const demoVideo = item?.demoVideo || '';
  const clientName = item?.clientName || '';
  const startDate = item?.startDate || '';
  const endDate = item?.endDate || '';
  const keywords = item?.keywords?.join(', ') || '';
  const results = item?.results || '';
  const tags = item?.tags?.join(', ') || '';

  const isStat = type === 'stat';

  const html = isStat ? `
    <div class="editor-form-group">
      <label>Label</label>
      <input type="text" id="editLabel" value="${item?.label || ''}" placeholder="e.g., Projects Delivered">
    </div>
    <div class="editor-form-group">
      <label>Value</label>
      <input type="text" id="editValue" value="${item?.value || ''}" placeholder="e.g., 50">
    </div>
    <div class="editor-form-group">
      <label>Suffix</label>
      <input type="text" id="editSuffix" value="${item?.suffix || ''}" placeholder="e.g., %">
    </div>
  ` : `
    <!-- Common Fields -->
    <div class="editor-form-group">
      <label>Icon (Emoji)</label>
      <input type="text" id="editIcon" value="${item?.icon || '📁'}" placeholder="e.g., 🤖">
    </div>
    <div class="editor-form-group">
      <label>Title</label>
      <input type="text" id="editTitle" value="${item?.title || ''}" placeholder="e.g., Smart Inbox Assistant">
    </div>
    <div class="editor-form-group">
      <label>Description</label>
      <textarea id="editDescription" rows="3" placeholder="Description...">${item?.description || ''}</textarea>
    </div>

    <!-- Project-Specific Fields -->
    ${!isStat && type === 'project' ? `
      <div class="editor-form-group">
        <label>Badge</label>
        <input type="text" id="editBadge" value="${item?.badge || ''}" placeholder="e.g., Email AI">
      </div>
      <div class="editor-form-group">
        <label>External URL</label>
        <input type="text" id="editUrl" value="${item?.url || ''}" placeholder="https://project-url.com">
      </div>
      <div class="editor-form-group">
        <label>Preview URL (optional)</label>
        <input type="text" id="editPreviewUrl" value="${item?.previewUrl || ''}" placeholder="https://preview.com">
      </div>
      <div class="editor-form-group">
        <label>Order</label>
        <input type="number" id="editOrder" value="${item?.order || (workItems.length + 1)}" placeholder="Display order">
      </div>
    ` : ''}

    <!-- Skill-Specific Fields -->
    ${!isStat && type === 'skill' ? `
      <div class="editor-form-group">
        <label>Tech Stack (comma-separated)</label>
        <input type="text" id="editTech" value="${item?.tech?.join(', ') || ''}" placeholder="Tech1, Tech2, Tech3">
      </div>
      <div class="editor-form-group">
        <label>Featured</label>
        <select id="editFeatured">
          <option value="false" ${item?.featured === false || !item ? 'selected' : ''}>No</option>
          <option value="true" ${item?.featured === true ? 'selected' : ''}>Yes</option>
        </select>
      </div>
    ` : ''}

    <!-- Advanced Fields (Both) -->
    <div class="editor-form-group">
      <label>Category/Tag</label>
      <input type="text" id="editCategory" value="${category}" placeholder="e.g., AI, Frontend, Backend">
    </div>
    <div class="editor-form-group">
      <label>Color Accent</label>
      <input type="color" id="editColor" value="${color}" title="Choose card accent color">
    </div>
    <div class="editor-form-group">
      <label>Results/Metrics (optional)</label>
      <textarea id="editResults" rows="2" placeholder="e.g., 70% improvement, 5 clients">${results}</textarea>
    </div>
    <div class="editor-form-group">
      <label>Keywords (comma-separated)</label>
      <input type="text" id="editKeywords" value="${keywords}" placeholder="SEO keywords">
    </div>

    <!-- Timeline (Projects) -->
    ${!isStat && type === 'project' ? `
      <div class="editor-form-group">
        <label>Start Date</label>
        <input type="text" id="editStartDate" value="${startDate}" placeholder="e.g., Jan 2025">
      </div>
      <div class="editor-form-group">
        <label>End Date/Status</label>
        <input type="text" id="editEndDate" value="${endDate}" placeholder="e.g., Mar 2025 | Completed">
      </div>
    ` : ''}

    <!-- Client Info (Projects) -->
    ${!isStat && type === 'project' ? `
      <div class="editor-form-group">
        <label>Client Name (optional)</label>
        <input type="text" id="editClientName" value="${clientName}" placeholder="Client company name">
      </div>
    ` : ''}
  `;

  form.innerHTML = html;
}

function saveItem() {
  const type = currentEditing.type;

  if (type === 'stat') {
    const label = document.getElementById('editLabel')?.value || 'New Stat';
    const value = document.getElementById('editValue')?.value || '0';
    const suffix = document.getElementById('editSuffix')?.value || '';

    if (currentEditing.index === -1) {
      statsItems.push({ label, value, suffix });
    } else {
      statsItems[currentEditing.index] = { label, value, suffix };
    }
    renderStats();
    renderStatsEditor();
    updateSaveStatus('Stat saved');
  } else if (type === 'skill') {
    const icon = document.getElementById('editIcon')?.value || '📁';
    const title = document.getElementById('editTitle')?.value || 'New Skill';
    const description = document.getElementById('editDescription')?.value || '';
    const techInput = document.getElementById('editTech')?.value || '';
    const tech = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const category = document.getElementById('editCategory')?.value || '';
    const color = document.getElementById('editColor')?.value || '#6089d6';
    const featured = document.getElementById('editFeatured')?.value === 'true';
    const keywords = document.getElementById('editKeywords')?.value.split(',').map(k => k.trim()).filter(Boolean);

    if (currentEditing.index === -1) {
      labItems.push({
        id: `skill-${Date.now()}`,
        title, icon, description, tech, category, color, featured, keywords
      });
    } else {
      labItems[currentEditing.index] = {
        ...labItems[currentEditing.index],
        title, icon, description, tech, category, color, featured, keywords
      };
    }
    renderLab();
    renderLabEditor();
    updateSaveStatus('Skill saved');
  } else if (type === 'project') {
    const icon = document.getElementById('editIcon')?.value || '📁';
    const badge = document.getElementById('editBadge')?.value || 'Project';
    const title = document.getElementById('editTitle')?.value || 'New Project';
    const description = document.getElementById('editDescription')?.value || '';
    const techInput = document.getElementById('editTech')?.value || '';
    const tech = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const url = document.getElementById('editUrl')?.value || '';
    const previewUrl = document.getElementById('editPreviewUrl')?.value || '';
    const category = document.getElementById('editCategory')?.value || '';
    const color = document.getElementById('editColor')?.value || '#6089d6';
    const order = parseInt(document.getElementById('editOrder')?.value) || workItems.length;
    const keywords = document.getElementById('editKeywords')?.value.split(',').map(k => k.trim()).filter(Boolean);
    const startDate = document.getElementById('editStartDate')?.value || '';
    const endDate = document.getElementById('editEndDate')?.value || '';
    const clientName = document.getElementById('editClientName')?.value || '';
    const results = document.getElementById('editResults')?.value || '';

    if (currentEditing.index === -1) {
      workItems.push({
        id: `project-${Date.now()}`,
        title, badge, icon, description, tech, url, previewUrl,
        category, color, order, keywords, startDate, endDate, clientName, results
      });
    } else {
      workItems[currentEditing.index] = {
        ...workItems[currentEditing.index],
        title, badge, icon, description, tech, url, previewUrl,
        category, color, order, keywords, startDate, endDate, clientName, results
      };
    }
    renderWork();
    renderWorkEditor();
    updateSaveStatus('Project saved');
  }

  closeAddEditModal();
}

function deleteStat(index) {
  if (confirm('Delete this stat?')) {
    statsItems.splice(index, 1);
    renderStats();
    renderStatsEditor();
    updateSaveStatus('Stat deleted');
  }
}

// --------------------------------------------------------------------------
// Settings Editor
// --------------------------------------------------------------------------
function renderSettings() {
  const emailInput = document.getElementById('contactEmail');
  const githubInput = document.getElementById('githubUrl');
  const linkedinInput = document.getElementById('linkedinUrl');
  const twitterInput = document.getElementById('twitterUrl');

  if (emailInput) emailInput.value = settings.contactEmail || '';
  if (githubInput) githubInput.value = settings.socialLinks.find(s => s.platform === 'github')?.url || '';
  if (linkedinInput) linkedinInput.value = settings.socialLinks.find(s => s.platform === 'linkedin')?.url || '';
  if (twitterInput) twitterInput.value = settings.socialLinks.find(s => s.platform === 'twitter')?.url || '';
}

function saveSettings() {
  const email = document.getElementById('contactEmail')?.value || 'harsh@example.com';
  const github = document.getElementById('githubUrl')?.value || '';
  const linkedin = document.getElementById('linkedinUrl')?.value || '';
  const twitter = document.getElementById('twitterUrl')?.value || '';

  settings = {
    contactEmail: email,
    socialLinks: [
      { platform: 'github', name: 'GitHub', url: github },
      { platform: 'linkedin', name: 'LinkedIn', url: linkedin },
      { platform: 'twitter', name: 'Twitter', url: twitter }
    ]
  };
}

function renderSocialLinks() {
  const container = document.getElementById('socialLinks');
  if (!container) return;

  const icons = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
  };

  container.innerHTML = settings.socialLinks.map(link => `
    <a href="${link.url}" target="_blank" rel="noopener" class="social-link">
      ${icons[link.platform] || icons.github}
      ${link.name}
    </a>
  `).join('');
}

// --------------------------------------------------------------------------
// Modal Operations
// --------------------------------------------------------------------------
function openAddEditModal() {
  addEditModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAddEditModal() {
  addEditModal.classList.remove('active');
  document.body.style.overflow = '';
}

// --------------------------------------------------------------------------
// Save Changes Functions - Individual tab save buttons
// --------------------------------------------------------------------------
function saveLabChanges() {
  renderLab();
  updateSaveStatus('Lab changes saved!');
}

function saveWorkChanges() {
  renderWork();
  updateSaveStatus('Work changes saved!');
}

function saveStatsChanges() {
  renderStats();
  updateSaveStatus('Stats changes saved!');
}

function saveSettingsChanges() {
  saveSettings();
  renderSocialLinks();
  updateSaveStatus('Settings saved!');
}

function updateSaveStatus(message) {
  const statusEl = document.getElementById('saveStatus');
  const statusText = statusEl?.querySelector('.status-text');
  if (statusEl && statusText) {
    statusText.textContent = message + ' Click "Export All" when ready.';
    statusEl.classList.add('unsaved');
    setTimeout(() => {
      statusEl.classList.remove('unsaved');
      statusText.textContent = 'All changes saved in memory';
    }, 2000);
  }
}

// --------------------------------------------------------------------------
// Export Config - Copy to Clipboard
// --------------------------------------------------------------------------
function exportConfig() {
  saveSettings();

  const config = {
    settings: {
      contactEmail: settings.contactEmail,
      socialLinks: settings.socialLinks
    },
    stats: statsItems,
    skills: labItems,
    projects: workItems
  };

  const json = JSON.stringify(config, null, 2);
  const hiddenCopy = document.getElementById('hiddenCopy');
  if (hiddenCopy) {
    hiddenCopy.value = json;
    hiddenCopy.select();
    document.execCommand('copy');
  }

  alert('Portfolio config copied to clipboard!\n\nSave this to portfolio-data.js or projects.json');

  closeAdminPanel();
}

// --------------------------------------------------------------------------
// Gallery Initialization
// --------------------------------------------------------------------------
function initGallery() {
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');

  if (track) {
    track.addEventListener('scroll', () => {
      const dotsContainer = document.getElementById('galleryDots');
      if (!dotsContainer) return;

      const scrollPos = track.scrollLeft;
      const itemWidth = track.querySelector('.gallery-item')?.offsetWidth || 400;
      const activeIndex = Math.round(scrollPos / (itemWidth + 16));
      dotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track?.scrollBy({ left: -400, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track?.scrollBy({ left: 400, behavior: 'smooth' });
    });
  }
}

// --------------------------------------------------------------------------
// Stats Animation
// --------------------------------------------------------------------------
function initStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.dataset.target);
    const rect = stat.getBoundingClientRect();
    if (rect.top < window.innerHeight && !stat.classList.contains('animated')) {
      stat.classList.add('animated');
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, 30);
    }
  });
}

// --------------------------------------------------------------------------
// Contact Form - Dynamic Email
// --------------------------------------------------------------------------
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;

    if (name && email && message) {
      // Get the contact email from settings
      const contactEmail = settings.contactEmail || 'harsh@example.com';

      // Create mailto link with form data
      const subject = `Contact from ${name}`;
      const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
      const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open email client with pre-filled message
      window.location.href = mailtoLink;

      // Clear form after successful submission
      form.reset();
      alert('Opening your email client...');
    }
  });
}

// --------------------------------------------------------------------------
// Magnetic Buttons
// --------------------------------------------------------------------------
function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0) scale(1)';
    });
  });
}

// --------------------------------------------------------------------------
// Modal Preview
// --------------------------------------------------------------------------
const modalOverlay = document.getElementById('modalOverlay');
const projectFrame = document.getElementById('projectFrame');
const browserUrl = document.getElementById('browserUrl');
const fallbackMessage = document.getElementById('fallbackMessage');
const openExternal = document.getElementById('openExternal');

function openPreview(previewUrl, url) {
  if (previewUrl && previewUrl !== '') {
    projectFrame.src = previewUrl;
    projectFrame.style.display = 'block';
    fallbackMessage.style.display = 'none';
    browserUrl.textContent = previewUrl;
  } else {
    projectFrame.style.display = 'none';
    fallbackMessage.style.display = 'flex';
    browserUrl.textContent = url;
  }
  openExternal.href = url;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  modalOverlay.classList.remove('active');
  projectFrame.src = 'about:blank';
  document.body.style.overflow = '';
}

document.getElementById('browserClose')?.addEventListener('click', closePreview);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closePreview();
});

// --------------------------------------------------------------------------
// Mouse Tracking (Liquid Glass Effect)
// --------------------------------------------------------------------------
const updateMousePosition = (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  document.documentElement.style.setProperty('--mouse-x', x);
  document.documentElement.style.setProperty('--mouse-y', y);
};

document.addEventListener('mousemove', updateMousePosition, { passive: true });
