/* ===================================================================
   RAJNITI - FIGHT IN YOUR CONSTITUENCY (MLA + MP)
   Alag file: constituency.js  (script.js, assembly-data.js, state-assembly.js, career-mode.js ke BAAD load karo)
   Dashboard ke "Fight in your constituency (M.L.A / M.P)" dono box isi ko kholte hain.
   Career Hub se aane par state / seat / party wale step skip ho jaate hain (window.CAREER_CONTEXT).
   =================================================================== */
(function () {
'use strict';

var ROUNDS = 4;
var DIFFS = { easy: ['Aasaan', 0.7, 1.15], normal: ['Normal', 1.0, 1.0], hard: ['Mushkil', 1.25, 0.9], brutal: ['Bahut Mushkil', 1.5, 0.82] }; // [naam, virodhi growth, aapka asar]
var REL = { 'Uttar Pradesh': [19, 0.2, 0.3], 'Bihar': [17, 1.2, 0.1], 'West Bengal': [27, 0.6, 0.1], 'Assam': [34, 3.7, 0.1], 'Kerala': [27, 18, 0], 'Jammu & Kashmir': [68, 0.3, 1], 'Punjab': [2, 1.3, 58], 'Meghalaya': [4.4, 75, 0], 'Nagaland': [2.5, 88, 0], 'Mizoram': [1.4, 87, 0], 'Manipur': [8.4, 41, 0], 'Goa': [8, 25, 0], 'Arunachal Pradesh': [2, 30, 0], 'Karnataka': [13, 2, 0], 'Maharashtra': [12, 1, 0.2], 'Madhya Pradesh': [7, 0.3, 0.2], 'Odisha': [2, 2.8, 0], 'Jharkhand': [15, 4, 0.2], 'Chhattisgarh': [2, 1.9, 0.3], 'Haryana': [7, 0.2, 5], 'Delhi': [13, 0.9, 3.4], 'Andhra Pradesh': [9, 2.5, 0], 'Telangana': [12, 1.5, 0], 'Tamil Nadu': [6, 6, 0], 'Gujarat': [9, 0.5, 0], 'Rajasthan': [9, 0.1, 1.3], 'Uttarakhand': [14, 0.4, 2.5], 'Himachal Pradesh': [2, 0.2, 1], 'Tripura': [9, 4, 0], 'Sikkim': [1.6, 10, 0], 'Puducherry': [6, 6, 0] };
var TRIBAL = { 'Arunachal Pradesh': 65, 'Meghalaya': 86, 'Nagaland': 87, 'Mizoram': 94, 'Manipur': 40, 'Jharkhand': 26, 'Chhattisgarh': 31, 'Odisha': 23, 'Madhya Pradesh': 21, 'Tripura': 31, 'Sikkim': 34, 'Assam': 12, 'Gujarat': 15, 'Rajasthan': 13, 'Maharashtra': 9, 'Andhra Pradesh': 7, 'Telangana': 9, 'Karnataka': 7, 'West Bengal': 6 };
var GROUPS = [['sav', 'Savarn (Hindu)'], ['obc', 'OBC (Hindu)'], ['sc', 'SC (Hindu)'], ['st', 'ST (Hindu)'], ['mus', 'Muslim'], ['chr', 'Christian'], ['sik', 'Sikh'], ['oth', 'Anya']];
var AFF = {
 'BJP': { sav: 3, obc: 2, sc: 1, st: 1.3, mus: 0.2, chr: 0.4, sik: 0.8, oth: 1 }, 'Congress': { sav: 1.2, obc: 1.2, sc: 1.5, st: 1.6, mus: 2.2, chr: 2.2, sik: 1.2, oth: 1 },
 'Samajwadi Party': { sav: 0.4, obc: 2.4, sc: 1, st: 0.8, mus: 3, chr: 1, sik: 1, oth: 1 }, 'BSP': { sav: 0.6, obc: 0.8, sc: 3.2, st: 0.8, mus: 1.1, chr: 1, sik: 1, oth: 1 },
 'RJD': { sav: 0.3, obc: 2, sc: 1, st: 1, mus: 2.6, chr: 1, sik: 1, oth: 1 }, 'TMC': { sav: 1.2, obc: 1.4, sc: 1.5, st: 1.3, mus: 2.5, chr: 1.5, sik: 1, oth: 1 },
 'DMK': { sav: 0.5, obc: 2.2, sc: 1.8, st: 1, mus: 1.2, chr: 1.5, sik: 1, oth: 1 }, 'AAP': { sav: 1.2, obc: 1.2, sc: 1.4, st: 0.9, mus: 1.1, chr: 1, sik: 1.6, oth: 1 },
 'CPI(M)': { sav: 0.8, obc: 1.3, sc: 1.6, st: 1.2, mus: 1, chr: 1.2, sik: 1, oth: 1 }, 'AIMIM': { sav: 0.05, obc: 0.1, sc: 0.2, st: 0.1, mus: 5, chr: 0.1, sik: 0.1, oth: 0.5 }
};
var BLOC_AFF = { nda: { sav: 2.2, obc: 1.6, sc: 0.9, st: 1.1, mus: 0.3, chr: 0.5, sik: 0.8, oth: 1 }, ind: { sav: 0.9, obc: 1.2, sc: 1.4, st: 1.3, mus: 2, chr: 1.8, sik: 1, oth: 1 }, ldf: { sav: 0.8, obc: 1.3, sc: 1.5, st: 1.2, mus: 1, chr: 1.3, sik: 1, oth: 1 }, oth: { sav: 1, obc: 1, sc: 1, st: 1, mus: 1, chr: 1, sik: 1, oth: 1 } };
var ISSUES = ['Pani ki kilat', 'Toote hue road', 'Berozgari', 'Aspatal aur dawai', 'Bijli katauti', 'Kisan ko dam', 'Mahila suraksha', 'Nali-jal bharav', 'School mein shikshak nahi', 'Bhrashtachar'];
var AVC = [['#7c3aed', '#06b6d4'], ['#ea580c', '#facc15'], ['#16a34a', '#06b6d4'], ['#db2777', '#f97316'], ['#2563eb', '#8b5cf6'], ['#0d9488', '#84cc16'], ['#dc2626', '#f59e0b'], ['#4f46e5', '#ec4899'], ['#0891b2', '#22c55e'], ['#9333ea', '#f43f5e']];

// ---------- helpers ----------
function E(s) { return (typeof esc === 'function') ? esc(s) : String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function Q(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;'); }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function sr(seed) { var h = hash(seed); h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function fmt(n) { return Math.round(n).toLocaleString('en-IN'); }
function initials(n) { var w = String(n || '').trim().split(/\s+/).filter(Boolean); return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?').slice(0, 2)).toUpperCase(); }
function svg(s) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(s); }
function avatar(i) { var c = AVC[i % 10], sk = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac'][i % 5]; return svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><circle cx="50" cy="38" r="17" fill="' + sk + '"/><path d="M14 100 C16 68 34 60 50 60 C66 60 84 68 86 100Z" fill="#0f172a" opacity=".85"/><path d="M33 34 C34 20 66 20 67 34 C60 28 40 28 33 34Z" fill="#111827"/></svg>'); }
function badge(name, col) { return svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="' + col + '"/><text x="50" y="62" text-anchor="middle" font-family="Arial" font-weight="900" font-size="34" fill="#fff">' + String(initials(name)).replace(/&/g, '') + '</text></svg>'); }
function nameGen() { return (typeof randName === 'function') ? randName() : 'Shri ' + pick(['Rakesh', 'Mahesh', 'Suresh', 'Anil', 'Vinod', 'Dinesh', 'Pradeep', 'Sanjay']) + ' ' + pick(['Sharma', 'Verma', 'Yadav', 'Singh', 'Patel', 'Reddy', 'Nair', 'Das']); }
function pcol(p) { return (window.__SA && __SA.colOf) ? __SA.colOf(p) : '#64748b'; }
function sdata(state) { return (window.__SA && __SA.SA_DATA) ? __SA.SA_DATA[state] : null; }
function avail() { return (typeof assemblyData !== 'undefined') ? Object.keys(assemblyData).sort() : []; }

// =============================================================
//  SETUP
// =============================================================
var S = {}, F = null, map = null, layer = null;

function css() {
    if (document.getElementById('cs-css')) return;
    if (!document.querySelector('link[href*="Yatra"]')) { var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = 'https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Yatra+One&display=swap'; document.head.appendChild(lk); }
    var st = document.createElement('style'); st.id = 'cs-css';
    st.textContent = [
'#cs-ui,#cs-war{--bg:#0d1a1e;--bg2:#112228;--cd:#162c32;--cd2:#1b363d;--ln:#2a474f;--tx:#ecf1ea;--mu:#8fa8a4;--gold:#f0b04a;--jade:#58c49a;--ver:#e0674a;--ind:#8aa4ff;position:fixed;inset:0;z-index:9200;color:var(--tx);font:400 15px/1.45 Hind,system-ui,-apple-system,"Segoe UI",sans-serif;}',
'#cs-ui *,#cs-war *{box-sizing:border-box;}#cs-ui button,#cs-war button{font-family:inherit;}',
'#cs-ui.hidden,#cs-war.hidden{display:none;}',
'#cs-ui{overflow:auto;background:var(--bg);}',
'.cs-wrap{max-width:1100px;margin:0 auto;padding:16px 18px 60px;}',
'.cs-top{display:flex;align-items:center;gap:14px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--ln);}.cs-top h1{margin:0;font:400 26px/1.15 "Yatra One",Hind,serif;}.cs-top p{margin:2px 0 0;color:var(--mu);font-size:13.5px;}',
'.cs-x{border:1px solid var(--ln);background:rgba(0,0,0,.25);color:var(--tx);border-radius:10px;min-width:38px;height:38px;padding:0 12px;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;justify-content:center;flex:none;}.cs-x:hover{border-color:var(--gold);}',
/* kadam (crumbs) */
'.cs-cr{display:flex;gap:6px;margin:0 0 14px;overflow-x:auto;}.cs-cr span{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--mu);padding:5px 12px 5px 6px;border-radius:30px;border:1px solid var(--ln);white-space:nowrap;}.cs-cr i{font-style:normal;width:20px;height:20px;border-radius:50%;background:var(--cd2);display:inline-flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:600;}',
'.cs-cr span.on{color:var(--tx);border-color:var(--gold);}.cs-cr span.on i{background:var(--gold);color:#1b1405;}.cs-cr span.done{color:var(--tx);}.cs-cr span.done i{background:var(--jade);color:#07241a;}',
/* card */
'.cs-card{background:var(--cd);border:1px solid var(--ln);border-radius:14px;padding:16px;margin-bottom:14px;}.cs-card h3{margin:0 0 12px;font:400 17px/1.2 "Yatra One",Hind,serif;color:var(--gold);display:flex;justify-content:space-between;align-items:baseline;gap:10px;}.cs-card h3 span{font:500 12.5px Hind,sans-serif;color:var(--mu);}',
'.cs-card h4{margin:16px 0 10px;font-size:13.5px;font-weight:600;color:var(--mu);}',
'.cs-tools{display:grid;gap:10px;}',
'.cs-in{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--ln);background:#0b1518;color:var(--tx);font:inherit;outline:none;}.cs-in:focus{border-color:var(--gold);}',
'.cs-seg{display:flex;gap:6px;flex-wrap:wrap;}.cs-seg button{border:1px solid var(--ln);background:transparent;color:var(--mu);border-radius:20px;padding:5px 13px;font-size:13.5px;cursor:pointer;}.cs-seg button.on{background:var(--gold);border-color:var(--gold);color:#1b1405;font-weight:600;}.cs-seg button:hover{color:var(--tx);}',
'.cs-empty{color:var(--mu);padding:18px 4px;font-size:14px;}',
/* state cards */
'.cs-stg{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:12px;}',
'.cs-stc{position:relative;cursor:pointer;border:1px solid var(--ln);border-radius:14px;background:var(--cd);padding:14px 14px 13px 18px;overflow:hidden;transition:transform .18s,border-color .18s,background .18s;min-height:118px;}',
'.cs-stc::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:hsl(var(--h),55%,58%);}',
'.cs-stc:hover{transform:translateY(-2px);border-color:hsl(var(--h),55%,58%);background:var(--cd2);}',
'.cs-stc small{display:block;color:var(--mu);font-size:11.5px;letter-spacing:.3px;margin-bottom:2px;}',
'.cs-stc b{display:block;font:400 19px/1.2 "Yatra One",Hind,serif;max-width:80%;}',
'.cs-stc .n{margin-top:10px;font:400 30px/1 "Yatra One",Hind,serif;color:hsl(var(--h),62%,68%);font-variant-numeric:tabular-nums;}.cs-stc .n span{display:block;font:500 12px Hind,sans-serif;color:var(--mu);margin-top:3px;}',
'.cs-stc .arc{position:absolute;right:8px;top:10px;width:78px;}',
'.cs-stc.off{opacity:.42;cursor:not-allowed;}.cs-stc.off:hover{transform:none;border-color:var(--ln);background:var(--cd);}.cs-soon{margin-top:14px;font-size:12.5px;color:var(--mu);border:1px dashed var(--ln);border-radius:8px;padding:4px 8px;display:inline-block;}',
/* seat list */
'.cs-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px;max-height:58vh;overflow:auto;padding-right:2px;}',
'.cs-li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--bg2);border:1px solid var(--ln);cursor:pointer;}.cs-li:hover{border-color:var(--gold);background:var(--cd2);}',
'.cs-li .cs-no{flex:none;min-width:34px;text-align:center;font:400 14px "Yatra One",Hind,serif;color:var(--gold);background:rgba(240,176,74,.12);border-radius:7px;padding:2px 6px;}.cs-li small{display:block;color:var(--mu);font-size:12px;}',
/* emblem aur party cards */
'.cs-em{width:46px;height:46px;border-radius:12px;flex:none;display:block;background:#0a1417;}.cs-em.xs{width:26px;height:26px;border-radius:8px;}',
'.cs-pcs{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:10px;}',
'.cs-pc{position:relative;display:flex;gap:12px;align-items:center;border:1px solid var(--ln);border-left:4px solid var(--c,#64748b);border-radius:12px;background:var(--bg2);padding:9px 12px;cursor:pointer;transition:background .15s,border-color .15s;}',
'.cs-pc:hover{background:var(--cd2);border-color:var(--c,#64748b);}.cs-pc.sel{background:rgba(240,176,74,.1);border-color:var(--gold);}',
'.cs-pc b{display:block;font-weight:600;line-height:1.2;}.cs-pc small{color:var(--mu);font-size:12.5px;}.cs-tick{margin-left:auto;width:22px;height:22px;border-radius:50%;background:var(--gold);color:#1b1405;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;}',
'.cs-az{display:flex;flex-wrap:wrap;gap:4px;margin:10px 0;}.cs-az button{border:1px solid var(--ln);background:transparent;color:var(--mu);border-radius:7px;width:28px;height:28px;font-size:12.5px;cursor:pointer;}.cs-az button:hover{color:var(--gold);border-color:var(--gold);}',
'.cs-lh{margin:16px 0 8px;font:400 15px "Yatra One",Hind,serif;color:var(--gold);}',
'.cs-allp{max-height:56vh;overflow:auto;padding-right:4px;}',
'.cs-chs{display:flex;flex-wrap:wrap;gap:8px;min-height:34px;}.cs-ch{display:inline-flex;align-items:center;gap:8px;padding:4px 6px 4px 5px;border-radius:30px;background:rgba(240,176,74,.1);border:1px solid var(--gold);cursor:pointer;font-size:13.5px;font-weight:600;}.cs-ch u{text-decoration:none;color:var(--mu);width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.3);display:inline-flex;align-items:center;justify-content:center;font-size:13px;}',
'.cs-lv{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}.cs-lvc{border:1px solid var(--ln);border-radius:12px;background:var(--bg2);padding:11px 12px;cursor:pointer;}.cs-lvc b{display:block;}.cs-lvc small{color:var(--mu);font-size:12.5px;}.cs-lvc.sel{border-color:var(--gold);background:rgba(240,176,74,.1);}.cs-lvc:hover{border-color:var(--mu);}',
'.cs-av{display:grid;grid-template-columns:repeat(auto-fill,minmax(66px,1fr));gap:10px;}.cs-av img{width:100%;aspect-ratio:1;border-radius:14px;object-fit:cover;cursor:pointer;border:3px solid transparent;background:#0a1417;}.cs-av img.sel{border-color:var(--gold);}',
'.cs-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}',
/* buttons */
'.cs-btn{border:0;border-radius:10px;padding:11px 20px;font-weight:600;color:#1b1405;cursor:pointer;background:var(--gold);font-size:14.5px;}.cs-btn:hover{filter:brightness(1.08);}.cs-btn.b{background:var(--ind);color:#101640;}.cs-btn.o{background:var(--gold);}.cs-btn.gh{background:transparent;color:var(--tx);border:1px solid var(--ln);}.cs-btn.sm{padding:6px 12px;font-size:13px;border-radius:8px;}.cs-btn:disabled{opacity:.38;cursor:not-allowed;filter:none;}',
'.cs-sel{padding:8px 10px;border-radius:8px;background:#0b1518;color:var(--tx);border:1px solid var(--ln);max-width:100%;font:inherit;}',
'.cs-pill{display:inline-block;padding:3px 10px;border-radius:20px;border:1px solid var(--ln);color:var(--mu);font-size:12.5px;margin:2px 4px 2px 0;}',
'.cs-opp{display:grid;gap:8px;align-items:center;padding:10px 12px;border-radius:12px;background:var(--cd);border:1px solid var(--ln);border-left:4px solid var(--c);margin-bottom:8px;}',
/* war room */
'#cs-war{display:flex;flex-direction:column;background:var(--bg);}',
'.cs-bar{display:flex;align-items:center;gap:12px;padding:9px 14px;background:var(--bg2);border-bottom:1px solid var(--ln);}',
'.cs-bl{display:flex;gap:8px;flex:none;}',
'.cs-cands{flex:1;display:flex;gap:10px;justify-content:center;overflow:auto;}',
'.cs-c{display:flex;align-items:center;gap:10px;min-width:195px;padding:7px 12px;border-radius:12px;background:var(--cd);border:1px solid var(--ln);border-left:4px solid var(--c);}.cs-c.me{border-color:var(--gold);border-left-color:var(--gold);background:rgba(240,176,74,.08);}',
'.cs-c b{font-size:13.5px;display:block;line-height:1.15;}.cs-c small{color:var(--mu);font-size:11.5px;display:block;}.cs-c .v{font-size:12.5px;color:#fde4ae;font-weight:600;}',
'.cs-av2{position:relative;flex:none;}.cs-av2>img:first-child{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);background:#0a1417;display:block;}.cs-av2 .cs-em{position:absolute;right:-8px;bottom:-6px;box-shadow:0 0 0 2px var(--bg2);}',
'.cs-go{flex:none;border:0;border-radius:12px;background:var(--gold);color:#1b1405;font-weight:700;font-size:14.5px;padding:10px 18px;cursor:pointer;white-space:nowrap;line-height:1.2;text-align:center;}.cs-go:hover{filter:brightness(1.08);}.cs-go small{display:block;font-weight:500;font-size:11.5px;opacity:.8;}',
'.cs-mid{flex:1;display:flex;min-height:0;position:relative;}',
'.cs-side{width:68px;flex:none;overflow-y:auto;background:var(--bg2);padding:6px 4px;border-right:1px solid var(--ln);}.cs-side.r{border-right:0;border-left:1px solid var(--ln);}',
'.cs-ic{width:100%;border:0;background:transparent;color:var(--mu);padding:8px 2px;margin-bottom:2px;border-radius:10px;cursor:pointer;font:500 10.5px/1.15 Hind,sans-serif;display:flex;flex-direction:column;align-items:center;gap:4px;}',
'.cs-i{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none;}.cs-ic:hover,.cs-ic.on{background:var(--cd2);color:var(--gold);}',
'.cs-meters{width:92px;flex:none;display:flex;gap:10px;justify-content:center;padding:12px 6px;background:var(--bg2);border-right:1px solid var(--ln);}',
'.cs-m{display:flex;flex-direction:column;align-items:center;font-size:10.5px;font-weight:600;color:var(--mu);width:24px;}.cs-m i{display:block;position:relative;width:14px;flex:1;border-radius:7px;background:#0a1417;overflow:hidden;margin:6px 0;min-height:150px;}.cs-m i u{position:absolute;left:0;right:0;bottom:0;border-radius:7px;transition:height .6s;}.cs-m i::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:rgba(240,176,74,.9);}',
'.cs-m span{writing-mode:vertical-rl;transform:rotate(180deg);letter-spacing:.3px;}.cs-m b{font-size:13px;color:var(--tx);}',
'.cs-mapw{flex:1;position:relative;min-width:0;}#cs-map{position:absolute;inset:0;background:#0a1417;}',
'.cs-nomap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--mu);font-size:1.1rem;text-align:center;padding:20px;}',
'.cs-draw{position:absolute;top:0;bottom:0;width:min(430px,92vw);z-index:700;background:rgba(17,34,40,.985);overflow-y:auto;padding:14px;box-shadow:0 0 40px rgba(0,0,0,.55);}.cs-draw.hidden{display:none;}',
'.cs-draw.l{left:160px;border-right:1px solid var(--ln);}.cs-draw.r{right:68px;border-left:1px solid var(--ln);}',
'.cs-draw h2{margin:0 0 3px;font:400 19px/1.2 "Yatra One",Hind,serif;display:flex;align-items:center;gap:8px;}.cs-draw h2 .cs-i{color:var(--gold);}.cs-draw .sub{color:var(--mu);font-size:13px;margin-bottom:10px;}',
'.cs-act{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:8px;border-radius:12px;background:var(--cd);border:1px solid var(--ln);}.cs-act .t{flex:1;min-width:0;}.cs-act small{display:block;color:var(--mu);font-size:12px;}',
'.cs-msg{padding:8px 12px;border-radius:10px;margin:8px 0;font-size:13.5px;background:rgba(138,164,255,.12);border:1px solid rgba(138,164,255,.4);color:#d5ddff;}.cs-msg.bad{background:rgba(224,103,74,.12);border-color:rgba(224,103,74,.45);color:#ffc9bd;}.cs-msg.good{background:rgba(88,196,154,.12);border-color:rgba(88,196,154,.45);color:#c6f1e0;}',
/* neeche ke teen box */
'.cs-bot{display:grid;grid-template-columns:1.05fr 1.45fr 1.5fr;gap:12px;padding:12px 14px;background:var(--bg2);border-top:1px solid var(--ln);}',
'.cs-box{position:relative;border:1px solid var(--ln);border-radius:14px;background:var(--cd);padding:12px 16px;min-height:132px;overflow:hidden;}',
'.cs-bh{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:var(--mu);margin-bottom:6px;}',
'.cs-live{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:#ffb4a2;}.cs-live i{width:7px;height:7px;border-radius:50%;background:var(--ver);animation:cslp 1.6s infinite;}',
'@keyframes cslp{0%{box-shadow:0 0 0 0 rgba(224,103,74,.6);}70%{box-shadow:0 0 0 7px rgba(224,103,74,0);}100%{box-shadow:0 0 0 0 rgba(224,103,74,0);}}',
'.cs-bv{font:400 34px/1.1 "Yatra One",Hind,serif;}.cs-bv small{font:500 15px Hind,sans-serif;color:var(--mu);margin-left:4px;}',
'.cs-pb{height:9px;border-radius:5px;background:#0a1417;overflow:hidden;margin-top:6px;}.cs-pb i{display:block;height:100%;transition:width .5s;}',
'.cs-kv{display:grid;grid-template-columns:auto 1fr auto 1fr;gap:4px 10px;margin-top:9px;font-size:13px;color:var(--mu);align-items:baseline;}.cs-kv b{color:var(--tx);font-size:15px;font-weight:600;}',
'.cs-slide{animation:csin .55s ease;}.cs-slide .st{font-size:12.5px;color:var(--mu);}.cs-slide .sv{font:400 27px/1.15 "Yatra One",Hind,serif;margin:3px 0 4px;}.cs-slide .ss{font-size:14px;color:var(--mu);}.cs-slide .sb{height:4px;border-radius:2px;margin-top:10px;width:46px;}',
'@keyframes csin{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}',
'.cs-hl{font-size:15.5px;font-weight:600;line-height:1.35;min-height:42px;animation:csin .5s ease;}',
'.cs-mq{margin-top:9px;overflow:hidden;white-space:nowrap;border-top:1px solid var(--ln);padding-top:8px;color:var(--mu);font-size:13px;}.cs-mq span{display:inline-block;padding-left:100%;animation:csmq 30s linear infinite;}',
'@keyframes csmq{from{transform:translateX(0);}to{transform:translateX(-100%);}}',
'.cs-tbl{width:100%;border-collapse:collapse;font-size:12.5px;}.cs-tbl th,.cs-tbl td{padding:5px 6px;text-align:center;border-bottom:1px solid var(--ln);}.cs-tbl th:first-child,.cs-tbl td:first-child{text-align:left;}',
'.cs-res{text-align:center;padding:26px;border-radius:18px;background:linear-gradient(160deg,rgba(240,176,74,.16),rgba(255,255,255,.02));border:1px solid rgba(240,176,74,.5);}.cs-res h2{margin:6px 0;font:400 28px/1.2 "Yatra One",Hind,serif;color:#fff;}',
'@media(max-width:900px){.cs-bot{grid-template-columns:1fr;max-height:36vh;overflow:auto;}.cs-lv{grid-template-columns:1fr 1fr;}}',
'@media(max-width:800px){.cs-c{min-width:150px}.cs-side{width:54px}.cs-ic{font-size:9.5px}.cs-meters{width:76px;gap:6px}.cs-draw.l{left:130px}.cs-draw.r{right:54px}.cs-go{padding:8px 12px;font-size:13px}.cs-top h1{font-size:21px}}',
'@media(prefers-reduced-motion:reduce){.cs-slide,.cs-hl,.cs-mq span,.cs-live i{animation:none;}}'
    ].join('\n');
    document.head.appendChild(st);
}
function ui() { var e = document.getElementById('cs-ui'); if (!e) { e = document.createElement('div'); e.id = 'cs-ui'; e.className = 'hidden'; document.body.appendChild(e); } return e; }
function war() { var e = document.getElementById('cs-war'); if (!e) { e = document.createElement('div'); e.id = 'cs-war'; e.className = 'hidden'; document.body.appendChild(e); } return e; }
function show(title, sub, body, back) {
    var e = ui();
    e.innerHTML = '<div class="cs-wrap"><div class="cs-top"><button class="cs-x" onclick="' + (back || 'ConstituencyFight.close()') + '">&larr; ' + (back ? 'Peeche' : 'Band karo') + '</button><div><h1>' + E(title) + '</h1><p>' + E(sub || '') + '</p></div></div>' + body + '</div>';
    e.classList.remove('hidden'); e.scrollTop = 0; war().classList.add('hidden');
}
function close() { stopTicker(); ui().classList.add('hidden'); war().classList.add('hidden'); if (map) { try { map.remove(); } catch (e) {} map = null; } }

function open(type) {
    css();
    S = { type: type === 2 ? 'MP' : 'MLA', diff: 'normal', opps: [] };
    var cx = window.CAREER_CONTEXT; window.CAREER_CONTEXT = null;
    if (cx && cx.state) {
        S.career = cx; S.type = cx.type === 'MP' ? 'MP' : 'MLA'; S.state = cx.state; S.seat = cx.seat; S.party = cx.party; S.partyOwn = true;
        S.name = cx.candidate; S.photo = cx.photo; S.logo = cx.logo; S.color = cx.color;
        if (!S.seat) return stepSeat();
        return stepOpps();
    }
    stepState();
}
// =============================================================
//  PARTY EMBLEM (chinh) aur sabhi partiyon ki suchi
// =============================================================
var EXTRA_PARTIES = ['Azad Samaj Party', 'VCK', 'DMDK', 'MNS', 'RLP', 'Bharat Adivasi Party', 'AIFB', 'RSP', 'Jan Suraaj Party', 'AIMEP'];
var EMB = { 'BJP': 'lotus', 'Congress': 'hand', 'Samajwadi Party': 'bike', 'TDP': 'bike', 'BSP': 'elephant', 'AAP': 'broom', 'RLD': 'pump', 'RJD': 'lantern', 'TMC': 'flower', 'DMK': 'sun', 'AIADMK': 'leaves', 'CPI(M)': 'hammer', 'CPI': 'wheat', 'JD(U)': 'arrow', 'AIMIM': 'kite', 'Shiv Sena': 'bow', 'JMM': 'bow', 'NCP': 'clock', 'NCP (Ajit Pawar)': 'clock', 'YSRCP': 'fan', 'BRS': 'car', 'BJD': 'conch', 'JD(S)': 'wheat', 'Shiv Sena (UBT)': 'torch', 'SAD': 'scales' };
var GLYPH = {
    lotus: '<g fill="@F"><path d="M50 20C60 32 60 46 50 58C40 46 40 32 50 20Z"/><path d="M50 58C36 57 26 48 24 34C36 36 45 44 50 58Z"/><path d="M50 58C64 57 74 48 76 34C64 36 55 44 50 58Z"/><path d="M50 62C34 64 20 58 14 46C28 44 42 50 50 62Z" opacity=".8"/><path d="M50 62C66 64 80 58 86 46C72 44 58 50 50 62Z" opacity=".8"/><rect x="26" y="70" width="48" height="6" rx="3"/></g>',
    hand: '<path fill="@F" d="M30 44l-7-14a4.5 4.5 0 0 1 8-4l9 17V24a4.5 4.5 0 0 1 9 0v22V20a4.5 4.5 0 0 1 9 0v26V26a4.5 4.5 0 0 1 9 0v34c0 14-8 24-20 24h-3c-11 0-18-6-22-14l-5-9a4.5 4.5 0 0 1 7-5z"/>',
    bike: '<g stroke="@F" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="27" cy="62" r="14"/><circle cx="73" cy="62" r="14"/><path d="M27 62L41 38h22M41 38l9 24H27M63 38l10 24M60 30h8M41 38l-3-6h-6"/></g>',
    elephant: '<g fill="@F"><ellipse cx="56" cy="50" rx="26" ry="19"/><circle cx="32" cy="44" r="13"/><path d="M24 52c-9 6-10 20-3 27 4 3 8-1 5-5-3-5-1-11 6-15z"/><rect x="40" y="64" width="10" height="20" rx="4"/><rect x="64" y="64" width="10" height="20" rx="4"/></g><circle cx="29" cy="41" r="2.4" fill="@B"/>',
    broom: '<path d="M72 16L46 54" stroke="@F" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M40 50L58 64L44 84L26 70Z" fill="@F"/><path d="M34 68l8-10M40 74l8-10M46 78l6-8" stroke="@B" stroke-width="2.5" stroke-linecap="round"/>',
    pump: '<g fill="@F"><rect x="42" y="44" width="12" height="38" rx="3"/><rect x="34" y="82" width="28" height="6" rx="2"/><path d="M36 44h30V36H48V26h22v-6H42v24z"/><path d="M66 36h8v28a6 6 0 0 1-12 0v-4h4v4a2 2 0 0 0 4 0z"/></g>',
    lantern: '<g stroke="@F" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M40 34h20M44 34c-10 10-10 38 0 48h12c10-10 10-38 0-48M44 82h12M50 18v16M44 22h12"/></g><path d="M50 46c5 7 5 15 0 20c-5-5-5-13 0-20z" fill="@F"/>',
    flower: '<g fill="@F"><circle cx="50" cy="30" r="13"/><circle cx="72" cy="46" r="13"/><circle cx="64" cy="72" r="13"/><circle cx="36" cy="72" r="13"/><circle cx="28" cy="46" r="13"/></g><circle cx="50" cy="54" r="9" fill="@B"/>',
    sun: '<circle cx="50" cy="54" r="15" fill="@F"/><g stroke="@F" stroke-width="4" stroke-linecap="round"><path d="M50 24v8M27 34l6 6M73 34l-6 6M18 54h8M74 54h8"/></g><path d="M12 80l22-18 16 10 16-10 22 18z" fill="@F" opacity=".75"/>',
    leaves: '<g fill="@F"><path d="M20 70C16 46 30 26 52 22C58 44 44 66 20 70z"/><path d="M48 80C46 56 62 38 84 36C88 58 72 78 48 80z" opacity=".85"/></g>',
    hammer: '<path d="M32 26l5-5 14 14-5 5z" fill="@F"/><g stroke="@F" stroke-width="5" stroke-linecap="round" fill="none"><path d="M44 32L26 80"/><path d="M50 56c16-4 28 2 28 16"/></g><path d="M68 18l3 7 8 .5-6 5 2 8-7-4-7 4 2-8-6-5 8-.5z" fill="@F"/>',
    wheat: '<path d="M50 84V30" stroke="@F" stroke-width="4" stroke-linecap="round"/><g fill="@F"><ellipse cx="42" cy="36" rx="5" ry="9" transform="rotate(-30 42 36)"/><ellipse cx="58" cy="36" rx="5" ry="9" transform="rotate(30 58 36)"/><ellipse cx="41" cy="52" rx="5" ry="9" transform="rotate(-30 41 52)"/><ellipse cx="59" cy="52" rx="5" ry="9" transform="rotate(30 59 52)"/><ellipse cx="42" cy="68" rx="5" ry="9" transform="rotate(-30 42 68)"/><ellipse cx="58" cy="68" rx="5" ry="9" transform="rotate(30 58 68)"/><ellipse cx="50" cy="22" rx="5" ry="9"/></g>',
    arrow: '<g stroke="@F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M24 76L74 26M74 26H54M74 26V46"/><path d="M24 76l-4 8M24 76l-8 4M32 68l-4 6"/></g>',
    kite: '<path d="M50 14L74 44L50 76L26 44Z" fill="@F"/><path d="M50 14V76M26 44H74" stroke="@B" stroke-width="2.5"/><path d="M50 76c-8 8 8 12 0 20" stroke="@F" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    bow: '<g stroke="@F" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M32 16C60 36 60 64 32 84V16z"/><path d="M14 50H80M80 50l-9-7M80 50l-9 7"/></g>',
    clock: '<g stroke="@F" stroke-width="6" fill="none" stroke-linecap="round"><circle cx="50" cy="50" r="30"/><path d="M50 50V30M50 50L64 58"/></g><circle cx="50" cy="50" r="4" fill="@F"/>',
    fan: '<g fill="@F"><path d="M50 50C44 30 52 14 64 18C66 32 60 44 50 50z"/><path d="M50 50C68 40 84 48 82 60C68 66 56 60 50 50z"/><path d="M50 50C54 70 44 84 32 78C30 64 38 54 50 50z"/><circle cx="50" cy="50" r="6"/></g>',
    car: '<path d="M16 62l8-20c2-5 6-8 12-8h28c6 0 10 3 12 8l8 20v14H16z" fill="@F"/><path d="M30 44h40l5 14H25z" fill="@B"/><circle cx="32" cy="78" r="8" fill="@F"/><circle cx="68" cy="78" r="8" fill="@F"/><circle cx="32" cy="78" r="3" fill="@B"/><circle cx="68" cy="78" r="3" fill="@B"/>',
    conch: '<path d="M64 24C84 34 84 66 62 78C46 86 26 76 24 60C22 46 36 36 48 42C58 47 56 60 46 60C40 60 38 54 42 52" stroke="@F" stroke-width="7" fill="none" stroke-linecap="round"/>',
    torch: '<path d="M50 14c10 12 14 20 8 30c-3 5-3 9 0 12c-8-1-16-8-14-18c1-6 8-10 6-24z" fill="@F"/><path d="M44 58h14l-3 28h-8z" fill="@F"/>',
    scales: '<g stroke="@F" stroke-width="5" stroke-linecap="round" fill="none"><path d="M50 18v56M30 76h40M26 34h48M26 34L16 56h20zM74 34L64 56h20z"/></g>'
};
var EMB_CACHE = {};
function isLight(c) {
    c = String(c || '');
    if (c.charAt(0) === '#') { var n = parseInt(c.slice(1), 16); return (((n >> 16) & 255) * .299 + ((n >> 8) & 255) * .587 + (n & 255) * .114) > 150; }
    var m = /hsl\(\s*[\d.]+\s*,\s*[\d.]+%\s*,\s*([\d.]+)%/.exec(c); return m ? parseFloat(m[1]) > 62 : false;
}
function abbr(n) {
    if (!n) return 'IND';
    var w = String(n).replace(/[()]/g, ' ').split(/\s+/).filter(Boolean);
    if (w.length === 1) return w[0].length <= 5 ? w[0].toUpperCase() : w[0].slice(0, 3).toUpperCase();
    return w.map(function (x) { return x[0]; }).join('').toUpperCase().slice(0, 4);
}
var EMB_REAL = {};
function emblem(name) {
    name = name || '';
    try { var _cl = window.CareerMode && CareerMode.logoFor && CareerMode.logoFor(name); if (_cl) return _cl; } catch (e) {}
    if (EMB_REAL[name]) return EMB_REAL[name];
    var svgU = emblemSvg(name);
    if (name && EMB_REAL[name] === undefined && typeof s22LogoName === 'function' && typeof S22_DIR !== 'undefined' && !(window.s22Miss && s22Miss[name])) {
        EMB_REAL[name] = null;
        var base = S22_DIR + 'Parties/' + encodeURI(s22LogoName(name)), exts = ['.jpg', '.png'], k = 0;
        var tryNext = function () {
            if (k >= exts.length) return;
            var u = base + exts[k++], im = new Image();
            im.onload = function () { EMB_REAL[name] = u; [].forEach.call(document.images, function (el) { if (el.getAttribute('src') === svgU) el.src = u; }); };
            im.onerror = tryNext; im.src = u;
        };
        tryNext();
    }
    return svgU;
}
function emblemSvg(name) {
    name = name || '';
    if (EMB_CACHE[name]) return EMB_CACHE[name];
    var bg = name ? pcol(name) : '#94a3b8', fg = isLight(bg) ? '#1b1405' : '#ffffff', g = GLYPH[EMB[name]], inner;
    if (g) inner = g.split('@F').join(fg).split('@B').join(bg);
    else { var t = abbr(name), fs = t.length <= 2 ? 40 : (t.length === 3 ? 32 : (t.length === 4 ? 26 : 22)); inner = '<text x="50" y="' + (50 + fs * 0.35) + '" font-size="' + fs + '" font-weight="800" text-anchor="middle" fill="' + fg + '" font-family="Arial,Helvetica,sans-serif">' + E(t) + '</text>'; }
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="' + bg + '"/><rect width="100" height="100" rx="22" fill="url(#g)"/><rect x="4" y="4" width="92" height="92" rx="18" fill="none" stroke="' + fg + '" stroke-opacity=".28" stroke-width="2"/>' + inner + '</svg>';
    return (EMB_CACHE[name] = svg(s));
}
function allParties() {
    var seen = {}, out = [], sa = (window.__SA && __SA.SA_DATA) || {};
    Object.keys(sa).forEach(function (s) { sa[s].parties.forEach(function (p) { if (p[0] !== 'Others' && !seen[p[0]]) { seen[p[0]] = 1; out.push(p[0]); } }); });
    EXTRA_PARTIES.forEach(function (p) { if (!seen[p]) { seen[p] = 1; out.push(p); } });
    out.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
    return out;
}
function lsSeat() { return (S.type === 'MP' && window.LS24 && LS24.pc[S.state] && LS24.pc[S.state][S.seat]) || null; }
function lsAc(no) { return (window.LS24 && LS24.ac[S.state] && LS24.ac[S.state][no]) || null; }
function realCands() { var r = lsSeat(); if (!r) return []; var seen = {}, out = []; r.c.forEach(function (c) { if (c[1] === 'Independent' || seen[c[1]]) return; seen[c[1]] = 1; out.push(c); }); return out; }
function realCand(p) { var r = lsSeat(); if (!r) return null; return r.c.filter(function (c) { return c[1] === p; })[0] || null; }
function blocOf(p) { var sa = (window.__SA && __SA.SA_DATA) || {}, b = 'oth'; Object.keys(sa).forEach(function (s) { sa[s].parties.forEach(function (x) { if (x[0] === p && b === 'oth') b = x[2]; }); }); return b; }
function shareOf(p) {
    if (lsSeat()) { var rc = realCand(p); return rc ? rc[5] : null; }
    var d = sdata(S.state), v = null; if (d) d.parties.forEach(function (x) { if (x[0] === p) v = x[1]; }); return v;
}
function pSub(p) { return p[3] ? p[3] + ', ' + p[1] + '%' : p[1] + '% state vote'; }
function mpOf(pc) { var r = window.LS24 && LS24.pc[S.state] && LS24.pc[S.state][pc]; return r && r.c[0] ? r.c[0][0] + ' (' + r.c[0][1] + ')' : ''; }
function seatCard() {
    var r = lsSeat(); if (!r || !r.c.length) return '';
    var w = r.c[0], u = r.c[1], line = function (c, lbl) { return '<div class="cs-row" style="flex-wrap:nowrap;align-items:center;margin-top:8px"><img class="cs-em" src="' + emblem(c[1]) + '" alt=""><div style="flex:1;min-width:0"><b>' + E(c[0]) + '</b><small style="display:block;color:var(--mu);font-size:12.5px">' + lbl + ', ' + E(c[1]) + (c[3] ? ', umra ' + c[3] : '') + '</small></div><div style="text-align:right"><b>' + fmt(c[4]) + '</b><small style="display:block;color:var(--mu);font-size:12.5px">' + c[5] + '% vote</small></div></div>'; };
    return '<div class="cs-card"><h3>Is seat par 2024 ka natija<span>Election Commission ka data</span></h3>' + line(w, 'Maujooda saansad') + (u ? line(u, 'Doosre number par') : '') +
        '<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:4px"><span class="cs-pill">Jeet ka antar ' + fmt(r.mg) + '</span><span class="cs-pill">Matdata ' + fmt(r.el) + '</span><span class="cs-pill">Turnout ' + r.to + '%</span>' + (r.fp ? '<span class="cs-pill">Mahila matdata ' + r.fp + '%</span>' : '') + '<span class="cs-pill">NOTA ' + fmt(r.nota) + '</span></div></div>';
}
function pcard(p, sub, fn, sel) {
    return '<div class="cs-pc' + (sel ? ' sel' : '') + '" style="--c:' + pcol(p) + '" onclick="ConstituencyFight.' + fn + '(\'' + Q(p) + '\')"><img class="cs-em" src="' + emblem(p) + '" alt=""><div><b>' + E(p) + '</b>' + (sub ? '<small>' + E(sub) + '</small>' : '') + '</div>' + (sel ? '<span class="cs-tick">&#10003;</span>' : '') + '</div>';
}

// =============================================================
//  STEPS: state, seat, party, naam, virodhi
// =============================================================
var REGION = { 'Jammu & Kashmir': 'Uttar', 'Himachal Pradesh': 'Uttar', 'Punjab': 'Uttar', 'Haryana': 'Uttar', 'Delhi': 'Uttar', 'Uttarakhand': 'Uttar', 'Uttar Pradesh': 'Uttar', 'Rajasthan': 'Pashchim', 'Gujarat': 'Pashchim', 'Maharashtra': 'Pashchim', 'Goa': 'Pashchim', 'Madhya Pradesh': 'Madhya', 'Chhattisgarh': 'Madhya', 'Bihar': 'Purv', 'Jharkhand': 'Purv', 'Odisha': 'Purv', 'West Bengal': 'Purv', 'Andhra Pradesh': 'Dakshin', 'Telangana': 'Dakshin', 'Karnataka': 'Dakshin', 'Kerala': 'Dakshin', 'Tamil Nadu': 'Dakshin', 'Puducherry': 'Dakshin', 'Assam': 'Poorvottar', 'Arunachal Pradesh': 'Poorvottar', 'Manipur': 'Poorvottar', 'Meghalaya': 'Poorvottar', 'Mizoram': 'Poorvottar', 'Nagaland': 'Poorvottar', 'Sikkim': 'Poorvottar', 'Tripura': 'Poorvottar' };
var REGION_NAME = { Uttar: 'Uttar Bharat', Dakshin: 'Dakshin Bharat', Purv: 'Purvi Bharat', Pashchim: 'Pashchim Bharat', Madhya: 'Madhya Bharat', Poorvottar: 'Poorvottar' };
var SC = {};
function seatCount(s, type) {
    var k = s + '|' + type; if (SC[k] != null) return SC[k];
    var fs = assemblyData[s].features, n = 0;
    if (type === 'MLA') n = fs.length; else { var seen = {}; fs.forEach(function (f) { var p = f.properties.pc; if (p && !seen[p]) { seen[p] = 1; n++; } }); }
    return (SC[k] = n);
}
function miniArc(n, h) {
    var d = clamp(Math.ceil(n / (S.type === 'MP' ? 3 : 12)), 8, 34), outer = Math.ceil(d * 0.58), inner = d - outer, o = '<svg class="arc" viewBox="0 0 80 42" aria-hidden="true">';
    [[outer, 36], [inner, 25]].forEach(function (r) { for (var i = 0; i < r[0]; i++) { var a = Math.PI * (1 - (i + 0.5) / r[0]); o += '<circle cx="' + (40 + r[1] * Math.cos(a)).toFixed(1) + '" cy="' + (40 - r[1] * Math.sin(a)).toFixed(1) + '" r="2.2" fill="hsl(' + h + ',60%,64%)"/>'; } });
    return o + '</svg>';
}
function crumbs(i) {
    var steps = S.career ? ['Seat', 'Virodhi'] : ['State', 'Seat', 'Party', 'Naam', 'Virodhi'];
    return '<div class="cs-cr">' + steps.map(function (t, k) { return '<span class="' + (k < i ? 'done' : (k === i ? 'on' : '')) + '"><i>' + (k < i ? '&#10003;' : (k + 1)) + '</i>' + t + '</span>'; }).join('') + '</div>';
}
function stateCards() {
    var q = (S.sq || '').toLowerCase(), rg = S.reg || '', av = avail();
    var all = Object.keys((window.__SA && __SA.SA_DATA) || {}).sort().filter(function (s) { return (!q || s.toLowerCase().indexOf(q) >= 0) && (!rg || REGION[s] === rg); });
    if (!all.length) return '<div class="cs-empty">Is naam ka koi state nahi mila.</div>';
    return all.map(function (s) {
        var ok = av.indexOf(s) >= 0, h = hash(s) % 360, n = ok ? seatCount(s, S.type) : 0;
        return '<div class="cs-stc' + (ok ? '' : ' off') + '" style="--h:' + h + '" onclick="ConstituencyFight.pickState(\'' + Q(s) + '\')">' + (ok ? miniArc(n, h) : '') + '<small>' + (REGION[s] ? REGION_NAME[REGION[s]] : 'Rajya') + '</small><b>' + E(s) + '</b>' +
            (ok ? '<div class="n">' + n + '<span>' + (S.type === 'MP' ? 'Lok Sabha seat' : 'Vidhan Sabha seat') + '</span></div>' : '<div class="cs-soon">Map jald aayega</div>') + '</div>';
    }).join('');
}
function stepState() {
    var regs = [['', 'Sab']].concat(Object.keys(REGION_NAME).map(function (k) { return [k, REGION_NAME[k]]; }));
    show('Fight in your constituency (' + S.type + ')', 'Pehle state chuno. Yahin se aapka rajneetik safar shuru hoga.',
        crumbs(0) + '<div class="cs-card cs-tools"><input class="cs-in" id="cs-sq" placeholder="State ka naam dhoondho..." value="' + E(S.sq || '') + '" oninput="ConstituencyFight.sq(this.value)"><div class="cs-seg">' +
        regs.map(function (r) { return '<button class="' + ((S.reg || '') === r[0] ? 'on' : '') + '" onclick="ConstituencyFight.reg(\'' + r[0] + '\')">' + r[1] + '</button>'; }).join('') + '</div></div><div class="cs-stg" id="cs-stg">' + stateCards() + '</div>');
}
function sq(v) { S.sq = v; var e = document.getElementById('cs-stg'); if (e) e.innerHTML = stateCards(); }
function reg(r) { S.reg = r; stepState(); }
function pickState(s) { if (avail().indexOf(s) < 0) return; S.state = s; S.q = ''; stepSeat(); }
function seatsOf() {
    var fs = assemblyData[S.state].features, out = [];
    if (S.type === 'MLA') fs.forEach(function (f) { out.push({ k: f.properties.no + '. ' + f.properties.nm, s: f.properties.nm + ' ' + f.properties.d, d: f.properties.d, n: f.properties.nm, no: f.properties.no }); });
    else { var seen = {}; fs.forEach(function (f) { var p = f.properties.pc; if (p && !seen[p]) { seen[p] = 1; var mp = mpOf(p); out.push({ k: p, s: p + ' ' + mp, n: p, mp: mp }); } }); }
    return out;
}
function seatHtml() {
    var q = (S.q || '').toLowerCase(), list = seatsOf().filter(function (x) { return !q || x.s.toLowerCase().indexOf(q) >= 0; }).slice(0, 150);
    if (!list.length) return '<div class="cs-empty">Is naam ki koi seat nahi mili.</div>';
    return list.map(function (x) {
        return '<div class="cs-li" onclick="ConstituencyFight.pickSeat(\'' + Q(x.k) + '\')">' + (x.no != null ? '<span class="cs-no">' + x.no + '</span><div>' + E(x.n) + (x.d ? '<small>' + E(x.d) + '</small>' : '') + '</div>' : '<div>' + E(x.n) + (x.mp ? '<small>Saansad: ' + E(x.mp) + '</small>' : '') + '</div>') + '</div>';
    }).join('');
}
function stepSeat() {
    show(S.state + ': ' + (S.type === 'MLA' ? 'Vidhan Sabha seat' : 'Lok Sabha seat'), (S.type === 'MLA' ? seatCount(S.state, 'MLA') : seatCount(S.state, 'MP')) + ' seat mein se apni seat chuno.',
        crumbs(S.career ? 0 : 1) + '<div class="cs-card"><input class="cs-in" id="cs-qin" placeholder="Seat ya zile ka naam likho..." value="' + E(S.q || '') + '" oninput="ConstituencyFight.search(this.value)"><div class="cs-list" id="cs-seats" style="margin-top:12px">' + seatHtml() + '</div></div>', S.career ? null : 'ConstituencyFight.back(\'state\')');
}
function search(v) { S.q = v; var e = document.getElementById('cs-seats'); if (e) e.innerHTML = seatHtml(); }
function pickSeat(k) { S.seat = k; if (S.career) return stepOpps(); stepParty(); }

// ---- party chunne ki jagah ----
function allList() {
    var q = (S.pq || '').toLowerCase(), ex = S.pex || [], cur = '', h = '';
    allParties().filter(function (p) { return ex.indexOf(p) < 0 && (!q || p.toLowerCase().indexOf(q) >= 0); }).forEach(function (p) {
        var L = p.charAt(0).toUpperCase(); if (L !== cur) { if (cur) h += '</div>'; cur = L; h += '<div class="cs-lh" id="cs-L-' + L + '">' + L + '</div><div class="cs-pcs">'; }
        var sh = shareOf(p), sel = S.pfn === 'toggleOpp' && S.opps.some(function (o) { return o.p === p; });
        h += pcard(p, lsSeat() ? (sh != null ? realCand(p)[0] + ', ' + sh + '%' : 'Is seat par 2024 mein nahi ladi') : (sh != null ? sh + '% state vote' : 'Is state mein chhoti party'), S.pfn, sel);
    });
    return (cur ? h + '</div>' : '<div class="cs-empty">Is naam ki koi party nahi mili.</div>');
}
function allBox() {
    var letters = {}; allParties().forEach(function (p) { if ((S.pex || []).indexOf(p) < 0) letters[p.charAt(0).toUpperCase()] = 1; });
    return '<input class="cs-in" placeholder="Party ka naam dhoondho..." oninput="ConstituencyFight.pq(this.value)"><div class="cs-az">' + Object.keys(letters).sort().map(function (L) { return '<button onclick="var e=document.getElementById(\'cs-L-' + L + '\');if(e)e.scrollIntoView({behavior:\'smooth\',block:\'start\'})">' + L + '</button>'; }).join('') + '</div><div class="cs-allp" id="cs-allp">' + allList() + '</div>';
}
function pq(v) { S.pq = v; var e = document.getElementById('cs-allp'); if (e) e.innerHTML = allList(); }
function mainParties(excl) {
    if (lsSeat()) return realCands().filter(function (c) { return c[1] !== excl; }).slice(0, 8).map(function (c) { return [c[1], c[5], blocOf(c[1]), c[0]]; });
    var d = sdata(S.state); return d ? d.parties.filter(function (p) { return p[0] !== 'Others' && p[0] !== excl; }).sort(function (a, b) { return b[1] - a[1]; }) : [];
}
function stepParty() {
    S.pfn = 'pickParty'; S.pex = []; S.pq = '';
    show('Seat: ' + S.seat, 'Kis party se ladoge? Independent bhi chun sakte ho.',
        crumbs(2) + seatCard() + '<div class="cs-card"><h3>Bina party ke</h3><div class="cs-pcs"><div class="cs-pc" style="--c:#94a3b8" onclick="ConstituencyFight.pickParty(\'__IND__\')"><img class="cs-em" src="' + emblem('') + '" alt=""><div><b>Independent</b><small>Akele, bina party (kam fayda)</small></div></div></div></div>' +
        '<div class="cs-card"><h3>' + (lsSeat() ? 'Is seat ke asli ummeedwar (2024)' : E(S.state) + ' ki pramukh partiyan') + '<span>' + (lsSeat() ? 'Lok Sabha 2024 ka vote' : 'pichhle chunav ka vote') + '</span></h3><div class="cs-pcs">' + mainParties().map(function (p) { return pcard(p[0], pSub(p), 'pickParty'); }).join('') + '</div></div>' +
        '<div class="cs-card"><h3>Anya partiyan, A se Z<span>desh ki sabhi pramukh partiyan</span></h3>' + allBox() + '</div>', 'ConstituencyFight.back(\'seat\')');
}
function pickParty(p) { S.party = p === '__IND__' ? null : p; S.color = S.party ? pcol(S.party) : '#94a3b8'; S.photo = S.photo || 'av:0'; S.name = S.name || ''; stepName(); }
function stepName() {
    var av = '', i; for (i = 0; i < 10; i++) av += '<img src="' + avatar(i) + '" class="' + (S.photo === 'av:' + i ? 'sel' : '') + '" onclick="ConstituencyFight.setAv(' + i + ')">';
    var prev = S.photo.indexOf('data:') === 0 ? S.photo : avatar(parseInt(S.photo.split(':')[1], 10) || 0);
    show('Aapka Naam aur Photo', S.party || 'Independent', crumbs(3) + '<div class="cs-card"><h3>Ummeedwar</h3><div class="cs-row" style="flex-wrap:nowrap"><img class="cs-em" style="width:58px;height:58px" src="' + emblem(S.party || '') + '" alt=""><input class="cs-in" maxlength="28" placeholder="Ummeedwar ka naam" value="' + E(S.name) + '" oninput="ConstituencyFight.setName(this.value)"></div></div>' +
        '<div class="cs-card"><h3>Photo</h3><div class="cs-row"><img src="' + prev + '" style="width:84px;height:84px;border-radius:20px;object-fit:cover"><label class="cs-btn gh sm" style="display:inline-block">Photo upload<input type="file" accept="image/*" style="display:none" onchange="ConstituencyFight.upload(this)"></label></div><div class="cs-av" style="margin-top:12px">' + av + '</div></div>' +
        '<button class="cs-btn" onclick="ConstituencyFight.toOpps()">AAGE &rarr;</button>', 'ConstituencyFight.back(\'party\')');
}
function setAv(i) { S.photo = 'av:' + i; stepName(); }
function setName(v) { S.name = v; }
function upload(inp) {
    var f = inp.files && inp.files[0]; if (!f) return; var fr = new FileReader();
    fr.onload = function () { var im = new Image(); im.onload = function () { var c = document.createElement('canvas'); c.width = c.height = 200; var m = Math.min(im.width, im.height); c.getContext('2d').drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, 200, 200); S.photo = c.toDataURL('image/jpeg', 0.8); stepName(); }; im.src = fr.result; };
    fr.readAsDataURL(f);
}
function toOpps() { if ((S.name || '').trim().length < 2) { alert('Apna naam likho.'); return; } S.name = S.name.trim(); stepOpps(); }

// ---- virodhi ----
var LEVELS = { easy: 'Virodhi dheere badhte hain', normal: 'Barabar ka muqabla', hard: 'Virodhi tez aur chaukanne', brutal: 'Har kadam par kadi takkar' };
function newOpp(p) {
    var sh = shareOf(p) || 0, key = S.state + '|' + S.seat + '|' + p, r = sr(key + 'c'), lv = sh >= 25 ? 'high' : (sh >= 8 ? 'mid' : 'low');
    return { p: p, cand: r < .4 ? 'saaf' : (r < .65 ? 'dabang' : (r < .8 ? 'bahari' : 'dalbadlu')), str: lv, res: lv, base: ['jati', 'dharm', 'vikas', 'sahan'][Math.floor(sr(key + 'b') * 4)] };
}
function chosenHtml() {
    if (!S.opps.length) return '<div class="cs-empty" style="padding:4px 0">Koi virodhi nahi chuna. Aap akele ladoge.</div>';
    return '<div class="cs-chs">' + S.opps.map(function (o) { return '<span class="cs-ch" onclick="ConstituencyFight.toggleOpp(\'' + Q(o.p) + '\')"><img class="cs-em xs" src="' + emblem(o.p) + '" alt="">' + E(o.p) + '<u>&times;</u></span>'; }).join('') + '</div>';
}
function mainOppHtml() {
    var chosen = S.opps.map(function (o) { return o.p; });
    return mainParties(S.party).map(function (p) { return pcard(p[0], pSub(p), 'toggleOpp', chosen.indexOf(p[0]) >= 0); }).join('');
}
function oppRefresh() {
    var a = document.getElementById('cs-chosen'), b = document.getElementById('cs-mainp'), c = document.getElementById('cs-allp'), n = document.getElementById('cs-oc');
    if (a) a.innerHTML = chosenHtml(); if (b) b.innerHTML = mainOppHtml(); if (c) c.innerHTML = allList(); if (n) n.textContent = S.opps.length + ' chune gaye';
}
function stepOpps() {
    if (!S.oppInit && !S.opps.length) { S.oppInit = 1; S.opps = mainParties(S.party).slice(0, 3).map(function (p) { return newOpp(p[0]); }); }
    S.pfn = 'toggleOpp'; S.pex = S.party ? [S.party] : []; S.pq = '';
    var lv = Object.keys(DIFFS).map(function (k) { return '<div class="cs-lvc' + (S.diff === k ? ' sel' : '') + '" onclick="ConstituencyFight.setDiff(\'' + k + '\')"><b>' + DIFFS[k][0] + '</b><small>' + LEVELS[k] + '</small></div>'; }).join('');
    show('Virodhi aur Kathinai', S.seat + ' | ' + S.state,
        crumbs(S.career ? 1 : 4) + (S.career ? seatCard() : '') + '<div class="cs-card"><h3>Kathinai (tough level)</h3><div class="cs-lv">' + lv + '</div></div>' +
        '<div class="cs-card"><h3>Kaun-kaun ladega?<span id="cs-oc">' + S.opps.length + ' chune gaye</span></h3><div id="cs-chosen">' + chosenHtml() + '</div><h4>' + (lsSeat() ? 'Is seat ke asli ummeedwar (2024)' : E(S.state) + ' ki pramukh partiyan') + '</h4><div class="cs-pcs" id="cs-mainp">' + mainOppHtml() + '</div></div>' +
        '<div class="cs-card"><h3>Anya partiyan, A se Z<span>1 se zyada chuno</span></h3>' + allBox() + '</div>' +
        '<button class="cs-btn o" onclick="ConstituencyFight.startWar()">CHUNAV KE MAIDAN MEIN &rarr;</button>', S.career ? 'ConstituencyFight.close()' : 'ConstituencyFight.back(\'name\')');
}
function setDiff(k) { S.diff = k; stepOpps(); }
function toggleOpp(p) {
    var i = S.opps.map(function (o) { return o.p; }).indexOf(p);
    if (i >= 0) S.opps.splice(i, 1); else { if (S.opps.length >= 7) { alert('Ek seat par 7 se zyada virodhi nahi chun sakte.'); return; } S.opps.push(newOpp(p)); }
    oppRefresh();
}
function rule() {}
function back(w) { if (w === 'state') stepState(); else if (w === 'seat') stepSeat(); else if (w === 'party') stepParty(); else stepName(); }

// =============================================================
//  DATA: demographics, pichhla chunav
// =============================================================
function demo() {
    var key = S.state + '|' + S.seat, r = REL[S.state] || [6, 2, 0.5], k = function (n) { return 0.4 + sr(key + n) * 1.8; };
    var mus = clamp(r[0] * k('m'), 0.5, 80), chr = clamp(r[1] * k('c'), 0, 92), sik = clamp(r[2] * k('s'), 0, 70), oth = 1.5;
    var hin = Math.max(5, 100 - mus - chr - sik - oth), tr = clamp((TRIBAL[S.state] || 3) * k('t'), 0, 95), sc = clamp(16 * k('sc') * 0.7, 2, 40);
    var st = Math.min(hin * 0.9, tr * hin / 100 * (TRIBAL[S.state] > 30 ? 1.3 : 1)), scs = Math.min(hin - st, sc * hin / 100), rest = Math.max(1, hin - st - scs);
    var savW = 0.2 + sr(key + 'sv') * 0.25, sav = rest * savW, obc = rest - sav;
    var v = { sav: sav, obc: obc, sc: scs, st: st, mus: mus, chr: chr, sik: sik, oth: oth }, tot = 0; Object.keys(v).forEach(function (g) { tot += v[g]; }); Object.keys(v).forEach(function (g) { v[g] = v[g] / tot * 100; });
    var seg = { yuva: 30 + sr(key + 'y') * 12, mahila: 47 + sr(key + 'w') * 3, buzurg: 9 + sr(key + 'b') * 6, kisan: 15 + sr(key + 'k') * 40 };
    var rl0 = lsSeat(); if (rl0 && rl0.fp) seg.mahila = rl0.fp;
    return { g: v, seg: seg };
}
function affOf(p, bloc, g) { return (AFF[p] || BLOC_AFF[bloc] || BLOC_AFF.oth)[g]; }
function pastData(D) {
    var d = sdata(S.state), key = S.state + '|' + S.seat, ps = d ? d.parties.filter(function (p) { return p[0] !== 'Others'; }) : [], gs = GROUPS.map(function (x) { return x[0]; });
    var sup = {}, overall = {};
    ps.forEach(function (p) { overall[p[0]] = 0; });
    gs.forEach(function (g) {
        var raw = {}, tot = 0;
        ps.forEach(function (p) { raw[p[0]] = p[1] * affOf(p[0], p[2], g) * (0.75 + sr(key + g + p[0]) * 0.5); tot += raw[p[0]]; });
        var oth = 6 + sr(key + g + 'o') * 6; raw.Others = oth / 100 * tot; tot += raw.Others;
        sup[g] = {}; Object.keys(raw).forEach(function (p) { sup[g][p] = raw[p] / tot * 100; });
    });
    var all = ps.map(function (p) { return p[0]; }).concat(['Others']);
    all.forEach(function (p) { overall[p] = 0; gs.forEach(function (g) { overall[p] += D.g[g] * sup[g][p] / 100; }); });
    var rl = lsSeat();
    if (rl) {
        var ro = {}, rsum = 0; rl.c.forEach(function (c) { ro[c[1]] = (ro[c[1]] || 0) + c[5]; });
        Object.keys(ro).forEach(function (p) { rsum += ro[p]; }); ro.Others = Math.max(0, 100 - rsum);
        Object.keys(ro).forEach(function (p) { if (!sup[gs[0]] || sup[gs[0]][p] === undefined) gs.forEach(function (g) { sup[g] = sup[g] || {}; sup[g][p] = ro[p] * (0.7 + sr(key + g + p) * 0.6); }); });
        var ord = Object.keys(ro).filter(function (p) { return p !== 'Others'; }).sort(function (a, b) { return ro[b] - ro[a]; }).concat(['Others']);
        return { sup: sup, overall: ro, order: ord, turnout: rl.to || (58 + sr(key + 'tn') * 14), winner: ord[0], margin: ro[ord[0]] - (ro[ord[1]] || 0), real: true };
    }
    var order = all.slice().sort(function (a, b) { return overall[b] - overall[a]; });
    return { sup: sup, overall: overall, order: order, turnout: 58 + sr(key + 'tn') * 14, winner: order[0], margin: (overall[order[0]] - overall[order[1]]) };
}

// =============================================================
//  WAR PAGE
// =============================================================
var PANELS = [
 { id: 'demo', i: '&#128101;', l: 'Jaati-Dharm', info: true }, { id: 'past', i: '&#128202;', l: 'Pichhla Chunav', info: true },
 { id: 'social', i: '&#128241;', l: 'Social Media', t: 'Online hawa banao.', a: [
   { n: 'Reels aur posts', c: 4, s: 8, pop: 3 }, { n: 'Live sambodhan', c: 6, s: 12, pop: 5, rep: 1 }, { n: 'Paid promotion', c: 12, s: 5, pop: 6 }] },
 { id: 'rally', i: '&#127908;', l: 'Rally', t: 'Jitni zyada rally, utni zyada popularity.', a: [
   { n: 'Nukkad sabha', c: 3, s: 15, pop: 3.5 }, { n: 'Road show', c: 8, s: 25, pop: 7, pow: 1 }, { n: 'Badi jansabha', c: 16, s: 35, pop: 11, pow: 2 }] },
 { id: 'event', i: '&#127914;', l: 'Event / Protest', t: 'Dharna, medical camp aur karyakram.', a: [
   { n: 'Dharna / pradarshan', c: 2, s: 15, pop: 4, rep: -1, risk: [0.2, -4, 'Police se jhadap, chhavi bigdi.'] }, { n: 'Medical camp', c: 6, s: 15, pop: 3, rep: 5 }, { n: 'Safai / civil abhiyan', c: 4, s: 15, pop: 2, rep: 4 },
   { n: 'Sanskritik karyakram', c: 5, s: 12, pop: 4, rep: 2 }, { n: 'Raktdaan shivir', c: 3, s: 10, pop: 2, rep: 4 }, { n: 'Rozgar mela', c: 10, s: 20, pop: 5, rep: 4 }] },
 { id: 'guru', i: '&#129497;', l: 'Local Guru', t: 'Ilake ke prabhavshali log.', a: [
   { n: 'Gaon ke buzurg ka ashirwad', c: 4, s: 8, pop: 4, rep: 2 }, { n: 'Dharmik guru ka samarthan', c: 6, s: 10, pop: 5, rep: 1, pow: 1 }, { n: 'Shikshak-doctor sangh', c: 5, s: 10, pop: 3, rep: 4 }] },
 { id: 'fund', i: '&#128176;', l: 'Fund Jutao', t: 'Paisa jodo (stamina lagti hai).', a: [
   { n: 'Chanda abhiyan', c: 0, s: 10, gain: 14 }, { n: 'Crowdfunding', c: 0, s: 8, gain: 10, pop: 1 }, { n: 'Karobari daan (jokhim)', c: 0, s: 6, gain: 28, rep: -3, risk: [0.25, -6, 'Daan ka raaz khula, chhavi bigdi.'] }] },
 { id: 'issue', i: '&#127962;', l: 'Local Mudde', t: 'Ilake ke asli mudde uthao aur hal karao.', dyn: 'issue' },
 { id: 'biz', i: '&#127959;', l: 'Vyapari / Thekedar', t: 'Reputation badhao.', a: [
   { n: 'Vyapari mandal ki baithak', c: 5, s: 10, pow: 5, pop: 1 }, { n: 'Thekedar sangh se samjhauta', c: 4, s: 10, pow: 8, rep: -2, gain: 12, risk: [0.2, -6, 'Thekedaron se sauda ujagar hua.'] }] },
 { id: 'house', i: '&#127968;', l: 'Ghar-Ghar Prachar', t: 'Karyakarta aur booth.', a: [
   { n: 'Ghar-ghar sampark (50 karyakarta)', c: 4, s: 15, pop: 4 }, { n: 'Booth samiti banao', c: 6, s: 12, pop: 3, pow: 3 }, { n: 'Mahila toli', c: 5, s: 12, pop: 3, rep: 1 }] },
 { id: 'jumla', i: '&#128220;', l: 'Jumla / Ghoshna-patra', t: 'Bade vaade, par chhavi par jokhim.', a: [
   { n: 'Bade vaade (jumla)', c: 2, s: 6, pop: 6, rep: -3 }, { n: 'Ghoshna-patra jaari', c: 6, s: 10, pop: 4, rep: 1 }, { n: 'Muft yojana ka elaan', c: 10, s: 8, pop: 7, rep: -2 }] },
 { id: 'wa', i: '&#128172;', l: 'WhatsApp University', t: 'Virodhi ki popularity girao.', tgt: true, a: [
   { n: 'Message viral karao', c: 3, s: 8, pop: 1, opp: 3, orep: 1, risk: [0.3, -5, 'Fake news pakdi gayi, chhavi bigdi.'] }, { n: 'Edited video chalao', c: 5, s: 10, opp: 5, orep: 3, risk: [0.4, -7, 'Video fake nikla, badnami.'] }] },
 { id: 'infl', i: '&#127775;', l: 'Influencer / Prachar', t: 'Apni popularity badhao, doosre ki ghatao.', tgt: true, a: [
   { n: 'Influencers ka samarthan', c: 10, s: 8, pop: 5 }, { n: 'Media prachar kendra deal', c: 14, s: 6, pop: 4, opp: 3, orep: 1 }] },
 { id: 'comm', i: '&#129309;', l: 'Community Leaders', t: 'Jaati-dharm ke neta ka saath.', dyn: 'comm' },
 { id: 'spy', i: '&#128373;', l: 'Spy', t: 'Virodhi ki gupt khabar nikalwao.', tgt: true, spy: true },
 { id: 'court', i: '&#9878;', l: 'Court / Aayog', t: 'Spy ki khabar par case karo.', tgt: true, court: true },
 { id: 'off', i: '&#127963;', l: 'Sthaniya Adhikari', t: 'Prashasan ka saath (jokhim ke saath).', a: [
   { n: 'Adhikari se samarthan', c: 6, s: 8, pow: 6, risk: [0.2, -5, 'Adhikari ka pakshpaat ujagar.'] }, { n: 'Police-prashasan se talmel', c: 5, s: 8, pow: 5, pop: 1 }] },
 { id: 'univ', i: '&#127891;', l: 'University / College', t: 'Chhatron ko saath lo.', a: [
   { n: 'College rally', c: 6, s: 20, pop: 5, pow: 1 }, { n: 'Student sangh se baat', c: 4, s: 12, pop: 3, pow: 3 }, { n: 'Yuva sammelan', c: 9, s: 20, pop: 6, pow: 2 }] },
 { id: 'seg', i: '&#129489;', l: 'Yuva-Mahila-Buzurg', t: 'Alag varg ke liye yojana.', dyn: 'seg' },
 { id: 'vip', i: '&#11088;', l: 'VIP Support', t: 'Bade chehre ka prachar.', a: [
   { n: 'Filmstar ka road show', c: 25, s: 20, pop: 12, pow: 1 }, { n: 'Cricketer ka prachar', c: 20, s: 15, pop: 9 }, { n: 'Sant ka aashirwad', c: 12, s: 10, pop: 6, rep: 3 }, { n: 'Party ke bade neta (star prachaarak)', c: 30, s: 20, pop: 14, pow: 4, party: true }] },
 { id: 'rest', i: '&#9889;', l: 'Stamina', t: 'Thakan utaro, stamina wapas paao.', a: [{ n: 'Aaram', c: 3, s: 0, rest: 20, lim: 2 }, { n: 'Energy team (doctor + helicopter)', c: 8, s: 0, rest: 35, lim: 1 }] },
 { id: 'poll', i: '&#128200;', l: 'Survey', t: 'Paid survey se abhi ka rujhan dekho.', a: [{ n: 'Survey karwao (rujhan dikhega)', c: 4, s: 5, poll: 1 }] }
];

function startWar() {
    var fs = assemblyData[S.state].features, segs = [], nb = [];
    if (S.type === 'MLA') {
        var no = parseInt(S.seat, 10), main = fs.filter(function (f) { return f.properties.no === no; })[0] || fs.filter(function (f) { return S.seat.indexOf(f.properties.nm) >= 0; })[0] || fs[0];
        segs = [main]; nb = fs.filter(function (f) { return f !== main && f.properties.d === main.properties.d; }).slice(0, 25);
        S.seatName = main.properties.nm;
    } else { segs = fs.filter(function (f) { return f.properties.pc === S.seat; }); if (!segs.length) segs = [fs[0]]; S.seatName = S.seat; }
    var D = demo(), P = pastData(D), key = S.state + '|' + S.seat, f = S.type === 'MP' ? 3 : 1;
    var cc = null; if (S.career) { try { cc = JSON.parse(localStorage.getItem('rajniti_career_v1')).res; } catch (e) { cc = null; } }
    var own = !!S.career, ind = !S.party, share = S.party && !own ? (P.overall[S.party] || 6) : 0, pm = ind ? 0.85 : (own ? 0.88 : 1);
    var me = { id: 'me', me: true, name: S.name, party: S.party || 'Independent', color: S.color || '#94a3b8', img: S.photo && S.photo.indexOf('data:') === 0 ? S.photo : avatar(parseInt((S.photo || 'av:0').split(':')[1], 10) || 0), logo: S.logo || (S.party ? emblem(S.party) : emblem('')) };
    try { var _ph = window.CareerMode && CareerMode.photoFor && CareerMode.photoFor(S.name); if (_ph) me.img = _ph; } catch (e) {}
    try { if (window.CareerMode && CareerMode.hasParty() && CareerMode.getParty().name === S.party && CareerMode.perks) { var _pk = CareerMode.perks(); if (_pk.consult) me.pop = clamp(me.pop + 5, 0, 100); if (_pk.ecActive) { me.pop = clamp(me.pop + 7, 0, 100); localStorage.setItem('rajniti_ec_used', '1'); } } } catch (e) {}
    if (ind) { me.pop = 15; me.rep = 52; me.pow = 8; }
    else if (own) { var st = cc ? cc.strength : 3, im = cc ? cc.image : 20, cd = cc ? cc.cadre : 10; me.pop = 9 + st * 0.9 + im * 0.1; me.rep = 45 + im * 0.12; me.pow = 6 + cd * 0.12; }
    else { me.pop = 8 + share * 0.9 + 4; me.rep = 50; me.pow = 14 + share * 0.4; }
    var cands = [me];
    S.opps.forEach(function (o) {
        var sh = P.overall[o.p] || 5, rc = realCand(o.p), c = { id: 'o:' + o.p, name: rc ? rc[0] : nameGen(), inc: !!rc && lsSeat().c[0] === rc, age: rc ? rc[3] : 0, party: o.p, color: pcol(o.p), img: emblem(o.p), o: o };
        c.pop = 8 + sh * 0.9 + ({ low: -6, mid: 0, high: 7 })[o.str] + (o.base === 'jati' || o.base === 'dharm' ? 2 : 0);
        c.rep = 50 + ({ dabang: -10, saaf: 12, bahari: 0, dalbadlu: -8 })[o.cand] + rnd(-4, 4);
        c.pow = 10 + sh * 0.4 + ({ dabang: 15, saaf: 0, bahari: 5, dalbadlu: 4 })[o.cand] + ({ low: 0, mid: 6, high: 14 })[o.res];
        if (o.cand === 'bahari') c.pop -= 6; if (o.cand === 'dalbadlu') c.pop += 3;
        cands.push(c);
    });
    cands.forEach(function (c) { c.pop = clamp(c.pop, 3, 90); c.rep = clamp(c.rep, 10, 95); c.pow = clamp(c.pow, 2, 90); });
    var extra = cc ? Math.min(cc.funds * 8, 120 * f) : 0;
    F = { reveal: false, type: S.type, state: S.state, seat: S.seat, seatName: S.seatName, segs: segs, nb: nb, D: D, P: P, cands: cands, me: me, round: 1, stamina: 100, f: f, pm: pm, diff: S.diff, budget: Math.round(60 * f + extra), news: ['Chunav ka bigul baja: ' + S.seatName + '.'], cnt: {}, intel: {}, sel: null, panel: null, tgt: cands.length > 1 ? cands[1].id : null, msg: null, noise: {}, electorate: lsSeat() && lsSeat().el ? lsSeat().el : S.type === 'MP' ? Math.round(1400000 + sr(key + 'e') * 600000) : Math.round(210000 + sr(key + 'e') * 120000), turnout: P.turnout / 100, career: S.career, own: own };
    segs.forEach(function (sg) { F.noise[sg.properties.no] = cands.map(function (c, i) { return acNoise(sg.properties.no, c, key); }); });
    buildWar();
}
function acNoise(no, c, key) {
    var base = 0.85 + sr(key + no + c.id) * 0.3, a = lsAc(no), rl = lsSeat(); if (!a || !rl || c.party === 'Independent') return base;
    var top = a[3], tv = 0, pv = 0, pt = 0; top.forEach(function (x) { tv += x[2]; });
    rl.c.slice(0, 4).forEach(function (x) { pt += x[4]; });
    var ac = top.filter(function (x) { return x[1] === c.party; })[0], pc = rl.c.filter(function (x) { return x[1] === c.party; })[0];
    if (!ac || !pc || !tv || !pt) return base * 0.9;
    var ratio = (ac[2] / tv) / (pc[4] / pt); return clamp(0.6 + ratio * 0.4 + (base - 1) * 0.3, 0.55, 1.6);
}
function score(c) { return c.pop * 0.68 + c.rep * 0.32; }
function standings(noise) {
    var tot = 0, rows = F.cands.map(function (c) { var s = score(c) * (noise ? rnd(0.95, 1.05) : 1); tot += s; return { c: c, s: s }; });
    rows.forEach(function (r) { r.share = r.s / tot; r.votes = Math.round(r.share * F.electorate * F.turnout); });
    rows.sort(function (a, b) { return b.votes - a.votes; });
    return rows;
}
var PANEL_ICON = {
    demo: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 10a2.5 2.5 0 1 0 0-5M16 14.2c3 .3 5 2.4 5 5.8',
    past: 'M4 20V10M10 20V4M16 20v-8M22 20H2', social: 'M5 9h14M5 15h14M10 4L8 20M16 4l-2 16', rally: 'M4 10v4h3l7 4V6L7 10H4zM17 9a4 4 0 0 1 0 6',
    event: 'M5 21V4M5 5h12l-2 4 2 4H5', guru: 'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z', fund: 'M12 3v18M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3',
    issue: 'M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', biz: 'M3 8h18v11H3zM9 8V6h6v2M3 13h18',
    house: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6', jumla: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7', wa: 'M4 5h16v11H9l-5 4z',
    infl: 'M4 8h4l2-3h4l2 3h4v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', comm: 'M6 12a2.5 2.5 0 1 0 0-.01M18 6a2.5 2.5 0 1 0 0-.01M18 18a2.5 2.5 0 1 0 0-.01M8.3 11l7.4-4M8.3 13l7.4 4',
    spy: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', court: 'M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18',
    off: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', univ: 'M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5',
    seg: 'M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 21c0-4 3-7 7-7s7 3 7 7', vip: 'M3 18l2-10 5 5 2-7 2 7 5-5 2 10zM3 21h18'
};
function pIcon(id) { return '<svg class="cs-i" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (PANEL_ICON[id] || PANEL_ICON.seg) + '"/></svg>'; }
var GEAR = '<svg class="cs-i" viewBox="0 0 24 24" style="width:19px;height:19px"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
function sideBtns(list) { return list.map(function (p) { return '<button class="cs-ic" data-p="' + p.id + '" onclick="ConstituencyFight.panel(\'' + p.id + '\')">' + pIcon(p.id) + '<span>' + E(p.l) + '</span></button>'; }).join(''); }

function buildWar() {
    cssX();
    var w = war(), L = PANELS.slice(0, 10), R = PANELS.slice(10);
    w.innerHTML = '<div class="cs-bar"><div class="cs-bl"><button class="cs-x" onclick="ConstituencyFight.leave()" title="Peeche">&larr;</button><button class="cs-x" onclick="ConstituencyFight.settings()" title="Settings">' + GEAR + '</button></div><div class="cs-cands" id="cs-cands"></div><button class="cs-go" id="cs-go" onclick="ConstituencyFight.nextRound()"></button></div>' +
        '<div class="cs-mid"><div class="cs-side" id="cs-sl">' + sideBtns(L) + '</div><div class="cs-meters" id="cs-meters"></div><div class="cs-mapw"><div id="cs-map"></div></div><div class="cs-side r" id="cs-sr">' + sideBtns(R) + '</div><div class="cs-draw hidden" id="cs-draw"></div></div>' +
        '<div class="cs-bot"><div class="cs-box" id="cs-b1"></div><div class="cs-box" id="cs-b2"><div class="cs-bh"><span>Seat ki sthiti</span><span class="cs-live"><i></i>Live</span></div><div id="cs-slide"></div></div><div class="cs-box" id="cs-b3"></div></div>';
    ui().classList.add('hidden'); w.classList.remove('hidden');
    F.spot = 0; F.tk = 0; F.mqsig = '';
    initMap(); refresh(); startTicker();
}
function candImg(c) {
    if (c.me) return '<span class="cs-av2"><img src="' + c.img + '" alt=""><img class="cs-em xs" src="' + (c.logo || emblem(c.party === 'Independent' ? '' : c.party)) + '" alt=""></span>';
    return '<img class="cs-em" src="' + emblem(c.party) + '" alt="">';
}
function spotSlides() {
    var rows = standings(false), me = F.me, lead = rows[0], gap = rows.length > 1 ? rows[0].votes - rows[1].votes : 0, sl = [];
    sl.push({ t: 'Muqabla', v: lead.c.me ? 'Aap aage hain' : E(lead.c.party) + ' aage hai', s: rows.length > 1 ? fmt(gap) + ' vote ka antar' : 'Aap akele ummeedwar hain', c: lead.c.me ? '#58c49a' : '#e0674a' });
    rows.slice(0, 4).forEach(function (r, i) { sl.push({ t: (i + 1) + '. ' + r.c.party, v: Math.round(r.share * 100) + '%', s: fmt(r.votes) + ' vote' + (r.c.me ? ' (aap)' : ''), c: r.c.color }); });
    var g = GROUPS.slice().sort(function (a, b) { return F.D.g[b[0]] - F.D.g[a[0]]; })[0];
    sl.push({ t: 'Sabse bada varg', v: E(g[1]), s: F.D.g[g[0]].toFixed(1) + '% matdata', c: '#8aa4ff' });
    sl.push({ t: 'Aapke meter', v: 'Pop ' + Math.round(me.pop) + ', Rep ' + Math.round(me.rep), s: 'Popularity aur reputation 50 se upar rakho', c: '#f0b04a' });
    if (F.type === 'MP' && F.segs.length > 1) { var sg = F.segs[F.spot % F.segs.length], r0 = segRows(sg.properties.no)[0]; sl.push({ t: 'Vidhan sabha khand', v: E(sg.properties.nm), s: E(r0.c.party) + ' aage', c: r0.c.color }); }
    var rlw = F.type === 'MP' && window.LS24 && LS24.pc[F.state] && LS24.pc[F.state][F.seat]; if (rlw && rlw.c[0]) sl.push({ t: 'Maujooda saansad (2024)', v: E(rlw.c[0][0]), s: E(rlw.c[0][1]) + ', ' + rlw.c[0][5] + '% vote', c: pcol(rlw.c[0][1]) });
    sl.push({ t: 'Pichhla chunav', v: E(F.P.winner) + ' jeete', s: 'Antar ' + F.P.margin.toFixed(1) + '%, turnout ' + F.P.turnout.toFixed(0) + '%', c: pcol(F.P.winner) });
    if (!revealed()) sl = sl.filter(function (x) { return !(x.t === 'Muqabla' || /^\d\. /.test(x.t) || x.t === 'Vidhan sabha khand'); });
    return sl;
}
function showSlide() {
    var el = document.getElementById('cs-slide'); if (!el || !F.slides || !F.slides.length) return;
    var s = F.slides[F.spot % F.slides.length];
    el.innerHTML = '<div class="cs-slide"><div class="st">' + E(s.t) + '</div><div class="sv">' + s.v + '</div><div class="ss">' + s.s + '</div><div class="sb" style="background:' + s.c + '"></div></div>';
}
var AMB = ['{p} ke karyakartaon ne ghar-ghar sampark kiya.', '{p} ki nukkad sabha mein achhi bheed juti.', 'Ilake mein "{i}" par charcha garam.', 'Sthaniya akhbar mein {p} ke ummeedwar ka interview chhapa.', 'Matdata suchi mein naye naam jude.', '{p} ne chai par charcha rakhi.', 'Mausam ne ek rally par asar dala.', 'Yuva matdata soshal media par sakriya.'];
function ambient() {
    var c = F.cands[Math.floor(Math.random() * F.cands.length)], line = AMB[Math.floor(Math.random() * AMB.length)].replace('{p}', c.party).replace('{i}', ISSUES[Math.floor(Math.random() * ISSUES.length)]);
    news(line); newsBox();
}
function newsBox() {
    var b = document.getElementById('cs-b3'); if (!b) return;
    var sig = F.news.slice(0, 7).join('|'); if (sig === F.mqsig) return; F.mqsig = sig;
    var rest = F.news.slice(1, 7).join('     \u2022     ') || F.news[0];
    b.innerHTML = '<div class="cs-bh"><span>Taaza khabar</span><span class="cs-live"><i></i>Live</span></div><div class="cs-hl">' + E(F.news[0] || '') + '</div><div class="cs-mq"><span style="animation-duration:' + Math.max(22, Math.round(rest.length * 0.28)) + 's">' + E(rest) + '</span></div>';
}
var LT = null;
function startTicker() { stopTicker(); LT = setInterval(tickBox, 3200); }
function stopTicker() { if (LT) { clearInterval(LT); LT = null; } }
function tickBox() {
    var w = document.getElementById('cs-war'); if (!F || !w || w.classList.contains('hidden') || !document.getElementById('cs-slide')) return;
    F.tk++; F.spot++; F.slides = spotSlides(); showSlide();
    if (F.tk % 3 === 0 && Math.random() < 0.75) ambient();
}
// Game shuru mein vote/aage-peeche nahi dikhta: pehla round khatam hone par ya Survey se dikhega
function cssX() {
    if (document.getElementById('cs-css2')) return;
    var st = document.createElement('style'); st.id = 'cs-css2'; st.textContent = ".cs-m i u{overflow:hidden;transition:height .9s cubic-bezier(.2,.8,.2,1)}\n.cs-m i u::after{content:\"\";position:absolute;left:0;right:0;top:-40%;height:40%;background:linear-gradient(180deg,transparent,rgba(255,255,255,.45),transparent);animation:csWave 2.6s linear infinite}\n@keyframes csWave{0%{transform:translateY(0)}100%{transform:translateY(420%)}}\n@keyframes csUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}\n@keyframes csBoxIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}\n@keyframes csStripe{from{background-position:0 0}to{background-position:28px 0}}\n@keyframes csGlow{0%,100%{box-shadow:0 0 0 rgba(240,176,74,0)}50%{box-shadow:0 0 22px rgba(240,176,74,.5)}}\n@keyframes csFall{0%{transform:translateY(-20px) rotate(0)}100%{transform:translateY(105vh) rotate(720deg)}}\n.cs-bot .cs-box{animation:csBoxIn .6s ease both}.cs-bot .cs-box:nth-child(2){animation-delay:.12s}.cs-bot .cs-box:nth-child(3){animation-delay:.24s}\n#cs-b1 .cs-pb i{position:relative;overflow:hidden;transition:width .8s}#cs-b1 .cs-pb i::after{content:\"\";position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.3) 0 8px,transparent 8px 16px);background-size:28px 28px;animation:csStripe .9s linear infinite}.cs-box::before{content:\"\";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.12) 50%,transparent 65%);transform:translateX(-120%);animation:csSweep 5s ease-in-out infinite;pointer-events:none}@keyframes csSweep{0%{transform:translateX(-120%)}60%,100%{transform:translateX(120%)}}@keyframes csBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}#cs-b1 .cs-bv{animation:csBreath 3s ease-in-out infinite;transform-origin:left center}#cs-slide>*{animation:csUp .6s ease both}#cs-b3{border-top:3px solid #f0b04a}.cs-bh{display:flex;justify-content:space-between;align-items:center}@keyframes csGlowB{0%,100%{box-shadow:0 0 0 rgba(88,196,154,0)}50%{box-shadow:0 0 18px rgba(88,196,154,.35)}}#cs-b2{animation:csGlowB 3s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.cs-box::before,#cs-b1 .cs-bv,#cs-b2{animation:none}}\n#cs-b1 .cs-bv{animation:csUp .5s ease both}\n#cs-b3 .cs-hl,#cs-b3 b{animation:csUp .55s ease both}\n.cs-cnt{display:flex;flex-direction:column;gap:10px}\n.cs-lv{align-self:center;display:inline-flex;gap:8px;align-items:center;padding:5px 16px;border-radius:20px;background:rgba(224,103,74,.18);color:#fca5a5;font-weight:800;letter-spacing:3px;font-size:13px}.cs-lv i{width:9px;height:9px;border-radius:50%;background:#e0674a;animation:csPulse 1s infinite}\n@keyframes csPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.5)}}\n.cs-cn-t{text-align:center;color:#94a3b8;font-size:.95rem;margin-bottom:6px}\n.cs-cr{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:16px;background:var(--cd,rgba(255,255,255,.04));border:1px solid var(--ln,rgba(255,255,255,.1));border-left:6px solid var(--c)}\n.cs-cr .av{width:50px;height:50px;border-radius:50%;object-fit:cover;background:#fff;flex:none}\n.cs-cr .b{flex:1;min-width:0}.cs-cr .n b{display:block}.cs-cr .n small{color:#94a3b8}\n.cs-cr .bar{height:12px;border-radius:7px;background:#0a1417;overflow:hidden;margin-top:6px}.cs-cr .bar i{display:block;height:100%;width:0;border-radius:7px;background:var(--c);transition:width .6s ease}\n.cs-cr .v{min-width:90px;text-align:right;font:400 22px/1 \"Yatra One\",Hind,serif;font-variant-numeric:tabular-nums}\n.cs-cr.lead{animation:csGlow 1.6s infinite}\n.cs-hero{position:relative;overflow:hidden;text-align:center;padding:28px 16px;border-radius:22px;background:radial-gradient(circle at 50% 0,rgba(240,176,74,.22),rgba(255,255,255,.02) 70%);border:1px solid rgba(240,176,74,.45);animation:csUp .7s ease both}\n.cs-hero h2{font:400 32px/1.15 \"Yatra One\",Hind,serif;margin:6px 0}.cs-ht{font-weight:800;letter-spacing:4px}.cs-mg{margin-top:8px;color:#e2e8f0}.cs-mg b{color:#f0b04a;font-size:1.3rem}\n.cs-conf{position:absolute;inset:0;pointer-events:none;overflow:hidden}.cs-conf i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;animation:csFall 3.6s linear infinite}";
    document.head.appendChild(st);
}
function revealed() { return !!(F && (F.reveal || F.round > 1)); }
function refresh() {
    var rows0 = standings(false), lead = rows0[0], me = F.me, rv = revealed(), rows = rv ? rows0 : F.cands.map(function (c) { return { c: c, votes: 0, share: 0 }; });
    document.getElementById('cs-cands').innerHTML = rows.slice(0, 5).map(function (r, i) {
        var diff = i === 0 ? (rows.length > 1 ? '+' + fmt(r.votes - rows[1].votes) + ' aage' : '') : fmt(rows[0].votes - r.votes) + ' peeche';
        return '<div class="cs-c' + (r.c.me ? ' me' : '') + '" style="--c:' + r.c.color + '">' + candImg(r.c) + '<div><b>' + E(r.c.name) + '</b><small>' + E(r.c.party) + (r.c.inc ? ' | maujooda saansad' : '') + '</small><span class="v">' + (rv ? fmt(r.votes) + ' (' + Math.round(r.share * 100) + '%) <span style="color:' + (i === 0 ? '#58c49a' : '#e0674a') + '">' + diff + '</span>' : 'rujhan abhi nahi aaya') + '</span></div></div>';
    }).join('');
    var mt = function (n, v, col) { return '<div class="cs-m"><span>' + n + '</span><i><u style="height:' + v + '%;background:' + col + '"></u></i><b>' + Math.round(v) + '</b></div>'; };
    document.getElementById('cs-meters').innerHTML = mt('Popularity', me.pop, 'linear-gradient(#58c49a,#2f8f6d)') + mt('Reputation', me.rep, 'linear-gradient(#8aa4ff,#4d63d6)');
    var go = document.getElementById('cs-go'); go.innerHTML = (F.round >= ROUNDS ? 'Matganana &#9654;' : 'Agla round &#9654;') + '<small>Round ' + F.round + ' / ' + ROUNDS + '</small>';
    var days = (ROUNDS - F.round + 1) * 7;
    document.getElementById('cs-b1').innerHTML = '<div class="cs-bh"><span>Prachar ka daur</span><span class="cs-live"><i></i>Live</span></div><div class="cs-bv">Round ' + F.round + '<small>/ ' + ROUNDS + '</small></div>' +
        '<div class="cs-pb"><i style="width:' + F.stamina + '%;background:' + (F.stamina > 40 ? '#58c49a' : '#e0674a') + '"></i></div>' +
        '<div class="cs-kv"><span>Stamina</span><b>' + F.stamina + '%</b><span>Baaki din</span><b>' + days + '</b><span>Budget</span><b style="color:#f0b04a">' + fmt(F.budget) + ' L</b><span>Sthiti</span><b style="color:' + (!rv ? '#94a3b8' : (lead.c.me ? '#58c49a' : '#e0674a')) + '">' + (!rv ? 'Abhi pata nahi' : (lead.c.me ? 'Aage' : 'Peeche')) + '</b></div>';
    F.slides = spotSlides(); if (!document.querySelector('#cs-slide .cs-slide')) showSlide();
    newsBox();
    if (layer) layer.eachLayer(function (l) { l.setStyle(segStyle(l.feature.properties.no)); });
    if (F.panel) renderPanel();
}

function initMap() {
    if (map) { try { map.remove(); } catch (e) {} map = null; }
    var host = document.getElementById('cs-map');
    if (typeof L === 'undefined' || !F.segs.length) { if (host) host.innerHTML = '<div class="cs-nomap">' + E(F.seatName) + '</div>'; return; }
    map = L.map('cs-map', { attributionControl: false, zoomSnap: 0.25, preferCanvas: true, zoomControl: true });
    var nbL = L.geoJSON({ type: 'FeatureCollection', features: F.nb }, { style: { fillColor: '#1e293b', fillOpacity: 0.5, color: '#334155', weight: 0.7 } }).addTo(map);
    layer = L.geoJSON({ type: 'FeatureCollection', features: F.segs }, {
        style: function (f) { return segStyle(f.properties.no); },
        onEachFeature: function (f, l) { l.bindTooltip(function () { var r = segRows(f.properties.no); return '<b>' + E(f.properties.nm) + '</b><br>' + r.slice(0, 3).map(function (x) { return E(x.c.party) + ' ' + Math.round(x.share * 100) + '%'; }).join(' | '); }, { sticky: true }); }
    }).addTo(map);
    map.fitBounds(layer.getBounds(), { padding: [30, 30] });
    setTimeout(function () { if (map) { map.invalidateSize(); map.fitBounds(layer.getBounds(), { padding: [30, 30] }); } }, 250);
}
function segRows(no) {
    var nz = F.noise[no] || [], tot = 0, rows = F.cands.map(function (c, i) { var s = score(c) * (nz[i] || 1); tot += s; return { c: c, s: s }; });
    rows.forEach(function (r) { r.share = r.s / tot; }); rows.sort(function (a, b) { return b.s - a.s; }); return rows;
}
function segStyle(no) { if (!revealed()) return { fillColor: '#1d4f8a', fillOpacity: 0.4, color: '#fff', weight: 1.5 }; var r = segRows(no); return { fillColor: r[0].c.color, fillOpacity: 0.45 + Math.min(0.4, (r[0].share - r[1 < r.length ? 1 : 0].share) * 2), color: '#fff', weight: 1.5 }; }
function news(t) { F.news.unshift(t); F.news = F.news.slice(0, 10); }

// ---------- panels ----------
function dynActs(kind) {
    if (kind === 'issue') {
        var key = S.state + '|' + S.seat, list = ISSUES.slice().sort(function (a, b) { return sr(key + a) - sr(key + b); }).slice(0, 5);
        return list.map(function (m) { return { n: m + ': hal ka vaada + kaam', c: 6, s: 10, pop: 4, rep: 4, pow: 1 }; });
    }
    if (kind === 'comm') return GROUPS.filter(function (g) { return F.D.g[g[0]] >= 3; }).map(function (g) { return { n: g[1] + ' ke neta ka saath', c: 5, s: 10, pop: 5, rep: 1, grp: g[0] }; });
    if (kind === 'seg') return [['yuva', 'Yuva: rozgar aur internet yojana', 8], ['mahila', 'Mahila: suraksha aur samman rashi', 8], ['buzurg', 'Buzurg: pension aur swasthya', 6], ['kisan', 'Kisan: fasal dam aur khaad', 7]].map(function (x) { return { n: x[1], c: x[2], s: 12, pop: 5, rep: 1, seg: x[0] }; });
    return [];
}
function actsOf(p) {
    if (p.dyn) return dynActs(p.dyn);
    if (p.spy) return [{ n: 'Virodhi ki gupt khabar nikalwao', c: 8, s: 10, spy: 1 }];
    if (p.court) return [{ n: 'Court mein case daalo', c: 10, s: 12, court: 'court' }, { n: 'Chunav Aayog mein shikayat', c: 5, s: 8, court: 'ec' }];
    return p.a || [];
}
function groupFactor(a) {
    if (a.grp) return clamp(0.4 + F.D.g[a.grp] / 100 * 3.2, 0.4, 2);
    if (a.seg) return clamp(0.4 + F.D.seg[a.seg] / 100 * 2.5, 0.4, 1.8);
    return 1;
}
function openPanel(id) { F.panel = id; F.msg = null; renderPanel(); }
function closePanel() { F.panel = null; document.getElementById('cs-draw').classList.add('hidden'); document.querySelectorAll('.cs-ic').forEach(function (b) { b.classList.remove('on'); }); }
function renderPanel() {
    var p = PANELS.filter(function (x) { return x.id === F.panel; })[0], d = document.getElementById('cs-draw');
    if (!p) { d.classList.add('hidden'); return; }
    d.className = 'cs-draw ' + (PANELS.indexOf(p) < 10 ? 'l' : 'r');
    var h = '<div style="display:flex;justify-content:space-between"><div><h2>' + p.i + ' ' + E(p.l) + '</h2><div class="sub">' + E(p.t || '') + '</div></div><button class="cs-x" onclick="ConstituencyFight.closePanel()">&times;</button></div>' +
        '<div class="cs-row" style="margin-bottom:8px"><span class="cs-pill">Stamina ' + F.stamina + '%</span><span class="cs-pill">Budget ' + fmt(F.budget) + ' L</span></div>' + (F.msg ? '<div class="cs-msg ' + F.msg.k + '">' + E(F.msg.t) + '</div>' : '');
    if (p.id === 'demo') h += demoHtml(); else if (p.id === 'past') h += pastHtml(); else {
        if (p.tgt) { var opps = F.cands.filter(function (c) { return !c.me; }); h += opps.length ? '<div style="margin-bottom:8px">Nishana: <select class="cs-sel" onchange="ConstituencyFight.target(this.value)">' + opps.map(function (c) { return '<option value="' + E(c.id) + '"' + (F.tgt === c.id ? ' selected' : '') + '>' + E(c.party) + ' - ' + E(c.name) + '</option>'; }).join('') + '</select></div>' : '<div class="cs-msg">Koi virodhi nahi.</div>'; }
        if (p.spy || p.court) { var tc = F.cands.filter(function (c) { return c.id === F.tgt; })[0]; if (tc) h += '<div class="cs-pill">Khabar ka star: ' + (F.intel[tc.id] || 0) + ' / 3</div>'; }
        actsOf(p).forEach(function (a, i) {
            var cost = Math.round(a.c * F.f), bad = a.party && !F.me.party || (a.party && F.me.party === 'Independent'), lim = F.cnt[p.id + i] || 0;
            var fx = [a.pop ? 'popularity +' + a.pop : '', a.rep ? 'reputation ' + (a.rep > 0 ? '+' : '') + a.rep : '', a.pow ? 'reputation/popularity +' + (a.pow / 2) : '', a.rest ? 'stamina +' + a.rest + '%' : '', a.opp ? 'virodhi popularity -' + a.opp : '', a.gain ? 'paisa +' + Math.round(a.gain * F.f) + ' L' : '', a.spy ? 'virodhi ki khabar' : '', a.court ? 'case' : ''].filter(Boolean).join(' | ');
            h += '<div class="cs-act"><span class="t"><b>' + E(a.n) + '</b><small>' + fx + '</small><small>Kharch ' + cost + ' L | stamina ' + a.s + '% | is round mein ' + lim + '/3</small></span><button class="cs-btn sm"' + (bad || lim >= 3 ? ' disabled' : '') + ' onclick="ConstituencyFight.act(\'' + p.id + '\',' + i + ')">' + (bad ? 'Party chahiye' : 'Karo') + '</button></div>';
        });
    }
    d.innerHTML = h; d.classList.remove('hidden');
    document.querySelectorAll('.cs-ic').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-p') === F.panel); });
}
function demoHtml() {
    return '<div class="cs-card" style="padding:12px"><h3>JAATI-DHARM</h3>' + GROUPS.map(function (g) { var v = F.D.g[g[0]]; return '<div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between;font-size:.82rem"><span>' + g[1] + '</span><b>' + v.toFixed(1) + '%</b></div><div class="cs-pb"><i style="width:' + clamp(v, 1, 100) + '%;background:#38bdf8"></i></div></div>'; }).join('') + '</div>' +
        '<div class="cs-card" style="padding:12px"><h3>VARG</h3>' + [['yuva', 'Yuva'], ['mahila', 'Mahila'], ['buzurg', 'Buzurg'], ['kisan', 'Kisan']].map(function (x) { return '<span class="cs-pill">' + x[1] + ' ' + F.D.seg[x[0]].toFixed(0) + '%</span>'; }).join('') + '<div style="color:#94a3b8;font-size:.75rem;margin-top:6px">Jis varg ka hissa bada, uski yojana/leader ka asar utna zyada.</div></div>';
}
function pastHtml() {
    var P = F.P, top = P.order.slice(0, 5);
    var h = '<div class="cs-card" style="padding:12px"><h3>PICHHLE CHUNAV KA NATIJA</h3><div style="font-size:.82rem;margin-bottom:6px">Turnout ' + P.turnout.toFixed(1) + '% | Jeete: <b style="color:' + pcol(P.winner) + '">' + E(P.winner) + '</b> (jeet ka antar ' + P.margin.toFixed(1) + '%)</div>' +
        top.map(function (p) { return '<div style="margin-bottom:5px"><div style="display:flex;justify-content:space-between;font-size:.8rem"><span style="color:' + pcol(p) + '">' + E(p) + '</span><b>' + P.overall[p].toFixed(1) + '%</b></div><div class="cs-pb"><i style="width:' + clamp(P.overall[p], 1, 100) + '%;background:' + pcol(p) + '"></i></div></div>'; }).join('') + '</div>';
    h += '<div class="cs-card" style="padding:12px;overflow:auto"><h3>KIS VARG NE KIS PARTY KO KITNA VOTE DIYA (%)</h3><table class="cs-tbl"><tr><th>Varg</th>' + top.map(function (p) { return '<th style="color:' + pcol(p) + '">' + E(p.slice(0, 7)) + '</th>'; }).join('') + '</tr>' +
        GROUPS.filter(function (g) { return F.D.g[g[0]] >= 2; }).map(function (g) { return '<tr><td>' + g[1] + '</td>' + top.map(function (p) { var v = P.sup[g[0]][p] || 0; return '<td style="background:rgba(56,189,248,' + (v / 120).toFixed(2) + ')">' + Math.round(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
    return h;
}
function target(id) { F.tgt = id; renderPanel(); }

// ---------- action ----------
function act(pid, i) {
    var p = PANELS.filter(function (x) { return x.id === pid; })[0], a = actsOf(p)[i], me = F.me, key = pid + i, cost = Math.round(a.c * F.f);
    if ((F.cnt[key] || 0) >= 3) return;
    if (a.lim && (F.cnt[key] || 0) >= a.lim) { F.msg = { t: 'Is round mein ' + a.n + ' sirf ' + a.lim + ' baar.', k: 'bad' }; return renderPanel(); }
    if (a.rest && F.stamina >= 100) { F.msg = { t: 'Stamina pehle se poori hai.', k: 'bad' }; return renderPanel(); }
    if (F.budget < cost) { F.msg = { t: 'Budget kam hai (' + cost + ' L chahiye).', k: 'bad' }; return renderPanel(); }
    if (F.stamina < a.s) { F.msg = { t: 'Stamina kam hai (' + a.s + '% chahiye).', k: 'bad' }; return renderPanel(); }
    var tgt = F.cands.filter(function (c) { return c.id === F.tgt; })[0];
    if ((p.tgt) && !tgt) { F.msg = { t: 'Pehle nishana chuno.', k: 'bad' }; return renderPanel(); }
    F.budget -= cost; F.stamina -= a.s; F.cnt[key] = (F.cnt[key] || 0) + 1;
    var e = DIFFS[F.diff][2] * F.pm * groupFactor(a), txt = a.n + ': ';
    var g = function (cur, v) { return v * e * (1 - cur / 140) * rnd(0.85, 1.15); };
    if (a.poll) {
        F.reveal = true; F.msg = { t: 'Survey agency ne rujhan diye: ab vote ka andaza dikh raha hai (final natija badal sakta hai).', k: 'good' };
    } else if (a.rest) {
        F.stamina = clamp(F.stamina + a.rest, 0, 100); F.msg = { t: a.n + ': stamina +' + a.rest + '%.', k: 'good' };
    } else if (a.spy) {
        if (Math.random() < 0.75) { F.intel[tgt.id] = Math.min(3, (F.intel[tgt.id] || 0) + 1); txt += tgt.party + ' ke ummeedwar ke bare mein nayi khabar mili (star ' + F.intel[tgt.id] + ').'; F.msg = { t: txt, k: 'good' }; }
        else { F.msg = { t: 'Spy kuch hath nahi laga paya.', k: 'bad' }; }
    } else if (a.court) {
        var lv = F.intel[tgt.id] || 0;
        if (lv < 1) { F.budget += cost; F.stamina += a.s; F.cnt[key]--; F.msg = { t: 'Pehle spy se khabar nikalwao.', k: 'bad' }; return renderPanel(); }
        var pr = (a.court === 'court' ? 0.2 : 0.3) + lv * 0.18 + (tgt.o && tgt.o.cand === 'dalbadlu' ? 0.1 : 0), ok = Math.random() < Math.min(0.9, pr);
        if (ok) { var d = (a.court === 'court' ? 6 : 3) + lv * 2; tgt.pop = clamp(tgt.pop - d, 0, 100); tgt.rep = clamp(tgt.rep - d * 1.3, 0, 100); F.intel[tgt.id] = Math.max(0, lv - 1); me.rep = clamp(me.rep + 2, 0, 100); F.msg = { t: tgt.party + ' ke ummeedwar par case chala, unki chhavi giri.', k: 'good' }; news('Case: ' + tgt.party + ' ka ummeedwar vivaad mein.'); }
        else { me.rep = clamp(me.rep - 3, 0, 100); F.msg = { t: 'Case khaarij hua, aapki chhavi par asar pada.', k: 'bad' }; }
    } else {
        if (a.pop) me.pop = clamp(me.pop + g(me.pop, a.pop), 0, 100);
        if (a.rep) me.rep = clamp(me.rep + (a.rep > 0 ? g(me.rep, a.rep) : a.rep), 0, 100);
        if (a.pow) { me.rep = clamp(me.rep + g(me.rep, a.pow * 0.5), 0, 100); me.pop = clamp(me.pop + g(me.pop, a.pow * 0.5), 0, 100); }
        if (a.pop && a.rep == null && a.pop >= 3) me.rep = clamp(me.rep + g(me.rep, a.pop * 0.25), 0, 100);
        if (a.gain) F.budget += Math.round(a.gain * F.f * DIFFS[F.diff][2]);
        if (a.opp && tgt) { tgt.pop = clamp(tgt.pop - a.opp * e, 0, 100); if (a.orep) tgt.rep = clamp(tgt.rep - a.orep * e, 0, 100); }
        var bad = false;
        if (a.risk && Math.random() < a.risk[0]) { me.rep = clamp(me.rep + a.risk[1], 0, 100); txt += a.risk[2]; bad = true; } else txt += 'safal raha.';
        F.msg = { t: txt, k: bad ? 'bad' : 'good' };
    }
    news(F.msg.t); refresh();
}

// ---------- round / counting ----------
// Virodhi ummeedwar ab khud khelte hain: budget, kaam ka chunav, aur aage ho to aap par hamla.
// Level (Aasaan..Bahut Mushkil) se unki chaal, budget aur hamle ki taqat badalti hai.
function aiOpp(c, k) {
    var o = c.o || { str: 'mid', res: 'mid', cand: 'saaf' }, lv = F.diff, f = F.f;
    var moves = ({ easy: 1, normal: 2, hard: 3, brutal: 4 })[lv] || 2;
    if (c.ai == null) c.ai = { budget: Math.round(45 * f * k) };
    c.ai.budget += Math.round(12 * f * k);
    var m = ({ low: 0.8, mid: 1, high: 1.25 })[o.str] * ({ low: 0.85, mid: 1, high: 1.15 })[o.res];
    var meLead = standings(false)[0].c.me;
    for (var i = 0; i < moves; i++) {
        var r = Math.random();
        if (meLead && r < 0.22 * k && c.ai.budget >= 4 * f && (lv !== 'easy' || Math.random() < 0.5)) {
            c.ai.budget -= Math.round(4 * f);
            if (Math.random() < 0.7) { var dd = rnd(1.5, 3.2) * k; F.me.pop = clamp(F.me.pop - dd, 0, 100); news(c.party + ' ke samarthakon ne aapke khilaf jhoothi khabar failayi (-' + dd.toFixed(1) + ').'); }
            else { c.rep = clamp(c.rep - 3, 0, 100); news(c.party + ' ka hamla ulta pada, unki chhavi giri.'); }
        } else if (c.ai.budget >= 8 * f && r < 0.62) {
            c.ai.budget -= Math.round(8 * f);
            c.pop = clamp(c.pop + rnd(1.8, 3.2) * k * m * (1 - c.pop / 140), 0, 100); c.pow = clamp(c.pow + 0.8 * k, 0, 100);
            if (Math.random() < 0.5) news(c.party + ' ne badi rally ki.');
        } else if (c.ai.budget >= 3 * f) {
            c.ai.budget -= Math.round(3 * f);
            c.pop = clamp(c.pop + rnd(0.7, 1.6) * k * m * (1 - c.pop / 140), 0, 100); c.rep = clamp(c.rep + rnd(0, 1.2), 0, 100);
        } else c.pow = clamp(c.pow + 1 * k, 0, 100);
    }
    c.rep = clamp(c.rep + rnd(-1.5, 1), 0, 100);
    if (o.cand === 'dabang' && Math.random() < 0.1 * k) { c.pow = clamp(c.pow + 2, 0, 100); c.rep = clamp(c.rep - 2, 0, 100); news(c.party + ' ke dabang ummeedwar par dhamki ke aarop.'); }
}
function nextRound() {
    if (F.stamina > 60 && !confirm('Abhi stamina ' + F.stamina + '% bachi hai. Round khatam karein?')) return;
    var k = DIFFS[F.diff][1];
    F.cands.forEach(function (c) { if (!c.me) aiOpp(c, k); });
    F.reveal = true;
    F.cnt = {}; F.msg = null;
    if (F.round >= ROUNDS) return counting();
    F.round++; F.stamina = 100; F.budget += Math.round(15 * F.f);
    news('Round ' + (F.round - 1) + ' khatam. ' + Math.round(15 * F.f) + ' L ka naya funding mila.');
    refresh();
}
var CT = null;
function confettiC(n) { var cols = ['#f0b04a', '#58c49a', '#8aa4ff', '#e0674a', '#ffffff'], h = ''; for (var i = 0; i < n; i++) h += '<i style=\"left:' + Math.round(Math.random() * 100) + '%;background:' + cols[i % cols.length] + ';animation-delay:' + (Math.random() * 3).toFixed(2) + 's;animation-duration:' + (2.6 + Math.random() * 2).toFixed(2) + 's\"></i>'; return '<div class=\"cs-conf\">' + h + '</div>'; }
function counting() {
    var rows = standings(true); F.final = rows; stopTicker(); war().classList.add('hidden'); closePanel();
    var steps = 14, i = 0, jit = rows.map(function () { return rnd(-0.28, 0.28); });
    var h = '<div class=\"cs-cnt\"><div class=\"cs-lv\"><i></i>LIVE MATGANANA</div><div class=\"cs-cn-t\" id=\"cs-cn-t\">Round 0 / ' + steps + '</div>' +
        rows.map(function (r, k) { return '<div class=\"cs-cr\" id=\"cs-cr-' + k + '\" style=\"--c:' + r.c.color + '\"><img src=\"' + r.c.img + '\" class=\"av\"><div class=\"b\"><div class=\"n\"><b>' + E(r.c.name) + (r.c.me ? ' (aap)' : '') + '</b><small>' + E(r.c.party) + '</small></div><div class=\"bar\"><i id=\"cs-cb-' + k + '\"></i></div></div><b class=\"v\" id=\"cs-cv-' + k + '\">0</b></div>'; }).join('') + '<div id=\"cs-cn-ctl\" style=\"margin-top:14px\"></div></div>';
    show('Matganana Diwas', F.seatName + ' | ' + F.state, h, 'ConstituencyFight.close()');
    var draw = function () {
        var frac = i / steps, top = -1, topV = -1, maxS = rows[0].share || 1;
        var cur = rows.map(function (r, k) { var v = i >= steps ? r.votes : r.votes * frac * (1 + jit[k] * (1 - frac)); if (v > topV) { topV = v; top = k; } return v; });
        var tot = 0; cur.forEach(function (v) { tot += v; });
        rows.forEach(function (r, k) {
            var b = document.getElementById('cs-cb-' + k), v = document.getElementById('cs-cv-' + k), c = document.getElementById('cs-cr-' + k);
            if (b) b.style.width = (tot ? cur[k] / Math.max(tot, 1) * 100 : 0).toFixed(1) + '%';
            if (v) v.textContent = fmt(cur[k]);
            if (c) c.classList.toggle('lead', k === top);
        });
        var t = document.getElementById('cs-cn-t'); if (t) t.textContent = 'Round ' + i + ' / ' + steps + ' ginti poori';
        var ctl = document.getElementById('cs-cn-ctl'); if (ctl && i >= steps) ctl.innerHTML = '<button class=\"cs-btn\" onclick=\"ConstituencyFight.result()\">NATIJA &rarr;</button>';
        else if (ctl) ctl.innerHTML = '<button class=\"cs-btn gh sm\" onclick=\"ConstituencyFight._skip()\">Seedha natija</button>';
    };
    draw();
    if (CT) clearInterval(CT);
    CT = setInterval(function () { i++; draw(); if (i >= steps) { clearInterval(CT); CT = null; } }, 650);
    F._skip = function () { if (CT) { clearInterval(CT); CT = null; } i = steps; draw(); };
}
function careerLink(won) {
    try {
        if (F.career || F.reported || !S.party || !window.CareerMode || !CareerMode.hasParty() || CareerMode.getParty().name !== S.party) return;
        F.reported = true;
        CareerMode.reportResult({ type: F.type, seat: F.seatName, state: F.state, won: won, quiet: true });
    } catch (e) { console.warn('career link', e); }
}
function result() {
    var rows = F.final, w = rows[0], won = w.c.me, margin = rows[0].votes - (rows[1] ? rows[1].votes : 0);
    careerLink(won);
    var h = '<div class=\"cs-hero\">' + (won ? confettiC(46) : '') + '<div style=\"font-size:3.2rem\">' + (won ? '&#127942;' : '&#128532;') + '</div><div class=\"cs-ht\" style=\"color:' + (won ? '#fde68a' : '#fca5a5') + '\">' + (won ? 'AAP JEETE!' : 'AAP HAARE') + '</div><h2>' + E(w.c.name) + '</h2><div style=\"color:#cbd5e1\">' + E(w.c.party) + ' | ' + E(F.seatName) + ', ' + E(F.state) + '</div><div class=\"cs-mg\">Jeet ka antar <b>' + fmt(margin) + '</b> vote</div></div>' +
        '<div class=\"cs-card\" style=\"margin-top:14px;text-align:left\"><h3>FINAL NATIJA</h3>' + rows.map(function (r, i) { return '<div class=\"cs-cr' + (i === 0 ? ' lead' : '') + '\" style=\"--c:' + r.c.color + ';animation:csUp .5s ease both;animation-delay:' + (i * 0.12) + 's\"><b style=\"width:22px\">' + (i + 1) + '</b><img src=\"' + r.c.img + '\" class=\"av\"><div class=\"b\"><div class=\"n\"><b>' + E(r.c.name) + (r.c.me ? ' (aap)' : '') + '</b><small>' + E(r.c.party) + '</small></div><div class=\"bar\"><i style=\"width:' + Math.round(r.share * 100) + '%\"></i></div></div><b class=\"v\">' + fmt(r.votes) + ' (' + Math.round(r.share * 100) + '%)</b></div>'; }).join('') + '</div>' +
        '<div class=\"cs-row\" style=\"justify-content:center;margin-top:14px\">' + (F.career ? '<button class=\"cs-btn\" onclick=\"ConstituencyFight.finish(' + (won ? 'true' : 'false') + ')\">CAREER HUB MEIN WAPAS</button>' : '<button class=\"cs-btn\" onclick=\"ConstituencyFight.again()\">DOOBARA LADO</button><button class=\"cs-btn gh\" onclick=\"ConstituencyFight.close()\">DASHBOARD</button>') + '</div>';
    show('Chunav Natija', F.seatName, h, 'ConstituencyFight.close()');
}
function finish(won) {
    var info = { type: F.type, seat: F.career && F.career.seat ? F.career.seat : F.seatName, state: F.state, won: won };
    close();
    if (window.CareerMode && CareerMode.reportResult) CareerMode.reportResult(info);
}
function again() { close(); open(F.type === 'MP' ? 2 : 1); }
function leave() {
    if (!confirm('Chunav chhodkar bahar jayein? Progress jayega.')) return;
    var c = F && F.career; close(); if (c && window.CareerMode) CareerMode.open();
}
function settings() {
    var w = war(), d = document.getElementById('cs-set');
    if (d) { d.remove(); return; }
    d = document.createElement('div'); d.id = 'cs-set'; d.style.cssText = 'position:absolute;right:12px;top:58px;z-index:900;width:260px;background:var(--bg2);border:1px solid var(--ln);border-radius:14px;padding:14px;';
    d.innerHTML = '<b>Settings</b><div style="color:#94a3b8;font-size:.8rem;margin:6px 0">Kathinai: ' + DIFFS[F.diff][0] + ' | ' + (F.me.party === 'Independent' ? 'Independent (kam fayda)' : (F.own ? 'Nayi party (thoda kam fayda)' : 'Maujooda party')) + '</div><div class="cs-row"><button class="cs-btn gh sm" onclick="ConstituencyFight.leave()">Chunav chhodo</button><button class="cs-btn gh sm" onclick="document.getElementById(\'cs-set\').remove()">Band</button></div>';
    w.appendChild(d);
}

// =============================================================
//  EXPORT + HOOK
// =============================================================
window.ConstituencyFight = { _skip: function () { if (F && F._skip) F._skip(); }, sq: sq, reg: reg, pq: pq, open: open, close: close, pickState: pickState, search: search, pickSeat: pickSeat, pickParty: pickParty, setAv: setAv, setName: setName, upload: upload, toOpps: toOpps, setDiff: setDiff, toggleOpp: toggleOpp, rule: rule, back: back, startWar: startWar, panel: openPanel, closePanel: closePanel, act: act, target: target, nextRound: nextRound, result: result, finish: finish, again: again, leave: leave, settings: settings,
    _t: { demo: demo, pastData: pastData, startWar: startWar, standings: standings, getF: function () { return F; }, setS: function (x) { S = x; } } };
window.openConstituency = function (t) { open(t); };
})();
