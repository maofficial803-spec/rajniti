/* ===================================================================
   RAJNITI - PARTY EMBLEM (shared)
   Alag file: party-emblem.js  (state-assembly.js se PEHLE load karo)
   Har party ka chinh (sketch) aur sabhi partiyon ki A-Z suchi.
   =================================================================== */
(function () {
'use strict';
function svg(s) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(s); }
function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
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
function emblem(name, color) {
    name = name || ''; var ck = name + '|' + (color || '');
    if (EMB_CACHE[ck]) return EMB_CACHE[ck];
    var bg = name ? (color || '#64748b') : '#94a3b8', fg = isLight(bg) ? '#1b1405' : '#ffffff', g = GLYPH[EMB[name]], inner;
    if (g) inner = g.split('@F').join(fg).split('@B').join(bg);
    else { var t = abbr(name), fs = t.length <= 2 ? 40 : (t.length === 3 ? 32 : (t.length === 4 ? 26 : 22)); inner = '<text x="50" y="' + (50 + fs * 0.35) + '" font-size="' + fs + '" font-weight="800" text-anchor="middle" fill="' + fg + '" font-family="Arial,Helvetica,sans-serif">' + E(t) + '</text>'; }
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="' + bg + '"/><rect width="100" height="100" rx="22" fill="url(#g)"/><rect x="4" y="4" width="92" height="92" rx="18" fill="none" stroke="' + fg + '" stroke-opacity=".28" stroke-width="2"/>' + inner + '</svg>';
    return (EMB_CACHE[ck] = svg(s));
}

function allParties(extra) {
    var seen = {}, out = [], sa = (window.__SA && window.__SA.SA_DATA) || {};
    Object.keys(sa).forEach(function (s) { sa[s].parties.forEach(function (p) { if (p[0] !== 'Others' && !seen[p[0]]) { seen[p[0]] = 1; out.push(p[0]); } }); });
    EXTRA_PARTIES.concat(extra || []).forEach(function (p) { if (p && p !== 'Others' && !seen[p]) { seen[p] = 1; out.push(p); } });
    out.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
    return out;
}
window.PartyUI = { emblem: emblem, abbr: abbr, allParties: allParties, isLight: isLight };
})();
