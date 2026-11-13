/* ===================================================================
   RAJNITI - CAREER MODE  ("Start your political journey")
   Alag file: career-mode.js  (script.js, assembly-data.js, state-assembly.js ke BAAD load karo)
   Flow: Naam+Photo -> Party (maujooda / apni) -> State -> Vichardhara+Virodhi/Saathi -> Dilchaspi ke state -> Party ke pad -> CAREER HUB
   =================================================================== */
(function () {
'use strict';
var KEY = 'rajniti_career_v1';

var STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Puducherry'];
var LS_SEATS = { 'Uttar Pradesh':80,'Maharashtra':48,'Bihar':40,'West Bengal':42,'Madhya Pradesh':29,'Tamil Nadu':39,'Karnataka':28,'Gujarat':26,'Rajasthan':25,'Andhra Pradesh':25,'Odisha':21,'Kerala':20,'Telangana':17,'Jharkhand':14,'Assam':14,'Punjab':13,'Chhattisgarh':11,'Haryana':10,'Uttarakhand':5,'Himachal Pradesh':4,'Goa':2,'Tripura':2,'Manipur':2,'Meghalaya':2,'Nagaland':1,'Arunachal Pradesh':2,'Mizoram':1,'Sikkim':1,'Delhi':7,'Jammu & Kashmir':5,'Puducherry':1 };
var VS_SEATS = { 'Uttar Pradesh':403,'Maharashtra':288,'Tamil Nadu':234,'West Bengal':294,'Bihar':243,'Karnataka':224,'Andhra Pradesh':175,'Gujarat':182,'Madhya Pradesh':230,'Rajasthan':200,'Odisha':147,'Kerala':140,'Telangana':119,'Assam':126,'Punjab':117,'Jharkhand':81,'Chhattisgarh':90,'Haryana':90,'Jammu & Kashmir':90,'Delhi':70,'Uttarakhand':70,'Himachal Pradesh':68,'Goa':40,'Manipur':60,'Meghalaya':60,'Tripura':60,'Nagaland':60,'Mizoram':40,'Sikkim':32,'Arunachal Pradesh':60,'Puducherry':30 };

var IDEOLOGIES = [
 ['Samajwad','Barabri aur gareebon ki rajniti'], ['Vampanth / Communist','Mazdoor-kisan ka raaj'], ['Dakshinpanth','Bazaar, parampara aur anushasan'],
 ['Rashtravaad','Desh sabse pehle'], ['Hindutva','Dharm aadharit sanskritik rajniti'], ['Dharmnirpekshta','Sabhi dharmon ka samaan samman'],
 ['Ambedkarwad','Samajik nyay aur dalit adhikar'], ['Kshetriya Asmita','Apne pradesh ki pehchaan'], ['Kisan-Mazdoor','Gaon, kheti aur shram'],
 ['Gandhiwad','Ahimsa aur gram swaraj'], ['Kendravad','Beech ka rasta'], ['Udaarwad','Azadi aur naye vichar'], ['Paryavaran','Hari rajniti'], ['Kalyankari','Yojana aur muft suvidhayen']
];
var NARRATIVES = [
 { id: 'bhrashtachar', n: 'Bhrashtachar ke khilaf', cost: 8, img: 7, fund: 6, tags: ['Gandhiwad','Kendravad','Udaarwad','Rashtravaad'] },
 { id: 'rozgar', n: 'Yuva rozgar', cost: 10, img: 8, fund: 5, tags: ['Samajwad','Udaarwad','Kalyankari','Kendravad'] },
 { id: 'kisan', n: 'Kisan ki awaaz', cost: 9, img: 7, fund: 5, tags: ['Kisan-Mazdoor','Samajwad','Vampanth / Communist'] },
 { id: 'mahila', n: 'Mahila suraksha', cost: 9, img: 7, fund: 5, tags: ['Kalyankari','Udaarwad','Dharmnirpekshta'] },
 { id: 'nyay', n: 'Samajik nyay', cost: 10, img: 8, fund: 6, tags: ['Ambedkarwad','Samajwad','Dharmnirpekshta'] },
 { id: 'raashtra', n: 'Rashtra pehle', cost: 12, img: 9, fund: 9, tags: ['Rashtravaad','Hindutva','Dakshinpanth'] },
 { id: 'asmita', n: 'Pradesh ki asmita', cost: 9, img: 7, fund: 5, tags: ['Kshetriya Asmita'] },
 { id: 'hara', n: 'Hara-bhara pradesh', cost: 8, img: 6, fund: 4, tags: ['Paryavaran','Gandhiwad'] }
];
var EVENTS = [
 { id: 'dharna', n: 'Dharna / Pradarshan', cost: 3, img: 3, cad: 6, risk: 0.15, riskT: 'Police case darj, chhavi giri.' },
 { id: 'padyatra', n: 'Padyatra', cost: 6, img: 8, cad: 8, risk: 0.05, riskT: 'Yatra mein jhadap, thodi badnami.' },
 { id: 'sabha', n: 'Jansabha', cost: 12, img: 6, cad: 4, risk: 0.05, riskT: 'Bheed kam rahi.' },
 { id: 'hastakshar', n: 'Hastakshar abhiyan', cost: 4, img: 3, cad: 10, risk: 0, riskT: '' },
 { id: 'shivir', n: 'Raktdaan / swasthya shivir', cost: 5, img: 5, cad: 4, risk: 0, riskT: '' }
];
var POSTS = [
 ['Rashtriya Adhyaksh', true, true], ['Karyakari Adhyaksh', false, false], ['Mahasachiv (Sangathan)', true, false], ['Mahasachiv (Rajneetik)', false, false],
 ['Kosadhyaksh', true, false], ['Mukhya Pravakta', true, false], ['Pravakta (TV)', false, false], ['Media Prabhari', false, false], ['Chunav Prabandhak', false, false],
 ['Pradesh Adhyaksh', true, false], ['Yuva Morcha Adhyaksh', false, false], ['Mahila Morcha Adhyaksh', false, false], ['Kisan Prakosth Adhyaksh', false, false],
 ['IT Cell Pramukh', false, false], ['Legal Cell Pramukh', false, false], ['Sansadiya Dal Neta', false, false]
]; // [naam, zaroori, aap khud]
var STAGES = [
 { id: 'mla', n: 'MLA seat se ladna', d: 'Akele ek vidhan sabha seat se chunav.' },
 { id: 'mp', n: 'MP seat se ladna', d: 'Akele ek Lok Sabha seat se chunav.' },
 { id: 'team', n: 'Apne state ki kai Lok Sabha seat', d: 'Apni party ke kai ummeedwar ek saath.' },
 { id: 'multi', n: 'Kai state ek saath', d: 'Dilchaspi ke kai states mein vidhan sabha chunav.' },
 { id: 'nat', n: 'National: Lok Sabha', d: 'Poore desh mein ummeedwar, Pradhanmantri banne ki ladai.' }
];
var PRESET_LOGOS = [['#ef4444','star'],['#f97316','sun'],['#eab308','wheel'],['#22c55e','leaf'],['#06b6d4','wave'],['#3b82f6','shield'],['#8b5cf6','flame'],['#ec4899','crown'],['#14b8a6','mount'],['#64748b','torch']];
var AV_COL = [['#7c3aed','#06b6d4'],['#ea580c','#facc15'],['#16a34a','#06b6d4'],['#db2777','#f97316'],['#2563eb','#8b5cf6'],['#0d9488','#84cc16'],['#dc2626','#f59e0b'],['#4f46e5','#ec4899'],['#0891b2','#22c55e'],['#9333ea','#f43f5e']];

// ---------- helpers ----------
function E(s) { return (typeof esc === 'function') ? esc(s) : String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function Q(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;'); }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function initials(n) { var w = String(n || '').trim().split(/\s+/).filter(Boolean); return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?').slice(0, 2)).toUpperCase(); }
function nameGen() { return (typeof randName === 'function') ? randName() : 'Shri ' + pick(['Rakesh','Mahesh','Suresh','Anil','Vinod','Dinesh','Pradeep','Sanjay']) + ' ' + pick(['Sharma','Verma','Yadav','Singh','Patel','Reddy','Nair','Das']); }
function svgUri(s) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(s); }
function avatarUri(i) {
    var c = AV_COL[i % AV_COL.length], skin = ['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac'][i % 5];
    return svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><circle cx="50" cy="38" r="17" fill="' + skin + '"/><path d="M14 100 C16 68 34 60 50 60 C66 60 84 68 86 100Z" fill="#0f172a" opacity=".85"/><path d="M33 34 C34 20 66 20 67 34 C60 28 40 28 33 34Z" fill="#111827"/></svg>');
}
function logoUri(i, name) {
    var p = PRESET_LOGOS[i % PRESET_LOGOS.length], col = p[0], sh = p[1], g = '';
    if (sh === 'star') g = '<polygon points="50,12 60,38 88,38 66,55 74,82 50,66 26,82 34,55 12,38 40,38" fill="#fff" opacity=".9"/>';
    else if (sh === 'sun') g = '<circle cx="50" cy="50" r="18" fill="#fff"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<rect x="47" y="10" width="6" height="14" fill="#fff" transform="rotate(' + a + ' 50 50)"/>'; }).join('');
    else if (sh === 'wheel') g = '<circle cx="50" cy="50" r="30" fill="none" stroke="#fff" stroke-width="5"/>' + [0, 45, 90, 135].map(function (a) { return '<rect x="48" y="20" width="4" height="60" fill="#fff" transform="rotate(' + a + ' 50 50)"/>'; }).join('');
    else if (sh === 'leaf') g = '<path d="M50 85 C20 60 22 30 50 14 C78 30 80 60 50 85Z" fill="#fff" opacity=".92"/><path d="M50 80 L50 30" stroke="' + col + '" stroke-width="3"/>';
    else if (sh === 'wave') g = '<path d="M12 40 Q30 24 50 40 T88 40" fill="none" stroke="#fff" stroke-width="7"/><path d="M12 60 Q30 44 50 60 T88 60" fill="none" stroke="#fff" stroke-width="7"/>';
    else if (sh === 'shield') g = '<path d="M50 12 L84 24 L80 58 C76 74 62 82 50 88 C38 82 24 74 20 58 L16 24Z" fill="#fff" opacity=".92"/>';
    else if (sh === 'flame') g = '<path d="M50 10 C62 30 76 38 70 62 C66 78 56 88 50 88 C40 88 28 76 30 60 C32 46 44 40 50 10Z" fill="#fff" opacity=".92"/>';
    else if (sh === 'crown') g = '<path d="M16 70 L22 32 L38 52 L50 28 L62 52 L78 32 L84 70Z" fill="#fff" opacity=".92"/>';
    else if (sh === 'mount') g = '<path d="M8 80 L36 34 L52 58 L66 40 L92 80Z" fill="#fff" opacity=".92"/>';
    else g = '<rect x="44" y="30" width="12" height="52" fill="#fff"/><path d="M36 30 Q50 6 64 30Z" fill="#fff"/>';
    var t = initials(name || '');
    return svgUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="' + col + '"/>' + g + '<text x="50" y="97" text-anchor="middle" font-family="Arial" font-weight="900" font-size="15" fill="#fff" stroke="' + col + '" stroke-width="3" paint-order="stroke">' + t.replace(/&/g, '') + '</text></svg>');
}
function allParties() {
    var out = [];
    if (typeof partiesList !== 'undefined' && partiesList.length) partiesList.forEach(function (p) { if (!(C && C.party && C.party.mine && p.name === C.party.name)) out.push({ n: p.name, c: p.color || '#64748b' }); });
    if (!out.length) ['BJP','Congress','AAP','Samajwadi Party','BSP','TMC','DMK','AIADMK','JD(U)','RJD','TDP','YSRCP','Shiv Sena','Shiv Sena (UBT)','NCP (SP)','NCP (Ajit Pawar)','CPI(M)','BJD','BRS','JMM','National Conference'].forEach(function (n) { out.push({ n: n, c: (window.__SA && __SA.colOf) ? __SA.colOf(n) : '#64748b' }); });
    return out;
}

