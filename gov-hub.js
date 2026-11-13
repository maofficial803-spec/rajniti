/* =====================================================================
   SARKAR (Government Hub) - Rajniti
   Home ke "LOWER HOUSE" button se khulta hai.
   Lok Sabha mein jeeti hui sarkar (s34GetHouse) ko chalane ka page:
   janta ki khushi, PM popularity, mahangai/rozgar/GDP, bill (Lok Sabha ->
   Rajya Sabha -> Rashtrapati -> janta), budget, avishwas prastav,
   videsh neeti, PM card.
   ===================================================================== */
(function () {
    'use strict';
    var KEY = 'rajniti_govhub';
    var G = null;
    var V = { view: 'home', tab: 'normal', pmOpen: false, vote: null, timer: null, builder: { name: '', cat: 'Kisan', type: 'normal', lvl: 2 }, budget: null, country: null, toast: '' };

    // ---------------------------------------------------------------- helpers
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    var ri = function (a, b) { return Math.floor(rnd(a, b + 1)); };
    var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
    var r1 = function (v) { return Math.round(v * 10) / 10; };
    var sgn = function (v) { return (v > 0 ? '+' : '') + r1(v); };

    function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) {} }
    function houseRec() { try { return typeof s34GetHouse === 'function' ? s34GetHouse() : null; } catch (e) { return null; } }
    function houseSig(r) { return r ? (r.when + '|' + r.pm.name + '|' + r.pm.party) : ''; }
    function blocOf(p) { try { var d = PARTY_DB[p]; return d && d.bloc; } catch (e) { return null; } }
    function pcol(p) { try { return (typeof partyColors !== 'undefined' && partyColors[p]) || (PARTY_DB[p] && PARTY_DB[p].color) || '#3b82f6'; } catch (e) { return '#3b82f6'; } }
    function logo(p, s) { try { return typeof s22Logo === 'function' ? s22Logo(p, s || 28) : ''; } catch (e) { return ''; } }

    // ---------------------------------------------------------------- chambers
    function classify(seatMap, rec) {
        var gov = {}; (rec.gov || []).forEach(function (p) { gov[p] = 1; });
        var ob = blocOf(rec.opp), g = 0, o = 0, n = 0, main = 0, tot = 0, allies = {};
        Object.keys(seatMap || {}).forEach(function (p) {
            var v = seatMap[p] | 0; if (!v) return; tot += v;
            if (gov[p]) { g += v; if (p === rec.pm.party) main += v; else allies[p] = v; }
            else if (ob && blocOf(p) === ob) o += v; else n += v;
        });
        return { gov: g, main: main, allies: allies, opp: o, oth: n, total: tot };
    }
    function lsCamps(rec) { var c = classify(rec.seats || {}, rec); if (c.total < 543) { c.oth += 543 - c.total; c.total = 543; } return c; }
    function rsCamps(rec) {
        try {
            if (typeof s37Load === 'function' && typeof s37Counts === 'function' && typeof s37Sets === 'function') {
                var ub = s37Load();
                if (ub) {
                    var cn = s37Counts(ub), sets = s37Sets({ you: rec.you }), g = 0, o = 0, n = 0, main = 0, allies = {};
                    Object.keys(cn).forEach(function (p) {
                        var v = cn[p] | 0; if (!v) return;
                        if (sets.ys && sets.ys[p]) { g += v; if (p === rec.pm.party) main += v; else allies[p] = v; } else if (sets.os && sets.os[p]) o += v; else n += v;
                    });
                    if (g + o + n > 0) return { gov: g, main: main, allies: allies, opp: o, oth: 245 - g - o, total: 245 };
                }
            }
        } catch (e) {}
        var cn = null;
        try { if (typeof s37Load === 'function' && typeof s37Counts === 'function') { var ub = s37Load(); if (ub) cn = s37Counts(ub); } } catch (e) {}
        if (cn && typeof cn === 'object') {
            var c = classify(cn, rec);
            if (c.total > 0) {
                var k = 245 / c.total;
                ['gov', 'main', 'opp', 'oth'].forEach(function (x) { c[x] = Math.round(c[x] * k); });
                Object.keys(c.allies).forEach(function (p) { c.allies[p] = Math.round(c.allies[p] * k); });
                c.oth += 245 - (c.gov + c.opp + c.oth); c.total = 245;
                if (c.main > c.gov) c.main = c.gov;
                return c;
            }
        }
        var l = lsCamps(rec), k2 = 245 / 543, c2 = { gov: Math.round(l.gov * k2 * 0.9), main: Math.round(l.main * k2 * 0.9), allies: {}, opp: 0, oth: 0, total: 245 };
        Object.keys(l.allies).forEach(function (p) { c2.allies[p] = Math.round(l.allies[p] * k2 * 0.9); });
        c2.opp = Math.round(l.opp * k2 * 1.05); c2.oth = 245 - c2.gov - c2.opp;
        return c2;
    }

    // ---------------------------------------------------------------- state
    var COUNTRIES = [
        { n: 'USA', f: '\uD83C\uDDFA\uD83C\uDDF8', w: 1.6, rel: 60 }, { n: 'China', f: '\uD83C\uDDE8\uD83C\uDDF3', w: 1.6, rel: 35 }, { n: 'Russia', f: '\uD83C\uDDF7\uD83C\uDDFA', w: 1.2, rel: 70 },
        { n: 'Pakistan', f: '\uD83C\uDDF5\uD83C\uDDF0', w: 0.8, rel: 15 }, { n: 'Bangladesh', f: '\uD83C\uDDE7\uD83C\uDDE9', w: 0.8, rel: 55 }, { n: 'Sri Lanka', f: '\uD83C\uDDF1\uD83C\uDDF0', w: 0.5, rel: 55 },
        { n: 'Nepal', f: '\uD83C\uDDF3\uD83C\uDDF5', w: 0.5, rel: 60 }, { n: 'UK', f: '\uD83C\uDDEC\uD83C\uDDE7', w: 1, rel: 62 }, { n: 'France', f: '\uD83C\uDDEB\uD83C\uDDF7', w: 1, rel: 70 },
        { n: 'Japan', f: '\uD83C\uDDEF\uD83C\uDDF5', w: 1.1, rel: 72 }, { n: 'UAE', f: '\uD83C\uDDE6\uD83C\uDDEA', w: 1.1, rel: 72 }, { n: 'Saudi Arabia', f: '\uD83C\uDDF8\uD83C\uDDE6', w: 1, rel: 62 },
        { n: 'Israel', f: '\uD83C\uDDEE\uD83C\uDDF1', w: 0.7, rel: 66 }, { n: 'Australia', f: '\uD83C\uDDE6\uD83C\uDDFA', w: 0.8, rel: 68 }
    ];
    function fresh(r) {
        var c = lsCamps(r), rel = {};
        COUNTRIES.forEach(function (x) { rel[x.n] = x.rel; });
        var g0 = {
            v: 1, sig: houseSig(r), year: 2026, startYear: 2026,
            happy: clamp(Math.round(52 + (r.stab != null ? (r.stab - 50) / 4 : 0) + (c.gov - 272) / 12), 32, 80),
            pmPop: clamp(Math.round(55 + (c.gov - 272) / 8), 35, 85),
            infl: 48, jobs: 50, gdp: 6.2, fund: 100, cap: 6,
            pm: { press: 0, rallies: 0, pressYear: 0, rallyYear: 0 }, gdpSize: 4.0,
            stats: { passed: 0, failed: 0, protests: 0 },
            hist: { happy: [], pmPop: [] }, delta: {},
            bill: null, event: null, noconf: null, budgetYear: null, ended: false, fallen: false,
            fp: { rel: rel, pts: 4 }, log: []
        };
        try { if (localStorage.getItem('rajniti_ec_used') === '1') { g0.happy = Math.round(g0.happy * 0.8); g0.pmPop = Math.round(g0.pmPop * 0.8); g0.log.unshift({ y: 2026, t: 'Chunav aayukt ki madad se banne wali sarkar ki saakh 20% kam hai.' }); localStorage.removeItem('rajniti_ec_used'); } } catch (e) {}
        return g0;
    }
    function ensure() {
        var r = houseRec();
        if (!r) { G = null; return false; }
        var g = load();
        if (!g || g.sig !== houseSig(r)) g = fresh(r);
        G = g;
        if (!G.fp) G.fp = { rel: {}, pts: 4 };
        COUNTRIES.forEach(function (x) { if (G.fp.rel[x.n] == null) G.fp.rel[x.n] = x.rel; });
        save(); return true;
    }
    function log(t) { G.log.unshift({ y: G.year, t: t }); if (G.log.length > 40) G.log.pop(); }
    function bump(k, d) {
        if (!d) return;
        var lo = 0, hi = 100;
        if (k === 'gdp') { lo = -3; hi = 12; }
        G[k] = clamp(r1(G[k] + d), lo, hi);
        G.delta[k] = r1((G.delta[k] || 0) + d);
        if (k === 'happy' || k === 'pmPop') { G.hist[k].push(Math.round(G[k])); if (G.hist[k].length > 20) G.hist[k].shift(); }
    }
    function applyEff(e, mult) {
        mult = mult == null ? 1 : mult;
        ['happy', 'pmPop', 'infl', 'jobs', 'gdp'].forEach(function (k) { var key = k === 'pmPop' ? 'pm' : k; if (e[key]) bump(k, e[key] * mult); });
    }
    function cpi() { return 0.5 + G.infl * 0.105; }
    function unemp() { return 40 - G.jobs * 0.32; }
    function fpScore() {
        var s = 0, w = 0; COUNTRIES.forEach(function (c) { s += G.fp.rel[c.n] * c.w; w += c.w; }); return Math.round(s / w);
    }

    // ---------------------------------------------------------------- bills
    var CAT = {
        'Kisan': { happy: 3, pm: 1.5, infl: 1, jobs: 0, gdp: -0.1, pub: 0.45, opp: 0.45, con: 0.25 },
        'Yuva / Rozgar': { happy: 2, pm: 1.5, infl: 0.8, jobs: 4, gdp: 0.1, pub: 0.5, opp: 0.45, con: 0.2 },
        'Mahila': { happy: 3, pm: 2.5, infl: 0, jobs: 0.3, gdp: 0, pub: 0.65, opp: 0.75, con: 0.15 },
        'Arthik / Tax': { happy: -0.5, pm: 0, infl: -0.8, jobs: 0.8, gdp: 0.4, pub: 0.05, opp: 0.3, con: 0.45 },
        'Suraksha / Kadak kanoon': { happy: -1.5, pm: -0.5, infl: 0, jobs: 0, gdp: 0, pub: -0.3, opp: 0.15, con: 0.7 },
        'Shiksha': { happy: 1, pm: 1, infl: 0, jobs: 1.5, gdp: 0.15, pub: 0.3, opp: 0.45, con: 0.3 },
        'Swasthya': { happy: 3, pm: 2, infl: 0.5, jobs: 0.4, gdp: 0.05, pub: 0.55, opp: 0.6, con: 0.15 },
        'Udyog / Nivesh': { happy: -0.5, pm: 0, infl: 0.3, jobs: 2, gdp: 0.5, pub: -0.05, opp: 0.3, con: 0.5 },
        'Samvidhan': { happy: 0, pm: 1, infl: 0, jobs: 0, gdp: 0.1, pub: 0, opp: 0.15, con: 0.7 }
    };
    function B(id, name, type, cat, desc, pub, opp, ally, con, eff) { return { id: id, name: name, type: type, cat: cat, desc: desc, pub: pub, opp: opp, ally: ally, con: con, eff: eff }; }
    var BILLS = {
        normal: [
            B('msp', 'MSP Kanoon', 'normal', 'Kisan', 'Fasalon par MSP ki kanooni guarantee.', 0.6, 0.55, 0.85, 0.25, { happy: 4, pm: 2, infl: 1.5, jobs: 0, gdp: -0.1 }),
            B('roz', 'Rozgar Guarantee Adhiniyam', 'normal', 'Yuva / Rozgar', 'Har pariwar ko rozgar ki guarantee.', 0.65, 0.5, 0.85, 0.2, { happy: 3, pm: 2, infl: 1, jobs: 6, gdp: 0.1 }),
            B('mah', 'Mahila Suraksha Sanhita', 'normal', 'Mahila', 'Mahilaon ke khilaf aparadh par sakht kanoon.', 0.7, 0.75, 0.9, 0.1, { happy: 3, pm: 3, infl: 0, jobs: 0.5, gdp: 0 }),
            B('bij', 'Muft Bijli Yojna Bill', 'normal', 'Kisan', '200 unit tak bijli muft.', 0.5, 0.35, 0.7, 0.3, { happy: 5, pm: 2, infl: 2, jobs: 0, gdp: -0.2 }),
            B('dat', 'Data Suraksha Bill', 'normal', 'Udyog / Nivesh', 'Digital data ki suraksha aur niyam.', 0.25, 0.5, 0.8, 0.35, { happy: 0.5, pm: 0.5, infl: 0, jobs: 1.5, gdp: 0.2 }),
            B('gst', 'GST Sudhaar Bill', 'normal', 'Arthik / Tax', 'Tax slab saral, chori par lagam.', 0.1, 0.3, 0.75, 0.45, { happy: -1, pm: -0.5, infl: -1, jobs: 1, gdp: 0.4 }),
            B('nep', 'Shiksha Sudhaar Bill', 'normal', 'Shiksha', 'Nayi shiksha neeti aur school sudhaar.', 0.3, 0.4, 0.8, 0.4, { happy: 1, pm: 1, infl: 0, jobs: 2, gdp: 0.2 }),
            B('bima', 'Swasthya Bima Bill', 'normal', 'Swasthya', 'Sabko muft ilaaj ka bima.', 0.6, 0.6, 0.85, 0.15, { happy: 3, pm: 2, infl: 0.6, jobs: 0.5, gdp: 0.05 }),
            B('tax', 'Madhyam Varg Tax Rahat Bill', 'normal', 'Arthik / Tax', 'Income tax mein badi chhoot.', 0.55, 0.6, 0.85, 0.15, { happy: 3, pm: 2, infl: 0.5, jobs: 0, gdp: 0.1 }),
            B('nag', 'Nagrik Suraksha (Kadak) Kanoon', 'normal', 'Suraksha / Kadak kanoon', 'Police ko zyada adhikar. Vipaksh bhadka hua.', -0.35, 0.12, 0.6, 0.8, { happy: -2, pm: -1, infl: 0, jobs: 0, gdp: 0 }),
            B('zam', 'Zameen Adhigrahan Sanshodhan', 'normal', 'Udyog / Nivesh', 'Udyog ke liye zameen lena aasaan. Kisan naraaz ho sakte hain.', -0.4, 0.15, 0.55, 0.85, { happy: -2, pm: -2, infl: 0, jobs: 2, gdp: 0.5 }),
            B('shr', 'Shram Sanhita (Labour Codes)', 'normal', 'Udyog / Nivesh', 'Naye shram niyam. Union virodh karenge.', -0.25, 0.2, 0.65, 0.7, { happy: -2, pm: -1, infl: 0, jobs: 1.5, gdp: 0.5 })
        ],
        amend: [
            B('eoe', 'Ek Desh Ek Chunav (Samvidhan Sanshodhan)', 'amend', 'Samvidhan', 'Lok Sabha aur vidhan sabha chunav ek saath.', 0.1, 0.1, 0.6, 0.75, { happy: 0, pm: 1, infl: 0, jobs: 0, gdp: 0.2 }),
            B('wom', 'Mahila Aarakshan 33% (Samvidhan Sanshodhan)', 'amend', 'Mahila', 'Sansad aur vidhan sabha mein 33% seat mahilaon ko.', 0.7, 0.8, 0.9, 0.2, { happy: 3, pm: 3, infl: 0, jobs: 0, gdp: 0 }),
            B('par', 'Parisiman (Seat Punarnirdharan) Sanshodhan', 'amend', 'Samvidhan', 'Seat sankhya aur seema ka punarnirdharan.', -0.1, 0.25, 0.6, 0.7, { happy: -1, pm: -1, infl: 0, jobs: 0, gdp: 0 }),
            B('fed', 'Kendra-Rajya Adhikar Vikendrikaran Sanshodhan', 'amend', 'Samvidhan', 'Rajyon ko zyada vittiya aur prashasnik adhikar.', 0.35, 0.55, 0.75, 0.4, { happy: 1, pm: 1, infl: 0, jobs: 0, gdp: 0.1 })
        ],
        manifesto: [
            B('m1', 'Mahila Samman Rashi Bill (Ghoshna-patra)', 'normal', 'Mahila', 'Mahilaon ko har mahine seedhi madad.', 0.65, 0.55, 0.9, 0.25, { happy: 4, pm: 3, infl: 1.2, jobs: 0, gdp: -0.1 }),
            B('m2', 'Buzurgon ko Pension Bill (Ghoshna-patra)', 'normal', 'Swasthya', 'Buzurgon ke liye badhi hui pension.', 0.6, 0.6, 0.9, 0.2, { happy: 3.5, pm: 2, infl: 0.8, jobs: 0, gdp: -0.05 }),
            B('m3', 'Muft Shiksha Bill (Ghoshna-patra)', 'normal', 'Shiksha', 'Bachchon ki muft shiksha.', 0.55, 0.6, 0.9, 0.2, { happy: 3, pm: 2, infl: 0.6, jobs: 1, gdp: 0.1 }),
            B('m4', 'Yuva Rozgar Guarantee Bill (Ghoshna-patra)', 'normal', 'Yuva / Rozgar', 'Yuvaon ko rozgar ya bhatta.', 0.6, 0.5, 0.9, 0.25, { happy: 3, pm: 2.5, infl: 1, jobs: 5, gdp: 0.1 }),
            B('m5', 'Kisan Karz-Maafi Bill (Ghoshna-patra)', 'normal', 'Kisan', 'Chhote kisanon ka karz maaf.', 0.55, 0.5, 0.85, 0.35, { happy: 4, pm: 2, infl: 1.5, jobs: 0, gdp: -0.2 })
        ]
    };
    function billById(id) { var all = BILLS.normal.concat(BILLS.amend, BILLS.manifesto, (G && G.custom) || []); return all.filter(function (b) { return b.id === id; })[0]; }
    function effTags(e) {
        var t = [];
        if (e.happy) t.push('Khushi ' + sgn(e.happy));
        if (e.jobs) t.push('Rozgar ' + sgn(e.jobs));
        if (e.infl) t.push('Mahangai ' + sgn(e.infl));
        if (e.gdp) t.push('GDP ' + sgn(e.gdp));
        return t.map(function (x) { return '<span class="gh-tag">' + x + '</span>'; }).join('');
    }
    function oppLabel(b) { return b.opp >= 0.6 ? 'Vipaksh bhi saath' : (b.opp >= 0.3 ? 'Vipaksh baantega' : 'Vipaksh virodh karega'); }

    // ---------------------------------------------------------------- voting model
    function probs(bill, o) {
        var mood = (G.happy - 50) / 250 + (G.pmPop - 50) / 300;
        return {
            main: clamp(0.93 + 0.04 * o.whip - 0.12 * bill.con + mood * 0.4, 0.55, 0.995),
            ally: clamp(0.74 + 0.22 * bill.ally + 0.07 * o.talk + 0.05 * o.whip - 0.2 * bill.con + mood, 0.15, 0.98),
            opp: clamp(bill.opp + 0.22 * o.deal + (bill.pub > 0 ? bill.pub * 0.12 : 0) - 0.03, 0.02, 0.96),
            oth: clamp(0.5 + bill.pub * 0.25 + bill.opp * 0.2 + 0.1 * o.deal + mood * 0.5, 0.15, 0.92)
        };
    }
    function simulate(camps, p, mode, opts) {
        // seat order: main, allies, oth, opp  (hemicycle mein isi tarah baitha)
        var seats = [], i, flip = {};
        if (mode === 'noconf') {
            var loyal = clamp(0.82 + ((G.happy - 50) / 250 + (G.pmPop - 50) / 300) + 0.06 * opts.talk + 0.04 * opts.whip, 0.3, 0.97);
            Object.keys(camps.allies).forEach(function (a) { flip[a] = Math.random() < (1 - loyal) * 0.8 * (camps.allies[a] > 8 ? 1 : 0.6); });
        }
        var pYes = function (camp, party) {
            if (mode !== 'noconf') return p[camp];
            if (camp === 'main') return 0.01;
            if (camp === 'ally') return flip[party] ? 0.9 : 0.04;
            if (camp === 'opp') return 0.95;
            return clamp(0.3 + (50 - G.happy) / 200, 0.1, 0.7);
        };
        for (i = 0; i < camps.main; i++) seats.push({ c: 'main', p: null });
        Object.keys(camps.allies).forEach(function (a) { for (i = 0; i < camps.allies[a]; i++) seats.push({ c: 'ally', p: a }); });
        var rest = camps.total - seats.length - camps.opp; if (rest < 0) rest = 0;
        for (i = 0; i < rest; i++) seats.push({ c: 'oth', p: null });
        for (i = 0; i < camps.opp; i++) seats.push({ c: 'opp', p: null });
        var y = 0, n = 0, a = 0;
        seats.forEach(function (s) {
            if (Math.random() < 0.03) { s.v = 'a'; a++; }
            else if (Math.random() < pYes(s.c, s.p)) { s.v = 'y'; y++; } else { s.v = 'n'; n++; }
        });
        return { seats: seats, yes: y, no: n, abs: a, total: camps.total, flip: flip };
    }
    function passes(res, amend) {
        var cast = res.yes + res.no;
        if (amend) return res.yes >= Math.ceil(cast * 2 / 3) && res.yes > res.total / 2;
        return res.yes > res.no;
    }

    // ---------------------------------------------------------------- hemicycle
    function layout(n, rows, r0, r1) {
        var rs = [], sum = 0, k;
        for (k = 0; k < rows; k++) { var r = r0 + (r1 - r0) * (rows === 1 ? 0 : k / (rows - 1)); rs.push(r); sum += r; }
        var pts = [], left = n;
        rs.forEach(function (r, idx) {
            var cnt = idx === rows - 1 ? left : Math.round(n * r / sum); cnt = Math.min(cnt, left); left -= cnt;
            for (var i = 0; i < cnt; i++) { var a = cnt === 1 ? Math.PI / 2 : Math.PI - i * Math.PI / (cnt - 1); pts.push({ a: a, r: r, x: 300 + r * Math.cos(a), y: 305 - r * Math.sin(a) }); }
        });
        pts.sort(function (p, q) { return q.a - p.a || p.r - q.r; });
        return pts;
    }
    function hemiSvg(camps, chamber, id, colors) {
        var n = camps.total, rows = chamber === 'ls' ? 12 : 8, dotR = chamber === 'ls' ? 4.6 : 7;
        var pts = layout(n, rows, 105, 285), main = camps.main, allyN = camps.gov - camps.main, goes = camps.gov, opp = camps.opp, svg = '';
        pts.forEach(function (p, i) {
            var col = i < goes ? colors.gov : (i >= n - opp ? colors.opp : colors.oth);
            svg += '<circle id="' + id + 's' + i + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + dotR + '" fill="' + col + '"/>';
        });
        return '<svg viewBox="0 0 600 330" class="gh-hemi" id="' + id + '">' + svg +
            '<rect x="270" y="296" width="60" height="22" rx="4" fill="#7c5a2a"/><text x="300" y="311" text-anchor="middle" fill="#fde68a" font-size="10">Adhyaksh</text></svg>';
    }
    function hallColors(chamber) {
        return chamber === 'ls' ? { gov: '#3b82f6', oth: '#94a3b8', opp: '#f97316' } : { gov: '#3b82f6', oth: '#94a3b8', opp: '#f97316' };
    }

    // ---------------------------------------------------------------- UI shell
    var CSS = [
        '#gh-root{position:fixed;inset:0;z-index:9500;overflow:auto;color:#e8f1ee;font-family:inherit;background:linear-gradient(180deg,rgba(4,7,14,.62),rgba(4,7,14,.92)),url("Images/bg/home.png") center/cover fixed no-repeat,#0b0f19}',
        '#gh-root *{box-sizing:border-box}',
        '.gh-wrap{max-width:1180px;margin:0 auto;padding:14px 16px 60px}',
        '.gh-top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:12px}',
        '.gh-top h1{margin:0;font-size:2.2rem;line-height:1;background:linear-gradient(90deg,#f6e3b4,#e8a33d);-webkit-background-clip:text;background-clip:text;color:transparent}',
        '.gh-top small{display:block;color:#f3dca0}',
        '.gh-btn{padding:10px 18px;border-radius:14px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;font-weight:700;cursor:pointer;transition:transform .15s,background .2s}',
        '.gh-btn:hover:not(:disabled){background:rgba(255,255,255,.2);transform:translateY(-1px)}.gh-btn:disabled{opacity:.4;cursor:not-allowed}',
        '.gh-btn.go{background:#e8a33d;color:#2a1a00;border:0;box-shadow:none}',
        '.gh-btn.red{background:linear-gradient(90deg,#ef4444,#f97316);border:0}.gh-btn.gold{background:linear-gradient(90deg,#f59e0b,#fde047);color:#2a1a00;border:0}',
        '.gh-chip{display:inline-flex;gap:6px;padding:6px 12px;border-radius:20px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);font-size:.85rem}',
        '.gh-card{background:linear-gradient(160deg,rgba(255,255,255,.12),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:16px;backdrop-filter:blur(6px);animation:ghUp .5s ease both}',
        '.gh-card h3{margin:0 0 10px;font-size:.82rem;letter-spacing:3px;color:#c9b98a;font-weight:700}',
        '.gh-grid{display:grid;gap:14px;margin-bottom:14px}.g3{grid-template-columns:1.1fr 1.6fr 1.3fr}.g4{grid-template-columns:repeat(4,1fr)}.g2{grid-template-columns:1fr 1fr}',
        '@media(max-width:900px){.g3,.g4,.g2{grid-template-columns:1fr 1fr}}@media(max-width:560px){.g3,.g4,.g2{grid-template-columns:1fr}}',
        '@keyframes ghUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes ghPop{0%{opacity:0;transform:scale(.6)}70%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}@keyframes ghPulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes ghGlow{0%,100%{box-shadow:0 0 0 rgba(239,68,68,0)}50%{box-shadow:0 0 22px rgba(239,68,68,.6)}}@keyframes ghSign{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}@keyframes ghFall{0%{transform:translateY(-20px) rotate(0)}100%{transform:translateY(105vh) rotate(720deg)}}@keyframes ghShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}',
        '.gh-gauge{position:relative;text-align:center}.gh-gauge svg{width:100%;max-width:230px}.gh-gauge path{fill:none;stroke-width:16;stroke-linecap:round}.gh-gauge .bg{stroke:rgba(255,255,255,.12)}.gh-gauge .fg{transition:stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1)}',
        '.gh-gauge .v{position:absolute;left:0;right:0;top:44%;font-size:2.3rem;font-weight:900}.gh-gauge .v small{font-size:1rem;color:#94a3b8}.gh-gauge .l{font-weight:700;margin-top:-8px}.gh-gauge .s{font-size:.78rem;color:#94a3b8}',
        '.gh-m{margin:6px 0}.gh-m .t{display:flex;justify-content:space-between;font-size:.88rem}.gh-m .b{height:11px;border-radius:7px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:4px}.gh-m .b i{display:block;height:100%;border-radius:7px;transition:width 1.1s cubic-bezier(.2,.8,.2,1)}',
        '.up{color:#4ade80}.dn{color:#f87171}',
        '.gh-pm{display:flex;gap:14px;align-items:center;cursor:pointer}.gh-pm img{width:92px;height:92px;border-radius:50%;object-fit:cover;border:3px solid #f0b04a;background:#fff;flex:none;transition:transform .25s}.gh-pm:hover img{transform:scale(1.06) rotate(-2deg)}.gh-pm b{font-size:1.25rem}.gh-pm small{color:#94a3b8;display:block}',
        '.gh-tile{cursor:pointer;text-align:left;padding:16px;border-radius:20px;border:1px solid rgba(255,255,255,.2);background:linear-gradient(160deg,rgba(255,255,255,.14),rgba(255,255,255,.04));color:#fff;transition:transform .2s,box-shadow .2s;font-family:inherit}.gh-tile:hover:not(:disabled){transform:translateY(-4px);box-shadow:0 12px 28px rgba(0,0,0,.45)}.gh-tile:disabled{opacity:.5;cursor:not-allowed}.gh-tile b{display:block;font-size:1.1rem;margin:6px 0 2px}.gh-tile small{color:#94a3b8}.gh-tile .ic{font-size:1.9rem}',
        '.gh-tag{display:inline-block;margin:2px 4px 2px 0;padding:2px 9px;border-radius:12px;background:rgba(255,255,255,.1);font-size:.74rem;color:#cbd5e1}',
        '.gh-banner{padding:12px 16px;border-radius:16px;margin-bottom:12px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:linear-gradient(90deg,rgba(239,68,68,.25),rgba(249,115,22,.2));border:1px solid rgba(239,68,68,.6);animation:ghGlow 1.8s infinite}',
        '.gh-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.gh-tabs button{padding:9px 16px;border-radius:20px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#cbd5e1;font-weight:700;cursor:pointer}.gh-tabs button.on{background:#e8a33d;color:#2a1a00;border:0}',
        '.gh-bill{display:flex;flex-direction:column;gap:6px}.gh-bill h4{margin:0;font-size:1.05rem}.gh-bill p{margin:0;color:#cbd5e1;font-size:.86rem}',
        '.gh-steps{display:flex;gap:6px;margin:6px 0 14px;flex-wrap:wrap}.gh-steps div{flex:1;min-width:110px;padding:8px;border-radius:12px;text-align:center;font-size:.8rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#94a3b8}.gh-steps div.on{background:rgba(232,163,61,.22);color:#fff;border-color:#e8a33d;animation:ghPulse 1.6s infinite}.gh-steps div.ok{background:rgba(34,197,94,.2);color:#bbf7d0;border-color:#22c55e}.gh-steps div.bad{background:rgba(239,68,68,.2);color:#fecaca;border-color:#ef4444}',
        '.gh-hall{position:relative;border-radius:22px;padding:10px;background:radial-gradient(ellipse at 50% 100%,rgba(250,204,21,.12),rgba(0,0,0,.45) 70%);border:1px solid rgba(255,255,255,.18)}.gh-hall.ls{border-color:#16a34a;box-shadow:0 0 30px rgba(22,163,74,.25) inset}.gh-hall.rs{border-color:#b91c1c;box-shadow:0 0 30px rgba(185,28,28,.25) inset}',
        '.gh-hemi circle{transition:fill .25s,r .25s}.gh-hemi{width:100%;display:block}',
        '.gh-vote{display:flex;justify-content:center;gap:26px;flex-wrap:wrap;margin:10px 0;text-align:center}.gh-vote b{display:block;font-size:2.4rem;font-variant-numeric:tabular-nums}.gh-vote small{letter-spacing:2px;color:#94a3b8}',
        '.gh-order{position:absolute;left:0;right:0;top:12px;text-align:center;font-size:1.6rem;font-weight:900;letter-spacing:4px;color:#fde68a;text-shadow:0 2px 12px #000;animation:ghPop .6s ease both;pointer-events:none}',
        '.gh-legend{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;font-size:.8rem;color:#cbd5e1;margin-top:6px}.gh-legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px}',
        '.gh-res{padding:16px;border-radius:18px;text-align:center;animation:ghPop .6s ease both;margin:12px 0}.gh-res.ok{background:rgba(34,197,94,.18);border:1px solid #22c55e}.gh-res.no{background:rgba(239,68,68,.18);border:1px solid #ef4444}.gh-res h2{margin:0;font-size:1.7rem}',
        '.gh-opt{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);margin-bottom:8px;cursor:pointer;transition:background .2s}.gh-opt:hover{background:rgba(255,255,255,.14)}.gh-opt.on{background:rgba(232,163,61,.2);border-color:#e8a33d}.gh-opt small{color:#94a3b8;display:block}',
        '.gh-modal{position:fixed;inset:0;z-index:9600;background:rgba(3,8,14,.82);display:flex;align-items:center;justify-content:center;padding:14px}.gh-mbox{width:min(640px,96vw);max-height:92vh;overflow:auto;background:#0f172a;border:1px solid #e8a33d;border-radius:20px;padding:20px;animation:ghPop .4s ease both}',
        '.gh-in{width:100%;padding:11px;border-radius:12px;border:1px solid #334155;background:#0b1220;color:#fff;font-family:inherit}',
        '.gh-sl{display:grid;grid-template-columns:130px 1fr 54px;gap:10px;align-items:center;margin:8px 0;font-size:.9rem}.gh-sl input{width:100%}',
        '.gh-co{display:grid;grid-template-columns:44px 1fr 1.2fr;gap:12px;align-items:center;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);margin-bottom:8px;cursor:pointer;transition:transform .2s}.gh-co:hover{transform:translateX(4px)}.gh-co .f{font-size:1.9rem}.gh-co .b{height:10px;border-radius:6px;background:rgba(255,255,255,.1);overflow:hidden}.gh-co .b i{display:block;height:100%;border-radius:6px;transition:width 1s}',
        '.gh-news{font-size:.88rem;color:#cbd5e1}.gh-news div{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07);animation:ghUp .4s ease both}',
        '.gh-conf{position:absolute;inset:0;overflow:hidden;pointer-events:none}.gh-conf i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;animation:ghFall 3.4s linear infinite}',
        '.gh-sign{width:100%;max-width:320px;display:block;margin:10px auto}.gh-sign path{fill:none;stroke:#fde68a;stroke-width:3;stroke-linecap:round;stroke-dasharray:300;animation:ghSign 2.2s ease forwards}',
        '.gh-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9700;background:#0f172a;border:1px solid #e8a33d;border-radius:14px;padding:12px 20px;color:#e2e8f0;animation:ghPop .4s ease both;max-width:92vw}'
    ].join('\n');

    function ensureRoot() {
        if (!$('gh-css')) { var st = document.createElement('style'); st.id = 'gh-css'; st.textContent = CSS; document.head.appendChild(st); }
        var r = $('gh-root');
        if (!r) { r = document.createElement('div'); r.id = 'gh-root'; document.body.appendChild(r); }
        return r;
    }
    function toast(t) {
        var old = $('gh-toast'); if (old) old.remove();
        var d = document.createElement('div'); d.id = 'gh-toast'; d.className = 'gh-toast'; d.innerHTML = t; document.body.appendChild(d);
        setTimeout(function () { var e = $('gh-toast'); if (e) e.remove(); }, 3200);
    }
    function confetti(n) {
        var cols = ['#f0b04a', '#58c49a', '#8aa4ff', '#e0674a', '#ffffff'], h = '';
        for (var i = 0; i < n; i++) h += '<i style="left:' + Math.round(Math.random() * 100) + '%;background:' + cols[i % 5] + ';animation-delay:' + (Math.random() * 3).toFixed(2) + 's;animation-duration:' + (2.6 + Math.random() * 2).toFixed(2) + 's"></i>';
        return '<div class="gh-conf">' + h + '</div>';
    }
    function avImg(name, party, css) {
        var ph = null; try { ph = window.CareerMode && CareerMode.photoFor && CareerMode.photoFor(name); } catch (e) {}
        if (ph) return '<img src="' + ph + '" alt="" style="' + css + '">';
        var slug = typeof s22Slug === 'function' ? s22Slug(name) : String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_');
        return '<img src="Images/Leaders/' + slug + '.jpg" data-s="' + slug + '" data-i="0" data-fb="' + esc(avatarSvg(name, party)) + '" onerror="GH.imgErr(this)" alt="" style="' + css + '">';
    }
    function avatar(name, party) {
        try { var ph = window.CareerMode && CareerMode.photoFor && CareerMode.photoFor(name); if (ph) return ph; } catch (e) {}
        return avatarSvg(name, party);
    }
    function avatarSvg(name, party) {
        var ini = String(name || '?').split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(), c = pcol(party);
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c + '"/><stop offset="1" stop-color="#0b1220"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="60" cy="46" r="20" fill="rgba(255,255,255,.85)"/><path d="M20 120c4-30 22-42 40-42s36 12 40 42z" fill="rgba(255,255,255,.85)"/><text x="60" y="112" text-anchor="middle" font-size="16" font-weight="700" fill="' + '#0b1220' + '">' + esc(ini) + '</text></svg>';
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
    function presInfo() {
        try {
            var r = (typeof P38 !== 'undefined' && P38.rec) || (typeof p38Load === 'function' ? p38Load() : null);
            if (r && r.term) { var nm = r.term.name || (r.term.c && r.term.c.name) || (r.term.cand && r.term.cand.name); if (nm) return { name: nm, party: r.term.party || (r.term.c && r.term.c.party) || null }; }
        } catch (e) {}
        return { name: 'Rashtrapati', party: null };
    }

    // ---------------------------------------------------------------- render: home
    function gauge(val, label, col, sub) {
        var L = 251.3, p = clamp(val, 0, 100) / 100;
        return '<div class="gh-gauge"><svg viewBox="0 0 200 118"><path class="bg" d="M20 100 A80 80 0 0 1 180 100"/><path class="fg" d="M20 100 A80 80 0 0 1 180 100" style="stroke:' + col + ';stroke-dasharray:' + (L * p).toFixed(1) + ' ' + L + '"/></svg><div class="v">' + Math.round(val) + '<small>%</small></div><div class="l">' + label + '</div><div class="s">' + sub + '</div></div>';
    }
    function meterRow(label, val, pct, col, good, unit, key) {
        var d = G.delta[key] || 0, ar = d ? '<span class="' + ((d > 0) === good ? 'up' : 'dn') + '">' + (d > 0 ? '\u25B2' : '\u25BC') + ' ' + Math.abs(d) + '</span>' : '';
        return '<div class="gh-m"><div class="t"><span>' + label + '</span><b>' + val + unit + ' ' + ar + '</b></div><div class="b"><i style="width:' + clamp(pct, 0, 100) + '%;background:' + col + '"></i></div></div>';
    }
    function homeHtml() {
        var r = houseRec(), c = lsCamps(r), rs = rsCamps(r), pm = r.pm, yrs = G.year - G.startYear + 1;
        var trend = function (k) { var h = G.hist[k]; if (h.length < 2) return 'Abhi shuruaat'; var d = h[h.length - 1] - h[0]; return d >= 0 ? '\u25B2 badh rahi hai' : '\u25BC ghat rahi hai'; };
        var h = '<div class="gh-wrap">' +
            '<div class="gh-top"><button class="gh-btn" onclick="GH.close()">\u2190 Wapas</button><div><h1>Sarkar</h1><small>Saal ' + G.year + ' \u00B7 Lok Sabha ka ' + yrs + '-va saal \u00B7 ' + esc(pm.party) + ' ki sarkar</small></div>' +
            '<div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap"><span class="gh-chip">\uD83C\uDF10 GDP <b>$' + (G.gdpSize || 4).toFixed(2) + ' trillion</b></span><span class="gh-chip">\u2B50 Rajnitik poonji <b>' + G.cap + '</b></span></div></div>';
        if (G.fallen) h += '<div class="gh-banner"><b>Sarkar gir chuki hai.</b><span>Dashboard se naya Lok Sabha chunav khelo.</span></div>';
        if (G.ended && !G.fallen) h += '<div class="gh-banner" style="animation:none;background:rgba(232,163,61,.18);border-color:#e8a33d"><b>Lok Sabha ka 5 saal ka kaarykaal poora.</b><span>Dashboard se naya Lok Sabha chunav khelo.</span></div>';
        if (G.noconf) h += '<div class="gh-banner"><span><b>\u26A0 Avishwas prastav!</b> Vipaksh ne Lok Sabha mein sarkar ke khilaf prastav diya hai.</span><button class="gh-btn red" onclick="GH.noconfStart()">SAAMNA KARO</button></div>';
        if (G.event) h += '<div class="gh-banner"><span><b>\u26A0 ' + (G.event.type === 'protest' ? 'Virodh pradarshan' : 'Kharab narrative') + ':</b> ' + esc(G.event.text) + '</span><button class="gh-btn red" onclick="GH.eventOpen()">SAMBHALO</button></div>';
        h += '<div class="gh-grid g3">' +
            '<div class="gh-card"><h3>PRADHANMANTRI</h3><div class="gh-pm" onclick="GH.pmOpen()">' + avImg(pm.name, pm.party, '') + '<div><b>' + esc(pm.name) + '</b><small>' + esc(pm.party) + '</small><small>' + esc(pm.st || '') + (pm.pc ? ' | ' + esc(pm.pc) : '') + '</small><small style="color:#f3dca0;margin-top:6px">Profile dekhne ke liye dabao \u203A</small></div></div></div>' +
            '<div class="gh-card"><h3>JANTA KA MOOD</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + gauge(G.happy, 'Janta ki khushi', G.happy >= 50 ? '#22c55e' : '#ef4444', trend('happy')) + gauge(G.pmPop, 'PM ki popularity', G.pmPop >= 50 ? '#e8a33d' : '#f59e0b', trend('pmPop')) + '</div></div>' +
            '<div class="gh-card"><h3>SANSAD</h3><div style="display:grid;gap:8px"><div><small style="color:#94a3b8">LOK SABHA</small><div class="gh-m"><div class="t"><span>Sarkar ' + c.gov + '</span><span>Vipaksh ' + c.opp + ' | Anya ' + c.oth + '</span></div><div class="b" style="display:flex"><i style="width:' + (c.gov / 543 * 100) + '%;background:#3b82f6"></i><i style="width:' + (c.oth / 543 * 100) + '%;background:#94a3b8"></i><i style="width:' + (c.opp / 543 * 100) + '%;background:#f97316"></i></div></div></div>' +
            '<div><small style="color:#94a3b8">RAJYA SABHA</small><div class="gh-m"><div class="t"><span>Sarkar ' + rs.gov + '</span><span>Vipaksh ' + rs.opp + ' | Anya ' + rs.oth + '</span></div><div class="b" style="display:flex"><i style="width:' + (rs.gov / 245 * 100) + '%;background:#3b82f6"></i><i style="width:' + (rs.oth / 245 * 100) + '%;background:#94a3b8"></i><i style="width:' + (rs.opp / 245 * 100) + '%;background:#f97316"></i></div></div></div>' +
            '<div style="color:#cbd5e1;font-size:.85rem">Rashtrapati: <b>' + esc(presInfo().name) + '</b></div><div style="color:#94a3b8;font-size:.8rem">Bahumat ke liye 272 (LS) | 123 (RS)</div></div></div></div>' +
            '<div class="gh-grid g4">' +
            '<div class="gh-card"><h3>ARTHVYAVASTHA</h3>' + meterRow('Mahangai (CPI)', r1(cpi()), (cpi() - 1) / 13 * 100, cpi() > 7 ? '#ef4444' : (cpi() > 5 ? '#f59e0b' : '#22c55e'), false, '%', 'cpi') + '</div>' +
            '<div class="gh-card"><h3>ROZGAR</h3>' + meterRow('Yuva berozgari', r1(unemp()), unemp() / 40 * 100, unemp() > 24 ? '#ef4444' : (unemp() > 18 ? '#f59e0b' : '#22c55e'), false, '%', 'unemp') + '</div>' +
            '<div class="gh-card"><h3>GDP VRIDDHI</h3>' + meterRow('GDP', r1(G.gdp), (G.gdp + 3) / 15 * 100, G.gdp >= 5 ? '#e8a33d' : '#f59e0b', true, '%', 'gdp') + '</div>' +
            '<div class="gh-card"><h3>VIDESH NEETI</h3>' + meterRow('Sambandh', fpScore(), fpScore(), fpScore() >= 55 ? '#c9742c' : '#f59e0b', true, '', 'fp') + '</div></div>' +
            '<div class="gh-grid g4">' +
            '<button class="gh-tile" onclick="GH.go(\'bills\')"' + (G.fallen || G.ended ? ' disabled' : '') + '><div class="ic">\uD83D\uDCDC</div><b>Bill pesh karo</b><small>Normal, Samvidhan sanshodhan, ghoshna-patra ya apna bill</small></button>' +
            '<button class="gh-tile" onclick="GH.go(\'budget\')"' + (G.fallen || G.ended || G.budgetYear === G.year ? ' disabled' : '') + '><div class="ic">\uD83D\uDCB9</div><b>Budget pesh karo</b><small>' + (G.budgetYear === G.year ? 'Is saal ka budget pesh ho chuka' : 'Saal mein ek baar') + '</small></button>' +
            '<button class="gh-tile" onclick="GH.go(\'foreign\')"><div class="ic">\uD83C\uDF0D</div><b>Videsh neeti</b><small>Yatra, vyapar, bayan, mulakat | ' + G.fp.pts + ' mauke bache</small></button>' +
            '<button class="gh-tile" onclick="GH.nextYear()"' + (G.fallen || G.ended ? ' disabled' : '') + '><div class="ic">\u23ED</div><b>Agla saal</b><small>Naya saal shuru. Mahangai, rozgar, ghatnayein badlegi</small></button></div>' +
            '<div class="gh-grid g2"><div class="gh-card"><h3>SAMACHAR</h3><div class="gh-news">' + (G.log.length ? G.log.slice(0, 8).map(function (l) { return '<div><b style="color:#f3dca0">' + l.y + '</b> ' + l.t + '</div>'; }).join('') : '<div>Abhi koi khabar nahi. Bill ya budget pesh karke shuruaat karo.</div>') + '</div></div>' +
            '<div class="gh-card"><h3>SARKAR KA RECORD</h3><div class="gh-news"><div>Bill paas: <b>' + G.stats.passed + '</b> | Bill fail: <b>' + G.stats.failed + '</b></div><div>Virodh pradarshan jhele: <b>' + G.stats.protests + '</b></div><div>Press conference: <b>' + G.pm.press + '</b> | Jan sampark: <b>' + G.pm.rallies + '</b></div>' +
            '<div style="margin-top:10px"><button class="gh-btn" style="padding:6px 12px;font-size:.78rem" onclick="GH.devNoconf()">Test: avishwas prastav laao</button> <button class="gh-btn" style="padding:6px 12px;font-size:.78rem" onclick="GH.devProtest()">Test: virodh pradarshan laao</button> <button class="gh-btn" style="padding:6px 12px;font-size:.78rem" onclick="GH.devReset()">Sarkar reset</button></div></div></div></div></div>';
        return h;
    }

    // ---------------------------------------------------------------- render: bills
    function billCard(b) {
        return '<div class="gh-card gh-bill"><h4>' + esc(b.name) + '</h4><p>' + esc(b.desc) + '</p><div>' + effTags(b.eff) + '<span class="gh-tag" style="background:' + (b.type === 'amend' ? 'rgba(168,85,247,.3)' : 'rgba(255,255,255,.1)') + '">' + (b.type === 'amend' ? 'Samvidhan sanshodhan (2/3 chahiye)' : 'Saadharan bill') + '</span></div>' +
            '<div style="font-size:.8rem;color:#94a3b8">' + oppLabel(b) + ' | Janta: ' + (b.pub > 0.3 ? 'pasand karegi' : (b.pub > -0.1 ? 'mila-jula' : 'naraaz ho sakti hai')) + '</div><button class="gh-btn go" style="margin-top:6px" onclick="GH.billStart(\'' + b.id + '\')">PESH KARO</button></div>';
    }
    function billsHtml() {
        var tabs = [['normal', 'Saadharan bill'], ['amend', 'Samvidhan sanshodhan'], ['manifesto', 'Ghoshna-patra ke vaade'], ['custom', 'Apna bill banao']];
        var h = '<div class="gh-wrap"><div class="gh-top"><button class="gh-btn" onclick="GH.go(\'home\')">\u2190 Sarkar</button><div><h1>Bill</h1><small>Kaun sa bill sansad mein pesh karna hai?</small></div></div><div class="gh-tabs">' +
            tabs.map(function (t) { return '<button class="' + (V.tab === t[0] ? 'on' : '') + '" onclick="GH.tab(\'' + t[0] + '\')">' + t[1] + '</button>'; }).join('') + '</div>';
        if (V.tab === 'custom') {
            var b = V.builder, cats = Object.keys(CAT);
            h += '<div class="gh-card"><h3>APNA BILL BANAO</h3><div class="gh-grid g2"><div><label style="color:#94a3b8;font-size:.8rem">Bill ka naam</label><input id="gh-bn" class="gh-in" placeholder="jaise: Gramin Sadak Vikas Bill" value="' + esc(b.name) + '" oninput="GH.bname(this.value)"></div>' +
                '<div><label style="color:#94a3b8;font-size:.8rem">Kis kshetra ka</label><select class="gh-in" onchange="GH.bcat(this.value)">' + cats.map(function (c) { return '<option' + (c === b.cat ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></div>' +
                '<div><label style="color:#94a3b8;font-size:.8rem">Prakar</label><select class="gh-in" onchange="GH.btype(this.value)"><option value="normal"' + (b.type === 'normal' ? ' selected' : '') + '>Saadharan bill</option><option value="amend"' + (b.type === 'amend' ? ' selected' : '') + '>Samvidhan sanshodhan bill</option></select></div>' +
                '<div><label style="color:#94a3b8;font-size:.8rem">Bill kitna bada hai</label><select class="gh-in" onchange="GH.blvl(this.value)"><option value="1"' + (b.lvl == 1 ? ' selected' : '') + '>Chhota (kam asar, kam virodh)</option><option value="2"' + (b.lvl == 2 ? ' selected' : '') + '>Madhyam</option><option value="3"' + (b.lvl == 3 ? ' selected' : '') + '>Bada (zyada asar, zyada virodh)</option></select></div></div>' +
                '<div style="margin-top:12px">' + (function () { var x = customBill(); return '<div style="color:#cbd5e1;font-size:.9rem">Anumaanit asar: ' + effTags(x.eff) + '<br>' + oppLabel(x) + ' | Janta: ' + (x.pub > 0.3 ? 'pasand karegi' : (x.pub > -0.1 ? 'mila-jula' : 'naraaz ho sakti hai')) + '</div>'; })() + '</div>' +
                '<div style="margin-top:12px"><button class="gh-btn go" onclick="GH.billCustom()">BILL BANAO AUR PESH KARO</button></div></div>';
        } else {
            h += '<div class="gh-grid g2">' + BILLS[V.tab].map(billCard).join('') + '</div>';
            if (V.tab === 'manifesto' && !(window.CareerMode && CareerMode.hasParty && CareerMode.hasParty())) h += '<div class="gh-card" style="color:#94a3b8">Ye aapke ghoshna-patra ke vaade hain (State mode ke ghoshna-patra jaise).</div>';
        }
        return h + '</div>';
    }
    function customBill() {
        var b = V.builder, c = CAT[b.cat], l = +b.lvl, m = l / 2, amend = b.type === 'amend';
        return {
            id: 'c' + Date.now(), name: b.name.trim() || 'Mera Bill', type: b.type, cat: b.cat, desc: b.cat + ' kshetra ka apna bill.',
            pub: clamp(c.pub + (l - 2) * 0.1 - (amend ? 0.05 : 0), -1, 1), opp: clamp(c.opp - (l - 2) * 0.12 - (amend ? 0.1 : 0), 0.03, 0.95),
            ally: clamp(0.85 - c.con * 0.3 - (l - 2) * 0.08, 0.3, 0.95), con: clamp(c.con * (0.6 + 0.4 * m) + (amend ? 0.1 : 0), 0.05, 0.95),
            eff: { happy: r1(c.happy * m), pm: r1(c.pm * m), infl: r1(c.infl * m), jobs: r1(c.jobs * m), gdp: r1(c.gdp * m) }
        };
    }

    // ---------------------------------------------------------------- render: bill flow
    function stepsHtml(b) {
        var st = b.stage, order = [['ls', 'Lok Sabha'], ['rs', 'Rajya Sabha'], ['pres', 'Rashtrapati'], ['pub', 'Janta']];
        var done = { ls: b.ls && b.ls.pass, rs: b.rs && b.rs.pass, pres: b.signed, pub: b.reaction };
        var cur = (st === 'ls_prep' || st === 'ls_vote') ? 'ls' : ((st === 'rs_prep' || st === 'rs_vote') ? 'rs' : (st === 'pres' ? 'pres' : 'pub'));
        return '<div class="gh-steps">' + order.map(function (o) {
            var cls = done[o[0]] ? 'ok' : (b.failedAt === o[0] ? 'bad' : (cur === o[0] ? 'on' : ''));
            return '<div class="' + cls + '">' + (done[o[0]] ? '\u2713 ' : '') + o[1] + '</div>';
        }).join('') + '</div>';
    }
    function billFlowHtml() {
        var b = G.bill; if (!b) return '<div class="gh-wrap"><div class="gh-card">Koi bill chal nahi raha.</div></div>';
        var r = houseRec(), h = '<div class="gh-wrap"><div class="gh-top"><button class="gh-btn" onclick="GH.go(\'home\')">\u2190 Sarkar</button><div><h1>' + esc(b.name) + '</h1><small>' + (b.type === 'amend' ? 'Samvidhan sanshodhan bill \u00B7 2/3 bahumat chahiye' : 'Saadharan bill \u00B7 simple bahumat') + '</small></div></div>' + stepsHtml(b);
        var st = b.stage;
        if (st === 'ls_prep' || st === 'rs_prep') h += prepHtml(b, st === 'ls_prep' ? 'ls' : 'rs', r);
        else if (st === 'ls_vote' || st === 'rs_vote') h += voteHtml(b, st === 'ls_vote' ? 'ls' : 'rs', r);
        else if (st === 'ls_done' || st === 'rs_done') h += doneHtml(b, st === 'ls_done' ? 'ls' : 'rs');
        else if (st === 'pres') h += presHtml(b);
        else if (st === 'public') h += publicHtml(b);
        else h += '<div class="gh-card">Bill band.</div>';
        return h + '</div>';
    }
    function supportEstimate(b, chamber, r) {
        var camps = chamber === 'ls' ? lsCamps(r) : rsCamps(r), p = probs(b, b.opts), main = camps.main * p.main, ally = (camps.gov - camps.main) * p.ally, op = camps.opp * p.opp, ot = camps.oth * p.oth;
        var yes = main + ally + op + ot, no = camps.total - yes, need = b.type === 'amend' ? Math.ceil((camps.total) * 2 / 3) : Math.floor(camps.total / 2) + 1;
        return { yes: Math.round(yes), need: need, camps: camps };
    }
    function prepHtml(b, ch, r) {
        var e = supportEstimate(b, ch, r), o = b.opts, name = ch === 'ls' ? 'Lok Sabha' : 'Rajya Sabha', ok = e.yes >= e.need;
        var opt = function (k, t, sub, cost) { return '<div class="gh-opt' + (o[k] ? ' on' : '') + '" onclick="GH.opt(\'' + k + '\')"><span><b>' + t + '</b><small>' + sub + '</small></span><b>' + (o[k] ? '\u2713 Ho gaya' : cost) + '</b></div>'; };
        return '<div class="gh-grid g2"><div class="gh-card"><h3>' + name.toUpperCase() + ' MEIN PESH KARNE SE PEHLE</h3>' +
            '<div class="gh-m"><div class="t"><span>Anumaanit haan vote</span><b>' + e.yes + ' / ' + e.camps.total + '</b></div><div class="b"><i style="width:' + clamp(e.yes / e.camps.total * 100, 0, 100) + '%;background:' + (ok ? '#22c55e' : '#f59e0b') + '"></i></div></div>' +
            '<div style="color:#94a3b8;font-size:.85rem;margin-bottom:10px">Paas hone ke liye kam se kam <b>' + e.need + '</b> haan vote chahiye. ' + (ok ? 'Abhi paas hone ke asaar acche hain.' : 'Abhi kam padta dikh raha hai, taiyari karo.') + '</div>' +
            opt('whip', 'Whip jaari karo', 'Sarkari sansadon ko vote ka aadesh (+ sarkar ke vote)', '1 poonji') +
            opt('talk', 'Saathi dalon se baat', 'Gathbandhan ke dalon ko manao (+ saathi vote)', '2 poonji') +
            opt('deal', 'Vipaksh se sauda', 'Kuch vipaksh sansad saath aa sakte hain (PM popularity \u22122)', '2 poonji') +
            '<div style="color:#94a3b8;font-size:.8rem;margin-top:6px">Rajnitik poonji: <b>' + G.cap + '</b></div></div>' +
            '<div class="gh-card"><h3>BILL KA ASAR</h3><div>' + effTags(b.eff) + '</div><p style="color:#cbd5e1;font-size:.9rem">' + esc(b.desc) + '</p><div style="margin-top:8px;font-size:.85rem;color:#94a3b8">' + oppLabel(b) + '.</div>' +
            '<div style="margin-top:16px"><button class="gh-btn go" onclick="GH.voteStart()">' + name.toUpperCase() + ' MEIN PESH KARO \u2192</button></div></div></div>';
    }
    function voteHtml(b, ch, r) {
        var camps = ch === 'ls' ? lsCamps(r) : rsCamps(r), id = 'gh-h';
        return '<div class="gh-hall ' + ch + '"><div class="gh-order" id="gh-order">ORDER! ORDER!</div>' + hemiSvg(camps, ch, id, hallColors(ch)) +
            '<div class="gh-vote"><div><b id="gh-y" style="color:#4ade80">0</b><small>HAAN</small></div><div><b id="gh-n" style="color:#f87171">0</b><small>NAHI</small></div><div><b id="gh-a" style="color:#94a3b8">0</b><small>GAIRHAAZIR</small></div></div>' +
            '<div class="gh-legend"><span><i style="background:#3b82f6"></i>Sarkar</span><span><i style="background:#94a3b8"></i>Anya</span><span><i style="background:#f97316"></i>Vipaksh</span><span><i style="background:#22c55e"></i>Haan</span><span><i style="background:#ef4444"></i>Nahi</span></div></div><div id="gh-vres"></div>';
    }
    function doneHtml(b, ch) {
        var res = b[ch], ok = res.pass, name = ch === 'ls' ? 'Lok Sabha' : 'Rajya Sabha', next = ch === 'ls' ? 'GH.toRs()' : 'GH.toPres()';
        return '<div class="gh-res ' + (ok ? 'ok' : 'no') + '"><h2>' + (ok ? name + ' se bill PAAS!' : name + ' mein bill GIR gaya') + '</h2><div style="color:#cbd5e1">Haan ' + res.yes + ' | Nahi ' + res.no + ' | Gairhaazir ' + res.abs + (b.type === 'amend' ? ' | 2/3 ke liye ' + Math.ceil((res.yes + res.no) * 2 / 3) + ' chahiye the' : '') + '</div></div>' +
            (ok ? '<div style="text-align:center"><button class="gh-btn go" onclick="' + next + '">' + (ch === 'ls' ? 'RAJYA SABHA MEIN BHEJO' : 'RASHTRAPATI KE PAAS BHEJO') + ' \u2192</button></div>' : '<div style="text-align:center"><button class="gh-btn red" onclick="GH.billClose()">BILL BAND KARO</button></div>');
    }
    function presHtml(b) {
        var p = presInfo();
        return '<div class="gh-card" style="text-align:center"><h3>RASHTRAPATI KI MANZOORI</h3><div style="font-size:3rem">\uD83C\uDFDB</div><b style="font-size:1.4rem">' + esc(p.name) + '</b>' + (p.party ? '<div style="color:#94a3b8">' + esc(p.party) + '</div>' : '') +
            '<p style="color:#cbd5e1">Bill Rashtrapati ke paas hastakshar ke liye pahunch gaya hai.</p>' +
            (b.presDone ? '' : '<button class="gh-btn go" onclick="GH.presSign()">HASTAKSHAR KE LIYE BHEJO</button>') + '<div id="gh-sign"></div></div>';
    }
    function publicHtml(b) {
        var r = b.reaction; if (!r) return '';
        var tone = r.tone, mood = tone === 'khush' ? ['\uD83D\uDE0A', 'Janta khush hai!', 'ok'] : (tone === 'naraaz' ? ['\uD83D\uDE20', 'Janta naraaz hai', 'no'] : ['\uD83D\uDE10', 'Janta ki mili-juli pratikriya', 'ok']);
        return '<div class="gh-res ' + mood[2] + '" style="position:relative;overflow:hidden">' + (tone === 'khush' ? confetti(30) : '') + '<div style="font-size:3.4rem;animation:ghPop .6s ease both">' + mood[0] + '</div><h2>' + mood[1] + '</h2><p style="color:#cbd5e1">' + esc(r.line) + '</p></div>' +
            '<div class="gh-card"><h3>ASAR</h3>' + r.changes.map(function (c) { return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.08)"><span>' + c.l + '</span><b class="' + (c.good ? 'up' : 'dn') + '">' + c.t + '</b></div>'; }).join('') + '</div>' +
            '<div style="text-align:center;margin-top:12px"><button class="gh-btn go" onclick="GH.billClose()">SARKAR PAGE PAR WAPAS</button></div>';
    }

    // ---------------------------------------------------------------- render: budget
    var SECT = [['kisan', 'Kisan / Krishi', 12], ['shiksha', 'Shiksha', 12], ['swasthya', 'Swasthya', 10], ['raksha', 'Raksha', 16], ['infra', 'Sadak, rail, infra', 14], ['rozgar', 'Rozgar yojna', 8], ['subsidy', 'Subsidy / DBT', 8]];
    function budgetInit() {
        var a = {}; SECT.forEach(function (s) { a[s[0]] = s[2]; });
        V.budget = { a: a, inc: 0, gst: 0, stage: 'edit' };
    }
    function bTotal() { var t = 0; SECT.forEach(function (s) { t += +V.budget.a[s[0]]; }); return t; }
    function deficit() {
        var b = V.budget, a = b.a, d = 5.5 + (a.subsidy - 8) * 0.25 + (a.rozgar - 8) * 0.1 + (a.infra - 14) * 0.06 + (a.kisan - 12) * 0.05;
        d += (b.inc < 0 ? 0.6 : (b.inc > 0 ? -0.6 : 0)) + (b.gst < 0 ? 0.4 : (b.gst > 0 ? -0.4 : 0));
        return r1(d);
    }
    function budgetEff() {
        var b = V.budget, a = b.a, d = {};
        var k = function (id) { return a[id] - SECT.filter(function (s) { return s[0] === id; })[0][2]; };
        var def = deficit();
        d.happy = k('kisan') * 0.35 + k('swasthya') * 0.3 + k('subsidy') * 0.45 + k('shiksha') * 0.15 + (b.inc < 0 ? 3 : (b.inc > 0 ? -4 : 0)) + (b.gst < 0 ? 1.5 : (b.gst > 0 ? -2 : 0));
        d.jobs = k('rozgar') * 0.8 + k('infra') * 0.5 + k('shiksha') * 0.2;
        d.gdp = k('infra') * 0.12 + k('shiksha') * 0.06 - k('raksha') * 0.03 + (b.inc < 0 ? 0.2 : (b.inc > 0 ? -0.1 : 0)) - Math.max(0, def - 6.5) * 0.15;
        d.infl = k('subsidy') * 0.12 + k('rozgar') * 0.08 - k('kisan') * 0.04 + (def - 5.5) * 0.8 + (b.inc > 0 ? -2 : 0) + (b.gst > 0 ? -1 : 0);
        d.pm = k('raksha') * 0.1 + (d.happy > 2 ? 1.5 : (d.happy < -2 ? -2 : 0));
        Object.keys(d).forEach(function (x) { d[x] = r1(d[x]); });
        return d;
    }
    function budgetHtml() {
        if (!V.budget) budgetInit();
        var b = V.budget, tot = bTotal(), def = deficit(), e = budgetEff();
        var h = '<div class="gh-wrap"><div class="gh-top"><button class="gh-btn" onclick="GH.go(\'home\')">\u2190 Sarkar</button><div><h1>Budget ' + G.year + '</h1><small>Saal mein ek baar. Kul 100% baantna zaroori hai.</small></div></div>';
        if (b.stage === 'speech') return h + budgetSpeechHtml() + '</div>';
        h += '<div class="gh-grid g2"><div class="gh-card"><h3>KHARCH KA BATWARA</h3>' + SECT.map(function (s) {
            return '<div class="gh-sl"><span>' + s[1] + '</span><input type="range" min="0" max="35" value="' + b.a[s[0]] + '" oninput="GH.bset(\'' + s[0] + '\',this.value)"><b id="gh-bv-' + s[0] + '">' + b.a[s[0]] + '%</b></div>';
        }).join('') + '<div class="gh-sl"><span style="color:#94a3b8">Karz / byaaj (baaki)</span><span></span><b id="gh-brest" style="color:' + (tot > 100 ? '#f87171' : '#94a3b8') + '">' + (100 - tot) + '%</b></div><div id="gh-btot" style="color:' + (tot === 100 ? '#4ade80' : '#fbbf24') + ';font-size:.9rem">Kul: ' + tot + '% ' + (tot === 100 ? '(theek hai)' : '(100% karna hai)') + '</div>' +
            '<div style="margin-top:8px"><button class="gh-btn" style="padding:6px 14px;font-size:.8rem" onclick="GH.bauto()">Auto-balance (default)</button></div></div>' +
            '<div class="gh-card"><h3>TAX</h3><div class="gh-opt' + (b.inc < 0 ? ' on' : '') + '" onclick="GH.btax(\'inc\',-1)"><span><b>Income tax kam karo</b><small>Khushi +, ghata badhega</small></span></div><div class="gh-opt' + (b.inc === 0 ? ' on' : '') + '" onclick="GH.btax(\'inc\',0)"><span><b>Income tax jaisa hai waisa</b></span></div><div class="gh-opt' + (b.inc > 0 ? ' on' : '') + '" onclick="GH.btax(\'inc\',1)"><span><b>Income tax badhao</b><small>Ghata kam, janta naraaz</small></span></div>' +
            '<div class="gh-opt' + (b.gst < 0 ? ' on' : '') + '" onclick="GH.btax(\'gst\',-1)"><span><b>GST kam karo</b></span></div><div class="gh-opt' + (b.gst === 0 ? ' on' : '') + '" onclick="GH.btax(\'gst\',0)"><span><b>GST jaisa hai waisa</b></span></div><div class="gh-opt' + (b.gst > 0 ? ' on' : '') + '" onclick="GH.btax(\'gst\',1)"><span><b>GST badhao</b></span></div>' +
            '<div style="margin-top:10px" id="gh-bsum">' + budgetSummary(def, e) + '</div><div style="margin-top:12px"><button class="gh-btn go" id="gh-bgo" onclick="GH.bgo()"' + (tot !== 100 ? ' disabled' : '') + '>BUDGET PESH KARO \u2192</button></div></div></div></div>';
        return h;
    }
    function budgetSummary(def, e) {
        return '<div style="font-size:.9rem;color:#cbd5e1">Rajkoshiya ghata: <b style="color:' + (def > 6.5 ? '#f87171' : '#4ade80') + '">' + def + '% GDP</b></div><div style="margin-top:6px">' +
            [['Khushi', e.happy, true], ['Rozgar', e.jobs, true], ['GDP', e.gdp, true], ['Mahangai', e.infl, false]].map(function (x) { return '<span class="gh-tag">' + x[0] + ' <b class="' + ((x[1] > 0) === x[2] ? 'up' : (x[1] === 0 ? '' : 'dn')) + '">' + sgn(x[1]) + '</b></span>'; }).join('') + '</div>';
    }
    function finMin() {
        var r = houseRec(), c = (r.cab || []).filter(function (x) { return /vitt|finance/i.test(x.min); })[0];
        return c ? { name: c.name, party: c.party } : { name: r.pm.name, party: r.pm.party };
    }
    function budgetSpeechHtml() {
        var f = finMin(), e = budgetEff(), b = V.budget, lines = [];
        lines.push('Adhyaksh mahodaya, main ' + G.year + ' ka Aam Budget pesh karta/karti hun.');
        lines.push('Desh ki arthvyavastha ' + r1(G.gdp) + '% ki raftaar se aage badh rahi hai.');
        if (b.a.kisan > 12) lines.push('Annadata ke liye krishi par badha hua aavantan.');
        if (b.a.rozgar > 8) lines.push('Yuvaon ke liye rozgar yojna ko nayi takat.');
        if (b.a.infra > 14) lines.push('Sadak, rail aur infrastructure par record nivesh.');
        if (b.a.subsidy > 8) lines.push('Garibon ke liye subsidy aur DBT ka vistaar.');
        if (b.inc < 0) lines.push('Madhyam varg ko income tax mein badi rahat.'); else if (b.inc > 0) lines.push('Rajasva badhane ke liye income tax mein sanshodhan.');
        if (b.gst < 0) lines.push('GST dar mein katauti ka prastav.'); else if (b.gst > 0) lines.push('GST mein sudhaar ke saath dar vriddhi.');
        lines.push('Rajkoshiya ghata ' + deficit() + '% GDP par rakha gaya hai. Dhanyavaad.');
        return '<div class="gh-hall ls"><div style="padding:18px;text-align:center"><div style="font-size:2.6rem">\uD83D\uDCBC</div><b style="font-size:1.3rem">Vitt Mantri ' + esc(f.name) + '</b><div style="color:#94a3b8">' + esc(f.party) + '</div>' +
            '<div id="gh-speech" style="margin:16px auto;max-width:640px;text-align:left;min-height:180px;font-size:1.05rem;line-height:1.8"></div><div id="gh-bvote"></div></div></div>' +
            '<script type="text/plain" id="gh-sp-data">' + esc(JSON.stringify(lines)) + '<\/script>';
    }

    // ---------------------------------------------------------------- render: foreign policy
    function fpHtml() {
        var h = '<div class="gh-wrap"><div class="gh-top"><button class="gh-btn" onclick="GH.go(\'home\')">\u2190 Sarkar</button><div><h1>Videsh Neeti</h1><small>Sambandh score ' + fpScore() + ' \u00B7 Is saal ' + G.fp.pts + ' mauke bache</small></div></div><div class="gh-grid g2"><div>';
        h += COUNTRIES.map(function (c) {
            var v = G.fp.rel[c.n], col = v >= 65 ? '#22c55e' : (v >= 40 ? '#f59e0b' : '#ef4444');
            return '<div class="gh-co" onclick="GH.country(\'' + c.n + '\')" style="' + (V.country === c.n ? 'border-color:#e8a33d;background:rgba(232,163,61,.12)' : '') + '"><span class="f">' + c.f + '</span><b>' + c.n + '</b><div><div class="b"><i style="width:' + v + '%;background:' + col + '"></i></div><small style="color:#94a3b8">' + Math.round(v) + '/100 ' + (v >= 65 ? 'dost' : (v >= 40 ? 'theek-thaak' : 'tanav')) + '</small></div></div>';
        }).join('');
        h += '</div><div class="gh-card">';
        if (!V.country) h += '<h3>DESH CHUNO</h3><p style="color:#94a3b8">Baayein se kisi desh par dabao, phir uske saath kya karna hai chuno.</p>';
        else {
            var c = COUNTRIES.filter(function (x) { return x.n === V.country; })[0], v = G.fp.rel[c.n];
            var act = function (k, t, sub, cost) { return '<div class="gh-opt" onclick="GH.fp(\'' + k + '\')"><span><b>' + t + '</b><small>' + sub + '</small></span><b>' + cost + '</b></div>'; };
            h += '<h3>' + c.f + ' ' + c.n.toUpperCase() + '</h3><div class="gh-m"><div class="t"><span>Sambandh</span><b>' + Math.round(v) + '/100</b></div><div class="b"><i style="width:' + v + '%;background:' + (v >= 65 ? '#22c55e' : (v >= 40 ? '#f59e0b' : '#ef4444')) + '"></i></div></div>' +
                act('yatra', 'PM ki yatra', 'Wahan jaakar mulakat. Sambandh +9, PM popularity +1', '1 mauka | 3 Cr') +
                act('trade', 'Vyapar samjhauta', 'Vyapar badhega: GDP aur rozgar +', '1 mauka | 2 Cr') +
                act('meet', 'Neta se mulakat', 'Unke neta se baithak. Sambandh +4 se +9', '1 mauka') +
                act('bayan', 'Dostana bayan', 'Sarvajanik taareef. Sambandh +3', '0.5 mauka') +
                act('slam', 'Unke khilaf bolo', 'Sambandh \u221210. Dushman desh ke khilaf bolne se janta khush, dost ke khilaf naraaz', 'free') +
                act('sanction', 'Pratibandh / trade war', 'Sambandh \u221215, GDP kam, mahangai badhegi', '1 mauka');
        }
        return h + '</div></div></div>';
    }

    // ---------------------------------------------------------------- render: modals
    function modal(html) { var m = $('gh-modal'); if (m) m.remove(); var d = document.createElement('div'); d.id = 'gh-modal'; d.className = 'gh-modal'; d.innerHTML = '<div class="gh-mbox">' + html + '</div>'; document.body.appendChild(d); }
    function closeModal() { var m = $('gh-modal'); if (m) m.remove(); }
    function pmModal() {
        var r = houseRec(), pm = r.pm, act = clamp(Math.round(30 + G.pm.pressYear * 12 + G.pm.rallyYear * 10 + G.pm.press * 0.8 + G.pm.rallies * 0.6), 0, 100);
        modal('<div style="display:flex;gap:16px;align-items:center">' + avImg(pm.name, pm.party, 'width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid #f0b04a;background:#fff') + '<div><h2 style="margin:0">' + esc(pm.name) + '</h2><div style="color:#94a3b8">' + esc(pm.party) + ' | ' + esc(pm.st || '') + (pm.pc ? ', ' + esc(pm.pc) : '') + '</div><div style="margin-top:4px">' + logo(pm.party, 30) + '</div></div><button class="gh-btn" style="margin-left:auto" onclick="GH.closeModal()">\u2715</button></div>' +
            '<div style="margin-top:14px">' + meterRow('Popularity', Math.round(G.pmPop), G.pmPop, G.pmPop >= 50 ? '#e8a33d' : '#f59e0b', true, '%', 'pmPop') + meterRow('Janta kitni khush', Math.round(G.happy), G.happy, G.happy >= 50 ? '#22c55e' : '#ef4444', true, '%', 'happy') + meterRow('Sakriyta (kitne active)', act, act, '#c9742c', true, '%', 'act') + '</div>' +
            '<div class="gh-grid g2" style="margin-top:10px"><div class="gh-card"><h3>RECORD</h3><div class="gh-news"><div>Press conference: <b>' + G.pm.press + '</b></div><div>Jan sampark / rally: <b>' + G.pm.rallies + '</b></div><div>Bill paas karaye: <b>' + G.stats.passed + '</b></div><div>Virodh jhele: <b>' + G.stats.protests + '</b></div></div></div>' +
            '<div class="gh-card"><h3>PM KARYA</h3><button class="gh-btn go" style="width:100%;margin-bottom:8px" onclick="GH.pmPress()">Press conference karo</button><button class="gh-btn" style="width:100%" onclick="GH.pmRally()">Jan sampark yatra</button><div style="color:#94a3b8;font-size:.76rem;margin-top:6px">Is saal: ' + G.pm.pressYear + ' press, ' + G.pm.rallyYear + ' jan sampark</div></div></div>');
    }
    function eventModal() {
        var ev = G.event; if (!ev) return;
        var b = function (k, t, sub) { return '<div class="gh-opt" onclick="GH.eventAct(\'' + k + '\')"><span><b>' + t + '</b><small>' + sub + '</small></span></div>'; };
        var h = '<h2 style="margin:0 0 4px">' + (ev.type === 'protest' ? '\u26A0 Virodh pradarshan' : '\u26A0 Kharab narrative') + '</h2><p style="color:#cbd5e1">' + esc(ev.text) + '</p><div style="color:#94a3b8;font-size:.8rem;margin-bottom:8px">Gambhirta: ' + '\u25CF'.repeat(ev.sev) + '\u25CB'.repeat(Math.max(0, 3 - ev.sev)) + '</div>';
        if (ev.type === 'protest') h += b('withdraw', 'Bill wapas lo', 'Andolan khatam, bill ka asar ulat jata hai, PM popularity \u22123') + b('talk', 'Baat karo (vaarta)', '60% safal. Safal to khushi +, fail to andolan jaari') + b('police', 'Police lagao', '55% safal. Fail hua to halaat bigad sakte hain') + b('army', 'Army lagao', 'Turant shaanti, par janta aur duniya mein badnaami') + b('ignore', 'Nazarandaz karo', 'Khushi \u22123, PM popularity \u22122');
        else h += b('media', 'Media hire karo (6 Cr)', '70% safal, kharab narrative hat sakta hai') + b('social', 'Social media team hire karo (4 Cr)', '60% safal, naya narrative chalega') + b('press', 'PM press conference', '45% safal, PM popularity +') + b('ignore', 'Nazarandaz karo', 'PM popularity \u22122, khushi \u22121');
        h += '<div style="margin-top:10px"><button class="gh-btn" onclick="GH.closeModal()">Baad mein</button></div>';
        modal(h);
    }

    // ---------------------------------------------------------------- main render / navigation
    function render() {
        var r = ensureRoot(); r.style.display = 'block';
        if (!ensure()) {
            r.innerHTML = '<div class="gh-wrap"><div class="gh-top"><button class="gh-btn" onclick="GH.close()">\u2190 Wapas</button><div><h1>Sarkar</h1></div></div><div class="gh-card" style="text-align:center;padding:40px"><div style="font-size:3rem">\uD83C\uDFDB</div><h2>Abhi koi sarkar nahi hai</h2><p style="color:#94a3b8">Pehle Lok Sabha chunav jeeto, PM banke shapath lo. Tab yahan se sarkar chalao.</p><button class="gh-btn go" onclick="GH.close()">DASHBOARD</button></div></div>';
            return;
        }
        var h = V.view === 'bills' ? billsHtml() : (V.view === 'bill' ? billFlowHtml() : (V.view === 'budget' ? budgetHtml() : (V.view === 'foreign' ? fpHtml() : homeHtml())));
        r.innerHTML = h;
        if (V.view === 'budget' && V.budget && V.budget.stage === 'speech') runSpeech();
        if (V.view === 'bill' && G.bill && /_vote$/.test(G.bill.stage)) setTimeout(runBillVote, 300);
    }
    function go(v) { V.view = v; if (v === 'budget' && !V.budget) budgetInit(); window.scrollTo(0, 0); var r = $('gh-root'); if (r) r.scrollTop = 0; render(); }

    // ---------------------------------------------------------------- voting animation
    function animateVote(res, ch, cb, opt) {
        var seats = res.seats, n = seats.length, order = [], i;
        for (i = 0; i < n; i++) order.push(i);
        for (i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
        var y = 0, nn = 0, a = 0, pos = 0, batch = Math.max(2, Math.ceil(n / 70)), col = { y: '#22c55e', n: '#ef4444', a: '#64748b' };
        var set = function (id, v) { var e = $(id); if (e) e.textContent = v; };
        setTimeout(function () { var o = $('gh-order'); if (o) o.textContent = opt && opt.noconf ? 'AVISHWAS PRASTAV PAR VOTING' : 'VOTING SHURU'; }, 900);
        if (V.timer) clearInterval(V.timer);
        setTimeout(function () {
            V.timer = setInterval(function () {
                for (var k = 0; k < batch && pos < n; k++, pos++) {
                    var idx = order[pos], s = seats[idx], c = $('gh-hs' + idx);
                    if (s.v === 'y') y++; else if (s.v === 'n') nn++; else a++;
                    if (c) { c.setAttribute('fill', col[s.v]); c.setAttribute('r', (+c.getAttribute('r') * 1.0)); }
                }
                set('gh-y', y); set('gh-n', nn); set('gh-a', a);
                if (pos >= n) { clearInterval(V.timer); V.timer = null; var o = $('gh-order'); if (o) o.textContent = ''; setTimeout(cb, 700); }
            }, 45);
        }, 1700);
    }
    function runBillVote() {
        var b = G.bill; if (!b || V.vote === b.stage) return; V.vote = b.stage;
        var ch = b.stage === 'ls_vote' ? 'ls' : 'rs', r = houseRec(), camps = ch === 'ls' ? lsCamps(r) : rsCamps(r);
        var res = simulate(camps, probs(b, b.opts), 'bill'), ok = passes(res, b.type === 'amend');
        animateVote(res, ch, function () {
            b[ch] = { yes: res.yes, no: res.no, abs: res.abs, pass: ok };
            b.stage = ch + '_done';
            if (!ok) { b.failedAt = ch; G.stats.failed++; bump('pmPop', -1.5); log('<b>' + esc(b.name) + '</b> ' + (ch === 'ls' ? 'Lok Sabha' : 'Rajya Sabha') + ' mein gir gaya.'); }
            else log('<b>' + esc(b.name) + '</b> ' + (ch === 'ls' ? 'Lok Sabha' : 'Rajya Sabha') + ' se paas.');
            save(); V.vote = null; render();
        });
    }

    // ---------------------------------------------------------------- bill actions
    function billStart(id) {
        if (G.fallen || G.ended) return;
        var b = billById(id) || null; if (!b) return;
        G.bill = JSON.parse(JSON.stringify(b)); G.bill.stage = 'ls_prep'; G.bill.opts = { whip: 0, talk: 0, deal: 0 }; save(); V.vote = null; go('bill');
    }
    function billCustomStart() {
        var b = customBill(); G.custom = G.custom || []; G.custom.push(b);
        G.bill = JSON.parse(JSON.stringify(b)); G.bill.stage = 'ls_prep'; G.bill.opts = { whip: 0, talk: 0, deal: 0 }; save(); V.vote = null; go('bill');
    }
    var OPT_COST = { whip: 1, talk: 2, deal: 2 };
    function opt(k) {
        var o = G.bill.opts;
        if (o[k]) { o[k] = 0; G.cap += OPT_COST[k]; if (k === 'deal') bump('pmPop', 2); }
        else { if (G.cap < OPT_COST[k]) { toast('Rajnitik poonji kam hai.'); return; } G.cap -= OPT_COST[k]; o[k] = 1; if (k === 'deal') bump('pmPop', -2); }
        save(); render();
    }
    function voteStart() { G.bill.stage = G.bill.stage === 'ls_prep' ? 'ls_vote' : 'rs_vote'; V.vote = null; save(); render(); }
    function toRs() { G.bill.stage = 'rs_prep'; G.bill.opts = { whip: 0, talk: 0, deal: 0 }; save(); render(); }
    function toPres() { G.bill.stage = 'pres'; save(); render(); }
    function presSign() {
        var b = G.bill, r = houseRec(), p = presInfo(), aligned = p.party && (r.gov || []).indexOf(p.party) >= 0;
        var pSign = clamp((aligned ? 0.94 : 0.78) - b.con * 0.18, 0.4, 0.98);
        b.presDone = true;
        var el = $('gh-sign'), signed = Math.random() < pSign || b.returned;
        if (el) el.innerHTML = '<svg class="gh-sign" viewBox="0 0 320 90"><path d="M10 60 C40 10 60 90 90 40 S130 10 150 60 S200 20 230 55 S280 30 310 50"/></svg><div style="color:#fde68a">' + (signed ? 'Rashtrapati hastakshar kar rahe hain...' : 'Rashtrapati vichar kar rahe hain...') + '</div>';
        setTimeout(function () {
            if (signed) { b.signed = true; G.stats.passed++; log('Rashtrapati ne <b>' + esc(b.name) + '</b> par hastakshar kiye. Kanoon laagu!'); enact(b); }
            else {
                b.returned = true; b.presDone = false; b.stage = 'ls_prep'; b.opts = { whip: 0, talk: 0, deal: 0 }; b.con = Math.max(0.05, b.con - 0.1);
                log('Rashtrapati ne <b>' + esc(b.name) + '</b> punarvichar ke liye wapas bheja.');
                modal('<h2 style="margin:0">Rashtrapati ne bill wapas bheja</h2><p style="color:#cbd5e1">Rashtrapati ne punarvichar ke liye bill sansad ko wapas bhej diya hai. Dobara Lok Sabha se paas karwao.</p><button class="gh-btn go" onclick="GH.closeModal();GH.go(\'bill\')">THEEK HAI</button>');
            }
            save(); render();
        }, 2600);
    }
    function enact(b) {
        var before = { happy: G.happy, pmPop: G.pmPop, infl: G.infl, jobs: G.jobs, gdp: G.gdp };
        ['infl', 'jobs', 'gdp'].forEach(function (k) { bump(k, b.eff[k] || 0); });
        var rv = b.pub * 55 + rnd(-18, 18) - (G.narr ? 15 : 0), tone = rv > 20 ? 'khush' : (rv < -20 ? 'naraaz' : 'mila');
        if (tone === 'khush') { bump('happy', clamp(1.5 + rv / 12, 1, 9) + Math.max(0, b.eff.happy || 0) * 0.5); bump('pmPop', clamp(1 + rv / 20, 0.5, 5) + Math.max(0, b.eff.pm || 0) * 0.4); }
        else if (tone === 'naraaz') { bump('happy', -clamp(2 + Math.abs(rv) / 10, 2, 10)); bump('pmPop', -clamp(1 + Math.abs(rv) / 15, 1, 6)); }
        else { bump('happy', (b.eff.happy || 0) * 0.3 + rnd(-1, 1)); bump('pmPop', (b.eff.pm || 0) * 0.3 + rnd(-0.6, 0.6)); }
        var lines = { khush: ['Sadkon par jashn, janta ne kanoon ka swagat kiya.', 'Social media par bill ki taareef, trending #' + b.cat.replace(/\W+/g, '')], naraaz: ['Shehron mein virodh ki awaaz, vipaksh ne bill ko janvirodhi bataya.', 'Janta mein gussa, sarkar par sawal.'], mila: ['Janta ki pratikriya mili-juli rahi, kuch khush, kuch chinta mein.', 'Abhi saaf nahi ki janta kaisa mehsoos kar rahi hai.'] };
        var changes = [['Janta ki khushi', 'happy', true], ['PM popularity', 'pmPop', true], ['Mahangai', 'infl', false], ['Rozgar', 'jobs', true], ['GDP', 'gdp', true]].map(function (x) {
            var d = r1(G[x[1]] - before[x[1]]); return { l: x[0], t: (d > 0 ? '\u25B2 ' : (d < 0 ? '\u25BC ' : '')) + Math.abs(d) + (x[1] === 'gdp' ? '%' : ''), good: d === 0 ? true : (d > 0) === x[2] };
        });
        b.reaction = { tone: tone, line: pick(lines[tone]), changes: changes }; b.stage = 'public';
        log('Janta ne <b>' + esc(b.name) + '</b> par ' + (tone === 'khush' ? 'khushi jatayi' : (tone === 'naraaz' ? 'naraazgi jatayi' : 'mili-juli pratikriya di')) + '.');
        if (!G.event) {
            if (rv < -35 && Math.random() < 0.8 || (rv < -20 && Math.random() < 0.35)) { G.event = { type: 'protest', text: esc(b.name) + ' ke khilaf desh bhar mein pradarshan shuru.', bill: b.id, sev: rv < -45 ? 3 : (rv < -30 ? 2 : 1) }; G.stats.protests++; }
            else if (rv < 0 && b.con > 0.4 && Math.random() < 0.5) G.event = { type: 'narr', text: 'Vipaksh aur media ka ek hissa ' + esc(b.name) + ' ko "janvirodhi" bata kar narrative chala raha hai.', bill: b.id, sev: 2 };
        }
        save();
    }
    function billClose() { G.bill = null; V.vote = null; save(); go(G.event ? 'home' : 'home'); if (G.event) setTimeout(function () { eventOpen(); }, 400); }

    // ---------------------------------------------------------------- events (protest / narrative)
    function eventOpen() { eventModal(); }
    function eventAct(k) {
        var ev = G.event; if (!ev) return; var msg = '', done = false, b = billById(ev.bill);
        var undo = function () { if (b) { ['infl', 'jobs', 'gdp'].forEach(function (x) { bump(x, -(b.eff[x] || 0) * 0.7); }); } };
        if (ev.type === 'protest') {
            if (k === 'withdraw') { undo(); bump('pmPop', -3); bump('happy', 4); msg = 'Bill wapas liya gaya. Andolan khatam.'; done = true; }
            else if (k === 'talk') { if (Math.random() < 0.6) { bump('happy', 3); bump('pmPop', 2); msg = 'Vaarta safal rahi, andolan samapt.'; done = true; } else { ev.sev = Math.max(1, ev.sev - 0); msg = 'Vaarta fail rahi, andolan jaari.'; } }
            else if (k === 'police') { if (Math.random() < 0.55) { bump('happy', -1); msg = 'Police ne halaat sambhal liye.'; done = true; } else { bump('happy', -5); bump('pmPop', -3); ev.sev = Math.min(3, ev.sev + 1); msg = 'Police karyavahi se halaat bigad gaye. Andolan badha.'; } }
            else if (k === 'army') { bump('happy', -6); bump('pmPop', -5); G.fp.rel['USA'] -= 3; G.fp.rel['UK'] -= 3; G.fp.rel['France'] -= 3; msg = 'Army tainat. Shaanti, par duniya mein badnaami.'; done = true; }
            else { bump('happy', -3); bump('pmPop', -2); msg = 'Nazarandaz karne se naraazgi badhi.'; done = true; }
        } else {
            if (k === 'media') { if (G.fund < 6) { toast('Rajkosh mein 6 Cr nahi.'); return; } G.fund -= 6; if (Math.random() < 0.7) { msg = 'Media ke zariye sarkar ka paksh pahuncha. Narrative badla.'; bump('pmPop', 1); done = true; } else msg = 'Media campaign asar nahi kar paya.'; }
            else if (k === 'social') { if (G.fund < 4) { toast('Rajkosh mein 4 Cr nahi.'); return; } G.fund -= 4; if (Math.random() < 0.6) { msg = 'Social media team ne narrative palat diya.'; bump('pmPop', 1); done = true; } else msg = 'Social media par ulta asar pada.'; }
            else if (k === 'press') { G.pm.press++; G.pm.pressYear++; if (Math.random() < 0.45) { msg = 'PM ke press conference se narrative theek hua.'; bump('pmPop', 2); done = true; } else msg = 'Press conference se zyada fayda nahi hua.'; }
            else { bump('pmPop', -2); bump('happy', -1); msg = 'Narrative nazarandaz kiya, kuch nuksaan hua.'; done = true; }
        }
        if (done) { G.event = null; G.narr = false; log(msg); } else if (ev.type === 'narr') G.narr = true;
        save(); closeModal(); toast(msg); render(); if (!done && G.event) setTimeout(eventOpen, 500);
    }

    // ---------------------------------------------------------------- PM actions
    function pmPress() {
        if (G.pm.pressYear >= 4) { toast('Is saal 4 se zyada press conference nahi.'); return; }
        G.pm.press++; G.pm.pressYear++; var d = r1(rnd(0.5, 2.2)); bump('pmPop', d); if (G.narr && Math.random() < 0.3) { G.narr = false; }
        log('PM ne press conference ki (popularity ' + sgn(d) + ').'); save(); toast('Press conference safal: popularity ' + sgn(d)); pmModal(); render_underlay();
    }
    function pmRally() {
        if (G.pm.rallyYear >= 4) { toast('Is saal 4 se zyada jan sampark nahi.'); return; }
        G.pm.rallies++; G.pm.rallyYear++; var d = r1(rnd(0.6, 2.5)); bump('pmPop', d); bump('happy', 0.6);
        log('PM ne jan sampark yatra ki (popularity ' + sgn(d) + ').'); save(); toast('Jan sampark: popularity ' + sgn(d)); pmModal(); render_underlay();
    }
    function render_underlay() { if (V.view === 'home') { var r = $('gh-root'); if (r) { var sc = r.scrollTop; r.innerHTML = homeHtml(); r.scrollTop = sc; } } }

    // ---------------------------------------------------------------- budget actions
    function bset(k, v) { V.budget.a[k] = +v; var e = $('gh-bv-' + k); if (e) e.textContent = v + '%'; budgetRefresh(); }
    function budgetRefresh() {
        var tot = bTotal(), def = deficit(), e = budgetEff();
        var el = $('gh-btot'); if (el) { el.style.color = tot === 100 ? '#4ade80' : '#fbbf24'; el.textContent = 'Kul: ' + tot + '% ' + (tot === 100 ? '(theek hai)' : '(100% karna hai)'); }
        var rest = $('gh-brest'); if (rest) { rest.textContent = (100 - tot) + '%'; rest.style.color = tot > 100 ? '#f87171' : '#94a3b8'; }
        var sm = $('gh-bsum'); if (sm) sm.innerHTML = budgetSummary(def, e);
        var go2 = $('gh-bgo'); if (go2) go2.disabled = tot !== 100;
    }
    function bauto() { budgetInit(); render(); }
    function btax(k, v) { V.budget[k] = v; render(); }
    function bgo() { if (bTotal() !== 100) return; V.budget.stage = 'speech'; render(); }
    function runSpeech() {
        var d = $('gh-sp-data'), lines = []; try { lines = JSON.parse(d.textContent.replace(/&quot;/g, '"')); } catch (e) { try { lines = JSON.parse(d.textContent); } catch (e2) { lines = ['Budget pesh.']; } }
        var el = $('gh-speech'), i = 0;
        var next = function () {
            if (!$('gh-speech')) return;
            if (i >= lines.length) { setTimeout(budgetVote, 600); return; }
            var p = document.createElement('div'); p.className = 'gh-fade'; p.style.animation = 'ghUp .5s ease both'; el.appendChild(p);
            var t = lines[i++], k = 0, iv = setInterval(function () { k += 2; p.textContent = t.slice(0, k); if (k >= t.length) { clearInterval(iv); setTimeout(next, 350); } }, 22);
        };
        next();
    }
    function budgetVote() {
        var r = houseRec(), camps = lsCamps(r), mood = (G.happy - 50) / 250 + (G.pmPop - 50) / 300, e = budgetEff();
        var p = { main: 0.98, ally: clamp(0.85 + mood + (e.happy > 0 ? 0.05 : -0.05), 0.3, 0.98), opp: clamp(0.06 + (e.happy > 3 ? 0.1 : 0), 0.02, 0.3), oth: clamp(0.55 + mood, 0.2, 0.9) };
        var res = simulate(camps, p, 'bill'), ok = res.yes > res.no;
        var box = $('gh-bvote'); if (!box) return;
        box.innerHTML = '<div class="gh-hall ls" style="margin-top:10px"><div class="gh-order" id="gh-order">BUDGET PAR VOTING</div>' + hemiSvg(camps, 'ls', 'gh-h', hallColors('ls')) + '<div class="gh-vote"><div><b id="gh-y" style="color:#4ade80">0</b><small>HAAN</small></div><div><b id="gh-n" style="color:#f87171">0</b><small>NAHI</small></div><div><b id="gh-a" style="color:#94a3b8">0</b><small>GAIRHAAZIR</small></div></div></div><div id="gh-vres"></div>';
        animateVote(res, 'ls', function () {
            var out = $('gh-vres'); if (!out) return;
            if (ok) {
                var before = { happy: G.happy, jobs: G.jobs, gdp: G.gdp, infl: G.infl, pmPop: G.pmPop };
                applyEff({ happy: e.happy, jobs: e.jobs, gdp: e.gdp, infl: e.infl, pm: e.pm }, 1);
                G.fund += 40 + (V.budget.inc > 0 ? 20 : (V.budget.inc < 0 ? -15 : 0)); G.budgetYear = G.year;
                var mk = e.gdp >= 0.2 ? 'Sensex ' + ri(300, 900) + ' ank upar' : (e.gdp <= -0.1 ? 'Sensex ' + ri(300, 900) + ' ank neeche' : 'Sensex lagbhag sthir');
                log('Budget ' + G.year + ' paas. ' + mk + '.');
                out.innerHTML = '<div class="gh-res ok"><h2>Budget paas!</h2><p style="color:#cbd5e1">' + mk + '. Rajkoshiya ghata ' + deficit() + '% GDP.</p></div><div class="gh-card"><h3>ASAR</h3>' + [['Janta ki khushi', 'happy', true], ['Rozgar', 'jobs', true], ['GDP', 'gdp', true], ['Mahangai', 'infl', false], ['PM popularity', 'pmPop', true]].map(function (x) { var d = r1(G[x[1]] - before[x[1]]); return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.08)"><span>' + x[0] + '</span><b class="' + (d === 0 ? '' : ((d > 0) === x[2] ? 'up' : 'dn')) + '">' + (d > 0 ? '\u25B2 ' : (d < 0 ? '\u25BC ' : '')) + Math.abs(d) + '</b></div>'; }).join('') + '</div><div style="text-align:center;margin-top:12px"><button class="gh-btn go" onclick="GH.go(\'home\')">SARKAR PAGE</button></div>';
            } else {
                bump('pmPop', -4); bump('happy', -2); G.budgetYear = G.year; log('Budget Lok Sabha mein gir gaya! Sarkar sankat mein.');
                out.innerHTML = '<div class="gh-res no"><h2>Budget gir gaya!</h2><p style="color:#cbd5e1">Saathi dalon ne saath nahi diya. Sarkar ki saakh ko bada jhatka.</p></div><div style="text-align:center"><button class="gh-btn red" onclick="GH.go(\'home\')">SARKAR PAGE</button></div>';
            }
            V.budget = null; save();
        });
    }

    // ---------------------------------------------------------------- no-confidence motion
    function noconfStart() {
        if (!G.noconf) return;
        V.nc = { whip: 0, talk: 0, speech: 0 }; ncPrep();
    }
    function ncPrep() {
        var r = houseRec(), c = lsCamps(r), o = V.nc;
        var opt = function (k, t, sub, cost) { return '<div class="gh-opt' + (o[k] ? ' on' : '') + '" onclick="GH.ncOpt(\'' + k + '\')"><span><b>' + t + '</b><small>' + sub + '</small></span><b>' + (o[k] ? '\u2713' : cost) + '</b></div>'; };
        var rr = $('gh-root');
        rr.innerHTML = '<div class="gh-wrap"><div class="gh-top"><button class="gh-btn" onclick="GH.go(\'home\')">\u2190 Sarkar</button><div><h1>Avishwas Prastav</h1><small>Vipaksh ne Lok Sabha mein sarkar par bharosa nahi jataya</small></div></div>' +
            '<div class="gh-grid g2"><div class="gh-card"><h3>SARKAR KA GANIT</h3><div class="gh-m"><div class="t"><span>Sarkar + saathi</span><b>' + c.gov + ' / 543</b></div><div class="b"><i style="width:' + (c.gov / 543 * 100) + '%;background:' + (c.gov >= 272 ? '#22c55e' : '#ef4444') + '"></i></div></div><div style="color:#94a3b8;font-size:.85rem">Bachne ke liye 272 chahiye. Saathi dalon ka bharosa janta ke mood aur PM popularity par tikta hai (abhi khushi ' + Math.round(G.happy) + '%, popularity ' + Math.round(G.pmPop) + '%).</div>' +
            '<div style="margin-top:12px">' + opt('speech', 'PM ka bhaashan', 'Sansad mein dum-daar bhaashan (saathi dalon ka bharosa +)', 'free') + opt('whip', 'Whip jaari karo', 'Sarkari sansadon ko aadesh', '1 poonji') + opt('talk', 'Saathi dalon ko manao', 'Naraaz saathiyon se baat', '2 poonji') + '<div style="color:#94a3b8;font-size:.8rem">Rajnitik poonji: <b>' + G.cap + '</b></div></div></div>' +
            '<div class="gh-card"><h3>AAGE KYA</h3><p style="color:#cbd5e1">Prastav par voting hogi. <b>Haan</b> = sarkar ke khilaf, <b>Nahi</b> = sarkar ke paksh mein. Agar prastav paas hua to sarkar gir jayegi.</p><button class="gh-btn red" onclick="GH.ncVote()">LOK SABHA MEIN VOTING \u2192</button></div></div></div>';
    }
    function ncOpt(k) {
        var cost = { speech: 0, whip: 1, talk: 2 }[k], o = V.nc;
        if (o[k]) { o[k] = 0; G.cap += cost; } else { if (G.cap < cost) { toast('Rajnitik poonji kam hai.'); return; } G.cap -= cost; o[k] = 1; if (k === 'speech') bump('pmPop', 1); }
        save(); ncPrep();
    }
    function ncVote() {
        var r = houseRec(), camps = lsCamps(r), o = V.nc;
        var res = simulate(camps, null, 'noconf', { whip: o.whip + o.speech * 0.5, talk: o.talk + o.speech * 0.5 });
        $('gh-root').innerHTML = '<div class="gh-wrap"><div class="gh-top"><div><h1>Avishwas Prastav</h1><small>Voting chal rahi hai</small></div></div><div class="gh-hall ls"><div class="gh-order" id="gh-order">ORDER! ORDER!</div>' + hemiSvg(camps, 'ls', 'gh-h', hallColors('ls')) + '<div class="gh-vote"><div><b id="gh-y" style="color:#f87171">0</b><small>HAAN (SARKAR KE KHILAF)</small></div><div><b id="gh-n" style="color:#4ade80">0</b><small>NAHI (PAKSH MEIN)</small></div><div><b id="gh-a" style="color:#94a3b8">0</b><small>GAIRHAAZIR</small></div></div></div><div id="gh-vres"></div></div>';
        var colorFix = function () { };
        animateVote(res, 'ls', function () {
            var fell = res.yes > res.no, out = $('gh-vres'), defect = Object.keys(res.flip).filter(function (p) { return res.flip[p]; });
            G.noconf = null;
            if (fell) { G.fallen = true; bump('pmPop', -10); log('Avishwas prastav paas! Sarkar gir gayi.'); out.innerHTML = '<div class="gh-res no"><h2>Sarkar gir gayi!</h2><p style="color:#cbd5e1">Haan ' + res.yes + ' | Nahi ' + res.no + (defect.length ? '<br>Saath chhodne wale dal: ' + esc(defect.join(', ')) : '') + '</p></div><div style="text-align:center"><button class="gh-btn red" onclick="GH.go(\'home\')">SARKAR PAGE</button></div>'; }
            else { bump('pmPop', 5); bump('happy', 1); log('Sarkar ne avishwas prastav jeeta.'); out.innerHTML = '<div class="gh-res ok" style="position:relative;overflow:hidden">' + confetti(30) + '<h2>Sarkar bach gayi!</h2><p style="color:#cbd5e1">Haan ' + res.yes + ' | Nahi ' + res.no + (defect.length ? '<br>Kuch saathi dal vipaksh ke saath gaye: ' + esc(defect.join(', ')) : '') + '<br>PM popularity +5</p></div><div style="text-align:center"><button class="gh-btn go" onclick="GH.go(\'home\')">SARKAR PAGE</button></div>'; }
            save();
        }, { noconf: true });
    }

    // ---------------------------------------------------------------- foreign policy actions
    function fpAct(k) {
        var cn = V.country; if (!cn) return; var c = COUNTRIES.filter(function (x) { return x.n === cn; })[0], rel = G.fp.rel, cost = { yatra: 1, trade: 1, meet: 1, bayan: 0.5, slam: 0, sanction: 1 }[k], fund = { yatra: 3, trade: 2 }[k] || 0;
        if (G.fp.pts < cost) { toast('Is saal ke videsh mauke khatam. Agla saal shuru karo.'); return; }
        if (G.fund < fund) { toast('Rajkosh mein ' + fund + ' Cr nahi.'); return; }
        G.fp.pts -= cost; G.fund -= fund; var d = 0, msg = '', hostile = rel[cn] < 35;
        if (k === 'yatra') { d = r1(rnd(6, 12)); bump('pmPop', 1); msg = 'PM ne ' + cn + ' ki yatra ki. Sambandh ' + sgn(d) + '.'; }
        else if (k === 'trade') { d = r1(rnd(3, 6)); bump('gdp', 0.12 * c.w); bump('jobs', 0.5 * c.w); msg = cn + ' ke saath vyapar samjhauta. Sambandh ' + sgn(d) + ', GDP aur rozgar mein sudhaar.'; }
        else if (k === 'meet') { d = r1(rnd(4, 9)); msg = cn + ' ke neta se mulakat. Sambandh ' + sgn(d) + '.'; }
        else if (k === 'bayan') { d = 3; msg = cn + ' ki taareef mein bayan. Sambandh +3.'; }
        else if (k === 'slam') { d = -10; if (hostile) { bump('pmPop', 2); bump('happy', 1); msg = cn + ' ke khilaf bolne se janta khush (PM popularity +2). Sambandh \u221210.'; } else { bump('pmPop', -1.5); msg = cn + ' ke khilaf bayan se kootneeti mein tanav. Sambandh \u221210.'; } }
        else if (k === 'sanction') { d = -15; bump('gdp', -0.1 * c.w); bump('infl', 0.5 * c.w); msg = cn + ' par pratibandh. Sambandh \u221215, GDP par asar.'; }
        rel[cn] = clamp(Math.round(rel[cn] + d), 0, 100); bump('fp', 0); G.delta.fp = null;
        log(msg); save(); toast(msg); render();
    }

    // ---------------------------------------------------------------- year change
    var RANDOM_EVENTS = [
        { t: 'Achchi monsoon: fasal behtar', e: { gdp: 0.3, infl: -1, happy: 1 } }, { t: 'Sookha: kisanon par sankat', e: { gdp: -0.4, infl: 2, happy: -2 } },
        { t: 'Global mandi ka asar', e: { gdp: -0.6, jobs: -2, happy: -1 } }, { t: 'Kaccha tel mehnga hua', e: { infl: 3, gdp: -0.2 } },
        { t: 'Cricket World Cup jeet: desh mein jashn', e: { happy: 2, pm: 1 } }, { t: 'Bhrashtachar ghotala saamne aaya', e: { pm: -3, happy: -1 } },
        { t: 'Videshi nivesh mein badhat', e: { gdp: 0.4, jobs: 1.5 } }, { t: 'Badhi aapda (baadh)', e: { happy: -2, gdp: -0.2 } }, { t: 'Nayi technology factory aayi', e: { jobs: 2, gdp: 0.2 } }
    ];
    function nextYear() {
        if (G.fallen || G.ended) return;
        if (G.bill && G.bill.stage !== 'closed') { toast('Pehle chal raha bill poora karo ya band karo.'); return; }
        if (G.noconf) { toast('Pehle avishwas prastav ka saamna karo.'); return; }
        if (G.event) { toast('Pehle andolan / narrative sambhalo.'); return; }
        G.gdpSize = Math.round((G.gdpSize || 4) * (1 + G.gdp / 100) * 100) / 100;
        G.year++; G.cap = Math.min(10, G.cap + 4); G.fp.pts = 4; G.pm.pressYear = 0; G.pm.rallyYear = 0; G.fund += 20; G.delta = {};
        bump('infl', (50 - G.infl) * 0.08 + rnd(-1.5, 1.5)); bump('jobs', (50 - G.jobs) * 0.06 + rnd(-1.5, 1.5)); bump('gdp', (6 - G.gdp) * 0.12 + rnd(-0.4, 0.4)); bump('happy', (50 - G.happy) * 0.04); bump('pmPop', -1.2 + (G.pm.press + G.pm.rallies > 0 ? 0 : -0.5));
        COUNTRIES.forEach(function (c) { var v = G.fp.rel[c.n]; if (v >= 70) bump('gdp', 0.02 * c.w); G.fp.rel[c.n] = clamp(Math.round(v + (c.rel - v) * 0.1), 0, 100); });
        var ev = pick(RANDOM_EVENTS); applyEff(ev.e, 1); log('Saal ' + G.year + ': ' + ev.t + '.');
        var r = houseRec(), c = lsCamps(r), margin = c.gov - 272;
        if (Math.random() < (margin < 25 ? 0.5 : 0.18) * (G.happy < 40 || G.pmPop < 40 ? 1.6 : 1) * (G.happy > 65 && G.pmPop > 65 ? 0.4 : 1)) G.noconf = { y: G.year };
        if (G.year - G.startYear >= 5) { G.ended = true; log('Lok Sabha ka 5 saal ka kaarykaal poora hua.'); }
        save(); render();
        toast('Saal ' + G.year + ' shuru: ' + ev.t);
    }

    // ---------------------------------------------------------------- public API
    window.GH = {
        imgErr: function (im) { var ex = ['jpg', 'png', 'jpeg', 'webp'], i = (+im.getAttribute('data-i')) + 1; if (i < ex.length) { im.setAttribute('data-i', i); im.src = 'Images/Leaders/' + im.getAttribute('data-s') + '.' + ex[i]; } else { im.onerror = null; im.src = im.getAttribute('data-fb'); } },
        open: function () { V.view = 'home'; V.pmOpen = false; render(); },
        close: function () { closeModal(); var r = $('gh-root'); if (r) r.style.display = 'none'; if (V.timer) { clearInterval(V.timer); V.timer = null; } try { if (typeof s34HouseBadge === 'function') s34HouseBadge(); } catch (e) {} },
        go: go, tab: function (t) { V.tab = t; render(); }, closeModal: closeModal,
        billStart: billStart, billCustom: billCustomStart, bname: function (v) { V.builder.name = v; }, bcat: function (v) { V.builder.cat = v; render(); }, btype: function (v) { V.builder.type = v; render(); }, blvl: function (v) { V.builder.lvl = +v; render(); },
        opt: opt, voteStart: voteStart, toRs: toRs, toPres: toPres, presSign: presSign, billClose: billClose,
        pmOpen: pmModal, pmPress: pmPress, pmRally: pmRally,
        eventOpen: eventOpen, eventAct: eventAct,
        bset: bset, bauto: bauto, btax: btax, bgo: bgo,
        noconfStart: noconfStart, ncOpt: ncOpt, ncVote: ncVote,
        country: function (c) { V.country = c; render(); }, fp: fpAct, nextYear: nextYear,
        devNoconf: function () { if (!G) return; G.noconf = { y: G.year }; save(); render(); toast('Avishwas prastav lagaya gaya.'); },
        devProtest: function () { if (!G) return; G.event = { type: 'protest', text: 'Test: kisan sangathanon ne desh-vyapi pradarshan shuru kiya.', bill: null, sev: 2 }; G.stats.protests++; save(); render(); toast('Virodh pradarshan shuru.'); },
        devReset: function () { if (confirm('Sarkar ka progress mitana hai?')) { try { localStorage.removeItem(KEY); } catch (e) {} V.budget = null; render(); } }
    };
})();
