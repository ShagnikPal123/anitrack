/* ============================================================
   AniTrack — static anime / manga / light-novel tracker
   Vanilla JS. Data in localStorage. AniList GraphQL API.
   ============================================================ */
'use strict';

/* ---------------- Icons (inline SVG, no emoji) ---------------- */
const ICONS = {
  home:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 9.5V21h14V9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21v-6h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  anime:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  manga:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V4H6.5A2.5 2.5 0 004 6.5v13z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 19.5A2.5 2.5 0 006.5 22H20v-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8h7M9 12h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  ln:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 6v14" stroke="currentColor" stroke-width="2"/></svg>',
  franchise:'<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="2.5" stroke="currentColor" stroke-width="2"/><path d="M8 7.5l3 8M16 7.5l-3 8M8.5 6h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  suggestions:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  statistics:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  links:'<svg viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  aichat:'<svg viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="13" cy="12" r="1" fill="currentColor"/><circle cx="17" cy="12" r="1" fill="currentColor"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.5h0a1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.5 1z" stroke="currentColor" stroke-width="1.6"/></svg>'
};

/* ---------------- Quotes ---------------- */
const QUOTES = [
  {t:"Whatever you lose, you'll find it again. But what you throw away you'll never get back.",a:"Himura Kenshin — Rurouni Kenshin"},
  {t:"If you don't take risks, you can't create a future.",a:"Monkey D. Luffy — One Piece"},
  {t:"The world isn't perfect. But it's there for us, doing the best it can.",a:"Roy Mustang — Fullmetal Alchemist: Brotherhood"},
  {t:"A lesson without pain is meaningless.",a:"Edward Elric — Fullmetal Alchemist: Brotherhood"},
  {t:"Those who forgive themselves, and are able to accept their true nature — they are the strong ones.",a:"Itachi Uchiha — Naruto Shippuden"},
  {t:"In this world, wherever there is light, there are also shadows.",a:"Death Note"},
  {t:"Do not pity the dead. Pity the living, and above all, those who live without love.",a:"Albus Dumbledore (honorary)"},
  {t:"Fear is not evil. It tells you what your weakness is.",a:"Gildarts Clive — Fairy Tail"},
  {t:"Even if I die, I'll keep dying and keep living.",a:"Subaru Natsuki — Re:Zero"},
  {t:"The only ones who should kill are those prepared to be killed.",a:"Lelouch vi Britannia — Code Geass"},
  {t:"If you don't like your destiny, don't accept it. Instead, have the courage to change it.",a:"Naruto Uzumaki — Naruto"},
  {t:"Hard work is worthless for those that don't believe in themselves.",a:"Naruto Uzumaki — Naruto"},
  {t:"You should enjoy the little detours. Because that's where you'll find the things more important than what you want.",a:"Ging Freecss — Hunter x Hunter"},
  {t:"A person grows up when he's able to overcome hardships.",a:"Jiraiya — Naruto"},
  {t:"People's lives don't end when they die. It ends when they lose faith.",a:"Itachi Uchiha — Naruto Shippuden"},
  {t:"It is not the face that makes someone a monster; it's the choices they make with their lives.",a:"Naruto Shippuden"},
  {t:"When you give up, that's when the game is over.",a:"Mitsuyoshi Anzai — Slam Dunk"},
  {t:"No matter how hard or impossible it is, never lose sight of your goal.",a:"Monkey D. Luffy — One Piece"},
  {t:"Being alone is not a bad thing. It just means you're strong enough to handle things by yourself.",a:"Unknown"},
  {t:"To know sorrow is not terrifying. What is terrifying is to know you can't go back to happiness you could have.",a:"Matsumoto Rangiku — Bleach"},
  {t:"Every journey begins with a single step. We just have to have patience.",a:"Milly Thompson — Trigun"},
  {t:"Don't be afraid of death. Be afraid of the unlived life.",a:"Tessa Gray (honorary)"},
  {t:"The moment you think of giving up, think of the reason why you held on so long.",a:"Natsu Dragneel — Fairy Tail"},
  {t:"If you can't do something, then don't. Focus on what you can do.",a:"Shiroe — Log Horizon"},
  {t:"There is no such thing as a coincidence in this world. There is only the inevitable.",a:"Yuko Ichihara — xxxHolic"},
  {t:"Simplicity is the easiest path to true beauty.",a:"Seishuu Handa — Barakamon"},
  {t:"A dropout will beat a genius through hard work.",a:"Rock Lee — Naruto"},
  {t:"Power comes in response to a need, not a desire.",a:"Goku — Dragon Ball Z"},
  {t:"The world is cruel, but also very beautiful.",a:"Mikasa Ackerman — Attack on Titan"},
  {t:"Continue to swim against the current. That is what it means to live.",a:"Gintama"}
];

/* ---------------- Config ---------------- */
const LS_KEY = 'anitrack.v1';
const AL_URL = 'https://graphql.anilist.co';
const CACHE_TTL = 24 * 3600 * 1000;
const REL_TTL = 7 * 24 * 3600 * 1000;
const KIND_LABEL = {anime:'Anime', manga:'Manga', ln:'Light Novel'};
const MEDIA_TYPE_OF = {anime:'ANIME', manga:'MANGA', ln:'MANGA'};
const UNIT_LABEL = {ep:'ep', ch:'ch', vol:'vol', pg:'pg'};
const UNIT_NAME = {ep:'Episodes', ch:'Chapters', vol:'Volumes', pg:'Pages'};
const STATUSES = {
  anime:[['watching','Watching'],['completed','Completed'],['onhold','On Hold'],['dropped','Dropped'],['plan','Plan to Watch']],
  manga:[['reading','Reading'],['completed','Completed'],['onhold','On Hold'],['dropped','Dropped'],['plan','Plan to Read']],
  ln:[['reading','Reading'],['completed','Completed'],['onhold','On Hold'],['dropped','Dropped'],['plan','Plan to Read']]
};
const THEMES = {
  ember:{accent:'#e8632c', name:'Ember'},
  ocean:{accent:'#3f8fd6', name:'Ocean'},
  forest:{accent:'#4caf6d', name:'Forest'},
  grape:{accent:'#9b6bd3', name:'Grape'},
  rose:{accent:'#e0527e', name:'Rose'},
  gold:{accent:'#d9a441', name:'Gold'}
};
const BG_PRESETS = {
  ember:'radial-gradient(1200px 800px at 20% -10%, #2e2013 0%, transparent 60%),radial-gradient(1000px 700px at 110% 110%, #2a1c10 0%, transparent 55%),linear-gradient(160deg,#1d140c,#14100b)',
  midnight:'radial-gradient(1200px 800px at 20% -10%, #16233d 0%, transparent 60%),radial-gradient(1000px 700px at 110% 110%, #101a2e 0%, transparent 55%),linear-gradient(160deg,#0e1626,#090e18)',
  forest:'radial-gradient(1200px 800px at 20% -10%, #122b1c 0%, transparent 60%),radial-gradient(1000px 700px at 110% 110%, #0d2216 0%, transparent 55%),linear-gradient(160deg,#0c1d13,#070f0a)',
  plum:'radial-gradient(1200px 800px at 20% -10%, #2c1526 0%, transparent 60%),radial-gradient(1000px 700px at 110% 110%, #221020 0%, transparent 55%),linear-gradient(160deg,#1c0f1a,#0f080e)'
};
const DEFAULT_SETTINGS = () => ({theme:'ember', accent:THEMES.ember.accent, bg:'ember', bgUrl:'', displayName:''});

/* ---------------- Utils ---------------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = p => (p || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const dayStart = d => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const todayKey = () => dayStart(new Date()).toISOString();
const fmtDate = ts => new Date(ts).toLocaleDateString(undefined, {month:'short', day:'numeric'});
const parseDayKey = k => { const [y, m, d] = k.slice(0,10).split('-').map(Number); return new Date(y, m - 1, d); };
const fmtTime = ts => new Date(ts).toLocaleTimeString(undefined, {hour:'numeric', minute:'2-digit'});
function download(name, text, mime='text/plain'){
  const b = new Blob([text], {type:mime + ';charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------------- Storage ---------------- */
let DB = null;
function newProfile(name){
  return { id: uid('p'), name: name || 'My Profile', entries:{}, links:[], schedule:[], activity:[], settings: DEFAULT_SETTINGS() };
}
function loadDB(){
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) { DB = JSON.parse(raw); }
  } catch(e){ DB = null; }
  if (!DB || !DB.profiles){
    const p = newProfile('');
    DB = { version:1, activeProfile:p.id, profiles:{[p.id]:p}, cache:{} };
    save();
  }
  if (!DB.cache) DB.cache = {};
  if (!DB.profiles[DB.activeProfile]) DB.activeProfile = Object.keys(DB.profiles)[0];
}
function save(){ try { localStorage.setItem(LS_KEY, JSON.stringify(DB)); } catch(e){ toast('Storage full — could not save', 'err'); } }
const P = () => DB.profiles[DB.activeProfile];
const entries = () => Object.values(P().entries);
const entry = id => P().entries[id];

/* ---------------- Toasts ---------------- */
function toast(msg, type=''){
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.innerHTML = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 350); }, 2600);
}

/* ---------------- AniList client (cached) ---------------- */
async function AL(query, vars={}, ttl=CACHE_TTL){
  const key = 'al:' + btoa(unescape(encodeURIComponent(query + JSON.stringify(vars)))).slice(0, 120);
  const now = Date.now();
  const hit = DB.cache[key];
  if (hit && (now - hit.t) < ttl) return hit.data;
  try {
    const res = await fetch(AL_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({query, variables:vars})
    });
    if (res.status === 429) throw new Error('AniList rate limit — please wait a minute and retry.');
    if (!res.ok) throw new Error('AniList error ' + res.status);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0]?.message || 'AniList query failed');
    DB.cache[key] = {t: now, data: json.data};
    save();
    return json.data;
  } catch(e){
    if (hit) { toast('Offline — using cached data', 'err'); return hit.data; }
    throw e;
  }
}
const Q_SEARCH = `query($s:String,$t:MediaType){Page(page:1,perPage:12){media(search:$s,type:$t,sort:SEARCH_MATCH){id type format title{romaji english}coverImage{large}episodes chapters volumes averageScore status startDate{year}}}}`;
const Q_MEDIA = `query($id:Int){Media(id:$id){id type format title{romaji english}description(asHtml:false)coverImage{large extraLarge}episodes chapters volumes averageScore genres status startDate{year month day}nextAiringEpisode{airingAt episode}relations{edges{relationType node{id type format title{romaji english}coverImage{large}episodes chapters volumes}}}recommendations(page:1,perPage:12,sort:RATING_DESC){nodes{rating mediaRecommendation{id type format title{romaji english}coverImage{large}episodes chapters volumes averageScore genres}}}}}`;
const Q_AIRING = `query($p:Int,$g:Int,$l:Int,$ids:[Int]){Page(page:$p,perPage:50){pageInfo{hasNextPage}airingSchedules(airingAt_greater:$g,airingAt_lesser:$l,mediaId_in:$ids,sort:TIME){airingAt episode media{id title{romaji english}coverImage{large}}}}}`;

async function alSearch(text, mediaType){
  const data = await AL(Q_SEARCH, {s:text, t:mediaType});
  return data.Page.media || [];
}
async function alMedia(id){
  const data = await AL(Q_MEDIA, {id}, REL_TTL);
  return data.Media;
}
async function alAiring(ids, days){
  const now = Math.floor(Date.now()/1000);
  const out = [];
  let page = 1, hasNext = true;
  while (hasNext && page <= 4){
    const data = await AL(Q_AIRING, {p:page, g:now, l:now + days*86400, ids}, 3600*1000);
    out.push(...data.Page.airingSchedules);
    hasNext = data.Page.pageInfo.hasNextPage; page++;
  }
  return out;
}
const mediaTitle = m => m?.title?.english || m?.title?.romaji || 'Unknown';
const mediaCover = m => m?.coverImage?.large || '';

/* ---------------- Activity log ---------------- */
function logActivity(entryId, delta, kind){
  P().activity.push({t: Date.now(), entryId, kind, delta});
  if (P().activity.length > 5000) P().activity = P().activity.slice(-5000);
  save();
}
function streakDays(){
  const days = new Set(P().activity.map(a => dayStart(a.t).toISOString()));
  let s = 0; let d = dayStart(new Date());
  if (!days.has(d.toISOString())) d = new Date(d.getTime() - 86400000);
  while (days.has(d.toISOString())){ s++; d = new Date(d.getTime() - 86400000); }
  return s;
}
function activitySeries(days, kinds){
  const out = new Array(days).fill(0);
  const start = dayStart(new Date()).getTime() - (days-1)*86400000;
  for (const a of P().activity){
    if (kinds && !kinds.includes(a.kind)) continue;
    const idx = Math.floor((dayStart(a.t).getTime() - start)/86400000);
    if (idx >= 0 && idx < days) out[idx] += a.delta;
  }
  return out;
}