// ---------- data ----------
var C = null;      // committed career
var W = {};        // wizard
var UI = { tab: 'overview', msg: null, sel: null };

function load() { try { C = JSON.parse(localStorage.getItem(KEY)); } catch (e) { C = null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) { alert('Save nahi ho paya (photo bahut badi ho sakti hai).'); } registerParty(); }
function myCol() { return C && C.party && C.party.color ? C.party.color : '#38bdf8'; }
function photoOf() { return C.photo && C.photo.indexOf('data:') === 0 ? C.photo : avatarUri(parseInt((C.photo || 'av:0').split(':')[1], 10) || 0); }
function logoOf() { return C.party.logoData || logoUri(C.party.logoIdx || 0, C.party.name); }
function strengthShare() { return clamp(2 + C.res.strength * 0.25, 2, 25); }

// ---------- doosre modes se jod ----------
function lsStateName(s) { return s === 'Jammu & Kashmir' ? 'Jammu and Kashmir' : s; }
function registerParty() {
    try {
        if (!C || !C.party || !C.party.mine || typeof s22AddParty !== 'function') return;
        var sts = C.interest && C.interest.indexOf('ALL') >= 0 ? null : [C.state].concat(C.interest || []).filter(function (x, i, a) { return x && x !== 'ALL' && a.indexOf(x) === i; }).map(lsStateName);
        if (typeof PARTY_DB !== 'undefined' && PARTY_DB[C.party.name]) { PARTY_DB[C.party.name].w = 1 + Math.round(C.res.strength / 20); return; }
        s22AddParty(C.party.name, 'OTHER', 1 + Math.round(C.res.strength / 20), C.party.color, sts, initials(C.party.name));
    } catch (e) { console.warn('career register', e); }
}
var API = {
    hasParty: function () { return !!(C && C.party && C.party.mine); },
    getParty: function () { return C && C.party ? { name: C.party.name, color: C.party.color } : null; },
    inState: function (st) { return !!C && (C.state === st || (C.interest || []).indexOf('ALL') >= 0 || (C.interest || []).indexOf(st) >= 0); },
    partyShare: function () { return C ? strengthShare() : 2; },
    leaders: function () { var a = [C.name]; Object.keys(C.posts || {}).forEach(function (k) { if (C.posts[k] && a.indexOf(C.posts[k]) < 0) a.push(C.posts[k]); }); return a.slice(0, 4); },
    open: open,
    reportResult: reportResult
};

// =============================================================
//  CSS + shell
// =============================================================
function css() {
    if (document.getElementById('cm-css')) return;
    var st = document.createElement('style'); st.id = 'cm-css';
    st.textContent = [
'#cm-ui{position:fixed;inset:0;z-index:9100;overflow:auto;color:#e2e8f0;background:radial-gradient(circle at 15% 10%,#312e81 0,#0b1120 55%),#0b1120;font-family:inherit;}',
'#cm-ui.hidden{display:none;}',
'.cm-wrap{max-width:1100px;margin:0 auto;padding:20px 22px 50px;}',
'.cm-top{display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap;}',
'.cm-top h1{margin:0;font-size:1.8rem;background:linear-gradient(90deg,#f472b6,#facc15,#38bdf8);-webkit-background-clip:text;background-clip:text;color:transparent;}',
'.cm-top p{margin:2px 0 0;color:#94a3b8;font-size:.9rem;}',
'.cm-x{border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:12px;padding:8px 14px;cursor:pointer;font-weight:700;}',
'.cm-steps{display:flex;gap:6px;margin-bottom:16px;}.cm-steps i{flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,.12);}.cm-steps i.on{background:linear-gradient(90deg,#f472b6,#38bdf8);}',
'.cm-card{background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:20px;margin-bottom:16px;backdrop-filter:blur(8px);}',
'.cm-card h3{margin:0 0 12px;font-size:.85rem;letter-spacing:3px;color:#94a3b8;}',
'.cm-in{width:100%;padding:14px 16px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:rgba(15,23,42,.8);color:#fff;font-size:1.05rem;outline:none;box-sizing:border-box;}',
'.cm-in:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.25);}',
'.cm-btn{border:0;border-radius:14px;padding:12px 22px;font-weight:800;color:#fff;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#2563eb);font-size:.95rem;}',
'.cm-btn.g{background:linear-gradient(135deg,#16a34a,#65a30d);}.cm-btn.o{background:linear-gradient(135deg,#ea580c,#dc2626);}.cm-btn.gh{background:rgba(255,255,255,.12);}.cm-btn.sm{padding:7px 12px;font-size:.8rem;border-radius:10px;}',
'.cm-btn:disabled{opacity:.4;cursor:not-allowed;}',
'.cm-av{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:10px;}',
'.cm-av img{width:100%;aspect-ratio:1;border-radius:16px;object-fit:cover;cursor:pointer;border:3px solid transparent;transition:.2s;background:#1e293b;}',
'.cm-av img:hover{transform:scale(1.06);}.cm-av img.sel{border-color:#facc15;box-shadow:0 0 14px rgba(250,204,21,.6);}',
'.cm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;}',
'.cm-chip{cursor:pointer;border-radius:18px;padding:12px 14px;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.12);transition:.2s;border-left:6px solid var(--c,#64748b);}',
'.cm-chip:hover{background:rgba(255,255,255,.14);}.cm-chip.sel{border-color:#facc15;background:rgba(250,204,21,.14);}.cm-chip.bad.sel{border-color:#ef4444;background:rgba(239,68,68,.16);}.cm-chip.good.sel{border-color:#22c55e;background:rgba(34,197,94,.16);}',
'.cm-chip b{display:block;}.cm-chip small{color:#94a3b8;}',
'.cm-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}',
'.cm-prev{display:flex;align-items:center;gap:14px;}.cm-prev img{width:92px;height:92px;border-radius:22px;object-fit:cover;border:3px solid rgba(255,255,255,.3);background:#1e293b;}',
'.cm-hero{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}.cm-hero img.p{width:84px;height:84px;border-radius:22px;object-fit:cover;border:3px solid var(--c);}.cm-hero img.l{width:64px;height:64px;border-radius:16px;object-fit:cover;}',
'.cm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin:12px 0;}',
'.cm-stat{padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.08);}.cm-stat small{color:#94a3b8;display:block;font-size:.72rem;}.cm-stat b{font-size:1.5rem;color:#fff;}',
'.cm-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}.cm-tab{border:0;border-radius:14px;padding:9px 16px;font-weight:700;cursor:pointer;color:#cbd5e1;background:rgba(255,255,255,.08);}.cm-tab.on{background:linear-gradient(135deg,#f472b6,#7c3aed);color:#fff;}',
'.cm-bar{height:10px;border-radius:6px;background:#1e293b;overflow:hidden;margin-top:4px;}.cm-bar i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#a855f7);}',
'.cm-ladder{display:flex;flex-direction:column;gap:8px;}',
'.cm-st{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.06);border:2px solid transparent;}.cm-st.cur{border-color:#facc15;background:rgba(250,204,21,.1);}.cm-st.done{opacity:.7;}.cm-st.lock{opacity:.4;}',
'.cm-st .n{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#334155;font-weight:900;}.cm-st.done .n{background:#16a34a;}.cm-st.cur .n{background:#facc15;color:#111;}',
'.cm-msg{padding:10px 14px;border-radius:14px;margin:10px 0;background:rgba(56,189,248,.14);border:1px solid rgba(56,189,248,.4);color:#bae6fd;}.cm-msg.bad{background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.4);color:#fecaca;}.cm-msg.good{background:rgba(34,197,94,.14);border-color:rgba(34,197,94,.4);color:#bbf7d0;}',
'.cm-item{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:8px;border-radius:14px;background:rgba(255,255,255,.07);}.cm-item .t{flex:1;min-width:0;}.cm-item small{display:block;color:#94a3b8;}',
'.cm-badge{display:inline-block;margin:4px;padding:8px 14px;border-radius:16px;background:linear-gradient(135deg,rgba(250,204,21,.25),rgba(236,72,153,.2));border:1px solid rgba(250,204,21,.5);font-weight:700;}.cm-badge.off{opacity:.35;filter:grayscale(1);}',
'.cm-select{padding:10px 12px;border-radius:12px;background:#0f172a;color:#fff;border:1px solid #334155;max-width:100%;}',
'.cm-res{text-align:center;padding:26px;border-radius:24px;background:linear-gradient(160deg,rgba(250,204,21,.18),rgba(255,255,255,.04));border:1px solid rgba(250,204,21,.5);}.cm-res h2{margin:6px 0;font-size:1.9rem;color:#fff;}',
'@media(max-width:700px){.cm-wrap{padding:14px 12px 40px;}.cm-top h1{font-size:1.4rem;}}'
    ].join('\n');
    document.head.appendChild(st);
}
function shell() { var el = document.getElementById('cm-ui'); if (!el) { el = document.createElement('div'); el.id = 'cm-ui'; el.className = 'hidden'; document.body.appendChild(el); } return el; }
function show(title, sub, body, step, backFn) {
    var s = '';
    if (step) for (var i = 1; i <= 6; i++) s += '<i class="' + (i <= step ? 'on' : '') + '"></i>';
    var el = shell();
    el.innerHTML = '<div class="cm-wrap"><div class="cm-top"><button class="cm-x" onclick="' + (backFn || 'CareerMode.close()') + '">&larr; ' + (backFn ? 'Peeche' : 'Band karo') + '</button><div><h1>' + E(title) + '</h1><p>' + E(sub || '') + '</p></div></div>' + (s ? '<div class="cm-steps">' + s + '</div>' : '') + body + '</div>';
    el.classList.remove('hidden'); el.scrollTop = 0;
}
function close() { var e = document.getElementById('cm-ui'); if (e) e.classList.add('hidden'); }
function open() {
    css(); load();
    if (C && C.done) { UI.tab = 'overview'; UI.msg = null; return hub(); }
    W = {}; screenIntro();
}

