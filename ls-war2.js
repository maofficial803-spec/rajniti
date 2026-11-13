/* =====================================================================
   LOK SABHA WAR-ROOM v2  (script.js ke baad load hota hai)
   - Map par state dabane se popup: Media / Rally / Karyakarta (5-5 ka meter)
   - Seat dabane se seat popup: Media / Rally / Karyakarta
   - 5 media = ~aadhi seat pakki, 5+5 = 100%, 5 karyakarta = 25-30%
   - Pehle round mein sirf 2 media + 2 rally har state mein
   - AI bhi wahi karta hai (barabari ki takkar)
   - Round ke baad hisaab ka page, virodhi ka court case
   - VIP sirf apni party ki seat se; career ticket/consultancy/EC/judge ka asar
   ===================================================================== */
(function () {
    'use strict';
    if (typeof gameState === 'undefined' || typeof doAction !== 'function') return;

    var NAME = { m: 'Media', r: 'Rally', k: 'Karyakarta' }, STAM = { m: 3, r: 5, k: 4 }, PER = { m: 0.2, r: 0.2, k: 0.35 };
    var E = function (s) { return typeof esc === 'function' ? esc(s) : String(s); };
    var pop = null, ST = { st: null, key: null, msg: '' };

    // ------------------------------------------------------------ data
    function L2() { var g = gameState; if (!g.ls2) g.ls2 = { units: {}, seat: {}, log: [], caseDone: {} }; return g.ls2; }
    function ukey(st) { return st + '#' + gameState.phase; }
    function U(st, side) { var l = L2(), k = ukey(st); if (!l.units[k]) l.units[k] = { you: { m: 0, r: 0, k: 0 }, opp: { m: 0, r: 0, k: 0 } }; return l.units[k][side]; }
    function SU(key, side) { var l = L2(); if (!l.seat[key]) l.seat[key] = { you: { m: 0, r: 0, k: 0 }, opp: { m: 0, r: 0, k: 0 } }; return l.seat[key][side]; }
    var rv = 0;
    function bust() { rv++; }
    function hsh(s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 1000003; return x; }
    var RANK = {};
    function rank(st, ph) {
        var k = st + '#' + ph, c = RANK[k];
        if (c && c.v === rv) return c;
        var keys = Object.keys(resultModel.seats).filter(function (x) { var s = resultModel.seats[x]; return s.st === st && s.phase === ph; });
        keys.sort(function (a, b) { return hsh(a) - hsh(b); });
        var idx = {}; keys.forEach(function (x, i) { idx[x] = i; });
        return (RANK[k] = { v: rv, n: keys.length, idx: idx });
    }
    function frac(u) { return Math.min(1, (u.m + u.r) / 10 + u.k * 0.055); }
    function lockSide(k) {
        var s = resultModel && resultModel.seats[k], l = gameState.ls2;
        if (!s || !l) return null;
        var sd = l.seat[k];
        if (sd) {
            var sy = sd.you, so = sd.opp;
            if (sy.k && !so.k) return 'you'; if (so.k && !sy.k) return 'opp';
            var ty = sy.m + sy.r, to = so.m + so.r;
            if (ty >= 10 && to < 10) return 'you'; if (to >= 10 && ty < 10) return 'opp';
        }
        var u = l.units[s.st + '#' + s.phase]; if (!u) return null;
        var R = rank(s.st, s.phase), i = R.idx[k], fy = frac(u.you), fo = frac(u.opp), ny = Math.round(fy * R.n), no = Math.round(fo * R.n);
        var ly = i < ny, lo = i >= R.n - no;
        if (ly && lo) return fy > fo ? 'you' : (fo > fy ? 'opp' : null);
        return ly ? 'you' : (lo ? 'opp' : null);
    }
    var _vs = typeof vsAdjust === 'function' ? vsAdjust : null;
    window.vsAdjust = vsAdjust = function (k, st, wy, wo, wx) {
        var r = _vs ? _vs(k, st, wy, wo, wx) : [wy, wo, wx];
        try {
            var a = r[0], b = r[1], c = r[2], tot = a + b + c, L = lockSide(k);
            if (L === 'you') return [tot * 0.95, tot * 0.03, tot * 0.02];
            if (L === 'opp') return [tot * 0.03, tot * 0.95, tot * 0.02];
            var sd = gameState.ls2 && gameState.ls2.seat[k];
            if (sd) { a *= 1 + 0.3 * (sd.you.m + sd.you.r); b *= 1 + 0.3 * (sd.opp.m + sd.opp.r); return [a, b, c]; }
        } catch (e) {}
        return r;
    };

    // ------------------------------------------------------------ actions
    function nActive(st) { try { return activeSeats(st).length; } catch (e) { return 0; } }
    function actStateUnit(kind, st) {
        var n = nActive(st);
        return {
            type: NAME[kind] + ' (' + st + ')', st: st, big: false,
            cost: Math.round(PER[kind] * n * 10) / 10, stamina: STAM[kind],
            check: function (side) {
                var u = U(st, side);
                if (!n) return 'Is phase mein ' + st + ' ki seat nahi hai.';
                if (u[kind] >= 5) return NAME[kind] + ' ka meter 5/5 poora ho chuka.';
                if (kind !== 'k' && gameState.turnout === 0 && u[kind] >= 2) return 'Pehle round mein ek state mein sirf 2 baar ' + NAME[kind] + ' ho sakta hai.';
                return null;
            },
            apply: function (m, side) {
                var u = U(st, side); u[kind]++; bust();
                return { text: (side === 'you' ? 'Aapne ' : 'Virodhi ne ') + st + ' mein ' + NAME[kind] + ' kiya (' + u[kind] + '/5).', good: true };
            }
        };
    }
    function actSeatUnit(kind, st, key, pc) {
        return {
            type: NAME[kind] + ' seat (' + pc + ')', st: st, big: false,
            cost: kind === 'k' ? 1.0 : 0.2, stamina: kind === 'k' ? 3 : (kind === 'r' ? 2 : 1),
            check: function (side) {
                var u = SU(key, side);
                if (kind === 'k') return u.k ? 'Is seat par karyakarta pehle se lage hain.' : null;
                if (u[kind] >= 5) return NAME[kind] + ' 5/5 poora.';
                if (gameState.turnout === 0 && u[kind] >= 2) return 'Pehle round mein ek seat par sirf 2 baar.';
                return null;
            },
            apply: function (m, side) {
                var u = SU(key, side); u[kind]++; bust();
                return { text: (side === 'you' ? 'Aapne ' : 'Virodhi ne ') + pc + ' seat par ' + NAME[kind] + ' kiya' + (kind === 'k' ? ' (seat pakki).' : ' (' + u[kind] + '/5).'), good: true };
            }
        };
    }
    window.lsw2StateAction = actStateUnit;

    // AI ko bhi wahi chaalein
    var _aic = typeof aiCandidates === 'function' ? aiCandidates : null;
    if (_aic) window.aiCandidates = aiCandidates = function (side, view) {
        var list = _aic(side, view) || [];
        try {
            var cnt = {};
            Object.keys(resultModel.seats).forEach(function (k) { var s = resultModel.seats[k]; if (s.phase === gameState.phase) cnt[s.st] = (cnt[s.st] || 0) + 1; });
            Object.keys(cnt).forEach(function (st) {
                ['m', 'r', 'k'].forEach(function (kd) {
                    var a = actStateUnit(kd, st);
                    list.push({ a: a, ev: function (mm) { return a.check(side) ? 0 : 0.075 * cnt[st] * (mm || 1) * (kd === 'k' ? 0.6 : 1); } });
                });
            });
        } catch (e) {}
        return list;
    };

    // action ka hisaab save kare (round summary ke liye)
    var _da = doAction;
    window.doAction = doAction = function (side, a, fund) {
        var r = _da(side, a, fund);
        try { if (r && r.ok) L2().log.push({ side: side, phase: gameState.phase, round: gameState.round, text: r.text, cost: a.cost || 0 }); } catch (e) {}
        return r;
    };

    // ------------------------------------------------------------ popups
    function css() {
        if (document.getElementById('lsw2-css')) return;
        var s = document.createElement('style'); s.id = 'lsw2-css';
        s.textContent = [
            '.wr-side-icon[data-ic="MED"],.wr-side-icon[data-ic="ITC"]{display:none!important}',
            '#s37-wrbtns{display:none!important}',
            '#lsw2-pop{position:fixed;right:12px;top:84px;width:340px;max-height:calc(100vh - 110px);overflow:auto;z-index:75;background:#101a29;border:1px solid #2c3e55;border-top:3px solid #e8a33d;border-radius:14px;padding:14px;color:#efe6d2;font-family:inherit;box-shadow:0 10px 30px rgba(0,0,0,.5)}',
            '#lsw2-pop h3{margin:0;font-size:1.15rem}#lsw2-pop small{color:#9fb0c4}#lsw2-pop .x{float:right;background:none;border:0;color:#9fb0c4;font-size:1.4rem;cursor:pointer}',
            '.lsw2-row{margin:12px 0;padding:10px;border-radius:10px;background:#16233a;border:1px solid #243650}.lsw2-row .t{display:flex;justify-content:space-between;align-items:center;font-weight:700}',
            '.lsw2-seg{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin:8px 0 4px}.lsw2-seg i{height:10px;border-radius:3px;background:#243650}.lsw2-seg i.y{background:#4f9d69}.lsw2-seg.o i.o{background:#c4553f}',
            '.lsw2-btn{padding:7px 12px;border-radius:9px;border:0;background:#e8a33d;color:#2a1a00;font-weight:800;cursor:pointer;font-family:inherit}.lsw2-btn:disabled{opacity:.4;cursor:not-allowed}',
            '.lsw2-msg{margin:8px 0;padding:8px 10px;border-radius:8px;background:#1d2d47;font-size:.85rem;color:#f3dca0}',
            '.lsw2-seat{display:flex;justify-content:space-between;padding:6px 8px;border-bottom:1px solid #1f3049;cursor:pointer;font-size:.88rem}.lsw2-seat:hover{background:#1d2d47}',
            '.lsw2-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;background:#566a85}.lsw2-dot.y{background:#4f9d69}.lsw2-dot.o{background:#c4553f}',
                        '#lsw2-sum{position:fixed;inset:0;z-index:9000;background:rgba(6,10,18,.88);display:flex;align-items:center;justify-content:center;padding:14px}',
            '#lsw2-sum .bx{width:min(860px,96vw);max-height:92vh;overflow:auto;background:#101a29;border:1px solid #2c3e55;border-top:4px solid #e8a33d;border-radius:18px;padding:22px;color:#efe6d2}',
            '#lsw2-sum h2{margin:0;font-size:1.7rem;color:#f6e3b4}#lsw2-sum .cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}@media(max-width:700px){#lsw2-sum .cols{grid-template-columns:1fr}}',
            '#lsw2-sum .col{background:#16233a;border:1px solid #243650;border-radius:12px;padding:12px}#lsw2-sum .col h4{margin:0 0 8px;letter-spacing:2px;font-size:.8rem;color:#9fb0c4}',
            '#lsw2-sum .it{padding:7px 0;border-bottom:1px solid #1f3049;font-size:.88rem;opacity:0;transform:translateY(8px);animation:lsw2in .45s ease forwards}',
            '@keyframes lsw2in{to{opacity:1;transform:none}}',
            '#lsw2-sum .tot{display:flex;justify-content:space-between;margin-top:8px;font-weight:800;color:#f6e3b4}',
            '.lsw2-big{display:flex;gap:18px;justify-content:center;margin:16px 0;text-align:center}.lsw2-big b{display:block;font-size:2.4rem;font-variant-numeric:tabular-nums}.lsw2-big small{color:#9fb0c4;letter-spacing:2px}',
            '.lsw2-go{padding:12px 28px;border-radius:12px;border:0;background:#e8a33d;color:#2a1a00;font-weight:900;cursor:pointer;font-size:1rem;font-family:inherit}'
        ].join('\n');
        document.head.appendChild(s);
    }
    function closePop() { if (pop) { pop.remove(); pop = null; } ST.st = null; ST.key = null; }
    function ensurePop() { css(); if (!pop) { pop = document.createElement('div'); pop.id = 'lsw2-pop'; document.body.appendChild(pop); } return pop; }
    function meter(kind, u, o) {
        var seg = '<div class="lsw2-seg ' + (o ? 'o' : '') + '">';
        for (var i = 0; i < 5; i++) seg += '<i class="' + (i < u ? 'y' : '') + '"></i>';
        seg += '</div>';
        if (o) { seg += '<div class="lsw2-seg o">'; for (var j = 0; j < 5; j++) seg += '<i class="' + (j < o ? 'o' : '') + '"></i>'; seg += '</div>'; }
        return seg;
    }
    function lockCounts(st) {
        var y = 0, o = 0, n = 0;
        Object.keys(resultModel.seats).forEach(function (k) { var s = resultModel.seats[k]; if (s.st === st && s.phase === gameState.phase) { n++; var L = lockSide(k); if (L === 'you') y++; else if (L === 'opp') o++; } });
        return { y: y, o: o, n: n };
    }
    function renderState() {
        var st = ST.st, el = ensurePop(), n = nActive(st), lc = lockCounts(st);
        var rows = ['m', 'r', 'k'].map(function (kd) {
            var a = actStateUnit(kd, st), uy = U(st, 'you')[kd], uo = U(st, 'opp')[kd], why = a.check('you');
            return '<div class="lsw2-row"><div class="t"><span>' + NAME[kd] + '</span><span style="color:#9fb0c4;font-size:.8rem">Aap ' + uy + '/5 | Virodhi ' + uo + '/5</span></div>' + meter(kd, uy, uo) +
                '<div style="display:flex;justify-content:space-between;align-items:center"><small>' + a.cost + ' Cr | stamina ' + a.stamina + '%</small><button class="lsw2-btn" onclick="lsw2Act(\'' + kd + '\')"' + (why ? ' disabled' : '') + '>+1 ' + NAME[kd] + '</button></div>' + (why ? '<small style="color:#c9a36a">' + why + '</small>' : '') + '</div>';
        }).join('');
        var seats = '';
        try { activeSeats(st).forEach(function (s) { var L = lockSide(s.key); seats += '<div class="lsw2-seat" onclick="lsw2OpenSeat(\'' + String(st).replace(/'/g, "\\'") + '\',\'' + String(s.pc || s.name || '').replace(/'/g, "\\'") + '\')"><span><i class="lsw2-dot ' + (L === 'you' ? 'y' : (L === 'opp' ? 'o' : '')) + '"></i>' + E(s.pc || s.name || s.key) + '</span><small>' + (L === 'you' ? 'aapki pakki' : (L === 'opp' ? 'virodhi ki' : '')) + '</small></div>'; }); } catch (e) {}
        el.innerHTML = '<button class="x" onclick="lsw2Close()">&times;</button><h3>' + E(st) + '</h3><small>Phase ' + gameState.phase + ' | is phase mein ' + n + ' seat</small>' +
            '<div style="margin:8px 0;font-size:.9rem">Pakki seat: <b style="color:#7bc592">aap ' + lc.y + '</b> | <b style="color:#e28a78">virodhi ' + lc.o + '</b> / ' + lc.n + '</div>' + rows +
            (ST.msg ? '<div class="lsw2-msg">' + E(ST.msg) + '</div>' : '') + '<h3 style="font-size:.85rem;letter-spacing:2px;color:#9fb0c4;margin-top:12px">SEAT (dabao)</h3>' + (seats || '<small>Seat nahi.</small>');
    }
    function renderSeat() {
        var st = ST.st, key = ST.key, s = resultModel.seats[key], el = ensurePop(), live = s && s.phase === gameState.phase;
        var L = lockSide(key), rows = '';
        if (live) {
            rows = ['m', 'r', 'k'].map(function (kd) {
                var a = actSeatUnit(kd, st, key, s.pc), uy = SU(key, 'you')[kd], uo = SU(key, 'opp')[kd], why = a.check('you');
                var mt = kd === 'k' ? '<div class="lsw2-seg o"><i class="' + (uy ? 'y' : '') + '" style="grid-column:1/-1"></i></div>' : meter(kd, uy, uo);
                return '<div class="lsw2-row"><div class="t"><span>' + NAME[kd] + (kd === 'k' ? ' (seat 100% pakki)' : '') + '</span><span style="color:#9fb0c4;font-size:.8rem">' + (kd === 'k' ? (uy ? 'Aap lage hain' : (uo ? 'Virodhi lage hain' : '')) : 'Aap ' + uy + '/5 | Virodhi ' + uo + '/5') + '</span></div>' + (kd === 'k' ? '' : mt) +
                    '<div style="display:flex;justify-content:space-between;align-items:center"><small>' + a.cost + ' Cr | stamina ' + a.stamina + '%</small><button class="lsw2-btn" onclick="lsw2SeatAct(\'' + kd + '\')"' + (why ? ' disabled' : '') + '>' + (kd === 'k' ? 'Lagao' : '+1 ' + NAME[kd]) + '</button></div>' + (why ? '<small style="color:#c9a36a">' + why + '</small>' : '') + '</div>';
            }).join('');
        } else rows = '<div class="lsw2-msg">Ye seat is phase mein nahi hai (Phase ' + (s ? s.phase : '?') + ').</div>';
        el.innerHTML = '<button class="x" onclick="lsw2Close()">&times;</button><h3>' + E(s ? s.pc : key) + '</h3><small>' + E(st) + (s ? ' | ' + E(s.you) + ' vs ' + E(s.opp) : '') + '</small>' +
            '<div style="margin:8px 0;font-size:.9rem">Sthiti: ' + (L === 'you' ? '<b style="color:#7bc592">aapki seat pakki</b>' : (L === 'opp' ? '<b style="color:#e28a78">virodhi ki pakki</b>' : 'khuli takkar')) + '</div>' + rows + (ST.msg ? '<div class="lsw2-msg">' + E(ST.msg) + '</div>' : '') +
            '<div style="margin-top:10px"><button class="lsw2-btn" style="background:#243650;color:#efe6d2" onclick="lsw2OpenState(\'' + String(st).replace(/'/g, "\\'") + '\')">&larr; ' + E(st) + '</button></div>';
    }
    function run(a) {
        var r = doAction('you', a, gameState.fundMode || 'white');
        ST.msg = r.text;
        try { if (typeof updateStatusPanel === 'function') updateStatusPanel(); if (typeof updateSeatStatusBox === 'function') updateSeatStatusBox(); } catch (e) {}
        try { if (typeof allLayer !== 'undefined' && allLayer && typeof refreshStyles === 'function') refreshStyles(); } catch (e) {}
    }
    window.lsw2Close = closePop;
    window.lsw2OpenState = function (st) { ST.st = st; ST.key = null; ST.msg = ''; renderState(); };
    window.lsw2OpenSeat = function (st, pc) {
        var key = Object.keys(resultModel.seats).filter(function (k) { var s = resultModel.seats[k]; return s.st === st && s.pc === pc; })[0];
        if (!key) { return; }
        ST.st = st; ST.key = key; ST.msg = ''; renderSeat();
    };
    window.lsw2Act = function (kd) { run(actStateUnit(kd, ST.st)); renderState(); };
    window.lsw2SeatAct = function (kd) { var s = resultModel.seats[ST.key]; run(actSeatUnit(kd, ST.st, ST.key, s.pc)); renderSeat(); };

    // map click: state -> popup
    var _sel = typeof selectState === 'function' ? selectState : null;
    if (_sel) window.selectState = selectState = function (st) {
        _sel(st);
        try { if (gameState && resultModel) window.lsw2OpenState(st); } catch (e) {}
    };
    window.lsw2FocusSeat = function (st, pc) {
        try {
            if (typeof selectState === 'function') _sel(st);
            if (typeof allLayer !== 'undefined' && allLayer) allLayer.eachLayer(function (l) {
                var p = l.feature && l.feature.properties;
                if (p && getPCName(p) === pc && getStateName(p) === st) { try { indiaMap.fitBounds(l.getBounds(), { maxZoom: 8 }); } catch (e) {} }
            });
            var box = document.getElementById('s37-seatbox'); if (box) box.remove();
            window.lsw2OpenSeat(st, pc);
        } catch (e) {}
    };
    // kaante ki seat ki list: seat par dabane se map mein khule
    window.s37SeatsBox = function () {
        css();
        var old = document.getElementById('s37-seatbox'); if (old) { old.remove(); return; }
        var rows = [];
        try { rows = computeLeads().seats.filter(function (x) { return x.margin <= 10; }).sort(function (a, b) { return a.margin - b.margin; }); } catch (e) {}
        var d = document.createElement('div'); d.id = 's37-seatbox';
        d.style.cssText = 'position:fixed;inset:0;z-index:9100;background:rgba(6,10,18,.82);display:flex;align-items:center;justify-content:center;padding:14px';
        d.innerHTML = '<div style="width:min(520px,96vw);max-height:86vh;overflow:auto;background:#101a29;border:1px solid #2c3e55;border-top:3px solid #e8a33d;border-radius:16px;padding:18px;color:#efe6d2"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:1.15rem">Kaante ki seat (10% ke andar)</b><button onclick="document.getElementById(\'s37-seatbox\').remove()" style="background:none;border:0;color:#9fb0c4;font-size:1.5rem;cursor:pointer">&times;</button></div><small style="color:#9fb0c4">Seat par dabao, map mein khul jayegi.</small>' +
            (rows.length ? rows.slice(0, 80).map(function (x) {
                var col = x.side === 'you' ? '#7bc592' : (x.side === 'opp' ? '#e28a78' : '#9fb0c4');
                return '<div class="lsw2-seat" onclick="lsw2FocusSeat(\'' + String(x.st).replace(/'/g, "\\'") + '\',\'' + String(x.pc).replace(/'/g, "\\'") + '\')"><span><b>' + E(x.pc) + '</b><br><small>' + E(x.st) + '</small></span><span style="text-align:right;color:' + col + '"><b>' + (x.side === 'you' ? 'Aap aage' : (x.side === 'opp' ? 'Virodhi aage' : 'Anya aage')) + '</b><br><small>' + x.margin.toFixed(1) + '% antar</small></span></div>';
            }).join('') : '<p style="color:#9fb0c4;margin-top:12px">Abhi koi seat 10% ke andar ki takkar mein nahi hai.</p>') + '</div>';
        d.addEventListener('click', function (e) { if (e.target === d) d.remove(); });
        document.body.appendChild(d);
    };

    // kaante ki seat ka icon: baaki icons ke saath, left column mein
    var TARGET = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';
    function chrome() {
        css();
        var wr = document.getElementById('warroom-screen'), on = wr && !wr.classList.contains('hidden');
        if (!on) { closePop(); return; }
        if (!document.getElementById('lsw2-seaticon')) {
            var ref = document.querySelector('.wr-side-icon[onclick*="Stamina"]') || document.querySelector('.wr-side-icon');
            if (ref && ref.parentNode) {
                var b = document.createElement('button'); b.id = 'lsw2-seaticon'; b.className = 'wr-side-icon'; b.title = 'Kaante ki seat';
                b.innerHTML = TARGET + '<span class="ic-t">SEAT</span>'; b.onclick = function () { window.s37SeatsBox(); };
                ref.parentNode.insertBefore(b, ref.nextSibling);
            }
        }
    }
    setInterval(chrome, 800);
    window.lsw2Exit = function () { if (confirm('War-room se bahar jaana hai? Game auto-save hai.')) { closePop(); try { closeGameModal(); } catch (e) {} if (typeof goBackToDashboardS34 === 'function') goBackToDashboardS34(); } };
    var _rsp = typeof renderSettingsPanel === 'function' ? renderSettingsPanel : null;
    if (_rsp) window.renderSettingsPanel = renderSettingsPanel = function () { return _rsp.apply(this, arguments) + '<div style="margin-top:14px"><button class="lsw2-btn" onclick="lsw2Exit()">&larr; War-room se bahar (Dashboard)</button></div>'; };

    // seat par dabane se (state khule hone par) seat popup
    var _alert = window.alert;
    window.alert = function (msg) {
        var m = /^(.*) - (.*) selected for campaign!$/.exec(String(msg));
        if (m && resultModel) { window.lsw2OpenSeat(m[1], m[2]); return; }
        return _alert.call(window, msg);
    };

    // ------------------------------------------------------------ round ka hisaab (summary)
    function summary(phase, round) {
        css();
        var l = L2(), mine = l.log.filter(function (x) { return x.side === 'you' && x.phase === phase && x.round === round; }), his = l.log.filter(function (x) { return x.side === 'opp' && x.phase === phase && x.round === round; });
        var sum = function (a) { return Math.round(a.reduce(function (t, x) { return t + (x.cost || 0); }, 0) * 10) / 10; };
        var y = 0, o = 0, n = 0;
        try { computeLeads().seats.forEach(function (x) { var s = resultModel.seats[x.key]; if (s && s.phase === phase) { n++; if (x.side === 'you') y++; else if (x.side === 'opp') o++; } }); } catch (e) {}
        var col = function (arr, who) { return arr.length ? arr.map(function (x, i) { return '<div class="it" style="animation-delay:' + (i * 0.07) + 's">' + E(x.text) + ' <small style="color:#9fb0c4">(' + x.cost + ' Cr)</small></div>'; }).join('') : '<div class="it" style="color:#9fb0c4">' + who + ' ne is round mein kuch nahi kiya.</div>'; };
        var d = document.createElement('div'); d.id = 'lsw2-sum';
        d.innerHTML = '<div class="bx"><h2>Phase ' + phase + ' \u00B7 Round ' + round + ' ka hisaab</h2><small style="color:#9fb0c4">Is round mein kisne kya kiya</small>' +
            '<div class="lsw2-big"><div><b style="color:#7bc592" data-n="' + y + '">0</b><small>AAP AAGE</small></div><div><b style="color:#e28a78" data-n="' + o + '">0</b><small>VIRODHI AAGE</small></div><div><b style="color:#9fb0c4" data-n="' + Math.max(0, n - y - o) + '">0</b><small>BARABAR / ANYA</small></div></div>' +
            '<div class="cols"><div class="col"><h4>AAPNE KIYA</h4>' + col(mine, 'Aapne') + '<div class="tot"><span>Kul kharch</span><span>' + sum(mine) + ' Cr</span></div></div><div class="col"><h4>VIRODHI NE KIYA</h4>' + col(his, 'Virodhi') + '<div class="tot"><span>Kul kharch</span><span>' + sum(his) + ' Cr</span></div></div></div>' +
            '<div style="text-align:center;margin-top:16px"><button class="lsw2-go" onclick="document.getElementById(\'lsw2-sum\').remove()">AGLA ROUND \u2192</button></div></div>';
        document.body.appendChild(d);
        [].forEach.call(d.querySelectorAll('[data-n]'), function (e) { var t = +e.getAttribute('data-n'), c = 0, iv = setInterval(function () { c++; e.textContent = c; if (c >= t) clearInterval(iv); }, 40); if (!t) e.textContent = 0; });
    }
    var _fr = typeof finishRound === 'function' ? finishRound : null;
    if (_fr) window.finishRound = finishRound = function () {
        var ph = gameState.phase, rd = gameState.round;
        _fr();
        try {
            if (!gameState.phaseEnded) { summary(ph, rd); maybeCase(ph, rd); }
        } catch (e) { console.warn(e); }
    };

    // ------------------------------------------------------------ virodhi ka court case
    function perks() { try { return (window.CareerMode && CareerMode.perks && typeof selectedYouParty !== 'undefined' && CareerMode.hasParty() && CareerMode.getParty().name === selectedYouParty) ? CareerMode.perks() : {}; } catch (e) { return {}; } }
    function maybeCase(ph, rd) {
        var l = L2();
        if (l.caseDone[ph] || rd !== 2 || Math.random() > 0.6) return;
        l.caseDone[ph] = 1;
        var topics = ['Chunavi chande mein gadbadi', 'Aachar-sanhita ulanghan', 'Bhadkau bhashan', 'Jhoote vaade'], t = topics[Math.floor(Math.random() * topics.length)];
        var d = document.createElement('div'); d.id = 'lsw2-case';
        d.style.cssText = 'position:fixed;inset:0;z-index:9200;background:rgba(6,10,18,.88);display:flex;align-items:center;justify-content:center;padding:14px';
        var pk = perks(), L = [['Junior wakeel', 3, 0.35], ['Anubhavi wakeel', 8, 0.62], ['Senior Advocate', 18, 0.9]];
        d.innerHTML = '<div style="width:min(520px,96vw);background:#101a29;border:1px solid #c4553f;border-top:4px solid #c4553f;border-radius:16px;padding:20px;color:#efe6d2"><h2 style="margin:0;color:#f3b4a6">Court mein aapke khilaf case!</h2><p style="color:#cbd5e1">Virodhi ne aap par <b>' + E(t) + '</b> ka case kiya hai. Wakeel lagakar ladna hoga.' + (pk.judge ? '<br><b style="color:#7bc592">Aapka judge sampark kaam aayega.</b>' : '') + '</p><div id="lsw2-case-b">' +
            L.map(function (w, i) { return '<div class="lsw2-seat" onclick="lsw2Case(' + i + ')"><span><b>' + w[0] + '</b><br><small>Fees ' + w[1] + ' Cr | jeetne ki sambhavna ~' + Math.round((pk.judge ? 0.97 : w[2]) * 100) + '%</small></span><button class="lsw2-btn">Rakho</button></div>'; }).join('') +
            '<div class="lsw2-seat" onclick="lsw2Case(-1)"><span><b>Nazarandaz karo</b><br><small>Case haarne ka bada khatra</small></span></div></div></div>';
        document.body.appendChild(d);
        window.lsw2Case = function (i) {
            var out, box = document.getElementById('lsw2-case-b'); if (!box) return;
            var pk2 = perks(), fee = i >= 0 ? L[i][1] : 0, ch = i >= 0 ? (pk2.judge ? 0.97 : L[i][2]) : 0.15;
            if (i >= 0 && resGet('you', 'budget') < fee) { box.insertAdjacentHTML('afterbegin', '<div class="lsw2-msg">Itna paisa nahi hai.</div>'); return; }
            if (i >= 0) resSet('you', 'budget', resGet('you', 'budget') - fee);
            if (Math.random() < ch) { addBoost('you', 'national', 0.012); out = '<b style="color:#7bc592">Court ne case khaarij kiya!</b> Aapki saakh badhi.'; }
            else { addBoost('opp', 'national', 0.04); resSet('you', 'budget', Math.max(0, resGet('you', 'budget') - 10)); out = '<b style="color:#e28a78">Aap case haar gaye.</b> Saakh giri aur 10 Cr jurmana.'; }
            box.innerHTML = '<p>' + out + '</p><button class="lsw2-go" onclick="document.getElementById(\'lsw2-case\').remove()">THEEK HAI</button>';
            try { updateStatusPanel(); } catch (e) {}
        };
    }

    // ------------------------------------------------------------ VIP: sirf apni party ki seat
    function ensureOwn(key) {
        var s = resultModel.seats[key], main = selectedYouParty, note = '';
        if (!s || !main || s.you === main) return '';
        var old = s.you, alt = Object.keys(resultModel.seats).filter(function (k) { var t = resultModel.seats[k]; return t.st === s.st && t.you === main && k !== key; })[0];
        s.you = main;
        if (alt) { resultModel.seats[alt].you = old; note = ' (Ye seat ' + old + ' ke paas thi: badle mein ' + resultModel.seats[alt].pc + ' unhe di gayi.)'; }
        return note;
    }
    var _av = typeof actVip === 'function' ? actVip : null;
    if (_av) window.actVip = actVip = function (key, name) {
        var a = _av(key, name), ap = a.apply;
        a.apply = function (m, side) { var note = side === 'you' ? ensureOwn(key) : ''; var r = ap.call(a, m, side); if (r && note) r.text += note; return r; };
        return a;
    };

    // ghoshna-patra: asli vote ka asar
    var _pr = typeof actPromise === 'function' ? actPromise : null;
    if (_pr) window.actPromise = actPromise = function (id) {
        var a = _pr(id); if (!a) return a; var ap = a.apply;
        a.apply = function (m, side) { var r = ap.call(a, m, side); try { addBoost(side, 'national', 0.03); if (r) r.text += ' (us varg ke vote mein ~6-7% ka fayda)'; } catch (e) {} return r; };
        return a;
    };

    // ------------------------------------------------------------ career: consultancy / EC / judge / tickets
    var _sw = typeof startWarRoomMap === 'function' ? startWarRoomMap : null;
    if (_sw) window.startWarRoomMap = startWarRoomMap = function () {
        var r = _sw.apply(this, arguments);
        try {
            var pk = perks();
            if (pk && (pk.consult || pk.ecActive)) {
                var b = (pk.consult ? 0.05 : 0) + (pk.ecActive ? 0.07 : 0);
                addBoost('you', 'national', b);
                if (pk.ecActive) { try { localStorage.setItem('rajniti_ec_used', '1'); } catch (e) {} }
            }
            if (pk && window.CareerHub && CareerHub.allTickets) {
                CareerHub.allTickets().filter(function (t) { return t.kind === 'MP' && t.seat; }).forEach(function (t) {
                    var key = Object.keys(resultModel.seats).filter(function (k) { return resultModel.seats[k].pc === t.seat; })[0];
                    if (!key) return;
                    var note = ensureOwn(key), a = _av ? _av(key, t.name) : null;
                    if (a) { a.cost = 0; a.stamina = 0; _da('you', a, 'white'); }
                });
            }
        } catch (e) { console.warn('ls-war2 start', e); }
        return r;
    };

    // game poora hone par resume button na aaye
    var _rep = typeof fsReport === 'function' ? fsReport : null;
    if (_rep) window.fsReport = fsReport = function () {
        var r = _rep.apply(this, arguments);
        try { localStorage.removeItem(SAVE_KEY); var b = document.getElementById('s36-cont'); if (b) b.remove(); var c = document.getElementById('s34-dash-cont'); if (c) c.remove(); } catch (e) {}
        return r;
    };

    // ------------------------------------------------------------ icons: shaant, ek jaisa rang
    var PALETTE = [['#2b4a6f', '#1a2e47'], ['#5a4a2b', '#3a2f1a'], ['#2f5a4a', '#1c3a2f'], ['#5a2f3a', '#3a1c25'], ['#3a3f5a', '#222640']];
    try {
        if (typeof ICON_SVG === 'object') {
            Object.keys(ICON_SVG).forEach(function (k, i) { var v = ICON_SVG[k]; if (Array.isArray(v)) { var p = PALETTE[i % PALETTE.length]; v[0] = p[0]; v[1] = p[1]; } });
        }
        if (typeof S22_ICON_FILE === 'object') Object.keys(S22_ICON_FILE).forEach(function (k) { delete S22_ICON_FILE[k]; });
        if (typeof s22RefreshIcons === 'function') window.s22RefreshIcons = s22RefreshIcons = function () { [].forEach.call(document.querySelectorAll('.wr-side-icon[data-ic]'), function (b) { b.classList.remove('s22-iconbtn'); b.style.backgroundImage = ''; }); };
    } catch (e) {}
})();
