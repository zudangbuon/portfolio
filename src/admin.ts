import { supabase } from './supabase';

// Helper to safely get elements
function qs<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element ${selector} not found`);
  return el;
}

// ─── AUTHENTICATION ─────────────────────────
const loginSection = qs('#login-section');
const dashboardSection = qs('#dashboard-section');
const loginForm = qs<HTMLFormElement>('#admin-login-form');
const loginError = qs('#login-error');
const btnLogout = qs('#btn-logout');


async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    loadData('settings'); // Load initial tab
  } else {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = qs<HTMLInputElement>('#login-email').value;
  const password = qs<HTMLInputElement>('#login-password').value;
  
  const btn = qs<HTMLButtonElement>('#btn-login');
  const span = btn.querySelector('span');
  if(span) span.textContent = 'Logging in...';
  btn.disabled = true;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = 'Sai tài khoản hoặc mật khẩu!';
    if(span) span.textContent = 'Login';
    btn.disabled = false;
  } else {
    loginError.textContent = '';
    checkAuth();
  }
});

btnLogout.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.reload();
});

// ─── TAB NAVIGATION ─────────────────────────
const navBtns = document.querySelectorAll('.nav-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

navBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.currentTarget as HTMLElement;
    const tabName = target.dataset.tab;
    
    // Update active nav
    navBtns.forEach(b => b.classList.remove('active'));
    target.classList.add('active');
    
    // Update active pane
    tabPanes.forEach(pane => {
      if (pane.id === `tab-${tabName}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    if (tabName) loadData(tabName);
  });
});

// ─── DATA LOADING & CRUD ─────────────────────
async function loadData(tab: string) {
  if (tab === 'messages') await loadMessages();
  if (tab === 'projects') await loadProjects();
  if (tab === 'ctfs') await loadCTFs();
  if (tab === 'skills') await loadSkills();
  if (tab === 'education') await loadEducation();
  if (tab === 'activities') await loadActivities();
  if (tab === 'platforms') await loadPlatforms();

  if (tab === 'settings') await loadSettings();
}

// Normalize order_idx to sequential 1,2,3... if there are duplicates or gaps
async function normalizeOrder(table: string, data: any[]): Promise<any[]> {
  let needsUpdate = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i].order_idx !== i + 1) {
      needsUpdate = true;
      break;
    }
  }
  if (!needsUpdate) return data;

  // Update all rows with sequential order_idx
  await Promise.all(
    data.map((item: any, idx: number) =>
      supabase.from(table).update({ order_idx: idx + 1 }).eq('id', item.id)
    )
  );

  // Update local data to reflect new values
  data.forEach((item: any, idx: number) => { item.order_idx = idx + 1; });
  return data;
}