// =============================================================
//  WIZARD
// =============================================================
function screenIntro() {
    W.photo = W.photo || 'av:0'; W.name = W.name || '';
    var av = '', i;
    for (i = 0; i < 10; i++) av += '<img src="' + avatarUri(i) + '" class="' + (W.photo === 'av:' + i ? 'sel' : '') + '" onclick="CareerMode.setAv(' + i + ')">';
    var prev = W.photo.indexOf('data:') === 0 ? W.photo : avatarUri(parseInt(W.photo.split(':')[1], 10));
    show('Apni Rajneeti Shuru Karo', 'Pehle apna naam aur photo chuno.',
        '<div class="cm-card"><h3>AAPKA NAAM</h3><input id="cm-name" class="cm-in" maxlength="28" placeholder="Apna naam likho (jaise Aarav Sharma)" value="' + E(W.name) + '" oninput="CareerMode.setName(this.value)"></div>' +
        '<div class="cm-card"><h3>AAPKI PHOTO</h3><div class="cm-prev"><img id="cm-prev" src="' + prev + '"><div><label class="cm-btn gh sm" style="display:inline-block">&#128247; Photo upload karo<input type="file" accept="image/*" style="display:none" onchange="CareerMode.upload(this,\'photo\')"></label><div style="color:#94a3b8;font-size:.82rem;margin-top:6px">Ya neeche se koi taiyar profile chuno.</div></div></div><div class="cm-av" style="margin-top:14px">' + av + '</div></div>' +
        '<button class="cm-btn g" onclick="CareerMode.toParty()">AAGE &rarr;</button>', 0);
}
function setAv(i) { W.photo = 'av:' + i; screenIntro(); }
function setName(v) { W.name = v; }
function resizeImg(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
        var im = new Image();
        im.onload = function () {
            var s = 220, c = document.createElement('canvas'); c.width = s; c.height = s;
            var x = c.getContext('2d'), m = Math.min(im.width, im.height), sx = (im.width - m) / 2, sy = (im.height - m) / 2;
            x.drawImage(im, sx, sy, m, m, 0, 0, s, s);
            cb(c.toDataURL('image/jpeg', 0.82));
        };
        im.src = fr.result;
    };
    fr.readAsDataURL(file);
}
function upload(inp, what) {
    var f = inp.files && inp.files[0]; if (!f) return;
    resizeImg(f, function (d) {
        if (what === 'photo') { W.photo = d; screenIntro(); }
        else { W.logoData = d; W.logoIdx = -1; screenCreate(); }
    });
}
function toParty() {
    var n = (W.name || '').trim();
    if (n.length < 2) { alert('Pehle apna naam likho.'); return; }
    W.name = n; screenParty();
}
function screenParty() {
    show('Party Chuno', 'Maujooda party mein jao ya apni nayi party banao.',
        '<div class="cm-card" style="border-color:#f472b6"><h3>NAYI SHURUAAT</h3><div class="cm-row"><div style="flex:1;min-width:220px"><b style="font-size:1.2rem">Create your own party</b><div style="color:#94a3b8;font-size:.88rem">Apni party, apna naam, apna logo. Zero se shuru karke PM tak.</div></div><button class="cm-btn o" onclick="CareerMode.screenCreate()">PARTY BANAO</button></div></div>' +
        '<div class="cm-card"><h3>YA MAUJOODA PARTY CHUNO</h3><div class="cm-grid">' + allParties().map(function (p) { return '<div class="cm-chip" style="--c:' + p.c + '" onclick="CareerMode.pickExisting(\'' + Q(p.n) + '\')"><b>' + E(p.n) + '</b></div>'; }).join('') + '</div></div>', 1, 'CareerMode.screenIntro()');
}
function pickExisting(n) {
    show('Maujooda Party', n, '<div class="cm-card"><h3>JALD AA RAHA HAI</h3><p style="color:#cbd5e1">Maujooda party (<b>' + E(n) + '</b>) ke saath career ka rasta abhi taiyar nahi hai. Wo tarika aap baad mein bataoge. Abhi apni khud ki party banakar journey shuru kar sakte ho.</p><div class="cm-row"><button class="cm-btn o" onclick="CareerMode.screenCreate()">APNI PARTY BANAO</button><button class="cm-btn gh" onclick="CareerMode.screenParty()">Wapas</button></div></div>', 1, 'CareerMode.screenParty()');
}
function screenCreate() {
    W.pname = W.pname || ''; if (W.logoIdx == null) W.logoIdx = 0;
    var lg = '', i;
    for (i = 0; i < 10; i++) lg += '<img src="' + logoUri(i, W.pname || 'Party') + '" class="' + (W.logoIdx === i ? 'sel' : '') + '" onclick="CareerMode.setLogo(' + i + ')">';
    var prev = W.logoData && W.logoIdx === -1 ? W.logoData : logoUri(Math.max(0, W.logoIdx), W.pname || 'Party');
    show('Apni Party Banao', 'Party ka naam aur logo.',
        '<div class="cm-card"><h3>PARTY KA NAAM</h3><input id="cm-pname" class="cm-in" maxlength="34" placeholder="Jaise Rashtriya Yuva Manch" value="' + E(W.pname) + '" oninput="CareerMode.setPname(this.value)"></div>' +
        '<div class="cm-card"><h3>PARTY KA LOGO</h3><div class="cm-prev"><img src="' + prev + '"><div><label class="cm-btn gh sm" style="display:inline-block">&#128247; Apna logo upload karo<input type="file" accept="image/*" style="display:none" onchange="CareerMode.upload(this,\'logo\')"></label><div style="color:#94a3b8;font-size:.82rem;margin-top:6px">Ya neeche se 10 mein se chuno (naam ke akshar apne aap jud jayenge).</div></div></div><div class="cm-av" style="margin-top:14px">' + lg + '</div></div>' +
        '<div class="cm-row"><button class="cm-btn g" onclick="CareerMode.toState()">AAGE &rarr;</button></div>', 1, 'CareerMode.screenParty()');
}
function setLogo(i) { W.logoIdx = i; screenCreate(); }
function setPname(v) { W.pname = v; }
function toState() {
    var n = (W.pname || '').trim();
    if (n.length < 2) { alert('Party ka naam likho.'); return; }
    W.pname = n; screenState();
}
function screenState() {
    show('Kis State Se Shuru?', 'Jahan se aapki rajneeti ki shuruaat hogi.',
        '<div class="cm-card"><div class="cm-grid">' + STATES.map(function (s) {
            return '<div class="cm-chip' + (W.state === s ? ' sel' : '') + '" onclick="CareerMode.setState(\'' + Q(s) + '\')"><b>' + E(s) + '</b><small>' + VS_SEATS[s] + ' vidhan sabha | ' + LS_SEATS[s] + ' Lok Sabha</small></div>';
        }).join('') + '</div></div><button class="cm-btn g" onclick="CareerMode.toIdeo()">AAGE &rarr;</button>', 2, 'CareerMode.screenCreate()');
}
function setState(s) { W.state = s; screenState(); }
function toIdeo() { if (!W.state) { alert('State chuno.'); return; } W.ideo = W.ideo || []; W.opp = W.opp || []; W.allies = W.allies || []; screenIdeo(); }
function screenIdeo() {
    var ps = allParties();
    var part = function (arr, kind) {
        return ps.map(function (p) {
            var on = arr.indexOf(p.n) >= 0, other = (kind === 'opp' ? W.allies : W.opp).indexOf(p.n) >= 0;
            return '<div class="cm-chip ' + (kind === 'opp' ? 'bad' : 'good') + (on ? ' sel' : '') + '" style="--c:' + p.c + ';' + (other ? 'opacity:.3;pointer-events:none' : '') + '" onclick="CareerMode.toggle(\'' + kind + '\',\'' + Q(p.n) + '\')"><b>' + E(p.n) + '</b></div>';
        }).join('');
    };
    show('Vichardhara aur Saathi', 'Aap kis soch par chalte ho, kaun virodhi hai aur kaun apna.',
        '<div class="cm-card"><h3>AAPKI VICHARDHARA (MAX 3)</h3><div class="cm-grid">' + IDEOLOGIES.map(function (x) { return '<div class="cm-chip' + (W.ideo.indexOf(x[0]) >= 0 ? ' sel' : '') + '" onclick="CareerMode.toggle(\'ideo\',\'' + Q(x[0]) + '\')"><b>' + E(x[0]) + '</b><small>' + E(x[1]) + '</small></div>'; }).join('') + '</div></div>' +
        '<div class="cm-card"><h3>BILKUL VIRODHI PARTIYAN (MAX 6)</h3><div class="cm-grid">' + part(W.opp, 'opp') + '</div></div>' +
        '<div class="cm-card"><h3>KAREEBI / SAATHI PARTIYAN (MAX 8)</h3><div class="cm-grid">' + part(W.allies, 'ally') + '</div><div style="color:#94a3b8;font-size:.82rem;margin-top:8px">Ye sirf ishara hai ki aap kiske kareeb ya khilaf ho. Chunav aap akele ladoge.</div></div>' +
        '<button class="cm-btn g" onclick="CareerMode.toInterest()">AAGE &rarr;</button>', 3, 'CareerMode.screenState()');
}
function toggle(kind, v) {
    var arr = kind === 'ideo' ? W.ideo : (kind === 'opp' ? W.opp : W.allies), mx = kind === 'ideo' ? 3 : (kind === 'opp' ? 6 : 8), i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1); else if (arr.length < mx) arr.push(v); else { alert('Isse zyada nahi chun sakte.'); return; }
    var y = window.scrollY, el = shell(), st = el.scrollTop; screenIdeo(); el.scrollTop = st;
}
function toInterest() {
    if (!W.ideo.length) { alert('Kam se kam ek vichardhara chuno.'); return; }
    W.interest = W.interest || []; screenInterest();
}
function screenInterest() {
    var all = W.interest.indexOf('ALL') >= 0;
    show('Kin States Mein Dilchaspi?', 'Aage chalkar aapki party in jagah ladegi. Poora desh bhi chun sakte ho.',
        '<div class="cm-card"><div class="cm-chip' + (all ? ' sel' : '') + '" style="--c:#facc15;margin-bottom:12px" onclick="CareerMode.toggleInt(\'ALL\')"><b>&#127470;&#127475; Poora Desh</b><small>Lok Sabha (National) tak ka sapna</small></div>' +
        '<div class="cm-grid" style="' + (all ? 'opacity:.4;pointer-events:none' : '') + '">' + STATES.map(function (s) { return '<div class="cm-chip' + (W.interest.indexOf(s) >= 0 ? ' sel' : '') + '" onclick="CareerMode.toggleInt(\'' + Q(s) + '\')"><b>' + E(s) + '</b></div>'; }).join('') + '</div></div>' +
        '<button class="cm-btn g" onclick="CareerMode.toPosts()">AAGE &rarr;</button>', 4, 'CareerMode.screenIdeo()');
}
function toggleInt(s) {
    var a = W.interest, i = a.indexOf(s);
    if (s === 'ALL') { W.interest = i >= 0 ? [] : ['ALL']; } else { if (i >= 0) a.splice(i, 1); else a.push(s); }
    var el = shell(), st = el.scrollTop; screenInterest(); el.scrollTop = st;
}
function toPosts() {
    if (!W.interest.length) { alert('Kam se kam ek state ya Poora Desh chuno.'); return; }
    W.posts = W.posts || {}; W.posts['Rashtriya Adhyaksh'] = W.name; screenPosts();
}
function screenPosts() {
    var rows = POSTS.map(function (p) {
        var v = W.posts[p[0]] || '';
        return '<div class="cm-item"><span class="t"><b>' + E(p[0]) + '</b>' + (p[1] ? ' <span style="color:#fca5a5;font-size:.72rem">zaroori</span>' : '') + '</span>' +
            (p[2] ? '<b style="color:#fde68a">' + E(W.name) + ' (aap)</b>' : '<input class="cm-in" style="max-width:220px;padding:8px 10px;font-size:.9rem" data-post="' + E(p[0]) + '" value="' + E(v) + '" placeholder="Naam" oninput="CareerMode.setPost(this.dataset.post,this.value)"><button class="cm-btn gh sm" onclick="CareerMode.autoPost(\'' + Q(p[0]) + '\')">&#127922;</button>') + '</div>';
    }).join('');
    show('Party Ke Pad Bharo', 'Apni team banao: adhyaksh, mahasachiv, pravakta aur baaki pad.',
        '<div class="cm-card"><h3>PARTY KE PAD</h3>' + rows + '<div class="cm-row"><button class="cm-btn gh sm" onclick="CareerMode.autoAll()">&#127922; Baaki sab apne aap bharo</button></div></div>' +
        '<button class="cm-btn g" onclick="CareerMode.finish()">PARTY TAIYAR HAI &rarr;</button>', 5, 'CareerMode.screenInterest()');
}
function setPost(k, v) { W.posts[k] = v; }
function autoPost(k) { W.posts[k] = nameGen(); screenPosts(); }
function autoAll() { POSTS.forEach(function (p) { if (!p[2] && !(W.posts[p[0]] || '').trim()) W.posts[p[0]] = nameGen(); }); screenPosts(); }
function finish() {
    var miss = POSTS.filter(function (p) { return p[1] && !p[2] && !(W.posts[p[0]] || '').trim(); }).map(function (p) { return p[0]; });
    if (miss.length) { alert('Ye zaroori pad bharo: ' + miss.join(', ')); return; }
    var col = PRESET_LOGOS[Math.max(0, W.logoIdx)][0];
    C = {
        v: 1, done: true, name: W.name, photo: W.photo,
        party: { mine: true, name: W.pname, logoIdx: Math.max(0, W.logoIdx), logoData: W.logoIdx === -1 ? W.logoData : null, color: col },
        state: W.state, ideology: W.ideo.slice(), opp: W.opp.slice(), allies: W.allies.slice(), interest: W.interest.slice(), posts: W.posts,
        res: { funds: 50, image: 20, cadre: 10, ap: 6, strength: 3 }, conn: {}, narr: {}, evCount: {}, crowd: 0, stage: 0,
        results: [], mla: [], mp: [], govStates: [], cycle: 1, started: new Date().toISOString().slice(0, 10)
    };
    save(); UI.tab = 'overview'; UI.msg = { t: 'Party ban gayi! Ab apna pehla chunav ladne ki taiyari karo.', k: 'good' }; hub();
}

