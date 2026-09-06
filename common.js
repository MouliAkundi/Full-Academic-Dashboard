// ---- CONFIGURE THIS ONCE: paste your deployed Apps Script Web App URL ----
const API_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';

// Edit this once to change the department name everywhere it appears
// (Annual Plan letterhead, Teaching Diary letterhead, etc.)
const DEPARTMENT_NAME = 'Department of Mathematics';

const SITE_HEADER_CSS = `
<style>
  .institution-header { background:#fff; padding:12px 20px; border-bottom:1px solid #dbe3ee; }
  .institution-content { max-width:1200px; margin:auto; display:grid; grid-template-columns:90px 1fr 90px; align-items:center; gap:15px; text-align:center; }
  .institution-logo { width:70px; height:70px; object-fit:contain; margin:auto; }
  .institution-details h2 { margin:0; font-size:20px; color:#1f4e79; }
  .institution-details p { margin:4px 0; font-size:14px; }
  .personal-header { background:linear-gradient(135deg,#1f4e79,#2f75b5); color:#fff; padding:25px 20px; }
  .personal-content { max-width:900px; margin:auto; display:grid; grid-template-columns:110px 1fr 110px; align-items:center; text-align:center; }
  .personal-photo, .personal-logo { width:90px; height:90px; object-fit:cover; background:#fff; border:3px solid #fff; }
  .personal-photo { border-radius:50%; }
  .personal-logo { border-radius:15px; }
  .personal-name { margin:0; font-size:28px; }
  .dashboard-title { margin:7px 0 0; font-size:18px; font-weight:normal; }
  @media (max-width:600px) {
    .institution-content { grid-template-columns:60px 1fr 60px; }
    .institution-logo { width:50px; height:50px; }
    .institution-details h2 { font-size:15px; }
    .institution-details p { font-size:11px; }
    .personal-content { grid-template-columns:75px 1fr 75px; }
    .personal-photo, .personal-logo { width:65px; height:65px; }
    .personal-name { font-size:20px; }
    .dashboard-title { font-size:15px; }
  }
  @media print { .institution-header, .personal-header { display:none !important; } }
</style>`;

const SITE_HEADER_HTML = `
  <div class="institution-header">
    <div class="institution-content">
      <img id="siteLogo1" class="institution-logo" src="" alt="Logo">
      <div class="institution-details">
        <h2 id="siteInstitutionName">Loading...</h2>
        <p id="siteInstitutionAddress"></p>
        <p id="siteCommissionerateName"></p>
      </div>
      <img id="siteLogo2" class="institution-logo" src="" alt="Logo">
    </div>
  </div>
  <div class="personal-header">
    <div class="personal-content">
      <img class="personal-photo" src="profile.jpg" alt="My Photo">
      <div>
        <h1 class="personal-name">A.CHANDRA MOULI</h1>
        <p class="dashboard-title">My Academic Dashboard</p>
      </div>
      <img class="personal-logo" src="personal-logo.png" alt="Personal Logo">
    </div>
  </div>`;

/**
 * Injects the standard institution+personal header into the given container
 * and fills in the institution details from the Config sheet. Call this once
 * per page, sequentially with other init calls (it makes one 'config' request).
 */
async function renderSiteHeader(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = SITE_HEADER_CSS + SITE_HEADER_HTML;
  try {
    const configRows = await apiGet('config');
    const config = {};
    configRows.forEach(row => { config[row.Setting] = row.Value; });
    if (config['Institution Name']) document.getElementById('siteInstitutionName').textContent = config['Institution Name'];
    if (config['Institution Address']) document.getElementById('siteInstitutionAddress').textContent = config['Institution Address'];
    if (config['Commissionerate / Department Name']) document.getElementById('siteCommissionerateName').textContent = config['Commissionerate / Department Name'];
    if (config['Logo 1 URL']) document.getElementById('siteLogo1').src = config['Logo 1 URL'];
    if (config['Logo 2 URL']) document.getElementById('siteLogo2').src = config['Logo 2 URL'];
  } catch (err) {
    console.error('Could not load Config for site header:', err);
  }
}

