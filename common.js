// ---- CONFIGURE THIS ONCE: paste your deployed Apps Script Web App URL ----
const API_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';

async function apiGet(action, params = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${API_URL}?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json.data;
}

async function apiPost(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight on Apps Script
    body: JSON.stringify(body)
  });
  const json = await res.json();
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