// =============================================================
//  HUB
// =============================================================
function seatsWon() { return { mla: C.mla.length, mp: C.mp.length }; }
function badges() {
    var r = C.results, w = function (t) { return r.filter(function (x) { return x.type === t && x.won > 0; }).length; };
    return [
        ['Pehli Jeet', r.some(function (x) { return x.won > 0; })], ['Vidhayak', C.mla.length > 0], ['Saansad', C.mp.length > 0],
        ['5 Saansad', C.mp.length >= 5], ['10 Vidhayak', C.mla.length >= 10], ['Pehle State Mein Sarkar', C.govStates.length > 0], ['3 State Mein Sarkar', C.govStates.length >= 3],
        ['Rashtriya Dal', C.stage >= 4], ['Pradhanmantri', !!C.pm], ['Janta Ke Neta', C.res.image >= 80], ['Mazboot Sanghathan', C.res.cadre >= 80]
    ];
}
function hub() {
    css(); if (!C) return open();
    fixSeatNames();
    if (window.CareerHub && typeof CareerHub.render === 'function') { shell(); return CareerHub.render(); }
    var s = C.stage, tabs = [['overview', 'Mukhya'], ['conn', 'Sampark'], ['fund', 'Funding & Narrative'], ['event', 'Events'], ['org', 'Sanghathan'], ['ach', 'Upalabdhiyan']];
    var body = '<div class="cm-card"><div class="cm-hero" style="--c:' + myCol() + '"><img class="p" src="' + photoOf() + '"><img class="l" src="' + logoOf() + '"><div style="flex:1;min-width:200px"><div style="font-size:1.4rem;font-weight:900">' + E(C.name) + '</div><div style="color:' + myCol() + ';font-weight:800">' + E(C.party.name) + '</div><div style="color:#94a3b8;font-size:.85rem">' + E(C.state) + ' | ' + E(C.ideology.join(', ')) + '</div></div></div>' +
        '<div class="cm-stats"><div class="cm-stat"><small>MLA</small><b>' + C.mla.length + '</b></div><div class="cm-stat"><small>MP</small><b>' + C.mp.length + '</b></div><div class="cm-stat"><small>Sarkar wale state</small><b>' + C.govStates.length + '</b></div>' +
        '<div class="cm-stat"><small>Funds</small><b>' + Math.round(C.res.funds) + ' Cr</b></div><div class="cm-stat"><small>Chhavi</small><b>' + Math.round(C.res.image) + '</b></div><div class="cm-stat"><small>Sanghathan</small><b>' + Math.round(C.res.cadre) + '</b></div><div class="cm-stat"><small>Party ki taqat</small><b>' + C.res.strength.toFixed(1) + '</b></div><div class="cm-stat"><small>Tayyari (AP)</small><b>' + C.res.ap + '/6</b></div></div></div>' +
        (UI.msg ? '<div class="cm-msg ' + (UI.msg.k || '') + '">' + E(UI.msg.t) + '</div>' : '') +
        '<div class="cm-tabs">' + tabs.map(function (t) { return '<button class="cm-tab' + (UI.tab === t[0] ? ' on' : '') + '" onclick="CareerMode.tab(\'' + t[0] + '\')">' + t[1] + '</button>'; }).join('') + '</div>' + tabBody();
    show('Career Hub', 'Political journey: ' + C.party.name, body, 0);
}
function tab(t) { UI.tab = t; UI.msg = null; hub(); }
function tabBody() {
    switch (UI.tab) {
        case 'conn': return tabConn();
        case 'fund': return tabFund();
        case 'event': return tabEvent();
        case 'org': return tabOrg();
        case 'ach': return tabAch();
    }
    return tabOverview();
}
function ladder() {
    return '<div class="cm-ladder">' + STAGES.map(function (st, i) {
        var cls = i < C.stage ? 'done' : (i === C.stage ? 'cur' : 'lock');
        return '<div class="cm-st ' + cls + '"><span class="n">' + (i < C.stage ? '&#10003;' : i + 1) + '</span><span style="flex:1"><b>' + E(st.n) + '</b><small style="display:block;color:#94a3b8">' + E(st.d) + '</small></span></div>';
    }).join('') + '</div>';
}
function ownSeats(kind) {
    var d = (typeof assemblyData !== 'undefined') ? assemblyData[C.state] : null, out = [];
    if (!d) return out;
    if (kind === 'mla') d.features.forEach(function (f) { out.push(f.properties.no + '. ' + f.properties.nm); });
    else { var seen = {}; d.features.forEach(function (f) { var p = f.properties.pc; if (p && !seen[p]) { seen[p] = 1; out.push(p); } }); }
    return out;
}
function costOf(stage, n) { return [5, 10, 3 * n, 1 * n, 1 * n][stage]; }
function teamCap() { return clamp(2 + Math.floor(C.res.strength / 6), 2, LS_SEATS[C.state] || 2); }
function natCap() { return clamp(20 + Math.round(C.res.strength * 4), 20, 543); }
function tabOverview() {
    var s = C.stage, st = STAGES[s], h = '<div class="cm-card"><h3>AAPKI SEEDHI</h3>' + ladder() + '</div><div class="cm-card"><h3>AGLA KADAM: ' + E(st.n.toUpperCase()) + '</h3><p style="color:#cbd5e1;margin-top:0">' + E(st.d) + '</p>';
    if (s === 0) {
        var seats = ownSeats('mla');
        h += '<div style="margin-bottom:10px">Seat: ' + (seats.length ? '<select id="cm-seat" class="cm-select">' + seats.map(function (x) { return '<option>' + E(x) + '</option>'; }).join('') + '</select>' : '<input id="cm-seat" class="cm-in" style="max-width:300px" placeholder="Seat ka naam">') + '</div>' +
            '<div class="cm-row"><button class="cm-btn g" onclick="CareerMode.room(1)">&#127963; Constituency room mein ladna</button><button class="cm-btn" onclick="CareerMode.fight(0)">&#9889; Quick chunav (' + costOf(0, 1) + ' Cr)</button></div>';
    } else if (s === 1) {
        var ps = ownSeats('mp');
        h += '<div style="margin-bottom:10px">Seat: ' + (ps.length ? '<select id="cm-seat" class="cm-select">' + ps.map(function (x) { return '<option>' + E(x) + '</option>'; }).join('') + '</select>' : '<input id="cm-seat" class="cm-in" style="max-width:300px" placeholder="Lok Sabha seat ka naam">') + '</div>' +
            '<div class="cm-row"><button class="cm-btn g" onclick="CareerMode.room(2)">&#127963; Constituency room mein ladna</button><button class="cm-btn" onclick="CareerMode.fight(1)">&#9889; Quick chunav (' + costOf(1, 1) + ' Cr)</button></div>';
    } else if (s === 2) {
        var cap = teamCap();
        h += '<div>Kitni seat par ummeedwar? <b id="cm-nv">' + Math.min(3, cap) + '</b> <small style="color:#94a3b8">(max ' + cap + ' abhi ki taqat se)</small></div><input id="cm-n" type="range" min="2" max="' + cap + '" value="' + Math.min(3, cap) + '" style="width:min(420px,100%)" oninput="document.getElementById(\'cm-nv\').textContent=this.value">' +
            '<div class="cm-row" style="margin-top:8px"><button class="cm-btn" onclick="CareerMode.fightN(2)">&#9889; Chunav ladna (3 Cr per seat)</button></div>';
    } else if (s === 3) {
        var ints = C.interest.indexOf('ALL') >= 0 ? STATES.slice() : C.interest.slice();
        h += '<div style="margin-bottom:8px">Kin states mein ladna hai?</div><div class="cm-grid" style="margin-bottom:10px">' + ints.map(function (x) { return '<label class="cm-chip" style="cursor:pointer"><input type="checkbox" class="cm-st-ck" value="' + E(x) + '"' + (x === C.state ? ' checked' : '') + '> <b style="display:inline">' + E(x) + '</b><small>' + VS_SEATS[x] + ' seat</small></label>'; }).join('') + '</div>' +
            '<div>Har state ki kitne % seat par ladoge? <b id="cm-nv">25</b>%</div><input id="cm-n" type="range" min="10" max="80" step="5" value="25" style="width:min(420px,100%)" oninput="document.getElementById(\'cm-nv\').textContent=this.value">' +
            '<div class="cm-row" style="margin-top:8px"><button class="cm-btn" onclick="CareerMode.fightMulti()">&#9889; Chunav ladna (1 Cr per seat)</button></div>';
    } else {
        var nc = natCap();
        h += '<div>Poore desh mein kitni Lok Sabha seat par? <b id="cm-nv">' + Math.min(100, nc) + '</b> <small style="color:#94a3b8">(max ' + nc + ')</small></div><input id="cm-n" type="range" min="20" max="' + nc + '" value="' + Math.min(100, nc) + '" style="width:min(420px,100%)" oninput="document.getElementById(\'cm-nv\').textContent=this.value">' +
            '<div class="cm-row" style="margin-top:8px"><button class="cm-btn o" onclick="CareerMode.fightN(4)">&#9889; Rashtriya chunav (1 Cr per seat)</button></div>';
    }
    h += '</div>';
    h += '<div class="cm-card"><h3>ROOM KA NATIJA DARJ KARO (TEST)</h3><div class="cm-row"><select id="cm-rt" class="cm-select"><option value="MLA">MLA</option><option value="MP">MP</option></select><input id="cm-rs" class="cm-in" style="max-width:220px" placeholder="Seat ka naam"><select id="cm-rw" class="cm-select"><option value="1">Jeet</option><option value="0">Haar</option></select><button class="cm-btn gh sm" onclick="CareerMode.manual()">Darj karo</button></div><small style="color:#94a3b8">Jab MLA/MP room taiyar hoga to wo khud CareerMode.reportResult() bulayega.</small></div>';
    return h;
}
function manual() {
    reportResult({ type: document.getElementById('cm-rt').value, seat: document.getElementById('cm-rs').value || 'Seat', state: C.state, won: document.getElementById('cm-rw').value === '1' });
}
function room(t) {
    var seat = (document.getElementById('cm-seat') || {}).value || '';
    window.CAREER_CONTEXT = { type: t === 1 ? 'MLA' : 'MP', candidate: C.name, party: C.party.name, logo: logoOf(), color: C.party.color, state: C.state, seat: seat, photo: photoOf() };
    if (typeof openConstituency === 'function') { close(); openConstituency(t); }
}

