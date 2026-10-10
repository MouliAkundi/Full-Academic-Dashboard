// ---- CONFIGURE THIS ONCE: paste your deployed Apps Script Web App URL ----
const API_URL = 'https://script.google.com/macros/s/AKfycbxAe7OQOSnq7zdX3GqtWg02r3LHqTh05wYUkMoV3VumtdNONNsgk74SeO3AkjBmGec4/exec';

// Edit this once to change the department name everywhere it appears
// (Annual Plan letterhead, Teaching Diary letterhead, etc.)
const DEPARTMENT_NAME = 'Department of Mathematics';

const SITE_HEADER_CSS = `
<style>
  .site-banner {
    position:relative;
    overflow:hidden;
    color:#082f63;
    background:
      radial-gradient(circle at 8% 20%, rgba(255,255,255,.9) 0 1px, transparent 2px) 0 0/12px 12px,
      linear-gradient(115deg, #d8efff 0%, #f8fcff 45%, #d9efff 100%);
    border-bottom:4px solid #176ac0;
    isolation:isolate;
  }
  .site-banner::before, .site-banner::after {
    content:"";
    position:absolute;
    left:-4%;
    right:-4%;
    height:65px;
    z-index:-1;
    border-radius:50%;
    pointer-events:none;
  }
  .site-banner::before {
    bottom:-35px;
    background:linear-gradient(90deg,#0865c4,#43b6ef,#0865c4);
    transform:rotate(-1deg);
  }
  .site-banner::after {
    bottom:-48px;
    height:48px;
    background:#f4c343;
    transform:rotate(1deg);
  }
  .site-banner-grid {
    position:relative;
    max-width:1800px;
    margin:0 auto;
    padding:12px 18px 20px;
    display:grid;
    grid-template-columns:minmax(100px,.78fr) minmax(100px,.78fr) minmax(350px,3.5fr) minmax(100px,.78fr) minmax(100px,.78fr);
    align-items:center;
  }
  .site-banner-cell {
    min-width:0;
    min-height:132px;
    padding:0 12px;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    box-sizing:border-box;
  }
  .site-banner-cell + .site-banner-cell {
    border-left:1px solid rgba(14,82,145,.25);
  }
  .site-banner img {
    display:block;
    flex:0 0 auto;
    object-fit:contain;
  }
  .site-profile {
    width:clamp(76px,7vw,112px);
    height:clamp(76px,7vw,112px);
    border-radius:50%;
    border:4px solid #1474d4;
    background:#fff;
  }
  .site-logo {
    width:clamp(72px,6.4vw,100px);
    height:clamp(72px,6.4vw,100px);
    background:rgba(255,255,255,.72);
    border-radius:50%;
  }
  .site-personal-logo {
    width:clamp(74px,6.4vw,100px);
    height:clamp(74px,6.4vw,100px);
    border-radius:15px;
    background:#fff;
    border:3px solid rgba(255,255,255,.85);
  }
  .site-banner-photo-cell,
  .site-banner-logo-cell {
    flex-direction:column;
    gap:5px;
  }
  .site-banner-center {
    flex-direction:column;
    gap:4px;
    padding:2px 18px;
  }
  .site-commissionerate-heading {
    margin:0;
    font-size:clamp(12px,1.08vw,19px);
    line-height:1.2;
    font-weight:500;
    color:#164579;
  }
  .site-institution-heading {
    margin:1px 0 0;
    font-size:clamp(16px,1.75vw,29px);
    line-height:1.13;
    font-weight:900;
    letter-spacing:.1px;
    color:#0a356c;
    text-transform:uppercase;
  }
  .site-gold-divider {
    display:flex;
    align-items:center;
    justify-content:center;
    width:min(94%,560px);
    height:8px;
    margin:1px 0 2px;
    background:linear-gradient(90deg,transparent,#f4c343 12%,#f4c343 88%,transparent);
    position:relative;
  }
  .site-gold-divider::after {
    content:"";
    width:13px;
    height:13px;
    border-radius:50%;
    background:#f4c343;
    border:3px solid #e5f5ff;
    box-sizing:content-box;
  }
  .site-department-heading {
    margin:0;
    font-size:clamp(15px,1.45vw,24px);
    line-height:1.12;
    font-weight:900;
    color:#176ac0;
    text-transform:uppercase;
  }
  .site-lecturer-heading {
    margin:2px 0 3px;
    font-size:clamp(12px,1.08vw,19px);
    line-height:1.2;
    font-weight:800;
    color:#0a356c;
  }
  .site-dashboard-title {
    display:inline-block;
    margin:0;
    padding:5px 24px 6px;
    border-radius:9px;
    background:linear-gradient(90deg,#073c80,#0a4c9b,#073c80);
    color:#fff;
    font-size:clamp(13px,1.2vw,21px);
    line-height:1.1;
    font-weight:900;
    letter-spacing:.3px;
  }
  @media (max-width:900px) {
    .site-banner-grid {
      grid-template-columns:minmax(65px,.65fr) minmax(65px,.65fr) minmax(230px,3fr) minmax(65px,.65fr) minmax(65px,.65fr);
      padding:10px 6px 18px;
    }
    .site-banner-cell { min-height:112px; padding:0 5px; }
    .site-profile { width:64px; height:64px; border-width:3px; }
    .site-logo { width:58px; height:58px; }
    .site-personal-logo { width:60px; height:60px; border-radius:11px; }
    .site-banner-center { padding:2px 8px; }
    .site-institution-heading { font-size:clamp(14px,2vw,20px); }
    .site-department-heading { font-size:clamp(13px,1.7vw,18px); }
    .site-lecturer-heading { font-size:clamp(11px,1.3vw,14px); }
    .site-commissionerate-heading { font-size:clamp(10px,1.2vw,13px); }
    .site-dashboard-title { font-size:clamp(11px,1.4vw,15px); padding:5px 12px; }
  }
  @media (max-width:620px) {
    .site-banner-grid {
      grid-template-columns:repeat(4,minmax(0,1fr));
      padding:8px 5px 16px;
    }
    .site-banner-photo-cell { grid-column:1; grid-row:1; }
    .site-banner-college-logo { grid-column:2; grid-row:1; }
    .site-banner-commissionerate-logo { grid-column:3; grid-row:1; }
    .site-banner-personal-logo { grid-column:4; grid-row:1; }
    .site-banner-center {
      grid-column:1 / -1;
      grid-row:2;
      border-left:0 !important;
      border-top:1px solid rgba(14,82,145,.25);
      min-height:auto;
      padding:10px 4px 4px;
    }
    .site-banner-cell { min-height:80px; padding:4px 2px; }
    .site-banner-cell + .site-banner-cell { border-left:1px solid rgba(14,82,145,.2); }
    .site-profile { width:48px; height:48px; border-width:2px; }
    .site-logo { width:44px; height:44px; }
    .site-personal-logo { width:46px; height:46px; border-radius:8px; border-width:2px; }
    .site-institution-heading { font-size:clamp(15px,4vw,21px); }
    .site-commissionerate-heading { font-size:12px; }
    .site-department-heading { font-size:15px; }
    .site-lecturer-heading { font-size:12px; }
    .site-dashboard-title { font-size:13px; padding:5px 16px; }
    .site-gold-divider { width:90%; }
  }
  @media print { .site-banner { display:none !important; } }
</style>`;