/* ---------------- Overlays ---------------- */
function openModal(id){ $('#modal-backdrop').classList.remove('hidden'); $('#'+id).classList.remove('hidden'); }
function closeOverlays(){
  $('#modal-backdrop').classList.add('hidden');
  ['modal-add','modal-generic'].forEach(id => $('#'+id).classList.add('hidden'));
  $('#drawer').classList.add('hidden');
  $('#search-results').classList.add('hidden');
}
$('#modal-backdrop').addEventListener('click', closeOverlays);
$$('.modal-close').forEach(b => b.addEventListener('click', closeOverlays));

function genericModal(html){
  $('#generic-card').innerHTML = html;
  openModal('modal-generic');
}
function confirmDialog(title, text, onYes, yesLabel='Delete'){
  genericModal(`
    <div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn modal-close" data-gclose aria-label="Close">✕</button></div>
    <p class="muted" style="padding:0 20px 14px">${esc(text)}</p>
    <div class="modal-foot">
      <button class="btn-ghost" data-gclose>Cancel</button>
      <button class="btn-danger" id="g-yes">${esc(yesLabel)}</button>
    </div>`);
  $$('#modal-generic [data-gclose]').forEach(b => b.addEventListener('click', closeOverlays));
  $('#g-yes').addEventListener('click', () => { closeOverlays(); onYes(); });
}

/* ---------------- Entry helpers ---------------- */
function statusLabel(kind, status){
  const f = STATUSES[kind]?.find(s => s[0] === status);
  return f ? f[1] : status;
}
function statusClass(status){
  return 'st-' + ({watching:'watching',reading:'reading',completed:'completed',onhold:'onhold',dropped:'dropped',plan:'plan'}[status] || 'plan');
}
function unitTotal(e){
  if (e.unit === 'pg') return e.totalManual || null;
  return (e.total != null ? e.total : null);
}
function progText(e){
  const t = unitTotal(e);
  return t ? `${e.progress} / ${t} ${UNIT_LABEL[e.unit]}` : `${e.progress} ${UNIT_LABEL[e.unit]} (total ?)`;
}
function progPct(e){
  const t = unitTotal(e);
  return t ? Math.min(100, Math.round(e.progress / t * 100)) : 0;
}
function stars(score){
  if (!score) return '<div class="stars muted">No rating</div>';
  const full = Math.round(score / 2);
  return '<div class="stars">' + '★'.repeat(full) + '☆'.repeat(5 - full) + ` <span style="color:var(--card-muted);font-size:11px">${score}/10</span></div>`;
}
function bumpProgress(id, d){
  const e = entry(id); if (!e) return;
  const t = unitTotal(e);
  const np = Math.max(0, t ? Math.min(t, e.progress + d) : e.progress + d);
  if (np === e.progress) return;
  const delta = np - e.progress;
  e.progress = np; e.updatedAt = Date.now();
  logActivity(id, delta, e.unit === 'pg' ? 'pg' : (e.kind === 'anime' ? 'ep' : 'ch'));
  if (t && np >= t && (e.status === 'watching' || e.status === 'reading')){
    e.status = 'completed';
    toast(`Completed: <b>${esc(e.title)}</b>`, 'ok');
  }
  save(); refreshActive();
}
function refreshActive(){
  const active = $('.nav-item.active')?.dataset.tab || 'home';
  renderers[active] && renderers[active]();
  updateBell();
}

/* ---------------- Canvas chart helpers ---------------- */
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r){
    r = Math.min(r, w/2, h/2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}
function fitCanvas(cv, h=120){
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth || cv.parentElement.clientWidth || 300;
  cv.width = w * dpr; cv.height = h * dpr;
  cv.style.height = h + 'px';
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  return {ctx, w, h};
}
function accent(){ return P().settings.accent || '#e8632c'; }
function sparkline(cv, data, color){
  const {ctx, w, h} = fitCanvas(cv, 44);
  if (!data.length || Math.max(...data) === 0){ ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.font = '11px sans-serif'; ctx.fillText('no data yet', 4, h/2); return; }
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const px = i => 4 + i * (w - 8) / Math.max(1, data.length - 1);
  const py = v => h - 6 - (v - min) / Math.max(1, max - min) * (h - 14);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '55'); grad.addColorStop(1, color + '00');
  ctx.beginPath(); ctx.moveTo(px(0), py(data[0]));
  data.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.lineTo(px(data.length-1), h); ctx.lineTo(px(0), h); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath(); ctx.moveTo(px(0), py(data[0]));
  data.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
  // mini bars behind
  ctx.fillStyle = color + '33';
  const bw = (w - 8) / data.length * 0.5;
  data.forEach((v, i) => { const bh = (v / max) * (h - 10); ctx.fillRect(px(i) - bw/2, h - 4 - bh, bw, bh); });
}
function lineChart(cv, series, labels, color){
  const {ctx, w, h} = fitCanvas(cv, 210);
  const padL = 34, padB = 22, padT = 12;
  const max = Math.max(...series, 10);
  const px = i => padL + i * (w - padL - 8) / Math.max(1, series.length - 1);
  const py = v => padT + (1 - v / max) * (h - padT - padB);
  ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.fillStyle = '#7a6a56'; ctx.font = '10px sans-serif'; ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g++){
    const v = max * g / 4, y = py(v);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - 4, y); ctx.stroke();
    ctx.fillText(Math.round(v) + '', 4, y + 3);
  }
  labels.forEach((l, i) => { if (i % Math.ceil(labels.length/6) === 0) ctx.fillText(l, px(i) - 8, h - 6); });
  const grad = ctx.createLinearGradient(0, padT, 0, h - padB);
  grad.addColorStop(0, color + '44'); grad.addColorStop(1, color + '05');
  ctx.beginPath(); ctx.moveTo(px(0), py(series[0]));
  series.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.lineTo(px(series.length-1), h - padB); ctx.lineTo(px(0), h - padB); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath(); ctx.moveTo(px(0), py(series[0]));
  series.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
  // peak marker
  const mi = series.indexOf(max);
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px(mi), py(max), 4.5, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
  const lbl = max + ' ' + (labels._unit || '');
  const tw = ctx.measureText(lbl).width;
  ctx.fillStyle = color;
  const bx = Math.min(Math.max(px(mi) - tw/2 - 6, padL), w - tw - 12);
  ctx.beginPath(); ctx.roundRect(bx, py(max) - 34, tw + 12, 20, 8); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(lbl, bx + 6, py(max) - 20);
}
function barChart(cv, data, labels, color){
  const {ctx, w, h} = fitCanvas(cv, 210);
  const padL = 30, padB = 22;
  const max = Math.max(...data, 1);
  const n = data.length, slot = (w - padL - 8) / n, bw = Math.min(26, slot * 0.55);
  ctx.fillStyle = '#7a6a56'; ctx.font = '10px sans-serif';
  data.forEach((v, i) => {
    const bh = (v / max) * (h - padB - 14);
    const x = padL + i * slot + (slot - bw) / 2, y = h - padB - bh;
    const g = ctx.createLinearGradient(0, y, 0, h - padB);
    g.addColorStop(0, color); g.addColorStop(1, color + '55');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 5); ctx.fill();
    if (i % Math.ceil(n/8) === 0){ ctx.fillStyle = '#7a6a56'; ctx.fillText(labels[i], x - 4, h - 6); }
  });
}
function donut(cv, parts, colors, light){
  const {ctx, w, h} = fitCanvas(cv, 210);
  const total = parts.reduce((a, b) => a + b.value, 0) || 1;
  const cx = w/2 - 40, cy = h/2, r = Math.min(w, h)/2 - 18, ir = r * 0.62;
  let a0 = -Math.PI/2;
  parts.forEach((p, i) => {
    const a1 = a0 + (p.value / total) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.arc(cx, cy, ir, a1, a0, true); ctx.closePath();
    ctx.fillStyle = colors[i % colors.length]; ctx.fill();
    a0 = a1;
  });
  ctx.fillStyle = light ? '#f4ecdd' : '#241b12'; ctx.beginPath(); ctx.arc(cx, cy, ir - 2, 0, 7); ctx.fill();
  ctx.fillStyle = light ? '#2a1f14' : '#f3e9db'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 2); ctx.font = '10px sans-serif'; ctx.fillStyle = '#7a6a56'; ctx.fillText('total', cx, cy + 16);
  ctx.textAlign = 'left'; ctx.font = '11px sans-serif';
  const leg = light ? '#2a1f14' : '#e8dcc8';
  parts.forEach((p, i) => {
    const y = 22 + i * 20;
    ctx.fillStyle = colors[i % colors.length]; ctx.fillRect(w - 118, y - 9, 10, 10);
    ctx.fillStyle = leg; ctx.fillText(`${p.label} (${p.value})`, w - 102, y);
  });
}
function heatmap(el, weeks){
  el.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'heatmap';
  const max = Math.max(...weeks.flat(), 1);
  const ac = accent();
  weeks.forEach(week => week.forEach(v => {
    const c = document.createElement('div');
    c.className = 'hm-cell';
    const t = v / max;
    c.style.background = v ? ac : 'rgba(255,255,255,.07)';
    c.style.opacity = v ? (0.25 + 0.75 * t) : 1;
    c.title = v + ' activity';
    wrap.appendChild(c);
  }));
  el.appendChild(wrap);
}

/* ---------------- Navigation ---------------- */
const renderers = {};
let activeTab = 'home';
function navigate(tab){
  activeTab = tab;
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  $$('.tab').forEach(s => s.classList.toggle('active', s.id === 'tab-' + tab));
  $('#content').scrollTop = 0;
  renderers[tab] && renderers[tab]();
}
$$('.nav-item').forEach(b => {
  b.querySelector('.nav-ico').innerHTML = ICONS[b.dataset.tab] || ICONS.home;
  b.addEventListener('click', () => navigate(b.dataset.tab));
});

/* ---------------- Header ---------------- */
function partOfDay(){
  const h = new Date().getHours();
  return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
}
function renderHeader(){
  const name = P().settings.displayName || P().name || 'there';
  $('#greeting').textContent = `Good ${partOfDay()}, ${name}`;
  $('#greeting-sub').textContent = "Let's track something today";
  const av = $('#profile-avatar');
  av.textContent = (name[0] || 'P').toUpperCase();
  $('#profile-name').textContent = P().name;
}
let airingCache = {t:0, events:[]};
async function getAiring(days=30){
  const now = Date.now();
  if (now - airingCache.t < 3600*1000 && airingCache.events.length) return airingCache.events;
  const ids = entries().filter(e => e.kind === 'anime').map(e => e.anilistId);
  if (!ids.length) { airingCache = {t:now, events:[]}; return []; }
  try {
    const evs = await alAiring(ids, days);
    airingCache = {t:now, events: evs};
  } catch(e){ /* keep stale/empty, degrade gracefully */ }
  return airingCache.events;
}
async function updateBell(){
  $('#bell').onclick = () => navigate('calendar');
  try {
    const evs = await getAiring(30);
    const tk = todayKey();
    const todays = evs.filter(e => dayStart(e.airingAt*1000).toISOString() === tk);
    const bell = $('#bell');
    const c = $('#bell-count');
    if (todays.length){ c.textContent = todays.length; c.classList.remove('hidden'); bell.title = todays.length + ' episode(s) airing today'; }
    else { c.classList.add('hidden'); bell.title = "Today's releases"; }
  } catch(e){}
}

/* ---------------- Global search ---------------- */
const doGlobalSearch = debounce(() => {
  const q = $('#global-search').value.trim().toLowerCase();
  const box = $('#search-results');
  if (!q){ box.classList.add('hidden'); return; }
  const hits = entries().filter(e => e.title.toLowerCase().includes(q)).slice(0, 8);
  if (!hits.length){ box.innerHTML = '<div class="sr-item muted" style="cursor:default">No matches in your library</div>'; }
  else box.innerHTML = hits.map(e => `
    <div class="sr-item" data-open="${e.id}">
      <img src="${esc(e.cover)}" alt="" loading="lazy">
      <div><div style="font-weight:700;font-size:13px">${esc(e.title)}</div>
      <div class="sr-kind">${KIND_LABEL[e.kind]} · ${esc(statusLabel(e.kind, e.status))}</div></div>
    </div>`).join('');
  box.classList.remove('hidden');
  box.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => {
    box.classList.add('hidden'); $('#global-search').value = '';
    openDrawer(el.dataset.open);
  }));
}, 180);