// ---------- tayyari ----------
function useAp(cost, funds) {
    if (C.res.ap < 1) { UI.msg = { t: 'Tayyari ke ghante khatam. Pehle chunav ladkar naya daur shuru karo.', k: 'bad' }; hub(); return false; }
    if (C.res.funds < funds) { UI.msg = { t: 'Funds kam hain (' + funds + ' Cr chahiye).', k: 'bad' }; hub(); return false; }
    C.res.ap -= 1; C.res.funds -= funds; return true;
}
function connScore() { var t = 0; Object.keys(C.conn).forEach(function (k) { t += C.conn[k]; }); return Math.min(8, t); }
function tabConn() {
    var ps = allParties();
    return '<div class="cm-card"><h3>DOOSRI PARTIYON SE SAMPARK (4 CR, 1 AP)</h3><p style="color:#94a3b8;margin-top:0">Kareebi partiyon se sampark sabse asaan hai. Virodhi se nahi ho sakta. Har sampark chhavi aur jeet ki sambhavna badhata hai.</p>' +
        ps.map(function (p) {
            var lv = C.conn[p.n] || 0, isOpp = C.opp.indexOf(p.n) >= 0, isAlly = C.allies.indexOf(p.n) >= 0;
            return '<div class="cm-item" style="border-left:5px solid ' + p.c + '"><span class="t"><b>' + E(p.n) + '</b><small>' + (isOpp ? 'Virodhi' : (isAlly ? 'Kareebi' : 'Tatastha')) + ' | Rishta: ' + '&#9829;'.repeat(lv) + '&#9825;'.repeat(3 - lv) + '</small></span><button class="cm-btn sm"' + (isOpp || lv >= 3 ? ' disabled' : '') + ' onclick="CareerMode.connect(\'' + Q(p.n) + '\')">' + (lv >= 3 ? 'Pakka' : 'Sampark') + '</button></div>';
        }).join('') + '</div>';
}
function connect(n) {
    if (!useAp(1, 4)) return;
    var ok = Math.random() < (C.allies.indexOf(n) >= 0 ? 0.85 : 0.45);
    if (ok) { C.conn[n] = (C.conn[n] || 0) + 1; C.res.image = clamp(C.res.image + 2, 0, 100); UI.msg = { t: n + ' ke neta se baat bani. Rishta majboot hua.', k: 'good' }; }
    else { C.res.image = clamp(C.res.image - 1, 0, 100); UI.msg = { t: n + ' ne abhi samay nahi diya.', k: 'bad' }; }
    save(); hub();
}
function tabFund() {
    return '<div class="cm-card"><h3>NARRATIVE (1 AP)</h3><p style="color:#94a3b8;margin-top:0">Aisi kahani chalao jo aapki chhavi banaye. Vichardhara se mel khane par chanda bhi milta hai. Har narrative ek daur mein 2 baar.</p>' +
        NARRATIVES.map(function (x) {
            var fit = x.tags.some(function (t) { return C.ideology.indexOf(t) >= 0; }), cnt = C.narr[x.id] || 0;
            return '<div class="cm-item"><span class="t"><b>' + E(x.n) + '</b><small>Kharch ' + x.cost + ' Cr | chhavi +' + (fit ? x.img + 3 : x.img) + (fit ? ' | vichardhara se mel: chanda +' + x.fund + ' Cr' : '') + '</small></span><button class="cm-btn sm"' + (cnt >= 2 ? ' disabled' : '') + ' onclick="CareerMode.narr(\'' + x.id + '\')">' + (cnt >= 2 ? 'Ho chuka' : 'Chalao') + '</button></div>';
        }).join('') + '</div>' +
        '<div class="cm-card"><h3>CROWDFUNDING</h3><div class="cm-item"><span class="t"><b>Janta se chanda</b><small>Ek daur mein ek baar | chhavi jitni zyada, utna chanda</small></span><button class="cm-btn sm g"' + (C.crowd ? ' disabled' : '') + ' onclick="CareerMode.crowd()">' + (C.crowd ? 'Ho chuka' : 'Shuru karo') + '</button></div></div>';
}
function narr(id) {
    var x = NARRATIVES.filter(function (n) { return n.id === id; })[0];
    if ((C.narr[id] || 0) >= 2 || !useAp(1, x.cost)) return;
    var fit = x.tags.some(function (t) { return C.ideology.indexOf(t) >= 0; });
    C.narr[id] = (C.narr[id] || 0) + 1; C.res.image = clamp(C.res.image + x.img + (fit ? 3 : 0), 0, 100);
    if (fit) C.res.funds += x.fund;
    UI.msg = { t: '"' + x.n + '" narrative chala: chhavi badhi' + (fit ? ' aur ' + x.fund + ' Cr chanda aaya.' : '.'), k: 'good' }; save(); hub();
}
function crowd() {
    if (C.crowd) return; C.crowd = 1;
    var a = Math.round(5 + C.res.image / 8); C.res.funds += a; UI.msg = { t: 'Janta ne ' + a + ' Cr ka chanda diya.', k: 'good' }; save(); hub();
}
function tabEvent() {
    return '<div class="cm-card"><h3>EVENT / PROTEST (1 AP)</h3><p style="color:#94a3b8;margin-top:0">Sanghathan aur chhavi banao. Kuch events mein jokhim bhi hai.</p>' + EVENTS.map(function (x) {
        return '<div class="cm-item"><span class="t"><b>' + E(x.n) + '</b><small>Kharch ' + x.cost + ' Cr | chhavi +' + x.img + ' | sanghathan +' + x.cad + (x.risk ? ' | jokhim ' + Math.round(x.risk * 100) + '%' : '') + '</small></span><button class="cm-btn sm o" onclick="CareerMode.event(\'' + x.id + '\')">Karo</button></div>';
    }).join('') + '</div>';
}
function event(id) {
    var x = EVENTS.filter(function (e) { return e.id === id; })[0];
    if (!useAp(1, x.cost)) return;
    C.res.cadre = clamp(C.res.cadre + x.cad, 0, 100);
    if (x.risk && Math.random() < x.risk) { C.res.image = clamp(C.res.image + x.img - 7, 0, 100); UI.msg = { t: x.n + ' hua, par ' + x.riskT, k: 'bad' }; }
    else { C.res.image = clamp(C.res.image + x.img, 0, 100); UI.msg = { t: x.n + ' safal raha!', k: 'good' }; }
    save(); hub();
}
function tabOrg() {
    return '<div class="cm-card"><h3>PARTY KA SANGHATHAN</h3>' + POSTS.map(function (p) {
        var v = p[2] ? C.name : (C.posts[p[0]] || '(khaali)');
        return '<div class="cm-item"><span class="t"><small>' + E(p[0]) + '</small><b>' + E(v) + '</b></span></div>';
    }).join('') + '</div>';
}
function tabAch() {
    var b = badges(), h = '<div class="cm-card"><h3>BADGE</h3>' + b.map(function (x) { return '<span class="cm-badge' + (x[1] ? '' : ' off') + '">' + E(x[0]) + '</span>'; }).join('') + '</div>';
    h += '<div class="cm-card"><h3>MLA (' + C.mla.length + ')</h3>' + seatGroupsHtml(C.mla, 'MLA') + '</div>';
    h += '<div class="cm-card"><h3>MP (' + C.mp.length + ')</h3>' + seatGroupsHtml(C.mp, 'MP') + '</div>';
    if ((C.played || []).length) h += '<div class="cm-card"><h3>WAR-ROOM MEIN KHELE CHUNAV</h3>' + C.played.slice().reverse().slice(0, 12).map(function (x) {
        var t = x.k === 'ls' ? 'Lok Sabha (rashtriya)' : x.state + ' vidhan sabha';
        return '<div class="cm-item"><span class="t"><b>' + E(t) + '</b><small>' + x.seats + (x.n ? ' / ' + x.n : '') + ' seat jeete | daur ' + x.cycle + (x.diff ? ' | ' + E(x.diff) : '') + '</small></span><b style="color:' + (x.gov ? '#4ade80' : '#fbbf24') + '">' + (x.gov ? (x.cm ? 'MUKHYAMANTRI' : (x.k === 'ls' ? 'SARKAR' : 'SARKAR')) : 'VIPAKSH') + '</b></div>';
    }).join('') + '</div>';
    h += '<div class="cm-card"><h3>SARKAR WALE STATE (' + C.govStates.length + ')</h3>' + (C.govStates.length ? C.govStates.map(function (x) { return '<span class="cm-badge">' + E(x) + '</span>'; }).join('') : '<div style="color:#94a3b8">Abhi kisi state mein sarkar nahi.</div>') + '</div>';
    h += '<div class="cm-card"><h3>CHUNAV ITIHAS</h3>' + (C.results.length ? C.results.slice().reverse().slice(0, 15).map(function (x) { return '<div class="cm-item"><span class="t"><b>' + E(x.label) + '</b><small>' + E(x.detail) + '</small></span><b style="color:' + (x.won > 0 ? '#4ade80' : '#f87171') + '">' + (x.won > 0 ? 'JEET' : 'HAAR') + '</b></div>'; }).join('') : '<div style="color:#94a3b8">Abhi koi chunav nahi ladi.</div>') + '</div>';
    h += '<div class="cm-card"><button class="cm-btn gh sm" onclick="CareerMode.reset()">Career dobara shuru karo</button></div>';
    return h;
}
function reset() { if (confirm('Poora career hat jayega. Pakka?')) { try { localStorage.removeItem(KEY); } catch (e) {} C = null; W = {}; screenIntro(); } }

