// ---- CONFIGURE THIS ONCE: paste your deployed Apps Script Web App URL ----
const API_URL = 'https://script.google.com/macros/s/AKfycbxAe7OQOSnq7zdX3GqtWg02r3LHqTh05wYUkMoV3VumtdNONNsgk74SeO3AkjBmGec4/exec';

// Edit this once to change the department name everywhere it appears
// (Annual Plan letterhead, Teaching Diary letterhead, etc.)
const DEPARTMENT_NAME = 'Department of Mathematics';

const SITE_HEADER_CSS = `
<style>
  .site-banner {
    position:relative; overflow:hidden; color:#082f63;
    background:
      radial-gradient(circle at 8% 20%, rgba(255,255,255,.9) 0 1px, transparent 2px) 0 0/12px 12px,
      linear-gradient(115deg, #d8efff 0%, #f8fcff 45%, #d9efff 100%);
    border-bottom:4px solid #176ac0;
    isolation:isolate;
  }
  .site-banner::before, .site-banner::after {
    content:""; position:absolute; left:-4%; right:-4%; height:65px; z-index:-1;
    border-radius:50%; pointer-events:none;
  }
  .site-banner::before {
    bottom:-35px; background:linear-gradient(90deg,#0865c4,#43b6ef,#0865c4);
    transform:rotate(-1deg);
  }
  .site-banner::after {
    bottom:-48px; height:48px; background:#f4c343;
    transform:rotate(1deg);
  }
  .site-banner-grid {
    position:relative; max-width:1600px; margin:0 auto; padding:16px 20px 22px;
    display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); align-items:center;
  }
  .site-banner-cell {
    min-width:0; min-height:132px; padding:0 16px; display:flex; align-items:center;
    justify-content:center; gap:12px; text-align:center; box-sizing:border-box;
  }
  .site-banner-cell + .site-banner-cell { border-left:1px solid rgba(14,82,145,.35); }
  .site-banner img { display:block; flex:0 0 auto; object-fit:contain; }
  .site-logo { width:88px; height:88px; }
  .site-college-cell { flex-direction:column; gap:5px; }
  .site-college-copy h2 { margin:0; font-size:clamp(13px,1.35vw,22px); line-height:1.12; font-weight:800; color:#0a356c; }
  .site-college-copy .site-city { margin-top:4px; font-size:clamp(12px,1.15vw,18px); font-weight:700; color:#176ac0; }
  .site-college-copy .site-commissionerate { margin-top:6px; font-size:clamp(10px,.92vw,14px); line-height:1.25; }
  .site-commissionerate-cell { flex-direction:column; gap:5px; }
  .site-commissionerate-cell .site-logo { width:82px; height:82px; }
  .site-image-caption { margin:0; font-size:12px; font-weight:600; line-height:1.15; color:#123f75; }
  .site-profile-cell { flex-direction:column; gap:5px; }
  .site-profile { width:76px; height:76px; border-radius:50%; border:3px solid #1474d4; background:#fff; }
  .site-personal-name { margin:0; font-size:clamp(14px,1.25vw,21px); line-height:1.15; font-weight:800; color:#0a356c; }
  .site-dashboard-title { margin:3px 0 0; font-size:clamp(11px,.95vw,15px); color:#123f75; }
  .site-personal-logo { width:78px; height:78px; border-radius:14px; background:#fff; }
  .site-personal-cell { flex-direction:column; gap:5px; }
  .site-logo-fallback { background:rgba(255,255,255,.72); border:1px dashed #7aa8d8; border-radius:12px; }
  @media (max-width:900px) {
    .site-banner-grid { padding:12px 8px 20px; }
    .site-banner-cell { padding:0 8px; min-height:115px; gap:7px; }
    .site-logo { width:66px; height:66px; }
    .site-commissionerate-cell .site-logo { width:64px; height:64px; }
    .site-profile { width:60px; height:60px; }
    .site-personal-logo { width:62px; height:62px; }
  }
  @media (max-width:620px) {
    .site-banner-grid { grid-template-columns:repeat(2,minmax(0,1fr)); padding:10px 8px 18px; }
    .site-banner-cell { min-height:112px; padding:8px 5px; }
    .site-banner-cell:nth-child(3) { border-left:0; }
    .site-banner-cell:nth-child(n+3) { border-top:1px solid rgba(14,82,145,.25); }
    .site-logo { width:56px; height:56px; }
    .site-commissionerate-cell .site-logo { width:54px; height:54px; }
    .site-profile { width:52px; height:52px; }
    .site-personal-logo { width:54px; height:54px; }
    .site-college-copy h2 { font-size:13px; }
    .site-college-copy .site-city { font-size:12px; }
    .site-college-copy .site-commissionerate { font-size:10px; }
    .site-personal-name { font-size:13px; }
    .site-dashboard-title, .site-image-caption { font-size:10px; }
  }
  @media print { .site-banner { display:none !important; } }
</style>`;


const SITE_HEADER_HTML = `
  <div class="site-banner">
    <div class="site-banner-grid">
      <section class="site-banner-cell site-college-cell">
        <img class="site-logo site-logo-fallback" src="logo1.png" alt="College Logo"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
        <div class="site-college-copy">
          <h2 id="siteInstitutionName">GOVERNMENT DEGREE COLLEGE</h2>
          <div class="site-city" id="siteInstitutionAddress">VIZIANAGARAM</div>
          <div class="site-commissionerate" id="siteCommissionerateName">Commissionerate of Higher Education AP</div>
        </div>
      </section>
      <section class="site-banner-cell site-commissionerate-cell">
        <img class="site-logo site-logo-fallback" src="logo2.png" alt="Commissionerate Logo"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
        <p class="site-image-caption">Commissionerate Logo</p>
      </section>
      <section class="site-banner-cell site-profile-cell">
        <img class="site-profile" src="profile.jpg" alt="Profile photograph"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
        <div>
          <h1 class="site-personal-name">A. CHANDRA MOULI</h1>
          <p class="site-dashboard-title">ACADEMIC DASHBOARD</p>
        </div>
      </section>
      <section class="site-banner-cell site-personal-cell">
        <img class="site-personal-logo" src="personal-logo.png" alt="Personal / Department Logo"
             onerror="this.style.visibility='hidden';" fetchpriority="high" decoding="async">
        <p class="site-image-caption">Personal / Department Logo</p>
      </section>
    </div>
  </div>`;


async function renderSiteHeader(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Render the complete banner immediately. All four images are static assets
  // on GitHub Pages, so logo loading does not wait for the Google Sheets API.
  el.innerHTML = SITE_HEADER_CSS + SITE_HEADER_HTML;

  // Load editable institutional text in the background; this does not control
  // image URLs or block the rest of the page from initializing.
  try {
    const configRows = await apiGet('config');
    const config = {};
    configRows.forEach(row => { config[row.Setting] = row.Value; });

    const institutionName = document.getElementById('siteInstitutionName');
    const institutionAddress = document.getElementById('siteInstitutionAddress');
    const commissionerateName = document.getElementById('siteCommissionerateName');

    if (institutionName && config['Institution Name']) {
      institutionName.textContent = config['Institution Name'];
    }
    if (institutionAddress && config['Institution Address']) {
      institutionAddress.textContent = config['Institution Address'];
    }
    if (commissionerateName && config['Commissionerate / Department Name']) {
      commissionerateName.textContent = config['Commissionerate / Department Name'];
    }
  } catch (err) {
    console.error('Could not load institutional text from Config; static banner text remains visible:', err);
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
