/* ===================================================================
   RAJNITI - CAREER HUB  (party ka daftar)
   Alag file: career-hub.js   (career-mode.js ke BAAD load karo)
   Career Mode ka naya "Main Hub": 3 meter, party fund & asset, aur 20+ section.
   Samay: 1 game ghanta = 15 second. Investment, IT cell, karz sab isi ghadi se chalte hain.
   =================================================================== */
(function () {
'use strict';

var core = null, C = null, H = null;
var HOUR_MS = 180000;     // 1 game ghanta = 3 minute
var CATCHUP_MAX = 24;     // wapas aane par maximum itne ghante ka hisaab
var S = { view: 'home', sheet: null, tab: {}, form: {}, firstOpen: true };

// ---------- chhote helpers ----------
function E(s) { return core ? core.E(s) : String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function rnd(a, b) { return a + Math.random() * (b - a); }
function ri(a, b) { return Math.floor(rnd(a, b + 1)); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function fm(n) { n = Number(n) || 0; return (Math.abs(n) >= 100 ? Math.round(n) : Math.round(n * 10) / 10).toLocaleString('en-IN'); }
function hrs(h) { h = Math.ceil(h); if (h < 24) return h + ' ghante'; var d = Math.floor(h / 24), r = h % 24; return d + ' din' + (r ? ' ' + r + ' ghante' : ''); }
function nameGen() { return core.nameGen(); }
function rgba(hex, a) {
    var h = String(hex || '#38bdf8').replace('#', ''); if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16); if (isNaN(n)) n = 0x38bdf8;
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}
function val(id) { var e = document.getElementById(id); return e ? String(e.value || '').trim() : ''; }
function sum(a, f) { var t = 0; a.forEach(function (x) { t += f(x); }); return t; }

// =============================================================
//  DATA TABLES
// =============================================================
var CONS = [
    { id: 'c1', n: 'Nukkad Salah Kendra', tier: 'Chhoti agency', d: 'Gali-mohalle ki raay aur chhote surveys.', cost: 5, hrs: 48, drip: { pop: .05, rep: .03 }, elec: .004 },
    { id: 'c2', n: 'Zila Survey Associates', tier: 'Madhyam agency', d: 'Zile ke jaatiya aur issue-wise aankde.', cost: 16, hrs: 72, drip: { pop: .12, rep: .06 }, elec: .01 },
    { id: 'c3', n: 'Rajdhani Strategy Group', tier: 'Badi agency', d: 'Poora campaign plan, slogan aur ground team.', cost: 50, hrs: 96, drip: { pop: .25, rep: .15, pow: .05 }, elec: .02, lvl: 1 },
    { id: 'c4', n: 'Global Brand & Data Partners', tier: 'Antarrashtriya agency', d: 'Data science, micro-targeting aur image-building.', cost: 130, hrs: 120, drip: { pop: .38, rep: .24, pow: .12 }, elec: .035, lvl: 2 }
];
var MEDIA = [
    { id: 'm1', n: 'Sthaniya akhbar', tier: 'Chhota', d: 'Zile ke akhbaar mein roz ki khabar.', cost: 3, hrs: 48, drip: { pop: .06, rep: .02 } },
    { id: 'm2', n: 'Kshetriya news channel', tier: 'Madhyam', d: 'Poore pradesh mein prime-time.', cost: 14, hrs: 72, drip: { pop: .18, rep: .04 } },
    { id: 'm3', n: 'Hindi akhbar samooh', tier: 'Badi', d: 'Kai sanskaran, kai rajya.', cost: 30, hrs: 96, drip: { pop: .3, rep: .06 }, lvl: 1 },
    { id: 'm4', n: 'Rashtriya TV network', tier: 'National', d: 'Desh bhar mein 24x7 pahunch. Janta ise "godi media" bhi bolti hai.', cost: 90, hrs: 96, drip: { pop: .45, rep: -.08, pow: .1 }, lvl: 2 }
];
var WINGS = [
    { id: 'yuva', n: 'Yuva Morcha', d: 'Naujawanon ki toli.' }, { id: 'chhatra', n: 'Chhatra Sangathan', d: 'College aur university mein pakad.' },
    { id: 'mahila', n: 'Mahila Morcha', d: 'Mahilaon ki bhagidari.' }, { id: 'kisan', n: 'Kisan Prakosth', d: 'Gaon aur kheti ka sanghathan.' },
    { id: 'shramik', n: 'Shramik Prakosth', d: 'Mazdoor aur union.' }, { id: 'alp', n: 'Alpsankhyak Prakosth', d: 'Alpsankhyak samudayon se sampark.' },
    { id: 'dalit', n: 'SC/ST Prakosth', d: 'Dalit aur adivasi samaj.' }, { id: 'vyapar', n: 'Vyapar Prakosth', d: 'Vyapari aur chhote udyog.' },
    { id: 'seva', n: 'Seva Dal', d: 'Vardi mein anushasit swayamsevak.' }
];
var ASSETS = [
    { id: 'hq', n: 'Rajya mukhyalay', d: 'Pradesh ka bada daftar.', cost: 12, up: .25, max: 1, elec: .004, pow: 3 },
    { id: 'zila', n: 'Zila karyalay', d: 'Har zile mein party ka thikana.', cost: 3, up: .06, max: 10, elec: .002 },
    { id: 'rath', n: 'Prachar rath', d: 'Loudspeaker wali gaadiyan.', cost: 6, up: .1, max: 5, elec: .002, drip: { pop: .02 } },
    { id: 'heli', n: 'Helicopter', d: 'Ek din mein kai jansabha.', cost: 25, up: 1.2, max: 2, elec: .008 },
    { id: 'studio', n: 'Party media studio', d: 'Apni video aur live-stream ki suvidha.', cost: 40, up: 1.0, max: 1, drip: { pop: .1, rep: .02 } },
    { id: 'warroom', n: 'Digital war-room', d: 'IT cell ki taqat 30% badhta hai.', cost: 20, up: .6, max: 1 },
    { id: 'zameen', n: 'Zameen ke plot', d: 'Daam dheere-dheere badhte hain.', cost: 25, up: 0, max: 5, appr: .004 }
];
var INV = [
    { id: 'bond', n: 'Sarkari bond', d: 'Surakshit. Har 2 ghante par pakka byaaj.', min: 10, per: 2, y: [.012, .012] },
    { id: 'fd', n: 'Bank FD', d: 'Dheemi par pakki kamai.', min: 5, per: 6, y: [.04, .04] },
    { id: 'gold', n: 'Sona', d: 'Kabhi thoda ghatta, aksar badhta.', min: 10, per: 4, y: [-.01, .035] },
    { id: 'stock', n: 'Share bazaar', d: 'Bada munafa ya bada nuksaan.', min: 10, per: 2, y: [-.07, .10] },
    { id: 'estate', n: 'Zameen / real estate', d: 'Kiraya aata hai. 48 ghante tak nikaal nahi sakte.', min: 30, per: 6, y: [.05, .05], lock: 48 },
    { id: 'chit', n: 'Chit fund scheme', d: 'Bahut zyada byaaj, par doobne ka khatra.', min: 10, per: 2, y: [.05, .05], crash: .03 }
];
var LOANS = [
    { id: 'bank', n: 'Bank se karz', d: 'Kam byaaj, 5 din mein lautana hai.', amts: [20, 50, 100], rate: 1.5, days: 5 },
    { id: 'sahu', n: 'Nijee sahukar', d: 'Turant paisa, par byaaj bahut zyada. 3 din.', amts: [10, 30], rate: 4, days: 3 },
    { id: 'videshi', n: 'Videshi company se karz', d: 'Bada paisa. Videshi shartein aur jaanch ka khatra. 7 din.', amts: [40, 100, 200], rate: 3, days: 7, foreign: true }
];
var SRC = [
    { id: 'crowd', n: 'Janta se crowdfunding', d: 'Chhavi aur lokpriyata jitni zyada, chanda utna.', cd: 24, earnFn: function () { return 4 + C.res.image / 8 + H.pop / 10; }, eff: { pop: 1, rep: .5 }, ok: 'Janta ne dil khol kar chanda diya.' },
    { id: 'member', n: 'Sadasyata abhiyan', d: 'Active karyakarta ghar-ghar jaakar sadasya banate hain.', cd: 36, earnFn: function () { return 2 + H.vol.active * .012; }, eff: { cad: 1 }, ok: 'Naye sadasyon se chanda aaya.' },
    { id: 'levy', n: 'Vidhayak aur saansad ka levy', d: 'Jeete hue netaon se party fund mein hissa.', cd: 48, earnFn: function () { return .8 * (C.mla.length + C.mp.length); }, gate: function () { return (C.mla.length + C.mp.length) ? '' : 'Pehle koi vidhayak ya saansad chahiye.'; }, ok: 'Netaon ne levy jama kiya.' },
    { id: 'corp', n: 'Corporate chanda', d: 'Companiyon ka chanda. Kuch log sawal uthate hain.', cd: 36, earn: 25, eff: { rep: -1 }, risk: { p: .08, eff: { rep: -4 }, t: 'Corporate chanda par sawal uthe.' } },
    { id: 'udyog', n: 'Bade udyogpati ka gupt chanda', d: 'Bahut paisa, par khabar leak ho sakti hai.', cd: 60, earn: 50, eff: { rep: -3, pow: 1 }, risk: { p: .2, eff: { rep: -8 }, t: 'Gupt chande ki khabar leak ho gayi. Jaanch shuru.', kase: 1 }, heat: 6 },
    { id: 'fcra', n: 'Videshi funding (niyam taak par)', d: 'Sabse bada chanda, sabse bada jokhim. Pakde gaye to ED jaanch.', cd: 96, earn: 90, eff: { rep: -4, pow: 2 }, risk: { p: .3, eff: { rep: -14 }, t: 'Videshi funding ujagar hui. ED ne jaanch shuru ki.', kase: 2 }, heat: 12 }
];
var ORG = [
    { id: 'dharna', n: 'Dharna / pradarshan', d: 'Sthaniya mudde par dharna.', cost: 3, cd: 12, eff: { pop: 3, rep: 1, pow: 1, cad: 6 }, risk: { p: .15, eff: { rep: -4 }, t: 'Police case darj hua, chhavi giri.' } },
    { id: 'hastakshar', n: 'Hastakshar abhiyan', d: 'Kisi maang par jan-hastakshar.', cost: 4, cd: 18, eff: { pop: 2, rep: 1, cad: 10 } },
    { id: 'shivir', n: 'Raktdaan / swasthya shivir', d: 'Seva se chhavi.', cost: 5, cd: 18, eff: { pop: 3, rep: 4, cad: 4 } },
    { id: 'padyatra', n: 'Padyatra', d: 'Gaon-gaon paidal yatra.', cost: 6, cd: 24, eff: { pop: 6, rep: 3, pow: 1, cad: 8 }, risk: { p: .05, eff: { rep: -3 }, t: 'Yatra mein jhadap, thodi badnami.' }, needVol: 50 },
    { id: 'sabha', n: 'Jansabha', d: 'Bade maidan mein sabha.', cost: 12, cd: 24, eff: { pop: 5, rep: 2, pow: 2, cad: 4 }, risk: { p: .1, eff: { pop: -2, rep: -2 }, t: 'Bheed kam rahi.' }, needVol: 80 },
    { id: 'chakka', n: 'Chakka jam', d: 'Sadak rokkar virodh.', cost: 5, cd: 36, eff: { pop: 5, rep: -1, pow: 3, cad: 6 }, risk: { p: .3, eff: { rep: -5 }, t: 'Janta naraaz, FIR darj hui.' }, needVol: 150 },
    { id: 'mahapanchayat', n: 'Mahapanchayat', d: 'Kai gaon ke pradhan ek jagah.', cost: 15, cd: 48, eff: { pop: 8, rep: 3, pow: 4, cad: 8 }, needVol: 200 },
    { id: 'bandh', n: 'Rajya bandh ka aahwan', d: 'Poore pradesh mein bandh.', cost: 20, cd: 72, eff: { pop: 7, rep: -3, pow: 7, cad: 6 }, risk: { p: .35, eff: { rep: -6, pop: -3 }, t: 'Bandh se vyapari naraaz hue.' }, needVol: 400 },
    { id: 'rally', n: 'Rashtriya maha-rally', d: 'Desh bhar se karyakarta, ek hi manch.', cost: 40, cd: 96, eff: { pop: 12, rep: 4, pow: 8, cad: 10 }, needVol: 800 }
];
var SYMP = [
    { id: 'gaali', n: 'Virodhi ki gaali ka bhavuk jawab', d: 'Apni maa ka naam leke bhavuk bayan.', cost: .5, cd: 36, eff: { pop: 4, rep: 1 }, wave: 8 },
    { id: 'parivar', n: 'Parivar ka bhavuk appeal', d: 'Parivar ke log mancha par.', cost: 2, cd: 48, eff: { pop: 5, rep: 2 }, wave: 10, risk: { p: .1, eff: { rep: -3 }, t: 'Logon ne ise dikhawa kaha.' } },
    { id: 'anshan', n: 'Amaran anshan', d: 'Bhookh hadtal par baith jao.', cost: 1, cd: 72, eff: { pop: 6, rep: 4 }, wave: 14, risk: { p: .2, eff: { rep: -4 }, t: 'Kisi ne anshan ka khana khate hue photo viral kar di.' } },
    { id: 'aspatal', n: 'Hamle ke baad aspatal se video', d: 'Chot ki khabar par bahut hamdardi.', cost: 2, cd: 72, eff: { pop: 7, rep: 3 }, wave: 16, risk: { p: .25, eff: { rep: -6, pop: -2 }, t: 'Logon ne ise natak kaha. Chhavi giri.' } },
    { id: 'jail', n: 'Jail bharo, khud giraftari do', d: 'Neta jail jaata hai, janta saath aati hai.', cost: 1, cd: 96, eff: { pop: 9, rep: 5, pow: 2 }, wave: 20, risk: { p: .15, eff: { rep: -3 }, t: 'Giraftari ka mudda thanda pad gaya.' } }
];
var TACT = [
    { id: 'paidnews', n: 'Paid news chhapwana', d: 'Khabar ki shakal mein vigyapan.', cost: 6, cd: 24, eff: { pop: 5, rep: -1, pow: 1 }, heat: 6, edge: 2 },
    { id: 'rented', n: 'Kiraye ki bheed', d: 'Rally mein dikhane ke liye logon ko bulana.', cost: 4, cd: 24, eff: { pop: 4, rep: -1, pow: 1 }, heat: 4, edge: 1 },
    { id: 'tender', n: 'Thekedaron se tender ke badle chanda', d: 'Paisa aata hai, par daag bhi.', cost: 0, cd: 36, eff: { rep: -2, pow: 2 }, earn: 20, heat: 10 },
    { id: 'leak', n: 'Virodhi ka purana video leak', d: 'Virodhi ki chhavi par chot.', cost: 8, cd: 36, eff: { pop: 3, rep: -2, pow: 4 }, heat: 10, edge: 4, risk: { p: .2, eff: { rep: -6 }, t: 'Leak ka source pakda gaya.' } },
    { id: 'laalach', n: 'Chunav se pehle saaman aur nakad baantna', d: 'Vote ke badle tohfe.', cost: 12, cd: 48, eff: { pop: 7, rep: -4, pow: 2 }, heat: 16, edge: 5, risk: { p: .3, eff: { rep: -9 }, t: 'Saaman baantte hue video aa gaya. Case darj.', kase: 1 } },
    { id: 'dalbadal', n: 'Virodhi ke naraaz vidhayak ko laalach', d: 'Doosre dal ke vidhayak ko tod lo.', cost: 18, cd: 72, eff: { pop: 1, rep: -4, pow: 8 }, heat: 12, edge: 5 },
    { id: 'agency', n: 'Jaanch agency ka dabav (virodhi par)', d: 'Virodhi par achanak chhapa.', cost: 15, cd: 60, eff: { rep: -3, pow: 7 }, heat: 14, edge: 6, risk: { p: .25, eff: { rep: -8 }, t: 'Dabav ki saazish ujagar. Court mein case.', kase: 2 } }
];
var CRISES = [
    { id: 'flood', n: 'bhayankar baadh', d: 'Hazaron log bebas. Janta madad ki raah dekh rahi hai.' },
    { id: 'quake', n: 'bhookamp', d: 'Imaratein gir gayi. Malbe mein log dabe hain.' },
    { id: 'train', n: 'bada rail hadsa', d: 'Kai log ghayal. Pariwaar behaal.' },
    { id: 'fire', n: 'bazaar mein bhayankar aag', d: 'Dukaanein jal gayi. Vyapari tabah.' },
    { id: 'epi', n: 'bimari ka prakop', d: 'Aspatal bhare hain. Dawai ki kami.' },
    { id: 'riot', n: 'do samudayon mein tanav', d: 'Halaat bigad rahe hain. Shanti ki zaroorat.' },
    { id: 'drought', n: 'sookha aur fasal ki barbadi', d: 'Kisan karz mein doob rahe hain.' }
];
var CRISIS_RESP = [
    { id: 'relief', n: 'Bade paimane par rahat shivir', cost: 8, eff: { pop: 7, rep: 6, pow: 2, cad: 4 }, needVol: 50 },
    { id: 'donate', n: 'Party fund se sahayata raashi', cost: 15, eff: { pop: 6, rep: 7, pow: 2 } },
    { id: 'visit', n: 'Neta khud pahunche, peediton se mile', cost: 2, eff: { pop: 4, rep: 3, pow: 1 } },
    { id: 'ignore', n: 'Is baar rehne do', cost: 0, eff: { pop: -3, rep: -4 } }
];
var PRESS = [
    { id: 'attack', n: 'Sarkar ki nakami par hamla', eff: { pop: 2, pow: 3 } },
    { id: 'wada', n: 'Naya wada ghoshit karo', eff: { pop: 3, rep: 1 } },
    { id: 'safai', n: 'Aaropon par safai do', eff: { rep: 3, pop: 1 } },
    { id: 'ekta', n: 'Ekta aur gathbandhan ka sandesh', eff: { pow: 3, rep: 1, pop: 1 } }
];
var DEBATE_TOPICS = ['Mehngai', 'Berozgari', 'Kisan aur MSP', 'Mahila suraksha', 'Bhrashtachar', 'Shiksha aur swasthya'];
var LAWYERS = [['Junior vakil', 3, 0, 24], ['Varishth adhivakta', 12, .15, 36], ['Star adhivakta (Supreme Court)', 30, .28, 48]];
var CASE_TOPICS = [['Bhrashtachar ke aarop', .0], ['Chunav aachar sanhita ullanghan', .05], ['Hate speech', -.04], ['Fund ka durupyog', .0], ['Bina anumati rally', .06]];
var MANIFESTO_OWN = [
    'Har gaon mein pakki sadak aur 24 ghante bijli', 'Yuvaon ke liye 10 lakh sarkari bhartiyan', 'Kisan ko fasal ka MSP kanooni guarantee',
    'Har zile mein aspatal aur medical college', 'Mahilaon ko har mahine seedhi sahayata raashi', 'Mohalla clinic aur muft jaanch',
    'Sarkari school mein smart class aur muft kitaben', 'Bhrashtachar par Lokayukta ko poori shakti', 'Chhote vyapariyon ko byaaj-mukt karz', 'Har ghar ko saaf peene ka paani'
];
var JUMLAS = [
    'Garibi hatao, desh bachao', 'Achhe din aane waale hain', 'Har khate mein paisa aayega', 'Kala dhan ek hafte mein wapas',
    'Har saal 2 crore naukri', 'Kisan ki aay doguni', 'Har ghar ko pakka makaan', 'Bhrashtachar ka naam-o-nishan mita denge',
    'Petrol 40 rupaye litre', 'Har haath ko kaam, har khet ko paani'
];
var HOSTILE = ['Party fund mein ghotala', 'Neta ke purane bayan ka kata hua clip', 'Ticket bechne ka aarop', 'Parivarwad ka aarop', 'Videshi taaqaton se mel', 'Zameen kabze ka aarop'];
var STRONG_KINDS = ['Retired pehelwan', 'Reti-bajri ka thekedar', 'Sharab ka bada thekedar', 'Dabang zila panchayat adhyaksh', 'Jail se chunav ladne wala bahubali', 'Transport syndicate ka sargana'];
var MEDIA_OUTLETS = ['Daily Bharat Samachar', 'Janmat Times', 'Rashtra Darpan', 'Awaaz TV', 'Satya Khabar', 'Lok Prahari'];
var ICONS = {};
(function () {
    function Cr(cx, cy, r) { return 'M' + (cx - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0'; }
    ICONS.fund = 'M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM3 7l12-3v3' + Cr(17, 14, 1);
    ICONS.cons = 'M3 8h18v11H3zM9 8V6h6v2M3 13h18';
    ICONS.social = 'M5 9h14M5 15h14M10 4L8 20M16 4l-2 16';
    ICONS.coin = 'M12 3v18M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3';
    ICONS.court = 'M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18';
    ICONS.cmd = 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z';
    ICONS.ticket = 'M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4zM13 6v12';
    ICONS.conn = Cr(6, 12, 2.5) + Cr(18, 6, 2.5) + Cr(18, 18, 2.5) + 'M8.3 11l7.4-4M8.3 13l7.4 4';
    ICONS.invest = 'M3 17l6-6 4 4 8-8M15 7h6v6';
    ICONS.vol = Cr(9, 8, 3) + 'M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6' + Cr(17, 9, 2.5) + 'M16 14.2c3 .3 5 2.4 5 5.8';
    ICONS.org = 'M5 21V4M5 5h12l-2 4 2 4H5';
    ICONS.manif = 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7';
    ICONS.crisis = 'M12 3l10 18H2zM12 10v5M12 18h.01';
    ICONS.tact = 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z' + Cr(12, 12, 3);
    ICONS.debate = 'M4 5h16v11H9l-5 4z';
    ICONS.media = 'M3 8h18v11H3zM8 22h8M9 3l3 3 3-3';
    ICONS.wing = 'M12 21V9M6 9V4M18 9V4M6 9a6 6 0 0 0 12 0';
    ICONS.press = 'M9 3h6a0 0 0 0 1 0 0v8a3 3 0 0 1-6 0V3zM5 11a7 7 0 0 0 14 0M12 18v3';
    ICONS.heart = 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z';
    ICONS.evm = 'M4 4h16v16H4zM8 9h8M8 13h4M15.5 15.5h.01';
    ICONS.mafia = 'M3 14h18M6 14l1.5-7h9L18 14M9 14v4h6v-4';
    ICONS.leader = Cr(12, 8, 4) + 'M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8';
    ICONS.trophy = 'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8';
    ICONS.ballot = 'M4 10h16v10H4zM8 10V6l8-3v7';
    ICONS.chev = 'M9 5l7 7-7 7';
    ICONS.x = 'M6 6l12 12M18 6L6 18';
    ICONS.back = 'M15 5l-7 7 7 7';
    ICONS.lock = 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3';
})();

// =============================================================
//  STATE
// =============================================================
function newH() {
    return {
        v: 1, t: 0, last: Date.now(), paused: false,
        pop: 12, pow: 8,
        leader: { title: 'Sansthapak aur Rashtriya Adhyaksh', age: '', edu: '', motto: '', bio: '' },
        assets: {}, loans: [], consult: {}, media: {},
        it: { on: false, fund: 5, len: 24, mode: 'both', auto: false, until: 0, start: 0, blocked: 0, missed: 0 },
        invest: [], vol: { total: 0, active: 0, roster: [], lastOrg: 0 },
        cases: [], contacts: null, tickets: [], wings: {}, plan: [], crisis: null, crisisCount: 0,
        heat: 0, edge: 0, wave: 0, strong: [], strongPool: [], spokePool: [], spokes: [],
        cd: {}, log: [], jumlas: 0, nextCrisis: 36, nextHostile: 14, nextJumla: 40, stat: { income: 0, spent: 0 }, nid: 1
    };
}
function ensure() {
    core = window.CareerMode && window.CareerMode._core; if (!core) return false;
    C = core.get(); if (!C) return false;
    if (!C.h) C.h = newH();
    H = C.h;
    var d = newH();
    Object.keys(d).forEach(function (k) { if (H[k] === undefined) H[k] = d[k]; });
    if (!H.contacts) initContacts();
    if (!H.spokePool.length) refillSpokes();
    if (H.strongPool.length < 3) refillStrong();
    return true;
}
function save() { core.save(); }
function uid() { return H.nid++; }

// ---------- samay ----------
function cdLeft(k) { return Math.max(0, (H.cd[k] || 0) - H.t); }
function setcd(k, h) { H.cd[k] = H.t + h; }
function ready(k, label) { var l = cdLeft(k); if (l > 0) { toast((label || 'Ye') + ' abhi ' + hrs(l) + ' baad ho payega.', 'bad'); return false; } return true; }
function clockText() { var d = Math.floor(H.t / 24) + 1, h = Math.floor(H.t % 24); return 'Din ' + d + ', ' + (h < 10 ? '0' : '') + h + ':00'; }

// ---------- paisa aur meter ----------
function pay(c) {
    if (C.res.funds < c) { toast('Party fund mein ' + fm(c) + ' Cr chahiye. Abhi ' + fm(C.res.funds) + ' Cr hai.', 'bad'); return false; }
    C.res.funds -= c; H.stat.spent += c; return true;
}
function earn(c) { C.res.funds += c; H.stat.income += c; }
function bump(d) {
    if (!d) return;
    if (d.rep) C.res.image = clamp(C.res.image + d.rep, 0, 100);
    if (d.pop) H.pop = clamp(H.pop + d.pop, 0, 100);
    if (d.pow) { H.pow = clamp(H.pow + d.pow, 0, 100); C.res.strength = Math.max(0, C.res.strength + d.pow * 0.08); }
    if (d.cad) C.res.cadre = clamp(C.res.cadre + d.cad, 0, 100);
}
function scale(e, m) { var o = {}; Object.keys(e || {}).forEach(function (k) { o[k] = e[k] * m; }); return o; }
function news(t) { H.log.unshift({ t: H.t, x: t }); H.log = H.log.slice(0, 40); }
function addHeat(v) { H.heat = clamp(H.heat + v, 0, 100); }

// ---------- sampatti / kharch / aay ----------
function acount(id) { return H.assets[id] || 0; }
function assetValue() {
    var v = 0;
    ASSETS.forEach(function (a) { var n = acount(a.id); if (n) v += a.cost * n * (a.appr ? (1 + a.appr * H.t / 24) : 1); });
    return v;
}
function investTotal() { return sum(H.invest, function (i) { return i.amt; }); }
function loansOwed() { return sum(H.loans, function (l) { return l.owed; }); }
function burnItems() {
    var o = [['Daftar aur staff', .4]];
    CONS.forEach(function (c) { if ((H.consult[c.id] || 0) > H.t) o.push([c.n + ' (retainer)', perDay(c)]); });
    MEDIA.forEach(function (c) { if ((H.media[c.id] || 0) > H.t) o.push([c.n + ' (retainer)', perDay(c)]); });
    var up = 0; ASSETS.forEach(function (a) { up += (a.up || 0) * acount(a.id); }); if (up) o.push(['Daftar, gaadi aur sampatti ka rakh-rakhav', up]);
    if (H.vol.active) o.push(['Karyakarta ka bhatta (' + H.vol.active + ' active)', H.vol.active * .006]);
    var w = 0; WINGS.forEach(function (x) { w += (H.wings[x.id] || 0) * .12; }); if (w) o.push(['Morchon ka kharch', w]);
    var s = sum(H.spokes, function (x) { return x.fee; }); if (s) o.push(['Pravaktaon ka vetan', s]);
    return o;
}
function dailyBurn() { return sum(burnItems(), function (x) { return x[1]; }); }
function dailyIncome() { return 1 + H.pop * .04 + C.res.image * .02 + .3 * (C.mla.length + C.mp.length) + 8 * C.govStates.length; }
function loanDaily() { return sum(H.loans, function (l) { return l.owed * l.rate / 100; }); }

// ---------- sampark (contacts) ----------
function initContacts() {
    var dist = []; try { var d = assemblyData[C.state]; if (d) { var seen = {}; d.features.forEach(function (f) { var x = f.properties.d; if (x && !seen[x]) { seen[x] = 1; dist.push(x); } }); } } catch (e) {}
    if (!dist.length) dist = ['Sadar', 'Uttar', 'Dakshin', 'Purv', 'Paschim', 'Madhya'];
    var parties = core.allParties().map(function (p) { return p.n; });
    function mk(role, n) { var a = []; for (var i = 0; i < n; i++) a.push({ id: 'c' + uid(), n: nameGen(), role: role(i), lv: 0 }); return a; }
    H.contacts = {
        judge: mk(function (i) { return ['Nyayadheesh, Uchch Nyayalaya', 'Zila nyayadheesh', 'Nyayadheesh, Sarvochch Nyayalaya', 'Ex-nyayadheesh, ab salahkaar'][i % 4]; }, 4),
        dm: mk(function (i) { return 'Zila Magistrate, ' + dist[i % dist.length]; }, 4),
        sp: mk(function (i) { return 'Police Adheekshak, ' + dist[(i + 2) % dist.length]; }, 4),
        pmem: mk(function (i) { return pick(parties) + ' ke naraaz neta'; }, 4),
        media: mk(function (i) { return 'Sampadak, ' + MEDIA_OUTLETS[i % MEDIA_OUTLETS.length]; }, 4)
    };
}
function clv(t) { return sum(H.contacts[t] || [], function (c) { return c.lv; }); }

function refillSpokes() { H.spokePool = []; for (var i = 0; i < 5; i++) { var sk = ri(35, 92); H.spokePool.push({ id: 's' + uid(), n: nameGen(), skill: sk, fee: Math.round((.04 + sk / 100 * .2) * 100) / 100, join: Math.round(sk * .1 * 10) / 10 }); } }
function refillStrong() {
    while (H.strongPool.length < 4) H.strongPool.push({ id: 'b' + uid(), n: nameGen(), kind: pick(STRONG_KINDS), fame: ri(40, 95) });
}

// ---------- chunav par asar ----------
function bigLevel() {
    var g = C.govStates.length, mp = C.mp.length, mla = C.mla.length;
    if (g >= 1 || mp >= 10 || H.pow >= 45) return 2;
    if (mla >= 3 || mp >= 2 || H.pow >= 20) return 1;
    return 0;
}
function lvlMsg(l) {
    if (l <= 0) return '';
    if (bigLevel() >= l) return '';
    return l === 1 ? 'Party thodi badi hone par khulega (3+ MLA ya 2+ MP ya Power 20+).' : 'Party badi hone par khulega (1+ state mein sarkar, ya 10+ MP, ya Power 45+).';
}
function bonus() {
    if (!window.CareerMode || !CareerMode._core) return 0;
    if (!ensure()) return 0;
    var b = H.pop * .0015 + H.pow * .0008 + H.wave * .0006 + H.edge * .002;
    CONS.forEach(function (c) { if (H.consult[c.id] > H.t) b += c.elec; });
    ASSETS.forEach(function (a) { if (a.elec) b += a.elec * acount(a.id); });
    WINGS.forEach(function (w) { b += .002 * (H.wings[w.id] || 0); });
    b += Math.min(.06, (clv('dm') + clv('sp')) * .004);
    b += Math.min(.03, H.plan.length * .003);
    b += Math.min(.1, H.strong.filter(function (s) { return s.neta; }).length * .02);
    b += Math.min(.04, H.tickets.length * .004);
    return clamp(b, 0, .25);
}
function judgeBonus() { return Math.min(.12, clv('judge') * .04); }

// =============================================================
//  GHADI: har game ghante par
// =============================================================
function dripNow() {
    var d = { rep: 0, pop: -.03, pow: -.01 };
    function add(o, m) { if (!o) return; m = m || 1; d.rep += (o.rep || 0) * m; d.pop += (o.pop || 0) * m; d.pow += (o.pow || 0) * m; }
    CONS.forEach(function (c) { if (H.consult[c.id] > H.t) add(c.drip); });
    MEDIA.forEach(function (m) { if (H.media[m.id] > H.t) add(m.drip); });
    ASSETS.forEach(function (a) { if (a.drip && acount(a.id)) add(a.drip, acount(a.id)); });
    WINGS.forEach(function (w) { var l = H.wings[w.id] || 0; if (l) add({ pop: .03 * l, rep: .005 * l }); });
    d.pop += Math.min(.25, H.vol.active * .00025);
    d.pop += .03 * clv('media');
    if (H.it.on) {
        var share = H.it.fund / H.it.len, m = (H.it.mode === 'defend' ? .5 : 1) * (acount('warroom') ? 1.3 : 1);
        d.pop += Math.min(.5, share * .35) * m;
        if (H.it.mode !== 'attack') d.rep += .02;
    }
    if (C.res.funds < 0) d.rep -= .15;
    H.loans.forEach(function (l) { if (H.t > l.due) { d.rep -= .1; if (l.foreign) d.pow -= .05; } });
    return d;
}
function hourly() {
    H.t += 1;
    var burn = dailyBurn() / 24; C.res.funds -= burn; H.stat.spent += burn;
    var inc = dailyIncome() / 24; C.res.funds += inc; H.stat.income += inc;
    H.loans.forEach(function (l) {
        l.owed *= 1 + l.rate / 2400;
        if (H.t > l.due && !l.od) { l.od = 1; news(l.n + ' ki kisht chuk gayi. Lenedaar dabav bana raha hai.'); toast(l.n + ' ki kisht chuk gayi!', 'bad'); }
    });
    var dr = dripNow(); bump(dr);
    C.res.cadre = clamp(C.res.cadre - .015, 0, 100);
    H.heat = Math.max(0, H.heat - .25); H.wave = Math.max(0, H.wave - .5); H.edge = Math.max(0, H.edge - .05);
    // investment
    H.invest.slice().forEach(function (iv) {
        var def = INV.filter(function (x) { return x.id === iv.k; })[0]; if (!def) return;
        var age = H.t - iv.t0; if (age <= 0 || age % def.per !== 0) return;
        if (def.crash && Math.random() < def.crash) { H.invest.splice(H.invest.indexOf(iv), 1); news(def.n + ' doob gaya. ' + fm(iv.amt) + ' Cr swaha.'); toast(def.n + ' doob gaya! ' + fm(iv.amt) + ' Cr gaye.', 'bad'); return; }
        var y = def.y[0] + Math.random() * (def.y[1] - def.y[0]), g = iv.amt * y;
        if (g >= 0) { earn(g); iv.got = (iv.got || 0) + g; } else { C.res.funds += g; iv.got = (iv.got || 0) + g; }
    });
    // IT cell chakra
    if (H.it.on && H.t >= H.it.until) {
        if (H.it.auto && C.res.funds >= H.it.fund) { C.res.funds -= H.it.fund; H.stat.spent += H.it.fund; H.it.start = H.t; H.it.until = H.t + H.it.len; news('IT cell ka agla chakra shuru hua.'); }
        else { H.it.on = false; news('IT cell ka chakra khatam hua.'); }
    }
    if (H.it.on && H.it.mode !== 'defend') H.edge = Math.min(30, H.edge + (H.it.fund / H.it.len) * .05);
    // virodhi ka narrative
    if (H.t >= H.nextHostile) { H.nextHostile = H.t + ri(14, 30); hostile(); }
    // jumle ka ulta asar
    if (H.jumlas > 0 && H.t >= H.nextJumla) {
        H.nextJumla = H.t + ri(30, 60);
        if (Math.random() < Math.min(.7, .15 * H.jumlas)) { bump({ rep: -3, pop: -1 }); news('Logon ne puchha: "Jumlon ka hisaab kahan hai?" Chhavi giri.'); toast('Jumlon par sawal uthe.', 'bad'); }
    }
    // sankat
    if (H.crisis && !H.crisis.done && H.t > H.crisis.due) { bump({ rep: -4, pop: -3 }); news('Sankat mein party gayab rahi: ' + H.crisis.title + '. Janta naraaz.'); toast('Sankat par party chup rahi. Chhavi giri.', 'bad'); H.crisis.done = 1; H.crisis.res = 'ignored'; }
    if (!H.crisis || H.crisis.done) { if (H.t >= H.nextCrisis) spawnCrisis(); }
    // case ke faisle
    H.cases.forEach(function (cs) { if (cs.st === 'pending' && H.t >= cs.due) verdict(cs); });
    // chhapa / sting
    if (H.heat > 60 && Math.random() < .04) { bump({ rep: -8, pow: -3 }); addHeat(-35); caseAgainst('Gupt gatividhiyon ka sting operation', 2); news('Ek sting operation mein party ke gupt khel ujagar.'); toast('Sting operation! Party ke gupt khel ujagar.', 'bad'); }
    // karyakarta ghatne ka dar
    if (H.t - H.vol.lastOrg > 48 && H.vol.active > 0) { var l = Math.floor(H.vol.active * .004); H.vol.active = Math.max(0, H.vol.active - Math.max(l, 0)); }
    H.vol.active = Math.min(H.vol.active, H.vol.total);
}
function hostile() {
    var def = H.it.on && H.it.mode !== 'attack';
    var p = def ? clamp(.5 + H.it.fund / 30, 0, .92) * (acount('warroom') ? 1.08 : 1) : 0;
    MEDIA.forEach(function (m) { if (H.media[m.id] > H.t) p += .03; }); p = clamp(p, 0, .95);
    var what = pick(HOSTILE);
    if (Math.random() < p) { H.it.blocked++; bump({ pop: .8 }); news('IT cell ne virodhi ka narrative kaat diya: "' + what + '".'); }
    else { H.it.missed++; bump({ rep: -2, pop: -1 }); news('Virodhi ka narrative failaa: "' + what + '". Chhavi giri.'); toast('Virodhi ne naya narrative chalaya: ' + what, 'bad'); }
}
function spawnCrisis() {
    var c = pick(CRISES), st = Math.random() < .5 ? C.state : pick(core.STATES);
    H.crisisCount++;
    H.crisis = { id: c.id, title: st + ' mein ' + c.n, d: c.d, state: st, due: H.t + 30, done: 0 };
    H.nextCrisis = H.t + ri(48, 90);
    news('Sankat: ' + H.crisis.title + '.'); toast('Sankat: ' + H.crisis.title + '. Party ko kuch karna chahiye.', 'bad');
}
function caseAgainst(title, sev) { H.cases.unshift({ id: 'k' + uid(), kind: 'against', title: title, sev: sev || 1, due: H.t + 48, lawyer: null, st: 'pending' }); H.cases = H.cases.slice(0, 20); }
function verdict(cs) {
    var lw = cs.lawyer != null ? LAWYERS[cs.lawyer] : null, p;
    if (cs.kind === 'for') { p = .3 + (lw ? lw[2] : 0) + judgeBonus() + C.res.image / 400 + (cs.topicMod || 0); }
    else { p = lw ? .38 + lw[2] + judgeBonus() + C.res.image / 500 : .12 + judgeBonus(); }
    var won = Math.random() < clamp(p, .05, .9); cs.st = won ? 'won' : 'lost';
    if (cs.kind === 'for') {
        if (won) { bump({ rep: 4, pop: 3, pow: 3 }); news('Court ne aapke paksh mein faisla diya: ' + cs.title + '.'); toast('Case jeete: ' + cs.title, 'good'); }
        else { bump({ rep: -3 }); news('Court mein haar: ' + cs.title + '.'); toast('Case haare: ' + cs.title, 'bad'); }
    } else {
        if (won) { bump({ rep: 3, pop: 2 }); news('Aapko clean chit mili: ' + cs.title + '.'); toast('Case khatam, clean chit mili.', 'good'); }
        else { var f = 2 * cs.sev; C.res.funds -= f; bump({ rep: -(4 + cs.sev * 3), pow: -3 }); news('Court ne dosh mana: ' + cs.title + '. Jurmana ' + f + ' Cr.'); toast('Case haare: ' + cs.title, 'bad'); }
    }
}
function catchUp() {
    var now = Date.now();
    if (H.paused) { H.last = now; return; }
    var n = Math.floor((now - H.last) / HOUR_MS);
    if (n > 0) { var m = Math.min(n, CATCHUP_MAX); for (var i = 0; i < m; i++) hourly(); H.last = now; }
}

// =============================================================
//  UI: helpers
// =============================================================
function ic(n) { return '<svg class="ch-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICONS[n] || ICONS.cmd) + '"/></svg>'; }
function btn(label, a, x, cls, dis, y) {
    return '<button class="ch-b ' + (cls || '') + '"' + (dis ? ' disabled' : '') + ' data-a="' + a + '"' + (x != null ? ' data-x="' + E(x) + '"' : '') + (y != null ? ' data-y="' + E(y) + '"' : '') + '>' + label + '</button>';
}
var FXN = { rep: 'Reputation', pop: 'Popularity', pow: 'Power', cad: 'Sanghathan' };
function fx(e, extra) {
    var o = '';
    Object.keys(FXN).forEach(function (k) { if (e && e[k]) { var v = Math.round(e[k] * 10) / 10; o += '<span class="ch-p ' + (v > 0 ? 'up' : 'dn') + '">' + FXN[k] + ' ' + (v > 0 ? '+' : '') + v + '</span>'; } });
    return o + (extra || '');
}
function costPill(c) { return c ? '<span class="ch-p cost">Kharch ' + fm(c) + ' Cr</span>' : ''; }
function row(t, sub, right, body) {
    return '<div class="ch-r"><div class="ch-rm"><div class="ch-rt"><b>' + t + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>' + (right ? '<div class="ch-rr">' + right + '</div>' : '') + '</div>' + (body ? '<div class="ch-rb">' + body + '</div>' : '') + '</div>';
}
function sec(t, sub) { return '<h3 class="ch-sec">' + t + '</h3>' + (sub ? '<p class="ch-sb">' + sub + '</p>' : ''); }
function seg(items, cur, a) { return '<div class="ch-seg">' + items.map(function (i) { return '<button class="' + (i[0] === cur ? 'on' : '') + '" data-a="' + a + '" data-x="' + i[0] + '">' + i[1] + '</button>'; }).join('') + '</div>'; }
function gauge(label, v, col, bind, note) {
    return '<div class="ch-m" style="--mc:' + col + '"><div class="ch-mh"><span>' + label + '</span><b' + (bind ? ' data-b="' + bind + '"' : '') + '>' + Math.round(v) + '</b></div><div class="ch-mt"><i' + (bind ? ' data-bw="' + bind + '"' : '') + ' style="width:' + clamp(v, 0, 100) + '%"></i></div>' + (note ? '<div class="ch-mn">' + note + '</div>' : '') + '</div>';
}
function empty(t) { return '<div class="ch-em">' + t + '</div>'; }
function lockBox(msg) { return '<div class="ch-lock">' + ic('lock') + '<span>' + msg + '</span></div>'; }

function toast(t, k) {
    var el = document.getElementById('ch-toast');
    if (!el) { el = document.createElement('div'); el.id = 'ch-toast'; document.body.appendChild(el); }
    el.className = 'ch-toast ' + (k || ''); el.textContent = t; el.style.opacity = '1';
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.style.opacity = '0'; }, 3800);
}

// =============================================================
//  CSS
// =============================================================
function css() {
    if (document.getElementById('ch-css')) return;
    var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = 'https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Yatra+One&display=swap'; document.head.appendChild(lk);
    var st = document.createElement('style'); st.id = 'ch-css';
    st.textContent = [
'.ch-root{--bg:#0d1a1e;--bg2:#112228;--cd:#162c32;--cd2:#1b363d;--ln:#2a474f;--tx:#ecf1ea;--mu:#8fa8a4;--gold:#f0b04a;--jade:#58c49a;--ver:#e0674a;--ind:#8aa4ff;position:relative;min-height:100%;background:var(--bg);color:var(--tx);font:400 15px/1.45 Hind,system-ui,-apple-system,"Segoe UI",sans-serif;padding-bottom:70px;}',
'.ch-root *{box-sizing:border-box;}.ch-root button{font-family:inherit;}',
'.ch-w{max-width:1040px;margin:0 auto;padding:0 16px;}',
'.ch-ic{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none;}',
'.ch-mu{color:var(--mu);font-size:12px;align-self:center;}',
'.ch-old .cm-card{background:var(--cd);border:1px solid var(--ln);border-radius:12px;padding:14px;margin:14px 0;backdrop-filter:none;}',
'.ch-old .cm-card h3{margin:0 0 10px;font:400 16px "Yatra One",Hind,serif;letter-spacing:0;color:var(--gold);}',
'.ch-old .cm-btn{border-radius:8px;padding:8px 14px;font-size:13.5px;background:var(--gold);color:#1b1405;}.ch-old .cm-btn.g{background:var(--jade);color:#07241a;}.ch-old .cm-btn.o{background:var(--ver);color:#fff;}.ch-old .cm-btn.gh{background:transparent;color:var(--tx);border:1px solid var(--ln);}',
'.ch-old .cm-st,.ch-old .cm-item{background:rgba(255,255,255,.04);border-radius:10px;}.ch-old .cm-st.cur{border-color:var(--gold);background:rgba(240,176,74,.1);}.ch-old .cm-st.done .n{background:var(--jade);}.ch-old .cm-st.cur .n{background:var(--gold);}',
'.ch-old .cm-select,.ch-old .cm-in{background:#0b1518;border:1px solid var(--ln);border-radius:8px;color:var(--tx);}',
'.ch-old .cm-badge{background:rgba(240,176,74,.14);border-color:rgba(240,176,74,.4);border-radius:20px;font-size:13px;}',
'.ch-home .ch-hero{position:relative;overflow:hidden;border:1px solid var(--ln);border-radius:16px;background:linear-gradient(120deg,var(--pcs),transparent 65%),var(--cd);padding:18px;}',
'.ch-arc{position:absolute;right:-8px;bottom:-4px;width:min(58%,330px);fill:none;stroke:var(--pcm);stroke-width:1.1;opacity:.45;pointer-events:none;}',
'.ch-hr{display:flex;gap:16px;align-items:center;position:relative;}.ch-hr img{width:92px;height:92px;border-radius:18px;object-fit:cover;border:3px solid var(--pc);background:#0a1417;flex:none;}',
'.ch-hr h2{margin:0;font:400 28px/1.1 "Yatra One",Hind,serif;}.ch-hr small{display:block;color:var(--mu);font-size:13px;margin-top:3px;}',
'.ch-pill{display:inline-flex;flex-direction:column;margin-top:10px;padding:7px 14px;border-radius:12px;background:rgba(0,0,0,.28);border-left:3px solid var(--pc);}.ch-pill small{margin:0;font-size:11.5px;color:var(--mu);}.ch-pill b{font-size:15px;font-weight:600;}',
'.ch-q{display:grid;grid-template-columns:repeat(4,1fr);margin-top:16px;border-top:1px solid var(--ln);padding-top:12px;position:relative;}.ch-q div{padding:0 12px;border-left:1px solid var(--ln);}.ch-q div:first-child{padding-left:0;border-left:0;}.ch-q small{display:block;font-size:12px;color:var(--mu);}.ch-q b{font:400 25px/1.2 "Yatra One",Hind,serif;font-variant-numeric:tabular-nums;}',
'.ch-hgrid{display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:14px;align-items:start;margin-top:16px;}.ch-hmain,.ch-hside{display:flex;flex-direction:column;gap:14px;min-width:0;}',
'.ch-hc{background:var(--cd);border:1px solid var(--ln);border-radius:16px;padding:14px 16px;}.ch-hc h3{margin:0;font:400 17px/1.2 "Yatra One",Hind,serif;display:flex;justify-content:space-between;align-items:baseline;gap:10px;}.ch-hc h3 small{font:400 12.5px Hind,sans-serif;color:var(--mu);}',
'.ch-hmw{position:relative;max-width:560px;margin:8px auto 0;}.ch-hm{width:100%;display:block;}.ch-hm circle{stroke:rgba(255,255,255,.35);stroke-width:.35;}.ch-hm circle.o{fill:rgba(255,255,255,.12);stroke:none;}',
'.ch-hmc{position:absolute;left:0;right:0;bottom:2px;text-align:center;}.ch-hmc b{display:block;font:400 38px/1 "Yatra One",Hind,serif;font-variant-numeric:tabular-nums;}.ch-hmc small{color:var(--mu);font-size:12.5px;}',
'.ch-hnote{margin:8px 0 0;font-size:13px;color:var(--mu);text-align:center;}',
'.ch-pcard{border:1px solid var(--pc);border-radius:16px;background:linear-gradient(160deg,var(--pcs),transparent 70%),var(--cd);padding:16px;}.ch-pcard .ch-ph{display:flex;gap:12px;align-items:center;margin-bottom:14px;}.ch-pcard .ch-ph img{width:48px;height:48px;border-radius:12px;object-fit:cover;background:#0a1417;}.ch-pcard .ch-ph b{display:block;font:400 20px/1.15 "Yatra One",Hind,serif;}.ch-pcard .ch-ph small{color:var(--mu);font-size:12.5px;}',
'.ch-pcard .ch-m{margin-bottom:10px;}.ch-pcard .ch-b{width:100%;padding:11px;font-size:15px;margin-top:6px;}.ch-pcard .ch-fx{display:flex;justify-content:space-between;font-size:13px;color:var(--mu);margin:6px 0 2px;}.ch-pcard .ch-fx b{color:var(--tx);font-weight:600;}',
'.ch-alert{display:flex;gap:8px;align-items:center;font-size:13px;color:#ffb4a2;background:rgba(224,103,74,.12);border-radius:8px;padding:6px 10px;margin-bottom:10px;}',
'.ch-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}.ch-chip{font-size:12.5px;padding:3px 10px;border-radius:20px;border:1px solid var(--pc);background:var(--pcs);}',
'.ch-bar{position:relative;height:10px;border-radius:5px;background:#0a1417;margin:12px 0 6px;overflow:visible;}.ch-bar i{display:block;height:100%;border-radius:5px;background:var(--pc);}.ch-bar u{position:absolute;top:-4px;bottom:-4px;width:2px;background:var(--gold);left:50.1%;}',
'.ch-big2{font:400 40px/1 "Yatra One",Hind,serif;font-variant-numeric:tabular-nums;}.ch-big2 small{font:400 15px Hind,sans-serif;color:var(--mu);margin-left:4px;}',
'.ch-yes{color:var(--jade);}.ch-no{color:var(--mu);}',
'@media(max-width:860px){.ch-hgrid{display:flex;flex-direction:column;}.ch-hmain,.ch-hside{display:contents;}.ch-hero{order:1;}.ch-pcard{order:2;}.ch-ls{order:3;}.ch-gv{order:4;}.ch-ct{order:5;}.ch-vs{order:6;}}',
'@media(max-width:560px){.ch-q{grid-template-columns:repeat(2,1fr);row-gap:12px;}.ch-q div:nth-child(3){padding-left:0;border-left:0;}.ch-hr img{width:70px;height:70px;}.ch-hr h2{font-size:22px;}.ch-hmc b{font-size:28px;}}',
/* masthead */
'.ch-mast{background:repeating-linear-gradient(135deg,var(--pcs) 0 2px,transparent 2px 9px),var(--bg2);border-bottom:3px solid var(--pc);}',
'.ch-mast .ch-w{display:flex;align-items:center;gap:12px;padding-top:12px;padding-bottom:12px;}',
'.ch-x{border:1px solid var(--ln);background:rgba(0,0,0,.25);color:var(--tx);border-radius:9px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none;}.ch-x:hover{border-color:var(--gold);}',
'.ch-lg{width:46px;height:46px;border-radius:11px;object-fit:cover;background:#0a1417;flex:none;}',
'.ch-pn{flex:1;min-width:0;}.ch-pn h1{margin:0;font:400 25px/1.15 "Yatra One",Hind,serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.ch-pn small{color:var(--mu);font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
'.ch-clk{text-align:right;font-size:12px;color:var(--mu);flex:none;}.ch-clk b{display:block;color:var(--tx);font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;}',
'.ch-hb{height:2px;background:#0a1417;margin-top:4px;border-radius:2px;overflow:hidden;}.ch-hb i{display:block;height:100%;background:var(--pc);}',
'.ch-ctl{display:flex;gap:6px;justify-content:flex-end;margin-top:6px;}.ch-ctl button{border:1px solid var(--ln);background:transparent;color:var(--mu);border-radius:7px;font-size:11.5px;padding:2px 8px;cursor:pointer;}.ch-ctl button:hover{color:var(--tx);border-color:var(--mu);}',
/* meters */
'.ch-meters{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;padding:14px 0 4px;}',
'.ch-m .ch-mh{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:var(--mu);margin-bottom:5px;}.ch-m .ch-mh b{color:var(--tx);font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;}',
'.ch-mt{height:7px;border-radius:4px;background:#0a1417;overflow:hidden;position:relative;}',
'.ch-mt::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent calc(25% - 1px),rgba(13,26,30,.9) 0 25%,transparent 0 calc(50% - 1px),rgba(13,26,30,.9) 0 50%,transparent 0 calc(75% - 1px),rgba(13,26,30,.9) 0 75%,transparent 0);}',
'.ch-mt i{display:block;height:100%;background:var(--mc);border-radius:4px;transition:width .6s ease;}',
'.ch-mn{font-size:11.5px;color:var(--mu);margin-top:4px;}',
/* upar ka hissa */
'.ch-top{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;}',
'.ch-card{background:var(--cd);border:1px solid var(--ln);border-radius:12px;padding:12px 14px;color:var(--tx);text-align:left;width:100%;}',
'button.ch-card{cursor:pointer;}button.ch-card:hover{border-color:var(--mu);}',
'.ch-ld{display:flex;gap:12px;align-items:center;}.ch-ld img{width:60px;height:60px;border-radius:12px;object-fit:cover;border:2px solid var(--pc);flex:none;background:#0a1417;}',
'.ch-ld b{display:block;font-size:17px;font-weight:600;line-height:1.2;}.ch-ld small{display:block;color:var(--mu);font-size:12.5px;margin-top:2px;}.ch-ld em{font-style:normal;font-size:12px;color:var(--gold);}',
'.ch-fd .ch-fl{font-size:12.5px;color:var(--mu);display:flex;justify-content:space-between;}',
'.ch-fd .ch-fv{font:400 30px/1.1 "Yatra One",Hind,serif;margin:2px 0 8px;font-variant-numeric:tabular-nums;}.ch-fd .ch-fv small{font:500 13px Hind,sans-serif;color:var(--mu);margin-left:4px;}',
'.ch-fs{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--ln);padding-top:8px;}',
'.ch-fs div{padding:0 8px;border-left:1px solid var(--ln);}.ch-fs div:first-child{padding-left:0;border-left:0;}.ch-fs small{display:block;font-size:11.5px;color:var(--mu);}.ch-fs b{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;}.ch-fs .neg{color:var(--ver);}',
/* strips */
'.ch-strip{display:flex;align-items:center;gap:12px;margin-top:12px;padding:10px 12px;border-radius:12px;border:1px solid var(--ln);background:var(--cd);}',
'.ch-strip .ch-si{width:38px;height:38px;border-radius:50%;background:var(--pcm);color:#fff;display:flex;align-items:center;justify-content:center;flex:none;}',
'.ch-strip .ch-st{flex:1;min-width:0;}.ch-strip b{display:block;font-weight:600;}.ch-strip small{color:var(--mu);font-size:12.5px;display:block;}',
'.ch-strip.go{border-color:var(--pc);}',
/* groups & tiles */
'.ch-g{margin-top:26px;}.ch-g h2{margin:0 0 10px;font:400 18px/1.2 "Yatra One",Hind,serif;display:flex;align-items:center;gap:12px;}.ch-g h2::after{content:"";flex:1;height:1px;background:var(--ln);}',
'.ch-tg{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
'.ch-t{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--cd);border:1px solid var(--ln);border-radius:10px;padding:10px 12px;color:var(--tx);cursor:pointer;position:relative;}',
'.ch-t:hover{border-color:var(--gc);background:var(--cd2);}',
'.ch-t .ch-ti{width:38px;height:38px;border-radius:9px;background:var(--gs);color:var(--gc);display:flex;align-items:center;justify-content:center;flex:none;}',
'.ch-t .ch-tx{flex:1;min-width:0;}.ch-t b{display:block;font-weight:600;font-size:15px;}.ch-t small{display:block;color:var(--mu);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
'.ch-t .ch-ch{color:var(--mu);}.ch-t .ch-ch .ch-ic{width:16px;height:16px;}',
'.ch-t.lk{opacity:.7;}.ch-t.lk .ch-ti{background:rgba(255,255,255,.06);color:var(--mu);}',
'.ch-dot{position:absolute;top:9px;right:34px;width:8px;height:8px;border-radius:50%;background:var(--ver);box-shadow:0 0 0 0 rgba(224,103,74,.6);animation:chp 2.2s infinite;}',
'@keyframes chp{0%{box-shadow:0 0 0 0 rgba(224,103,74,.55);}70%{box-shadow:0 0 0 8px rgba(224,103,74,0);}100%{box-shadow:0 0 0 0 rgba(224,103,74,0);}}',
/* diary */
'.ch-dy{border:1px solid var(--ln);border-radius:12px;background:var(--cd);padding:4px 14px;}',
'.ch-dy div{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--ln);font-size:13.5px;}.ch-dy div:last-child{border-bottom:0;}.ch-dy time{color:var(--mu);flex:none;width:78px;font-size:12px;padding-top:1px;font-variant-numeric:tabular-nums;}',
/* sheet */
'.ch-sh{position:fixed;inset:0;z-index:10;display:flex;justify-content:flex-end;}.ch-bd{position:absolute;inset:0;background:rgba(3,10,12,.62);}',
'.ch-sp{position:relative;width:min(620px,100%);height:100%;background:var(--bg2);border-left:1px solid var(--ln);display:flex;flex-direction:column;animation:chs .22s ease-out;}',
'@keyframes chs{from{transform:translateX(24px);opacity:.4;}to{transform:none;opacity:1;}}',
'.ch-sph{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--ln);background:var(--bg2);}.ch-sph h2{margin:0;font:400 20px/1.15 "Yatra One",Hind,serif;}.ch-sph small{display:block;color:var(--mu);font-size:12.5px;}.ch-sph div{flex:1;min-width:0;}',
'.ch-spb{flex:1;overflow:auto;padding:6px 16px 50px;-webkit-overflow-scrolling:touch;}',
'.ch-sec{margin:20px 0 6px;font:400 16px/1.2 "Yatra One",Hind,serif;color:var(--gold);}.ch-sb{margin:0 0 8px;color:var(--mu);font-size:13.5px;}',
'.ch-r{padding:11px 0;border-bottom:1px solid var(--ln);}.ch-r:last-child{border-bottom:0;}',
'.ch-rm{display:flex;gap:12px;align-items:flex-start;}.ch-rt{flex:1;min-width:0;}.ch-rt b{display:block;font-weight:600;}.ch-rt small{display:block;color:var(--mu);font-size:13px;margin-top:1px;}.ch-rr{flex:none;display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end;}.ch-rb{margin-top:7px;display:flex;flex-wrap:wrap;gap:6px;}',
'.ch-p{display:inline-block;font-size:11.5px;padding:2px 8px;border-radius:20px;border:1px solid var(--ln);color:var(--mu);white-space:nowrap;}.ch-p.up{color:var(--jade);border-color:rgba(88,196,154,.4);}.ch-p.dn{color:var(--ver);border-color:rgba(224,103,74,.45);}.ch-p.cost{color:var(--gold);border-color:rgba(240,176,74,.4);}.ch-p.rk{color:#e6b8ff;border-color:rgba(230,184,255,.35);}',
'.ch-b{border:0;border-radius:8px;background:var(--gold);color:#1b1405;font-weight:600;font-size:13.5px;padding:7px 14px;cursor:pointer;white-space:nowrap;}.ch-b:hover{filter:brightness(1.08);}',
'.ch-b.gh{background:transparent;color:var(--tx);border:1px solid var(--ln);}.ch-b.gh:hover{border-color:var(--mu);}.ch-b.dg{background:var(--ver);color:#fff;}.ch-b.gr{background:var(--jade);color:#07241a;}.ch-b.sm{padding:4px 10px;font-size:12.5px;}',
'.ch-b:disabled{opacity:.38;cursor:not-allowed;filter:none;}',
'.ch-cd{font-size:12.5px;color:var(--mu);border:1px dashed var(--ln);border-radius:8px;padding:5px 10px;white-space:nowrap;}',
'.ch-seg{display:flex;gap:4px;margin:12px 0 4px;background:#0b1518;padding:3px;border-radius:10px;overflow-x:auto;}.ch-seg button{flex:1;border:0;background:transparent;color:var(--mu);padding:7px 10px;border-radius:8px;font-size:13.5px;cursor:pointer;white-space:nowrap;}.ch-seg button.on{background:var(--cd2);color:var(--tx);font-weight:600;}',
'.ch-in{width:100%;background:#0b1518;border:1px solid var(--ln);border-radius:8px;padding:9px 11px;color:var(--tx);font:inherit;outline:none;}.ch-in:focus{border-color:var(--gold);}textarea.ch-in{resize:vertical;min-height:70px;}select.ch-in{padding-right:6px;}',
'.ch-f{display:grid;gap:8px;margin:8px 0;}.ch-f.two{grid-template-columns:1fr 1fr;}.ch-f label{font-size:12.5px;color:var(--mu);display:block;margin-bottom:3px;}',
'.ch-em{color:var(--mu);padding:14px 0;font-size:14px;}',
'.ch-lock{display:flex;gap:10px;align-items:center;padding:11px 12px;border:1px dashed var(--ln);border-radius:10px;color:var(--mu);font-size:13.5px;margin:8px 0;}',
'.ch-kv{display:grid;grid-template-columns:1fr auto;gap:4px 12px;font-size:14px;}.ch-kv span{color:var(--mu);}.ch-kv b{font-weight:600;text-align:right;font-variant-numeric:tabular-nums;}.ch-kv .sp{grid-column:1/-1;border-top:1px solid var(--ln);margin:4px 0;}',
'.ch-big{font:400 34px/1.1 "Yatra One",Hind,serif;font-variant-numeric:tabular-nums;}',
'.ch-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
'.ch-star{color:var(--gold);letter-spacing:1px;font-size:13px;}.ch-hearts{color:var(--ver);letter-spacing:2px;}',
'.ch-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:9500;max-width:min(520px,92vw);background:#0a1417;color:var(--tx);border:1px solid var(--ln);border-left:4px solid var(--gold);padding:10px 16px;border-radius:10px;font:500 14px/1.4 Hind,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45);opacity:0;transition:opacity .25s;pointer-events:none;}.ch-toast.good{border-left-color:#58c49a;}.ch-toast.bad{border-left-color:#e0674a;}',
'@media(max-width:760px){.ch-meters{grid-template-columns:1fr;gap:9px;padding-top:12px;}.ch-top{grid-template-columns:1fr;}.ch-tg{grid-template-columns:1fr;}.ch-pn h1{font-size:21px;}.ch-w{padding:0 12px;}.ch-grid2{grid-template-columns:1fr;}.ch-f.two{grid-template-columns:1fr;}.ch-sp{border-left:0;}.ch-clk{display:none;}}',
'@media(prefers-reduced-motion:reduce){.ch-dot,.ch-sp{animation:none;}.ch-mt i{transition:none;}}'
    ].join('\n');
    document.head.appendChild(st);
}

// =============================================================
//  MAIN PAGE
// =============================================================
var GROUPS = {
    paisa: { n: 'Paisa aur sansadhan', c: '#f0b04a' },
    chhavi: { n: 'Prachar aur chhavi', c: '#58c49a' },
    sang: { n: 'Sangathan aur log', c: '#8aa4ff' },
    kanoon: { n: 'Kanoon aur sankat', c: '#c9a6ff' },
    parda: { n: 'Parde ke peeche', c: '#e0674a' }
};
function tile(m) {
    var g = GROUPS[m.g], lk = m.locked ? m.locked() : '', al = m.alert ? m.alert() : false;
    return '<button class="ch-t' + (lk ? ' lk' : '') + '" data-a="open" data-x="' + m.id + '" style="--gc:' + g.c + ';--gs:' + rgba(g.c, .14) + '"><span class="ch-ti">' + ic(m.ic) + '</span><span class="ch-tx"><b>' + E(m.n) + '</b><small>' + m.st() + '</small></span>' + (al ? '<i class="ch-dot"></i>' : '') + '<span class="ch-ch">' + ic('chev') + '</span></button>';
}
function binds() {
    return { rep: C.res.image, pop: H.pop, pow: H.pow, cash: fm(C.res.funds), assets: fm(assetValue() + investTotal()), burn: fm(dailyBurn() + loanDaily()), debt: fm(loansOwed()), clock: clockText() };
}
function logoCard() {
    return '<details style="margin:8px 0"><summary style="cursor:pointer;color:#94a3b8;font-size:.85rem">Party ka logo badlo</summary><div style="margin:8px 0 4px"><button class="ch-b" data-a="pickLogo" style="cursor:pointer">&#127912; Apna logo upload karo</button></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">' + [0,1,2,3,4,5,6,7,8,9].map(function (i) { return '<button data-a="logoIdx" data-x="' + i + '" style="padding:0;width:38px;height:38px;border-radius:10px;overflow:hidden;border:2px solid rgba(255,255,255,.2);background:none;cursor:pointer"><img src="' + core.logoUri(i, C.party.name) + '" style="width:100%;height:100%;display:block" alt=""></button>'; }).join('') + '</div></details>';
}
function mainHtml() {
    var pc = core.myCol(), b = binds();
    var h = '<div class="ch-root" style="--pc:' + pc + ';--pcs:' + rgba(pc, .14) + ';--pcm:' + rgba(pc, .55) + '">';
    h += '<header class="ch-mast"><div class="ch-w"><button class="ch-x" data-a="home" title="Career home">' + ic('back') + '</button><img class="ch-lg" src="' + core.logoOf() + '" alt=""><div class="ch-pn"><h1>' + E(C.party.name) + '</h1><small>' + E(C.state) + ' ke neta ' + E(C.name) + '</small></div>' +
        '<div class="ch-clk"><b data-b="clock">' + b.clock + '</b>samay<div class="ch-hb"><i data-bw="hbar" style="width:0%"></i></div><div class="ch-ctl"><button data-a="pause">' + (H.paused ? 'Chalu karo' : 'Roko') + '</button><button data-a="skip">+6 ghante</button></div></div></div></header>';
    h += '<div class="ch-w">';
    h += '<div class="ch-meters">' + gauge('Reputation', C.res.image, 'var(--jade)', 'rep') + gauge('Popularity', H.pop, 'var(--gold)', 'pop') + gauge('Power', H.pow, 'var(--ver)', 'pow') + '</div>';
    // neta + fund
    h += logoCard();
    h += '<div class="ch-top"><button class="ch-card" data-a="open" data-x="leader"><div class="ch-ld"><img src="' + core.photoOf() + '" alt=""><div><b>' + E(C.name) + '</b><small>' + E(H.leader.title) + '</small><em>Profile dekho ya badlo</em></div></div></button>' +
        '<button class="ch-card ch-fd" data-a="open" data-x="khata"><div class="ch-fl"><span>Party fund aur sampatti</span><span>Khata kholo</span></div><div class="ch-fv"><span data-b="cash">' + b.cash + '</span><small>Cr</small></div>' +
        '<div class="ch-fs"><div><small>Sampatti</small><b><span data-b="assets">' + b.assets + '</span> Cr</b></div><div><small>Kharch/din</small><b><span data-b="burn">' + b.burn + '</span> Cr</b></div><div><small>Karz</small><b class="' + (loansOwed() > 0 ? 'neg' : '') + '"><span data-b="debt">' + b.debt + '</span> Cr</b></div></div></button></div>';
    // press conference (hamesha dikhta hai)
    var pl = cdLeft('press');
    h += '<div class="ch-strip' + (pl <= 0 ? ' go' : '') + '"><span class="ch-si">' + ic('press') + '</span><div class="ch-st"><b>Press conference</b><small>' + (pl > 0 ? 'Agli press conference ' + hrs(pl) + ' baad' : 'Taiyar. Media aapka intezaar kar raha hai.') + '</small></div>' + btn(pl > 0 ? 'Dekho' : 'Bulao', 'open', 'press', pl > 0 ? 'gh' : '') + '</div>';
    // chunav
    var stg = core.STAGES[C.stage];
    h += '<div class="ch-strip"><span class="ch-si" style="background:rgba(240,176,74,.2);color:var(--gold)">' + ic('ballot') + '</span><div class="ch-st"><b>Agla chunav: ' + E(stg.n) + '</b><small>' + C.mla.length + ' MLA, ' + C.mp.length + ' MP, ' + C.govStates.length + ' state mein sarkar</small></div>' + btn('Upalabdhiyan', 'open', 'ach', 'gh sm') + btn('Chunav ladein', 'open', 'elect', '') + '</div>';
    // groups
    Object.keys(GROUPS).forEach(function (g) {
        var ms = MODS.filter(function (m) { return m.g === g; });
        h += '<section class="ch-g"><h2>' + GROUPS[g].n + '</h2><div class="ch-tg">' + ms.map(tile).join('') + '</div></section>';
    });
    // diary
    h += '<section class="ch-g"><h2>Party diary</h2><div class="ch-dy">' + (H.log.length ? H.log.slice(0, 8).map(function (l) { var d = Math.floor(l.t / 24) + 1, hh = Math.floor(l.t % 24); return '<div><time>Din ' + d + ', ' + (hh < 10 ? '0' : '') + hh + ':00</time><span>' + E(l.x) + '</span></div>'; }).join('') : '<div><span style="color:var(--mu)">Abhi kuch khaas nahi hua. Koi section kholkar pehla kadam uthao.</span></div>') + '</div></section>';
    h += '</div>';
    return h;
}
function sheetHtml() {
    var sh = SHEETS[S.sheet]; if (!sh) return '';
    return '<div class="ch-sh"><div class="ch-bd" data-a="shclose"></div><div class="ch-sp"><div class="ch-sph"><button class="ch-x" data-a="shclose" title="Band karo">' + ic('x') + '</button><div><h2>' + sh.n + '</h2><small>' + (sh.sub ? sh.sub() : '') + '</small></div></div><div class="ch-spb">' + sh.body() + '</div></div></div>';
}

// =============================================================
//  RENDER + GHADI
// =============================================================
function focusInside(el) {
    var a = document.activeElement; if (!a || !el.contains || !el.contains(a)) return false;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName || '');
}
function attach(el) {
    if (el._chOn) return; el._chOn = true;
    el.addEventListener('click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('[data-a]') : null; if (!b || b.disabled) return;
        var f = ACT[b.getAttribute('data-a')]; if (f) f(b.getAttribute('data-x'), b.getAttribute('data-y'), b);
    });
    el.addEventListener('change', function (e) {
        var t = e.target, c = t && t.getAttribute ? t.getAttribute('data-c') : null; if (c && ACT[c]) ACT[c](t.value, t.getAttribute('data-x'), t);
    });
}
function render() {
    if (!ensure()) return;
    css(); catchUp();
    var el = core.shell(); attach(el);
    var ob = el.querySelector ? el.querySelector('.ch-spb') : null, sb = ob ? ob.scrollTop : 0, ms = el.scrollTop || 0;
    var m = core.takeMsg(); if (m) toast(m.t, m.k);
    el.innerHTML = (S.view === 'party' ? mainHtml() + (S.sheet ? sheetHtml() : '') : homeHtml()) + '</div>';
    el.classList.remove('hidden'); el.style.overflow = (S.view === 'party' && S.sheet) ? 'hidden' : '';
    el.scrollTop = ms;
    var nb = el.querySelector('.ch-spb'); if (nb) nb.scrollTop = sb;
    save();
}
function softBind() {
    var el = document.getElementById('cm-ui'); if (!el) return;
    var b = binds();
    [].forEach.call(el.querySelectorAll('[data-b]'), function (n) { var k = n.getAttribute('data-b'); if (b[k] !== undefined) n.textContent = (k === 'rep' || k === 'pop' || k === 'pow') ? Math.round(b[k]) : b[k]; });
    [].forEach.call(el.querySelectorAll('[data-bw]'), function (n) {
        var k = n.getAttribute('data-bw'); if (k === 'hbar') n.style.width = clamp((Date.now() - H.last) / HOUR_MS * 100, 0, 100) + '%';
        else if (b[k] !== undefined) n.style.width = clamp(b[k], 0, 100) + '%';
    });
}
function tick() {
    var el = document.getElementById('cm-ui');
    if (!el || el.classList.contains('hidden') || !el.querySelector || !el.querySelector('.ch-root')) return;
    if (!ensure()) return;
    if (H.paused) { H.last = Date.now(); softBind(); return; }
    var n = Math.floor((Date.now() - H.last) / HOUR_MS);
    if (n > 0) {
        for (var i = 0; i < Math.min(n, 6); i++) hourly();
        H.last += n * HOUR_MS; if (H.last > Date.now()) H.last = Date.now();
        save();
        if (focusInside(el)) softBind(); else render();
    } else softBind();
}
setInterval(tick, 1000);

// =============================================================
//  SECTIONS (sheet ke andar ka kaam)
// =============================================================
var LISTS = { org: ORG, symp: SYMP, tact: TACT, src: SRC };
function gateOf(it) {
    if (it.gate) { var g = it.gate(); if (g) return g; }
    if (it.needVol && H.vol.active < it.needVol) return 'Kam se kam ' + it.needVol + ' active karyakarta chahiye (abhi ' + H.vol.active + ').';
    return '';
}
function itemRows(ns) {
    return LISTS[ns].map(function (it) {
        var k = ns + ':' + it.id, l = cdLeft(k), g = gateOf(it), gain = it.earnFn ? it.earnFn() : it.earn;
        var pills = costPill(it.cost) + (gain ? '<span class="ch-p up">Aay +' + fm(gain) + ' Cr</span>' : '') + fx(it.eff) +
            (it.risk ? '<span class="ch-p rk">Jokhim ' + Math.round(it.risk.p * 100) + '%</span>' : '') + (it.heat ? '<span class="ch-p rk">Pakde jaane ka dar +' + it.heat + '</span>' : '') +
            (g ? '<span class="ch-p dn">' + E(g) + '</span>' : '');
        var right = l > 0 ? '<span class="ch-cd">' + hrs(l) + ' baad</span>' : btn(it.btn || 'Karo', 'item', ns + '|' + it.id, '', !!g);
        return row(E(it.n), E(it.d || ''), right, pills);
    }).join('');
}
function perDay(c) { return Math.round(c.cost * 24 / c.hrs * 100) / 100; }
function hireRows(list, map, ns) {
    return list.map(function (c) {
        var left = (map[c.id] || 0) - H.t, on = left > 0, lk = c.lvl ? lvlMsg(c.lvl) : '';
        var pills = '<span class="ch-mu">Roz ka asar</span>' + fx(scale(c.drip, 24)) + '<span class="ch-p">' + fm(perDay(c)) + ' Cr/din</span><span class="ch-p">Jab tak aap hatao nahi</span>' + (c.elec ? '<span class="ch-p up">Chunav mein madad</span>' : '');
        var right = lk ? '<span class="ch-cd">Band</span>' : (on ? '<span class="ch-cd">Chalu hai</span>' + btn('Hatao', 'hire', ns + '|' + c.id, 'gh sm') : btn('Hire karo (' + fm(perDay(c)) + ' Cr/din)', 'hire', ns + '|' + c.id));
        return row(E(c.n) + ' <small style="display:inline;color:var(--mu)">(' + c.tier + ')</small>', E(c.d), right, pills + (lk ? '<span class="ch-p dn">' + lk + '</span>' : ''));
    }).join('');
}
function noteBox(t) { return '<p class="ch-sb" style="margin:12px 0 0">' + t + '</p>'; }

// ---------- leader ----------
function photoBlock() {
    var av = '';
    for (var i = 0; i < 10; i++) av += '<button class="ch-avb" data-a="leaderAv" data-x="' + i + '" title="Avatar ' + (i + 1) + '" style="padding:0;width:42px;height:42px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.18);background:none;cursor:pointer"><img src="' + core.avatarUri(i) + '" alt="" style="width:100%;height:100%;display:block"></button>';
    return '<div style="margin:0 0 14px"><label style="display:block;margin-bottom:6px">Profile photo</label>' +
        '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px"><button class="ch-b" data-a="pickPhoto" style="cursor:pointer">&#128247; Apni photo upload karo</button><small style="color:var(--mu)">ya neeche se avatar chuno</small></div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' + av + '</div></div>';
}
function sh_leader() {
    var L = H.leader, since = C.started || '';
    return '<div class="ch-ld" style="margin:16px 0"><img src="' + core.photoOf() + '" alt=""><div><b>' + E(C.name) + '</b><small>' + E(C.party.name) + '</small><em>Party ke sansthapak' + (since ? ', ' + E(since) + ' se' : '') + '</em></div></div>' +
        photoBlock() +
        '<div class="ch-f"><div><label>Naam</label><input id="ch-ln" class="ch-in" value="' + E(C.name) + '"></div><div><label>Pad</label><input id="ch-lt" class="ch-in" value="' + E(L.title) + '"></div>' +
        '<div class="ch-f two" style="margin:0"><div><label>Umra</label><input id="ch-la" class="ch-in" value="' + E(L.age) + '" placeholder="jaise 46"></div><div><label>Shiksha / pesha</label><input id="ch-le" class="ch-in" value="' + E(L.edu) + '" placeholder="jaise vakil, MBA"></div></div>' +
        '<div><label>Naara</label><input id="ch-lm" class="ch-in" value="' + E(L.motto) + '" placeholder="Janta ke saamne aapka ek vakya"></div>' +
        '<div><label>Parichay</label><textarea id="ch-lb" class="ch-in" placeholder="Apni kahani likho">' + E(L.bio) + '</textarea></div></div>' +
        '<div class="ch-rr" style="justify-content:flex-start">' + btn('Badlav save karo', 'saveLeader') + '</div>' +
        sec('Ab tak ka safar') + '<div class="ch-kv"><span>Vidhayak</span><b>' + C.mla.length + '</b><span>Saansad</span><b>' + C.mp.length + '</b><span>Sarkar wale state</span><b>' + C.govStates.length + '</b><span>Chunav ladi</span><b>' + C.results.length + '</b><span>Sankat sambhale</span><b>' + H.crisisCount + '</b></div>';
}
// ---------- press ----------
function sh_press() {
    var l = cdLeft('press');
    return sec('Aaj ka mudda chuno', 'Press conference ka kharch 0.5 Cr. Har 8 ghante mein ek baar. Reputation kam ho to galat bayan ka khatra badhta hai.') + (l > 0 ? '<div class="ch-lock">' + ic('press') + '<span>Agli press conference ' + hrs(l) + ' baad.</span></div>' : '') +
        PRESS.map(function (p) { return row(E(p.n), '', btn('Bulao', 'press', p.id, '', l > 0), fx(p.eff)); }).join('') +
        '<div class="ch-kv" style="margin-top:14px"><span>Galat bayan ka khatra abhi</span><b>' + Math.round(clamp(.12 - C.res.image / 1000, .04, .12) * 100) + '%</b></div>';
}
// ---------- khata ----------
function sh_khata() {
    var t = S.tab.khata || 'khata', h = seg([['khata', 'Khata'], ['sampatti', 'Sampatti'], ['dena', 'Kharch aur karz']], t, 'tab');
    var inc = dailyIncome(), bur = dailyBurn(), ld = loanDaily();
    if (t === 'khata') {
        h += '<div style="margin:16px 0 4px"><div class="ch-fl" style="color:var(--mu);font-size:13px">Party fund (cash)</div><div class="ch-big">' + fm(C.res.funds) + ' <small style="font:500 14px Hind;color:var(--mu)">Cr</small></div></div>' +
            '<div class="ch-kv" style="margin-top:12px"><span>Sampatti (zameen, gaadi, daftar)</span><b>' + fm(assetValue()) + ' Cr</b><span>Lagaya hua paisa</span><b>' + fm(investTotal()) + ' Cr</b><span>Karz baaki</span><b>' + fm(loansOwed()) + ' Cr</b><div class="sp"></div><span>Kul sampatti (net worth)</span><b>' + fm(C.res.funds + assetValue() + investTotal() - loansOwed()) + ' Cr</b></div>' +
            sec('Roz ka hisaab') + '<div class="ch-kv"><span>Chanda aur aay (anumaan)</span><b>+' + fm(inc) + ' Cr/din</b><span>Kharch</span><b>-' + fm(bur) + ' Cr/din</b><span>Karz ka byaaj</span><b>-' + fm(ld) + ' Cr/din</b><div class="sp"></div><span>Bachat</span><b style="color:' + (inc - bur - ld >= 0 ? 'var(--jade)' : 'var(--ver)') + '">' + fm(inc - bur - ld) + ' Cr/din</b></div>' +
            noteBox('Ek din = 24 game ghante = 6 minute. Investment aur drip se alag aay yahan shamil nahi.') +
            '<div class="ch-kv" style="margin-top:10px"><span>Ab tak kul aay</span><b>' + fm(H.stat.income) + ' Cr</b><span>Ab tak kul kharch</span><b>' + fm(H.stat.spent) + ' Cr</b></div>';
    } else if (t === 'sampatti') {
        h += sec('Party ki sampatti', 'Khareedne par kharch, par rakh-rakhav ka kharch roz lagta hai. Bechne par 70% wapas milta hai.') + ASSETS.map(function (a) {
            var n = acount(a.id), val = a.cost * (a.appr ? (1 + a.appr * H.t / 24) : 1);
            var pills = costPill(a.cost) + (a.up ? '<span class="ch-p">Rakh-rakhav ' + a.up + ' Cr/din</span>' : '') + (a.elec ? '<span class="ch-p up">Chunav mein madad</span>' : '') + (a.drip ? '<span class="ch-p up">Roz popularity</span>' : '') + (a.appr ? '<span class="ch-p up">Daam badhte hain</span>' : '');
            return row(E(a.n) + (n ? ' <small style="display:inline;color:var(--gold)">x' + n + '</small>' : ''), E(a.d), btn('Khareedo', 'buy', a.id, '', n >= a.max) + (n ? btn('Becho', 'sell', a.id, 'gh sm') : ''), pills + (n ? '<span class="ch-p">Abhi keemat ' + fm(val * n) + ' Cr</span>' : ''));
        }).join('');
    } else {
        h += sec('Roz ke kharch (liability)') + '<div class="ch-kv">' + burnItems().map(function (b) { return '<span>' + E(b[0]) + '</span><b>' + fm(b[1]) + ' Cr/din</b>'; }).join('') + '<div class="sp"></div><span>Kul kharch</span><b>' + fm(dailyBurn()) + ' Cr/din</b></div>';
        h += sec('Karz (loan)', 'Byaaj har ghante judta hai. Samay par na lautaya to reputation girti hai.');
        h += H.loans.length ? H.loans.map(function (l) {
            var left = l.due - H.t, od = left < 0;
            return row(E(l.n), 'Mool ' + fm(l.p) + ' Cr, byaaj ' + l.rate + '% roz', '<span class="ch-cd" style="' + (od ? 'color:var(--ver);border-color:var(--ver)' : '') + '">' + (od ? 'Samay beet gaya' : hrs(left) + ' baaki') + '</span>',
                '<span class="ch-p dn">Abhi dena ' + fm(l.owed) + ' Cr</span>' + btn('Poora chukao', 'repay', l.id, 'gr sm', C.res.funds < l.owed, 'all') + btn('Aadha chukao', 'repay', l.id, 'gh sm', C.res.funds < l.owed / 2, 'half'));
        }).join('') : empty('Koi karz nahi. Sources aur chanda mein karz ke vikalp hain.');
    }
    return h;
}
// ---------- sources ----------
function sh_src() {
    var t = S.tab.src || 'chanda', h = seg([['chanda', 'Chanda'], ['karz', 'Karz']], t, 'tab');
    if (t === 'chanda') return h + sec('Paisa jutane ke raaste', 'Jitna bada chanda, utna bada jokhim. Cooldown ke baad hi dobara.') + itemRows('src');
    h += sec('Karz lo', 'Zyada se zyada 4 karz ek saath. Karz ka byaaj roz badhta hai.');
    LOANS.forEach(function (l) {
        h += row(E(l.n), E(l.d), '', '<span class="ch-p">Byaaj ' + l.rate + '% roz</span><span class="ch-p">' + l.days + ' din</span>' + l.amts.map(function (a) { return btn(a + ' Cr lo', 'loan', l.id, 'gh sm', H.loans.length >= 4, a); }).join(''));
    });
    return h;
}
// ---------- investment ----------
function sh_invest() {
    var h = sec('Aapke nivesh', 'Har nivesh apne samay par kamai dalta hai. Ghadi 15 second mein 1 ghanta chalti hai.');
    h += H.invest.length ? H.invest.map(function (iv) {
        var d = INV.filter(function (x) { return x.id === iv.k; })[0], age = H.t - iv.t0, nxt = d.per - (age % d.per), lock = d.lock && age < d.lock;
        return row(E(d.n), fm(iv.amt) + ' Cr lagaye. Ab tak kamai ' + fm(iv.got || 0) + ' Cr', btn('Nikalo', 'divest', iv.id, 'gh sm'), '<span class="ch-p up">Agla payout ' + hrs(nxt) + ' mein</span>' + (lock ? '<span class="ch-p dn">Abhi nikaalne par 10% katega</span>' : ''));
    }).join('') : empty('Abhi koi nivesh nahi.');
    h += sec('Naya nivesh');
    INV.forEach(function (d) {
        var yy = d.y[0] === d.y[1] ? 'Har ' + d.per + ' ghante par ' + (d.y[0] * 100).toFixed(1) + '%' : 'Har ' + d.per + ' ghante par ' + (d.y[0] * 100).toFixed(0) + '% se ' + (d.y[1] * 100).toFixed(0) + '%';
        h += row(E(d.n), E(d.d), '', '<span class="ch-p up">' + yy + '</span>' + (d.crash ? '<span class="ch-p rk">Doobne ka khatra</span>' : '') + [1, 2, 5].map(function (m) { return btn(d.min * m + ' Cr', 'invest', d.id, 'gh sm', C.res.funds < d.min * m, d.min * m); }).join(''));
    });
    return h;
}
// ---------- consult, media ----------
function sh_cons() { return sec('Consulting agency hire karo', 'Badi agency zyada mehengi, par asar bhi bada. Contract chalne tak roz reputation aur popularity badhti hai, aur chunav mein bhi madad milti hai.') + hireRows(CONS, H.consult, 'cons'); }
function sh_media() { return sec('Media ko saath lo', 'Chhoti media sasti hai. Rashtriya media tab khulta hai jab party badi ho jaye.') + hireRows(MEDIA, H.media, 'media') + noteBox('Rashtriya channel se popularity bahut badhti hai, par janta ise "godi media" kehti hai aur reputation thodi ghatti hai.'); }
// ---------- IT cell ----------
function sh_it() {
    var it = H.it, left = it.until - H.t, on = it.on;
    var h = '<div class="ch-card" style="margin:14px 0"><div class="ch-rm"><div class="ch-rt"><b>' + (on ? 'IT cell chal raha hai' : 'IT cell band hai') + '</b><small>' + (on ? 'Chakra khatam hone mein ' + hrs(left) : 'Fund lagao aur chakra shuru karo') + '</small></div></div>' +
        (on ? '<div class="ch-mt" style="margin-top:10px;--mc:var(--jade)"><i style="width:' + clamp((H.t - it.start) / it.len * 100, 0, 100) + '%"></i></div>' : '') +
        '<div class="ch-kv" style="margin-top:10px"><span>Virodhi ke narrative roke</span><b>' + it.blocked + '</b><span>Narrative jo nahi roke</span><b>' + it.missed + '</b></div></div>';
    h += sec('Chakra ki setting', 'Chakra poora hone tak IT cell roz campaign chalata hai, aapke khilaf narrative kaatta hai aur virodhi ke khilaf chalata hai.');
    h += '<div class="ch-f two"><div><label>Is chakra ka fund</label><select class="ch-in" data-c="itFund"' + (on ? ' disabled' : '') + '>' + [2, 5, 10, 25, 50].map(function (v) { return '<option value="' + v + '"' + (it.fund === v ? ' selected' : '') + '>' + v + ' Cr</option>'; }).join('') + '</select></div>' +
        '<div><label>Chakra kitne din ka</label><select class="ch-in" data-c="itLen"' + (on ? ' disabled' : '') + '>' + [[24, '1 din'], [48, '2 din'], [72, '3 din']].map(function (v) { return '<option value="' + v[0] + '"' + (it.len === v[0] ? ' selected' : '') + '>' + v[1] + '</option>'; }).join('') + '</select></div></div>';
    h += seg([['defend', 'Raksha'], ['attack', 'Hamla'], ['both', 'Dono']], it.mode, 'itMode');
    h += '<div class="ch-rr" style="justify-content:flex-start;margin-top:10px">' + (on ? btn('Chakra roko', 'itStop', null, 'dg') : btn('Chakra shuru karo (' + it.fund + ' Cr)', 'itStart')) + btn(it.auto ? 'Apne aap dohrao: chalu' : 'Apne aap dohrao: band', 'itAuto', null, 'gh') + '</div>';
    h += noteBox('Raksha: virodhi ke narrative kaatta hai. Hamla: virodhi ki chhavi par chot, chunav mein fayda. Dono: poora asar. ' + (acount('warroom') ? 'Digital war-room se IT cell 30% tez hai.' : 'Digital war-room (Party khata, Sampatti) se IT cell tez hota hai.'));
    return h;
}
// ---------- organise, sympathy, tactics ----------
function sh_org() { return sec('Kuch bada organise karo', 'Bade event ke liye zyada active karyakarta chahiye. Event se karyakarta sakriya bhi rehte hain.') + itemRows('org'); }
function sh_symp() { return '<div style="margin:14px 0 4px">' + gauge('Sympathy lahar', H.wave, 'var(--ind)', null, 'Lahar roz kam hoti hai, par chunav mein jab tak hai madad karti hai.') + '</div>' + sec('Hamdardi jagao') + itemRows('symp'); }
function sh_tact() {
    return '<div style="margin:14px 0 4px">' + gauge('Pakde jaane ka dar', H.heat, 'var(--ver)', null, H.heat > 60 ? 'Khatre ke nishan par. Sting ya chhapa pad sakta hai.' : 'Dar jitna zyada, sting aur case ka khatra utna zyada.') + '</div>' + sec('Table ke neeche ke kaam', 'Fayda turant milta hai, par daag aur case ka jokhim hai.') + itemRows('tact');
}
// ---------- volunteers ----------
var RECRUIT = [['Gali-gali sampark abhiyan', 5], ['College aur campus abhiyan', 12], ['Gaon-gaon shivir', 25]];
function sh_vol() {
    var v = H.vol, ina = v.total - v.active;
    var h = '<div class="ch-grid2" style="margin:14px 0"><div class="ch-card"><small style="color:var(--mu)">Kul karyakarta</small><div class="ch-big">' + v.total + '</div></div><div class="ch-card"><small style="color:var(--mu)">Abhi active</small><div class="ch-big" style="color:var(--jade)">' + v.active + '</div></div></div>' +
        gauge('Active karyakarta ka hissa', v.total ? v.active / v.total * 100 : 0, 'var(--jade)', null, ina + ' karyakarta abhi niskriya. Event karao ya prashikshan do.');
    h += sec('Karyakarta jodo', 'Jitne zyada active karyakarta, utna bada fayda. Har active karyakarta ka roz thoda bhatta lagta hai.');
    RECRUIT.forEach(function (r, i) { h += row(E(r[0]), 'Lagbhag ' + Math.round(r[1] * 8) + ' se ' + Math.round(r[1] * 14) + ' naye karyakarta', btn('Lagao ' + r[1] + ' Cr', 'recruit', i)); });
    h += row('Prashikshan shivir', 'Niskriya karyakarta ko dobara jodo (ek baar mein 25% tak)', btn('Lagao 4 Cr', 'train', null, '', ina <= 0));
    h += sec('Pramukh karyakarta');
    h += v.roster.length ? v.roster.slice(0, 12).map(function (r) { return row(E(r.n), E(r.a), '<span class="ch-p ' + (r.on ? 'up' : 'dn') + '">' + (r.on ? 'Active' : 'Niskriya') + '</span>'); }).join('') : empty('Abhi koi karyakarta nahi. Upar se abhiyan shuru karo.');
    return h;
}
// ---------- wings ----------
function sh_wings() {
    H.wingHead = H.wingHead || {};
    return sec('Party ke morche', 'Har morcha apne vargh mein party ki pakad badhata hai. Level 5 tak.') + WINGS.map(function (w) {
        var l = H.wings[w.id] || 0, cost = wingCost(l);
        var pills = (l ? '<span class="ch-p up">Level ' + l + ' / 5</span><span class="ch-p">Pramukh ' + E(H.wingHead[w.id] || '') + '</span>' : '<span class="ch-p">Abhi nahi bana</span>') + (l < 5 ? costPill(cost) : '<span class="ch-p up">Poora taiyar</span>');
        return row(E(w.n), E(w.d), btn(l ? 'Majboot karo' : 'Banao', 'wing', w.id, '', l >= 5), pills);
    }).join('');
}
function wingCost(l) { return Math.round(4 * Math.pow(l + 1, 1.5) * 10) / 10; }
// ---------- high command ----------
function sh_cmd() {
    return sec('Party ka top leadership', 'Pad ke saamne naam likho aur "Badlo" dabao. Khaali chhodoge to party khud naam rakh degi.') +
        row(E(C.name), E(H.leader.title), '<span class="ch-star">Shikhar</span>') +
        core.POSTS.filter(function (p) { return !p[2]; }).map(function (p, i) {
            var idx = core.POSTS.indexOf(p), v = C.posts[p[0]] || '';
            return '<div class="ch-r"><div class="ch-rm"><div class="ch-rt"><small style="margin:0 0 4px">' + E(p[0]) + (p[1] ? ' (zaroori)' : '') + '</small><input id="ch-po-' + idx + '" class="ch-in" value="' + E(v) + '" placeholder="Naam"></div><div class="ch-rr" style="align-self:flex-end">' + btn('Badlo', 'post', idx, 'sm') + btn('Auto', 'postAuto', idx, 'gh sm') + '</div></div></div>';
        }).join('');
}
// ---------- tickets ----------
function ticketCap() { return 4 + Math.floor(H.pow / 6) + Math.floor(C.res.strength / 10); }
function seatOptions(kind, state) {
    var out = [];
    try {
        if (kind === 'MLA') { var d = assemblyData[state]; if (d) d.features.forEach(function (f) { out.push(f.properties.no + '. ' + f.properties.nm); }); }
        else { var sn = core.lsStateName(state), seen = {}; indiaData.features.forEach(function (f) { var p = f.properties; if (p.st_name === sn && !seen[p.pc_name]) { seen[p.pc_name] = 1; out.push(p.pc_name); } }); }
    } catch (e) {}
    return out;
}
function sh_tickets() {
    var f = S.form.t = S.form.t || { kind: 'MLA', state: C.state };
    var seats = seatOptions(f.kind, f.state);
    var h = '<div class="ch-kv" style="margin:14px 0 2px"><span>Diye gaye ticket</span><b>' + H.tickets.length + ' / ' + ticketCap() + '</b></div>' + noteBox('Jis state ka chunav ladoge, wahan ke ticket-holder apne aap party ke VIP ummeedwar ban kar ladte hain. Seat: kisi ek seat ka naam chuno.');
    h += '<div class="ch-f two"><div><label>Chunav</label><select class="ch-in" data-c="tf" data-x="kind"><option value="MLA"' + (f.kind === 'MLA' ? ' selected' : '') + '>Vidhan sabha (MLA)</option><option value="MP"' + (f.kind === 'MP' ? ' selected' : '') + '>Lok sabha (MP)</option></select></div>' +
        '<div><label>State</label><select class="ch-in" data-c="tf" data-x="state">' + core.STATES.map(function (s) { return '<option' + (s === f.state ? ' selected' : '') + '>' + E(s) + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="ch-f two"><div><label>Seat</label>' + (seats.length ? '<select id="ch-ts" class="ch-in">' + seats.map(function (s) { return '<option>' + E(s) + '</option>'; }).join('') + '</select>' : '<input id="ch-ts" class="ch-in" placeholder="Seat ka naam">') + '</div>' +
        '<div><label>Ummeedwar ka naam</label><input id="ch-tn" class="ch-in" placeholder="Khaali = auto naam"></div></div>' +
        '<div class="ch-rr" style="justify-content:flex-start">' + btn('Ticket do (' + (f.kind === 'MLA' ? 1 : 3) + ' Cr)', 'ticket', null, '', H.tickets.length >= ticketCap()) + '</div>';
    h += sec('Ticket paaye ummeedwar');
    h += H.tickets.length ? H.tickets.map(function (t) {
        return row(E(t.name) + (t.strong ? ' <small style="display:inline;color:var(--ver)">dabang</small>' : ''), E(t.state) + ', ' + (t.kind === 'MLA' ? 'Vidhan sabha' : 'Lok sabha') + ': ' + E(t.seat || 'koi bhi seat'), btn('Ticket wapas', 'unticket', t.id, 'gh sm'), '<span class="ch-star">' + '&#9733;'.repeat(Math.max(1, Math.round(t.q / 20))) + '</span>');
    }).join('') : empty('Abhi kisi ko ticket nahi diya.');
    return h;
}
// ---------- connections ----------
var CONN_TABS = [['party', 'Partiyan'], ['judge', 'Judge'], ['dm', 'DM'], ['sp', 'SP'], ['pmem', 'Netaon se'], ['media', 'Media'], ['ec', 'Chunav Aayog']];
var CONN_INFO = {
    party: ['Doosre dalon se rishta. Kareebi dal se baat banna asaan hai, virodhi se nahi.', 4, { rep: 2 }],
    ec: ['Chunav aayukt ko bada paisa dekar saath lo. Chunav se pehle yahin se active karna padta hai.', 8, { pow: 1, rep: 0 }],
    judge: ['Judge se rishta. Court ke case jeetne ki sambhavna badhti hai.', 6, { pow: 1, rep: 1 }],
    dm: ['Zila Magistrate se rishta. Chunav mein prashasnik madad.', 3, { pow: 2 }],
    sp: ['Police Adheekshak se rishta. Zile mein kanoon-vyavastha aur chunav mein madad.', 3, { pow: 2 }],
    pmem: ['Doosre dal ke naraaz netaon se rishta. Bharosa jama to unhe apne dal mein la sakte hain.', 4, { pow: 2 }],
    media: ['Sampadak aur patrakar se rishta. Roz thodi popularity.', 3, { pop: 2, rep: 1 }]
};
function hearts(l) { return '<span class="ch-hearts">' + '&#9829;'.repeat(l) + '&#9825;'.repeat(3 - l) + '</span>'; }
var JUDGE_COST = 90, EC_COST = 180;
function ecState() { H.ec = H.ec || { hired: false, active: false }; return H.ec; }
function judgeCard() {
    return '<div class="ch-card" style="margin:12px 0;padding:14px"><b>Judge ko khareedo (bada sauda)</b><p class="ch-sb" style="margin:6px 0">Ek baar bhari rakam dekar judge ko apne paksh mein kar lo. Phir Lok Sabha / State chunav mein aapki party ke court case aasani se jeetenge, chahe aap doshi hon.</p>' +
        (H.judgeBought ? '<span class="ch-cd">Judge aapke saath hai</span>' : btn('Judge ko khareedo (' + JUDGE_COST + ' Cr)', 'buyJudge')) + '</div>';
}
function ecSheet() {
    var e = ecState();
    return '<div class="ch-card" style="margin:12px 0;padding:14px"><b>Chunav Aayukt ko saath lo</b><p class="ch-sb" style="margin:6px 0">Bada paisa dekar chunav aayukt ko hire karo. Chunav ladne se pehle yahan se <b>ACTIVE</b> karna hoga. Active hone par kam se kam 10% seat par bina kuch kiye fayda milta hai, aur aapke khilaf EC mein shikayat bhi nahi tikti. <b>Lekin</b> agar aap sarkar banate ho to sarkar ki popularity aur saakh kam se kam 20% kam rahegi.</p>' +
        (e.hired ? '<div style="margin:8px 0"><span class="ch-cd">' + (e.active ? 'ACTIVE: agla chunav mein fayda milega' : 'Hire hai, par abhi band') + '</span></div>' + btn(e.active ? 'Band karo' : 'ACTIVE karo', 'ecToggle') : btn('Chunav aayukt ko hire karo (' + EC_COST + ' Cr)', 'buyEC')) + '</div>';
}
function perks() {
    if (!ensure()) return {};
    var e = ecState();
    return { consult: CONS.some(function (c) { return (H.consult[c.id] || 0) > H.t; }), judge: !!H.judgeBought, ecHired: !!e.hired, ecActive: !!(e.hired && e.active) };
}
function allTickets() { return ensure() ? (H.tickets || []) : []; }
function sh_conn() {
    var t = S.tab.conn || 'party', inf = CONN_INFO[t], h = seg(CONN_TABS, t, 'tab') + noteBox(inf[0]);
    if (t === 'ec') return h + ecSheet();
    if (t === 'judge') h += judgeCard();
    if (t === 'party') {
        h += core.allParties().map(function (p) {
            var lv = C.conn[p.n] || 0, opp = C.opp.indexOf(p.n) >= 0, ally = C.allies.indexOf(p.n) >= 0, k = 'conn:party:' + p.n, l = cdLeft(k);
            return row(E(p.n), (opp ? 'Virodhi' : (ally ? 'Kareebi' : 'Tatastha')) + ' ' + '', l > 0 ? '<span class="ch-cd">' + hrs(l) + ' baad</span>' : btn(lv >= 3 ? 'Pakka' : 'Mulaqat (4 Cr)', 'meet', 'party', 'gh sm', opp || lv >= 3, p.n), hearts(lv));
        }).join('');
        return h;
    }
    h += (H.contacts[t] || []).map(function (c) {
        var k = 'conn:' + c.id, l = cdLeft(k), extra = '';
        if (t === 'pmem' && c.lv >= 2) extra = btn('Apne dal mein lao (8 Cr)', 'defect', c.id, 'gr sm');
        return row(E(c.n), E(c.role), l > 0 ? '<span class="ch-cd">' + hrs(l) + ' baad</span>' : btn(c.lv >= 3 ? 'Pakka' : 'Mulaqat (' + inf[1] + ' Cr)', 'meet', t, 'gh sm', c.lv >= 3, c.id), hearts(c.lv) + extra);
    }).join('');
    return h;
}
// ---------- court ----------
function sh_court() {
    var pend = H.cases.filter(function (c) { return c.st === 'pending'; }), done = H.cases.filter(function (c) { return c.st !== 'pending'; }).slice(0, 6);
    var parties = core.allParties();
    var h = sec('Kisi party par case karo', 'Jeete to reputation, popularity aur power teeno badhte hain. Haare to fees bhi gayi aur chhavi bhi.');
    h += '<div class="ch-f"><div><label>Kis par</label><select id="ch-ct" class="ch-in">' + parties.map(function (p) { return '<option>' + E(p.n) + '</option>'; }).join('') + '</select></div>' +
        '<div><label>Aarop</label><select id="ch-cp" class="ch-in">' + CASE_TOPICS.map(function (t, i) { return '<option value="' + i + '">' + t[0] + '</option>'; }).join('') + '</select></div>' +
        '<div><label>Vakil</label><select id="ch-cl" class="ch-in">' + LAWYERS.map(function (l, i) { return '<option value="' + i + '">' + l[0] + ' (' + l[1] + ' Cr, faisla ' + l[3] + ' ghante mein)</option>'; }).join('') + '</select></div></div>' +
        '<div class="ch-rr" style="justify-content:flex-start">' + btn('Case dayar karo', 'caseNew') + '</div>';
    h += sec('Chal rahe case');
    h += pend.length ? pend.map(function (c) {
        var left = c.due - H.t;
        if (c.kind === 'for') return row(E(c.title), 'Aapne dayar kiya. Vakil: ' + LAWYERS[c.lawyer][0], '<span class="ch-cd">Faisla ' + hrs(left) + ' mein</span>');
        var body = c.lawyer != null ? '<span class="ch-p up">Vakil: ' + LAWYERS[c.lawyer][0] + '</span>' : '<span class="ch-p dn">Vakil nahi. Bina vakil haarne ka khatra bada hai.</span>' + LAWYERS.map(function (l, i) { return btn(l[0].split(' ')[0] + ' (' + l[1] + ' Cr)', 'caseLawyer', c.id, 'gh sm', false, i); }).join('');
        return row(E(c.title), 'Aap par case. Sakhti ' + c.sev + ' / 3', '<span class="ch-cd">Faisla ' + hrs(left) + ' mein</span>', body);
    }).join('') : empty('Koi case nahi chal raha.');
    if (done.length) h += sec('Pichhle faisle') + done.map(function (c) { return row(E(c.title), c.kind === 'for' ? 'Aapka case' : 'Aap par case', '<span class="ch-p ' + (c.st === 'won' ? 'up' : 'dn') + '">' + (c.st === 'won' ? 'Jeet' : 'Haar') + '</span>'); }).join('');
    return h;
}
// ---------- crisis ----------
function sh_crisis() {
    var c = H.crisis, h = '';
    if (c && !c.done) {
        h += '<div class="ch-card" style="margin:14px 0;border-color:var(--ver)"><b style="font-size:17px">' + E(c.title) + '</b><small style="display:block;color:var(--mu);margin-top:3px">' + E(c.d) + '</small><div class="ch-cd" style="margin-top:10px;display:inline-block">Jawab dene ke ' + hrs(c.due - H.t) + ' bache hain</div></div>';
        h += sec('Party kya karegi?') + CRISIS_RESP.map(function (r) {
            var g = r.needVol && H.vol.active < r.needVol ? r.needVol + '+ active karyakarta chahiye' : '';
            return row(E(r.n), '', btn('Karo', 'crisis', r.id, r.id === 'ignore' ? 'gh' : '', !!g), costPill(r.cost) + fx(r.eff) + (g ? '<span class="ch-p dn">' + g + '</span>' : ''));
        }).join('');
    } else h += '<div class="ch-card" style="margin:14px 0"><b>Abhi sab shaant hai</b><small style="display:block;color:var(--mu)">Kahin bhi sankat aa sakta hai. Jab aayega, yahan khabar aur jawab ke vikalp dikhenge.</small></div>' + (c ? '<div class="ch-kv"><span>Pichhla sankat</span><b>' + E(c.title) + '</b></div>' : '');
    h += noteBox('Sankat ke samay madad karne se popularity aur reputation dono badhte hain. Chup rehne par janta naraaz hoti hai. Ab tak ' + H.crisisCount + ' sankat aaye.');
    return h;
}
// ---------- manifesto ----------
function planHas(t) { return H.plan.some(function (p) { return p.t === t; }); }
function sh_manif() {
    var jn = H.plan.filter(function (p) { return p.k === 'j'; }).length;
    var h = sec('Aapka ghoshna patra (' + H.plan.length + ' / 12)', 'Vaade se reputation badhti hai. Jumle se popularity turant badhti hai, par janta baad mein hisaab maangti hai.');
    h += H.plan.length ? H.plan.map(function (p) { return row(E(p.t), '', '<span class="ch-p ' + (p.k === 'j' ? 'rk' : 'up') + '">' + (p.k === 'j' ? 'Jumla' : 'Vaada') + '</span>' + btn('Hatao', 'planDel', p.id, 'gh sm')); }).join('') : empty('Abhi kuch likha nahi. Neeche se jodo ya khud likho.');
    h += '<div class="ch-rr" style="justify-content:flex-start;margin-top:8px">' + btn('Ghoshna patra jaari karo (5 Cr)', 'planRelease', null, '', H.plan.length < 3) + (cdLeft('release') > 0 ? '<span class="ch-cd">' + hrs(cdLeft('release')) + ' baad</span>' : '') + '</div>';
    h += noteBox('Jaari karne ke liye kam se kam 3 vaade chahiye. ' + (jn ? jn + ' jumla hone se baad mein sawal uthne ka khatra hai.' : ''));
    h += sec('Khud likho');
    h += '<div class="ch-f"><textarea id="ch-pl" class="ch-in" placeholder="Apna vaada ya jumla likho"></textarea></div><div class="ch-rr" style="justify-content:flex-start">' + btn('Vaada jodo', 'planAdd', 'v', '', H.plan.length >= 12) + btn('Jumla jodo', 'planAdd', 'j', 'gh', H.plan.length >= 12) + '</div>';
    h += sec('Party ke taiyar vaade');
    h += MANIFESTO_OWN.map(function (t, i) { return row(E(t), '', btn('Jodo', 'planLib', 'v:' + i, 'gh sm', planHas(t) || H.plan.length >= 12)); }).join('');
    h += sec('Mashhoor jumle', 'Ye wahi naare hain jo chunav mein aksar sunai dete hain.');
    h += JUMLAS.map(function (t, i) { return row(E(t), '', btn('Jodo', 'planLib', 'j:' + i, 'gh sm', planHas(t) || H.plan.length >= 12)); }).join('');
    return h;
}
// ---------- debate ----------
function sh_debate() {
    var h = sec('Aapke pravakta', 'Pravakta ko roz vetan dena padta hai. Zyada kushal pravakta zyada mehnga.');
    h += H.spokes.length ? H.spokes.map(function (s) { return row(E(s.n), 'Kushalta ' + s.skill + ' / 100', btn('Nikalo', 'spokeFire', s.id, 'gh sm'), '<span class="ch-p">Vetan ' + s.fee + ' Cr/din</span>'); }).join('') : empty('Abhi koi pravakta nahi.');
    if (H.spokes.length) {
        var l = cdLeft('debate');
        h += sec('Debate mein bhejo') + '<div class="ch-f two"><div><label>Mudda</label><select id="ch-dt" class="ch-in">' + DEBATE_TOPICS.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div>' +
            '<div><label>Pravakta</label><select id="ch-dp" class="ch-in">' + H.spokes.map(function (s) { return '<option value="' + s.id + '">' + E(s.n) + ' (' + s.skill + ')</option>'; }).join('') + '</select></div></div>' +
            '<div class="ch-rr" style="justify-content:flex-start">' + (l > 0 ? '<span class="ch-cd">' + hrs(l) + ' baad</span>' : btn('Debate karao (1 Cr)', 'debateGo')) + '</div>';
    }
    h += sec('Hire karne ke liye pravakta', 'Ek saath 4 tak.');
    h += H.spokePool.map(function (s) { return row(E(s.n), 'Kushalta ' + s.skill + ' / 100', btn('Hire karo', 'spokeHire', s.id, '', H.spokes.length >= 4), costPill(s.join) + '<span class="ch-p">Vetan ' + s.fee + ' Cr/din</span>'); }).join('');
    return h;
}
// ---------- strongmen ----------
function sh_strong() {
    var con = H.strong.length, neta = H.strong.filter(function (s) { return s.neta; }).length;
    var h = '<div class="ch-grid2" style="margin:14px 0"><div class="ch-card"><small style="color:var(--mu)">Judav</small><div class="ch-big">' + con + '</div></div><div class="ch-card"><small style="color:var(--mu)">Neta banaye gaye</small><div class="ch-big" style="color:var(--ver)">' + neta + '</div></div></div>' +
        noteBox('Chunav mein bahut madad, par reputation girti hai aur kanooni case aur sting ka khatra badhta hai.');
    h += sec('Judav ke vyakti');
    h += con ? H.strong.map(function (s) {
        return row(E(s.n), E(s.kind) + ', prabhav ' + s.fame, s.neta ? '<span class="ch-p dn">Neta bane, ' + E(s.state) + '</span>' : btn('Neta banao (10 Cr)', 'strongNeta', s.id, 'dg sm'));
    }).join('') : empty('Abhi kisi se judav nahi.');
    if (con - neta > 0) h += '<div class="ch-f" style="margin-top:8px"><label>Kis state se chunav ladwana hai</label><select id="ch-bs" class="ch-in">' + core.STATES.map(function (s) { return '<option' + (s === C.state ? ' selected' : '') + '>' + E(s) + '</option>'; }).join('') + '</select></div>';
    h += sec('Sampark badhao');
    h += H.strongPool.map(function (s) { return row(E(s.n), E(s.kind) + ', prabhav ' + s.fame, btn('Sampark (5 Cr)', 'strongMeet', s.id, 'gh sm', H.strong.length >= 6)); }).join('');
    return h;
}
function sh_evm() { return lockBox('EVM ka section abhi band hai. Iske niyam baad mein tay honge. Party bahut badi hone par ye khulega.') + noteBox('Abhi yahan kuch karne ko nahi hai.'); }

// ---------- chunav aur upalabdhiyan (purane screen ka hi istemal) ----------
function sh_elect() {
    var opts = core.stateOptions(), played = {};
    (C.played || []).forEach(function (x) { if (x.k === 'state') played[x.state] = x; });
    var h = sec('Seedhe kisi state ka chunav ladein', 'State chuno aur seedha war-room mein jao. Gathbandhan aur kathinai wahin chunoge. Natija, jeeti seat aur sarkar apne aap career mein darj hongi.');
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:14px">' + opts.map(function (st) {
        var n = core.VS_SEATS[st] || 0, mine = C.mla.filter(function (x) { return x.state === st; }).length, p = played[core.lsStateName(st)] || played[st];
        return '<button class="ch-card" data-a="fightState" data-x="' + E(st) + '" style="text-align:left;padding:10px"><b style="display:block">' + E(st) + '</b><small style="display:block;color:var(--mu)">' + n + ' seat | ' + mine + ' aapke MLA' + (C.govStates.indexOf(st) >= 0 ? ' | sarkar' : '') + '</small><em style="font-style:normal;color:var(--gold);font-size:12px">' + (p ? 'Pichhli baar: ' + p.seats + ' seat' : 'Chunav ladein') + ' &rsaquo;</em></button>';
    }).join('') + '</div>';
    h += noteBox('Lok Sabha ka war-room Dashboard se kholo aur wahan apni hi party chuno, to uska natija bhi yahin darj ho jayega.');
    h += sec('Lok Sabha aur quick chunav', 'Seat sankhya chuno, kharch dekho aur auto-chunav karo.') + '<div class="ch-old">' + core.tabOverview() + '</div>';
    return h;
}
function sh_ach() { return '<div class="ch-old">' + core.tabAch() + '</div>'; }

// =============================================================
//  SECTION LIST
// =============================================================
var MODS = [
    { g: 'paisa', id: 'src', n: 'Sources aur chanda', ic: 'coin', sub: 'Chanda, crowdfunding, karz', st: function () { return H.loans.length ? H.loans.length + ' karz, ' + fm(loansOwed()) + ' Cr baaki' : 'Chanda, crowdfunding aur karz'; }, alert: function () { return H.loans.some(function (l) { return H.t > l.due; }); }, body: sh_src },
    { g: 'paisa', id: 'invest', n: 'Investment', ic: 'invest', sub: 'Paisa lagao, kamai badhao', st: function () { return H.invest.length ? fm(investTotal()) + ' Cr lagaye hain' : 'Bond, share, zameen'; }, body: sh_invest },
    { g: 'paisa', id: 'cons', n: 'Consultancy', ic: 'cons', sub: 'Chunav salahkar agency', st: function () { var n = CONS.filter(function (c) { return H.consult[c.id] > H.t; }).length; return n ? n + ' agency kaam kar rahi' : 'Koi agency hire nahi'; }, body: sh_cons },
    { g: 'chhavi', id: 'it', n: 'Social media aur IT cell', ic: 'social', sub: 'Narrative ki ladai', st: function () { return H.it.on ? 'Chalu, ' + hrs(H.it.until - H.t) + ' baaki' : 'Band'; }, body: sh_it },
    { g: 'chhavi', id: 'media', n: 'Media', ic: 'media', sub: 'Akhbar aur channel', st: function () { var n = MEDIA.filter(function (c) { return H.media[c.id] > H.t; }).length; return n ? n + ' media saath mein' : 'Chhote se bade tak'; }, body: sh_media },
    { g: 'chhavi', id: 'debate', n: 'Pravakta aur debate', ic: 'debate', sub: 'TV debate', st: function () { return H.spokes.length ? H.spokes.length + ' pravakta' : 'Pravakta hire karo'; }, body: sh_debate },
    { g: 'chhavi', id: 'symp', n: 'Sympathy wave', ic: 'heart', sub: 'Hamdardi ki lahar', st: function () { return 'Lahar ' + Math.round(H.wave) + '%'; }, body: sh_symp },
    { g: 'chhavi', id: 'manif', n: 'Manifesto aur jumla', ic: 'manif', sub: 'Ghoshna patra', st: function () { var j = H.plan.filter(function (p) { return p.k === 'j'; }).length; return H.plan.length + ' vaade, ' + j + ' jumle'; }, body: sh_manif },
    { g: 'chhavi', id: 'org', n: 'Organise', ic: 'org', sub: 'Andolan aur rally', st: function () { return 'Dharna se maha-rally tak'; }, body: sh_org },
    { g: 'sang', id: 'cmd', n: 'High command', ic: 'cmd', sub: 'Top leadership', st: function () { var n = core.POSTS.filter(function (p) { return p[2] || C.posts[p[0]]; }).length; return n + ' pad bhare hain'; }, body: sh_cmd },
    { g: 'sang', id: 'tickets', n: 'Members aur ticket', ic: 'ticket', sub: 'Ticket baanto', st: function () { return H.tickets.length ? H.tickets.length + ' ummeedwar taiyar' : 'Ticket do, VIP ummeedwar banao'; }, body: sh_tickets },
    { g: 'sang', id: 'vol', n: 'Karyakarta', ic: 'vol', sub: 'Volunteers', st: function () { return H.vol.active + ' active, ' + H.vol.total + ' kul'; }, body: sh_vol },
    { g: 'sang', id: 'wings', n: 'Morche aur wings', ic: 'wing', sub: 'Yuva, mahila, kisan', st: function () { var n = WINGS.filter(function (w) { return H.wings[w.id]; }).length; return n ? n + ' morche bane' : 'Koi morcha nahi'; }, body: sh_wings },
    { g: 'sang', id: 'conn', n: 'Sampark', ic: 'conn', sub: 'Rishte banao', st: function () { return 'Judge, DM, SP, dal, media'; }, body: sh_conn },
    { g: 'kanoon', id: 'court', n: 'Supreme Court', ic: 'court', sub: 'Case ladna', st: function () { var n = H.cases.filter(function (c) { return c.st === 'pending'; }).length; return n ? n + ' case chal rahe' : 'Koi case nahi'; }, alert: function () { return H.cases.some(function (c) { return c.st === 'pending' && c.kind === 'against' && c.lawyer == null; }); }, body: sh_court },
    { g: 'kanoon', id: 'crisis', n: 'Sankat prabandhan', ic: 'crisis', sub: 'Aapda aur sankat', st: function () { return H.crisis && !H.crisis.done ? E(H.crisis.title) : 'Abhi sab shaant'; }, alert: function () { return !!(H.crisis && !H.crisis.done); }, body: sh_crisis },
    { g: 'parda', id: 'tact', n: 'Table ke neeche ke daanv', ic: 'tact', sub: 'Jokhim bhare kaam', st: function () { return 'Pakde jaane ka dar ' + Math.round(H.heat) + '%'; }, alert: function () { return H.heat > 60; }, body: sh_tact },
    { g: 'parda', id: 'strong', n: 'Bahubali aur mafia', ic: 'mafia', sub: 'Dabang logon se judav', st: function () { return H.strong.length + ' judav, ' + H.strong.filter(function (s) { return s.neta; }).length + ' neta bane'; }, body: sh_strong },
    { g: 'parda', id: 'evm', n: 'EVM', ic: 'evm', sub: 'Abhi band', st: function () { return 'Abhi band'; }, locked: function () { return 'band'; }, body: sh_evm }
];
var SHEETS = {};
MODS.forEach(function (m) { SHEETS[m.id] = { n: m.n, sub: function () { return m.sub; }, body: m.body }; });
SHEETS.leader = { n: 'Neta ka profile', sub: function () { return 'Party ke sansthapak'; }, body: sh_leader };
SHEETS.press = { n: 'Press conference', sub: function () { return 'Media ke saamne baat rakho'; }, body: sh_press };
SHEETS.khata = { n: 'Party fund aur sampatti', sub: function () { return clockText(); }, body: sh_khata };
SHEETS.elect = { n: 'Chunav ladein', sub: function () { return 'Seedhi ka agla kadam'; }, body: sh_elect };
SHEETS.ach = { n: 'Upalabdhiyan', sub: function () { return 'Badge, seat aur itihas'; }, body: sh_ach };

// =============================================================
//  CAREER HOME (pehla page): neta ka pad, sansad, sarkar, aur "Hamari Party"
// =============================================================
function leaderPost() {
    var o = C.own;
    if (!o) { if (C.mla.length) o = { type: 'MLA', seat: C.mla[0].seat, state: C.mla[0].state }; else if (C.mp.length) o = { type: 'MP', seat: C.mp[0].seat, state: C.mp[0].state }; }
    if (C.pm) return { t: 'Pradhanmantri', s: 'Kendra mein aapki sarkar hai' };
    if (o && o.type === 'MLA') {
        if (C.govStates.indexOf(o.state) >= 0) return { t: 'Mukhyamantri, ' + o.state, s: o.seat + ' se vidhayak' };
        return { t: 'Vidhayak (MLA)', s: o.seat + ', ' + o.state };
    }
    if (o && o.type === 'MP') return { t: 'Saansad (MP)', s: o.seat + ', ' + o.state };
    return { t: 'Koi pad nahi', s: 'Abhi koi chunav nahi jeeta' };
}
function hemi(total, mine, col, label) {
    total = Math.max(1, Math.round(total)); mine = clamp(Math.round(mine), 0, total);
    var rows = clamp(Math.round(Math.sqrt(total / 4)), 3, 13), R = 96, r0 = 40, sp = (R - r0) / (rows - 1), rad = Math.min(sp * .4, 3.4), rs = [], sumR = 0, i;
    for (i = 0; i < rows; i++) { var r = r0 + sp * i; rs.push(r); sumR += r; }
    var cnt = rs.map(function (r) { return Math.max(1, Math.round(total * r / sumR)); });
    cnt[rows - 1] += total - sum(cnt, function (x) { return x; }); if (cnt[rows - 1] < 1) cnt[rows - 1] = 1;
    var dots = [];
    rs.forEach(function (r, ri) { var n = cnt[ri]; for (var k = 0; k < n; k++) { var a = Math.PI * (1 - (k + .5) / n); dots.push({ x: 100 + r * Math.cos(a), y: 100 - r * Math.sin(a), a: a, r: r }); } });
    dots.sort(function (p, q) { return (q.a - p.a) || (p.r - q.r); });
    var o = '<svg class="ch-hm" viewBox="0 0 200 104" role="img" aria-label="' + E(label) + '">';
    dots.forEach(function (d, i) { o += '<circle cx="' + d.x.toFixed(1) + '" cy="' + d.y.toFixed(1) + '" r="' + (i < mine ? (rad + .5).toFixed(1) : rad.toFixed(1)) + '"' + (i < mine ? ' fill="' + col + '"' : ' class="o"') + '/>'; });
    return o + '</svg>';
}
function govHome() {
    var gs = C.govStates || [];
    if (!gs.length) return '';
    return '<section class="ch-hc"><h3>Aapki sarkarein<small>' + gs.length + ' rajya</small></h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin-top:10px">' + gs.map(function (st) {
        var g = core.govFor(st), own = C.mla.filter(function (x) { return x.state === st; }).length;
        return '<button class="ch-card" data-a="govOpen" data-x="' + E(st) + '" style="text-align:left;padding:12px"><b style="display:block;font-size:1.05rem">' + E(st) + '</b><small style="display:block;color:var(--mu)">CM: ' + E(g.cm || '-') + '</small><small style="display:block;color:var(--mu)">' + own + ' aapke vidhayak</small><em style="font-style:normal;color:var(--gold);font-size:12px">Sarkar ki jankari &rsaquo;</em></button>';
    }).join('') + '</div></section>';
}
var GOV_MINS = ['Mukhyamantri (Grih)', 'Upmukhyamantri', 'Vitt', 'Swasthya', 'Shiksha', 'Krishi', 'Sadak Nirman (PWD)', 'Urja', 'Rajasva', 'Nagar Vikas', 'Gramin Vikas', 'Parivahan', 'Samaj Kalyan', 'Udyog', 'Jal Shakti', 'Van evam Paryavaran', 'Mahila evam Bal Vikas', 'Khel evam Yuva Kalyan', 'Panchayati Raj', 'Mantri'];
var CHGOV = window.CHGOV = {
    st: null,
    g: function () { return core.govFor(CHGOV.st); },
    redraw: function () { var d = document.getElementById('ch-govmodal'); if (d) drawGov(d); },
    name: function (i, v) { var g = CHGOV.g(); v = String(v || '').trim(); if (v) g.cabinet[i].name = v; if (i === 0) g.cm = g.cabinet[0].name; core.save(); },
    min: function (i, v) { CHGOV.g().cabinet[i].min = v; core.save(); },
    cm: function (i) { var g = CHGOV.g(), a = g.cabinet[0], b = g.cabinet[i], tn = a.name, tp = a.party; a.name = b.name; a.party = b.party; b.name = tn; b.party = tp; g.cm = a.name; g.cmParty = a.party; core.save(); CHGOV.redraw(); },
    del: function (i) { CHGOV.g().cabinet.splice(i, 1); core.save(); CHGOV.redraw(); },
    add: function () { CHGOV.g().cabinet.push({ min: 'Mantri', name: (typeof randName === 'function' ? randName() : 'Naya Mantri'), party: C.party.name }); core.save(); CHGOV.redraw(); },
    close: function () { var d = document.getElementById('ch-govmodal'); if (d) d.remove(); try { render(); } catch (e) {} }
};
function drawGov(d) {
    var st = CHGOV.st, g = core.govFor(st), cab = g.cabinet || [];
    var rows = cab.map(function (c, i) {
        var fx = i === 0, opts = GOV_MINS.filter(function (m) { return fx ? m === 'Mukhyamantri (Grih)' : m !== 'Mukhyamantri (Grih)'; }).map(function (m) { return '<option' + (m === c.min ? ' selected' : '') + '>' + E(m) + '</option>'; }).join('');
        return '<div class="cg-r" style="animation-delay:' + (i * 0.03) + 's"><input value="' + E(c.name) + '" onchange="CHGOV.name(' + i + ',this.value)"><select onchange="CHGOV.min(' + i + ',this.value)"' + (fx ? ' disabled' : '') + '>' + opts + '</select>' +
            '<button title="Isko CM banao" onclick="CHGOV.cm(' + i + ')"' + (fx ? ' disabled' : '') + '>CM</button>' + (fx ? '<span></span>' : '<button title="Hatao" onclick="CHGOV.del(' + i + ')">&times;</button>') + '</div>';
    }).join('');
    var mood = Object.keys(g.mood || {}).map(function (p) { return '<span class="ch-pill"><small>' + E(p) + '</small>' + E(g.mood[p]) + '</span>'; }).join(' ');
    d.innerHTML = '<div class="cg-box"><div style="display:flex;justify-content:space-between;align-items:center"><div><small style="color:#f0b04a;letter-spacing:2px">SARKAR</small><h2 style="margin:2px 0;font-size:1.6rem">' + E(st) + '</h2><small style="color:var(--mu)">' + E(g.alliance || C.party.name) + (g.cycle != null ? ' | daur ' + g.cycle : '') + '</small></div><button onclick="CHGOV.close()" style="background:none;border:0;color:#94a3b8;font-size:1.6rem;cursor:pointer">&times;</button></div>' +
        '<div class="cg-cm"><small style="color:#f0b04a;letter-spacing:2px">MUKHYAMANTRI</small><div style="font-size:1.35rem;font-weight:800">' + E((cab[0] || {}).name || g.cm) + '</div><small style="color:var(--mu)">' + E((cab[0] || {}).party || g.cmParty || '') + '</small></div>' +
        '<div style="color:var(--mu);font-size:.8rem;margin:8px 0">Naam likhkar badlo, vibhag chuno, ya "CM" dabakar kisi ko Mukhyamantri banao.</div>' + rows +
        '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="ch-b" onclick="CHGOV.add()">+ Mantri jodo</button><button class="ch-b gh" onclick="CHGOV.close()">Band karo</button></div>' + (mood ? '<div style="margin-top:12px">' + mood + '</div>' : '') + '</div>';
}
function showGov(st) {
    var old = document.getElementById('ch-govmodal'); if (old) old.remove();
    CHGOV.st = st; core.govFor(st);
    var d = document.createElement('div'); d.id = 'ch-govmodal';
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(3,10,14,.85);display:flex;align-items:center;justify-content:center;padding:14px';
    d.addEventListener('click', function (e) { if (e.target === d) CHGOV.close(); });
    drawGov(d); document.body.appendChild(d);
}
function vsCards() {
    var states = [C.state];
    C.mla.forEach(function (x) { if (states.indexOf(x.state) < 0) states.push(x.state); });
    (C.govStates || []).forEach(function (x) { if (states.indexOf(x) < 0) states.push(x); });
    var pc = core.myCol();
    return states.map(function (st, k) {
        var tot = core.VS_SEATS[st] || core.VS_SEATS[core.lsStateName(st)] || 100, mine = C.mla.filter(function (x) { return x.state === st; }).length, isG = (C.govStates || []).indexOf(st) >= 0;
        return '<section class="ch-hc ch-vs ch-vsx"' + (isG ? ' data-a="govOpen" data-x="' + E(st) + '" style="cursor:pointer;animation-delay:' + (k * 0.08) + 's"' : ' style="animation-delay:' + (k * 0.08) + 's"') + '><h3>Vidhan Sabha, ' + E(st) + '<small>' + tot + ' seat, bahumat ' + (Math.floor(tot / 2) + 1) + '</small></h3><div class="ch-hmw">' + hemi(tot, mine, pc, st + ' vidhan sabha mein ' + mine + ' vidhayak') + '<div class="ch-hmc"><b>' + mine + '</b><small>aapke vidhayak</small></div></div>' +
            '<p class="ch-hnote">' + (isG ? st + ' mein aapki sarkar hai. CM: <b>' + E(core.govFor(st).cm || '-') + '</b>. Sarkar dekhne aur badalne ke liye dabao.' : st + ' mein abhi aapki sarkar nahi hai.') + '</p></section>';
    }).join('');
}
function seatsHome() {
    var o = C.own || {}, os = String(o.seat || '').replace(/^\d+\.\s*/, '');
    function grp(list, label) {
        if (!list.length) return '<p class="ch-hnote" style="text-align:left">Abhi koi ' + label + ' nahi.</p>';
        var by = {}; list.forEach(function (x) { (by[x.state] = by[x.state] || []).push(x); });
        return Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; }).map(function (st) {
            return '<p class="ch-hnote" style="text-align:left;margin:8px 0"><b style="color:var(--tx)">' + E(st) + ' (' + by[st].length + ')</b><br>' + by[st].map(function (x) { return E(x.seat) + (o.state === st && os === x.seat ? ' &#9733;' : ''); }).join(', ') + '</p>';
        }).join('');
    }
    return '<section class="ch-hc"><h3>Jeeti hui seats<small>' + C.mla.length + ' MLA, ' + C.mp.length + ' MP</small></h3><div style="color:var(--mu);font-size:12px;margin-top:6px">VIDHAYAK</div>' + grp(C.mla, 'vidhayak') + '<div style="color:var(--mu);font-size:12px;margin-top:10px">SAANSAD</div>' + grp(C.mp, 'saansad') + (o.seat ? '<p class="ch-hnote" style="text-align:left">&#9733; = sansthapak ki apni seat</p>' : '') + '</section>';
}
function homeHtml() {
    var pc = core.myCol(), post = leaderPost(), mp = C.mp.length, mla = C.mla.length, gov = C.govStates, nst = core.STATES.length;
    var lsTotal = 543, home = C.state, vsTotal = core.VS_SEATS[home] || 100, vsMine = C.mla.filter(function (x) { return x.state === home; }).length;
    var alertTxt = (H.crisis && !H.crisis.done) ? 'Sankat chal raha hai: ' + H.crisis.title : (H.cases.some(function (c) { return c.st === 'pending' && c.kind === 'against' && c.lawyer == null; }) ? 'Aap par case hai, vakil chahiye' : (H.loans.some(function (l) { return H.t > l.due; }) ? 'Karz ki kisht chuk gayi' : ''));
    var h = '<div class="ch-root ch-home" style="--pc:' + pc + ';--pcs:' + rgba(pc, .14) + ';--pcm:' + rgba(pc, .55) + '">';
    h += '<header class="ch-mast"><div class="ch-w"><button class="ch-x" data-a="exit" title="Dashboard par wapas">' + ic('back') + '</button><div class="ch-pn"><h1>Career Mode</h1><small>' + E(C.name) + ' ka rajneetik safar</small></div></div></header><div class="ch-w">';
    // neta
    h += '<div class="ch-hgrid"><div class="ch-hmain">';
    h += '<section class="ch-hero"><svg class="ch-arc" viewBox="0 0 200 100" aria-hidden="true"><path d="M10 100a90 90 0 0 1 180 0M30 100a70 70 0 0 1 140 0M50 100a50 50 0 0 1 100 0M70 100a30 30 0 0 1 60 0"/></svg>' +
        '<div class="ch-hr"><img src="' + core.photoOf() + '" alt=""><div><h2>' + E(C.name) + '</h2><small>' + E(H.leader.title) + ', ' + E(C.party.name) + '</small><span class="ch-pill"><small>Abhi ka pad</small><b>' + E(post.t) + '</b><small style="margin-top:1px">' + E(post.s) + '</small></span></div></div>' +
        '<div class="ch-q"><div><small>Vidhayak</small><b>' + mla + '</b></div><div><small>Saansad</small><b>' + mp + '</b></div><div><small>Rajya sarkar</small><b>' + gov.length + '</b></div><div><small>Kendra sarkar</small><b class="' + (C.pm ? 'ch-yes' : 'ch-no') + '">' + (C.pm ? 'Haan' : 'Nahi') + '</b></div></div></section>';
    h += '<section class="ch-hc ch-ls"><h3>Lok Sabha<small>' + lsTotal + ' seat, bahumat 272</small></h3><div class="ch-hmw">' + hemi(lsTotal, mp, pc, 'Lok Sabha mein ' + mp + ' saansad') + '<div class="ch-hmc"><b>' + mp + '</b><small>aapke saansad</small></div></div></section>';
    h += vsCards();
    h += seatsHome();
    h += '</div><aside class="ch-hside">';
    // hamari party
    h += '<section class="ch-pcard"><div class="ch-ph"><img src="' + core.logoOf() + '" alt=""><div><b>' + E(C.party.name) + '</b><small>Hamari party</small></div></div>' + (alertTxt ? '<div class="ch-alert"><i class="ch-dot" style="position:static"></i>' + E(alertTxt) + '</div>' : '') +
        gauge('Reputation', C.res.image, 'var(--jade)') + gauge('Popularity', H.pop, 'var(--gold)') + gauge('Power', H.pow, 'var(--ver)') +
        '<div class="ch-fx"><span>Party fund</span><b>' + fm(C.res.funds) + ' Cr</b></div><div class="ch-fx"><span>Karyakarta active</span><b>' + H.vol.active + '</b></div>' + btn('Party daftar kholo', 'party') + '</section>';
    // rajya sarkar
    h += '<section class="ch-hc ch-gv"><h3>Rajya mein sarkar<small>' + gov.length + ' / ' + nst + '</small></h3>' +
        (gov.length ? '<div class="ch-chips">' + gov.map(function (s) { return '<span class="ch-chip">' + E(s) + '</span>'; }).join('') + '</div>' : '<p class="ch-hnote" style="text-align:left">Abhi kisi rajya mein aapki sarkar nahi hai. Vidhan sabha mein bahumat milne par yahan judega.</p>') + '</section>';
    // kendra sarkar
    h += '<section class="ch-hc ch-ct"><h3>Kendra sarkar<small>' + (C.pm ? 'Aapki sarkar' : 'Vipaksh mein') + '</small></h3><div class="ch-big2 ' + (C.pm ? 'ch-yes' : '') + '">' + mp + '<small>/ 543 saansad</small></div><div class="ch-bar"><i style="width:' + clamp(mp / 543 * 100, 0, 100) + '%"></i><u></u></div>' +
        '<p class="ch-hnote" style="text-align:left">' + (C.pm ? 'Aap Pradhanmantri hain.' : (mp >= 272 ? 'Bahumat ka aankda paar hai.' : 'Bahumat ke liye 272 chahiye, ' + (272 - mp) + ' aur seat.')) + '</p></section>';
    h += '</aside></div></div>';
    return h;
}