// =============================================================
//  CHUNAV (quick) + natija
// =============================================================
function pSeat(stage) {
    var base = [0.3, 0.22, 0.18, 0.15, 0.12][stage];
    var p = base + C.res.image * 0.003 + C.res.cadre * 0.003 + Math.min(C.res.funds, 150) * 0.0006 + connScore() * 0.012 + C.res.strength * 0.0035;
    if (window.CareerHub && CareerHub.bonus) p += CareerHub.bonus();
    return clamp(p, 0.05, 0.88);
}
function binom(n, p) { var k = 0; for (var i = 0; i < n; i++) if (Math.random() < p) k++; return k; }
function endCycle(won) {
    if (window.CareerHub && CareerHub.onCycle) { try { CareerHub.onCycle(won, C._ctx); } catch (e) { console.warn('hub onCycle', e); } }
    C._ctx = null;
    C.res.ap = 6; C.crowd = 0; C.narr = {}; C.res.funds += 10; C.cycle++;
    C.res.image = clamp(C.res.image + (won ? 5 : -3), 0, 100);
}
function pushRes(type, label, detail, won) { C.results.push({ type: type, label: label, detail: detail, won: won, cycle: C.cycle }); }
function resultCard(title, sub, line, good, btn) {
    show('Chunav Natija', '', '<div class="cm-res"><div style="font-size:3rem">' + (good ? '&#127942;' : '&#128532;') + '</div><div style="color:#fde68a;font-weight:800;letter-spacing:3px">' + E(title) + '</div><h2>' + E(sub) + '</h2><p style="color:#e2e8f0">' + E(line) + '</p><button class="cm-btn g" onclick="CareerMode.tab(\'overview\')">' + (btn || 'CAREER HUB') + '</button></div>', 0);
}
function fight(stage) {
    var seat = (document.getElementById('cm-seat') || {}).value || ''; if (!seat) { alert('Seat ka naam likho/chuno.'); return; }
    var cost = costOf(stage, 1); if (C.res.funds < cost) { UI.msg = { t: 'Chunav ke liye ' + cost + ' Cr chahiye. Pehle funding badhao.', k: 'bad' }; hub(); return; }
    C.res.funds -= cost;
    var won = Math.random() < pSeat(stage), type = stage === 0 ? 'MLA' : 'MP';
    applySingle(type, seat, C.state, won, true);
}
function applySingle(type, seat, state, won, showIt) {
    seat = String(seat).replace(/^\d+\.\s*/, '');
    C._ctx = { kind: type, states: [state], all: false };
    pushRes(type, type + ': ' + seat, state, won ? 1 : 0);
    if (won) {
        addSeat(type === 'MLA' ? 'MLA' : 'MP', state, seat);
        C.own = { type: type, seat: seat, state: state };
        C.res.strength += type === 'MLA' ? 6 : 8; C.res.funds += 10; C.res.cadre = clamp(C.res.cadre + 5, 0, 100);
        if ((type === 'MLA' && C.stage === 0) || (type === 'MP' && C.stage === 1)) C.stage++;
    }
    endCycle(won); save();
    if (showIt) resultCard(won ? 'JEET!' : 'HAAR', won ? seat + ' ke ' + (type === 'MLA' ? 'vidhayak' : 'saansad') + ' bane!' : seat + ' mein haar', won ? 'Party ki taqat badhi. Agli seedhi khul gayi.' : 'Chhavi ghati. Taiyari karke dobara ladiye.', won);
}
function fightN(stage) {
    var n = parseInt(document.getElementById('cm-n').value, 10), cost = costOf(stage, n);
    if (C.res.funds < cost) { UI.msg = { t: 'Is chunav ke liye ' + cost + ' Cr chahiye (abhi ' + Math.round(C.res.funds) + ').', k: 'bad' }; hub(); return; }
    C.res.funds -= cost;
    C._ctx = stage === 4 ? { kind: 'MP', states: [], all: true } : { kind: 'MP', states: [C.state], all: false };
    var p = pSeat(stage) / (1 + 0.012 * (n - 1)) , won = binom(n, p);
    if (stage === 2) {
        pushRes('MP', 'Lok Sabha: ' + n + ' seat', C.state + ': ' + won + ' jeete', won);
        addRandomSeats('MP', C.state, won);
        C.res.strength += won * 2.5; if (won > 0) C.stage = 3;
        endCycle(won > 0); save();
        resultCard(won > 0 ? 'JEET' : 'HAAR', won + ' / ' + n + ' seat jeete', won > 0 ? 'Aapki party ab sansad mein badi taqat hai.' : 'Is baar kuch haath nahi laga.', won > 0);
    } else {
        var pm = won >= 272;
        pushRes('NAT', 'Rashtriya Lok Sabha chunav: ' + n + ' seat', won + ' jeete', won);
        addNationalSeats(won);
        C.res.strength += won * 0.4; if (pm) C.pm = true;
        endCycle(won > 0); save();
        resultCard(pm ? 'PRADHANMANTRI!' : (won > 0 ? 'JEET' : 'HAAR'), won + ' / ' + n + ' seat jeete', pm ? 'Aapki party ko bahumat mila. Aap desh ke Pradhanmantri hain!' : 'Bahumat ke liye 272 chahiye. Taiyari karke dobara ladiye.', pm || won > 0);
    }
}
function fightMulti() {
    var cks = [].slice.call(document.querySelectorAll('.cm-st-ck')).filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
    if (!cks.length) { alert('Kam se kam ek state chuno.'); return; }
    var pct = parseInt(document.getElementById('cm-n').value, 10) / 100, tot = 0, plan = cks.map(function (s) { var n = Math.max(1, Math.round(VS_SEATS[s] * pct)); tot += n; return { s: s, n: n }; });
    var cost = costOf(3, tot);
    if (C.res.funds < cost) { UI.msg = { t: 'Kul ' + tot + ' seat ke liye ' + cost + ' Cr chahiye (abhi ' + Math.round(C.res.funds) + ').', k: 'bad' }; hub(); return; }
    C.res.funds -= cost;
    C._ctx = { kind: 'MLA', states: cks.slice(), all: false };
    var lines = [], allWon = 0;
    plan.forEach(function (x) {
        var p = pSeat(3) / (1 + 0.004 * (tot - 1)), w = binom(x.n, p), maj = Math.floor(VS_SEATS[x.s] / 2) + 1;
        allWon += w;
        if (w >= maj && C.govStates.indexOf(x.s) < 0) C.govStates.push(x.s);
        addRandomSeats('MLA', x.s, w);
        lines.push(x.s + ': ' + w + '/' + x.n + (w >= maj ? ' (SARKAR)' : ''));
    });
    pushRes('MULTI', 'Kai state chunav (' + plan.length + ' state)', lines.join(' | '), allWon);
    C.res.strength += allWon * 0.3; if (allWon > 0) C.stage = 4;
    endCycle(allWon > 0); save();
    resultCard(allWon > 0 ? 'JEET' : 'HAAR', allWon + ' seat jeete', lines.join('  |  '), allWon > 0);
}