/**
 * Parses a Sheets date value that may arrive as a real Date (serialized to
 * an ISO string by Apps Script), plain "YYYY-MM-DD" text, or "DD-MM-YYYY" /
 * "DD/MM/YYYY" text. Native `new Date(str)` is unreliable for the latter two
 * — it can silently produce a wrong-but-valid date instead of failing, which
 * is exactly what caused semester date-range checks to misbehave. Returns an
 * Invalid Date (NaN) if nothing matches, same as native Date() would.
 */
function parseDateLoose(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  const str = String(value || '').trim();
  if (!str) return new Date(NaN);

  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); // 2026-06-22 or with a time suffix
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = str.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/); // 22-06-2026 or 22/06/2026
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));

  return new Date(str); // last resort — real Date objects/ISO strings land here
}

async function apiGet(action, params = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${API_URL}?${qs}`);
  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error('The backend did not return valid data — it may be temporarily overloaded (too many requests at once) or needs reauthorizing. Wait a few seconds and try again.');
  }
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json.data;
}

async function apiPost(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight on Apps Script
    body: JSON.stringify(body)
  });
  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error('The backend did not return valid data — it may be temporarily overloaded (too many requests at once) or needs reauthorizing. Wait a few seconds and try again.');
  }
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json.data;
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function setSelectOptions(select, items, placeholder) {
  select.innerHTML = '';
  const ph = document.createElement('option');
  ph.textContent = placeholder;
  ph.value = '';
  select.appendChild(ph);
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.value;
    opt.textContent = item.label;
    select.appendChild(opt);
  });
  select.disabled = items.length === 0;
}

/**
 * Wires up the standard Academic Year -> Semester -> Class cascade used on
 * every module page, driven by Master Classes rows.
 *   onClassReady(classId, year, semester) fires once a class is picked.
 *   onReset() fires whenever an earlier choice changes (to clear anything downstream).
 */
function wireClassCascade({ yearSelect, semSelect, classSelect, classes, onClassReady, onReset }) {
  const years = [...new Set(classes.map(c => c['Academic Year']))].filter(Boolean);
  setSelectOptions(yearSelect, years.map(y => ({ value: y, label: y })), 'Select Academic Year');
  yearSelect.disabled = false;

  yearSelect.addEventListener('change', () => {
    const year = yearSelect.value;
    setSelectOptions(classSelect, [], 'Select semester first');
    setSelectOptions(semSelect, [], 'Select year first');
    if (onReset) onReset();
    if (!year) return;
    const sems = [...new Set(
      classes.filter(c => String(c['Academic Year']) === year).map(c => c['Semester'])
    )].filter(s => s !== '' && s != null);
    setSelectOptions(semSelect, sems.map(s => ({ value: s, label: 'Semester ' + s })), 'Select Semester');
  });

  semSelect.addEventListener('change', () => {
    const year = yearSelect.value;
    const sem = semSelect.value;
    if (onReset) onReset();
    if (!sem) { setSelectOptions(classSelect, [], 'Select semester first'); return; }
    const seen = new Set();
    const classesForSem = classes
      .filter(c => String(c['Academic Year']) === year && String(c['Semester']) === sem)
      .filter(c => { if (seen.has(c['Class ID'])) return false; seen.add(c['Class ID']); return true; });
    setSelectOptions(
      classSelect,
      classesForSem.map(c => ({ value: c['Class ID'], label: `${c['Class ID']} (Sec ${c['Section'] ?? '-'})` })),
      'Select Class'
    );
  });

  classSelect.addEventListener('change', () => {
    if (onReset) onReset();
    if (classSelect.value && onClassReady) onClassReady(classSelect.value, yearSelect.value, semSelect.value);
  });
}