/* ---------------- HOME ---------------- */
function dailyQuote(){
  const d = new Date();
  const seed = d.getFullYear()*1000 + Math.floor((d - new Date(d.getFullYear(),0,0))/86400000);
  return QUOTES[seed % QUOTES.length];
}
function continueItems(){
  return entries()
    .filter(e => e.status === 'watching' || e.status === 'reading')
    .sort((a,b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);
}
renderers.home = function(){
  renderHeader();
  const eps = entries().filter(e => e.kind === 'anime').reduce((a,e) => a + e.progress, 0);
  const chs = entries().filter(e => e.kind !== 'anime').reduce((a,e) => a + e.progress, 0);
  const pgs = entries().filter(e => e.unit === 'pg').reduce((a,e) => a + e.progress, 0);
  const streak = streakDays();
  const epSpark = activitySeries(14, ['ep']);
  const chSpark = activitySeries(14, ['ch']);
  const pgSpark = activitySeries(14, ['pg']);
  const q = dailyQuote();
  const cont = continueItems();
  const range = window._homeRange || 'Weekly';
  const days = range === 'Weekly' ? 7 : 30;
  const series = activitySeries(days);
  const labels = Array.from({length:days}, (_,i) => fmtDate(Date.now() - (days-1-i)*86400000));
  labels._unit = 'ep+ch';

  $('#home-view').innerHTML = `
    <div class="stat-row">
      <div class="cream stat-card"><div class="stat-label">Episodes Watched</div>
        <div class="stat-value" style="color:var(--accent)">${eps} <span class="stat-unit">eps</span></div>
        <canvas id="sp-ep"></canvas></div>
      <div class="cream stat-card"><div class="stat-label">Chapters Read</div>
        <div class="stat-value" style="color:#c2457a">${chs} <span class="stat-unit">ch</span></div>
        <canvas id="sp-ch"></canvas></div>
      <div class="cream stat-card"><div class="stat-label">Pages Read</div>
        <div class="stat-value" style="color:#3f8fd6">${pgs} <span class="stat-unit">pg</span></div>
        <canvas id="sp-pg"></canvas></div>
      <div class="cream stat-card"><div class="stat-label">Day Streak</div>
        <div class="stat-value" style="color:#4caf6d">${streak} <span class="stat-unit">days</span></div>
        <div style="position:absolute;right:14px;bottom:12px;color:#4caf6d;opacity:.5">${ICONS.calendar.replace('<svg','<svg width="34" height="34"')}</div></div>
    </div>
    <div class="two-col">
      <div class="cream panel" style="background:var(--card);border:0">
        <h3 style="color:var(--card-ink)">Activity Tracking
          <select id="home-range" class="filter-select" style="background:#fff;color:var(--card-ink);border:1px solid #ddd">
            <option ${range==='Weekly'?'selected':''}>Weekly</option>
            <option ${range==='Monthly'?'selected':''}>Monthly</option>
          </select></h3>
        <canvas id="home-chart"></canvas>
      </div>
      <div class="panel">
        <h3>Today's Airing <span class="muted" style="font-weight:400;font-size:12px" id="home-air-sub"></span></h3>
        <div id="home-airing"><p class="muted">Loading…</p></div>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h3>Continue Watching / Reading <button class="btn-ghost" id="home-viewall" style="padding:6px 14px">View all</button></h3>
      ${cont.length ? `<div class="cont-row" style="margin-top:0">` + cont.map(e => `
        <div class="cream cont-card" data-open="${e.id}">
          <img src="${esc(e.cover)}" alt="" loading="lazy">
          <div class="cc-body">
            <div class="cc-title">${esc(e.title)}</div>
            <div class="cc-sub">${KIND_LABEL[e.kind]} · ${esc(statusLabel(e.kind, e.status))}</div>
            <div class="prog"><i style="width:${progPct(e)}%"></i></div>
            <span class="cc-badge">${progText(e)}</span>
          </div>
        </div>`).join('') + `</div>`
      : `<div class="empty" style="padding:28px"><h3>Nothing in progress</h3><p>Add titles and mark them as Watching / Reading to see them here.</p>
          <button class="btn-primary" id="home-add">Add your first title</button></div>`}
    </div>
    <div class="quote-banner">
      <div class="q-mark">“</div>
      <div><blockquote>${esc(q.t)}</blockquote><cite>— ${esc(q.a)}</cite></div>
    </div>`;

  sparkline($('#sp-ep'), epSpark, '#e8632c');
  sparkline($('#sp-ch'), chSpark, '#c2457a');
  sparkline($('#sp-pg'), pgSpark, '#3f8fd6');
  lineChart($('#home-chart'), series, labels, accent());
  $('#home-range').addEventListener('change', e => { window._homeRange = e.target.value; renderers.home(); });
  $('#home-viewall').addEventListener('click', () => navigate('anime'));
  $('#home-add')?.addEventListener('click', () => openAdd());
  $$('#home-view [data-open]').forEach(el => el.addEventListener('click', () => openDrawer(el.dataset.open)));
  loadHomeAiring();
};
async function loadHomeAiring(){
  const box = $('#home-airing'); if (!box) return;
  try {
    const evs = await getAiring(2);
    const tk = todayKey();
    const todays = evs.filter(e => dayStart(e.airingAt*1000).toISOString() === tk).slice(0, 5);
    $('#home-air-sub') && ($('#home-air-sub').textContent = todays.length ? todays.length + ' today' : '');
    box.innerHTML = todays.length ? todays.map(e => `
      <div class="rel-item" style="margin-bottom:8px">
        <img src="${esc(mediaCover(e.media))}" alt="">
        <div class="ri-body"><div style="font-weight:700">${esc(mediaTitle(e.media))}</div>
        <div class="muted">Ep ${e.episode} · ${fmtTime(e.airingAt*1000)}</div></div>
      </div>`).join('')
      : '<p class="muted">No episodes from your list air in the next 48h.</p>';
  } catch(e){ box.innerHTML = '<p class="muted">Could not load airing data (offline?).</p>'; }
}

/* ---------------- MEDIA TABS ---------------- */
const mediaFilter = {anime:{s:'',q:'',sort:'updated'}, manga:{s:'',q:'',sort:'updated'}, ln:{s:'',q:'',sort:'updated'}};

function renderMediaTab(kind){
  renderHeader();
  const f = mediaFilter[kind];
  let list = entries().filter(e => e.kind === kind);
  if (f.s) list = list.filter(e => e.status === f.s);
  if (f.q) list = list.filter(e => e.title.toLowerCase().includes(f.q.toLowerCase()));
  const sorts = {
    title:(a,b)=>a.title.localeCompare(b.title),
    rating:(a,b)=>(b.score||0)-(a.score||0),
    progress:(a,b)=>progPct(b)-progPct(a),
    updated:(a,b)=>b.updatedAt-a.updatedAt
  };
  list.sort(sorts[f.sort] || sorts.updated);
  const statusOpts = STATUSES[kind].map(([v,l]) => `<option value="${v}" ${f.s===v?'selected':''}>${l}</option>`).join('');

  $(`#media-${kind}`).innerHTML = `
    <div class="toolbar">
      <input type="text" id="mf-q-${kind}" placeholder="Search ${KIND_LABEL[kind]}…" value="${esc(f.q)}">
      <select id="mf-s-${kind}"><option value="">All statuses</option>${statusOpts}</select>
      <select id="mf-sort-${kind}">
        <option value="updated" ${f.sort==='updated'?'selected':''}>Recently updated</option>
        <option value="title" ${f.sort==='title'?'selected':''}>Title A–Z</option>
        <option value="rating" ${f.sort==='rating'?'selected':''}>Highest rated</option>
        <option value="progress" ${f.sort==='progress'?'selected':''}>Most progress</option>
      </select>
      <button class="btn-primary" id="mf-add-${kind}">+ Add ${KIND_LABEL[kind]}</button>
    </div>
    ${list.length ? `<div class="media-grid">` + list.map(e => `
      <div class="entry-card" data-open="${e.id}">
        <img class="ec-cover" src="${esc(e.cover)}" alt="" loading="lazy">
        <div class="ec-body">
          <div class="ec-title" title="${esc(e.title)}">${esc(e.title)}</div>
          <span class="status-pill ${statusClass(e.status)}">${esc(statusLabel(e.kind, e.status))}</span>
          <div class="ec-prog-row"><div class="prog dark"><i style="width:${progPct(e)}%"></i></div>
            <span>${progText(e)}</span></div>
          ${stars(e.score)}
          <div class="stepper">
            <button data-step="-1" data-id="${e.id}" title="Decrease">−</button>
            <button data-step="1" data-id="${e.id}" title="Increase">+</button>
          </div>
        </div>
      </div>`).join('') + `</div>`
    : `<div class="empty panel"><h3>No ${KIND_LABEL[kind].toLowerCase()} yet</h3>
        <p>Search AniList to add real titles with verified episode counts.</p>
        <button class="btn-primary" data-addkind="${kind}">Add your first ${KIND_LABEL[kind].toLowerCase()}</button></div>`}`;

  $(`#mf-q-${kind}`).addEventListener('input', debounce(ev => { f.q = ev.target.value; renderMediaTab(kind); const i = $(`#mf-q-${kind}`); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 300));
  $(`#mf-s-${kind}`).addEventListener('change', ev => { f.s = ev.target.value; renderMediaTab(kind); });
  $(`#mf-sort-${kind}`).addEventListener('change', ev => { f.sort = ev.target.value; renderMediaTab(kind); });
  $(`#mf-add-${kind}`)?.addEventListener('click', () => openAdd(kind));
  $(`#media-${kind} [data-addkind]`)?.addEventListener('click', ev => openAdd(ev.target.dataset.addkind));
  $$(`#media-${kind} [data-step]`).forEach(b => b.addEventListener('click', ev => {
    ev.stopPropagation(); bumpProgress(b.dataset.id, parseInt(b.dataset.step, 10));
  }));
  $$(`#media-${kind} [data-open]`).forEach(el => el.addEventListener('click', () => openDrawer(el.dataset.open)));
}
renderers.anime = () => renderMediaTab('anime');
renderers.manga = () => renderMediaTab('manga');
renderers.ln = () => renderMediaTab('ln');

/* ---------------- DETAIL DRAWER ---------------- */
let drawerId = null;
function openDrawer(id){
  const e = entry(id); if (!e) return;
  drawerId = id;
  renderDrawer();
  $('#drawer').classList.remove('hidden');
}
async function relEdges(e){
  try {
    const m = await alMedia(e.anilistId);
    const edges = (m.relations?.edges || []).filter(x => x.node && x.node.id !== e.anilistId);
    return edges.map(x => ({
      id: x.node.id, mediaType: x.node.type, format: x.node.format,
      title: mediaTitle(x.node), cover: mediaCover(x.node),
      relation: x.relationType.replace(/_/g,' ').toLowerCase(),
      total: x.node.type === 'ANIME' ? x.node.episodes : (x.node.chapters || x.node.volumes)
    }));
  } catch(err){ return null; }
}
function kindOfMedia(mediaType, format){
  if (mediaType === 'ANIME') return 'anime';
  return format === 'NOVEL' ? 'ln' : 'manga';
}
function renderDrawer(){
  const e = entry(drawerId); if (!e) return closeOverlays();
  const card = $('#drawer-card');
  const general = P().links.filter(l => l.general);
  const statusOpts = STATUSES[e.kind].map(([v,l]) => `<option value="${v}" ${e.status===v?'selected':''}>${l}</option>`).join('');
  const unitOpts = ['ep','ch','vol','pg'].map(u => `<option value="${u}" ${e.unit===u?'selected':''}>${UNIT_NAME[u]}</option>`).join('');

  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="status-pill ${statusClass(e.status)}" style="margin:0">${esc(statusLabel(e.kind, e.status))} · ${KIND_LABEL[e.kind]}</span>
      <button class="icon-btn" id="dr-close" aria-label="Close">✕</button>
    </div>
    <div class="drawer-hero">
      <img src="${esc(e.cover)}" alt="">
      <div><h2>${esc(e.title)}</h2>
        <div class="muted" style="margin:6px 0">${(e.genres||[]).slice(0,4).join(' · ')}</div>
        ${stars(e.score)}
        <div class="muted" style="margin-top:6px">AniList ID ${e.anilistId}</div>
      </div>
    </div>
    <div class="field"><label>Status</label>
      <select id="dr-status">${statusOpts}</select></div>
    <div class="field"><label>Progress</label>
      <div class="prog-stepper">
        <button id="dr-dec">−</button>
        <input type="number" id="dr-prog" value="${e.progress}" min="0">
        <button id="dr-inc">+</button>
        <span class="muted">/ ${unitTotal(e) ?? '?'}</span>
        <select id="dr-unit" style="width:auto">${unitOpts}</select>
      </div>
      <div style="margin-top:8px" class="prog dark"><i style="width:${progPct(e)}%"></i></div>
      <div style="margin-top:6px"><label style="margin-bottom:4px">Total (auto from AniList — edit to override)</label>
      <input type="number" id="dr-total" value="${e.total ?? ''}" placeholder="?" min="0"></div>
    </div>
    <div class="field"><label>Score (0–10)</label>
      <input type="number" id="dr-score" min="0" max="10" value="${e.score || ''}" placeholder="Unrated"></div>
    <div class="field"><label>Notes</label>
      <textarea id="dr-notes" placeholder="Thoughts, where you left off…">${esc(e.notes || '')}</textarea></div>
    <div class="field"><label>Entry links</label>
      <div id="dr-links">${e.links.map((l,i) => `
        <div class="link-row">
          <input type="text" value="${esc(l.name)}" data-ln="${i}" placeholder="Name">
          <input type="text" value="${esc(l.url)}" data-lu="${i}" placeholder="https://…">
          <button class="btn-ghost" data-ldel="${i}" style="padding:8px 12px">✕</button>
        </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap">
        <button class="btn-ghost" id="dr-addlink">+ Add link</button>
        ${general.map(g => `<a class="chip" href="${esc(g.url)}" target="_blank" rel="noopener" title="${esc(g.url)}">${esc(g.name)}</a>`).join('')}
      </div>
      <div class="muted" style="margin-top:6px">Chips are your general sites from the Links tab.</div>
    </div>
    <div class="field"><label>Related media (AniList)</label>
      <div id="dr-rel" class="rel-list"><p class="muted">Loading relations…</p></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:18px">
      <button class="btn-danger" id="dr-delete" style="flex:1">Delete entry</button>
    </div>`;

  $('#dr-close').addEventListener('click', closeOverlays);
  $('#dr-status').addEventListener('change', ev => { e.status = ev.target.value; e.updatedAt = Date.now(); save(); refreshActive(); renderDrawer(); });
  const commitProg = () => {
    const v = Math.max(0, parseInt($('#dr-prog').value || '0', 10));
    const t = unitTotal(e);
    const np = t ? Math.min(t, v) : v;
    const d = np - e.progress;
    e.progress = np; e.updatedAt = Date.now();
    if (d) logActivity(e.id, d, e.unit === 'pg' ? 'pg' : (e.kind === 'anime' ? 'ep' : 'ch'));
    save(); refreshActive(); renderDrawer();
  };
  $('#dr-dec').addEventListener('click', () => { $('#dr-prog').value = Math.max(0, (+$('#dr-prog').value || 0) - 1); commitProg(); });
  $('#dr-inc').addEventListener('click', () => { $('#dr-prog').value = (+$('#dr-prog').value || 0) + 1; commitProg(); });
  $('#dr-prog').addEventListener('change', commitProg);
  $('#dr-unit').addEventListener('change', ev => { e.unit = ev.target.value; e.updatedAt = Date.now(); save(); refreshActive(); renderDrawer(); });
  $('#dr-total').addEventListener('change', ev => {
    const v = ev.target.value === '' ? null : Math.max(0, parseInt(ev.target.value, 10));
    if (e.unit === 'pg') e.totalManual = v; else e.total = v;
    save(); refreshActive(); renderDrawer();
  });
  $('#dr-score').addEventListener('change', ev => {
    let v = parseFloat(ev.target.value);
    e.score = (isNaN(v) ? 0 : Math.max(0, Math.min(10, v))); e.updatedAt = Date.now(); save(); refreshActive(); renderDrawer();
  });
  $('#dr-notes').addEventListener('input', debounce(ev => { e.notes = ev.target.value; e.updatedAt = Date.now(); save(); }, 600));
  const reRenderLinks = () => renderDrawer();
  $('#dr-addlink').addEventListener('click', () => { e.links.push({name:'', url:''}); save(); reRenderLinks(); });
  $$('#dr-links [data-ln]').forEach(i => i.addEventListener('input', debounce(ev => { e.links[+ev.target.dataset.ln].name = ev.target.value; save(); }, 500)));
  $$('#dr-links [data-lu]').forEach(i => i.addEventListener('input', debounce(ev => { e.links[+ev.target.dataset.lu].url = ev.target.value; save(); }, 500)));
  $$('#dr-links [data-ldel]').forEach(b => b.addEventListener('click', () => { e.links.splice(+b.dataset.ldel, 1); save(); reRenderLinks(); }));
  $('#dr-delete').addEventListener('click', () => confirmDialog('Delete entry?', `"${e.title}" will be removed from your library.`, () => {
    delete P().entries[e.id]; save(); toast('Entry deleted'); navigate(activeTab);
  }));
  loadDrawerRelations(e);
}
async function loadDrawerRelations(e){
  const box = $('#dr-rel'); if (!box) return;
  const edges = await relEdges(e);
  if (!box.isConnected) return;
  if (edges === null){ box.innerHTML = '<p class="muted">Could not load relations (offline?).</p>'; return; }
  if (!edges.length){ box.innerHTML = '<p class="muted">No related media found on AniList.</p>'; return; }
  const trackedIds = new Set(entries().map(x => x.anilistId));
  box.innerHTML = edges.slice(0, 12).map((r, i) => {
    const tracked = trackedIds.has(r.id);
    const k = kindOfMedia(r.mediaType, r.format);
    return `<div class="rel-item">
      <img src="${esc(r.cover)}" alt="" loading="lazy">
      <div class="ri-body"><div class="ri-type">${esc(r.relation)} · ${KIND_LABEL[k]}</div>
        <div style="font-weight:700">${esc(r.title)}</div></div>
      ${tracked ? '<span class="muted" style="font-size:11px">tracked</span>'
        : `<button class="btn-ghost" data-reladd="${i}" style="padding:6px 12px;font-size:12px">Add</button>`}
    </div>`;
  }).join('');
  box._edges = edges;
  box.querySelectorAll('[data-reladd]').forEach(b => b.addEventListener('click', async () => {
    const r = box._edges[+b.dataset.reladd];
    await addFromAniList(r.id, kindOfMedia(r.mediaType, r.format));
    loadDrawerRelations(e);
  }));
}

/* ---------------- ADD FLOW ---------------- */
let addState = {kindFilter:'all', defaultKind:null, results:[], selected:new Map(), related:[]};
const ADD_FILTERS = [['all','All'],['anime','Anime'],['manga','Manga'],['ln','Light Novels']];
const MT_OF_FILTER = {anime:'ANIME', manga:'MANGA', ln:'MANGA'};

function openAdd(kindDefault){
  addState = {kindFilter: kindDefault || 'all', defaultKind: kindDefault || null, results:[], selected:new Map(), related:[]};
  $('#add-title').textContent = kindDefault ? `Add ${KIND_LABEL[kindDefault]}` : 'Add to library';
  $('#add-step-search').classList.remove('hidden');
  $('#add-step-related').classList.add('hidden');
  $('#add-search').value = '';
  renderAddKinds(); renderAddResults([]);
  openModal('modal-add');
  setTimeout(() => $('#add-search').focus(), 60);
}
function renderAddKinds(){
  $('#add-kind-row').innerHTML = ADD_FILTERS.map(([v,l]) =>
    `<button class="kind-chip ${addState.kindFilter===v?'active':''}" data-kf="${v}">${l}</button>`).join('');
  $$('#add-kind-row [data-kf]').forEach(b => b.addEventListener('click', () => {
    addState.kindFilter = b.dataset.kf; addState.selected.clear();
    renderAddKinds(); runAddSearch();
  }));
}
const runAddSearch = debounce(async () => {
  const q = $('#add-search').value.trim();
  if (q.length < 2){ renderAddResults([]); return; }
  const box = $('#add-results');
  box.innerHTML = '<p class="muted">Searching AniList…</p>';
  try {
    let media = [];
    const filters = addState.kindFilter === 'all' ? ['anime','manga'] : [addState.kindFilter];
    for (const f of filters){
      const r = await alSearch(q, MT_OF_FILTER[f]);
      media.push(...r.map(m => ({m, f})));
    }
    if (addState.kindFilter === 'ln') media = media.filter(x => x.m.format === 'NOVEL');
    // dedupe by id
    const seen = new Set(); media = media.filter(x => !seen.has(x.m.id) && seen.add(x.m.id));
    addState.results = media.map(({m, f}) => ({
      media: m,
      kind: m.type === 'ANIME' ? 'anime' : (m.format === 'NOVEL' ? 'ln' : 'manga'),
      filter: f
    }));
    renderAddResults(addState.results);
  } catch(e){
    box.innerHTML = `<p class="muted">Search failed: ${esc(e.message)}. Check your connection and retry.</p>`;
  }
}, 350);
function addResultMeta(m){
  const bits = [m.format ? m.format.replace(/_/g,' ') : m.type];
  if (m.episodes) bits.push(m.episodes + ' ep');
  if (m.chapters) bits.push(m.chapters + ' ch');
  if (m.averageScore) bits.push(m.averageScore + '%');
  return bits.join(' · ');
}
function renderAddResults(results){
  const box = $('#add-results');
  if (!results.length){ box.innerHTML = '<p class="muted">Type at least 2 characters to search AniList.</p>'; updateAddFoot(); return; }
  const tracked = new Set(entries().map(e => e.anilistId + ':' + e.kind));
  box.innerHTML = results.map((r, i) => {
    const key = r.media.id + ':' + r.kind;
    const sel = addState.selected.has(r.media.id);
    const already = tracked.has(r.media.id + ':' + r.kind);
    return `<div class="add-item ${sel?'selected':''}" data-ai="${i}" ${already?'style="opacity:.55"':''}>
      <span class="add-check">✓</span>
      <img src="${esc(mediaCover(r.media))}" alt="" loading="lazy">
      <div class="ai-body">
        <div class="ai-title">${esc(mediaTitle(r.media))}</div>
        <div class="ai-meta">${esc(addResultMeta(r.media))}${already ? ' · already in library' : ''}</div>
      </div>
      <select class="ai-type" data-ak="${i}" title="Media type">
        ${['anime','manga','ln'].map(k => `<option value="${k}" ${r.kind===k?'selected':''}>${KIND_LABEL[k]}</option>`).join('')}
      </select>
    </div>`;
  }).join('');
  box.querySelectorAll('[data-ai]').forEach(el => el.addEventListener('click', ev => {
    if (ev.target.closest('.ai-type')) return;
    const r = addState.results[+el.dataset.ai];
    if (addState.selected.has(r.media.id)) addState.selected.delete(r.media.id);
    else addState.selected.set(r.media.id, r);
    el.classList.toggle('selected');
    updateAddFoot();
  }));
  box.querySelectorAll('[data-ak]').forEach(sel => sel.addEventListener('change', ev => {
    ev.stopPropagation();
    const r = addState.results[+sel.dataset.ak];
    r.kind = sel.value;
  }));
  updateAddFoot();
}
function updateAddFoot(){
  const n = addState.selected.size;
  $('#add-count').textContent = n ? `${n} selected` : '';
  $('#add-selected').disabled = !n;
  $('#add-selected').textContent = n ? `Add ${n} selected` : 'Add selected';
}
async function addFromAniList(anilistId, kind){
  const dup = entries().find(e => e.anilistId === anilistId && e.kind === kind);
  if (dup){ toast(`<b>${esc(dup.title)}</b> is already in your library`, 'err'); return null; }
  const m = await alMedia(anilistId);
  const title = mediaTitle(m);
  let unit, total;
  if (kind === 'anime'){ unit = 'ep'; total = m.episodes || null; }
  else if (m.chapters){ unit = 'ch'; total = m.chapters; }
  else if (m.volumes){ unit = 'vol'; total = m.volumes; }
  else { unit = 'ch'; total = null; }
  const e = {
    id: `${kind}-${anilistId}`, anilistId, kind, mediaType: m.type,
    title, cover: m.coverImage?.extraLarge || mediaCover(m),
    total, totalManual: null, progress: 0, unit,
    status: 'plan', score: 0, notes: '', links: [],
    genres: m.genres || [], addedAt: Date.now(), updatedAt: Date.now()
  };
  P().entries[e.id] = e;
  save();
  return e;
}
async function finalizeAdd(){
  const sel = Array.from(addState.selected.values());
  $('#add-selected').disabled = true;
  $('#add-selected').textContent = 'Adding…';
  const added = [];
  for (const r of sel){
    try { const e = await addFromAniList(r.media.id, r.kind); if (e) added.push(e); }
    catch(e){ toast('Failed to add: ' + esc(e.message), 'err'); }
  }
  toast(added.length ? `Added ${added.length} title${added.length>1?'s':''}` : 'Nothing added', added.length ? 'ok' : 'err');
  // related-media follow-up
  const relMap = new Map();
  for (const e of added){
    try {
      const edges = await relEdges(e);
      (edges || []).forEach(x => {
        if (x.relation.includes('source') || x.relation.includes('adaptation') || x.relation.includes('prequel') || x.relation.includes('sequel')){
          if (!entries().some(y => y.anilistId === x.id) && !relMap.has(x.id)) relMap.set(x.id, x);
        }
      });
    } catch(e){}
  }
  const related = Array.from(relMap.values()).slice(0, 12);
  if (related.length){
    addState.related = related;
    $('#add-step-search').classList.add('hidden');
    $('#add-step-related').classList.remove('hidden');
    $('#related-list').innerHTML = related.map((r, i) => `
      <div class="add-item selected" data-ri="${i}">
        <span class="add-check">✓</span>
        <img src="${esc(r.cover)}" alt="" loading="lazy">
        <div class="ai-body"><div class="ai-title">${esc(r.title)}</div>
        <div class="ai-meta">${esc(r.relation)} · ${KIND_LABEL[kindOfMedia(r.mediaType, r.format)]}${r.total ? ' · ' + r.total + (r.mediaType==='ANIME'?' ep':' ch') : ''}</div></div>
      </div>`).join('');
    const chosen = new Set(related.map((_, i) => i));
    const paint = () => $('#related-list').querySelectorAll('[data-ri]').forEach(el =>
      el.classList.toggle('selected', chosen.has(+el.dataset.ri)));
    $('#related-list').querySelectorAll('[data-ri]').forEach(el => el.addEventListener('click', () => {
      const i = +el.dataset.ri;
      chosen.has(i) ? chosen.delete(i) : chosen.add(i); paint();
    }));
    $('#related-add').onclick = async () => {
      $('#related-add').disabled = true; $('#related-add').textContent = 'Adding…';
      let n = 0;
      for (const i of chosen){
        const r = related[i];
        try { const e = await addFromAniList(r.id, kindOfMedia(r.mediaType, r.format)); if (e) n++; } catch(e){}
      }
      closeOverlays(); refreshActive();
      toast(n ? `Added ${n} related title${n>1?'s':''}` : 'Nothing added', n ? 'ok' : 'err');
    };
    $('#related-skip').onclick = () => { closeOverlays(); refreshActive(); };
  } else {
    closeOverlays(); refreshActive();
  }
}
$('#fab-add').addEventListener('click', () => {
  const map = {anime:'anime', manga:'manga', ln:'ln'};
  openAdd(map[activeTab] || null);
});
$('#add-search').addEventListener('input', runAddSearch);
$('#add-selected').addEventListener('click', finalizeAdd);

/* ---------------- FRANCHISE TAB ---------------- */
let franCache = {t:0, groups:null};
async function buildFranchises(force){
  const now = Date.now();
  if (!force && franCache.groups && now - franCache.t < 3600*1000) return franCache.groups;
  const list = entries();
  const rels = {}; // anilistId -> edges
  for (const e of list){
    rels[e.anilistId] = (await relEdges(e)) || [];
  }
  // union-find over anilist ids
  const parent = {};
  const find = x => { parent[x] = parent[x] || x; return parent[x] === x ? x : (parent[x] = find(parent[x])); };
  const union = (a,b) => { parent[find(a)] = find(b); };
  const trackedIds = new Set(list.map(e => e.anilistId));
  list.forEach(e => find(e.anilistId));
  for (const [aid, edges] of Object.entries(rels)){
    for (const r of edges){
      if (r.mediaType !== 'ANIME' && r.mediaType !== 'MANGA') continue;
      find(r.id); union(+aid, r.id);
    }
  }
  const comps = {};
  for (const id of Object.keys(parent)){
    const root = find(id);
    (comps[root] = comps[root] || []).push(+id);
  }
  const groups = [];
  for (const ids of Object.values(comps)){
    const tracked = ids.filter(id => trackedIds.has(id));
    if (tracked.length < 1) continue;
    // collect missing from relations of tracked members
    const missing = new Map();
    for (const tid of tracked){
      for (const r of (rels[tid] || [])){
        if (!trackedIds.has(r.id) && !missing.has(r.id)) missing.set(r.id, r);
      }
    }
    groups.push({ids, tracked, missing: Array.from(missing.values()).slice(0,6), rels});
  }
  groups.sort((a,b) => b.tracked.length - a.tracked.length);
  franCache = {t:now, groups};
  return groups;
}
renderers.franchise = async function(){
  renderHeader();
  const box = $('#franchise-view');
  box.innerHTML = '<div class="empty panel"><h3>Linking your library…</h3><p>Fetching adaptation & source relations from AniList.</p></div>';
  let groups;
  try { groups = await buildFranchises(); }
  catch(e){ box.innerHTML = `<div class="empty panel"><h3>Couldn't load relations</h3><p>${esc(e.message)}</p></div>`; return; }
  if (!groups.length){
    box.innerHTML = `<div class="empty panel"><h3>No franchises yet</h3><p>Add titles to see anime, manga and light novels from the same source grouped together.</p></div>`;
    return;
  }
  const byId = {}; entries().forEach(e => byId[e.anilistId] = e);
  box.innerHTML = `<div class="fran-grid">` + groups.map((g, gi) => {
    const members = g.tracked.map(id => byId[id]).filter(Boolean);
    if (!members.length) return '';
    const main = members.slice().sort((a,b) => (g.rels[b.anilistId]?.length||0) - (g.rels[a.anilistId]?.length||0))[0];
    let pw = 0, tw = 0;
    members.forEach(e => { const t = unitTotal(e); if (t){ pw += e.progress; tw += t; } else { pw += progPct(e); tw += 100; } });
    const pct = tw ? Math.round(pw/tw*100) : 0;
    const covers = members.slice(0,3).map(e => `<img src="${esc(e.cover)}" alt="">`).join('');
    return `<div class="cream fran-card">
      <div class="fran-head">${covers}<div><h3>${esc(main.title)}</h3>
        <div class="muted">${members.length} tracked ${members.length>1?'titles':'title'} · ${pct}% overall</div></div></div>
      <div class="prog"><i style="width:${pct}%"></i></div>
      <div class="fran-media">${members.map(e => `
        <div class="fran-mrow" data-open="${e.id}" style="cursor:pointer">
          <span class="fm-kind">${KIND_LABEL[e.kind]}</span>
          <span style="flex:0 1 40%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(e.title)}">${esc(e.title)}</span>
          <div class="prog"><i style="width:${progPct(e)}%"></i></div>
          <span class="muted" style="font-size:11px">${progText(e)}</span>
        </div>`).join('')}</div>
      ${g.missing.map((r,i) => `
        <div class="missing"><span><b>${esc(r.title)}</b> <span class="muted">(${esc(r.relation)} · ${KIND_LABEL[kindOfMedia(r.mediaType, r.format)]} — not tracked)</span></span>
        <button class="btn-ghost" data-fadd="${gi}:${i}" style="padding:6px 12px;font-size:12px;flex:0 0 auto">Add</button></div>`).join('')}
    </div>`;
  }).join('') + `</div>`;
  box._groups = groups;
  box.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => openDrawer(el.dataset.open)));
  box.querySelectorAll('[data-fadd]').forEach(b => b.addEventListener('click', async () => {
    const [gi, i] = b.dataset.fadd.split(':').map(Number);
    const r = box._groups[gi].missing[i];
    b.disabled = true;
    const e = await addFromAniList(r.id, kindOfMedia(r.mediaType, r.format));
    if (e){ toast(`Added <b>${esc(e.title)}</b>`, 'ok'); franCache.groups = null; renderers.franchise(); }
    else b.disabled = false;
  }));
};

/* ---------------- SUGGESTIONS TAB ---------------- */
const Q_BROWSE = `query($g:String,$t:MediaType){Page(page:1,perPage:12){media(genre:$g,type:$t,sort:SCORE_DESC,status_in:[RELEASING,FINISHED]){id type format title{romaji english}coverImage{large}episodes chapters averageScore genres}}}`;
let suggState = {seedId:null, genre:'', loading:false};
const GENRES = ['Action','Adventure','Comedy','Drama','Fantasy','Horror','Mystery','Psychological','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller'];
renderers.suggestions = function(){
  renderHeader();
  const box = $('#sugg-view');
  const list = entries().filter(e => e.score >= 7 || ['watching','reading','completed'].includes(e.status)).slice(0, 40);
  box.innerHTML = `
    <div class="panel" style="margin-bottom:16px">
      <h3>Pick a seed</h3>
      <div class="toolbar" style="margin-bottom:10px">
        <select id="sg-seed" style="min-width:240px">
          <option value="">— From your library —</option>
          ${list.map(e => `<option value="${e.anilistId}" ${suggState.seedId==e.anilistId?'selected':''}>${esc(e.title)}</option>`).join('')}
        </select>
        <span class="muted">or</span>
        <div class="chip-row" id="sg-genres">
          ${GENRES.map(g => `<button class="chip" data-g="${g}" style="${suggState.genre===g?'border-color:var(--accent);color:var(--accent)':''}">${g}</button>`).join('')}
        </div>
      </div>
      <p class="muted">Recommendations come from AniList's community recommendation graph.</p>
    </div>
    <div id="sg-results"><div class="empty panel"><h3>Choose a seed to get suggestions</h3><p>Pick a title you love, or a genre to explore.</p></div></div>`;

  $('#sg-seed').addEventListener('change', ev => {
    suggState.seedId = ev.target.value || null; suggState.genre = '';
    if (suggState.seedId) loadSeedRecs();
  });
  box.querySelectorAll('#sg-genres [data-g]').forEach(b => b.addEventListener('click', () => {
    suggState.genre = b.dataset.g; suggState.seedId = null;
    box.querySelectorAll('#sg-genres .chip').forEach(c => c.style.cssText = '');
    b.style.borderColor = 'var(--accent)'; b.style.color = 'var(--accent)';
    $('#sg-seed').value = '';
    loadGenreRecs();
  }));
  if (suggState.seedId) loadSeedRecs();
  else if (suggState.genre) loadGenreRecs();
};
function suggCard(m, why, kind){
  return `<div class="sugg-card">
    <img src="${esc(mediaCover(m))}" alt="" loading="lazy">
    <div class="sc-body">
      <div class="sc-title">${esc(mediaTitle(m))}</div>
      <div class="sc-why">${esc(why)}</div>
      <div class="muted" style="font-size:11.5px;margin-bottom:10px">${m.averageScore ? m.averageScore + '% score' : ''}${m.episodes ? ' · ' + m.episodes + ' ep' : ''}${m.chapters ? ' · ' + m.chapters + ' ch' : ''}</div>
      <button class="btn-primary" data-sgadd="${m.id}:${kind}" style="width:100%;padding:9px">Add</button>
    </div></div>`;
}
function bindSgAdd(box){
  box.querySelectorAll('[data-sgadd]').forEach(b => b.addEventListener('click', async () => {
    const [id, kind] = b.dataset.sgadd.split(':');
    b.disabled = true;
    try { const e = await addFromAniList(+id, kind); if (e) toast(`Added <b>${esc(e.title)}</b>`, 'ok'); }
    catch(e){ toast('Add failed: ' + esc(e.message), 'err'); }
    b.disabled = false;
  }));
}
async function loadSeedRecs(){
  const box = $('#sg-results');
  box.innerHTML = '<div class="empty panel"><p class="muted">Loading recommendations…</p></div>';
  try {
    const m = await alMedia(+suggState.seedId);
    const seedTitle = mediaTitle(m);
    const recs = (m.recommendations?.nodes || []).filter(n => n.mediaRecommendation).slice(0, 12);
    if (!recs.length){ box.innerHTML = '<div class="empty panel"><h3>No recommendations found</h3><p>AniList has no recommendations for this title yet.</p></div>'; return; }
    const tracked = new Set(entries().map(e => e.anilistId));
    box.innerHTML = `<h3 style="margin-bottom:12px">Because you liked <span style="color:var(--accent)">${esc(seedTitle)}</span></h3>
      <div class="sugg-grid">` + recs.filter(r => !tracked.has(r.mediaRecommendation.id)).map(r => {
        const rm = r.mediaRecommendation;
        return suggCard(rm, `Recommended by ${r.rating} AniList user${r.rating>1?'s':''} who liked “${seedTitle}”`, kindOfMedia(rm.type, rm.format));
      }).join('') + `</div>`;
    bindSgAdd(box);
  } catch(e){ box.innerHTML = `<div class="empty panel"><h3>Couldn't load</h3><p>${esc(e.message)}</p></div>`; }
}
async function loadGenreRecs(){
  const box = $('#sg-results');
  box.innerHTML = '<div class="empty panel"><p class="muted">Loading…</p></div>';
  try {
    const [a, mg] = await Promise.all([
      AL(Q_BROWSE, {g:suggState.genre, t:'ANIME'}),
      AL(Q_BROWSE, {g:suggState.genre, t:'MANGA'})
    ]);
    const all = [...a.Page.media, ...mg.Page.media];
    const tracked = new Set(entries().map(e => e.anilistId));
    const fresh = all.filter(m => !tracked.has(m.id)).slice(0, 12);
    box.innerHTML = `<h3 style="margin-bottom:12px">Top ${esc(suggState.genre)} picks</h3>
      <div class="sugg-grid">` + fresh.map(m =>
        suggCard(m, `Highly scored ${suggState.genre.toLowerCase()} title on AniList`, kindOfMedia(m.type, m.format))
      ).join('') + `</div>`;
    bindSgAdd(box);
  } catch(e){ box.innerHTML = `<div class="empty panel"><h3>Couldn't load</h3><p>${esc(e.message)}</p></div>`; }
}

/* ---------------- AI CHAT TAB (local rule-based helper) ---------------- */
const CHAT_CHIPS = ['Recommend something like Frieren', "What's airing this week?", 'What should I avoid?', 'Add Solo Leveling to my anime'];
function chatMsg(who, html){
  const log = $('#chat-log');
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.innerHTML = html;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}
renderers.aichat = function(){
  renderHeader();
  const box = $('#chat-view');
  box.innerHTML = `
    <span class="local-badge">Local helper — rule-based, runs entirely on this device</span>
    <div class="chat-log" id="chat-log"></div>
    <div class="chip-row" id="chat-chips" style="margin-bottom:10px">
      ${CHAT_CHIPS.map(c => `<button class="chip" data-chip="${esc(c)}">${esc(c)}</button>`).join('')}
    </div>
    <div class="chat-input-row">
      <input id="chat-in" type="text" placeholder="Ask for recommendations, airing dates, or say “add X to my anime”…">
      <button class="btn-primary" id="chat-send">Send</button>
    </div>`;
  (P().chat || []).forEach(m => chatMsg(m.who, m.html));
  if (!(P().chat || []).length){
    chatMsg('bot', `<div class="msg-title">Hey, I'm your local tracker helper.</div>
      I can <b>recommend</b> titles from AniList data, tell you <b>what's airing</b>, warn you <b>what to avoid</b> based on your ratings, and <b>add titles</b> to your library.<br>
      <span class="muted">I'm not a real AI model — everything runs on-device with AniList's public data.</span>`);
  }
  const send = () => { const v = $('#chat-in').value.trim(); if (v){ $('#chat-in').value = ''; handleChat(v); } };
  $('#chat-send').addEventListener('click', send);
  $('#chat-in').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  box.querySelectorAll('[data-chip]').forEach(b => b.addEventListener('click', () => handleChat(b.dataset.chip)));
};
function saveChat(who, html){
  P().chat = P().chat || [];
  P().chat.push({who, html});
  if (P().chat.length > 100) P().chat = P().chat.slice(-100);
  save();
}
async function handleChat(text){
  chatMsg('user', esc(text)); saveChat('user', esc(text));
  const t = text.toLowerCase();
  const typing = chatMsg('bot', '<span class="muted">thinking…</span>');
  const reply = html => { typing.innerHTML = html; saveChat('bot', html); bindChatAdds(typing); };
  try {
    if (/\badd\b/.test(t)){
      const title = text.replace(/add/i, '').replace(/to my.*$/i, '').replace(/please/gi, '').trim();
      const kindGuess = /manga/i.test(text) ? 'manga' : /light novel|\bln\b/i.test(text) ? 'ln' : 'anime';
      if (!title){ reply(`Which title should I add? Try “add <i>Frieren</i> to my anime”.`); return; }
      const res = await alSearch(title, MEDIA_TYPE_OF[kindGuess]);
      if (!res.length){ reply(`I couldn't find “${esc(title)}” on AniList. Check the spelling and try again.`); return; }
      const m = res[0];
      const k = m.type === 'ANIME' ? 'anime' : (m.format === 'NOVEL' ? 'ln' : 'manga');
      reply(`<div class="msg-title">Found it — add this?</div>
        <div class="chat-add-row"><img src="${esc(mediaCover(m))}" alt="">
          <div style="flex:1"><b>${esc(mediaTitle(m))}</b><br><span class="muted">${KIND_LABEL[k]}${m.episodes ? ' · ' + m.episodes + ' ep' : ''}${m.chapters ? ' · ' + m.chapters + ' ch' : ''}</span></div>
          <button class="btn-primary" data-chatadd="${m.id}:${k}" style="padding:8px 16px">Add</button></div>`);
      return;
    }
    if (/recommend|suggest|like /.test(t)){
      const likeM = t.match(/(?:like|likes)\s+(.+)/);
      let seedTitle = likeM ? likeM[1].replace(/[?.!]+$/,'').trim() : null;
      let seedMedia = null, seedEntry = null;
      if (seedTitle){
        seedEntry = entries().find(e => e.title.toLowerCase().includes(seedTitle.toLowerCase()));
        if (seedEntry){ const m = await alMedia(seedEntry.anilistId); seedMedia = m; seedTitle = mediaTitle(m); }
        else {
          const res = await alSearch(seedTitle, 'ANIME');
          if (res.length){ seedMedia = await alMedia(res[0].id); seedTitle = mediaTitle(seedMedia); }
        }
      } else {
        const top = entries().filter(e => e.score >= 8).sort((a,b) => b.score - a.score)[0];
        if (top){ seedMedia = await alMedia(top.anilistId); seedTitle = mediaTitle(seedMedia); }
      }
      if (!seedMedia){ reply(`Tell me a title you like — e.g. “recommend something like <i>Frieren</i>”.`); return; }
      const recs = (seedMedia.recommendations?.nodes || []).filter(n => n.mediaRecommendation).slice(0, 4);
      if (!recs.length){ reply(`AniList has no recommendations for “${esc(seedTitle)}” yet.`); return; }
      reply(`<div class="msg-title">Because you liked “${esc(seedTitle)}”</div>` +
        recs.map(r => { const rm = r.mediaRecommendation; const k = kindOfMedia(rm.type, rm.format);
          return `<div class="chat-add-row"><img src="${esc(mediaCover(rm))}" alt="">
            <div style="flex:1"><b>${esc(mediaTitle(rm))}</b><br><span class="muted">${rm.averageScore ? rm.averageScore + '% · ' : ''}${r.rating} user recs</span></div>
            <button class="btn-primary" data-chatadd="${rm.id}:${k}" style="padding:8px 14px">Add</button></div>`; }).join(''));
      return;
    }
    if (/airing|coming out|releases|new episodes|this week/.test(t)){
      const evs = await getAiring(7);
      if (!evs.length){ reply(`Nothing from your anime list airs in the next 7 days.`); return; }
      const byDay = {};
      evs.forEach(e => { const k = dayStart(e.airingAt*1000).toISOString(); (byDay[k] = byDay[k] || []).push(e); });
      reply(`<div class="msg-title">Airing this week</div>` + Object.keys(byDay).sort().slice(0,7).map(k =>
        `<div style="margin:8px 0"><b>${fmtDate(parseDayKey(k).getTime())}</b><br>` +
        byDay[k].slice(0,4).map(e => `· ${esc(mediaTitle(e.media))} — ep ${e.episode} at ${fmtTime(e.airingAt*1000)}`).join('<br>') + `</div>`
      ).join(''));
      return;
    }
    if (/avoid|bad|worst|skip/.test(t)){
      const rated = entries().filter(e => e.score > 0).sort((a,b) => a.score - b.score).slice(0, 3);
      const dropped = entries().filter(e => e.status === 'dropped').slice(0, 3);
      let html = `<div class="msg-title">What to avoid</div>`;
      if (rated.length) html += `Your lowest ratings:<br>` + rated.map(e => `· <b>${esc(e.title)}</b> — ${e.score}/10`).join('<br>') + '<br><br>';
      if (dropped.length) html += `You dropped:<br>` + dropped.map(e => `· <b>${esc(e.title)}</b>`).join('<br>') + '<br><br>';
      if (!rated.length && !dropped.length) html += `Your library has no low scores or drops yet — rate titles as you go and I'll warn you here.`;
      else html += `<span class="muted">Based on your own scores and drops. New titles with &lt;60% on AniList are also worth skipping.</span>`;
      reply(html);
      return;
    }
    if (/statistic|stats|how much|progress/.test(t)){
      const n = entries().length;
      const eps = entries().filter(e => e.kind === 'anime').reduce((a,e) => a + e.progress, 0);
      reply(`You've tracked <b>${n}</b> titles and watched <b>${eps}</b> episodes. Open the Statistics tab for the full breakdown.`);
      return;
    }
    if (/hello|hi\b|hey/.test(t)){ reply(`Hey! Ask me for a recommendation, what's airing, or tell me to add a title.`); return; }
    reply(`I can help with:<br>· <b>“recommend something like X”</b><br>· <b>“what's airing this week?”</b><br>· <b>“what should I avoid?”</b><br>· <b>“add X to my anime/manga”</b>`);
  } catch(e){ reply(`Something went wrong: ${esc(e.message)}`); }
}
function bindChatAdds(scope){
  scope.querySelectorAll('[data-chatadd]').forEach(b => b.addEventListener('click', async () => {
    const [id, kind] = b.dataset.chatadd.split(':');
    b.disabled = true;
    try { const e = await addFromAniList(+id, kind); if (e){ toast(`Added <b>${esc(e.title)}</b>`, 'ok'); b.textContent = 'Added'; } }
    catch(e){ toast('Add failed: ' + esc(e.message), 'err'); b.disabled = false; }
  }));
}

/* ---------------- CALENDAR TAB ---------------- */
const calState = {y: new Date().getFullYear(), m: new Date().getMonth(), layers:{rel:true, sch:true}, sel:null};
function schedOccurrencesInMonth(ev, y, m){
  const out = [];
  const [ey, em, ed] = ev.date.split('-').map(Number);
  if (ev.repeat !== 'weekly'){
    if (ey === y && em - 1 === m) out.push(new Date(y, m, ed));
    return out;
  }
  const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
  const wd = new Date(ey, em - 1, ed).getDay();
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)){
    if (d.getDay() === wd && d >= new Date(ey, em - 1, ed)) out.push(new Date(d));
  }
  return out;
}
function icsEscape(s){ return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n'); }
function icsDate(d, time){
  const p = n => String(n).padStart(2, '0');
  if (time){
    const [hh, mm] = time.split(':');
    return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(hh)}${p(mm)}00`;
  }
  const nx = new Date(d); nx.setDate(nx.getDate() + 1);
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}`;
}
function eventsToICS(evts, calName){
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AniTrack//EN','X-WR-CALNAME:' + icsEscape(calName)];
  evts.forEach((e, i) => {
    lines.push('BEGIN:VEVENT', 'UID:anitrack-' + Date.now() + '-' + i + '@local',
      'DTSTAMP:' + icsDate(new Date()).replace(/[-:]/g,''),
      e.time ? 'DTSTART:' + icsDate(e.date, e.time) : 'DTSTART;VALUE=DATE:' + icsDate(e.date),
      'SUMMARY:' + icsEscape(e.title));
    if (e.desc) lines.push('DESCRIPTION:' + icsEscape(e.desc));
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
async function calendarEvents(){
  const rel = [], sch = [];
  if (calState.layers.rel){
    try {
      const evs = await getAiring(31);
      evs.forEach(e => rel.push({
        date: dayStart(e.airingAt * 1000), kind:'release',
        title: `${mediaTitle(e.media)} — ep ${e.episode}`,
        time: fmtTime(e.airingAt * 1000),
        desc: 'Episode airing (from AniList)'
      }));
    } catch(e){}
  }
  if (calState.layers.sch){
    P().schedule.forEach(s => {
      schedOccurrencesInMonth(s, calState.y, calState.m).forEach(d => sch.push({
        date: d, kind:'sched', title: s.label || ('Watch/Read: ' + (entry(s.entryId)?.title || 'Reminder')),
        time: s.time, desc: 'AniTrack reminder', schedId: s.id
      }));
    });
  }
  return {rel, sch};
}
renderers.calendar = async function(){
  renderHeader();
  const box = $('#cal-view');
  const monthName = new Date(calState.y, calState.m).toLocaleDateString(undefined, {month:'long', year:'numeric'});
  box.innerHTML = `
    <div class="cal-head">
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn-ghost" id="cal-prev">‹</button>
        <h2>${monthName}</h2>
        <button class="btn-ghost" id="cal-next">›</button>
        <button class="btn-ghost" id="cal-today">Today</button>
      </div>
      <div class="layer-toggles">
        <button class="kind-chip ${calState.layers.rel?'active':''}" id="lyr-rel">Releases</button>
        <button class="kind-chip ${calState.layers.sch?'active':''}" id="lyr-sch">My Schedule</button>
      </div>
    </div>
    <div class="cal-grid">
      <div class="cal-dow">${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<div>${d}</div>`).join('')}</div>
      <div class="cal-days" id="cal-days"><p class="muted">Loading…</p></div>
    </div>
    <div class="cal-detail panel" id="cal-detail" style="margin-top:14px"></div>
    <p class="muted" style="margin-top:10px">AniTrack can't write to Apple/Google Calendar directly from a static page — use the <b>Export .ics</b> buttons and import the file into your calendar app.</p>`;

  $('#cal-prev').addEventListener('click', () => shiftCal(-1));
  $('#cal-next').addEventListener('click', () => shiftCal(1));
  $('#cal-today').addEventListener('click', () => { const n = new Date(); calState.y = n.getFullYear(); calState.m = n.getMonth(); renderers.calendar(); });
  $('#lyr-rel').addEventListener('click', () => { calState.layers.rel = !calState.layers.rel; renderers.calendar(); });
  $('#lyr-sch').addEventListener('click', () => { calState.layers.sch = !calState.layers.sch; renderers.calendar(); });

  const {rel, sch} = await calendarEvents();
  box._evts = {rel, sch};
  paintCalDays(box);
  paintCalDetail(box, calState.sel);
};
function shiftCal(d){
  calState.m += d;
  if (calState.m < 0){ calState.m = 11; calState.y--; }
  if (calState.m > 11){ calState.m = 0; calState.y++; }
  renderers.calendar();
}
function paintCalDays(box){
  const {rel, sch} = box._evts;
  const daysEl = $('#cal-days');
  const first = new Date(calState.y, calState.m, 1);
  const startPad = first.getDay();
  const dim = new Date(calState.y, calState.m + 1, 0).getDate();
  const tk = todayKey();
  const byDay = {};
  [...rel, ...sch].forEach(e => {
    const k = dayStart(e.date).toISOString();
    (byDay[k] = byDay[k] || []).push(e);
  });
  let html = '';
  for (let i = 0; i < startPad; i++){
    const d = new Date(calState.y, calState.m, -startPad + i + 1);
    html += `<div class="cal-day other"><div class="dnum">${d.getDate()}</div></div>`;
  }
  for (let d = 1; d <= dim; d++){
    const dt = new Date(calState.y, calState.m, d);
    const k = dayStart(dt).toISOString();
    const evs = byDay[k] || [];
    const isToday = k === tk;
    const sel = calState.sel === k;
    html += `<div class="cal-day ${isToday?'today':''}" data-day="${k}" style="${sel?'border-color:var(--accent)':''}">
      <div class="dnum">${d}</div>
      ${evs.slice(0,2).map(e => `<div class="ev ${e.kind==='release'?'release':'sched'}">${esc(e.title)}</div>`).join('')}
      ${evs.length > 2 ? `<div class="ev more">+${evs.length - 2} more</div>` : ''}
    </div>`;
  }
  daysEl.innerHTML = html;
  daysEl.querySelectorAll('[data-day]').forEach(el => el.addEventListener('click', () => {
    calState.sel = el.dataset.day;
    paintCalDays(box); paintCalDetail(box, calState.sel);
  }));
}
function paintCalDetail(box, dayISO){
  const el = $('#cal-detail');
  const {rel, sch} = box._evts;
  const dayEvs = [...rel, ...sch].filter(e => dayStart(e.date).toISOString() === dayISO);
  const dateLabel = dayISO ? parseDayKey(dayISO).toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'}) : null;
  el.innerHTML = `
    <h3>${dateLabel ? esc(dateLabel) : 'Select a day'}</h3>
    ${dayISO ? (dayEvs.length ? dayEvs.map(e => `
        <div class="rel-item" style="margin-bottom:8px">
          <div class="ri-body"><span class="ri-type">${e.kind === 'release' ? 'Release' : 'My schedule'}</span>
            <div style="font-weight:700">${esc(e.title)}</div>
            <div class="muted">${e.time ? esc(e.time) : 'All day'}</div></div>
          ${e.kind === 'sched' ? `<button class="btn-ghost" data-sched-del="${e.schedId}" style="padding:6px 12px;font-size:12px">Remove</button>` : ''}
        </div>`).join('')
      : '<p class="muted">No events this day.</p>') : '<p class="muted">Click a day to see its events.</p>'}
    <h3 style="margin-top:16px">Add watch / read reminder</h3>
    <div class="sched-form">
      <div class="field" style="margin:0;min-width:200px"><label>Title</label>
        <select id="sc-entry">${entries().map(e => `<option value="${e.id}">${esc(e.title)}</option>`).join('')}</select></div>
      <div class="field" style="margin:0"><label>Date</label><input type="date" id="sc-date" value="${dayISO ? dayISO.slice(0,10) : new Date().toISOString().slice(0,10)}"></div>
      <div class="field" style="margin:0"><label>Time</label><input type="time" id="sc-time" value="20:00"></div>
      <div class="field" style="margin:0"><label>Repeat</label><select id="sc-rep"><option value="none">Once</option><option value="weekly">Weekly</option></select></div>
      <button class="btn-primary" id="sc-add">Add reminder</button>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
      <button class="btn-ghost" id="ics-rel">Export releases (.ics)</button>
      <button class="btn-ghost" id="ics-sch">Export my schedule (.ics)</button>
    </div>`;
  el.querySelectorAll('[data-sched-del]').forEach(b => b.addEventListener('click', () => {
    P().schedule = P().schedule.filter(s => s.id !== b.dataset.schedDel);
    save(); toast('Reminder removed'); renderers.calendar();
  }));
  $('#sc-add').addEventListener('click', () => {
    const eid = $('#sc-entry').value;
    if (!eid){ toast('Add a title to your library first', 'err'); return; }
    P().schedule.push({id: uid('s'), entryId: eid, date: $('#sc-date').value, time: $('#sc-time').value, repeat: $('#sc-rep').value});
    save(); toast('Reminder added', 'ok'); renderers.calendar();
  });
  $('#ics-rel').addEventListener('click', () => {
    const evs = box._evts.rel.map(e => ({date: e.date, title: e.title, desc: e.desc}));
    download('anitrack-releases.ics', eventsToICS(evs, 'AniTrack Releases'), 'text/calendar');
    toast('Releases exported — import the .ics into Apple/Google Calendar', 'ok');
  });
  $('#ics-sch').addEventListener('click', () => {
    const evs = box._evts.sch.map(e => ({date: e.date, time: e.time, title: e.title, desc: e.desc}));
    download('anitrack-schedule.ics', eventsToICS(evs, 'AniTrack Watch Schedule'), 'text/calendar');
    toast('Schedule exported — import the .ics into Apple/Google Calendar', 'ok');
  });
}

/* ---------------- STATISTICS TAB ---------------- */
renderers.statistics = function(){
  renderHeader();
  const box = $('#stats-view');
  const list = entries();
  const eps = list.filter(e => e.kind === 'anime').reduce((a,e) => a + e.progress, 0);
  const chs = list.filter(e => e.kind !== 'anime').reduce((a,e) => a + e.progress, 0);
  const hours = (eps * 24 / 60).toFixed(1);
  const done = list.filter(e => e.status === 'completed').length;

  const epSeries = activitySeries(14, ['ep']);
  const epLabels = Array.from({length:14}, (_,i) => fmtDate(Date.now() - (13-i)*86400000));

  const statusCounts = {};
  list.forEach(e => { const l = statusLabel(e.kind, e.status); statusCounts[l] = (statusCounts[l]||0) + 1; });
  const donutParts = Object.entries(statusCounts).map(([label, value]) => ({label, value}));
  const donutColors = ['#e8632c','#4caf6d','#5b8dd9','#e8a13c','#e05252','#9b6bd3'];

  const genreCounts = {};
  list.forEach(e => (e.genres||[]).forEach(g => genreCounts[g] = (genreCounts[g]||0) + 1));
  const topGenres = Object.entries(genreCounts).sort((a,b) => b[1]-a[1]).slice(0, 8);

  const hist = new Array(10).fill(0);
  list.forEach(e => { if (e.score > 0) hist[Math.min(9, Math.floor(e.score) === 10 ? 9 : Math.floor(e.score))]++; });
  // bucket labels 1..10
  const hist2 = new Array(10).fill(0);
  list.forEach(e => { if (e.score > 0) hist2[Math.min(9, Math.max(0, Math.ceil(e.score) - 1))]++; });

  // 12-week heatmap (weeks x 7 days)
  const weeks = [];
  const base = dayStart(new Date()).getTime();
  for (let w = 11; w >= 0; w--){
    const week = [];
    for (let d = 6; d >= 0; d--){
      const dayMs = base - (w*7 + d) * 86400000;
      const k = new Date(dayMs).toISOString();
      week.push(P().activity.filter(a => dayStart(a.t).toISOString() === k).reduce((s,a) => s + a.delta, 0));
    }
    weeks.push(week);
  }

  box.innerHTML = `
    <div class="stats-totals">
      ${[['Episodes', eps, '#e8632c'],['Chapters', chs, '#c2457a'],['Hours (est.)', hours, '#3f8fd6'],['Completed', done, '#4caf6d']]
        .map(([l,v,c]) => `<div class="cream stat-card"><div class="stat-label">${l}</div><div class="stat-value" style="color:${c}">${v}</div></div>`).join('')}
    </div>
    <div class="two-col">
      <div class="cream chart-card"><h4 style="color:var(--card-ink)">Episodes / day — last 14 days</h4><canvas id="st-bar"></canvas></div>
      <div class="cream chart-card"><h4 style="color:var(--card-ink)">Library by status</h4><canvas id="st-donut"></canvas></div>
    </div>
    <div class="two-col" style="margin-top:16px">
      <div class="cream chart-card"><h4 style="color:var(--card-ink)">Score distribution</h4><canvas id="st-hist"></canvas></div>
      <div class="panel"><h3>Top genres</h3>
        ${topGenres.length ? topGenres.map(([g,c]) => `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px">
            <span style="flex:0 0 110px">${esc(g)}</span>
            <div class="prog dark" style="flex:1"><i style="width:${Math.round(c/topGenres[0][1]*100)}%"></i></div>
            <span class="muted">${c}</span></div>`).join('')
        : '<p class="muted">No genre data yet.</p>'}
      </div>
    </div>
    <div class="panel" style="margin-top:16px"><h3>Activity heatmap — last 12 weeks</h3><div id="st-heat"></div>
      <p class="muted" style="margin-top:8px">Each cell is one day; brighter = more episodes/chapters/pages logged.</p></div>`;

  barChart($('#st-bar'), epSeries, epLabels, accent());
  donut($('#st-donut'), donutParts.length ? donutParts : [{label:'Empty', value:1}], donutColors, true);
  barChart($('#st-hist'), hist2, ['1','2','3','4','5','6','7','8','9','10'], accent());
  heatmap($('#st-heat'), weeks);
};

/* ---------------- LINKS TAB ---------------- */
renderers.links = function(){
  renderHeader();
  const box = $('#links-view');
  const links = P().links;
  box.innerHTML = `
    <div class="panel" style="margin-bottom:16px">
      <h3>Add a site</h3>
      <div class="sched-form">
        <div class="field" style="margin:0;min-width:180px"><label>Name</label><input type="text" id="lk-name" placeholder="Crunchyroll"></div>
        <div class="field" style="margin:0;flex:1;min-width:200px"><label>URL</label><input type="text" id="lk-url" placeholder="https://…"></div>
        <div class="field" style="margin:0"><label>General site?</label>
          <label class="switch"><input type="checkbox" id="lk-gen"><i></i></label></div>
        <button class="btn-primary" id="lk-add">Add site</button>
      </div>
      <p class="muted" style="margin-top:8px">General sites appear as quick-launch chips inside every entry's detail drawer.</p>
    </div>
    <div class="panel">
      <h3>Saved sites (${links.length})</h3>
      ${links.length ? `<table class="links-table"><tr><th>Name</th><th>URL</th><th>General</th><th></th></tr>
        ${links.map((l,i) => `<tr>
          <td>${esc(l.name) || '<span class="muted">Unnamed</span>'}</td>
          <td><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url.length > 42 ? l.url.slice(0,42)+'…' : l.url)}</a></td>
          <td><label class="switch"><input type="checkbox" data-lg="${i}" ${l.general?'checked':''}><i></i></label></td>
          <td style="text-align:right;white-space:nowrap">
            <button class="btn-ghost" data-ledit="${i}" style="padding:6px 12px;font-size:12px">Edit</button>
            <button class="btn-ghost" data-ldel="${i}" style="padding:6px 12px;font-size:12px">Delete</button></td>
        </tr>`).join('')}</table>`
      : '<div class="empty"><h3>No sites saved</h3><p>Add streaming or reading sites to launch them from any entry.</p></div>'}
    </div>`;

  $('#lk-add').addEventListener('click', () => {
    const name = $('#lk-name').value.trim(), url = $('#lk-url').value.trim();
    if (!url){ toast('Enter a URL', 'err'); return; }
    P().links.push({id: uid('l'), name: name || url, url: /^https?:\/\//i.test(url) ? url : 'https://' + url, general: $('#lk-gen').checked});
    save(); toast('Site saved', 'ok'); renderers.links();
  });
  box.querySelectorAll('[data-lg]').forEach(t => t.addEventListener('change', () => {
    P().links[+t.dataset.lg].general = t.checked; save();
  }));
  box.querySelectorAll('[data-ldel]').forEach(b => b.addEventListener('click', () => {
    P().links.splice(+b.dataset.ldel, 1); save(); toast('Site deleted'); renderers.links();
  }));
  box.querySelectorAll('[data-ledit]').forEach(b => b.addEventListener('click', () => {
    const l = P().links[+b.dataset.ledit];
    genericModal(`
      <div class="modal-head"><h2>Edit site</h2><button class="icon-btn modal-close" data-gclose>✕</button></div>
      <div class="field" style="padding:0 20px"><label>Name</label><input type="text" id="ge-name" value="${esc(l.name)}"></div>
      <div class="field" style="padding:0 20px"><label>URL</label><input type="text" id="ge-url" value="${esc(l.url)}"></div>
      <div class="modal-foot"><button class="btn-ghost" data-gclose>Cancel</button>
      <button class="btn-primary" id="ge-save">Save</button></div>`);
    $$('#modal-generic [data-gclose]').forEach(x => x.addEventListener('click', closeOverlays));
    $('#ge-save').addEventListener('click', () => {
      l.name = $('#ge-name').value.trim(); l.url = $('#ge-url').value.trim();
      save(); closeOverlays(); renderers.links();
    });
  }));
};

/* ---------------- SETTINGS TAB ---------------- */
function applySettings(){
  const s = P().settings;
  const root = document.documentElement;
  root.style.setProperty('--accent', s.accent);
  root.style.setProperty('--accent-soft', s.accent + '29');
  root.style.setProperty('--bg-grad', BG_PRESETS[s.bg] || BG_PRESETS.ember);
  root.style.setProperty('--bg-img', s.bgUrl ? `url("${s.bgUrl}")` : 'none');
}
renderers.settings = function(){
  renderHeader();
  const box = $('#settings-view');
  const s = P().settings;
  box.innerHTML = `
    <div class="set-grid">
      <div class="panel"><h3>Profile</h3>
        <div class="field"><label>Display name (greeting)</label>
          <input type="text" id="set-name" value="${esc(s.displayName || '')}" placeholder="${esc(P().name)}"></div>
        <p class="muted">Rename or manage profiles from the profile button in the sidebar.</p>
      </div>
      <div class="panel"><h3>Accent color</h3>
        <div class="theme-swatches">
          ${Object.entries(THEMES).map(([k,t]) => `<div class="swatch ${s.theme===k?'active':''}" data-theme="${k}" title="${t.name}" style="background:${t.accent}"></div>`).join('')}
        </div>
        <div class="color-row">
          <input type="color" id="set-color" value="${esc(s.accent)}" title="Color wheel">
          <input type="text" id="set-hex" value="${esc(s.accent)}" maxlength="7" spellcheck="false">
        </div>
        <p class="muted" style="margin-top:8px">Pick a preset, use the wheel, or type a hex code — they stay in sync.</p>
      </div>
      <div class="panel"><h3>Background</h3>
        <div class="bg-presets">
          ${Object.entries(BG_PRESETS).map(([k,g]) => `<div class="bg-preset ${s.bg===k?'active':''}" data-bg="${k}" title="${k}" style="background:${g}"></div>`).join('')}
        </div>
        <div class="field"><label>Custom background image URL</label>
          <input type="text" id="set-bgurl" value="${esc(s.bgUrl || '')}" placeholder="https://…"></div>
      </div>
      <div class="panel"><h3>Data</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn-ghost" id="set-export">Export JSON</button>
          <button class="btn-ghost" id="set-import-btn">Import JSON</button>
          <input type="file" id="set-import" accept=".json" class="hidden">
        </div>
        <p class="muted" style="margin-top:8px">Export to back up or migrate from your old tracker; import restores everything.</p>
      </div>
      <div class="panel" style="border-color:rgba(224,82,82,.4)"><h3 style="color:#f09a9a">Danger zone</h3>
        <button class="btn-danger" id="set-reset">Reset all data</button>
        <p class="muted" style="margin-top:8px">Erases every profile, entry, reminder and setting on this device.</p>
      </div>
    </div>`;

  $('#set-name').addEventListener('input', debounce(ev => { s.displayName = ev.target.value.trim(); save(); renderHeader(); }, 500));
  box.querySelectorAll('[data-theme]').forEach(el => el.addEventListener('click', () => {
    const t = THEMES[el.dataset.theme];
    s.theme = el.dataset.theme; s.accent = t.accent;
    save(); applySettings(); renderers.settings(); updateBell();
  }));
  const colorEl = $('#set-color'), hexEl = $('#set-hex');
  const setAccent = v => {
    if (!/^#[0-9a-fA-F]{6}$/.test(v)) return;
    s.accent = v; s.theme = 'custom'; save(); applySettings();
    colorEl.value = v;
    if (document.activeElement !== hexEl) hexEl.value = v;
    box.querySelectorAll('[data-theme]').forEach(x => x.classList.remove('active'));
  };
  colorEl.addEventListener('input', ev => setAccent(ev.target.value));
  hexEl.addEventListener('input', ev => {
    let v = ev.target.value.trim();
    if (/^[0-9a-fA-F]{6}$/.test(v)) v = '#' + v;
    setAccent(v);
  });
  box.querySelectorAll('[data-bg]').forEach(el => el.addEventListener('click', () => {
    s.bg = el.dataset.bg; s.bgUrl = ''; save(); applySettings(); renderers.settings();
  }));
  $('#set-bgurl').addEventListener('change', ev => {
    s.bgUrl = ev.target.value.trim(); save(); applySettings();
    toast(s.bgUrl ? 'Background updated' : 'Background cleared', 'ok');
  });
  $('#set-export').addEventListener('click', () => {
    download('anitrack-backup.json', JSON.stringify(DB, null, 2), 'application/json');
    toast('Backup exported', 'ok');
  });
  $('#set-import-btn').addEventListener('click', () => $('#set-import').click());
  $('#set-import').addEventListener('change', ev => {
    const f = ev.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!data.profiles || !data.activeProfile) throw new Error('not an AniTrack backup');
        DB = data; if (!DB.cache) DB.cache = {};
        save(); applySettings(); renderHeader(); navigate('home'); updateBell();
        toast('Backup imported', 'ok');
      } catch(e){ toast('Import failed: ' + esc(e.message), 'err'); }
    };
    r.readAsText(f);
  });
  $('#set-reset').addEventListener('click', () => confirmDialog('Reset all data?',
    'This erases every profile and all tracked data on this device. This cannot be undone.',
    () => { localStorage.removeItem(LS_KEY); loadDB(); applySettings(); navigate('home'); updateBell(); toast('All data erased'); }, 'Erase everything'));
};

/* ---------------- PROFILES ---------------- */
function openProfiles(){
  const ids = Object.keys(DB.profiles);
  genericModal(`
    <div class="modal-head"><h2>Profiles</h2><button class="icon-btn modal-close" data-gclose>✕</button></div>
    <div style="padding:0 20px 6px"><p class="muted" style="margin-bottom:10px">Profiles are stored only in this browser (localStorage). Each has its own library, reminders and settings.</p>
    ${ids.map(id => { const p = DB.profiles[id]; return `
      <div class="add-item ${id===DB.activeProfile?'selected':''}" style="margin-bottom:8px;cursor:default">
        <span class="avatar" style="width:30px;height:30px;flex-basis:30px">${esc((p.name[0]||'P').toUpperCase())}</span>
        <div class="ai-body"><div class="ai-title">${esc(p.name)}</div>
        <div class="ai-meta">${Object.keys(p.entries).length} titles</div></div>
        ${id!==DB.activeProfile ? `<button class="btn-ghost" data-psw="${id}" style="padding:6px 12px;font-size:12px">Switch</button>` : '<span class="muted" style="font-size:11px">active</span>'}
        <button class="btn-ghost" data-pren="${id}" style="padding:6px 12px;font-size:12px">Rename</button>
        ${ids.length > 1 ? `<button class="btn-ghost" data-pdel="${id}" style="padding:6px 12px;font-size:12px">Delete</button>` : ''}
      </div>`; }).join('')}
    </div>
    <div class="modal-foot"><span></span><button class="btn-primary" id="p-new">+ New profile</button></div>`);
  $$('#modal-generic [data-gclose]').forEach(b => b.addEventListener('click', closeOverlays));
  const rerender = () => { closeOverlays(); applySettings(); renderHeader(); navigate('home'); updateBell(); };
  $$('#modal-generic [data-psw]').forEach(b => b.addEventListener('click', () => { DB.activeProfile = b.dataset.psw; save(); rerender(); }));
  $$('#modal-generic [data-pren]').forEach(b => b.addEventListener('click', () => {
    const p = DB.profiles[b.dataset.pren];
    const name = prompt('Profile name', p.name);
    if (name && name.trim()){ p.name = name.trim(); save(); openProfiles(); renderHeader(); }
  }));
  $$('#modal-generic [data-pdel]').forEach(b => b.addEventListener('click', () => {
    const p = DB.profiles[b.dataset.pdel];
    if (!confirm(`Delete profile "${p.name}" and all its data?`)) return;
    delete DB.profiles[b.dataset.pdel];
    if (DB.activeProfile === b.dataset.pdel) DB.activeProfile = Object.keys(DB.profiles)[0];
    save(); rerender();
  }));
  $('#p-new').addEventListener('click', () => {
    const name = prompt('New profile name', 'Profile ' + (ids.length + 1));
    if (!name) return;
    const p = newProfile(name.trim()); DB.profiles[p.id] = p; DB.activeProfile = p.id;
    save(); rerender(); toast('Profile created', 'ok');
  });
}

/* ---------------- INIT ---------------- */
function init(){
  loadDB();
  applySettings();
  renderHeader();
  $('#global-search').addEventListener('input', doGlobalSearch);
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) $('#search-results').classList.add('hidden');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlays();
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)){
      e.preventDefault(); $('#global-search').focus();
    }
  });
  $('#profile-btn').addEventListener('click', openProfiles);
  navigate('home');
  updateBell();
  window.addEventListener('resize', debounce(() => renderers[activeTab] && renderers[activeTab](), 300));
}
document.addEventListener('DOMContentLoaded', init);