// ---------- asli seat naam (ab "seat 23" jaisa placeholder nahi) ----------
function seatPool(kind, state) {
    var out = [], st = lsStateName(state), d = (typeof assemblyData !== 'undefined') ? assemblyData[st] : null;
    if (d) {
        if (kind === 'MLA') d.features.forEach(function (f) { out.push(f.properties.nm); });
        else { var seen = {}; d.features.forEach(function (f) { var p = f.properties.pc; if (p && !seen[p]) { seen[p] = 1; out.push(p); } }); }
    }
    if (!out.length && kind === 'MP' && typeof indiaData !== 'undefined') indiaData.features.forEach(function (f) { var p = f.properties; if (p.st_name === state || p.st_name === st) out.push(p.pc_name); });
    return out;
}
function allPCs() { var out = []; if (typeof indiaData !== 'undefined') indiaData.features.forEach(function (f) { out.push({ state: f.properties.st_name, seat: f.properties.pc_name }); }); return out; }
function ownedSet(kind) { var o = {}; (kind === 'MLA' ? C.mla : C.mp).forEach(function (x) { o[x.state + '|' + x.seat] = 1; }); return o; }
function addSeat(kind, state, seat, extra) {
    var list = kind === 'MLA' ? C.mla : C.mp; seat = String(seat).replace(/^\d+\.\s*/, '');
    if (list.some(function (x) { return x.state === state && x.seat === seat; })) return false;
    var r = { seat: seat, state: state, cycle: C.cycle }; if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; });
    list.push(r); return true;
}
function addRandomSeats(kind, state, n) {
    var have = ownedSet(kind), pool = seatPool(kind, state).filter(function (x) { return !have[state + '|' + x]; }), added = 0;
    while (added < n && pool.length) { var i = Math.floor(Math.random() * pool.length); if (addSeat(kind, state, pool.splice(i, 1)[0])) added++; }
    return added;
}
function addNationalSeats(n) {
    var have = ownedSet('MP'), pool = allPCs().filter(function (x) { return !have[x.state + '|' + x.seat]; }), added = 0;
    while (added < n && pool.length) { var i = Math.floor(Math.random() * pool.length), x = pool.splice(i, 1)[0]; if (addSeat('MP', x.state, x.seat)) added++; }
    return added;
}
function randomSeat(kind, state) {
    var have = ownedSet(kind), pool = seatPool(kind, state).filter(function (x) { return !have[state + '|' + x]; });
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
function isFake(x) { return /\sseat \d+$/.test(x.seat) || /^Rashtriya seat/.test(x.seat) || x.seat === x.state; }
function fixSeatNames() {
    if (!C || C._seatFix) return;
    ['MLA', 'MP'].forEach(function (kind) {
        var list = kind === 'MLA' ? C.mla : C.mp, have = {};
        list.forEach(function (x) { x.seat = String(x.seat).replace(/^\d+\.\s*/, ''); if (!isFake(x)) have[x.state + '|' + x.seat] = 1; });
        var pools = {}, nat = null;
        list.forEach(function (x) {
            if (!isFake(x)) return;
            if (x.state === 'Poora desh') {
                nat = nat || allPCs().filter(function (p) { return !have[p.state + '|' + p.seat]; });
                if (!nat.length) return; var p = nat.splice(Math.floor(Math.random() * nat.length), 1)[0];
                x.state = p.state; x.seat = p.seat; have[p.state + '|' + p.seat] = 1; return;
            }
            pools[x.state] = pools[x.state] || seatPool(kind, x.state).filter(function (n) { return !have[x.state + '|' + n]; });
            if (!pools[x.state].length) return;
            var nm = pools[x.state].splice(Math.floor(Math.random() * pools[x.state].length), 1)[0]; x.seat = nm; have[x.state + '|' + nm] = 1;
        });
        var fixed = list.filter(function (x) { return !isFake(x); });
        if (kind === 'MLA') C.mla = fixed; else C.mp = fixed;
    });
    C._seatFix = 1; save();
}
function seatGroupsHtml(list, label) {
    if (!list.length) return '<div style="color:#94a3b8">Abhi koi ' + label + ' nahi.</div>';
    var by = {}, own = C.own || {}, ownSeat = String(own.seat || '').replace(/^\d+\.\s*/, '');
    list.forEach(function (x) { (by[x.state] = by[x.state] || []).push(x); });
    return Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; }).map(function (st) {
        var names = by[st].map(function (x) { return E(x.seat) + (own.state === st && ownSeat === x.seat ? ' &#9733;' : ''); }).join(', ');
        return '<div class="cm-item"><span class="t"><b>' + E(st) + ' (' + by[st].length + ')</b><small style="display:block;line-height:1.5;white-space:normal">' + names + '</small></span></div>';
    }).join('') + (own.seat ? '<div style="color:#94a3b8;font-size:.8rem;margin-top:6px">&#9733; = sansthapak ki apni seat</div>' : '');
}
function stateOptions() {
    var have = (typeof assemblyData !== 'undefined') ? Object.keys(assemblyData) : [];
    var ints = C.interest.indexOf('ALL') >= 0 ? STATES.slice() : C.interest.slice();
    if (ints.indexOf(C.state) < 0) ints.unshift(C.state);
    return ints.filter(function (x) { return have.indexOf(lsStateName(x)) >= 0; });
}
function fightState(st) {
    if (!window.SAC || !SAC.careerFight) { alert('State Assembly module load nahi hua.'); return; }
    var n = lsStateName(st); close(); SAC.careerFight(n);
}
// Sarkar ki jankari (CM, upmukhyamantri, mantri) har state ke liye
function govFor(st) {
    C.govInfo = C.govInfo || {};
    if (C.govInfo[st]) return C.govInfo[st];
    var rn = function () { return typeof randName === 'function' ? randName() : 'Neta'; };
    var mins = ['Vitt', 'Swasthya', 'Shiksha', 'Krishi', 'Sadak Nirman (PWD)', 'Urja', 'Rajasva', 'Nagar Vikas'];
    var cm = st === C.state ? C.name : rn();
    var cab = [{ min: 'Mukhyamantri (Grih)', name: cm, party: C.party.name }, { min: 'Upmukhyamantri', name: rn(), party: C.party.name }, { min: 'Upmukhyamantri', name: rn(), party: C.party.name }];
    mins.forEach(function (m) { cab.push({ min: m, name: rn(), party: C.party.name }); });
    C.govInfo[st] = { cm: cm, cmParty: C.party.name, cabinet: cab, alliance: C.party.name, cycle: C.cycle };
    save(); return C.govInfo[st];
}
// State assembly war-room ka natija career mein
function reportStateElection(info) {
    if (!C) load(); if (!C || !C.party || C.party.name !== info.party) return;
    var st = info.state, won = info.won || [], isNew = 0, gov = !!info.gov;
    C._ctx = { kind: 'MLA', states: [st], all: false };
    won.forEach(function (w) { if (addSeat('MLA', st, w.seat, { src: 'game' })) isNew++; });
    if (gov && C.govStates.indexOf(st) < 0) C.govStates.push(st);
    if (gov) { C.govInfo = C.govInfo || {}; if (info.cabinet && info.cabinet.length) C.govInfo[st] = { cm: info.cm, cmParty: info.cmParty, cabinet: info.cabinet, alliance: info.alliance, mood: info.mood || {}, cycle: C.cycle }; else govFor(st); }
    C.res.strength += isNew * 0.3 + (gov ? 4 : 0);
    if (won.length && C.stage === 0) C.stage = 1;
    if (gov && C.stage < 3) C.stage = 3;
    var cm = gov && info.cm && info.cm === C.name;
    pushRes('STATE', 'Vidhan sabha: ' + st + ' (war-room)', won.length + ' / ' + info.n + ' seat' + (gov ? ' | SARKAR' : '') + (cm ? ' | aap Mukhyamantri' : ''), won.length);
    C.played = C.played || []; C.played.push({ k: 'state', state: st, seats: won.length, n: info.n, gov: gov, cm: !!cm, diff: info.diff, cycle: C.cycle });
    endCycle(won.length > 0 || gov); save();
    UI.msg = { t: st + ': ' + won.length + ' seat jeete' + (gov ? ', sarkar bani!' : '') + '. Career mein darj ho gaya.', k: won.length ? 'good' : 'bad' };
}
// Lok Sabha war-room ka natija career mein
function reportNational(info) {
    if (!C) load(); if (!C || !C.party || C.party.name !== info.party) return;
    var seats = info.seats || [], isNew = 0;
    C._ctx = { kind: 'MP', states: [], all: true };
    seats.forEach(function (x) { if (addSeat('MP', x.state, x.seat, { src: 'game' })) isNew++; });
    C.res.strength += isNew * 0.4 + (info.gov ? 8 : 0);
    if (info.gov && info.pm) C.pm = true;
    if (C.stage < 4 && seats.length >= 20) C.stage = 4;
    pushRes('NAT', 'Lok Sabha chunav (war-room)', seats.length + ' seat jeete' + (info.gov ? ' | SARKAR' : '') + (info.pm ? ' | aapki party ka PM' : ''), seats.length);
    C.played = C.played || []; C.played.push({ k: 'ls', seats: seats.length, n: 543, gov: !!info.gov, cm: false, cycle: C.cycle });
    endCycle(seats.length > 0); save();
    UI.msg = { t: 'Lok Sabha: ' + seats.length + ' seat jeete' + (info.gov ? ', sarkar bani!' : '') + '. Career mein darj ho gaya.', k: seats.length ? 'good' : 'bad' };
}