const SITE_HEADER_HTML = `
  <div class="site-banner">
    <div class="site-banner-grid">
      <section class="site-banner-cell site-banner-photo-cell">
        <img class="site-profile" src="profile.jpg" alt="A. Chandra Mouli"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
      </section>

      <section class="site-banner-cell site-banner-logo-cell site-banner-college-logo">
        <img class="site-logo" src="logo1.png" alt="College Logo"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
      </section>

      <section class="site-banner-cell site-banner-center">
        <p class="site-commissionerate-heading">Commissionerate of Collegiate Education AP</p>
        <h1 class="site-institution-heading" id="siteInstitutionName">Government Degree College, Vizianagaram</h1>
        <div class="site-gold-divider" aria-hidden="true"></div>
        <h2 class="site-department-heading">Department of Mathematics</h2>
        <p class="site-lecturer-heading">A. Chandra Mouli, Lecturer in Mathematics</p>
        <p class="site-dashboard-title">ACADEMIC DASHBOARD</p>
      </section>

      <section class="site-banner-cell site-banner-logo-cell site-banner-commissionerate-logo">
        <img class="site-logo" src="logo2.png" alt="Commissionerate Logo"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
      </section>

      <section class="site-banner-cell site-banner-logo-cell">
        <img class="site-personal-logo" src="personal-logo.png" alt="Personal / Department Logo"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
      </section>
    </div>
  </div>`;


async function renderSiteHeader(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Paint the complete banner immediately. All four images are local
  // GitHub Pages assets, so they do not wait for the Google Sheets API.
  el.innerHTML = SITE_HEADER_CSS + SITE_HEADER_HTML;

  // Keep the college name editable in Config, but preserve the exact
  // Commissionerate, Department, lecturer, and dashboard headings requested.
  try {
    const configRows = await apiGet('config');
    const config = {};
    configRows.forEach(row => { config[row.Setting] = row.Value; });

    const institutionName = document.getElementById('siteInstitutionName');
    if (institutionName && config['Institution Name']) {
      institutionName.textContent = config['Institution Name'];
    }
  } catch (err) {
    console.error('Could not load institution name from Config; using the default banner text:', err);
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

function isHolidayDate(dateStr, calendarRows) {
  const d = new Date(dateStr + 'T00:00:00');
  return calendarRows.some(h => {
    if (!/holiday|vacation|exam/i.test(h['Day Type'] || '')) return false;
    const from = parseDateLoose(h['From Date']), to = parseDateLoose(h['To Date']);
    if (isNaN(from) || isNaN(to)) return false;
    return from <= d && d <= to;
  });
}

// Sunday, or a date covered by an Academic Calendar Holiday/Vacation/Exam entry, is not a working day.
function isWorkingDay(dateStr, calendarRows) {
  const d = new Date(dateStr + 'T00:00:00');
  if (d.getDay() === 0) return false;
  return !isHolidayDate(dateStr, calendarRows);
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

function getAdminSecret() {
  let secret = localStorage.getItem('dashboardAdminSecret');
  if (!secret) {
    secret = prompt('Enter the edit password to save changes:') || '';
    if (secret) localStorage.setItem('dashboardAdminSecret', secret);
  }
  return secret;
}

async function apiPost(body) {
  const payload = Object.assign({}, body, { adminSecret: getAdminSecret() });
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight on Apps Script
    body: JSON.stringify(payload)
  });
  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error('The backend did not return valid data — it may be temporarily overloaded (too many requests at once) or needs reauthorizing. Wait a few seconds and try again.');
  }
  if (!json.success) {
    if (json.error === 'UNAUTHORIZED') {
      localStorage.removeItem('dashboardAdminSecret'); // so the next save attempt re-prompts
      throw new Error('Incorrect edit password. Try saving again to re-enter it.');
    }
    throw new Error(json.error || 'Request failed');
  }
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