// =============================================================
//  ACTIONS
// =============================================================
var ACT = {};
function find(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }

ACT.exit = function () { S.view = 'home'; S.sheet = null; core.close(); };
ACT.home = function () { S.view = 'home'; S.sheet = null; render(); };
ACT.party = function () { S.view = 'party'; S.sheet = null; render(); var el = document.getElementById('cm-ui'); if (el) el.scrollTop = 0; };
ACT.pause = function () { H.paused = !H.paused; H.last = Date.now(); render(); };
ACT.skip = function () { for (var i = 0; i < 6; i++) hourly(); H.last = Date.now(); toast('6 ghante beet gaye.', ''); render(); };
ACT.open = function (x) { S.sheet = x; render(); };
ACT.shclose = function () { S.sheet = null; render(); };
ACT.tab = function (x) { S.tab[S.sheet] = x; render(); };

// ---------- generic karya ----------
ACT.item = function (x) {
    var p = String(x).split('|'), ns = p[0], it = find(LISTS[ns], p[1]); if (!it) return;
    var key = ns + ':' + it.id, g = gateOf(it); if (g) { toast(g, 'bad'); return; }
    if (!ready(key, it.n)) return;
    if (it.cost && !pay(it.cost)) return;
    if (it.cd) setcd(key, it.cd);
    var gain = it.earnFn ? it.earnFn() : (it.earn || 0), bad = it.risk && Math.random() < it.risk.p;
    if (bad) {
        bump(scale(it.eff, .3)); bump(it.risk.eff); if (it.risk.kase) caseAgainst(it.n, it.risk.kase);
        toast(it.risk.t, 'bad'); news(it.risk.t);
    } else {
        bump(it.eff); toast(it.ok || (it.n + ': ho gaya.'), 'good'); news(it.n + ' kiya gaya.');
    }
    if (gain) earn(gain);
    if (it.heat) addHeat(it.heat);
    if (it.edge) H.edge = Math.min(30, H.edge + it.edge);
    if (it.wave) H.wave = clamp(H.wave + it.wave, 0, 100);
    if (ns === 'org') H.vol.lastOrg = H.t;
    render();
};
ACT.buyJudge = function () { if (H.judgeBought) return; if (!pay(JUDGE_COST)) return; H.judgeBought = true; news('Judge ko apne paksh mein kar liya.'); toast('Judge ab aapke saath hai.', 'good'); render(); };
ACT.buyEC = function () { var e = ecState(); if (e.hired) return; if (!pay(EC_COST)) return; e.hired = true; news('Chunav aayukt ko hire kiya.'); toast('Chunav aayukt hire ho gaye. Chunav se pehle ACTIVE karo.', 'good'); render(); };
ACT.ecToggle = function () { var e = ecState(); if (!e.hired) return; e.active = !e.active; toast(e.active ? 'Chunav aayukt ACTIVE.' : 'Band kiya.', 'good'); render(); };
ACT.hire = function (x) {
    var p = String(x).split('|'), ns = p[0], list = ns === 'cons' ? CONS : MEDIA, map = ns === 'cons' ? H.consult : H.media, c = find(list, p[1]); if (!c) return;
    var lk = c.lvl ? lvlMsg(c.lvl) : ''; if (lk) { toast(lk, 'bad'); return; }
    if ((map[c.id] || 0) > H.t) { map[c.id] = 0; news(c.n + ' ka contract khatam kiya.'); toast(c.n + ' ko hata diya.', 'good'); render(); return; }
    if (!pay(perDay(c))) return;
    map[c.id] = 1e12;
    bump({ pop: Math.min(4, c.cost / 12 + 1), rep: Math.min(2, c.cost / 30 + .5) });
    news(c.n + ' ko hire kiya (roz ' + fm(perDay(c)) + ' Cr, jab tak hatao nahi).'); toast(c.n + ' hire ho gaya.', 'good'); render();
};
// ---------- IT cell ----------
ACT.itFund = function (v) { H.it.fund = +v; render(); };
ACT.itLen = function (v) { H.it.len = +v; render(); };
ACT.itMode = function (x) { H.it.mode = x; render(); };
ACT.itAuto = function () { H.it.auto = !H.it.auto; render(); };
ACT.itStart = function () {
    if (H.it.on) return; if (!pay(H.it.fund)) return;
    H.it.len = 24; H.it.auto = true;
    H.it.on = true; H.it.start = H.t; H.it.until = H.t + H.it.len;
    news('IT cell ka chakra shuru hua (' + H.it.fund + ' Cr, ' + hrs(H.it.len) + ').'); toast('IT cell chalu ho gaya.', 'good'); render();
};
ACT.itStop = function () { H.it.on = false; news('IT cell ko beech mein roka gaya.'); render(); };
// ---------- karyakarta ----------
ACT.recruit = function (i) {
    var r = RECRUIT[+i]; if (!r || !pay(r[1])) return;
    var n = Math.round(r[1] * rnd(8, 14) * (1 + C.res.image / 200)), act = Math.round(n * clamp(.5 + C.res.image / 300, .4, .85));
    H.vol.total += n; H.vol.active += act;
    for (var k = 0; k < 3; k++) H.vol.roster.unshift({ n: nameGen(), a: pick(['Booth prabhari', 'Mohalla sanyojak', 'Gaon pramukh', 'College sanyojak']), on: Math.random() < .7 });
    H.vol.roster = H.vol.roster.slice(0, 20); H.vol.lastOrg = H.t;
    bump({ cad: Math.min(8, n * .05), pop: .5 });
    news(n + ' naye karyakarta jude, ' + act + ' active.'); toast(n + ' naye karyakarta jude, ' + act + ' active.', 'good'); render();
};
ACT.train = function () {
    var ina = H.vol.total - H.vol.active; if (ina <= 0) return; if (!pay(4)) return;
    var n = Math.min(ina, Math.max(1, Math.round(H.vol.total * .25))); H.vol.active += n; H.vol.lastOrg = H.t; bump({ cad: 2 });
    news(n + ' karyakarta dobara active hue.'); toast(n + ' karyakarta dobara active hue.', 'good'); render();
};
ACT.wing = function (id) {
    H.wingHead = H.wingHead || {};
    var w = find(WINGS, id), l = H.wings[id] || 0; if (!w || l >= 5) return;
    if (!pay(wingCost(l))) return;
    H.wings[id] = l + 1; if (!l) H.wingHead[id] = nameGen();
    bump({ pop: 2, rep: 1, cad: 3 }); news(w.n + (l ? ' majboot hua (level ' + (l + 1) + ').' : ' ka gathan hua.')); toast(w.n + ' ab level ' + (l + 1) + ' par.', 'good'); render();
};
// ---------- high command / leader ----------
ACT.post = function (i) {
    var p = core.POSTS[+i], v = val('ch-po-' + i);
    if (p[1] && !v) { toast('Ye pad zaroori hai. Naam likho ya Auto dabao.', 'bad'); return; }
    C.posts[p[0]] = v; news(p[0] + ': ' + (v || 'khaali') + '.'); toast('Pad update hua.', 'good'); render();
};
ACT.postAuto = function (i) { var p = core.POSTS[+i]; C.posts[p[0]] = nameGen(); render(); };
var photoInput = null;
ACT.pickPhoto = function () {
    if (!photoInput) {
        photoInput = document.createElement('input'); photoInput.type = 'file'; photoInput.accept = 'image/*'; photoInput.style.display = 'none';
        photoInput.addEventListener('change', function () {
            var f = photoInput.files && photoInput.files[0]; if (!f) return;
            core.resizeImg(f, function (d) { core.setPhoto(d); toast('Profile photo badal gayi.', 'good'); render(); });
            photoInput.value = '';
        });
        document.body.appendChild(photoInput);
    }
    photoInput.click();
};
ACT.govOpen = function (st) { showGov(st); };
var logoInput = null;
ACT.pickLogo = function () {
    if (!logoInput) {
        logoInput = document.createElement('input'); logoInput.type = 'file'; logoInput.accept = 'image/*'; logoInput.style.display = 'none';
        logoInput.addEventListener('change', function () {
            var f = logoInput.files && logoInput.files[0]; if (!f) return;
            core.resizeImg(f, function (d) { core.setLogo(d); toast('Party ka logo badal gaya.', 'good'); render(); });
            logoInput.value = '';
        });
        document.body.appendChild(logoInput);
    }
    logoInput.click();
};
ACT.logoIdx = function (i) { core.setLogoIdx(parseInt(i, 10) || 0); toast('Party ka logo badal gaya.', 'good'); render(); };
ACT.leaderPhoto = function (v, x, el) {
    var f = el && el.files && el.files[0]; if (!f) return;
    core.resizeImg(f, function (d) { core.setPhoto(d); toast('Profile photo badal gayi.', 'good'); render(); });
};
ACT.leaderAv = function (i) { core.setPhoto('av:' + i); toast('Profile photo badal gayi.', 'good'); render(); };
ACT.fightState = function (st) { core.fightState(st); };
ACT.saveLeader = function () {
    var n = val('ch-ln'); if (n.length < 2) { toast('Naam kam se kam 2 akshar ka ho.', 'bad'); return; }
    C.name = n; var L = H.leader; L.title = val('ch-lt') || L.title; L.age = val('ch-la'); L.edu = val('ch-le'); L.motto = val('ch-lm'); L.bio = val('ch-lb');
    toast('Profile save ho gaya.', 'good'); render();
};
// ---------- ticket ----------
ACT.tf = function (v, x) { S.form.t[x] = v; render(); };
ACT.ticket = function () {
    var f = S.form.t; if (H.tickets.length >= ticketCap()) { toast('Ticket ki seema poori. Power badhao.', 'bad'); return; }
    var seat = val('ch-ts'), nm = val('ch-tn') || nameGen();
    if (seat && H.tickets.some(function (t) { return t.kind === f.kind && t.state === f.state && t.seat === seat; })) { toast('Is seat par pehle se ticket diya hai.', 'bad'); return; }
    var cost = f.kind === 'MLA' ? 1 : 3; if (!pay(cost)) return;
    H.tickets.push({ id: 't' + uid(), name: nm, kind: f.kind, state: f.state, seat: seat, q: ri(40, 90) });
    bump({ pow: .5 }); news(nm + ' ko ' + f.state + ' mein ticket diya.'); toast(nm + ' ko ticket mil gaya.', 'good'); render();
};
ACT.unticket = function (id) {
    var i = -1; H.tickets.forEach(function (t, k) { if (t.id === id) i = k; }); if (i < 0) return;
    var t = H.tickets[i]; if (t.strong) { toast('Dabang neta ka ticket wapas nahi hota.', 'bad'); return; }
    earn(t.kind === 'MLA' ? .5 : 1.5); H.tickets.splice(i, 1); render();
};
// ---------- sampark ----------
ACT.meet = function (type, id) {
    var inf = CONN_INFO[type], key, lv, label, target = null;
    if (type === 'party') { key = 'conn:party:' + id; lv = C.conn[id] || 0; label = id; }
    else { target = find(H.contacts[type], id); if (!target) return; key = 'conn:' + id; lv = target.lv; label = target.n; }
    if (!ready(key, 'Mulaqat')) return; if (!pay(inf[1])) return; setcd(key, 8);
    var boost = (type === 'party' && C.allies.indexOf(id) >= 0) ? .3 : 0;
    var p = clamp(.5 + C.res.image / 250 + H.pow / 300 - lv * .1 + boost - (type === 'party' ? .1 : 0), .2, .92);
    if (Math.random() < p) {
        if (type === 'party') C.conn[id] = lv + 1; else target.lv = lv + 1;
        bump(inf[2]); news('Mulaqat safal: ' + label + '.'); toast('Mulaqat safal. Rishta majboot hua.', 'good');
    } else { bump({ rep: -1 }); news('Mulaqat nahi bani: ' + label + '.'); toast('Is baar mulaqat ka samay nahi mila.', 'bad'); }
    render();
};
ACT.defect = function (id) {
    var t = find(H.contacts.pmem, id); if (!t) return; if (!pay(8)) return;
    bump({ pow: 5, pop: 2, rep: -1 }); news(t.n + ' apna dal chhodkar aapki party mein aaye.');
    var parties = core.allParties().map(function (p) { return p.n; });
    H.contacts.pmem[H.contacts.pmem.indexOf(t)] = { id: 'c' + uid(), n: nameGen(), role: pick(parties) + ' ke naraaz neta', lv: 0 };
    toast(t.n + ' aapki party mein shamil hue.', 'good'); render();
};
// ---------- court ----------
ACT.caseNew = function () {
    var tgt = val('ch-ct'), tp = +val('ch-cp'), lw = +val('ch-cl'), L = LAWYERS[lw]; if (!L || !pay(L[1])) return;
    H.cases.unshift({ id: 'k' + uid(), kind: 'for', title: tgt + ' par: ' + CASE_TOPICS[tp][0], lawyer: lw, topicMod: CASE_TOPICS[tp][1], due: H.t + L[3], st: 'pending' });
    H.cases = H.cases.slice(0, 20); news('Court mein case dayar kiya: ' + tgt + '.'); toast('Case dayar ho gaya. Faisla ' + L[3] + ' ghante mein.', 'good'); render();
};
ACT.caseLawyer = function (id, lw) {
    var c = find(H.cases, id), L = LAWYERS[+lw]; if (!c || !L || !pay(L[1])) return;
    c.lawyer = +lw; toast(L[0] + ' aapki taraf se pairvi karenge.', 'good'); render();
};
// ---------- sankat ----------
ACT.crisis = function (id) {
    var c = H.crisis; if (!c || c.done) return; var r = find(CRISIS_RESP, id); if (!r) return;
    if (r.needVol && H.vol.active < r.needVol) { toast(r.needVol + '+ active karyakarta chahiye.', 'bad'); return; }
    if (r.cost && !pay(r.cost)) return;
    bump(r.eff); c.done = 1; c.res = id; news(c.title + ': ' + r.n + '.'); toast(r.id === 'ignore' ? 'Aapne is baar kuch nahi kiya.' : 'Party madad ke liye pahunchi.', r.id === 'ignore' ? 'bad' : 'good'); render();
};
// ---------- manifesto ----------
function addPlan(t, k) {
    H.plan.push({ id: 'p' + uid(), t: t, k: k });
    if (k === 'j') { H.jumlas++; bump({ pop: 2.5 }); } else bump({ pop: 1, rep: .5 });
    news('Ghoshna patra mein joda: ' + t);
}
ACT.planAdd = function (k) {
    var t = val('ch-pl'); if (t.length < 5) { toast('Vaada thoda vistaar se likho.', 'bad'); return; }
    if (H.plan.length >= 12) return; addPlan(t, k); toast(k === 'j' ? 'Jumla jud gaya.' : 'Vaada jud gaya.', 'good'); render();
};
ACT.planLib = function (x) {
    var p = String(x).split(':'), t = p[0] === 'v' ? MANIFESTO_OWN[+p[1]] : JUMLAS[+p[1]];
    if (!t || planHas(t) || H.plan.length >= 12) return; addPlan(t, p[0]); toast('Ghoshna patra mein jud gaya.', 'good'); render();
};
ACT.planDel = function (id) {
    var i = -1; H.plan.forEach(function (p, k) { if (p.id === id) i = k; }); if (i < 0) return;
    if (H.plan[i].k === 'j') H.jumlas = Math.max(0, H.jumlas - 1); H.plan.splice(i, 1); render();
};
ACT.planRelease = function () {
    if (H.plan.length < 3) return; if (!ready('release', 'Ghoshna patra')) return; if (!pay(5)) return; setcd('release', 96);
    var n = H.plan.length, j = H.plan.filter(function (p) { return p.k === 'j'; }).length;
    bump({ pop: 2 + n * .8, rep: Math.max(-2, 1 + (n - j) * .5 - j * .2), pow: 1 });
    news('Ghoshna patra jaari hua (' + n + ' vaade).'); toast('Ghoshna patra jaari ho gaya.', 'good'); render();
};
// ---------- pravakta ----------
ACT.spokeHire = function (id) {
    var s = find(H.spokePool, id); if (!s || H.spokes.length >= 4) return; if (!pay(s.join)) return;
    H.spokes.push(s); H.spokePool = H.spokePool.filter(function (x) { return x.id !== id; }); if (H.spokePool.length < 3) refillSpokes();
    news(s.n + ' party ke pravakta bane.'); toast(s.n + ' ab aapke pravakta hain.', 'good'); render();
};
ACT.spokeFire = function (id) { H.spokes = H.spokes.filter(function (x) { return x.id !== id; }); render(); };
ACT.debateGo = function () {
    var s = find(H.spokes, val('ch-dp')), tp = val('ch-dt'); if (!s) return;
    if (!ready('debate', 'Debate')) return; if (!pay(1)) return; setcd('debate', 6);
    var media = MEDIA.some(function (m) { return H.media[m.id] > H.t; }), p = clamp(.25 + s.skill / 150 + C.res.image / 400 + (media ? .05 : 0), .15, .9);
    if (Math.random() < p) { bump({ pop: 3, rep: 2, pow: 1 }); news(s.n + ' ne ' + tp + ' par debate jeeti.'); toast(s.n + ' ne ' + tp + ' par debate jeeti.', 'good'); }
    else {
        bump({ pop: -1, rep: -1 }); var gaffe = s.skill < 55 && Math.random() < .25; if (gaffe) bump({ rep: -3 });
        news(s.n + ' debate mein ' + (gaffe ? 'gaffe kar baithe.' : 'peeche rahe.')); toast(gaffe ? s.n + ' se debate mein badi chook hui.' : s.n + ' is baar debate nahi jeet paye.', 'bad');
    }
    render();
};
// ---------- bahubali ----------
ACT.strongMeet = function (id) {
    var s = find(H.strongPool, id); if (!s) return; if (H.strong.length >= 6) { toast('Itne judav kaafi hain.', 'bad'); return; } if (!pay(5)) return;
    H.strongPool = H.strongPool.filter(function (x) { return x.id !== id; }); refillStrong();
    if (Math.random() < .65) { H.strong.push({ id: s.id, n: s.n, kind: s.kind, fame: s.fame, neta: false, state: '' }); bump({ pow: 1, rep: -1 }); news(s.n + ' (' + s.kind + ') se judav bana.'); toast('Judav ban gaya.', 'good'); }
    else { bump({ rep: -1 }); toast('Baat nahi bani.', 'bad'); }
    render();
};
ACT.strongNeta = function (id) {
    var s = find(H.strong, id); if (!s || s.neta) return; var st = val('ch-bs') || C.state;
    if (H.tickets.length >= ticketCap()) { toast('Ticket ki seema poori. Power badhao ya ticket wapas lo.', 'bad'); return; }
    if (!pay(10)) return;
    s.neta = true; s.state = st; H.tickets.push({ id: 't' + uid(), name: s.n, kind: 'MLA', state: st, seat: '', q: s.fame, strong: true });
    bump({ pow: 5, rep: -5 }); addHeat(12); if (Math.random() < .35) caseAgainst('Purane aapraadhik mukadme', 2);
    news(s.n + ' ko ' + st + ' mein party ka ummeedwar banaya.'); toast(s.n + ' ab party ke neta hain. Chhavi par daag laga.', 'bad'); render();
};
// ---------- khata ----------
ACT.invest = function (id, amt) {
    amt = +amt; var d = find(INV, id); if (!d || !pay(amt)) return;
    H.invest.push({ id: 'i' + uid(), k: id, amt: amt, t0: H.t, got: 0 }); news(d.n + ' mein ' + amt + ' Cr lagaye.'); toast(amt + ' Cr ' + d.n + ' mein lag gaye.', 'good'); render();
};
ACT.divest = function (id) {
    var i = -1; H.invest.forEach(function (v, k) { if (v.id === id) i = k; }); if (i < 0) return;
    var iv = H.invest[i], d = find(INV, iv.k), back = iv.amt * ((d.lock && H.t - iv.t0 < d.lock) ? .9 : 1);
    earn(back); H.invest.splice(i, 1); news(d.n + ' se ' + fm(back) + ' Cr nikaale.'); toast(fm(back) + ' Cr wapas aaye.', 'good'); render();
};
ACT.buy = function (id) {
    var a = find(ASSETS, id), n = acount(id); if (!a || n >= a.max) return; if (!pay(a.cost)) return;
    H.assets[id] = n + 1; if (a.pow) bump({ pow: a.pow }); news(a.n + ' khareeda.'); toast(a.n + ' party ki sampatti ban gaya.', 'good'); render();
};
ACT.sell = function (id) {
    var a = find(ASSETS, id), n = acount(id); if (!a || !n) return;
    var v = a.cost * (a.appr ? (1 + a.appr * H.t / 24) : 1) * .7; earn(v); H.assets[id] = n - 1; news(a.n + ' becha.'); toast(fm(v) + ' Cr mile.', 'good'); render();
};
ACT.loan = function (id, amt) {
    amt = +amt; var d = find(LOANS, id); if (!d) return; if (H.loans.length >= 4) { toast('Ek saath 4 se zyada karz nahi.', 'bad'); return; }
    H.loans.push({ id: 'l' + uid(), k: id, n: d.n, p: amt, owed: amt, rate: d.rate, due: H.t + d.days * 24, od: 0, foreign: !!d.foreign });
    C.res.funds += amt;
    if (d.foreign) { addHeat(8); bump({ pow: -1 }); if (Math.random() < .15) caseAgainst('Videshi karz ki jaanch', 1); }
    news(d.n + ': ' + amt + ' Cr liye.'); toast(amt + ' Cr ka karz mila. Byaaj ' + d.rate + '% roz.', 'good'); render();
};
ACT.repay = function (id, mode) {
    var l = find(H.loans, id); if (!l) return; var amt = mode === 'all' ? l.owed : l.owed / 2; if (!pay(amt)) return;
    l.owed -= amt;
    if (l.owed <= .05) { H.loans = H.loans.filter(function (x) { return x !== l; }); bump({ rep: 1 }); news(l.n + ' poora chukaya.'); toast('Karz poora chuka diya.', 'good'); }
    else toast('Aadha karz chuka diya.', 'good');
    render();
};
// ---------- press ----------
ACT.press = function (id) {
    var p = find(PRESS, id); if (!p) return; if (!ready('press', 'Press conference')) return; if (!pay(.5)) return; setcd('press', 8);
    var g = clamp(.12 - C.res.image / 1000, .04, .12);
    if (Math.random() < g) { bump(scale(p.eff, .3)); bump({ rep: -3, pop: -2 }); news('Press conference mein neta ka galat bayan viral hua.'); toast('Tedhe sawal par galat bayan viral ho gaya.', 'bad'); }
    else { bump(p.eff); news('Press conference: ' + p.n + '.'); toast('Press conference achhi rahi.', 'good'); }
    render();
};

