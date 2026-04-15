const pageTitles = {
  dashboard: ['Dashboard', 'Sunday, 12 April 2026'],
  contacts: ['Contacts', 'All people & points of contact'],
  crm: ['CRM — Calls & Leads', 'All Sales Reps · April 2026'],
  clients: ['Clients', '37 active clients'],
  projects: ['Projects', '12 active sites'],
  jobs: ['Job Calendar', 'Week of Apr 12, 2026'],
  updates: ['Field Updates', '2 pending review'],
  inventory: ['Inventory', '3 low-stock alerts'],
  delivery: ['Delivery Slips', 'Today\'s movements'],
  docs: ['Documentation', 'Project files & drawings'],
  suppliers: ['Suppliers', 'Vendor & material management'],
  subcontractors: ['Subcontractors', 'Labour crews & third-party contractors'],
  'purchase-orders': ['Purchase Orders', '3 pending approval'],
  rfq: ['RFQ', 'Request for Quotation'],
  invoices: ['Invoices', '5 drafts · 2 overdue'],
  'invoice-calendar': ['Invoice Calendar', 'Payment schedule & due dates'],
  expenses: ['Expenses', 'Project costs & overheads'],
  balance: ['Balance Sheet', 'Assets, liabilities & equity'],
  pl: ['P&L Report', 'Profit & loss by period'],
  tax: ['Tax & VAT', 'Compliance & tax returns'],
  ai: ['AI Assistant', 'Ask anything about your operations'],
  fleet: ['Fleet Management', '8 vehicles · 2 maintenance due'],
  workforce: ['Workforce', '24 workers · 18 on site today'],
  tenders: ['Tenders', '4 active · Apr deadline approaching'],
  compliance: ['Site Compliance', '3 open issues · 87% score'],
  engineering: ['Engineering Calculator', 'Scaffolding & propping design tools'],
  'site-surveys': ['Site Surveys', 'Pre-contract survey tracker'],
  'activity-log': ['Activity Log', 'All operations · Real-time feed'],
  quotations: ['Quotations', '7 open · $142K pipeline'],
  inbox: ['Inbox', 'All channels · 12 unread'],
  'email-marketing': ['Email Marketing', 'Campaigns & sequences'],
};

const pageActions = {
  dashboard: 'Add Project',
  contacts: 'Add Contact',
  crm: 'Log Entry',
  clients: 'Add Client',
  projects: 'Add Project',
  jobs: 'Add Job',
  updates: 'Add Update',
  inventory: 'Add Item',
  delivery: 'Add Delivery Slip',
  docs: 'Upload Document',
  suppliers: 'Add Supplier',
  subcontractors: 'Add Subcontractor',
  'purchase-orders': 'New Purchase Order',
  rfq: 'New RFQ',
  invoices: 'New Invoice',
  'invoice-calendar': 'Schedule Invoice',
  expenses: 'Log Expense',
  balance: 'Refresh Report',
  pl: 'Refresh Report',
  tax: 'New Tax Entry',
  ai: 'Ask AI',
  fleet: 'Add Vehicle',
  workforce: 'Add Worker',
  tenders: 'New Tender',
  compliance: 'Log Inspection',
  engineering: 'New Calculation',
  'site-surveys': 'New Survey',
  'activity-log': 'Log Entry',
  quotations: 'New Quote',
  inbox: 'Compose',
  'email-marketing': 'New Campaign',
};

function navigate(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Remove active from nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target page
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');

  // Activate nav item
  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  // Update header
  const info = pageTitles[page] || [page, ''];
  document.getElementById('page-title').textContent = info[0];
  document.getElementById('page-subtitle').textContent = info[1];

  // Update quick action button
  const label = pageActions[page] || 'Add New';
  document.getElementById('quick-action-label').textContent = label;

  // Track current page & render modules
  currentPage = page;
  if (page === 'contacts') { renderContacts(); }
  if (page === 'crm') { renderCrmTable(); }
  if (page === 'jobs') { renderCalendar(); }
  if (page === 'payroll') { renderPayroll(); }
  updateAiBarChips(page);

  return false;
}

// ═══ CONTACTS MODULE ═══

let currentPage = 'dashboard';
let activeTypeFilter = 'all';
let selectedContactType = null;
let colFilters = { type: [], city: [], country: [] };

const typeConfig = {
  prospect: { label: 'Prospect', color: 'bg-purple-100 text-purple-700', routing: '→ Will appear in CRM as a Prospect' },
  lead: { label: 'Lead', color: 'bg-orange-100 text-orange-700', routing: '→ Will appear in CRM · Pipeline' },
  client: { label: 'Client', color: 'bg-blue-100 text-blue-700', routing: '→ Will appear in Clients · Projects · Job Calendar' },
  supplier: { label: 'Supplier', color: 'bg-teal-100 text-teal-700', routing: '→ Will appear in Procurement · Suppliers' },
  subcontractor: { label: 'Subcontractor', color: 'bg-indigo-100 text-indigo-700', routing: '→ Will appear in Procurement · Subcontractors · Job Calendar' },
  site: { label: 'Site Contact', color: 'bg-amber-100 text-amber-700', routing: '→ Will appear in Projects · Job Calendar (e.g. foremen, engineers on site)' },
  other: { label: 'Other', color: 'bg-slate-100 text-slate-600', routing: '→ Stored in Contacts only' },
};

const routingModules = {
  prospect: ['CRM'],
  lead: ['CRM', 'Pipeline'],
  client: ['Clients', 'Projects', 'Job Calendar'],
  supplier: ['Suppliers', 'Purchase Orders'],
  subcontractor: ['Subcontractors', 'Job Calendar', 'Projects'],
  site: ['Projects', 'Job Calendar'],
  other: ['Contacts'],
};

let contacts = [
  { id: 1, firstname: 'Karim', lastname: 'Nassar', company: 'Nassar Group', position: 'CEO', type: 'client', mobile: '+961 70 111 222', tel: '+961 1 333 444', email: 'karim@nassargroup.com', country: 'Lebanon', city: 'Beirut', lastContacted: '2026-04-10', notes: 'Key decision maker, prefers morning calls' },
  { id: 2, firstname: 'Lara', lastname: 'Frem', company: 'Frem Contractors', position: 'Procurement Mgr', type: 'supplier', mobile: '+961 71 222 333', tel: '', email: 'lara@fremco.com', country: 'Lebanon', city: 'Jounieh', lastContacted: '2026-03-28', notes: 'Supplies couplers and base plates' },
  { id: 3, firstname: 'Tarek', lastname: 'Haddad', company: 'MEC Build', position: 'Site Foreman', type: 'site', mobile: '+961 76 444 555', tel: '', email: 'tarek@mecbuild.com', country: 'Lebanon', city: 'Tripoli', lastContacted: '2026-04-12', notes: 'Foreman on Downtown Tower project' },
  { id: 4, firstname: 'Maya', lastname: 'Khoury', company: 'Skyline Developers', position: 'Project Manager', type: 'lead', mobile: '+961 70 555 666', tel: '+961 5 777 888', email: 'maya@skyline.lb', country: 'Saudi Arabia', city: 'Riyadh', lastContacted: '2026-03-15', notes: 'Interested in 6-month rental deal' },
  { id: 5, firstname: 'Georges', lastname: 'Bou Khalil', company: 'GBK Scaffolding', position: 'Owner', type: 'subcontractor', mobile: '+961 78 999 000', tel: '', email: 'georges@gbk.com', country: 'UAE', city: 'Dubai', lastContacted: '', notes: '' },
  { id: 6, firstname: 'Nadia', lastname: 'Karam', company: 'NK Developers', position: 'Director', type: 'prospect', mobile: '+961 3 112 887', tel: '', email: 'nadia@nkdev.com', country: 'Lebanon', city: 'Hazmieh', lastContacted: '2026-04-08', notes: 'Met at Horeca exhibition' },
];
let nextId = 6;

function getInitials(f, l) { return (f[0] || '') + (l[0] || ''); }
function avatarColor(type) {
  const map = { prospect: '#8b5cf6', lead: '#f97316', client: '#2e75b6', supplier: '#0d9488', subcontractor: '#4f46e5', site: '#d97706', other: '#64748b' };
  return map[type] || '#64748b';
}

function formatLastContacted(dateStr) {
  if (!dateStr) return '<span class="text-slate-300 text-xs">Never</span>';
  const d = new Date(dateStr);
  const now = new Date('2026-04-13');
  const diff = Math.floor((now - d) / 86400000);
  const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const color = diff === 0 ? 'text-green-600' : diff <= 7 ? 'text-blue-500' : diff <= 30 ? 'text-slate-500' : 'text-red-400';
  const ago = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff + 'd ago';
  return `<span class="text-xs ${color} font-medium">${label}</span><span class="text-slate-300 text-xs ml-1">${ago}</span>`;
}