async function loadMessages() {
  const tbody = qs('#messages-tbody');
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error || !data) {
      tbody.innerHTML = `<tr><td colspan="6">Error loading messages</td></tr>`;
      return;
    }
    
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">No messages found.</td></tr>`;
      return;
    }

  (window as any).messagesData = data;

    tbody.innerHTML = data.map((msg: any) => {
      let subject = '-';
      let content = msg.message || '';
      if (content.startsWith('Subject: ')) {
        const splitIdx = content.indexOf('\n\n');
        if (splitIdx !== -1) {
          subject = content.substring(9, splitIdx);
          content = content.substring(splitIdx + 2);
        }
      }
      
      const safeSubject = subject.replace(/</g, '&lt;');
      const safeContent = content.length > 50 ? content.substring(0, 50).replace(/</g, '&lt;') + '...' : content.replace(/</g, '&lt;');

    const escapedName = (msg.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedEmail = (msg.email || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return `
        <tr>
          <td>${new Date(msg.created_at).toLocaleDateString()}</td>
          <td>${escapedName}</td>
          <td>${escapedEmail}</td>
          <td>${safeSubject}</td>
          <td>${safeContent}</td>
          <td>
            <button class="action-btn" onclick="readMessage('${msg.id}')">Read</button>
            <button class="action-btn delete" onclick="deleteRecord('messages', '${msg.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
}

async function loadProjects() {
  const tbody = qs('#projects-tbody');
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  
  if (error || !data) {
    tbody.innerHTML = `<tr><td colspan="4">Error loading projects</td></tr>`;
    return;
  }
  
  tbody.innerHTML = data.map((p: any) => `
    <tr>
      <td>${p.title}</td>
      <td>${p.category || '-'}</td>
      <td>${p.tags ? p.tags.join(', ') : '-'}</td>
      <td>
        <button class="action-btn" onclick="editRecord('project', '${p.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('projects', '${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function loadCTFs() {
  const tbody = qs('#ctfs-tbody');
  const { data, error } = await supabase.from('ctfs').select('*').order('year', { ascending: false });
  if (error || !data) return;
  
  tbody.innerHTML = data.map((c: any) => `
    <tr>
      <td>${c.name}</td>
      <td>${c.rank || '-'}</td>
      <td>${c.year || '-'}</td>
      <td>
        <button class="action-btn" onclick="editRecord('ctf', '${c.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('ctfs', '${c.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function loadSkills() {
  const tbody = qs('#skills-tbody');
  const { data, error } = await supabase.from('skills').select('*');
  if (error || !data) return;
  
  const catMap: any = {
    'frontend': 'Programming',
    'backend': 'Security Tools',
    'tools': 'OS & Platforms'
  };
  
  tbody.innerHTML = data.map((s: any) => `
    <tr>
      <td>${s.name}</td>
      <td>${s.level}%</td>
      <td>${catMap[s.category] || s.category}</td>
      <td>
        <button class="action-btn" onclick="editRecord('skill', '${s.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('skills', '${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function loadEducation() {
  const tbody = qs('#education-tbody');
  const { data, error } = await supabase.from('education').select('*').order('order_idx', { ascending: true });
  
  if (error) {
    console.error('Error loading education:', error);
    tbody.innerHTML = `<tr><td colspan="4">Error loading data. Check console.</td></tr>`;
    return;
  }
  
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No education records found.</td></tr>`;
    return;
  }

  await normalizeOrder('education', data);
  
  tbody.innerHTML = data.map((e: any, idx: number) => `
    <tr>
      <td>${e.role}</td>
      <td>${e.institution}</td>
      <td>${e.start_date} - ${e.end_date}</td>
      <td class="order-cell">
        <div class="reorder-btns">
          <button class="reorder-btn" ${idx === 0 ? 'disabled' : ''} onclick="reorderItem('education', '${e.id}', ${e.order_idx}, '${data[idx - 1]?.id || ''}', ${data[idx - 1]?.order_idx ?? 0})">▲</button>
          <span class="order-num">${e.order_idx ?? idx + 1}</span>
          <button class="reorder-btn" ${idx === data.length - 1 ? 'disabled' : ''} onclick="reorderItem('education', '${e.id}', ${e.order_idx}, '${data[idx + 1]?.id || ''}', ${data[idx + 1]?.order_idx ?? 0})">▼</button>
        </div>
      </td>
      <td>
        <button class="action-btn" onclick="editRecord('education', '${e.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('education', '${e.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function loadActivities() {
  const tbody = qs('#activities-tbody');
  const { data, error } = await supabase.from('activities').select('*').order('order_idx', { ascending: true });
  
  if (error) {
    console.error('Error loading activities:', error);
    tbody.innerHTML = `<tr><td colspan="4">Error loading data. Check console.</td></tr>`;
    return;
  }
  
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No activity records found.</td></tr>`;
    return;
  }

  await normalizeOrder('activities', data);
  
  tbody.innerHTML = data.map((a: any, idx: number) => `
    <tr>
      <td>${a.role}</td>
      <td>${a.organization}</td>
      <td>${a.start_date} - ${a.end_date}</td>
      <td class="order-cell">
        <div class="reorder-btns">
          <button class="reorder-btn" ${idx === 0 ? 'disabled' : ''} onclick="reorderItem('activities', '${a.id}', ${a.order_idx}, '${data[idx - 1]?.id || ''}', ${data[idx - 1]?.order_idx ?? 0})">▲</button>
          <span class="order-num">${a.order_idx ?? idx + 1}</span>
          <button class="reorder-btn" ${idx === data.length - 1 ? 'disabled' : ''} onclick="reorderItem('activities', '${a.id}', ${a.order_idx}, '${data[idx + 1]?.id || ''}', ${data[idx + 1]?.order_idx ?? 0})">▼</button>
        </div>
      </td>
      <td>
        <button class="action-btn" onclick="editRecord('activity', '${a.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('activities', '${a.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function loadPlatforms() {
  const tbody = qs('#platforms-tbody');
  const { data, error } = await supabase.from('platforms').select('*').order('order_idx', { ascending: true });
  
  if (error) {
    console.error('Error loading platforms:', error);
    tbody.innerHTML = `<tr><td colspan="4">Error loading data. Check console.</td></tr>`;
    return;
  }
  
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No platform records found.</td></tr>`;
    return;
  }

  await normalizeOrder('platforms', data);
  
  tbody.innerHTML = data.map((p: any, idx: number) => `
    <tr>
      <td>${p.name}</td>
      <td>${p.link_url}</td>
      <td class="order-cell">
        <div class="reorder-btns">
          <button class="reorder-btn" ${idx === 0 ? 'disabled' : ''} onclick="reorderItem('platforms', '${p.id}', ${p.order_idx}, '${data[idx - 1]?.id || ''}', ${data[idx - 1]?.order_idx ?? 0})">▲</button>
          <span class="order-num">${p.order_idx ?? idx + 1}</span>
          <button class="reorder-btn" ${idx === data.length - 1 ? 'disabled' : ''} onclick="reorderItem('platforms', '${p.id}', ${p.order_idx}, '${data[idx + 1]?.id || ''}', ${data[idx + 1]?.order_idx ?? 0})">▼</button>
        </div>
      </td>
      <td>
        <button class="action-btn" onclick="editRecord('platform', '${p.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('platforms', '${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

let settingsId: string | null = null;
async function loadSettings() {
  const { data, error } = await supabase.from('settings').select('*').limit(1);
  if (!error && data && data.length > 0) {
    settingsId = data[0].id;
    (qs('#setting-hero-title') as HTMLInputElement).value = data[0].hero_title || '';
    (qs('#setting-hero-subtitle') as HTMLTextAreaElement).value = data[0].hero_subtitle || '';
    (qs('#setting-stat-ctf') as HTMLInputElement).value = data[0].stat_ctf || '';
    (qs('#setting-stat-languages') as HTMLInputElement).value = data[0].stat_languages || '';
    (qs('#setting-stat-platforms') as HTMLInputElement).value = data[0].stat_platforms || '';
    (qs('#setting-about') as HTMLTextAreaElement).value = data[0].about_text || '';
    (qs('#setting-gpa') as HTMLInputElement).value = data[0].gpa || '';
    (qs('#setting-location') as HTMLInputElement).value = data[0].location || '';
    (qs('#setting-email') as HTMLInputElement).value = data[0].email || '';
    (qs('#setting-phone') as HTMLInputElement).value = data[0].phone || '';
    (qs('#setting-github-url') as HTMLInputElement).value = data[0].github_url || '';
    (qs('#setting-linkedin-url') as HTMLInputElement).value = data[0].linkedin_url || '';
    (qs('#setting-facebook-url') as HTMLInputElement).value = data[0].facebook_url || '';
    (qs('#setting-instagram-url') as HTMLInputElement).value = data[0].instagram_url || '';

    // Auto-resize textareas after loading
    setTimeout(() => {
      document.querySelectorAll('textarea').forEach(ta => autoResizeTextarea(ta as HTMLTextAreaElement));
    }, 50);
  }
}

function autoResizeTextarea(ta: HTMLTextAreaElement) {
  ta.style.height = 'auto';
  ta.style.height = (ta.scrollHeight + 3) + 'px';
}

document.addEventListener('input', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName.toLowerCase() === 'textarea') {
    autoResizeTextarea(target as HTMLTextAreaElement);
  }
});

qs('#btn-save-settings')?.addEventListener('click', async (e) => {
  e.preventDefault();
  const btn = e.target as HTMLButtonElement;
  btn.textContent = 'Saving...';
  
  const payload = {
    hero_title: (qs('#setting-hero-title') as HTMLInputElement).value,
    hero_subtitle: (qs('#setting-hero-subtitle') as HTMLTextAreaElement).value,
    stat_ctf: (qs('#setting-stat-ctf') as HTMLInputElement).value,
    stat_languages: (qs('#setting-stat-languages') as HTMLInputElement).value,
    stat_platforms: (qs('#setting-stat-platforms') as HTMLInputElement).value,
    about_text: (qs('#setting-about') as HTMLTextAreaElement).value,
    gpa: (qs('#setting-gpa') as HTMLInputElement).value,
    location: (qs('#setting-location') as HTMLInputElement).value,
    email: (qs('#setting-email') as HTMLInputElement).value,
    phone: (qs('#setting-phone') as HTMLInputElement).value,
    github_url: (qs('#setting-github-url') as HTMLInputElement).value,
    linkedin_url: (qs('#setting-linkedin-url') as HTMLInputElement).value,
    facebook_url: (qs('#setting-facebook-url') as HTMLInputElement).value,
    instagram_url: (qs('#setting-instagram-url') as HTMLInputElement).value
  };
  
  if (settingsId) {
    await supabase.from('settings').update(payload).eq('id', settingsId);
  } else {
    const { data } = await supabase.from('settings').insert([payload]).select();
    if (data && data.length > 0) settingsId = data[0].id;
  }
  
  btn.textContent = 'Saved!';
  setTimeout(() => btn.textContent = 'Save Settings', 2000);
});

qs('#btn-refresh-messages').addEventListener('click', loadMessages);

// ─── CRUD MODAL HANDLING ─────────────────────
const crudModal = qs('#crud-modal');
const crudForm = qs<HTMLFormElement>('#crud-form');
const modalTitle = qs('#modal-title');
const modalFields = qs('#modal-fields');
const btnModalClose = qs('#btn-modal-close');
const btnModalCancel = qs('#btn-modal-cancel');

let currentAction = { table: '', id: null as string | null };

const schemas: any = {
  project: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'tags', label: 'Tags (comma separated)', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'github_link', label: 'GitHub Link', type: 'url' },
    { name: 'image_url', label: 'Image URL', type: 'url' }
  ],
  ctf: [
    { name: 'name', label: 'CTF Name', type: 'text', required: true },
    { name: 'rank', label: 'Rank', type: 'text' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'tags', label: 'Tags (comma separated)', type: 'text' }
  ],
  skill: [
    { name: 'name', label: 'Skill Name', type: 'text', required: true },
    { name: 'level', label: 'Level (%)', type: 'number', required: true },
    { name: 'category', label: 'Category', type: 'select', options: ['Programming', 'Security Tools', 'OS & Platforms'], required: true },
    { name: 'icon', label: 'Icon (emoji or 1-2 letters)', type: 'text' }
  ],
  education: [
    { name: 'role', label: 'Degree / Role', type: 'text', required: true },
    { name: 'institution', label: 'Institution / School', type: 'text', required: true },
    { name: 'start_date', label: 'Start Date (e.g. 2023)', type: 'text' },
    { name: 'end_date', label: 'End Date (e.g. 2027 or Present)', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'tags', label: 'Tags (comma separated)', type: 'text' },
    { name: 'order_idx', label: 'Order Index', type: 'number' }
  ],
  activity: [
    { name: 'role', label: 'Role / Award', type: 'text', required: true },
    { name: 'organization', label: 'Organization', type: 'text', required: true },
    { name: 'start_date', label: 'Start Date (e.g. 2024)', type: 'text' },
    { name: 'end_date', label: 'End Date (e.g. 2025)', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'tags', label: 'Tags (comma separated)', type: 'text' },
    { name: 'order_idx', label: 'Order Index', type: 'number' }
  ],
  platform: [
    { name: 'name', label: 'Platform Name', type: 'text', required: true },
    { name: 'logo_url', label: 'Logo URL', type: 'url' },
    { name: 'link_url', label: 'Platform URL', type: 'url' },
    { name: 'order_idx', label: 'Order Index', type: 'number' }
  ]
};

function openModal(type: string, id: string | null = null, existingData: any = null) {
  let table = type + 's';
  if (type === 'activity') table = 'activities';
  else if (type === 'education') table = 'education';
  
  currentAction = { table, id };
  modalTitle.textContent = id ? `Edit ${type}` : `Add ${type}`;
  
  const schema = schemas[type];
  if(!schema) return;

  modalFields.innerHTML = schema.map((f: any) => {
    let val = existingData ? existingData[f.name] : '';
    if(f.name === 'tags' && Array.isArray(val)) val = val.join(', ');
    
    if (f.type === 'textarea') {
      return `<div class="form-group"><label>${f.label}</label><textarea name="${f.name}" rows="4" ${f.required?'required':''}>${val || ''}</textarea></div>`;
    }
    if (f.type === 'select') {
      let mappedVal = val;
      if (val === 'frontend') mappedVal = 'Programming';
      else if (val === 'backend') mappedVal = 'Security Tools';
      else if (val === 'tools') mappedVal = 'OS & Platforms';
      
      const opts = f.options.map((o: string) => `<option value="${o}" ${mappedVal === o ? 'selected' : ''}>${o}</option>`).join('');
      return `<div class="form-group"><label>${f.label}</label><select name="${f.name}" ${f.required?'required':''}>${opts}</select></div>`;
    }
    return `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.name}" value="${val || ''}" ${f.required?'required':''} /></div>`;
  }).join('');

  // Auto-resize textareas after modal renders
  setTimeout(() => {
    modalFields.querySelectorAll('textarea').forEach(ta => autoResizeTextarea(ta as HTMLTextAreaElement));
  }, 50);

  crudModal.classList.remove('hidden');
}

function closeModal() {
  crudModal.classList.add('hidden');
  crudForm.reset();
}

btnModalClose.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
btnModalCancel.addEventListener('click', closeModal);

crudForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(crudForm);
  const data: any = {};
  
  formData.forEach((val, key) => {
    if (val) {
      if (key === 'tags') {
        data[key] = (val as string).split(',').map(s => s.trim());
      } else {
        data[key] = val;
      }
    }
  });

  // Map display category names back to DB keys for skills
  if (data.category) {
    const catReverseMap: any = {
      'Programming': 'frontend',
      'Security Tools': 'backend',
      'OS & Platforms': 'tools'
    };
    if (catReverseMap[data.category]) {
      data.category = catReverseMap[data.category];
    }
  }

  if (currentAction.id) {
    // Update
    await supabase.from(currentAction.table).update(data).eq('id', currentAction.id);
  } else {
    // Insert
    await supabase.from(currentAction.table).insert([data]);
  }
  
  closeModal();
  loadData(currentAction.table);
});