// ---------- bahari room ke liye hook ----------
function reportResult(r) {
    if (!C) load(); if (!C) return;
    var type = (r.type || 'MLA').toUpperCase(), won = !!r.won;
    applySingle(type === 'MP' ? 'MP' : 'MLA', r.seat || 'Seat', r.state || C.state, won, false);
    UI.msg = { t: (won ? 'Jeet darj hui: ' : 'Haar darj hui: ') + (r.seat || 'Seat'), k: won ? 'good' : 'bad' };
    if (r.quiet) return;
    UI.tab = 'overview'; hub();
}

// =============================================================
//  EXPORT + HOOK
// =============================================================
var CORE = {
    get: function () { return C; }, save: save, shell: shell, close: close, E: E, Q: Q, clamp: clamp, pick: pick, nameGen: nameGen,
    myCol: myCol, photoOf: photoOf, logoOf: logoOf, allParties: allParties, initials: initials,
    STATES: STATES, LS_SEATS: LS_SEATS, VS_SEATS: VS_SEATS, POSTS: POSTS, STAGES: STAGES, lsStateName: lsStateName,
    tabOverview: function () { return tabOverview(); }, tabAch: function () { return tabAch(); },
    takeMsg: function () { var m = UI.msg; UI.msg = null; return m; },
    resizeImg: resizeImg, avatarUri: avatarUri, setPhoto: function (d) { if (C) { C.photo = d; save(); } },
    stateOptions: stateOptions, fightState: fightState, logoUri: logoUri, setLogo: function (d) { if (C) { C.party.logoData = d; C.party.logoIdx = -1; save(); } }, setLogoIdx: function (i) { if (C) { C.party.logoData = null; C.party.logoIdx = i; save(); } }, govFor: govFor, addSeat: addSeat, randomSeat: randomSeat
};
window.CareerMode = {
    _core: CORE,
    open: open, close: close, hasParty: API.hasParty, getParty: API.getParty, inState: API.inState, mlaCount: function (st) { try { if (!C) load(); if (!C || !C.party) return null; var tot = VS_SEATS[st] || VS_SEATS[lsStateName(st)] || 0; return { n: C.mla.filter(function (x) { return x.state === st || lsStateName(x.state) === lsStateName(st); }).length, total: tot, party: C.party.name }; } catch (e) { return null; } }, perks: function () { try { return window.CareerHub && CareerHub.perks ? CareerHub.perks() : {}; } catch (e) { return {}; } }, logoFor: function (n) { try { if (!C) load(); return C && C.party && C.party.name === n ? logoOf() : null; } catch (e) { return null; } }, photoFor: function (n) { try { if (!C) load(); return C && C.name === n ? photoOf() : null; } catch (e) { return null; } }, partyShare: API.partyShare, leaders: API.leaders, reportResult: reportResult, reportStateElection: reportStateElection, reportNational: reportNational, fightState: fightState,
    setAv: setAv, setName: setName, upload: upload, toParty: toParty, screenIntro: screenIntro, screenParty: screenParty, pickExisting: pickExisting, screenCreate: screenCreate,
    setLogo: setLogo, setPname: setPname, toState: toState, setState: setState, toIdeo: toIdeo, screenIdeo: screenIdeo, toggle: toggle, toInterest: toInterest, screenInterest: screenInterest,
    toggleInt: toggleInt, toPosts: toPosts, setPost: setPost, autoPost: autoPost, autoAll: autoAll, finish: finish, screenState: screenState,
    tab: tab, connect: connect, narr: narr, crowd: crowd, event: event, fight: fight, fightN: fightN, fightMulti: fightMulti, room: room, manual: manual, reset: reset
};
var _prevCS = window.showComingSoon;
window.showComingSoon = function (n) {
    if (/career|carrier/i.test(String(n))) { open(); return; }
    if (typeof _prevCS === 'function') return _prevCS.apply(this, arguments);
};
load(); registerParty();
})();