// =============================================================
//  CHUNAV SE JUDAAV
// =============================================================
function onCycle(won, ctx) {
    if (!ensure()) return;
    bump(won ? { pop: 4, pow: 3 } : { pop: -3 }); H.wave *= .5;
    if (!ctx || !H.tickets.length) return;
    var keep = [], res = [];
    H.tickets.forEach(function (t) {
        var inScope = ctx.kind === t.kind && (ctx.all || (ctx.states || []).indexOf(t.state) >= 0);
        if (!inScope) { keep.push(t); return; }
        var p = clamp(.18 + t.q / 250 + (C.res.image + H.pop + H.pow) / 900 + bonus() + (t.strong ? .1 : 0), .1, .85);
        if (Math.random() < p) {
            var _k = t.kind === 'MLA' ? 'MLA' : 'MP'; core.addSeat(_k, t.state, t.seat || core.randomSeat(_k, t.state) || (t.state + ' (VIP seat)'), { name: t.name });
            C.res.strength += t.kind === 'MLA' ? 2 : 3; res.push(t.name + ' jeete');
            news('VIP ummeedwar ' + t.name + ' ne ' + t.state + ' mein jeet darj ki.');
            if (t.strong) bump({ rep: -2 });
        } else { res.push(t.name + ' haare'); news('VIP ummeedwar ' + t.name + ' ' + t.state + ' mein haar gaye.'); }
    });
    H.tickets = keep;
    if (res.length) toast('VIP ummeedwar: ' + res.slice(0, 3).join(', ') + (res.length > 3 ? ' aur ' + (res.length - 3) + ' aur' : ''), '');
}
function getTickets(state, kind) {
    if (!ensure()) return [];
    return H.tickets.filter(function (t) { return (!state || t.state === state) && (!kind || t.kind === kind); }).map(function (t) { return { name: t.name, kind: t.kind, state: t.state, seat: t.seat, strength: t.q, strong: !!t.strong }; });
}