function renderContacts() {
  const search = (document.getElementById('contact-search')?.value || '').toLowerCase();
  const filterLC = (document.getElementById('filter-last-contacted')?.value || '');
  const filterNotes = (document.getElementById('filter-notes')?.value || '').toLowerCase();
  const tbody = document.getElementById('contacts-tbody');
  const empty = document.getElementById('contacts-empty');
  if (!tbody) return;

  const now = new Date('2026-04-13');

  const filtered = contacts.filter(c => {
    const matchType = colFilters.type.length === 0 || colFilters.type.includes(c.type);
    const matchCity = colFilters.city.length === 0 || colFilters.city.includes(c.city);
    const matchCountry = colFilters.country.length === 0 || colFilters.country.includes(c.country);
    const matchSearch = !search ||
      (c.firstname + ' ' + c.lastname).toLowerCase().includes(search) ||
      c.company.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.position.toLowerCase().includes(search);
    const matchNotes = !filterNotes || (c.notes || '').toLowerCase().includes(filterNotes);
    let matchLC = true;
    if (filterLC) {
      if (filterLC === 'never') { matchLC = !c.lastContacted; }
      else if (c.lastContacted) {
        const d = new Date(c.lastContacted);
        const diff = Math.floor((now - d) / 86400000);
        if (filterLC === 'today') matchLC = diff === 0;
        if (filterLC === 'week') matchLC = diff <= 7;
        if (filterLC === 'month') matchLC = diff <= 30;
        if (filterLC === 'over30') matchLC = diff > 30;
      } else { matchLC = false; }
    }
    return matchType && matchCity && matchCountry && matchSearch && matchNotes && matchLC;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  tbody.innerHTML = filtered.map(c => {
    const cfg = typeConfig[c.type] || typeConfig.other;
    const notesSnippet = c.notes
      ? `<span class="text-xs text-slate-500 truncate block" title="${c.notes.replace(/"/g, "'")}">${c.notes}</span>`
      : '<span class="text-slate-300 text-xs">—</span>';
    const typeOptions = Object.entries(typeConfig).map(([k, v]) =>
      `<option value="${k}" ${k === c.type ? 'selected' : ''}>${v.label}</option>`
    ).join('');
    return `
      <tr class="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer" data-type="${c.type}" onclick="openContactDetail(${c.id})">
        <td class="px-4 py-2.5">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style="background:${avatarColor(c.type)}">${getInitials(c.firstname, c.lastname)}</div>
            <span class="font-semibold text-slate-800 text-xs truncate">${c.firstname} ${c.lastname}</span>
          </div>
        </td>
        <td class="px-3 py-2.5 text-xs text-slate-600 truncate">${c.company || '—'}</td>
        <td class="px-3 py-2.5 text-xs text-slate-500 truncate">${c.position || '—'}</td>
        <td class="px-3 py-2.5" onclick="event.stopPropagation()">
          <select onchange="updateContactType(${c.id},this.value)" class="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 w-full" style="color:${getTypeColor(c.type)}; font-weight:600;">
            ${typeOptions}
          </select>
        </td>
        <td class="px-3 py-2.5 text-xs text-slate-500 truncate">${c.city || '—'}</td>
        <td class="px-3 py-2.5 text-xs text-slate-500 truncate">${c.country || '—'}</td>
        <td class="px-3 py-2.5 text-xs text-slate-600 truncate">${c.mobile || c.tel || '—'}</td>
        <td class="px-3 py-2.5 text-xs text-slate-500 truncate">${c.email || '—'}</td>
        <td class="px-3 py-2.5 whitespace-nowrap">${formatLastContacted(c.lastContacted)}</td>
        <td class="px-3 py-2.5">${notesSnippet}</td>
        <td class="px-2 py-2.5 text-center" onclick="event.stopPropagation()">
          <button onclick="openContactDetail(${c.id})" class="text-blue-400 hover:text-blue-600 transition-colors" title="Open detail">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </button>
        </td>
      </tr>`;
  }).join('');
}

function clearContactFilters() {
  colFilters = { type: [], city: [], country: [] };
  ['cfd-icon-type', 'cfd-icon-city', 'cfd-icon-country'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.color = '';
  });
  document.getElementById('filter-last-contacted').value = '';
  document.getElementById('filter-notes').value = '';
  document.getElementById('contact-search').value = '';
  document.querySelectorAll('.col-filter-dropdown').forEach(d => d.classList.add('hidden'));
  updateColFilterChips();
  renderContacts();
}

function filterContacts(type) {
  renderContacts();
}

function openColFilter(col) {
  const dd = document.getElementById('cfd-' + col);
  if (!dd) return;
  const isOpen = !dd.classList.contains('hidden');
  document.querySelectorAll('.col-filter-dropdown').forEach(d => d.classList.add('hidden'));
  if (isOpen) return;
  let html = '';
  if (col === 'type') {
    html = Object.entries(typeConfig).map(([k, v]) =>
      `<label class="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" ${colFilters.type.includes(k) ? 'checked' : ''} onchange="toggleColFilter('type','${k}')" class="w-3 h-3 accent-blue-600 cursor-pointer">
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${v.color}">${v.label}</span>
      </label>`).join('');
  } else {
    const vals = [...new Set(contacts.map(c => c[col]).filter(Boolean))].sort();
    html = vals.map(v =>
      `<label class="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" ${colFilters[col].includes(v) ? 'checked' : ''} onchange="toggleColFilter('${col}','${v.replace(/'/g, "&#39;")}')" class="w-3 h-3 accent-blue-600 cursor-pointer">
        <span class="text-xs text-slate-700">${v}</span>
      </label>`).join('');
  }
  dd.innerHTML = html || '<p class="px-3 py-2 text-xs text-slate-400">No values</p>';
  dd.classList.remove('hidden');
}

function toggleColFilter(col, val) {
  const idx = colFilters[col].indexOf(val);
  if (idx >= 0) colFilters[col].splice(idx, 1);
  else colFilters[col].push(val);
  const icon = document.getElementById('cfd-icon-' + col);
  if (icon) icon.style.color = colFilters[col].length > 0 ? '#2e75b6' : '';
  updateColFilterChips();
  renderContacts();
}

function removeColFilter(col, val) {
  colFilters[col] = colFilters[col].filter(v => v !== val);
  const icon = document.getElementById('cfd-icon-' + col);
  if (icon) icon.style.color = colFilters[col].length > 0 ? '#2e75b6' : '';
  updateColFilterChips();
  renderContacts();
}

function updateColFilterChips() {
  const cont = document.getElementById('active-col-filters');
  if (!cont) return;
  let chips = '';
  const colLabels = { type: 'Type', city: 'City', country: 'Country' };
  for (const [col, vals] of Object.entries(colFilters)) {
    vals.forEach(v => {
      const label = col === 'type' ? (typeConfig[v]?.label || v) : v;
      chips += `<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">${colLabels[col]}: ${label}<button onclick="removeColFilter('${col}','${v.replace(/'/g, "&#39;")}')" class="ml-0.5 font-bold hover:text-red-500" style="font-size:13px;line-height:1">×</button></span>`;
    });
  }
  cont.innerHTML = chips;
}

function openContactModal(presetType) {
  selectedContactType = presetType || null;
  const typeEl = document.getElementById('cf-type');
  if (typeEl) typeEl.value = presetType || '';
  document.getElementById('routing-hint').classList.add('hidden');
  ['firstname', 'lastname', 'company', 'position', 'mobile', 'tel', 'fax', 'email', 'website', 'country', 'lastcontacted', 'notes']
    .forEach(f => { const el = document.getElementById('cf-' + f); if (el) el.value = ''; });
  if (presetType) selectType(presetType);
  document.getElementById('modal-contact').classList.remove('hidden');
}

function closeContactModal() {
  document.getElementById('modal-contact').classList.add('hidden');
}

function selectType(type) {
  selectedContactType = type;
  const typeEl = document.getElementById('cf-type');
  if (typeEl && typeEl.value !== type) typeEl.value = type;
  const hint = document.getElementById('routing-hint');
  const hintText = document.getElementById('routing-hint-text');
  if (typeConfig[type]) {
    hintText.textContent = typeConfig[type].routing;
    hint.classList.remove('hidden');
  }
}

function saveContact() {
  const firstname = document.getElementById('cf-firstname').value.trim();
  const lastname = document.getElementById('cf-lastname').value.trim();
  if (!firstname || !lastname) { alert('Please enter first and last name.'); return; }
  selectedContactType = document.getElementById('cf-type')?.value || selectedContactType;
  if (!selectedContactType) { showERPToast('⚠ Please select a contact type'); return; }
  contacts.push({
    id: nextId++,
    firstname, lastname,
    company: document.getElementById('cf-company').value.trim(),
    position: document.getElementById('cf-position').value.trim(),
    type: selectedContactType,
    mobile: document.getElementById('cf-mobile').value.trim(),
    tel: document.getElementById('cf-tel').value.trim(),
    email: document.getElementById('cf-email').value.trim(),
    country: document.getElementById('cf-country').value,
    city: document.getElementById('cf-city')?.value.trim() || '',
    lastContacted: document.getElementById('cf-lastcontacted').value,
    notes: document.getElementById('cf-notes').value.trim(),
  });
  closeContactModal();
  renderContacts();
}

// ═══ CRM LOG MODAL ═══
let selectedLogType = null;
let selectedInternalSrc = null;

function openLogCallModal() {
  selectedLogType = null; selectedInternalSrc = null;
  const sel = document.getElementById('log-type-select');
  if (sel) sel.value = '';
  document.getElementById('internal-source-row')?.classList.add('hidden');
  ['log-contact', 'log-quote-ref', 'log-notes', 'log-next-date'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  ['log-rep', 'log-duration', 'log-stage', 'log-next-action'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
  const now = new Date(); const pad = n => String(n).padStart(2, '0');
  const dt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const logDate = document.getElementById('log-date'); if (logDate) logDate.value = dt;
  document.getElementById('modal-log-call').classList.remove('hidden');
}
function closeLogCallModal() { document.getElementById('modal-log-call').classList.add('hidden'); }

function selectLogType(type) {
  selectedLogType = type;
  const internalRow = document.getElementById('internal-source-row');
  if (internalRow) internalRow.classList.toggle('hidden', type !== 'internal');
}

function selectInternalSource(src) {
  selectedInternalSrc = src;
  document.querySelectorAll('.int-src-btn').forEach(b => { b.classList.remove('border-slate-600', 'bg-slate-100'); b.classList.add('border-slate-200'); });
  const btn = document.querySelector(`.int-src-btn[data-src="${src}"]`);
  if (btn) { btn.classList.add('border-slate-600', 'bg-slate-100'); btn.classList.remove('border-slate-200'); }
}

function saveLogEntry() {
  selectedLogType = document.getElementById('log-type-select')?.value || selectedLogType;
  if (!selectedLogType) { showERPToast('⚠ Please select an entry type'); return; }
  const contact = document.getElementById('log-contact').value.trim();
  if (!contact) { alert('Please enter a contact or lead name.'); return; }
  const notes = document.getElementById('log-notes').value.trim();
  if (!notes) { alert('Please enter notes or outcome.'); return; }
  closeLogCallModal();
  alert('Entry logged successfully! (In production this would appear in the activity feed.)');
}

function handleQuickAction() {
  if (currentPage === 'contacts') openContactModal();
  else if (currentPage === 'clients') openContactModal('client');
  else if (currentPage === 'crm') openLogCallModal();
  else if (currentPage === 'projects') openProjectModal();
  else if (currentPage === 'jobs') openJobModal();
  else if (currentPage === 'invoices') openCreateInvoice();
  else if (currentPage === 'quotations') openQuotation();
  else if (currentPage === 'delivery') openDeliverySlip();
  else if (currentPage === 'purchase-orders') openPurchaseOrder();
  else if (currentPage === 'site-surveys') openSurveyModal();
  else if (currentPage === 'activity-log') document.getElementById('modal-log-entry')?.classList.remove('hidden');
  else if (currentPage === 'engineering') { engCalc('propping'); showERPToast('Start a new calculation below'); }
  else if (currentPage === 'inbox') openCompose('email', '', '');
  else if (currentPage === 'email-marketing') openEmailCampaign();
  else if (currentPage === 'workforce') openContactModal();
  else if (currentPage === 'suppliers') openContactModal('supplier');
  else if (currentPage === 'subcontractors') openContactModal('subcontractor');
  else showERPToast('Quick add for "' + (pageTitles[currentPage]?.[0] || currentPage) + '" — coming soon');
}

// ═══ CONTACT DETAIL PANEL ═══
let cdpActiveTab = 0;

const cdpTabsByType = {
  client: ['Overview', 'Quotations', 'Projects', 'Invoices', 'Balance', 'Stock'],
  lead: ['Overview', 'CRM Activity', 'Quotations'],
  prospect: ['Overview', 'CRM Activity'],
  supplier: ['Overview', 'Purchase Orders', 'RFQs', 'Invoices'],
  subcontractor: ['Overview', 'Projects', 'Contracts'],
  site: ['Overview', 'Projects', 'Field Updates'],
  other: ['Overview', 'Notes'],
};

const cdpSampleData = {
  client: {
    quotations: [
      { ref: 'Q-2026-039', date: 'Apr 8', scope: 'Façade – Jdeideh Tower', value: '$22,000', status: 'Sent' },
      { ref: 'Q-2026-021', date: 'Feb 14', scope: 'Shoring – Ashrafieh Site', value: '$18,500', status: 'Won' },
    ],
    projects: [
      { name: 'Downtown Tower', status: 'Active', value: '$34,000', start: 'Jan 2026', end: 'Jul 2026' },
      { name: 'Jdeideh Residential', status: 'Active', value: '$22,000', start: 'Mar 2026', end: 'Sep 2026' },
    ],
    invoices: [
      { no: 'INV-2026-041', date: 'Apr 1', amount: '$8,500', status: 'Overdue' },
      { no: 'INV-2026-028', date: 'Mar 1', amount: '$12,000', status: 'Paid' },
    ],
    balance: { totalBilled: '$74,500', totalPaid: '$66,000', outstanding: '$8,500' },
    stock: [
      { item: '48mm Standard 3m', qty: '120 pcs', 'site': 'Downtown Tower' },
      { item: 'Steel Plank 3m', qty: '60 pcs', 'site': 'Jdeideh Site' },
    ],
  },
  lead: {
    crmActivity: [
      { type: 'Inbound Call', date: 'Today 11:20am', rep: 'Ahmed Nassar', note: 'Requested quotation for tower façade' },
      { type: 'Email Sent', date: 'Apr 10', rep: 'Sara Khalil', note: 'Sent company profile and catalogue' },
    ],
    quotations: [
      { ref: 'Q-2026-041', date: 'Apr 11', scope: 'Mixed-use Tower – Hamra', value: '$14,500', status: 'Awaiting' },
    ],
  },
  prospect: {
    crmActivity: [
      { type: 'Email Sent', date: 'Apr 8', rep: 'Sara Khalil', note: 'Met at Horeca exhibition, sent intro email' },
    ],
  },
  supplier: {
    orders: [
      { po: 'PO-2026-018', date: 'Apr 5', items: 'Swivel Couplers × 500', value: '$3,200', status: 'Delivered' },
      { po: 'PO-2026-022', date: 'Apr 10', items: 'Base Plates × 300', value: '$1,800', status: 'Pending' },
    ],
    rfqs: [
      { rfq: 'RFQ-2026-007', date: 'Apr 2', desc: 'Standards & Ledgers Q2', status: 'Awarded' },
    ],
    invoices: [
      { no: 'SINV-041', date: 'Apr 6', amount: '$3,200', status: 'Paid' },
    ],
  },
  subcontractor: {
    projects: [
      { name: 'Downtown Tower', role: 'Installation crew', start: 'Jan 2026', end: 'Apr 2026', status: 'Active' },
    ],
    contracts: [
      { ref: 'CTR-2026-003', date: 'Jan 2026', value: '$14,000', expiry: 'Jun 2026', status: 'Active' },
    ],
  },
  site: {
    projects: [
      { name: 'Downtown Tower', role: 'Site Foreman', status: 'Active' },
    ],
    updates: [
      { date: 'Apr 12', category: 'Progress Update', note: 'Level 7 north face scaffolding 80% complete' },
      { date: 'Apr 11', category: 'Issue Reported', note: 'Client requested extension on Level 7 north face' },
    ],
  },
};

function openContactDetail(id) {
  const c = contacts.find(x => x.id === id);
  if (!c) return;
  cdpActiveTab = 0;

  // Header
  document.getElementById('cdp-avatar').style.background = avatarColor(c.type);
  document.getElementById('cdp-avatar').textContent = getInitials(c.firstname, c.lastname);
  document.getElementById('cdp-name').textContent = c.firstname + ' ' + c.lastname;
  const cfg = typeConfig[c.type] || typeConfig.other;
  document.getElementById('cdp-type-badge').className = 'pill ' + cfg.color;
  document.getElementById('cdp-type-badge').textContent = cfg.label;
  document.getElementById('cdp-meta').textContent = [c.position, c.company].filter(Boolean).join(' · ');

  // Quick info
  const qi = [
    c.mobile && `<span>📱 ${c.mobile}</span>`,
    c.tel && `<span>☎️ ${c.tel}</span>`,
    c.email && `<span>✉️ ${c.email}</span>`,
    (c.city || c.country) && `<span>📍 ${[c.city, c.country].filter(Boolean).join(', ')}</span>`,
    c.lastContacted && `<span>🕐 Last: ${c.lastContacted}</span>`,
  ].filter(Boolean).join('');
  document.getElementById('cdp-quick').innerHTML = qi;

  // Build tabs
  const tabs = cdpTabsByType[c.type] || ['Overview', 'Notes'];
  document.getElementById('cdp-tabs').innerHTML = tabs.map((t, i) =>
    `<button onclick="setCdpTab(${i},${id})" id="cdp-tab-${i}" class="px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${i === 0 ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'}">${t}</button>`
  ).join('');

  renderCdpTab(0, c);
  document.getElementById('contact-detail-panel').classList.remove('hidden');
}

function setCdpTab(idx, id) {
  cdpActiveTab = idx;
  const c = contacts.find(x => x.id === id);
  if (!c) return;
  document.querySelectorAll('[id^="cdp-tab-"]').forEach((b, i) => {
    b.className = `px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${i === idx ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`;
  });
  renderCdpTab(idx, c);
}

function renderCdpTab(idx, c) {
  const tabs = cdpTabsByType[c.type] || ['Overview', 'Notes'];
  const tab = tabs[idx];
  const data = cdpSampleData[c.type] || {};
  const el = document.getElementById('cdp-content');

  if (tab === 'Overview') {
    el.innerHTML = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          ${c.mobile ? `<div class="bg-slate-50 rounded-lg p-3"><p class="text-xs text-slate-400 mb-0.5">Mobile</p><p class="text-sm font-semibold text-slate-700">${c.mobile}</p></div>` : ''}
          ${c.tel ? `<div class="bg-slate-50 rounded-lg p-3"><p class="text-xs text-slate-400 mb-0.5">Telephone</p><p class="text-sm font-semibold text-slate-700">${c.tel}</p></div>` : ''}
          ${c.email ? `<div class="bg-slate-50 rounded-lg p-3 col-span-2"><p class="text-xs text-slate-400 mb-0.5">Email</p><p class="text-sm font-semibold text-slate-700">${c.email}</p></div>` : ''}
          ${c.company ? `<div class="bg-slate-50 rounded-lg p-3"><p class="text-xs text-slate-400 mb-0.5">Company</p><p class="text-sm font-semibold text-slate-700">${c.company}</p></div>` : ''}
          ${c.position ? `<div class="bg-slate-50 rounded-lg p-3"><p class="text-xs text-slate-400 mb-0.5">Position</p><p class="text-sm font-semibold text-slate-700">${c.position}</p></div>` : ''}
          ${c.city ? `<div class="bg-slate-50 rounded-lg p-3"><p class="text-xs text-slate-400 mb-0.5">City</p><p class="text-sm font-semibold text-slate-700">${c.city}</p></div>` : ''}
          ${c.country ? `<div class="bg-slate-50 rounded-lg p-3"><p class="text-xs text-slate-400 mb-0.5">Country</p><p class="text-sm font-semibold text-slate-700">${c.country}</p></div>` : ''}
        </div>
        ${c.notes ? `<div class="bg-amber-50 border border-amber-100 rounded-lg p-3"><p class="text-xs font-semibold text-amber-700 mb-1">Notes</p><p class="text-sm text-slate-600">${c.notes}</p></div>` : ''}
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p class="text-xs font-semibold text-blue-700 mb-1">Linked Modules</p>
          <div class="flex flex-wrap gap-1.5">${(routingModules[c.type] || ['Contacts']).map(m => `<span class="px-2 py-0.5 rounded-md text-xs font-semibold bg-white border border-blue-200 text-blue-700">${m}</span>`).join('')}</div>
        </div>
      </div>`;
    return;
  }

  if (tab === 'Quotations' && data.quotations) {
    el.innerHTML = `<div class="space-y-2">${data.quotations.map(q => `
      <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
        <div><p class="text-xs font-semibold text-slate-700">${q.ref} <span class="text-slate-400 font-normal">· ${q.date}</span></p><p class="text-xs text-slate-500 mt-0.5">${q.scope}</p></div>
        <div class="text-right"><p class="text-sm font-bold text-slate-800">${q.value}</p><span class="pill ${q.status === 'Won' ? 'status-active' : q.status === 'Sent' || q.status === 'Awaiting' ? 'status-planned' : 'status-completed'}">${q.status}</span></div>
      </div>`).join('')}
      <button class="w-full mt-2 py-2 border border-dashed border-blue-200 rounded-lg text-xs font-semibold text-blue-500 hover:bg-blue-50 transition-colors">+ New Quotation</button>
    </div>`;
    return;
  }

  if (tab === 'Projects' && data.projects) {
    el.innerHTML = `<div class="space-y-2">${data.projects.map(p => `
      <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
        <div><p class="text-xs font-semibold text-slate-700">${p.name}</p><p class="text-xs text-slate-400">${p.role || ''} ${p.start} → ${p.end}</p></div>
        <div class="text-right">${p.value ? `<p class="text-sm font-bold text-slate-800">${p.value}</p>` : ''}<span class="pill status-${p.status === 'Active' ? 'active' : 'completed'}">${p.status}</span></div>
      </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'Invoices' && data.invoices) {
    el.innerHTML = `<div class="space-y-2">${data.invoices.map(inv => `
      <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
        <div><p class="text-xs font-semibold text-slate-700">${inv.no}</p><p class="text-xs text-slate-400">${inv.date}</p></div>
        <div class="text-right"><p class="text-sm font-bold text-slate-800">${inv.amount}</p><span class="pill ${inv.status === 'Paid' ? 'status-active' : inv.status === 'Overdue' ? 'status-overdue' : 'status-planned'}">${inv.status}</span></div>
      </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'Balance' && data.balance) {
    const b = data.balance;
    el.innerHTML = `
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-blue-50 rounded-xl p-4 text-center"><p class="text-xl font-bold text-blue-700">${b.totalBilled}</p><p class="text-xs text-slate-500 mt-1">Total Billed</p></div>
          <div class="bg-green-50 rounded-xl p-4 text-center"><p class="text-xl font-bold text-green-700">${b.totalPaid}</p><p class="text-xs text-slate-500 mt-1">Collected</p></div>
          <div class="bg-red-50 rounded-xl p-4 text-center"><p class="text-xl font-bold text-red-600">${b.outstanding}</p><p class="text-xs text-slate-500 mt-1">Outstanding</p></div>
        </div>
      </div>`;
    return;
  }

  if (tab === 'Stock' && data.stock) {
    el.innerHTML = `<div class="space-y-2">${data.stock.map(s => `
      <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
        <div><p class="text-xs font-semibold text-slate-700">${s.item}</p><p class="text-xs text-slate-400">On site: ${s.site}</p></div>
        <p class="text-sm font-bold text-slate-800">${s.qty}</p>
      </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'CRM Activity' && data.crmActivity) {
    el.innerHTML = `<div class="space-y-3">${data.crmActivity.map(a => `
      <div class="bg-slate-50 rounded-lg px-4 py-3">
        <div class="flex items-center gap-2 mb-1"><span class="text-xs font-bold text-blue-600">${a.type}</span><span class="text-slate-300">·</span><span class="text-xs text-slate-400">${a.date}</span><span class="text-slate-300">·</span><span class="text-xs text-slate-500">${a.rep}</span></div>
        <p class="text-xs text-slate-600">${a.note}</p>
      </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'Purchase Orders' && data.orders) {
    el.innerHTML = `<div class="space-y-2">${data.orders.map(o => `
      <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
        <div><p class="text-xs font-semibold text-slate-700">${o.po} · <span class="font-normal text-slate-400">${o.date}</span></p><p class="text-xs text-slate-500">${o.items}</p></div>
        <div class="text-right"><p class="text-sm font-bold text-slate-800">${o.value}</p><span class="pill ${o.status === 'Delivered' ? 'status-active' : 'status-planned'}">${o.status}</span></div>
      </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'Contracts' && data.contracts) {
    el.innerHTML = `<div class="space-y-2">${data.contracts.map(ct => `
      <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
        <div><p class="text-xs font-semibold text-slate-700">${ct.ref} · <span class="font-normal text-slate-400">${ct.date}</span></p><p class="text-xs text-slate-400">Expires: ${ct.expiry}</p></div>
        <div class="text-right"><p class="text-sm font-bold text-slate-800">${ct.value}</p><span class="pill status-active">${ct.status}</span></div>
      </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'Field Updates' && data.updates) {
    el.innerHTML = `<div class="space-y-3">${data.updates.map(u => `
      <div class="bg-slate-50 rounded-lg px-4 py-3">
        <div class="flex items-center gap-2 mb-1"><span class="text-xs font-bold text-slate-600">${u.category}</span><span class="text-xs text-slate-400 ml-auto">${u.date}</span></div>
        <p class="text-xs text-slate-600">${u.note}</p>
      </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'RFQs' && data.rfqs) {
    el.innerHTML = `<div class="space-y-2">${data.rfqs.map(r => `
      <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
        <div><p class="text-xs font-semibold text-slate-700">${r.rfq} · <span class="font-normal text-slate-400">${r.date}</span></p><p class="text-xs text-slate-500">${r.desc}</p></div>
        <span class="pill status-active">${r.status}</span>
      </div>`).join('')}
    </div>`;
    return;
  }

  // Fallback
  el.innerHTML = `<p class="text-sm text-slate-400 text-center py-10">No data for this tab yet.</p>`;
}

function closeContactDetail() {
  document.getElementById('contact-detail-panel').classList.add('hidden');
}

function getTypeColor(type) {
  const map = { prospect: '#7c3aed', lead: '#c2410c', client: '#1d4ed8', supplier: '#0f766e', subcontractor: '#4338ca', site: '#b45309', other: '#475569' };
  return map[type] || '#475569';
}
function updateContactType(id, newType) {
  const c = contacts.find(x => x.id === id);
  if (c) { c.type = newType; renderContacts(); }
}

// ═══ CRM TABLE DATA + RESIZABLE COLUMNS ═══
const crmLeads = [
  { id: 1, name: 'George Saadeh', company: 'Saadeh Holding', phone: '+961 3 445 621', rep: 'Ahmed Nassar', source: 'Referral', sourceStyle: 'background:#f3e8ff;color:#7e22ce;', stage: 'Quote Sent', stageStyle: 'background:#fef3c7;color:#92400e;', scope: 'Façade · 3 mo rental', value: '$22,000', lastActivity: 'Today', nextAction: 'Chase today', nextStyle: 'color:#ef4444;', notes: 'Interested in Jdeideh tower façade project. Decision maker confirmed.', phone2: '+961 1 556 200', email: 'george@saadehholding.com' },
  { id: 2, name: 'Nadia Karam', company: 'NK Developers', phone: '+961 3 112 887', rep: 'Sara Khalil', source: 'Inbound Call', sourceStyle: 'background:#dbeafe;color:#1e40af;', stage: 'Qualified', stageStyle: 'background:#d1fae5;color:#065f46;', scope: 'Mixed-use · 4 mo rental', value: '$14,500', lastActivity: 'Yesterday', nextAction: 'Send quote', nextStyle: 'color:#d97706;', notes: 'Called in from billboard ad. Hamra tower project starting May.', phone2: '', email: 'nadia@nkdev.com' },
  { id: 3, name: 'Fadi Haddad', company: 'Byblos Construction', phone: '+961 3 778 234', rep: 'Ahmed Nassar', source: 'Website', sourceStyle: 'background:#dcfce7;color:#166534;', stage: 'New Lead', stageStyle: 'background:#dbeafe;color:#1e40af;', scope: 'Residential · Rental TBD', value: '~$8,000', lastActivity: 'Apr 10', nextAction: 'Site survey', nextStyle: 'color:#3b82f6;', notes: 'Filled contact form on website. Needs site survey before quote.', phone2: '', email: 'fadi@byblosconst.com' },
  { id: 4, name: 'Tony Azar', company: 'Azar Real Estate', phone: '+961 3 993 017', rep: 'Rami Younes', source: 'Referral', sourceStyle: 'background:#f3e8ff;color:#7e22ce;', stage: 'Negotiation', stageStyle: 'background:#f3e8ff;color:#7e22ce;', scope: 'Shoring + façade · 6 mo', value: '$36,000', lastActivity: 'Today', nextAction: 'Site visit Thu', nextStyle: 'color:#8b5cf6;', notes: 'Referred by Karim Nassar. Large Mazraa project, multi-phase.', phone2: '+961 1 443 210', email: 'tony@azarre.com' },
  { id: 5, name: 'Maya Khoury', company: 'Skyline Developers', phone: '+961 70 555 666', rep: 'Sara Khalil', source: 'LinkedIn', sourceStyle: 'background:#f0fdf4;color:#166534;', stage: 'New Lead', stageStyle: 'background:#dbeafe;color:#1e40af;', scope: 'High-rise · sale interest', value: '~$38,000', lastActivity: 'Apr 10', nextAction: 'Discovery call', nextStyle: 'color:#3b82f6;', notes: 'Reached out via LinkedIn. Interested in purchasing scaffold for new high-rise project in Saudi Arabia.', phone2: '', email: 'maya@skylinedev.com' },
];
let crmExpanded = {};

function renderCrmTable(filter) {
  const tbody = document.getElementById('crm-tbody');
  if (!tbody) return;
  const q = (filter || document.getElementById('crm-search')?.value || '').toLowerCase();
  const rows = crmLeads.filter(l =>
    !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.rep.toLowerCase().includes(q)
  );
  tbody.innerHTML = rows.map(l => {
    const expanded = crmExpanded[l.id];
    return `
    <tr class="crm-lead-row cursor-pointer ${expanded ? 'crm-row-expanded' : ''} transition-colors" onclick="toggleCrmRow(${l.id})">
      <td class="px-4 py-2.5 overflow-hidden">
        <div class="flex items-center gap-1.5">
          <svg class="flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg>
          <div class="min-w-0"><p class="font-semibold text-slate-700 text-xs truncate">${l.name}</p><p class="text-slate-400 text-xs truncate">${l.company}</p></div>
        </div>
      </td>
      <td class="px-3 py-2.5 text-xs text-slate-600 truncate">${l.rep}</td>
      <td class="px-3 py-2.5"><span class="pill text-xs" style="${l.sourceStyle}">${l.source}</span></td>
      <td class="px-3 py-2.5"><span class="pill text-xs" style="${l.stageStyle}">${l.stage}</span></td>
      <td class="px-3 py-2.5 text-xs text-slate-500 truncate">${l.scope}</td>
      <td class="px-3 py-2.5 text-xs font-semibold text-slate-700 truncate">${l.value}</td>
      <td class="px-3 py-2.5 text-xs text-slate-400 truncate">${l.lastActivity}</td>
      <td class="px-3 py-2.5 text-xs font-medium truncate" style="${l.nextStyle}">${l.nextAction}</td>
      <td class="px-2 py-2.5 text-center">
        <div class="flex items-center gap-1 justify-center">
          <button onclick="event.stopPropagation();openCompose('email','${l.email}','${l.name}')" class="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition" title="Send email">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9 2 2 2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </button>
          <button onclick="event.stopPropagation();openCompose('whatsapp','${l.phone}','${l.name}')" class="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-green-500 hover:bg-green-50 transition" title="WhatsApp">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>
        </div>
      </td>
    </tr>
    ${expanded ? `<tr class="crm-expand-panel"><td colspan="9" class="px-6 py-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="space-y-1">
          <p class="font-semibold text-slate-500 uppercase tracking-wide text-xs">Contact Info</p>
          ${l.phone ? `<p class="text-slate-700">📱 ${l.phone}</p>` : ''}
          ${l.phone2 ? `<p class="text-slate-700">☎️ ${l.phone2}</p>` : ''}
          ${l.email ? `<p class="text-slate-700">✉️ ${l.email}</p>` : ''}
        </div>
        <div class="space-y-1">
          <p class="font-semibold text-slate-500 uppercase tracking-wide text-xs">Notes</p>
          <p class="text-slate-600 leading-relaxed">${l.notes}</p>
        </div>
        <div class="space-y-2">
          <p class="font-semibold text-slate-500 uppercase tracking-wide text-xs">Quick Actions</p>
          <div class="flex flex-wrap gap-1.5">
            <button onclick="event.stopPropagation();openCompose('email','${l.email}','${l.name}')" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style="background:#2e75b6;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9 2 2 2z"/><polyline points="22,6 12,13 2,6"/></svg>Email
            </button>
            <button onclick="event.stopPropagation();openCompose('whatsapp','${l.phone}','${l.name}')" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style="background:#25d366;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp
            </button>
            <button onclick="event.stopPropagation();openLogCallModal()" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50">Log Entry</button>
            <button onclick="event.stopPropagation();openQuotation()" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50">Send Quote</button>
            <button onclick="event.stopPropagation();navigate('site-surveys')" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50">Site Survey</button>
          </div>
        </div>
      </div>
    </td></tr>` : ''}`;
  }).join('');
}

function toggleCrmRow(id) {
  crmExpanded[id] = !crmExpanded[id];
  renderCrmTable();
}

function filterCrmTable() { renderCrmTable(); }

// Column resize logic
(function initCrmResize() {
  let resizing = null, startX = 0, startW = 0;
  document.addEventListener('mousedown', e => {
    const h = e.target.closest('.crm-resize-handle');
    if (!h) return;
    e.preventDefault();
    const col = h.dataset.col;
    const colEl = document.getElementById('crm-col-' + col);
    if (!colEl) return;
    resizing = colEl; startX = e.clientX;
    startW = colEl.offsetWidth || parseInt(colEl.style.width);
    h.classList.add('resizing');
  });
  document.addEventListener('mousemove', e => {
    if (!resizing) return;
    const newW = Math.max(60, startW + e.clientX - startX);
    resizing.style.width = newW + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (resizing) { document.querySelectorAll('.crm-resize-handle').forEach(h => h.classList.remove('resizing')); resizing = null; }
  });
})();

// ═══ ASK ME ANYTHING BAR ═══
const aiBarChips = {
  dashboard: ['Show delayed projects', 'Overdue invoices', 'Low stock alerts'],
  contacts: ['Show all clients', 'Leads added this week', 'Contacts never reached'],
  crm: ['Follow-ups due today', 'Quotes awaiting response', 'Top deals this month'],
  clients: ['Clients with overdue balance', 'Most active clients', 'New clients this month'],
  projects: ['Delayed projects', 'Projects ending this month', 'On-hold projects'],
  jobs: ['Today\'s deliveries', 'Pending installations', 'Crew availability'],
  updates: ['Unreviewed updates', 'Safety alerts', 'Material requests'],
  inventory: ['Low stock items', 'Items on site', 'Reorder needed'],
  delivery: ['Today\'s deliveries', 'Unsigned slips', 'Collections due'],
  docs: ['Expiring certificates', 'Contracts pending', 'Recent uploads'],
  suppliers: ['Suppliers with open POs', 'Overdue deliveries', 'Top suppliers by spend'],
  subcontractors: ['Active on site', 'Contracts expiring', 'Available crews'],
  'purchase-orders': ['Pending approval', 'Delivered this week', 'Open PO value'],
  rfq: ['Open RFQs', 'Awaiting responses', 'Best savings this month'],
  invoices: ['Overdue invoices', 'Drafts to send', 'Paid this month'],
  'invoice-calendar': ['Due this week', 'Overdue payments', 'Upcoming invoices'],
  expenses: ['Pending approval', 'By category this month', 'Over budget items'],
  balance: ['Total assets', 'Outstanding liabilities', 'Net position'],
  pl: ['Revenue vs target', 'Highest cost category', 'Net profit margin'],
  tax: ['VAT due this period', 'Unfiled returns', 'WHT deductions'],
  ai: ['Summarise today\'s activity', 'Revenue forecast', 'Project risk report'],
  fleet: ['Vehicle status today', 'Maintenance due', 'Fuel cost this month', 'Driver assignments'],
  workforce: ['Workers on site today', 'Attendance summary', 'Wage run due', 'Team availability'],
  tenders: ['Active tenders', 'Win rate this year', 'Upcoming deadlines', 'Past pricing reference'],
  compliance: ['Open safety issues', 'Inspections due this week', 'Site certification status', 'Recent violations'],
};

function updateAiBarChips(page) {
  const container = document.getElementById('ai-bar-chips');
  if (!container) return;
  // Only show AI suggestion chips on the dedicated AI page
  if (page === 'ai') {
    const chips = aiBarChips[page] || []; // Note: using chips as defined in the scope
    container.innerHTML = (chips).map(c =>
      `<button onclick="document.getElementById('ai-chat-input').value='${c}'" class="px-2 py-1 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 whitespace-nowrap transition-colors">${c}</button>`
    ).join('');
    container.classList.remove('hidden');
  } else {
    container.innerHTML = '';
    container.classList.add('hidden');
  }
  // Keep placeholder updated
  const aiInp = document.getElementById('ai-chat-input');
  if (aiInp) aiInp.placeholder = 'Message ACHII Assistant';
}

function handleAiBarSubmit() {
  const val = document.getElementById('ai-chat-input').value.trim();
  if (!val) return;
  document.getElementById('ai-chat-input').value = '';
  aiSendPrompt(val);
}

/* ════════════════════════════════════
   ACHI ASSISTANT — CHAT ENGINE
   ════════════════════════════════════ */

const AI_KNOWLEDGE = {
  invoices: [
    { no: 'INV-2604-001', client: 'Marina Tower LLC', amount: '$38,500', status: 'Overdue', days: 45, due: 'Mar 1, 2026' },
    { no: 'INV-2604-003', client: 'Damac Dubai', amount: '$62,760', status: 'Overdue', days: 10, due: 'Apr 3, 2026' },
    { no: 'INV-2604-005', client: 'Kuwait Port Auth.', amount: '$102,240', status: 'Overdue', days: 8, due: 'Apr 5, 2026' },
    { no: 'INV-2604-007', client: 'Harbour Mall Dev.', amount: '$22,000', status: 'Sent', days: 0, due: 'Apr 20, 2026' },
    { no: 'INV-2604-009', client: 'Al Reem Properties', amount: '$9,800', status: 'Draft', days: 0, due: null },
    { no: 'INV-2604-011', client: 'National Contractors', amount: '$67,200', status: 'Paid', days: 0, due: 'Apr 10, 2026' },
  ],
  projects: [
    { name: 'Marina Tower Facade', client: 'Marina Tower LLC', status: 'Active', progress: 65, team: 8, value: '$340K', deadline: 'Jul 2026' },
    { name: 'Harbour Mall Propping', client: 'Harbour Mall Dev.', status: 'Active', progress: 40, team: 5, value: '$220K', deadline: 'Jun 2026' },
    { name: 'Al Reem Villa', client: 'Al Reem Properties', status: 'Active', progress: 80, team: 3, value: '$98K', deadline: 'May 2026' },
    { name: 'Kuwait Port Scaffold', client: 'Kuwait Port Auth.', status: 'Delayed', progress: 20, team: 12, value: '$420K', deadline: 'May 2026' },
    { name: 'Hamra Hotel Refurb', client: 'Hamra Hotel Group', status: 'On Hold', progress: 0, team: 0, value: '$146K', deadline: 'Aug 2026' },
    { name: 'Downtown Bridge Access', client: 'National Contractors', status: 'Completed', progress: 100, team: 6, value: '$672K', deadline: 'Apr 2026' },
  ],
  fleet: [
    { plate: 'T-01 · ABC 1234', vehicle: 'MAN TGS 26', driver: 'Hassan Ali', status: 'On Duty', km: 142500, nextService: 'Apr 20, 2026' },
    { plate: 'T-02 · DEF 5678', vehicle: 'Mercedes Actros', driver: 'Karim Nasser', status: 'On Duty', km: 98300, nextService: 'May 5, 2026' },
    { plate: 'T-03 · GHI 9012', vehicle: 'MAN TGS 26', driver: '—', status: 'Maintenance', km: 210400, nextService: 'Overdue' },
    { plate: 'T-04 · JKL 3456', vehicle: 'Toyota Hilux', driver: 'Omar Fahed', status: 'Available', km: 34200, nextService: 'Jun 2026' },
    { plate: 'T-05 · MNO 7890', vehicle: 'Isuzu NQR', driver: 'Ali Mansour', status: 'On Duty', km: 67800, nextService: 'Overdue' },
  ],
  expenses: [
    { category: 'Labour', amount: 54300, pct: 38 },
    { category: 'Materials', amount: 38200, pct: 27 },
    { category: 'Fuel', amount: 28400, pct: 20 },
    { category: 'Equipment Rental', amount: 13200, pct: 9 },
    { category: 'Other', amount: 8700, pct: 6 },
  ],
  clients: [
    { name: 'Marina Tower LLC', revenue: '$340K', projects: 2, status: 'Active' },
    { name: 'Kuwait Port Auth.', revenue: '$420K', projects: 1, status: 'Active' },
    { name: 'National Contractors', revenue: '$672K', projects: 3, status: 'Active' },
    { name: 'Damac Dubai', revenue: '$185K', projects: 2, status: 'Active' },
    { name: 'Harbour Mall Dev.', revenue: '$220K', projects: 1, status: 'Active' },
  ],
  inventory: [
    { item: '48.3mm Scaffold Tube 6m', qty: 342, unit: 'pcs', status: 'Low', reorder: 500 },
    { item: 'Swivel Couplers', qty: 1240, unit: 'pcs', status: 'OK', reorder: 800 },
    { item: 'Scaffold Boards 3.9m', qty: 89, unit: 'pcs', status: 'Low', reorder: 200 },
    { item: 'Kwikstage Standards 2m', qty: 210, unit: 'pcs', status: 'OK', reorder: 150 },
    { item: 'Base Plates', qty: 44, unit: 'pcs', status: 'Critical', reorder: 100 },
  ]
};

const AI_RESPONSES = [
  {
    match: /overdue|late.*invoice|unpaid/i,
    reply: () => {
      const ov = AI_KNOWLEDGE.invoices.filter(i => i.status === 'Overdue');
      const total = ov.reduce((s, i) => s + parseFloat(i.amount.replace(/[$,K]/g, '')) * (i.amount.includes('K') ? 1000 : 1), 0);
      const rows = ov.map(i => `<tr class="border-t border-slate-100 hover:bg-slate-50">
        <td class="px-3 py-2 font-mono text-xs text-blue-600">${i.no}</td>
        <td class="px-3 py-2">${i.client}</td>
        <td class="px-3 py-2 text-right font-semibold">${i.amount}</td>
        <td class="px-3 py-2 text-right"><span class="text-red-600 font-bold">${i.days} days</span></td>
      </tr>`).join('');
      return `<p class="mb-3 text-slate-700">You have <strong>${ov.length} overdue invoices</strong> totalling approximately <strong class="text-red-600">$${(total / 1000).toFixed(1)}K</strong>:</p>
      <div class="overflow-x-auto rounded-lg border border-slate-200">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs text-slate-500 uppercase"><tr>
            <th class="px-3 py-2 text-left">Invoice</th><th class="px-3 py-2 text-left">Client</th>
            <th class="px-3 py-2 text-right">Amount</th><th class="px-3 py-2 text-right">Days Overdue</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="mt-3 text-slate-500 text-xs">Would you like me to draft payment reminder emails, or navigate to the Invoices page?</p>`;
    }
  },
  {
    match: /project.*behind|behind.*schedule|delayed|on.hold/i,
    reply: () => {
      const prob = AI_KNOWLEDGE.projects.filter(p => p.status !== 'Completed' && p.status !== 'Active');
      const active = AI_KNOWLEDGE.projects.filter(p => p.status === 'Active' && p.progress < 50);
      return `<p class="mb-3 text-slate-700">Here's a status summary of your <strong>${AI_KNOWLEDGE.projects.length} projects</strong>:</p>
      <div class="space-y-2">
        ${AI_KNOWLEDGE.projects.map(p => `<div class="flex items-center gap-3 p-2 rounded-lg ${p.status === 'Delayed' ? 'bg-red-50' : p.status === 'On Hold' ? 'bg-amber-50' : 'bg-slate-50'}">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">${p.name}</p>
            <p class="text-xs text-slate-500">${p.client} · Due ${p.deadline} · ${p.team} workers</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <div class="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div class="h-full rounded-full ${p.status === 'Delayed' ? 'bg-red-500' : p.status === 'On Hold' ? 'bg-amber-400' : 'bg-blue-500'}" style="width:${p.progress}%"></div></div>
            <span class="text-xs font-semibold w-8 text-right">${p.progress}%</span>
            <span class="pill text-xs px-2 py-0.5 rounded-full font-semibold" style="${p.status === 'Delayed' ? 'background:#fee2e2;color:#991b1b' : p.status === 'On Hold' ? 'background:#fef9c3;color:#854d0e' : p.status === 'Completed' ? 'background:#d1fae5;color:#065f46' : 'background:#dbeafe;color:#1e40af'}">${p.status}</span>
          </div>
        </div>`).join('')}
      </div>
      <p class="mt-3 text-slate-500 text-xs">⚠️ Kuwait Port Scaffold is <strong>delayed</strong> — consider reviewing staffing. Hamra Hotel is <strong>on hold</strong> pending client approval.</p>`;
    }
  },
  {
    match: /deliver|shipment|truck|fleet|vehicle|maintenance/i,
    reply: () => {
      const due = AI_KNOWLEDGE.fleet.filter(v => v.nextService === 'Overdue' || v.status === 'Maintenance');
      return `<p class="mb-3 text-slate-700">Your fleet has <strong>${AI_KNOWLEDGE.fleet.length} vehicles</strong>. Here's the current status:</p>
      <div class="overflow-x-auto rounded-lg border border-slate-200">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs text-slate-500 uppercase"><tr>
            <th class="px-3 py-2 text-left">Vehicle</th><th class="px-3 py-2 text-left">Driver</th>
            <th class="px-3 py-2 text-left">Status</th><th class="px-3 py-2 text-left">Next Service</th>
          </tr></thead>
          <tbody>${AI_KNOWLEDGE.fleet.map(v => `<tr class="border-t border-slate-100 hover:bg-slate-50">
            <td class="px-3 py-2"><p class="font-medium">${v.vehicle}</p><p class="text-xs text-slate-400 font-mono">${v.plate}</p></td>
            <td class="px-3 py-2 text-slate-600">${v.driver}</td>
            <td class="px-3 py-2"><span class="pill px-2 py-0.5 rounded-full text-xs font-semibold" style="${v.status === 'On Duty' ? 'background:#d1fae5;color:#065f46' : v.status === 'Maintenance' ? 'background:#fee2e2;color:#991b1b' : 'background:#f1f5f9;color:#475569'}">${v.status}</span></td>
            <td class="px-3 py-2 ${v.nextService === 'Overdue' ? 'text-red-600 font-bold' : 'text-slate-600'}">${v.nextService}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      ${due.length ? `<p class="mt-3 text-amber-700 text-xs font-medium bg-amber-50 rounded-lg p-2">⚠️ ${due.length} vehicle(s) need immediate attention: ${due.map(v => v.vehicle).join(', ')}</p>` : ''}`;
    }
  },
  {
    match: /expense|cost|spend|budget/i,
    reply: () => {
      const total = AI_KNOWLEDGE.expenses.reduce((s, e) => s + e.amount, 0);
      const colors = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#94a3b8'];
      return `<p class="mb-3 text-slate-700">Here's your <strong>April 2026 expense breakdown</strong> — total <strong>$${(total / 1000).toFixed(1)}K</strong>:</p>
      <div class="space-y-2.5 mb-3">
        ${AI_KNOWLEDGE.expenses.map((e, i) => `<div class="flex items-center gap-3">
          <span class="text-sm text-slate-600 w-36 flex-shrink-0">${e.category}</span>
          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full rounded-full" style="width:${e.pct}%;background:${colors[i]}"></div></div>
          <span class="text-sm font-semibold text-slate-800 w-14 text-right">$${(e.amount / 1000).toFixed(1)}K</span>
          <span class="text-xs text-slate-400 w-8 text-right">${e.pct}%</span>
        </div>`).join('')}
      </div>
      <p class="text-slate-500 text-xs">Labour is your largest cost at 38%. 8 expense entries are still pending approval.</p>`;
    }
  },
  {
    match: /top.*client|best.*client|client.*revenue|revenue/i,
    reply: () => {
      const sorted = [...AI_KNOWLEDGE.clients].sort((a, b) => parseFloat(b.revenue.replace(/[$K]/g, '')) - parseFloat(a.revenue.replace(/[$K]/g, '')));
      return `<p class="mb-3 text-slate-700">Here are your <strong>top clients by revenue</strong>:</p>
      <div class="space-y-2">
        ${sorted.map((c, i) => `<div class="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style="background:${['#2e75b6', '#10b981', '#f97316', '#a855f7', '#ef4444'][i]}">${i + 1}</div>
          <div class="flex-1"><p class="text-sm font-semibold text-slate-800">${c.name}</p><p class="text-xs text-slate-500">${c.projects} active project(s)</p></div>
          <span class="text-sm font-bold text-blue-700">${c.revenue}</span>
        </div>`).join('')}
      </div>
      <p class="mt-3 text-slate-500 text-xs">National Contractors is your highest-revenue client this period.</p>`;
    }
  },
  {
    match: /inventory|stock|low.*stock|material.*short/i,
    reply: () => {
      const alerts = AI_KNOWLEDGE.inventory.filter(i => i.status !== 'OK');
      return `<p class="mb-3 text-slate-700">You have <strong>${alerts.length} inventory alert(s)</strong> requiring attention:</p>
      <div class="overflow-x-auto rounded-lg border border-slate-200">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs text-slate-500 uppercase"><tr>
            <th class="px-3 py-2 text-left">Item</th><th class="px-3 py-2 text-right">In Stock</th><th class="px-3 py-2 text-right">Reorder At</th><th class="px-3 py-2">Status</th>
          </tr></thead>
          <tbody>${AI_KNOWLEDGE.inventory.map(inv => `<tr class="border-t border-slate-100 hover:bg-slate-50">
            <td class="px-3 py-2">${inv.item}</td>
            <td class="px-3 py-2 text-right font-mono">${inv.qty}</td>
            <td class="px-3 py-2 text-right font-mono text-slate-400">${inv.reorder}</td>
            <td class="px-3 py-2"><span class="pill px-2 py-0.5 rounded-full text-xs font-semibold" style="${inv.status === 'Critical' ? 'background:#fee2e2;color:#991b1b' : inv.status === 'Low' ? 'background:#fef9c3;color:#854d0e' : 'background:#d1fae5;color:#065f46'}">${inv.status}</span></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="mt-3 text-amber-700 text-xs bg-amber-50 rounded-lg p-2 font-medium">⚠️ Base Plates are critically low (${AI_KNOWLEDGE.inventory.find(i => i.item.includes('Base')).qty} remaining). Recommend raising a PO immediately.</p>`;
    }
  },
  {
    match: /worker|staff|workforce|crew|labour|employee|on.?site/i,
    reply: () => `<p class="mb-3 text-slate-700">Here's today's <strong>workforce snapshot</strong>:</p>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="bg-blue-50 rounded-xl p-3 text-center"><p class="text-xs text-slate-500 mb-1">Total Workers</p><p class="text-3xl font-bold text-blue-700">24</p></div>
        <div class="bg-green-50 rounded-xl p-3 text-center"><p class="text-xs text-slate-500 mb-1">On Site Today</p><p class="text-3xl font-bold text-green-700">18</p></div>
        <div class="bg-slate-50 rounded-xl p-3 text-center"><p class="text-xs text-slate-500 mb-1">Standby</p><p class="text-3xl font-bold text-slate-700">4</p></div>
        <div class="bg-amber-50 rounded-xl p-3 text-center"><p class="text-xs text-slate-500 mb-1">Leave / Off</p><p class="text-3xl font-bold text-amber-700">2</p></div>
      </div>
      <p class="text-slate-500 text-xs">3 workers are due for safety certification renewal this month. Payroll runs on the 28th.</p>`,
  },
  {
    match: /survey|site.*survey|inspection/i,
    reply: () => `<p class="mb-3 text-slate-700">Here's the <strong>Site Survey status</strong>:</p>
      <div class="space-y-2">
        <div class="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg"><div><p class="text-sm font-medium">SS-026 – Al Nakheel Tower</p><p class="text-xs text-slate-500">Assigned: Ahmed Haddad · Scheduled: Apr 15</p></div><span class="pill px-2 py-0.5 rounded-full text-xs font-semibold" style="background:#fef9c3;color:#854d0e">Not Started</span></div>
        <div class="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg"><div><p class="text-sm font-medium">SS-025 – Corniche Residences</p><p class="text-xs text-slate-500">Assigned: Karim Nasser · Scheduled: Apr 13</p></div><span class="pill px-2 py-0.5 rounded-full text-xs font-semibold" style="background:#dbeafe;color:#1e40af">In Progress</span></div>
        <div class="flex items-center justify-between p-2.5 bg-green-50 rounded-lg"><div><p class="text-sm font-medium">SS-024 – Hamra Office Block</p><p class="text-xs text-slate-500">Completed Apr 10 · 12/12 checklist · 3 photos</p></div><span class="pill px-2 py-0.5 rounded-full text-xs font-semibold" style="background:#d1fae5;color:#065f46">Completed</span></div>
      </div>
      <p class="mt-3 text-slate-500 text-xs">SS-026 is tomorrow — remind Ahmed to confirm attendance?</p>`,
  },
  {
    match: /hello|hi |hey |morning|good day|how are you/i,
    reply: () => `<p class="text-slate-700">Hey there! 👋 I'm the <strong>ACHI Assistant</strong>, here to help you run your scaffolding operations more smoothly.</p>
      <p class="mt-2 text-slate-600 text-sm">You can ask me about:</p>
      <ul class="mt-2 space-y-1 text-sm text-slate-600">
        <li>💳 Invoices &amp; payments</li>
        <li>🏗️ Project progress &amp; delays</li>
        <li>🚛 Fleet &amp; deliveries</li>
        <li>👷 Workforce &amp; payroll</li>
        <li>📦 Inventory &amp; stock alerts</li>
        <li>📊 Expenses &amp; financial summaries</li>
      </ul>
      <p class="mt-3 text-slate-500 text-xs">What would you like to know?</p>`,
  },
];

function aiGetResponse(q) {
  for (const r of AI_RESPONSES) {
    if (r.match.test(q)) return typeof r.reply === 'function' ? r.reply() : r.reply;
  }
  // Default smart fallback
  return `<p class="text-slate-700 mb-2">I don't have a specific answer for <em>"${q.replace(/</g, '&lt;')}"</em> yet, but here's what I can tell you right now:</p>
    <ul class="text-sm text-slate-600 space-y-1">
      <li>📋 <strong>3 overdue invoices</strong> totalling $203K</li>
      <li>⚠️ <strong>Kuwait Port Scaffold</strong> is delayed (20% complete)</li>
      <li>🔧 <strong>2 vehicles</strong> are overdue for service</li>
      <li>📦 <strong>Base Plates</strong> are critically low in inventory</li>
    </ul>
    <p class="mt-3 text-slate-500 text-xs">Try asking about invoices, projects, fleet, workforce, inventory, or expenses for detailed answers.</p>`;
}

let aiHasMessages = false;

function aiSendPrompt(text) {
  const inp = document.getElementById('ai-chat-input');
  if (inp) inp.value = text;
  aiSendMessage();
}

function aiSendMessage() {
  const inp = document.getElementById('ai-chat-input');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  inp.style.height = 'auto';

  // Hide welcome screen on first message
  if (!aiHasMessages) {
    const welcome = document.getElementById('ai-welcome');
    if (welcome) welcome.style.display = 'none';
    aiHasMessages = true;
  }

  const container = document.getElementById('ai-messages');
  if (!container) return;

  // Append user bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'flex justify-end px-2 py-1';
  userDiv.innerHTML = `<div class="max-w-md px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white shadow-sm" style="background:#2e75b6;">${text.replace(/</g, '&lt;')}</div>`;
  container.appendChild(userDiv);

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'flex items-end gap-2 px-2 py-1';
  typingDiv.id = 'ai-typing';
  typingDiv.innerHTML = `
    <div class="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow" style="background:linear-gradient(135deg,#2e75b6,#1a4d80);">A</div>
    <div class="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm">
      <div class="flex gap-1 items-center h-4">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay:0ms"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay:150ms"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay:300ms"></span>
      </div>
    </div>`;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  // Generate response with delay
  const delay = 800 + Math.random() * 600;
  setTimeout(() => {
    const typing = document.getElementById('ai-typing');
    if (typing) typing.remove();

    const responseHTML = aiGetResponse(text);
    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex items-start gap-2 px-2 py-1 ai-message-enter';
    aiDiv.innerHTML = `
      <div class="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm mt-0.5" style="background:linear-gradient(135deg,#2e75b6,#1a4d80);">A</div>
      <div class="flex-1 max-w-2xl px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed">
        ${responseHTML}
      </div>`;
    container.appendChild(aiDiv);
    container.scrollTop = container.scrollHeight;
  }, delay);
}

function aiClearChat() {
  const container = document.getElementById('ai-messages');
  const welcome = document.getElementById('ai-welcome');
  if (container && welcome) {
    container.innerHTML = '';
    container.appendChild(welcome);
    welcome.style.display = '';
    aiHasMessages = false;
  }
}

/* ═══ COMPOSE MODAL ═══ */
let composeChannel = 'email';
function openCompose(channel, to, name) {
  composeChannel = channel || 'email';
  document.getElementById('modal-compose').classList.remove('hidden');
  setComposeChannel(composeChannel);
  if (to) {
    if (channel === 'email') document.getElementById('compose-to').value = to;
    else document.getElementById('compose-phone').value = to;
  }
  const subj = document.getElementById('compose-subject');
  if (name && subj) subj.value = 'Re: ACHI Scaffolding – ' + name;
  setTimeout(() => document.getElementById('compose-body').focus(), 50);
}
function closeCompose() { document.getElementById('modal-compose').classList.add('hidden'); }
function setComposeChannel(ch) {
  composeChannel = ch;
  const isEmail = ch === 'email';
  document.getElementById('compose-email-fields').classList.toggle('hidden', !isEmail);
  document.getElementById('compose-phone-fields').classList.toggle('hidden', isEmail);
  ['email', 'whatsapp', 'sms', 'linkedin'].forEach(c => {
    const btn = document.getElementById('compose-ch-' + c);
    if (!btn) return;
    if (c === ch) { btn.style.background = '#2e75b6'; btn.style.color = 'white'; }
    else { btn.style.background = ''; btn.style.color = ''; btn.classList.add('text-slate-500'); }
  });
}
function insertTemplate(type) {
  const templates = {
    follow_up: `Hi {{first_name}},\n\nJust following up on our recent conversation about your scaffolding requirements.\n\nWe'd love to put together a detailed quotation for you. Could we schedule a quick call this week?\n\nBest regards,\nJawad Khoury\nACHI Scaffolding`,
    quote_ready: `Hi {{first_name}},\n\nYour quotation is ready! Please find it attached for your review.\n\nWe've based the pricing on the site details you shared. Feel free to reach out if you'd like to adjust any scope items.\n\nLooking forward to working with you.\n\nBest,\nJawad – ACHI Scaffolding`,
    payment_reminder: `Hi {{first_name}},\n\nWe noticed that invoice #{{invoice_no}} of ${{ amount }} is now overdue.\n\nCould you please arrange payment at your earliest convenience? If you have any questions about the invoice, don't hesitate to reach out.\n\nThank you,\nACHI Accounts Team`,
    intro: `Hi {{first_name}},\n\nMy name is Jawad from ACHI Scaffolding. We're a leading scaffolding solutions provider in the region, specialising in facade access, propping, shoring and formwork.\n\nI'd love to explore how we can support your upcoming projects.\n\nBest regards,\nJawad Khoury | ACHI Scaffolding\n📞 +961 1 234 567\n🌐 achiscaffolding.com`,
  };
  const body = document.getElementById('compose-body');
  if (body) body.value = templates[type] || '';
}
function sendCompose() {
  const to = document.getElementById('compose-to')?.value || document.getElementById('compose-phone')?.value;
  const channel = composeChannel.charAt(0).toUpperCase() + composeChannel.slice(1);
  closeCompose();
  showERPToast(`✓ ${channel} sent${to ? ' to ' + to : ''}`);
}
function saveComposeDraft() { closeCompose(); showERPToast('Draft saved'); }

/* ═══ EMAIL MARKETING ═══ */
function openEmailCampaign(template) {
  const m = document.getElementById('modal-email-campaign');
  if (!m) return;
  const body = document.getElementById('ec-body');
  const templates = {
    reminder: `Dear {{first_name}},\n\nThis is a friendly reminder that invoice {{invoice_no}} for {{amount}} is due.\n\nPlease arrange payment at your earliest convenience.\n\nACHI Accounts`,
    service: `Hi {{first_name}},\n\nWe are pleased to introduce ACHI Scaffolding's full range of services:\n• Facade access scaffolding\n• Propping & shoring\n• Formwork solutions\n\nContact us today for a free site consultation.\n\nBest,\nJawad | ACHI`,
    newsletter: `Dear {{first_name}},\n\nHere's what's been happening at ACHI Scaffolding this month:\n\n📌 New service: Propping Works\n📌 Safety tip: Always check platform SWL\n📌 Featured project: Marina Tower Facade\n\nThank you for your continued partnership.\n\nJawad Khoury | ACHI`,
    completion: `Hi {{first_name}},\n\nWe're pleased to confirm that the scaffolding works at {{project}} are now complete.\n\nWe hope the project met your expectations. We'd love to hear your feedback — and if you're happy with our service, a quick Google review would mean a lot.\n\nThank you!\nACHI Team`,
    promo: `Hi {{first_name}},\n\nFor a limited time, ACHI Scaffolding is offering 10% off scaffold rental for projects starting in Q2 2026.\n\nQuote code: ACHI-Q2-2026\n\nBook now and lock in the savings!\n\nJawad | ACHI Scaffolding`,
  };
  if (template && templates[template] && body) body.value = templates[template];
  m.classList.remove('hidden');
}
function closeEmailCampaign() { document.getElementById('modal-email-campaign')?.classList.add('hidden'); }

function emTab(tab) {
  ['campaigns', 'templates', 'lists'].forEach(t => {
    const sec = document.getElementById('em-section-' + t);
    const btn = document.getElementById('em-tab-' + t);
    if (!sec || !btn) return;
    if (t === tab) {
      sec.classList.remove('hidden');
      btn.classList.add('border-blue-600', 'text-blue-600');
      btn.classList.remove('border-transparent', 'text-slate-500');
    } else {
      sec.classList.add('hidden');
      btn.classList.remove('border-blue-600', 'text-blue-600');
      btn.classList.add('border-transparent', 'text-slate-500');
    }
  });
}

/* ═══ UNIFIED INBOX ═══ */
const INBOX_DATA = [
  {
    id: 1, name: 'George Saadeh', company: 'Saadeh Holding', channel: 'email', avatar: 'GS', color: '#7c3aed', unread: 2, time: '10:32', preview: 'Re: Jdeideh Tower Quote — thanks for sending...', email: 'george@saadehholding.com',
    messages: [
      { from: 'George Saadeh', time: 'Apr 13 · 10:32', out: false, text: 'Hi Jawad, thanks for sending the quote. The numbers look good. Can we hop on a call this afternoon to discuss the start date and mobilisation timeline?' },
      { from: 'Me', time: 'Apr 13 · 09:15', out: true, text: 'Good morning George! I\'ve just sent over the quotation for the Jdeideh facade project. Please review and let me know if you have any questions.' },
      { from: 'George Saadeh', time: 'Apr 12 · 16:40', out: false, text: 'Jawad, we\'re ready to move forward. Can you confirm availability for a site walk next week?' },
    ]
  },
  {
    id: 2, name: 'Nadia Karam', company: 'NK Developers', channel: 'whatsapp', avatar: 'NK', color: '#0284c7', unread: 1, time: '09:14', preview: 'Hey! Just checking if the quote is ready 🙏', email: 'nadia@nkdev.com',
    messages: [
      { from: 'Nadia Karam', time: 'Apr 13 · 09:14', out: false, text: 'Hey! Just checking if the quote for the Hamra tower is ready 🙏 We have a board meeting Friday and need to present the cost.' },
      { from: 'Me', time: 'Apr 12 · 17:30', out: true, text: 'Hi Nadia! Working on it now, will have it to you by end of day tomorrow.' },
    ]
  },
  {
    id: 3, name: 'Tony Azar', company: 'Azar Real Estate', channel: 'email', avatar: 'TA', color: '#dc2626', unread: 0, time: 'Yesterday', preview: 'Sounds good, Thursday works for the site visit.', email: 'tony@azarre.com',
    messages: [
      { from: 'Tony Azar', time: 'Apr 12 · 14:20', out: false, text: 'Sounds good, Thursday works for the site visit. I\'ll be on site from 9am. The project manager is called Elie, he\'ll meet you at the gate.' },
      { from: 'Me', time: 'Apr 12 · 11:00', out: true, text: 'Tony, we\'d like to propose a site visit this Thursday to assess the shoring requirements. Does that work for you?' },
    ]
  },
  {
    id: 4, name: 'Maya Khoury', company: 'Skyline Developers', channel: 'linkedin', avatar: 'MK', color: '#0a66c2', unread: 1, time: 'Yesterday', preview: 'Thanks for connecting! I saw your company handles large-scale...', email: 'maya@skylinedev.com',
    messages: [
      { from: 'Maya Khoury', time: 'Apr 12 · 08:45', out: false, text: 'Thanks for connecting! I saw your company handles large-scale scaffolding projects. We have a high-rise in KSA starting in Q3 and are looking for reliable scaffold supply. Would love to explore a partnership.' },
    ]
  },
  {
    id: 5, name: 'Kuwait Port Auth.', company: 'Kuwait Port', channel: 'email', avatar: 'KP', color: '#b45309', unread: 0, time: 'Apr 10', preview: 'Payment confirmation attached — please acknowledge.', email: 'billing@kuwaitport.gov.kw',
    messages: [
      { from: 'Kuwait Port Auth.', time: 'Apr 10 · 12:00', out: false, text: 'Please find attached the payment confirmation for invoice INV-2604-005. Please acknowledge receipt.' },
      { from: 'Me', time: 'Apr 10 · 09:30', out: true, text: 'Good morning, following up on invoice INV-2604-005 which is now 8 days overdue. Please advise on payment status.' },
    ]
  },
  {
    id: 6, name: 'ACHI Instagram', company: '@achiscaffolding', channel: 'instagram', avatar: 'IG', color: '#e1306c', unread: 3, time: 'Apr 12', preview: '3 new DMs from followers about your recent post', email: '',
    messages: [
      { from: '@future_builder', time: 'Apr 12 · 20:15', out: false, text: 'Great work on that facade! How much would something like this cost for a 6-storey building? 🏗️' },
      { from: '@hamra_dev', time: 'Apr 12 · 18:40', out: false, text: 'Do you operate in KSA? Looking for a scaffold company for a Riyadh project' },
      { from: '@construction_leb', time: 'Apr 12 · 15:22', out: false, text: 'Love the content! Following for more updates 💪' },
    ]
  },
  {
    id: 7, name: 'Fadi Haddad', company: 'Byblos Construction', channel: 'sms', avatar: 'FH', color: '#16a34a', unread: 0, time: 'Apr 11', preview: 'OK will call you back later this afternoon', email: 'fadi@byblosconst.com',
    messages: [
      { from: 'Fadi Haddad', time: 'Apr 11 · 13:45', out: false, text: 'OK will call you back later this afternoon' },
      { from: 'Me', time: 'Apr 11 · 11:30', out: true, text: 'Hi Fadi, just tried calling you about the site survey for the Byblos project. Please call me back when you get a chance.' },
    ]
  },
];

let currentInboxChannel = 'all';
let currentInboxContact = null;
let currentInboxId = null;

function setInboxChannel(ch) {
  currentInboxChannel = ch;
  document.querySelectorAll('.inbox-ch-btn').forEach(b => b.classList.remove('active-ch'));
  const btn = document.getElementById('ch-' + ch);
  if (btn) btn.classList.add('active-ch');
  renderInboxList();
}

function renderInboxList(filter) {
  const list = document.getElementById('inbox-conversation-list');
  if (!list) return;
  const q = (filter || '').toLowerCase();
  const data = INBOX_DATA.filter(c =>
    (currentInboxChannel === 'all' || c.channel === currentInboxChannel) &&
    (!q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q))
  );
  const chIcons = { email: '📧', whatsapp: '💬', sms: '📱', linkedin: 'in', instagram: '📸', facebook: 'f', tiktok: '🎵', x: '𝕏' };
  list.innerHTML = data.map(c => `
    <div onclick="openInboxThread(${c.id})" class="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-slate-50 border-b border-slate-50 ${currentInboxId === c.id ? 'bg-blue-50' : ''} transition">
      <div class="relative flex-shrink-0">
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background:${c.color};">${c.avatar}</div>
        <span class="absolute -bottom-0.5 -right-0.5 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">${chIcons[c.channel] || '💬'}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-800 truncate">${c.name}</span>
          <span class="text-xs text-slate-400 flex-shrink-0 ml-1">${c.time}</span>
        </div>
        <div class="flex items-center justify-between mt-0.5">
          <span class="text-xs text-slate-500 truncate">${c.preview}</span>
          ${c.unread ? `<span class="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0 ml-1 font-bold">${c.unread}</span>` : ''}
        </div>
      </div>
    </div>`).join('') || '<p class="text-xs text-slate-400 text-center p-6">No conversations in this channel</p>';
}

function openInboxThread(id) {
  currentInboxId = id;
  const contact = INBOX_DATA.find(c => c.id === id);
  if (!contact) return;
  currentInboxContact = contact;
  contact.unread = 0;
  renderInboxList();

  const avatar = document.getElementById('inbox-thread-avatar');
  const name = document.getElementById('inbox-thread-name');
  const sub = document.getElementById('inbox-thread-sub');
  if (avatar) { avatar.textContent = contact.avatar; avatar.style.background = contact.color; }
  if (name) name.textContent = contact.name;
  if (sub) sub.textContent = contact.company + ' · ' + contact.channel;

  const msgs = document.getElementById('inbox-thread-messages');
  if (!msgs) return;
  const chColors = { email: '#2e75b6', whatsapp: '#25d366', sms: '#6b7280', linkedin: '#0a66c2', instagram: '#e1306c' };
  msgs.innerHTML = [...contact.messages].reverse().map(m => `
    <div class="flex ${m.out ? 'justify-end' : 'justify-start'}">
      <div class="max-w-sm px-3.5 py-2.5 rounded-2xl ${m.out ? 'rounded-tr-sm text-white' : 'rounded-tl-sm bg-white border border-slate-200 text-slate-700'} text-sm shadow-sm"
        style="${m.out ? 'background:' + (chColors[contact.channel] || '#2e75b6') : ''}"
      >
        ${!m.out ? `<p class="text-xs font-semibold mb-1" style="color:${contact.color}">${m.from}</p>` : ''}
        <p>${m.text}</p>
        <p class="text-xs mt-1 ${m.out ? 'text-white/70' : 'text-slate-400'}">${m.time}</p>
      </div>
    </div>`).join('');
  msgs.scrollTop = msgs.scrollHeight;
}

function sendInboxReply() {
  const input = document.getElementById('inbox-reply-input');
  if (!input || !currentInboxId) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const contact = INBOX_DATA.find(c => c.id === currentInboxId);
  if (contact) {
    contact.messages.unshift({ from: 'Me', time: 'Now', out: true, text });
    openInboxThread(currentInboxId);
  }
  showERPToast('✓ Message sent via ' + (contact?.channel || 'message'));
}

function filterInbox(val) { renderInboxList(val); }

// Init inbox when navigating to it
const _origNav2 = window.navigate;
window.navigate = function (page) {
  _origNav2(page);
  if (page === 'inbox') setTimeout(renderInboxList, 50);
};

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('sidebar-collapsed')) {
    sidebar.classList.remove('sidebar-collapsed');
    sidebar.style.width = '240px';
    sidebar.style.minWidth = '240px';
  } else {
    sidebar.classList.add('sidebar-collapsed');
    sidebar.style.width = '64px';
    sidebar.style.minWidth = '64px';
  }
}

// Close col-filter dropdowns when clicking outside
document.addEventListener('click', function () {
  document.querySelectorAll('.col-filter-dropdown').forEach(d => d.classList.add('hidden'));
});

function showMobileMenu() { document.getElementById('mobile-menu').classList.remove('hidden'); }
function hideMobileMenu() { document.getElementById('mobile-menu').classList.add('hidden'); }

// ═══ ACTIVITY LOG DATA & LOGIC ═══
const LOG_ROUTING = {
  'call-in': '→ CRM (Inbound Calls) + Client Profile',
  'call-out': '→ CRM (Outbound Calls) + Linked Module',
  'whatsapp': '→ CRM (Communications) + Linked Module',
  'delivery': '→ Fleet (Driver Dashboard) + Inventory',
  'field': '→ Field Updates + Project Progress',
  'survey': '→ Site Surveys + CRM',
  'material': '→ Inventory (Request Queue) + Warehouse',
  'invoice': '→ Accounting (Invoice) + Client Profile',
};

const ACTIVITY_LOG_DATA = [
  { id: 1, type: 'call-in', icon: '📞', label: 'Inbound Call', contact: 'Nassar Group', project: null, note: 'Called to enquire about new scaffolding project in Achrafieh. Needs site survey. Referred to quotation team.', time: '08:43', followup: true, urgent: false, resolved: false },
  { id: 2, type: 'delivery', icon: '🚛', label: 'Delivery Assignment', contact: 'Hassan Makki (driver)', project: 'NEOM Phase 3A', note: 'Additional delivery requested to NEOM site — 50 base plates and 100 tubes. Driver confirmed available.', time: '08:15', followup: false, urgent: false, resolved: true },
  { id: 3, type: 'field', icon: '👷', label: 'Field Update', contact: 'Ahmed Haddad (TL)', project: 'Beirut CBD Phase 2', note: 'Day 3 dismantling. 3 bays complete. Weather clear. Missing 20 guardrail sections — urgent request sent to warehouse.', time: '07:52', followup: true, urgent: true, resolved: false },
  { id: 4, type: 'whatsapp', icon: '💬', label: 'WhatsApp', contact: 'Mohammed Al-Yami (TL)', project: 'NEOM Phase 3A', note: 'Team lead confirmed materials received at NEOM site. Load count verified: 200 tubes, 400 couplers, 50 base plates.', time: '07:30', followup: false, urgent: false, resolved: true },
  { id: 5, type: 'call-in', icon: '📞', label: 'Inbound Call', contact: 'Skyline Developers', project: 'Solidere Tower', note: 'Client called re: invoice INV-2026-031. Requested 5% discount citing payment history. Discount pending manager approval.', time: '07:10', followup: true, urgent: false, resolved: false },
  { id: 6, type: 'material', icon: '📦', label: 'Material Request', contact: 'Ahmed Haddad (TL)', project: 'Beirut CBD Phase 2', note: 'Urgent: 20 guardrail sections needed immediately. Warehouse to approve and dispatch via T-02.', time: '06:58', followup: false, urgent: true, resolved: false },
  { id: 7, type: 'call-out', icon: '☎️', label: 'Outbound Call', contact: 'Gulf Petrochemical', project: null, note: 'Called to follow up on quote QT-2026-014. Client reviewing with procurement team. Decision expected by Apr 17.', time: '06:30', followup: true, urgent: false, resolved: false },
];

let currentLogFilter = 'all';

function openLogEntryModal() {
  document.getElementById('modal-log-entry').classList.remove('hidden');
  selectedLogType = null;
  document.getElementById('log-routing-preview').classList.add('hidden');
  document.getElementById('log-notes').value = '';
  document.querySelectorAll('.log-type-btn').forEach(b => b.style.cssText = '');
}
function closeLogEntryModal() {
  document.getElementById('modal-log-entry').classList.add('hidden');
}

function selectLogType(type, label) {
  selectedLogType = type;
  document.querySelectorAll('.log-type-btn').forEach(b => {
    b.style.cssText = b.dataset.type === type ? 'border-color:#2e75b6;background:#eff6ff;color:#1d4ed8;' : '';
  });
  const preview = document.getElementById('log-routing-preview');
  document.getElementById('log-routing-text').textContent = LOG_ROUTING[type] || '→ General Log';
  preview.classList.remove('hidden');
}

function submitLogEntry() {
  const notes = document.getElementById('log-notes').value.trim();
  if (!selectedLogType) { alert('Please select an entry type.'); return; }
  if (!notes) { alert('Please add a note/summary.'); return; }
  // Add to log
  const newEntry = {
    id: ACTIVITY_LOG_DATA.length + 1,
    type: selectedLogType,
    icon: document.querySelector(`.log-type-btn[data-type="${selectedLogType}"] span`)?.textContent || '📝',
    label: document.querySelector(`.log-type-btn[data-type="${selectedLogType}"]`)?.textContent?.trim() || selectedLogType,
    contact: 'You',
    project: null,
    note: notes,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    followup: document.getElementById('log-followup').checked,
    urgent: document.getElementById('log-urgent').checked,
    resolved: false
  };
  ACTIVITY_LOG_DATA.unshift(newEntry);
  const kpi = document.getElementById('log-kpi-today');
  if (kpi) kpi.textContent = parseInt(kpi.textContent) + 1;
  closeLogEntryModal();
  renderActivityLog('all');
  // If on activity log page, show it
  if (document.getElementById('page-activity-log').classList.contains('active')) {
    navigate('activity-log');
  }
  showERPToast('Entry logged & routed ' + (LOG_ROUTING[selectedLogType] || ''));
}

function filterLog(type) {
  currentLogFilter = type;
  document.querySelectorAll('.log-filter-btn').forEach(b => {
    const active = b.dataset.filter === type;
    b.className = b.className.replace(/ active-filter/g, '');
    b.style.cssText = active ? 'background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe;' : '';
    if (active) b.classList.add('active-filter');
  });
  renderActivityLog(type);
}

function renderActivityLog(filter) {
  const feed = document.getElementById('activity-log-feed');
  if (!feed) return;
  const items = filter === 'all' ? ACTIVITY_LOG_DATA : ACTIVITY_LOG_DATA.filter(e => e.type === filter);
  if (!items.length) {
    feed.innerHTML = '<div class="p-8 text-center text-slate-400 text-sm">No entries for this filter.</div>';
    return;
  }
  feed.innerHTML = items.map(e => `
    <div class="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition cursor-pointer ${e.resolved ? 'opacity-60' : ''}">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base mt-0.5" style="background:#f1f5f9;">${e.icon}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-0.5">
          <span class="text-xs font-bold text-slate-700">${e.label}</span>
          ${e.contact ? `<span class="text-xs text-slate-500">· ${e.contact}</span>` : ''}
          ${e.project ? `<span class="text-xs text-blue-600 font-medium">· ${e.project}</span>` : ''}
          ${e.urgent ? `<span class="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">URGENT</span>` : ''}
          ${e.followup && !e.resolved ? `<span class="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Follow-up needed</span>` : ''}
          ${e.resolved ? `<span class="text-xs font-semibold text-green-600">✓ Resolved</span>` : ''}
        </div>
        <p class="text-xs text-slate-500 leading-relaxed">${e.note}</p>
      </div>
      <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span class="text-xs text-slate-400">${e.time}</span>
        ${!e.resolved ? `<button onclick="resolveLogEntry(${e.id})" class="text-xs text-green-600 font-semibold hover:underline">Mark done</button>` : ''}
      </div>
    </div>
  `).join('');
}

function resolveLogEntry(id) {
  const entry = ACTIVITY_LOG_DATA.find(e => e.id === id);
  if (entry) { entry.resolved = true; renderActivityLog(currentLogFilter); showERPToast('Entry marked as resolved ✓'); }
}

// ═══ MAINTENANCE MODAL ═══
function openMaintenanceModal(vehicle) {
  if (vehicle) document.getElementById('maint-vehicle').value = vehicle;
  document.getElementById('modal-maintenance').classList.remove('hidden');
}
function closeMaintenanceModal() { document.getElementById('modal-maintenance').classList.add('hidden'); }
function saveMaintenanceSchedule() {
  closeMaintenanceModal();
  showERPToast('Maintenance scheduled & logged to Activity Log ✓');
}

/* ════ FULL JOB CALENDAR ════ */
const CAL_JOBS = [
  { date: '2026-04-13', time: '08:00', type: 'other', label: 'Pick-up', site: 'Solidere Beirut', lead: 'Ahmad H.', status: 'done' },
  { date: '2026-04-14', time: '09:30', type: 'delivery', label: 'Delivery OUT', site: 'NEOM Phase 3A', lead: 'M. Al-Yami', status: 'scheduled' },
  { date: '2026-04-14', time: '14:00', type: 'install', label: 'Installation', site: 'DAMAC Dubai', lead: 'Hassan A.', status: 'scheduled' },
  { date: '2026-04-15', time: '10:00', type: 'inspect', label: 'Inspection', site: 'Dubai Harbor', lead: 'H. Makki', status: 'scheduled' },
  { date: '2026-04-16', time: '07:00', type: 'strike', label: 'Dismantling', site: 'Beirut CBD', lead: 'Ahmed H.', status: 'inprog' },
  { date: '2026-04-16', time: '11:30', type: 'delivery', label: 'Delivery OUT', site: 'Kuwait Port', lead: 'Karim N.', status: 'scheduled' },
  { date: '2026-04-17', time: '13:00', type: 'install', label: 'Installation', site: 'Kuwait Trade Port', lead: 'Rashid R.', status: 'scheduled' },
  { date: '2026-04-18', time: '09:00', type: 'other', label: 'Pick-up', site: 'Solidere Beirut', lead: 'Omar F.', status: 'scheduled' },
  { date: '2026-04-18', time: '15:30', type: 'inspect', label: 'Inspection', site: 'Riyadh Metro', lead: 'Hassan A.', status: 'scheduled' },
  { date: '2026-04-19', time: '10:00', type: 'delivery', label: 'Collection IN', site: 'Dubai, Makki', lead: 'Ali M.', status: 'scheduled' },
  { date: '2026-04-21', time: '08:00', type: 'install', label: 'Installation', site: 'Marina Tower', lead: 'Ahmad H.', status: 'scheduled' },
  { date: '2026-04-22', time: '09:00', type: 'inspect', label: 'Safety Check', site: 'Al Reem Villa', lead: 'H. Makki', status: 'scheduled' },
  { date: '2026-04-23', time: '07:30', type: 'delivery', label: 'Delivery OUT', site: 'Hamra Hotel', lead: 'Karim N.', status: 'scheduled' },
  { date: '2026-04-24', time: '10:00', type: 'strike', label: 'Strike Scaffold', site: 'Harbour Mall', lead: 'Ahmed H.', status: 'scheduled' },
  { date: '2026-04-25', time: '14:00', type: 'install', label: 'Erect Scaffold', site: 'New Project A', lead: 'Omar F.', status: 'scheduled' },
  { date: '2026-04-28', time: '08:00', type: 'inspect', label: 'Handover Insp.', site: 'Kuwait Port', lead: 'Rashid R.', status: 'scheduled' },
  { date: '2026-04-29', time: '09:00', type: 'delivery', label: 'Material Drop', site: 'NEOM', lead: 'Ali M.', status: 'scheduled' },
  { date: '2026-04-30', time: '07:00', type: 'strike', label: 'Final Strike', site: 'Beirut CBD', lead: 'Ahmad H.', status: 'scheduled' },
  { date: '2026-05-02', time: '09:00', type: 'install', label: 'Start: Marina Ph2', site: 'Marina Tower', lead: 'Hassan A.', status: 'scheduled' },
  { date: '2026-05-05', time: '10:00', type: 'inspect', label: 'Monthly Insp.', site: 'All Sites', lead: 'H. Makki', status: 'scheduled' },
];

const CAL_TYPE_COLORS = {
  delivery: { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd', dot: '#3b82f6' },
  inspect: { bg: '#dcfce7', text: '#15803d', border: '#86efac', dot: '#22c55e' },
  install: { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd', dot: '#8b5cf6' },
  strike: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
  other: { bg: '#ffedd5', text: '#9a3412', border: '#fdba74', dot: '#f97316' },
};

let calViewDate = new Date(2026, 3, 1); // April 2026

function renderCalendar() {
  const year = calViewDate.getFullYear();
  const month = calViewDate.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('cal-month-label').textContent = monthNames[month] + ' ' + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMon = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  const grid = document.getElementById('cal-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Total cells: 6 weeks * 7
  const totalCells = 42;
  for (let i = 0; i < totalCells; i++) {
    let dayNum, dateStr, isCurrentMonth = true;
    if (i < firstDay) {
      dayNum = daysInPrev - firstDay + i + 1;
      isCurrentMonth = false;
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      dateStr = prevYear + '-' + String(prevMonth).padStart(2, '0') + '-' + String(dayNum).padStart(2, '0');
    } else if (i - firstDay >= daysInMon) {
      dayNum = i - firstDay - daysInMon + 1;
      isCurrentMonth = false;
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      dateStr = nextYear + '-' + String(nextMonth).padStart(2, '0') + '-' + String(dayNum).padStart(2, '0');
    } else {
      dayNum = i - firstDay + 1;
      dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(dayNum).padStart(2, '0');
    }

    const isToday = dateStr === todayStr;
    const dayJobs = CAL_JOBS.filter(j => j.date === dateStr);
    const isWeekend = (i % 7 === 0 || i % 7 === 6);

    const cell = document.createElement('div');
    cell.className = 'border-r border-b border-slate-100 p-2 min-h-24 cursor-pointer hover:bg-blue-50/40 transition-colors';
    if (!isCurrentMonth) cell.style.background = '#fafafa';
    if (isToday) cell.style.background = '#eff6ff';

    let dayHtml = `<div class="flex items-center justify-between mb-1.5">
      <span class="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : isCurrentMonth ? (isWeekend ? 'text-slate-400' : 'text-slate-700') : 'text-slate-300'}">${dayNum}</span>
      ${dayJobs.length > 2 ? `<span class="text-xs text-blue-500 font-medium">+${dayJobs.length - 2}</span>` : ''}
    </div>`;

    dayJobs.slice(0, 2).forEach(job => {
      const c = CAL_TYPE_COLORS[job.type] || CAL_TYPE_COLORS.other;
      dayHtml += `<div class="rounded px-1.5 py-0.5 mb-0.5 text-xs truncate" style="background:${c.bg};color:${c.text};border-left:3px solid ${c.dot};">
        <span class="font-semibold">${job.time}</span> ${job.label}
      </div>`;
    });

    cell.innerHTML = dayHtml;
    cell.addEventListener('click', () => calShowDay(dateStr, dayJobs));
    grid.appendChild(cell);
  }
}

function calShowDay(dateStr, jobs) {
  const panel = document.getElementById('cal-day-panel');
  const title = document.getElementById('cal-day-title');
  const list = document.getElementById('cal-day-jobs');
  if (!panel) return;
  const d = new Date(dateStr + 'T12:00:00');
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  title.textContent = d.toLocaleDateString('en-US', opts);
  if (jobs.length === 0) {
    list.innerHTML = '<p class="text-slate-400 text-sm text-center py-4">No jobs scheduled for this day.</p>';
  } else {
    list.innerHTML = jobs.map(job => {
      const c = CAL_TYPE_COLORS[job.type] || CAL_TYPE_COLORS.other;
      const statusPill = job.status === 'done' ? '<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Done</span>'
        : job.status === 'inprog' ? '<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">In Progress</span>'
          : '<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Scheduled</span>';
      return `<div class="flex items-start gap-3 p-3 rounded-xl border" style="border-color:${c.border};background:${c.bg}20;">
        <div class="w-1 self-stretch rounded-full flex-shrink-0" style="background:${c.dot};"></div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-sm" style="color:${c.text};">${job.time} — ${job.label}</p>
            ${statusPill}
          </div>
          <p class="text-xs text-slate-600 mt-0.5">📍 ${job.site}</p>
          <p class="text-xs text-slate-500 mt-0.5">👷 ${job.lead}</p>
        </div>
      </div>`;
    }).join('');
  }
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calNav(dir) {
  calViewDate.setMonth(calViewDate.getMonth() + dir);
  renderCalendar();
}
function calGoToday() {
  calViewDate = new Date(); calViewDate.setDate(1);
  renderCalendar();
}

/* ════ PAYROLL TABLE ════ */
const PAYROLL_DATA = [
  { name: 'Ahmad Haddad', dept: 'scaffold', days: 26, ot: 8, rate: 85, advance: 500 },
  { name: 'Hassan Ali', dept: 'driver', days: 26, ot: 12, rate: 90, advance: 0 },
  { name: 'Karim Nasser', dept: 'driver', days: 25, ot: 6, rate: 90, advance: 400 },
  { name: 'Jawad Khoury', dept: 'supervisor', days: 26, ot: 4, rate: 130, advance: 0 },
  { name: 'Omar Fahed', dept: 'scaffold', days: 24, ot: 0, rate: 75, advance: 200 },
  { name: 'Ali Mansour', dept: 'driver', days: 26, ot: 10, rate: 80, advance: 0 },
  { name: 'Rashid Al-Rashid', dept: 'scaffold', days: 22, ot: 0, rate: 70, advance: 300 },
  { name: 'Hassan Makki', dept: 'supervisor', days: 26, ot: 6, rate: 120, advance: 0 },
  { name: 'Nour El-Amine', dept: 'admin', days: 26, ot: 0, rate: 95, advance: 0 },
  { name: 'Samir Khalil', dept: 'scaffold', days: 20, ot: 0, rate: 70, advance: 150 },
  { name: 'Bilal Farhat', dept: 'scaffold', days: 25, ot: 4, rate: 72, advance: 0 },
  { name: 'Ziad Hamdan', dept: 'driver', days: 24, ot: 8, rate: 82, advance: 600 },
];

function renderPayroll() {
  const tbody = document.getElementById('payroll-tbody');
  if (!tbody) return;
  const dept = document.getElementById('payroll-dept')?.value || '';
  const rows = dept ? PAYROLL_DATA.filter(r => r.dept === dept) : PAYROLL_DATA;
  tbody.innerHTML = rows.map((r, i) => {
    const gross = r.days * r.rate + r.ot * Math.round(r.rate * 1.5 / 8);
    const net = gross - r.advance;
    const deptLabel = { scaffold: 'Scaffolding', driver: 'Driver', supervisor: 'Supervisor', admin: 'Admin' }[r.dept] || r.dept;
    return `<tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="px-4 py-3"><input type="checkbox" class="payroll-row-cb accent-blue-600" checked></td>
      <td class="px-4 py-3">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:#2e75b6;">${r.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
          <span class="font-medium text-slate-800">${r.name}</span>
        </div>
      </td>
      <td class="px-4 py-3 text-slate-600">${deptLabel}</td>
      <td class="px-4 py-3 text-right text-slate-700">${r.days}</td>
      <td class="px-4 py-3 text-right text-slate-700">${r.ot}</td>
      <td class="px-4 py-3 text-right text-slate-700">$${r.rate}</td>
      <td class="px-4 py-3 text-right font-semibold text-slate-800">$${gross.toLocaleString()}</td>
      <td class="px-4 py-3 text-right text-amber-600">${r.advance > 0 ? '-$' + r.advance : '—'}</td>
      <td class="px-4 py-3 text-right font-bold text-green-700">$${net.toLocaleString()}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span></td>
    </tr>`;
  }).join('');
}

function selectAllPayroll(checked) {
  document.querySelectorAll('.payroll-row-cb').forEach(cb => cb.checked = checked);
  const masterCb = document.getElementById('payroll-select-all');
  if (masterCb) masterCb.checked = checked;
}

// ═══ PAYROLL MODAL ═══
function openPayrollModal() { document.getElementById('modal-payroll').classList.remove('hidden'); }
function closePayrollModal() { document.getElementById('modal-payroll').classList.add('hidden'); }
function confirmPayroll() { closePayrollModal(); showERPToast('Payroll generated — exporting to PDF & Accounting ✓'); }

// ═══ SITE SURVEY LOGIC ═══
const SURVEY_CHECKLIST_ITEMS = [
  'Site access and entry points confirmed',
  'Ground conditions and load-bearing capacity assessed',
  'Overhead obstructions and clearances measured',
  'Underground services (utilities) identified',
  'Adjacent structures and boundaries noted',
  'Existing scaffolding / temporary works reviewed',
  'Hazardous materials (asbestos, lead) checked',
  'Pedestrian and traffic management requirements',
  'Welfare facilities (toilets, first aid) available',
  'Emergency access and exit routes identified',
  'Client / site manager contact details obtained',
  'Photos / video of all elevations captured'
];

function openNewSurveyModal() {
  const box = document.getElementById('sv-checklist');
  if (box && box.children.length === 0) {
    SURVEY_CHECKLIST_ITEMS.forEach((item, i) => {
      const id = 'sv-chk-' + i;
      const div = document.createElement('div');
      div.className = 'flex items-start gap-2 py-1';
      div.innerHTML = `<input type="checkbox" id="${id}" class="mt-0.5 accent-blue-600 cursor-pointer">
        <label for="${id}" class="text-sm text-slate-700 cursor-pointer leading-snug">${item}</label>`;
      box.appendChild(div);
    });
  }
  const prev = document.getElementById('sv-media-preview');
  if (prev) prev.innerHTML = '';
  const today = new Date().toISOString().slice(0, 10);
  const dateEl = document.getElementById('sv-date');
  if (dateEl) dateEl.value = today;
  document.getElementById('modal-new-survey').classList.remove('hidden');
}

function openSurveyModal() { openNewSurveyModal(); }
function closeNewSurveyModal() { document.getElementById('modal-new-survey').classList.add('hidden'); }

function surveyCheckAll(checked) {
  const box = document.getElementById('sv-checklist');
  if (!box) return;
  box.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = checked; });
}

function previewSurveyMedia(input) {
  const prev = document.getElementById('sv-media-preview');
  if (!prev) return;
  prev.innerHTML = '';
  Array.from(input.files).forEach(file => {
    const wrap = document.createElement('div');
    wrap.className = 'relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center';
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.className = 'w-full h-full object-cover';
      img.src = URL.createObjectURL(file);
      wrap.appendChild(img);
    } else {
      wrap.innerHTML = '<span class="text-2xl">🎥</span>';
    }
    const lbl = document.createElement('div');
    lbl.className = 'absolute bottom-0 left-0 right-0 text-[9px] text-white bg-black/50 px-1 truncate';
    lbl.textContent = file.name;
    wrap.appendChild(lbl);
    prev.appendChild(wrap);
  });
}

function openGoogleMaps() {
  const addr = document.getElementById('sv-address')?.value.trim();
  const url = document.getElementById('sv-maps-url')?.value.trim();
  if (url) { window.open(url, '_blank'); return; }
  if (addr) { window.open('https://www.google.com/maps/search/' + encodeURIComponent(addr), '_blank'); return; }
  showERPToast('⚠ Enter a site address or paste a Google Maps link first');
}

function pasteGoogleMapsLink() {
  const el = document.getElementById('sv-maps-url');
  if (el) { el.focus(); }
}

function saveSurvey(status) {
  const box = document.getElementById('sv-checklist');
  let checkedCount = 0, totalCount = 0;
  if (box) {
    const cbs = box.querySelectorAll('input[type="checkbox"]');
    totalCount = cbs.length;
    cbs.forEach(cb => { if (cb.checked) checkedCount++; });
  }
  const mediaInput = document.getElementById('sv-media-input');
  const mediaCount = mediaInput?.files?.length || 0;
  closeNewSurveyModal();
  showERPToast(status === 'draft'
    ? `📋 Survey draft saved — ${checkedCount}/${totalCount} checklist, ${mediaCount} file(s)`
    : `✓ Survey scheduled — ${checkedCount}/${totalCount} checklist items, ${mediaCount} file(s) attached`);
}

// ═══ PROJECT MODAL LOGIC ═══
function openProjectModal() {
  const today = new Date().toISOString().slice(0, 10);
  ['proj-name', 'proj-site', 'proj-value', 'proj-scope'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  ['proj-client', 'proj-type', 'proj-status', 'proj-manager'].forEach(id => {
    const el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });
  const startEl = document.getElementById('proj-start'); if (startEl) startEl.value = today;
  const endEl = document.getElementById('proj-end'); if (endEl) endEl.value = '';
  const sizeEl = document.getElementById('proj-team'); if (sizeEl) sizeEl.value = '';
  document.getElementById('modal-new-project').classList.remove('hidden');
}
function closeProjectModal() { document.getElementById('modal-new-project').classList.add('hidden'); }
function saveProject(status) {
  const name = document.getElementById('proj-name')?.value.trim();
  if (!name) { showERPToast('⚠ Please enter a project name'); return; }
  closeProjectModal();
  showERPToast(status === 'draft'
    ? `📋 Project "${name}" saved as draft`
    : `✓ Project "${name}" created successfully`);
}

// ═══ JOB MODAL LOGIC ═══
function openJobModal() {
  const today = new Date().toISOString().slice(0, 10);
  ['job-title', 'job-notes'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  ['job-type', 'job-priority', 'job-project', 'job-lead', 'job-vehicle'].forEach(id => {
    const el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });
  const dateEl = document.getElementById('job-date'); if (dateEl) dateEl.value = today;
  const stEl = document.getElementById('job-time-start'); if (stEl) stEl.value = '07:00';
  const etEl = document.getElementById('job-time-end'); if (etEl) etEl.value = '17:00';
  const wkEl = document.getElementById('job-workers'); if (wkEl) wkEl.value = '1';
  document.getElementById('modal-new-job').classList.remove('hidden');
}
function closeJobModal() { document.getElementById('modal-new-job').classList.add('hidden'); }
function saveJob(status) {
  const title = document.getElementById('job-title')?.value.trim();
  if (!title) { showERPToast('⚠ Please enter a job title'); return; }
  const date = document.getElementById('job-date')?.value || '';
  closeJobModal();
  showERPToast(status === 'draft'
    ? `📋 Job "${title}" saved as draft`
    : `✓ Job "${title}" scheduled for ${date || 'the selected date'}`);
}

function openSurveyDetail(id) {
  document.getElementById('modal-survey-detail').classList.remove('hidden');
  const checklists = {
    'SS-025': ['Access & entry confirmed', 'Height measurements taken', 'Load-bearing surface checked', 'Adjacent structures documented', 'Anchor points identified', 'Material quantity estimated', 'Site photos (min 10)', 'Video walkthrough', 'Client rep signature', 'Special hazards noted', 'AutoCAD brief prepared', 'Quote ready to generate'],
    'SS-026': []
  };
  const items = checklists[id] || [];
  const checkedCount = id === 'SS-025' ? 8 : 0;
  document.getElementById('survey-detail-checklist').innerHTML = items.map((item, i) => `
    <div class="flex items-center gap-3 p-2 rounded-lg ${i < checkedCount ? 'bg-green-50' : 'bg-slate-50'} border ${i < checkedCount ? 'border-green-100' : 'border-slate-100'}">
      <input type="checkbox" ${i < checkedCount ? 'checked' : ''} class="rounded accent-green-600" onchange="this.parentElement.className = this.checked ? 'flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-100' : 'flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100'">
      <span class="text-xs ${i < checkedCount ? 'text-green-800 line-through' : 'text-slate-700'}">${item}</span>
    </div>
  `).join('') || '<p class="text-xs text-slate-400">Survey not yet started. Schedule a visit first.</p>';
}
function closeSurveyDetail() { document.getElementById('modal-survey-detail').classList.add('hidden'); }
function markSurveyComplete() { closeSurveyDetail(); showERPToast('Survey marked complete ✓ — ready for AutoCAD & quotation'); }

function renderSurveyChecklist() {
  const el = document.getElementById('survey-checklist');
  if (!el) return;
  const items = ['Access & entry confirmed', 'Height measurements taken', 'Load-bearing surface checked', 'Adjacent structures documented', 'Anchor points identified', 'Material quantity estimated', 'Site photos (min 10)', 'Video walkthrough', 'Client rep signature', 'Special hazards noted', 'AutoCAD brief prepared', 'Quote ready to generate'];
  el.innerHTML = items.map(item => `
    <div class="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2e75b6" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      <span class="text-xs text-slate-600">${item}</span>
    </div>
  `).join('');
}

// ═══ GLOBAL TOAST ═══
function showERPToast(msg) {
  let t = document.getElementById('erp-global-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'erp-global-toast';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#0f172a;color:white;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;transition:opacity 0.3s;box-shadow:0 8px 24px rgba(0,0,0,0.2);';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2800);
}

// ═══ WIRE UP EXISTING FLEET BUTTONS ═══
document.addEventListener('DOMContentLoaded', () => {
  // Fleet maintenance buttons — fix onclick to use openMaintenanceModal
  document.querySelectorAll('#page-fleet button').forEach(btn => {
    if (btn.textContent.trim() === 'Schedule Now') btn.onclick = () => openMaintenanceModal('T-03 · MAN TGS 26');
    if (btn.textContent.trim() === 'Book') btn.onclick = () => openMaintenanceModal();
  });
  // Workforce payroll button
  document.querySelectorAll('#page-workforce button').forEach(btn => {
    if (btn.textContent.trim() === 'Generate Payroll') btn.onclick = openPayrollModal;
  });
  // Init activity log
  renderActivityLog('all');
  renderSurveyChecklist();
});

// Override navigate to also init log page
const _origNavigate = window.navigate;
window.navigate = function (page) {
  _origNavigate(page);
  if (page === 'activity-log') { renderActivityLog(currentLogFilter); }
  if (page === 'site-surveys') { renderSurveyChecklist(); }
};

// ═══ INVOICE CREATION LOGIC ═══
function openCreateInvoice() { document.getElementById('modal-create-invoice').classList.remove('hidden'); calcInvoiceTotals(); }
function closeCreateInvoice() { document.getElementById('modal-create-invoice').classList.add('hidden'); }
function addInvoiceLine() {
  const tbody = document.getElementById('invoice-lines');
  const tr = document.createElement('tr');
  tr.className = 'invoice-line border-b border-slate-100';
  tr.innerHTML = `<td class="px-3 py-2"><input type="text" placeholder="Description..." class="w-full border-0 bg-transparent text-slate-700 placeholder-slate-300 outline-none text-xs"></td><td class="px-3 py-2"><input type="number" value="1" min="1" class="w-full text-right border-0 bg-transparent text-slate-700 outline-none text-xs inv-qty" oninput="calcInvoiceTotals()"></td><td class="px-3 py-2"><input type="number" placeholder="0.00" class="w-full text-right border-0 bg-transparent text-slate-700 outline-none text-xs inv-price" oninput="calcInvoiceTotals()"></td><td class="px-3 py-2 text-right text-slate-600 font-semibold inv-line-total">$0.00</td><td class="px-2 py-2"><button onclick="this.closest('tr').remove();calcInvoiceTotals()" class="text-red-300 hover:text-red-500 text-base">×</button></td>`;
  tbody.appendChild(tr);
}
function calcInvoiceTotals() {
  let sub = 0;
  document.querySelectorAll('.invoice-line').forEach(row => {
    const qty = parseFloat(row.querySelector('.inv-qty')?.value) || 0;
    const price = parseFloat(row.querySelector('.inv-price')?.value) || 0;
    const total = qty * price;
    const cell = row.querySelector('.inv-line-total');
    if (cell) cell.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2 });
    sub += total;
  });
  const vatRate = parseFloat(document.getElementById('inv-vat-rate')?.value || 10) / 100;
  const discRate = parseFloat(document.getElementById('inv-discount')?.value || 0) / 100;
  const vat = sub * vatRate;
  const disc = sub * discRate;
  const total = sub + vat - disc;
  if (document.getElementById('inv-subtotal')) document.getElementById('inv-subtotal').textContent = '$' + sub.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (document.getElementById('inv-vat')) document.getElementById('inv-vat').textContent = '$' + vat.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (document.getElementById('inv-disc-amt')) document.getElementById('inv-disc-amt').textContent = '-$' + disc.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (document.getElementById('inv-total')) document.getElementById('inv-total').textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
function saveInvoiceDraft() { closeCreateInvoice(); showERPToast('Invoice saved as draft ✓'); }
function sendInvoice() { closeCreateInvoice(); showERPToast('Invoice sent to client ✓ — logged to Accounting'); }

// ═══ QUOTATION LOGIC ═══
function openQuotation() { document.getElementById('modal-quotation').classList.remove('hidden'); calcQuoteTotals(); }
function closeQuotation() { document.getElementById('modal-quotation').classList.add('hidden'); }
function addQuoteLine() {
  const tbody = document.getElementById('quote-lines');
  const tr = document.createElement('tr');
  tr.className = 'quote-line border-b border-slate-100';
  tr.innerHTML = `<td class="px-3 py-2"><input type="text" placeholder="Item..." class="w-full border-0 bg-transparent text-slate-700 placeholder-slate-300 outline-none text-xs"></td><td class="px-3 py-2"><input type="number" value="1" class="w-full text-right border-0 bg-transparent text-slate-700 outline-none text-xs qt-qty" oninput="calcQuoteTotals()"></td><td class="px-3 py-2"><input type="text" placeholder="unit" class="w-full text-right border-0 bg-transparent text-slate-500 outline-none text-xs"></td><td class="px-3 py-2"><input type="number" placeholder="0.00" class="w-full text-right border-0 bg-transparent text-slate-700 outline-none text-xs qt-price" oninput="calcQuoteTotals()"></td><td class="px-3 py-2 text-right text-slate-600 font-semibold qt-line-total">$0.00</td><td class="px-2 py-2"><button onclick="this.closest('tr').remove();calcQuoteTotals()" class="text-red-300 hover:text-red-500">×</button></td>`;
  tbody.appendChild(tr);
}
function calcQuoteTotals() {
  let sub = 0;
  document.querySelectorAll('.quote-line').forEach(row => {
    const qty = parseFloat(row.querySelector('.qt-qty')?.value) || 0;
    const price = parseFloat(row.querySelector('.qt-price')?.value) || 0;
    const total = qty * price;
    const cell = row.querySelector('.qt-line-total');
    if (cell) cell.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2 });
    sub += total;
  });
  const vat = sub * 0.10;
  if (document.getElementById('qt-subtotal')) document.getElementById('qt-subtotal').textContent = '$' + sub.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (document.getElementById('qt-vat')) document.getElementById('qt-vat').textContent = '$' + vat.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (document.getElementById('qt-total')) document.getElementById('qt-total').textContent = '$' + (sub + vat).toLocaleString('en-US', { minimumFractionDigits: 2 });
}
function saveQuoteDraft() { closeQuotation(); showERPToast('Quotation saved as draft ✓'); }
function sendQuote() { closeQuotation(); showERPToast('Quotation sent to client ✓'); }
function convertToInvoice() { closeQuotation(); openCreateInvoice(); showERPToast('Lines copied to new invoice — review and send'); }

// ═══ INIT ALL TABLES ON LOAD ═══
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initAllTables, 200);
});

// ═══ PAYMENT LOGIC ═══
let _payInvoiceTotal = 0;

function openPaymentModal(invNo, client, total) {
  document.getElementById('modal-payment').classList.remove('hidden');
  document.getElementById('pay-invoice-no').value = invNo || '';
  document.getElementById('pay-client').value = client || '';
  document.getElementById('pay-invoice-total').value = total || '';
  document.getElementById('pay-amount').value = total || '';
  document.getElementById('pay-ref').value = '';
  document.getElementById('pay-notes').value = '';
  document.getElementById('pay-method').value = '';
  document.getElementById('pay-balance-row').classList.add('hidden');
  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('pay-date').value = today;
  // Parse total for balance calc
  _payInvoiceTotal = parseFloat((total || '0').replace(/[$,]/g, '')) || 0;
  if (invNo) document.getElementById('payment-modal-inv-sub').textContent = invNo + ' · ' + client;
}

function closePaymentModal() {
  document.getElementById('modal-payment').classList.add('hidden');
}

function updatePaymentBalance() {
  const amtStr = document.getElementById('pay-amount').value.replace(/[$,]/g, '');
  const amt = parseFloat(amtStr) || 0;
  const row = document.getElementById('pay-balance-row');
  if (_payInvoiceTotal > 0 && amt > 0 && amt < _payInvoiceTotal) {
    const balance = _payInvoiceTotal - amt;
    document.getElementById('pay-balance-amount').textContent = '$' + balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    row.classList.remove('hidden');
  } else {
    row.classList.add('hidden');
  }
}

// ═══ EXCEL-LIKE TABLES ═══
function makeTableExcel(tableEl) {
  if (!tableEl || tableEl._excelDone) return;
  tableEl._excelDone = true;
  const ths = tableEl.querySelectorAll('thead th');

  // Resizable columns
  ths.forEach(th => {
    th.style.position = 'relative';
    th.style.userSelect = 'none';
    th.style.minWidth = '60px';
    const handle = document.createElement('div');
    handle.style.cssText = 'position:absolute;right:0;top:0;bottom:0;width:5px;cursor:col-resize;z-index:1;';
    handle.addEventListener('mouseenter', () => handle.style.background = 'rgba(46,117,182,0.4)');
    handle.addEventListener('mouseleave', () => { if (!handle._dragging) handle.style.background = ''; });
    let startX, startW;
    handle.addEventListener('mousedown', e => {
      e.preventDefault();
      handle._dragging = true;
      startX = e.clientX;
      startW = th.offsetWidth;
      const onMove = ev => { th.style.width = Math.max(60, startW + ev.clientX - startX) + 'px'; };
      const onUp = () => { handle._dragging = false; handle.style.background = ''; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
    th.appendChild(handle);
  });

  // Inline cell editing (double-click)
  tableEl.querySelectorAll('tbody td').forEach(td => {
    td.setAttribute('title', 'Double-click to edit');
    td.addEventListener('dblclick', () => {
      if (td.querySelector('input,select,button')) return;
      const original = td.textContent.trim();
      const input = document.createElement('input');
      input.value = original;
      input.className = 'w-full text-xs border border-blue-300 rounded px-1 py-0.5 bg-blue-50 outline-none';
      td.textContent = '';
      td.appendChild(input);
      input.focus();
      input.select();
      const save = () => { td.textContent = input.value || original; };
      input.addEventListener('blur', save);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { save(); } if (e.key === 'Escape') { td.textContent = original; } });
    });
  });

  // Sticky header
  const thead = tableEl.querySelector('thead');
  if (thead) { thead.style.position = 'sticky'; thead.style.top = '0'; thead.style.zIndex = '2'; }
}

function initAllTables() {
  document.querySelectorAll('.page.active table, #page-invoices table, #page-fleet table, #page-workforce table, #page-inventory table, #page-delivery table, #page-crm table').forEach(makeTableExcel);
}

// Re-init on every navigation
const _makeExcelOrigNav = window.navigate;
window.navigate = function (page) {
  _makeExcelOrigNav(page);
  setTimeout(() => {
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.querySelectorAll('table').forEach(makeTableExcel);
  }, 50);
};

function confirmPayment() {
  const invNo = document.getElementById('pay-invoice-no').value.trim();
  const client = document.getElementById('pay-client').value.trim();
  const amount = document.getElementById('pay-amount').value.trim();
  const method = document.getElementById('pay-method').value;
  const date = document.getElementById('pay-date').value;
  const ref = document.getElementById('pay-ref').value.trim();

  if (!amount || !method || !date) {
    showERPToast('Please fill in amount, method and date.');
    return;
  }

  // Add to payments table
  const tbody = document.getElementById('payments-tbody');
  if (tbody) {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-50 hover:bg-green-50 transition';
    tr.innerHTML = `
      <td class="px-5 py-3 text-xs text-slate-600">${dateStr}</td>
      <td class="px-3 py-3 font-mono text-xs text-blue-600">${invNo || '—'}</td>
      <td class="px-3 py-3 text-xs text-slate-700 font-semibold">${client || '—'}</td>
      <td class="px-3 py-3 text-xs text-slate-500">${method}</td>
      <td class="px-3 py-3 text-xs text-slate-400">${ref || '—'}</td>
      <td class="px-3 py-3 text-right text-xs font-bold text-green-600">${amount.startsWith('$') ? amount : '$' + amount}</td>
      <td class="px-3 py-3"><span class="pill" style="background:#d1fae5;color:#065f46;">Cleared</span></td>`;
    tbody.insertBefore(tr, tbody.firstChild);
  }

  // Also log to activity log if checked
  if (document.getElementById('pay-log-activity').checked) {
    ACTIVITY_LOG_DATA.unshift({
      id: ACTIVITY_LOG_DATA.length + 1,
      type: 'invoice', icon: '💳', label: 'Payment Received',
      contact: client, project: null,
      note: `Payment of ${amount} received for ${invNo} via ${method}${ref ? ' (Ref: ' + ref + ')' : ''}.`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      followup: false, urgent: false, resolved: true
    });
  }

  closePaymentModal();
  showERPToast('✓ Payment of ' + amount + ' recorded for ' + (invNo || 'invoice'));
}

/* ═══ DELIVERY SLIP ═══ */
function openDeliverySlip(prefill) {
  const m = document.getElementById('modal-delivery-slip');
  if (!m) return;
  // auto-number
  const num = 'DS-' + String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('ds-number').value = num;
  document.getElementById('ds-date').value = new Date().toISOString().slice(0, 10);
  if (prefill) {
    if (prefill.client) document.getElementById('ds-client').value = prefill.client;
    if (prefill.site) document.getElementById('ds-site').value = prefill.site;
    if (prefill.driver) document.getElementById('ds-driver').value = prefill.driver;
  }
  // reset items
  document.getElementById('ds-items-tbody').innerHTML = `
    <tr>
      <td class="p-1"><input type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="Item description"/></td>
      <td class="p-1"><input type="text" class="ds-item-unit w-full border rounded px-2 py-1 text-xs" placeholder="pcs"/></td>
      <td class="p-1"><input type="number" class="ds-item-qty w-full border rounded px-2 py-1 text-xs text-right" placeholder="0" value="1"/></td>
      <td class="p-1"><button onclick="this.closest('tr').remove()" class="text-red-400 hover:text-red-600 text-lg leading-none">×</button></td>
    </tr>`;
  m.classList.remove('hidden');
}
function closeDeliverySlip() { document.getElementById('modal-delivery-slip').classList.add('hidden'); }
function addDSLine() {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="p-1"><input type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="Item description"/></td>
    <td class="p-1"><input type="text" class="ds-item-unit w-full border rounded px-2 py-1 text-xs" placeholder="pcs"/></td>
    <td class="p-1"><input type="number" class="ds-item-qty w-full border rounded px-2 py-1 text-xs text-right" placeholder="0" value="1"/></td>
    <td class="p-1"><button onclick="this.closest('tr').remove()" class="text-red-400 hover:text-red-600 text-lg leading-none">×</button></td>`;
  document.getElementById('ds-items-tbody').appendChild(row);
}
function saveDeliverySlip(print) {
  const num = document.getElementById('ds-number').value;
  const client = document.getElementById('ds-client').value;
  showERPToast('✓ Delivery Slip ' + num + (client ? ' for ' + client : '') + ' saved');
  if (print) window.print();
  closeDeliverySlip();
}

/* ═══ PURCHASE ORDER ═══ */
function openPurchaseOrder(prefill) {
  const m = document.getElementById('modal-purchase-order');
  if (!m) return;
  const num = 'PO-' + String(new Date().getFullYear()).slice(2) + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  document.getElementById('po-number').value = num;
  document.getElementById('po-date').value = new Date().toISOString().slice(0, 10);
  const due = new Date(); due.setDate(due.getDate() + 14);
  document.getElementById('po-due').value = due.toISOString().slice(0, 10);
  if (prefill) {
    if (prefill.supplier) document.getElementById('po-supplier').value = prefill.supplier;
    if (prefill.project) document.getElementById('po-project').value = prefill.project;
  }
  document.getElementById('po-items-tbody').innerHTML = `
    <tr>
      <td class="p-1"><input type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="Item / material description"/></td>
      <td class="p-1"><input type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="pcs"/></td>
      <td class="p-1"><input type="number" class="po-qty w-full border rounded px-2 py-1 text-xs text-right" placeholder="1" value="1" oninput="calcPOTotals()"/></td>
      <td class="p-1"><input type="number" class="po-price w-full border rounded px-2 py-1 text-xs text-right" placeholder="0.00" value="" oninput="calcPOTotals()"/></td>
      <td class="p-1 text-right text-xs font-semibold po-line-total">$0.00</td>
      <td class="p-1"><button onclick="this.closest('tr').remove();calcPOTotals();" class="text-red-400 hover:text-red-600 text-lg leading-none">×</button></td>
    </tr>`;
  calcPOTotals();
  m.classList.remove('hidden');
}
function closePurchaseOrder() { document.getElementById('modal-purchase-order').classList.add('hidden'); }
function addPOLine() {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="p-1"><input type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="Item / material description"/></td>
    <td class="p-1"><input type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="pcs"/></td>
    <td class="p-1"><input type="number" class="po-qty w-full border rounded px-2 py-1 text-xs text-right" placeholder="1" value="1" oninput="calcPOTotals()"/></td>
    <td class="p-1"><input type="number" class="po-price w-full border rounded px-2 py-1 text-xs text-right" placeholder="0.00" oninput="calcPOTotals()"/></td>
    <td class="p-1 text-right text-xs font-semibold po-line-total">$0.00</td>
    <td class="p-1"><button onclick="this.closest('tr').remove();calcPOTotals();" class="text-red-400 hover:text-red-600 text-lg leading-none">×</button></td>`;
  document.getElementById('po-items-tbody').appendChild(row);
  calcPOTotals();
}
function calcPOTotals() {
  let sub = 0;
  document.querySelectorAll('#po-items-tbody tr').forEach(row => {
    const q = parseFloat(row.querySelector('.po-qty')?.value) || 0;
    const p = parseFloat(row.querySelector('.po-price')?.value) || 0;
    const t = q * p; sub += t;
    const lt = row.querySelector('.po-line-total');
    if (lt) lt.textContent = '$' + t.toFixed(2);
  });
  const vat = sub * 0.15;
  document.getElementById('po-subtotal').textContent = '$' + sub.toFixed(2);
  document.getElementById('po-vat').textContent = '$' + vat.toFixed(2);
  document.getElementById('po-total').textContent = '$' + (sub + vat).toFixed(2);
}
function submitPO(status) {
  const num = document.getElementById('po-number').value;
  const supplier = document.getElementById('po-supplier').value || 'Supplier';
  showERPToast('✓ Purchase Order ' + num + ' ' + (status === 'draft' ? 'saved as draft' : 'submitted to ' + supplier));
  closePurchaseOrder();
}

/* ═══ ENGINEERING CALCULATORS ═══ */
function engCalc(type) {
  const sections = document.querySelectorAll('.eng-section');
  sections.forEach(s => s.classList.add('hidden'));
  const target = document.getElementById('eng-' + type);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.eng-tab').forEach(t => t.classList.remove('active-tab'));
  const tab = document.querySelector(`.eng-tab[data-calc="${type}"]`);
  if (tab) tab.classList.add('active-tab');
}

function calcPropping() {
  const span = parseFloat(document.getElementById('pp-span').value) || 0;
  const width = parseFloat(document.getElementById('pp-width').value) || 0;
  const slabT = parseFloat(document.getElementById('pp-slab').value) || 200;
  const load = parseFloat(document.getElementById('pp-load').value) || 24; // kN/m³ concrete density
  const maxSpc = parseFloat(document.getElementById('pp-maxspacing').value) || 1.5;
  const propCap = parseFloat(document.getElementById('pp-propcap').value) || 30; // kN per prop

  if (!span || !width) { document.getElementById('pp-result').innerHTML = '<p class="text-amber-600 text-sm">Enter span and width first.</p>'; return; }

  // UDL: slab self-weight + 2kN/m² live load
  const slabWeight = (slabT / 1000) * load; // kN/m²
  const liveLoad = 2.0;
  const udl = slabWeight + liveLoad; // kN/m²

  // Grid layout
  const cols = Math.ceil(span / maxSpc) + 1;
  const rows = Math.ceil(width / maxSpc) + 1;
  const totalProps = cols * rows;
  const actualSpanSpc = span / (cols - 1);
  const actualWidthSpc = width / (rows - 1);
  const tributaryArea = actualSpanSpc * actualWidthSpc;
  const loadPerProp = udl * tributaryArea;
  const utilisation = (loadPerProp / propCap * 100).toFixed(1);
  const status = loadPerProp <= propCap * 0.8 ? '✅ OK' : loadPerProp <= propCap ? '⚠️ Near capacity' : '❌ OVERLOADED';

  document.getElementById('pp-result').innerHTML = `
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div class="bg-blue-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Total Props Required</p>
        <p class="text-3xl font-bold text-blue-700">${totalProps}</p>
        <p class="text-xs text-slate-400">${cols} cols × ${rows} rows</p>
      </div>
      <div class="bg-green-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Actual Spacing</p>
        <p class="text-2xl font-bold text-green-700">${actualSpanSpc.toFixed(2)} × ${actualWidthSpc.toFixed(2)} m</p>
        <p class="text-xs text-slate-400">span × width direction</p>
      </div>
      <div class="bg-slate-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">UDL on Slab</p>
        <p class="text-2xl font-bold text-slate-700">${udl.toFixed(2)} kN/m²</p>
        <p class="text-xs text-slate-400">${slabWeight.toFixed(2)} SW + ${liveLoad} Live</p>
      </div>
      <div class="rounded-lg p-3 text-center ${loadPerProp > propCap ? 'bg-red-50' : 'bg-amber-50'}">
        <p class="text-xs text-slate-500 mb-1">Load per Prop</p>
        <p class="text-2xl font-bold ${loadPerProp > propCap ? 'text-red-700' : 'text-amber-700'}">${loadPerProp.toFixed(1)} kN</p>
        <p class="text-xs font-semibold mt-1">${status} (${utilisation}% utilised)</p>
      </div>
    </div>
    <div class="mt-3 p-3 bg-white border rounded-lg text-xs text-slate-600">
      <strong>Summary:</strong> For a ${span}m × ${width}m slab (${slabT}mm thick), use <strong>${totalProps} props</strong> at ${actualSpanSpc.toFixed(2)}m × ${actualWidthSpc.toFixed(2)}m grid spacing. Each prop carries <strong>${loadPerProp.toFixed(1)} kN</strong> out of ${propCap} kN capacity.
    </div>`;
}

function calcScaffoldBays() {
  const length = parseFloat(document.getElementById('sb-length').value) || 0;
  const height = parseFloat(document.getElementById('sb-height').value) || 0;
  const bayWidth = parseFloat(document.getElementById('sb-baywidth').value) || 2.4;
  const liftH = parseFloat(document.getElementById('sb-liftheight').value) || 2.0;
  const boards = parseInt(document.getElementById('sb-boards').value) || 5;

  if (!length || !height) { document.getElementById('sb-result').innerHTML = '<p class="text-amber-600 text-sm">Enter length and height first.</p>'; return; }

  const numBays = Math.ceil(length / bayWidth);
  const actualBayW = length / numBays;
  const numLifts = Math.ceil(height / liftH);
  const actualLiftH = height / numLifts;
  const totalBoards = numBays * boards * numLifts;
  const totalStds = (numBays + 1) * (numLifts + 1) * 2; // front + back
  const ledgers = numBays * (numLifts + 1) * 2;
  const transoms = (numBays + 1) * numLifts;
  const area = length * height;

  document.getElementById('sb-result').innerHTML = `
    <div class="grid grid-cols-3 gap-3 text-sm">
      <div class="bg-blue-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Bays</p>
        <p class="text-3xl font-bold text-blue-700">${numBays}</p>
        <p class="text-xs text-slate-400">@ ${actualBayW.toFixed(2)}m each</p>
      </div>
      <div class="bg-green-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Lifts</p>
        <p class="text-3xl font-bold text-green-700">${numLifts}</p>
        <p class="text-xs text-slate-400">@ ${actualLiftH.toFixed(2)}m each</p>
      </div>
      <div class="bg-purple-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Face Area</p>
        <p class="text-3xl font-bold text-purple-700">${area.toFixed(1)} m²</p>
        <p class="text-xs text-slate-400">${length}m × ${height}m</p>
      </div>
    </div>
    <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
      <div class="bg-slate-50 rounded p-2 flex justify-between"><span class="text-slate-500">Standards (uprights)</span><strong>${totalStds}</strong></div>
      <div class="bg-slate-50 rounded p-2 flex justify-between"><span class="text-slate-500">Ledgers</span><strong>${ledgers}</strong></div>
      <div class="bg-slate-50 rounded p-2 flex justify-between"><span class="text-slate-500">Transoms</span><strong>${transoms}</strong></div>
      <div class="bg-slate-50 rounded p-2 flex justify-between"><span class="text-slate-500">Boards (${boards}/bay/lift)</span><strong>${totalBoards}</strong></div>
    </div>
    <div class="mt-2 p-3 bg-white border rounded-lg text-xs text-slate-600">
      <strong>Summary:</strong> ${length}m × ${height}m facade → <strong>${numBays} bays × ${numLifts} lifts</strong>. Estimate: ${totalStds} standards, ${ledgers} ledgers, ${transoms} transoms, ${totalBoards} boards.
    </div>`;
}

function calcMaterial() {
  const area = parseFloat(document.getElementById('mat-area').value) || 0;
  const type = document.getElementById('mat-type').value;
  if (!area) { document.getElementById('mat-result').innerHTML = '<p class="text-amber-600 text-sm">Enter area first.</p>'; return; }

  let rows = [];
  if (type === 'tube-fit') {
    // Standard tube-and-fitting independent scaffold per m²
    const stds = (area / 5).toFixed(0);
    const ledg = (area / 2.5).toFixed(0);
    const tran = (area / 2.0).toFixed(0);
    const board = (area / 0.5).toFixed(0);
    const coup = (area * 1.8).toFixed(0);
    rows = [
      ['Standards (48.3mm × 4m)', stds, 'pieces'],
      ['Ledgers (48.3mm)', ledg, 'pieces'],
      ['Transoms (48.3mm)', tran, 'pieces'],
      ['Boards (225mm × 3.9m)', board, 'pieces'],
      ['Swivel couplers', coup, 'pieces'],
    ];
  } else if (type === 'frame') {
    const frames = (area / 1.8).toFixed(0);
    const xbrace = (frames * 2).toFixed(0);
    const planks = (area / 0.45).toFixed(0);
    rows = [
      ['Frame sections (H-frame)', frames, 'pieces'],
      ['Cross braces', xbrace, 'pieces'],
      ['Planks / boards', planks, 'pieces'],
      ['Base plates', (frames * 2), 'pieces'],
    ];
  } else {
    // Kwikstage / modular
    const bays = (area / 4.8).toFixed(0);
    const stds = (bays * 4).toFixed(0);
    const ledg = (bays * 2).toFixed(0);
    const decks = (bays * 3).toFixed(0);
    rows = [
      ['Kwikstage standards', stds, 'pieces'],
      ['Horizontal ledgers', ledg, 'pieces'],
      ['Decking boards', decks, 'pieces'],
      ['Sole boards / base jacks', stds, 'pieces'],
    ];
  }

  const tableRows = rows.map(r => `<tr class="border-b border-slate-100"><td class="py-2 px-3 text-sm">${r[0]}</td><td class="py-2 px-3 text-right font-bold text-blue-700">${r[1]}</td><td class="py-2 px-3 text-slate-500 text-xs">${r[2]}</td></tr>`).join('');
  document.getElementById('mat-result').innerHTML = `
    <table class="w-full text-left text-sm"><thead><tr class="bg-slate-50 text-xs text-slate-500 uppercase"><th class="py-2 px-3">Component</th><th class="py-2 px-3 text-right">Est. Qty</th><th class="py-2 px-3">Unit</th></tr></thead><tbody>${tableRows}</tbody></table>
    <p class="text-xs text-slate-400 mt-2">* Estimates only. Add 10-15% waste factor. Based on ${area}m² scaffold face area.</p>`;
}

function calcLoadCapacity() {
  const type = document.getElementById('lc-type').value;
  const boards = parseInt(document.getElementById('lc-boards').value) || 4;
  const workers = parseInt(document.getElementById('lc-workers').value) || 2;
  const materials = parseFloat(document.getElementById('lc-materials').value) || 0;

  const boardWidth = 0.225; // m each board
  const platformW = boards * boardWidth;

  // SWL depends on scaffold class
  const classes = { light: 0.75, medium: 1.50, heavy: 2.00, special: 3.00 };
  const swlMap = { light: 'Class 1 – Light (inspection only)', medium: 'Class 2 – Medium (general)', heavy: 'Class 3 – Heavy', special: 'Class 4 – Special Heavy' };
  const swl = classes[type] || 1.5;
  const platformArea = platformW * 1.0; // per 1m run
  const allowedLoad = swl * platformArea;

  // Applied load
  const workerLoad = workers * 0.8; // 80kg ≈ 0.8kN per person
  const matLoad = materials;
  const totalApplied = workerLoad + matLoad;
  const util = (totalApplied / allowedLoad * 100).toFixed(1);
  const statusC = totalApplied <= allowedLoad * 0.8 ? 'text-green-600' : totalApplied <= allowedLoad ? 'text-amber-600' : 'text-red-600';
  const statusT = totalApplied <= allowedLoad * 0.8 ? '✅ Safe' : totalApplied <= allowedLoad ? '⚠️ Near limit' : '❌ OVERLOADED';

  document.getElementById('lc-result').innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-blue-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Platform Width</p>
        <p class="text-2xl font-bold text-blue-700">${(platformW * 1000).toFixed(0)}mm</p>
        <p class="text-xs text-slate-400">${boards} boards × 225mm</p>
      </div>
      <div class="bg-green-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Allowable Load (SWL)</p>
        <p class="text-2xl font-bold text-green-700">${allowedLoad.toFixed(2)} kN/m</p>
        <p class="text-xs text-slate-400">${swl} kN/m² · ${swlMap[type]}</p>
      </div>
      <div class="bg-slate-50 rounded-lg p-3 text-center">
        <p class="text-xs text-slate-500 mb-1">Applied Load</p>
        <p class="text-2xl font-bold text-slate-700">${totalApplied.toFixed(2)} kN/m</p>
        <p class="text-xs text-slate-400">${workers} workers + ${materials}kN materials</p>
      </div>
      <div class="rounded-lg p-3 text-center ${totalApplied > allowedLoad ? 'bg-red-50' : 'bg-amber-50'}">
        <p class="text-xs text-slate-500 mb-1">Utilisation</p>
        <p class="text-2xl font-bold ${statusC}">${util}%</p>
        <p class="text-xs font-semibold ${statusC}">${statusT}</p>
      </div>
    </div>`;
}