// Bind Add buttons
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const type = (e.currentTarget as HTMLElement).dataset.type;
    if(type) openModal(type);
  });
});

// Expose functions to window for onclick handlers
(window as any).readMessage = (id: string) => {
  const messages = (window as any).messagesData;
  if (!messages) return;
  const msg = messages.find((m: any) => m.id === id);
  if (msg) {
    let subject = 'None';
    let content = msg.message || '';
    if (content.startsWith('Subject: ')) {
      const splitIdx = content.indexOf('\n\n');
      if (splitIdx !== -1) {
        subject = content.substring(9, splitIdx);
        content = content.substring(splitIdx + 2);
      }
    }
    alert(`From: ${msg.name} <${msg.email}>\nDate: ${new Date(msg.created_at).toLocaleString()}\nSubject: ${subject}\n\n${content}`);
  }
};

(window as any).deleteRecord = async (table: string, id: string) => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  await supabase.from(table).delete().eq('id', id);
  loadData(table); // reload current tab
};

(window as any).editRecord = async (type: string, id: string) => {
  let table = type + 's';
  if (type === 'activity') table = 'activities';
  else if (type === 'education') table = 'education';

  const { data } = await supabase.from(table).select('*').eq('id', id).single();
  if (data) openModal(type, id, data);
};

// ─── REORDER FUNCTION ─────────────────────
(window as any).reorderItem = async (table: string, id1: string, newOrder1: number, id2: string, newOrder2: number) => {
  if (!id2) return;
  
  // Swap: give id1 the order of id2, and id2 the order of id1
  await Promise.all([
    supabase.from(table).update({ order_idx: newOrder2 }).eq('id', id1),
    supabase.from(table).update({ order_idx: newOrder1 }).eq('id', id2)
  ]);
  
  // Reload the tab
  loadData(table);
};

// Initialize
checkAuth();