window.CareerHub = { perks: perks, allTickets: allTickets, render: render, bonus: bonus, onCycle: onCycle, getTickets: getTickets, meters: function () { return ensure() ? { reputation: C.res.image, popularity: H.pop, power: H.pow } : null; } };
})();

(function () {
    if (document.getElementById('ch-govcss')) return;
    var st = document.createElement('style'); st.id = 'ch-govcss';
    st.textContent = '@keyframes chGovIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}@keyframes chDot{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}' +
        '.ch-vsx{animation:chGovIn .5s ease both;transition:transform .2s,box-shadow .2s}.ch-vsx[data-a]:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(0,0,0,.4)}.ch-vsx .ch-hmw circle{animation:chDot .5s ease both}' +
        '.cg-box{width:min(620px,96vw);max-height:92vh;overflow:auto;background:#0e1d24;border:1px solid #f0b04a;border-radius:18px;padding:20px;color:#e8f1ee;animation:chGovIn .45s ease both}' +
        '.cg-cm{margin:14px 0 6px;padding:14px;border-radius:14px;background:rgba(240,176,74,.1);border:1px solid rgba(240,176,74,.4)}' +
        '.cg-r{display:grid;grid-template-columns:1.3fr 1.2fr auto auto;gap:6px;margin-bottom:6px;animation:chGovIn .4s ease both}.cg-r input,.cg-r select{width:100%;padding:8px;border-radius:9px;border:1px solid #2a474f;background:#0a1417;color:#e8f1ee}.cg-r button{padding:6px 10px;border-radius:9px;border:0;background:#f0b04a;color:#1a1205;font-weight:800;cursor:pointer}.cg-r button:disabled{opacity:.35;cursor:not-allowed}';
    document.head.appendChild(st);
})();
