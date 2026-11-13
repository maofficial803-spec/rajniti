window.addEventListener('DOMContentLoaded', () => {
    document.title = 'Rajniti - The Grand Strategy [Stage 35]';
    const splashScreen = document.getElementById('splash-screen');
    const mainDashboard = document.getElementById('main-dashboard');
    const netajiVideo = document.getElementById('netaji-video');

    setTimeout(() => {
        showDashboard();
    }, 3500);

    if (netajiVideo && netajiVideo.tagName === 'VIDEO') netajiVideo.onended = function() {
        showDashboard();
    };

    function showDashboard() {
        if (!splashScreen.classList.contains('hidden')) {
            splashScreen.style.transition = 'opacity 0.8s ease';
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                mainDashboard.classList.remove('hidden');
            }, 800);
        }
    }
});

function openElection(type) {
    if (type === 'lok-sabha') {
        document.getElementById('main-dashboard').classList.add('hidden');
        document.getElementById('become-pm-screen').classList.remove('hidden');
    } else {
        alert("State Assembly Election module agle update mein aayega.");
    }
}

function goBackToDashboard() {
    document.getElementById('become-pm-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
}

function goBackToPMPage() {
    document.getElementById('campaign-setup-screen').classList.add('hidden');
    document.getElementById('become-pm-screen').classList.remove('hidden');
}

function goBackToCampaign() {
    document.getElementById('seat-sharing-screen').classList.add('hidden');
    document.getElementById('campaign-setup-screen').classList.remove('hidden');
}

function showComingSoon(featureName) {
    alert(featureName + " is coming soon!");
}

function openConstituency(type) {
    alert("Constituency " + (type === 1 ? "M.L.A" : "M.P") + " campaign mode khul raha hai.");
}

function openHouse(houseType) {
    alert(houseType === 'lower-house' ? "Lower House management panel." : "Upper House management panel.");
}

const partiesList = [
    { name: "BJP", symbol: "BJP" },
    { name: "Congress", symbol: "INC" },
    { name: "Samajwadi Party", symbol: "SP" },
    { name: "BSP", symbol: "BSP" },
    { name: "AAP", symbol: "AAP" },
    { name: "AIMIM", symbol: "AIMIM" }
];

const stateSeatsData = {
    "Uttar Pradesh": 80, "Maharashtra": 48, "Bihar": 40, "West Bengal": 42,
    "Madhya Pradesh": 29, "Tamil Nadu": 39, "Karnataka": 28, "Gujarat": 26,
    "Rajasthan": 25, "Andhra Pradesh": 25, "Odisha": 21, "Kerala": 20,
    "Telangana": 17, "Jharkhand": 14, "Assam": 14, "Punjab": 13,
    "Chhattisgarh": 11, "Haryana": 10, "Uttarakhand": 5, "Himachal Pradesh": 4,
    "Goa": 2, "Tripura": 2, "Manipur": 2, "Meghalaya": 2, "Nagaland": 1,
    "Arunachal Pradesh": 2, "Mizoram": 1, "Sikkim": 1,
    "Delhi": 7, "Jammu and Kashmir": 5, "Puducherry": 1, "Chandigarh": 1,
    "Andaman and Nicobar Islands": 1, "Dadra and Nagar Haveli and Daman and Diu": 2,
    "Ladakh": 1, "Lakshadweep": 1
};

let selectedYouParty = null;
let selectedOppParty = null;
let youAlliancePartners = [{name: '', states: []}, {name: '', states: []}, {name: '', states: []}, {name: '', states: []}];
let oppAlliancePartners = [{name: '', states: []}, {name: '', states: []}, {name: '', states: []}, {name: '', states: []}];

let activeSelectionTarget = null;
let activeSlotIndex = null;

function openPartyModal(targetType) {
    activeSelectionTarget = targetType;
    activeSlotIndex = null;
    document.getElementById('modal-title').innerText = "Select Political Party";
    showModalWithOptions();
}

function openYouAllianceModal(slotIndex) {
    activeSelectionTarget = 'you-ally';
    activeSlotIndex = slotIndex;
    document.getElementById('modal-title').innerText = "Select Alliance Partner (+)";
    showModalWithOptions();
}

function openOppAllianceModal(slotIndex) {
    activeSelectionTarget = 'opp-ally';
    activeSlotIndex = slotIndex;
    document.getElementById('modal-title').innerText = "Select Opponent Alliance Partner (+)";
    showModalWithOptions();
}

function showModalWithOptions() {
    const modal = document.getElementById('party-modal');
    const grid = document.getElementById('party-grid');
    grid.innerHTML = '';
    grid.style.maxHeight = '55vh';
    const groups = [['NDA', 'NDA (BJP ke saath wale dal)'], ['INDIA', 'INDIA Bloc (Congress ke saath wale dal)'], ['OTHER', 'Alag chalne wale / kshetriya dal']];
    groups.forEach(function (g) {
        let head = null;
        partiesList.forEach(function (party) {
            if (party.bloc !== g[0]) return;
            if (party.name === selectedYouParty || party.name === selectedOppParty) return;
            let taken = false;
            youAlliancePartners.forEach(function (a, idx) {
                if (a.name === party.name && !(activeSelectionTarget === 'you-ally' && activeSlotIndex === idx)) taken = true;
            });
            oppAlliancePartners.forEach(function (a, idx) {
                if (a.name === party.name && !(activeSelectionTarget === 'opp-ally' && activeSlotIndex === idx)) taken = true;
            });
            if (taken) return;
            if (!head) {
                head = document.createElement('div');
                head.style.gridColumn = '1 / -1';
                head.style.color = '#ff9933';
                head.style.fontWeight = 'bold';
                head.style.textAlign = 'left';
                head.style.marginTop = '6px';
                head.innerText = g[1];
                grid.appendChild(head);
            }
            const card = document.createElement('div');
            card.className = 'party-option-card';
            card.innerHTML = '<span style="background:' + party.color + ';padding:4px 8px;border-radius:4px;color:#fff;font-weight:bold;font-size:0.8rem;">' + esc(party.symbol) + '</span>' +
                '<span style="color:#ffffff;font-weight:bold;font-size:0.9rem;">' + esc(party.name) +
                '<br><span style="color:#94a3b8;font-weight:normal;font-size:0.7rem;">' + esc(partyWhere(party)) + '</span></span>';
            card.onclick = function () { confirmSelection(party.name); };
            grid.appendChild(card);
        });
    });
    modal.classList.remove('hidden');
}

function confirmSelection(partyName) {
    if (activeSelectionTarget === 'you') {
        selectedYouParty = partyName;
        document.getElementById('you-text').innerText = partyName;
        document.getElementById('you-text').style.color = '#38bdf8';
    } else if (activeSelectionTarget === 'opp') {
        selectedOppParty = partyName;
        document.getElementById('opp-text').innerText = partyName;
        document.getElementById('opp-text').style.color = '#ff9933';
    } else if (activeSelectionTarget === 'you-ally') {
        youAlliancePartners[activeSlotIndex].name = partyName;
        youAlliancePartners[activeSlotIndex].states = defaultAllyStates(partyName);
        renderCampaignLayout();
    } else if (activeSelectionTarget === 'opp-ally') {
        oppAlliancePartners[activeSlotIndex].name = partyName;
        oppAlliancePartners[activeSlotIndex].states = defaultAllyStates(partyName);
        renderCampaignLayout();
    }
    closePartyModal();
}

function closePartyModal() {
    document.getElementById('party-modal').classList.add('hidden');
}

function openStateModal(side, slotIndex) {
    activeSelectionTarget = side;
    activeSlotIndex = slotIndex;
    const modal = document.getElementById('state-modal');
    const grid = document.getElementById('state-grid');
    grid.innerHTML = "";

    const currentStates = side === 'you-ally-states' ? youAlliancePartners[slotIndex].states : oppAlliancePartners[slotIndex].states;

    statesForParty(side === 'you-ally-states' ? youAlliancePartners[slotIndex].name : oppAlliancePartners[slotIndex].name).forEach(state => {
        const isChecked = currentStates.includes(state) ? 'checked' : '';
        const card = document.createElement('div');
        card.className = 'party-option-card';
        card.style.padding = '6px';
        card.innerHTML = `
            <input type="checkbox" value="${state}" ${isChecked} style="cursor:pointer;">
            <span style="color: #ffffff; font-size: 0.75rem;">${state}</span>
        `;
        grid.appendChild(card);
    });

    modal.classList.remove('hidden');
}

function closeStateModal() {
    const grid = document.getElementById('state-grid');
    const checkboxes = grid.querySelectorAll('input[type="checkbox"]');
    let selectedStates = [];
    checkboxes.forEach(cb => {
        if (cb.checked) selectedStates.push(cb.value);
    });

    if (activeSelectionTarget === 'you-ally-states') {
        youAlliancePartners[activeSlotIndex].states = selectedStates;
    } else if (activeSelectionTarget === 'opp-ally-states') {
        oppAlliancePartners[activeSlotIndex].states = selectedStates;
    }

    document.getElementById('state-modal').classList.add('hidden');
    renderCampaignLayout();
}

function goToNextPage() {
    if (!selectedYouParty || !selectedOppParty) {
        alert("Kripya 'YOU' aur 'OPPONENT' dono parties select karein!");
        return;
    }

    const fightMode = document.getElementById('choose-fight-select').value;
    document.getElementById('election-mode-badge').innerText = fightMode.toUpperCase() + " MODE";

    document.getElementById('become-pm-screen').classList.add('hidden');
    document.getElementById('campaign-setup-screen').classList.remove('hidden');

    renderCampaignLayout();
}

function renderCampaignLayout() {
    const fightMode = document.getElementById('choose-fight-select').value;
    const container = document.getElementById('campaign-layout-area');

    if (fightMode === 'alone') {
        let oppSlotsHTML = '';
        oppAlliancePartners.forEach((ally, idx) => {
            let allyDisplay = ally.name ? `${ally.name} <br><span style="font-size:0.65rem; color:#38bdf8;">(${ally.states.join(', ') || 'No State'})</span>` : '+ Add Ally';
            let btnHTML = ally.name ? `<button class="ally-state-btn" onclick="openOppAllianceModal(${idx}); event.stopPropagation();">Change</button><button class="ally-state-btn" style="background:#0284c7;" onclick="openStateModal('opp-ally-states', ${idx}); event.stopPropagation();">States</button>` : '';
            oppSlotsHTML += `<div class="party-slot-card ${ally.name ? 'filled' : ''}" onclick="openOppAllianceModal(${idx})">${allyDisplay}${btnHTML}</div>`;
        });

        container.innerHTML = `
            <div class="campaign-matchup">
                <div class="campaign-box">
                    <span class="box-label">YOU</span>
                    <h3>Main Party (Alone)</h3>
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1;">
                        <p style="color: #38bdf8; font-size: 1.3rem; font-weight:bold;">${selectedYouParty}</p>
                    </div>
                </div>

                <div class="vs-text">V/S</div>

                <div class="campaign-box">
                    <span class="box-label">OPPONENT</span>
                    <h3>Rival Party + Alliance (+)</h3>
                    <div style="margin-bottom: 5px; color: #ff9933; font-weight: bold; font-size: 0.9rem;">${selectedOppParty}</div>
                    <div class="alliance-slots-grid">${oppSlotsHTML}</div>
                </div>
            </div>
        `;
    } else {
        let youSlotsHTML = '';
        youAlliancePartners.forEach((ally, idx) => {
            let allyDisplay = ally.name ? `${ally.name} <br><span style="font-size:0.65rem; color:#38bdf8;">(${ally.states.join(', ') || 'No State'})</span>` : '+ Add Ally';
            let btnHTML = ally.name ? `<button class="ally-state-btn" onclick="openYouAllianceModal(${idx}); event.stopPropagation();">Change</button><button class="ally-state-btn" style="background:#0284c7;" onclick="openStateModal('you-ally-states', ${idx}); event.stopPropagation();">States</button>` : '';
            youSlotsHTML += `<div class="party-slot-card ${ally.name ? 'filled' : ''}" onclick="openYouAllianceModal(${idx})">${allyDisplay}${btnHTML}</div>`;
        });

        let oppSlotsHTML = '';
        oppAlliancePartners.forEach((ally, idx) => {
            let allyDisplay = ally.name ? `${ally.name} <br><span style="font-size:0.65rem; color:#38bdf8;">(${ally.states.join(', ') || 'No State'})</span>` : '+ Add Ally';
            let btnHTML = ally.name ? `<button class="ally-state-btn" onclick="openOppAllianceModal(${idx}); event.stopPropagation();">Change</button><button class="ally-state-btn" style="background:#0284c7;" onclick="openStateModal('opp-ally-states', ${idx}); event.stopPropagation();">States</button>` : '';
            oppSlotsHTML += `<div class="party-slot-card ${ally.name ? 'filled' : ''}" onclick="openOppAllianceModal(${idx})">${allyDisplay}${btnHTML}</div>`;
        });

        container.innerHTML = `
            <div class="campaign-matchup">
                <div class="campaign-box">
                    <span class="box-label">YOU</span>
                    <h3>Main Party + Alliance (+)</h3>
                    <div style="margin-bottom: 5px; color: #38bdf8; font-weight: bold; font-size: 0.9rem;">${selectedYouParty}</div>
                    <div class="alliance-slots-grid">${youSlotsHTML}</div>
                </div>

                <div class="vs-text">V/S</div>

                <div class="campaign-box">
                    <span class="box-label">OPPONENT</span>
                    <h3>Main Rival + Alliance (+)</h3>
                    <div style="margin-bottom: 5px; color: #ff9933; font-weight: bold; font-size: 0.9rem;">${selectedOppParty}</div>
                    <div class="alliance-slots-grid">${oppSlotsHTML}</div>
                </div>
            </div>
        `;
    }
}

function openSeatSharingPage() {
    document.getElementById('campaign-setup-screen').classList.add('hidden');
    document.getElementById('seat-sharing-screen').classList.remove('hidden');

    const container = document.getElementById('seat-sharing-container');
    container.innerHTML = "";

    const fightMode = document.getElementById('choose-fight-select').value;
    let activeAllies = fightMode === 'alliance' ? youAlliancePartners.filter(a => a.name !== '' && a.states.length > 0) : [];

    if (activeAllies.length === 0) {
        container.innerHTML = `<p style="color: #94a3b8; text-align:center; padding: 30px;">Akele chunav ladne par ya kisi ally ke liye states select na karne par seat sharing ki avashyakta nahi hai!</p>`;
        return;
    }

    activeAllies.forEach(ally => {
        ally.states.forEach(state => {
            const totalSeats = stateSeatsData[state] || 10;
            const row = document.createElement('div');
            row.className = 'seat-sharing-row';
            row.innerHTML = `
                <div class="seat-box-party" id="you-seat-${state}">${selectedYouParty}: <span style="font-size:1.1rem; color:#ffffff;">${Math.round(totalSeats / 2)}</span></div>
                <div class="seat-box-state">${state} <br><span style="font-size:0.7rem; color:#94a3b8;">(Total: ${totalSeats})</span></div>
                <div class="seat-slider-container">
                    <span style="font-size:0.75rem; color:#cbd5e1;">Adjust Seats Split</span>
                    <input type="range" min="0" max="${totalSeats}" value="${Math.round(totalSeats / 2)}" id="slider-${state}" oninput="updateSeatCounts('${state}', ${totalSeats}, '${selectedYouParty}', '${ally.name}')">
                </div>
                <div class="seat-box-party" style="border-color:#ff9933; color:#ff9933;" id="ally-seat-${state}">${ally.name}: <span style="font-size:1.1rem; color:#ffffff;">${totalSeats - Math.round(totalSeats / 2)}</span></div>
            `;
            container.appendChild(row);
        });
    });
}

function updateSeatCounts(state, totalSeats, youName, allyName) {
    const sliderVal = parseInt(document.getElementById(`slider-${state}`).value);
    document.getElementById(`you-seat-${state}`).innerHTML = `${youName}: <span style="font-size:1.1rem; color:#ffffff;">${sliderVal}</span>`;
    document.getElementById(`ally-seat-${state}`).innerHTML = `${allyName}: <span style="font-size:1.1rem; color:#ffffff;">${totalSeats - sliderVal}</span>`;
}

function startWarRoomMap() {
    document.getElementById('seat-sharing-screen').classList.add('hidden');
    document.getElementById('warroom-screen').classList.remove('hidden');

    document.getElementById('wr-you-logo').innerText = selectedYouParty || 'YOU';
    document.getElementById('wr-opp-logo').innerText = selectedOppParty || 'OPP';

    initGame();
    resetToNationalView();
}

// ================= INDIA MAP (Leaflet) =================

let indiaMap = null;
let allLayer = null;
let stateLayers = {};
let selectedState = null;

// GeoJSON ke andar field ka naam alag ho sakta hai, isliye kai naam try karte hain
function findKey(props, names) {
    const keys = Object.keys(props);
    for (const n of names) {
        const k = keys.find(x => x.toLowerCase() === n.toLowerCase());
        if (k && props[k]) return props[k];
    }
    return null;
}

function getStateName(p) {
    const pc = findKey(p, ['PC_NAME', 'PC', 'PC_NM', 'CONSTITUEN', 'NAME']);
    const st = findKey(p, ['ST_NAME', 'STATE', 'STATE_NAME', 'ST_NM', 'NAME_1']);
    if ((pc && pc.toLowerCase().indexOf('ladakh') !== -1) || (st && st.toLowerCase().indexOf('ladakh') !== -1)) {
        return 'Ladakh';
    }
    return st || 'Unknown';
}

function getPCName(p) {
    return findKey(p, ['PC_NAME', 'PC', 'PC_NM', 'CONSTITUEN', 'NAME']) || 'Unknown';
}

const NEUTRAL_FILL = '#1e293b';
const NEUTRAL_BORDER = '#475569';

const partyColors = {
    "BJP": "#f97316",
    "Congress": "#22c55e",
    "Samajwadi Party": "#ef4444",
    "BSP": "#3b82f6",
    "AAP": "#06b6d4",
    "AIMIM": "#16a34a",
    "Others": "#9ca3af"
};

// Jeet ka record yahan jayega. Abhi khali hai, isliye map kala dikhega.
// Example baad mein: seatResults["Tripura|Tripura West"] = "BJP"; refreshStyles();
let seatResults = {};

const ACTIVE_FILL = '#1d4f8a';
const PAST_FILL = '#273244';
const FUTURE_FILL = '#111827';

const HOVER_FILL = {};
HOVER_FILL[ACTIVE_FILL] = '#2f6db5';
HOVER_FILL[PAST_FILL] = '#3a475c';
HOVER_FILL[FUTURE_FILL] = '#1c2638';
HOVER_FILL[NEUTRAL_FILL] = '#334155';

function hoverOf(fill) {
    return HOVER_FILL[fill] || fill;
}

function phaseOf(layer) {
    return layer.feature.properties.__phase || 0;
}

function fillFor(layer) {
    const p = layer.feature.properties;
    const winner = seatResults[getStateName(p) + '|' + getPCName(p)];
    if (partyColors[winner]) return partyColors[winner];

    const ph = phaseOf(layer);
    if (ph === 0) return NEUTRAL_FILL;
    if (ph === gameState.phase) return ACTIVE_FILL;
    if (ph < gameState.phase) return PAST_FILL;
    return FUTURE_FILL;
}

function styleFor(layer, hover) {
    const s = getStateName(layer.feature.properties);
    const fill = fillFor(layer);
    const active = phaseOf(layer) === gameState.phase;

    if (selectedState === null) {
        return {
            color: hover ? '#38bdf8' : (active ? '#3b82f6' : NEUTRAL_BORDER),
            weight: hover ? 1.5 : 0.4,
            fillColor: hover ? hoverOf(fill) : fill,
            fillOpacity: 1
        };
    }
    if (s === selectedState) {
        return {
            color: hover ? '#facc15' : '#94a3b8',
            weight: hover ? 2 : 1,
            fillColor: hover ? hoverOf(fill) : fill,
            fillOpacity: active ? 1 : 0.65
        };
    }
    return { color: '#1e293b', weight: 0.3, fillColor: fill, fillOpacity: 0.35 };
}

function refreshStyles() {
    allLayer.eachLayer(l => l.setStyle(styleFor(l, false)));
}

// Sirf bahari outline rakho, andar ke chhed hata do
function outerOnly(feature) {
    const g = feature.geometry;
    if (g.type === 'Polygon') {
        return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [g.coordinates[0]] } };
    }
    return {
        type: 'Feature',
        properties: {},
        geometry: { type: 'MultiPolygon', coordinates: g.coordinates.map(function (poly) { return [poly[0]]; }) }
    };
}

// State ki outline line
let __stateOutlineCache = null;
function buildStateBorders() {
    if (typeof turf === 'undefined') return;
    indiaMap.createPane('stateBorders');
    const pane = indiaMap.getPane('stateBorders');
    pane.style.zIndex = 450;
    pane.style.pointerEvents = 'none';
    const grp = L.geoJSON(null, { pane: 'stateBorders', interactive: false, style: { color: '#e2e8f0', weight: 0.9, fill: false } }).addTo(indiaMap);
    if (__stateOutlineCache) { __stateOutlineCache.forEach(function (o) { grp.addData(o); }); return; }
    const groups = {};
    indiaData.features.forEach(function (f) {
        const st = getStateName(f.properties);
        if (!groups[st]) groups[st] = [];
        try { turf.flatten(f).features.forEach(function (p) { groups[st].push(p); }); } catch (e) {}
    });
    const keys = Object.keys(groups), cache = [];
    let i = 0;
    function step() {
        if (i >= keys.length) { __stateOutlineCache = cache; return; }
        let list = groups[keys[i++]].slice();
        try {
            while (list.length > 1) {
                const next = [];
                for (let k = 0; k < list.length; k += 2) {
                    if (k + 1 < list.length) { let m = null; try { m = turf.union(list[k], list[k + 1]); } catch (e) {} next.push(m || list[k]); } else next.push(list[k]);
                }
                list = next;
            }
            if (list[0]) { const o = outerOnly(list[0]); cache.push(o); grp.addData(o); }
        } catch (e) {}
        setTimeout(step, 0);
    }
    setTimeout(step, 60);
}

function buildIndiaMap(canvas) {
    canvas.innerHTML = '<div id="leaflet-map"></div>';
    indiaMap = L.map('leaflet-map', { attributionControl: false, zoomSnap: 0.25 });
    stateLayers = {};

    allLayer = L.geoJSON(indiaData, {
        filter: function (f) { try { return !/pudu|pondi/i.test(getStateName(f.properties) || ''); } catch (e) { return true; } },
        onEachFeature: function (feature, layer) {
            const st = getStateName(feature.properties);
            const pc = getPCName(feature.properties);
            if (!stateLayers[st]) stateLayers[st] = [];
            stateLayers[st].push(layer);

            layer.bindTooltip(function () {
                const ph = feature.properties.__phase;
                if (selectedState === null) {
                    const now = stateLayers[st].filter(l => phaseOf(l) === gameState.phase).length;
                    return st + ' (' + stateLayers[st].length + ' seats, abhi voting: ' + now + ')';
                }
                return selectedState === st ? pc + (ph ? ' - Phase ' + ph : '') : st;
            }, { sticky: true });

            layer.on('mouseover', function () {
                if (selectedState === null) {
                    stateLayers[st].forEach(l => l.setStyle(styleFor(l, true)));
                } else if (st === selectedState) {
                    layer.setStyle(styleFor(layer, true));
                }
            });

            layer.on('mouseout', function () {
                if (selectedState === null) {
                    stateLayers[st].forEach(l => l.setStyle(styleFor(l, false)));
                } else {
                    layer.setStyle(styleFor(layer, false));
                }
            });

            layer.on('click', function () {
                if (selectedState === st) {
                    const ph = feature.properties.__phase;
                    if (ph === gameState.phase) {
                        alert(st + ' - ' + pc + ' selected for campaign!');
                    } else if (ph > gameState.phase) {
                        alert(pc + ' seat Phase ' + ph + ' mein hai. Abhi isme voting nahi hai.');
                    } else if (ph > 0) {
                        alert(pc + ' ki voting Phase ' + ph + ' mein ho chuki hai.');
                    } else {
                        alert(pc + ' ka phase abhi tay nahi hua.');
                    }
                } else {
                    selectState(st);
                }
            });
        }
    }).addTo(indiaMap);

    buildStateBorders();

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
        const d = L.DomUtil.create('div', 'map-legend');
        d.innerHTML =
            '<div><span class="lg-box" style="background:' + ACTIVE_FILL + '"></span>Is phase ki seats</div>' +
            '<div><span class="lg-box" style="background:' + PAST_FILL + '"></span>Voting ho chuki</div>' +
            '<div><span class="lg-box" style="background:' + FUTURE_FILL + '"></span>Aage ke phase</div>';
        return d;
    };
    legend.addTo(indiaMap);
}

// National View - poora India ka map
function resetToNationalView() {
    const canvas = document.getElementById('interactive-map-canvas');

    if (typeof L === 'undefined') {
        canvas.innerHTML = '<p style="color:#f87171; padding:20px;">Leaflet load nahi hua. Internet check karo.</p>';
        return;
    }
    if (typeof indiaData === 'undefined') {
        canvas.innerHTML = '<p style="color:#f87171; padding:20px;">india-data.js file nahi mili. File ka naam aur folder check karo.</p>';
        return;
    }

    if (!indiaMap) {
        buildIndiaMap(canvas);
    }

    selectedState = null;
    refreshStyles();
    updateMapTitle();
    setTimeout(function () {
        indiaMap.invalidateSize();
        indiaMap.fitBounds(allLayer.getBounds());
    }, 100);
}

// State par click - us state ki saari constituencies
function selectState(st) {
    selectedState = st;
    refreshStyles();
    stateLayers[st].forEach(l => l.bringToFront());
    const nowCount = stateLayers[st].filter(l => phaseOf(l) === gameState.phase).length;
    document.getElementById('map-heading-title').innerText =
        st + ' - ' + stateLayers[st].length + ' Constituencies (abhi voting: ' + nowCount + ')';
    indiaMap.fitBounds(L.featureGroup(stateLayers[st]).getBounds(), { padding: [20, 20] });
}

function openGameModal(panelName) {
    ensureActionStyles();
    currentPanel = panelName;
    panelMsg = null;
    document.getElementById('wr-modal-title').innerText = panelName + ' Panel';
    const content = document.querySelector('#wr-modal .modal-content');
    if (content) content.style.width = '640px';
    const body = document.getElementById('wr-modal-body');
    body.style.maxHeight = '62vh';
    body.innerHTML = renderPanel(panelName);
    document.getElementById('wr-modal').classList.remove('hidden');
}

function closeGameModal() {
    currentPanel = '';
    document.getElementById('wr-modal').classList.add('hidden');
}

// ================= PHASE SCHEDULE (2024 Lok Sabha jaisa 7 phase) =================

// Jin states ki saari seats ek hi phase mein hain
const SINGLE_PHASE_STATES = {
    "Tamil Nadu": 1, "Uttarakhand": 1, "Arunachal Pradesh": 1, "Meghalaya": 1, "Mizoram": 1,
    "Nagaland": 1, "Sikkim": 1, "Andaman and Nicobar Islands": 1, "Lakshadweep": 1, "Puducherry": 1,
    "Kerala": 2,
    "Gujarat": 3, "Goa": 3, "Dadra and Nagar Haveli and Daman and Diu": 3,
    "Andhra Pradesh": 4, "Telangana": 4,
    "Ladakh": 5,
    "Haryana": 6, "Delhi": 6,
    "Punjab": 7, "Himachal Pradesh": 7, "Chandigarh": 7
};

// Jin states ki seats alag-alag phase mein hain ("|" se purana/naya naam)
const MULTI_PHASE_SEATS = {
    "Uttar Pradesh": {
        1: "Saharanpur, Kairana, Muzaffarnagar, Bijnor, Nagina, Moradabad, Rampur, Pilibhit",
        2: "Amroha, Meerut, Baghpat, Ghaziabad, Gautam Buddha Nagar|Gautam Buddh Nagar, Bulandshahr, Aligarh, Mathura",
        3: "Sambhal, Hathras, Agra, Fatehpur Sikri, Firozabad, Mainpuri, Etah, Badaun|Budaun, Aonla, Bareilly",
        4: "Shahjahanpur, Kheri, Dhaurahra, Sitapur, Hardoi, Misrikh, Unnao, Farrukhabad, Etawah, Kannauj, Kanpur, Akbarpur, Bahraich",
        5: "Mohanlalganj, Lucknow, Rae Bareli|Raebareli, Amethi, Jalaun, Jhansi, Hamirpur, Banda, Fatehpur, Kaushambi, Barabanki, Faizabad|Ayodhya, Kaiserganj, Gonda",
        6: "Sultanpur, Pratapgarh, Phulpur, Allahabad|Prayagraj, Ambedkar Nagar, Shrawasti|Shravasti, Domariyaganj, Basti, Sant Kabir Nagar, Lalganj, Azamgarh, Jaunpur, Machhlishahr, Bhadohi",
        7: "Maharajganj, Gorakhpur, Kushi Nagar|Kushinagar, Deoria, Bansgaon, Ghosi, Salempur, Ballia, Ghazipur, Chandauli, Varanasi, Mirzapur, Robertsganj"
    },
    "Madhya Pradesh": {
        1: "Sidhi, Shahdol, Jabalpur, Mandla, Balaghat, Chhindwara",
        2: "Tikamgarh, Damoh, Khajuraho, Satna, Rewa, Hoshangabad|Narmadapuram",
        3: "Morena, Bhind, Gwalior, Guna, Sagar, Vidisha, Bhopal, Rajgarh, Betul",
        4: "Dewas, Ujjain, Mandsaur, Ratlam, Dhar, Indore, Khargone, Khandwa"
    },
    "Maharashtra": {
        1: "Ramtek, Nagpur, Bhandara-Gondiya, Gadchiroli-Chimur, Chandrapur",
        2: "Buldhana, Akola, Amravati, Wardha, Yavatmal-Washim, Hingoli, Nanded, Parbhani",
        3: "Raigad, Baramati, Osmanabad|Dharashiv, Latur, Solapur, Madha, Sangli, Satara, Ratnagiri-Sindhudurg, Kolhapur, Hatkanangle",
        4: "Nandurbar, Jalgaon, Raver, Jalna, Aurangabad|Chhatrapati Sambhajinagar, Maval, Pune, Shirur, Ahmednagar, Shirdi, Beed",
        5: "Dhule, Dindori, Nashik, Palghar, Bhiwandi, Kalyan, Thane, Mumbai North, Mumbai North West, Mumbai North East, Mumbai North Central, Mumbai South Central, Mumbai South"
    },
    "Bihar": {
        1: "Aurangabad, Gaya, Nawada, Jamui",
        2: "Kishanganj, Katihar, Purnia, Bhagalpur, Banka",
        3: "Jhanjharpur, Supaul, Araria, Madhepura, Khagaria",
        4: "Darbhanga, Ujiarpur, Samastipur, Begusarai, Munger",
        5: "Sitamarhi, Madhubani, Muzaffarpur, Saran, Hajipur",
        6: "Valmiki Nagar, Paschim Champaran, Purvi Champaran, Sheohar, Vaishali, Gopalganj, Siwan, Maharajganj",
        7: "Nalanda, Patna Sahib, Pataliputra, Arrah, Buxar, Sasaram, Karakat, Jahanabad"
    },
    "West Bengal": {
        1: "Cooch Behar, Alipurduars, Jalpaiguri",
        2: "Darjeeling, Raiganj, Balurghat",
        3: "Maldaha Uttar, Maldaha Dakshin, Jangipur, Murshidabad",
        4: "Baharampur, Krishnanagar, Ranaghat, Bardhaman Purba, Bardhaman-Durgapur, Asansol, Bolpur, Birbhum",
        5: "Bangaon, Barrackpur, Howrah, Uluberia, Serampur, Hooghly, Arambagh",
        6: "Tamluk, Kanthi, Ghatal, Jhargram, Medinipur, Purulia, Bankura, Bishnupur",
        7: "Dum Dum, Barasat, Basirhat, Jaynagar, Mathurapur, Diamond Harbour, Jadavpur, Kolkata Dakshin, Kolkata Uttar"
    },
    "Odisha": {
        4: "Kalahandi, Nabarangpur, Berhampur, Koraput",
        5: "Bargarh, Sundargarh, Bolangir, Kandhamal, Aska",
        6: "Sambalpur, Keonjhar, Dhenkanal, Cuttack, Puri, Bhubaneswar",
        7: "Mayurbhanj, Balasore, Bhadrak, Jajpur, Kendrapara, Jagatsinghpur"
    },
    "Jharkhand": {
        4: "Singhbhum, Khunti, Lohardaga, Palamu|Palamau",
        5: "Chatra, Koderma|Kodarma, Hazaribagh",
        6: "Giridih, Dhanbad, Ranchi, Jamshedpur",
        7: "Rajmahal, Dumka, Godda"
    },
    "Rajasthan": {
        1: "Ganganagar, Bikaner, Churu, Jhunjhunu, Sikar, Jaipur Rural, Jaipur, Alwar, Bharatpur, Karauli-Dholpur, Dausa, Nagaur",
        2: "Tonk-Sawai Madhopur, Ajmer, Pali, Jodhpur, Barmer, Jalore, Udaipur, Banswara, Chittorgarh, Rajsamand, Bhilwara, Kota, Jhalawar-Baran"
    },
    "Karnataka": {
        2: "Udupi Chikmagalur, Hassan, Dakshina Kannada, Chitradurga, Tumkur, Mandya, Mysore, Chamarajanagar, Bangalore Rural|Bengaluru Rural, Bangalore North|Bengaluru North, Bangalore Central|Bengaluru Central, Bangalore South|Bengaluru South, Chikkballapur, Kolar",
        3: "Chikkodi, Belgaum|Belagavi, Bagalkot, Bijapur|Vijayapura, Gulbarga|Kalaburagi, Raichur, Bidar, Koppal, Bellary|Ballari, Haveri, Dharwad, Uttara Kannada, Davanagere, Shimoga|Shivamogga"
    },
    "Assam": {
        1: "Kaliabor|Kaziranga, Tezpur|Sonitpur, Lakhimpur, Dibrugarh, Jorhat",
        2: "Autonomous District|Diphu, Karimganj, Silchar, Nowgong|Nagaon, Mangaldoi|Darrang-Udalguri",
        3: "Dhubri, Kokrajhar, Barpeta, Gauhati|Guwahati"
    },
    "Chhattisgarh": {
        1: "Bastar",
        2: "Rajnandgaon, Mahasamund, Kanker",
        3: "Sarguja|Surguja, Raigarh, Janjgir-Champa|Janjgir, Korba, Bilaspur, Durg, Raipur"
    },
    "Jammu and Kashmir": {
        1: "Udhampur",
        2: "Jammu",
        4: "Srinagar",
        5: "Baramulla",
        6: "Anantnag|Anantnag-Rajouri"
    },
    "Tripura": {
        1: "Tripura West",
        2: "Tripura East"
    },
    "Manipur": {
        1: "Inner Manipur",
        2: "Outer Manipur"
    }
};

const EXPECTED_PHASE_SEATS = [101, 88, 94, 96, 49, 58, 57];

// GeoJSON ke state naam ko apne naam se jodne ke liye
const STATE_ALIASES = [
    ['tamilnadu', 'Tamil Nadu'], ['kerala', 'Kerala'], ['gujarat', 'Gujarat'], ['goa', 'Goa'],
    ['andhrapradesh', 'Andhra Pradesh'], ['telangana', 'Telangana'], ['haryana', 'Haryana'],
    ['delhi', 'Delhi'], ['punjab', 'Punjab'], ['himachal', 'Himachal Pradesh'],
    ['chandigarh', 'Chandigarh'], ['uttarakhand', 'Uttarakhand'], ['uttaranchal', 'Uttarakhand'],
    ['arunachal', 'Arunachal Pradesh'], ['meghalaya', 'Meghalaya'], ['mizoram', 'Mizoram'],
    ['nagaland', 'Nagaland'], ['sikkim', 'Sikkim'], ['andaman', 'Andaman and Nicobar Islands'],
    ['lakshadweep', 'Lakshadweep'], ['puducherry', 'Puducherry'], ['pondicherry', 'Puducherry'],
    ['dadra', 'Dadra and Nagar Haveli and Daman and Diu'], ['daman', 'Dadra and Nagar Haveli and Daman and Diu'],
    ['ladakh', 'Ladakh'], ['jammu', 'Jammu and Kashmir'], ['kashmir', 'Jammu and Kashmir'],
    ['tripura', 'Tripura'], ['manipur', 'Manipur'], ['assam', 'Assam'],
    ['chhattisgarh', 'Chhattisgarh'], ['chattisgarh', 'Chhattisgarh'],
    ['rajasthan', 'Rajasthan'], ['karnataka', 'Karnataka'], ['uttarpradesh', 'Uttar Pradesh'],
    ['madhyapradesh', 'Madhya Pradesh'], ['maharashtra', 'Maharashtra'], ['bihar', 'Bihar'],
    ['westbengal', 'West Bengal'], ['odisha', 'Odisha'], ['orissa', 'Odisha'], ['jharkhand', 'Jharkhand']
];

let phaseInfo = {};
let phaseReport = { unmatched: [] };
let phasesAssigned = false;
let multiCandidates = null;

function normText(s) {
    return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z]/g, '');
}

function canonicalState(name) {
    const n = normText(name);
    for (let i = 0; i < STATE_ALIASES.length; i++) {
        if (n.indexOf(STATE_ALIASES[i][0]) !== -1) return STATE_ALIASES[i][1];
    }
    return null;
}

function editDistance(a, b) {
    let prev = [];
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        for (let j = 1; j <= b.length; j++) {
            cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        }
        prev = cur;
    }
    return prev[b.length];
}

function buildCandidates() {
    multiCandidates = {};
    Object.keys(MULTI_PHASE_SEATS).forEach(function (st) {
        multiCandidates[st] = [];
        Object.keys(MULTI_PHASE_SEATS[st]).forEach(function (ph) {
            MULTI_PHASE_SEATS[st][ph].split(',').forEach(function (entry) {
                entry.split('|').forEach(function (alt) {
                    const norm = normText(alt);
                    if (norm) multiCandidates[st].push({ phase: parseInt(ph, 10), norm: norm });
                });
            });
        });
    });
}

function bestPhase(candidates, pcName) {
    const norm = normText(pcName);
    let bestDist = 999, bestPh = 0;
    for (let i = 0; i < candidates.length; i++) {
        const d = editDistance(norm, candidates[i].norm);
        if (d < bestDist) { bestDist = d; bestPh = candidates[i].phase; }
        if (d === 0) break;
    }
    const maxDist = Math.max(2, Math.round(norm.length * 0.3));
    return bestDist <= maxDist ? bestPh : 0;
}

// Har seat ko uska phase dena
function assignPhases() {
    if (phasesAssigned || typeof indiaData === 'undefined') return;
    phasesAssigned = true;
    buildCandidates();

    phaseInfo = {};
    phaseReport = { unmatched: [] };
    for (let p = 1; p <= TOTAL_PHASES; p++) phaseInfo[p] = { count: 0, states: [] };

    indiaData.features.forEach(function (f) {
        const props = f.properties;
        const stName = getStateName(props);
        const pcName = getPCName(props);
        const st = canonicalState(stName);

        let phase = 0;
        if (st && SINGLE_PHASE_STATES[st]) {
            phase = SINGLE_PHASE_STATES[st];
        } else if (st && multiCandidates[st]) {
            phase = bestPhase(multiCandidates[st], pcName);
        }

        props.__phase = phase;
        if (phase) {
            phaseInfo[phase].count++;
            if (phaseInfo[phase].states.indexOf(st) === -1) phaseInfo[phase].states.push(st);
        } else {
            phaseReport.unmatched.push(stName + ' / ' + pcName);
        }
    });
}

function updateMapTitle() {
    if (selectedState !== null) return;
    const info = phaseInfo[gameState.phase];
    let text = 'INDIA WAR-ROOM MAP - Phase ' + gameState.phase;
    if (info && info.count > 0) text += ' (' + info.count + ' seats voting)';
    document.getElementById('map-heading-title').innerText = text;
}

// Test ke liye: phase data theek mila ya nahi
function showPhaseReport() {
    document.getElementById('wr-modal-title').innerText = 'Phase Data Jaanch';
    let html = '';
    if (typeof indiaData === 'undefined' || !phasesAssigned) {
        html = '<p>Map data abhi load nahi hua.</p>';
    } else {
        for (let p = 1; p <= TOTAL_PHASES; p++) {
            const got = phaseInfo[p].count;
            const exp = EXPECTED_PHASE_SEATS[p - 1];
            html += '<p>Phase ' + p + ': ' + got + ' / ' + exp + (got === exp ? ' OK' : ' <b style="color:#f87171">DIFFERENT</b>') + '</p>';
        }
        const un = phaseReport.unmatched;
        html += '<p style="margin-top:10px;"><b>Match nahi hui seats: ' + un.length + '</b></p>';
        if (un.length) html += '<p style="font-size:0.8rem; color:#fca5a5;">' + un.join('<br>') + '</p>';
    }
    document.getElementById('wr-modal-body').innerHTML = html;
    document.getElementById('wr-modal').classList.remove('hidden');
}

// ================= RESULT PAGE FALLBACK (agar purani index.html / style.css ho) =================

const RESULTS_HTML =
    '<div id="results-screen" class="results-screen hidden">' +
    '<div class="rs-top"><div><h1 id="rs-title">Natija</h1><div id="rs-sub" class="rs-sub"></div></div>' +
    '<button id="rs-next-btn" class="next-btn" onclick="closeResultsPage()">Next Round</button></div>' +
    '<div class="rs-body">' +
    '<div class="rs-col"><h3>Party-wise</h3><div id="rs-party-table"></div><div id="rs-alliance"></div></div>' +
    '<div class="rs-col"><h3>State-wise natija</h3><div id="rs-state-table" class="rs-scroll"></div></div>' +
    '<div class="rs-col rs-wide"><h3>Seat-wise natija</h3><div id="rs-seat-table" class="rs-scroll"></div></div>' +
    '</div></div>';

const RESULTS_CSS =
    '.results-screen{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0b0f19;z-index:400;display:flex;flex-direction:column;padding:12px 18px;}' +
    '.rs-top{display:flex;justify-content:space-between;align-items:center;background:#131b2e;border:1px solid #1f293d;border-radius:8px;padding:10px 18px;margin-bottom:10px;}' +
    '.rs-top h1{color:#ff9933;font-size:1.5rem;}.rs-sub{color:#94a3b8;font-size:0.85rem;margin-top:2px;}' +
    '.rs-body{display:flex;gap:10px;flex:1;min-height:0;}' +
    '.rs-col{flex:1;background:#131b2e;border:1px solid #1f293d;border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;min-height:0;min-width:0;}' +
    '.rs-wide{flex:1.5;}.rs-col h3{color:#38bdf8;font-size:0.95rem;border-bottom:1px solid #1f293d;padding-bottom:5px;margin-bottom:8px;}' +
    '.rs-scroll{overflow-y:auto;flex:1;}' +
    '.rs-table{width:100%;border-collapse:collapse;font-size:0.8rem;color:#e2e8f0;}' +
    '.rs-table th{text-align:left;color:#94a3b8;font-weight:600;padding:4px 6px;border-bottom:1px solid #1f293d;position:sticky;top:0;background:#131b2e;}' +
    '.rs-table td{padding:4px 6px;border-bottom:1px solid #1a2338;}' +
    '.rs-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;}' +
    '.rs-side{margin-top:12px;background:#0f172a;border:1px solid #334155;border-radius:6px;padding:8px 10px;font-size:0.8rem;color:#e2e8f0;line-height:1.5;}' +
    '.rs-verdict{margin-top:10px;color:#facc15;font-weight:bold;font-size:0.85rem;}';

function ensureResultsScreen() {
    if (!document.getElementById('results-screen')) {
        const wrap = document.createElement('div');
        wrap.innerHTML = RESULTS_HTML;
        document.body.appendChild(wrap.firstChild);
    }
    const scr = document.getElementById('results-screen');
    if (window.getComputedStyle(scr).position !== 'fixed') {
        const st = document.createElement('style');
        st.textContent = RESULTS_CSS;
        document.head.appendChild(st);
    }
}

// ================= STAGE 3: SEAT RESULTS + RESULT PAGE =================

const MAJORITY = 272;
let resultModel = null;

function rnd(min, max) {
    return min + Math.random() * (max - min);
}

function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

function seatKeyOf(props) {
    return getStateName(props) + '|' + getPCName(props);
}

// Gathbandhan ke saathi ko state ki kuch seats do
function allocateAllies(keys, partyMap, allies, canonSt, side, useSlider) {
    const remaining = shuffled(keys);
    allies.forEach(function (ally) {
        if (!ally.name || ally.states.indexOf(canonSt) === -1) return;
        let share = 0.5;
        if (useSlider) {
            const sl = document.getElementById('slider-' + canonSt);
            const total = stateSeatsData[canonSt] || keys.length;
            if (sl) share = (total - parseInt(sl.value, 10)) / total;
        }
        const k = Math.min(Math.round(share * keys.length), remaining.length);
        for (let i = 0; i < k; i++) partyMap[remaining.shift()] = ally.name;
        resultModel.sideOf[ally.name] = side;
    });
}

// Har seat ki shuruati taqat (abhi random, state ke jhukav ke saath)
function buildResultModel() {
    resultModel = { seats: {}, sideOf: {}, stateIssues: {} };
    if (typeof indiaData === 'undefined') return;

    const youMain = selectedYouParty || 'You';
    const oppMain = selectedOppParty || 'Opponent';
    resultModel.sideOf[youMain] = 'you';
    resultModel.sideOf[oppMain] = 'opp';
    const alliance = document.getElementById('choose-fight-select').value === 'alliance';

    const byState = {};
    indiaData.features.forEach(function (f) {
        const st = getStateName(f.properties);
        if (!byState[st]) byState[st] = [];
        byState[st].push(f.properties);
    });

    Object.keys(byState).forEach(function (st) {
        const list = byState[st];
        const keys = list.map(seatKeyOf);
        const canonSt = canonicalState(st) || st;
        const tilt = { you: rnd(0.75, 1.3), opp: rnd(0.75, 1.3), oth: rnd(0.7, 1.3) };
        const iw = stateIssueWeights();
        resultModel.stateIssues[st] = iw;

        const youParty = {}, oppParty = {};
        keys.forEach(function (k) { youParty[k] = youMain; oppParty[k] = oppMain; });
        if (alliance) allocateAllies(keys, youParty, youAlliancePartners, canonSt, 'you', true);
        allocateAllies(keys, oppParty, oppAlliancePartners, canonSt, 'opp', false);

        list.forEach(function (p) {
            const k = seatKeyOf(p);
            resultModel.seats[k] = {
                st: st,
                pc: getPCName(p),
                phase: p.__phase,
                you: youParty[k],
                opp: oppParty[k],
                wYou: tilt.you * rnd(0.6, 1.4) * presenceFactor(youParty[k], canonSt),
                wOpp: tilt.opp * rnd(0.6, 1.4) * presenceFactor(oppParty[k], canonSt),
                wOth: tilt.oth * rnd(0.4, 1.1) * othersFactor(canonSt),
                issue: pickIssue(iw)
            };
        });
    });
}

// Baad ke stages mein rally, social media waghera yahan asar daalenge (0.2 = 20% zyada taqat)
function getBoost(side, key, st) {
    const b = gameState.boost && gameState.boost[side];
    if (!b) return 0;
    return Math.max(-0.6, (b.seat[key] || 0) + (b.state[st] || 0) + (b.national || 0) + issueBoost(b, key));
}

function sideParties(side) {
    return Object.keys(resultModel.sideOf).filter(function (p) { return resultModel.sideOf[p] === side; });
}

function sideTotal(side) {
    let t = 0;
    sideParties(side).forEach(function (p) { t += gameState.partyTotals[p] || 0; });
    return t;
}

// Phase ki saari seats ka natija nikalo
function computePhaseResults(phase) {
    if (!resultModel) buildResultModel();
    const rows = [];

    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase !== phase) return;

        let wy = s.wYou * presenceOf(getBoost('you', k, s.st) + hawaFor('you')) * rnd(0.85, 1.15) * candidateMult('you', s.st) * disqMult('you', k);
        let wo = s.wOpp * presenceOf(getBoost('opp', k, s.st) + hawaFor('opp')) * rnd(0.85, 1.15) * candidateMult('opp', s.st) * disqMult('opp', k);
        let wx = s.wOth * rnd(0.85, 1.15);
        // Stage 35: Guru / Karyakarta / DM-SP / Controversy ka pakka vote-share asar
        if (typeof vsAdjust === 'function') { const adj = vsAdjust(k, s.st, wy, wo, wx); wy = adj[0]; wo = adj[1]; wx = adj[2]; }
        const total = wy + wo + wx;

        const arr = [['you', wy], ['opp', wo], ['oth', wx]].sort(function (a, b) { return b[1] - a[1]; });
        const margin = (arr[0][1] - arr[1][1]) / total * 100;
        let winSide = arr[0][0];
        let recount = '';
        if (margin < 1.0) {
            if (Math.random() < 0.3) { winSide = arr[1][0]; recount = 'palta'; } else { recount = 'wahi'; }
        }
        const winner = winSide === 'you' ? s.you : (winSide === 'opp' ? s.opp : othersParty(s.st));

        seatResults[k] = winner;
        gameState.partyTotals[winner] = (gameState.partyTotals[winner] || 0) + 1;
        rows.push({ state: s.st, seat: s.pc, winner: winner, margin: margin, recount: recount });
    });

    gameState.seats.you = sideTotal('you');
    gameState.seats.opp = sideTotal('opp');
    return rows;
}

function updateSeatStatusBox() {
    renderLeadBoxes();
}

function partyDot(party) {
    return '<span class="rs-dot" style="background:' + (partyColors[party] || '#9ca3af') + '"></span>';
}

function sideLine(side, label, phaseCount) {
    const ps = sideParties(side);
    let now = 0;
    ps.forEach(function (p) { now += phaseCount[p] || 0; });
    return '<div class="rs-side"><b>' + label + '</b> (' + ps.join(' + ') + ')<br>Is phase: ' + now +
        ' &nbsp;|&nbsp; Ab tak kul: <b>' + sideTotal(side) + '</b> (chahiye ' + MAJORITY + ')</div>';
}

// Result page dikhao
function showResultsPage(phase, rows) {
    ensureResultsScreen();
    const last = phase >= TOTAL_PHASES;
    document.getElementById('rs-title').innerText = 'Phase ' + phase + ' / ' + TOTAL_PHASES + ' - Natija';
    const rcRows = rows.filter(function (r) { return r.recount; });
    const rcFlip = rcRows.filter(function (r) { return r.recount === 'palta'; }).length;
    document.getElementById('rs-sub').innerText = rows.length + ' seats ki voting poori hui' +
        (rcRows.length ? ' | Recount: ' + rcRows.length + ' seats (natija palta: ' + rcFlip + ')' : '');
    document.getElementById('rs-next-btn').innerText = last ? 'Final Result' : 'Next Round';

    const phaseCount = {};
    rows.forEach(function (r) { phaseCount[r.winner] = (phaseCount[r.winner] || 0) + 1; });

    // Party-wise
    const parties = Object.keys(gameState.partyTotals);
    [selectedYouParty, selectedOppParty].forEach(function (p) {
        if (p && parties.indexOf(p) === -1) parties.push(p);
    });
    parties.sort(function (a, b) { return (gameState.partyTotals[b] || 0) - (gameState.partyTotals[a] || 0); });

    let pt = '<table class="rs-table"><tr><th>Party</th><th>Is phase</th><th>Ab tak kul</th></tr>';
    parties.forEach(function (p) {
        pt += '<tr><td>' + partyDot(p) + p + '</td><td>' + (phaseCount[p] || 0) + '</td><td><b>' + (gameState.partyTotals[p] || 0) + '</b></td></tr>';
    });
    pt += '</table>';
    document.getElementById('rs-party-table').innerHTML = pt;

    let al = sideLine('you', 'Aapka gathbandhan', phaseCount) + sideLine('opp', 'Opponent gathbandhan', phaseCount);
    if (last) {
        const y = sideTotal('you'), o = sideTotal('opp');
        let verdict = 'Kisi ke paas poora bahumat (' + MAJORITY + ') nahi. Gathbandhan ki baat-cheet hogi.';
        if (y >= MAJORITY) verdict = 'Aapke gathbandhan ke paas bahumat hai!';
        else if (o >= MAJORITY) verdict = 'Opponent gathbandhan ke paas bahumat hai.';
        al += '<div class="rs-verdict">' + verdict + '</div>';
    }
    document.getElementById('rs-alliance').innerHTML = al;

    // State-wise
    const byState = {};
    rows.forEach(function (r) {
        if (!byState[r.state]) byState[r.state] = { n: 0, w: {} };
        byState[r.state].n++;
        byState[r.state].w[r.winner] = (byState[r.state].w[r.winner] || 0) + 1;
    });
    const stNames = Object.keys(byState).sort(function (a, b) { return byState[b].n - byState[a].n || (a < b ? -1 : 1); });
    let stt = '<table class="rs-table"><tr><th>State</th><th>Seats</th><th>Kisne kitni jeeti</th></tr>';
    stNames.forEach(function (st) {
        const w = byState[st].w;
        const parts = Object.keys(w).sort(function (a, b) { return w[b] - w[a]; }).map(function (p) {
            return partyDot(p) + p + ' ' + w[p];
        });
        stt += '<tr><td>' + st + '</td><td>' + byState[st].n + '</td><td>' + parts.join(', ') + '</td></tr>';
    });
    stt += '</table>';
    document.getElementById('rs-state-table').innerHTML = stt;

    // Seat-wise
    const sorted = rows.slice().sort(function (a, b) {
        if (a.state !== b.state) return a.state < b.state ? -1 : 1;
        return a.seat < b.seat ? -1 : 1;
    });
    let sw = '<table class="rs-table"><tr><th>Seat</th><th>State</th><th>Jeet</th><th>Antar</th></tr>';
    sorted.forEach(function (r) {
        sw += '<tr><td>' + r.seat + '</td><td>' + r.state + '</td><td>' + partyDot(r.winner) + r.winner + '</td><td>' +
            r.margin.toFixed(1) + '%' + (r.recount === 'palta' ? ' (recount mein palta)' : (r.recount === 'wahi' ? ' (recount: wahi rahi)' : (r.margin < 2 ? ' (kaante ki takkar)' : ''))) + '</td></tr>';
    });
    sw += '</table>';
    document.getElementById('rs-seat-table').innerHTML = sw;

    document.getElementById('results-screen').classList.remove('hidden');
}

function proceedAfterResults() {
    if (gameState.phase >= TOTAL_PHASES) {
        finishGame();
    } else {
        startNextPhase();
    }
}

// "Next Round" / "Final Result" button
function closeResultsPage() {
    const scr = document.getElementById('results-screen');
    if (scr) scr.classList.add('hidden');
    proceedAfterResults();
}

// ================= STAGE 4: ACTIONS (rally, social, debate, court, fund) =================

const RALLY_MIN_STAMINA = 0;   // Stage 36: rally ke liye minimum stamina ki shart hata di
const LIMITS = { court: 1, mcc: 2, black: 3 };
let uiSel = { state: '', seat: '' };
let currentPanel = '';
let panelMsg = null;

function sideName(side) {
    return side === 'you' ? (selectedYouParty || 'Aap') : (selectedOppParty || 'Opponent');
}

function otherSide(side) {
    return side === 'you' ? 'opp' : 'you';
}

function resGet(side, k) {
    return side === 'you' ? gameState[k] : gameState.opp[k];
}

function resSet(side, k, v) {
    if (side === 'you') gameState[k] = v; else gameState.opp[k] = v;
}

function newLedger() {
    return { total: 0, white: 0, black: 0, byType: {}, byState: {}, bySeat: {} };
}

function freshActionState() {
    gameState.opp = { stamina: 100, budget: PHASE_FUNDING, blackFund: 0 };
    gameState.risk = { you: 0, opp: 0 };
    gameState.ledger = { you: newLedger(), opp: newLedger() };
    gameState.counters = { you: { court: 0, mcc: 0, black: 0 }, opp: { court: 0, mcc: 0, black: 0 } };
    gameState.fundMode = 'white';
    gameState.aiLog = [];
    gameState.stars = { you: makeStars(), opp: makeStars() };
    gameState.candPolicy = { you: {}, opp: {} };
    gameState.booths = { you: {}, opp: {} };
    gameState.lastPoll = null;
    gameState.hawa = 0;
    gameState.hawaLog = [];
    gameState.eventPending = false;
    gameState.curEvent = null;
    uiSel = { state: '', seat: '' };
    panelMsg = null;
}

// Naya phase: opponent ko bhi funding, limits reset, purani khabar thandi
function nextPhaseActionReset() {
    gameState.opp.budget += PHASE_FUNDING + (AI_CONFIG.bonusBudget || 0);
    gameState.opp.stamina = 100 + (AI_CONFIG.bonusStamina || 0);
    gameState.counters = { you: { court: 0, mcc: 0, black: 0 }, opp: { court: 0, mcc: 0, black: 0 } };
    gameState.boost.you.national = (gameState.boost.you.national || 0) * 0.7;
    gameState.boost.opp.national = (gameState.boost.opp.national || 0) * 0.7;
    ['you', 'opp'].forEach(function (sd) {
        Object.keys(gameState.boost[sd].issue).forEach(function (k) { gameState.boost[sd].issue[k] *= 0.7; });
        gameState.risk[sd] *= 0.85;
    });
    gameState.stars = { you: makeStars(), opp: makeStars() };
    gameState.candPolicy = { you: {}, opp: {} };
    gameState.booths = { you: {}, opp: {} };
    uiSel = { state: '', seat: '' };
}

// ---- is phase ki seats ----
function activeStates() {
    const map = {};
    if (!resultModel) return [];
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase === gameState.phase) map[s.st] = (map[s.st] || 0) + 1;
    });
    return Object.keys(map).map(function (st) { return { st: st, n: map[st] }; })
        .sort(function (a, b) { return b.n - a.n || (a.st < b.st ? -1 : 1); });
}

function activeSeats(st) {
    const out = [];
    if (!resultModel) return out;
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase === gameState.phase && s.st === st) out.push({ key: k, pc: s.pc });
    });
    return out.sort(function (a, b) { return a.pc < b.pc ? -1 : 1; });
}

// ---- asar (boost) ----
function diminish(cur, amt) {
    if (amt <= 0) return Math.max(-0.3, cur + amt);
    return Math.min(0.9, cur + amt * Math.max(0.15, Math.min(1, 1 - cur)));
}

function addBoost(side, kind, id, amount) {
    const b = gameState.boost[side];
    if (kind === 'national') {
        // national mein id nahi hota: addBoost(side, 'national', amount)
        const amt = (amount === undefined) ? id : amount;
        b.national = diminish(b.national || 0, amt);
    } else {
        b[kind][id] = diminish(b[kind][id] || 0, amount);
    }
}

function reduceBoost(side, f) {
    const b = gameState.boost[side];
    b.national = (b.national || 0) * (1 - f);
    Object.keys(b.state).forEach(function (k) { b.state[k] *= (1 - f); });
    Object.keys(b.seat).forEach(function (k) { b.seat[k] *= (1 - f); });
    Object.keys(b.issue || {}).forEach(function (k) { b.issue[k] *= (1 - f); });
}

// ---- kharch ka hisaab ----
function recordSpend(side, a, fundKind) {
    const L = gameState.ledger[side];
    L.total += a.cost;
    L[fundKind] += a.cost;
    L.byType[a.type] = (L.byType[a.type] || 0) + a.cost;
    const st = a.st || 'National';
    L.byState[st] = (L.byState[st] || 0) + a.cost;
    if (a.key) L.bySeat[a.key] = (L.bySeat[a.key] || 0) + a.cost;
}

// Aap aur (baad mein) AI, dono yahi function chalayenge
function doAction(side, a, fund) {
    const stam = resGet(side, 'stamina');
    if (a.big && stam < RALLY_MIN_STAMINA) {
        return { ok: false, good: false, text: 'Stamina ' + RALLY_MIN_STAMINA + '% se kam hai, badi rally nahi ho sakti.' };
    }
    if (stam < a.stamina) {
        return { ok: false, good: false, text: 'Stamina kam hai (' + a.stamina + '% chahiye).' };
    }
    if (a.limitKey && gameState.counters[side][a.limitKey] >= LIMITS[a.limitKey]) {
        return { ok: false, good: false, text: 'Is phase mein yeh ab nahi ho sakta (limit ' + LIMITS[a.limitKey] + ').' };
    }
    if (a.check) {
        const why = a.check(side);
        if (why) return { ok: false, good: false, text: why };
    }
    const useBlack = fund === 'black';
    const have = resGet(side, useBlack ? 'blackFund' : 'budget');
    if (have < a.cost) {
        return { ok: false, good: false, text: (useBlack ? 'Black' : 'White') + ' fund kam hai (' + a.cost + ' Cr chahiye).' };
    }

    resSet(side, useBlack ? 'blackFund' : 'budget', have - a.cost);
    resSet(side, 'stamina', stam - a.stamina);
    if (a.limitKey) gameState.counters[side][a.limitKey]++;
    if (useBlack) gameState.risk[side] += a.cost;
    recordSpend(side, a, useBlack ? 'black' : 'white');

    const out = a.apply(useBlack ? 1.5 : 1, side);
    const dh = out.hawa !== undefined ? out.hawa : (out.good !== false ? hawaTypeValue(a.type) : 0);
    if (dh) shiftHawa(side, dh, a.type);
    return { ok: true, good: out.good !== false, text: out.text };
}

// ---- actions ki list ----
function actStateRally(st) {
    const n = activeSeats(st).length;
    return {
        type: 'State Rally', st: st, big: true,
        cost: Math.min(16, Math.round(2 + 0.5 * n)),
        stamina: Math.min(14, 5 + Math.ceil(n / 4)),
        apply: function (m, side) {
            addBoost(side, 'state', st, 0.12 * m);
            return { text: sideName(side) + ' ki ' + st + ' mein badi rally, hawa banne lagi.', good: true };
        }
    };
}

function actSeatRally(st, key, pc) {
    return {
        type: 'Seat Rally', st: st, key: key, big: true, cost: 2, stamina: 4,
        apply: function (m, side) {
            addBoost(side, 'seat', key, 0.3 * m);
            return { text: sideName(side) + ' ne ' + pc + ' (' + st + ') mein jansabha ki.', good: true };
        }
    };
}

function actSocial(st) {
    const isState = !!st;
    return {
        type: isState ? 'Social (State)' : 'Social (National)', st: st || null,
        cost: isState ? 3 : 7, stamina: isState ? 3 : 5,
        apply: function (m, side) {
            const base = isState ? 0.07 : 0.04;
            const r = Math.random();
            let f = 1, tag = '';
            if (r < 0.10) { f = -0.4; tag = ' Par ulta pad gaya (fact-check).'; }
            else if (r < 0.25) { f = 2; tag = ' Viral ho gaya!'; }
            const amt = base * f * (f > 0 ? m : 1);
            if (isState) addBoost(side, 'state', st, amt); else addBoost(side, 'national', amt);
            return { text: sideName(side) + ' ka social media abhiyan' + (isState ? ' (' + st + ')' : '') + ' chala.' + tag, good: f > 0, hawa: (f === 2 ? 5 : (f > 0 ? 2 : -2)) * (isState ? 0.5 : 1) };
        }
    };
}

function actDebate() {
    return {
        type: 'Digital Debate', st: null, cost: 1, stamina: 6,
        apply: function (m, side) {
            if (Math.random() < 0.55) {
                addBoost(side, 'national', 0.07 * m);
                return { text: sideName(side) + ' ke pravakta ne TV debate jeeti, hawa badli.', good: true, hawa: 6 };
            }
            addBoost(side, 'national', -0.015);
            return { text: sideName(side) + ' ke pravakta debate mein ghire. Chhoti si chot.', good: false, hawa: -3 };
        }
    };
}

function actNarrative() {
    return {
        type: 'Narrative', st: null, cost: 5, stamina: 5,
        apply: function (m, side) {
            addBoost(side, 'national', 0.05 * m);
            return { text: sideName(side) + ' ka naya narrative desh bhar mein chal pada.', good: true };
        }
    };
}

function actCourt() {
    return {
        type: 'Court Case', st: null, cost: 6, stamina: 7, limitKey: 'court',
        apply: function (m, side) {
            const opp = otherSide(side);
            if (Math.random() < 0.45) {
                resSet(opp, 'stamina', Math.max(0, resGet(opp, 'stamina') - 15));
                resSet(opp, 'budget', Math.max(0, resGet(opp, 'budget') - 8));
                reduceBoost(opp, 0.3);
                return { text: 'Court ne ' + sideName(side) + ' ki arzi maani. ' + sideName(opp) + ' ka abhiyan dagmagaya.', good: true, hawa: 4 };
            }
            addBoost(side, 'national', -0.02);
            return { text: 'Court ne ' + sideName(side) + ' ki arzi khaarij ki. Ulta nuksaan hua.', good: false };
        }
    };
}

function actMcc() {
    return {
        type: 'EC Shikayat (MCC)', st: null, cost: 2, stamina: 3, limitKey: 'mcc',
        apply: function (m, side) {
            const opp = otherSide(side);
            if (Math.random() < 0.35) {
                reduceBoost(opp, 0.15);
                resSet(opp, 'stamina', Math.max(0, resGet(opp, 'stamina') - 5));
                return { text: 'EC ne ' + sideName(opp) + ' ko aachar sanhita par notice diya.', good: true, hawa: 3 };
            }
            return { text: 'EC ne ' + sideName(side) + ' ki shikayat par koi karyavahi nahi ki.', good: false };
        }
    };
}

function arrangeBlackFund(side) {
    if (gameState.counters[side].black >= LIMITS.black) {
        return { ok: false, good: false, text: 'Is phase mein ab aur black fund nahi jut sakta (limit ' + LIMITS.black + ').' };
    }
    const stam = resGet(side, 'stamina');
    if (stam < 10) return { ok: false, good: false, text: 'Stamina kam hai (10% chahiye).' };
    const amt = 15 + Math.floor(Math.random() * 16);
    resSet(side, 'stamina', stam - 10);
    resSet(side, 'blackFund', resGet(side, 'blackFund') + amt);
    gameState.counters[side].black++;
    gameState.risk[side] += 8;
    return { ok: true, good: true, text: amt + ' Cr black fund jut gaya. Risk badh gaya.' };
}

// ---- panel ka UI ----
function ensureActionStyles() {
    if (document.getElementById('ap-style')) return;
    const st = document.createElement('style');
    st.id = 'ap-style';
    st.textContent =
        '.ap-head{background:#0f172a;border:1px solid #334155;border-radius:6px;padding:6px 10px;margin-bottom:8px;font-size:0.85rem;color:#e2e8f0;}' +
        '.ap-fund{margin:6px 0 10px;font-size:0.8rem;color:#cbd5e1;}.ap-fund label{margin-right:12px;cursor:pointer;}' +
        '.ap-sec{background:#131b2e;border:1px solid #1f293d;border-radius:6px;padding:8px 10px;margin-bottom:8px;font-size:0.85rem;line-height:1.6;}' +
        '.ap-btn{background:#2563eb;color:#fff;border:none;border-radius:5px;padding:6px 14px;font-weight:bold;cursor:pointer;margin-top:4px;}' +
        '.ap-btn:hover{background:#1d4ed8;}' +
        '.ap-sel{background:#1e293b;color:#fff;border:1px solid #475569;border-radius:4px;padding:4px 8px;margin:3px 0;max-width:100%;}' +
        '.ap-msg{border-radius:6px;padding:6px 10px;margin-bottom:8px;font-size:0.85rem;font-weight:bold;}' +
        '.ap-msg.ok{background:#14532d;color:#bbf7d0;}.ap-msg.bad{background:#7f1d1d;color:#fecaca;}.ap-msg.mid{background:#713f12;color:#fde68a;}' +
        '.ap-note{color:#94a3b8;font-size:0.78rem;margin:6px 0;}' +
        '.ap-table{width:100%;border-collapse:collapse;font-size:0.8rem;color:#e2e8f0;margin-bottom:8px;}' +
        '.ap-table th{text-align:left;color:#94a3b8;padding:3px 6px;border-bottom:1px solid #1f293d;}' +
        '.ap-table td{padding:3px 6px;border-bottom:1px solid #1a2338;}' +
        '.ap-toast{position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:350;background:#7c2d12;color:#ffedd5;border:1px solid #fb923c;border-radius:8px;padding:8px 16px;font-size:0.85rem;font-weight:bold;max-width:70vw;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.5);}' +
        '.ap-toast.risk{top:125px;background:#7f1d1d;border-color:#f87171;color:#fee2e2;}' +
        '.ap-toast.info{top:180px;background:#1e3a8a;border-color:#60a5fa;color:#dbeafe;}';
    document.head.appendChild(st);
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function setFundMode(v) {
    gameState.fundMode = v === 'black' ? 'black' : 'white';
    refreshPanel();
}

function setUiState(v) {
    uiSel.state = v;
    uiSel.seat = '';
    refreshPanel();
}

function setUiSeat(v) {
    uiSel.seat = v;
    refreshPanel();
}

function refreshPanel() {
    if (!currentPanel) return;
    document.getElementById('wr-modal-body').innerHTML = renderPanel(currentPanel);
}

function setHeadline(t) {
    const p = document.querySelector('#wr-media-headline p');
    if (p) p.innerText = '"' + t + '"';
}

function actionHeader(showFund) {
    const g = gameState;
    let h = '<div class="ap-head">Stamina: <b>' + g.stamina + '%</b> &nbsp;|&nbsp; White Fund: <b>' + g.budget +
        ' Cr</b> &nbsp;|&nbsp; Black Fund: <b>' + g.blackFund + ' Cr</b></div>';
    if (panelMsg) {
        const cls = !panelMsg.ok ? 'bad' : (panelMsg.good ? 'ok' : 'mid');
        h += '<div class="ap-msg ' + cls + '">' + esc(panelMsg.text) + '</div>';
    }
    if (showFund) {
        h += '<div class="ap-fund">Kharch kisse: ' +
            '<label><input type="radio" name="apfund" value="white" onchange="setFundMode(this.value)"' + (g.fundMode !== 'black' ? ' checked' : '') + '> White Fund</label>' +
            '<label><input type="radio" name="apfund" value="black" onchange="setFundMode(this.value)"' + (g.fundMode === 'black' ? ' checked' : '') + '> Black Fund (asar 1.5x, risk badhta hai)</label></div>';
    }
    return h;
}

function costLine(a) {
    return 'Kharch: <b>' + a.cost + ' Cr</b> &nbsp;|&nbsp; Stamina: <b>' + a.stamina + '%</b>';
}

function stateSelectHtml() {
    const list = activeStates();
    if (!list.some(function (x) { return x.st === uiSel.state; })) uiSel.state = list.length ? list[0].st : '';
    let h = '<select class="ap-sel" onchange="setUiState(this.value)">';
    list.forEach(function (x) {
        h += '<option value="' + esc(x.st) + '"' + (x.st === uiSel.state ? ' selected' : '') + '>' + esc(x.st) + ' (' + x.n + ' seats)</option>';
    });
    return h + '</select>';
}

function seatSelectHtml(seats) {
    if (!seats.some(function (x) { return x.key === uiSel.seat; })) uiSel.seat = seats.length ? seats[0].key : '';
    let h = '<select class="ap-sel" onchange="setUiSeat(this.value)">';
    seats.forEach(function (x) {
        h += '<option value="' + esc(x.key) + '"' + (x.key === uiSel.seat ? ' selected' : '') + '>' + esc(x.pc) + '</option>';
    });
    return h + '</select>';
}

function runUi(a) {
    const r = doAction('you', a, gameState.fundMode);
    panelMsg = r;
    if (r.ok && r.good) setHeadline(r.text);
    updateStatusPanel();
    refreshPanel();
}

function uiStateRally() { if (uiSel.state) runUi(actStateRally(uiSel.state)); }

function uiSeatRally() {
    const s = resultModel && resultModel.seats[uiSel.seat];
    if (s) runUi(actSeatRally(s.st, uiSel.seat, s.pc));
}

function uiSocialNational() { runUi(actSocial(null)); }
function uiSocialState() { if (uiSel.state) runUi(actSocial(uiSel.state)); }
function uiDebate() { runUi(actDebate()); }
function uiNarrative() { runUi(actNarrative()); }
function uiCourt() { runUi(actCourt()); }
function uiMcc() { runUi(actMcc()); }

function uiBlackFund() {
    panelMsg = arrangeBlackFund('you');
    updateStatusPanel();
    refreshPanel();
}

function simplePanel(title, desc, a, btnLabel, fnName, usedKey) {
    let h = actionHeader(true) + '<div class="ap-sec"><b>' + title + '</b><br>' + desc + '<br>' + costLine(a);
    if (usedKey) h += '<br>Is phase mein use: <b>' + gameState.counters.you[usedKey] + ' / ' + LIMITS[usedKey] + '</b>';
    h += '<br><button class="ap-btn" onclick="' + fnName + '()">' + btnLabel + '</button></div>';
    return h;
}

function ledgerHtml(side) {
    const L = gameState.ledger[side];
    let h = '<div class="ap-note">Kul kharch: <b>' + L.total + ' Cr</b> (White ' + L.white + ', Black ' + L.black + ')</div>';

    function table(title, obj, cleanKey) {
        const keys = Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a]; }).slice(0, 10);
        if (!keys.length) return '';
        let t = '<table class="ap-table"><tr><th>' + title + '</th><th>Kharch (Cr)</th></tr>';
        keys.forEach(function (k) {
            t += '<tr><td>' + esc(cleanKey ? k.replace('|', ' - ') : k) + '</td><td>' + obj[k] + '</td></tr>';
        });
        return t + '</table>';
    }

    h += table('Kis kaam par', L.byType, false) + table('Kis state mein', L.byState, false) + table('Kis seat par', L.bySeat, true);
    if (!L.total) h += '<div class="ap-note">Abhi tak koi kharch nahi hua.</div>';
    return h;
}

function renderPanel(name) {
    const g = gameState;
    if (name === 'Hawa Engine') return renderHawaPanel();
    if (name === 'Settings') return renderSettingsPanel();
    if (name === 'Achievements') return renderAchPanel();
    if (name === 'Heat Map') return renderHeatPanel();
    if (name === 'Opinion Poll') return renderPollPanel();
    if (name === 'Local Guru') return renderBoothPanel();
    if (name === 'VIP Seats') return renderStarPanel();
    if (name === 'Poaching') return renderCandidatePanel();
    if (name === 'Narrative Engine') return renderNarrativePanel();
    if (name === 'Media & Rallies') {
        const states = activeStates();
        let h = actionHeader(true);
        if (!states.length) return h + '<div class="ap-note">Is phase mein koi seat nahi hai.</div>';
        h += '<div class="ap-sec"><b>Target state (is phase ki):</b><br>' + stateSelectHtml() + '</div>';
        const seats = activeSeats(uiSel.state);
        h += '<div class="ap-sec"><b>State Rally</b> - poore state mein (' + seats.length + ' seats)<br>' + costLine(actStateRally(uiSel.state)) +
            '<br><button class="ap-btn" onclick="uiStateRally()">State Rally karo</button></div>';
        h += '<div class="ap-sec"><b>Seat Rally</b> - ek khaas seat par, zyada asar<br>' + seatSelectHtml(seats) + '<br>' + costLine(actSeatRally('', '', '')) +
            '<br><button class="ap-btn" onclick="uiSeatRally()">Is seat par rally karo</button></div>';
        return h;
    }
    if (name === 'IT Cell & Social') {
        const states = activeStates();
        let h = actionHeader(true);
        h += '<div class="ap-sec"><b>National Social Media Campaign</b><br>Poore desh mein asar (kabhi viral, kabhi ulta).<br>' + costLine(actSocial(null)) +
            '<br><button class="ap-btn" onclick="uiSocialNational()">Campaign chalao</button></div>';
        if (states.length) {
            h += '<div class="ap-sec"><b>State Social Campaign</b><br>' + stateSelectHtml() + '<br>' + costLine(actSocial(uiSel.state)) +
                '<br><button class="ap-btn" onclick="uiSocialState()">Is state mein chalao</button></div>';
        }
        return h;
    }
    if (name === 'Media Debates') {
        return simplePanel('TV / Digital Debate', 'Jeete to poore desh mein hawa badle, haare to chhoti chot.', actDebate(), 'Debate mein utro', 'uiDebate', null);
    }
    if (name === 'Narrative Engine') {
        return simplePanel('Narrative Push', 'Ek naya narrative desh bhar mein chalao. Seedha aur pakka asar.', actNarrative(), 'Narrative chalao', 'uiNarrative', null);
    }
    if (name === 'Courts Case') {
        return simplePanel('Opponent par Court Case', 'Jeete to opponent ki stamina, paisa aur asar ghatega. Haare to aapko nuksaan.', actCourt(), 'Case daalo', 'uiCourt', 'court');
    }
    if (name === 'EC Scrutiny & MCC') {
        return simplePanel('EC mein Aachar Sanhita (MCC) ki shikayat', 'Safal hui to opponent ko notice milega aur unka asar ghatega.', actMcc(), 'Shikayat karo', 'uiMcc', 'mcc');
    }
    if (name === 'Black Fund') {
        let h = actionHeader(false);
        h += '<div class="ap-sec"><b>Black Fund jutao</b><br>Ek baar mein 15 se 30 Cr, stamina 10%.<br>Is phase mein use: <b>' + g.counters.you.black + ' / ' + LIMITS.black +
            '</b><br>Risk meter: <b>' + Math.round(g.risk.you) + '</b> (har round raid ya EC notice ka chance: <b>' + Math.round(raidChance(g.risk.you) * 100) + '%</b>)<br>' +
            '<button class="ap-btn" onclick="uiBlackFund()">Black fund jutao</button></div>';
        h += '<div class="ap-note">Black fund se kiya kharch 1.5x asar deta hai, par risk badhata hai. Kharch karne ke liye action panel mein "Black Fund" chuno.</div>';
        return h;
    }
    if (name === 'White Fund') {
        return actionHeader(false) + '<div class="ap-sec"><b>White Fund</b><br>Har phase mein ' + PHASE_FUNDING + ' Cr milte hain. Bacha hua agle phase mein judta hai.<br>Ab tak white kharch: <b>' +
            g.ledger.you.white + ' Cr</b></div>';
    }
    if (name === 'Bank') {
        return actionHeader(false) + '<div class="ap-sec"><b>Aapka Bank</b></div>' + ledgerHtml('you');
    }
    if (name === 'Opponent Bank') {
        const o = g.opp;
        return '<div class="ap-head">' + esc(sideName('opp')) + ': Stamina <b>' + o.stamina + '%</b> &nbsp;|&nbsp; White <b>' + o.budget +
            ' Cr</b> &nbsp;|&nbsp; Black <b>' + o.blackFund + ' Cr</b></div>' + aiLogHtml() + ledgerHtml('opp');
    }
    if (name === 'Stamina') {
        return actionHeader(false) + '<div class="ap-sec"><b>Stamina</b><br>Har action stamina kharch karta hai. Har round ke baad stamina phir 100% ho jati hai.</div>';
    }
    if (name === 'Phase Voting') {
        const list = activeStates();
        let h = actionHeader(false) + '<div class="ap-sec"><b>Phase ' + g.phase + ' / ' + TOTAL_PHASES + '</b><br>Turnout: <b>' + g.turnout + '%</b></div>';
        h += '<table class="ap-table"><tr><th>State</th><th>Seats</th><th>Mukhya mudde</th></tr>';
        list.forEach(function (x) { h += '<tr><td>' + esc(x.st) + '</td><td>' + x.n + '</td><td>' + topIssues(x.st) + '</td></tr>'; });
        return h + '</table>';
    }
    return actionHeader(false) + '<div class="ap-sec">Yeh panel aage ke stage mein banega.</div>';
}

// ================= STAGE 5: AI OPPONENT =================

// Level baad mein (Stage 9) badlenge: noise = andaza kitna galat, spend = kharch ki raftar
const AI_CONFIG = { enabled: true, noise: 0.15, spend: 1.1, maxActions: 8, riskCap: 45 };

function normCdf(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
}

// Is phase ki har seat ka AI ka andaza (thoda galat, jaise opinion poll)
function aiBuildView(side, noiseOverride) {
    const rival = otherSide(side);
    const n = noiseOverride === undefined ? AI_CONFIG.noise : noiseOverride;
    const view = [];
    if (!resultModel) return view;
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase !== gameState.phase) return;
        view.push({
            key: k, st: s.st, pc: s.pc,
            wS: (side === 'you' ? s.wYou : s.wOpp) * rnd(1 - n, 1 + n),
            wR: (side === 'you' ? s.wOpp : s.wYou) * rnd(1 - n, 1 + n),
            wO: s.wOth * rnd(1 - n, 1 + n),
            side: side, rival: rival
        });
    });
    return view;
}

// Seat jeetne ki sambhavna (dS = apna asar badhne ki matra, rScale = rival ka asar kitna bacha)
function winProb(v, dS, rScale) {
    const bS = Math.max(-0.6, getBoost(v.side, v.key, v.st) + (dS || 0)) + hawaFor(v.side);
    const bR = getBoost(v.rival, v.key, v.st) * (rScale === undefined ? 1 : rScale) + hawaFor(v.rival);
    const a = v.wS * presenceOf(bS);
    const b = Math.max(v.wR * presenceOf(bR), v.wO);
    return normCdf(Math.log(a / b) / 0.14);
}

function evBoost(seats, delta) {
    let t = 0;
    seats.forEach(function (v) { t += winProb(v, delta) - winProb(v, 0); });
    return t;
}

function evRival(seats, f) {
    let t = 0;
    seats.forEach(function (v) { t += winProb(v, 0, 1 - f) - winProb(v, 0, 1); });
    return t;
}

function scopeDelta(side, kind, id, amt) {
    const b = gameState.boost[side];
    const cur = kind === 'national' ? (b.national || 0) : (b[kind][id] || 0);
    return diminish(cur, amt) - cur;
}

// Kya-kya kar sakta hai, aur har ek se kitni seat milne ki ummeed
function aiCandidates(side, view) {
    const list = [];
    const byState = {};
    view.forEach(function (v) {
        if (!byState[v.st]) byState[v.st] = [];
        byState[v.st].push(v);
    });

    Object.keys(byState).forEach(function (st) {
        const seats = byState[st];
        list.push({ a: actStateRally(st), ev: function (m) { return evBoost(seats, scopeDelta(side, 'state', st, 0.12 * m)); } });
        list.push({ a: actSocial(st), ev: function (m) { return evBoost(seats, scopeDelta(side, 'state', st, 0.07 * m)); } });
        list.push({ a: actBooth(st), ev: function (m) { return evBoost(seats, scopeDelta(side, 'state', st, 0.06 * m)); } });
        list.push({ a: actGuru(st), ev: function (m) { return evBoost(seats, scopeDelta(side, 'state', st, 0.05 * m)); } });
        for (let i = 0; i < 3; i++) {
            list.push({ a: actStar(i, st), ev: function (m) {
                const c = gameState.stars[side][i].charisma;
                return evBoost(seats, scopeDelta(side, 'state', st, 0.14 * c * m));
            } });
        }
        list.push({ a: actCandidate(st, 'local'), ev: function () { return evBoost(seats, Math.max(0, 0.06 - candValue(side, st))); } });
        list.push({ a: actCandidate(st, 'celeb'), ev: function () { return evBoost(seats, Math.max(0, 0.11 - candValue(side, st))); } });
    });
    ISSUES.forEach(function (theme) {
        list.push({ a: actNarrativeTheme(theme), ev: function (m) {
            const sub = view.filter(function (v) { return issueOfKey(v.key) === theme; });
            return evBoost(sub, scopeDelta(side, 'issue', theme, 0.12 * m));
        } });
    });

    view.forEach(function (v) {
        list.push({ a: actSeatRally(v.st, v.key, v.pc), ev: function (m) { return evBoost([v], scopeDelta(side, 'seat', v.key, 0.3 * m)); } });
    });

    list.push({ a: actSocial(null), ev: function (m) { return evBoost(view, scopeDelta(side, 'national', null, 0.04 * m)); } });
    list.push({ a: actSocial(null, 'attack'), ev: function (m) { return evBoost(view, scopeDelta(side, 'national', null, 0.024 * m)) + 0.5 * evRival(view, 0.08); } });
    list.push({ a: actDebate(), ev: function (m) { return evBoost(view, scopeDelta(side, 'national', null, 0.032 * m)); } });
    list.push({ a: actNarrative(), ev: function (m) { return evBoost(view, scopeDelta(side, 'national', null, 0.05 * m)); } });
    list.push({ a: actCourt(), ev: function () { return 0.45 * (evRival(view, 0.3) + 0.35) - 0.08; } });
    ISSUES.forEach(function (theme) {
        const sub = view.filter(function (v) { return issueOfKey(v.key) === theme; });
        list.push({ a: actDebateX(theme, 'anubhavi'), ev: function (m) {
            const p = 0.6;
            return evBoost(sub, scopeDelta(side, 'issue', theme, (p * 0.12 - (1 - p) * 0.03) * m));
        } });
    });
    Object.keys(byState).forEach(function (st) {
        list.push({ a: actSpy(st), ev: function () { return 0.3 * ((gameState.violations[otherSide(side)][st] || []).length); } });
        list.push({ a: actMcc(st), ev: function () { return 0.35 * ((gameState.evidence[side][st] || []).length); } });
    });
    list.push({ a: actMcc(), ev: function () { return 0.35 * (evRival(view, 0.15) + 0.1) - 0.02; } });
    return list;
}

function aiLabel(a, fund) {
    let t = a.type;
    if (a.key && resultModel.seats[a.key]) t += ' - ' + resultModel.seats[a.key].pc;
    else if (a.st) t += ' - ' + a.st;
    return t + (fund === 'black' ? ' [black]' : '');
}

// AI ki ek baari: paisa aur stamina bachakar sabse faayde wale kaam
function aiTakeTurn(side) {
    const lines = [];
    if (!AI_CONFIG.enabled || !resultModel) return lines;

    const roundsLeft = Math.max(1, Math.ceil((100 - gameState.turnout) / 25));
    const rival = otherSide(side);

    // Zarurat ho to black fund jutao (risk dekhkar)
    if (gameState.counters[side].black < LIMITS.black && resGet(side, 'stamina') >= 45 &&
        gameState.risk[side] < AI_CONFIG.riskCap && resGet(side, 'blackFund') < 30 && Math.random() < 0.55) {
        const r = arrangeBlackFund(side);
        if (r.ok) lines.push('Black fund jutaya');
    }

    const view = aiBuildView(side);
    if (!view.length) return lines;
    const cands = aiCandidates(side, view);

    const riskOk = gameState.risk[side] < AI_CONFIG.riskCap;
    const money = resGet(side, 'budget') + (riskOk ? resGet(side, 'blackFund') : 0);
    let rb = (money / roundsLeft) * AI_CONFIG.spend;
    let rs = Math.max(0, resGet(side, 'stamina') - 5) / roundsLeft * AI_CONFIG.spend;
    const rb0 = Math.max(1, rb), rs0 = Math.max(1, rs);

    for (let n = 0; n < AI_CONFIG.maxActions; n++) {
        const stam = resGet(side, 'stamina');
        const white = resGet(side, 'budget');
        const black = resGet(side, 'blackFund');
        const canBlack = gameState.risk[side] < AI_CONFIG.riskCap;
        let best = null;

        cands.forEach(function (c) {
            const a = c.a;
            if (a.big && stam < RALLY_MIN_STAMINA) return;
            if (stam < a.stamina) return;
            if (a.limitKey && gameState.counters[side][a.limitKey] >= LIMITS[a.limitKey]) return;
            if (a.check && a.check(side)) return;
            if (a.cost > rb * 1.15 || a.stamina > rs * 1.15) return;
            let fund = 'white';
            if (canBlack && black >= a.cost) fund = 'black';
            else if (white < a.cost) return;
            const ev = c.ev(fund === 'black' ? 1.5 : 1);
            if (ev < 0.12) return;
            const score = ev / (a.cost / rb0 + a.stamina / rs0) * styleWeight(a.type);
            if (!best || score > best.score) best = { a: a, fund: fund, score: score };
        });

        if (!best) break;
        const r = doAction(side, best.a, best.fund);
        if (!r.ok) break;
        rb -= best.a.cost;
        rs -= best.a.stamina;
        lines.push(aiLabel(best.a, best.fund));
        gameState.aiLog.push({ phase: gameState.phase, round: gameState.round, side: side, text: r.text });
    }
    return lines;
}

function showAiBanner(lines) {
    if (!lines || !lines.length) return;
    ensureActionStyles();
    const old = document.getElementById('ai-toast');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const d = document.createElement('div');
    d.id = 'ai-toast';
    d.className = 'ap-toast';
    d.innerText = sideName('opp') + ' ne is round mein: ' + lines.join(', ');
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 6000);

    const last = gameState.aiLog.length ? gameState.aiLog[gameState.aiLog.length - 1].text : '';
    if (last) setHeadline(last);
}

function aiLogHtml() {
    const log = gameState.aiLog.filter(function (x) { return x.side === 'opp'; }).slice(-12).reverse();
    if (!log.length) return '<div class="ap-note">Abhi tak opponent ne koi chaal nahi chali.</div>';
    let h = '<table class="ap-table"><tr><th>Phase / Round</th><th>Opponent ne kya kiya</th></tr>';
    log.forEach(function (x) { h += '<tr><td>' + x.phase + ' / ' + x.round + '</td><td>' + esc(x.text) + '</td></tr>'; });
    return h + '</table>';
}

// ================= STAGE 6: DEPTH (risk, booth, stars, candidates, issues, polls) =================

const ISSUES = ['Rozgaar', 'Mehngai', 'Kisan', 'Vikas'];

function stateIssueWeights() {
    const w = [0.1, 0.1, 0.1, 0.1];
    const p = Math.floor(Math.random() * 4);
    let q = Math.floor(Math.random() * 4);
    if (q === p) q = (q + 1) % 4;
    w[p] = 0.5;
    w[q] = 0.3;
    return w;
}

function pickIssue(w) {
    let r = Math.random() * (w[0] + w[1] + w[2] + w[3]);
    for (let i = 0; i < 4; i++) {
        r -= w[i];
        if (r <= 0) return ISSUES[i];
    }
    return ISSUES[3];
}

function issueOfKey(key) {
    return resultModel && resultModel.seats[key] ? resultModel.seats[key].issue : null;
}

function issueBoost(b, key) {
    const iss = issueOfKey(key);
    return iss && b.issue ? (b.issue[iss] || 0) : 0;
}

function topIssues(st) {
    const w = resultModel && resultModel.stateIssues[st];
    if (!w) return '-';
    const idx = [0, 1, 2, 3].sort(function (a, b) { return w[b] - w[a]; });
    return ISSUES[idx[0]] + ', ' + ISSUES[idx[1]];
}

// ---- A) Black fund ka risk: raid ya EC notice ----
function raidChance(risk) {
    if (risk <= 25) return 0;
    return Math.min(0.3, (risk - 25) / 200);
}

function resolveRisk() {
    const lines = [];
    ['you', 'opp'].forEach(function (side) {
        if (Math.random() >= raidChance(gameState.risk[side])) return;
        const name = sideName(side);
        if (Math.random() < 0.7) {
            const lost = Math.round(resGet(side, 'blackFund') * 0.6);
            resSet(side, 'blackFund', resGet(side, 'blackFund') - lost);
            resSet(side, 'stamina', Math.max(0, resGet(side, 'stamina') - 15));
            addBoost(side, 'national', -0.04);
            lines.push('Aayakar vibhag ne ' + name + ' ke thikano par chhapa mara' + (lost ? ', ' + lost + ' Cr black fund zabt' : ''));
        } else {
            addBoost(side, 'national', -0.05);
            resSet(side, 'budget', Math.max(0, resGet(side, 'budget') - 5));
            lines.push('Chunav Aayog ne ' + name + ' ko notice diya, jurmana 5 Cr');
        }
        gameState.risk[side] *= 0.6;
        shiftHawa(side, -8, 'Chhapa ya notice');
        gameState.aiLog.push({ phase: gameState.phase, round: gameState.round, side: 'sys', text: lines[lines.length - 1] });
    });
    return lines;
}

function showRiskBanner(lines) {
    if (!lines || !lines.length) return;
    ensureActionStyles();
    const old = document.getElementById('risk-toast');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const d = document.createElement('div');
    d.id = 'risk-toast';
    d.className = 'ap-toast risk';
    d.innerText = lines.join(' | ');
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 7000);
    setHeadline(lines[0]);
}

// ---- B) Booth karyakarta ----
function actBooth(st) {
    const n = activeSeats(st).length;
    return {
        type: 'Booth Team', st: st, cost: Math.round(1 + 0.2 * n), stamina: 2,
        check: function (side) {
            return (gameState.booths[side][st] || 0) >= 3 ? 'Is state mein is phase ki 3 booth team ho chuki.' : null;
        },
        apply: function (m, side) {
            gameState.booths[side][st] = (gameState.booths[side][st] || 0) + 1;
            addBoost(side, 'state', st, 0.06 * m);
            return { text: sideName(side) + ' ke booth karyakarta ' + st + ' mein ghar-ghar pahunche.', good: true };
        }
    };
}

// ---- C) Star campaigner ----
function makeStars() {
    return [
        { name: 'Jan Netaa Vikram', charisma: 1.0, used: false },
        { name: 'Mahila Chehra Meera', charisma: 1.15, used: false },
        { name: 'Yuva Chehra Arjun', charisma: 0.9, used: false }
    ];
}

function resetStars() {
    ['you', 'opp'].forEach(function (sd) {
        gameState.stars[sd].forEach(function (x) { x.used = false; });
    });
}

function actStar(idx, st) {
    return {
        type: 'Star Campaigner', st: st, cost: 3, stamina: 1,
        check: function (side) {
            const x = gameState.stars[side][idx];
            return x.used ? x.name + ' is round mein pehle hi busy hain.' : null;
        },
        apply: function (m, side) {
            const x = gameState.stars[side][idx];
            x.used = true;
            addBoost(side, 'state', st, 0.14 * x.charisma * m);
            return { text: x.name + ' ne ' + st + ' mein ' + sideName(side) + ' ke liye jansabha ki.', good: true };
        }
    };
}

// ---- D) Candidate chunav ----
const CAND_TYPES = {
    party: { label: 'Party ticket (default)', cost: 0, rebel: 0.10, desc: 'Koi khaas koshish nahi. Naraz log bagawat kar sakte hain.' },
    local: { label: 'Local netaa', cost: 1, rebel: 0.03, desc: 'Jaana-pehchana chehra. Chhoti par pakki badhat.' },
    naya: { label: 'Naya chehra', cost: 1, rebel: 0.12, desc: 'Jokhim: kabhi bada faayda, kabhi nuksaan.' },
    celeb: { label: 'Celebrity', cost: 3, rebel: 0.08, desc: 'Bada asar, par vivad ka 20% khatra.' }
};

function actCandidate(st, kind) {
    return {
        type: 'Candidate (' + CAND_TYPES[kind].label + ')', st: st, cost: CAND_TYPES[kind].cost, stamina: 0,
        check: function (side) {
            return (gameState.candPolicy[side][st] || 'party') === kind ? 'Yeh pehle se chuna hua hai.' : null;
        },
        apply: function (m, side) {
            gameState.candPolicy[side][st] = kind;
            return { text: sideName(side) + ' ne ' + st + ' mein ' + CAND_TYPES[kind].label + ' utare.', good: true };
        }
    };
}

// Abhi chune hue candidate ki lagbhag keemat (AI ke andaze ke liye)
function candValue(side, st) {
    const kind = (gameState.candPolicy[side] && gameState.candPolicy[side][st]) || 'party';
    return kind === 'local' ? 0.06 : (kind === 'celeb' ? 0.11 : (kind === 'naya' ? 0.07 : 0));
}

// Natija ke waqt har seat ke candidate ka asar
function candidateMult(side, st) {
    const kind = (gameState.candPolicy && gameState.candPolicy[side] && gameState.candPolicy[side][st]) || 'party';
    let m = 1;
    if (kind === 'local') m = 1.06;
    else if (kind === 'naya') m = rnd(0.9, 1.25);
    else if (kind === 'celeb') { m = 1.15; if (Math.random() < 0.2) m *= 0.8; }
    if (Math.random() < CAND_TYPES[kind].rebel) m *= 0.85;
    return m;
}

// ---- E) Mudde par narrative ----
function actNarrativeTheme(theme) {
    return {
        type: 'Narrative (' + theme + ')', st: null, cost: 5, stamina: 5,
        apply: function (m, side) {
            addBoost(side, 'issue', theme, 0.12 * m);
            return { text: sideName(side) + ' ne ' + theme + ' ka mudda uthaya, jahan yeh mudda hai wahan asar gehra.', good: true };
        }
    };
}

// ---- F) Opinion poll ----
function actSurvey() {
    return {
        type: 'Paid Survey', st: null, cost: 3, stamina: 1,
        apply: function () {
            computePoll(0.07, true);
            return { text: 'Paid survey ka natija taiyar hai.', good: true };
        }
    };
}

function computePoll(noise, withSeats) {
    const view = aiBuildView('you', noise);
    const byState = {};
    const tight = [];
    view.forEach(function (v) {
        if (!byState[v.st]) byState[v.st] = { n: 0, exp: 0, tight: 0 };
        const p = winProb(v, 0);
        const o = byState[v.st];
        o.n++;
        o.exp += p;
        if (p > 0.35 && p < 0.65) o.tight++;
        if (p > 0.3 && p < 0.7) tight.push({ seat: v.pc, st: v.st, p: p });
    });
    const rows = Object.keys(byState).map(function (st) {
        return { st: st, n: byState[st].n, exp: byState[st].exp, tight: byState[st].tight };
    }).sort(function (a, b) { return b.n - a.n || (a.st < b.st ? -1 : 1); });
    tight.sort(function (a, b) { return Math.abs(a.p - 0.5) - Math.abs(b.p - 0.5); });
    gameState.lastPoll = {
        phase: gameState.phase, round: gameState.round, paid: !!withSeats,
        rows: rows, tight: withSeats ? tight.slice(0, 12) : []
    };
}

function uiPollQuick() {
    computePoll(0.22, false);
    panelMsg = { ok: true, good: true, text: 'Quick poll ka natija neeche hai (andaza thoda galat ho sakta hai).' };
    refreshPanel();
}

function uiPollPaid() { runUi(actSurvey()); }

// ---- UI panels ----
function uiBooth() { if (uiSel.state) runUi(actBooth(uiSel.state)); }
function uiStar(i) { if (uiSel.state) runUi(actStar(i, uiSel.state)); }
function uiCandidate(kind) { if (uiSel.state) runUi(actCandidate(uiSel.state, kind)); }
function uiNarrativeTheme(t) { runUi(actNarrativeTheme(t)); }

function renderPollPanel() {
    let h = actionHeader(false);
    h += '<div class="ap-sec"><b>Opinion Poll</b><br>Quick poll: muft, par andaza kaafi galat ho sakta hai.<br>Paid survey: 3 Cr, 1% stamina, zyada sahi aur kaante ki seats bhi batata hai.<br>' +
        '<button class="ap-btn" onclick="uiPollQuick()">Quick poll (muft)</button> ' +
        '<button class="ap-btn" onclick="uiPollPaid()">Paid survey (3 Cr)</button></div>';
    const p = gameState.lastPoll;
    if (!p || p.phase !== gameState.phase) return h + '<div class="ap-note">Is phase ka poll abhi nahi hua.</div>';
    h += '<div class="ap-note">' + (p.paid ? 'Paid survey' : 'Quick poll') + ' (Phase ' + p.phase + ', Round ' + p.round + ')</div>';
    h += '<table class="ap-table"><tr><th>State</th><th>Seats</th><th>Aapki ummeed</th><th>Kaante ki</th><th>Mudde</th></tr>';
    let tot = 0, all = 0;
    p.rows.forEach(function (r) {
        tot += r.exp; all += r.n;
        h += '<tr><td>' + esc(r.st) + '</td><td>' + r.n + '</td><td>' + r.exp.toFixed(1) + '</td><td>' + r.tight + '</td><td>' + topIssues(r.st) + '</td></tr>';
    });
    h += '</table><div class="ap-note">Kul ummeed: <b>' + tot.toFixed(0) + ' / ' + all + '</b> seats</div>';
    if (p.tight.length) {
        h += '<table class="ap-table"><tr><th>Kaante ki seat</th><th>State</th><th>Aapki jeet ka chance</th></tr>';
        p.tight.forEach(function (t) {
            h += '<tr><td>' + esc(t.seat) + '</td><td>' + esc(t.st) + '</td><td>' + Math.round(t.p * 100) + '%</td></tr>';
        });
        h += '</table>';
    }
    return h;
}

function renderBoothPanel() {
    const states = activeStates();
    let h = actionHeader(true);
    if (!states.length) return h + '<div class="ap-note">Is phase mein koi seat nahi.</div>';
    h += '<div class="ap-sec"><b>Booth Karyakarta</b> - ghar-ghar sampark, sasta aur kam stamina.<br>Target state:<br>' + stateSelectHtml() + '<br>' +
        costLine(actBooth(uiSel.state)) + '<br>Is state mein is phase ki team: <b>' + (gameState.booths.you[uiSel.state] || 0) + ' / 3</b><br>' +
        '<button class="ap-btn" onclick="uiBooth()">Booth team bhejo</button></div>';
    return h;
}

function renderStarPanel() {
    const states = activeStates();
    let h = actionHeader(true);
    if (!states.length) return h + '<div class="ap-note">Is phase mein koi seat nahi.</div>';
    h += '<div class="ap-sec"><b>Star Campaigner</b> - har netaa ek round mein sirf ek jagah ja sakta hai.<br>Target state:<br>' + stateSelectHtml() + '</div>';
    gameState.stars.you.forEach(function (x, i) {
        h += '<div class="ap-sec"><b>' + esc(x.name) + '</b> (asar x' + x.charisma + ') - ' + (x.used ? 'busy' : 'khaali') + '<br>' +
            costLine(actStar(i, uiSel.state)) + '<br><button class="ap-btn" onclick="uiStar(' + i + ')">Is state mein bhejo</button></div>';
    });
    return h;
}

function renderCandidatePanel() {
    const states = activeStates();
    let h = actionHeader(true);
    if (!states.length) return h + '<div class="ap-note">Is phase mein koi seat nahi.</div>';
    const cur = gameState.candPolicy.you[uiSel.state] || 'party';
    h += '<div class="ap-sec"><b>Candidate Chunav</b> - phase ke natije se pehle chuno.<br>Target state:<br>' + stateSelectHtml() +
        '<br>Abhi chuna hua: <b>' + CAND_TYPES[cur].label + '</b></div>';
    ['local', 'naya', 'celeb', 'party'].forEach(function (k) {
        h += '<div class="ap-sec"><b>' + CAND_TYPES[k].label + '</b> - ' + CAND_TYPES[k].desc + '<br>Kharch: <b>' + CAND_TYPES[k].cost +
            ' Cr</b> &nbsp;|&nbsp; Bagawat ka khatra: ' + Math.round(CAND_TYPES[k].rebel * 100) + '%<br>' +
            '<button class="ap-btn" onclick="uiCandidate(\'' + k + '\')">Yeh chuno</button></div>';
    });
    return h;
}

function renderNarrativePanel() {
    const counts = {};
    ISSUES.forEach(function (i) { counts[i] = 0; });
    let total = 0;
    if (resultModel) {
        Object.keys(resultModel.seats).forEach(function (k) {
            const s = resultModel.seats[k];
            if (s.phase === gameState.phase) { counts[s.issue]++; total++; }
        });
    }
    let h = actionHeader(true);
    h += '<div class="ap-sec"><b>Aam Narrative</b> - poore desh mein seedha asar.<br>' + costLine(actNarrative()) +
        '<br><button class="ap-btn" onclick="uiNarrative()">Narrative chalao</button></div>';
    h += '<div class="ap-sec"><b>Mudde par narrative</b> - jis seat par wo mudda hai wahan zyada asar.<br>Is phase ki ' + total + ' seats mein: ';
    h += ISSUES.map(function (i) { return i + ' ' + counts[i]; }).join(', ') + '<br>' + costLine(actNarrativeTheme('Rozgaar')) + '<br>';
    ISSUES.forEach(function (i) {
        h += '<button class="ap-btn" style="margin-right:6px" onclick="uiNarrativeTheme(\'' + i + '\')">' + i + '</button>';
    });
    return h + '</div>';
}

// ================= STAGE 7: HAWA, EVENTS, QUICK RESPONSE =================

const HAWA_LIMIT = 100;
const HAWA_EFFECT = 0.09;
const HAWA_BY_TYPE = {
    'State Rally': 2, 'Seat Rally': 1, 'Social (National)': 2, 'Social (State)': 1,
    'Narrative': 3, 'Star Campaigner': 2
};

// Hawa: + matlab aapke paksh mein, - matlab opponent ke paksh mein
function hawaFor(side) {
    const h = (gameState.hawa || 0) / HAWA_LIMIT * HAWA_EFFECT;
    return side === 'you' ? h : -h;
}

function hawaTypeValue(type) {
    if (HAWA_BY_TYPE[type] !== undefined) return HAWA_BY_TYPE[type];
    if (type.indexOf('Narrative (') === 0) return 3;
    return 0;
}

// delta > 0 matlab "side" ke liye accha
function shiftHawa(side, delta, why) {
    if (!delta) return;
    const h = (gameState.hawa || 0) + (side === 'you' ? delta : -delta);
    gameState.hawa = Math.max(-HAWA_LIMIT, Math.min(HAWA_LIMIT, h));
    gameState.hawaLog.push({ phase: gameState.phase, round: gameState.round, side: side, delta: delta, why: why || '' });
    if (gameState.hawaLog.length > 60) gameState.hawaLog.shift();
}

function phaseMomentum(rows) {
    let y = 0, o = 0;
    rows.forEach(function (r) {
        const sd = resultModel.sideOf[r.winner];
        if (sd === 'you') y++; else if (sd === 'opp') o++;
    });
    if (y > o) shiftHawa('you', 8, 'Phase mein badhat');
    else if (o > y) shiftHawa('opp', 8, 'Phase mein badhat');
}

function ensureHawaBar() {
    if (document.getElementById('sp-hawa-fill')) return;
    const panel = document.querySelector('.wr-status-panel');
    if (!panel || typeof panel.insertBefore !== 'function') return;
    const test = panel.querySelector('.sp-test');
    const div = document.createElement('div');
    div.className = 'sp-block';
    div.innerHTML = '<div class="sp-label"><span>Hawa</span><span id="sp-hawa-val">0</span></div>' +
        '<div class="sp-bar" style="position:relative;"><div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:#64748b;"></div>' +
        '<div class="sp-fill" id="sp-hawa-fill" style="position:absolute;left:50%;width:0%;"></div></div>';
    panel.insertBefore(div, test || null);
}

function updateHawaBar() {
    ensureHawaBar();
    const h = gameState.hawa || 0;
    const fill = document.getElementById('sp-hawa-fill');
    const val = document.getElementById('sp-hawa-val');
    if (!fill || !val) return;
    fill.style.left = (h >= 0 ? 50 : 50 + h / 2) + '%';
    fill.style.width = (Math.abs(h) / 2) + '%';
    fill.style.background = h >= 0 ? '#38bdf8' : '#fb923c';
    val.innerText = (h >= 0 ? selectedYouParty : selectedOppParty) + ' ' + (h >= 0 ? '+' : '') + Math.round(h);
}

function renderHawaPanel() {
    const h = gameState.hawa || 0;
    let html = actionHeader(false);
    html += '<div class="ap-sec"><b>Hawa Meter</b><br>Abhi hawa: <b>' + esc(h >= 0 ? sideName('you') : sideName('opp')) + ' ke paksh mein ' +
        Math.abs(Math.round(h)) + '</b><br>Hawa ka asar: har seat par lagbhag <b>' + (Math.abs(h) / HAWA_LIMIT * HAWA_EFFECT * 100).toFixed(1) +
        '%</b> taqat badhti ya ghatti hai (adhiktam ' + Math.round(HAWA_EFFECT * 100) + '%).<br>Hawa har round thodi kam hoti hai, par badhat aur ghatnayein ise badalti hain.</div>';
    const log = gameState.hawaLog.slice(-12).reverse();
    if (!log.length) return html + '<div class="ap-note">Abhi tak hawa mein koi badlav nahi.</div>';
    html += '<table class="ap-table"><tr><th>Phase / Round</th><th>Kiske liye</th><th>Badlav</th><th>Wajah</th></tr>';
    log.forEach(function (x) {
        html += '<tr><td>' + x.phase + ' / ' + x.round + '</td><td>' + esc(sideName(x.side)) + '</td><td>' + (x.delta > 0 ? '+' : '') + x.delta + '</td><td>' + esc(x.why) + '</td></tr>';
    });
    return html + '</table>';
}

// ---- Events ----
function randomActiveState() {
    const l = activeStates();
    return l.length ? l[Math.floor(Math.random() * l.length)].st : null;
}

function evViral() {
    const me = sideName('you');
    return {
        title: 'Viral Video',
        text: me + ' ke ek netaa ka purana video viral ho gaya hai. Media sawal pooch raha hai.',
        choices: [
            { label: 'Maafi maango', desc: 'Stamina 4. Nuksaan kam.', cost: 0, stamina: 4,
              run: function () { shiftHawa('you', -1, 'Viral video par maafi'); return 'Maafi se maamla thanda pada.'; } },
            { label: 'Tark se jawab do', desc: 'Kharch 2 Cr, stamina 8. 60% hawa +3, warna -5.', cost: 2, stamina: 8,
              run: function () {
                  if (Math.random() < 0.6) { shiftHawa('you', 3, 'Viral video par kaargar jawab'); return 'Aapke jawab ne baazi palat di.'; }
                  shiftHawa('you', -5, 'Viral video par jawab ulta pada'); return 'Jawab ulta pada, virodhiyon ko mauka mila.';
              } },
            { label: 'Andekha karo', desc: 'Muft, par jokhim.', cost: 0, stamina: 0,
              run: function () {
                  if (Math.random() < 0.5) { shiftHawa('you', -2, 'Viral video andekha'); return 'Maamla chhota hi raha.'; }
                  shiftHawa('you', -6, 'Viral video andekha'); return 'Video aur failta gaya, hawa bigdi.';
              } }
        ]
    };
}

function evFlood() {
    const st = randomActiveState();
    return {
        title: 'Baadh ki aapda',
        text: st + ' mein baadh aayi hai. Log madad ki raah dekh rahe hain.',
        choices: [
            { label: 'Rahat bhejo', desc: 'Kharch 6 Cr, stamina 8. ' + st + ' mein asar +, hawa +2.', cost: 6, stamina: 8,
              run: function () { addBoost('you', 'state', st, 0.12); shiftHawa('you', 2, 'Baadh mein rahat'); return st + ' mein rahat se logon ka bharosa badha.'; } },
            { label: 'Khabar lo, door se', desc: 'Stamina 2. Chhota asar.', cost: 0, stamina: 2,
              run: function () { addBoost('you', 'state', st, 0.03); return 'Phone par hal-chaal poochhi gayi.'; } },
            { label: 'Andekha karo', desc: 'Muft, par ' + st + ' mein naraazgi.', cost: 0, stamina: 0,
              run: function () { addBoost('you', 'state', st, -0.05); shiftHawa('you', -2, 'Baadh andekhi'); return st + ' mein naraazgi badhi.'; } }
        ]
    };
}

function evScandal() {
    const st = randomActiveState();
    return {
        title: 'Ummeedwar par vivad',
        text: st + ' mein aapke ek ummeedwar par aarop lage hain.',
        choices: [
            { label: 'Ummeedwar hatao', desc: 'Kharch 3 Cr. ' + st + ' mein halka nuksaan.', cost: 3, stamina: 0,
              run: function () { addBoost('you', 'state', st, -0.03); return 'Ummeedwar badla gaya, maamla thama.'; } },
            { label: 'Bachav karo', desc: 'Stamina 6. 50% maamla thanda, warna bada nuksaan.', cost: 0, stamina: 6,
              run: function () {
                  if (Math.random() < 0.5) return 'Bachav kaam kar gaya, maamla khatm.';
                  addBoost('you', 'state', st, -0.1); shiftHawa('you', -4, 'Ummeedwar vivad'); return 'Aarop bhaari pade, ' + st + ' mein nuksaan hua.';
              } }
        ]
    };
}

function evEndorse() {
    return {
        title: 'Samarthan',
        text: 'Ek lokpriya samajsevi ne ' + sideName('you') + ' ko khule roop se samarthan diya.',
        choices: [
            { label: 'Swagat karo', desc: 'Muft. Poore desh mein halka asar, hawa +3.', cost: 0, stamina: 0,
              run: function () { addBoost('you', 'national', 0.02); shiftHawa('you', 3, 'Samarthan'); return 'Samarthan se mahaul achha bana.'; } }
        ]
    };
}

function evCyber() {
    return {
        title: 'IT cell par cyber hamla',
        text: 'Aapke social media khaaton par cyber hamla hua hai.',
        choices: [
            { label: 'Suraksha par kharch karo', desc: 'Kharch 5 Cr. Koi nuksaan nahi.', cost: 5, stamina: 0,
              run: function () { return 'Suraksha mazboot, hamla nakaam.'; } },
            { label: 'Nazarandaz karo', desc: 'Muft, par poore desh mein asar ghatega, hawa -2.', cost: 0, stamina: 0,
              run: function () { addBoost('you', 'national', -0.03); shiftHawa('you', -2, 'Cyber hamla'); return 'Kuch khaate band, abhiyan dheema pada.'; } }
        ]
    };
}

function evInflation() {
    return {
        title: 'Mehngai ke naye aankde',
        text: 'Mehngai ke naye aankde aaye hain. Janta mein charcha hai.',
        choices: [
            { label: 'Mehngai par narrative', desc: 'Kharch 6 Cr, stamina 6. Mehngai mudde par asar +.', cost: 6, stamina: 6,
              run: function () { addBoost('you', 'issue', 'Mehngai', 0.1); return 'Aapne mehngai ka mudda zor se uthaya.'; } },
            { label: 'Chhod do', desc: 'Muft. Koi asar nahi.', cost: 0, stamina: 0, run: function () { return 'Aapne is par kuch nahi kaha.'; } }
        ]
    };
}

function evDefect() {
    const st = randomActiveState();
    return {
        title: 'Sthaniya netaa ka dal badalna',
        text: st + ' ke ek sthaniya netaa virodhi khemein se aapke saath aana chahte hain.',
        choices: [
            { label: 'Swagat karo', desc: 'Kharch 4 Cr. ' + st + ' mein aapka asar +, opponent ka -.', cost: 4, stamina: 0,
              run: function () { addBoost('you', 'state', st, 0.1); addBoost('opp', 'state', st, -0.05); return st + ' mein ek bada naam aapke saath juda.'; } },
            { label: 'Mana karo', desc: 'Muft. Koi asar nahi.', cost: 0, stamina: 0, run: function () { return 'Aapne prastav thukra diya.'; } }
        ]
    };
}

// Opponent ki galti: timer ke saath jaldi jawab
function evGaffe() {
    const opp = sideName('opp');
    return {
        title: 'Opponent ki chook!',
        text: opp + ' ke ek pravakta ne vivadit bayan de diya. Jitna jaldi jawab doge, utna zyada asar!',
        timer: 10,
        onExpire: function () { shiftHawa('opp', 1, 'Chook sambhal li'); return 'Mauka nikal gaya. ' + opp + ' ne maamla sambhaal liya.'; },
        choices: [
            { label: 'Turant hamla karo', desc: 'Kharch 2 Cr, stamina 6. Hawa mein badi badhat.', cost: 2, stamina: 6,
              run: function (mult) {
                  shiftHawa('you', Math.round(8 * mult), 'Opponent ki chook par hamla');
                  addBoost('opp', 'national', -0.03 * mult);
                  return opp + ' ki chook par aapka hamla sahi nishane par laga.';
              } },
            { label: 'Naram jawab do', desc: 'Stamina 2. Chhoti badhat.', cost: 0, stamina: 2,
              run: function (mult) { shiftHawa('you', Math.max(1, Math.round(3 * mult)), 'Opponent ki chook par naram jawab'); return 'Aapne sanyam se jawab diya.'; } },
            { label: 'Chup raho', desc: 'Koi asar nahi.', cost: 0, stamina: 0, run: function () { return 'Aapne is par kuch nahi kaha.'; } }
        ]
    };
}

// Opponent ke saath chupchaap hone wali ghatna
function silentAiEvent() {
    const opp = sideName('opp');
    if (Math.random() < 0.5) {
        shiftHawa('opp', 3, 'Opponent ki badi raily');
        addBoost('opp', 'national', 0.02);
        return opp + ' ki raily mein ummeed se zyada bheed umdi.';
    }
    shiftHawa('opp', -3, 'Opponent par vivad');
    addBoost('opp', 'national', -0.02);
    return opp + ' ke ek netaa par vivad khada ho gaya.';
}

function rollRoundEvent() {
    if (!resultModel) return null;
    const r = Math.random();
    if (r < 0.25) {
        const pool = [evViral, evFlood, evScandal, evEndorse, evCyber, evInflation, evDefect];
        return pool[Math.floor(Math.random() * pool.length)]();
    }
    if (r < 0.37) return evGaffe();
    if (r < 0.47) {
        const t = silentAiEvent();
        setHeadline(t);
        showInfoBanner(t);
    }
    return null;
}

function showInfoBanner(text) {
    ensureActionStyles();
    const old = document.getElementById('info-toast');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const d = document.createElement('div');
    d.id = 'info-toast';
    d.className = 'ap-toast info';
    d.innerText = text;
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 6000);
}

function ensureEventModal() {
    if (document.getElementById('event-modal')) return;
    const m = document.createElement('div');
    m.id = 'event-modal';
    m.className = 'modal hidden';
    m.innerHTML = '<div class="modal-content" style="width:540px;text-align:left;">' +
        '<h2 id="ev-title" style="color:#ff9933;margin-bottom:10px;"></h2>' +
        '<p id="ev-text" style="color:#e2e8f0;margin-bottom:10px;line-height:1.5;"></p>' +
        '<div id="ev-timer" style="color:#facc15;font-weight:bold;margin-bottom:8px;"></div>' +
        '<div id="ev-choices"></div></div>';
    document.body.appendChild(m);
}

let evTimerId = null;
let evTimeLeft = 0;

function evAfford(c) {
    return gameState.budget >= c.cost && gameState.stamina >= c.stamina;
}

function renderEventChoices() {
    const ev = gameState.curEvent;
    let h = '';
    ev.choices.forEach(function (c, i) {
        const ok = evAfford(c);
        h += '<button class="ap-btn" style="display:block;width:100%;text-align:left;margin-bottom:6px;' + (ok ? '' : 'opacity:0.45;') + '"' +
            (ok ? '' : ' disabled') + ' onclick="chooseEvent(' + i + ')"><b>' + esc(c.label) + '</b> - ' + esc(c.desc) + '</button>';
    });
    document.getElementById('ev-choices').innerHTML = h;
}

function startEvent(ev) {
    ensureActionStyles();
    ensureEventModal();
    gameState.eventPending = true;
    gameState.curEvent = ev;
    document.getElementById('ev-title').innerText = ev.title;
    document.getElementById('ev-text').innerText = ev.text;
    renderEventChoices();
    const t = document.getElementById('ev-timer');
    if (ev.timer) {
        evTimeLeft = ev.timer;
        t.innerText = 'Samay: ' + evTimeLeft + ' second';
        if (evTimerId) clearInterval(evTimerId);
        evTimerId = setInterval(evTick, 1000);
    } else {
        t.innerText = '';
    }
    document.getElementById('event-modal').classList.remove('hidden');
}

function evTick() {
    evTimeLeft--;
    const t = document.getElementById('ev-timer');
    if (t) t.innerText = 'Samay: ' + Math.max(0, evTimeLeft) + ' second';
    if (evTimeLeft <= 0) expireEvent();
}

function endEvent(text) {
    if (evTimerId) { clearInterval(evTimerId); evTimerId = null; }
    document.getElementById('event-modal').classList.add('hidden');
    gameState.eventPending = false;
    gameState.curEvent = null;
    if (text) {
        setHeadline(text);
        showInfoBanner(text);
    }
    updateStatusPanel();
    finishRound();
}

function expireEvent() {
    const ev = gameState.curEvent;
    if (!ev) return;
    endEvent(ev.onExpire ? ev.onExpire() : '');
}

function chooseEvent(i) {
    const ev = gameState.curEvent;
    if (!ev || !ev.choices[i]) return;
    const c = ev.choices[i];
    if (!evAfford(c)) return;
    const mult = ev.timer ? (0.5 + 0.5 * Math.max(0, evTimeLeft) / ev.timer) : 1;
    gameState.budget -= c.cost;
    gameState.stamina -= c.stamina;
    if (c.cost) recordSpend('you', { type: 'Event: ' + ev.title, st: null, cost: c.cost }, 'white');
    endEvent(c.run(mult));
}

// ================= STAGE 8: SAVE/LOAD, EXIT POLL, COUNTING DAY, COALITION, REPORT =================

const SAVE_KEY = 'rajniti_save_v1';
const FS_COST = [0, 10, 25, 45];
const FS_LABEL = ['Koi offer nahi', 'Mantri pad (10 Cr)', 'Bada mantralaya (25 Cr)', 'Upmukhyamantri pad + package (45 Cr)'];
let fsState = null;
let fsTimer = null;

// ---- Save / Load ----
function hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
}

function saveGame(silent) {
    try {
        const gs = Object.assign({}, gameState);
        delete gs.curEvent;
        gs.eventPending = false;
        const data = {
            v: 1, gs: gs, rm: resultModel, sr: seatResults, you: selectedYouParty, opp: selectedOppParty,
            ya: youAlliancePartners, oa: oppAlliancePartners,
            mode: document.getElementById('choose-fight-select').value,
            fightAs: document.getElementById('fight-as-select').value
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        return false;
    }
}

function loadGame() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { d = null; }
    if (!d || d.v !== 1 || typeof indiaData === 'undefined') return false;

    selectedYouParty = d.you;
    selectedOppParty = d.opp;
    youAlliancePartners = d.ya;
    oppAlliancePartners = d.oa;
    document.getElementById('choose-fight-select').value = d.mode;
    document.getElementById('fight-as-select').value = d.fightAs;
    gameState = d.gs;
    gameState.eventPending = false;
    applyAiLevel(gameState.aiLevel, gameState.aiStyle);
    resultModel = d.rm;
    seatResults = d.sr;
    assignPhases();

    ['splash-screen', 'main-dashboard', 'become-pm-screen', 'campaign-setup-screen', 'seat-sharing-screen'].forEach(function (id) {
        document.getElementById(id).classList.add('hidden');
    });
    ['results-screen', 'event-modal', 'final-screen', 'wr-modal'].forEach(function (id) {
        const e = document.getElementById(id);
        if (e) e.classList.add('hidden');
    });
    document.getElementById('warroom-screen').classList.remove('hidden');
    document.getElementById('wr-you-logo').innerText = selectedYouParty;
    document.getElementById('wr-opp-logo').innerText = selectedOppParty;

    resetToNationalView();
    updateStatusPanel();
    updateSeatStatusBox();
    if (allLayer) refreshStyles();
    const btn = document.getElementById('wr-round-btn');
    btn.disabled = false;
    if (gameState.phaseEnded) btn.innerText = 'Phase ' + gameState.phase + ' ka natija dekho';
    return true;
}

function uiSaveGame() {
    panelMsg = saveGame() ? { ok: true, good: true, text: 'Game save ho gaya.' } : { ok: false, good: false, text: 'Save nahi ho paya (browser ne roka).' };
    refreshPanel();
}

function uiLoadGame() {
    if (!hasSave()) { panelMsg = { ok: false, good: false, text: 'Koi save kiya hua game nahi mila.' }; refreshPanel(); return; }
    closeGameModal();
    loadGame();
}

function renderSettingsPanel() {
    let h = actionHeader(false);
    const lv = gameState.aiLevel || 'normal';
    h += '<div class="ap-sec"><b>Opponent (AI) ka level</b> - beech game mein bhi badal sakte ho.<br>';
    ['easy', 'normal', 'hard'].forEach(function (l) {
        h += '<button class="ap-btn" style="margin-right:6px;' + (l === lv ? 'background:#16a34a;' : '') + '" onclick="uiSetLevel(\'' + l + '\')">' + l.toUpperCase() + '</button>';
    });
    h += '<br><span class="ap-note">Abhi: ' + lv.toUpperCase() + ' | Opponent ka andaaz: ' + (gameState.aiStyle || 'balanced') + '</span></div>';
    h += '<div class="ap-sec"><b>Game Save / Load</b><br>Har naye phase par game apne aap save hota hai.<br>' +
        '<button class="ap-btn" onclick="uiSaveGame()">Abhi save karo</button> ' +
        '<button class="ap-btn" onclick="uiLoadGame()">Save kiya hua game kholo</button></div>';
    h += '<div class="ap-sec"><b>Achievements</b><br><button class="ap-btn" onclick="openGameModal(\'Achievements\')">Achievements dekho</button></div>';
    h += '<div class="ap-sec"><b>Naya Game</b><br><button class="ap-btn" onclick="location.reload()">Shuru se khelo</button></div>';
    return h;
}

function homeSettings() {
    const old = document.getElementById('home-set'); if (old) { old.remove(); return; }
    const d = document.createElement('div'); d.id = 'home-set';
    d.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(3,8,14,.78);display:flex;align-items:center;justify-content:center;padding:16px';
    const nm = (document.getElementById('display-username') || {}).textContent || '';
    const btn = 'style="display:block;width:100%;margin-top:10px;padding:11px 14px;border-radius:12px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-weight:700;cursor:pointer;text-align:left"';
    d.innerHTML = '<div style="width:min(420px,94vw);background:#0f172a;border:1px solid #38bdf8;border-radius:18px;padding:20px;color:#e2e8f0">' +
        '<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:1.2rem">Settings</b><button onclick="document.getElementById(\'home-set\').remove()" style="background:none;border:0;color:#94a3b8;font-size:1.4rem;cursor:pointer">&times;</button></div>' +
        '<label style="display:block;margin-top:14px;color:#94a3b8;font-size:.85rem">Aapka naam</label>' +
        '<div style="display:flex;gap:8px;margin-top:6px"><input id="home-set-name" value="' + esc(nm) + '" style="flex:1;padding:10px;border-radius:10px;border:1px solid #334155;background:#0b1220;color:#fff"><button onclick="homeSetName()" style="padding:10px 16px;border-radius:10px;border:0;background:#38bdf8;color:#04121a;font-weight:800;cursor:pointer">Save</button></div>' +
        '<button ' + btn + ' onclick="document.getElementById(\'home-set\').remove();hasSave()?(confirm(\'Pichhla save kiya hua game kholein?\')&&loadGame()):alert(\'Koi save kiya hua game nahi mila.\')">&#9654; Pichhla save kiya hua game kholo</button>' +
        '<button ' + btn + ' onclick="homeFullscreen()">&#9974; Full screen on/off</button>' +
        '<button ' + btn + ' onclick="if(confirm(\'Saara save aur career data mit jayega. Pakka?\')){localStorage.clear();location.reload();}">&#128465; Sab save data mitao</button>' +
        '<div style="margin-top:12px;color:#64748b;font-size:.78rem;text-align:center">Rajniti - The Grand Strategy</div></div>';
    d.addEventListener('click', function (e) { if (e.target === d) d.remove(); });
    document.body.appendChild(d);
}
function homeSetName() {
    const v = (document.getElementById('home-set-name') || {}).value || '';
    if (!v.trim()) return;
    try { localStorage.setItem('rajniti_uname', v.trim()); } catch (e) {}
    const el = document.getElementById('display-username'); if (el) el.textContent = v.trim();
    const d = document.getElementById('home-set'); if (d) d.remove();
}
function homeFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
}
window.addEventListener('DOMContentLoaded', function () {
    try { const u = localStorage.getItem('rajniti_uname'); const el = document.getElementById('display-username'); if (u && el) el.textContent = u; } catch (e) {}
    const b = document.getElementById('btn-settings');
    if (!b) return;
    b.addEventListener('click', homeSettings);
});

// ---- Final screen helpers ----
function ensureFinalStyles() {
    if (document.getElementById('fs-style')) return;
    const st = document.createElement('style');
    st.id = 'fs-style';
    st.textContent =
        '.fs-screen{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0b0f19;z-index:500;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;overflow-y:auto;}' +
        '.fs-box{background:#131b2e;border:2px solid #38bdf8;border-radius:12px;padding:22px 30px;width:min(760px,94vw);color:#e2e8f0;text-align:center;}' +
        '.fs-box h1{color:#ff9933;margin-bottom:12px;font-size:1.7rem;}.fs-box h3{color:#38bdf8;margin:10px 0 6px;}' +
        '.fs-row{display:flex;justify-content:space-around;gap:10px;margin:14px 0;}' +
        '.fs-card{flex:1;background:#0f172a;border:1px solid #334155;border-radius:8px;padding:10px;}' +
        '.fs-num{font-size:2.2rem;font-weight:bold;color:#fff;}.fs-note{color:#94a3b8;font-size:0.8rem;margin:6px 0;}' +
        '.fs-bar{height:10px;background:#0d1322;border:1px solid #334155;border-radius:6px;overflow:hidden;margin:10px 0;}.fs-bar div{height:100%;width:0%;background:#38bdf8;}' +
        '.fs-box table{width:100%;border-collapse:collapse;font-size:0.85rem;margin:6px 0;}.fs-box td,.fs-box th{padding:4px 6px;border-bottom:1px solid #1f293d;text-align:left;}' +
        '.fs-grade{font-size:3rem;font-weight:bold;color:#facc15;}.fs-good{color:#86efac;font-weight:bold;}.fs-bad{color:#fca5a5;font-weight:bold;}' +
        '.fs-box select{background:#1e293b;color:#fff;border:1px solid #475569;border-radius:4px;padding:4px;max-width:100%;}';
    document.head.appendChild(st);
}

function fsShow(html) {
    ensureFinalStyles();
    let el = document.getElementById('final-screen');
    if (!el) {
        el = document.createElement('div');
        el.id = 'final-screen';
        document.body.appendChild(el);
    }
    el.className = 'fs-screen';
    el.innerHTML = '<div class="fs-box">' + html + '</div>';
}

function fsBtn(label, fn) {
    return '<button class="next-btn" style="margin-top:12px;" onclick="' + fn + '()">' + label + '</button>';
}

function startFinalFlow() {
    const y = sideTotal('you'), o = sideTotal('opp');
    let all = 0;
    Object.keys(gameState.partyTotals).forEach(function (p) { all += gameState.partyTotals[p]; });
    fsState = { bargained: false, y: y, o: o, x: Math.max(0, all - y - o), total: all, y2: y, o2: o, gov: null };
    fsExitPoll();
}

// 1) Exit poll (andaza, hamesha sahi nahi)
function fsExitPoll() {
    function range(v) {
        const c = v + rnd(-25, 25);
        return Math.max(0, Math.round(c - 15)) + ' se ' + Math.round(c + 15);
    }
    fsShow('<h1>Exit Poll</h1><div class="fs-row">' +
        '<div class="fs-card"><b>' + esc(sideParties('you').join(' + ')) + '</b><div class="fs-num">' + range(fsState.y) + '</div></div>' +
        '<div class="fs-card"><b>' + esc(sideParties('opp').join(' + ')) + '</b><div class="fs-num">' + range(fsState.o) + '</div></div></div>' +
        '<div class="fs-note">Exit poll sirf andaza hote hain, asli natija counting par pata chalega.</div>' + fsBtn('Counting Day shuru karo', 'fsCounting'));
}

// 2) Counting day: seats ek-ek karke khulti hain
function fsCounting() {
    const keys = shuffled(Object.keys(seatResults));
    const total = keys.length;
    const cnt = { you: 0, opp: 0, oth: 0 };
    let pos = 0;
    const per = Math.max(1, Math.ceil(total / 45));
    fsShow('<h1>Counting Day</h1><div class="fs-row">' +
        '<div class="fs-card">Aapka gathbandhan<div class="fs-num" id="fs-cy">0</div></div>' +
        '<div class="fs-card">Opponent gathbandhan<div class="fs-num" id="fs-co">0</div></div>' +
        '<div class="fs-card">Others<div class="fs-num" id="fs-cx">0</div></div></div>' +
        '<div class="fs-bar"><div id="fs-prog"></div></div><div class="fs-note" id="fs-note">Ginti chal rahi hai...</div><div id="fs-next"></div>');
    function step() {
        for (let i = 0; i < per && pos < total; i++, pos++) {
            const side = resultModel.sideOf[seatResults[keys[pos]]];
            cnt[side === 'you' ? 'you' : (side === 'opp' ? 'opp' : 'oth')]++;
        }
        document.getElementById('fs-cy').innerText = cnt.you;
        document.getElementById('fs-co').innerText = cnt.opp;
        document.getElementById('fs-cx').innerText = cnt.oth;
        document.getElementById('fs-prog').style.width = Math.round(pos / total * 100) + '%';
        if (pos >= total) {
            if (fsTimer) { clearInterval(fsTimer); fsTimer = null; }
            document.getElementById('fs-note').innerText = 'Ginti poori hui.';
            document.getElementById('fs-next').innerHTML = fsBtn('Aage', 'fsResult');
        }
    }
    if (fsTimer) clearInterval(fsTimer);
    fsTimer = setInterval(step, 250);
}

// 3) Bahumat ya sauda
function fsResult() {
    if (fsState.y >= MAJORITY) return fsGovt('you');
    if (fsState.o >= MAJORITY) return fsGovt('opp');
    if (fsState.x <= 0) return fsGovt(null);
    fsBargain();
}

function fsBargain() {
    const x = fsState.x;
    const cut1 = Math.floor(x * rnd(0.25, 0.5));
    const cut2 = Math.floor(x * rnd(0.55, 0.8));
    const sizes = [cut1, cut2 - cut1, x - cut2].filter(function (n) { return n > 0; });
    const names = ['Kshetriya Dal A', 'Kshetriya Dal B', 'Nirdaliya Samooh'];
    fsState.blocs = sizes.map(function (n, i) { return { name: names[i], n: n, ask: 1 + Math.floor(Math.random() * 3) }; });
    const avail = gameState.budget + gameState.blackFund;
    let h = '<h1>Kisi ke paas bahumat nahi</h1><div class="fs-note">Aapka gathbandhan ' + fsState.y + ', opponent ' + fsState.o +
        ', bahumat ke liye ' + MAJORITY + ' chahiye. Chhote dalon ka samarthan lena hoga.</div>' +
        '<div class="fs-note">Aapke paas sauda ke liye: <b>' + avail + ' Cr</b></div><table><tr><th>Samooh</th><th>Seats</th><th>Kam se kam</th><th>Aapka offer</th></tr>';
    fsState.blocs.forEach(function (b, i) {
        h += '<tr><td>' + b.name + '</td><td>' + b.n + '</td><td>Level ' + b.ask + '</td><td><select id="fs-off-' + i + '">';
        for (let l = 0; l < 4; l++) h += '<option value="' + l + '">' + FS_LABEL[l] + '</option>';
        h += '</select></td></tr>';
    });
    h += '</table><div class="fs-note" id="fs-msg"></div>' + fsBtn('Sauda karo', 'fsDeal');
    fsShow(h);
}

function fsDeal() {
    const blocs = fsState.blocs;
    const offY = blocs.map(function (b, i) { return parseInt(document.getElementById('fs-off-' + i).value, 10) || 0; });
    let cost = 0;
    offY.forEach(function (l) { cost += FS_COST[l]; });
    const avail = gameState.budget + gameState.blackFund;
    if (cost > avail) {
        document.getElementById('fs-msg').innerText = 'Itna paisa nahi hai (' + cost + ' Cr chahiye, ' + avail + ' Cr hai).';
        return;
    }
    fsState.bargained = true;
    let fromWhite = Math.min(cost, gameState.budget);
    gameState.budget -= fromWhite;
    gameState.blackFund -= (cost - fromWhite);
    if (cost) recordSpend('you', { type: 'Coalition Sauda', st: null, cost: cost }, 'white');

    // AI ke offer
    let aAvail = gameState.opp.budget + gameState.opp.blackFund;
    const offO = [0, 0, 0];
    blocs.map(function (b, i) { return i; }).sort(function (a, b) { return blocs[b].n - blocs[a].n; }).forEach(function (i) {
        let lvl = Math.min(3, blocs[i].ask + (Math.random() < 0.4 ? 1 : 0));
        while (lvl > 0 && FS_COST[lvl] > aAvail) lvl--;
        offO[i] = lvl;
        aAvail -= FS_COST[lvl];
    });

    const lead = fsState.y - fsState.o;
    const hw = gameState.hawa || 0;
    let y2 = fsState.y, o2 = fsState.o;
    let rows = '';
    blocs.forEach(function (b, i) {
        const sy = offY[i] + (lead > 0 ? 0.6 : 0) + Math.max(0, hw) / 100 + rnd(0, 0.5) - (offY[i] < b.ask ? 1.2 : 0);
        const so = offO[i] + (lead < 0 ? 0.6 : 0) + Math.max(0, -hw) / 100 + rnd(0, 0.5) - (offO[i] < b.ask ? 1.2 : 0);
        let who = 'alag raha';
        if (Math.max(sy, so) > 0.5 && (offY[i] > 0 || offO[i] > 0)) {
            if (sy >= so) { y2 += b.n; who = 'aapke saath gaya'; } else { o2 += b.n; who = 'opponent ke saath gaya'; }
        }
        rows += '<tr><td>' + b.name + '</td><td>' + b.n + '</td><td>' + who + '</td></tr>';
    });
    fsState.y2 = y2;
    fsState.o2 = o2;
    let gov = null;
    if (y2 >= MAJORITY) gov = 'you'; else if (o2 >= MAJORITY) gov = 'opp';
    fsShow('<h1>Sauda ka natija</h1><table><tr><th>Samooh</th><th>Seats</th><th>Faisla</th></tr>' + rows + '</table>' +
        '<div class="fs-row"><div class="fs-card">Aapka gathbandhan<div class="fs-num">' + y2 + '</div></div>' +
        '<div class="fs-card">Opponent gathbandhan<div class="fs-num">' + o2 + '</div></div></div>' +
        fsBtn('Aage', gov === 'you' ? 'fsGovtYou' : (gov === 'opp' ? 'fsGovtOpp' : 'fsGovtNone')));
}

function fsGovtYou() { fsGovt('you'); }
function fsGovtOpp() { fsGovt('opp'); }
function fsGovtNone() { fsGovt(null); }

function fsGovt(side) {
    fsState.gov = side;
    const names = { you: sideParties('you').join(' + '), opp: sideParties('opp').join(' + ') };
    let h;
    if (side) {
        h = '<h1>Sarkar ban gayi!</h1><div class="' + (side === 'you' ? 'fs-good' : 'fs-bad') + '" style="font-size:1.2rem;">' + esc(names[side]) +
            ' ki sarkar banegi (' + (side === 'you' ? fsState.y2 : fsState.o2) + ' seats).</div>';
    } else {
        h = '<h1>Trishanku Sansad</h1><div class="fs-bad" style="font-size:1.1rem;">Kisi ke paas bahumat nahi. Rashtrapati shasan aur naye chunav ke aasar.</div>';
    }
    fsShow(h + fsBtn('Result Report dekho', 'fsReport'));
}

// 4) Result report
function fsReport() {
    const g = fsState;
    const per = {};
    Object.keys(seatResults).forEach(function (k) {
        const st = k.split('|')[0];
        if (!per[st]) per[st] = { n: 0, you: 0 };
        per[st].n++;
        if (resultModel.sideOf[seatResults[k]] === 'you') per[st].you++;
    });
    let list = Object.keys(per).filter(function (s) { return per[s].n >= 3; });
    if (list.length < 6) list = Object.keys(per);
    list.sort(function (a, b) { return per[b].you / per[b].n - per[a].you / per[a].n; });
    const fmt = function (st) { return esc(st) + ' (' + per[st].you + '/' + per[st].n + ')'; };
    const best = list.slice(0, 3).map(fmt).join(', ');
    const worst = list.slice(-3).reverse().map(fmt).join(', ');

    let grade = 'C';
    if (g.gov === 'you') grade = g.y2 >= 350 ? 'S' : (g.y2 >= 310 ? 'A' : 'B');
    else if (g.gov === 'opp') grade = g.y >= 200 ? 'C' : 'D';

    const L = gameState.ledger.you;
    const types = Object.keys(L.byType).sort(function (a, b) { return L.byType[b] - L.byType[a]; }).slice(0, 3)
        .map(function (t) { return esc(t) + ' ' + L.byType[t] + ' Cr'; }).join(', ') || '-';
    const me = sideName('you');
    const raids = gameState.aiLog.filter(function (x) { return x.side === 'sys' && x.text.indexOf(me) !== -1; }).length;
    const voteShare = g.total ? Math.round(g.y / g.total * 100) : 0;

    const wins80 = list.filter(function (st) { return per[st].n >= 3 && per[st].you / per[st].n >= 0.8; }).length;
    const spend = function (re) { let t = 0; Object.keys(L.byType).forEach(function (k) { if (re.test(k)) t += L.byType[k]; }); return t; };
    const ctx = { gov: g.gov, grade: grade, bargained: g.bargained, black: L.black, raids: raids, wins80: wins80,
        rally: spend(/Rally/), social: spend(/Social/), court: spend(/Court/), level: gameState.aiLevel, hawa: gameState.hawa || 0 };
    const fresh = checkAchievements(ctx);
    const title = TITLES[grade];
    const freshHtml = fresh.length ? fresh.map(function (a) { return esc(a.name); }).join(', ') : 'Is baar koi naya nahi';
    fsShow('<h1>Result Report</h1><div class="fs-grade">' + grade + '</div><div class="fs-good">Upadhi: ' + title + '</div>' +
        '<div class="fs-row"><div class="fs-card">Aapka gathbandhan<div class="fs-num">' + g.y + '</div></div>' +
        '<div class="fs-card">Opponent<div class="fs-num">' + g.o + '</div></div>' +
        '<div class="fs-card">Others<div class="fs-num">' + g.x + '</div></div></div>' +
        '<table><tr><td>Seat hissedari</td><td>' + voteShare + '%</td></tr>' +
        '<tr><td>Sabse achhe state</td><td>' + best + '</td></tr>' +
        '<tr><td>Sabse kamzor state</td><td>' + worst + '</td></tr>' +
        '<tr><td>Kul kharch</td><td>' + L.total + ' Cr (black ' + L.black + ' Cr)</td></tr>' +
        '<tr><td>Sabse zyada kharch</td><td>' + types + '</td></tr>' +
        '<tr><td>Chhape / notice jo aap par pade</td><td>' + raids + '</td></tr>' +
        '<tr><td>Opponent ka level</td><td>' + String(gameState.aiLevel || 'normal').toUpperCase() + '</td></tr>' +
        '<tr><td>Naye achievements</td><td>' + freshHtml + '</td></tr></table>' +
        fsBtn('Naya Game', 'location.reload'));
}

// ================= STAGE 9: AI LEVELS, ACHIEVEMENTS, TITLES =================

const AI_LEVELS = {
    easy: { noise: 0.35, spend: 0.6, maxActions: 4, riskCap: 30, bonusBudget: 0, bonusStamina: 0 },
    normal: { noise: 0.15, spend: 1.1, maxActions: 8, riskCap: 45, bonusBudget: 0, bonusStamina: 0 },
    hard: { noise: 0.05, spend: 1.5, maxActions: 10, riskCap: 60, bonusBudget: 30, bonusStamina: 25 }
};
const AI_STYLES = ['balanced', 'rally', 'media'];

function readPrefLevel() {
    try { return localStorage.getItem('rajniti_ai_level') || 'normal'; } catch (e) { return 'normal'; }
}

function applyAiLevel(level, style, fresh) {
    if (!AI_LEVELS[level]) level = 'normal';
    Object.assign(AI_CONFIG, AI_LEVELS[level]);
    AI_CONFIG.style = style || AI_STYLES[Math.floor(Math.random() * AI_STYLES.length)];
    gameState.aiLevel = level;
    gameState.aiStyle = AI_CONFIG.style;
    if (fresh && gameState.opp) {
        gameState.opp.budget += AI_CONFIG.bonusBudget;
        gameState.opp.stamina += AI_CONFIG.bonusStamina;
    }
}

function styleWeight(type) {
    if (AI_CONFIG.style === 'rally' && /Rally/.test(type)) return 1.3;
    if (AI_CONFIG.style === 'media' && /Social|Debate|Narrative/.test(type)) return 1.3;
    return 1;
}

function uiSetLevel(l) {
    applyAiLevel(l, AI_CONFIG.style);
    try { localStorage.setItem('rajniti_ai_level', l); } catch (e) {}
    refreshPanel();
}

const TITLES = { S: 'Chanakya', A: 'Rajneeti ke Mahir', B: 'Sarkar Pramukh', C: 'Vipaksh Netaa', D: 'Sangharsh Jaari' };

const ACH = [
    { id: 'first', name: 'Pehli Jeet', desc: 'Sarkar banao.', test: function (c) { return c.gov === 'you'; } },
    { id: 'chanakya', name: 'Chanakya', desc: 'S grade pao.', test: function (c) { return c.grade === 'S'; } },
    { id: 'kingmaker', name: 'Kingmaker', desc: 'Sauda karke sarkar banao.', test: function (c) { return c.gov === 'you' && c.bargained; } },
    { id: 'clean', name: 'Saaf Chhavi', desc: 'Bina black fund ke sarkar banao.', test: function (c) { return c.gov === 'you' && c.black === 0; } },
    { id: 'lucky', name: 'Bach Gaya', desc: '60 Cr black fund kharch karo par ek bhi chhapa na pade.', test: function (c) { return c.black >= 60 && c.raids === 0; } },
    { id: 'rally', name: 'Rally Samrat', desc: 'Rally par 150 Cr kharch karo.', test: function (c) { return c.rally >= 150; } },
    { id: 'social', name: 'Social Media Raja', desc: 'Social media par 80 Cr kharch karo.', test: function (c) { return c.social >= 80; } },
    { id: 'court', name: 'Court ka Yodha', desc: 'Kam se kam 3 court case daalo.', test: function (c) { return c.court >= 24; } },
    { id: 'dharti', name: 'Dharti Pakad', desc: '5 states mein 80% seats jeeto.', test: function (c) { return c.wins80 >= 5; } },
    { id: 'hard', name: 'Mushkil Jeet', desc: 'HARD level par sarkar banao.', test: function (c) { return c.gov === 'you' && c.level === 'hard'; } },
    { id: 'hawa', name: 'Hawa Ka Rukh', desc: 'Hawa meter aakhir mein +40 se upar rakho.', test: function (c) { return c.hawa >= 40; } }
];

function loadAch() {
    try { return JSON.parse(localStorage.getItem('rajniti_ach_v1')) || {}; } catch (e) { return {}; }
}

function checkAchievements(ctx) {
    const have = loadAch();
    const fresh = [];
    ACH.forEach(function (a) {
        if (!have[a.id] && a.test(ctx)) {
            have[a.id] = { level: ctx.level };
            fresh.push(a);
        }
    });
    try { localStorage.setItem('rajniti_ach_v1', JSON.stringify(have)); } catch (e) {}
    return fresh;
}

function renderAchPanel() {
    const have = loadAch();
    let n = 0;
    ACH.forEach(function (a) { if (have[a.id]) n++; });
    let h = '<div class="ap-head">Achievements: <b>' + n + ' / ' + ACH.length + '</b></div><table class="ap-table"><tr><th>Naam</th><th>Kaise milega</th><th></th></tr>';
    ACH.forEach(function (a) {
        h += '<tr><td>' + esc(a.name) + '</td><td>' + esc(a.desc) + '</td><td>' + (have[a.id] ? 'mil gaya' : 'baaki') + '</td></tr>';
    });
    return h + '</table>';
}

// ================= STAGE 10: START SCREEN, AUTOSAVE, PRESENCE, CHEAPER ACTIONS =================

// Seat par taqat ab mehnat se banti hai: kuch na karo to taqat lagbhag zero
function presenceOf(b) {
    if (b <= 0) return 0.01;
    return 2.5 * (1 - Math.exp(-b / 0.18));
}

function readSelectedLevel() {
    const el = document.getElementById('ai-level-select');
    if (el && AI_LEVELS[el.value]) return el.value;
    return readPrefLevel();
}

// Har round ke baad thoda aaram (stamina wapas)
function recoverStamina() {
    gameState.stamina = Math.min(100, gameState.stamina + 6);
    gameState.opp.stamina = Math.min(100 + (AI_CONFIG.bonusStamina || 0), gameState.opp.stamina + 6);
    updateStatusPanel();
}

// Round aur phase ke baad apne aap save (achanak band ho to bhi game bachega)
const _finishRoundOrig = finishRound;
finishRound = function () {
    _finishRoundOrig();
    recoverStamina();
    saveGame(true);
};
const _endPhaseOrig = endPhase;
endPhase = function () {
    _endPhaseOrig();
    saveGame(true);
};

// 1) Hindi mein RAJNITI likhte hue
function typeSplashTitle() {
    const t = document.querySelector('.splash-title');
    if (!t || !t.style) return;
    const parts = [String.fromCharCode(2352, 2366), String.fromCharCode(2332), String.fromCharCode(2344, 2368), String.fromCharCode(2340, 2367)];
    t.textContent = '';
    let i = 0, txt = '';
    const iv = setInterval(function () {
        txt += parts[i++];
        t.textContent = txt + '|';
        if (i >= parts.length) {
            clearInterval(iv);
            t.textContent = txt;
        }
    }, 380);
}

// 22) Game shuru hone se pehle opponent ka level
function injectLevelSelect() {
    const sec = document.querySelector('.options-section');
    if (!sec || document.querySelector('#ai-level-select')) return;
    const row = document.createElement('div');
    row.className = 'option-row';
    row.innerHTML = '<span class="option-label">Opponent Level :</span><select id="ai-level-select" class="game-select">' +
        '<option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option></select>';
    sec.appendChild(row);
    const sel = document.getElementById('ai-level-select');
    if (!sel) return;
    sel.value = readPrefLevel();
    sel.addEventListener('change', function () {
        try { localStorage.setItem('rajniti_ai_level', sel.value); } catch (e) {}
    });
}

// 24) Shuru mein hi "pichhla game jaari rakho"
function injectContinueButton() {
    if (!hasSave()) return;
    const box = document.querySelector('#become-pm-screen .pm-container');
    if (!box || document.querySelector('#continue-btn')) return;
    let label = 'Pichhla game jaari rakho';
    try {
        const d = JSON.parse(localStorage.getItem(SAVE_KEY));
        label += ' (Phase ' + d.gs.phase + ', Round ' + d.gs.round + ')';
    } catch (e) {}
    const row = document.createElement('div');
    row.className = 'continue-row';
    row.innerHTML = '<button id="continue-btn" class="next-btn">' + label + '</button>';
    box.insertBefore(row, box.firstChild);
    document.getElementById('continue-btn').onclick = function () { if (!loadGame()) alert('Save khul nahi paya.'); };
}

// 10) News ticker icon hatao
function removeNewsTicker() {
    if (!document.querySelectorAll) return;
    const btns = document.querySelectorAll('.wr-side-icon');
    for (let i = 0; i < btns.length; i++) {
        const b = btns[i];
        if (b.getAttribute && /News Ticker/.test(b.getAttribute('onclick') || '') && b.parentNode) b.parentNode.removeChild(b);
    }
}

typeSplashTitle();
injectLevelSelect();
injectContinueButton();
removeNewsTicker();

// ================= STAGE 11: LEADS, STATUS BOXES, HEAT MAP, NEWS =================

let leadNoise = {};
let heatMode = 'off';
let heatSet = null;

// Ground report ke hisaab se seat par kaun aage hai (thoda andaza, har round naya)
function leadFor(key) {
    const s = resultModel.seats[key];
    if (!leadNoise[key]) leadNoise[key] = { a: rnd(0.88, 1.12), b: rnd(0.88, 1.12), c: rnd(0.88, 1.12) };
    const n = leadNoise[key];
    const a = s.wYou * n.a * presenceOf(getBoost('you', key, s.st) + hawaFor('you')) * disqMult('you', key);
    const b = s.wOpp * n.b * presenceOf(getBoost('opp', key, s.st) + hawaFor('opp')) * disqMult('opp', key);
    let c = s.wOth * n.c;
    let a2 = a, b2 = b;
    if (typeof vsAdjust === 'function') { const adj = vsAdjust(key, s.st, a, b, c); a2 = adj[0]; b2 = adj[1]; c = adj[2]; }
    const tot = a2 + b2 + c;
    const arr = [['you', a2], ['opp', b2], ['oth', c]].sort(function (x, y) { return y[1] - x[1]; });
    return { side: arr[0][0], margin: (arr[0][1] - arr[1][1]) / tot * 100, st: s.st, pc: s.pc, key: key };
}

function computeLeads() {
    const out = { you: 0, opp: 0, oth: 0, seats: [], byState: {} };
    if (!resultModel) return out;
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase !== gameState.phase || seatResults[k]) return;
        const L = leadFor(k);
        out[L.side]++;
        out.seats.push(L);
        if (!out.byState[s.st]) out.byState[s.st] = { you: 0, opp: 0, oth: 0, n: 0 };
        out.byState[s.st][L.side]++;
        out.byState[s.st].n++;
    });
    return out;
}

function leadName(side) {
    return side === 'you' ? sideName('you') : (side === 'opp' ? sideName('opp') : 'Others');
}

function renderLeadBoxes() {
    const g = gameState;
    if (!resultModel || !g.partyTotals) return;
    const L = computeLeads();
    g.leads = L;
    document.getElementById('wr-you-seats').innerText = 'Seats: ' + (g.seats.you + L.you);
    document.getElementById('wr-opp-seats').innerText = 'Seats: ' + (g.seats.opp + L.opp);

    // Seat Status: jeet + aage + kaante ki takkar
    const parties = Object.keys(g.partyTotals).sort(function (a, b) { return g.partyTotals[b] - g.partyTotals[a]; });
    let h = '&bull; Jeet: ' + (parties.length ? parties.map(function (p) { return esc(p) + ' ' + g.partyTotals[p]; }).join(', ') : 'abhi koi nahi');
    if (L.seats.length) {
        h += '<br>&bull; Aage (Phase ' + g.phase + '): ' + esc(sideName('you')) + ' ' + L.you + ', ' + esc(sideName('opp')) + ' ' + L.opp + ', Others ' + L.oth;
        const close = L.seats.filter(function (x) { return x.margin < 8; }).sort(function (a, b) { return a.margin - b.margin; }).slice(0, 3);
        if (close.length) {
            h += '<br>&bull; Kaante ki takkar: ' + close.map(function (x) { return esc(x.pc) + ' (' + esc(leadName(x.side)) + ' aage ' + x.margin.toFixed(1) + '%)'; }).join(', ');
        }
    }
    h += '<br>&bull; Sarkar ke liye ' + MAJORITY + ' seats chahiye';
    document.getElementById('wr-seat-status-text').innerHTML = h;

    // State Status: har state mein kaun kitni seat par aage
    const info = phaseInfo[g.phase];
    let t = '&bull; Phase ' + g.phase + ' / ' + TOTAL_PHASES + (info && info.count ? ': ' + info.count + ' seats' : '');
    const names = Object.keys(L.byState).sort(function (a, b) { return L.byState[b].n - L.byState[a].n || (a < b ? -1 : 1); });
    if (!names.length) t += '<br>&bull; Is phase ke saare natije aa gaye.';
    names.forEach(function (st) {
        const b = L.byState[st];
        t += '<br>&bull; ' + esc(st) + ' (' + b.n + '): ' + esc(sideName('you')) + ' ' + b.you + ' | ' + esc(sideName('opp')) + ' ' + b.opp + (b.oth ? ' | Oth ' + b.oth : '');
    });
    document.getElementById('wr-state-status-text').innerHTML = t;
}

// TV jaisa round ke baad: jeet + aage
function showLeadsBanner() {
    const g = gameState, L = g.leads;
    if (!L || (!L.seats.length && !g.seats.you && !g.seats.opp)) return;
    showInfoBanner(sideName('you') + ' ' + (g.seats.you + L.you) + ' (jeet ' + g.seats.you + ', aage ' + L.you + ')' +
        '  |  ' + sideName('opp') + ' ' + (g.seats.opp + L.opp) + ' (jeet ' + g.seats.opp + ', aage ' + L.opp + ')  |  Others aage ' + L.oth);
}

// ---- Media Headline: khabrein aur hum par case ----
function pushNews(t) {
    if (!gameState.news) gameState.news = [];
    if (gameState.news[0] === t) return;
    gameState.news.unshift(t);
    if (gameState.news.length > 6) gameState.news.pop();
}

function renderHeadlineBox() {
    const p = document.querySelector('#wr-media-headline p');
    const list = (gameState.news || []).slice(0, 4);
    if (!p || !list.length) return;
    p.innerHTML = list.map(function (x) { return '&bull; ' + esc(x); }).join('<br>');
}

setHeadline = function (t) {
    pushNews(t);
    renderHeadlineBox();
};

const _aiTakeTurnOrig = aiTakeTurn;
aiTakeTurn = function (side) {
    const n0 = gameState.aiLog.length;
    const r = _aiTakeTurnOrig(side);
    if (side === 'opp') {
        gameState.aiLog.slice(n0).forEach(function (x) {
            if (/Court|EC /.test(x.text)) pushNews('Case: ' + x.text);
        });
        renderHeadlineBox();
    }
    return r;
};

// ---- Heat map: aage kaun / sirf kaante ki seats ----
function heatColorOf(side) {
    if (side === 'you') return partyColors[selectedYouParty] || '#38bdf8';
    if (side === 'opp') return partyColors[selectedOppParty] || '#f97316';
    return '#9ca3af';
}

function applyHeat() {
    heatSet = null;
    if (heatMode !== 'off') {
        const L = computeLeads();
        heatSet = {};
        L.seats.forEach(function (x) {
            if (heatMode === 'lead' || x.margin < 8) heatSet[x.key] = heatColorOf(x.side);
        });
    }
    if (allLayer) refreshStyles();
}

const _styleForOrig = styleFor;
styleFor = function (layer, hover) {
    const base = _styleForOrig(layer, hover);
    if (heatMode === 'off' || !heatSet) return base;
    const key = seatKeyOf(layer.feature.properties);
    if (heatSet[key]) {
        const close = heatMode === 'close';
        return Object.assign({}, base, { fillColor: heatSet[key], fillOpacity: 1, color: close ? '#facc15' : base.color, weight: close ? 2 : base.weight });
    }
    if (heatMode === 'close') return Object.assign({}, base, { fillColor: '#0f172a', fillOpacity: 0.4 });
    return base;
};

function uiHeat(m) {
    heatMode = m;
    applyHeat();
    refreshPanel();
}

function renderHeatPanel() {
    const L = computeLeads();
    let h = actionHeader(false);
    h += '<div class="ap-sec"><b>Heat Map</b> - is phase ki seats mein kaun aage hai.<br>' +
        '<button class="ap-btn" onclick="uiHeat(\'lead\')">Aage kaun (rang)</button> ' +
        '<button class="ap-btn" onclick="uiHeat(\'close\')">Sirf kaante ki seats</button> ' +
        '<button class="ap-btn" onclick="uiHeat(\'off\')">Map normal karo</button><br>' +
        '<span class="ap-note">Abhi: ' + heatMode + '. Panel band karke map dekho. Rang: ' + esc(sideName('you')) + ', ' + esc(sideName('opp')) + ', Others (grey).</span></div>';
    const close = L.seats.filter(function (x) { return x.margin < 8; }).sort(function (a, b) { return a.margin - b.margin; }).slice(0, 15);
    if (!close.length) return h + '<div class="ap-note">Abhi koi kaante ki seat nahi.</div>';
    h += '<table class="ap-table"><tr><th>Kaante ki seat</th><th>State</th><th>Aage</th><th>Antar</th></tr>';
    close.forEach(function (x) {
        h += '<tr><td>' + esc(x.pc) + '</td><td>' + esc(x.st) + '</td><td>' + esc(leadName(x.side)) + '</td><td>' + x.margin.toFixed(1) + '%</td></tr>';
    });
    return h + '</table>';
}

// Opinion Poll ka alag icon (POL)
function injectPollButton() {
    return; // Stage 35: Opinion Poll icon hata diya
    if (document.querySelector('[data-poll]')) return;
    const bar = document.querySelector('.wr-left-sidebar');
    if (!bar || !bar.insertBefore) return;
    const btn = document.createElement('button');
    btn.className = 'wr-side-icon';
    btn.setAttribute('data-poll', '1');
    btn.innerText = 'POL';
    btn.onclick = function () { openGameModal('Opinion Poll'); };
    const kids = bar.children;
    bar.insertBefore(btn, kids && kids.length > 2 ? kids[2] : null);
}
injectPollButton();

// ---- Hooks: round, phase, game shuru ----
const _finishRoundS11 = finishRound;
finishRound = function () {
    _finishRoundS11();
    leadNoise = {};
    renderLeadBoxes();
    showLeadsBanner();
    if (heatMode !== 'off') applyHeat();
};

const _startNextPhaseS11 = startNextPhase;
startNextPhase = function () {
    _startNextPhaseS11();
    leadNoise = {};
    renderLeadBoxes();
    if (heatMode !== 'off') applyHeat();
};

const _initGameS11 = initGame;
initGame = function () {
    heatMode = 'off';
    heatSet = null;
    leadNoise = {};
    _initGameS11();
    gameState.news = [];
};

// ================= STAGE 12: THEME, ICONS, ANIMATIONS =================

// Apni image files lagani ho to true karo aur images/icons/bnk.png jaisi files rakho
const USE_ICON_IMAGES = false;

function svgIcon(inner) {
    return '<svg viewBox="0 0 24 24">' + inner + '</svg>';
}

const ICON_SVG = {
    BNK: svgIcon('<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>'),
    MAP: svgIcon('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>'),
    POL: svgIcon('<path d="M5 20V10M12 20V4M19 20v-7M3 20h18"/>'),
    STM: svgIcon('<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>'),
    MED: svgIcon('<path d="M3 10v4l11 4V6zM14 8l6-3v14l-6-3M6 14l1 6h3l-1-5"/>'),
    ITC: svgIcon('<path d="M4 5h16v10H9l-5 4zM8 9h8M8 12h5"/>'),
    MAN: svgIcon('<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>'),
    POA: svgIcon('<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 2-5 5-5s5 2 5 5M14 20c0-2 1-4 3-4s4 2 4 4"/>'),
    VIP: svgIcon('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
    WHT: svgIcon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>'),
    BLK: svgIcon('<path d="M9 3h6l-1 3h-4zM8 8c-3 3-4 7-3 10 1 3 4 3 7 3s6 0 7-3c1-3 0-7-3-10z"/>'),
    OPP: svgIcon('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    VOT: svgIcon('<rect x="4" y="11" width="16" height="9"/><path d="M9 11V6h6v5M10 15h4"/>'),
    NAR: svgIcon('<path d="M4 12a8 8 0 0 1 16 0M7 12a5 5 0 0 1 10 0M12 14v6"/><circle cx="12" cy="12" r="1.5"/>'),
    CRT: svgIcon('<path d="M12 3v16M5 8h14M5 8l-3 7h6zM19 8l-3 7h6zM8 21h8"/>'),
    MCC: svgIcon('<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6zM8 12l3 3 5-6"/>'),
    GUR: svgIcon('<circle cx="12" cy="8" r="3"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7M8 4c1-2 7-2 8 0"/>'),
    SPY: svgIcon('<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>'),
    DEB: svgIcon('<path d="M3 5h11v7H8l-3 3v-3H3zM12 12h9v7h-2v3l-3-3h-4z"/>'),
    KRY: svgIcon('<path d="M12 3l10 18H2zM12 10v5M12 18v1"/>'),
    DMS: svgIcon('<path d="M4 8h14l-3-3M20 16H6l3 3"/>'),
    HWA: svgIcon('<path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h8"/>')
};

const ICON_TITLE = {
    BNK: 'Aapka Bank', MAP: 'Heat Map', POL: 'Opinion Poll', STM: 'Stamina', MED: 'Rally', ITC: 'IT Cell / Social',
    MAN: 'Manifesto', POA: 'Candidate / Poaching', VIP: 'VIP / Star Campaigner', WHT: 'White Fund', BLK: 'Black Fund',
    OPP: 'Opponent Bank', VOT: 'Phase Voting', NAR: 'Narrative', CRT: 'Court Case', MCC: 'EC / MCC',
    GUR: 'Local Guru / Booth', SPY: 'Spy', DEB: 'Debate', KRY: 'Crisis', DMS: 'DM / SP', HWA: 'Hawa Meter'
};

function iconFallback(img) {
    const code = img.getAttribute('data-ic');
    const span = document.createElement('span');
    span.innerHTML = ICON_SVG[code] || '';
    if (img.parentNode) img.parentNode.replaceChild(span, img);
}

function iconHtml(code) {
    if (USE_ICON_IMAGES) {
        return '<img class="ic-img" data-ic="' + code + '" src="images/icons/' + code.toLowerCase() + '.png" onerror="iconFallback(this)">';
    }
    return ICON_SVG[code] || '';
}

// Sidebar ke text wale button ko icon + chhota naam do
function decorateSidebarIcons() {
    if (!document.querySelectorAll) return;
    const btns = document.querySelectorAll('.wr-side-icon');
    for (let i = 0; i < btns.length; i++) {
        const b = btns[i];
        if (b.getAttribute('data-ic')) continue;
        const code = String(b.textContent || '').trim();
        if (!ICON_SVG[code]) continue;
        b.setAttribute('data-ic', code);
        b.setAttribute('title', ICON_TITLE[code] || code);
        b.innerHTML = iconHtml(code) + '<span class="ic-t">' + code + '</span>';
    }
}

function ensureThemeStyles() {
    if (document.getElementById('theme-style')) return;
    const st = document.createElement('style');
    st.id = 'theme-style';
    st.textContent =
        'body,html{font-family:"Segoe UI","Nirmala UI",Tahoma,sans-serif;}' +
        '.screen{background:radial-gradient(ellipse at 50% 0%,#14213d 0%,#0b0f19 62%);}' +
        '.warroom-screen{background:radial-gradient(ellipse at 50% 0%,#14213d 0%,#0b0f19 66%);}' +
        '@keyframes scrIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}' +
        '@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}' +
        '@keyframes popIn{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:none;}}' +
        '@keyframes toastIn{from{opacity:0;margin-top:-14px;}to{opacity:1;margin-top:0;}}' +
        '@keyframes pulseBtn{0%,100%{box-shadow:0 0 8px rgba(59,130,246,0.35);}50%{box-shadow:0 0 20px rgba(59,130,246,0.8);}}' +
        '@keyframes glowRing{0%,100%{box-shadow:0 0 16px rgba(255,153,51,0.35);}50%{box-shadow:0 0 36px rgba(255,153,51,0.8);}}' +
        '@keyframes numPop{from{transform:scale(0.6);opacity:0;}to{transform:none;opacity:1;}}' +
        '.screen:not(.hidden){animation:scrIn 0.45s ease;}' +
        '.warroom-screen:not(.hidden),.results-screen:not(.hidden),.fs-screen{animation:fadeIn 0.5s ease;}' +
        '.modal:not(.hidden) .modal-content{animation:popIn 0.22s ease;}' +
        '.modal-content{box-shadow:0 10px 40px rgba(0,0,0,0.6);border-radius:12px;}' +
        '.ap-toast{animation:toastIn 0.35s ease;}' +
        '.fs-num{animation:numPop 0.5s ease;}' +
        '.splash-title{font-size:3.4rem;background:linear-gradient(90deg,#ff9933,#ffffff,#22c55e);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 12px rgba(255,153,51,0.35));}' +
        '#netaji-video{animation:glowRing 3s ease-in-out infinite;}' +
        '.dash-card{background:linear-gradient(160deg,#1e293b,#16213a);transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s;}' +
        '.dash-card:hover{transform:translateY(-3px);box-shadow:0 0 18px rgba(56,189,248,0.35);border-color:#38bdf8;}' +
        '.big-card h2{letter-spacing:2px;text-shadow:0 0 12px rgba(255,153,51,0.35);}' +
        '.pm-container{background:linear-gradient(160deg,#16213a,#101828);border-color:#26324a;box-shadow:0 12px 40px rgba(0,0,0,0.6);}' +
        '.party-select-box,.campaign-box,.party-slot-card{transition:transform 0.2s,border-color 0.2s;}' +
        '.party-select-box:hover{border-color:#ff9933;transform:scale(1.02);}' +
        '.continue-row{margin-bottom:16px;}.continue-row .next-btn{width:100%;}' +
        '.house-btn,.next-btn,.back-btn,.close-modal-btn,.wr-round-btn,.ap-btn{transition:transform 0.15s,filter 0.15s,box-shadow 0.15s;}' +
        '.house-btn:hover,.next-btn:hover,.back-btn:hover,.close-modal-btn:hover,.wr-round-btn:hover,.ap-btn:hover{transform:translateY(-2px);filter:brightness(1.12);box-shadow:0 4px 14px rgba(0,0,0,0.45);}' +
        '.house-btn{min-width:190px;height:44px;}' +
        '.next-btn,.back-btn{min-width:120px;height:44px;border-radius:8px;box-shadow:0 3px 10px rgba(0,0,0,0.35);}' +
        '.close-modal-btn{min-width:110px;height:38px;}' +
        '.ap-btn{min-height:34px;border-radius:6px;}' +
        '.wr-top-bar{background:linear-gradient(90deg,#131b2e,#17233f);}' +
        '.wr-top-bar,.wr-sidebar,.wr-map-area,.wr-status-panel,.wr-box{box-shadow:0 2px 12px rgba(0,0,0,0.35);border-color:#26324a;}' +
        '.wr-party-badge{box-shadow:0 0 10px rgba(59,130,246,0.25);}' +
        '.wr-round-btn{height:38px;min-width:200px;background:linear-gradient(180deg,#3b82f6,#1d4ed8);animation:pulseBtn 2.4s infinite;}' +
        '.wr-round-btn:disabled{animation:none;}' +
        '.wr-side-icon{width:52px;height:46px;flex-direction:column;gap:1px;padding:2px 0;background:linear-gradient(180deg,#1e293b,#172033);color:#7dd3fc;}' +
        '.wr-side-icon svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}' +
        '.wr-side-icon .ic-img{width:24px;height:24px;object-fit:contain;}' +
        '.wr-side-icon .ic-t{font-size:8px;letter-spacing:0.5px;line-height:1;color:#94a3b8;}' +
        '.wr-side-icon:hover{box-shadow:0 0 10px rgba(255,153,51,0.5);color:#ff9933;}' +
        '.sp-fill{background-image:linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0));}' +
        '@media (prefers-reduced-motion:reduce){*{animation:none !important;transition:none !important;}}';
    document.head.appendChild(st);
}

ensureThemeStyles();
decorateSidebarIcons();

// ================= STAGE 13: PARTY DATABASE (2024 Lok Sabha, NDA / INDIA / others) =================

// naam | gathbandhan | taqat (1-5) | rang | rajya (ALL = poore desh mein)
const PARTY_TABLE = [
    'BJP|NDA|5|#f97316|ALL',
    'TDP|NDA|3|#eab308|Andhra Pradesh',
    'JD(U)|NDA|3|#15803d|Bihar',
    'Shiv Sena|NDA|2|#fb923c|Maharashtra',
    'NCP (Ajit Pawar)|NDA|1|#0ea5e9|Maharashtra',
    'LJP (RV)|NDA|1|#1d4ed8|Bihar',
    'JD(S)|NDA|1|#16a34a|Karnataka',
    'RLD|NDA|1|#22c55e|Uttar Pradesh',
    'Apna Dal (S)|NDA|1|#a855f7|Uttar Pradesh',
    'SBSP|NDA|1|#ca8a04|Uttar Pradesh',
    'Nishad Party|NDA|1|#84cc16|Uttar Pradesh',
    'AJSU|NDA|1|#65a30d|Jharkhand',
    'Jana Sena|NDA|1|#dc2626|Andhra Pradesh',
    'PMK|NDA|1|#facc15|Tamil Nadu;Puducherry',
    'AMMK|NDA|1|#64748b|Tamil Nadu',
    'NPP|NDA|1|#0d9488|Meghalaya;Manipur;Arunachal Pradesh',
    'NPF|NDA|1|#7c3aed|Nagaland;Manipur',
    'SKM|NDA|1|#f59e0b|Sikkim',
    'AGP|NDA|1|#4d7c0f|Assam',
    'UPPL|NDA|1|#0369a1|Assam',
    'HAM|NDA|1|#92400e|Bihar',
    'RLM|NDA|1|#be185d|Bihar',
    'Congress|INDIA|5|#22c55e|ALL',
    'Samajwadi Party|INDIA|4|#ef4444|Uttar Pradesh;Madhya Pradesh',
    'TMC|INDIA|4|#10b981|West Bengal;Meghalaya;Assam;Tripura;Goa',
    'RJD|INDIA|3|#059669|Bihar;Jharkhand',
    'DMK|INDIA|4|#b91c1c|Tamil Nadu;Puducherry',
    'AAP|INDIA|3|#06b6d4|Delhi;Punjab;Gujarat;Haryana;Goa',
    'CPI(M)|INDIA|2|#e11d48|Kerala;West Bengal;Tripura;Tamil Nadu',
    'CPI|INDIA|1|#fb7185|Kerala;Bihar;Tamil Nadu',
    'CPI(ML)L|INDIA|1|#9f1239|Bihar;Jharkhand',
    'NCP (SP)|INDIA|2|#0284c7|Maharashtra',
    'Shiv Sena (UBT)|INDIA|2|#ea580c|Maharashtra',
    'JMM|INDIA|2|#14532d|Jharkhand',
    'National Conference|INDIA|1|#b45309|Jammu and Kashmir',
    'IUML|INDIA|1|#166534|Kerala;Tamil Nadu',
    'VCK|INDIA|1|#1e40af|Tamil Nadu',
    'MDMK|INDIA|1|#7f1d1d|Tamil Nadu',
    'RSP|INDIA|1|#be123c|Kerala',
    'Kerala Congress (M)|INDIA|1|#4ade80|Kerala',
    'VIP (Mukesh Sahani)|INDIA|1|#0891b2|Bihar',
    'Bharat Adivasi Party|INDIA|1|#a3e635|Rajasthan;Gujarat;Madhya Pradesh',
    'RLP|INDIA|1|#f472b6|Rajasthan',
    'BSP|OTHER|3|#3b82f6|Uttar Pradesh;Madhya Pradesh;Rajasthan;Punjab;Haryana;Uttarakhand;Chhattisgarh',
    'AIMIM|OTHER|2|#047857|Telangana;Maharashtra;Bihar;Uttar Pradesh',
    'BJD|OTHER|3|#0ea5a4|Odisha',
    'YSRCP|OTHER|3|#2563eb|Andhra Pradesh',
    'BRS|OTHER|3|#ec4899|Telangana',
    'AIADMK|OTHER|3|#65a30d|Tamil Nadu;Puducherry',
    'SAD|OTHER|2|#1e3a8a|Punjab',
    'INLD|OTHER|1|#0f766e|Haryana',
    'JJP|OTHER|1|#d97706|Haryana',
    'DMDK|OTHER|1|#ca8a04|Tamil Nadu',
    'NTK|OTHER|1|#991b1b|Tamil Nadu',
    'MNF|OTHER|1|#312e81|Mizoram',
    'ZPM|OTHER|2|#115e59|Mizoram',
    'VPP|OTHER|1|#6d28d9|Meghalaya',
    'AIUDF|OTHER|1|#0e7490|Assam',
    'BPF|OTHER|1|#0891b2|Assam',
    'ASP (Kanshi Ram)|OTHER|1|#4f46e5|Uttar Pradesh',
    'PDP|OTHER|1|#059669|Jammu and Kashmir',
    'SDF|OTHER|1|#9333ea|Sikkim'
];

const PARTY_SYMBOL = { 'Congress': 'INC', 'Samajwadi Party': 'SP', 'National Conference': 'NC', 'Bharat Adivasi Party': 'BAP',
    'Shiv Sena (UBT)': 'UBT', 'NCP (Ajit Pawar)': 'NCP', 'NCP (SP)': 'NCPSP', 'Kerala Congress (M)': 'KC(M)', 'VIP (Mukesh Sahani)': 'VIP',
    'ASP (Kanshi Ram)': 'ASP', 'Apna Dal (S)': 'AD(S)', 'Nishad Party': 'NISHAD', 'Jana Sena': 'JSP', 'Shiv Sena': 'SHS' };

const PARTY_DB = {};
partiesList.length = 0;
PARTY_TABLE.forEach(function (line) {
    const f = line.split('|');
    const p = {
        name: f[0], symbol: PARTY_SYMBOL[f[0]] || f[0], bloc: f[1], w: parseInt(f[2], 10), color: f[3],
        states: f[4] === 'ALL' ? null : f[4].split(';')
    };
    PARTY_DB[p.name] = p;
    partiesList.push(p);
    partyColors[p.name] = p.color;
});

function partyWhere(p) {
    if (!p.states) return 'Poore desh';
    return p.states.length <= 2 ? p.states.join(', ') : p.states[0] + ' + ' + (p.states.length - 1) + ' aur';
}

// Dal sirf apne rajyon mein mazboot; baaki jagah lagbhag bekaar
function presenceFactor(name, st) {
    const p = PARTY_DB[name];
    if (!p || p.states === null) return 1;
    return p.states.indexOf(st) !== -1 ? 1.3 : 0.12;
}

// Jo dal kisi side par nahi hain unki taqat: apne rajya mein kshetriya dal mazboot
function sideNameSet() {
    const set = {};
    set[selectedYouParty] = 1;
    set[selectedOppParty] = 1;
    if (document.getElementById('choose-fight-select').value === 'alliance') {
        youAlliancePartners.forEach(function (a) { if (a.name && a.states.length) set[a.name] = 1; });
    }
    oppAlliancePartners.forEach(function (a) { if (a.name && a.states.length) set[a.name] = 1; });
    return set;
}

function othersFactor(st) {
    const set = sideNameSet();
    let t = 0;
    partiesList.forEach(function (p) {
        if (set[p.name]) return;
        if (p.states !== null && p.states.indexOf(st) === -1) return;
        t += p.w * (p.states === null ? 0.3 : 1);
    });
    return 0.6 + 0.25 * Math.min(t, 7);
}

// Jo seat "Others" ke hisse aayi, wo us state ke asli dal ko do (jo kisi gathbandhan mein nahi)
function othersParty(st) {
    const canon = canonicalState(st) || st;
    const pool = [];
    let total = 0;
    partiesList.forEach(function (p) {
        if (resultModel.sideOf[p.name]) return;
        if (p.states !== null && p.states.indexOf(canon) === -1) return;
        const w = p.w * (p.states === null ? 0.3 : 1);
        pool.push({ n: p.name, w: w });
        total += w;
    });
    if (!pool.length) return 'Others';
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
        r -= pool[i].w;
        if (r <= 0) return pool[i].n;
    }
    return pool[pool.length - 1].n;
}

function statesForParty(name) {
    const p = PARTY_DB[name];
    if (!p || !p.states) return Object.keys(stateSeatsData);
    return p.states.filter(function (s) { return stateSeatsData[s]; });
}

function defaultAllyStates(name) {
    const p = PARTY_DB[name];
    return p && p.states && p.states.length <= 8 ? statesForParty(name) : [];
}

// "Apne bloc ke saathi jodo": usi gathbandhan ke sabse mazboot 4 dal
function autoFillAllies(side) {
    const main = side === 'you' ? selectedYouParty : selectedOppParty;
    const rival = side === 'you' ? selectedOppParty : selectedYouParty;
    const p = PARTY_DB[main];
    if (!p || p.bloc === 'OTHER') {
        alert('Is dal ka koi bada gathbandhan nahi hai. Saathi haath se chuno.');
        return;
    }
    const arr = side === 'you' ? youAlliancePartners : oppAlliancePartners;
    const otherArr = side === 'you' ? oppAlliancePartners : youAlliancePartners;
    const used = {};
    otherArr.forEach(function (a) { if (a.name) used[a.name] = true; });
    const pool = partiesList.filter(function (q) {
        return q.bloc === p.bloc && q.name !== main && q.name !== rival && !used[q.name];
    }).sort(function (a, b) { return b.w - a.w; }).slice(0, arr.length);
    arr.forEach(function (slot, i) {
        slot.name = pool[i] ? pool[i].name : '';
        slot.states = pool[i] ? defaultAllyStates(pool[i].name) : [];
    });
    renderCampaignLayout();
}

const _renderCampaignLayoutOrig = renderCampaignLayout;
renderCampaignLayout = function () {
    _renderCampaignLayoutOrig();
    const c = document.getElementById('campaign-layout-area');
    if (!c || !c.insertAdjacentHTML) return;
    const alliance = document.getElementById('choose-fight-select').value === 'alliance';
    c.insertAdjacentHTML('beforeend', '<div style="display:flex;gap:10px;justify-content:center;margin-top:12px;">' +
        (alliance ? '<button class="back-btn" onclick="autoFillAllies(\'you\')">Apne bloc ke saathi jodo</button>' : '') +
        '<button class="back-btn" onclick="autoFillAllies(\'opp\')">Opponent ke bloc ke saathi jodo</button></div>');
};

// ================= STAGE 14: RALLY COVERAGE, SOCIAL MODES, IT LIMIT, HAWA, LOCAL GURU, KARYAKARTA =================

function ensureS14() {
    if (!gameState.itUsed) gameState.itUsed = { you: 0, opp: 0 };
    if (!gameState.rallies) gameState.rallies = { you: {}, opp: {} };
    if (!gameState.gurus) gameState.gurus = { you: {}, opp: {} };
}

const _freshActionStateS14 = freshActionState;
freshActionState = function () {
    _freshActionStateS14();
    gameState.itUsed = { you: 0, opp: 0 };
    gameState.rallies = { you: {}, opp: {} };
    gameState.gurus = { you: {}, opp: {} };
};

const _resetStarsS14 = resetStars;
resetStars = function () {
    _resetStarsS14();
    ensureS14();
    gameState.itUsed = { you: 0, opp: 0 };
};

const _nextPhaseResetS14 = nextPhaseActionReset;
nextPhaseActionReset = function () {
    _nextPhaseResetS14();
    gameState.itUsed = { you: 0, opp: 0 };
    gameState.rallies = { you: {}, opp: {} };
    gameState.gurus = { you: {}, opp: {} };
};

// ---- Hawa: har kaam ka thoda asar (jeet par +, haar par -) ----
Object.assign(HAWA_BY_TYPE, { 'State Rally': 2, 'Seat Rally': 1, 'Digital Debate': 2, 'Court Case': 3, 'EC Shikayat (MCC)': 2,
    'Booth Team': 1, 'Local Guru': 2, 'Karyakarta (All)': 2 });

function wrapHawa(fnName, okVal, badVal) {
    const orig = window[fnName] || eval(fnName);
    return function () {
        const a = orig.apply(null, arguments);
        const ap = a.apply;
        a.apply = function (m, side) {
            const out = ap(m, side);
            out.hawa = out.good !== false ? okVal : badVal;
            return out;
        };
        return a;
    };
}
const _actCourtS14 = actCourt, _actDebateS14 = actDebate, _actMccS14 = actMcc;
function hawaWrap(orig, okVal, badVal) {
    return function () {
        const a = orig.apply(null, arguments);
        const ap = a.apply;
        a.apply = function (m, side) {
            const out = ap(m, side);
            out.hawa = out.good !== false ? okVal : badVal;
            return out;
        };
        return a;
    };
}
actCourt = hawaWrap(_actCourtS14, 3, -3);
actDebate = hawaWrap(_actDebateS14, 3, -2);
actMcc = hawaWrap(_actMccS14, 2, -1);

// ---- Rally: aadhe se zyada rally par state ki aadhi seats par bonus ----
function bumpRally(side, st) {
    ensureS14();
    const seats = activeSeats(st);
    const cap = Math.max(1, Math.min(10, seats.length));
    const R = gameState.rallies[side];
    const r = R[st] || (R[st] = { n: 0, t1: false, t2: false });
    r.n++;
    let msg = '';
    if (!r.t1 && r.n >= Math.ceil(cap / 2)) {
        r.t1 = true;
        const half = shuffled(seats).slice(0, Math.max(1, Math.ceil(seats.length / 2)));
        half.forEach(function (x) { addBoost(side, 'seat', x.key, 0.12); });
        msg = 'Aadhe se zyada rally hui: ' + st + ' ki ' + half.length + ' seats par gehra asar.';
    }
    if (!r.t2 && r.n >= cap) {
        r.t2 = true;
        seats.forEach(function (x) { addBoost(side, 'seat', x.key, 0.08); });
        msg += ' Poore state mein pakad bani.';
    }
    return msg;
}

const _actStateRallyS14 = actStateRally;
actStateRally = function (st) {
    const a = _actStateRallyS14(st);
    const ap = a.apply;
    a.apply = function (m, side) {
        const out = ap(m, side);
        const msg = bumpRally(side, st);
        if (msg) out.text += ' ' + msg;
        return out;
    };
    return a;
};

const _actSeatRallyS14 = actSeatRally;
actSeatRally = function (st, key, pc) {
    const a = _actSeatRallyS14(st, key, pc);
    const ap = a.apply;
    a.apply = function (m, side) {
        const out = ap(m, side);
        const msg = st ? bumpRally(side, st) : '';
        if (msg) out.text += ' ' + msg;
        return out;
    };
    return a;
};

function rallyCoverageNote() {
    ensureS14();
    const st = uiSel.state;
    if (!st) return '';
    const cap = Math.max(1, Math.min(10, activeSeats(st).length));
    const r = gameState.rallies.you[st] || { n: 0, t1: false };
    return '<div class="ap-note">' + esc(st) + ' mein aapki rally: <b>' + r.n + ' / ' + cap + '</b>. ' + Math.ceil(cap / 2) +
        ' rally par state ki aadhi seats par bonus, ' + cap + ' par poore state par.' + (r.t1 ? ' (aadhe ka bonus mil chuka)' : '') + '</div>';
}

// ---- Social media: 3 andaaz, IT cell round mein sirf 2 baar ----
actSocial = function (st, mode) {
    mode = mode || 'positive';
    const isState = !!st;
    return {
        type: (isState ? 'Social (State)' : 'Social (National)') + (mode === 'positive' ? '' : ' - ' + mode), st: st || null,
        cost: (isState ? 3 : 7) + (mode === 'positive' ? 0 : 1), stamina: isState ? 3 : 5,
        check: function (side) {
            ensureS14();
            return gameState.itUsed[side] >= 2 ? 'IT cell is round mein 2 baar use ho chuka.' : null;
        },
        apply: function (m, side) {
            ensureS14();
            gameState.itUsed[side]++;
            const base = isState ? 0.07 : 0.04;
            const rival = otherSide(side);
            const nm = sideName(side);
            const where = isState ? ' (' + st + ')' : '';
            const add = function (who, amt) {
                if (isState) addBoost(who, 'state', st, amt); else addBoost(who, 'national', amt);
            };
            if (mode === 'attack') {
                if (Math.random() < 0.2) {
                    add(side, -base * 0.5);
                    return { text: nm + ' ka attack campaign' + where + ' ulta pada, apni hi chhavi bigdi.', good: false, hawa: -3 };
                }
                add(side, base * 0.6 * m);
                add(rival, -base * 0.5);
                return { text: nm + ' ke attack campaign' + where + ' ne ' + sideName(rival) + ' ko gher liya.', good: true, hawa: 3 };
            }
            if (mode === 'viral') {
                const r = Math.random();
                if (r < 0.25) return { text: nm + ' ka viral prayas' + where + ' chala hi nahi.', good: false, hawa: -1 };
                const f = r < 0.6 ? 2.2 : 1;
                add(side, base * f * m);
                return { text: nm + ' ka viral video' + where + (f > 1 ? ' khoob chala!' : ' thoda chala.'), good: true, hawa: f > 1 ? 6 : 2 };
            }
            add(side, base * m);
            return { text: nm + ' ka social media abhiyan' + where + ' chala.', good: true, hawa: isState ? 1 : 2 };
        }
    };
};

function uiSocialGo(scope, mode) {
    if (scope === 'state') {
        if (uiSel.state) runUi(actSocial(uiSel.state, mode));
    } else {
        runUi(actSocial(null, mode));
    }
}

function renderSocialPanel() {
    ensureS14();
    const modes = [['positive', 'Seedha prachar (surakshit)'], ['attack', 'Attack (rival par hamla, 20% ulta)'], ['viral', 'Viral dhamaka (jokhim)']];
    const btns = function (scope, st) {
        return modes.map(function (m) {
            return '<button class="ap-btn" style="margin:3px 6px 3px 0" onclick="uiSocialGo(\'' + scope + '\',\'' + m[0] + '\')">' + m[1] + ' - ' + actSocial(st, m[0]).cost + ' Cr</button>';
        }).join('');
    };
    let h = actionHeader(true);
    h += '<div class="ap-note">IT cell is round mein: <b>' + gameState.itUsed.you + ' / 2</b> (opponent ke liye bhi yahi limit). Asar: seats par aur hawa par.</div>';
    h += '<div class="ap-sec"><b>National Campaign</b><br>' + btns('national', null) + '</div>';
    if (activeStates().length) {
        h += '<div class="ap-sec"><b>State Campaign</b><br>' + stateSelectHtml() + '<br>' + btns('state', uiSel.state) + '</div>';
    }
    return h;
}

// ---- Local Guru: state mein vote % aur hawa ----
function actGuru(st) {
    const n = activeSeats(st).length;
    return {
        type: 'Local Guru', st: st, cost: Math.round(2 + 0.25 * n), stamina: 2,
        check: function (side) {
            ensureS14();
            return (gameState.gurus[side][st] || 0) >= 2 ? 'Is state mein is phase ke 2 local guru saath aa chuke.' : null;
        },
        apply: function (m, side) {
            ensureS14();
            gameState.gurus[side][st] = (gameState.gurus[side][st] || 0) + 1;
            addBoost(side, 'state', st, 0.05 * m);
            return { text: sideName(side) + ' ne ' + st + ' ke local guruon ko saath liya.', good: true, hawa: 2 };
        }
    };
}

function uiGuru() { if (uiSel.state) runUi(actGuru(uiSel.state)); }

function renderGuruPanel() {
    ensureS14();
    let h = actionHeader(true);
    if (!activeStates().length) return h + '<div class="ap-note">Is phase mein koi seat nahi.</div>';
    h += '<div class="ap-sec"><b>Local Guru</b> - gaon aur mohalle ke bharosemand log. State ka vote percentage badhta hai aur hawa bhi.<br>' +
        stateSelectHtml() + '<br>' + costLine(actGuru(uiSel.state)) + '<br>Is state mein is phase: <b>' + (gameState.gurus.you[uiSel.state] || 0) + ' / 2</b><br>' +
        '<button class="ap-btn" onclick="uiGuru()">Local guru ko saath lo</button></div>';
    return h;
}

// ---- Karyakarta: har state mein ek saath ----
function actBoothAll() {
    let cost = 0;
    activeStates().forEach(function (x) { cost += actBooth(x.st).cost; });
    return {
        type: 'Karyakarta (All)', st: null, cost: Math.max(1, Math.round(cost * 0.8)), stamina: 4,
        check: function (side) {
            ensureS14();
            const left = activeStates().filter(function (x) { return (gameState.booths[side][x.st] || 0) < 3; }).length;
            return left ? null : 'Sabhi states mein 3-3 team pehle se lagi hain.';
        },
        apply: function (m, side) {
            let n = 0;
            activeStates().forEach(function (x) {
                if ((gameState.booths[side][x.st] || 0) < 3) {
                    gameState.booths[side][x.st] = (gameState.booths[side][x.st] || 0) + 1;
                    addBoost(side, 'state', x.st, 0.05 * m);
                    n++;
                }
            });
            return { text: sideName(side) + ' ke karyakarta ' + n + ' states mein ek saath utre.', good: true, hawa: 2 };
        }
    };
}

function uiBoothAll() { runUi(actBoothAll()); }

function renderKaryakartaPanel() {
    let h = renderBoothPanel();
    h += '<div class="ap-sec"><b>Sabhi states mein ek saath</b> - is phase ke har state mein karyakarta active (20% sasta).<br>' +
        costLine(actBoothAll()) + '<br><button class="ap-btn" onclick="uiBoothAll()">Sabhi states mein karyakarta lagao</button></div>';
    return h;
}

const _renderPanelS14 = renderPanel;
renderPanel = function (name) {
    if (name === 'IT Cell & Social') return renderSocialPanel();
    if (name === 'Local Guru') return renderGuruPanel();
    if (name === 'Karyakarta') return renderKaryakartaPanel();
    let h = _renderPanelS14(name);
    if (name === 'Media & Rallies') h += rallyCoverageNote();
    return h;
};

// KAR (Karyakarta) ka naya icon
ICON_SVG.KAR = svgIcon('<circle cx="7" cy="8" r="2.5"/><circle cx="17" cy="8" r="2.5"/><circle cx="12" cy="11" r="3"/><path d="M2 20c0-3 2-5 5-5M22 20c0-3-2-5-5-5M7 21c0-3 2.5-5 5-5s5 2 5 5"/>');
ICON_TITLE.KAR = 'Karyakarta';
ICON_TITLE.GUR = 'Local Guru';

function injectKarButton() {
    if (document.querySelector('[data-kar]')) return;
    const bar = document.querySelector('.wr-right-sidebar');
    if (!bar || !bar.insertBefore || !bar.children) return;
    const btn = document.createElement('button');
    btn.className = 'wr-side-icon';
    btn.setAttribute('data-kar', '1');
    btn.innerText = 'KAR';
    btn.onclick = function () { openGameModal('Karyakarta'); };
    let before = null;
    for (let i = 0; i < bar.children.length; i++) {
        const oc = bar.children[i].getAttribute ? bar.children[i].getAttribute('onclick') : '';
        if (/Local Guru/.test(oc || '') && bar.children[i + 1]) { before = bar.children[i + 1]; break; }
    }
    bar.insertBefore(btn, before);
}
injectKarButton();
decorateSidebarIcons();

// ================= STAGE 15: DEBATE (issue + speaker), COURT (lawyers), SPY + EC/MCC =================

function ensureS15() {
    if (!gameState.debates) gameState.debates = { you: 0, opp: 0 };
    if (!gameState.defence) gameState.defence = { you: null, opp: null };
    if (!gameState.violations) gameState.violations = { you: {}, opp: {} };
    if (!gameState.evidence) gameState.evidence = { you: {}, opp: {} };
    if (!gameState.disq) gameState.disq = { you: {}, opp: {} };
    if (!gameState.spyUsed) gameState.spyUsed = { you: 0, opp: 0 };
}

function resetS15() {
    gameState.debates = { you: 0, opp: 0 };
    gameState.defence = { you: null, opp: null };
    gameState.violations = { you: {}, opp: {} };
    gameState.evidence = { you: {}, opp: {} };
    gameState.disq = { you: {}, opp: {} };
    gameState.spyUsed = { you: 0, opp: 0 };
}

const _freshActionStateS15 = freshActionState;
freshActionState = function () { _freshActionStateS15(); resetS15(); };
const _nextPhaseResetS15 = nextPhaseActionReset;
nextPhaseActionReset = function () { _nextPhaseResetS15(); resetS15(); };

function disqMult(side, key) {
    return gameState.disq && gameState.disq[side] && gameState.disq[side][key] ? 0.02 : 1;
}

// ---- Debate: mudda + pravakta; phase mein ek bhi debate nahi to nuksan ----
const SPEAKERS = [
    { id: 'anubhavi', name: 'Anubhavi pravakta', cost: 4, stamina: 4, skill: 0.2 },
    { id: 'tez', name: 'Tez-tarrar yuva', cost: 2, stamina: 5, skill: 0.1 },
    { id: 'naya', name: 'Naya chehra (sasta)', cost: 1, stamina: 6, skill: 0 }
];

function issueShare(theme) {
    let n = 0, t = 0;
    if (!resultModel) return 0;
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase !== gameState.phase) return;
        t++;
        if (s.issue === theme) n++;
    });
    return t ? n / t : 0;
}

function debateChance(side, theme, sp) {
    const hw = (side === 'you' ? 1 : -1) * (gameState.hawa || 0) / 500;
    return Math.max(0.1, Math.min(0.9, 0.4 + sp.skill + Math.min(0.15, issueShare(theme) * 0.4) + hw));
}

function actDebateX(theme, spId) {
    let sp = SPEAKERS[2];
    SPEAKERS.forEach(function (x) { if (x.id === spId) sp = x; });
    return {
        type: 'Debate (' + theme + ')', st: null, cost: sp.cost, stamina: sp.stamina,
        check: function (side) {
            ensureS15();
            return gameState.debates[side] >= 2 ? 'Is phase mein 2 debate ho chuki.' : null;
        },
        apply: function (m, side) {
            ensureS15();
            gameState.debates[side]++;
            if (Math.random() < debateChance(side, theme, sp)) {
                addBoost(side, 'issue', theme, 0.12 * m);
                addBoost(side, 'national', 0.01);
                return { text: sideName(side) + ' ke ' + sp.name + ' ne ' + theme + ' par debate jeeti.', good: true, hawa: 3 };
            }
            addBoost(side, 'issue', theme, -0.03);
            return { text: sideName(side) + ' ke ' + sp.name + ' ' + theme + ' par debate mein ghire.', good: false, hawa: -2 };
        }
    };
}

// purani national debate bhi gini jaye
const _actDebateS15 = actDebate;
actDebate = function () {
    const a = _actDebateS15.apply(null, arguments);
    const ap = a.apply;
    a.check = function (side) {
        ensureS15();
        return gameState.debates[side] >= 2 ? 'Is phase mein 2 debate ho chuki.' : null;
    };
    a.apply = function (m, side) {
        ensureS15();
        gameState.debates[side]++;
        return ap(m, side);
    };
    return a;
};

function applyDebatePenalty() {
    ensureS15();
    ['you', 'opp'].forEach(function (side) {
        if (gameState.debates[side] === 0) {
            addBoost(side, 'national', -0.03);
            shiftHawa(side, -3, 'Debate se gayab');
            pushNews(sideName(side) + ' is phase mein debate mein nahi gaye, hawa aur vote ghate.');
        }
    });
}

// ---- Court: 3 tarah ke wakeel + bachav wakeel ----
const LAWYERS = [
    { id: 'junior', name: 'Junior wakeel', fee: 3, chance: 0.3 },
    { id: 'anubhavi', name: 'Anubhavi wakeel', fee: 8, chance: 0.6 },
    { id: 'senior', name: 'Senior Advocate', fee: 18, chance: 0.9 }
];
const CASE_TOPICS = ['Bhrashtachar', 'Jhoota vaada', 'Funding ki hera-pheri', 'Bhadkau bhashan'];

function lawyerOf(id) {
    let r = null;
    LAWYERS.forEach(function (l) { if (l.id === id) r = l; });
    return r;
}

function actCourt(topic, lawyerId) {
    topic = topic || CASE_TOPICS[0];
    const L = lawyerOf(lawyerId || 'anubhavi');
    return {
        type: 'Court Case', st: null, cost: L.fee, stamina: 5, limitKey: 'court',
        apply: function (m, side) {
            ensureS15();
            const def = otherSide(side);
            const dl = lawyerOf(gameState.defence[def]);
            const p = L.chance * (1 - 0.7 * (dl ? dl.chance : 0));
            if (Math.random() < p) {
                reduceBoost(def, 0.45);
                addBoost(def, 'national', -0.04);
                if (topic === 'Jhoota vaada') ISSUES.forEach(function (i) { gameState.boost[def].issue[i] = (gameState.boost[def].issue[i] || 0) * 0.5; });
                if (topic === 'Funding ki hera-pheri') {
                    resSet(def, 'budget', Math.max(0, resGet(def, 'budget') - 12));
                    resSet(def, 'blackFund', Math.floor(resGet(def, 'blackFund') * 0.5));
                    gameState.risk[def] += 10;
                }
                if (topic === 'Bhadkau bhashan') resSet(def, 'stamina', Math.max(0, resGet(def, 'stamina') - 15));
                return { text: 'Court ne ' + sideName(side) + ' ki arzi (' + topic + ') maani. ' + sideName(def) + ' ko bhari nuksan.', good: true, hawa: 4 };
            }
            addBoost(side, 'national', -0.02);
            return { text: 'Court ne ' + sideName(side) + ' ki arzi (' + topic + ') khaarij ki.' + (dl ? ' Bachav wakeel kaam aaya.' : ''), good: false, hawa: -3 };
        }
    };
}

function actDefence(lawyerId) {
    const L = lawyerOf(lawyerId);
    return {
        type: 'Defence Wakeel', st: null, cost: L.fee, stamina: 1,
        check: function (side) {
            ensureS15();
            return gameState.defence[side] ? 'Is phase ke liye bachav wakeel pehle se hai.' : null;
        },
        apply: function (m, side) {
            gameState.defence[side] = lawyerId;
            return { text: sideName(side) + ' ne ' + L.name + ' ko bachav ke liye rakha.', good: true, hawa: 0 };
        }
    };
}

// ---- Spy + EC/MCC ----
const _recordSpendS15 = recordSpend;
recordSpend = function (side, a, fundKind) {
    _recordSpendS15(side, a, fundKind);
    if (fundKind === 'black' && a.st) {
        ensureS15();
        const arr = gameState.violations[side][a.st] || (gameState.violations[side][a.st] = []);
        let k = a.key;
        if (!k) {
            const seats = activeSeats(a.st);
            if (seats.length) k = seats[Math.floor(Math.random() * seats.length)].key;
        }
        if (k && arr.indexOf(k) === -1 && arr.length < 5) arr.push(k);
    }
};

function actSpy(st) {
    return {
        type: 'Spy', st: st, cost: 5, stamina: 2,
        check: function (side) {
            ensureS15();
            return gameState.spyUsed[side] >= 2 ? 'Is phase mein 2 jasoos mishan ho chuke.' : null;
        },
        apply: function (m, side) {
            ensureS15();
            gameState.spyUsed[side]++;
            const viol = gameState.violations[otherSide(side)][st] || [];
            if (!viol.length) return { text: 'Jasoos ko ' + st + ' mein koi gadbad nahi mili.', good: false, hawa: 0 };
            if (Math.random() < 0.75) {
                const found = viol.slice(0, 3);
                const known = gameState.evidence[side][st] || (gameState.evidence[side][st] = []);
                found.forEach(function (k) { if (known.indexOf(k) === -1) known.push(k); });
                return { text: 'Jasoos ne ' + st + ' mein ' + found.length + ' seat par aachar sanhita ulanghan ka sabut jutaya.', good: true, hawa: 0 };
            }
            return { text: 'Jasoos pakda gaya, kuch haath nahi laga.', good: false, hawa: -1 };
        }
    };
}

function actMcc(st) {
    return {
        type: 'EC Shikayat (MCC)', st: st || null, cost: 3, stamina: 3, limitKey: 'mcc',
        check: function (side) {
            ensureS15();
            const ev = st && gameState.evidence[side][st];
            return ev && ev.length ? null : 'Pehle jasoos (Spy) se sabut jutao.';
        },
        apply: function (m, side) {
            const rival = otherSide(side);
            const ev = gameState.evidence[side][st] || [];
            if (Math.random() < Math.min(0.85, 0.35 + 0.15 * ev.length)) {
                ev.forEach(function (k) { gameState.disq[rival][k] = true; });
                delete gameState.evidence[side][st];
                return { text: 'EC ne ' + sideName(rival) + ' ke ' + ev.length + ' candidate ka namankan radd kiya (' + st + ').', good: true, hawa: 3 };
            }
            return { text: 'EC ne shikayat par koi karyavahi nahi ki.', good: false, hawa: -1 };
        }
    };
}

// AI: bachav wakeel aur aakhri round se pehle ek debate
const _aiTakeTurnS15 = aiTakeTurn;
aiTakeTurn = function (side) {
    if (side === 'opp' && AI_CONFIG.enabled) {
        ensureS15();
        if (!gameState.defence.opp) {
            const b = resGet('opp', 'budget');
            doAction('opp', actDefence(b >= 60 ? 'senior' : (b >= 25 ? 'anubhavi' : 'junior')), 'white');
        }
        if (gameState.turnout >= 55 && gameState.debates.opp === 0) {
            doAction('opp', actDebateX(ISSUES[Math.floor(Math.random() * 4)], 'tez'), 'white');
        }
    }
    return _aiTakeTurnS15(side);
};

const _endPhaseS15 = endPhase;
endPhase = function () {
    applyDebatePenalty();
    _endPhaseS15();
};

// ---- Panels ----
function setUiTopic(v) { uiSel.topic = v; refreshPanel(); }
function setUiIssue(v) { uiSel.issue = v; refreshPanel(); }
function uiDebateGo(id) { runUi(actDebateX(uiSel.issue || ISSUES[0], id)); }
function uiCourtGo(id) { runUi(actCourt(uiSel.topic || CASE_TOPICS[0], id)); }
function uiDefence(id) { runUi(actDefence(id)); }
function uiSpyGo() { if (uiSel.state) runUi(actSpy(uiSel.state)); }
function uiMccFile() { if (uiSel.state) runUi(actMcc(uiSel.state)); }

function optionsHtml(list, cur) {
    return list.map(function (x) { return '<option value="' + esc(x) + '"' + (x === cur ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('');
}

function renderDebatePanel() {
    ensureS15();
    uiSel.issue = uiSel.issue || ISSUES[0];
    let h = actionHeader(true);
    h += '<div class="ap-note">Is phase mein aapki debate: <b>' + gameState.debates.you + ' / 2</b>. Ek bhi debate na ho to hawa aur vote dono ghatenge.</div>';
    h += '<div class="ap-sec"><b>Mudda chuno</b> (is phase ki seats mein)<br><select class="ap-sel" onchange="setUiIssue(this.value)">' +
        ISSUES.map(function (i) {
            return '<option value="' + i + '"' + (i === uiSel.issue ? ' selected' : '') + '>' + i + ' (' + Math.round(issueShare(i) * 100) + '% seats)</option>';
        }).join('') + '</select><br><b>Kise bhejna hai</b><br>';
    SPEAKERS.forEach(function (sp) {
        h += '<button class="ap-btn" style="margin:3px 6px 3px 0" onclick="uiDebateGo(\'' + sp.id + '\')">' + sp.name + ' - ' + sp.cost + ' Cr, jeetne ka chance ' +
            Math.round(debateChance('you', uiSel.issue, sp) * 100) + '%</button>';
    });
    return h + '</div>';
}

function renderCourtPanel() {
    ensureS15();
    uiSel.topic = uiSel.topic || CASE_TOPICS[0];
    const dl = lawyerOf(gameState.defence.you);
    let h = actionHeader(true);
    h += '<div class="ap-sec"><b>Bachav wakeel (is phase ke liye)</b><br>' + (dl ? 'Rakha hua: <b>' + dl.name + '</b>' : 'Koi nahi. Opponent case karega to bachav kamzor rahega.') + '<br>';
    LAWYERS.forEach(function (l) {
        h += '<button class="ap-btn" style="margin:3px 6px 3px 0" onclick="uiDefence(\'' + l.id + '\')">' + l.name + ' - ' + l.fee + ' Cr (case ka asar lagbhag ' + Math.round(l.chance * 70) + '% kam)</button>';
    });
    h += '</div><div class="ap-sec"><b>Opponent par case</b> (is phase mein ' + gameState.counters.you.court + ' / ' + LIMITS.court + ')<br>Mudda:<br><select class="ap-sel" onchange="setUiTopic(this.value)">' +
        optionsHtml(CASE_TOPICS, uiSel.topic) + '</select><br>Wakeel chuno:<br>';
    LAWYERS.forEach(function (l) {
        h += '<button class="ap-btn" style="margin:3px 6px 3px 0" onclick="uiCourtGo(\'' + l.id + '\')">' + l.name + ' - ' + l.fee + ' Cr, jeetne ka chance ' + Math.round(l.chance * 100) + '%</button>';
    });
    return h + '<br><span class="ap-note">Jeet gaye to opponent ka vote aur asar bhari ghatega. Uska bachav wakeel chance kam karega.</span></div>';
}

function evidenceListHtml() {
    ensureS15();
    const ks = Object.keys(gameState.evidence.you).filter(function (st) { return gameState.evidence.you[st].length; });
    if (!ks.length) return '<div class="ap-note">Abhi koi sabut nahi jutaya.</div>';
    return '<table class="ap-table"><tr><th>State</th><th>Sabut (seats)</th></tr>' + ks.map(function (st) {
        return '<tr><td>' + esc(st) + '</td><td>' + gameState.evidence.you[st].map(function (k) { return esc(k.split('|')[1]); }).join(', ') + '</td></tr>';
    }).join('') + '</table>';
}

function renderSpyPanel() {
    ensureS15();
    let h = actionHeader(true);
    if (!activeStates().length) return h + '<div class="ap-note">Is phase mein koi seat nahi.</div>';
    h += '<div class="ap-sec"><b>Jasoos</b> - rival ki gadbad (jaise black fund se kharch) dhundhta hai. Is phase mein ' + gameState.spyUsed.you + ' / 2.<br>' +
        stateSelectHtml() + '<br>' + costLine(actSpy(uiSel.state)) + '<br><button class="ap-btn" onclick="uiSpyGo()">Jasoos bhejo</button></div>';
    return h + evidenceListHtml();
}

function renderMccPanel() {
    ensureS15();
    let h = actionHeader(true);
    if (!activeStates().length) return h + '<div class="ap-note">Is phase mein koi seat nahi.</div>';
    const n = (gameState.evidence.you[uiSel.state] || []).length;
    h += '<div class="ap-sec"><b>EC / Aachar Sanhita shikayat</b> - sabut ke saath. Safal hui to un seats par opponent ka candidate har jayega.<br>' +
        stateSelectHtml() + '<br>Is state ka sabut: <b>' + (gameState.evidence.you[uiSel.state] || []).length + ' seat</b> | is phase mein ' + gameState.counters.you.mcc + ' / ' + LIMITS.mcc + '<br>' +
        costLine(actMcc(uiSel.state)) + '<br><button class="ap-btn" onclick="uiMccFile()">Shikayat darj karo</button><br><span class="ap-note">Pehle SPY icon se sabut jutao.</span></div>';
    return h + evidenceListHtml();
}

const _renderPanelS15 = renderPanel;
renderPanel = function (name) {
    if (name === 'Media Debates') return renderDebatePanel();
    if (name === 'Courts Case') return renderCourtPanel();
    if (name === 'Spy') return renderSpyPanel();
    if (name === 'EC Scrutiny & MCC') return renderMccPanel();
    return _renderPanelS15(name);
};

// ================= STAGE 16: MONEY (donors, crowdfunding, loans, black sources) + STAMINA BOOST =================

const DONOR_LIST = [
    { id: 'infra', name: 'Seth Ramniklal (Infra)', pay: 18 },
    { id: 'tele', name: 'Madhavi Group (Telecom)', pay: 14 },
    { id: 'steel', name: 'Khanna Steel Works', pay: 10 },
    { id: 'agro', name: 'Bharat Agro Corp', pay: 8 }
];

function ensureS16() {
    if (!gameState.donors) {
        gameState.donors = DONOR_LIST.map(function (d) { return { id: d.id, name: d.name, pay: d.pay, owner: null }; });
    }
    if (!gameState.loan) gameState.loan = { you: null, opp: null };
    if (!gameState.rest) gameState.rest = { you: 0, opp: 0 };
    if (!gameState.crowd) gameState.crowd = { you: 0, opp: 0 };
}

function resetS16All() {
    gameState.donors = null;
    gameState.loan = { you: null, opp: null };
    gameState.rest = { you: 0, opp: 0 };
    gameState.crowd = { you: 0, opp: 0 };
    ensureS16();
}

const _freshActionStateS16 = freshActionState;
freshActionState = function () { _freshActionStateS16(); resetS16All(); };

Object.assign(HAWA_BY_TYPE, { 'Crowdfunding': 1, 'Donor Meeting': 0 });

function donorOf(id) {
    ensureS16();
    let r = null;
    gameState.donors.forEach(function (d) { if (d.id === id) r = d; });
    return r;
}

// ---- Udyogpati se baat ----
function actDonor(id) {
    const d = donorOf(id);
    return {
        type: 'Donor Meeting', st: null, cost: 2, stamina: 3,
        check: function () {
            ensureS16();
            return d.owner ? 'Yeh udyogpati pehle se ' + sideName(d.owner) + ' ke saath hai.' : null;
        },
        apply: function (m, side) {
            const sgn = side === 'you' ? 1 : -1;
            const p = Math.max(0.15, Math.min(0.85, 0.5 + sgn * (gameState.hawa || 0) / 250));
            if (Math.random() < p) {
                d.owner = side;
                resSet(side, 'budget', resGet(side, 'budget') + Math.round(d.pay / 2));
                return { text: d.name + ' ab ' + sideName(side) + ' ke saath hai. Har phase ' + d.pay + ' Cr milenge.', good: true, hawa: 0 };
            }
            return { text: d.name + ' ne abhi haan nahi kaha.', good: false, hawa: 0 };
        }
    };
}

// ---- Crowdfunding ----
function actCrowd() {
    return {
        type: 'Crowdfunding', st: null, cost: 0, stamina: 6,
        check: function (side) {
            ensureS16();
            return gameState.crowd[side] >= 2 ? 'Is phase mein 2 crowdfunding ho chuki.' : null;
        },
        apply: function (m, side) {
            gameState.crowd[side]++;
            const sgn = side === 'you' ? 1 : -1;
            const amt = Math.round((3 + Math.random() * 4) * (1 + Math.max(0, sgn * (gameState.hawa || 0)) / 100));
            resSet(side, 'budget', resGet(side, 'budget') + amt);
            return { text: sideName(side) + ' ke liye janta ne ' + amt + ' Cr ka chanda diya.', good: true, hawa: 1 };
        }
    };
}

// ---- Loan ----
function takeLoan(side, amt) {
    ensureS16();
    if (gameState.loan[side]) return { ok: false, good: false, text: 'Pehle wala loan abhi baaki hai.' };
    resSet(side, 'budget', resGet(side, 'budget') + amt);
    gameState.loan[side] = { due: Math.round(amt * 1.25) };
    return { ok: true, good: true, text: amt + ' Cr ka loan mila. Agle phase mein ' + Math.round(amt * 1.25) + ' Cr lautane honge.' };
}

function repayLoan(side) {
    const L = gameState.loan[side];
    if (!L) return;
    const pay = Math.min(L.due, resGet(side, 'budget'));
    resSet(side, 'budget', resGet(side, 'budget') - pay);
    L.due -= pay;
    if (L.due > 0) {
        L.due = Math.round(L.due * 1.1);
        shiftHawa(side, -3, 'Karz');
        pushNews(sideName(side) + ' loan nahi chuka paya, saakh giri.');
    } else {
        gameState.loan[side] = null;
    }
}

// ---- Black fund ke naye srot ----
const BLACK_SRC = {
    foreign: { name: 'Videshi funding', lo: 25, hi: 45, stamina: 8, risk: 14 },
    market: { name: 'Kala bazaar (hawala)', lo: 12, hi: 22, stamina: 5, risk: 6 },
    kickback: { name: 'Thekedaron se vasooli', lo: 18, hi: 30, stamina: 6, risk: 10 }
};

function blackSource(side, kind) {
    const k = BLACK_SRC[kind];
    if (gameState.counters[side].black >= LIMITS.black) return { ok: false, good: false, text: 'Is phase mein ab aur black fund nahi jut sakta (limit ' + LIMITS.black + ').' };
    const stam = resGet(side, 'stamina');
    if (stam < k.stamina) return { ok: false, good: false, text: 'Stamina kam hai (' + k.stamina + '% chahiye).' };
    const amt = k.lo + Math.floor(Math.random() * (k.hi - k.lo + 1));
    resSet(side, 'stamina', stam - k.stamina);
    resSet(side, 'blackFund', resGet(side, 'blackFund') + amt);
    gameState.counters[side].black++;
    gameState.risk[side] += k.risk;
    let extra = '';
    if (kind === 'foreign' && Math.random() < 0.25) {
        addBoost(side, 'national', -0.03);
        extra = ' Videshi chanda par jaanch ki khabar, saakh ghati.';
    }
    if (kind === 'kickback') shiftHawa(side, -2, 'Vasooli');
    return { ok: true, good: true, text: k.name + ': ' + amt + ' Cr black fund jut gaya.' + extra };
}

// ---- Stamina badhana ----
function restStamina(side, kind) {
    ensureS16();
    const cap = 100 + (side === 'opp' ? (AI_CONFIG.bonusStamina || 0) : 0);
    const t = kind === 'team' ? { cost: 8, gain: 35, limit: 1, name: 'Energy team (doctor + helicopter)' } : { cost: 3, gain: 20, limit: 2, name: 'Aaram' };
    if (!gameState.team) gameState.team = { you: 0, opp: 0 };
    if (kind === 'team' && gameState.team[side] >= 1) return { ok: false, good: false, text: 'Is phase mein energy team ek baar hi.' };
    if (kind !== 'team' && gameState.rest[side] >= 2) return { ok: false, good: false, text: 'Is phase mein 2 baar hi aaram.' };
    if (resGet(side, 'budget') < t.cost) return { ok: false, good: false, text: 'White fund kam hai (' + t.cost + ' Cr chahiye).' };
    resSet(side, 'budget', resGet(side, 'budget') - t.cost);
    resSet(side, 'stamina', Math.min(cap, resGet(side, 'stamina') + t.gain));
    if (kind === 'team') gameState.team[side]++; else gameState.rest[side]++;
    return { ok: true, good: true, text: t.name + ': stamina +' + t.gain + '%.' };
}

// ---- Naya phase: donors ka paisa, loan ki kisht, AI ke sauda ----
const _nextPhaseResetS16 = nextPhaseActionReset;
nextPhaseActionReset = function () {
    _nextPhaseResetS16();
    ensureS16();
    gameState.rest = { you: 0, opp: 0 };
    gameState.team = { you: 0, opp: 0 };
    gameState.crowd = { you: 0, opp: 0 };
    repayLoan('you');
    repayLoan('opp');
    gameState.donors.forEach(function (d) {
        if (d.owner) resSet(d.owner, 'budget', resGet(d.owner, 'budget') + d.pay);
    });
    gameState.phaseStartBudget = Math.max(gameState.phaseStartBudget, gameState.budget);
    // AI udyogpatiyon se baat (level ke hisaab se)
    const prob = AI_CONFIG.noise > 0.3 ? 0.15 : (AI_CONFIG.noise < 0.1 ? 0.5 : 0.3);
    gameState.donors.forEach(function (d) {
        if (!d.owner && Math.random() < prob) d.owner = 'opp';
    });
};

const _aiTakeTurnS16 = aiTakeTurn;
aiTakeTurn = function (side) {
    if (side === 'opp' && AI_CONFIG.enabled) {
        ensureS16();
        if (resGet('opp', 'stamina') < 25 && resGet('opp', 'budget') > 15 && gameState.rest.opp < 2) restStamina('opp', 'aaram');
        if (resGet('opp', 'budget') < 12 && !gameState.loan.opp && gameState.phase < TOTAL_PHASES) takeLoan('opp', 40);
        if (gameState.crowd.opp < 1 && resGet('opp', 'stamina') > 40) doAction('opp', actCrowd(), 'white');
    }
    return _aiTakeTurnS16(side);
};

// ---- Panels ----
function uiDonor(id) { runUi(actDonor(id)); }
function uiCrowd() { runUi(actCrowd()); }
function uiLoan(amt) { panelMsg = takeLoan('you', amt); updateStatusPanel(); refreshPanel(); }
function uiRest(kind) { panelMsg = restStamina('you', kind); updateStatusPanel(); refreshPanel(); }
function uiBlackSrc(kind) { panelMsg = blackSource('you', kind); updateStatusPanel(); refreshPanel(); }

function renderWhitePanel() {
    ensureS16();
    let h = actionHeader(true);
    h += '<div class="ap-sec"><b>Corporate samarthan</b> - udyogpati ek baar saath aaye to har phase paisa dete hain (sirf usi ke liye).<table class="ap-table"><tr><th>Udyogpati</th><th>Har phase</th><th>Abhi</th><th></th></tr>';
    gameState.donors.forEach(function (d) {
        h += '<tr><td>' + esc(d.name) + '</td><td>' + d.pay + ' Cr</td><td>' + (d.owner ? esc(sideName(d.owner)) : 'khaali') + '</td><td>' +
            (d.owner ? '' : '<button class="ap-btn" onclick="uiDonor(\'' + d.id + '\')">Baat karo (' + actDonor(d.id).cost + ' Cr)</button>') + '</td></tr>';
    });
    h += '</table></div>';
    h += '<div class="ap-sec"><b>Crowdfunding</b> - janta se chanda, hawa bhi badhta hai. Is phase mein ' + gameState.crowd.you + ' / 2.<br>Stamina 6%<br>' +
        '<button class="ap-btn" onclick="uiCrowd()">Chanda abhiyan chalao</button></div>';
    const L = gameState.loan.you;
    h += '<div class="ap-sec"><b>Bank Loan</b> - 25% byaj, agle phase mein katega.' + (L ? '<br>Abhi baaki: <b>' + L.due + ' Cr</b>' : '') + '<br>' +
        [20, 40, 60].map(function (a) { return '<button class="ap-btn" style="margin-right:6px" onclick="uiLoan(' + a + ')">' + a + ' Cr loan</button>'; }).join('') + '</div>';
    return h + '<div class="ap-note">Har phase ' + PHASE_FUNDING + ' Cr milte hain, bacha hua judta hai.</div>';
}

function renderBlackPanel() {
    ensureS16();
    const g = gameState;
    let h = actionHeader(false);
    h += '<div class="ap-sec"><b>Black Fund jutao</b> - is phase mein ' + g.counters.you.black + ' / ' + LIMITS.black + '. Risk meter: <b>' + Math.round(g.risk.you) +
        '</b> (har round raid ya EC notice ka chance: <b>' + Math.round(raidChance(g.risk.you) * 100) + '%</b>)<br>' +
        '<button class="ap-btn" style="margin:3px 6px 3px 0" onclick="uiBlackFund()">Chanda (15-30 Cr, risk 8)</button>';
    Object.keys(BLACK_SRC).forEach(function (k) {
        const b = BLACK_SRC[k];
        h += '<button class="ap-btn" style="margin:3px 6px 3px 0" onclick="uiBlackSrc(\'' + k + '\')">' + b.name + ' (' + b.lo + '-' + b.hi + ' Cr, risk ' + b.risk + ', stamina ' + b.stamina + '%)</button>';
    });
    return h + '</div><div class="ap-note">Black fund se kiya kharch 1.5x asar deta hai par risk badhata hai, aur rival ke jasoos ko sabut mil sakta hai. Kharch ke liye action panel mein "Black Fund" chuno.</div>';
}

function renderStaminaPanel() {
    ensureS16();
    let h = actionHeader(false);
    h += '<div class="ap-sec"><b>Stamina badhao</b> - har round ke baad apne aap 100% ho jata hai.<br>Aaram (3 Cr): +20% (phase mein 2 baar)<br>Energy team - doctor + helicopter (8 Cr): +35% (phase mein 1 baar)<br>' +
        '<button class="ap-btn" style="margin:3px 6px 3px 0" onclick="uiRest(\'aaram\')">Aaram karo</button>' +
        '<button class="ap-btn" onclick="uiRest(\'team\')">Energy team bulao</button></div>';
    return h + '<div class="ap-note">Is phase mein ab tak ' + gameState.rest.you + ' aaram point.</div>';
}

const _renderPanelS16 = renderPanel;
renderPanel = function (name) {
    if (name === 'White Fund') return renderWhitePanel();
    if (name === 'Black Fund') return renderBlackPanel();
    if (name === 'Stamina') return renderStaminaPanel();
    return _renderPanelS16(name);
};

// ================= STAGE 17: VIP SEATS, MANIFESTO, POACHING, DM/SP =================

const FIRST_NAMES = ['Arjun', 'Meera', 'Vikram', 'Sunita', 'Rohit', 'Kavita', 'Imran', 'Pooja', 'Harpreet', 'Lakshmi', 'Devendra', 'Anjali', 'Sanjay', 'Nisha', 'Rakesh', 'Farida'];
const LAST_NAMES = ['Verma', 'Rao', 'Singh', 'Iyer', 'Khan', 'Patil', 'Das', 'Gill', 'Nair', 'Mishra', 'Reddy', 'Banerjee'];

function randName() {
    return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + ' ' + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

const PROMISES = [
    { id: 'bijli', name: 'Muft bijli (200 unit)', group: 'Garib / Madhyam varg', issue: 'Mehngai', amt: 0.08, cost: 6 },
    { id: 'bus', name: 'Mahilaon ko muft bus yatra', group: 'Mahila', nat: 0.03, hawa: 2, cost: 4 },
    { id: 'karz', name: 'Kisan karz maafi', group: 'Kisan', issue: 'Kisan', amt: 0.1, cost: 8 },
    { id: 'msp', name: 'MSP ki guarantee', group: 'Kisan', issue: 'Kisan', amt: 0.07, cost: 5 },
    { id: 'bhatta', name: 'Berozgari bhatta', group: 'Yuva', issue: 'Rozgaar', amt: 0.08, cost: 6 },
    { id: 'naukri', name: '10 lakh sarkari naukri', group: 'Yuva', issue: 'Rozgaar', amt: 0.1, cost: 8 },
    { id: 'ration', name: 'Muft ration', group: 'Garib', issue: 'Mehngai', amt: 0.06, cost: 4 },
    { id: 'infra', name: 'Sadak-pani-bijli package', group: 'Gaon / Shehar', issue: 'Vikas', amt: 0.08, cost: 5 },
    { id: 'pension', name: 'Buzurgon ki pension', group: 'Buzurg', nat: 0.03, cost: 4 },
    { id: 'tax', name: 'Tax raahat (vyapari)', group: 'Vyapari', issue: 'Vikas', amt: 0.04, nat: 0.02, cost: 4 }
];

function ensureS17() {
    if (!gameState.vips) gameState.vips = { you: {}, opp: {} };
    if (!gameState.manifesto) gameState.manifesto = { you: [], opp: [] };
    if (!gameState.poach) gameState.poach = { phase: 0, you: [], opp: [] };
    if (!gameState.officials) gameState.officials = { you: false, opp: false };
}

const _freshActionStateS17 = freshActionState;
freshActionState = function () {
    _freshActionStateS17();
    gameState.vips = { you: {}, opp: {} };
    gameState.manifesto = { you: [], opp: [] };
    gameState.poach = { phase: 0, you: [], opp: [] };
    gameState.officials = { you: false, opp: false };
};

// Naya phase: DM/SP phir se, manifesto ke vaadon ka kharch
const _nextPhaseResetS17 = nextPhaseActionReset;
nextPhaseActionReset = function () {
    _nextPhaseResetS17();
    ensureS17();
    gameState.officials = { you: false, opp: false };
    ['you', 'opp'].forEach(function (side) {
        resSet(side, 'budget', Math.max(0, resGet(side, 'budget') - promiseBurden(side)));
    });
    gameState.phaseStartBudget = Math.max(1, Math.min(gameState.phaseStartBudget, gameState.budget) || gameState.budget);
};

// ---- VIP seats ----
function actVip(key, name) {
    const s = resultModel.seats[key];
    return {
        type: 'VIP Seat', st: s ? s.st : null, key: key, cost: 3, stamina: 0,
        check: function (side) {
            ensureS17();
            if (!s) return 'Seat nahi mili.';
            if (gameState.vips[side][key]) return 'Yeh seat pehle se VIP hai.';
            return Object.keys(gameState.vips[side]).length >= 8 ? 'Zyada se zyada 8 VIP seats.' : null;
        },
        apply: function (m, side) {
            const nm = name || randName();
            gameState.vips[side][key] = { name: nm, st: s.st, pc: s.pc, phase: s.phase, won: null };
            addBoost(side, 'seat', key, 0.15);
            return { text: sideName(side) + ' ne ' + nm + ' ko ' + s.pc + ' (' + s.st + ') se VIP ummeedwar banaya.', good: true, hawa: 0 };
        }
    };
}

function applyVipResults() {
    ensureS17();
    (gameState.lastRows || []).forEach(function (r) {
        const key = r.state + '|' + r.seat;
        ['you', 'opp'].forEach(function (side) {
            const v = gameState.vips[side][key];
            if (!v || v.won !== null) return;
            const won = resultModel.sideOf[r.winner] === side;
            v.won = won;
            shiftHawa(side, won ? 2 : -2, 'VIP seat');
            if (side === 'you') pushNews(v.name + ' (' + r.seat + ') ' + (won ? 'jeete!' : 'haare.'));
        });
    });
}

const _endPhaseS17 = endPhase;
endPhase = function () {
    _endPhaseS17();
    applyVipResults();
};

// ---- Manifesto ----
function promiseOf(id) {
    let r = null;
    PROMISES.forEach(function (p) { if (p.id === id) r = p; });
    return r;
}

function promiseBurden(side) {
    ensureS17();
    let t = 0;
    gameState.manifesto[side].forEach(function (id) { t += promiseOf(id).cost; });
    return t;
}

function declarePromise(side, id) {
    ensureS17();
    const p = promiseOf(id);
    if (gameState.manifesto[side].indexOf(id) !== -1) return { ok: false, good: false, text: 'Yeh vaada pehle se manifesto mein hai.' };
    if (gameState.manifesto[side].length >= 4) return { ok: false, good: false, text: 'Manifesto mein zyada se zyada 4 vaade.' };
    gameState.manifesto[side].push(id);
    if (p.issue) addBoost(side, 'issue', p.issue, p.amt);
    if (p.nat) addBoost(side, 'national', p.nat);
    if (p.hawa) shiftHawa(side, p.hawa, 'Manifesto');
    return { ok: true, good: true, text: sideName(side) + ' ne vaada kiya: ' + p.name + ' (' + p.group + ').' };
}

// ---- Poaching ----
function ensurePoach() {
    ensureS17();
    if (gameState.poach.phase === gameState.phase || !resultModel) return;
    gameState.poach.phase = gameState.phase;
    ['you', 'opp'].forEach(function (side) {
        const keys = shuffled(Object.keys(resultModel.seats).filter(function (k) { return resultModel.seats[k].phase === gameState.phase; })).slice(0, 3);
        gameState.poach[side] = keys.map(function (k) {
            const s = resultModel.seats[k];
            return { name: randName(), key: k, st: s.st, pc: s.pc, price: 5 + Math.floor(Math.random() * 10), taken: false };
        });
    });
}

function actPoach(side, idx) {
    ensurePoach();
    const o = gameState.poach[side][idx];
    return {
        type: 'Poaching', st: o ? o.st : null, key: o ? o.key : null, cost: o ? o.price : 0, stamina: 3,
        check: function () { return !o ? 'Yeh neta ab uplabdh nahi.' : (o.taken ? 'Yeh neta pehle hi dal badal chuka.' : null); },
        apply: function (m, side2) {
            const sgn = side2 === 'you' ? 1 : -1;
            const rival = otherSide(side2);
            if (Math.random() < Math.max(0.2, Math.min(0.85, 0.55 + sgn * (gameState.hawa || 0) / 300))) {
                o.taken = true;
                addBoost(side2, 'seat', o.key, 0.25);
                addBoost(rival, 'seat', o.key, -0.2);
                if (Object.keys(gameState.vips[side2]).length < 8 && !gameState.vips[side2][o.key]) {
                    gameState.vips[side2][o.key] = { name: o.name, st: o.st, pc: o.pc, phase: gameState.phase, won: null, poached: true };
                }
                return { text: o.name + ' ne ' + o.pc + ' (' + o.st + ') mein dal badal kar ' + sideName(side2) + ' ka daaman thama.', good: true, hawa: 2 };
            }
            return { text: o.name + ' ne ' + sideName(side2) + ' ka offer thukra diya.', good: false, hawa: 0 };
        }
    };
}

// ---- DM / SP ----
function actOfficial(st, kind) {
    const dm = kind === 'DM';
    return {
        type: dm ? 'DM Transfer' : 'SP Transfer', st: st, cost: dm ? 10 : 8, stamina: 4,
        check: function (side) {
            ensureS17();
            return gameState.officials[side] ? 'Is phase mein DM ya SP mein se ek hi badla ja sakta hai.' : null;
        },
        apply: function (m, side) {
            gameState.officials[side] = true;
            addBoost(side, 'state', st, (dm ? 0.12 : 0.1) * m);
            let txt = sideName(side) + ' ne ' + st + ' mein ' + (dm ? 'zila magistrate (DM)' : 'police adhikshak (SP)') + ' apne anukool lagaye.';
            if (Math.random() < 0.35) {
                const out = actCourt('Bhrashtachar', 'senior').apply(1, otherSide(side));
                pushNews('Case: ' + out.text);
                return { text: txt + ' Par bhed khul gaya! ' + out.text, good: false, hawa: -3 };
            }
            return { text: txt, good: true, hawa: 0 };
        }
    };
}

// ---- AI ----
const _aiTakeTurnS17 = aiTakeTurn;
aiTakeTurn = function (side) {
    if (side === 'opp' && AI_CONFIG.enabled && resultModel) {
        ensureS17();
        ensurePoach();
        if (gameState.round === 1) {
            if (gameState.manifesto.opp.length < 3) {
                shuffled(PROMISES).slice(0, 3 - gameState.manifesto.opp.length).forEach(function (p) { declarePromise('opp', p.id); });
            }
            Object.keys(resultModel.seats).filter(function (k) {
                return resultModel.seats[k].phase === gameState.phase && !gameState.vips.opp[k];
            }).sort(function (a, b) { return resultModel.seats[b].wOpp - resultModel.seats[a].wOpp; }).slice(0, 2).forEach(function (k) {
                if (resGet('opp', 'budget') > 20) doAction('opp', actVip(k, randName()), 'white');
            });
            const pool = gameState.poach.opp.map(function (o, i) { return i; }).filter(function (i) { return !gameState.poach.opp[i].taken; });
            if (pool.length && Math.random() < 0.4 && resGet('opp', 'budget') > 25) doAction('opp', actPoach('opp', pool[0]), 'white');
        }
        if (!gameState.officials.opp && gameState.round <= 2 && resGet('opp', 'budget') > 25 && Math.random() < 0.3) {
            const sts = activeStates();
            if (sts.length) doAction('opp', actOfficial(sts[0].st, Math.random() < 0.5 ? 'DM' : 'SP'), 'white');
        }
    }
    return _aiTakeTurnS17(side);
};

// ---- Panels ----
function setVipState(v) { uiSel.vstate = v; uiSel.vseat = ''; refreshPanel(); }
function setVipSeat(v) { uiSel.vseat = v; refreshPanel(); }

function uiVipGo() {
    if (!uiSel.vseat) return;
    const el = document.getElementById('vip-name');
    runUi(actVip(uiSel.vseat, el && el.value ? el.value : ''));
}

function uiVipAuto() {
    ensureS17();
    const keys = Object.keys(resultModel.seats).filter(function (k) { return !gameState.vips.you[k] && !seatResults[k]; })
        .sort(function (a, b) { return resultModel.seats[b].wYou - resultModel.seats[a].wYou; }).slice(0, 6);
    let n = 0;
    keys.forEach(function (k) { if (doAction('you', actVip(k, randName()), gameState.fundMode).ok) n++; });
    panelMsg = { ok: n > 0, good: n > 0, text: n + ' VIP seat apne aap chuni gayi.' };
    updateStatusPanel();
    refreshPanel();
}

function renderVipPanel() {
    ensureS17();
    const states = Object.keys(stateSeatsData).filter(function (st) {
        return Object.keys(resultModel.seats).some(function (k) { return resultModel.seats[k].st === st; });
    });
    const all = [];
    Object.keys(resultModel.seats).forEach(function (k) { if (all.indexOf(resultModel.seats[k].st) === -1) all.push(resultModel.seats[k].st); });
    all.sort();
    if (!uiSel.vstate || all.indexOf(uiSel.vstate) === -1) uiSel.vstate = all[0];
    const seats = Object.keys(resultModel.seats).filter(function (k) { return resultModel.seats[k].st === uiSel.vstate; })
        .sort(function (a, b) { return resultModel.seats[a].pc < resultModel.seats[b].pc ? -1 : 1; });
    if (!uiSel.vseat || seats.indexOf(uiSel.vseat) === -1) uiSel.vseat = seats[0];
    let h = actionHeader(true);
    h += '<div class="ap-sec"><b>VIP Seats</b> - bade chehron ko khaas seat se utaro (3 Cr). Seat par badhat milti hai; jeete to hawa +2, haare to -2. Kisi bhi phase ki seat chun sakte ho.<br>' +
        '<select class="ap-sel" onchange="setVipState(this.value)">' + all.map(function (st) {
            return '<option value="' + esc(st) + '"' + (st === uiSel.vstate ? ' selected' : '') + '>' + esc(st) + '</option>';
        }).join('') + '</select> ' +
        '<select class="ap-sel" onchange="setVipSeat(this.value)">' + seats.map(function (k) {
            return '<option value="' + esc(k) + '"' + (k === uiSel.vseat ? ' selected' : '') + '>' + esc(resultModel.seats[k].pc) + ' (Phase ' + resultModel.seats[k].phase + ')</option>';
        }).join('') + '</select><br>Netaa ka naam: <input id="vip-name" class="ap-sel" placeholder="khali chhodo to apne aap"> ' +
        '<button class="ap-btn" onclick="uiVipGo()">VIP seat banao</button> ' +
        '<button class="ap-btn" onclick="uiVipAuto()">Apne aap chuno (6 seats)</button></div>';
    const mine = Object.keys(gameState.vips.you);
    if (mine.length) {
        h += '<table class="ap-table"><tr><th>Netaa</th><th>Seat</th><th>Phase</th><th>Natija</th></tr>' + mine.map(function (k) {
            const v = gameState.vips.you[k];
            return '<tr><td>' + esc(v.name) + '</td><td>' + esc(v.pc) + ' (' + esc(v.st) + ')</td><td>' + v.phase + '</td><td>' + (v.won === null ? '-' : (v.won ? 'jeete' : 'haare')) + '</td></tr>';
        }).join('') + '</table>';
    }
    return h + _renderPanelS17Orig('VIP Seats');
}

function uiPromise(id) { panelMsg = declarePromise('you', id); updateStatusPanel(); refreshPanel(); }

function renderManifestoPanel() {
    ensureS17();
    let h = actionHeader(false);
    h += '<div class="ap-note">Manifesto: zyada se zyada 4 vaade. Har vaada ek varg ko khush karta hai aur us mudde ki seats par asar deta hai, par <b>har phase kharch</b> hota hai. Abhi har phase ka bojh: <b>' + promiseBurden('you') + ' Cr</b></div>';
    h += '<table class="ap-table"><tr><th>Vaada</th><th>Varg</th><th>Kharch/phase</th><th></th></tr>' + PROMISES.map(function (p) {
        const on = gameState.manifesto.you.indexOf(p.id) !== -1;
        return '<tr><td>' + esc(p.name) + '</td><td>' + esc(p.group) + '</td><td>' + p.cost + ' Cr</td><td>' +
            (on ? 'kiya hua' : '<button class="ap-btn" onclick="uiPromise(\'' + p.id + '\')">Ghoshna</button>') + '</td></tr>';
    }).join('') + '</table>';
    return h;
}

function uiPoach(i) { runUi(actPoach('you', i)); }

function renderPoachPanel() {
    ensurePoach();
    let h = actionHeader(true);
    h += '<div class="ap-sec"><b>Poaching</b> - opponent ke netaa ko paise dekar apne saath lo (is phase ki seats). Safal hone par seat par badhat aur wo VIP ban jata hai.<table class="ap-table"><tr><th>Netaa</th><th>Seat</th><th>Daam</th><th></th></tr>' +
        gameState.poach.you.map(function (o, i) {
            return '<tr><td>' + esc(o.name) + '</td><td>' + esc(o.pc) + ' (' + esc(o.st) + ')</td><td>' + o.price + ' Cr</td><td>' +
                (o.taken ? 'saath aa gaya' : '<button class="ap-btn" onclick="uiPoach(' + i + ')">Kharido</button>') + '</td></tr>';
        }).join('') + '</table></div>';
    return h + _renderPanelS17Orig('Poaching');
}

function uiOfficial(kind) { if (uiSel.state) runUi(actOfficial(uiSel.state, kind)); }

function renderOfficialPanel() {
    ensureS17();
    let h = actionHeader(true);
    if (!activeStates().length) return h + '<div class="ap-note">Is phase mein koi seat nahi.</div>';
    h += '<div class="ap-sec"><b>Zila Magistrate (DM) / Police Adhikshak (SP) ka tabadla</b> - is phase mein sirf ek baar, DM ya SP mein se ek. State mein badhat milti hai, par <b>35% bhed khulne ka khatra</b> hai, tab opponent court mein case karega.<br>' +
        stateSelectHtml() + '<br>DM: ' + actOfficial(uiSel.state, 'DM').cost + ' Cr | SP: ' + actOfficial(uiSel.state, 'SP').cost + ' Cr<br>' +
        '<button class="ap-btn" onclick="uiOfficial(\'DM\')">DM badlo</button> <button class="ap-btn" onclick="uiOfficial(\'SP\')">SP badlo</button>' +
        (gameState.officials.you ? '<br><span class="ap-note">Is phase mein aap tabadla kar chuke.</span>' : '') + '</div>';
    return h;
}

const _renderPanelS17Orig = renderPanel;
renderPanel = function (name) {
    if (name === 'VIP Seats') return renderVipPanel();
    if (name === 'Manifesto') return renderManifestoPanel();
    if (name === 'Poaching') return renderPoachPanel();
    if (name === 'Transfer DM/SP') return renderOfficialPanel();
    return _renderPanelS17Orig(name);
};

// ================= STAGE 18: AI LEVELS (asli farq: Easy, Normal, Hard) =================

// skip = chaal chhodne ka mauka, ban = jo kaam ye level karta hi nahi, noExtras = loan/aaram nahi
Object.assign(AI_LEVELS.easy, { skip: 0.5, ban: 'VIP|Poaching|Transfer|Defence|Spy|EC Shikayat|Court|Candidate|Karyakarta|Local Guru|Star|Debate', noExtras: true, maxPromises: 1, maxActions: 3 });
Object.assign(AI_LEVELS.normal, { skip: 0.1, ban: '', noExtras: false, maxPromises: 3 });
Object.assign(AI_LEVELS.hard, { skip: 0, ban: '', noExtras: false, maxPromises: 4 });

const _doActionS18 = doAction;
doAction = function (side, a, fund) {
    if (side === 'opp' && AI_CONFIG.enabled) {
        if (AI_CONFIG.ban && new RegExp(AI_CONFIG.ban).test(a.type)) return { ok: false, good: false, text: 'AI ne chhoda' };
        if (Math.random() < (AI_CONFIG.skip || 0)) return { ok: false, good: false, text: 'AI ne chhoda' };
    }
    return _doActionS18(side, a, fund);
};

const _takeLoanS18 = takeLoan;
takeLoan = function (side, amt) {
    if (side === 'opp' && AI_CONFIG.noExtras) return { ok: false, good: false, text: 'AI ne chhoda' };
    return _takeLoanS18(side, amt);
};

const _restStaminaS18 = restStamina;
restStamina = function (side, kind) {
    if (side === 'opp' && AI_CONFIG.noExtras) return { ok: false, good: false, text: 'AI ne chhoda' };
    return _restStaminaS18(side, kind);
};

const _declarePromiseS18 = declarePromise;
declarePromise = function (side, id) {
    if (side === 'opp' && AI_CONFIG.enabled) {
        ensureS17();
        if (gameState.manifesto.opp.length >= (AI_CONFIG.maxPromises || 3)) return { ok: false, good: false, text: 'AI ne chhoda' };
    }
    return _declarePromiseS18(side, id);
};

// OPP panel mein AI ka level dikhao
const _renderPanelS18 = renderPanel;
renderPanel = function (name) {
    const h = _renderPanelS18(name);
    if (name === 'Opponent Bank') {
        return h + '<div class="ap-note">Opponent ka level: <b>' + String(gameState.aiLevel || 'normal').toUpperCase() + '</b> | andaaz: ' + esc(gameState.aiStyle || 'balanced') + '</div>';
    }
    return h;
};

// ================= GAME ENGINE (Phases, Rounds, Bars) =================

const TOTAL_PHASES = 7;
const PHASE_FUNDING = 130;

let gameState = {
    phase: 1,
    round: 1,
    stamina: 100,
    turnout: 0,
    budget: PHASE_FUNDING,
    phaseStartBudget: PHASE_FUNDING,
    blackFund: 0,
    phaseEnded: false,
    seats: { you: 0, opp: 0 }
};

function initGame() {
    assignPhases();
    gameState = {
        phase: 1,
        round: 1,
        stamina: 100,
        turnout: 0,
        budget: PHASE_FUNDING,
        phaseStartBudget: PHASE_FUNDING,
        blackFund: 0,
        phaseEnded: false,
        seats: { you: 0, opp: 0 }
    };
    seatResults = {};
    gameState.partyTotals = {};
    gameState.boost = { you: { seat: {}, state: {}, national: 0, issue: {} }, opp: { seat: {}, state: {}, national: 0, issue: {} } };
    freshActionState();
    applyAiLevel(readSelectedLevel(), undefined, true);
    buildResultModel();
    updateSeatStatusBox();
    const btn = document.getElementById('wr-round-btn');
    btn.disabled = false;
    updateStatusPanel();
    if (allLayer) {
        refreshStyles();
        updateMapTitle();
    }
}

function barColor(pct) {
    if (pct > 50) return '#22c55e';
    if (pct > 25) return '#facc15';
    return '#ef4444';
}

function setBar(fillId, valId, pct, text, color) {
    const fill = document.getElementById(fillId);
    fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
    fill.style.background = color;
    document.getElementById(valId).innerText = text;
}

function updateStatusPanel() {
    const g = gameState;
    document.getElementById('sp-phase-title').innerText = 'Phase ' + g.phase + ' / ' + TOTAL_PHASES;

    setBar('sp-stamina-fill', 'sp-stamina-val', g.stamina, g.stamina + '%', barColor(g.stamina));

    const turnoutColor = g.turnout >= 100 ? '#22c55e' : '#38bdf8';
    setBar('sp-turnout-fill', 'sp-turnout-val', g.turnout, g.turnout + '%', turnoutColor);

    const budgetPct = g.phaseStartBudget > 0 ? (g.budget / g.phaseStartBudget) * 100 : 0;
    setBar('sp-budget-fill', 'sp-budget-val', budgetPct, g.budget + ' Cr', barColor(budgetPct));
    document.getElementById('sp-black-val').innerText = 'Black Fund: ' + g.blackFund + ' Cr | Risk: ' + (g.risk ? Math.round(g.risk.you) : 0);
    updateHawaBar();

    renderLeadBoxes();

    const btn = document.getElementById('wr-round-btn');
    if (!g.phaseEnded) {
        btn.innerText = 'Phase ' + g.phase + ' - Round ' + g.round + ' [GO]';
    }
}

// Round button: round khatm, turnout badhao
function advanceRound() {
    if (gameState.phaseEnded) {
        // Phase khatm ho chuka hai: natija dobara kholo (ya agar result page na khule to seedha aage badho)
        if (gameState.pendingNext) {
            gameState.pendingNext = false;
            proceedAfterResults();
        } else if (gameState.lastRows) {
            openResultsSafely(gameState.phase, gameState.lastRows);
        }
        return;
    }
    if (gameState.eventPending) return;

    // Opponent (AI) ki baari
    const aiLines = aiTakeTurn('opp');
    showAiBanner(aiLines);

    // Round ke beech koi ghatna?
    const ev = rollRoundEvent();
    if (ev) {
        startEvent(ev);
        return;
    }
    finishRound();
}

// Round ka baaki hissa: turnout badhao, chhapa, hawa, phase ka ant
function finishRound() {
    const add = 20 + Math.floor(Math.random() * 11);
    gameState.turnout = Math.min(100, gameState.turnout + add);
    showRiskBanner(resolveRisk());
    gameState.hawa = (gameState.hawa || 0) * 0.92;

    if (gameState.turnout >= 100) {
        updateStatusPanel();
        endPhase();
        return;
    }

    gameState.round++;
    resetStars();
    updateStatusPanel();
}

function endPhase() {
    gameState.phaseEnded = true;
    gameState.pendingNext = false;

    const rows = computePhaseResults(gameState.phase);
    gameState.lastRows = rows;
    phaseMomentum(rows);

    const btn = document.getElementById('wr-round-btn');
    btn.disabled = false;
    btn.innerText = 'Phase ' + gameState.phase + ' ka natija dekho';

    updateStatusPanel();
    updateSeatStatusBox();
    if (allLayer) refreshStyles();
    openResultsSafely(gameState.phase, rows);
}

// Result page kholo; kuch galat ho to bhi game atke nahi
function openResultsSafely(phase, rows) {
    try {
        showResultsPage(phase, rows);
    } catch (e) {
        console.error(e);
        alert('Result page nahi khul paya. Yeh line Claude ko bhejo: ' + e.message);
        gameState.pendingNext = true;
        document.getElementById('wr-round-btn').innerText = 'Next Phase >>';
    }
}

function startNextPhase() {
    document.getElementById('phase-modal').classList.add('hidden');

    gameState.phase++;
    gameState.round = 1;
    gameState.turnout = 0;
    gameState.stamina = 100;
    gameState.budget += PHASE_FUNDING;
    gameState.phaseStartBudget = gameState.budget;
    gameState.phaseEnded = false;
    nextPhaseActionReset();
    saveGame(true);

    document.getElementById('wr-round-btn').disabled = false;
    updateStatusPanel();
    if (allLayer) {
        refreshStyles();
        if (selectedState === null) updateMapTitle();
    }
}

function finishGame() {
    document.getElementById('phase-modal').classList.add('hidden');
    const btn = document.getElementById('wr-round-btn');
    btn.innerText = 'Election Over';
    btn.disabled = true;
    startFinalFlow();
}

// Sirf test ke liye (Stage 4 mein asli actions aane par hat jayenge)
function testSpend() {
    gameState.budget = Math.max(0, gameState.budget - 10);
    updateStatusPanel();
}

function testTire() {
    gameState.stamina = Math.max(0, gameState.stamina - 15);
    updateStatusPanel();
}

// ================= STAGE 19: EXIT POLL, COUNTING DAY, RESULT ANALYSIS + DESH KA MAP =================
// Flow: startFinalFlow -> fsExitPoll (naya) -> fsCounting (naya, live) -> s19Analysis (naya) -> fsResult (purana, Stage 20 mein badlega)

const S19_COL = { you: '#22c55e', opp: '#ef4444', oth: '#94a3b8' };
const s19 = { timer: null, map: null, layers: {}, byState: {}, selKey: null, mode: 'party', cs: null, agg: null, polls: null, stateList: [] };

const S19_AGENCIES = [
    { n: 'Bharat Samachar x Janmat', bias: 0.6 },
    { n: 'Desh Tak Pulse', bias: 0.25 },
    { n: 'Rashtra TV Sarvekshan', bias: 1.0 },
    { n: 'Lok Manch DataPoint', bias: 0.4 },
    { n: 'News Live Jan Raay', bias: 0.8 },
    { n: 'Satya Sutra Research', bias: 0.15 }
];

function s19Style() {
    if (document.getElementById('s19-style')) return;
    const st = document.createElement('style');
    st.id = 's19-style';
    st.textContent = `
.s19-screen{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:500;overflow-y:auto;color:#e2e8f0;background:radial-gradient(circle at 20% 0%,#16233f 0%,#0b0f19 55%);animation:s19Fade .45s ease;}
@keyframes s19Fade{from{opacity:0}to{opacity:1}}
@keyframes s19Pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
@keyframes s19Slide{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:none}}
@keyframes s19Grow{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes s19Pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08)}100%{transform:none;opacity:1}}
@keyframes s19Glow{0%,100%{box-shadow:0 0 6px rgba(250,204,21,.3)}50%{box-shadow:0 0 22px rgba(250,204,21,.85)}}
.s19-wrap{max-width:1120px;margin:0 auto;padding:14px 14px 40px;}
.s19-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;border-bottom:2px solid #ff9933;padding-bottom:10px;margin-bottom:14px;}
.s19-head h1{font-size:1.5rem;color:#ff9933;letter-spacing:1px;margin:0;}
.s19-sub{color:#94a3b8;font-size:.8rem;margin-top:2px;}
.s19-live{display:inline-flex;align-items:center;gap:6px;background:#7f1d1d;color:#fff;font-weight:bold;font-size:.75rem;padding:4px 10px;border-radius:20px;letter-spacing:1px;}
.s19-live i{width:9px;height:9px;border-radius:50%;background:#ef4444;display:inline-block;animation:s19Pulse 1s infinite;}
.s19-btn{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:bold;cursor:pointer;font-size:.95rem;transition:transform .15s,filter .15s;}
.s19-btn:hover{transform:translateY(-2px);filter:brightness(1.15);}
.s19-btn.go{background:linear-gradient(135deg,#16a34a,#15803d);animation:s19Glow 1.8s infinite;}
.s19-btn.ghost{background:#1e293b;border:1px solid #475569;}
.s19-btn:disabled{opacity:.45;cursor:default;transform:none;animation:none;}
.s19-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;}
.s19-card{flex:1;min-width:220px;background:#131b2e;border:1px solid #334155;border-radius:12px;padding:12px 14px;}
.s19-card h3{margin:0 0 8px;font-size:.95rem;color:#38bdf8;}
.s19-card.you{border-top:4px solid #22c55e;}.s19-card.opp{border-top:4px solid #ef4444;}.s19-card.oth{border-top:4px solid #94a3b8;}
.s19-big{font-size:2.6rem;font-weight:bold;color:#fff;line-height:1.1;animation:s19Pop .5s;}
.s19-small{color:#94a3b8;font-size:.78rem;}
.s19-wl{display:flex;gap:14px;margin:4px 0 8px;font-size:.82rem;}.s19-wl b{font-size:1.15rem;color:#fff;}
.s19-bar{position:relative;height:14px;background:#0d1322;border:1px solid #334155;border-radius:7px;overflow:visible;margin:6px 0;}
.s19-bar>div.f{height:100%;border-radius:7px;width:0;transition:width .3s linear;}
.s19-bar>i.mk{position:absolute;top:-4px;bottom:-4px;width:2px;background:#facc15;}
.s19-bar.grow>div.f{animation:s19Grow .9s ease;}
.s19-table{width:100%;border-collapse:collapse;font-size:.85rem;}
.s19-table th{color:#94a3b8;font-weight:600;text-align:left;padding:6px;border-bottom:1px solid #334155;font-size:.75rem;text-transform:uppercase;}
.s19-table td{padding:6px;border-bottom:1px solid #1f293d;vertical-align:middle;}
.s19-table tr.clk{cursor:pointer;}.s19-table tr.clk:hover{background:#1b2640;}
.s19-dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:middle;}
.s19-chip{display:inline-block;padding:2px 9px;border-radius:12px;font-size:.72rem;font-weight:bold;}
.s19-chip.g{background:#14532d;color:#86efac;}.s19-chip.r{background:#7f1d1d;color:#fca5a5;}.s19-chip.y{background:#713f12;color:#fde047;}
.s19-feed{max-height:330px;overflow:hidden;}
.s19-feed .it{padding:7px 10px;border-left:4px solid #475569;background:#0f172a;margin-bottom:5px;border-radius:0 6px 6px 0;font-size:.82rem;}
.s19-feed .it.new{animation:s19Slide .35s;}
.s19-feed .it.close{background:#2a2410;}
.s19-feed .it.brk{background:#4a1d1d;border-left-color:#facc15;font-weight:bold;}
.s19-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.s19-tab{background:#1e293b;color:#cbd5e1;border:1px solid #334155;border-radius:20px;padding:7px 16px;cursor:pointer;font-weight:600;font-size:.85rem;}
.s19-tab.on{background:#2563eb;color:#fff;border-color:#60a5fa;}
.s19-mapbox{display:flex;gap:12px;flex-wrap:wrap;}
#s19-map{flex:3;min-width:300px;height:64vh;min-height:360px;background:#0a1020;border:1px solid #334155;border-radius:12px;}
.s19-side{flex:1;min-width:240px;}
.s19-ctl{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
.s19-ctl input,.s19-ctl select{background:#1e293b;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px 10px;font-size:.88rem;flex:1;min-width:130px;}
.s19-leg div{font-size:.76rem;margin:2px 0;}
.s19-seg{display:flex;height:12px;border-radius:6px;overflow:hidden;background:#0d1322;min-width:90px;}
.s19-seg i{display:block;height:100%;}
@media (max-width:640px){.s19-big{font-size:2rem}.s19-head h1{font-size:1.15rem}}
`;
    document.head.appendChild(st);
}

function s19Show(html) {
    s19Style();
    if (s19.timer) { clearInterval(s19.timer); s19.timer = null; }
    if (s19.map) { try { s19.map.remove(); } catch (e) { } s19.map = null; }
    let el = document.getElementById('final-screen');
    if (!el) {
        el = document.createElement('div');
        el.id = 'final-screen';
        document.body.appendChild(el);
    }
    el.className = 's19-screen';
    el.innerHTML = '<div class="s19-wrap">' + html + '</div>';
    el.scrollTop = 0;
}

// ---- chhote helpers ----
function s19SideOf(party) {
    return (resultModel && resultModel.sideOf[party]) || 'oth';
}

function s19Label(side) {
    if (side === 'oth') return 'Others';
    const n = sideName(side);
    return sideParties(side).length > 1 ? n + ' gathbandhan' : n;
}

function s19Col(party) {
    return partyColors[party] || '#9ca3af';
}

function s19Votes(v) {
    if (v === null || v === undefined || isNaN(v)) return '-';
    if (v >= 100000) return (v / 100000).toFixed(2) + ' lakh';
    return Number(v).toLocaleString('en-IN');
}

function s19Meta(k) {
    const m = gameState.seatMeta && gameState.seatMeta[k];
    return m || { m: null, mv: null, rs: null, rp: null, rc: '' };
}

function s19Split(k) {
    const i = k.indexOf('|');
    return [k.slice(0, i), k.slice(i + 1)];
}

function s19Majority() {
    return MAJORITY;
}

// ---- Har seat ka antar (margin) aur doosre number ka dal yaad rakho ----
const _computePhaseResultsS19 = computePhaseResults;
computePhaseResults = function (phase) {
    const rows = _computePhaseResultsS19(phase);
    if (!gameState.seatMeta) gameState.seatMeta = {};
    rows.forEach(function (r) {
        const k = r.state + '|' + r.seat;
        const s = resultModel.seats[k];
        if (!s) return;
        const ws = { you: s.wYou, opp: s.wOpp, oth: s.wOth };
        const wside = resultModel.sideOf[r.winner] || 'oth';
        const cand = ['you', 'opp', 'oth'].filter(function (x) { return x !== wside; }).sort(function (a, b) { return ws[b] - ws[a]; });
        const rs = cand[0];
        const rp = rs === 'you' ? s.you : (rs === 'opp' ? s.opp : othersParty(s.st));
        const tv = Math.round(rnd(9, 16) * 100000);
        let mv = Math.round(tv * Math.min(r.margin, 45) / 100 * 0.9);
        if (r.margin < 1) mv = Math.round(rnd(40, 9000));
        gameState.seatMeta[k] = { m: Math.round(r.margin * 10) / 10, mv: Math.max(20, mv), rs: rs, rp: rp, rc: r.recount || '' };
    });
    return rows;
};

// ---- Stacked bar: aapka / opponent / others + bahumat ka nishaan ----
function s19Bar(val, total, color, grow) {
    const pct = total ? Math.min(100, val / total * 100) : 0;
    const mk = (s19Majority() / total * 100).toFixed(2);
    return '<div class="s19-bar' + (grow ? ' grow' : '') + '"><div class="f" style="width:' + pct.toFixed(1) + '%;background:' + color + '"></div><i class="mk" style="left:' + mk + '%"></i></div>';
}

// =====================================================================
// 1) EXIT POLL - poora page, kai agency, alag-alag andaaza
// =====================================================================
function fsExitPoll() {
    s19Style();
    const f = fsState;
    const total = f.total || Object.keys(seatResults).length;
    const MAJ = s19Majority();

    const polls = S19_AGENCIES.map(function (a) {
        const err = a.bias * rnd(-45, 45);
        let y = Math.round(f.y + err + rnd(-10, 10));
        let o = Math.round(f.o - err * 0.7 + rnd(-10, 10));
        y = Math.max(0, Math.min(total, y));
        o = Math.max(0, Math.min(total - y, o));
        const x = total - y - o;
        const w = Math.round(rnd(8, 16));
        const rg = function (v) { return [Math.max(0, v - w), Math.min(total, v + w)]; };
        let verdict = ['y', 'Trishanku (kisi ko bahumat nahi)'];
        if (y >= MAJ) verdict = ['g', 'Aapko bahumat'];
        else if (o >= MAJ) verdict = ['r', 'Opponent ko bahumat'];
        return { n: a.n, y: y, o: o, x: x, ry: rg(y), ro: rg(o), rx: rg(x), v: verdict };
    });
    s19.polls = polls;
    const avg = function (key) { return Math.round(polls.reduce(function (t, p) { return t + p[key]; }, 0) / polls.length); };
    const ay = avg('y'), ao = avg('o'), ax = Math.max(0, total - ay - ao);

    let rows = '';
    polls.forEach(function (p, i) {
        rows += '<tr style="animation:s19Slide .4s ' + (i * 0.12).toFixed(2) + 's both">' +
            '<td><b>' + esc(p.n) + '</b></td>' +
            '<td style="color:#86efac">' + p.ry[0] + ' - ' + p.ry[1] + '</td>' +
            '<td style="color:#fca5a5">' + p.ro[0] + ' - ' + p.ro[1] + '</td>' +
            '<td style="color:#cbd5e1">' + p.rx[0] + ' - ' + p.rx[1] + '</td>' +
            '<td><span class="s19-chip ' + p.v[0] + '">' + p.v[1] + '</span></td></tr>';
    });

    s19Show(
        '<div class="s19-head"><div><h1>EXIT POLL</h1><div class="s19-sub">Matdaan khatm - kai agencies ke andaaze</div></div>' +
        '<span class="s19-live"><i></i>BREAKING</span></div>' +

        '<div class="s19-card" style="margin-bottom:12px"><h3>Poll of Polls (sabka ausat)</h3>' +
        '<div class="s19-row" style="margin-bottom:0">' +
        '<div style="flex:1;min-width:200px"><div class="s19-small">' + esc(s19Label('you')) + '</div><div class="s19-big" style="color:#86efac">' + ay + '</div>' + s19Bar(ay, total, S19_COL.you, true) + '</div>' +
        '<div style="flex:1;min-width:200px"><div class="s19-small">' + esc(s19Label('opp')) + '</div><div class="s19-big" style="color:#fca5a5">' + ao + '</div>' + s19Bar(ao, total, S19_COL.opp, true) + '</div>' +
        '<div style="flex:1;min-width:200px"><div class="s19-small">Others</div><div class="s19-big" style="color:#cbd5e1">' + ax + '</div>' + s19Bar(ax, total, S19_COL.oth, true) + '</div>' +
        '</div><div class="s19-small">Peeli line = bahumat ka aankda (' + MAJ + ' / ' + total + ')</div></div>' +

        '<div class="s19-card" style="overflow-x:auto"><h3>Agency-wise exit poll</h3>' +
        '<table class="s19-table"><tr><th>Agency</th><th>Aap</th><th>Opponent</th><th>Others</th><th>Nateeja</th></tr>' + rows + '</table></div>' +

        '<div class="s19-small" style="margin:10px 0">Exit poll sirf andaza hote hain. Kai baar agencies galat nikalti hain. Asli tasveer counting par saaf hogi.</div>' +
        '<div style="text-align:center"><button class="s19-btn go" onclick="fsCounting()">Counting Day shuru karo</button></div>'
    );
}

// =====================================================================
// 2) COUNTING DAY - live: jeet + aage (leading), news jaisa
// =====================================================================
function fsCounting() {
    s19Style();
    const keys = shuffled(Object.keys(seatResults));
    const total = keys.length;
    s19.agg = null;
    s19.cs = {
        keys: keys, total: total, pos: 0, queue: [], tick: 0, done: false, fast: false,
        adv: Math.max(2, Math.ceil(total / 50)),
        won: { you: 0, opp: 0, oth: 0 }, lead: { you: 0, opp: 0, oth: 0 },
        pWon: {}, pLead: {}, declared: 0, flag: { you: false, opp: false },
        feed: [], newKey: null
    };
    const card = function (side, cls, name) {
        return '<div class="s19-card ' + cls + '"><h3>' + esc(name) + '</h3>' +
            '<div class="s19-big" id="s19-t-' + side + '">0</div>' +
            '<div class="s19-wl"><span>Jeet <b id="s19-w-' + side + '">0</b></span><span>Aage <b id="s19-l-' + side + '">0</b></span></div>' +
            '<div id="s19-bar-' + side + '">' + s19Bar(0, total, S19_COL[side]) + '</div></div>';
    };
    s19Show(
        '<div class="s19-head"><div><h1>COUNTING DAY</h1><div class="s19-sub" id="s19-round">Ginti shuru ho rahi hai...</div></div>' +
        '<span class="s19-live"><i></i>LIVE</span></div>' +
        '<div class="s19-row">' + card('you', 'you', s19Label('you')) + card('opp', 'opp', s19Label('opp')) + card('oth', 'oth', 'Others') + '</div>' +
        '<div class="s19-small">Peeli line = bahumat (' + s19Majority() + '). Aankda = Jeet + Aage.</div>' +
        '<div class="s19-bar" style="height:10px;margin:8px 0 14px"><div class="f" id="s19-prog" style="background:#38bdf8;width:0%"></div></div>' +
        '<div class="s19-row">' +
        '<div class="s19-card" style="flex:1.2"><h3>Taaza khabrein</h3><div class="s19-feed" id="s19-feed"></div></div>' +
        '<div class="s19-card" style="flex:1"><h3>Dal-wise tally (top 8)</h3><div id="s19-ptab"></div></div></div>' +
        '<div style="text-align:center" id="s19-ctl">' +
        '<button class="s19-btn ghost" id="s19-fast" onclick="s19Fast()">Tez karo</button> ' +
        '<button class="s19-btn ghost" onclick="s19Skip()">Seedha natija</button></div>' +
        '<div id="s19-done" style="text-align:center;margin-top:14px"></div>'
    );
    s19.timer = setInterval(s19Tick, 350);
}

function s19Fast() {
    const cs = s19.cs;
    if (!cs || cs.done) return;
    cs.fast = !cs.fast;
    if (s19.timer) clearInterval(s19.timer);
    s19.timer = setInterval(s19Tick, cs.fast ? 110 : 350);
    const b = document.getElementById('s19-fast');
    if (b) b.innerText = cs.fast ? 'Normal gati' : 'Tez karo';
}

function s19Skip() {
    const cs = s19.cs;
    if (!cs) return;
    let guard = 0;
    while (!cs.done && guard++ < 5000) s19Tick(true);
}

function s19Declare(cs, k) {
    const win = seatResults[k];
    const ts = s19SideOf(win);
    const st = cs.status[k];
    if (st) {
        cs.lead[st.ls]--;
        cs.pLead[st.lp] = (cs.pLead[st.lp] || 1) - 1;
    }
    cs.status[k] = null;
    cs.won[ts]++;
    cs.pWon[win] = (cs.pWon[win] || 0) + 1;
    cs.declared++;
    const m = s19Meta(k);
    const parts = s19Split(k);
    const close = m.mv !== null && (m.mv < 15000 || (m.m !== null && m.m < 1.5));
    cs.feed.unshift({ k: k, pc: parts[1], st: parts[0], win: win, ts: ts, mv: m.mv, close: close, rc: m.rc });
    if (cs.feed.length > 14) cs.feed.pop();
    cs.newKey = k;
}

function s19Tick(silent) {
    const cs = s19.cs;
    if (!cs || cs.done) return;
    cs.tick++;
    if (!cs.status) cs.status = {};

    // nayi seats par "aage" (leading) aana shuru
    for (let i = 0; i < cs.adv && cs.pos < cs.total; i++, cs.pos++) {
        const k = cs.keys[cs.pos];
        const win = seatResults[k];
        let ls = s19SideOf(win), lp = win;
        const m = s19Meta(k);
        if (m.rp && Math.random() < 0.14) { ls = s19SideOf(m.rp); lp = m.rp; }   // shuruaati galat lead
        cs.status[k] = { ls: ls, lp: lp };
        cs.lead[ls]++;
        cs.pLead[lp] = (cs.pLead[lp] || 0) + 1;
        cs.queue.push(k);
    }

    // kuch seats ka natija declare
    const waiting = cs.pos >= cs.total ? 0 : cs.adv * 4;
    let n = cs.pos >= cs.total ? cs.adv * 2 : cs.adv;
    cs.newKey = null;
    while (n > 0 && cs.queue.length > waiting) {
        s19Declare(cs, cs.queue.shift());
        n--;
    }

    // bahumat ka aankda chhoone par khabar
    ['you', 'opp'].forEach(function (s) {
        if (!cs.flag[s] && cs.won[s] + cs.lead[s] >= s19Majority()) {
            cs.flag[s] = true;
            cs.feed.unshift({ brk: true, text: 'BREAKING: ' + s19Label(s) + ' ka aankda bahumat (' + s19Majority() + ') par pahuncha - ' + (cs.won[s] + cs.lead[s]) + ' (jeet + aage)' });
            cs.newKey = 'brk';
        }
    });

    if (cs.declared >= cs.total) {
        cs.done = true;
        if (s19.timer) { clearInterval(s19.timer); s19.timer = null; }
        s19Build();
    }
    s19RenderCount();
}

function s19RenderCount() {
    const cs = s19.cs;
    if (!document.getElementById('s19-t-you')) return;
    ['you', 'opp', 'oth'].forEach(function (s) {
        const t = cs.won[s] + cs.lead[s];
        document.getElementById('s19-t-' + s).innerText = t;
        document.getElementById('s19-w-' + s).innerText = cs.won[s];
        document.getElementById('s19-l-' + s).innerText = cs.lead[s];
        const bar = document.querySelector('#s19-bar-' + s + ' .f');
        if (bar) bar.style.width = Math.min(100, t / cs.total * 100).toFixed(1) + '%';
    });
    document.getElementById('s19-prog').style.width = (cs.declared / cs.total * 100).toFixed(1) + '%';
    document.getElementById('s19-round').innerText = 'Round ' + cs.tick + ' | ' + cs.declared + ' / ' + cs.total + ' seats ka natija aa chuka';

    let fh = '';
    cs.feed.slice(0, 8).forEach(function (it, i) {
        const isNew = i === 0 && cs.newKey;
        if (it.brk) {
            fh += '<div class="it brk' + (isNew ? ' new' : '') + '">' + esc(it.text) + '</div>';
            return;
        }
        fh += '<div class="it' + (it.close ? ' close' : '') + (isNew ? ' new' : '') + '" style="border-left-color:' + s19Col(it.win) + '">' +
            '<b>' + esc(it.pc) + '</b> (' + esc(it.st) + '): ' + esc(it.win) + ' jeeta, antar ' + s19Votes(it.mv) + ' vote' +
            (it.close ? ' <span class="s19-chip y">kante ki takkar</span>' : '') + (it.rc === 'palta' ? ' <span class="s19-chip r">recount mein palta</span>' : '') + '</div>';
    });
    document.getElementById('s19-feed').innerHTML = fh;

    const names = {};
    Object.keys(cs.pWon).forEach(function (p) { names[p] = 1; });
    Object.keys(cs.pLead).forEach(function (p) { names[p] = 1; });
    const list = Object.keys(names).map(function (p) { return { p: p, w: cs.pWon[p] || 0, l: cs.pLead[p] || 0 }; })
        .sort(function (a, b) { return (b.w + b.l) - (a.w + a.l); }).slice(0, 8);
    let th = '<table class="s19-table"><tr><th>Dal</th><th>Jeet</th><th>Aage</th><th>Kul</th></tr>';
    list.forEach(function (r) {
        th += '<tr><td><span class="s19-dot" style="background:' + s19Col(r.p) + '"></span>' + esc(r.p) + '</td><td>' + r.w + '</td><td>' + r.l + '</td><td><b>' + (r.w + r.l) + '</b></td></tr>';
    });
    document.getElementById('s19-ptab').innerHTML = th + '</table>';

    if (cs.done) {
        const c = document.getElementById('s19-ctl');
        if (c) c.innerHTML = '';
        const y = cs.won.you, o = cs.won.opp;
        let msg = 'Ginti poori hui. Kisi ke paas bahumat nahi.';
        if (y >= s19Majority()) msg = 'Ginti poori hui. ' + esc(s19Label('you')) + ' ne bahumat paar kiya!';
        else if (o >= s19Majority()) msg = 'Ginti poori hui. ' + esc(s19Label('opp')) + ' ne bahumat paar kiya.';
        document.getElementById('s19-done').innerHTML = '<div style="font-size:1.1rem;margin-bottom:10px;font-weight:bold">' + msg + '</div>' +
            '<button class="s19-btn go" onclick="s19Analysis(\'overview\')">Result Analysis dekho</button>';
    }
}

// =====================================================================
// 3) RESULT ANALYSIS (Overview / Dal / State / Desh ka Nakshaa)
// =====================================================================
function s19Build() {
    const agg = { total: 0, side: { you: 0, opp: 0, oth: 0 }, party: {}, state: {}, rows: [], byKey: {} };
    Object.keys(seatResults).forEach(function (k) {
        const p = seatResults[k];
        const side = s19SideOf(p);
        const sp = s19Split(k);
        const m = s19Meta(k);
        const row = { k: k, st: sp[0], pc: sp[1], party: p, side: side, m: m.m, mv: m.mv, rp: m.rp, rs: m.rs, rc: m.rc };
        agg.rows.push(row);
        agg.byKey[k] = row;
        agg.total++;
        agg.side[side]++;
        agg.party[p] = (agg.party[p] || 0) + 1;
        if (!agg.state[sp[0]]) agg.state[sp[0]] = { n: 0, you: 0, opp: 0, oth: 0, party: {} };
        const S = agg.state[sp[0]];
        S.n++; S[side]++;
        S.party[p] = (S.party[p] || 0) + 1;
    });
    s19.agg = agg;
    return agg;
}

function s19Analysis(tab) {
    if (!s19.agg) s19Build();
    const agg = s19.agg;
    tab = tab || 'overview';
    const tabs = [['overview', 'Saar'], ['party', 'Dal-wise'], ['state', 'State-wise'], ['map', 'Desh ka Nakshaa']];
    let nav = '<div class="s19-tabs">';
    tabs.forEach(function (t) {
        nav += '<button class="s19-tab' + (t[0] === tab ? ' on' : '') + '" onclick="s19Analysis(\'' + t[0] + '\')">' + t[1] + '</button>';
    });
    nav += '</div>';

    let body = '';
    if (tab === 'overview') body = s19Overview(agg);
    else if (tab === 'party') body = s19PartyTab(agg);
    else if (tab === 'state') body = s19StateTab(agg);
    else body = s19MapTab(agg);

    s19Show(
        '<div class="s19-head"><div><h1>RESULT ANALYSIS</h1><div class="s19-sub">' + agg.total + ' seats ka poora vishleshan</div></div>' +
        '<button class="s19-btn" onclick="fsResult()">Aage: sarkar banane ka raasta &rarr;</button></div>' + nav + body
    );
    if (tab === 'map') setTimeout(s19BuildMap, 60);
}

function s19Overview(agg) {
    const MAJ = s19Majority();
    const y = agg.side.you, o = agg.side.opp, x = agg.side.oth;
    let head = '<span class="s19-chip y">Trishanku sansad</span>';
    if (y >= MAJ) head = '<span class="s19-chip g">Aapke gathbandhan ko bahumat</span>';
    else if (o >= MAJ) head = '<span class="s19-chip r">Opponent gathbandhan ko bahumat</span>';
    const gap = function (v) { return v >= MAJ ? (v - MAJ) + ' seat bahumat se upar' : (MAJ - v) + ' seat bahumat se kam'; };
    const share = function (v) { return (v / agg.total * 100).toFixed(1) + '%'; };

    const withM = agg.rows.filter(function (r) { return r.mv !== null; });
    const closest = withM.slice().sort(function (a, b) { return a.mv - b.mv; }).slice(0, 5);
    const biggest = withM.slice().sort(function (a, b) { return b.mv - a.mv; }).slice(0, 5);
    const flipped = withM.filter(function (r) { return r.rc === 'palta'; }).length;
    const same = withM.filter(function (r) { return r.rc === 'wahi'; }).length;
    const list = function (arr) {
        if (!arr.length) return '<div class="s19-small">Jaankari uplabdh nahi.</div>';
        let h = '<table class="s19-table">';
        arr.forEach(function (r) {
            h += '<tr><td><span class="s19-dot" style="background:' + s19Col(r.party) + '"></span><b>' + esc(r.pc) + '</b> <span class="s19-small">' + esc(r.st) + '</span></td><td>' + esc(r.party) + '</td><td>' + s19Votes(r.mv) + '</td></tr>';
        });
        return h + '</table>';
    };

    let vip = '';
    ensureS17();
    const vk = Object.keys(gameState.vips.you);
    if (vk.length) {
        let w = 0;
        vk.forEach(function (k) { if (agg.byKey[k] && agg.byKey[k].side === 'you') w++; });
        vip = '<div class="s19-card"><h3>Aapke VIP ummeedwar: ' + w + ' / ' + vk.length + ' jeete</h3><table class="s19-table">';
        vk.forEach(function (k) {
            const v = gameState.vips.you[k], r = agg.byKey[k];
            const ok = r && r.side === 'you';
            vip += '<tr><td><b>' + esc(v.name) + '</b></td><td>' + esc(v.pc) + ' (' + esc(v.st) + ')</td><td><span class="s19-chip ' + (ok ? 'g' : 'r') + '">' + (ok ? 'Jeete' : 'Haare') + '</span></td></tr>';
        });
        vip += '</table></div>';
    }

    return '<div style="margin-bottom:12px;font-size:1.05rem">' + head + '</div>' +
        '<div class="s19-row">' +
        '<div class="s19-card you"><h3>' + esc(s19Label('you')) + '</h3><div class="s19-big">' + y + '</div><div class="s19-small">Seat hissedari ' + share(y) + '<br>' + gap(y) + '</div>' + s19Bar(y, agg.total, S19_COL.you, true) + '</div>' +
        '<div class="s19-card opp"><h3>' + esc(s19Label('opp')) + '</h3><div class="s19-big">' + o + '</div><div class="s19-small">Seat hissedari ' + share(o) + '<br>' + gap(o) + '</div>' + s19Bar(o, agg.total, S19_COL.opp, true) + '</div>' +
        '<div class="s19-card oth"><h3>Others</h3><div class="s19-big">' + x + '</div><div class="s19-small">Seat hissedari ' + share(x) + '<br>Kingmaker ban sakte hain</div>' + s19Bar(x, agg.total, S19_COL.oth, true) + '</div></div>' +
        '<div class="s19-row"><div class="s19-card"><h3>Sabse kareebi 5 muqable</h3>' + list(closest) + '</div>' +
        '<div class="s19-card"><h3>Sabse badi 5 jeet</h3>' + list(biggest) + '</div></div>' +
        '<div class="s19-row"><div class="s19-card"><h3>Recount ki kahani</h3><div class="s19-small" style="font-size:.9rem">Kante ki takkar mein recount hua: <b>' + (flipped + same) + '</b> seats<br>Recount mein natija <b>palta</b>: ' + flipped + '<br>Recount ke baad bhi wahi raha: ' + same + '</div></div>' + vip + '</div>';
}

function s19PartyTab(agg) {
    const list = Object.keys(agg.party).map(function (p) { return { p: p, n: agg.party[p], side: s19SideOf(p) }; })
        .sort(function (a, b) { return b.n - a.n; });
    const mx = list.length ? list[0].n : 1;
    let h = '<div class="s19-card" style="overflow-x:auto"><h3>Dal-wise seats</h3><table class="s19-table"><tr><th>#</th><th>Dal</th><th>Taraf</th><th>Seats</th><th style="width:35%">Hissa</th></tr>';
    list.forEach(function (r, i) {
        const chip = r.side === 'you' ? '<span class="s19-chip g">Aap</span>' : (r.side === 'opp' ? '<span class="s19-chip r">Opponent</span>' : '<span class="s19-chip y">Alag</span>');
        h += '<tr><td>' + (i + 1) + '</td><td><span class="s19-dot" style="background:' + s19Col(r.p) + '"></span><b>' + esc(r.p) + '</b></td><td>' + chip + '</td><td><b>' + r.n + '</b></td>' +
            '<td><div class="s19-seg"><i style="width:' + (r.n / mx * 100).toFixed(1) + '%;background:' + s19Col(r.p) + '"></i></div></td></tr>';
    });
    return h + '</table></div>';
}

function s19StateTab(agg) {
    s19.stateList = Object.keys(agg.state).sort(function (a, b) { return agg.state[b].n - agg.state[a].n; });
    let h = '<div class="s19-card" style="overflow-x:auto"><h3>State-wise natija (state par click karo = nakshaa mein khulega)</h3>' +
        '<table class="s19-table"><tr><th>State</th><th>Seats</th><th style="color:#86efac">Aap</th><th style="color:#fca5a5">Opp</th><th>Others</th><th>Taqat</th><th>Sabse bada dal</th></tr>';
    s19.stateList.forEach(function (st, i) {
        const S = agg.state[st];
        let top = '', tn = -1;
        Object.keys(S.party).forEach(function (p) { if (S.party[p] > tn) { tn = S.party[p]; top = p; } });
        h += '<tr class="clk" onclick="s19GoState(' + i + ')"><td><b>' + esc(st) + '</b></td><td>' + S.n + '</td><td>' + S.you + '</td><td>' + S.opp + '</td><td>' + S.oth + '</td>' +
            '<td><div class="s19-seg"><i style="width:' + (S.you / S.n * 100) + '%;background:' + S19_COL.you + '"></i><i style="width:' + (S.opp / S.n * 100) + '%;background:' + S19_COL.opp + '"></i><i style="width:' + (S.oth / S.n * 100) + '%;background:' + S19_COL.oth + '"></i></div></td>' +
            '<td><span class="s19-dot" style="background:' + s19Col(top) + '"></span>' + esc(top) + ' (' + tn + ')</td></tr>';
    });
    return h + '</table></div>';
}

function s19GoState(i) {
    s19.pendingState = s19.stateList[i];
    s19Analysis('map');
}

// ---- Desh ka nakshaa ----
function s19MapTab(agg) {
    let opts = '<option value="">Poora desh</option>';
    Object.keys(agg.state).sort().forEach(function (st) { opts += '<option value="' + esc(st) + '">' + esc(st) + '</option>'; });
    let dl = '';
    agg.rows.forEach(function (r) { dl += '<option value="' + esc(r.pc + ' (' + r.st + ')') + '"></option>'; });
    return '<div class="s19-ctl">' +
        '<input id="s19-search" list="s19-seats" placeholder="Seat dhundo (jaise Varanasi)" onchange="s19Search(this.value)" onkeydown="if(event.key===\'Enter\')s19Search(this.value)">' +
        '<datalist id="s19-seats">' + dl + '</datalist>' +
        '<select id="s19-state" onchange="s19StateSel(this.value)">' + opts + '</select>' +
        '<select id="s19-mode" onchange="s19Mode(this.value)"><option value="party">Dal ke rang</option><option value="side">Gathbandhan ke rang</option><option value="close">Kante ki takkar</option></select></div>' +
        '<div class="s19-mapbox"><div id="s19-map"></div><div class="s19-side">' +
        '<div class="s19-card" id="s19-info" style="margin-bottom:10px"><h3>Seat ki jaankari</h3><div class="s19-small">Nakshe par kisi seat par click karo ya upar se dhundo.</div></div>' +
        '<div class="s19-card"><h3>Rang kya batate hain</h3><div class="s19-leg" id="s19-legend"></div></div></div></div>';
}

function s19Fill(k) {
    const p = seatResults[k];
    if (!p) return { c: '#1e293b', o: 1 };
    if (s19.mode === 'side') return { c: S19_COL[s19SideOf(p)], o: 0.95 };
    if (s19.mode === 'close') {
        const m = s19Meta(k);
        const close = m.mv !== null && (m.mv < 15000 || (m.m !== null && m.m < 1.5));
        return close ? { c: '#facc15', o: 1 } : { c: S19_COL[s19SideOf(p)], o: 0.22 };
    }
    return { c: s19Col(p), o: 0.95 };
}

function s19Sty(k) {
    const f = s19Fill(k);
    const sel = s19.selKey === k;
    return { fillColor: f.c, fillOpacity: f.o, color: sel ? '#ffffff' : '#0b1220', weight: sel ? 3 : 0.5 };
}

function s19Tip(k) {
    const r = s19.agg.byKey[k];
    if (!r) return esc(k);
    return '<b>' + esc(r.pc) + '</b> (' + esc(r.st) + ')<br>' + esc(r.party) + (r.mv !== null ? ' | antar ' + s19Votes(r.mv) : '');
}

function s19BuildMap() {
    const el = document.getElementById('s19-map');
    if (!el) return;
    if (typeof L === 'undefined' || typeof indiaData === 'undefined') {
        el.innerHTML = '<p style="color:#f87171;padding:20px">Nakshaa load nahi hua (Leaflet ya india-data.js nahi mili). Internet aur file check karo.</p>';
        return;
    }
    s19.layers = {};
    s19.byState = {};
    s19.selKey = null;
    s19.map = L.map(el, { attributionControl: false, zoomSnap: 0.25, preferCanvas: true });
    const layer = L.geoJSON(indiaData, {
        filter: function (f) { try { return !/pudu|pondi/i.test(getStateName(f.properties) || ''); } catch (e) { return true; } },
        style: function (f) { return s19Sty(seatKeyOf(f.properties)); },
        onEachFeature: function (f, l) {
            const k = seatKeyOf(f.properties);
            const st = getStateName(f.properties);
            s19.layers[k] = l;
            if (!s19.byState[st]) s19.byState[st] = [];
            s19.byState[st].push(l);
            l.bindTooltip(function () { return s19Tip(k); }, { sticky: true });
            l.on('click', function () { s19Pick(k, false); });
            l.on('mouseover', function () { if (s19.selKey !== k) l.setStyle({ weight: 2, color: '#38bdf8' }); });
            l.on('mouseout', function () { l.setStyle(s19Sty(k)); });
        }
    }).addTo(s19.map);
    s19.all = layer;
    setTimeout(function () {
        if (!s19.map) return;
        s19.map.invalidateSize();
        s19.map.fitBounds(layer.getBounds());
        if (s19.pendingState) {
            const sel = document.getElementById('s19-state');
            if (sel) sel.value = s19.pendingState;
            s19StateSel(s19.pendingState);
            s19.pendingState = null;
        }
    }, 80);
    s19Legend();
}

function s19Restyle() {
    Object.keys(s19.layers).forEach(function (k) { s19.layers[k].setStyle(s19Sty(k)); });
}

function s19Mode(v) {
    s19.mode = v;
    s19Restyle();
    s19Legend();
}

function s19Legend() {
    const el = document.getElementById('s19-legend');
    if (!el) return;
    const dot = function (c, t) { return '<div><span class="s19-dot" style="background:' + c + '"></span>' + t + '</div>'; };
    let h = '';
    if (s19.mode === 'side') {
        h = dot(S19_COL.you, esc(s19Label('you'))) + dot(S19_COL.opp, esc(s19Label('opp'))) + dot(S19_COL.oth, 'Others');
    } else if (s19.mode === 'close') {
        h = dot('#facc15', 'Kante ki takkar (bahut kam antar)') + '<div class="s19-small">Baaki seats halke rang mein dikh rahi hain.</div>';
    } else {
        const list = Object.keys(s19.agg.party).sort(function (a, b) { return s19.agg.party[b] - s19.agg.party[a]; }).slice(0, 12);
        list.forEach(function (p) { h += dot(s19Col(p), esc(p) + ' (' + s19.agg.party[p] + ')'); });
    }
    el.innerHTML = h;
}

function s19Pick(k, zoom) {
    const old = s19.selKey;
    s19.selKey = k;
    if (old && s19.layers[old]) s19.layers[old].setStyle(s19Sty(old));
    const l = s19.layers[k];
    if (l) {
        l.setStyle(s19Sty(k));
        if (l.bringToFront) l.bringToFront();
        if (zoom && s19.map) s19.map.fitBounds(l.getBounds(), { maxZoom: 7 });
    }
    const r = s19.agg.byKey[k];
    const box = document.getElementById('s19-info');
    if (!box || !r) return;
    const sideTxt = r.side === 'oth' ? 'Others' : s19Label(r.side);
    let vip = '';
    ensureS17();
    ['you', 'opp'].forEach(function (s) {
        const v = gameState.vips[s][k];
        if (v) vip += '<div style="margin-top:6px"><span class="s19-chip y">VIP</span> ' + esc(v.name) + ' (' + esc(s19Label(s)) + ')</div>';
    });
    box.innerHTML = '<h3>' + esc(r.pc) + '</h3>' +
        '<div class="s19-small">' + esc(r.st) + '</div>' +
        '<div style="margin:8px 0;font-size:1.05rem"><span class="s19-dot" style="background:' + s19Col(r.party) + '"></span><b>' + esc(r.party) + '</b> jeeta</div>' +
        '<table class="s19-table">' +
        '<tr><td>Taraf</td><td>' + esc(sideTxt) + '</td></tr>' +
        '<tr><td>Jeet ka antar</td><td>' + s19Votes(r.mv) + ' vote' + (r.m !== null ? ' (' + r.m + '%)' : '') + '</td></tr>' +
        '<tr><td>Doosre number par</td><td>' + (r.rp ? '<span class="s19-dot" style="background:' + s19Col(r.rp) + '"></span>' + esc(r.rp) : '-') + '</td></tr>' +
        '<tr><td>Matdaan</td><td>' + (s19Phase(k) ? 'Phase ' + s19Phase(k) : '-') + '</td></tr>' +
        (r.rc ? '<tr><td>Recount</td><td>' + (r.rc === 'palta' ? 'Natija palta' : 'Wahi raha') + '</td></tr>' : '') +
        '</table>' + vip;
}

function s19Phase(k) {
    const s = resultModel && resultModel.seats[k];
    return s ? s.phase : 0;
}

function s19Search(v) {
    v = (v || '').trim().toLowerCase();
    if (!v || !s19.agg) return;
    let hit = null;
    for (let i = 0; i < s19.agg.rows.length; i++) {
        const r = s19.agg.rows[i];
        if ((r.pc + ' (' + r.st + ')').toLowerCase() === v) { hit = r; break; }
    }
    if (!hit) {
        for (let i = 0; i < s19.agg.rows.length; i++) {
            if (s19.agg.rows[i].pc.toLowerCase().indexOf(v) !== -1) { hit = s19.agg.rows[i]; break; }
        }
    }
    if (hit) s19Pick(hit.k, true);
    else {
        const box = document.getElementById('s19-info');
        if (box) box.innerHTML = '<h3>Seat nahi mili</h3><div class="s19-small">Naam ki spelling badal kar dekho.</div>';
    }
}

function s19StateSel(st) {
    if (!s19.map) return;
    if (!st) { s19.map.fitBounds(s19.all.getBounds()); return; }
    const arr = s19.byState[st];
    if (arr && arr.length) s19.map.fitBounds(L.featureGroup(arr).getBounds());
}

// ================= STAGE 20: HORSE TRADING (2/3 kanoon), PM CHUNNA, MANTRIMANDAL =================
// Flow: Result Analysis -> fsResult (naya) -> Horse Trading -> fsGovt (naya) -> PM chuno -> Mantrimandal -> Shapath -> fsReport

const s20 = {
    hold: {}, origin: {}, origCount: {}, bought: {}, noise: {}, list: [], sel: {},
    bonusYou: 0, bonusOpp: 0, leaks: 0, log: [], pm: null, cands: [], people: [], cab: [], quota: {}
};

const S20_MINISTRIES = [
    ['Grih Mantralaya', 1], ['Raksha Mantralaya', 1], ['Vitt Mantralaya', 1], ['Videsh Mantralaya', 1],
    ['Railway', 2], ['Sadak Parivahan', 2], ['Swasthya', 2], ['Shiksha', 2], ['Krishi', 2], ['Vidhi aur Nyay', 2], ['Urja', 2], ['Vanijya aur Udyog', 2],
    ['Sanchar', 3], ['Paryavaran', 3], ['Khel aur Yuva', 3], ['Mahila aur Bal Vikas', 3], ['Gramin Vikas', 3], ['Khadya Aapurti', 3],
    ['Shram aur Rozgaar', 3], ['Sanskriti', 3], ['Jal Shakti', 3], ['Avas aur Shahri Kaam', 3]
];
const S20_TIER = { 1: ['Bada', 'r'], 2: ['Mahatvapurn', 'y'], 3: ['Aam', 'g'] };

function s20Style() {
    if (document.getElementById('s20-style')) return;
    s19Style();
    const st = document.createElement('style');
    st.id = 's20-style';
    st.textContent = `
.s20-scroll{max-height:44vh;overflow-y:auto;}
.s20-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;}
.s20-cand{background:#131b2e;border:1px solid #334155;border-radius:12px;padding:12px;animation:s19Pop .45s both;transition:transform .15s,border-color .15s;}
.s20-cand:hover{transform:translateY(-3px);border-color:#38bdf8;}
.s20-cand.vip{border-color:#facc15;}
.s20-pop{height:8px;background:#0d1322;border-radius:4px;overflow:hidden;margin:6px 0;}
.s20-pop i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#22c55e);}
.s20-table select{background:#1e293b;color:#fff;border:1px solid #475569;border-radius:6px;padding:4px;max-width:210px;}
.s20-oath{animation:s19Slide .5s both;}
.s20-big{font-size:1.9rem;font-weight:bold;}
`;
    document.head.appendChild(st);
}

// ---------------- helpers ----------------
function s20Tally() {
    const t = { you: 0, opp: 0, oth: 0 };
    Object.keys(s20.hold).forEach(function (p) { ['you', 'opp', 'oth'].forEach(function (s) { t[s] += s20.hold[p][s]; }); });
    return t;
}

function s20RivalMain(buyer) { return buyer === 'you' ? selectedOppParty : selectedYouParty; }
function s20RivalSide(buyer) { return buyer === 'you' ? 'opp' : 'you'; }

function s20Price(p, buyer) {
    const pd = PARTY_DB[p];
    const w = pd ? pd.w : 2;
    let f = 1;
    if (p === s20RivalMain(buyer)) f = 2.3;
    else if (s20.origin[p] === s20RivalSide(buyer)) f = 1.5;
    return (1 + 0.28 * w) * f * s20.noise[p];
}

function s20Chance(p, buyer, mode) {
    let c = 0.9;
    if (p === s20RivalMain(buyer)) c -= 0.3;
    else if (s20.origin[p] === s20RivalSide(buyer)) c -= 0.1;
    const hw = (gameState.hawa || 0) * (buyer === 'you' ? 1 : -1);
    c += Math.max(-0.1, Math.min(0.1, hw / 1000));
    if (mode === 'full') c += 0.05;
    return Math.max(0.2, Math.min(0.97, c));
}

// 2/3 kanoon: kam se kam 2/3 MP ek saath; "poori party" mein sab MP (zyada mehnga)
function s20Deal(p, buyer, mode) {
    const orig = s20.origCount[p];
    const n = mode === 'full' ? orig : Math.ceil(orig * 2 / 3);
    const per = s20Price(p, buyer) * (mode === 'full' ? 1.3 : 1);
    return { n: n, per: per, cost: Math.max(1, Math.round(n * per)), chance: s20Chance(p, buyer, mode) };
}

function s20InitHorse() {
    const counts = {};
    Object.keys(seatResults).forEach(function (k) { counts[seatResults[k]] = (counts[seatResults[k]] || 0) + 1; });
    s20.hold = {}; s20.origin = {}; s20.origCount = {}; s20.bought = {}; s20.noise = {}; s20.sel = {};
    s20.log = []; s20.leaks = 0;
    Object.keys(counts).forEach(function (p) {
        const sd = s19SideOf(p);
        s20.origin[p] = sd;
        s20.origCount[p] = counts[p];
        s20.hold[p] = { you: 0, opp: 0, oth: 0 };
        s20.hold[p][sd] = counts[p];
        s20.noise[p] = rnd(0.85, 1.25);
    });
    const t = s20Tally();
    s20.bonusYou = Math.round(t.you * 0.4);     // har jeeti seat par thoda inaam
    s20.bonusOpp = Math.round(t.opp * 0.4);
    s20.list = Object.keys(counts).filter(function (p) { return counts[p] >= 2 && s20.origin[p] !== 'you'; })
        .sort(function (a, b) { return counts[b] - counts[a]; });
    s20.list.forEach(function (p) { s20.sel[p] = { on: false, mode: 'two' }; });
    fsState.y2 = t.you; fsState.o2 = t.opp;
}

function s20Funds() {
    return s20.bonusYou + gameState.budget + gameState.blackFund;
}

// paisa kharch: pehle inaam, phir white, phir black. black kitna laga wo wapas karo
function s20Pay(side, cost) {
    let blackUsed = 0;
    if (side === 'you') {
        let r = cost;
        const a = Math.min(r, s20.bonusYou); s20.bonusYou -= a; r -= a;
        const b = Math.min(r, gameState.budget); gameState.budget -= b; r -= b;
        blackUsed = Math.min(r, gameState.blackFund); gameState.blackFund -= blackUsed;
        recordSpend('you', { type: 'Horse Trading', st: null, cost: cost }, 'white');
    } else {
        let r = cost;
        const a = Math.min(r, s20.bonusOpp); s20.bonusOpp -= a; r -= a;
        const b = Math.min(r, gameState.opp.budget); gameState.opp.budget -= b; r -= b;
        blackUsed = Math.min(r, gameState.opp.blackFund); gameState.opp.blackFund -= blackUsed;
    }
    return blackUsed;
}

function s20Refund(side, amt) {
    if (side === 'you') gameState.budget += amt; else gameState.opp.budget += amt;
}

// ---------------- 1) HORSE TRADING PAGE ----------------
function fsResult() {
    s20Style();
    s20InitHorse();
    if (fsState.y >= MAJORITY) return fsGovt('you');
    s20RenderHorse();
}

function s20RenderHorse() {
    const MAJ = MAJORITY;
    const oppWins = fsState.o >= MAJ;
    let rows = '';
    s20.list.forEach(function (p, i) {
        const o = s20.origin[p];
        const tag = (p === selectedOppParty) ? '<span class="s19-chip r">Opponent ka mukhya dal</span>' : (o === 'opp' ? '<span class="s19-chip r">Opponent saathi</span>' : '<span class="s19-chip y">Alag</span>');
        rows += '<tr><td><input type="checkbox" onchange="s20Pick(' + i + ',this.checked)"></td>' +
            '<td><span class="s19-dot" style="background:' + s19Col(p) + '"></span><b>' + esc(p) + '</b><br>' + tag + '</td>' +
            '<td>' + s20.origCount[p] + '</td>' +
            '<td><select onchange="s20Mode(' + i + ',this.value)"><option value="two">2/3 MP</option><option value="full">Poori party</option></select></td>' +
            '<td id="s20-n' + i + '"></td><td id="s20-k' + i + '"></td><td id="s20-p' + i + '"></td></tr>';
    });
    s19Show(
        '<div class="s19-head"><div><h1>HORSE TRADING</h1><div class="s19-sub">' + (oppWins ? 'Opponent ke paas bahumat hai. Sarkar giraane ki koshish karo.' : 'Kisi ke paas bahumat nahi. MP kharid kar aankda poora karo.') + '</div></div>' +
        '<span class="s19-live"><i></i>MANDI KHULI</span></div>' +
        '<div class="s19-row">' +
        '<div class="s19-card you"><h3>' + esc(s19Label('you')) + '</h3><div class="s19-big" id="s20-ty">0</div></div>' +
        '<div class="s19-card opp"><h3>' + esc(s19Label('opp')) + '</h3><div class="s19-big" id="s20-to">0</div></div>' +
        '<div class="s19-card oth"><h3>Others</h3><div class="s19-big" id="s20-tx">0</div></div>' +
        '<div class="s19-card"><h3>Aapka paisa</h3><div class="s19-big" style="font-size:1.8rem">' + s20Funds() + ' Cr</div><div class="s19-small">Bacha budget + black fund + jeet ka inaam (' + s20.bonusYou + ' Cr)</div></div></div>' +
        '<div class="s19-small" style="margin-bottom:8px">Niyam: dal-badal kanoon ke kaaran kisi dal ke kam se kam 2/3 MP ek saath khareedne padte hain. Ek dal sirf ek baar khareeda ja sakta hai. Safalta pakki nahi hai, aur sauda leak ho sakta hai (black fund se zyada khatra).</div>' +
        '<div class="s19-card" style="overflow-x:auto"><h3>Dal chuno</h3><div class="s20-scroll"><table class="s19-table s20-table"><tr><th></th><th>Dal</th><th>MP</th><th>Kya kharidna hai</th><th>Kitne MP</th><th>Kharch</th><th>Safalta</th></tr>' + rows + '</table></div>' +
        '<div id="s20-sum" style="margin-top:8px;font-weight:bold"></div></div>' +
        '<div style="text-align:center;margin-top:12px"><button class="s19-btn go" id="s20-go" onclick="s20Execute()">Sauda pakka karo</button> ' +
        '<button class="s19-btn ghost" onclick="s20Execute(true)">Sauda chhodo, aage badho</button></div>'
    );
    s20Refresh();
}

function s20Pick(i, on) { s20.sel[s20.list[i]].on = on; s20Refresh(); }
function s20Mode(i, v) { s20.sel[s20.list[i]].mode = v; s20Refresh(); }

function s20Refresh() {
    let cost = 0;
    const t = s20Tally();
    let ty = t.you, to = t.opp, tx = t.oth;
    s20.list.forEach(function (p, i) {
        const d = s20Deal(p, 'you', s20.sel[p].mode);
        const set = function (id, v) { const e = document.getElementById(id + i); if (e) e.innerText = v; };
        set('s20-n', d.n);
        set('s20-k', d.cost + ' Cr');
        set('s20-p', Math.round(d.chance * 100) + '%');
        if (s20.sel[p].on) {
            cost += d.cost;
            const o = s20.origin[p];
            if (o === 'opp') to -= d.n; else tx -= d.n;
            ty += d.n;
        }
    });
    const funds = s20Funds();
    const set2 = function (id, v) { const e = document.getElementById(id); if (e) e.innerText = v; };
    set2('s20-ty', ty); set2('s20-to', to); set2('s20-tx', tx);
    const sum = document.getElementById('s20-sum');
    const bad = cost > funds;
    if (sum) {
        sum.style.color = bad ? '#fca5a5' : '#86efac';
        sum.innerText = 'Chuna hua kul kharch: ' + cost + ' Cr / ' + funds + ' Cr' + (bad ? ' (paisa kam hai)' : '') +
            '  |  Sab safal hue to aapka aankda: ' + ty + (ty >= MAJORITY ? ' (bahumat!)' : '');
    }
    const go = document.getElementById('s20-go');
    if (go) go.disabled = bad;
}

function s20Apply(p, buyer, mode, rows, who) {
    const d = s20Deal(p, buyer, mode);
    const blackUsed = s20Pay(buyer, d.cost);
    const ok = Math.random() < d.chance;
    const leakP = blackUsed > 0 ? 0.35 : 0.15;
    const leak = Math.random() < leakP;
    let res;
    if (ok) {
        const o = s20.origin[p];
        s20.hold[p][o] -= d.n;
        s20.hold[p][buyer] += d.n;
        s20.bought[p] = buyer;
        res = '<span class="s19-chip g">Safal: ' + d.n + ' MP</span>';
    } else {
        s20Refund(buyer, Math.round(d.cost * 0.5));
        res = '<span class="s19-chip r">Fail (aadha paisa doob gaya)</span>';
    }
    if (leak) {
        if (buyer === 'you') { s20.leaks++; pushNews('Horse trading ka bhanda phoota: ' + sideName('you') + ' par MP kharidne ka aarop.'); }
        res += ' <span class="s19-chip y">Sauda leak</span>';
    }
    rows.push('<tr><td>' + who + '</td><td><b>' + esc(p) + '</b></td><td>' + d.cost + ' Cr</td><td>' + res + '</td></tr>');
    return ok;
}

function s20AiTurn(rows) {
    const lvl = gameState.aiLevel || 'normal';
    const skip = lvl === 'easy' ? 0.6 : (lvl === 'normal' ? 0.25 : 0);
    if (Math.random() < skip) return;
    let deals = 0;
    const cand = Object.keys(s20.origCount).filter(function (p) {
        return !s20.bought[p] && s20.origin[p] !== 'opp' && p !== selectedYouParty && s20.origCount[p] >= 2;
    }).sort(function (a, b) { return s20.origCount[b] - s20.origCount[a]; });
    for (let i = 0; i < cand.length && deals < 3; i++) {
        if (s20Tally().opp >= MAJORITY) break;
        const p = cand[i];
        const d = s20Deal(p, 'opp', 'two');
        const avail = s20.bonusOpp + gameState.opp.budget + gameState.opp.blackFund;
        if (d.cost > avail) continue;
        s20Apply(p, 'opp', 'two', rows, 'Opponent');
        deals++;
    }
}

function s20Execute(skipMine) {
    const rows = [];
    if (!skipMine) {
        s20.list.forEach(function (p) {
            if (!s20.sel[p].on || s20.bought[p]) return;
            const d = s20Deal(p, 'you', s20.sel[p].mode);
            if (d.cost > s20Funds()) { rows.push('<tr><td>Aap</td><td><b>' + esc(p) + '</b></td><td>' + d.cost + ' Cr</td><td><span class="s19-chip r">Paisa kam pada</span></td></tr>'); return; }
            if (s20Apply(p, 'you', s20.sel[p].mode, rows, 'Aap')) fsState.bargained = true;
        });
    }
    if (s20Tally().opp < MAJORITY) s20AiTurn(rows);

    const t = s20Tally();
    fsState.y2 = t.you; fsState.o2 = t.opp;
    let gov = null;
    if (t.you >= MAJORITY) gov = 'you'; else if (t.opp >= MAJORITY) gov = 'opp';
    s19Show(
        '<div class="s19-head"><div><h1>SAUDE KA NATIJA</h1></div></div>' +
        '<div class="s19-row">' +
        '<div class="s19-card you"><h3>' + esc(s19Label('you')) + '</h3><div class="s19-big">' + t.you + '</div></div>' +
        '<div class="s19-card opp"><h3>' + esc(s19Label('opp')) + '</h3><div class="s19-big">' + t.opp + '</div></div>' +
        '<div class="s19-card oth"><h3>Others</h3><div class="s19-big">' + t.oth + '</div></div></div>' +
        '<div class="s19-card"><h3>Kya kya hua</h3>' + (rows.length ? '<table class="s19-table"><tr><th>Kisne</th><th>Dal</th><th>Kharch</th><th>Nateeja</th></tr>' + rows.join('') + '</table>' : '<div class="s19-small">Is baar koi sauda nahi hua.</div>') + '</div>' +
        '<div style="text-align:center;margin-top:14px"><button class="s19-btn go" onclick="fsGovt(' + (gov ? "'" + gov + "'" : 'null') + ')">Aage</button></div>'
    );
}

// ---------------- 2) SARKAR + PM ----------------
function fsGovt(side) {
    s20Style();
    if (!s20.hold || !Object.keys(s20.hold).length) s20InitHorse();
    fsState.gov = side;
    if (side === 'you') return s20PM();
    s20OtherGovt(side);
}

function s20OtherGovt(side) {
    let h;
    if (side === 'opp') {
        const oppPM = randName();
        h = '<div class="s19-head"><div><h1>OPPONENT KI SARKAR</h1></div></div>' +
            '<div class="s19-card opp"><h3>Naye Pradhan Mantri</h3><div class="s20-big">' + esc(oppPM) + '</div><div class="s19-small">' + esc(selectedOppParty) + ' | ' + fsState.o2 + ' seats ka samarthan</div></div>' +
            '<div class="s19-card" style="margin-top:12px"><h3>Aapki bhumika</h3><div>Aap vipaksh mein baithenge. ' + esc(s19Label('you')) + ' ke ' + fsState.y2 + ' MP sarkar ko ghereinge.</div></div>';
    } else {
        h = '<div class="s19-head"><div><h1>TRISHANKU SANSAD</h1></div></div>' +
            '<div class="s19-card"><div style="font-size:1.1rem">Kisi ke paas bahumat nahi (' + fsState.y2 + ' / ' + fsState.o2 + ' / ' + (fsState.total - fsState.y2 - fsState.o2) + '). Rashtrapati shasan aur naye chunav ke aasar hain.</div></div>';
    }
    s19Show(h + '<div style="text-align:center;margin-top:14px"><button class="s19-btn go" onclick="fsReport()">Result Report dekho</button></div>');
}

function s20YouParts() {
    return Object.keys(s20.hold).map(function (p) { return { p: p, n: s20.hold[p].you }; })
        .filter(function (r) { return r.n > 0; }).sort(function (a, b) { return b.n - a.n; });
}

function s20SeatOf(p) {
    const keys = Object.keys(seatResults).filter(function (k) { return seatResults[k] === p; });
    if (!keys.length) return { st: '-', pc: '-' };
    const sp = s19Split(keys[Math.floor(Math.random() * keys.length)]);
    return { st: sp[0], pc: sp[1] };
}

function s20PM() {
    if (!s19.agg) s19Build();
    ensureS17();
    const agg = s19.agg;
    const parts = s20YouParts();
    const cands = [];
    const used = {};
    Object.keys(gameState.vips.you).forEach(function (k) {
        const v = gameState.vips.you[k], r = agg.byKey[k];
        if (!r || !s20.hold[r.party] || s20.hold[r.party].you <= 0 || r.side === 'opp') return;
        used[v.name] = 1;
        cands.push({ name: v.name, party: r.party, pc: r.pc, st: r.st, vip: true, pop: Math.min(97, Math.round(rnd(55, 85) + 8)) });
    });
    parts.slice(0, 3).forEach(function (r, idx) {
        for (let i = 0; i < (idx === 0 ? 3 : 2); i++) {
            let nm = randName(), g = 0;
            while (used[nm] && g++ < 20) nm = randName();
            used[nm] = 1;
            const s = s20SeatOf(r.p);
            cands.push({ name: nm, party: r.p, pc: s.pc, st: s.st, vip: false, pop: Math.round(rnd(48, 85)) });
        }
    });
    s20.cands = cands;
    let cards = '';
    cands.forEach(function (c, i) {
        cards += '<div class="s20-cand' + (c.vip ? ' vip' : '') + '" style="animation-delay:' + (i * 0.07).toFixed(2) + 's">' +
            (c.vip ? '<span class="s19-chip y">VIP ummeedwar</span> ' : '') +
            '<div style="font-size:1.1rem;font-weight:bold;margin-top:4px">' + esc(c.name) + '</div>' +
            '<div class="s19-small"><span class="s19-dot" style="background:' + s19Col(c.party) + '"></span>' + esc(c.party) + ' | ' + esc(c.pc) + '</div>' +
            '<div class="s19-small">Lokpriyata ' + c.pop + '%</div><div class="s20-pop"><i style="width:' + c.pop + '%"></i></div>' +
            '<button class="s19-btn" style="padding:6px 12px;font-size:.85rem" onclick="s20ChoosePM(' + i + ')">Pradhan Mantri banao</button></div>';
    });
    let popt = '';
    parts.forEach(function (r) { popt += '<option value="' + esc(r.p) + '">' + esc(r.p) + '</option>'; });
    s19Show(
        '<div class="s19-head"><div><h1>PRADHAN MANTRI CHUNO</h1><div class="s19-sub">Aapke gathbandhan ki ' + fsState.y2 + ' seats. Sarkar ban gayi!</div></div>' +
        '<span class="s19-chip g">Bahumat</span></div>' +
        '<div class="s20-grid">' + cards + '</div>' +
        '<div class="s19-card" style="margin-top:14px"><h3>Ya apna naam likho</h3><div class="s19-ctl"><input id="s20-cname" placeholder="Naam likho"><select id="s20-cparty">' + popt + '</select>' +
        '<button class="s19-btn" onclick="s20CustomPM()">Ye PM</button></div></div>'
    );
}

function s20CustomPM() {
    const nm = (document.getElementById('s20-cname').value || '').trim() || (document.getElementById('display-username') ? document.getElementById('display-username').innerText : 'Aap');
    const p = document.getElementById('s20-cparty').value;
    s20.pm = { name: nm, party: p, pc: '-', st: '-', vip: false, pop: 62, custom: true };
    s20Cabinet();
}

function s20ChoosePM(i) {
    s20.pm = s20.cands[i];
    s20Cabinet();
}

// ---------------- 3) MANTRIMANDAL ----------------
function s20Quota(parts, N) {
    const total = parts.reduce(function (t, r) { return t + r.n; }, 0) || 1;
    const q = {}, fr = [];
    let sum = 0;
    parts.forEach(function (r) {
        const x = N * r.n / total;
        q[r.p] = Math.floor(x);
        sum += q[r.p];
        fr.push({ p: r.p, f: x - Math.floor(x) });
    });
    fr.sort(function (a, b) { return b.f - a.f; });
    for (let i = 0; sum < N && i < fr.length; i++, sum++) q[fr[i].p]++;
    // 8+ MP wale saathi ko kam se kam 1 mantralaya
    parts.forEach(function (r) {
        if (r.n >= 8 && q[r.p] === 0) {
            let big = null;
            Object.keys(q).forEach(function (p) { if (q[p] > 1 && (!big || q[p] > q[big])) big = p; });
            if (big) { q[big]--; q[r.p] = 1; }
        }
    });
    return q;
}

function s20AutoCabinet() {
    if (!s19.agg) s19Build();
    const agg = s19.agg;
    const parts = s20YouParts();
    const N = S20_MINISTRIES.length;
    const q = s20Quota(parts, N);
    const pm = s20.pm;
    if (q[pm.party] > 0) q[pm.party]--;       // PM apne dal ka ek pad le chuka
    const left = {}; Object.keys(q).forEach(function (p) { left[p] = q[p]; });

    const people = [];
    const used = {}; used[pm.name] = 1;
    const vips = [];
    ensureS17();
    Object.keys(gameState.vips.you).forEach(function (k) {
        const v = gameState.vips.you[k], r = agg.byKey[k];
        if (!r || used[v.name] || !s20.hold[r.party] || s20.hold[r.party].you <= 0 || r.side === 'opp') return;
        vips.push({ name: v.name, party: r.party, pc: r.pc, st: r.st, vip: true });
    });
    const addPerson = function (pr) { used[pr.name] = 1; people.push(pr); return people.length - 1; };
    const cab = [];

    S20_MINISTRIES.forEach(function (m, mi) {
        let idx = -1;
        if (vips.length) {                     // VIP winner ko pehle badi ministry
            const v = vips.shift();
            idx = addPerson(v);
            if (left[v.party] > 0) left[v.party]--;
        } else {
            // sabse zyada baaki quota wala dal (barabari par mukhya dal pehle)
            let best = null;
            Object.keys(left).forEach(function (p) {
                if (left[p] <= 0) return;
                if (best === null || left[p] > left[best] || (left[p] === left[best] && p === selectedYouParty)) best = p;
            });
            if (best === null) best = pm.party;
            left[best] = Math.max(0, (left[best] || 0) - 1);
            let nm = randName(), g = 0;
            while (used[nm] && g++ < 30) nm = randName();
            const s = s20SeatOf(best);
            idx = addPerson({ name: nm, party: best, pc: s.pc, st: s.st, vip: false });
        }
        cab.push(idx);
    });
    s20.people = people;
    s20.cab = cab;
}

function s20Stability() {
    const parts = s20YouParts();
    const N = S20_MINISTRIES.length;
    const side = parts.reduce(function (t, r) { return t + r.n; }, 0) || 1;
    const got = {};
    s20.cab.forEach(function (pi) { const p = s20.people[pi].party; got[p] = (got[p] || 0) + 1; });
    got[s20.pm.party] = (got[s20.pm.party] || 0) + 1;
    let score = 62 + (s20.pm.pop - 60) * 0.4 + Math.min(15, Math.max(-10, (fsState.y2 - MAJORITY) / 4)) - s20.leaks * 6;
    const rows = [];
    parts.forEach(function (r) {
        if (r.p === selectedYouParty) return;
        const exp = (N + 1) * r.n / side;
        const g = got[r.p] || 0;
        let state = 'g';
        if (g + 0.5 < exp * 0.7) { state = 'r'; score -= r.n >= 20 ? 10 : 5; }
        else if (g < exp * 0.9) { state = 'y'; score -= 2; }
        else score += 2;
        rows.push({ p: r.p, n: r.n, exp: exp, g: g, state: state });
    });
    score = Math.max(5, Math.min(98, Math.round(score)));
    const verdict = score >= 75 ? 'Mazboot sarkar' : (score >= 50 ? 'Chalne layak sarkar' : 'Kamzor sarkar, saathi chhod sakte hain');
    return { score: score, verdict: verdict, rows: rows };
}

function s20Cabinet() {
    s20AutoCabinet();
    s20RenderCabinet();
}

function s20RenderCabinet() {
    let opts = '';
    s20.people.forEach(function (pr, i) { opts += '<option value="' + i + '">' + esc(pr.name) + ' (' + esc(pr.party) + ')' + (pr.vip ? ' *VIP' : '') + '</option>'; });
    let rows = '';
    S20_MINISTRIES.forEach(function (m, mi) {
        const t = S20_TIER[m[1]];
        rows += '<tr><td><b>' + esc(m[0]) + '</b></td><td><span class="s19-chip ' + t[1] + '">' + t[0] + '</span></td><td><select onchange="s20Reassign(' + mi + ',this.value)">' +
            opts.replace('value="' + s20.cab[mi] + '"', 'value="' + s20.cab[mi] + '" selected') + '</select></td></tr>';
    });
    s19Show(
        '<div class="s19-head"><div><h1>MANTRIMANDAL</h1><div class="s19-sub">Bade mantralaya VIP netaon ko diye gaye hain. Chaho to badlo.</div></div>' +
        '<button class="s19-btn go" onclick="s20Oath()">Shapath grahan karo</button></div>' +
        '<div class="s19-row"><div class="s19-card you"><h3>Pradhan Mantri</h3><div class="s20-big">' + esc(s20.pm.name) + '</div>' +
        '<div class="s19-small">' + esc(s20.pm.party) + ' | Lokpriyata ' + s20.pm.pop + '%' + (s20.pm.vip ? ' | VIP' : '') + '</div></div>' +
        '<div class="s19-card"><h3>Sarkar ki sthirta</h3><div id="s20-stab"></div></div></div>' +
        '<div class="s19-card" style="overflow-x:auto"><h3>Mantralaya baantwara</h3><div class="s20-scroll" style="max-height:52vh"><table class="s19-table s20-table"><tr><th>Mantralaya</th><th>Star</th><th>Mantri</th></tr>' + rows + '</table></div>' +
        '<div style="margin-top:8px"><button class="s19-btn ghost" onclick="s20Cabinet()">Naye sire se auto-baantwara</button></div></div>'
    );
    s20RenderStab();
}

function s20Reassign(mi, v) {
    s20.cab[mi] = parseInt(v, 10);
    s20RenderStab();
}

function s20RenderStab() {
    const s = s20Stability();
    s20.stab = s;
    const el = document.getElementById('s20-stab');
    if (!el) return;
    const col = s.score >= 75 ? '#22c55e' : (s.score >= 50 ? '#facc15' : '#ef4444');
    let h = '<div class="s19-big" style="color:' + col + '">' + s.score + '%</div><div class="s19-small" style="margin-bottom:6px">' + esc(s.verdict) + '</div>' +
        '<div class="s19-bar"><div class="f" style="width:' + s.score + '%;background:' + col + '"></div></div>';
    if (s.rows.length) {
        h += '<table class="s19-table"><tr><th>Saathi dal</th><th>MP</th><th>Chahiye</th><th>Mila</th><th></th></tr>';
        s.rows.forEach(function (r) {
            h += '<tr><td><span class="s19-dot" style="background:' + s19Col(r.p) + '"></span>' + esc(r.p) + '</td><td>' + r.n + '</td><td>' + r.exp.toFixed(1) + '</td><td>' + r.g + '</td><td><span class="s19-chip ' + r.state + '">' + (r.state === 'g' ? 'Khush' : (r.state === 'y' ? 'Thoda naaraaz' : 'Naaraaz')) + '</span></td></tr>';
        });
        h += '</table>';
    }
    el.innerHTML = h;
}

// ---------------- 4) SHAPATH ----------------
function s20Oath() {
    const s = s20Stability();
    fsState.pm = s20.pm;
    fsState.stab = s;
    let cards = '';
    cards += '<div class="s20-cand vip s20-oath" style="grid-column:1/-1"><span class="s19-chip y">PRADHAN MANTRI</span><div class="s20-big">' + esc(s20.pm.name) + '</div><div class="s19-small">' + esc(s20.pm.party) + '</div></div>';
    S20_MINISTRIES.forEach(function (m, mi) {
        const pr = s20.people[s20.cab[mi]];
        cards += '<div class="s20-cand' + (m[1] === 1 ? ' vip' : '') + '" style="animation-delay:' + (0.3 + mi * 0.12).toFixed(2) + 's"><div class="s19-small">' + esc(m[0]) + '</div><b>' + esc(pr.name) + '</b><div class="s19-small"><span class="s19-dot" style="background:' + s19Col(pr.party) + '"></span>' + esc(pr.party) + (pr.vip ? ' | VIP' : '') + '</div></div>';
    });
    s19Show(
        '<div class="s19-head"><div><h1>SHAPATH GRAHAN</h1><div class="s19-sub">Nayi sarkar ne shapath li. Sthirta: ' + s.score + '% (' + esc(s.verdict) + ')</div></div></div>' +
        '<div class="s20-grid">' + cards + '</div>' +
        '<div style="text-align:center;margin-top:16px"><button class="s19-btn go" onclick="fsReport()">Result Report dekho</button></div>'
    );
}

// Result Report mein PM aur sthirta ki line jodo
const _fsReportS20 = fsReport;
fsReport = function () {
    _fsReportS20();
    try {
        if (!fsState.pm) return;
        const tb = document.querySelector('#final-screen table');
        if (!tb) return;
        let r = tb.insertRow(0);
        r.insertCell(0).innerText = 'Pradhan Mantri';
        r.insertCell(1).innerText = fsState.pm.name + ' (' + fsState.pm.party + ')';
        r = tb.insertRow(1);
        r.insertCell(0).innerText = 'Sarkar ki sthirta';
        r.insertCell(1).innerText = fsState.stab.score + '% - ' + fsState.stab.verdict;
    } catch (e) { }
};

// ================= STAGE 21: MUSIC, AWAAZ (SOUND), SETTINGS CONTROL, ANIMATION =================
// Sab awaazein code se banti hain (koi file nahi chahiye). Baad mein AI se bane gaane
// lagane ho to neeche S21_FILES mein file ka rasta likh do (folder: music/).

const S21_FILES = {
    // jaise: menu: 'music/menu.mp3', game: 'music/game.mp3', count: 'music/counting.mp3', win: 'music/win.mp3'
    menu: '', game: '', count: '', win: '', calm: ''
};

const s21 = { ctx: null, master: null, musicGain: null, sfxGain: null, mode: null, timer: null, step: 0, audioEl: null, last: 0,
    cfg: { music: true, sfx: true, vol: 0.6 } };

try {
    const sv = JSON.parse(localStorage.getItem('s21cfg') || 'null');
    if (sv) { s21.cfg.music = sv.music !== false; s21.cfg.sfx = sv.sfx !== false; s21.cfg.vol = typeof sv.vol === 'number' ? sv.vol : 0.6; }
} catch (e) { }

function s21Save() {
    try { localStorage.setItem('s21cfg', JSON.stringify(s21.cfg)); } catch (e) { }
}

function s21Init() {
    if (s21.ctx) { if (s21.ctx.state === 'suspended') s21.ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    s21.ctx = new AC();
    s21.master = s21.ctx.createGain();
    s21.musicGain = s21.ctx.createGain();
    s21.sfxGain = s21.ctx.createGain();
    s21.musicGain.connect(s21.master);
    s21.sfxGain.connect(s21.master);
    s21.master.connect(s21.ctx.destination);
    s21Apply();
    return true;
}

function s21Apply() {
    if (!s21.ctx) return;
    s21.master.gain.value = s21.cfg.vol;
    s21.musicGain.gain.value = s21.cfg.music ? 0.35 : 0;
    s21.sfxGain.gain.value = s21.cfg.sfx ? 1 : 0;
    if (s21.audioEl) s21.audioEl.volume = s21.cfg.music ? Math.min(1, s21.cfg.vol) : 0;
    const b = document.getElementById('s21-mute');
    if (b) b.innerText = (s21.cfg.music || s21.cfg.sfx) ? '\uD83D\uDD0A' : '\uD83D\uDD07';
}

function s21Tone(freq, t0, dur, type, vol, dest) {
    const o = s21.ctx.createOscillator(), g = s21.ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || s21.sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.05);
}

// ---- Chhoti awaazein ----
function s21Sfx(name) {
    if (!s21.cfg.sfx || !s21Init()) return;
    const now = s21.ctx.currentTime;
    if (name === 'tick') {
        if (now - s21.last < 0.07) return;
        s21.last = now;
        s21Tone(900, now, 0.06, 'square', 0.05);
        return;
    }
    const seq = {
        click: [[620, 0, 0.07, 'triangle', 0.12]],
        good: [[523, 0, 0.12, 'triangle', 0.18], [784, 0.1, 0.2, 'triangle', 0.18]],
        bad: [[220, 0, 0.18, 'sawtooth', 0.14], [165, 0.14, 0.3, 'sawtooth', 0.14]],
        coin: [[988, 0, 0.08, 'square', 0.1], [1319, 0.08, 0.25, 'square', 0.1]],
        alert: [[880, 0, 0.12, 'square', 0.14], [660, 0.14, 0.12, 'square', 0.14], [880, 0.28, 0.12, 'square', 0.14], [660, 0.42, 0.2, 'square', 0.14]],
        win: [[523, 0, 0.18, 'triangle', 0.22], [659, 0.18, 0.18, 'triangle', 0.22], [784, 0.36, 0.18, 'triangle', 0.22], [1047, 0.54, 0.6, 'triangle', 0.25]]
    }[name];
    if (!seq) return;
    seq.forEach(function (n) { s21Tone(n[0], now + n[1], n[2], n[3], n[4]); });
}

// ---- Background music (code se banta hua loop) ----
const S21_SCALE = [0, 2, 4, 7, 9];   // pentatonic, sab sur achhe lagte hain
const S21_MODES = {
    menu:  { root: 196, tempo: 520, wave: 'sine', vol: 0.10 },
    game:  { root: 174.6, tempo: 430, wave: 'triangle', vol: 0.10 },
    calm:  { root: 220, tempo: 620, wave: 'sine', vol: 0.09 },
    count: { root: 164.8, tempo: 250, wave: 'square', vol: 0.045 },
    win:   { root: 261.6, tempo: 360, wave: 'triangle', vol: 0.12 }
};

function s21Note(root, deg, oct) {
    return root * Math.pow(2, (S21_SCALE[deg % 5] + 12 * (Math.floor(deg / 5) + (oct || 0))) / 12);
}

function s21Step() {
    if (!s21.ctx || !s21.cfg.music || !s21.mode || s21.audioEl) return;
    const m = S21_MODES[s21.mode];
    if (!m) return;
    const now = s21.ctx.currentTime + 0.02;
    const i = s21.step++;
    const patt = [0, 2, 4, 2, 5, 4, 2, 1];
    const deg = patt[i % 8] + (Math.floor(i / 8) % 2) * 2;
    s21Tone(s21Note(m.root, deg, 0), now, m.tempo / 1000 * 1.4, m.wave, m.vol, s21.musicGain);
    if (i % 4 === 0) s21Tone(s21Note(m.root, 0, -1), now, m.tempo / 1000 * 3.5, 'sine', m.vol * 1.3, s21.musicGain);
}

function s21Music(mode) {
    s21.mode = mode;
    if (s21.timer) { clearInterval(s21.timer); s21.timer = null; }
    if (s21.audioEl) { try { s21.audioEl.pause(); } catch (e) { } s21.audioEl = null; }
    if (!s21.cfg.music) return;
    if (!s21Init()) return;
    const f = S21_FILES[mode];
    if (f) {   // asli gaana file ho to wo bajao, na mile to code wali dhun
        const a = new Audio(f);
        a.loop = true;
        a.volume = Math.min(1, s21.cfg.vol);
        a.onerror = function () { if (s21.audioEl === a) { s21.audioEl = null; s21Music(mode); S21_FILES[mode] = ''; } };
        a.play().then(function () { s21.audioEl = a; }).catch(function () { });
        return;
    }
    const m = S21_MODES[mode];
    if (!m) return;
    s21.timer = setInterval(s21Step, m.tempo);
}

// ---- Settings: music / awaaz / volume ----
function s21Toggle(what) {
    s21.cfg[what] = !s21.cfg[what];
    s21Save();
    s21Init();
    s21Apply();
    if (what === 'music') s21Music(s21.cfg.music ? (s21.mode || 'game') : s21.mode);
    s21Sfx('click');
    if (typeof refreshPanel === 'function') { try { refreshPanel(); } catch (e) { } }
}

function s21Vol(v) {
    s21.cfg.vol = Math.max(0, Math.min(1, v / 100));
    s21Save();
    s21Init();
    s21Apply();
}

function s21MuteAll() {
    const on = s21.cfg.music || s21.cfg.sfx;
    s21.cfg.music = !on; s21.cfg.sfx = !on;
    s21Save(); s21Init(); s21Apply();
    s21Music(s21.mode || 'game');
    if (typeof refreshPanel === 'function') { try { refreshPanel(); } catch (e) { } }
}

const _renderSettingsPanelS21 = renderSettingsPanel;
renderSettingsPanel = function () {
    let h = _renderSettingsPanelS21();
    const on = function (v) { return v ? 'background:#16a34a;' : 'background:#7f1d1d;'; };
    h += '<div class="ap-sec"><b>Awaaz aur Music</b><br>' +
        '<button class="ap-btn" style="margin-right:6px;' + on(s21.cfg.music) + '" onclick="s21Toggle(\'music\')">Music: ' + (s21.cfg.music ? 'ON' : 'OFF') + '</button>' +
        '<button class="ap-btn" style="' + on(s21.cfg.sfx) + '" onclick="s21Toggle(\'sfx\')">Awaaz (SFX): ' + (s21.cfg.sfx ? 'ON' : 'OFF') + '</button><br>' +
        '<div style="margin-top:8px">Volume: <input type="range" min="0" max="100" value="' + Math.round(s21.cfg.vol * 100) + '" oninput="s21Vol(this.value)" style="vertical-align:middle;width:60%"></div>' +
        '<span class="ap-note">Abhi ki dhun code se banti hai. Apna gaana lagana ho to music/ folder mein mp3 rakh kar script.js mein S21_FILES mein naam likho.</span></div>';
    return h;
};

// ---- Sahi jagah par awaaz aur music ----
const _fsExitPollS21 = fsExitPoll;
fsExitPoll = function () { s21Music('calm'); _fsExitPollS21(); };

const _fsCountingS21 = fsCounting;
fsCounting = function () { s21Music('count'); s21Sfx('alert'); _fsCountingS21(); };

const _s19DeclareS21 = s19Declare;
s19Declare = function (cs, k) { _s19DeclareS21(cs, k); s21Sfx('tick'); };

const _s19RenderCountS21 = s19RenderCount;
s19RenderCount = function () {
    _s19RenderCountS21();
    const cs = s19.cs;
    if (cs && cs.newKey === 'brk') s21Sfx('alert');
    if (cs && cs.done && !cs.soundDone) { cs.soundDone = true; s21Sfx('win'); s21Music('calm'); }
};

const _s20ApplyS21 = s20Apply;
s20Apply = function (p, buyer, mode, rows, who) {
    const ok = _s20ApplyS21(p, buyer, mode, rows, who);
    if (buyer === 'you') s21Sfx(ok ? 'coin' : 'bad');
    return ok;
};

const _s20OathS21 = s20Oath;
s20Oath = function () { s21Music('win'); s21Sfx('win'); _s20OathS21(); };

// ---- Har button par click ki awaaz + mute button + animation ----
function s21Style() {
    if (document.getElementById('s21-style')) return;
    const st = document.createElement('style');
    st.id = 's21-style';
    st.textContent = `
button{transition:transform .12s,filter .15s,box-shadow .15s;}
button:active{transform:scale(.95)!important;}
.ap-btn:hover,.wr-icon-btn:hover,.close-modal-btn:hover{transform:translateY(-2px);filter:brightness(1.18);}
.wr-icon-btn:hover{box-shadow:0 0 14px rgba(56,189,248,.55);}
.modal:not(.hidden) .modal-content{animation:s21ModalIn .28s ease;}
@keyframes s21ModalIn{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
.fs-box{animation:s21ModalIn .4s ease;}
#s21-mute{position:fixed;right:12px;bottom:12px;z-index:900;width:42px;height:42px;border-radius:50%;border:1px solid #38bdf8;background:#0f172a;color:#fff;font-size:1.15rem;cursor:pointer;box-shadow:0 0 12px rgba(56,189,248,.35);}
`;
    document.head.appendChild(st);
}

window.addEventListener('DOMContentLoaded', function () {
    s21Style();
    const b = document.createElement('button');
    b.id = 's21-mute';
    b.title = 'Awaaz on/off';
    b.onclick = function (e) { e.stopPropagation(); s21MuteAll(); };
    document.body.appendChild(b);
    s21Apply();
    b.innerText = (s21.cfg.music || s21.cfg.sfx) ? '\uD83D\uDD0A' : '\uD83D\uDD07';
    // browser pehle click ke baad hi awaaz chalne deta hai
    document.addEventListener('click', function (e) {
        const t = e.target.closest ? e.target.closest('button, .wr-icon-btn, .settings-box, [onclick]') : null;
        if (!s21.ctx) { s21Init(); s21Music(s21.mode || 'game'); }
        if (t && t.id !== 's21-mute') s21Sfx('click');
    }, true);
});

// ================= STAGE 22: LOGO ANIMATION, PAGE 1 (IMAGES), PARTY PAGE, ICONS, PARTY LOGOS =================
// Image folders (Windows mein bada/chhota letter jaisa aapne rakha):
//   Images/logo.png            Images/bg/home.png
//   Images/menu/<naam>.png     Images/Icons/<naam>.jpg     Images/Parties/<naam>.jpg
const S22_DIR = 'Images/';
const S22_LOGO_DATA = 'data:image/png;base64,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';

// ---------- 1) Naye dal: TVK aur Jan Suraaj ----------
function s22AddParty(name, bloc, w, color, states, symbol) {
    if (PARTY_DB[name]) return;
    const p = { name: name, symbol: symbol, bloc: bloc, w: w, color: color, states: states };
    PARTY_DB[name] = p;
    partiesList.push(p);
    partyColors[name] = color;
}
s22AddParty('TVK', 'OTHER', 2, '#eab308', ['Tamil Nadu', 'Puducherry'], 'TVK');
s22AddParty('Jan Suraaj', 'OTHER', 1, '#f59e0b', ['Bihar'], 'JSR');

// ---------- 2) Party logo: file ka naam aur dikhane ka tareeka ----------
const S22_LOGO_FILE = {
    'BJP': 'bjp', 'Congress': 'inc', 'BSP': 'bsp', 'DMK': 'dmk', 'RJD': 'rjd', 'Samajwadi Party': 'spa',
    'TMC': 'tmc', 'Shiv Sena (UBT)': 'shivsena(ubt)', 'Jan Suraaj': 'js', 'TVK': 'tvk'
};
const s22Miss = {};

function s22Slug(n) { return String(n).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''); }
function s22LogoName(p) { return S22_LOGO_FILE[p] || s22Slug(p); }

function s22Badge(p, size) {
    const d = PARTY_DB[p];
    const c = (d && d.color) || '#64748b';
    const t = (d && d.symbol) || String(p).slice(0, 3);
    return '<span class="s22-badge" style="width:' + size + 'px;height:' + size + 'px;background:' + c + ';font-size:' + Math.max(8, Math.round(size / 4.2)) + 'px">' + esc(t) + '</span>';
}

function s22Logo(p, size) {
    size = size || 40;
    try { const cl = window.CareerMode && CareerMode.logoFor && CareerMode.logoFor(p); if (cl) return '<img class="s22-logo" style="width:' + size + 'px;height:' + size + 'px;object-fit:contain;border-radius:10px;background:#fff" src="' + cl + '" alt="">'; } catch (e) {}
    if (s22Miss[p]) return s22Badge(p, size);
    return '<img class="s22-logo" data-p="' + esc(p) + '" data-s="' + size + '" data-t="0" style="width:' + size + 'px;height:' + size + 'px" ' +
        'src="' + S22_DIR + 'Parties/' + encodeURI(s22LogoName(p)) + '.jpg" onerror="s22LogoErr(this)">';
}

function s22LogoErr(img) {
    const p = img.getAttribute('data-p');
    const t = img.getAttribute('data-t');
    if (t === '0') {
        img.setAttribute('data-t', '1');
        img.src = S22_DIR + 'Parties/' + encodeURI(s22LogoName(p)) + '.png';
        return;
    }
    s22Miss[p] = 1;
    const tmp = document.createElement('span');
    tmp.innerHTML = s22Badge(p, parseInt(img.getAttribute('data-s'), 10) || 40);
    if (img.parentNode) img.parentNode.replaceChild(tmp.firstChild, img);
}

// s19/s20 ke pages mein "rang ka bindu + dal ka naam" ko logo se badlo
function s22Dots(html) {
    return html.replace(/<span class="s19-dot" style="background:[^"]+"><\/span>(<b>)?([^<]{1,40})(<\/b>)?/g, function (m, b1, name, b2) {
        const n = name.replace(/&amp;/g, '&');
        if (!PARTY_DB[n]) return m;
        return s22Logo(n, 22) + ' ' + (b1 || '') + name + (b2 || '');
    });
}
const _s19ShowS22 = s19Show;
s19Show = function (html) { _s19ShowS22(s22Dots(html)); };

// ---------- 3) CSS ----------
function s22Style() {
    if (document.getElementById('s22-style')) return;
    const st = document.createElement('style');
    st.id = 's22-style';
    st.textContent = `
@keyframes s22Reveal{0%{clip-path:inset(0 100% 0 0);opacity:0;transform:scale(.96)}100%{clip-path:inset(0 0 0 0);opacity:1;transform:scale(1)}}
@keyframes s22Pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.88;transform:scale(1.025)}}
@keyframes s22Sweep{from{width:0;opacity:0}20%{opacity:1}to{width:100%;opacity:1}}
@keyframes s22CardIn{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:none}}
@keyframes s22Drift{0%{background-position:50% 50%}50%{background-position:52% 48%}100%{background-position:50% 50%}}
@keyframes s22VS{0%,100%{transform:scale(1);text-shadow:0 0 8px #ef4444}50%{transform:scale(1.18);text-shadow:0 0 22px #ef4444}}
.s22-splash-logo{margin:6px 0 22px;display:flex;flex-direction:column;align-items:center;}
.s22-splash-logo img{width:min(430px,78vw);animation:s22Reveal 1.5s cubic-bezier(.2,.7,.2,1) both,s22Pulse 3.4s 1.5s ease-in-out infinite;}
.s22-sweep{height:4px;margin-top:6px;border-radius:3px;background:linear-gradient(90deg,#ff9933 0 33%,#ffffff 33% 66%,#22c55e 66% 100%);animation:s22Sweep 1.8s .9s ease-out both;max-width:min(430px,78vw);}
.s22-fallback-title{font-size:4rem;color:#fff;font-weight:bold;text-shadow:0 0 18px rgba(255,153,51,.7);animation:s22Reveal 2s both;}

#main-dashboard,#become-pm-screen,#campaign-setup-screen,#seat-sharing-screen{background:linear-gradient(180deg,rgba(4,7,14,.5),rgba(4,7,14,.86)),url("Images/bg/home.png") center/cover no-repeat,url("Images/bg/home.jpg") center/cover no-repeat,radial-gradient(ellipse at 50% 0%,#14213d 0%,#0b0f19 62%) !important;}
#become-pm-screen,#campaign-setup-screen,#seat-sharing-screen{background:linear-gradient(180deg,rgba(4,7,14,.78),rgba(4,7,14,.92)),url("Images/bg/home.png") center/cover no-repeat,url("Images/bg/home.jpg") center/cover no-repeat,#0b0f19 !important;}

.dash-top-bar{padding:10px 16px !important;}
.user-id-box,.settings-box{background:rgba(15,23,42,.72) !important;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.22) !important;box-shadow:0 0 14px rgba(0,0,0,.5);display:flex;align-items:center;gap:8px;}
.s22-av{width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid #ff9933;}
.s22-gear{width:28px;height:28px;object-fit:cover;border-radius:50%;}
.settings-box{padding:6px !important;}

.dash-card{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.22) !important;border-radius:16px !important;background-color:#101828;background-size:cover;background-position:center;
  justify-content:flex-end !important;align-items:flex-start !important;text-align:left !important;min-height:120px;animation:s22CardIn .65s both;box-shadow:0 8px 24px rgba(0,0,0,.55) !important;
  transition:transform .25s,box-shadow .25s,border-color .25s,background-size .6s;}
.dash-card:hover{transform:translateY(-5px) scale(1.012) !important;border-color:#ff9933 !important;box-shadow:0 0 28px rgba(255,153,51,.55) !important;background-size:112% !important;}
.dash-card h2,.dash-card h3,.dash-card p,.dash-card span{text-shadow:0 2px 8px #000;position:relative;z-index:2;}
.dash-card h2{font-size:1.5rem !important;color:#fff;letter-spacing:2px;}
.dash-card h3{color:#fff !important;font-size:1.25rem !important;}
.dash-card p{color:#e2e8f0 !important;}
.career-card{flex:1.25;}.hot-event-card{flex:1;}.mla-mp-row{flex:1;}.small-card{min-height:110px;}
.small-card span{display:none !important;}
.badge-soon{background:rgba(127,29,29,.92) !important;z-index:3;border-radius:10px !important;font-weight:bold;}
.house-btn{position:relative;overflow:hidden;min-width:260px !important;height:58px !important;border-radius:12px !important;border:1px solid rgba(255,255,255,.28) !important;background-color:#16213a;background-size:cover;background-position:center;color:#fff !important;letter-spacing:2px;text-shadow:0 2px 8px #000;box-shadow:0 6px 18px rgba(0,0,0,.55);}

#become-pm-screen .pm-container{width:min(900px,94vw);background:rgba(11,17,31,.78) !important;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.16) !important;border-radius:20px !important;box-shadow:0 18px 60px rgba(0,0,0,.7) !important;}
#become-pm-screen .pm-title{font-size:2.4rem;background:linear-gradient(90deg,#ff9933,#fff,#22c55e);-webkit-background-clip:text;background-clip:text;color:transparent;}
.party-select-box{width:min(320px,40vw) !important;height:230px !important;border-radius:18px !important;background:linear-gradient(160deg,rgba(30,41,59,.9),rgba(15,23,42,.9)) !important;border:2px dashed #3b82f6 !important;transition:transform .25s,box-shadow .25s,border-color .25s;}
.party-select-box:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 0 26px rgba(56,189,248,.45);}
.party-select-box.s22-filled{border-style:solid !important;}
#select-you-box.s22-filled{border-color:#38bdf8 !important;box-shadow:0 0 22px rgba(56,189,248,.4);}
#select-opp-box.s22-filled{border-color:#ff9933 !important;box-shadow:0 0 22px rgba(255,153,51,.4);}
.vs-text{animation:s22VS 1.6s ease-in-out infinite;font-size:2.2rem !important;}
.s22-sel{display:flex;flex-direction:column;align-items:center;gap:8px;}
.s22-sel .nm{font-size:1.2rem;font-weight:bold;color:#fff;}.s22-sel .sb{font-size:.78rem;color:#94a3b8;}
.s22-ph{font-size:1rem;color:#94a3b8;}.s22-ph b{display:block;font-size:2.4rem;color:#475569;}

.s22-logo{border-radius:10px;object-fit:contain;background:#fff;padding:2px;vertical-align:middle;flex:none;}
.s22-badge{display:inline-flex;align-items:center;justify-content:center;border-radius:10px;color:#fff;font-weight:bold;vertical-align:middle;flex:none;text-align:center;overflow:hidden;line-height:1;}

#party-modal .modal-content{width:min(860px,95vw) !important;max-height:92vh;background:linear-gradient(160deg,#131b2e,#0d1424) !important;border:1px solid #334155;border-radius:18px !important;}
#party-modal .party-grid{display:grid !important;grid-template-columns:repeat(auto-fill,minmax(250px,1fr)) !important;gap:10px !important;max-height:58vh;overflow-y:auto;padding:4px;}
.s22-psearch{width:100%;box-sizing:border-box;background:#1e293b;color:#fff;border:1px solid #475569;border-radius:10px;padding:10px 14px;font-size:.95rem;margin-bottom:10px;}
.s22-phead{grid-column:1/-1;text-align:left;color:#ff9933;font-weight:bold;letter-spacing:1px;padding:8px 4px 4px;border-bottom:1px solid #26324a;margin-top:6px;}
.s22-pcard{display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#1e293b,#172033);border:1px solid #334155;border-left:5px solid var(--c);border-radius:12px;padding:9px 10px;cursor:pointer;text-align:left;animation:s22CardIn .35s both;transition:transform .15s,box-shadow .15s,border-color .15s;}
.s22-pcard:hover{transform:translateY(-3px);box-shadow:0 0 16px rgba(56,189,248,.4);border-color:#38bdf8;}
.s22-pinfo{display:flex;flex-direction:column;flex:1;min-width:0;}.s22-pinfo b{color:#fff;font-size:.9rem;}.s22-pinfo span{color:#94a3b8;font-size:.7rem;}
.s22-bloc{font-size:.62rem;font-weight:bold;padding:2px 7px;border-radius:9px;}
.s22-bloc.NDA{background:#7c2d12;color:#fdba74;}.s22-bloc.INDIA{background:#14532d;color:#86efac;}.s22-bloc.OTHER{background:#334155;color:#cbd5e1;}

.wr-sidebar{overflow-y:auto !important;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:#38bdf8 #131b2e;width:72px !important;overscroll-behavior:contain;}
.wr-sidebar::-webkit-scrollbar{width:7px;}.wr-sidebar::-webkit-scrollbar-thumb{background:#38bdf8;border-radius:4px;}.wr-sidebar::-webkit-scrollbar-track{background:#131b2e;}
.wr-side-icon{flex:0 0 auto !important;}
.wr-side-icon.s22-iconbtn{width:56px !important;height:56px !important;padding:0 !important;position:relative;overflow:hidden;background-color:#1e293b;background-size:cover;background-position:center;border:2px solid #475569 !important;border-radius:10px !important;}
.wr-side-icon.s22-iconbtn:hover{border-color:#ff9933 !important;box-shadow:0 0 12px rgba(255,153,51,.7);}
.wr-side-icon.s22-iconbtn .ic-t{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.72);color:#fff !important;font-size:8px !important;line-height:12px;text-align:center;letter-spacing:.5px;}
#main-dashboard .dash-grid-container{max-width:none !important;width:64vw !important;margin:6px auto 6px 2.5vw !important;gap:14px !important;min-height:0;}
#main-dashboard .dash-left-column{flex:1.55 !important;gap:12px !important;min-height:0;}
#main-dashboard .dash-right-column{flex:1 !important;gap:10px !important;min-height:0;align-self:flex-start;height:84%;}
#main-dashboard .dash-card{min-height:0 !important;}
#main-dashboard .big-card:nth-child(1){flex:1.15;}
.dash-bottom-bar{max-width:none !important;width:64vw !important;margin:0 auto 6px 2.5vw !important;gap:14px !important;}
.house-btn{min-width:0 !important;flex:1;}
.wr-logo{display:inline-flex !important;align-items:center;gap:5px;}
`;
    document.head.appendChild(st);
}

// ---------- 4) Logo animation (splash) ----------
function s22Splash() {
    const t = document.querySelector('.splash-title');
    if (!t || !t.parentNode) return;
    const wrap = document.createElement('div');
    wrap.className = 's22-splash-logo';
    wrap.innerHTML = '<img src="' + S22_LOGO_DATA + '" alt="Rajniti" onerror="s22LogoFail(this)"><div class="s22-sweep"></div>';
    t.parentNode.replaceChild(wrap, t);
}
function s22LogoFail(img) {
    const f = document.createElement('div');
    f.className = 's22-fallback-title';
    f.textContent = String.fromCharCode(2352, 2366, 2332, 2344, 2368, 2340, 2367);
    if (img.parentNode) img.parentNode.replaceChild(f, img);
}

// ---------- 5) Page 1 (dashboard) mein images ----------
function s22Probe(urls, cb, fail) {
    let i = 0;
    (function next() {
        if (i >= urls.length) { if (fail) fail(); return; }
        const im = new Image();
        im.onload = function () { cb(urls[i]); };
        im.onerror = function () { i++; next(); };
        im.src = urls[i];
    })();
}
function s22Urls(folder, name) {
    return ['png', 'jpg', 'jpeg', 'webp'].map(function (e) { return S22_DIR + folder + '/' + name + '.' + e; });
}

function s22Dashboard() {
    const cards = document.querySelectorAll('#main-dashboard .dash-card');
    const names = ['lok_sabha', 'state_assembly', 'career_mode', 'mla', 'mp', 'hot_event'];
    cards.forEach(function (c, i) {
        c.style.animationDelay = (0.1 + i * 0.12) + 's';
        if (!names[i]) return;
        s22Probe(s22Urls('menu', names[i]), function (url) {
            c.style.backgroundImage = 'linear-gradient(0deg,rgba(0,0,0,.84) 0%,rgba(0,0,0,.18) 58%,rgba(0,0,0,.4) 100%),url("' + url + '")';
        });
    });
    const t = document.querySelectorAll('#main-dashboard h3');
    t.forEach(function (h) { if (/CARRIER/i.test(h.textContent)) h.textContent = 'CAREER MODE'; });
    const hb = document.querySelectorAll('#main-dashboard .house-btn');
    ['lower_house', 'upper_house'].forEach(function (n, i) {
        if (!hb[i]) return;
        s22Probe(s22Urls('menu', n), function (url) {
            hb[i].style.backgroundImage = 'linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.25)),url("' + url + '")';
        });
    });
    const u = document.querySelector('#main-dashboard .user-icon');
    if (u) s22Probe(s22Urls('menu', 'profile'), function (url) { u.innerHTML = '<img class="s22-av" src="' + url + '">'; });
    const g = document.querySelector('#btn-settings');
    if (g) s22Probe(s22Urls('menu', 'setting'), function (url) { g.innerHTML = '<img class="s22-gear" src="' + url + '">'; });
}

// ---------- 6) Lok Sabha ke baad wala page (Become PM) ----------
function s22PaintSel(which) {
    const name = which === 'you' ? selectedYouParty : selectedOppParty;
    const box = document.getElementById(which === 'you' ? 'select-you-box' : 'select-opp-box');
    const disp = document.querySelector('#' + (which === 'you' ? 'you' : 'opp') + '-box-content .selected-party-display');
    if (!disp || !name) return;
    const d = PARTY_DB[name];
    disp.innerHTML = '<div class="s22-sel">' + s22Logo(name, 92) + '<div class="nm">' + esc(name) + '</div>' +
        '<div class="sb">' + (d ? esc(partyWhere(d)) + ' | ' + (d.bloc === 'OTHER' ? 'Alag' : d.bloc) : '') + '</div></div>' +
        '<p id="' + which + '-text" style="display:none">' + esc(name) + '</p>';
    if (box) box.classList.add('s22-filled');
}

const _confirmSelectionS22 = confirmSelection;
confirmSelection = function (partyName) {
    _confirmSelectionS22(partyName);
    if (selectedYouParty) s22PaintSel('you');
    if (selectedOppParty) s22PaintSel('opp');
};

// bade dal upar, chhote neeche
const S22_ORDER = ['BJP', 'Congress', 'Samajwadi Party', 'TMC', 'DMK', 'TDP', 'JD(U)', 'Shiv Sena (UBT)', 'NCP (SP)', 'Shiv Sena', 'AAP', 'RJD', 'LJP (RV)', 'YSRCP', 'BSP',
    'CPI(M)', 'JMM', 'IUML', 'AIADMK', 'BJD', 'BRS', 'JD(S)', 'AIMIM', 'TVK', 'SAD', 'RLD', 'Jana Sena', 'CPI', 'CPI(ML)L', 'National Conference', 'VCK', 'NCP (Ajit Pawar)',
    'Apna Dal (S)', 'HAM', 'AJSU', 'RLM', 'PMK', 'AGP', 'UPPL', 'SKM', 'NPP', 'NPF', 'AMMK', 'SBSP', 'Nishad Party', 'MDMK', 'RSP', 'Kerala Congress (M)', 'VIP (Mukesh Sahani)',
    'Bharat Adivasi Party', 'RLP', 'ASP (Kanshi Ram)', 'Jan Suraaj', 'ZPM', 'VPP', 'MNF', 'INLD', 'JJP', 'DMDK', 'NTK', 'AIUDF', 'BPF', 'PDP', 'SDF'];

function s22Rank(p) {
    const i = S22_ORDER.indexOf(p.name);
    return i === -1 ? 500 + (6 - p.w) : i;
}

function showModalWithOptions() {
    const modal = document.getElementById('party-modal');
    const grid = document.getElementById('party-grid');
    s22Style();
    let inp = document.getElementById('s22-psearch');
    if (!inp) {
        inp = document.createElement('input');
        inp.id = 's22-psearch';
        inp.className = 's22-psearch';
        inp.placeholder = 'Dal ka naam dhundo...';
        inp.oninput = function () { s22FillGrid(); };
        grid.parentNode.insertBefore(inp, grid);
    }
    inp.value = '';
    s22FillGrid();
    modal.classList.remove('hidden');
}

function s22FillGrid() {
    const grid = document.getElementById('party-grid');
    const q = ((document.getElementById('s22-psearch') || {}).value || '').toLowerCase().trim();
    grid.innerHTML = '';
    const list = partiesList.slice().sort(function (a, b) { return s22Rank(a) - s22Rank(b); });
    let lastTier = -1, n = 0;
    const tierOf = function (p) { const r = s22Rank(p); return r < 2 ? 0 : (r < 20 ? 1 : 2); };
    const heads = ['Sabse bade dal', 'Bade kshetriya dal', 'Chhote dal'];
    list.forEach(function (party) {
        if (party.name === selectedYouParty || party.name === selectedOppParty) return;
        let taken = false;
        youAlliancePartners.forEach(function (a, idx) { if (a.name === party.name && !(activeSelectionTarget === 'you-ally' && activeSlotIndex === idx)) taken = true; });
        oppAlliancePartners.forEach(function (a, idx) { if (a.name === party.name && !(activeSelectionTarget === 'opp-ally' && activeSlotIndex === idx)) taken = true; });
        if (taken) return;
        if (q && (party.name + ' ' + party.symbol).toLowerCase().indexOf(q) === -1) return;
        const tier = tierOf(party);
        if (tier !== lastTier && !q) {
            lastTier = tier;
            const h = document.createElement('div');
            h.className = 's22-phead';
            h.textContent = heads[tier];
            grid.appendChild(h);
        }
        const card = document.createElement('div');
        card.className = 's22-pcard';
        card.style.setProperty('--c', party.color);
        card.style.animationDelay = Math.min(n++, 24) * 0.02 + 's';
        card.innerHTML = s22Logo(party.name, 46) + '<div class="s22-pinfo"><b>' + esc(party.name) + '</b><span>' + esc(partyWhere(party)) + '</span></div>' +
            '<span class="s22-bloc ' + party.bloc + '">' + (party.bloc === 'OTHER' ? 'Alag' : party.bloc) + '</span>';
        card.onclick = function () { confirmSelection(party.name); };
        grid.appendChild(card);
    });
    if (!grid.children.length) grid.innerHTML = '<div style="grid-column:1/-1;color:#94a3b8;padding:20px">Koi dal nahi mila.</div>';
}

// ---------- 7) War room ke icons (aapki images) ----------
const S22_ICON_FILE = { BNK: 'bank', MAP: 'map', POL: 'poll', STM: 'stamina', MED: 'rally', ITC: 'itc', MAN: 'manifesto', POA: 'poaching', VIP: 'vip',
    WHT: 'wht', BLK: 'blk', VOT: 'vote', NAR: 'nar', CRT: 'court', MCC: 'ec', GUR: 'guru', SPY: 'spy', DEB: 'deb', KRY: 'kar', DMS: 'dms' };
// OPP aur HWA ki file abhi nahi hai, to unka purana icon dikhega

iconHtml = function (code) {
    const f = S22_ICON_FILE[code];
    if (!f) return ICON_SVG[code] || '';
    return '<img class="ic-img" data-ic="' + code + '" data-t="0" src="' + S22_DIR + 'Icons/' + f + '.jpg" onerror="s22IconErr(this)">';
};

function s22IconErr(img) {
    const code = img.getAttribute('data-ic');
    if (img.getAttribute('data-t') === '0') {
        img.setAttribute('data-t', '1');
        img.src = S22_DIR + 'Icons/' + S22_ICON_FILE[code] + '.png';
        return;
    }
    iconFallback(img);
}

function s22RefreshIcons() {
    document.querySelectorAll('.wr-side-icon[data-ic]').forEach(function (b) {
        const code = b.getAttribute('data-ic');
        const f = S22_ICON_FILE[code];
        if (!f) return;      // file nahi hai: purana icon rehne do
        b.classList.add('s22-iconbtn');
        b.innerHTML = '<span class="ic-t">' + code + '</span>';
        s22Probe([S22_DIR + 'Icons/' + f + '.jpg', S22_DIR + 'Icons/' + f + '.png'], function (url) {
            b.style.backgroundImage = 'url("' + url + '")';
        }, function () {
            b.classList.remove('s22-iconbtn');
            b.innerHTML = (ICON_SVG[code] || '') + '<span class="ic-t">' + code + '</span>';
        });
    });
}

// ---------- 8) War room ke upar ke dal-badge par logo ----------
function s22WarBadges() {
    [['you', selectedYouParty], ['opp', selectedOppParty]].forEach(function (x) {
        const el = document.getElementById('wr-' + x[0] + '-logo');
        if (!el || !x[1]) return;
        const d = PARTY_DB[x[1]];
        el.innerHTML = s22Logo(x[1], 28) + '<span>' + esc(d ? d.symbol : x[1]) + '</span>';
    });
}
if (typeof startWarRoomMap === 'function') {
    const _startWarRoomMapS22 = startWarRoomMap;
    startWarRoomMap = function () { _startWarRoomMapS22.apply(this, arguments); s22WarBadges(); };
}
if (typeof loadGame === 'function') {
    const _loadGameS22 = loadGame;
    loadGame = function () { const r = _loadGameS22.apply(this, arguments); try { s22WarBadges(); } catch (e) { } return r; };
}

// ---------- shuru ----------
s22Style();
s22Splash();
s22Dashboard();
s22RefreshIcons();
window.addEventListener('DOMContentLoaded', function () { document.title = 'Rajniti - The Grand Strategy'; });

// ================= STAGE 23: SETTINGS GEAR ICON, NAYE WAR ROOM ICONS, SUNDAR PANELS (Bank, Stamina, Opinion Poll) =================

// ---------- CSS ----------
function s23Style() {
    if (document.getElementById('s23-style')) return;
    const st = document.createElement('style');
    st.id = 's23-style';
    st.textContent = `
.wr-side-icon.s23-ic{display:flex !important;flex-direction:column;align-items:center;justify-content:center;gap:1px;width:56px !important;height:56px !important;padding:0 !important;border-radius:15px !important;
  background:linear-gradient(145deg,var(--g1),var(--g2)) !important;border:1px solid rgba(255,255,255,.28) !important;box-shadow:0 3px 10px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.3);transition:transform .15s,box-shadow .15s;overflow:hidden;}
.wr-side-icon.s23-ic:hover{transform:translateY(-2px) scale(1.07);box-shadow:0 0 16px var(--g1),inset 0 1px 0 rgba(255,255,255,.4);}
.wr-side-icon.s23-ic svg{width:27px;height:27px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45));}
.wr-side-icon.s23-ic .ic-t{position:static !important;background:none !important;font-size:8px !important;color:#fff !important;font-weight:bold;letter-spacing:.6px;text-shadow:0 1px 2px #000;}
.s23-gear{width:26px;height:26px;stroke:#fff;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;transition:transform .6s;vertical-align:middle;}
.settings-box:hover .s23-gear,button:hover>.s23-gear{transform:rotate(120deg);}

.s23-wrap{display:flex;flex-direction:column;gap:10px;}
.s23-strip{display:flex;gap:8px;flex-wrap:wrap;}
.s23-chip{flex:1;min-width:110px;background:linear-gradient(145deg,#1b2740,#121a2d);border:1px solid #334155;border-radius:12px;padding:7px 10px;}
.s23-chip small{display:block;color:#94a3b8;font-size:.68rem;letter-spacing:.5px;text-transform:uppercase;}.s23-chip b{font-size:1.05rem;color:#fff;}
.s23-hero{display:flex;gap:10px;flex-wrap:wrap;}
.s23-box{flex:1;min-width:200px;background:linear-gradient(145deg,#1d2b4a,#111a2e);border:1px solid #3b4d73;border-radius:16px;padding:14px;box-shadow:0 6px 18px rgba(0,0,0,.4);animation:s23In .4s both;}
.s23-box.dark{background:linear-gradient(145deg,#1f1f2b,#0b0b12);border-color:#4b4b63;}
.s23-lbl{color:#94a3b8;font-size:.72rem;letter-spacing:.8px;text-transform:uppercase;}
.s23-num{font-size:2.3rem;font-weight:bold;color:#fff;line-height:1.1;margin:2px 0 6px;}.s23-num small{font-size:1rem;color:#94a3b8;font-weight:normal;}
.s23-sub{color:#94a3b8;font-size:.76rem;margin-top:5px;}
.s23-bar{height:10px;background:#0b1220;border-radius:6px;overflow:hidden;border:1px solid #26324a;}.s23-bar i{display:block;height:100%;border-radius:6px;transition:width .6s;}
.s23-sec{background:linear-gradient(145deg,#17213a,#0f1729);border:1px solid #2b3b5c;border-radius:14px;padding:12px 14px;animation:s23In .45s both;}
.s23-sec h4{margin:0 0 9px;color:#38bdf8;font-size:.9rem;letter-spacing:.5px;}
.s23-row{display:flex;align-items:center;gap:8px;margin:5px 0;font-size:.82rem;}.s23-row .nm{width:34%;min-width:90px;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.s23-row .bw{flex:1;}.s23-row .vl{width:58px;text-align:right;color:#fff;font-weight:bold;}
.s23-grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;}
.s23-card{background:linear-gradient(145deg,#1d2b4a,#111a2e);border:1px solid #3b4d73;border-radius:16px;padding:14px;text-align:center;animation:s23In .4s both;transition:transform .15s,box-shadow .15s;}
.s23-card:hover{transform:translateY(-3px);box-shadow:0 0 18px rgba(56,189,248,.3);}
.s23-card .ic{font-size:1.8rem;}.s23-card h4{margin:4px 0;color:#fff;}.s23-card p{margin:3px 0 8px;color:#94a3b8;font-size:.78rem;}
.s23-tag{display:inline-block;background:#0b1220;border:1px solid #334155;border-radius:10px;padding:2px 9px;font-size:.72rem;color:#cbd5e1;margin:2px;}
.s23-btn{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:10px;padding:9px 16px;font-weight:bold;cursor:pointer;font-size:.88rem;transition:transform .12s,filter .15s;}
.s23-btn:hover{transform:translateY(-2px);filter:brightness(1.18);}.s23-btn.g{background:linear-gradient(135deg,#16a34a,#15803d);}.s23-btn.o{background:linear-gradient(135deg,#f59e0b,#d97706);}
.s23-ring{--p:50;--c:#22c55e;width:150px;height:150px;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;background:conic-gradient(var(--c) calc(var(--p)*1%),#1e293b 0);position:relative;box-shadow:0 0 22px rgba(0,0,0,.5);}
.s23-ring::before{content:'';position:absolute;inset:13px;border-radius:50%;background:radial-gradient(circle,#16213b,#0b1220);}
.s23-ring span{position:relative;font-size:2.1rem;font-weight:bold;color:#fff;}
.s23-split{display:flex;height:14px;border-radius:7px;overflow:hidden;background:#0b1220;border:1px solid #26324a;}.s23-split i{display:block;height:100%;transition:width .6s;}
.s23-dist{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}.s23-dist div{border-radius:10px;padding:8px 4px;text-align:center;color:#fff;font-size:.7rem;}.s23-dist b{display:block;font-size:1.3rem;}
.s23-msg{border-radius:10px;padding:8px 12px;font-size:.84rem;animation:s23In .3s both;}.s23-msg.ok{background:#14532d;color:#bbf7d0;}.s23-msg.mid{background:#713f12;color:#fde68a;}.s23-msg.bad{background:#7f1d1d;color:#fecaca;}
.s23-empty{text-align:center;color:#94a3b8;padding:18px;border:1px dashed #334155;border-radius:14px;}
@keyframes s23In{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
`;
    document.head.appendChild(st);
}

// ---------- 1) Settings ka gear icon ([SET] text ki jagah) ----------
const S23_GEAR_SVG = '<svg class="s23-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

function s23Gear() {
    document.querySelectorAll('button, div, span, a').forEach(function (e) {
        if (e.children.length === 0 && e.textContent.trim() === '[SET]') e.innerHTML = S23_GEAR_SVG;
    });
}

// ---------- 2) War room ke naye icons (code se, rangeen tile) ----------
function s23Svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
}
const S23_ICONS = {
    BNK: ['#3b82f6', '#1e3a8a', '<path d="M3 10l9-6 9 6"/><path d="M5.5 10v8M10 10v8M14 10v8M18.5 10v8"/><path d="M3 21h18M3 10h18"/>'],
    MAP: ['#10b981', '#064e3b', '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>'],
    POL: ['#8b5cf6', '#4c1d95', '<rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="16" y="9" width="4" height="11" rx="1"/>'],
    STM: ['#f59e0b', '#b45309', '<path d="M13 2L5 13.5h6L10 22l8-11.5h-6z"/>'],
    MED: ['#ef4444', '#991b1b', '<path d="M3 10v4h3l8 5V5L6 10H3z"/><path d="M17.5 9a4 4 0 010 6M20 6.5a8 8 0 010 11"/>'],
    ITC: ['#0ea5e9', '#075985', '<path d="M9.5 3L7.5 21M16.5 3l-2 18M4 8.5h17M3 15.5h17"/>'],
    MAN: ['#f97316', '#9a3412', '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/>'],
    POA: ['#ec4899', '#831843', '<path d="M4 8h14l-3-3M20 16H6l3 3"/>'],
    VIP: ['#eab308', '#854d0e', '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>'],
    WHT: ['#22c55e', '#065f46', '<circle cx="12" cy="12" r="9"/><path d="M8 8h8M8 11.5h8M10 8c4.5 0 4.5 5.5 0 5.5l4.5 3.5"/>'],
    BLK: ['#4b5563', '#030712', '<path d="M9 3h6l-1.5 3h-3z"/><path d="M8.5 8C5 11 4 14 4 17c0 3 3 4 8 4s8-1 8-4c0-3-1-6-4.5-9z"/><path d="M12 12v6M10 13.5h3.5M10 16.5h3.5"/>'],
    OPP: ['#dc2626', '#450a0a', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 9l6 6M15 9l-6 6"/>'],
    VOT: ['#6366f1', '#312e81', '<rect x="4" y="12" width="16" height="9" rx="2"/><path d="M9 16.5h6"/><path d="M8.5 4.5l3.5 3.5 4.5-4.5M12 8v4"/>'],
    NAR: ['#14b8a6', '#134e4a', '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9h8M8 12.5h5"/>'],
    CRT: ['#b45309', '#451a03', '<path d="M13.5 4.5l6 6-3 3-6-6z"/><path d="M12 9L4.5 16.5l3 3L15 12M3 21h9"/>'],
    MCC: ['#3b82f6', '#1e40af', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 5-5"/>'],
    GUR: ['#f472b6', '#9d174d', '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>'],
    SPY: ['#64748b', '#1e293b', '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L21 21"/><circle cx="10" cy="10" r="2"/>'],
    DEB: ['#a78bfa', '#5b21b6', '<path d="M3 4h12v8H8l-3 3v-3H3z"/><path d="M17 9h4v8h-2v3l-3-3h-5v-3"/>'],
    KRY: ['#22c55e', '#14532d', '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M15 14c3 0 6 2 6 5"/>'],
    DMS: ['#fb923c', '#7c2d12', '<path d="M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.4l6-.9z"/>'],
    HWA: ['#06b6d4', '#164e63', '<path d="M4 16a8 8 0 0116 0"/><path d="M12 16l4-5"/><circle cx="12" cy="16" r="1.4"/><path d="M4 16h2M18 16h2M12 8v2"/>']
};
const S23_USE_PHOTO_ICONS = false;   // true karoge to aapki photo wale icons wapas aa jayenge (Stage 22 jaisa)

function s23Icons() {
    if (S23_USE_PHOTO_ICONS) return;
    s23Style();
    document.querySelectorAll('.wr-side-icon[data-ic]').forEach(function (b) {
        const code = b.getAttribute('data-ic');
        const d = S23_ICONS[code];
        if (!d) return;
        b.classList.remove('s22-iconbtn');
        b.classList.add('s23-ic');
        b.style.setProperty('--g1', d[0]);
        b.style.setProperty('--g2', d[1]);
        b.style.backgroundImage = '';
        b.innerHTML = s23Svg(d[2]) + '<span class="ic-t">' + code + '</span>';
    });
}
s22RefreshIcons = function () { s23Icons(); };

// ---------- chhote helpers (panels) ----------
function s23Bar(pct, color) {
    return '<div class="s23-bar"><i style="width:' + Math.max(0, Math.min(100, pct)).toFixed(1) + '%;background:' + color + '"></i></div>';
}
function s23Msg() {
    if (!panelMsg) return '';
    const cls = !panelMsg.ok ? 'bad' : (panelMsg.good ? 'ok' : 'mid');
    return '<div class="s23-msg ' + cls + '">' + esc(panelMsg.text) + '</div>';
}
function s23Strip() {
    const g = gameState;
    const c = function (l, v, col) { return '<div class="s23-chip"><small>' + l + '</small><b style="color:' + col + '">' + v + '</b></div>'; };
    return '<div class="s23-strip">' + c('Stamina', g.stamina + '%', g.stamina > 50 ? '#4ade80' : (g.stamina > 25 ? '#facc15' : '#f87171')) +
        c('White Fund', g.budget + ' Cr', '#86efac') + c('Black Fund', g.blackFund + ' Cr', '#d1d5db') + '</div>';
}
const S23_PAL = ['#38bdf8', '#22c55e', '#f59e0b', '#a78bfa', '#f472b6', '#fb923c', '#2dd4bf', '#94a3b8'];
function s23Rank(title, obj, top, clean) {
    const keys = Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a]; }).slice(0, top);
    if (!keys.length) return '';
    const mx = obj[keys[0]] || 1;
    let h = '<div class="s23-sec"><h4>' + title + '</h4>';
    keys.forEach(function (k, i) {
        h += '<div class="s23-row"><span class="nm" title="' + esc(k) + '">' + esc(clean ? k.replace('|', ' - ') : k) + '</span><span class="bw">' + s23Bar(obj[k] / mx * 100, S23_PAL[i % S23_PAL.length]) + '</span><span class="vl">' + obj[k] + ' Cr</span></div>';
    });
    return h + '</div>';
}

// ---------- 3) Bank panel ----------
function s23Bank() {
    const g = gameState, L = g.ledger.you;
    const start = g.phaseStartBudget || PHASE_FUNDING;
    const wp = L.total ? L.white / L.total * 100 : 0;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero">' +
        '<div class="s23-box"><div class="s23-lbl">White Fund (bacha hua)</div><div class="s23-num" style="color:#86efac">' + g.budget + ' <small>Cr</small></div>' + s23Bar(g.budget / Math.max(1, start) * 100, '#22c55e') +
        '<div class="s23-sub">Phase ki shuruaat: ' + start + ' Cr. Har naye phase mein ' + PHASE_FUNDING + ' Cr milte hain, bacha hua judta hai.</div></div>' +
        '<div class="s23-box dark"><div class="s23-lbl">Black Fund</div><div class="s23-num" style="color:#d1d5db">' + g.blackFund + ' <small>Cr</small></div>' +
        '<div class="s23-sub">Black se kharch 1.5x asar deta hai, par raid / EC notice ka khatra badhta hai.</div></div></div>';
    h += '<div class="s23-sec"><h4>Ab tak ka kul kharch: ' + L.total + ' Cr</h4>';
    if (L.total) {
        h += '<div class="s23-split"><i style="width:' + wp.toFixed(1) + '%;background:#22c55e"></i><i style="width:' + (100 - wp).toFixed(1) + '%;background:#6b7280"></i></div>' +
            '<div class="s23-sub"><span class="s23-tag" style="color:#86efac">White ' + L.white + ' Cr</span><span class="s23-tag">Black ' + L.black + ' Cr</span></div>';
    } else {
        h += '<div class="s23-empty">Abhi tak koi kharch nahi hua. Rally, social media ya debate se shuru karo.</div>';
    }
    h += '</div>';
    h += s23Rank('Kis kaam par kharch', L.byType, 8, false) + s23Rank('Kis state mein', L.byState, 6, false) + s23Rank('Kis seat par', L.bySeat, 6, true);
    return h + '</div>';
}

// ---------- 4) Stamina panel ----------
function s23Stamina() {
    ensureS16();
    const g = gameState, st = g.stamina;
    const col = st > 60 ? '#22c55e' : (st > 30 ? '#facc15' : '#ef4444');
    const mood = st >= 70 ? 'Poore josh mein' : (st >= 45 ? 'Theek-thaak' : (st >= 25 ? 'Thakaan badh rahi hai' : 'Bahut thake hue'));
    const tip = 'Har round ke baad stamina 100% ho jati hai.';
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-sec" style="text-align:center"><div class="s23-ring" style="--p:' + st + ';--c:' + col + '"><span>' + st + '%</span></div>' +
        '<div style="margin-top:10px;font-size:1.05rem;font-weight:bold;color:' + col + '">' + mood + '</div><div class="s23-sub">' + tip + '</div>' +
        '<div style="margin-top:6px"><span class="s23-tag">Har round ke baad 100%</span><span class="s23-tag">Naye phase mein 100%</span><span class="s23-tag">Aaram point: ' + g.rest.you + '</span></div></div>';
    h += '<div class="s23-grid2">' +
        '<div class="s23-card"><div class="ic">&#128564;</div><h4>Aaram karo</h4><p>Thoda rukkar dum lo.<br><b style="color:#86efac">+20% stamina</b></p><span class="s23-tag">3 Cr</span><span class="s23-tag">Phase mein 2 baar</span><br><br>' +
        '<button class="s23-btn g" onclick="uiRest(\'aaram\')">Aaram karo</button></div>' +
        '<div class="s23-card"><div class="ic">&#128657;</div><h4>Energy team bulao</h4><p>Doctor + helicopter ki madad.<br><b style="color:#86efac">+35% stamina</b></p><span class="s23-tag">8 Cr</span><span class="s23-tag">Phase mein 1 baar</span><br><br>' +
        '<button class="s23-btn o" onclick="uiRest(\'team\')">Team bulao</button></div></div>';
    return h + '</div>';
}

// ---------- 5) Opinion poll: behtar data + sundar panel ----------
computePoll = function (noise, withSeats) {
    const view = aiBuildView('you', noise);
    const byState = {}, tight = [];
    const sum = { n: 0, exp: 0, safe: 0, lean: 0, toss: 0, low: 0 };
    view.forEach(function (v) {
        if (!byState[v.st]) byState[v.st] = { n: 0, exp: 0, tight: 0 };
        const p = winProb(v, 0), o = byState[v.st];
        o.n++; o.exp += p;
        if (p > 0.35 && p < 0.65) o.tight++;
        if (p > 0.3 && p < 0.7) tight.push({ seat: v.pc, st: v.st, p: p });
        sum.n++; sum.exp += p;
        if (p >= 0.7) sum.safe++; else if (p >= 0.5) sum.lean++; else if (p >= 0.3) sum.toss++; else sum.low++;
    });
    const rows = Object.keys(byState).map(function (st) { return { st: st, n: byState[st].n, exp: byState[st].exp, tight: byState[st].tight }; })
        .sort(function (a, b) { return b.n - a.n || (a.st < b.st ? -1 : 1); });
    tight.sort(function (a, b) { return Math.abs(a.p - 0.5) - Math.abs(b.p - 0.5); });
    gameState.lastPoll = { phase: gameState.phase, round: gameState.round, paid: !!withSeats, rows: rows, tight: withSeats ? tight.slice(0, 12) : [], sum: sum, err: withSeats ? 5 : 15 };
    const hist = (gameState.pollHist || []).filter(function (x) { return x.phase === gameState.phase; });
    hist.push({ phase: gameState.phase, round: gameState.round, paid: !!withSeats, exp: sum.exp, n: sum.n });
    gameState.pollHist = hist.slice(-6);
};

function s23Poll() {
    const g = gameState;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-grid2">' +
        '<div class="s23-card"><div class="ic">&#9889;</div><h4>Quick poll</h4><p>Muft aur turant, par andaza kaafi galat ho sakta hai.</p><span class="s23-tag">Muft</span><span class="s23-tag">Galti ~ &plusmn;15%</span><br><br><button class="s23-btn" onclick="uiPollQuick()">Quick poll chalao</button></div>' +
        '<div class="s23-card"><div class="ic">&#128202;</div><h4>Paid survey</h4><p>Zyada sahi natija aur kaante ki seats ki list.</p><span class="s23-tag">3 Cr</span><span class="s23-tag">1% stamina</span><span class="s23-tag">Galti ~ &plusmn;5%</span><br><br><button class="s23-btn o" onclick="uiPollPaid()">Survey karao</button></div></div>';
    const p = g.lastPoll;
    if (!p || p.phase !== g.phase || !p.sum) {
        return h + '<div class="s23-empty">Is phase ka poll abhi nahi hua. Upar se Quick poll ya Paid survey chalao.</div></div>';
    }
    const s = p.sum, share = s.n ? s.exp / s.n : 0;
    let verdict = ['Kaante ki takkar', '#facc15'];
    if (share >= 0.58) verdict = ['Aap aage ho', '#4ade80']; else if (share <= 0.42) verdict = ['Aap peeche ho', '#f87171'];
    h += '<div class="s23-box" style="border-color:' + verdict[1] + '"><div class="s23-lbl">' + (p.paid ? 'Paid survey' : 'Quick poll') + ' | Phase ' + p.phase + ', Round ' + p.round + '</div>' +
        '<div class="s23-num">' + s.exp.toFixed(0) + ' <small>/ ' + s.n + ' seats jeetne ki ummeed</small></div>' + s23Bar(share * 100, verdict[1]) +
        '<div style="margin-top:6px;font-weight:bold;color:' + verdict[1] + '">' + verdict[0] + ' <span class="s19-small" style="color:#94a3b8;font-weight:normal">(andaza &plusmn;' + p.err + '%)</span></div></div>';
    h += '<div class="s23-dist">' +
        '<div style="background:#14532d"><b>' + s.safe + '</b>Pakki jeet</div><div style="background:#3f6212"><b>' + s.lean + '</b>Thoda aage</div>' +
        '<div style="background:#854d0e"><b>' + s.toss + '</b>Kaante ki</div><div style="background:#7f1d1d"><b>' + s.low + '</b>Mushkil</div></div>';
    h += '<div class="s23-sec"><h4>State-wise ummeed</h4>';
    p.rows.forEach(function (r) {
        const f = r.n ? r.exp / r.n : 0;
        h += '<div class="s23-row"><span class="nm" title="' + esc(r.st) + '">' + esc(r.st) + '</span><span class="bw">' + s23Bar(f * 100, f >= 0.55 ? '#22c55e' : (f >= 0.4 ? '#facc15' : '#ef4444')) + '</span><span class="vl">' + r.exp.toFixed(1) + '/' + r.n + '</span></div>' +
            '<div class="s23-sub" style="margin:-3px 0 4px 2px">Kaante ki seats: ' + r.tight + ' | Mudde: ' + topIssues(r.st) + '</div>';
    });
    h += '</div>';
    if (p.tight.length) {
        h += '<div class="s23-sec"><h4>Kaante ki seats (jeet ka chance)</h4>';
        p.tight.forEach(function (t) {
            const pc = Math.round(t.p * 100);
            h += '<div class="s23-row"><span class="nm" title="' + esc(t.seat) + '">' + esc(t.seat) + '</span><span class="bw">' + s23Bar(pc, pc >= 50 ? '#22c55e' : '#f59e0b') + '</span><span class="vl">' + pc + '%</span></div>';
        });
        h += '</div>';
    } else if (!p.paid) {
        h += '<div class="s23-sub">Kaante ki seats ki list ke liye Paid survey chalao.</div>';
    }
    const hist = (g.pollHist || []).filter(function (x) { return x.phase === g.phase; });
    if (hist.length > 1) {
        h += '<div class="s23-sec"><h4>Is phase ke polls (rujhaan)</h4>';
        hist.forEach(function (x) { h += '<span class="s23-tag">R' + x.round + (x.paid ? ' paid' : ' quick') + ': ' + x.exp.toFixed(0) + '/' + x.n + '</span>'; });
        h += '</div>';
    }
    return h + '</div>';
}

// ---------- panels ko jodo ----------
const _renderPanelS23 = renderPanel;
renderPanel = function (name) {
    s23Style();
    if (name === 'Bank') return s23Bank();
    if (name === 'Stamina') return s23Stamina();
    if (name === 'Opinion Poll') return s23Poll();
    return _renderPanelS23(name);
};

// ---------- shuru ----------
s23Style();
s23Icons();
s23Gear();
setTimeout(function () { s23Icons(); s23Gear(); }, 1200);
setTimeout(function () { s23Icons(); s23Gear(); }, 3500);

// ================= STAGE 24: SIMPLE ICONS, CONGRESS COLOR, MANIFESTO COST, POACHING + VIP (no limit) =================

// ---------- 1) Simple, ek jaise icons + Congress ka rang ----------
function s24Style() {
    if (document.getElementById('s24-style')) return;
    const st = document.createElement('style');
    st.id = 's24-style';
    st.textContent = `
.wr-side-icon.s23-ic{background:linear-gradient(145deg,#1e293b,#0f172a) !important;border:1px solid #334155 !important;box-shadow:none !important;}
.wr-side-icon.s23-ic svg{stroke:#cbd5e1;filter:none;}
.wr-side-icon.s23-ic .ic-t{color:#94a3b8 !important;}
.wr-side-icon.s23-ic:hover{border-color:#38bdf8 !important;box-shadow:0 0 10px rgba(56,189,248,.35) !important;transform:translateY(-1px) scale(1.05);}
.wr-side-icon.s23-ic:hover svg{stroke:#38bdf8;}
.wr-side-icon.s23-ic:hover .ic-t{color:#e2e8f0 !important;}
`;
    document.head.appendChild(st);
}
s24Style();

// Congress ka rang: hara nahi, aasmaani neela
partyColors['Congress'] = '#19aaed';
if (PARTY_DB['Congress']) PARTY_DB['Congress'].color = '#19aaed';

// ---------- helper: naya data ----------
function ensureS24() {
    ensureS17();
    if (!gameState.poachAsk) gameState.poachAsk = { you: {}, opp: {} };
}
const _freshActionStateS24 = freshActionState;
freshActionState = function () {
    _freshActionStateS24();
    gameState.poachAsk = { you: {}, opp: {} };
};

// ---------- 2) MANIFESTO: kitne bhi vaade, fayda jitna kharch utna ----------
// Ek baar ghoshna ka kharch (once) + har naye phase mein alag kharch (cost)
PROMISES.forEach(function (p) {
    const b = (p.amt || 0) + 1.5 * (p.nat || 0) + 0.01 * (p.hawa || 0);
    p.once = Math.max(14, Math.round(b * 300));
    p.cost = Math.max(5, Math.round(b * 110));
});

function actPromise(id) {
    const p = promiseOf(id);
    return {
        type: 'Manifesto', cost: p.once, stamina: 0,
        check: function (side) {
            ensureS24();
            if (gameState.manifesto[side].indexOf(id) !== -1) return 'Yeh vaada pehle se manifesto mein hai.';
            if (gameState.manifesto[otherSide(side)].indexOf(id) !== -1) return 'Yeh vaada rival ne pehle hi kar liya.';
            if (side === 'opp' && AI_CONFIG.enabled && gameState.manifesto.opp.length >= (AI_CONFIG.maxPromises || 3)) return 'AI ne chhoda';
            return null;
        },
        apply: function (m, side) {
            gameState.manifesto[side].push(id);
            if (p.issue) addBoost(side, 'issue', p.issue, p.amt);
            if (p.nat) addBoost(side, 'national', p.nat);
            if (p.hawa) shiftHawa(side, p.hawa, 'Manifesto');
            return { text: sideName(side) + ' ne vaada kiya: ' + p.name + ' (' + p.group + ').', good: true, hawa: 0 };
        }
    };
}

declarePromise = function (side, id) {
    const r = doAction(side, actPromise(id), side === 'you' ? gameState.fundMode : 'white');
    return { ok: r.ok, good: r.good, text: r.text };
};

uiPromise = function (id) { runUi(actPromise(id)); };

function renderManifestoPanel24() {
    ensureS24();
    const mine = gameState.manifesto.you, rival = gameState.manifesto.opp;
    let h = actionHeader(true);
    h += '<div class="ap-note">Manifesto: kitne bhi vaade kar sakte ho, koi limit nahi. Do kharch lagte hain: <b>(1) ghoshna ka kharch</b> jab vaada karo, aur <b>(2) har naye phase mein</b> uska alag kharch. Jitna bada fayda, utna zyada kharch. Jo vaada aap kar lo, rival wo nahi kar sakta (aur ulta).<br>' +
        'Abhi ' + mine.length + ' vaade | Har phase ka bojh: <b>' + promiseBurden('you') + ' Cr</b></div>';
    h += '<table class="ap-table"><tr><th>Vaada</th><th>Varg</th><th>Ghoshna</th><th>Har phase</th><th></th></tr>' + PROMISES.map(function (p) {
        const on = mine.indexOf(p.id) !== -1, taken = rival.indexOf(p.id) !== -1;
        return '<tr><td>' + esc(p.name) + '</td><td>' + esc(p.group) + '</td><td>' + p.once + ' Cr</td><td>' + p.cost + ' Cr</td><td>' +
            (on ? 'kiya hua' : (taken ? 'rival ne liya' : '<button class="ap-btn" onclick="uiPromise(\'' + p.id + '\')">Ghoshna</button>')) + '</td></tr>';
    }).join('') + '</table>';
    return h;
}

// ---------- 3) POACHING: koi limit nahi, mana kare to agli baar zyada daam ----------
ensurePoach = function () {
    ensureS24();
    if (gameState.poach.phase === gameState.phase || !resultModel) return;
    gameState.poach.phase = gameState.phase;
    ['you', 'opp'].forEach(function (side) {
        const keys = shuffled(Object.keys(resultModel.seats).filter(function (k) { return resultModel.seats[k].phase === gameState.phase; })).slice(0, 3);
        gameState.poach[side] = keys.map(function (k) {
            const s = resultModel.seats[k];
            return { name: randName(), key: k, st: s.st, pc: s.pc, price: 20 + Math.floor(Math.random() * 16), taken: false };
        });
    });
};

function s24Ask(side, key) {
    ensureS24();
    let o = gameState.poachAsk[side][key];
    if (!o) {
        o = { name: randName(), price: 20 + Math.floor(Math.random() * 16), taken: false, tries: 0 };
        gameState.poachAsk[side][key] = o;
    }
    return o;
}

function actPoachSeat(side, key) {
    const s = resultModel.seats[key];
    const o = s24Ask(side, key);
    return {
        type: 'Poaching', st: s.st, key: key, cost: o.price, stamina: 3,
        check: function () {
            if (seatResults[key]) return 'Is seat ka natija aa chuka.';
            if (s.phase !== gameState.phase) return 'Poaching sirf is phase ki seats par ho sakti hai.';
            return o.taken ? 'Yeh neta pehle hi saath aa gaya.' : null;
        },
        apply: function (m, side2) {
            const sgn = side2 === 'you' ? 1 : -1;
            const rival = otherSide(side2);
            const chance = Math.max(0.2, Math.min(0.9, 0.5 + sgn * (gameState.hawa || 0) / 300 + 0.08 * o.tries));
            if (Math.random() < chance) {
                o.taken = true;
                addBoost(side2, 'seat', key, 0.25);
                addBoost(rival, 'seat', key, -0.2);
                if (!gameState.vips[side2][key]) {
                    gameState.vips[side2][key] = { name: o.name, st: s.st, pc: s.pc, phase: s.phase, won: null, poached: true };
                }
                return { text: o.name + ' ne ' + s.pc + ' (' + s.st + ') mein dal badal kar ' + sideName(side2) + ' ka daaman thama.', good: true, hawa: 2 };
            }
            o.tries++;
            o.price = Math.round(o.price * 1.4) + 3;
            return { text: o.name + ' ne offer thukra diya. Agli baar ' + o.price + ' Cr maang raha hai.', good: false, hawa: 0 };
        }
    };
}

function uiPoachSeat() {
    if (uiSel.seat) runUi(actPoachSeat('you', uiSel.seat));
}

function renderPoachPanel24() {
    ensureS24();
    ensurePoach();
    let h = actionHeader(true);
    h += '<div class="ap-sec"><b>Poaching</b> - is phase ki koi bhi seat chuno aur wahan ke neta ko paise dekar apne saath lo. Koi limit nahi, bas stamina aur paisa. Neta mana kare to agli baar zyada daam maangta hai. Safal hone par seat par badhat aur wo VIP ban jata hai.<br>' +
        stateSelectHtml() + ' ';
    const seats = activeSeats(uiSel.state);
    h += seatSelectHtml(seats);
    if (uiSel.seat) {
        const o = s24Ask('you', uiSel.seat);
        if (o.taken) {
            h += '<br><span class="ap-note">' + esc(o.name) + ' pehle hi saath aa chuka hai.</span>';
        } else {
            h += '<br>Neta: <b>' + esc(o.name) + '</b> | Daam: <b>' + o.price + ' Cr</b> | Stamina: <b>3%</b>' + (o.tries ? ' | Mana kar chuka: ' + o.tries + ' baar' : '') +
                '<br><button class="ap-btn" onclick="uiPoachSeat()">Kharido</button>';
        }
    }
    h += '</div>';
    const done = Object.keys(gameState.poachAsk.you).filter(function (k) { return gameState.poachAsk.you[k].taken; });
    if (done.length) {
        h += '<table class="ap-table"><tr><th>Neta</th><th>Seat</th></tr>' + done.map(function (k) {
            const s = resultModel.seats[k];
            return '<tr><td>' + esc(gameState.poachAsk.you[k].name) + '</td><td>' + esc(s.pc) + ' (' + esc(s.st) + ')</td></tr>';
        }).join('') + '</table>';
    }
    return h + _renderPanelS17Orig('Poaching');
}

// ---------- 4) VIP seats: jitni chaho utni ----------
actVip = function (key, name) {
    const s = resultModel.seats[key];
    return {
        type: 'VIP Seat', st: s ? s.st : null, key: key, cost: 3, stamina: 0,
        check: function (side) {
            ensureS17();
            if (!s) return 'Seat nahi mili.';
            return gameState.vips[side][key] ? 'Yeh seat pehle se VIP hai.' : null;
        },
        apply: function (m, side) {
            const nm = name || randName();
            gameState.vips[side][key] = { name: nm, st: s.st, pc: s.pc, phase: s.phase, won: null };
            addBoost(side, 'seat', key, 0.15);
            return { text: sideName(side) + ' ne ' + nm + ' ko ' + s.pc + ' (' + s.st + ') se VIP ummeedwar banaya.', good: true, hawa: 0 };
        }
    };
};

uiVipAuto = function () {
    ensureS17();
    const keys = Object.keys(resultModel.seats).filter(function (k) { return !gameState.vips.you[k] && !seatResults[k]; })
        .sort(function (a, b) { return resultModel.seats[b].wYou - resultModel.seats[a].wYou; }).slice(0, 10);
    let n = 0;
    keys.forEach(function (k) { if (doAction('you', actVip(k, randName()), gameState.fundMode).ok) n++; });
    panelMsg = { ok: n > 0, good: n > 0, text: n + ' VIP seat apne aap chuni gayi.' };
    updateStatusPanel();
    refreshPanel();
};

// ---------- panels ko jodo ----------
const _renderPanelS24 = renderPanel;
renderPanel = function (name) {
    s24Style();
    if (name === 'Manifesto') return renderManifestoPanel24();
    if (name === 'Poaching') return renderPoachPanel24();
    const h = _renderPanelS24(name);
    if (name === 'VIP Seats') return h.replace('Apne aap chuno (6 seats)', 'Apne aap chuno (10 seats)').replace('(3 Cr).', '(3 Cr). Koi limit nahi, jitni chaho utni.');
    return h;
};

// ================= STAGE 25: RALLY PANEL (pakki jeet), IT CELL PANEL, MANIFESTO UI, VIP AUTO (no limit) =================

function ensureS25() {
    ensureS14();
    ensureS24();
    if (!gameState.itState) gameState.itState = { you: {}, opp: {} };
}

const _freshActionStateS25 = freshActionState;
freshActionState = function () {
    _freshActionStateS25();
    gameState.itState = { you: {}, opp: {} };
};
const _nextPhaseResetS25 = nextPhaseActionReset;
nextPhaseActionReset = function () {
    _nextPhaseResetS25();
    gameState.itState = { you: {}, opp: {} };
};

// ---- IT cell ke state campaign ginti (har state mein, har phase) ----
const _actSocialS25 = actSocial;
actSocial = function (st, mode) {
    const a = _actSocialS25(st, mode);
    const ap = a.apply;
    a.apply = function (m, side) {
        const out = ap(m, side);
        if (st) {
            ensureS25();
            gameState.itState[side][st] = (gameState.itState[side][st] || 0) + 1;
        }
        return out;
    };
    return a;
};

// ---- Pakki jeet ka hisaab ----
const S25_IT_NEED = 5;      // IT cell ke kam se kam itne state campaign
const S25_OPP_LIMIT = 5;    // opponent ki rally isse kam ho to poori jeet

function s25Info(side, st) {
    ensureS25();
    const cap = Math.max(1, Math.min(10, activeSeats(st).length));
    const mine = gameState.rallies[side][st] || { n: 0 };
    const their = gameState.rallies[otherSide(side)][st] || { n: 0 };
    const it = gameState.itState[side][st] || 0;
    let level = 'none';
    if (it >= S25_IT_NEED) {
        if (mine.n >= cap && their.n < S25_OPP_LIMIT) level = 'full';
        else if (mine.n >= Math.ceil(cap / 2)) level = 'half';
    }
    return { cap: cap, r: mine.n, o: their.n, it: it, level: level };
}

function s25Hint(i) {
    if (i.level === 'full') return ['ok', 'Poore state ki saari seats par pakki jeet!'];
    if (i.level === 'half') {
        return ['mid', 'Aadhi seats par pakki jeet. Poori jeet ke liye: ' + i.cap + ' rally poori karo aur opponent ki rally ' + S25_OPP_LIMIT + ' se kam rakho.'];
    }
    const need = [];
    if (i.it < S25_IT_NEED) need.push('IT cell ke ' + (S25_IT_NEED - i.it) + ' aur state campaign');
    if (i.r < Math.ceil(i.cap / 2)) need.push(Math.ceil(i.cap / 2) - i.r + ' aur rally');
    return ['bad', 'Abhi pakki jeet nahi. Chahiye: ' + need.join(' aur ') + '.'];
}

const _computePhaseResultsS25 = computePhaseResults;
computePhaseResults = function (phase) {
    ensureS25();
    const claims = {}, saved = [];
    const byState = {};
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase !== phase) return;
        (byState[s.st] = byState[s.st] || []).push(k);
    });
    Object.keys(byState).forEach(function (st) {
        ['you', 'opp'].forEach(function (side) {
            const lv = s25Info(side, st).level;
            if (lv === 'none') return;
            const keys = lv === 'full' ? byState[st] : shuffled(byState[st]).slice(0, Math.ceil(byState[st].length / 2));
            keys.forEach(function (k) { (claims[k] = claims[k] || []).push(side); });
            if (side === 'you') pushNews(st + ': ' + (lv === 'full' ? 'saari' : 'aadhi') + ' seats par aapki pakki jeet.');
        });
    });
    Object.keys(claims).forEach(function (k) {
        if (claims[k].length !== 1) return;     // dono ka daava ho to normal natija
        const s = resultModel.seats[k], side = claims[k][0];
        const f = side === 'you' ? 'wYou' : 'wOpp';
        saved.push([s, f, s[f]]);
        s[f] = s[f] * 1000;
    });
    try {
        return _computePhaseResultsS25(phase);
    } finally {
        saved.forEach(function (x) { x[0][x[1]] = x[2]; });
    }
};

// ---- Rally panel (sirf rally) ----
function uiRallyState() { if (uiSel.state) runUi(actStateRally(uiSel.state)); }

function s25Ring(label, n, cap, color) {
    return '<div class="s23-box"><div class="s23-lbl">' + label + '</div><div class="s23-num" style="color:' + color + '">' + n +
        ' <small>/ ' + cap + ' rally</small></div>' + s23Bar(n / cap * 100, color) + '</div>';
}

function renderRallyPanel25() {
    ensureS25();
    const states = activeStates();
    if (!states.length) return '<div class="s23-wrap">' + s23Strip() + '<div class="s23-empty">Is phase mein koi seat nahi hai.</div></div>';
    const sel = stateSelectHtml();
    const st = uiSel.state;
    const seats = activeSeats(st);
    const i = s25Info('you', st), hint = s25Hint(i);
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-sec"><h4>Target state</h4>' + sel + '</div>';
    h += '<div class="s23-hero">' + s25Ring('Aapki rally (' + esc(st) + ')', i.r, i.cap, '#22c55e') +
        '<div class="s23-box dark"><div class="s23-lbl">Opponent ki rally</div><div class="s23-num" style="color:#f87171">' + i.o +
        ' <small>rally</small></div>' + s23Bar(i.o / S25_OPP_LIMIT * 100, '#ef4444') +
        '<div class="s23-sub">' + S25_OPP_LIMIT + ' se kam rahe to aapko poori jeet ka mauka.</div></div></div>';
    h += '<div class="s23-msg ' + hint[0] + '">' + hint[1] + '</div>';
    h += '<div class="s23-strip"><div class="s23-chip"><small>IT cell campaign (is state)</small><b>' + i.it + ' / ' + S25_IT_NEED + '</b></div>' +
        '<div class="s23-chip"><small>Aadhi seats pakki</small><b>' + Math.ceil(i.cap / 2) + ' rally</b></div>' +
        '<div class="s23-chip"><small>Saari seats pakki</small><b>' + i.cap + ' rally</b></div></div>';
    const a1 = actStateRally(st), a2 = actSeatRally('', '', '');
    h += '<div class="s23-grid2">' +
        '<div class="s23-card"><div class="ic">&#128227;</div><h4>State Rally</h4><p>Poore state mein (' + seats.length + ' seats)</p>' +
        '<span class="s23-tag">' + a1.cost + ' Cr</span><span class="s23-tag">Stamina ' + a1.stamina + '%</span><br><br>' +
        '<button class="s23-btn g" onclick="uiRallyState()">State Rally karo</button></div>' +
        '<div class="s23-card"><div class="ic">&#127919;</div><h4>Seat Rally</h4><p>Ek khaas seat par, zyada asar</p>' + seatSelectHtml(seats) + '<br>' +
        '<span class="s23-tag">' + a2.cost + ' Cr</span><span class="s23-tag">Stamina ' + a2.stamina + '%</span><br><br>' +
        '<button class="s23-btn" onclick="uiSeatRally()">Is seat par rally karo</button></div></div>';
    h += '<div class="s23-sec"><h4>Sabhi states (is phase)</h4>';
    states.forEach(function (x) {
        const j = s25Info('you', x.st);
        const tag = j.level === 'full' ? ' pakki: saari' : (j.level === 'half' ? ' pakki: aadhi' : '');
        h += '<div class="s23-row"><span class="nm" title="' + esc(x.st) + '">' + esc(x.st) + '</span><span class="bw">' +
            s23Bar(j.r / j.cap * 100, j.level === 'none' ? '#38bdf8' : '#22c55e') + '</span><span class="vl" style="width:auto">' +
            j.r + '/' + j.cap + ' vs ' + j.o + '</span></div>' +
            (tag ? '<div class="s23-sub" style="margin:-3px 0 4px 2px;color:#86efac">' + tag + '</div>' : '');
    });
    h += '<div class="s23-sub">Daayein: aapki rally / state ki zarurat, "vs" ke baad opponent ki rally.</div></div>';
    return h + '</div>';
}

// ---- IT cell panel ----
function renderSocialPanel25() {
    ensureS25();
    const modes = [['positive', 'Seedha prachar', 'Surakshit', 'g'], ['attack', 'Attack', 'Rival par hamla, 20% ulta', 'o'], ['viral', 'Viral dhamaka', 'Jokhim, bada fayda', '']];
    const card = function (scope, st, title, icon) {
        let c = '<div class="s23-card"><div class="ic">' + icon + '</div><h4>' + title + '</h4>';
        modes.forEach(function (m) {
            c += '<div style="margin:6px 0"><button class="s23-btn ' + m[3] + '" onclick="uiSocialGo(\'' + scope + '\',\'' + m[0] + '\')">' + m[1] + ' - ' + actSocial(st, m[0]).cost + ' Cr</button>' +
                '<div class="s23-sub">' + m[2] + '</div></div>';
        });
        return c + '</div>';
    };
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">IT cell is round mein</div><div class="s23-num">' + gameState.itUsed.you +
        ' <small>/ 2</small></div>' + s23Bar(gameState.itUsed.you / 2 * 100, '#38bdf8') + '<div class="s23-sub">Opponent ke liye bhi yahi limit. Asar: seats aur hawa par.</div></div>';
    const states = activeStates();
    let sel = '';
    if (states.length) {
        sel = stateSelectHtml();
        const i = s25Info('you', uiSel.state);
        h += '<div class="s23-box dark"><div class="s23-lbl">' + esc(uiSel.state) + ' mein IT cell campaign</div><div class="s23-num" style="color:#fbbf24">' + i.it +
            ' <small>/ ' + S25_IT_NEED + '</small></div>' + s23Bar(i.it / S25_IT_NEED * 100, '#f59e0b') +
            '<div class="s23-sub">Pakki jeet ke liye kam se kam ' + S25_IT_NEED + ' state campaign chahiye (rally ke saath).</div></div>';
    }
    h += '</div><div class="s23-grid2">' + card('national', null, 'National Campaign', '&#127760;');
    if (states.length) h += card('state', uiSel.state, 'State Campaign', '&#128241;');
    h += '</div>';
    if (states.length) h += '<div class="s23-sec"><h4>State chuno (state campaign ke liye)</h4>' + sel + '</div>';
    return h + '</div>';
}

// ---- Manifesto panel ----
const S25_PICON = { bijli: '&#9889;', bus: '&#128652;', karz: '&#127806;', msp: '&#128200;', bhatta: '&#128188;', naukri: '&#127970;',
    ration: '&#127834;', infra: '&#128739;', pension: '&#128116;', tax: '&#128176;' };

function s25Eff(p) {
    const a = [];
    if (p.issue) a.push(p.issue + ' mudde par +' + Math.round(p.amt * 100) + '%');
    if (p.nat) a.push('poore desh mein +' + Math.round(p.nat * 100) + '%');
    if (p.hawa) a.push('hawa +' + p.hawa);
    return a.join(' | ');
}

function renderManifestoPanel25() {
    ensureS25();
    const mine = gameState.manifesto.you, rival = gameState.manifesto.opp;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Aapke vaade</div><div class="s23-num">' + mine.length + '</div>' +
        '<div class="s23-sub">Koi limit nahi. Jo aap kar lo, rival nahi kar sakta.</div></div>' +
        '<div class="s23-box dark"><div class="s23-lbl">Har naye phase ka bojh</div><div class="s23-num" style="color:#fbbf24">' + promiseBurden('you') +
        ' <small>Cr</small></div><div class="s23-sub">Rival ke vaade: ' + rival.length + ' (bojh ' + promiseBurden('opp') + ' Cr)</div></div></div>';
    h += '<div class="s23-grid2">';
    PROMISES.forEach(function (p) {
        const on = mine.indexOf(p.id) !== -1, taken = rival.indexOf(p.id) !== -1;
        h += '<div class="s23-card"' + (on ? ' style="border-color:#22c55e"' : '') + '><div class="ic">' + (S25_PICON[p.id] || '&#128220;') + '</div><h4>' + esc(p.name) + '</h4>' +
            '<p>' + esc(p.group) + '<br>' + esc(s25Eff(p)) + '</p>' +
            '<span class="s23-tag">Ghoshna ' + p.once + ' Cr</span><span class="s23-tag">Har phase ' + p.cost + ' Cr</span><br><br>' +
            (on ? '<span class="s23-tag" style="color:#86efac">Aapne kiya</span>' : (taken ? '<span class="s23-tag" style="color:#f87171">Rival ne liya</span>' :
            '<button class="s23-btn g" onclick="uiPromise(\'' + p.id + '\')">Ghoshna karo</button>')) + '</div>';
    });
    return h + '</div></div>';
}

// ---- VIP "apne aap chuno": koi limit nahi (number likho, khali = jitni ho sake) ----
uiVipAuto = function () {
    ensureS17();
    const el = document.getElementById('vip-n');
    const want = el && parseInt(el.value, 10) > 0 ? parseInt(el.value, 10) : Infinity;
    const keys = Object.keys(resultModel.seats).filter(function (k) { return !gameState.vips.you[k] && !seatResults[k]; })
        .sort(function (a, b) { return resultModel.seats[b].wYou - resultModel.seats[a].wYou; });
    let n = 0;
    for (let i = 0; i < keys.length && n < want; i++) {
        if (doAction('you', actVip(keys[i], randName()), gameState.fundMode).ok) n++; else break;
    }
    panelMsg = { ok: n > 0, good: n > 0, text: n + ' VIP seat apne aap chuni gayi.' + (n < want && want !== Infinity ? ' (paisa ya stamina khatam)' : '') };
    updateStatusPanel();
    refreshPanel();
};

// ---- panels jodo ----
const _renderPanelS25 = renderPanel;
renderPanel = function (name) {
    if (name === 'Media & Rallies') return renderRallyPanel25();
    if (name === 'IT Cell & Social') return renderSocialPanel25();
    if (name === 'Manifesto') return renderManifestoPanel25();
    const h = _renderPanelS25(name);
    if (name === 'VIP Seats') {
        return h.replace('Apne aap chuno (10 seats)', 'Apne aap chuno').replace('<button class="ap-btn" onclick="uiVipAuto()">',
            'Kitni (khali = jitni ho sake): <input id="vip-n" class="ap-sel" style="width:80px"> <button class="ap-btn" onclick="uiVipAuto()">');
    }
    return h;
};

// ================= STAGE 26: POACHING, VIP, WHITE FUND, BLACK FUND - SUNDAR PANELS =================

function s26Fund() {
    const g = gameState;
    return '<div class="s23-strip">' +
        '<label class="s23-chip" style="cursor:pointer"><input type="radio" name="apfund" value="white" onchange="setFundMode(this.value)"' + (g.fundMode !== 'black' ? ' checked' : '') + '> White Fund se kharch</label>' +
        '<label class="s23-chip" style="cursor:pointer"><input type="radio" name="apfund" value="black" onchange="setFundMode(this.value)"' + (g.fundMode === 'black' ? ' checked' : '') + '> Black Fund (asar 1.5x, risk badhta hai)</label></div>';
}

// ---------- 1) POACHING ----------
function renderPoachPanel26() {
    ensureS25();
    ensurePoach();
    const states = activeStates();
    const done = Object.keys(gameState.poachAsk.you).filter(function (k) { return gameState.poachAsk.you[k].taken; });
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Saath aaye neta</div><div class="s23-num">' + done.length +
        '</div><div class="s23-sub">Koi limit nahi. Har safal neta VIP ban jata hai aur seat par badhat milti hai.</div></div></div>';
    if (!states.length) return h + '<div class="s23-empty">Is phase mein koi seat nahi hai.</div></div>';
    const sel = stateSelectHtml();
    const seats = activeSeats(uiSel.state);
    const ss = seatSelectHtml(seats);
    h += '<div class="s23-sec"><h4>Target chuno (is phase ki seat)</h4>' + sel + ' ' + ss + '</div>';
    if (uiSel.seat) {
        const o = s24Ask('you', uiSel.seat);
        const chance = Math.round(Math.max(0.2, Math.min(0.9, 0.5 + (gameState.hawa || 0) / 300 + 0.08 * o.tries)) * 100);
        h += '<div class="s23-box"><div class="s23-lbl">Opponent ka neta</div><h3 style="margin:2px 0;color:#fff">' + esc(o.name) + '</h3>';
        if (o.taken) {
            h += '<div class="s23-msg ok">Yeh neta aapke saath aa chuka hai.</div>';
        } else {
            h += '<div class="s23-num" style="color:#fbbf24">' + o.price + ' <small>Cr</small></div>' + s23Bar(chance, chance >= 50 ? '#22c55e' : '#f59e0b') +
                '<div class="s23-sub">Maan jaane ka mauka: <b>' + chance + '%</b> | Stamina 3%' + (o.tries ? ' | Mana kar chuka: ' + o.tries + ' baar (daam badh gaya)' : '') + '</div>' +
                '<div style="margin-top:10px"><button class="s23-btn g" onclick="uiPoachSeat()">Kharido</button></div>';
        }
        h += '</div>';
    }
    if (done.length) {
        h += '<div class="s23-sec"><h4>Aapke saath aaye</h4>' + done.map(function (k) {
            const s = resultModel.seats[k];
            return '<div class="s23-row"><span class="nm" style="width:45%">' + esc(gameState.poachAsk.you[k].name) + '</span><span class="bw s23-sub" style="margin:0">' +
                esc(s.pc) + ' (' + esc(s.st) + ')</span></div>';
        }).join('') + '</div>';
    }
    return h + '</div>';
}

// ---------- 2) VIP SEATS ----------
function renderVipPanel26() {
    ensureS17();
    const all = [];
    Object.keys(resultModel.seats).forEach(function (k) { if (all.indexOf(resultModel.seats[k].st) === -1) all.push(resultModel.seats[k].st); });
    all.sort();
    if (!uiSel.vstate || all.indexOf(uiSel.vstate) === -1) uiSel.vstate = all[0];
    const seats = Object.keys(resultModel.seats).filter(function (k) { return resultModel.seats[k].st === uiSel.vstate; })
        .sort(function (a, b) { return resultModel.seats[a].pc < resultModel.seats[b].pc ? -1 : 1; });
    if (!uiSel.vseat || seats.indexOf(uiSel.vseat) === -1) uiSel.vseat = seats[0];
    const mine = Object.keys(gameState.vips.you);
    let won = 0, lost = 0;
    mine.forEach(function (k) { const v = gameState.vips.you[k]; if (v.won === true) won++; else if (v.won === false) lost++; });
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Aapke VIP ummeedwar</div><div class="s23-num">' + mine.length +
        '</div><div class="s23-sub">Jeete: ' + won + ' | Haare: ' + lost + ' | Baaki: ' + (mine.length - won - lost) + '</div></div>' +
        '<div class="s23-box dark"><div class="s23-lbl">Ek VIP seat ka kharch</div><div class="s23-num" style="color:#fbbf24">3 <small>Cr</small></div>' +
        '<div class="s23-sub">Koi limit nahi. Seat par badhat; jeete to hawa +2, haare to -2.</div></div></div>';
    h += '<div class="s23-sec"><h4>VIP seat banao</h4>' +
        '<select class="ap-sel" onchange="setVipState(this.value)">' + all.map(function (st) {
            return '<option value="' + esc(st) + '"' + (st === uiSel.vstate ? ' selected' : '') + '>' + esc(st) + '</option>';
        }).join('') + '</select> ' +
        '<select class="ap-sel" onchange="setVipSeat(this.value)">' + seats.map(function (k) {
            return '<option value="' + esc(k) + '"' + (k === uiSel.vseat ? ' selected' : '') + '>' + esc(resultModel.seats[k].pc) + ' (Phase ' + resultModel.seats[k].phase + ')</option>';
        }).join('') + '</select><br><br>' +
        'Netaa ka naam: <input id="vip-name" class="ap-sel" placeholder="khali = apne aap"> ' +
        '<button class="s23-btn g" onclick="uiVipGo()">VIP seat banao</button></div>';
    h += '<div class="s23-sec"><h4>Apne aap chuno</h4>Kitni (khali = jitni ho sake): <input id="vip-n" class="ap-sel" style="width:80px"> ' +
        '<button class="s23-btn" onclick="uiVipAuto()">Apne aap chuno</button>' +
        '<div class="s23-sub">Aapke favour wali sabse acchi seats pehle chuni jayengi.</div></div>';
    if (mine.length) {
        h += '<div class="s23-sec"><h4>Aapke VIP</h4>' + mine.map(function (k) {
            const v = gameState.vips.you[k];
            const res = v.won === null ? ['Baaki', '#94a3b8'] : (v.won ? ['Jeete', '#4ade80'] : ['Haare', '#f87171']);
            return '<div class="s23-row"><span class="nm" style="width:34%">' + esc(v.name) + '</span><span class="bw s23-sub" style="margin:0">' + esc(v.pc) + ' (' + esc(v.st) +
                '), Phase ' + v.phase + '</span><span class="vl" style="width:auto;color:' + res[1] + '">' + res[0] + '</span></div>';
        }).join('') + '</div>';
    }
    return h + '</div>';
}

// ---------- 3) WHITE FUND ----------
function uiDonor26(id) {
    const r = doAction('you', actDonor(id), 'white');
    panelMsg = r;
    updateStatusPanel();
    refreshPanel();
}
function uiCrowd26() {
    const r = doAction('you', actCrowd(), 'white');
    panelMsg = r;
    updateStatusPanel();
    refreshPanel();
}

function renderWhitePanel26() {
    ensureS16();
    const g = gameState, L = g.loan.you;
    const start = g.phaseStartBudget || PHASE_FUNDING;
    let income = 0;
    g.donors.forEach(function (d) { if (d.owner === 'you') income += d.pay; });
    const burden = promiseBurden('you'), due = L ? L.due : 0;
    const net = PHASE_FUNDING + income - burden - due;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">White Fund (bacha hua)</div><div class="s23-num" style="color:#86efac">' + g.budget +
        ' <small>Cr</small></div>' + s23Bar(g.budget / Math.max(1, start) * 100, '#22c55e') + '<div class="s23-sub">Phase ki shuruaat: ' + start + ' Cr</div></div>' +
        '<div class="s23-box dark"><div class="s23-lbl">Agle phase mein (andaaza)</div><div class="s23-sub" style="color:#e2e8f0">' +
        'Naye phase ka fund: <b>+' + PHASE_FUNDING + ' Cr</b><br>Udyogpati se: <b>+' + income + ' Cr</b><br>Manifesto bojh: <b>-' + burden + ' Cr</b><br>Loan ki kisht: <b>-' + due + ' Cr</b></div>' +
        '<div class="s23-num" style="font-size:1.5rem;color:' + (net >= 0 ? '#86efac' : '#f87171') + '">' + (net >= 0 ? '+' : '') + net + ' <small>Cr</small></div></div></div>';
    h += '<div class="s23-sec"><h4>Corporate samarthan (har phase paisa dete hain)</h4><div class="s23-grid2">';
    g.donors.forEach(function (d) {
        const a = actDonor(d.id);
        h += '<div class="s23-card"><div class="ic">&#127970;</div><h4>' + esc(d.name) + '</h4><p>Har phase <b style="color:#86efac">' + d.pay + ' Cr</b></p>' +
            (d.owner ? '<span class="s23-tag" style="color:' + (d.owner === 'you' ? '#86efac' : '#f87171') + '">' + (d.owner === 'you' ? 'Aapke saath' : esc(sideName(d.owner)) + ' ke saath') + '</span>' :
            '<span class="s23-tag">' + a.cost + ' Cr</span><span class="s23-tag">Stamina ' + a.stamina + '%</span><br><br><button class="s23-btn g" onclick="uiDonor26(\'' + d.id + '\')">Baat karo</button>') + '</div>';
    });
    h += '</div></div>';
    h += '<div class="s23-grid2"><div class="s23-card"><div class="ic">&#129309;</div><h4>Crowdfunding</h4><p>Janta se chanda, hawa bhi badhti hai.<br>Is phase mein ' + g.crowd.you + ' / 2</p>' +
        '<span class="s23-tag">Stamina 6%</span><br><br><button class="s23-btn g" onclick="uiCrowd26()">Chanda abhiyan chalao</button></div>' +
        '<div class="s23-card"><div class="ic">&#127974;</div><h4>Bank Loan</h4><p>25% byaj, agle phase mein katega.' + (L ? '<br>Abhi baaki: <b>' + L.due + ' Cr</b>' : '') + '</p>' +
        [20, 40, 60].map(function (a) { return '<button class="s23-btn" style="margin:3px" onclick="uiLoan(' + a + ')">' + a + ' Cr</button>'; }).join('') + '</div></div>';
    return h + '</div>';
}

// ---------- 4) BLACK FUND ----------
function renderBlackPanel26() {
    ensureS16();
    const g = gameState;
    const rc = Math.round(raidChance(g.risk.you) * 100);
    const rcol = rc >= 40 ? '#ef4444' : (rc >= 20 ? '#f59e0b' : '#22c55e');
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box dark"><div class="s23-lbl">Black Fund</div><div class="s23-num" style="color:#d1d5db">' + g.blackFund +
        ' <small>Cr</small></div><div class="s23-sub">Is phase mein jutaya: ' + g.counters.you.black + ' / ' + LIMITS.black + '</div></div>' +
        '<div class="s23-box" style="border-color:' + rcol + '"><div class="s23-lbl">Risk meter: ' + Math.round(g.risk.you) + '</div><div class="s23-num" style="color:' + rcol + '">' + rc +
        '<small>% </small></div>' + s23Bar(rc, rcol) + '<div class="s23-sub">Har round raid ya EC notice ka chance.</div></div></div>';
    h += '<div class="s23-grid2">';
    h += '<div class="s23-card"><div class="ic">&#128176;</div><h4>Chanda</h4><p>Chhupa hua chanda</p><span class="s23-tag">15-30 Cr</span><span class="s23-tag">Risk 8</span><br><br>' +
        '<button class="s23-btn o" onclick="uiBlackFund()">Jutao</button></div>';
    const ico = { foreign: '&#9992;', market: '&#128181;', kickback: '&#128119;' };
    Object.keys(BLACK_SRC).forEach(function (k) {
        const b = BLACK_SRC[k];
        h += '<div class="s23-card"><div class="ic">' + (ico[k] || '&#128176;') + '</div><h4>' + b.name + '</h4><p>&nbsp;</p><span class="s23-tag">' + b.lo + '-' + b.hi + ' Cr</span><span class="s23-tag">Risk ' + b.risk +
            '</span><span class="s23-tag">Stamina ' + b.stamina + '%</span><br><br><button class="s23-btn o" onclick="uiBlackSrc(\'' + k + '\')">Jutao</button></div>';
    });
    h += '</div><div class="s23-sub">Black fund se kiya kharch 1.5x asar deta hai par risk badhata hai, aur rival ke jasoos ko sabut mil sakta hai. Kharch ke liye action panel mein "Black Fund" chuno.</div>';
    return h + '</div>';
}

// ---------- panels jodo ----------
const _renderPanelS26 = renderPanel;
renderPanel = function (name) {
    if (name === 'Poaching') return renderPoachPanel26();
    if (name === 'VIP Seats') return renderVipPanel26();
    if (name === 'White Fund') return renderWhitePanel26();
    if (name === 'Black Fund') return renderBlackPanel26();
    return _renderPanelS26(name);
};

// ================= STAGE 27: ICONS HATAO (OPP, HWA, Crisis), PHASE VOTING, NARRATIVE, COURT, EC, GURU, KARYAKARTA, SPY, DEBATE, DM/SP - SUNDAR =================

// ---------- 1) Icons: OPP, HWA, KRY (Crisis) hata do; KAR ko sundar icon do ----------
S23_ICONS.KAR = S23_ICONS.KRY;
function s27Clean() {
    document.querySelectorAll('.wr-side-icon').forEach(function (b) {
        const oc = b.getAttribute('onclick') || '';
        if (/Opponent Bank|Hawa Engine|Crisis Mgmt/.test(oc)) b.remove();
    });
    decorateSidebarIcons();
    s23Icons();
}
s27Clean();
setTimeout(s27Clean, 1200);
setTimeout(s27Clean, 3500);

// ---------- helper ----------
function s27Nothing() {
    return '<div class="s23-wrap">' + s23Strip() + '<div class="s23-empty">Is phase mein koi seat nahi hai.</div></div>';
}
function s27Use(a) {
    return '<span class="s23-tag">' + a.cost + ' Cr</span><span class="s23-tag">Stamina ' + a.stamina + '%</span>';
}
const S27_GROUP = { Rozgaar: 'Yuva / berozgar', Mehngai: 'Garib / madhyam varg', Kisan: 'Kisan', Vikas: 'Gaon / shehar' };

// ---------- 2) PHASE VOTING: purane phase ka data + is phase ki jaankari ----------
function renderVotePanel27() {
    const g = gameState;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    const cur = [];
    const issues = {};
    ISSUES.forEach(function (i) { issues[i] = 0; });
    if (resultModel) {
        Object.keys(resultModel.seats).forEach(function (k) {
            const s = resultModel.seats[k];
            if (s.phase === g.phase) { cur.push(k); issues[s.issue]++; }
        });
    }
    const states = activeStates();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Abhi ka phase</div><div class="s23-num">' + g.phase + ' <small>/ ' + TOTAL_PHASES + '</small></div>' +
        s23Bar(g.phase / TOTAL_PHASES * 100, '#38bdf8') + '<div class="s23-sub">' + cur.length + ' seats, ' + states.length + ' states</div></div>' +
        '<div class="s23-box"><div class="s23-lbl">Voter turnout</div><div class="s23-num" style="color:#4ade80">' + g.turnout + '<small>%</small></div>' +
        s23Bar(g.turnout, '#22c55e') + '<div class="s23-sub">Hawa: ' + Math.round(g.hawa || 0) + '</div></div></div>';

    // is phase ke voter / mudde
    if (cur.length) {
        const order = ISSUES.slice().sort(function (a, b) { return issues[b] - issues[a]; });
        h += '<div class="s23-sec"><h4>Is phase mein kaun se voter zyada hain</h4>';
        order.forEach(function (i, n) {
            h += '<div class="s23-row"><span class="nm" style="width:46%">' + esc(i) + ' (' + esc(S27_GROUP[i] || '') + ')</span><span class="bw">' +
                s23Bar(issues[i] / cur.length * 100, S23_PAL[n % S23_PAL.length]) + '</span><span class="vl">' + issues[i] + ' seats</span></div>';
        });
        h += '<div class="s23-sub">Jis mudde ke voter zyada, usi mudde par narrative ya manifesto ka vaada sabse zyada kaam karega.</div></div>';
        h += '<div class="s23-sec"><h4>Is phase ke states</h4>';
        states.forEach(function (x) {
            const rn = (g.rallies && g.rallies.you[x.st] || { n: 0 }).n;
            h += '<div class="s23-row"><span class="nm" title="' + esc(x.st) + '">' + esc(x.st) + '</span><span class="bw s23-sub" style="margin:0">Mudde: ' + esc(topIssues(x.st)) +
                '</span><span class="vl" style="width:auto">' + x.n + ' seats | rally ' + rn + '</span></div>';
        });
        h += '</div>';
    }

    // purane phase ka data
    const byPhase = {};
    if (resultModel) {
        Object.keys(resultModel.seats).forEach(function (k) {
            const s = resultModel.seats[k], w = seatResults[k];
            if (!w) return;
            const ph = byPhase[s.phase] || (byPhase[s.phase] = { tot: {}, n: 0, st: {} });
            ph.n++;
            ph.tot[w] = (ph.tot[w] || 0) + 1;
            const o = ph.st[s.st] || (ph.st[s.st] = {});
            o[w] = (o[w] || 0) + 1;
        });
    }
    const done = Object.keys(byPhase).map(Number).sort(function (a, b) { return a - b; });
    if (!done.length) {
        h += '<div class="s23-empty">Abhi koi phase poora nahi hua. Pehle phase ke baad yahan natija dikhega.</div>';
    }
    done.forEach(function (p) {
        const ph = byPhase[p];
        const parties = Object.keys(ph.tot).sort(function (a, b) { return ph.tot[b] - ph.tot[a]; });
        h += '<div class="s23-sec"><h4>Phase ' + p + ' ka natija - ' + ph.n + ' seats</h4><div>' + parties.slice(0, 8).map(function (q) {
            return '<span class="s23-tag">' + partyDot(q) + esc(q) + ' <b>' + ph.tot[q] + '</b></span>';
        }).join('') + '</div>';
        Object.keys(ph.st).sort(function (a, b) {
            const ta = Object.keys(ph.st[a]).reduce(function (s, x) { return s + ph.st[a][x]; }, 0);
            const tb = Object.keys(ph.st[b]).reduce(function (s, x) { return s + ph.st[b][x]; }, 0);
            return tb - ta || (a < b ? -1 : 1);
        }).forEach(function (st) {
            const o = ph.st[st], ps = Object.keys(o).sort(function (a, b) { return o[b] - o[a]; });
            const tot = ps.reduce(function (s, x) { return s + o[x]; }, 0);
            h += '<div style="margin-top:8px"><div style="color:#e2e8f0;font-size:.82rem"><b>' + esc(st) + '</b> <span class="s23-sub">(' + tot + ' seats)</span></div>' +
                '<div class="s23-split">' + ps.map(function (q) {
                    return '<i style="width:' + (o[q] / tot * 100).toFixed(1) + '%;background:' + (partyColors[q] || '#9ca3af') + '"></i>';
                }).join('') + '</div><div class="s23-sub">' + ps.map(function (q) { return esc(q) + ' ' + o[q]; }).join(', ') + '</div></div>';
        });
        h += '</div>';
    });
    return h + '</div>';
}

// ---------- 3) NARRATIVE ----------
function renderNarrativePanel27() {
    const counts = {};
    ISSUES.forEach(function (i) { counts[i] = 0; });
    let total = 0;
    if (resultModel) {
        Object.keys(resultModel.seats).forEach(function (k) {
            const s = resultModel.seats[k];
            if (s.phase === gameState.phase) { counts[s.issue]++; total++; }
        });
    }
    const a0 = actNarrative(), a1 = actNarrativeTheme('Rozgaar');
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Aam Narrative</div><h3 style="margin:2px 0;color:#fff">Poore desh mein seedha asar</h3>' + s27Use(a0) +
        '<div style="margin-top:10px"><button class="s23-btn g" onclick="uiNarrative()">Narrative chalao</button></div></div></div>';
    h += '<div class="s23-sec"><h4>Mudde par narrative (is phase ki ' + total + ' seats)</h4><div class="s23-grid2">';
    ISSUES.forEach(function (i, n) {
        h += '<div class="s23-card"><h4>' + esc(i) + '</h4><p>' + esc(S27_GROUP[i] || '') + '<br><b>' + counts[i] + '</b> seats par yeh mudda</p>' +
            s23Bar(total ? counts[i] / total * 100 : 0, S23_PAL[n % S23_PAL.length]) + '<br>' + s27Use(a1) + '<br><br>' +
            '<button class="s23-btn" onclick="uiNarrativeTheme(\'' + i + '\')">' + esc(i) + ' par narrative</button></div>';
    });
    return h + '</div><div class="s23-sub">Jis seat par wo mudda hai wahan asar zyada hota hai.</div></div></div>';
}

// ---------- 4) COURT ----------
function renderCourtPanel27() {
    ensureS15();
    uiSel.topic = uiSel.topic || CASE_TOPICS[0];
    const dl = lawyerOf(gameState.defence.you);
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Aapka bachav wakeel</div><h3 style="margin:2px 0;color:' + (dl ? '#86efac' : '#f87171') + '">' + (dl ? dl.name : 'Koi nahi') + '</h3>' +
        '<div class="s23-sub">' + (dl ? 'Opponent ke case ka asar kam hoga.' : 'Opponent case kare to bachav kamzor rahega.') + '</div></div>' +
        '<div class="s23-box dark"><div class="s23-lbl">Aapke case is phase mein</div><div class="s23-num">' + gameState.counters.you.court + ' <small>/ ' + LIMITS.court + '</small></div>' +
        s23Bar(gameState.counters.you.court / LIMITS.court * 100, '#f59e0b') + '</div></div>';
    h += '<div class="s23-sec"><h4>Bachav wakeel rakho (is phase ke liye)</h4><div class="s23-grid2">';
    LAWYERS.forEach(function (l) {
        h += '<div class="s23-card"' + (gameState.defence.you === l.id ? ' style="border-color:#22c55e"' : '') + '><h4>' + l.name + '</h4><p>Case ka asar lagbhag ' + Math.round(l.chance * 70) + '% kam</p>' +
            '<span class="s23-tag">' + l.fee + ' Cr</span><br><br><button class="s23-btn g" onclick="uiDefence(\'' + l.id + '\')">Bachav ke liye rakho</button></div>';
    });
    h += '</div></div><div class="s23-sec"><h4>Opponent par case</h4>Mudda: <select class="ap-sel" onchange="setUiTopic(this.value)">' + optionsHtml(CASE_TOPICS, uiSel.topic) +
        '</select><div class="s23-grid2" style="margin-top:10px">';
    LAWYERS.forEach(function (l) {
        const pc = Math.round(l.chance * 100);
        h += '<div class="s23-card"><h4>' + l.name + '</h4><p>Jeetne ka chance <b>' + pc + '%</b></p>' + s23Bar(pc, pc >= 60 ? '#22c55e' : '#f59e0b') + '<br>' +
            '<span class="s23-tag">' + l.fee + ' Cr</span><span class="s23-tag">Stamina 5%</span><br><br><button class="s23-btn o" onclick="uiCourtGo(\'' + l.id + '\')">Case karo</button></div>';
    });
    return h + '</div><div class="s23-sub">Jeet gaye to opponent ka vote aur asar bhari ghatega.</div></div></div>';
}

// ---------- sabut ki list (Spy aur EC dono mein) ----------
function s27Evidence() {
    ensureS15();
    const ks = Object.keys(gameState.evidence.you).filter(function (st) { return gameState.evidence.you[st].length; });
    if (!ks.length) return '<div class="s23-empty">Abhi koi sabut nahi jutaya.</div>';
    return '<div class="s23-sec"><h4>Aapke jutaye sabut</h4>' + ks.map(function (st) {
        return '<div class="s23-row"><span class="nm" style="width:34%">' + esc(st) + '</span><span class="bw s23-sub" style="margin:0">' +
            gameState.evidence.you[st].map(function (k) { return esc(k.split('|')[1]); }).join(', ') + '</span></div>';
    }).join('') + '</div>';
}

// ---------- 5) EC / MCC ----------
function renderMccPanel27() {
    ensureS15();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    const n = (gameState.evidence.you[uiSel.state] || []).length;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">' + esc(uiSel.state) + ' mein aapka sabut</div><div class="s23-num" style="color:' + (n ? '#4ade80' : '#f87171') + '">' + n +
        ' <small>seat</small></div><div class="s23-sub">' + (n ? 'Shikayat darj kar sakte ho.' : 'Pehle Spy se sabut jutao.') + '</div></div>' +
        '<div class="s23-box dark"><div class="s23-lbl">Shikayat is phase mein</div><div class="s23-num">' + gameState.counters.you.mcc + ' <small>/ ' + LIMITS.mcc + '</small></div>' +
        s23Bar(gameState.counters.you.mcc / LIMITS.mcc * 100, '#38bdf8') + '</div></div>';
    h += '<div class="s23-sec"><h4>EC / Aachar Sanhita shikayat</h4>' + sel + '<div style="margin-top:8px">' + s27Use(actMcc(uiSel.state)) + '</div>' +
        '<div class="s23-sub">Safal hui to un seats par opponent ka candidate har jayega. Jitna zyada sabut, utna zyada chance.</div>' +
        '<div style="margin-top:10px"><button class="s23-btn o" onclick="uiMccFile()">Shikayat darj karo</button></div></div>';
    return h + s27Evidence() + '</div>';
}

// ---------- 6) SPY ----------
function renderSpyPanel27() {
    ensureS15();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Jasoos mishan is phase mein</div><div class="s23-num">' + gameState.spyUsed.you + ' <small>/ 2</small></div>' +
        s23Bar(gameState.spyUsed.you / 2 * 100, '#38bdf8') + '<div class="s23-sub">Rival ki gadbad (jaise black fund kharch) dhundhta hai. Pakde jaane ka khatra bhi hai.</div></div></div>';
    h += '<div class="s23-sec"><h4>Jasoos bhejo</h4>' + sel + '<div style="margin-top:8px">' + s27Use(actSpy(uiSel.state)) + '</div>' +
        '<div style="margin-top:10px"><button class="s23-btn" onclick="uiSpyGo()">Jasoos bhejo</button></div></div>';
    return h + s27Evidence() + '</div>';
}

// ---------- 7) DEBATE ----------
function renderDebatePanel27() {
    ensureS15();
    uiSel.issue = uiSel.issue || ISSUES[0];
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Aapki debate is phase mein</div><div class="s23-num">' + gameState.debates.you + ' <small>/ 2</small></div>' +
        s23Bar(gameState.debates.you / 2 * 100, '#a78bfa') + '<div class="s23-sub">Ek bhi debate na ho to hawa aur vote dono ghatenge.</div></div></div>';
    h += '<div class="s23-sec"><h4>Mudda chuno</h4>' + ISSUES.map(function (i) {
        const on = i === uiSel.issue;
        return '<button class="s23-btn' + (on ? ' g' : '') + '" style="margin:3px" onclick="setUiIssue(\'' + i + '\')">' + esc(i) + ' (' + Math.round(issueShare(i) * 100) + '% seats)</button>';
    }).join('') + '</div>';
    h += '<div class="s23-sec"><h4>Kise bhejna hai</h4><div class="s23-grid2">';
    SPEAKERS.forEach(function (sp) {
        const pc = Math.round(debateChance('you', uiSel.issue, sp) * 100);
        h += '<div class="s23-card"><h4>' + sp.name + '</h4><p>Jeetne ka chance <b>' + pc + '%</b></p>' + s23Bar(pc, pc >= 55 ? '#22c55e' : '#f59e0b') + '<br>' +
            '<span class="s23-tag">' + sp.cost + ' Cr</span><span class="s23-tag">Stamina ' + sp.stamina + '%</span><br><br>' +
            '<button class="s23-btn" onclick="uiDebateGo(\'' + sp.id + '\')">Bhejo</button></div>';
    });
    return h + '</div></div></div>';
}

// ---------- 8) LOCAL GURU ----------
function renderGuruPanel27() {
    ensureS14();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    const n = gameState.gurus.you[uiSel.state] || 0;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">' + esc(uiSel.state) + ' mein local guru</div><div class="s23-num">' + n + ' <small>/ 2</small></div>' +
        s23Bar(n / 2 * 100, '#f472b6') + '<div class="s23-sub">Gaon aur mohalle ke bharosemand log. State ka vote percentage aur hawa badhta hai.</div></div></div>';
    h += '<div class="s23-sec"><h4>Local Guru ko saath lo</h4>' + sel + '<div style="margin-top:8px">' + s27Use(actGuru(uiSel.state)) + '</div>' +
        '<div style="margin-top:10px"><button class="s23-btn g" onclick="uiGuru()">Local guru ko saath lo</button></div></div>';
    return h + '</div>';
}

// ---------- 9) KARYAKARTA ----------
function renderKaryakartaPanel27() {
    ensureS14();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    const n = gameState.booths.you[uiSel.state] || 0;
    const all = actBoothAll();
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">' + esc(uiSel.state) + ' mein booth team</div><div class="s23-num">' + n + ' <small>/ 3</small></div>' +
        s23Bar(n / 3 * 100, '#22c55e') + '<div class="s23-sub">Ghar-ghar sampark: sasta aur kam stamina.</div></div></div>';
    h += '<div class="s23-grid2"><div class="s23-card"><div class="ic">&#128101;</div><h4>Is state mein</h4><p>Ek booth team bhejo</p>' + sel + '<br>' + s27Use(actBooth(uiSel.state)) +
        '<br><br><button class="s23-btn g" onclick="uiBooth()">Booth team bhejo</button></div>' +
        '<div class="s23-card"><div class="ic">&#127760;</div><h4>Sabhi states mein</h4><p>Is phase ke har state mein ek saath (20% sasta)</p>' + s27Use(all) +
        '<br><br><button class="s23-btn" onclick="uiBoothAll()">Sabhi states mein lagao</button></div></div>';
    return h + '</div>';
}

// ---------- 10) DM / SP ----------
function renderOfficialPanel27() {
    ensureS17();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    const used = gameState.officials.you;
    const dm = actOfficial(uiSel.state, 'DM'), sp = actOfficial(uiSel.state, 'SP');
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box dark"><div class="s23-lbl">Is phase mein tabadla</div><div class="s23-num" style="color:' + (used ? '#f87171' : '#4ade80') + '">' + (used ? 'ho chuka' : 'baaki hai') + '</div>' +
        '<div class="s23-sub">DM ya SP mein se sirf ek, phase mein ek baar. State mein badhat milti hai, par <b>35% bhed khulne ka khatra</b> (phir opponent court case karega).</div></div></div>';
    h += '<div class="s23-sec"><h4>State chuno</h4>' + sel + '</div>';
    h += '<div class="s23-grid2"><div class="s23-card"><div class="ic">&#127963;</div><h4>Zila Magistrate (DM)</h4><p>Asar zyada</p>' + s27Use(dm) + '<br><br>' +
        '<button class="s23-btn o" onclick="uiOfficial(\'DM\')">DM badlo</button></div>' +
        '<div class="s23-card"><div class="ic">&#128110;</div><h4>Police Adhikshak (SP)</h4><p>Thoda sasta</p>' + s27Use(sp) + '<br><br>' +
        '<button class="s23-btn o" onclick="uiOfficial(\'SP\')">SP badlo</button></div></div>';
    return h + '</div>';
}

// ---------- panels jodo ----------
const _renderPanelS27 = renderPanel;
renderPanel = function (name) {
    if (name === 'Phase Voting') return renderVotePanel27();
    if (name === 'Narrative Engine') return renderNarrativePanel27();
    if (name === 'Courts Case') return renderCourtPanel27();
    if (name === 'EC Scrutiny & MCC') return renderMccPanel27();
    if (name === 'Spy') return renderSpyPanel27();
    if (name === 'Media Debates') return renderDebatePanel27();
    if (name === 'Local Guru') return renderGuruPanel27();
    if (name === 'Karyakarta') return renderKaryakartaPanel27();
    if (name === 'Transfer DM/SP') return renderOfficialPanel27();
    return _renderPanelS27(name);
};

// ================= STAGE 28: ICONS + PANELS MEIN ANIMATION AUR IMAGES =================

const S28_META = {
    'Bank': ['BNK', 'Aapka Bank', 'Kharch ka poora hisaab'],
    'Heat Map': ['MAP', 'Heat Map', 'Kaun si seat kahan kaante ki hai'],
    'Opinion Poll': ['POL', 'Opinion Poll', 'Janta ka mood jaancho'],
    'Stamina': ['STM', 'Stamina', 'Josh bachao, aaram karo'],
    'Media & Rallies': ['MED', 'Rally', 'Janta ke beech jao'],
    'IT Cell & Social': ['ITC', 'IT Cell', 'Social media ki jung'],
    'Manifesto': ['MAN', 'Manifesto', 'Vaade karo, voter jeeto'],
    'Poaching': ['POA', 'Poaching', 'Rival ke neta apne saath lo'],
    'VIP Seats': ['VIP', 'VIP Seats', 'Bade chehre, khaas seats'],
    'White Fund': ['WHT', 'White Fund', 'Saaf paisa, saaf tareeka'],
    'Black Fund': ['BLK', 'Black Fund', 'Chhupa paisa, bada risk'],
    'Phase Voting': ['VOT', 'Phase Voting', 'Ab tak ka natija aur voter'],
    'Narrative Engine': ['NAR', 'Narrative', 'Kahani badlo, hawa badlo'],
    'Courts Case': ['CRT', 'Court Case', 'Kanooni jung'],
    'EC Scrutiny & MCC': ['MCC', 'EC / MCC', 'Aachar sanhita shikayat'],
    'Local Guru': ['GUR', 'Local Guru', 'Gaon ke bharosemand log'],
    'Karyakarta': ['KAR', 'Karyakarta', 'Ghar-ghar sampark'],
    'Spy': ['SPY', 'Spy', 'Rival ki gadbad dhundho'],
    'Media Debates': ['DEB', 'Debate', 'Mudde par takkar'],
    'Transfer DM/SP': ['DMS', 'DM / SP', 'Afsaron ka tabadla']
};
S22_ICON_FILE.KAR = 'kar';

function s28Style() {
    if (document.getElementById('s28-style')) return;
    const st = document.createElement('style');
    st.id = 's28-style';
    st.textContent = `
@keyframes s28In{from{opacity:0;transform:translateX(-10px) scale(.9)}to{opacity:1;transform:none}}
@keyframes s28Bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
@keyframes s28Bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}60%{transform:translateY(0)}80%{transform:translateY(-2px)}}
@keyframes s28Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
@keyframes s28Wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-14deg)}75%{transform:rotate(14deg)}}
@keyframes s28Flash{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.2)}}
@keyframes s28Swing{0%,100%{transform:rotate(0)}30%{transform:rotate(-28deg)}60%{transform:rotate(14deg)}}
@keyframes s28Spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes s28Shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-3px)}40%{transform:translateX(3px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}
@keyframes s28Flip{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
@keyframes s28Pop{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
@keyframes s28Grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes s28Shine{from{transform:translateX(-120%)}to{transform:translateX(320%)}}
@keyframes s28Zoom{from{transform:scale(1)}to{transform:scale(1.08)}}
@keyframes s28Up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

.wr-side-icon.s23-ic{animation:s28In .5s both;}
.wr-side-icon.s23-ic svg{animation:s28Bob 3.2s ease-in-out infinite;}
.wr-side-icon.s23-ic:active{transform:scale(.92) !important;}
.wr-side-icon[data-ic="BNK"]:hover svg{animation:s28Bounce .7s;}
.wr-side-icon[data-ic="MAP"]:hover svg{animation:s28Pulse .8s;}
.wr-side-icon[data-ic="POL"]:hover svg{animation:s28Wiggle .7s;}
.wr-side-icon[data-ic="STM"]:hover svg{animation:s28Flash .6s 2;}
.wr-side-icon[data-ic="MED"]:hover svg{animation:s28Wiggle .6s 2;}
.wr-side-icon[data-ic="ITC"]:hover svg{animation:s28Wiggle .7s;}
.wr-side-icon[data-ic="MAN"]:hover svg{animation:s28Flip .9s;}
.wr-side-icon[data-ic="POA"]:hover svg{animation:s28Shake .6s;}
.wr-side-icon[data-ic="VIP"]:hover svg{animation:s28Spin .9s;}
.wr-side-icon[data-ic="WHT"]:hover svg{animation:s28Flip .9s;}
.wr-side-icon[data-ic="BLK"]:hover svg{animation:s28Shake .5s 2;}
.wr-side-icon[data-ic="VOT"]:hover svg{animation:s28Bounce .7s;}
.wr-side-icon[data-ic="NAR"]:hover svg{animation:s28Pulse .8s;}
.wr-side-icon[data-ic="CRT"]:hover svg{animation:s28Swing .8s;}
.wr-side-icon[data-ic="MCC"]:hover svg{animation:s28Pulse .8s;}
.wr-side-icon[data-ic="GUR"]:hover svg{animation:s28Bounce .7s;}
.wr-side-icon[data-ic="KAR"]:hover svg{animation:s28Bounce .7s;}
.wr-side-icon[data-ic="SPY"]:hover svg{animation:s28Swing .9s;}
.wr-side-icon[data-ic="DEB"]:hover svg{animation:s28Wiggle .7s;}
.wr-side-icon[data-ic="DMS"]:hover svg{animation:s28Spin .9s;}

#wr-modal:not(.hidden) .modal-content{animation:s28Pop .28s ease-out;}
.s28-banner{position:relative;overflow:hidden;display:flex;align-items:center;gap:14px;margin-bottom:12px;padding:10px 14px;border-radius:16px;
  background:linear-gradient(135deg,#1d2b4a,#0f1729);border:1px solid #3b4d73;animation:s28Up .4s both;}
.s28-banner::after{content:'';position:absolute;top:0;left:0;width:30%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.12),transparent);animation:s28Shine 3.6s ease-in-out infinite;pointer-events:none;}
.s28-img{width:64px;height:64px;border-radius:14px;overflow:hidden;flex:none;border:1px solid rgba(255,255,255,.25);background:#0b1220;display:flex;align-items:center;justify-content:center;}
.s28-img img{width:100%;height:100%;object-fit:cover;animation:s28Zoom 5s ease-in-out infinite alternate;}
.s28-img svg{width:34px;height:34px;stroke:#38bdf8;animation:s28Bob 2.4s ease-in-out infinite;}
.s28-tx b{display:block;color:#fff;font-size:1.15rem;letter-spacing:.4px;}
.s28-tx small{color:#94a3b8;font-size:.78rem;}
.s23-wrap > *{animation:s28Up .45s both;}
.s23-wrap > *:nth-child(2){animation-delay:.05s}.s23-wrap > *:nth-child(3){animation-delay:.1s}.s23-wrap > *:nth-child(4){animation-delay:.15s}
.s23-wrap > *:nth-child(5){animation-delay:.2s}.s23-wrap > *:nth-child(6){animation-delay:.25s}.s23-wrap > *:nth-child(n+7){animation-delay:.3s}
.s23-bar i,.s23-split i{transform-origin:left;animation:s28Grow .8s ease-out;}
.s23-btn:active{transform:scale(.95);}
`;
    document.head.appendChild(st);
}
s28Style();

// ---- Panel ke upar image wala banner (aapki Images/Icons wali image, na mile to icon) ----
function s28ImgErr(img) {
    const code = img.getAttribute('data-c');
    if (img.getAttribute('data-t') === '0') {
        img.setAttribute('data-t', '1');
        img.src = S22_DIR + 'Icons/' + S22_ICON_FILE[code] + '.png';
        return;
    }
    const d = S23_ICONS[code];
    if (img.parentNode) img.parentNode.innerHTML = d ? s23Svg(d[2]) : '';
}

function s28Banner(m) {
    const code = m[0], f = S22_ICON_FILE[code];
    const d = S23_ICONS[code];
    const pic = f ? '<img data-c="' + code + '" data-t="0" src="' + S22_DIR + 'Icons/' + f + '.jpg" onerror="s28ImgErr(this)">' : (d ? s23Svg(d[2]) : '');
    return '<div class="s28-banner"><div class="s28-img">' + pic + '</div><div class="s28-tx"><b>' + esc(m[1]) + '</b><small>' + esc(m[2]) + '</small></div></div>';
}

// ---- Sidebar icons ek-ek karke aayein ----
function s28Anim() {
    s28Style();
    document.querySelectorAll('.wr-sidebar').forEach(function (bar) {
        let i = 0;
        bar.querySelectorAll('.wr-side-icon').forEach(function (b) {
            b.style.animationDelay = (i * 0.06) + 's';
            i++;
        });
    });
}
s28Anim();
setTimeout(s28Anim, 1300);
setTimeout(s28Anim, 3600);

const _renderPanelS28 = renderPanel;
renderPanel = function (name) {
    const h = _renderPanelS28(name);
    const m = S28_META[name];
    if (!m || typeof h !== 'string') return h;
    return s28Banner(m) + h;
};

// ================= STAGE 29: LEADS SIRF ROUND KHATAM HONE PAR + NEECHE KE 3 BOXES (live counting jaisa UI) =================

// ---------- 1) Leads: phase ke shuru mein nahi, har round khatam hone par hi ----------
const _computeLeadsS29 = computeLeads;
computeLeads = function () {
    const g = gameState;
    const empty = { you: 0, opp: 0, oth: 0, seats: [], byState: {} };
    if (!resultModel || !g || g.phaseEnded || !(g.round > 1)) return empty;   // pehla round khatam hone se pehle koi lead nahi
    const key = g.phase + ':' + g.round;
    if (!g.leadSnap || g.leadSnapKey !== key) {        // round ke beech action karne par leads nahi badlengi
        g.leadSnap = _computeLeadsS29();
        g.leadSnapKey = key;
    }
    return g.leadSnap;
};

// ---------- 2) Neeche ke 3 boxes ----------
const S29 = { last: {}, prev: {}, spot: { seat: [], state: [] }, idx: { seat: 0, state: 0 } };

function s29Style() {
    if (document.getElementById('s29-style')) return;
    const st = document.createElement('style');
    st.id = 's29-style';
    st.textContent = `
@keyframes s29Slide{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:none}}
@keyframes s29Pop{0%{transform:scale(.6);opacity:.2}70%{transform:scale(1.18)}100%{transform:none;opacity:1}}
@keyframes s29Pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
@keyframes s29Flash{0%,100%{text-shadow:none}50%{text-shadow:0 0 14px #facc15,0 0 4px #facc15}}
@keyframes s29Marq{from{transform:translateX(100%)}to{transform:translateX(-100%)}}
@keyframes s29Grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes s29Glow{0%,100%{box-shadow:0 0 6px rgba(56,189,248,.15)}50%{box-shadow:0 0 16px rgba(56,189,248,.45)}}
.wr-bottom-boxes{height:158px !important;}
.wr-box{display:flex !important;flex-direction:column;overflow:hidden !important;padding:7px 12px !important;background:linear-gradient(145deg,#17213a,#0f1729) !important;border:1px solid #2b3b5c !important;animation:s29Glow 4s ease-in-out infinite;}
.wr-box h4{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px !important;}
.s29-live{display:inline-flex;align-items:center;gap:5px;background:#7f1d1d;color:#fff;font-weight:bold;font-size:.62rem;padding:2px 8px;border-radius:12px;letter-spacing:1px;}
.s29-live i{width:7px;height:7px;border-radius:50%;background:#ef4444;display:inline-block;animation:s29Pulse 1s infinite;}
.s29-spot{height:20px;flex:none;overflow:hidden;font-size:.76rem;color:#fde68a;background:#0b1220;border-left:3px solid #facc15;border-radius:0 6px 6px 0;padding:2px 8px;margin-bottom:5px;white-space:nowrap;text-overflow:ellipsis;}
.s29-slide{display:inline-block;animation:s29Slide .45s;}
.s29-body{flex:1;min-height:0;overflow-y:auto;padding-right:3px;}
.s29-body::-webkit-scrollbar{width:5px;}.s29-body::-webkit-scrollbar-thumb{background:#334155;border-radius:3px;}
.s29-chips{display:flex;gap:6px;margin-bottom:5px;}
.s29-chip{flex:1;min-width:0;background:#0b1220;border:1px solid #26324a;border-radius:8px;padding:3px 8px;animation:s29Slide .45s both;}
.s29-chip .nm{display:flex;align-items:center;gap:5px;font-size:.68rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.s29-chip .dot,.s29-tag .dot{width:9px;height:9px;border-radius:50%;display:inline-block;flex:none;}
.s29-chip b{font-size:1.35rem;color:#fff;line-height:1.1;display:inline-block;}
.s29-chip b.upd{animation:s29Pop .6s,s29Flash 1.2s;}
.s29-chip small{display:block;font-size:.64rem;color:#94a3b8;}
.s29-bar{position:relative;display:flex;height:9px;background:#0b1220;border:1px solid #26324a;border-radius:5px;overflow:hidden;}
.s29-bar i{display:block;height:100%;transform-origin:left;animation:s29Grow .8s ease-out;}
.s29-bar u{position:absolute;top:-2px;bottom:-2px;width:2px;background:#facc15;}
.s29-tags{margin-top:4px;}
.s29-tag{display:inline-flex;align-items:center;gap:4px;background:#0b1220;border:1px solid #334155;border-radius:10px;padding:1px 8px;font-size:.68rem;color:#cbd5e1;margin:2px 3px 0 0;animation:s29Pop .5s both;}
.s29-row{display:flex;align-items:center;gap:8px;font-size:.74rem;margin:3px 0;animation:s29Slide .4s both;}
.s29-row .nm{width:34%;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.s29-row .bw{flex:1;}
.s29-row .vl{width:36%;text-align:right;color:#cbd5e1;font-size:.68rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.s29-ph{display:flex;align-items:center;gap:8px;font-size:.74rem;color:#e2e8f0;margin-bottom:4px;}
.s29-ph .bw{flex:1;}
.s29-marq{overflow:hidden;height:20px;flex:none;background:#0b1220;border-left:3px solid #38bdf8;border-radius:0 6px 6px 0;margin-bottom:5px;}
.s29-marq span{display:inline-block;white-space:nowrap;padding:2px 8px;font-size:.76rem;color:#bae6fd;animation:s29Marq 26s linear infinite;}
.s29-news{display:flex;align-items:flex-start;gap:6px;font-size:.76rem;color:#e2e8f0;margin:3px 0;animation:s29Slide .45s both;}
.s29-news i{font-style:normal;flex:none;background:#0369a1;color:#fff;font-size:.58rem;font-weight:bold;padding:1px 6px;border-radius:4px;letter-spacing:.8px;margin-top:2px;}
.s29-hint{font-size:.74rem;color:#94a3b8;}
`;
    document.head.appendChild(st);
}

function s29Build() {
    s29Style();
    const defs = [['wr-seat-status', 'Seat Status', 'seat'], ['wr-state-status', 'State Status', 'state'], ['wr-media-headline', 'Media Headline', 'media']];
    defs.forEach(function (d) {
        const box = document.getElementById(d[0]);
        if (!box || box.getAttribute('data-s29')) return;
        box.setAttribute('data-s29', '1');
        const bodyId = d[2] === 'seat' ? 'wr-seat-status-text' : (d[2] === 'state' ? 'wr-state-status-text' : 'wr-media-text');
        box.innerHTML = '<h4><span>' + d[1] + '</span><span class="s29-live"><i></i>LIVE</span></h4>' +
            (d[2] === 'media' ? '<div class="s29-marq" id="s29-marq"><span></span></div>' : '<div class="s29-spot" id="s29-spot-' + d[2] + '"></div>') +
            '<div class="s29-body" id="' + bodyId + '"></div>';
    });
}

function s29Set(id, html) {
    const el = document.getElementById(id);
    if (!el || S29.last[id] === html) return;      // kuch badla nahi to animation dobara nahi
    S29.last[id] = html;
    el.innerHTML = html;
}

function s29Dot(c) { return '<i class="dot" style="background:' + c + '"></i>'; }

renderLeadBoxes = function () {
    const g = gameState;
    if (!resultModel || !g.partyTotals) return;
    s29Build();
    const L = computeLeads();
    g.leads = L;
    const you = document.getElementById('wr-you-seats'), opp = document.getElementById('wr-opp-seats');
    if (you) you.innerText = 'Seats: ' + (g.seats.you + L.you);
    if (opp) opp.innerText = 'Seats: ' + (g.seats.opp + L.opp);

    // ----- Seat Status -----
    const total = Object.keys(resultModel.seats).length || 543;
    const declared = Object.keys(g.partyTotals).reduce(function (s, p) { return s + g.partyTotals[p]; }, 0);
    const othWon = Math.max(0, declared - g.seats.you - g.seats.opp);
    const rows = [['you', g.seats.you, L.you], ['opp', g.seats.opp, L.opp], ['oth', othWon, L.oth]];
    const colOf = function (s) { return s === 'oth' ? '#94a3b8' : heatColorOf(s); };
    let h = '<div class="s29-chips">';
    rows.forEach(function (r, i) {
        const v = r[1] + r[2];
        const upd = S29.prev[r[0]] !== undefined && S29.prev[r[0]] !== v;
        S29.prev[r[0]] = v;
        h += '<div class="s29-chip" style="animation-delay:' + (i * 0.08) + 's"><span class="nm">' + s29Dot(colOf(r[0])) + esc(leadName(r[0])) + '</span><b class="' + (upd ? 'upd' : '') + '">' + v +
            '</b><small>jeet ' + r[1] + (r[2] ? ' + aage ' + r[2] : '') + '</small></div>';
    });
    h += '</div><div class="s29-bar">' + rows.map(function (r) {
        return '<i style="width:' + ((r[1] + r[2]) / total * 100).toFixed(2) + '%;background:' + colOf(r[0]) + '"></i>';
    }).join('') + '<u style="left:' + (MAJORITY / total * 100).toFixed(2) + '%"></u></div>';
    const parties = Object.keys(g.partyTotals).sort(function (a, b) { return g.partyTotals[b] - g.partyTotals[a]; }).slice(0, 4);
    h += '<div class="s29-tags">' + (parties.length ? parties.map(function (p, i) {
        return '<span class="s29-tag" style="animation-delay:' + (i * 0.07) + 's">' + s29Dot(partyColors[p] || '#9ca3af') + esc(p) + ' <b>' + g.partyTotals[p] + '</b></span>';
    }).join('') : '<span class="s29-hint">Abhi koi seat declare nahi hui.</span>') + '</div>';
    s29Set('wr-seat-status-text', h);

    const spotSeat = [];
    L.seats.filter(function (x) { return x.margin < 8; }).sort(function (a, b) { return a.margin - b.margin; }).slice(0, 5).forEach(function (x) {
        spotSeat.push('Kaante ki takkar: ' + esc(x.pc) + ' (' + esc(leadName(x.side)) + ' aage ' + x.margin.toFixed(1) + '%)');
    });
    if (!L.seats.length && !g.phaseEnded && g.round <= 1) spotSeat.push('Pehle round ke baad leads aayengi');
    spotSeat.push('Sarkar ke liye ' + MAJORITY + ' seats chahiye');
    S29.spot.seat = spotSeat;

    // ----- State Status -----
    const info = phaseInfo[g.phase];
    const hasLead = L.seats.length > 0;
    let t = '<div class="s29-ph"><span>Phase ' + g.phase + ' / ' + TOTAL_PHASES + ' | Round ' + g.round + (info && info.count ? ' | ' + info.count + ' seats' : '') + '</span><span class="bw s29-bar"><i style="width:' +
        Math.min(100, g.turnout) + '%;background:#22c55e"></i></span><span>' + g.turnout + '%</span></div>';
    const spotState = [];
    const sts = activeStates();
    if (!sts.length) t += '<div class="s29-hint">Is phase ke saare natije aa gaye.</div>';
    sts.forEach(function (x, i) {
        const b = L.byState[x.st];
        let bar, txt;
        if (hasLead && b) {
            bar = '<i style="width:' + (b.you / b.n * 100).toFixed(1) + '%;background:' + colOf('you') + '"></i><i style="width:' + (b.opp / b.n * 100).toFixed(1) + '%;background:' + colOf('opp') + '"></i>' +
                '<i style="width:' + (b.oth / b.n * 100).toFixed(1) + '%;background:#94a3b8"></i>';
            txt = b.you + ' | ' + b.opp + (b.oth ? ' | ' + b.oth : '');
            spotState.push(esc(x.st) + ' (' + x.n + '): ' + esc(sideName('you')) + ' ' + b.you + ' - ' + esc(sideName('opp')) + ' ' + b.opp);
        } else {
            bar = '';
            txt = x.n + ' seats';
        }
        t += '<div class="s29-row" style="animation-delay:' + Math.min(i, 12) * 0.05 + 's"><span class="nm" title="' + esc(x.st) + '">' + esc(x.st) + '</span><span class="bw s29-bar">' + bar + '</span><span class="vl">' + txt + '</span></div>';
    });
    s29Set('wr-state-status-text', t);
    if (!spotState.length) spotState.push(hasLead ? 'Leads update ho rahi hain' : 'Voting chal rahi hai - leads round ke baad');
    S29.spot.state = spotState;
    s29Spin(true);
};

function s29Spin(first) {
    ['seat', 'state'].forEach(function (k) {
        const el = document.getElementById('s29-spot-' + k), items = S29.spot[k];
        if (!el || !items.length) return;
        if (!first) S29.idx[k] = (S29.idx[k] + 1) % items.length; else if (S29.idx[k] >= items.length) S29.idx[k] = 0;
        const html = '<span class="s29-slide">' + items[S29.idx[k]] + '</span>';
        if (first && S29.last['spot' + k] === items[S29.idx[k]]) return;
        S29.last['spot' + k] = items[S29.idx[k]];
        el.innerHTML = html;
    });
}
setInterval(function () { s29Spin(false); }, 3000);

// ----- Media Headline -----
renderHeadlineBox = function () {
    s29Build();
    const list = (gameState.news || []).slice(0, 4);
    const line = list.length ? list.join('   \u2022   ') : 'Rallies tez, opposition ka aarop: funding mein hera-pheri. Janta ki nazar agle round par.';
    const m = document.getElementById('s29-marq');
    if (m && S29.last.marq !== line) {
        S29.last.marq = line;
        m.innerHTML = '<span>' + esc(line) + '</span>';
    }
    let h = '';
    if (!list.length) h = '<div class="s29-hint">Abhi koi badi khabar nahi. Rally, court case ya EC shikayat par khabrein yahan aayengi.</div>';
    list.forEach(function (x, i) {
        h += '<div class="s29-news" style="animation-delay:' + i * 0.08 + 's"><i>NEWS</i><span>' + esc(x) + '</span></div>';
    });
    s29Set('wr-media-text', h);
};

s29Build();
renderHeadlineBox();

// ================= STAGE 30: WAR ROOM TOP BAR, GOL ICONS, BADE BOXES + PARTY / GATHBANDHAN / SEAT SHARING FULL PAGE =================

function s30Style() {
    if (document.getElementById('s30-style')) return;
    const st = document.createElement('style');
    st.id = 's30-style';
    st.textContent = `
@keyframes s30Float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-24px) scale(1.12)}}
@keyframes s30Up{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
@keyframes s30Shine{from{transform:translateX(-120%)}to{transform:translateX(420%)}}
@keyframes s30Pop{0%{transform:scale(.7);opacity:0}70%{transform:scale(1.08)}100%{transform:none;opacity:1}}
@keyframes s30Pulse{0%,100%{box-shadow:0 0 0 0 rgba(250,204,21,.55)}50%{box-shadow:0 0 0 10px rgba(250,204,21,0)}}

/* ---------- war room: upar ki patti ---------- */
.wr-top-bar{height:78px !important;padding:0 14px !important;border-radius:14px !important;overflow:hidden;
  background:linear-gradient(90deg,#0a0f1f,#111a33 50%,#0a0f1f) !important;border:1px solid #27345a !important;}
.s30-top{display:flex;align-items:center;width:100%;gap:12px;}
.s30-gear{width:46px;height:46px;border-radius:50% !important;padding:0 !important;flex:none;display:flex;align-items:center;justify-content:center;
  background:#1e293b !important;border:1px solid #475569 !important;cursor:pointer;transition:.25s;}
.s30-gear svg{width:24px;height:24px;stroke:#cbd5e1;fill:none;stroke-width:1.8;transition:transform .6s;}
.s30-gear:hover svg{transform:rotate(180deg);stroke:#38bdf8;}
.s30-team{position:relative;flex:1;min-width:0;height:60px;display:flex;align-items:center;gap:12px;padding:0 30px;color:#fff;overflow:hidden;
  background:linear-gradient(90deg,var(--c,#22c55e),#0b1220 140%);}
.s30-team.l{clip-path:polygon(0 0,100% 0,95% 100%,0 100%);border-radius:10px 0 0 10px;}
.s30-team.r{clip-path:polygon(5% 0,100% 0,100% 100%,0 100%);border-radius:0 10px 10px 0;flex-direction:row-reverse;
  background:linear-gradient(270deg,var(--c,#ef4444),#0b1220 140%);}
.s30-team::after{content:'';position:absolute;top:0;left:0;width:18%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.18),transparent);animation:s30Shine 4.5s ease-in-out infinite;}
.s30-team .lg{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none;border:2px solid rgba(255,255,255,.7);}
.s30-team .wr-logo{display:flex !important;align-items:center;justify-content:center;font-size:.7rem;color:#0f172a;font-weight:bold;padding:0 !important;background:none !important;border:0 !important;}
.s30-team .wr-logo img{width:44px !important;height:44px !important;object-fit:contain;border-radius:50%;}
.s30-team .wr-logo span{display:none;}
.s30-team .sc{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;}
.s30-team .tp{display:flex;align-items:baseline;justify-content:space-between;gap:8px;}
.s30-team.r .tp{flex-direction:row-reverse;}
.s30-team .nm{font-size:.82rem;font-weight:bold;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 3px rgba(0,0,0,.6);}
.s30-team .num{font-size:1.9rem;font-weight:900;line-height:1;text-shadow:0 2px 6px rgba(0,0,0,.55);}
.s30-bar{position:relative;height:8px;border-radius:4px;background:rgba(0,0,0,.5);}
.s30-bar i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#fff,#facc15);transition:width .9s ease;}
.s30-team.r .s30-bar i{margin-left:auto;}
.s30-bar u{position:absolute;right:0;top:-3px;bottom:-3px;width:2px;background:#facc15;}
.s30-team.r .s30-bar u{right:auto;left:0;}
.s30-title{flex:none;text-align:center;line-height:1.1;padding:0 6px;}
.s30-title b{display:block;font-size:1.35rem;font-weight:900;letter-spacing:4px;background:linear-gradient(90deg,#ff9933 20%,#fff 50%,#22c55e 80%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.s30-title small{color:#94a3b8;font-size:.7rem;letter-spacing:1px;}
.wr-round-btn{flex:none;border-radius:12px !important;min-width:150px;height:48px;font-weight:bold !important;}

/* ---------- gol icons ---------- */
.wr-sidebar{width:70px !important;}
.wr-side-icon,.wr-side-icon.s23-ic{width:50px !important;height:50px !important;border-radius:50% !important;padding:0 !important;}
.wr-side-icon .ic-t{display:none !important;}
.wr-side-icon.s23-ic svg{width:27px !important;height:27px !important;}

/* ---------- neeche ke bade boxes ---------- */
.wr-bottom-boxes{height:215px !important;}
.wr-box{padding:9px 14px !important;border-radius:14px !important;}
.wr-box h4{font-size:1rem !important;}
.s29-spot,.s29-marq{height:26px !important;font-size:.9rem !important;}
.s29-spot{line-height:20px;}
.s29-chip b{font-size:1.9rem !important;}
.s29-chip .nm{font-size:.76rem !important;}
.s29-chip small{font-size:.72rem !important;}
.s29-bar{height:11px !important;}
.s29-row,.s29-news,.s29-ph{font-size:.86rem !important;}
.s29-row .vl{font-size:.78rem !important;}
.s29-tag{font-size:.78rem !important;}

/* ---------- full page common ---------- */
.s30-full{position:fixed;inset:0;z-index:9000;overflow-y:auto;color:#e2e8f0;font-family:inherit;
  background:radial-gradient(circle at 12% 8%,#3b1d6e 0,transparent 42%),radial-gradient(circle at 90% 20%,#0b4f7a 0,transparent 40%),radial-gradient(circle at 50% 100%,#6b1d4a 0,transparent 45%),#070b17;}
.s30-full:not(.hidden){display:flex;flex-direction:column;}
.s30-blob{position:fixed;width:340px;height:340px;border-radius:50%;opacity:.28;pointer-events:none;animation:s30Float 9s ease-in-out infinite;}
.s30-blob.b1{background:#c9742c;top:-90px;left:-70px;}
.s30-blob.b2{background:#b8651b;bottom:-120px;right:-80px;animation-delay:-4s;}
.s30-wrap{position:relative;z-index:2;width:100%;max-width:1500px;margin:0 auto;padding:22px 34px 30px;display:flex;flex-direction:column;flex:1;box-sizing:border-box;}
.s30-head{display:flex;align-items:center;gap:18px;margin-bottom:18px;animation:s30Up .5s both;}
.s30-head h1{margin:0;font-size:2.1rem;font-weight:900;letter-spacing:1px;background:linear-gradient(90deg,#f6e3b4,#e8a33d,#f6e3b4);-webkit-background-clip:text;background-clip:text;color:transparent;}
.s30-head p{margin:2px 0 0;color:#94a3b8;font-size:.9rem;}
.s30-back{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#fff;padding:10px 18px;border-radius:30px;cursor:pointer;font-weight:bold;transition:.25s;backdrop-filter:blur(6px);}
.s30-back:hover{background:rgba(255,255,255,.18);transform:translateX(-3px);}
.s30-badge{margin-left:auto;background:linear-gradient(90deg,#d98e2b,#b8651b);color:#fff;padding:7px 18px;border-radius:30px;font-weight:bold;font-size:.8rem;letter-spacing:1.5px;}
.s30-btn{border:0;border-radius:30px;padding:13px 30px;font-weight:900;font-size:1rem;letter-spacing:1px;color:#fff;cursor:pointer;transition:.25s;background:linear-gradient(90deg,#d98e2b,#b8651b);box-shadow:0 6px 22px rgba(124,58,237,.4);}
.s30-btn:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(6,182,212,.5);}
.s30-btn.go{background:linear-gradient(90deg,#16a34a,#84cc16);box-shadow:0 6px 22px rgba(34,197,94,.4);}
.s30-btn.sm{padding:8px 16px;font-size:.78rem;letter-spacing:.5px;}
.s30-btn.ghost{background:rgba(255,255,255,.1);box-shadow:none;border:1px solid rgba(255,255,255,.25);}

/* ---------- party chunne ka page ---------- */
.s30-tools{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:18px;animation:s30Up .5s .08s both;}
.s30-tools input{flex:1;min-width:260px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:30px;padding:13px 22px;font-size:1rem;outline:none;}
.s30-tools input:focus{border-color:#38bdf8;box-shadow:0 0 18px rgba(56,189,248,.4);}
.s30-pill{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2);color:#cbd5e1;border-radius:30px;padding:9px 18px;cursor:pointer;font-weight:bold;font-size:.85rem;transition:.2s;}
.s30-pill.on,.s30-pill:hover{background:linear-gradient(90deg,#d98e2b,#b8651b);color:#fff;border-color:transparent;}
.s30-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;padding-bottom:90px;}
.s30-sec{grid-column:1/-1;color:#fbbf24;font-weight:900;letter-spacing:1.5px;font-size:.85rem;margin-top:8px;text-transform:uppercase;}
.s30-card{position:relative;display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;cursor:pointer;overflow:hidden;
  background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(8px);
  transition:transform .25s,box-shadow .25s,border-color .25s;animation:s30Up .45s both;}
.s30-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--c,#38bdf8);}
.s30-card:hover{transform:translateY(-6px) scale(1.02);border-color:var(--c,#38bdf8);box-shadow:0 14px 30px rgba(0,0,0,.45),0 0 22px var(--c,#38bdf8);}
.s30-card.on{border-color:#4ade80;box-shadow:0 0 0 2px #4ade80,0 0 24px rgba(74,222,128,.5);}
.s30-card.on::after{content:'\\2713';position:absolute;right:12px;top:10px;width:26px;height:26px;border-radius:50%;background:#22c55e;color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center;animation:s30Pop .35s;}
.s30-card .info{min-width:0;}
.s30-card b{display:block;color:#fff;font-size:1.02rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.s30-card span.w{display:block;color:#94a3b8;font-size:.78rem;margin-top:2px;}
.s30-tag{display:inline-block;margin-top:6px;font-size:.66rem;font-weight:bold;letter-spacing:1px;padding:2px 10px;border-radius:10px;background:#334155;color:#e2e8f0;}
.s30-tag.NDA{background:#9a3412;}.s30-tag.INDIA{background:#1d4ed8;}.s30-tag.OTHER{background:#475569;}
.s30-foot{position:fixed;left:0;right:0;bottom:0;z-index:5;display:flex;align-items:center;gap:14px;justify-content:center;padding:14px;background:rgba(7,11,23,.88);border-top:1px solid rgba(255,255,255,.2);backdrop-filter:blur(10px);}
.s30-foot .cnt{font-weight:900;color:#fbbf24;font-size:1.05rem;}

/* ---------- gathbandhan page ---------- */
.s30-vs{display:flex;gap:18px;align-items:stretch;flex:1;margin-bottom:20px;}
.s30-side{flex:1;min-width:0;border-radius:24px;padding:22px;position:relative;overflow:hidden;animation:s30Up .55s both;
  background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);}
.s30-side.you{box-shadow:inset 0 3px 0 #38bdf8;}
.s30-side.opp{box-shadow:inset 0 3px 0 #ff9933;animation-delay:.1s;}
.s30-side h3{margin:0 0 4px;font-size:.78rem;letter-spacing:3px;color:#94a3b8;}
.s30-main{display:flex;align-items:center;gap:16px;margin:8px 0 16px;padding:14px;border-radius:18px;background:rgba(0,0,0,.28);}
.s30-main b{font-size:1.5rem;color:#fff;display:block;}
.s30-main span{color:#94a3b8;font-size:.85rem;}
.s30-vsmid{align-self:center;font-weight:900;font-size:2.2rem;letter-spacing:3px;background:linear-gradient(180deg,#f6e3b4,#e8a33d);-webkit-background-clip:text;background-clip:text;color:transparent;animation:s30Pop .6s .3s both;}
.s30-allies{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;}
.s30-ally{position:relative;padding:12px;border-radius:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);animation:s30Pop .4s both;transition:.2s;}
.s30-ally:hover{transform:translateY(-4px);border-color:var(--c,#38bdf8);}
.s30-ally .t{display:flex;align-items:center;gap:10px;}
.s30-ally b{color:#fff;font-size:.92rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.s30-ally small{color:#94a3b8;font-size:.72rem;}
.s30-ally .bt{display:flex;gap:6px;margin-top:10px;}
.s30-add{display:flex;align-items:center;justify-content:center;min-height:86px;border:2px dashed rgba(255,255,255,.35);border-radius:16px;color:#e2e8f0;font-weight:bold;cursor:pointer;transition:.25s;background:rgba(255,255,255,.04);}
.s30-add:hover{border-color:#4ade80;color:#4ade80;background:rgba(74,222,128,.08);transform:scale(1.03);}
.s30-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;}
.s30-count{display:inline-block;background:rgba(255,255,255,.12);padding:3px 14px;border-radius:20px;font-size:.78rem;font-weight:bold;margin-left:8px;color:#fbbf24;}
.s30-bottom{display:flex;justify-content:space-between;align-items:center;}

/* ---------- seat sharing page ---------- */
.s30-hero{display:flex;gap:16px;margin-bottom:18px;animation:s30Up .5s both;}
.s30-hbox{flex:1;border-radius:20px;padding:16px 22px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.18);}
.s30-hbox small{color:#94a3b8;letter-spacing:2px;font-size:.72rem;}
.s30-hbox b{display:block;font-size:2.4rem;font-weight:900;color:#fff;}
.s30-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:16px;}
.s30-state{border-radius:20px;padding:16px 18px;background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.17);animation:s30Up .45s both;transition:.25s;}
.s30-state:hover{border-color:#38bdf8;box-shadow:0 10px 26px rgba(0,0,0,.4);}
.s30-state .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.s30-state .hd b{color:#fff;font-size:1.1rem;}
.s30-state .hd span{color:#94a3b8;font-size:.82rem;}
.s30-split{display:flex;align-items:center;gap:12px;}
.s30-split .side{min-width:92px;text-align:center;}
.s30-split .side i{font-style:normal;display:block;font-size:1.7rem;font-weight:900;color:#fff;}
.s30-split .side small{display:block;color:#94a3b8;font-size:.68rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px;}
.s30-split input[type=range]{flex:1;accent-color:#38bdf8;height:6px;cursor:pointer;}
.s30-chips{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;}
.s30-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:2px 10px 2px 3px;font-size:.72rem;color:#e2e8f0;}
.s30-empty{text-align:center;color:#94a3b8;padding:60px 20px;font-size:1.05rem;border:2px dashed rgba(255,255,255,.2);border-radius:20px;}
`;
    document.head.appendChild(st);
}
s30Style();

// ---------- 1) War room: upar ki nayi patti ----------
const S30_GEAR = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

function s30BuildTop() {
    const bar = document.querySelector('.wr-top-bar');
    if (!bar || bar.getAttribute('data-s30')) return;
    bar.setAttribute('data-s30', '1');
    const team = function (k, cls) {
        return '<div class="s30-team ' + cls + '" id="wr-' + k + '-party-box"><div class="lg"><span class="wr-logo" id="wr-' + k + '-logo">' + (k === 'you' ? 'YOU' : 'OPP') + '</span></div>' +
            '<div class="sc"><div class="tp"><span class="nm" id="s30-' + k + '-nm"></span><b class="num" id="s30-' + k + '-num">0</b></div>' +
            '<div class="s30-bar"><i id="s30-' + k + '-bar" style="width:0%"></i><u></u></div></div>' +
            '<span id="wr-' + k + '-seats" style="display:none">Seats: 0</span></div>';
    };
    bar.innerHTML = '<div class="s30-top"><button class="wr-icon-btn s30-gear" onclick="openGameModal(\'Settings\')" title="Settings">' + S30_GEAR + '</button>' +
        team('you', 'l') + '<div class="s30-title"><b>LOK SABHA 2029</b><small id="s30-phase">272 seats = bahumat</small></div>' + team('opp', 'r') +
        '<button class="wr-round-btn" id="wr-round-btn" onclick="advanceRound()">Phase 1 - Round 1 [GO]</button></div>';
}

function s37SideLabel(k, name) {
    if (!name) return '';
    try {
        const parts = (k === 'you' ? youAlliancePartners : oppAlliancePartners) || [];
        if (!parts.some(function (p) { return p && p.name; })) return name;
        const d = PARTY_DB[name], bloc = d && d.bloc;
        return (bloc && bloc !== 'OTHER') ? bloc : name + '+';
    } catch (e) { return name; }
}
function s30Top() {
    s30BuildTop();
    const g = gameState;
    if (!g || !g.seats) return;
    const L = g.leads || { you: 0, opp: 0 };
    [['you', selectedYouParty], ['opp', selectedOppParty]].forEach(function (x) {
        const k = x[0], v = (g.seats[k] || 0) + (L[k] || 0);
        const n = document.getElementById('s30-' + k + '-num'), b = document.getElementById('s30-' + k + '-bar'), nm = document.getElementById('s30-' + k + '-nm');
        const box = document.getElementById('wr-' + k + '-party-box');
        if (n) n.textContent = v;
        if (b) b.style.width = Math.min(100, v / MAJORITY * 100) + '%';
        if (nm) nm.textContent = s37SideLabel(k, x[1]);
        if (box && x[1]) box.style.setProperty('--c', partyColors[x[1]] || (k === 'you' ? '#22c55e' : '#ef4444'));
    });
    const ph = document.getElementById('s30-phase');
    if (ph) ph.textContent = 'Phase ' + g.phase + ' / ' + TOTAL_PHASES + '  |  ' + MAJORITY + ' seats = bahumat';
}

s22WarBadges = function () {
    s30BuildTop();
    [['you', selectedYouParty], ['opp', selectedOppParty]].forEach(function (x) {
        const el = document.getElementById('wr-' + x[0] + '-logo');
        if (!el || !x[1]) return;
        el.innerHTML = s22Logo(x[1], 44);
    });
    s30Top();
};

const _renderLeadBoxesS30 = renderLeadBoxes;
renderLeadBoxes = function () {
    _renderLeadBoxesS30();
    s30Top();
};
s30BuildTop();

// ---------- 2) Party chunne ka full page ----------
const S30P = { filter: 'all', picked: {}, q: '' };

function s30PartyDom() {
    if (document.getElementById('s30-party')) return;
    const d = document.createElement('div');
    d.id = 's30-party';
    d.className = 's30-full hidden';
    d.innerHTML = '<div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap">' +
        '<div class="s30-head"><button class="s30-back" onclick="closePartyModal()">&larr; Wapas</button><div><h1 id="s30-pt"></h1><p id="s30-ps"></p></div></div>' +
        '<div class="s30-tools"><input id="s30-q" placeholder="Dal ka naam dhundo..." oninput="s30Fill()">' +
        '<button class="s30-pill on" data-f="all" onclick="s30Filter(\'all\')">Sabhi</button><button class="s30-pill" data-f="NDA" onclick="s30Filter(\'NDA\')">NDA</button>' +
        '<button class="s30-pill" data-f="INDIA" onclick="s30Filter(\'INDIA\')">INDIA</button><button class="s30-pill" data-f="OTHER" onclick="s30Filter(\'OTHER\')">Alag / kshetriya</button></div>' +
        '<div class="s30-grid" id="s30-grid"></div></div>' +
        '<div class="s30-foot hidden" id="s30-foot"><span class="cnt" id="s30-cnt"></span><button class="s30-btn ghost sm" onclick="s30PickShown()">Dikhne wale sabhi chuno</button>' +
        '<button class="s30-btn go" onclick="s30AddPicked()">Gathbandhan mein jodo</button></div>';
    document.body.appendChild(d);
}

function s30IsMulti() { return activeSelectionTarget === 'you-ally' || activeSelectionTarget === 'opp-ally'; }

function s30Used(name) {
    let u = false;
    youAlliancePartners.forEach(function (a) { if (a.name === name) u = true; });
    oppAlliancePartners.forEach(function (a) { if (a.name === name) u = true; });
    return u;
}

showModalWithOptions = function () {
    s30Style();
    s30PartyDom();
    S30P.filter = 'all';
    S30P.picked = {};
    const t = activeSelectionTarget;
    document.getElementById('s30-pt').textContent = t === 'you' ? 'Apni party chuno' : (t === 'opp' ? 'Rival party chuno' : (t === 'you-ally' ? 'Apne gathbandhan ke saathi chuno' : 'Rival gathbandhan ke saathi chuno'));
    document.getElementById('s30-ps').textContent = s30IsMulti() ? 'Jitne chaho utne dal chuno, phir neeche "Gathbandhan mein jodo" dabao.' : 'Ek dal par click karo.';
    document.getElementById('s30-q').value = '';
    document.querySelectorAll('#s30-party .s30-pill').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-f') === 'all'); });
    document.getElementById('s30-foot').classList.toggle('hidden', !s30IsMulti());
    s30Fill();
    document.getElementById('s30-party').classList.remove('hidden');
    document.getElementById('s30-party').scrollTop = 0;
};

function s30Filter(f) {
    S30P.filter = f;
    document.querySelectorAll('#s30-party .s30-pill').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-f') === f); });
    s30Fill();
}

function s30Shown() {
    const q = ((document.getElementById('s30-q') || {}).value || '').toLowerCase().trim();
    return partiesList.slice().sort(function (a, b) { return s22Rank(a) - s22Rank(b); }).filter(function (p) {
        const t = activeSelectionTarget;
        if (t !== 'you' && p.name === selectedYouParty) return false;
        if (t !== 'opp' && p.name === selectedOppParty) return false;
        if (t === 'you' && p.name === selectedOppParty) return false;
        if (t === 'opp' && p.name === selectedYouParty) return false;
        if (s30Used(p.name)) return false;
        if (S30P.filter !== 'all' && p.bloc !== S30P.filter) return false;
        if (q && (p.name + ' ' + p.symbol).toLowerCase().indexOf(q) === -1) return false;
        return true;
    });
}

function s30Fill() {
    const grid = document.getElementById('s30-grid');
    const list = s30Shown();
    const q = (document.getElementById('s30-q').value || '').trim();
    grid.innerHTML = '';
    const heads = ['Sabse bade dal', 'Bade kshetriya dal', 'Chhote dal'];
    const tierOf = function (p) { const r = s22Rank(p); return r < 2 ? 0 : (r < 20 ? 1 : 2); };
    let last = -1, n = 0;
    list.forEach(function (p) {
        const tr = tierOf(p);
        if (!q && tr !== last) {
            last = tr;
            const h = document.createElement('div');
            h.className = 's30-sec';
            h.textContent = heads[tr];
            grid.appendChild(h);
        }
        const c = document.createElement('div');
        c.className = 's30-card' + (S30P.picked[p.name] ? ' on' : '');
        c.style.setProperty('--c', p.color);
        c.style.animationDelay = Math.min(n++, 30) * 0.025 + 's';
        c.innerHTML = s22Logo(p.name, 60) + '<div class="info"><b>' + esc(p.name) + '</b><span class="w">' + esc(partyWhere(p)) + '</span><span class="s30-tag ' + p.bloc + '">' + (p.bloc === 'OTHER' ? 'ALAG' : p.bloc) + '</span></div>';
        c.onclick = function () {
            if (s30IsMulti()) {
                if (S30P.picked[p.name]) delete S30P.picked[p.name]; else S30P.picked[p.name] = true;
                c.classList.toggle('on');
                s30Count();
            } else {
                confirmSelection(p.name);
            }
        };
        grid.appendChild(c);
    });
    if (!list.length) grid.innerHTML = '<div class="s30-empty" style="grid-column:1/-1">Koi dal nahi mila.</div>';
    s30Count();
}

function s30Count() {
    const el = document.getElementById('s30-cnt');
    if (el) el.textContent = Object.keys(S30P.picked).length + ' dal chune';
}

function s30PickShown() {
    s30Shown().forEach(function (p) { S30P.picked[p.name] = true; });
    s30Fill();
}

function s30AddPicked() {
    const side = activeSelectionTarget === 'you-ally' ? 'you' : 'opp';
    const arr = side === 'you' ? youAlliancePartners : oppAlliancePartners;
    Object.keys(S30P.picked).forEach(function (nm) {
        if (s30Used(nm)) return;
        const empty = arr.filter(function (a) { return !a.name; })[0];
        if (empty) { empty.name = nm; empty.states = defaultAllyStates(nm); } else arr.push({ name: nm, states: defaultAllyStates(nm) });
    });
    closePartyModal();
    renderCampaignLayout();
}

closePartyModal = function () {
    const p = document.getElementById('s30-party');
    if (p) p.classList.add('hidden');
    const m = document.getElementById('party-modal');
    if (m) m.classList.add('hidden');
};

openYouAllianceModal = function () {
    activeSelectionTarget = 'you-ally';
    activeSlotIndex = null;
    showModalWithOptions();
};
openOppAllianceModal = function () {
    activeSelectionTarget = 'opp-ally';
    activeSlotIndex = null;
    showModalWithOptions();
};

// ---------- 3) Gathbandhan ka full page ----------
function s30Compact() {
    [youAlliancePartners, oppAlliancePartners].forEach(function (arr) {
        for (let i = arr.length - 1; i >= 0; i--) if (!arr[i].name) arr.splice(i, 1);
    });
}

function s30Remove(side, idx) {
    const arr = side === 'you' ? youAlliancePartners : oppAlliancePartners;
    arr.splice(idx, 1);
    renderCampaignLayout();
}

function s30Main(name, who) {
    const d = name ? PARTY_DB[name] : null;
    return '<div class="s30-main">' + (name ? s22Logo(name, 76) : '<div style="width:76px;height:76px;border-radius:50%;background:#1e293b"></div>') +
        '<div><b>' + esc(name || 'Party chuni nahi') + '</b><span>' + (d ? esc(partyWhere(d)) + ' | ' + (d.bloc === 'OTHER' ? 'Alag' : d.bloc) : who) + '</span></div></div>';
}

function s30Side(side, withAllies) {
    const name = side === 'you' ? selectedYouParty : selectedOppParty;
    const arr = side === 'you' ? youAlliancePartners : oppAlliancePartners;
    const open = side === 'you' ? 'openYouAllianceModal()' : 'openOppAllianceModal()';
    let h = '<section class="s30-side ' + side + '"><h3>' + (side === 'you' ? 'YOU' : 'OPPONENT') + (withAllies ? '<span class="s30-count">' + arr.length + ' saathi dal</span>' : '') + '</h3>' + s30Main(name, '');
    if (!withAllies) {
        return h + '<div class="s30-empty" style="padding:30px">Aap akele chunav lad rahe ho. Koi gathbandhan nahi.</div></section>';
    }
    h += '<div class="s30-allies">';
    arr.forEach(function (a, i) {
        const d = PARTY_DB[a.name];
        const sts = a.states || [];
        h += '<div class="s30-ally" style="--c:' + (d ? d.color : '#38bdf8') + ';animation-delay:' + Math.min(i, 20) * 0.04 + 's"><div class="t">' + s22Logo(a.name, 44) +
            '<div style="min-width:0"><b>' + esc(a.name) + '</b><small>' + (sts.length ? sts.length + ' state: ' + esc(sts.slice(0, 2).join(', ')) + (sts.length > 2 ? '...' : '') : 'Koi state nahi') + '</small></div></div>' +
            '<div class="bt"><button class="s30-btn sm" onclick="openStateModal(\'' + side + '-ally-states\',' + i + ')">States</button>' +
            '<button class="s30-btn sm ghost" onclick="s30Remove(\'' + side + '\',' + i + ')">Hatao</button></div></div>';
    });
    h += '<div class="s30-add" onclick="' + open + '">+ Saathi dal jodo</div></div>';
    h += '<div class="s30-actions"><button class="s30-btn sm ghost" onclick="autoFillAllies(\'' + side + '\')">' + (side === 'you' ? 'Apne bloc ke saathi apne aap jodo' : 'Rival bloc ke saathi apne aap jodo') + '</button></div>';
    return h + '</section>';
}

renderCampaignLayout = function () {
    s30Style();
    s30Compact();
    const scr = document.getElementById('campaign-setup-screen');
    if (!scr) return;
    const alliance = ((document.getElementById('choose-fight-select') || {}).value) === 'alliance';
    scr.className = scr.className.replace(/\bs30-full\b/g, '') + ' s30-full';
    scr.innerHTML = '<div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap">' +
        '<div class="s30-head"><button class="s30-back" onclick="goBackToPMPage()">&larr; Wapas</button><div><h1>Gathbandhan</h1><p>Kaun kiske saath ladega, yahan tay karo. Jitne chaho utne dal jodo.</p></div>' +
        '<span class="s30-badge" id="election-mode-badge">' + (alliance ? 'ALLIANCE' : 'ALONE') + ' MODE</span></div>' +
        '<div class="s30-vs">' + s30Side('you', alliance) + '<div class="s30-vsmid">V/S</div>' + s30Side('opp', true) + '</div>' +
        '<div class="s30-bottom"><button class="s30-back" onclick="goBackToPMPage()">&larr; Wapas</button><button class="s30-btn" onclick="openSeatSharingPage()">SEAT SHARING &rarr;</button></div></div>';
};

autoFillAllies = function (side) {
    const main = side === 'you' ? selectedYouParty : selectedOppParty;
    const rival = side === 'you' ? selectedOppParty : selectedYouParty;
    const p = PARTY_DB[main];
    if (!p || p.bloc === 'OTHER') {
        alert('Is dal ka koi bada gathbandhan nahi hai. Saathi haath se chuno.');
        return;
    }
    const arr = side === 'you' ? youAlliancePartners : oppAlliancePartners;
    const otherArr = side === 'you' ? oppAlliancePartners : youAlliancePartners;
    const used = {};
    otherArr.forEach(function (a) { if (a.name) used[a.name] = true; });
    arr.forEach(function (a) { if (a.name) used[a.name] = true; });
    partiesList.filter(function (q) {
        return q.bloc === p.bloc && q.name !== main && q.name !== rival && !used[q.name];
    }).sort(function (a, b) { return b.w - a.w; }).slice(0, 6).forEach(function (q) {
        arr.push({ name: q.name, states: defaultAllyStates(q.name) });
    });
    renderCampaignLayout();
};

// ---------- 4) Seat sharing ka full page ----------
function s30Totals() {
    let you = 0, ally = 0;
    document.querySelectorAll('#seat-sharing-screen input[type=range]').forEach(function (s) {
        const t = parseInt(s.max, 10), v = parseInt(s.value, 10);
        you += v;
        ally += t - v;
    });
    const a = document.getElementById('s30-tot-you'), b = document.getElementById('s30-tot-ally');
    if (a) a.textContent = you;
    if (b) b.textContent = ally;
}

function s30Share(el) {
    const i = el.getAttribute('data-i'), t = parseInt(el.max, 10), v = parseInt(el.value, 10);
    document.getElementById('s30-y-' + i).textContent = v;
    document.getElementById('s30-a-' + i).textContent = t - v;
    s30Totals();
}

function s30Split() {
    document.querySelectorAll('#seat-sharing-screen input[type=range]').forEach(function (s) {
        s.value = Math.round(parseInt(s.max, 10) / 2);
        s30Share(s);
    });
}

openSeatSharingPage = function () {
    s30Style();
    document.getElementById('campaign-setup-screen').classList.add('hidden');
    const scr = document.getElementById('seat-sharing-screen');
    scr.classList.remove('hidden');
    scr.className = scr.className.replace(/\bs30-full\b/g, '') + ' s30-full';
    s30Compact();
    const alliance = document.getElementById('choose-fight-select').value === 'alliance';
    const allies = alliance ? youAlliancePartners.filter(function (a) { return a.name && a.states.length; }) : [];
    const byState = {};
    allies.forEach(function (a) { a.states.forEach(function (st) { (byState[st] = byState[st] || []).push(a.name); }); });
    const sts = Object.keys(byState).sort(function (a, b) { return (stateSeatsData[b] || 10) - (stateSeatsData[a] || 10); });
    let total = 0;
    sts.forEach(function (st) { total += stateSeatsData[st] || 10; });
    let body = '';
    if (!sts.length) {
        body = '<div class="s30-empty">Akele chunav ladne par ya kisi saathi ke liye state na chunne par seat sharing ki zarurat nahi hai. Seedha ladai par chalo!</div>';
    } else {
        body = '<div class="s30-hero"><div class="s30-hbox"><small>' + esc((selectedYouParty || 'YOU').toUpperCase()) + ' KE PAAS</small><b id="s30-tot-you">0</b></div>' +
            '<div class="s30-hbox"><small>SAATHI DALON KE PAAS</small><b id="s30-tot-ally">0</b></div>' +
            '<div class="s30-hbox"><small>KUL SEATS (IN STATES MEIN)</small><b>' + total + '</b><button class="s30-btn sm ghost" style="margin-top:6px" onclick="s30Split()">Sabhi 50-50 karo</button></div></div>';
        body += '<div class="s30-list">';
        sts.forEach(function (st, i) {
            const tot = stateSeatsData[st] || 10, half = Math.round(tot / 2);
            body += '<div class="s30-state" style="animation-delay:' + Math.min(i, 16) * 0.04 + 's"><div class="hd"><b>' + esc(st) + '</b><span>Kul ' + tot + ' seats</span></div>' +
                '<div class="s30-split"><div class="side">' + s22Logo(selectedYouParty, 40) + '<i id="s30-y-' + i + '">' + half + '</i><small>' + esc(selectedYouParty) + '</small></div>' +
                '<input type="range" min="0" max="' + tot + '" value="' + half + '" id="slider-' + esc(st) + '" data-i="' + i + '" oninput="s30Share(this)">' +
                '<div class="side"><i id="s30-a-' + i + '">' + (tot - half) + '</i><small>Saathi dal</small></div></div>' +
                '<div class="s30-chips">' + byState[st].map(function (n) { return '<span class="s30-chip">' + s22Logo(n, 22) + esc(n) + '</span>'; }).join('') + '</div></div>';
        });
        body += '</div>';
    }
    scr.innerHTML = '<div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap">' +
        '<div class="s30-head"><button class="s30-back" onclick="goBackToCampaign()">&larr; Wapas</button><div><h1>Seat Sharing</h1><p>Har state mein saathi dalon ko kitni seats deni hain, slider se tay karo.</p></div></div>' +
        body + '<div class="s30-bottom" style="margin-top:22px"><button class="s30-back" onclick="goBackToCampaign()">&larr; Wapas</button>' +
        '<button class="s30-btn go" onclick="startWarRoomMap()">LET\'S GO TO FIGHT !</button></div></div>';
    s30Totals();
};

// Ek state mein kai saathi: saathi ka hissa aapas mein barabar baant do
allocateAllies = function (keys, partyMap, allies, canonSt, side, useSlider) {
    const here = allies.filter(function (a) { return a.name && a.states.indexOf(canonSt) !== -1; });
    if (!here.length) return;
    const remaining = shuffled(keys);
    let share = Math.min(0.75, 0.5 + 0.08 * (here.length - 1));
    if (useSlider) {
        const sl = document.getElementById('slider-' + canonSt);
        const total = stateSeatsData[canonSt] || keys.length;
        if (sl) share = (total - parseInt(sl.value, 10)) / total;
    }
    const each = Math.round(share * keys.length / here.length);
    here.forEach(function (ally) {
        const k = Math.min(each, remaining.length);
        for (let i = 0; i < k; i++) partyMap[remaining.shift()] = ally.name;
        resultModel.sideOf[ally.name] = side;
    });
};

// shuru mein ek baar banao taaki "election-mode-badge" pehle se maujood ho
renderCampaignLayout();

// ================= STAGE 31: BUG FIX - PM PAGE FULL, GATHBANDHAN + SEAT SHARING SCREEN MEIN FIT, SEAT STATUS NEWS TICKER =================

function s31Style() {
    if (document.getElementById('s31-style')) return;
    const st = document.createElement('style');
    st.id = 's31-style';
    st.textContent = `
@keyframes s31Run{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes s31In{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
@keyframes s31Blink{0%,100%{opacity:1}50%{opacity:.55}}

/* ---------- Become PM page: poora full page ---------- */
#become-pm-screen{justify-content:flex-start !important;align-items:stretch !important;padding:0 !important;overflow-y:auto;
  background:radial-gradient(circle at 12% 8%,#3b1d6e 0,transparent 42%),radial-gradient(circle at 90% 20%,#0b4f7a 0,transparent 40%),radial-gradient(circle at 50% 100%,#6b1d4a 0,transparent 45%),#070b17 !important;}
#become-pm-screen .pm-container{width:100% !important;max-width:none !important;min-height:100%;box-sizing:border-box;padding:28px 7vw 36px !important;
  background:transparent !important;border:0 !important;border-radius:0 !important;box-shadow:none !important;display:flex;flex-direction:column;justify-content:center;gap:6px;}
#become-pm-screen .pm-title{font-size:3.2rem !important;font-weight:900;letter-spacing:4px;margin:6px 0 22px !important;
  background:linear-gradient(90deg,#f0abfc,#38bdf8,#4ade80);-webkit-background-clip:text;background-clip:text;color:transparent !important;animation:s30Up .5s both;}
#become-pm-screen .matchup-boxes{gap:30px;margin-bottom:30px !important;}
#become-pm-screen .party-select-box{flex:1;width:auto !important;max-width:560px;height:330px !important;border-radius:26px !important;
  background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.03)) !important;border:2px dashed rgba(56,189,248,.7) !important;backdrop-filter:blur(8px);transition:.3s;animation:s30Up .55s both;}
#become-pm-screen #select-opp-box{border-color:rgba(255,153,51,.75) !important;animation-delay:.12s;}
#become-pm-screen .party-select-box:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 18px 40px rgba(0,0,0,.5),0 0 30px rgba(56,189,248,.35);}
#become-pm-screen #select-opp-box:hover{box-shadow:0 18px 40px rgba(0,0,0,.5),0 0 30px rgba(255,153,51,.35);}
#become-pm-screen .s22-filled{border-style:solid !important;}
#become-pm-screen .s22-sel img{width:130px !important;height:130px !important;}
#become-pm-screen .s22-sel .nm{font-size:1.5rem !important;}
#become-pm-screen .box-label{font-size:.9rem !important;letter-spacing:3px;}
#become-pm-screen .vs-text{font-size:3rem !important;font-weight:900;background:linear-gradient(180deg,#f6e3b4,#e8a33d);-webkit-background-clip:text;background-clip:text;color:transparent !important;animation:s30Pop .6s .3s both;}
#become-pm-screen .options-section{background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.03)) !important;border:1px solid rgba(255,255,255,.18);border-radius:22px !important;padding:12px 26px !important;margin-bottom:24px !important;backdrop-filter:blur(8px);}
#become-pm-screen .option-label{font-size:1.1rem !important;color:#e2e8f0;}
#become-pm-screen .game-select{font-size:1rem !important;padding:9px 14px !important;border-radius:12px !important;background:#0f172a !important;color:#fff !important;border:1px solid #38bdf8 !important;}
#become-pm-screen .next-btn{border-radius:30px !important;padding:14px 46px !important;font-size:1.1rem !important;letter-spacing:2px;background:linear-gradient(90deg,#16a34a,#84cc16) !important;box-shadow:0 6px 22px rgba(34,197,94,.4);}
#become-pm-screen .back-btn{border-radius:30px !important;padding:12px 26px !important;background:rgba(255,255,255,.1) !important;border:1px solid rgba(255,255,255,.25) !important;}

/* ---------- Gathbandhan + Seat sharing: ek screen mein fit, upar ka hissa hamesha dikhe ---------- */
.s30-full{padding:0 !important;}
.s30-blob{width:560px !important;height:560px !important;opacity:.38 !important;}
.s30-blob.b1{background:radial-gradient(circle,#c9742c,transparent 68%) !important;}
.s30-blob.b2{background:radial-gradient(circle,#b8651b,transparent 68%) !important;}
#campaign-setup-screen .s30-wrap,#seat-sharing-screen .s30-wrap{height:100vh;max-height:100vh;overflow:hidden;}
#campaign-setup-screen .s30-vs{min-height:0;}
#campaign-setup-screen .s30-side{display:flex;flex-direction:column;min-height:0;}
#campaign-setup-screen .s30-allies{flex:1;min-height:0;overflow-y:auto;align-content:start;padding:6px 8px 10px 2px;}
#campaign-setup-screen .s30-actions,#campaign-setup-screen .s30-main{flex:none;}
#seat-sharing-screen .s30-list{flex:1;min-height:0;overflow-y:auto;align-content:start;padding:8px 8px 14px 2px;}
#seat-sharing-screen .s30-hero{flex:none;}
#seat-sharing-screen .s30-empty{margin:auto 0;}
.s30-allies::-webkit-scrollbar,.s30-list::-webkit-scrollbar{width:7px;}
.s30-allies::-webkit-scrollbar-thumb,.s30-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.28);border-radius:4px;}

/* ---------- Seat Status: news ticker ---------- */
#wr-seat-status.s31 #wr-seat-status-text,#wr-seat-status.s31 #s29-spot-seat{display:none !important;}
.s31-spot{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.s31-big{display:flex;align-items:center;gap:16px;animation:s31In .5s both;max-width:100%;}
.s31-big .tg{background:var(--c,#38bdf8);color:#fff;font-weight:900;padding:5px 16px;border-radius:8px;font-size:1.05rem;letter-spacing:2px;animation:s31Blink 1.4s infinite;flex:none;}
.s31-big b{font-size:2.3rem;color:#fff;font-weight:900;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 2px 12px rgba(0,0,0,.65);}
.s31-big small{display:block;color:#cbd5e1;font-size:1rem;margin-top:2px;white-space:nowrap;}
.s31-crawl{flex:none;height:44px;overflow:hidden;background:#04070f;border-top:2px solid #ef4444;margin:6px -14px -9px;display:flex;align-items:center;}
.s31-track{display:flex;white-space:nowrap;animation:s31Run var(--d,30s) linear infinite;}
.s31-it{display:inline-flex;align-items:center;gap:9px;padding:0 28px;font-size:1.22rem;color:#fff;border-right:1px solid #334155;}
.s31-it i{width:11px;height:11px;border-radius:50%;background:var(--c);display:inline-block;flex:none;}
.s31-it b{font-weight:900;}
.s31-it em{font-style:normal;color:#94a3b8;font-size:.9rem;}
.s31-it u{text-decoration:none;color:var(--c);font-weight:bold;font-size:1rem;letter-spacing:.5px;}
`;
    document.head.appendChild(st);
}
s31Style();

const S31 = { items: [], sig: '', idx: 0 };

function s31Colour(side) {
    return side === 'oth' ? '#94a3b8' : heatColorOf(side);
}

function s31Items() {
    const g = gameState;
    if (!resultModel || !g) return [];
    const keys = Object.keys(resultModel.seats);
    const decl = function (ph) {
        const out = [];
        keys.forEach(function (k) {
            const s = resultModel.seats[k], w = seatResults[k];
            if (s.phase !== ph || !w) return;
            const m = g.seatMeta && g.seatMeta[k];
            out.push({ n: s.pc, st: s.st, c: partyColors[w] || '#9ca3af', who: w, t: 'JEET', x: m && m.mv ? m.mv.toLocaleString('en-IN') + ' vote se' : '' });
        });
        return out;
    };
    let items = decl(g.phase);
    if (!items.length) {
        const L = computeLeads();
        items = L.seats.map(function (x) {
            return { n: x.pc, st: x.st, c: s31Colour(x.side), who: leadName(x.side), t: 'AAGE', x: x.margin.toFixed(1) + '% se' };
        });
    }
    if (!items.length && g.phase > 1) items = decl(g.phase - 1);
    if (!items.length) {
        keys.forEach(function (k) {
            const s = resultModel.seats[k];
            if (s.phase === g.phase && !seatResults[k]) items.push({ n: s.pc, st: s.st, c: '#38bdf8', who: 'Voting jaari', t: 'VOTING', x: '' });
        });
    }
    return items;
}

function s31Seat() {
    const box = document.getElementById('wr-seat-status');
    if (!box) return;
    if (!box.getAttribute('data-s31')) {
        if (!box.getAttribute('data-s29')) return;       // pehle S29 ka dhancha ban jaye
        box.setAttribute('data-s31', '1');
        box.classList.add('s31');
        box.insertAdjacentHTML('beforeend', '<div class="s31-spot" id="s31-spot"></div><div class="s31-crawl"><div class="s31-track" id="s31-track"></div></div>');
    }
    const items = s31Items();
    const sig = items.map(function (i) { return i.n + i.t + i.who; }).join('|');
    if (sig === S31.sig) return;                          // kuch badla nahi to ticker na chhero
    S31.sig = sig;
    S31.items = shuffled(items).slice(0, 60);
    S31.idx = 0;
    const tr = document.getElementById('s31-track');
    if (!tr) return;
    const one = S31.items.map(function (i) {
        return '<span class="s31-it" style="--c:' + i.c + '"><i></i><b>' + esc(i.n) + '</b><em>' + esc(i.st) + '</em><u>' + esc(i.who) + ' ' + i.t + (i.x ? ' ' + esc(i.x) : '') + '</u></span>';
    }).join('');
    tr.style.setProperty('--d', Math.max(14, S31.items.length * 1.3) + 's');
    tr.innerHTML = one + one;                             // do baar, taaki bina ruke chalta rahe
    s31Spin();
}

function s31Spin() {
    const sp = document.getElementById('s31-spot');
    if (!sp) return;
    if (!S31.items.length) {
        sp.innerHTML = '<div class="s31-big"><span class="tg" style="--c:#38bdf8">LIVE</span><b>Voting shuru hone wali hai</b></div>';
        return;
    }
    const i = S31.items[S31.idx % S31.items.length];
    S31.idx++;
    sp.innerHTML = '<div class="s31-big" style="--c:' + i.c + '"><span class="tg">' + i.t + '</span><div style="min-width:0"><b>' + esc(i.n) + '</b><small>' + esc(i.st) + ' | ' + esc(i.who) + (i.x ? ' | ' + esc(i.x) : '') + '</small></div></div>';
}
setInterval(s31Spin, 2000);

const _renderLeadBoxesS31 = renderLeadBoxes;
renderLeadBoxes = function () {
    _renderLeadBoxesS31();
    s31Seat();
};
s31Seat();

// ================= STAGE 32: MUTE BUTTON HATAO, STATE POPUP FIX (peeche chhup jata tha), SEAT STATUS VOTING TEXT THODA CHHOTA =================

function s32Style() {
    if (document.getElementById('s32-style')) return;
    const st = document.createElement('style');
    st.id = 's32-style';
    st.textContent = `
/* neeche daayein kone ka sound button hata diya (awaaz Settings se chalegi) */
#s21-mute{display:none !important;}

/* State popup ab full page ke upar khulta hai */
#state-modal{z-index:9500 !important;background:rgba(4,7,16,.82) !important;}
#state-modal .modal-content{width:min(920px,94vw) !important;max-height:90vh;display:flex;flex-direction:column;border-radius:24px !important;padding:24px 28px !important;
  background:linear-gradient(145deg,#1b2447,#0e1427) !important;border:1px solid rgba(255,255,255,.22) !important;box-shadow:0 24px 60px rgba(0,0,0,.6);animation:s30Pop .35s both;}
#state-modal h2{margin:0 0 4px !important;font-size:1.5rem !important;letter-spacing:1px;background:linear-gradient(90deg,#f6e3b4,#e8a33d,#f6e3b4);-webkit-background-clip:text;background-clip:text;color:transparent !important;}
#state-modal .s32-sub{color:#94a3b8;font-size:.85rem;margin-bottom:12px;}
#state-modal .s32-tools{display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;}
#state-modal .s32-tools button{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:20px;padding:7px 18px;font-weight:bold;cursor:pointer;transition:.2s;}
#state-modal .s32-tools button:hover{background:linear-gradient(90deg,#d98e2b,#b8651b);border-color:transparent;}
#state-modal #state-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr)) !important;max-height:none !important;flex:1;min-height:0;overflow-y:auto;gap:10px !important;padding:2px 6px 4px 2px;}
#state-modal .party-option-card{display:flex;align-items:center;gap:10px;padding:10px 12px !important;border-radius:14px !important;background:rgba(255,255,255,.07) !important;border:1px solid rgba(255,255,255,.16) !important;cursor:pointer;transition:.2s;}
#state-modal .party-option-card:hover{transform:translateY(-3px);border-color:#38bdf8 !important;}
#state-modal .party-option-card.on{border-color:#4ade80 !important;background:rgba(74,222,128,.14) !important;}
#state-modal .party-option-card span{font-size:.88rem !important;}
#state-modal input[type=checkbox]{width:18px;height:18px;accent-color:#22c55e;}
#state-modal .next-btn{align-self:center;margin-top:16px !important;padding:12px 44px !important;border-radius:30px !important;font-size:1rem !important;letter-spacing:1px;background:linear-gradient(90deg,#16a34a,#84cc16) !important;}

/* Seat Status ke upar ka bada text thoda chhota */
.s31-big b{font-size:1.8rem !important;}
.s31-big .tg{font-size:.9rem !important;padding:4px 13px !important;}
.s31-big small{font-size:.85rem !important;}
`;
    document.head.appendChild(st);
}
s32Style();

openStateModal = function (side, slotIndex) {
    s32Style();
    activeSelectionTarget = side;
    activeSlotIndex = slotIndex;
    const arr = side === 'you-ally-states' ? youAlliancePartners : oppAlliancePartners;
    const ally = arr[slotIndex];
    if (!ally) return;
    const modal = document.getElementById('state-modal');
    const grid = document.getElementById('state-grid');
    const content = modal.querySelector('.modal-content');

    document.getElementById('state-modal-title').textContent = ally.name + ' - kin states mein ladegi?';
    if (!content.querySelector('.s32-sub')) {
        grid.insertAdjacentHTML('beforebegin', '<div class="s32-sub">Jin states mein ye dal gathbandhan ke saath ladega unhe chuno.</div>' +
            '<div class="s32-tools"><button onclick="s32All(true)">Sabhi chuno</button><button onclick="s32All(false)">Koi nahi</button></div>');
    }
    grid.innerHTML = '';
    const have = ally.states || [];
    statesForParty(ally.name).forEach(function (state) {
        const card = document.createElement('label');
        card.className = 'party-option-card' + (have.indexOf(state) !== -1 ? ' on' : '');
        card.innerHTML = '<input type="checkbox" value="' + esc(state) + '"' + (have.indexOf(state) !== -1 ? ' checked' : '') + '><span style="color:#fff">' + esc(state) + '</span>';
        card.querySelector('input').onchange = function () { card.classList.toggle('on', this.checked); };
        grid.appendChild(card);
    });
    modal.classList.remove('hidden');
};

function s32All(on) {
    document.querySelectorAll('#state-grid input[type="checkbox"]').forEach(function (cb) {
        cb.checked = on;
        cb.parentNode.classList.toggle('on', on);
    });
}

// ================= STAGE 33: AUTOSAVE, FUND TOGGLE, SAAF PANELS, RALLY/ITC/DEBATE/NARRATIVE/MANIFESTO BALANCE, CASE + CONTROVERSY =================

const S33 = { warned: false, timer: null, cur: '' };
const S33_SPEND = { 'Media & Rallies': 1, 'IT Cell & Social': 1, 'Manifesto': 1, 'Poaching': 1, 'VIP Seats': 1, 'Narrative Engine': 1, 'Courts Case': 1,
    'EC Scrutiny & MCC': 1, 'Local Guru': 1, 'Karyakarta': 1, 'Spy': 1, 'Media Debates': 1, 'Transfer DM/SP': 1, 'Controversy': 1 };

function ensureS33() {
    ensureS25();
    const g = gameState;
    if (!g.narr) g.narr = { you: {}, opp: {} };
    if (!g.cases) g.cases = [];
    if (!g.contro) g.contro = { you: null, opp: null };
    if (!g.controLog) g.controLog = [];
    if (!g.itR1) g.itR1 = { you: {}, opp: {} };
}

const _freshActionStateS33 = freshActionState;
freshActionState = function () {
    _freshActionStateS33();
    gameState.narr = { you: {}, opp: {} };
    gameState.cases = [];
    gameState.contro = { you: null, opp: null };
    gameState.controLog = [];
    gameState.itR1 = { you: {}, opp: {} };
};

// naye phase mein: narrative/ITC ginti zero, manifesto ka vote-jhukaav har naye phase mein bhi
const _nextPhaseResetS33 = nextPhaseActionReset;
nextPhaseActionReset = function () {
    _nextPhaseResetS33();
    ensureS33();
    gameState.narr = { you: {}, opp: {} };
    gameState.itR1 = { you: {}, opp: {} };
    ['you', 'opp'].forEach(function (side) {
        const n = gameState.manifesto && gameState.manifesto[side] ? gameState.manifesto[side].length : 0;
        if (n) activeStates().forEach(function (x) { addBoost(side, 'state', x.st, 0.025 * n); });
    });
};

function s33Style() {
    if (document.getElementById('s33-style')) return;
    const st = document.createElement('style');
    st.id = 's33-style';
    st.textContent = `
@keyframes s33Ring{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.8)}50%{box-shadow:0 0 0 9px rgba(239,68,68,0)}}
@keyframes s33Drop{from{opacity:0;transform:translate(-50%,-30px)}to{opacity:1;transform:translate(-50%,0)}}
.wr-side-icon.s33-alert{animation:s33Ring 1s infinite !important;border-color:#ef4444 !important;}
.s33-toast{position:fixed;top:92px;left:50%;transform:translateX(-50%);z-index:9800;max-width:min(560px,92vw);padding:14px 22px;border-radius:14px;font-weight:bold;color:#fff;
  box-shadow:0 14px 34px rgba(0,0,0,.55);animation:s33Drop .4s both;background:linear-gradient(90deg,#7c3aed,#0ea5e9);}
.s33-toast.bad{background:linear-gradient(90deg,#b91c1c,#f97316);}
.s33-toast.good{background:linear-gradient(90deg,#15803d,#84cc16);}
.s33-case{background:rgba(239,68,68,.1);border:1px solid #b91c1c;border-radius:14px;padding:12px 14px;margin:8px 0;}
.s33-case b{color:#fff;display:block;}
.s33-case small{color:#fca5a5;}
.s33-fund{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;}
.s33-fund label{flex:1;min-width:150px;display:flex;align-items:center;gap:8px;background:#0b1220;border:1px solid #334155;border-radius:12px;padding:8px 12px;color:#cbd5e1;font-size:.82rem;cursor:pointer;transition:.2s;}
.s33-fund label.on{border-color:#4ade80;background:rgba(74,222,128,.12);color:#fff;}
.s33-fund label.blk.on{border-color:#f59e0b;background:rgba(245,158,11,.12);}
.s33-fund b{margin-left:auto;color:#fff;}
.s33-note{font-size:.74rem;color:#fbbf24;margin:-4px 0 8px;}
`;
    document.head.appendChild(st);
}
s33Style();

function s33Toast(text, kind) {
    s33Style();
    document.querySelectorAll('.s33-toast').forEach(function (e) { e.remove(); });
    const d = document.createElement('div');
    d.className = 's33-toast ' + (kind || '');
    d.textContent = text;
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.remove(); }, 6500);
}

// ---------- 1) Autosave: har action ke baad + continue button ----------
function s33Autosave() {
    clearTimeout(S33.timer);
    S33.timer = setTimeout(function () {
        if (typeof gameState === 'undefined' || !gameState || !gameState.seats || !resultModel) return;
        const w = document.getElementById('warroom-screen');
        if (!w || w.classList.contains('hidden')) return;
        if (!saveGame(true) && !S33.warned) {
            S33.warned = true;
            s33Toast('Auto-save nahi ho pa raha (browser ne roka). Settings se "Abhi save karo" try karo.', 'bad');
        }
    }, 600);
}
const _updateStatusPanelS33 = updateStatusPanel;
updateStatusPanel = function () {
    _updateStatusPanelS33.apply(this, arguments);
    s33Autosave();
    s33Badge();
};
document.addEventListener('visibilitychange', function () { if (document.hidden) s33Autosave(); });
window.addEventListener('beforeunload', function () {
    try {
        if (gameState && gameState.seats && resultModel && !document.getElementById('warroom-screen').classList.contains('hidden')) saveGame(true);
    } catch (e) {}
});

const _loadGameS33 = loadGame;
loadGame = function () {
    const ok = _loadGameS33.apply(this, arguments);
    if (ok) {
        S29.last = {};
        S31.sig = '';
        ensureS33();
        s22WarBadges();
        renderLeadBoxes();
        renderHeadlineBox();
        s33Badge();
    }
    return ok;
};

function s33Continue() {
    document.querySelectorAll('#become-pm-screen .continue-row').forEach(function (e) { e.remove(); });
    if (!hasSave()) return;
    const box = document.querySelector('#become-pm-screen .pm-container');
    if (!box) return;
    let label = 'Pichhla game jaari rakho';
    try {
        const d = JSON.parse(localStorage.getItem(SAVE_KEY));
        label += ' (Phase ' + d.gs.phase + ', Round ' + d.gs.round + ') - ' + d.you + ' vs ' + d.opp;
    } catch (e) {}
    const row = document.createElement('div');
    row.className = 'continue-row';
    row.innerHTML = '<button id="continue-btn" class="next-btn" style="width:100%">' + esc(label) + '</button>';
    box.insertBefore(row, box.firstChild);
    document.getElementById('continue-btn').onclick = function () { if (!loadGame()) alert('Save khul nahi paya.'); };
}
const _openElectionS33 = openElection;
openElection = function (t) { _openElectionS33(t); s33Continue(); };
const _goBackToPMS33 = goBackToPMPage;
goBackToPMPage = function () { _goBackToPMS33(); s33Continue(); };
s33Continue();

// ---------- 2) Kharch ka toggle: sirf kharch wale panels mein, white/black ke balance ke saath ----------
s26Fund = function () { return ''; };
s23Strip = function () {
    if (!S33_SPEND[S33.cur]) return '';
    const g = gameState, blk = g.fundMode === 'black';
    return '<div class="s33-fund"><label class="' + (!blk ? 'on' : '') + '"><input type="radio" name="apfund" value="white" onchange="setFundMode(this.value)"' + (!blk ? ' checked' : '') + '> White Fund <b>' + g.budget + ' Cr</b></label>' +
        '<label class="blk ' + (blk ? 'on' : '') + '"><input type="radio" name="apfund" value="black" onchange="setFundMode(this.value)"' + (blk ? ' checked' : '') + '> Black Fund (1.5x asar, risk) <b>' + g.blackFund + ' Cr</b></label></div>' +
        (blk && g.blackFund <= 0 ? '<div class="s33-note">Black Fund khaali hai. Pehle Black Fund icon se paisa jutao.</div>' : '');
};

// ---------- 3) Rally sasti, ITC ki limit hatao (sirf pehle round mein 2) ----------
const _actStateRallyS33 = actStateRally;
actStateRally = function (st) {
    const a = _actStateRallyS33(st);
    a.cost = Math.max(1, Math.round(a.cost * 0.35));
    a.stamina = Math.max(2, Math.round(a.stamina * 0.45));
    return a;
};

const _actSocialS33 = actSocial;
actSocial = function (st, mode) {
    const a = _actSocialS33(st, mode);
    const ap = a.apply;
    a.check = function (side) {
        ensureS33();
        if (gameState.round > 1) return null;
        const used = gameState.itR1[side][st || '_n'] || 0;
        return used >= 2 ? (st ? 'Pehle round mein ek state mein sirf 2 IT campaign. Agle round se koi limit nahi.' : 'Pehle round mein national campaign sirf 2. Agle round se koi limit nahi.') : null;
    };
    a.apply = function (m, side) {
        const out = ap(m, side);
        ensureS33();
        if (gameState.round === 1) gameState.itR1[side][st || '_n'] = (gameState.itR1[side][st || '_n'] || 0) + 1;
        return out;
    };
    return a;
};

// ---------- 4) Jeet ka mauka (90% / 90-100%) + narrative ka fayda ----------
s25Hint = function (i) {
    const pr = Math.round(90 + 10 * Math.min(1, Math.max(0, (i.it - S25_IT_NEED) / 5)));
    if (i.level === 'full') return ['ok', 'Poore state ki saari seats par jeet ka mauka ' + pr + '%.'];
    if (i.level === 'half') return ['mid', 'Aadhi seats par jeet ka mauka 90%. Poore state ke liye: ' + i.cap + ' rally poori karo aur opponent ki rally ' + S25_OPP_LIMIT + ' se kam rakho. IT cell campaign 10 tak jaayein to mauka 100% ke paas.'];
    const need = [];
    if (i.it < S25_IT_NEED) need.push('IT cell ke ' + (S25_IT_NEED - i.it) + ' aur state campaign');
    if (i.r < Math.ceil(i.cap / 2)) need.push(Math.ceil(i.cap / 2) - i.r + ' aur rally');
    return ['bad', 'Abhi jeet ka bonus nahi. Chahiye: ' + need.join(' aur ') + '.'];
};

computePhaseResults = function (phase) {
    ensureS33();
    const byState = {}, claims = {}, saved = [];
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase !== phase) return;
        (byState[s.st] = byState[s.st] || []).push(k);
    });
    Object.keys(byState).forEach(function (st) {
        ['you', 'opp'].forEach(function (side) {
            const i = s25Info(side, st);
            if (i.level === 'none') return;
            const p = i.level === 'full' ? 0.9 + 0.1 * Math.min(1, Math.max(0, (i.it - S25_IT_NEED) / 5)) : 0.9;
            const keys = i.level === 'full' ? byState[st] : shuffled(byState[st]).slice(0, Math.ceil(byState[st].length / 2));
            keys.forEach(function (k) { (claims[k] = claims[k] || []).push({ side: side, p: p }); });
            if (side === 'you') pushNews(st + ': ' + (i.level === 'full' ? 'saari' : 'aadhi') + ' seats par aapko ' + Math.round(p * 100) + '% jeet ka mauka.');
        });
    });
    const bump = function (s, f, mult) { saved.push([s, f, s[f]]); s[f] = s[f] * mult; };
    Object.keys(claims).forEach(function (k) {
        if (claims[k].length !== 1) return;
        const c = claims[k][0];
        if (Math.random() < c.p) bump(resultModel.seats[k], c.side === 'you' ? 'wYou' : 'wOpp', 1000);
    });
    // narrative: jis party ka us mudde par zyada narrative, us mudde ki seats par usko fayda
    Object.keys(resultModel.seats).forEach(function (k) {
        const s = resultModel.seats[k];
        if (s.phase !== phase) return;
        const diff = (gameState.narr.you[s.issue] || 0) - (gameState.narr.opp[s.issue] || 0);
        if (!diff) return;
        bump(s, diff > 0 ? 'wYou' : 'wOpp', 1 + Math.min(0.6, 0.12 * Math.abs(diff)));
    });
    try {
        return _computePhaseResultsS25(phase);
    } finally {
        for (let i = saved.length - 1; i >= 0; i--) saved[i][0][saved[i][1]] = saved[i][2];
    }
};

const _actNarrativeThemeS33 = actNarrativeTheme;
actNarrativeTheme = function (theme) {
    const a = _actNarrativeThemeS33(theme);
    const ap = a.apply;
    a.apply = function (m, side) {
        const out = ap(m, side);
        ensureS33();
        gameState.narr[side][theme] = (gameState.narr[side][theme] || 0) + 1;
        return out;
    };
    return a;
};
const _actNarrativeS33 = actNarrative;
actNarrative = function () {
    const a = _actNarrativeS33.apply(null, arguments);
    const ap = a.apply;
    a.apply = function (m, side) {
        const out = ap(m, side);
        ensureS33();
        ISSUES.forEach(function (i) { gameState.narr[side][i] = (gameState.narr[side][i] || 0) + 0.4; });
        return out;
    };
    return a;
};

// ---------- 5) Debate: phase mein sirf ek, par bada fayda / bada nuksan ----------
const _actDebateXS33 = actDebateX;
actDebateX = function (theme, spId) {
    const a = _actDebateXS33(theme, spId);
    const ap = a.apply;
    a.check = function (side) {
        ensureS15();
        return gameState.debates[side] >= 1 ? 'Is phase mein ek hi debate ho sakti hai.' : null;
    };
    a.apply = function (m, side) {
        const out = ap(m, side);
        if (out.good !== false) {
            addBoost(side, 'national', 0.05);
            activeStates().forEach(function (x) { addBoost(side, 'state', x.st, 0.03); });
            shiftHawa(side, 5, 'Debate jeet');
            out.text += ' Badi jeet: hawa aur vote dono badhe.';
        } else {
            addBoost(side, 'national', -0.05);
            shiftHawa(side, -5, 'Debate haar');
            out.text += ' Haar ka nuksan: hawa aur vote ghate.';
        }
        return out;
    };
    return a;
};
const _actDebateS33 = actDebate;
actDebate = function () {
    const a = _actDebateS33.apply(null, arguments);
    a.check = function (side) {
        ensureS15();
        return gameState.debates[side] >= 1 ? 'Is phase mein ek hi debate ho sakti hai.' : null;
    };
    return a;
};

// ---------- 6) Manifesto: bada fayda (is phase ke voter jhukte hain) ----------
const _actPromiseS33 = actPromise;
actPromise = function (id) {
    const a = _actPromiseS33(id);
    const ap = a.apply, p = promiseOf(id);
    a.apply = function (m, side) {
        const out = ap(m, side);
        if (p.issue) addBoost(side, 'issue', p.issue, p.amt * 1.5);
        if (p.nat) addBoost(side, 'national', p.nat * 1.5);
        activeStates().forEach(function (x) { addBoost(side, 'state', x.st, 0.04); });
        out.text += ' Is phase ke voter bade paimane par jhuke.';
        return out;
    };
    return a;
};

// ---------- 7) Case: opponent case kare to message aata hai, aap wakeel rakho, result agle round ----------
function s33FileCase(kind, topic, strength) {
    ensureS33();
    const c = { id: 'c' + Date.now() + Math.floor(Math.random() * 1000), kind: kind, topic: topic, strength: strength, phase: gameState.phase, round: gameState.round, lawyer: null, done: false };
    gameState.cases.push(c);
    const txt = kind === 'court' ? 'Opponent ne aap par court mein case kiya (' + topic + ')! Jaldi wakeel rakho.' : 'Opponent ne Election Commission mein aapki shikayat ki! Jaldi wakeel rakho.';
    setHeadline(txt);
    s33Toast(txt, 'bad');
    s33Badge();
    return { text: txt, good: true, hawa: 0 };
}

const _actCourtS33 = actCourt;
actCourt = function (topic, lawyerId) {
    const a = _actCourtS33(topic, lawyerId);
    const ap = a.apply;
    const L = lawyerOf(lawyerId || 'anubhavi');
    a.apply = function (m, side) {
        if (side === 'opp') return s33FileCase('court', topic || CASE_TOPICS[0], L ? L.chance : 0.5);
        const out = ap(m, side);
        if (out.good === false) {
            addBoost(side, 'national', -0.03);
            shiftHawa(side, -3, 'Case haare');
            out.text += ' Case haarne se hawa aur vote ghate.';
        }
        return out;
    };
    return a;
};
const _actMccS33 = actMcc;
actMcc = function (st) {
    const a = _actMccS33(st);
    const ap = a.apply;
    a.apply = function (m, side) {
        if (side === 'opp') return s33FileCase('ec', 'EC shikayat', 0.5);
        return ap(m, side);
    };
    return a;
};

function s33Case(id) {
    let r = null;
    gameState.cases.forEach(function (c) { if (c.id === id) r = c; });
    return r;
}
function actHire(cid, lid) {
    const L = lawyerOf(lid);
    return {
        type: 'Defence Wakeel', st: null, cost: L.fee, stamina: 1,
        check: function () {
            const c = s33Case(cid);
            if (!c || c.done) return 'Yeh case ab nahi hai.';
            return c.lawyer ? 'Is case ke liye wakeel pehle se hai.' : null;
        },
        apply: function () {
            s33Case(cid).lawyer = lid;
            return { text: L.name + ' ne aapka case sambhal liya. Result agle round par aayega.', good: true, hawa: 0 };
        }
    };
}
function uiHire(cid, lid) { runUi(actHire(cid, lid)); s33Badge(); }

function s33ResolveCases() {
    ensureS33();
    gameState.cases.forEach(function (c) {
        if (c.done) return;
        c.done = true;
        const L = lawyerOf(c.lawyer);
        const p = L ? Math.max(0.1, Math.min(0.95, L.chance * (1.15 - 0.5 * c.strength))) : 0.1;
        const nm = c.kind === 'court' ? 'court case' : 'EC shikayat';
        if (Math.random() < p) {
            addBoost('opp', 'national', -0.03);
            shiftHawa('opp', -3, 'Case haara');
            shiftHawa('you', 3, 'Case jeeta');
            const t = 'Aapne ' + nm + ' jeet liya! Opponent ko nuksan, aapko fayda.';
            pushNews(t);
            s33Toast(t, 'good');
        } else {
            let extra = '';
            if (c.kind === 'court') {
                reduceBoost('you', 0.45);
                addBoost('you', 'national', -0.04);
                if (c.topic === 'Funding ki hera-pheri') { resSet('you', 'budget', Math.max(0, resGet('you', 'budget') - 12)); extra = ' 12 Cr ka jurmana.'; }
                if (c.topic === 'Bhadkau bhashan') { resSet('you', 'stamina', Math.max(0, resGet('you', 'stamina') - 15)); extra = ' Stamina ghati.'; }
            } else {
                const ks = Object.keys(resultModel.seats).filter(function (k) { return resultModel.seats[k].phase === gameState.phase && !seatResults[k]; });
                const n = Math.min(ks.length, 1 + Math.floor(Math.random() * 2));
                shuffled(ks).slice(0, n).forEach(function (k) { gameState.disq.you[k] = true; });
                addBoost('you', 'national', -0.02);
                extra = ' ' + n + ' candidate ka namankan radd.';
            }
            shiftHawa('you', -4, 'Case haara');
            const t = 'Aap ' + nm + ' haar gaye!' + extra + (L ? '' : ' (wakeel nahi tha)');
            pushNews(t);
            s33Toast(t, 'bad');
        }
    });
    gameState.cases = gameState.cases.filter(function (c) { return !c.done; });
}

function s33Badge() {
    if (typeof gameState === 'undefined' || !gameState) return;
    const open = (gameState.cases || []).filter(function (c) { return !c.done && !c.lawyer; });
    const court = open.some(function (c) { return c.kind === 'court'; }), ec = open.some(function (c) { return c.kind === 'ec'; });
    document.querySelectorAll('.wr-side-icon').forEach(function (b) {
        const oc = b.getAttribute('onclick') || '';
        if (/Courts Case/.test(oc)) b.classList.toggle('s33-alert', court);
        if (/EC Scrutiny/.test(oc)) b.classList.toggle('s33-alert', ec);
    });
}

function s33CasesHtml(kind) {
    ensureS33();
    const list = gameState.cases.filter(function (c) { return !c.done && c.kind === kind; });
    if (!list.length) return '<div class="s23-sec"><h4>Aap par case</h4><div class="s23-sub">Abhi aap par koi case nahi hai. Opponent case karega to yahan message aayega aur icon laal chamkega.</div></div>';
    return '<div class="s23-sec"><h4>Aap par case (' + list.length + ')</h4>' + list.map(function (c) {
        const hired = lawyerOf(c.lawyer);
        return '<div class="s33-case"><b>' + (kind === 'court' ? 'Court: ' + esc(c.topic) : 'Election Commission shikayat') + '</b><small>Round ' + c.round + ' mein darj hua</small>' +
            (hired ? '<div class="s23-msg ok">' + hired.name + ' laga hai. Result agle round par aayega.</div>' :
            '<div class="s23-msg bad">Bina wakeel bachne ka mauka sirf 10%. Wakeel rakho:</div><div class="s23-grid2">' + LAWYERS.map(function (l) {
                const pc = Math.round(Math.min(0.95, l.chance * (1.15 - 0.5 * c.strength)) * 100);
                return '<div class="s23-card"><h4>' + l.name + '</h4><p>Bachne ka mauka <b>' + pc + '%</b></p>' + s23Bar(pc, pc >= 60 ? '#22c55e' : '#f59e0b') + '<br><span class="s23-tag">' + l.fee + ' Cr</span><br><br>' +
                    '<button class="s23-btn g" onclick="uiHire(\'' + c.id + '\',\'' + l.id + '\')">Rakho</button></div>';
            }).join('') + '</div>') + '</div>';
    }).join('') + '</div>';
}

function renderCourtPanel33() {
    ensureS15();
    uiSel.topic = uiSel.topic || CASE_TOPICS[0];
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Aapke case is phase mein</div><div class="s23-num">' + gameState.counters.you.court + ' <small>/ ' + LIMITS.court + '</small></div>' +
        s23Bar(gameState.counters.you.court / LIMITS.court * 100, '#f59e0b') + '<div class="s23-sub">Jeete to opponent ka nuksan, haare to aapka.</div></div></div>';
    h += s33CasesHtml('court');
    h += '<div class="s23-sec"><h4>Opponent par case</h4>Mudda: <select class="ap-sel" onchange="setUiTopic(this.value)">' + optionsHtml(CASE_TOPICS, uiSel.topic) + '</select><div class="s23-grid2" style="margin-top:10px">';
    LAWYERS.forEach(function (l) {
        const pc = Math.round(l.chance * 100);
        h += '<div class="s23-card"><h4>' + l.name + '</h4><p>Jeetne ka chance <b>' + pc + '%</b></p>' + s23Bar(pc, pc >= 60 ? '#22c55e' : '#f59e0b') + '<br>' +
            '<span class="s23-tag">' + l.fee + ' Cr</span><span class="s23-tag">Stamina 5%</span><br><br><button class="s23-btn o" onclick="uiCourtGo(\'' + l.id + '\')">Case karo</button></div>';
    });
    return h + '</div></div></div>';
}

// ---------- 8) ITC panel ----------
function renderSocialPanel33() {
    ensureS33();
    const states = activeStates();
    const sel = states.length ? stateSelectHtml() : '';
    const r1 = gameState.round === 1;
    const modes = [['positive', 'Seedha prachar', 'Surakshit', 'g'], ['attack', 'Attack', 'Rival par hamla, 20% ulta', 'o'], ['viral', 'Viral dhamaka', 'Jokhim, bada fayda', '']];
    const card = function (scope, st, title, icon) {
        let c = '<div class="s23-card"><div class="ic">' + icon + '</div><h4>' + title + '</h4>';
        modes.forEach(function (m) {
            c += '<div style="margin:6px 0"><button class="s23-btn ' + m[3] + '" onclick="uiSocialGo(\'' + scope + '\',\'' + m[0] + '\')">' + m[1] + ' - ' + actSocial(st, m[0]).cost + ' Cr</button><div class="s23-sub">' + m[2] + '</div></div>';
        });
        return c + '</div>';
    };
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">IT cell ka niyam</div><div class="s23-sub" style="color:#e2e8f0;font-size:.85rem">' +
        (r1 ? '<b>Pehla round:</b> ek state mein sirf 2 campaign (national bhi 2).<br>Agle round se koi limit nahi.' : '<b>Ab koi limit nahi.</b> Jitne chaho utne campaign chalao.') + '</div></div>';
    if (states.length) {
        const i = s25Info('you', uiSel.state);
        h += '<div class="s23-box dark"><div class="s23-lbl">' + esc(uiSel.state) + ' mein campaign</div><div class="s23-num" style="color:#fbbf24">' + i.it + ' <small>/ ' + S25_IT_NEED + ' (jeet bonus ke liye)</small></div>' +
            s23Bar(i.it / S25_IT_NEED * 100, '#f59e0b') + '</div>';
    }
    h += '</div><div class="s23-grid2">' + card('national', null, 'National Campaign', '&#127760;');
    if (states.length) h += card('state', uiSel.state, 'State Campaign', '&#128241;');
    h += '</div>';
    if (states.length) h += '<div class="s23-sec"><h4>State chuno (state campaign ke liye)</h4>' + sel + '</div>';
    return h + '</div>';
}

// ---------- 9) Debate panel (phase mein 1) ----------
function renderDebatePanel33() {
    ensureS15();
    uiSel.issue = uiSel.issue || ISSUES[0];
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Is phase ki debate</div><div class="s23-num">' + gameState.debates.you + ' <small>/ 1</small></div>' +
        s23Bar(gameState.debates.you * 100, '#a78bfa') + '<div class="s23-sub">Jeete to hawa aur vote bahut badhenge, haare to bahut ghatenge. Na jao to bhi nuksan.</div></div></div>';
    h += '<div class="s23-sec"><h4>Mudda chuno</h4>' + ISSUES.map(function (i) {
        return '<button class="s23-btn' + (i === uiSel.issue ? ' g' : '') + '" style="margin:3px" onclick="setUiIssue(\'' + i + '\')">' + esc(i) + ' (' + Math.round(issueShare(i) * 100) + '% seats)</button>';
    }).join('') + '</div><div class="s23-sec"><h4>Kise bhejna hai</h4><div class="s23-grid2">';
    SPEAKERS.forEach(function (sp) {
        const pc = Math.round(debateChance('you', uiSel.issue, sp) * 100);
        h += '<div class="s23-card"><h4>' + sp.name + '</h4><p>Jeetne ka chance <b>' + pc + '%</b></p>' + s23Bar(pc, pc >= 55 ? '#22c55e' : '#f59e0b') + '<br>' +
            '<span class="s23-tag">' + sp.cost + ' Cr</span><span class="s23-tag">Stamina ' + sp.stamina + '%</span><br><br><button class="s23-btn" onclick="uiDebateGo(\'' + sp.id + '\')">Bhejo</button></div>';
    });
    return h + '</div></div></div>';
}

// ---------- 10) CONTROVERSY ----------
const CONTRO = [
    { id: 'protest', name: 'Virodh Pradarshan (Protest)', icon: '&#9994;', cost: 8, stamina: 6, p: 0.65, drop: 0.05, back: 0.02, hawa: 3, desc: 'Rival ke khilaf sadkon par virodh.' },
    { id: 'corruption', name: 'Bhrashtachar ka aarop', icon: '&#128176;', cost: 14, stamina: 8, p: 0.5, drop: 0.08, back: 0.04, hawa: 5, desc: 'Rival par ghotale ka bada aarop.' },
    { id: 'defamation', name: 'Manhani ka daava', icon: '&#9878;', cost: 10, stamina: 5, p: 0.55, drop: 0.06, back: 0.03, hawa: 4, desc: 'Jhoothe bayaan par manhani ka daava.' },
    { id: 'scandal', name: 'Neta ka vivaad (Scandal)', icon: '&#128165;', cost: 18, stamina: 9, p: 0.4, drop: 0.12, back: 0.06, hawa: 7, desc: 'Bada jokhim, bada fayda.' },
    { id: 'promises', name: 'Jhoothe vaadon ka pardafash', icon: '&#128220;', cost: 6, stamina: 4, p: 0.7, drop: 0.04, back: 0.015, hawa: 2, desc: 'Purane vaade yaad dilao. Surakshit.' },
    { id: 'economy', name: 'Arthvyavastha par hamla', icon: '&#128201;', cost: 12, stamina: 6, p: 0.6, drop: 0.06, back: 0.02, hawa: 4, desc: 'Mehngai aur berozgari par gherao.' }
];
function controOf(id) {
    let r = CONTRO[0];
    CONTRO.forEach(function (c) { if (c.id === id) r = c; });
    return r;
}
function actContro(id) {
    const c = controOf(id);
    return {
        type: 'Controversy', st: null, cost: c.cost, stamina: c.stamina,
        check: function (side) {
            ensureS33();
            return gameState.contro[side] ? 'Is round mein ek controversy pehle hi chun chuke ho. Result round badhne par aayega.' : null;
        },
        apply: function (m, side) {
            gameState.contro[side] = { id: id, round: gameState.round, mult: m };
            return { text: sideName(side) + ' ne "' + c.name + '" ka daav chala. Result round badhne par pata chalega.', good: true, hawa: 0 };
        }
    };
}
function uiContro(id) { runUi(actContro(id)); }

function s33ResolveContro(side) {
    ensureS33();
    const p = gameState.contro[side];
    if (!p) return;
    gameState.contro[side] = null;
    const c = controOf(p.id), rival = otherSide(side);
    const ok = Math.random() < Math.min(0.9, c.p * (p.mult > 1 ? 1.15 : 1));
    if (ok) {
        addBoost(rival, 'national', -c.drop * p.mult);
        activeStates().forEach(function (x) { addBoost(rival, 'state', x.st, -c.drop * 0.5 * p.mult); });
        shiftHawa(side, c.hawa, 'Controversy');
        shiftHawa(rival, -Math.round(c.hawa / 2), 'Controversy');
    } else {
        addBoost(side, 'national', -c.back);
        shiftHawa(side, -c.hawa, 'Controversy ulti');
    }
    gameState.controLog.unshift({ side: side, name: c.name, ok: ok, drop: Math.round(c.drop * 100), back: Math.round(c.back * 100) });
    gameState.controLog = gameState.controLog.slice(0, 6);
    let t;
    if (side === 'you') t = ok ? 'Aapka "' + c.name + '" daav chal gaya! Rival ke ~' + Math.round(c.drop * 100) + '% vote khiske.' : 'Aapka "' + c.name + '" daav ulta pada! Aapke ~' + Math.round(c.back * 100) + '% vote gaye.';
    else t = ok ? 'Opponent ka "' + c.name + '" daav chal gaya! Aapke ~' + Math.round(c.drop * 100) + '% vote khiske.' : 'Opponent ka "' + c.name + '" daav unpar hi ulta pada!';
    pushNews(t);
    s33Toast(t, (side === 'you') === ok ? 'good' : 'bad');
}

function s33AiContro() {
    if (!AI_CONFIG.enabled || gameState.phaseEnded) return;
    ensureS33();
    if (gameState.contro.opp) return;
    const pr = { easy: 0.15, normal: 0.35, hard: 0.6 }[gameState.aiLevel || 'normal'] || 0.35;
    if (Math.random() > pr) return;
    const opts = CONTRO.filter(function (c) { return resGet('opp', 'budget') >= c.cost + 25; });
    if (!opts.length) return;
    doAction('opp', actContro(opts[Math.floor(Math.random() * opts.length)].id), 'white');
}

const _finishRoundS33 = finishRound;
finishRound = function () {
    ensureS33();
    s33ResolveCases();
    s33ResolveContro('you');
    s33ResolveContro('opp');
    _finishRoundS33.apply(this, arguments);
    s33AiContro();
    s33Badge();
};

function renderControPanel33() {
    ensureS33();
    const pend = gameState.contro.you;
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">Is round ka daav</div>' + (pend ? '<h3 style="margin:2px 0;color:#fbbf24">' + esc(controOf(pend.id).name) + '</h3><div class="s23-sub">Result round badhne par pata chalega.</div>' :
        '<h3 style="margin:2px 0;color:#94a3b8">Abhi koi nahi chuna</h3><div class="s23-sub">Ek round mein sirf ek controversy. Safal hui to rival ke vote khiskenge, ulti pad gayi to aapke.</div>') + '</div></div>';
    h += '<div class="s23-grid2">';
    CONTRO.forEach(function (c) {
        const pc = Math.round(c.p * 100);
        h += '<div class="s23-card"><div class="ic">' + c.icon + '</div><h4>' + c.name + '</h4><p>' + c.desc + '</p>' + s23Bar(pc, pc >= 60 ? '#22c55e' : (pc >= 50 ? '#f59e0b' : '#ef4444')) +
            '<div class="s23-sub">Safal hone ka mauka ' + pc + '%</div><span class="s23-tag" style="color:#86efac">Safal: rival -' + Math.round(c.drop * 100) + '% vote</span><span class="s23-tag" style="color:#fca5a5">Ulta: aap -' + Math.round(c.back * 100) + '%</span><br>' +
            '<span class="s23-tag">' + c.cost + ' Cr</span><span class="s23-tag">Stamina ' + c.stamina + '%</span><br><br><button class="s23-btn o"' + (pend ? ' disabled style="opacity:.5"' : '') + ' onclick="uiContro(\'' + c.id + '\')">Chalao</button></div>';
    });
    h += '</div>';
    if (gameState.controLog.length) {
        h += '<div class="s23-sec"><h4>Pichhle natije</h4>' + gameState.controLog.map(function (l) {
            return '<div class="s23-row"><span class="nm" style="width:22%">' + (l.side === 'you' ? 'Aap' : 'Opponent') + '</span><span class="bw s23-sub" style="margin:0">' + esc(l.name) + '</span><span class="vl" style="width:auto;color:' + (l.ok ? '#4ade80' : '#f87171') + '">' + (l.ok ? 'Safal' : 'Ulta') + '</span></div>';
        }).join('') + '</div>';
    }
    return h + '</div>';
}

// naya icon: Controversy
S23_ICONS.CON = ['#ef4444', '#7f1d1d', '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.3v.4"/>'];
S28_META['Controversy'] = ['CON', 'Controversy', 'Rival ko gheriye, par risk bhi'];
(function () {
    const st = document.getElementById('s33-style');
    if (st) st.textContent += '.wr-side-icon[data-ic="CON"]:hover svg{animation:s28Shake .5s 2;}';
})();
function s33Sidebar() {
    if (document.querySelector('.wr-side-icon[data-ic="CON"]')) return;
    const deb = document.querySelector('.wr-side-icon[onclick*="Media Debates"]');
    if (!deb) return;
    const b = document.createElement('button');
    b.className = 'wr-side-icon';
    b.setAttribute('data-ic', 'CON');
    b.setAttribute('onclick', "openGameModal('Controversy')");
    b.setAttribute('title', 'Controversy');
    b.textContent = 'CON';
    deb.parentNode.insertBefore(b, deb.nextSibling);
    s23Icons();
}
s33Sidebar();
setTimeout(s33Sidebar, 1200);
setTimeout(s33Sidebar, 3600);

// ---------- panels jodo ----------
const _renderPanelS33 = renderPanel;
renderPanel = function (name) {
    S33.cur = name;
    const banner = function (h) { return S28_META[name] ? s28Banner(S28_META[name]) + h : h; };
    if (name === 'Courts Case') return banner(renderCourtPanel33());
    if (name === 'IT Cell & Social') return banner(renderSocialPanel33());
    if (name === 'Media Debates') return banner(renderDebatePanel33());
    if (name === 'Controversy') return banner(renderControPanel33());
    let h = _renderPanelS33(name);
    if (name === 'EC Scrutiny & MCC') h = h.replace('<div class="s23-hero">', s33CasesHtml('ec') + '<div class="s23-hero">');
    if (name === 'Media & Rallies') h = h.replace('Aadhi seats pakki', 'Aadhi seats par 90% mauka').replace('Saari seats pakki', 'Saari seats par 90-100% mauka').replace(/ pakki: saari/g, ' 90-100%: saari').replace(/ pakki: aadhi/g, ' 90%: aadhi');
    if (name === 'Narrative Engine') {
        ensureS33();
        h += '<div class="s23-wrap"><div class="s23-sec"><h4>Is phase ka narrative (aap vs rival)</h4>' + ISSUES.map(function (i) {
            return '<div class="s23-row"><span class="nm" style="width:30%">' + esc(i) + '</span><span class="bw s23-sub" style="margin:0">' + Math.round((gameState.narr.you[i] || 0) * 10) / 10 + ' vs ' + Math.round((gameState.narr.opp[i] || 0) * 10) / 10 + '</span></div>';
        }).join('') + '<div class="s23-sub">Jis mudde par aapka narrative rival se zyada hoga, us mudde ki seats par natije mein aapko extra fayda milega.</div></div></div>';
    }
    return h;
};

// ================= STAGE 34: SAVE FIX + STATUS, PARTY LEADERS (seat, news, phase-end page), LOWER HOUSE (sarkar + mantrimandal) =================

const S34 = { saved: 0, err: '' };

function s34Style() {
    if (document.getElementById('s34-style')) return;
    const st = document.createElement('style');
    st.id = 's34-style';
    st.textContent = `
@keyframes s34In{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes s34Dot{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}
#s34-save{display:block;font-size:.62rem;margin-top:2px;letter-spacing:.5px;}
#s34-save.ok{color:#4ade80;}#s34-save.bad{color:#f87171;}
#s34-dash-cont{position:absolute;left:50%;bottom:86px;transform:translateX(-50%);z-index:30;border:0;border-radius:30px;padding:12px 30px;font-weight:900;font-size:.95rem;letter-spacing:1px;color:#fff;cursor:pointer;
  background:linear-gradient(90deg,#16a34a,#84cc16);box-shadow:0 8px 24px rgba(34,197,94,.45);animation:s34In .5s both;}
#s34-dash-cont:hover{transform:translateX(-50%) translateY(-3px);}
.house-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;}
.house-btn small{font-size:.62rem;font-weight:normal;letter-spacing:.5px;color:#fde68a;max-width:92%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.s34-ph{position:relative;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;border:3px solid rgba(255,255,255,.65);flex:none;box-shadow:0 4px 14px rgba(0,0,0,.45);}
.s34-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.s34-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;min-height:0;}
.s34-col{display:flex;flex-direction:column;min-height:0;}
.s34-col h3{margin:0 0 10px;font-size:.85rem;letter-spacing:3px;color:#94a3b8;}
.s34-list{flex:1;min-height:0;overflow-y:auto;padding-right:6px;display:flex;flex-direction:column;gap:12px;}
.s34-card{display:flex;gap:14px;align-items:center;padding:14px 16px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.11),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.17);border-left:6px solid var(--c,#38bdf8);animation:s34In .5s both;}
.s34-card.won{box-shadow:inset 0 0 0 1px rgba(74,222,128,.5),0 0 22px rgba(74,222,128,.18);}
.s34-card.lost{box-shadow:inset 0 0 0 1px rgba(248,113,113,.5),0 0 22px rgba(248,113,113,.18);}
.s34-card .nm{font-size:1.15rem;font-weight:900;color:#fff;display:flex;align-items:center;gap:8px;}
.s34-card .sub{font-size:.8rem;color:#94a3b8;margin-top:2px;}
.s34-card .dt{font-size:.82rem;color:#e2e8f0;margin-top:6px;}
.s34-chip{display:inline-block;padding:3px 14px;border-radius:20px;font-weight:900;font-size:.78rem;letter-spacing:1.5px;color:#fff;background:#475569;margin-left:auto;flex:none;}
.s34-chip.JEET,.s34-chip.AAGE{background:#16a34a;}.s34-chip.HAAR,.s34-chip.PEECHE{background:#dc2626;}.s34-chip.VOTING{background:#0369a1;}
.s34-later{margin-top:10px;font-size:.8rem;color:#94a3b8;}
.s34-later span{display:inline-block;background:rgba(255,255,255,.08);border-radius:14px;padding:3px 12px;margin:3px 4px 0 0;}
/* ---- Lok Sabha / Sarkar page ---- */
.s34-top{height:6px;background:linear-gradient(90deg,#ff9933 33%,#fff 33% 66%,#138808 66%);flex:none;}
.s34-parl{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:22px;flex:1;min-height:0;}
.s34-hemi{background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.18);border-radius:24px;padding:14px;display:flex;flex-direction:column;}
.s34-hemi svg{width:100%;height:auto;max-height:46vh;}
.s34-hemi circle{animation:s34Dot .4s both;}
.s34-legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:8px;font-size:.78rem;color:#cbd5e1;}
.s34-legend i{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:5px;vertical-align:middle;}
.s34-legend b{color:#fff;}
.s34-cab{overflow-y:auto;min-height:0;padding-right:6px;}
.s34-pm{display:flex;gap:16px;align-items:center;padding:16px;border-radius:20px;background:linear-gradient(135deg,rgba(250,204,21,.22),rgba(255,255,255,.04));border:1px solid #facc15;margin-bottom:14px;animation:s34In .5s both;}
.s34-pm .t{font-size:.7rem;letter-spacing:3px;color:#fde68a;}
.s34-pm b{font-size:1.5rem;color:#fff;display:block;}
.s34-mins{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;}
.s34-min{padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);border-left:5px solid var(--c);animation:s34In .5s both;}
.s34-min.t1{border-color:#facc15;background:rgba(250,204,21,.1);}
.s34-min small{display:block;color:#94a3b8;font-size:.68rem;letter-spacing:1px;text-transform:uppercase;}
.s34-min b{color:#fff;font-size:.95rem;display:block;margin-top:2px;}
.s34-min span{font-size:.72rem;color:var(--c);}
`;
    document.head.appendChild(st);
}
s34Style();

// ---------- 1) SAVE: pakka save + status ----------
saveGame = function () {
    try {
        const gs = Object.assign({}, gameState);
        delete gs.curEvent;
        delete gs.leads;
        delete gs.leadSnap;
        delete gs.leadSnapKey;
        gs.eventPending = false;
        const data = {
            v: 1, gs: gs, rm: resultModel, sr: seatResults, you: selectedYouParty, opp: selectedOppParty,
            ya: youAlliancePartners, oa: oppAlliancePartners,
            mode: document.getElementById('choose-fight-select').value,
            fightAs: document.getElementById('fight-as-select').value, t: Date.now()
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        S34.saved = Date.now();
        S34.err = '';
        s34Status();
        return true;
    } catch (e) {
        S34.err = String((e && e.message) || e).slice(0, 80);
        s34Status();
        return false;
    }
};

function s34Status() {
    const t = document.querySelector('.s30-title');
    if (t) {
        let el = document.getElementById('s34-save');
        if (!el) { el = document.createElement('span'); el.id = 's34-save'; t.appendChild(el); }
        if (S34.err) { el.className = 'bad'; el.textContent = '\u25CF Save nahi hua: ' + S34.err; }
        else if (S34.saved) { el.className = 'ok'; el.textContent = '\u25CF Auto-save ho gaya ' + new Date(S34.saved).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
    }
    s34DashCont();
}

function s34DashCont() {
    const dash = document.getElementById('main-dashboard');
    if (!dash) return;
    let b = document.getElementById('s34-dash-cont');
    if (!hasSave()) { if (b) b.remove(); return; }
    let label = 'PICHHLA GAME JAARI RAKHO';
    try {
        const d = JSON.parse(localStorage.getItem(SAVE_KEY));
        label += '  (Phase ' + d.gs.phase + ', Round ' + d.gs.round + ')';
    } catch (e) {}
    if (!b) {
        b = document.createElement('button');
        b.id = 's34-dash-cont';
        b.onclick = function () { if (!loadGame()) alert('Save khul nahi paya.'); };
        dash.appendChild(b);
    }
    b.textContent = '\u25B6 ' + label;
}
s34DashCont();
setTimeout(s34DashCont, 1500);
setTimeout(s34DashCont, 7000);
const _goBackToDashboardS34 = goBackToDashboard;
goBackToDashboard = function () { _goBackToDashboardS34(); s34DashCont(); };

// ---------- 2) PARTY LEADERS ----------
const S34_LEADERS = [
    { n: 'Narendra Modi', p: 'BJP', st: 'Uttar Pradesh', pc: 'Varanasi' },
    { n: 'Amit Shah', p: 'BJP', st: 'Gujarat', pc: 'Gandhinagar' },
    { n: 'Rajnath Singh', p: 'BJP', st: 'Uttar Pradesh', pc: 'Lucknow' },
    { n: 'Nitin Gadkari', p: 'BJP', st: 'Maharashtra', pc: 'Nagpur' },
    { n: 'Shivraj Singh Chouhan', p: 'BJP', st: 'Madhya Pradesh', pc: 'Vidisha' },
    { n: 'Anurag Thakur', p: 'BJP', st: 'Himachal', pc: 'Hamirpur' },
    { n: 'Rahul Gandhi', p: 'Congress', st: 'Uttar Pradesh', pc: 'Rae Bareli/Raebareli' },
    { n: 'Priyanka Gandhi Vadra', p: 'Congress', st: 'Kerala', pc: 'Wayanad' },
    { n: 'Shashi Tharoor', p: 'Congress', st: 'Kerala', pc: 'Thiruvananthapuram/Trivandrum' },
    { n: 'K. C. Venugopal', p: 'Congress', st: 'Kerala', pc: 'Alappuzha' },
    { n: 'Gaurav Gogoi', p: 'Congress', st: 'Assam', pc: 'Jorhat' },
    { n: 'Akhilesh Yadav', p: 'Samajwadi Party', st: 'Uttar Pradesh', pc: 'Kannauj' },
    { n: 'Dimple Yadav', p: 'Samajwadi Party', st: 'Uttar Pradesh', pc: 'Mainpuri' },
    { n: 'Dharmendra Yadav', p: 'Samajwadi Party', st: 'Uttar Pradesh', pc: 'Azamgarh' },
    { n: 'Awadhesh Prasad', p: 'Samajwadi Party', st: 'Uttar Pradesh', pc: 'Faizabad/Ayodhya' },
    { n: 'Abhishek Banerjee', p: 'TMC', st: 'West Bengal', pc: 'Diamond Harbour' },
    { n: 'Mahua Moitra', p: 'TMC', st: 'West Bengal', pc: 'Krishnanagar' },
    { n: 'Shatrughan Sinha', p: 'TMC', st: 'West Bengal', pc: 'Asansol' },
    { n: 'Kirti Azad', p: 'TMC', st: 'West Bengal', pc: 'Bardhaman-Durgapur/Burdwan-Durgapur' },
    { n: 'Kanimozhi Karunanidhi', p: 'DMK', st: 'Tamil Nadu', pc: 'Thoothukkudi/Tuticorin' },
    { n: 'A. Raja', p: 'DMK', st: 'Tamil Nadu', pc: 'Nilgiris' },
    { n: 'Dayanidhi Maran', p: 'DMK', st: 'Tamil Nadu', pc: 'Chennai Central' },
    { n: 'T. R. Baalu', p: 'DMK', st: 'Tamil Nadu', pc: 'Sriperumbudur' },
    { n: 'Gurmeet Singh Meet Hayer', p: 'AAP', st: 'Punjab', pc: 'Sangrur' },
    { n: 'Malvinder Singh Kang', p: 'AAP', st: 'Punjab', pc: 'Anandpur Sahib' },
    { n: 'Lalan Singh', p: 'JD(U)', st: 'Bihar', pc: 'Munger' },
    { n: 'Giridhari Yadav', p: 'JD(U)', st: 'Bihar', pc: 'Banka' },
    { n: 'K. Ram Mohan Naidu', p: 'TDP', st: 'Andhra Pradesh', pc: 'Srikakulam' },
    { n: 'Chandra Sekhar Pemmasani', p: 'TDP', st: 'Andhra Pradesh', pc: 'Guntur' },
    { n: 'Misa Bharti', p: 'RJD', st: 'Bihar', pc: 'Pataliputra' },
    { n: 'Sudhakar Singh', p: 'RJD', st: 'Bihar', pc: 'Buxar' },
    { n: 'Abhay Kushwaha', p: 'RJD', st: 'Bihar', pc: 'Aurangabad' },
    { n: 'Supriya Sule', p: 'NCP (SP)', st: 'Maharashtra', pc: 'Baramati' },
    { n: 'Amol Kolhe', p: 'NCP (SP)', st: 'Maharashtra', pc: 'Shirur' },
    { n: 'Nilesh Lanke', p: 'NCP (SP)', st: 'Maharashtra', pc: 'Ahmednagar/Ahilyanagar' },
    { n: 'Arvind Sawant', p: 'Shiv Sena (UBT)', st: 'Maharashtra', pc: 'Mumbai South' },
    { n: 'Anil Desai', p: 'Shiv Sena (UBT)', st: 'Maharashtra', pc: 'Mumbai South Central' },
    { n: 'Sanjay Dina Patil', p: 'Shiv Sena (UBT)', st: 'Maharashtra', pc: 'Mumbai North East' },
    { n: 'Shrikant Shinde', p: 'Shiv Sena', st: 'Maharashtra', pc: 'Kalyan' },
    { n: 'Prataprao Jadhav', p: 'Shiv Sena', st: 'Maharashtra', pc: 'Buldhana' },
    { n: 'Sunil Tatkare', p: 'NCP (Ajit Pawar)', st: 'Maharashtra', pc: 'Raigad' },
    { n: 'Chirag Paswan', p: 'LJP (RV)', st: 'Bihar', pc: 'Hajipur' },
    { n: 'H. D. Kumaraswamy', p: 'JD(S)', st: 'Karnataka', pc: 'Mandya' },
    { n: 'Jitan Ram Manjhi', p: 'HAM', st: 'Bihar', pc: 'Gaya' },
    { n: 'Anupriya Patel', p: 'Apna Dal (S)', st: 'Uttar Pradesh', pc: 'Mirzapur' },
    { n: 'Chandan Chauhan', p: 'RLD', st: 'Uttar Pradesh', pc: 'Bijnor' },
    { n: 'Vallabhaneni Balashowry', p: 'Jana Sena', st: 'Andhra Pradesh', pc: 'Machilipatnam' },
    { n: 'Vijay Hansdak', p: 'JMM', st: 'Jharkhand', pc: 'Rajmahal' },
    { n: 'Mian Altaf Ahmad', p: 'National Conference', st: 'Jammu', pc: 'Anantnag-Rajouri/Anantnag' },
    { n: 'Omar Abdullah', p: 'National Conference', st: 'Jammu', pc: 'Baramulla' },
    { n: 'E. T. Mohammed Basheer', p: 'IUML', st: 'Kerala', pc: 'Ponnani' },
    { n: 'K. Radhakrishnan', p: 'CPI(M)', st: 'Kerala', pc: 'Alathur' },
    { n: 'N. K. Premachandran', p: 'RSP', st: 'Kerala', pc: 'Kollam' },
    { n: 'Thol. Thirumavalavan', p: 'VCK', st: 'Tamil Nadu', pc: 'Chidambaram' },
    { n: 'Raja Ram Singh Kushwaha', p: 'CPI(ML)L', st: 'Bihar', pc: 'Karakat' },
    { n: 'Hanuman Beniwal', p: 'RLP', st: 'Rajasthan', pc: 'Nagaur' },
    { n: 'Rajkumar Roat', p: 'Bharat Adivasi Party', st: 'Rajasthan', pc: 'Banswara' },
    { n: 'Asaduddin Owaisi', p: 'AIMIM', st: 'Telangana', pc: 'Hyderabad' },
    { n: 'Harsimrat Kaur Badal', p: 'SAD', st: 'Punjab', pc: 'Bathinda' }
];

function s34Nz(s) { return String(s || '').toLowerCase().replace(/[^a-z]/g, ''); }

function s34Find(keys, L) {
    const alts = L.pc.split('/').map(s34Nz);
    let hits = keys.filter(function (k) {
        const pc = s34Nz(k.split('|')[1]);
        return alts.indexOf(pc) !== -1;
    });
    if (hits.length > 1) {
        const sn = s34Nz(L.st);
        const f = hits.filter(function (k) { return s34Nz(k.split('|')[0]).indexOf(sn) !== -1 || sn.indexOf(s34Nz(k.split('|')[0])) !== -1; });
        if (f.length) hits = f;
    }
    return hits[0] || null;
}

function s34Place() {
    if (!resultModel || !resultModel.seats || resultModel.leaders) return;
    const keys = Object.keys(resultModel.seats), list = [];
    S34_LEADERS.forEach(function (L) {
        const side = resultModel.sideOf[L.p];
        if (side !== 'you' && side !== 'opp') return;
        const k = s34Find(keys, L);
        if (!k) return;
        const s = resultModel.seats[k];
        s[side] = L.p;                                   // ye neta isi seat se ladte hain
        const f = side === 'you' ? 'wYou' : 'wOpp';
        s[f] = s[f] * 1.15;                              // bade chehre ka thoda fayda
        list.push({ n: L.n, p: L.p, side: side, key: k, st: s.st, pc: s.pc });
    });
    resultModel.leaders = list;
    resultModel.cand = {};
}
const _buildResultModelS34 = buildResultModel;
buildResultModel = function () {
    const r = _buildResultModelS34.apply(this, arguments);
    try { s34Place(); } catch (e) { console.warn('leaders', e); }
    return r;
};
(function () { try { if (resultModel) s34Place(); } catch (e) {} })();

const _loadGameS34 = loadGame;
loadGame = function () {
    const ok = _loadGameS34.apply(this, arguments);
    if (ok) { try { s34Place(); } catch (e) {} s34Status(); }
    return ok;
};

function s34Cand(k) {
    if (!resultModel.cand) resultModel.cand = {};
    if (!resultModel.cand[k]) resultModel.cand[k] = randName();
    return resultModel.cand[k];
}

function s34Stat(l, L) {
    const g = gameState, k = l.key, s = resultModel.seats[k], w = seatResults[k];
    if (w) {
        const m = (g.seatMeta || {})[k] || {};
        return { t: w === l.p ? 'JEET' : 'HAAR', w: w, rp: m.rp, mv: m.mv, m: m.m };
    }
    if (s.phase > g.phase) return { t: 'BAAKI', ph: s.phase };
    const ld = ((L || computeLeads()).seats || []).filter(function (x) { return x.key === k; })[0];
    if (ld) return { t: ld.side === l.side ? 'AAGE' : 'PEECHE', margin: ld.margin, who: leadName(ld.side) };
    return { t: 'VOTING' };
}

function s34Photo(n, party, size) {
    const slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const ini = n.split(/\s+/).filter(function (w) { return /^[A-Za-z]/.test(w); }).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
    return '<div class="s34-ph" style="width:' + size + 'px;height:' + size + 'px;background:' + (partyColors[party] || '#64748b') + ';font-size:' + Math.round(size / 3) + 'px"><span>' + ini +
        '</span><img src="Images/Leaders/' + slug + '.jpg" data-s="' + slug + '" data-i="0" onerror="s34ImgErr(this)"></div>';
}
function s34ImgErr(img) {
    const ex = ['png', 'jpeg', 'webp'], i = parseInt(img.getAttribute('data-i'), 10);
    if (i < ex.length) {
        img.setAttribute('data-i', i + 1);
        img.src = 'Images/Leaders/' + img.getAttribute('data-s') + '.' + ex[i];
    } else if (img.parentNode) {
        img.remove();
    }
}

// ----- ticker / news -----
function s34Stars() {
    const out = [];
    if (!resultModel || !resultModel.leaders || !gameState || !gameState.seats) return out;
    const L = computeLeads();
    resultModel.leaders.forEach(function (l) {
        const st = s34Stat(l, L);
        if (st.t === 'VOTING' || st.t === 'BAAKI') return;
        out.push({ n: l.n, st: l.pc + ' (' + l.st + ')', c: partyColors[l.p] || '#9ca3af', who: l.p, t: st.t, x: st.margin ? st.margin.toFixed(1) + '% se' : (st.mv ? st.mv.toLocaleString('en-IN') + ' vote se' : ''), star: true });
    });
    return out;
}
const _s31ItemsS34 = s31Items;
s31Items = function () { return s34Stars().concat(_s31ItemsS34()); };

s31Seat = function () {
    const box = document.getElementById('wr-seat-status');
    if (!box) return;
    if (!box.getAttribute('data-s31')) {
        if (!box.getAttribute('data-s29')) return;
        box.setAttribute('data-s31', '1');
        box.classList.add('s31');
        box.insertAdjacentHTML('beforeend', '<div class="s31-spot" id="s31-spot"></div><div class="s31-crawl"><div class="s31-track" id="s31-track"></div></div>');
    }
    const items = s31Items();
    const sig = items.map(function (i) { return i.n + i.t + i.who; }).join('|');
    if (sig === S31.sig) return;
    S31.sig = sig;
    const stars = items.filter(function (i) { return i.star; }), rest = items.filter(function (i) { return !i.star; });
    S31.items = stars.concat(shuffled(rest).slice(0, 60));
    S31.idx = 0;
    const tr = document.getElementById('s31-track');
    if (!tr) return;
    const one = S31.items.map(function (i) {
        return '<span class="s31-it" style="--c:' + i.c + '"><i></i><b>' + (i.star ? '\u2605 ' : '') + esc(i.n) + '</b><em>' + esc(i.st) + '</em><u>' + esc(i.who) + ' ' + i.t + (i.x ? ' ' + esc(i.x) : '') + '</u></span>';
    }).join('');
    tr.style.setProperty('--d', Math.max(14, S31.items.length * 1.3) + 's');
    tr.innerHTML = one + one;
    s31Spin();
};

function s34Breaking() {
    if (!resultModel || !resultModel.leaders || !gameState || gameState.phaseEnded) return;
    const L = computeLeads(), items = [];
    resultModel.leaders.forEach(function (l) {
        if (seatResults[l.key] || resultModel.seats[l.key].phase !== gameState.phase) return;
        const st = s34Stat(l, L);
        if (st.t === 'AAGE') items.push(l.n + ' (' + l.p + ') ' + l.pc + ' se aage chal rahe hain, ' + st.margin.toFixed(1) + '% ki badhat.');
        if (st.t === 'PEECHE') items.push(l.n + ' (' + l.p + ') ' + l.pc + ' se pichhad rahe hain! ' + esc(st.who) + ' aage.');
    });
    shuffled(items).slice(0, 3).forEach(function (t) { pushNews('BREAKING: ' + t); });
    renderHeadlineBox();
}
const _finishRoundS34 = finishRound;
finishRound = function () {
    _finishRoundS34.apply(this, arguments);
    try { s34Breaking(); } catch (e) {}
};

const _computePhaseResultsS34 = computePhaseResults;
computePhaseResults = function (phase) {
    const rows = _computePhaseResultsS34(phase);
    try {
        (resultModel.leaders || []).forEach(function (l) {
            if (resultModel.seats[l.key].phase !== phase) return;
            const st = s34Stat(l);
            if (st.t === 'JEET') pushNews('BREAKING: ' + l.n + ' (' + l.p + ') ne ' + l.pc + ' se jeet darj ki!');
            if (st.t === 'HAAR') pushNews('BREAKING: ' + l.n + ' (' + l.p + ') ' + l.pc + ' se HAAR gaye! ' + st.w + ' jeeta.');
        });
        renderHeadlineBox();
    } catch (e) {}
    return rows;
};

// ----- phase ke baad leaders ka page -----
function s34Card(l) {
    const st = s34Stat(l), col = partyColors[l.p] || '#38bdf8';
    let dt = '';
    if (st.t === 'JEET') dt = 'Jeet' + (st.mv ? ': ' + st.mv.toLocaleString('en-IN') + ' vote se' : (st.m ? ': ' + st.m.toFixed(1) + '% se' : '')) + ' | Haraya: <b>' + esc(s34Cand(l.key)) + '</b> (' + esc(st.rp || 'rival') + ')';
    else if (st.t === 'HAAR') dt = '<b>' + esc(s34Cand(l.key)) + '</b> (' + esc(st.w) + ') ne haraya' + (st.mv ? ' ' + st.mv.toLocaleString('en-IN') + ' vote se' : '');
    else if (st.t === 'AAGE') dt = 'Abhi aage, ' + st.margin.toFixed(1) + '% ki badhat';
    else if (st.t === 'PEECHE') dt = 'Abhi pichhad rahe, ' + esc(st.who) + ' aage';
    else dt = 'Voting jaari';
    return '<div class="s34-card ' + (st.t === 'JEET' ? 'won' : (st.t === 'HAAR' ? 'lost' : '')) + '" style="--c:' + col + '">' + s34Photo(l.n, l.p, 74) +
        '<div style="min-width:0"><div class="nm">' + esc(l.n) + ' ' + s22Logo(l.p, 24) + '</div><div class="sub">' + esc(l.p) + ' | ' + esc(l.pc) + ' (' + esc(l.st) + ')</div><div class="dt">' + dt + '</div></div>' +
        '<span class="s34-chip ' + st.t + '">' + (st.t === 'JEET' ? 'JEET' : (st.t === 'HAAR' ? 'HAAR' : st.t)) + '</span></div>';
}

function s34LeadersPage(next) {
    if (!resultModel || !resultModel.leaders) return false;
    const ph = gameState.phase;
    const mine = resultModel.leaders.filter(function (l) { return resultModel.seats[l.key].phase === ph; });
    if (!mine.length) return false;
    const later = resultModel.leaders.filter(function (l) { return resultModel.seats[l.key].phase > ph; });
    let el = document.getElementById('s34-lead');
    if (!el) { el = document.createElement('div'); el.id = 's34-lead'; el.className = 's30-full hidden'; document.body.appendChild(el); }
    const col = function (side, title) {
        const list = mine.filter(function (l) { return l.side === side; });
        return '<div class="s34-col"><h3>' + title + '</h3><div class="s34-list">' + (list.length ? list.map(s34Card).join('') : '<div class="s30-empty">Is phase mein koi bada neta nahi tha.</div>') + '</div></div>';
    };
    el.innerHTML = '<div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap" style="height:100vh;overflow:hidden">' +
        '<div class="s30-head"><div><h1>Phase ' + ph + ': Bade Netaon ka Haal</h1><p>Kaun jeeta, kaun haara, kisne kisko haraya.</p></div></div>' +
        '<div class="s34-cols">' + col('you', 'AAPKA GATHBANDHAN') + col('opp', 'RIVAL GATHBANDHAN') + '</div>' +
        (later.length ? '<div class="s34-later">Aage ke phase mein ladne wale: ' + later.slice(0, 14).map(function (l) { return '<span>' + esc(l.n) + ' (Phase ' + resultModel.seats[l.key].phase + ')</span>'; }).join('') + '</div>' : '') +
        '<div style="text-align:center;margin-top:14px"><button class="s30-btn go" id="s34-lead-go">AAGE BADHO &rarr;</button></div></div>';
    el.classList.remove('hidden');
    document.getElementById('s34-lead-go').onclick = function () { el.classList.add('hidden'); next(); };
    return true;
}
const _proceedAfterResultsS34 = proceedAfterResults;
proceedAfterResults = function () {
    let shown = false;
    try { shown = s34LeadersPage(function () { _proceedAfterResultsS34(); }); } catch (e) { shown = false; }
    if (!shown) _proceedAfterResultsS34();
};

// ---------- 3) LOWER HOUSE: sarkar save + parliament page ----------
const S34_HOUSE_KEY = 'rajniti_house_v1';

function s34SaveHouse() {
    if (typeof s20 === 'undefined' || !s20.pm || !s20.cab) return;
    const cab = S20_MINISTRIES.map(function (m, mi) {
        const pr = s20.people[s20.cab[mi]] || { name: '-', party: '-' };
        return { min: m[0], tier: m[1], name: pr.name, party: pr.party };
    });
    const gov = {};
    cab.forEach(function (c) { gov[c.party] = true; });
    gov[s20.pm.party] = true;
    try { sideParties('you').forEach(function (p) { gov[p] = true; }); } catch (e) {}
    const rec = {
        when: new Date().toLocaleDateString('en-IN'), you: selectedYouParty, opp: selectedOppParty,
        pm: { name: s20.pm.name, party: s20.pm.party, pc: s20.pm.pc, st: s20.pm.st },
        cab: cab, gov: Object.keys(gov), seats: Object.assign({}, gameState.partyTotals),
        stab: fsState && fsState.stab ? fsState.stab.score : null, verdict: fsState && fsState.stab ? fsState.stab.verdict : ''
    };
    try { localStorage.setItem(S34_HOUSE_KEY, JSON.stringify(rec)); } catch (e) {}
    s34HouseBadge();
}
const _s20OathS34 = s20Oath;
s20Oath = function () {
    _s20OathS34.apply(this, arguments);
    try { s34SaveHouse(); } catch (e) { console.warn('house', e); }
};

function s34GetHouse() {
    try { return JSON.parse(localStorage.getItem(S34_HOUSE_KEY)); } catch (e) { return null; }
}

function s34HouseBadge() {
    const hb = document.querySelectorAll('#main-dashboard .house-btn')[0];
    if (!hb) return;
    const r = s34GetHouse();
    hb.innerHTML = '<span>LOWER HOUSE</span>' + (r ? '<small>Sarkar: ' + esc(r.pm.party) + ' | PM ' + esc(r.pm.name) + '</small>' : '<small>Abhi koi sarkar nahi</small>');
}
s34HouseBadge();
setTimeout(s34HouseBadge, 1500);

function s34Hemi(parties, total) {
    const cx = 350, cy = 335, rows = 9, r0 = 120, r1 = 305;
    const radii = [];
    for (let i = 0; i < rows; i++) radii.push(r0 + (r1 - r0) * i / (rows - 1));
    const sumR = radii.reduce(function (a, b) { return a + b; }, 0);
    const cnt = radii.map(function (r) { return Math.round(total * r / sumR); });
    let diff = total - cnt.reduce(function (a, b) { return a + b; }, 0);
    for (let i = rows - 1; diff !== 0; i = (i + rows - 1) % rows) { cnt[i] += diff > 0 ? 1 : -1; diff += diff > 0 ? -1 : 1; }
    const pts = [];
    radii.forEach(function (r, i) {
        for (let j = 0; j < cnt[i]; j++) {
            const a = Math.PI * (cnt[i] === 1 ? 0.5 : j / (cnt[i] - 1));
            pts.push({ a: a, r: r, x: cx - r * Math.cos(a), y: cy - r * Math.sin(a) });
        }
    });
    pts.sort(function (p, q) { return p.a - q.a || p.r - q.r; });
    const seq = [];
    parties.forEach(function (p) { for (let i = 0; i < p[1]; i++) seq.push(p[2]); });
    let svg = '<svg viewBox="0 0 700 350">';
    pts.forEach(function (p, i) {
        svg += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="6.4" fill="' + (seq[i] || '#334155') + '" style="animation-delay:' + (i * 3) + 'ms"/>';
    });
    return svg + '</svg>';
}

function s34House() {
    s34Style();
    const r = s34GetHouse();
    let el = document.getElementById('s34-house');
    if (!el) { el = document.createElement('div'); el.id = 's34-house'; el.className = 's30-full hidden'; document.body.appendChild(el); }
    const back = '<button class="s30-back" onclick="document.getElementById(\'s34-house\').classList.add(\'hidden\')">&larr; Wapas</button>';
    if (!r) {
        el.innerHTML = '<div class="s34-top"></div><div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap"><div class="s30-head">' + back +
            '<div><h1>Lok Sabha (Lower House)</h1><p>Abhi koi sarkar nahi bani.</p></div></div><div class="s30-empty">Lok Sabha chunav khelo aur sarkar banao. Uske baad yahan aapki sarkar aur poora mantrimandal dikhega.</div></div>';
        el.classList.remove('hidden');
        return;
    }
    const total = Object.keys(r.seats).reduce(function (s, p) { return s + r.seats[p]; }, 0);
    const govSet = {};
    r.gov.forEach(function (p) { govSet[p] = true; });
    const names = Object.keys(r.seats).filter(function (p) { return r.seats[p] > 0; });
    const govP = names.filter(function (p) { return govSet[p]; }).sort(function (a, b) { return r.seats[b] - r.seats[a]; });
    const oppP = names.filter(function (p) { return !govSet[p]; }).sort(function (a, b) { return r.seats[b] - r.seats[a]; });
    const ordered = govP.concat(oppP).map(function (p) { return [p, r.seats[p], partyColors[p] || '#9ca3af']; });
    const govSeats = govP.reduce(function (s, p) { return s + r.seats[p]; }, 0);
    el.innerHTML = '<div class="s34-top"></div><div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap" style="height:100vh;overflow:hidden">' +
        '<div class="s30-head">' + back + '<div><h1>Lok Sabha - Maujooda Sarkar</h1><p>Gathan: ' + esc(r.when) + (r.stab ? ' | Sthirta ' + r.stab + '% (' + esc(r.verdict) + ')' : '') + '</p></div></div>' +
        '<div class="s34-parl"><div class="s34-hemi">' + s34Hemi(ordered, total) +
        '<div style="text-align:center;margin-top:-6px"><b style="font-size:2rem;color:#fff">' + govSeats + '</b> <span style="color:#94a3b8">sarkar ke paas ' + total + ' mein se | bahumat ' + MAJORITY + '</span></div>' +
        '<div class="s34-legend">' + ordered.map(function (p) { return '<span><i style="background:' + p[2] + '"></i>' + esc(p[0]) + ' <b>' + p[1] + '</b>' + (govSet[p[0]] ? ' *' : '') + '</span>'; }).join('') + '</div>' +
        '<div class="s34-legend" style="margin-top:4px">* sarkar mein shamil dal</div></div>' +
        '<div class="s34-cab"><div class="s34-pm">' + s34Photo(r.pm.name, r.pm.party, 84) + '<div><span class="t">PRADHAN MANTRI</span><b>' + esc(r.pm.name) + '</b><span style="color:#cbd5e1">' + esc(r.pm.party) + '</span></div></div>' +
        '<div class="s34-mins">' + r.cab.map(function (c, i) {
            return '<div class="s34-min' + (c.tier === 1 ? ' t1' : '') + '" style="--c:' + (partyColors[c.party] || '#94a3b8') + ';animation-delay:' + (0.1 + i * 0.05) + 's"><small>' + esc(c.min) + '</small><b>' + esc(c.name) + '</b><span>' + esc(c.party) + '</span></div>';
        }).join('') + '</div></div></div></div>';
    el.classList.remove('hidden');
}
const _openHouseS34 = openHouse;
openHouse = function (t) {
    if (t === 'lower-house') s34House(); else _openHouseS34(t);
};

// ================= STAGE 35: STAMINA HAR ROUND 100%, ICONS HATAO (MAP/POL/VOT), LOCAL GURU + KARYAKARTA + DM/SP (constituency wise, pakka vote-share), CONTROVERSY (15% / 2%) =================

// ---- Tunable numbers (yahan se asani se badal sakte ho) ----
const VS35 = {
    guru: 0.25,                 // Local Guru: constituency ke ~25% voter aapke paksh mein
    karSeat: 0.35,              // Karyakarta (constituency): 35% voter
    karStateMin: 0.15,          // Karyakarta (state): 15% se
    karStateMax: 0.20,          // ... 20% voter (poori state ki har seat par)
    DM: 0.20,                   // DM badalne par 20%
    SP: 0.15,                   // SP badalne par 15%
    contro: 0.15,               // Controversy chali to rival ka 15% vote share gaya
    controBack: 0.02,           // Ulti padi to aapka 2% gaya
    maxGain: 0.85,              // ek seat par total fayda isse zyada nahi
    maxCut: 0.60                // total nuksan isse zyada nahi
};
const VS35_COST = { guru: 4, karSeat: 5, DM: 12, SP: 9, karStateBase: 4, karStatePerSeat: 0.3 };
const VS35_AI_GURU_LIMIT = 3;   // AI ek phase mein itne hi local guru laga sakta hai

// ---- 1) Stamina: har round ke baad 100% ----
recoverStamina = function () {
    gameState.stamina = 100;
    gameState.opp.stamina = 100 + (AI_CONFIG.bonusStamina || 0);
    updateStatusPanel();
};

// ---- 2) Icons hatao: Heat Map (MAP), Opinion Poll (POL), Phase Voting (VOT) ----
function s35Clean() {
    document.querySelectorAll('.wr-side-icon').forEach(function (b) {
        const oc = b.getAttribute('onclick') || '';
        const ic = b.getAttribute('data-ic') || '';
        if (/Heat Map|Opinion Poll|Phase Voting/.test(oc) || b.hasAttribute('data-poll') || ic === 'MAP' || ic === 'POL' || ic === 'VOT') b.remove();
    });
}
s35Clean();
setTimeout(s35Clean, 1200);
setTimeout(s35Clean, 3600);

// ---- 3) Vote-share ka hisaab ----
function vsNew35() { return { guru: {}, karSeat: {}, karState: {}, off: {}, cut: 0 }; }

function ensureS35() {
    if (!gameState.vs) gameState.vs = { you: vsNew35(), opp: vsNew35() };
    ['you', 'opp'].forEach(function (sd) {
        if (!gameState.vs[sd]) gameState.vs[sd] = vsNew35();
        const v = gameState.vs[sd];
        ['guru', 'karSeat', 'karState', 'off'].forEach(function (k) { if (!v[k]) v[k] = {}; });
        if (typeof v.cut !== 'number') v.cut = 0;
    });
    if (!gameState.booths) gameState.booths = { you: {}, opp: {} };
    if (!gameState.officials) gameState.officials = { you: false, opp: false };
}

const _freshActionStateS35 = freshActionState;
freshActionState = function () {
    _freshActionStateS35();
    gameState.vs = { you: vsNew35(), opp: vsNew35() };
};
const _nextPhaseResetS35 = nextPhaseActionReset;
nextPhaseActionReset = function () {
    _nextPhaseResetS35();
    gameState.vs = { you: vsNew35(), opp: vsNew35() };
};

// ek seat par side ko kitna vote-share ka fayda (alag-alag sources ka milkar, 100% se upar nahi)
function vsGain35(side, k, st) {
    const v = gameState.vs && gameState.vs[side];
    if (!v) return 0;
    let keep = 1;
    [v.guru[k], v.karSeat[k], v.karState[st], v.off[k]].forEach(function (p) { if (p > 0) keep *= (1 - p); });
    return Math.min(VS35.maxGain, 1 - keep);
}

// Seat ke teeno weights (aap, opp, others) ko vote-share ke hisaab se badlo
function vsAdjust(k, st, wy, wo, wx) {
    const v = gameState.vs;
    if (!v) return [wy, wo, wx];
    const tot = wy + wo + wx;
    if (!(tot > 0)) return [wy, wo, wx];
    const s = { you: wy / tot, opp: wo / tot, oth: wx / tot };
    const all = ['you', 'opp', 'oth'];

    ['you', 'opp'].forEach(function (side) {            // fayda: doosron se vote aapki taraf
        const g = vsGain35(side, k, st);
        if (g <= 0) return;
        const others = all.filter(function (x) { return x !== side; });
        const pool = others.reduce(function (a, x) { return a + s[x]; }, 0);
        const take = Math.min(g, pool);
        if (pool > 0) others.forEach(function (x) { s[x] -= take * s[x] / pool; });
        s[side] += take;
    });
    ['you', 'opp'].forEach(function (side) {            // nuksan (controversy): vote doosron mein baant jaate hain
        const c = Math.min(VS35.maxCut, (v[side] && v[side].cut) || 0);
        if (c <= 0) return;
        const take = Math.min(c, s[side]);
        const others = all.filter(function (x) { return x !== side; });
        const pool = others.reduce(function (a, x) { return a + s[x]; }, 0);
        s[side] -= take;
        if (pool > 0) others.forEach(function (x) { s[x] += take * s[x] / pool; });
    });
    return [s.you * tot, s.opp * tot, s.oth * tot];
}

function seatName35(k) {
    const s = resultModel && resultModel.seats[k];
    return s ? s.pc : k;
}
function freeSeat35(map, st) {
    const l = activeSeats(st).filter(function (x) { return !map[x.key]; });
    return l.length ? l[Math.floor(Math.random() * l.length)].key : null;
}
function countKeys35(o) { return Object.keys(o || {}).length; }
function pct35(x) { return Math.round(x * 100); }

// ---- 4) Local Guru (constituency wise, ~25% voter pakka) ----
actGuru = function (st, key) {
    return {
        type: 'Local Guru', st: st, key: key, cost: VS35_COST.guru, stamina: 3,
        check: function (side) {
            ensureS35();
            if (!st) return 'Pehle state chuno.';
            const m = gameState.vs[side].guru;
            if (side === 'opp' && countKeys35(m) >= VS35_AI_GURU_LIMIT) return 'AI limit.';
            if (key) return m[key] ? 'Is constituency mein local guru pehle se saath hain.' : null;
            return freeSeat35(m, st) ? null : 'Is state ki saari seats par local guru lag chuke.';
        },
        apply: function (mult, side) {
            ensureS35(); ensureS14();
            const m = gameState.vs[side].guru;
            const k = key || freeSeat35(m, st);
            if (!k) return { text: 'Koi seat khaali nahi.', good: false, hawa: 0 };
            m[k] = VS35.guru;
            gameState.gurus[side][st] = (gameState.gurus[side][st] || 0) + 1;
            return { text: sideName(side) + ' ne ' + seatName35(k) + ' (' + st + ') ke local guruon ko saath liya: wahan ~' + pct35(VS35.guru) + '% voter paksh mein.', good: true, hawa: 2 };
        }
    };
};
uiGuru = function () { if (uiSel.state && uiSel.seat) runUi(actGuru(uiSel.state, uiSel.seat)); };

// ---- 5) Karyakarta: state wise (15-20%) aur constituency wise (35%) ----
function karStateCost35(st) { return Math.round(VS35_COST.karStateBase + VS35_COST.karStatePerSeat * activeSeats(st).length); }

actBooth = function (st) {
    return {
        type: 'Booth Team', st: st, cost: karStateCost35(st), stamina: 4,
        check: function (side) {
            ensureS35();
            return gameState.vs[side].karState[st] ? 'Is state mein is phase karyakarta pehle se active hain.' : null;
        },
        apply: function (mult, side) {
            ensureS35();
            const p = Math.round((VS35.karStateMin + Math.random() * (VS35.karStateMax - VS35.karStateMin)) * 100) / 100;
            gameState.vs[side].karState[st] = p;
            gameState.booths[side][st] = 1;
            return { text: sideName(side) + ' ke karyakarta ' + st + ' mein active: poori state mein ~' + pct35(p) + '% voter paksh mein.', good: true, hawa: 2 };
        }
    };
};

function actBoothSeat(key) {
    const sd = resultModel && resultModel.seats[key];
    const st = sd ? sd.st : '';
    return {
        type: 'Booth Team', st: st, key: key, cost: VS35_COST.karSeat, stamina: 3,
        check: function (side) {
            ensureS35();
            return gameState.vs[side].karSeat[key] ? 'Is constituency mein karyakarta pehle se active hain.' : null;
        },
        apply: function (mult, side) {
            ensureS35();
            gameState.vs[side].karSeat[key] = VS35.karSeat;
            return { text: sideName(side) + ' ke karyakarta ' + seatName35(key) + ' (' + st + ') mein active: ~' + pct35(VS35.karSeat) + '% voter paksh mein.', good: true, hawa: 1 };
        }
    };
}

actBoothAll = function () {
    let cost = 0;
    activeStates().forEach(function (x) { cost += karStateCost35(x.st); });
    return {
        type: 'Karyakarta (All)', st: null, cost: Math.max(1, Math.round(cost * 0.8)), stamina: 6,
        check: function (side) {
            ensureS35();
            const left = activeStates().filter(function (x) { return !gameState.vs[side].karState[x.st]; }).length;
            return left ? null : 'Sabhi states mein karyakarta pehle se active hain.';
        },
        apply: function (mult, side) {
            ensureS35();
            let n = 0;
            activeStates().forEach(function (x) {
                if (gameState.vs[side].karState[x.st]) return;
                gameState.vs[side].karState[x.st] = Math.round((VS35.karStateMin + Math.random() * (VS35.karStateMax - VS35.karStateMin)) * 100) / 100;
                gameState.booths[side][x.st] = 1;
                n++;
            });
            return { text: sideName(side) + ' ke karyakarta ' + n + ' states mein ek saath utre (har state mein ' + pct35(VS35.karStateMin) + '-' + pct35(VS35.karStateMax) + '% voter paksh mein).', good: true, hawa: 2 };
        }
    };
};
uiBooth = function () { if (uiSel.state) runUi(actBooth(uiSel.state)); };
function uiBoothSeat() { if (uiSel.seat) runUi(actBoothSeat(uiSel.seat)); }

// ---- 6) DM / SP transfer (constituency wise): DM +20%, SP +15% ----
actOfficial = function (st, kind, key) {
    const dm = kind === 'DM';
    return {
        type: dm ? 'DM Transfer' : 'SP Transfer', st: st, key: key, cost: dm ? VS35_COST.DM : VS35_COST.SP, stamina: 4,
        check: function (side) {
            ensureS35();
            if (!st) return 'Pehle state chuno.';
            const m = gameState.vs[side].off;
            if (key) return m[key] ? 'Is constituency mein DM/SP ka tabadla pehle ho chuka (ek seat par ek hi).' : null;
            return freeSeat35(m, st) ? null : 'Is state ki saari seats par tabadla ho chuka.';
        },
        apply: function (mult, side) {
            ensureS35(); ensureS17();
            const m = gameState.vs[side].off;
            const k = key || freeSeat35(m, st);
            if (!k) return { text: 'Koi seat khaali nahi.', good: false, hawa: 0 };
            const p = dm ? VS35.DM : VS35.SP;
            m[k] = p;
            gameState.officials[side] = true;
            const txt = sideName(side) + ' ne ' + seatName35(k) + ' (' + st + ') mein ' + (dm ? 'DM' : 'SP') + ' badla: wahan ~' + pct35(p) + '% vote fayda.';
            if (Math.random() < 0.35) {
                const out = actCourt('Bhrashtachar', 'senior').apply(1, otherSide(side));
                pushNews('Case: ' + out.text);
                return { text: txt + ' Par bhed khul gaya! ' + out.text, good: false, hawa: -3 };
            }
            return { text: txt, good: true, hawa: 0 };
        }
    };
};
uiOfficial = function (kind) { if (uiSel.state && uiSel.seat) runUi(actOfficial(uiSel.state, kind, uiSel.seat)); };

// ---- 7) Controversy: safal = rival ka 15% vote share gaya, ulti = aapka 2% ----
CONTRO.forEach(function (c) { c.drop = VS35.contro; c.back = VS35.controBack; });

s33ResolveContro = function (side) {
    ensureS33(); ensureS35();
    const p = gameState.contro[side];
    if (!p) return;
    gameState.contro[side] = null;
    const c = controOf(p.id), rival = otherSide(side);
    const ok = Math.random() < Math.min(0.9, c.p * (p.mult > 1 ? 1.15 : 1));
    if (ok) {
        gameState.vs[rival].cut += VS35.contro;
        shiftHawa(side, c.hawa, 'Controversy');
        shiftHawa(rival, -Math.round(c.hawa / 2), 'Controversy');
    } else {
        gameState.vs[side].cut += VS35.controBack;
        shiftHawa(side, -c.hawa, 'Controversy ulti');
    }
    gameState.controLog.unshift({ side: side, name: c.name, ok: ok, drop: pct35(VS35.contro), back: pct35(VS35.controBack) });
    gameState.controLog = gameState.controLog.slice(0, 6);
    let t;
    if (side === 'you') t = ok ? 'Aapka "' + c.name + '" daav chal gaya! Rival ka ' + pct35(VS35.contro) + '% vote share gaya.' : 'Aapka "' + c.name + '" daav ulta pada! Aapka ' + pct35(VS35.controBack) + '% vote share gaya.';
    else t = ok ? 'Opponent ka "' + c.name + '" daav chal gaya! Aapka ' + pct35(VS35.contro) + '% vote share gaya.' : 'Opponent ka "' + c.name + '" daav unpar hi ulta pada!';
    pushNews(t);
    s33Toast(t, (side === 'you') === ok ? 'good' : 'bad');
};

// ---- 8) Panels ----
function seatSel35(st, map) {
    const seats = activeSeats(st);
    if (!seats.some(function (x) { return x.key === uiSel.seat; })) uiSel.seat = seats.length ? seats[0].key : '';
    let h = '<select class="ap-sel" onchange="setUiSeat(this.value)">';
    seats.forEach(function (x) {
        h += '<option value="' + esc(x.key) + '"' + (x.key === uiSel.seat ? ' selected' : '') + '>' + (map[x.key] ? '\u2713 ' : '') + esc(x.pc) + '</option>';
    });
    return h + '</select>';
}

function renderGuruPanel35() {
    ensureS14(); ensureS35();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    const map = gameState.vs.you.guru;
    const seatSel = seatSel35(uiSel.state, map);
    const seats = activeSeats(uiSel.state);
    const n = seats.filter(function (x) { return map[x.key]; }).length;
    const done = !!map[uiSel.seat];
    const a = actGuru(uiSel.state, uiSel.seat);
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">' + esc(uiSel.state) + ' mein local guru (constituency)</div><div class="s23-num">' + n + ' <small>/ ' + seats.length + '</small></div>' +
        s23Bar(seats.length ? n / seats.length * 100 : 0, '#f472b6') +
        '<div class="s23-sub">Guru saath aaye to us constituency ke ~' + pct35(VS35.guru) + '% voter aapke paksh mein aa jaate hain. Ek constituency mein ek baar.</div></div></div>';
    h += '<div class="s23-sec"><h4>Pehle state, phir constituency chuno</h4>State: ' + sel + '<br><div style="margin-top:6px">Constituency: ' + seatSel + '</div>' +
        '<div style="margin-top:8px">' + s27Use(a) + '<span class="s23-tag" style="color:#86efac">+' + pct35(VS35.guru) + '% vote</span></div>' +
        '<div style="margin-top:10px"><button class="s23-btn g"' + (done ? ' disabled style="opacity:.5"' : '') + ' onclick="uiGuru()">' + (done ? 'Guru pehle se saath hain' : 'Local guru ko saath lo') + '</button></div></div>';
    return h + '</div>';
}

function renderKaryakartaPanel35() {
    ensureS14(); ensureS35();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    const v = gameState.vs.you;
    const seatSel = seatSel35(uiSel.state, v.karSeat);
    const seats = activeSeats(uiSel.state);
    const nSeat = seats.filter(function (x) { return v.karSeat[x.key]; }).length;
    const stDone = v.karState[uiSel.state];
    const seatDone = !!v.karSeat[uiSel.seat];
    const all = actBoothAll();
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box"><div class="s23-lbl">' + esc(uiSel.state) + ' mein karyakarta</div>' +
        '<div class="s23-num">' + (stDone ? 'State: ' + pct35(stDone) + '%' : 'State: baaki') + ' <small>| Seats: ' + nSeat + ' / ' + seats.length + '</small></div>' +
        '<div class="s23-sub">State mein active karo to poori state ke ' + pct35(VS35.karStateMin) + '-' + pct35(VS35.karStateMax) + '% voter paksh mein. Kisi constituency mein active karo to wahan ' + pct35(VS35.karSeat) + '% voter paksh mein.</div></div></div>';
    h += '<div class="s23-sec"><h4>State chuno</h4>' + sel + '</div>';
    h += '<div class="s23-grid2"><div class="s23-card"><div class="ic">&#127970;</div><h4>Poori state mein</h4><p>' + pct35(VS35.karStateMin) + '-' + pct35(VS35.karStateMax) + '% voter</p>' + s27Use(actBooth(uiSel.state)) +
        '<br><br><button class="s23-btn g"' + (stDone ? ' disabled style="opacity:.5"' : '') + ' onclick="uiBooth()">' + (stDone ? 'Active ho chuke' : 'State mein lagao') + '</button></div>' +
        '<div class="s23-card"><div class="ic">&#128205;</div><h4>Ek constituency mein</h4><p>' + pct35(VS35.karSeat) + '% voter</p>' + seatSel + '<br>' + s27Use(actBoothSeat(uiSel.seat)) +
        '<br><br><button class="s23-btn g"' + (seatDone ? ' disabled style="opacity:.5"' : '') + ' onclick="uiBoothSeat()">' + (seatDone ? 'Active ho chuke' : 'Constituency mein lagao') + '</button></div></div>';
    h += '<div class="s23-sec"><h4>Sabhi states mein ek saath</h4><div class="s23-sub">Is phase ke har state mein (20% sasta).</div>' + s27Use(all) +
        '<div style="margin-top:8px"><button class="s23-btn" onclick="uiBoothAll()">Sabhi states mein lagao</button></div></div>';
    return h + '</div>';
}

function renderOfficialPanel35() {
    ensureS35();
    if (!activeStates().length) return s27Nothing();
    const sel = stateSelectHtml();
    const map = gameState.vs.you.off;
    const seatSel = seatSel35(uiSel.state, map);
    const done = !!map[uiSel.seat];
    const dm = actOfficial(uiSel.state, 'DM', uiSel.seat), sp = actOfficial(uiSel.state, 'SP', uiSel.seat);
    let h = '<div class="s23-wrap">' + s23Msg() + s23Strip() + s26Fund();
    h += '<div class="s23-hero"><div class="s23-box dark"><div class="s23-lbl">Constituency wise tabadla</div><div class="s23-num" style="color:' + (done ? '#f87171' : '#4ade80') + '">' + (done ? 'Is seat par ho chuka' : 'Is seat par baaki') + '</div>' +
        '<div class="s23-sub">Ek constituency mein DM ya SP, koi ek. DM badalne par ~' + pct35(VS35.DM) + '% vote fayda, SP par ~' + pct35(VS35.SP) + '%. <b>35% bhed khulne ka khatra</b> (phir opponent court case karega).</div></div></div>';
    h += '<div class="s23-sec"><h4>Pehle state, phir constituency chuno</h4>State: ' + sel + '<br><div style="margin-top:6px">Constituency: ' + seatSel + '</div></div>';
    h += '<div class="s23-grid2"><div class="s23-card"><div class="ic">&#127963;</div><h4>Zila Magistrate (DM)</h4><p>+' + pct35(VS35.DM) + '% vote</p>' + s27Use(dm) + '<br><br>' +
        '<button class="s23-btn o"' + (done ? ' disabled style="opacity:.5"' : '') + ' onclick="uiOfficial(\'DM\')">DM badlo</button></div>' +
        '<div class="s23-card"><div class="ic">&#128110;</div><h4>Police Adhikshak (SP)</h4><p>+' + pct35(VS35.SP) + '% vote</p>' + s27Use(sp) + '<br><br>' +
        '<button class="s23-btn o"' + (done ? ' disabled style="opacity:.5"' : '') + ' onclick="uiOfficial(\'SP\')">SP badlo</button></div></div>';
    return h + '</div>';
}

const _renderPanelS35 = renderPanel;
renderPanel = function (name) {
    const pick = { 'Local Guru': renderGuruPanel35, 'Karyakarta': renderKaryakartaPanel35, 'Transfer DM/SP': renderOfficialPanel35 }[name];
    if (pick) {
        S33.cur = name;
        const h = pick();
        return S28_META[name] ? s28Banner(S28_META[name]) + h : h;
    }
    return _renderPanelS35(name);
};

// ---- STAGE 35b: CONTROVERSY mehngi (25-30 Cr) aur ek phase mein max 2 baar ----
const CONTRO_MAX35 = 2;
const CONTRO_COST35 = { protest: 25, corruption: 28, defamation: 26, scandal: 30, promises: 25, economy: 27 };
CONTRO.forEach(function (c) { if (CONTRO_COST35[c.id]) c.cost = CONTRO_COST35[c.id]; });

function controCount35(side) {
    if (!gameState.controN) gameState.controN = { you: 0, opp: 0 };
    return gameState.controN[side] || 0;
}

const _freshActionStateS35b = freshActionState;
freshActionState = function () {
    _freshActionStateS35b();
    gameState.controN = { you: 0, opp: 0 };
};
const _nextPhaseResetS35b = nextPhaseActionReset;
nextPhaseActionReset = function () {
    _nextPhaseResetS35b();
    gameState.controN = { you: 0, opp: 0 };
};

const _actControS35b = actContro;
actContro = function (id) {
    const a = _actControS35b(id);
    const oldCheck = a.check, oldApply = a.apply;
    a.check = function (side) {
        const why = oldCheck(side);
        if (why) return why;
        return controCount35(side) >= CONTRO_MAX35 ? 'Is phase mein max ' + CONTRO_MAX35 + ' controversy hi ho sakti hain.' : null;
    };
    a.apply = function (m, side) {
        controCount35(side);
        gameState.controN[side]++;
        return oldApply(m, side);
    };
    return a;
};

const _renderControPanel35b = renderControPanel33;
renderControPanel33 = function () {
    let h = _renderControPanel35b();
    const n = controCount35('you');
    const note = '<div class="s23-sec"><div class="s23-sub">Is phase mein controversy: <b>' + n + ' / ' + CONTRO_MAX35 + '</b></div></div>';
    h = h.replace('<div class="s23-grid2">', note + '<div class="s23-grid2">');
    if (n >= CONTRO_MAX35) h = h.replace(/<button class="s23-btn o"(?! disabled)( onclick="uiContro)/g, '<button class="s23-btn o" disabled style="opacity:.5"$1');
    return h;
};

// ================= STAGE 36: continue button, round bonus, VIP/leaders ke naam, Lower House (neta kharido + mantrimandal badlo) =================

// ---- 1) "Pichhla game jaari rakho": dashboard se hatao, Lok Sabha page par chhota karke rakho ----
s34DashCont = function () {
    const b = document.getElementById('s34-dash-cont');
    if (b) b.remove();
};
s34DashCont();

(function () {
    if (document.getElementById('s36-css')) return;
    const st = document.createElement('style');
    st.id = 's36-css';
    st.textContent =
        '.s36-mini{border:0;border-radius:20px;padding:6px 14px;font-size:.78rem;font-weight:700;color:#fff;background:#16a34a;cursor:pointer;opacity:.92}' +
        '.s36-mini:hover{opacity:1}' +
        '.s36-bar{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto;align-items:center}' +
        '.s36-btn{border:0;border-radius:12px;padding:9px 14px;font-weight:700;color:#fff;background:linear-gradient(135deg,#7c3aed,#2563eb);cursor:pointer}' +
        '.s36-btn.o{background:linear-gradient(135deg,#ea580c,#dc2626)}' +
        '.s36-fund{color:#fde68a;font-weight:700;padding:6px 12px;border-radius:12px;background:rgba(250,204,21,.12)}' +
        '#s36-sheet{position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,.82);display:flex;align-items:center;justify-content:center;padding:14px}' +
        '#s36-sheet .box{width:min(720px,100%);max-height:88vh;overflow:auto;background:#0f172a;border:1px solid #334155;border-radius:20px;padding:18px;color:#e2e8f0}' +
        '#s36-sheet h2{margin:0 0 4px;font-size:1.2rem}#s36-sheet .sub{color:#94a3b8;font-size:.85rem;margin-bottom:12px}' +
        '#s36-sheet .row{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:8px;border-radius:14px;background:#1e293b;border-left:5px solid var(--c,#64748b)}' +
        '#s36-sheet .row .t{flex:1;min-width:0}#s36-sheet .row b{display:block}#s36-sheet .row small{color:#94a3b8}' +
        '#s36-sheet button.go{border:0;border-radius:10px;padding:8px 12px;font-weight:700;color:#fff;background:#2563eb;cursor:pointer}' +
        '#s36-sheet button.cl{border:0;border-radius:10px;padding:8px 14px;color:#fff;background:#475569;cursor:pointer;float:right}' +
        '#s36-sheet button.go:disabled{opacity:.4;cursor:not-allowed}';
    document.head.appendChild(st);
})();

s33Continue = function () {
    document.querySelectorAll('#become-pm-screen .continue-row, #s36-cont').forEach(function (e) { e.remove(); });
    if (!hasSave()) return;
    const back = document.querySelector('#become-pm-screen .back-btn');
    const row = back && back.parentNode;
    if (!row) return;
    let label = '\u25B6 Pichhla game';
    try {
        const d = JSON.parse(localStorage.getItem(SAVE_KEY));
        label += ' (Phase ' + d.gs.phase + ', Round ' + d.gs.round + ')';
    } catch (e) {}
    const b = document.createElement('button');
    b.id = 's36-cont';
    b.className = 's36-mini';
    b.textContent = label;
    b.onclick = function () { if (!loadGame()) alert('Save khul nahi paya.'); };
    row.insertBefore(b, row.children[1] || null);
};
injectContinueButton = function () {};
s33Continue();

// ---- 2) Har round ke baad fixed bonus (aapko aur AI ko) ----
const ROUND_BONUS36 = 40;      // Cr, 25-50 ke beech ek fixed amount
const _finishRoundS36 = finishRound;
finishRound = function () {
    const r0 = gameState.round, ph0 = gameState.phase;
    _finishRoundS36.apply(this, arguments);
    try {
        if (gameState.phase === ph0 && !gameState.phaseEnded && gameState.round === r0 + 1) {
            resSet('you', 'budget', resGet('you', 'budget') + ROUND_BONUS36);
            resSet('opp', 'budget', resGet('opp', 'budget') + ROUND_BONUS36);
            if (typeof gameState.phaseStartBudget === 'number') gameState.phaseStartBudget += ROUND_BONUS36;
            updateStatusPanel();
            const t = 'Round khatm: ' + ROUND_BONUS36 + ' Cr ka naya funding mila.';
            pushNews(t);
            s33Toast(t, 'good');
        }
    } catch (e) { console.warn('round bonus', e); }
};

// ---- 3) Phase ke baad ke page par VIP ummeedwaron ke naam ----
s34LeadersPage = function (next) {
    if (!resultModel) return false;
    ensureS17();
    const ph = gameState.phase;
    const leaders = (resultModel.leaders || []).slice();
    const seen = {};
    leaders.forEach(function (l) { seen[l.key] = 1; });
    const vipList = [];
    ['you', 'opp'].forEach(function (side) {
        Object.keys(gameState.vips[side] || {}).forEach(function (k) {
            const s = resultModel.seats[k], v = gameState.vips[side][k];
            if (!s || seen[k]) return;
            const party = s[side] || (side === 'you' ? selectedYouParty : selectedOppParty);
            vipList.push({ n: v.name, p: party, side: side, key: k, st: s.st, pc: s.pc, vip: true });
        });
    });
    const all = leaders.concat(vipList);
    const mine = all.filter(function (l) { return resultModel.seats[l.key] && resultModel.seats[l.key].phase === ph; });
    if (!mine.length) return false;
    const later = all.filter(function (l) { return resultModel.seats[l.key] && resultModel.seats[l.key].phase > ph; });
    let el = document.getElementById('s34-lead');
    if (!el) { el = document.createElement('div'); el.id = 's34-lead'; el.className = 's30-full hidden'; document.body.appendChild(el); }
    const card = function (l) {
        const h = s34Card(l);
        return l.vip ? h.replace('<div class="nm">', '<div class="nm"><span style="color:#facc15">\u2605 VIP</span> ') : h;
    };
    const col = function (side, title) {
        const list = mine.filter(function (l) { return l.side === side; });
        return '<div class="s34-col"><h3>' + title + '</h3><div class="s34-list">' + (list.length ? list.map(card).join('') : '<div class="s30-empty">Is phase mein koi bada neta ya VIP nahi tha.</div>') + '</div></div>';
    };
    el.innerHTML = '<div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap" style="height:100vh;overflow:hidden">' +
        '<div class="s30-head"><div><h1>Phase ' + ph + ': Bade Neta aur VIP ka Haal</h1><p>Kaun jeeta, kaun haara, kisne kisko haraya.</p></div></div>' +
        '<div class="s34-cols">' + col('you', 'AAPKA GATHBANDHAN') + col('opp', 'RIVAL GATHBANDHAN') + '</div>' +
        (later.length ? '<div class="s34-later">Aage ke phase mein ladne wale: ' + later.slice(0, 14).map(function (l) { return '<span>' + esc(l.n) + ' (Phase ' + resultModel.seats[l.key].phase + ')</span>'; }).join('') + '</div>' : '') +
        '<div style="text-align:center;margin-top:14px"><button class="s30-btn go" id="s34-lead-go">AAGE BADHO &rarr;</button></div></div>';
    el.classList.remove('hidden');
    document.getElementById('s34-lead-go').onclick = function () { el.classList.add('hidden'); next(); };
    return true;
};

// ---- 4) PM aur mantrimandal mein party ke bade netaon ke naam ----
// Jo bada neta apni seat jeeta aur uski party aapke gathbandhan mein hai, wo VIP ki tarah PM/mantri ki list mein aata hai.
function s36InjectLeaders(perParty, maxTotal) {
    const added = [];
    try {
        ensureS17();
        if (!resultModel || !resultModel.leaders) return added;
        const cnt = {};
        let total = 0;
        resultModel.leaders.forEach(function (l) {
            if (total >= maxTotal) return;
            if (resultModel.sideOf[l.p] !== 'you') return;
            if (seatResults[l.key] !== l.p) return;                       // seat jeete hue neta hi
            if (!s20.hold[l.p] || s20.hold[l.p].you <= 0) return;
            if (gameState.vips.you[l.key]) return;                        // pehle se VIP hai
            cnt[l.p] = (cnt[l.p] || 0);
            if (cnt[l.p] >= perParty) return;
            cnt[l.p]++; total++;
            gameState.vips.you[l.key] = { name: l.n, st: l.st, pc: l.pc, phase: resultModel.seats[l.key].phase, won: true, leader: true };
            added.push(l.key);
        });
    } catch (e) { console.warn('leaders inject', e); }
    return added;
}
function s36Restore(keys) { keys.forEach(function (k) { delete gameState.vips.you[k]; }); }

const _s20PMS36 = s20PM;
s20PM = function () {
    const keys = s36InjectLeaders(1, 6);
    try { return _s20PMS36.apply(this, arguments); } finally { s36Restore(keys); }
};
const _s20AutoCabinetS36 = s20AutoCabinet;
s20AutoCabinet = function () {
    const keys = s36InjectLeaders(3, 14);
    try { return _s20AutoCabinetS36.apply(this, arguments); } finally { s36Restore(keys); }
};

// ---- 5) Lower House: neta kharido + mantrimandal badlo ----
const S36_START_FUND = 300;

function s36Rec() { return s34GetHouse(); }
function s36Save(rec) { try { localStorage.setItem(S34_HOUSE_KEY, JSON.stringify(rec)); } catch (e) {} }

const _s34SaveHouseS36 = s34SaveHouse;
s34SaveHouse = function () {
    _s34SaveHouseS36.apply(this, arguments);
    try {
        const r = s34GetHouse();
        if (r) { r.fund = S36_START_FUND; r.bought = []; s36Save(r); }
    } catch (e) {}
};

function s36Sheet(html) {
    let el = document.getElementById('s36-sheet');
    if (!el) { el = document.createElement('div'); el.id = 's36-sheet'; document.body.appendChild(el); }
    el.innerHTML = '<div class="box">' + html + '</div>';
    el.style.display = 'flex';
}
function s36Close() {
    const el = document.getElementById('s36-sheet');
    if (el) el.style.display = 'none';
}
function s36Refresh() { s36Close(); s34House(); }

function s36Price(rec, l) {
    const n = rec.seats[l.p] || 0;
    return 20 + Math.min(50, Math.round(n * 0.6));
}

function s36BuyList() {
    const r = s36Rec();
    if (!r) return;
    const govSet = {};
    r.gov.forEach(function (p) { govSet[p] = true; });
    const boughtN = {};
    (r.bought || []).forEach(function (b) { boughtN[b.n] = 1; });
    const pool = S34_LEADERS.filter(function (l) { return !govSet[l.p] && l.p !== r.you && !boughtN[l.n] && (r.seats[l.p] || 0) > 0; });
    let h = '<button class="cl" onclick="s36Close()">Band karo</button><h2>Neta Kharido</h2><div class="sub">Khazana: <b>' + (r.fund || 0) + ' Cr</b>. Virodhi aur teesre dal ke neta ko apni party mein laao. 80% chance maanega; na maane to aadha paisa doob jata hai. Kharide gaye neta se ek MP aapko mil jata hai aur wo mantri ban sakta hai.</div>';
    if (!pool.length) h += '<div class="sub">Abhi koi neta khareedne layak nahi bacha.</div>';
    pool.forEach(function (l, i) {
        const cost = s36Price(r, l), ok = (r.fund || 0) >= cost;
        h += '<div class="row" style="--c:' + (partyColors[l.p] || '#64748b') + '"><div class="t"><b>' + esc(l.n) + '</b><small>' + esc(l.p) + ' | ' + (r.seats[l.p] || 0) + ' seats</small></div>' +
            '<span>' + cost + ' Cr</span><button class="go"' + (ok ? '' : ' disabled') + ' onclick="s36Buy(' + S34_LEADERS.indexOf(l) + ')">Kharido</button></div>';
    });
    s36Sheet(h);
}

function s36Buy(idx) {
    const r = s36Rec(), l = S34_LEADERS[idx];
    if (!r || !l) return;
    const cost = s36Price(r, l);
    if ((r.fund || 0) < cost) { alert('Khazana kam hai.'); return; }
    let msg;
    if (Math.random() < 0.8) {
        r.fund -= cost;
        r.seats[l.p] = Math.max(0, (r.seats[l.p] || 0) - 1);
        r.seats[r.you] = (r.seats[r.you] || 0) + 1;
        r.bought = r.bought || [];
        r.bought.push({ n: l.n, from: l.p });
        msg = l.n + ' (' + l.p + ') aapki party mein aa gaye! ' + cost + ' Cr kharch.';
    } else {
        const lost = Math.round(cost / 2);
        r.fund -= lost;
        msg = l.n + ' nahi maane. ' + lost + ' Cr doob gaye.';
    }
    s36Save(r);
    s36Refresh();
    try { s33Toast(msg, 'good'); } catch (e) { alert(msg); }
    s36BuyList();
}

function s36Candidates(r) {
    const used = {};
    used[r.pm.name] = 1;
    r.cab.forEach(function (c) { used[c.name] = 1; });
    const govSet = {};
    r.gov.forEach(function (p) { govSet[p] = true; });
    const out = [];
    (r.bought || []).forEach(function (b) { if (!used[b.n]) { used[b.n] = 1; out.push({ name: b.n, party: r.you, tag: 'Kharida hua (' + b.from + ' se)' }); } });
    S34_LEADERS.forEach(function (l) { if (govSet[l.p] && !used[l.n]) { used[l.n] = 1; out.push({ name: l.n, party: l.p, tag: 'Bada neta' }); } });
    const parties = Object.keys(r.seats).filter(function (p) { return govSet[p] && r.seats[p] > 0; });
    for (let i = 0; i < 6 && parties.length; i++) {
        let nm = randName(), g = 0;
        while (used[nm] && g++ < 30) nm = randName();
        used[nm] = 1;
        out.push({ name: nm, party: parties[i % parties.length], tag: 'Naya chehra' });
    }
    return out;
}

function s36Cabinet() {
    const r = s36Rec();
    if (!r) return;
    let h = '<button class="cl" onclick="s36Close()">Band karo</button><h2>Mantrimandal Badlo</h2><div class="sub">Kisi mantralaya par dabao, phir naya mantri chuno. Purana mantri hat jayega.</div>';
    r.cab.forEach(function (c, i) {
        h += '<div class="row" style="--c:' + (partyColors[c.party] || '#64748b') + '"><div class="t"><small>' + esc(c.min) + '</small><b>' + esc(c.name) + '</b><small>' + esc(c.party) + '</small></div>' +
            '<button class="go" onclick="s36PickMin(' + i + ')">Badlo</button></div>';
    });
    s36Sheet(h);
}

function s36PickMin(i) {
    const r = s36Rec();
    if (!r) return;
    const cands = s36Candidates(r);
    window.s36Cands = cands;
    let h = '<button class="cl" onclick="s36Cabinet()">&larr; Wapas</button><h2>' + esc(r.cab[i].min) + '</h2><div class="sub">Abhi: ' + esc(r.cab[i].name) + '. Naya mantri chuno:</div>';
    cands.forEach(function (c, j) {
        h += '<div class="row" style="--c:' + (partyColors[c.party] || '#64748b') + '"><div class="t"><b>' + esc(c.name) + '</b><small>' + esc(c.party) + ' | ' + esc(c.tag) + '</small></div>' +
            '<button class="go" onclick="s36SetMin(' + i + ',' + j + ')">Banao</button></div>';
    });
    s36Sheet(h);
}

function s36SetMin(i, j) {
    const r = s36Rec(), c = (window.s36Cands || [])[j];
    if (!r || !c) return;
    r.cab[i].name = c.name;
    r.cab[i].party = c.party;
    s36Save(r);
    s34House();
    s36Cabinet();
}

function s36HouseTools() {
    const r = s36Rec();
    const el = document.getElementById('s34-house');
    if (!r || !el) return;
    if (typeof r.fund !== 'number') { r.fund = S36_START_FUND; r.bought = r.bought || []; s36Save(r); }
    const head = el.querySelector('.s30-head');
    if (!head || head.querySelector('.s36-bar')) return;
    const bar = document.createElement('div');
    bar.className = 's36-bar';
    bar.innerHTML = '<span class="s36-fund">Khazana: ' + r.fund + ' Cr</span>' +
        '<button class="s36-btn o" onclick="s36BuyList()">Neta Kharido</button>' +
        '<button class="s36-btn" onclick="s36Cabinet()">Mantrimandal Badlo</button>';
    head.appendChild(bar);
}
const _s34HouseS36 = s34House;
s34House = function () {
    _s34HouseS36.apply(this, arguments);
    try { s36HouseTools(); } catch (e) { console.warn('house tools', e); }
};

// ================= STAGE 37: UPPER HOUSE (RAJYA SABHA) - khelne layak chunav + parliament naqsha =================
// Data approx hai (vidhan sabha ki taqat ka andaza). Baad mein asli data se badal sakte ho: S37_RS mein [Rajya Sabha seats, {dal: vidhayak share %}]
const S37_KEY = 'rajniti_upper_v1';
const S37_NOMINATED = 12;           // Raashtrapati ke manonit sadasya
const S37_MAJ = 123;                // 245 mein bahumat
const S37_START_FUND = 700;         // Cr
const S37_CYCLE_FUND = 400;         // har naye chunav par milne wala paisa

const S37_RS = {
    'Uttar Pradesh': [31, { 'BJP': 52, 'Samajwadi Party': 33, 'Apna Dal (S)': 3, 'RLD': 3, 'Congress': 2, 'BSP': 1, 'Others': 6 }],
    'Maharashtra': [19, { 'BJP': 46, 'Shiv Sena': 20, 'NCP (Ajit Pawar)': 14, 'Shiv Sena (UBT)': 7, 'Congress': 6, 'NCP (SP)': 3, 'Others': 4 }],
    'Tamil Nadu': [18, { 'DMK': 57, 'AIADMK': 28, 'Congress': 7, 'BJP': 3, 'Others': 5 }],
    'West Bengal': [16, { 'TMC': 72, 'BJP': 22, 'Others': 6 }],
    'Bihar': [16, { 'BJP': 37, 'JD(U)': 35, 'LJP (RV)': 8, 'HAM': 2, 'RJD': 10, 'Congress': 3, 'AIMIM': 2, 'Others': 3 }],
    'Karnataka': [12, { 'Congress': 61, 'BJP': 29, 'JD(S)': 9, 'Others': 1 }],
    'Andhra Pradesh': [11, { 'TDP': 77, 'Jana Sena': 12, 'BJP': 5, 'YSRCP': 6 }],
    'Gujarat': [11, { 'BJP': 86, 'Congress': 9, 'AAP': 3, 'Others': 2 }],
    'Madhya Pradesh': [11, { 'BJP': 71, 'Congress': 28, 'Others': 1 }],
    'Rajasthan': [10, { 'BJP': 57, 'Congress': 35, 'Others': 8 }],
    'Odisha': [10, { 'BJP': 53, 'BJD': 35, 'Congress': 10, 'Others': 2 }],
    'Kerala': [9, { 'CPI(M)': 62, 'Congress': 22, 'IUML': 10, 'Others': 6 }],
    'Telangana': [7, { 'Congress': 54, 'BRS': 33, 'BJP': 7, 'AIMIM': 6 }],
    'Assam': [7, { 'BJP': 48, 'AGP': 7, 'Congress': 21, 'AIUDF': 10, 'Others': 14 }],
    'Punjab': [7, { 'AAP': 79, 'Congress': 15, 'SAD': 3, 'BJP': 2, 'Others': 1 }],
    'Jharkhand': [6, { 'JMM': 42, 'Congress': 20, 'RJD': 5, 'CPI(ML)L': 3, 'BJP': 26, 'Others': 4 }],
    'Chhattisgarh': [5, { 'BJP': 60, 'Congress': 39, 'Others': 1 }],
    'Haryana': [5, { 'BJP': 53, 'Congress': 41, 'Others': 6 }],
    'Jammu & Kashmir': [4, { 'National Conference': 47, 'BJP': 32, 'Congress': 7, 'Others': 14 }],
    'Delhi': [3, { 'BJP': 69, 'AAP': 31 }],
    'Uttarakhand': [3, { 'BJP': 67, 'Congress': 27, 'Others': 6 }],
    'Himachal Pradesh': [3, { 'Congress': 59, 'BJP': 37, 'Others': 4 }],
    'Goa': [1, { 'BJP': 70, 'Congress': 10, 'Others': 20 }],
    'Manipur': [1, { 'BJP': 53, 'NPP': 10, 'Congress': 8, 'NPF': 8, 'Others': 21 }],
    'Meghalaya': [1, { 'NPP': 52, 'Congress': 8, 'TMC': 8, 'Others': 32 }],
    'Tripura': [1, { 'BJP': 55, 'Tipra Motha': 22, 'CPI(M)': 18, 'Others': 5 }],
    'Nagaland': [1, { 'NDPP': 42, 'BJP': 20, 'NPF': 10, 'Others': 28 }],
    'Mizoram': [1, { 'ZPM': 67, 'MNF': 25, 'Congress': 5, 'Others': 3 }],
    'Sikkim': [1, { 'SKM': 97, 'Others': 3 }],
    'Arunachal Pradesh': [1, { 'BJP': 77, 'NPP': 8, 'Congress': 5, 'Others': 10 }],
    'Puducherry': [1, { 'AINRC': 40, 'DMK': 25, 'BJP': 20, 'Congress': 10, 'Others': 5 }]
};
const S37_NDA = ['BJP', 'JD(U)', 'TDP', 'Jana Sena', 'Shiv Sena', 'NCP (Ajit Pawar)', 'LJP (RV)', 'HAM', 'RLD', 'Apna Dal (S)', 'AGP', 'NPP', 'NDPP', 'NPF', 'SKM', 'JD(S)', 'Tipra Motha', 'AINRC'];
const S37_INDIA = ['Congress', 'Samajwadi Party', 'DMK', 'RJD', 'JMM', 'NCP (SP)', 'Shiv Sena (UBT)', 'National Conference', 'IUML', 'CPI(M)', 'CPI(ML)L', 'TMC'];
const S37_EXTRA_COL = {
    'TMC': '#16a34a', 'DMK': '#dc2626', 'AIADMK': '#15803d', 'JD(U)': '#059669', 'RJD': '#15803d', 'TDP': '#facc15', 'Jana Sena': '#ef4444',
    'YSRCP': '#2563eb', 'BJD': '#16a34a', 'BRS': '#ec4899', 'Shiv Sena': '#fb923c', 'Shiv Sena (UBT)': '#f97316', 'NCP (Ajit Pawar)': '#0ea5e9',
    'NCP (SP)': '#38bdf8', 'JMM': '#22c55e', 'CPI(M)': '#b91c1c', 'IUML': '#65a30d', 'JD(S)': '#4ade80', 'LJP (RV)': '#a855f7', 'HAM': '#14b8a6',
    'RLD': '#84cc16', 'Apna Dal (S)': '#f59e0b', 'National Conference': '#dc2626', 'AAP': '#06b6d4', 'AIMIM': '#16a34a', 'Others': '#94a3b8',
    'SAD': '#1d4ed8', 'AGP': '#0891b2', 'AIUDF': '#0d9488', 'NPP': '#7c3aed', 'NPF': '#0369a1', 'NDPP': '#be185d', 'Manonit': '#facc15'
};

// ---------- chhote helper (pure logic) ----------
function s37Col(p) {
    if (p === 'Manonit') return '#facc15';
    if (typeof partyColors !== 'undefined' && partyColors[p] && p !== 'Others') return partyColors[p];
    if (S37_EXTRA_COL[p]) return S37_EXTRA_COL[p];
    let h = 0; for (let i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) % 360;
    return 'hsl(' + h + ',55%,52%)';
}
function s37Hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
function s37Rnd(a, b) { return a + Math.random() * (b - a); }
function s37Alloc(shares, k) {              // D'Hondt: k seat dalon mein baanto
    const won = {}, out = [];
    for (let i = 0; i < k; i++) {
        let best = null, bv = -1;
        Object.keys(shares).forEach(function (p) {
            const v = shares[p] / ((won[p] || 0) + 1);
            if (v > bv) { bv = v; best = p; }
        });
        if (best === null) break;
        won[best] = (won[best] || 0) + 1;
        out.push(best);
    }
    return out;
}
function s37Shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
// 'pts' point un dalon se lekar jo isTake(p) true hain, 'to' dal ko do
function s37Shift(sh, to, pts, isTake) {
    const keys = Object.keys(sh).filter(function (p) { return p !== to && isTake(p) && sh[p] > 0; });
    const pool = keys.reduce(function (a, p) { return a + sh[p]; }, 0);
    if (pool <= 0) return 0;
    const take = Math.min(pts, pool);
    keys.forEach(function (p) { sh[p] -= take * sh[p] / pool; });
    sh[to] = (sh[to] || 0) + take;
    return take;
}
function s37IsUp(stateName, idx, cycle) { return ((idx + s37Hash(stateName)) % 3) === (cycle % 3); }
function s37Counts(ub) {
    const c = {};
    Object.keys(ub.states).forEach(function (n) { ub.states[n].holders.forEach(function (p) { c[p] = (c[p] || 0) + 1; }); });
    return c;
}
function s37Sets(ub) {
    const rec = (typeof s34GetHouse === 'function') ? s34GetHouse() : null;
    const you = ub.pick || (rec && rec.you) || ub.you || 'BJP';
    const useRec = rec && (!ub.pick || ub.pick === rec.you);
    const opp = (useRec && rec.opp) || (S37_NDA.indexOf(you) >= 0 ? 'Congress' : 'BJP');
    const ys = {}, os = {};
    ys[you] = 1;
    if (useRec && rec.gov) rec.gov.forEach(function (p) { ys[p] = 1; });
    if (S37_NDA.indexOf(you) >= 0) S37_NDA.forEach(function (p) { ys[p] = 1; });
    else if (S37_INDIA.indexOf(you) >= 0) S37_INDIA.forEach(function (p) { ys[p] = 1; });
    os[opp] = 1;
    if (S37_NDA.indexOf(opp) >= 0) S37_NDA.forEach(function (p) { os[p] = 1; });
    else if (S37_INDIA.indexOf(opp) >= 0) S37_INDIA.forEach(function (p) { os[p] = 1; });
    Object.keys(ys).forEach(function (p) { delete os[p]; });
    return { you: you, opp: opp, ys: ys, os: os, hasRec: !!rec };
}
function s37Side(sets, p) { return sets.ys[p] ? 'you' : (sets.os[p] ? 'opp' : 'neu'); }

function s37NewUb(you) {
    const ub = { you: you, cycle: 0, year: 2026, fund: S37_START_FUND, fundV2: 1, states: {}, acts: {}, support: {}, last: null };
    Object.keys(S37_RS).forEach(function (n) {
        const d = S37_RS[n];
        ub.states[n] = { n: d[0], sh: Object.assign({}, d[1]), holders: s37Shuffle(s37Alloc(d[1], d[0])) };
    });
    return ub;
}
function s37Predict(st, upN) {             // is state mein is baar ka andaza (shares ke hisaab se)
    return s37Alloc(st.sh, upN);
}

// ---------- ek chunav chalao ----------
function s37RunElection(ub, sets) {
    const rows = [];
    const before = s37Counts(ub);
    const oppMain = sets.opp;
    Object.keys(ub.states).forEach(function (name) {
        const st = ub.states[name];
        const idxs = [];
        st.holders.forEach(function (p, i) { if (s37IsUp(name, i, ub.cycle)) idxs.push(i); });
        if (!idxs.length) return;
        const sh = Object.assign({}, st.sh);
        let news = '';
        if (Math.random() < 0.3) {          // virodhi ki sendh
            const got = s37Shift(sh, oppMain, 5, function (p) { return sets.ys[p]; });
            if (got > 0) news = 'Virodhi ne ' + name + ' mein sendh lagayi.';
        }
        Object.keys(sh).forEach(function (p) { sh[p] *= s37Rnd(0.92, 1.08); });
        const res = s37Alloc(sh, idxs.length);
        const old = idxs.map(function (i) { return st.holders[i]; });
        idxs.forEach(function (i, j) { st.holders[i] = res[j]; });
        const tally = {};
        res.forEach(function (p) { tally[p] = (tally[p] || 0) + 1; });
        rows.push({ name: name, up: idxs.length, tally: tally, old: old, news: news });
        st.sh = sh;                        // asar agle chunav tak bana rahe
    });
    ub.last = { cycle: ub.cycle, year: ub.year, before: before };
    return rows;
}
function s37Verdict(ub, sets) {
    const c = s37Counts(ub);
    let you = 0, opp = 0, neu = 0, sup = 0;
    Object.keys(c).forEach(function (p) {
        const s = s37Side(sets, p);
        if (s === 'you') you += c[p]; else if (s === 'opp') opp += c[p]; else { neu += c[p]; if (ub.support[p]) sup += c[p]; }
    });
    you += S37_NOMINATED;                   // manonit sadasya sarkar ki taraf
    const total = you + opp + neu;
    let text, cls;
    if (you >= S37_MAJ) { text = 'Upper House mein aapka poora bahumat!'; cls = 'g'; }
    else if (you + sup >= S37_MAJ) { text = 'Samarthan dalon ki madad se bahumat (kamzor).'; cls = 'y'; }
    else { text = 'Upper House mein bahumat nahi. Bill atak sakte hain.'; cls = 'r'; }
    return { you: you, opp: opp, neu: neu, sup: sup, total: total, text: text, cls: cls, withSup: you + sup };
}

// ---------- save / load ----------
const S37 = { view: 'home', rows: null, shown: 0, timer: null, ub: null, msg: '' };
function s37Load() {
    try {
        const u = JSON.parse(localStorage.getItem(S37_KEY));
        if (u && !u.fundV2) { u.fund = (u.fund || 0) + 450; u.fundV2 = 1; }   // purane save ko bhi badha hua fund
        return u;
    } catch (e) { return null; }
}
function s37Save() { try { if (S37.ub) localStorage.setItem(S37_KEY, JSON.stringify(S37.ub)); } catch (e) {} s37Badge(); }

function s37Badge() {
    const hb = document.querySelectorAll('#main-dashboard .house-btn')[1];
    if (!hb) return;
    const ub = S37.ub || s37Load();
    if (!ub) { hb.innerHTML = '<span>UPPER HOUSE</span><small>Naya Rajya Sabha shuru karo</small>'; return; }
    const v = s37Verdict(ub, s37Sets(ub));
    hb.innerHTML = '<span>UPPER HOUSE</span><small>Aapke ' + v.you + ' / ' + v.total + ' | ' + (v.you >= S37_MAJ ? 'bahumat' : 'bahumat nahi') + '</small>';
}

// ---------- CSS ----------
function s37Style() {
    if (document.getElementById('s37-css')) return;
    const st = document.createElement('style');
    st.id = 's37-css';
    st.textContent = `
.s37-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:22px;flex:1;min-height:0;}
.s37-list{overflow-y:auto;max-height:calc(100vh - 150px);padding-right:6px;}
.s37-st{background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:12px 14px;margin-bottom:10px;animation:s34In .4s both;}
.s37-st .h{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:1rem;}
.s37-st .h span{font-size:.78rem;color:#94a3b8;}
.s37-bar{display:flex;height:10px;border-radius:6px;overflow:hidden;margin:8px 0 6px;background:#1e293b;}
.s37-bar i{display:block;height:100%;}
.s37-st .p{font-size:.8rem;color:#cbd5e1;margin-bottom:8px;}
.s37-act{display:flex;gap:8px;flex-wrap:wrap;}
.s37-b{border:0;border-radius:12px;padding:8px 12px;font-weight:700;font-size:.8rem;color:#fff;cursor:pointer;background:linear-gradient(135deg,#d98e2b,#2563eb);}
.s37-b.o{background:linear-gradient(135deg,#ea580c,#dc2626);}
.s37-b.g{background:linear-gradient(135deg,#16a34a,#65a30d);}
.s37-b:disabled{opacity:.4;cursor:not-allowed;}
.s37-panel{background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.18);border-radius:24px;padding:16px;}
.s37-panel h3{margin:0 0 8px;font-size:.85rem;letter-spacing:3px;color:#94a3b8;}
.s37-chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;}
.s37-chip{padding:8px 14px;border-radius:14px;background:rgba(255,255,255,.08);font-size:.85rem;}
.s37-chip b{font-size:1.3rem;display:block;color:#fff;}
.s37-verdict{padding:12px 16px;border-radius:14px;font-weight:800;margin:10px 0;}
.s37-verdict.g{background:rgba(34,197,94,.18);color:#86efac;}
.s37-verdict.y{background:rgba(250,204,21,.16);color:#fde68a;}
.s37-verdict.r{background:rgba(239,68,68,.18);color:#fca5a5;}
.s37-fund{color:#fde68a;font-weight:800;font-size:1.1rem;}
.s37-msg{background:rgba(56,189,248,.14);border:1px solid rgba(56,189,248,.4);color:#bae6fd;border-radius:12px;padding:8px 12px;margin:8px 0;font-size:.85rem;}
.s37-row{display:flex;align-items:center;gap:10px;padding:9px 12px;margin-bottom:6px;border-radius:12px;background:rgba(255,255,255,.07);animation:s34In .35s both;}
.s37-row .n{min-width:120px;font-weight:700;}
.s37-dots{display:flex;flex-wrap:wrap;gap:6px;flex:1;}
.s37-dots span{display:inline-flex;align-items:center;gap:4px;font-size:.78rem;padding:2px 8px;border-radius:10px;background:rgba(0,0,0,.25);}
.s37-dots i{width:9px;height:9px;border-radius:50%;display:inline-block;}
.s37-sup{display:flex;align-items:center;gap:8px;padding:7px 10px;margin-bottom:6px;border-radius:12px;background:rgba(255,255,255,.07);font-size:.85rem;}
.s37-sup .t{flex:1;}
@media(max-width:900px){.s37-grid,.s34-parl{grid-template-columns:1fr;}.s37-list{max-height:none;}}
`;
    document.head.appendChild(st);
}

// ---------- frame ----------
function s37El() {
    let el = document.getElementById('s37-upper');
    if (!el) { el = document.createElement('div'); el.id = 's37-upper'; el.className = 's30-full hidden'; document.body.appendChild(el); }
    return el;
}
function s37Close() {
    if (S37.timer) { clearInterval(S37.timer); S37.timer = null; }
    s37El().classList.add('hidden');
    s37Badge();
}
function s37Frame(title, sub, body) {
    return '<div class="s34-top"></div><div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap">' +
        '<div class="s30-head"><button class="s30-back" onclick="s37Close()">&larr; Wapas</button><div><h1>' + esc(title) + '</h1><p>' + esc(sub) + '</p></div></div>' + body + '</div>';
}
function s37Show(html) {
    const el = s37El();
    el.innerHTML = html;
    el.classList.remove('hidden');
}

function s37Ordered(ub, sets) {
    const c = s37Counts(ub), you = [], opp = [], neu = [];
    Object.keys(c).forEach(function (p) {
        const side = s37Side(sets, p), r = [p, c[p], s37Col(p)];
        if (side === 'you') you.push(r); else if (side === 'opp') opp.push(r); else neu.push(r);
    });
    const by = function (a, b) { return b[1] - a[1]; };
    you.sort(by); opp.sort(by); neu.sort(by);
    return you.concat([['Manonit', S37_NOMINATED, '#facc15']], neu, opp);
}
function s37Hemi(ub, sets) {
    const ord = s37Ordered(ub, sets);
    const legend = ord.filter(function (r) { return r[1] > 0; }).map(function (r) {
        const side = r[0] === 'Manonit' ? 'you' : s37Side(sets, r[0]);
        return '<span><i style="background:' + r[2] + '"></i>' + esc(r[0]) + ' <b>' + r[1] + '</b>' + (side === 'you' ? ' *' : '') + '</span>';
    }).join('');
    return '<div class="s34-hemi">' + s34Hemi(ord, 245) + '<div class="s34-legend">' + legend + '</div><div class="s34-legend" style="margin-top:4px">* aapka gathbandhan (manonit sadasya sarkar ke saath)</div></div>';
}

// ---------- views ----------
// ---- khel ke asli state natije (State Assembly + Career MLA) se Rajya Sabha / Rashtrapati ka hisaab ----
function s37GameShares(name) {
    let out = null;
    try {
        const all = JSON.parse(localStorage.getItem('rajniti_state_results') || '{}');
        const r = all[name] || all[name.replace(' & ', ' and ')] || all[name.replace(' and ', ' & ')];
        if (r && r.total) { out = {}; Object.keys(r.seats).forEach(function (p) { out[p] = r.seats[p] / r.total; }); }
    } catch (e) {}
    try {
        if (!out && window.CareerMode && CareerMode.mlaCount) {
            const m = CareerMode.mlaCount(name);
            if (m && m.n > 0 && m.total) { out = {}; out[m.party] = Math.min(0.9, m.n / m.total); out['Others'] = 1 - out[m.party]; }
        }
    } catch (e) {}
    return out;
}
function s37Blend(ub) {
    if (!ub || !ub.states) return;
    ub.blend = ub.blend || {};
    Object.keys(ub.states).forEach(function (n) {
        const g = s37GameShares(n); if (!g) return;
        const key = JSON.stringify(g); if (ub.blend[n] === key) return;
        const st = ub.states[n], old = st.sh, t0 = Object.keys(old).reduce(function (a, p) { return a + old[p]; }, 0) || 1, sh = {};
        Object.keys(old).forEach(function (p) { sh[p] = old[p] / t0 * 0.3; });
        Object.keys(g).forEach(function (p) { sh[p] = (sh[p] || 0) + g[p] * 0.7; });
        st.sh = sh; st.holders = s37Shuffle(s37Alloc(sh, st.n)); ub.blend[n] = key;
    });
    s37Save();
}
function s37MiniShares(sh) {
    const tot = Object.keys(sh).reduce(function (a, p) { return a + sh[p]; }, 0) || 1;
    return '<div class="s37-mini">' + Object.keys(sh).sort(function (a, b) { return sh[b] - sh[a]; }).slice(0, 4).map(function (p) {
        return '<div class="r">' + s22Logo(p, 22) + '<span>' + esc(p) + '</span><div class="bx"><i style="width:' + Math.max(3, sh[p] / tot * 100).toFixed(1) + '%;background:' + s37Col(p) + '"></i></div><b>' + Math.round(sh[p] / tot * 100) + '%</b></div>';
    }).join('') + '</div>';
}
function s37PartyPick() {
    const ub = S37.ub; s37Blend(ub);
    const cnt = {}, per = {};
    Object.keys(ub.states).forEach(function (n) { ub.states[n].holders.forEach(function (p) { cnt[p] = (cnt[p] || 0) + 1; per[p] = per[p] || {}; per[p][n] = (per[p][n] || 0) + 1; }); });
    const names = Object.keys(cnt);
    try { if (window.CareerMode && CareerMode.hasParty()) { const cp = CareerMode.getParty().name; if (names.indexOf(cp) < 0) names.push(cp); } } catch (e) {}
    names.sort(function (a, b) { return (cnt[b] || 0) - (cnt[a] || 0); });
    const rows = names.map(function (p, i) {
        const top = Object.keys(per[p] || {}).sort(function (a, b) { return per[p][b] - per[p][a]; }).slice(0, 4).map(function (n) { return esc(n) + ' ' + per[p][n]; }).join(' | ');
        return '<div class="s37-st s37-prow' + (ub.pick === p ? ' sel' : '') + '" data-p="' + esc(p) + '" onclick="s37PickParty(this.dataset.p)" style="border-left:5px solid ' + s37Col(p) + ';cursor:pointer;animation:s34In .4s both;animation-delay:' + (i * 0.03) + 's"><div style="display:flex;align-items:center;gap:12px">' + s22Logo(p, 46) + '<div style="flex:1;min-width:0"><b>' + esc(p) + '</b><br><small style="color:#94a3b8">' + (top || 'Abhi Rajya Sabha mein seat nahi') + '</small></div><div style="text-align:right"><b style="font-size:1.9rem">' + (cnt[p] || 0) + '</b><br><small style="color:#94a3b8">seat</small></div></div></div>';
    }).join('');
    s37Show(s37Frame('Party chuno', 'Kis party ke taur par Rajya Sabha chunav ladna hai?', '<div class="s37-panel"><h3>RAJYA SABHA MEIN KISKI KITNI SEAT (245)</h3><p style="color:#cbd5e1;font-size:.88rem;margin:0 0 10px">Jis party ke jis state mein zyada vidhayak hain, wahan se use zyada seat milti hain. Kisi party par dabao.</p>' + rows + '</div>'));
}
function s37PickParty(p) { S37.ub.pick = p; S37.ub.you = p; s37Save(); S37.view = 'prep'; S37.msg = ''; s37Render(); }
function s37Open() {
    s34Style(); s37Style();
    S37.ub = S37.ub || s37Load();
    if (!S37.ub) {
        const rec = s34GetHouse();
        if (rec && rec.you) { S37.ub = s37NewUb(rec.you); s37Save(); }
        else { s37Setup(); return; }
    }
    if (S37.ub) s37Blend(S37.ub);
    S37.view = 'home';
    s37Render();
}
function s37Setup() {
    let opts = ['BJP', 'Congress', 'Samajwadi Party', 'TMC', 'DMK', 'AAP', 'JD(U)', 'TDP', 'RJD', 'Shiv Sena (UBT)'];
    try { if (typeof PARTY_DB !== 'undefined') opts = Object.keys(PARTY_DB); if (window.CareerMode && CareerMode.hasParty && CareerMode.hasParty()) opts.unshift(CareerMode.getParty().name); } catch (e) {}
    s37Show(s37Frame('Rajya Sabha (Upper House)', 'Pehle apni party chuno', '<div class="s37-panel" style="max-width:520px;margin:20px auto"><h3>PARTY CHUNO</h3>' +
        '<p style="color:#cbd5e1">Lok Sabha ki sarkar abhi nahi bani, isliye yahan se party chunkar seedha Upper House khel sakte ho.</p>' +
        '<select id="s37-pick" style="width:100%;padding:10px;border-radius:10px;font-size:1rem">' + opts.map(function (p) { return '<option>' + esc(p) + '</option>'; }).join('') + '</select>' +
        '<div style="margin-top:14px"><button class="s30-btn go" onclick="s37Start()">SHURU KARO</button></div></div>'));
}
function s37Start() {
    const p = document.getElementById('s37-pick').value;
    S37.ub = s37NewUb(p);
    s37Save();
    S37.view = 'home';
    s37Render();
}
function s37Reset() {
    if (!confirm('Naya Upper House shuru karein? Purana khatam ho jayega.')) return;
    try { localStorage.removeItem(S37_KEY); } catch (e) {}
    S37.ub = null;
    s37Open();
}

function s37Render() {
    const ub = S37.ub;
    if (!ub) return s37Open();
    if (S37.view === 'party') return s37PartyPick();
    if (S37.view === 'prep') return s37Prep();
    if (S37.view === 'count') return s37Count();
    if (S37.view === 'final') return s37Final();
    return s37Home();
}

function s37Home() {
    if (S37.ub && S37.ub.last && S37.ub.last.cycle === S37.ub.cycle) { const u = S37.ub; u.cycle++; u.year += 2; u.fund += S37_CYCLE_FUND; u.acts = {}; u.support = {}; s37Save(); }
    const ub = S37.ub, sets = s37Sets(ub), v = s37Verdict(ub, sets);
    const body = '<div class="s34-parl">' + s37Hemi(ub, sets) +
        '<div class="s37-panel"><h3>UPPER HOUSE ABHI</h3>' +
        '<div style="text-align:center"><b style="font-size:2.4rem;color:#fff">' + v.you + '</b> <span style="color:#94a3b8">/ 245 aapke saath | bahumat ' + S37_MAJ + '</span></div>' +
        s37SupPanel(ub, sets) + '<div class="s37-verdict ' + v.cls + '">' + esc(v.text) + '</div>' +
        '<div class="s37-chips"><div class="s37-chip">Aapka<b style="color:#4ade80">' + v.you + '</b></div><div class="s37-chip">Virodhi<b style="color:#f87171">' + v.opp + '</b></div><div class="s37-chip">Tatastha<b style="color:#93c5fd">' + v.neu + '</b></div></div>' +
        '<p style="color:#cbd5e1;font-size:.88rem">Har 2 saal mein lagbhag ek tihai seat ka chunav hota hai. Vidhayak vote dete hain. Aap cross-voting, star ummeedwar aur tatastha dalon ke samarthan se seat badha sakte ho.</p>' +
        '<div class="s37-fund">Khazana: ' + Math.round(ub.fund) + ' Cr</div>' +
        '<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="s30-btn go" onclick="s37GoPrep()">CHUNAV SHURU KARO (' + ub.year + ')</button><button class="s30-btn ghost sm" onclick="s37Reset()">Naya Upper House</button></div></div></div>';
    s37Show(s37Frame('Rajya Sabha (Upper House)', 'Saal ' + ub.year + ' | Chunav chakra ' + (ub.cycle + 1), body));
}
function s37GoPrep() { S37.view = 'party'; S37.msg = ''; s37Render(); }

function s37UpCount(name, ub) { let n = 0; ub.states[name].holders.forEach(function (p, i) { if (s37IsUp(name, i, ub.cycle)) n++; }); return n; }
function s37CostCv(up) { return 10 + 4 * up; }
function s37CostStar(up) { return 6 + 2 * up; }

function s37Prep() {
    const ub = S37.ub, sets = s37Sets(ub);
    const keep = document.querySelector('#s37-upper .s37-list');
    const top = keep ? keep.scrollTop : 0;
    let cards = '', totalUp = 0, predYou = 0;
    Object.keys(ub.states).forEach(function (name) {
        const up = s37UpCount(name, ub);
        if (!up) return;
        totalUp += up;
        const st = ub.states[name], a = ub.acts[name] || {};
        let sy = 0, so = 0, sn = 0;
        Object.keys(st.sh).forEach(function (p) { const s = s37Side(sets, p); if (s === 'you') sy += st.sh[p]; else if (s === 'opp') so += st.sh[p]; else sn += st.sh[p]; });
        const tot = (sy + so + sn) || 1;
        const pred = s37Predict(st, up).filter(function (p) { return sets.ys[p]; }).length;
        predYou += pred;
        const cv = s37CostCv(up), sr = s37CostStar(up);
        cards += '<div class="s37-st"><div class="h"><b>' + esc(name) + '</b><span>' + up + ' seat ka chunav</span></div>' +
            '<div class="s37-bar"><i style="width:' + (sy / tot * 100).toFixed(1) + '%;background:#22c55e"></i><i style="width:' + (sn / tot * 100).toFixed(1) + '%;background:#64748b"></i><i style="width:' + (so / tot * 100).toFixed(1) + '%;background:#ef4444"></i></div>' +
            '<div class="p">Vidhayakon mein aap ' + Math.round(sy / tot * 100) + '% | Andaza: aapko ' + pred + ' / ' + up + ' seat</div>' + s37MiniShares(st.sh) +
            '<div class="s37-act"><button class="s37-b o"' + (a.cv || ub.fund < cv ? ' disabled' : '') + ' onclick="s37Cross(\'' + esc(name).replace(/'/g, "\\'") + '\')">' + (a.cv ? 'Cross-voting ho chuki' : 'Cross-voting (' + cv + ' Cr)') + '</button>' +
            '<button class="s37-b g"' + (a.star || ub.fund < sr ? ' disabled' : '') + ' onclick="s37Star(\'' + esc(name).replace(/'/g, "\\'") + '\')">' + (a.star ? 'Ummeedwar utar chuka' : 'Star ummeedwar (' + sr + ' Cr)') + '</button></div></div>';
    });
    const c = s37Counts(ub);
    let sup = '';
    Object.keys(c).filter(function (p) { return s37Side(sets, p) === 'neu' && c[p] >= 2; }).sort(function (a, b) { return c[b] - c[a]; }).forEach(function (p) {
        const cost = 20 + 2 * c[p], done = ub.support[p];
        sup += '<div class="s37-sup"><i style="width:10px;height:10px;border-radius:50%;background:' + s37Col(p) + ';display:inline-block"></i><span class="t"><b>' + esc(p) + '</b> (' + c[p] + ' seat)</span>' +
            '<button class="s37-b"' + (done || ub.fund < cost ? ' disabled' : '') + ' onclick="s37Support(\'' + esc(p).replace(/'/g, "\\'") + '\')">' + (done ? 'Saath hain' : 'Manao ' + cost + ' Cr') + '</button></div>';
    });
    const body = '<div class="s37-grid"><div class="s37-list">' + cards + '</div><div><div class="s37-panel"><h3>RANN-NEETI</h3>' +
        '<div class="s37-fund">Khazana: ' + Math.round(ub.fund) + ' Cr</div>' +
        '<p style="color:#cbd5e1;font-size:.85rem;margin:6px 0">Is baar kul ' + totalUp + ' seat. Andaza: aapko ~' + predYou + '.<br><b>Cross-voting</b>: 70% safal (virodhi vidhayak aapko vote denge), 30% pakde gaye to nuksan. <b>Star ummeedwar</b>: pakka chhota fayda.</p>' +
        (S37.msg ? '<div class="s37-msg">' + esc(S37.msg) + '</div>' : '') +
        '' +
        '<div style="margin-top:14px"><button class="s30-btn go" onclick="s37GoCount()">VOTING SHURU KARO</button></div></div></div></div>';
    s37Show(s37Frame('Rajya Sabha Chunav ' + ub.year, 'Vidhayak vote denge. Pehle rann-neeti, phir counting.', body));
    const nl = document.querySelector('#s37-upper .s37-list');
    if (nl) nl.scrollTop = top;
}

function s37Act(name) { if (!S37.ub.acts[name]) S37.ub.acts[name] = {}; return S37.ub.acts[name]; }
function s37Cross(name) {
    const ub = S37.ub, sets = s37Sets(ub), up = s37UpCount(name, ub), cost = s37CostCv(up), a = s37Act(name);
    if (a.cv || ub.fund < cost) return;
    ub.fund -= cost; a.cv = 1;
    const sh = ub.states[name].sh;
    if (Math.random() < 0.7) {
        const got = s37Shift(sh, sets.you, 8, function (p) { return !sets.ys[p]; });
        S37.msg = name + ': cross-voting safal! Virodhi/tatastha ke ~' + Math.round(got) + ' point vidhayak aapki taraf aaye.';
    } else {
        s37Shift(sh, sets.opp, 4, function (p) { return !!sets.ys[p]; });
        ub.fund = Math.max(0, ub.fund - 5);
        S37.msg = name + ': sauda pakda gaya! Aapko 4 point ka nuksan aur 5 Cr jurmana.';
    }
    s37Save(); s37Prep();
}
function s37Star(name) {
    const ub = S37.ub, sets = s37Sets(ub), up = s37UpCount(name, ub), cost = s37CostStar(up), a = s37Act(name);
    if (a.star || ub.fund < cost) return;
    ub.fund -= cost; a.star = 1;
    s37Shift(ub.states[name].sh, sets.you, 4, function (p) { return !sets.ys[p]; });
    S37.msg = name + ': dumdaar ummeedwar utara, ~4 point ka fayda.';
    s37Save(); s37Prep();
}
function s37Support(p) {
    const ub = S37.ub, c = s37Counts(ub), cost = 20 + 2 * (c[p] || 0);
    if (ub.support[p] || ub.fund < cost) return;
    ub.fund -= cost;
    if (Math.random() < 0.65) { ub.support[p] = 1; S37.msg = p + ' ne aapko samarthan ka bharosa diya!'; }
    else { ub.fund += Math.round(cost / 2); S37.msg = p + ' maane nahi. Aadha paisa wapas mila.'; }
    s37Save(); s37Prep();
}

function s37SupPanel(ub, sets) {
    const c = s37Counts(ub), rows = Object.keys(c).filter(function (p) { return c[p] >= 2 && !(sets.ys && sets.ys[p]) && !(sets.os && sets.os[p]); }).sort(function (a, b) { return c[b] - c[a]; }).slice(0, 8);
    if (!rows.length) return '';
    return '<div class="s37-panel" style="margin-top:12px"><h3>SAHYOG LO (CHUNAV KE BAAD)</h3><p style="color:#cbd5e1;font-size:.86rem;margin:0 0 8px">Vipaksh ko chhodkar baaki dalon se paisa dekar samarthan maango. Jitne zyada seat, utna mehnga.</p>' + rows.map(function (p) {
        const cost = 20 + 2 * c[p], got = ub.support && ub.support[p];
        return '<div class="s37-st" style="display:flex;align-items:center;gap:10px;margin-bottom:6px;border-left:5px solid ' + s37Col(p) + '">' + s22Logo(p, 30) + '<div style="flex:1"><b>' + esc(p) + '</b><br><small style="color:#94a3b8">' + c[p] + ' seat</small></div>' + (got ? '<b style="color:#4ade80">Samarthan mila</b>' : '<button class="s30-btn go sm" data-p="' + esc(p) + '" onclick="s37SupportFinal(this.dataset.p)"' + (ub.fund < cost ? ' disabled' : '') + '>' + cost + ' Cr</button>') + '</div>';
    }).join('') + '<div style="color:#94a3b8;font-size:.8rem;margin-top:6px">Kosh: ' + Math.round(ub.fund) + ' Cr</div></div>';
}
function s37SupportFinal(p) {
    const ub = S37.ub, c = s37Counts(ub), cost = 20 + 2 * (c[p] || 0);
    if (ub.support[p] || ub.fund < cost) return;
    ub.fund -= cost;
    if (Math.random() < 0.65) { ub.support[p] = 1; S37.msg = p + ' ne samarthan diya!'; } else { ub.fund += Math.round(cost / 2); S37.msg = p + ' maane nahi. Aadha paisa wapas.'; }
    s37Save(); s37Final();
}
function s37GoCount() {
    const ub = S37.ub, sets = s37Sets(ub);
    S37.rows = s37RunElection(ub, sets);
    S37.shown = 0;
    S37.view = 'count';
    s37Save();
    s37Count();
    if (S37.timer) clearInterval(S37.timer);
    S37.timer = setInterval(function () {
        S37.shown++;
        if (S37.shown >= S37.rows.length) { clearInterval(S37.timer); S37.timer = null; }
        s37Count();
    }, 450);
}
function s37Skip() { if (S37.timer) { clearInterval(S37.timer); S37.timer = null; } S37.shown = S37.rows.length; s37Count(); }

function s37Count() {
    const ub = S37.ub, sets = s37Sets(ub), rows = S37.rows || [];
    const done = S37.shown >= rows.length;
    let y = 0, o = 0, n = 0, list = '';
    rows.slice(0, S37.shown).forEach(function (r) {
        Object.keys(r.tally).forEach(function (p) { const s = s37Side(sets, p); if (s === 'you') y += r.tally[p]; else if (s === 'opp') o += r.tally[p]; else n += r.tally[p]; });
    });
    rows.slice(0, S37.shown).slice().reverse().forEach(function (r) {
        list += '<div class="s37-row"><span class="n">' + esc(r.name) + '</span><div class="s37-dots">' +
            Object.keys(r.tally).sort(function (a, b) { return r.tally[b] - r.tally[a]; }).map(function (p) { return '<span><i style="background:' + s37Col(p) + '"></i>' + esc(p) + ' ' + r.tally[p] + '</span>'; }).join('') + '</div>' +
            (r.news ? '<small style="color:#fca5a5">' + esc(r.news) + '</small>' : '') + '</div>';
    });
    const body = '<div class="s37-grid"><div class="s37-list">' + (list || '<div class="s30-empty">Ginti shuru ho rahi hai...</div>') + '</div><div class="s37-panel"><h3>GINTI</h3>' +
        '<div class="s37-chips"><div class="s37-chip">Aapko<b style="color:#4ade80">' + y + '</b></div><div class="s37-chip">Virodhi<b style="color:#f87171">' + o + '</b></div><div class="s37-chip">Tatastha<b style="color:#93c5fd">' + n + '</b></div></div>' +
        '<div style="color:#94a3b8;font-size:.85rem">' + S37.shown + ' / ' + rows.length + ' rajyon ki ginti pooree</div>' +
        '<div style="margin-top:14px">' + (done ? '<button class="s30-btn go" onclick="s37GoFinal()">NATIJA DEKHO</button>' : '<button class="s30-btn ghost sm" onclick="s37Skip()">Seedha natija</button>') + '</div></div></div>';
    s37Show(s37Frame('Matganana', 'Rajya Sabha ' + ub.year + ' ki ginti', body));
}
function s37GoFinal() { S37.view = 'final'; s37Save(); s37Final(); }

function s37Final() {
    const ub = S37.ub, sets = s37Sets(ub), v = s37Verdict(ub, sets);
    const now = s37Counts(ub), before = (ub.last && ub.last.before) || {};
    const diff = Object.keys(now).concat(Object.keys(before)).filter(function (p, i, a) { return a.indexOf(p) === i; })
        .map(function (p) { return [p, (now[p] || 0) - (before[p] || 0)]; })
        .filter(function (r) { return r[1] !== 0; }).sort(function (a, b) { return Math.abs(b[1]) - Math.abs(a[1]); }).slice(0, 8);
    const ch = diff.map(function (r) { return '<span class="s37-chip" style="border-left:4px solid ' + s37Col(r[0]) + '">' + esc(r[0]) + '<b style="color:' + (r[1] > 0 ? '#4ade80' : '#f87171') + '">' + (r[1] > 0 ? '+' : '') + r[1] + '</b></span>'; }).join('');
    const body = '<div class="s34-parl">' + s37Hemi(ub, sets) + '<div class="s37-panel"><h3>CHUNAV KA NATIJA</h3>' +
        '<div style="text-align:center"><b style="font-size:2.4rem;color:#fff">' + v.you + '</b> <span style="color:#94a3b8">/ 245 aapke saath' + (v.sup ? ' (+' + v.sup + ' samarthan)' : '') + '</span></div>' +
        '<div class="s37-verdict ' + v.cls + '">' + esc(v.text) + '</div>' +
        '<h3 style="margin-top:10px">SABSE BADE BADLAV</h3><div class="s37-chips">' + (ch || '<span style="color:#94a3b8">Koi badlav nahi.</span>') + '</div>' +
        '<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="s30-btn go" onclick="s37Next()">AGLA CHUNAV (2 SAAL BAAD)</button><button class="s30-btn ghost sm" onclick="S37.view=\'home\';s37Render()">Home</button></div></div></div>';
    s37Show(s37Frame('Rajya Sabha ' + ub.year + ' ka Natija', 'Naya Upper House', body));
}
function s37Next() {
    const ub = S37.ub;
    if (ub.last && ub.last.cycle === ub.cycle) { ub.cycle++; ub.year += 2; ub.fund += S37_CYCLE_FUND; ub.acts = {}; ub.support = {}; }
    s37Save();
    S37.view = 'prep'; S37.msg = '';
    s37Render();
}

// ---------- jodna ----------
const _openHouseS37 = openHouse;
openHouse = function (t) {
    if (t === 'upper-house') s37Open(); else _openHouseS37(t);
};
S37.ub = s37Load();
s37Badge();
setTimeout(s37Badge, 1500);

// ================= STAGE 38: RASHTRAPATI CHUNAV (President Election) =================
// Electoral college: Lok Sabha + Rajya Sabha ke chune hue saansad + sabhi vidhan sabhaon ke vidhayak.
// Data approx hai. Vidhan sabha ki seats aur har vidhayak ke vote ka mulya: P38_ST = { rajya: [vidhayak seats, ek vidhayak ka vote mulya] }
const P38_KEY = 'rajniti_president_v1';
const P38_START_FUND = 600;     // Cr
const P38_FIRST_YEAR = 2026;
const P38_ST = {
    'Uttar Pradesh': [403, 208], 'Maharashtra': [288, 175], 'Tamil Nadu': [234, 176], 'West Bengal': [294, 151], 'Bihar': [243, 173],
    'Karnataka': [224, 131], 'Andhra Pradesh': [175, 159], 'Gujarat': [182, 147], 'Madhya Pradesh': [230, 131], 'Rajasthan': [200, 129],
    'Odisha': [147, 149], 'Kerala': [140, 152], 'Telangana': [119, 132], 'Assam': [126, 116], 'Punjab': [117, 116], 'Jharkhand': [81, 176],
    'Chhattisgarh': [90, 129], 'Haryana': [90, 132], 'Jammu & Kashmir': [90, 72], 'Delhi': [70, 58], 'Uttarakhand': [70, 64],
    'Himachal Pradesh': [68, 51], 'Goa': [40, 20], 'Manipur': [60, 18], 'Meghalaya': [60, 17], 'Tripura': [60, 26], 'Nagaland': [60, 9],
    'Mizoram': [40, 8], 'Sikkim': [32, 7], 'Arunachal Pradesh': [60, 8], 'Puducherry': [30, 16]
};
const P38_LS_DEFAULT = { 'BJP': 240, 'Congress': 99, 'Samajwadi Party': 37, 'TMC': 29, 'DMK': 22, 'TDP': 16, 'JD(U)': 12, 'Shiv Sena (UBT)': 9, 'NCP (SP)': 8, 'Shiv Sena': 7, 'LJP (RV)': 5, 'YSRCP': 4, 'RJD': 4, 'CPI(M)': 4, 'IUML': 3, 'AAP': 3, 'JMM': 3, 'JD(S)': 2, 'National Conference': 2, 'Others': 34 };

// ummeedwar (kalpnik naam). appeal = virodhi/tatastha se kitne % extra vote, loyal = apne dal mein toot kam, regions = in rajyon mein extra pakad
const P38_CANDS = [
    { id: 'sci', name: 'Dr. Vasudha Iyer', tag: 'Vigyanik', desc: 'Desh ki jaani-maani vaigyanik. Tatastha dalon ko bhaati hain.', appeal: 6, loyal: 0, regions: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Delhi'] },
    { id: 'jus', name: 'Justice R. K. Tiwari', tag: 'Purv Nyayadheesh', desc: 'Saaf chhavi, sabhi dalon mein izzat.', appeal: 5, loyal: 0, regions: ['Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar'] },
    { id: 'tri', name: 'Smt. Kamla Hansda', tag: 'Aadivasi Mahila Neta', desc: 'Aadivasi ilakon mein bahut lokpriya.', appeal: 7, loyal: 0, regions: ['Jharkhand', 'Odisha', 'Chhattisgarh', 'Madhya Pradesh', 'Assam', 'Meghalaya', 'Tripura'] },
    { id: 'vet', name: 'Shri Mohan Lal Verma', tag: 'Anubhavi Saansad', desc: 'Apne dal mein pakka bharosa, toot-phoot kam.', appeal: 3, loyal: 0.015, regions: ['Uttar Pradesh', 'Haryana', 'Uttarakhand'] },
    { id: 'edu', name: 'Dr. Abdul Rahman Qureshi', tag: 'Shiksha-vid', desc: 'Alpsankhyak aur padhe-likhe varg mein pakad.', appeal: 6, loyal: 0, regions: ['Kerala', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Jammu & Kashmir', 'Telangana', 'Assam'] },
    { id: 'gov', name: 'Smt. Meenakshi Nair', tag: 'Purv Rajyapal', desc: 'Dakshin bharat mein sammanit mahila neta.', appeal: 5, loyal: 0, regions: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Puducherry'] },
    { id: 'dal', name: 'Shri Bhim Singh Meghwal', tag: 'Dalit Neta', desc: 'Samajik nyay ke naam par bade vote khinchte hain.', appeal: 6, loyal: 0, regions: ['Uttar Pradesh', 'Rajasthan', 'Punjab', 'Bihar', 'Madhya Pradesh', 'Haryana'] },
    { id: 'gen', name: 'Gen. (Retd.) Harbans Rathore', tag: 'Purv Sena Pramukh', desc: 'Rashtravaad ki chhavi, seemavarti rajyon mein asar.', appeal: 4, loyal: 0.005, regions: ['Punjab', 'Haryana', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Rajasthan'] }
];

const P38 = { view: 'home', rec: null, model: null, candIdx: -1, rows: null, shown: 0, timer: null, msg: '', news: [], res: null };

function p38Load() { try { return JSON.parse(localStorage.getItem(P38_KEY)); } catch (e) { return null; } }
function p38Save() { try { if (P38.rec) localStorage.setItem(P38_KEY, JSON.stringify(P38.rec)); } catch (e) {} p38Badge(); }
function p38Clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function p38Pct(x) { return (x * 100).toFixed(1); }
function p38Fmt(n) { return Math.round(n).toLocaleString('en-IN'); }

function p38Sets() {
    const rec = (typeof s34GetHouse === 'function') ? s34GetHouse() : null;
    const pk = P38.rec && P38.rec.pick;
    const you = pk || (rec && rec.you) || (S37.ub && S37.ub.you) || (P38.rec && P38.rec.you) || null;
    return you ? s37Sets({ you: you, pick: pk }) : null;
}

// ---------- electoral college banao ----------
function p38Groups() {
    const rec = (typeof s34GetHouse === 'function') ? s34GetHouse() : null;
    let totalMla = 0;
    Object.keys(P38_ST).forEach(function (n) { totalMla += P38_ST[n][0] * P38_ST[n][1]; });
    const mpVal = Math.round(totalMla / 776);
    let ls = {};
    if (rec && rec.seats) Object.keys(rec.seats).forEach(function (p) { if (rec.seats[p] > 0) ls[p] = rec.seats[p]; });
    if (!Object.keys(ls).length) ls = Object.assign({}, P38_LS_DEFAULT);
    const ub = S37.ub || s37Load();
    if (ub) s37Blend(ub);
    const rs = s37Counts(ub || s37NewUb('BJP'));
    const groups = [
        { key: 'ls', label: 'Lok Sabha ke saansad', state: null, valEach: mpVal, parties: ls },
        { key: 'rs', label: 'Rajya Sabha ke saansad', state: null, valEach: mpVal, parties: rs }
    ];
    Object.keys(P38_ST).forEach(function (n) {
        const sh = (ub && ub.states && ub.states[n]) ? ub.states[n].sh : (S37_RS[n] ? S37_RS[n][1] : { 'Others': 1 });
        groups.push({ key: n, label: n, state: n, valEach: P38_ST[n][1], parties: s37Counts({ states: { x: { holders: s37Alloc(sh, P38_ST[n][0]) } } }) });
    });
    groups.forEach(function (g) { g.value = Object.keys(g.parties).reduce(function (a, p) { return a + g.parties[p] * g.valEach; }, 0); });
    return groups;
}
function p38Totals(groups, sets) {
    let y = 0, o = 0, n = 0;
    groups.forEach(function (g) {
        Object.keys(g.parties).forEach(function (p) {
            const v = g.parties[p] * g.valEach, s = s37Side(sets, p);
            if (s === 'you') y += v; else if (s === 'opp') o += v; else n += v;
        });
    });
    return { you: y, opp: o, neu: n, total: y + o + n };
}

// ---------- vote ka hisaab ----------
function p38ProbY(side, p, g, m) {
    const st = g.state;
    const regY = st && m.Y.regions.indexOf(st) >= 0 ? 0.04 : 0;
    const regR = st && m.R.regions.indexOf(st) >= 0 ? 0.04 : 0;
    if (side === 'you') {
        const w = m.whip ? 0.5 : 1;
        const d = 0.02 * (m.whip ? 0.25 : 1) + (m.R.appeal / 100) * w + regR * w + (m.failState[st] || 0) + (m.aiState[st] || 0) * w + (m.failAll || 0) - m.Y.loyal;
        return 1 - p38Clamp(d, 0, 0.5);
    }
    if (side === 'opp') {
        const c = 0.02 + m.Y.appeal / 100 + regY + (m.crossState[st] || 0) + (m.appeal ? 0.04 : 0) - m.R.loyal;
        return p38Clamp(c, 0, 0.7);
    }
    if (m.support[p]) return 0.92;
    if (m.aiSupport[p]) return 0.08;
    return p38Clamp(0.5 + (m.Y.appeal - m.R.appeal) / 40 + (regY - regR) * 2 + (m.appeal ? 0.05 : 0), 0.05, 0.95);
}
function p38Eval(m, noise) {
    let Y = 0, R = 0;
    const rows = [];
    m.groups.forEach(function (g) {
        let gy = 0, gr = 0;
        Object.keys(g.parties).forEach(function (p) {
            const n = g.parties[p], side = s37Side(m.sets, p);
            let vy = n * p38ProbY(side, p, g, m);
            if (noise) vy = p38Clamp(vy * s37Rnd(0.95, 1.05), 0, n);
            gy += vy * g.valEach; gr += (n - vy) * g.valEach;
        });
        rows.push({ key: g.key, label: g.label, y: gy, r: gr });
        Y += gy; R += gr;
    });
    return { Y: Y, R: R, total: Y + R, rows: rows };
}
function p38NewModel(candIdx) {
    const sets = p38Sets();
    const Y = P38_CANDS[candIdx];
    const others = P38_CANDS.filter(function (c, i) { return i !== candIdx; });
    const R = others[Math.floor(Math.random() * others.length)];
    return { sets: sets, groups: p38Groups(), Y: Y, R: R, fund: P38_START_FUND, support: {}, aiSupport: {}, crossState: {}, failState: {}, aiState: {}, failAll: 0, whip: false, appeal: false, done: {} };
}

// ---------- CSS ----------
function p38Style() {
    if (document.getElementById('p38-css')) return;
    const st = document.createElement('style');
    st.id = 'p38-css';
    st.textContent = `
.p38-bar{position:relative;display:flex;height:30px;border-radius:10px;overflow:hidden;background:#1e293b;margin:10px 0 4px;}
.p38-bar i{display:flex;align-items:center;justify-content:center;font-style:normal;font-size:.72rem;font-weight:800;color:#fff;min-width:0;overflow:hidden;white-space:nowrap;}
.p38-bar::after{content:'';position:absolute;left:50%;top:-4px;bottom:-4px;width:3px;background:#facc15;box-shadow:0 0 8px #facc15;}
.p38-leg{display:flex;justify-content:space-between;font-size:.75rem;color:#94a3b8;margin-bottom:8px;}
.p38-cands{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;}
.p38-cand{cursor:pointer;background:linear-gradient(160deg,rgba(255,255,255,.12),rgba(255,255,255,.03));border:2px solid rgba(255,255,255,.18);border-radius:20px;padding:16px;transition:.25s;animation:s34In .4s both;}
.p38-cand:hover{transform:translateY(-4px);border-color:#38bdf8;box-shadow:0 10px 26px rgba(56,189,248,.3);}
.p38-cand .av{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;color:#fff;background:linear-gradient(135deg,#d98e2b,#b8651b);margin-bottom:8px;}
.p38-cand h4{margin:0;font-size:1.05rem;}
.p38-cand .tg{color:#fde68a;font-size:.8rem;font-weight:700;margin:2px 0 6px;}
.p38-cand p{margin:0 0 8px;font-size:.82rem;color:#cbd5e1;}
.p38-cand small{color:#94a3b8;font-size:.72rem;}
.p38-oath{text-align:center;padding:26px 18px;border-radius:24px;background:linear-gradient(160deg,rgba(250,204,21,.18),rgba(255,255,255,.04));border:1px solid rgba(250,204,21,.5);animation:s34In .6s both;}
.p38-oath h2{margin:6px 0;font-size:1.9rem;color:#fff;}
.p38-oath .big{font-size:3rem;}
`;
    document.head.appendChild(st);
}

// ---------- frame ----------
function p38El() {
    let el = document.getElementById('s38-pres');
    if (!el) { el = document.createElement('div'); el.id = 's38-pres'; el.className = 's30-full hidden'; document.body.appendChild(el); }
    return el;
}
function p38Close() {
    if (P38.timer) { clearInterval(P38.timer); P38.timer = null; }
    p38El().classList.add('hidden');
    p38Badge();
}
function p38Show(title, sub, body) {
    const el = p38El();
    el.innerHTML = '<div class="s34-top"></div><div class="s30-blob b1"></div><div class="s30-blob b2"></div><div class="s30-wrap">' +
        '<div class="s30-head"><button class="s30-back" onclick="p38Close()">&larr; Wapas</button><div><h1>' + esc(title) + '</h1><p>' + esc(sub) + '</p></div></div>' + body + '</div>';
    el.classList.remove('hidden');
}
function p38Bar(t) {
    const tot = t.total || 1;
    const seg = function (v, c, lbl) { const w = v / tot * 100; return '<i style="width:' + w.toFixed(2) + '%;background:' + c + '">' + (w > 9 ? lbl + ' ' + Math.round(w) + '%' : '') + '</i>'; };
    return '<div class="p38-bar">' + seg(t.you, '#22c55e', 'Aap') + seg(t.neu, '#64748b', 'Tatastha') + seg(t.opp, '#ef4444', 'Virodhi') + '</div>' +
        '<div class="p38-leg"><span>Peeli line = jeet ka aankda (50% se zyada)</span><span>Kul: ' + p38Fmt(t.total) + '</span></div>';
}

// ---------- views ----------
function p38Open() {
    s34Style(); s37Style(); p38Style();
    P38.rec = P38.rec || p38Load() || { v: 4, year: 2026, term: null, history: [], you: null, pick: null };
    if (P38.rec.v !== 4) P38.rec = { v: 4, year: 2026, term: null, history: [], you: P38.rec.you || null, pick: null };
    if (!p38Sets()) { p38Setup(); return; }
    P38.view = 'home';
    p38Render();
}
function p38Setup() {
    const opts = ['BJP', 'Congress', 'Samajwadi Party', 'TMC', 'DMK', 'AAP', 'JD(U)', 'TDP', 'RJD', 'Shiv Sena (UBT)'];
    p38Show('Rashtrapati Chunav', 'Pehle apni party chuno', '<div class="s37-panel" style="max-width:520px;margin:20px auto"><h3>PARTY CHUNO</h3>' +
        '<p style="color:#cbd5e1">Lok Sabha ki sarkar abhi nahi bani, isliye yahan se party chunkar seedha Rashtrapati chunav khel sakte ho.</p>' +
        '<select id="p38-pick" style="width:100%;padding:10px;border-radius:10px;font-size:1rem">' + opts.map(function (p) { return '<option>' + esc(p) + '</option>'; }).join('') + '</select>' +
        '<div style="margin-top:14px"><button class="s30-btn go" onclick="p38Start()">SHURU KARO</button></div></div>');
}
function p38Start() {
    P38.rec.you = document.getElementById('p38-pick').value;
    p38Save();
    P38.view = 'home';
    p38Render();
}
function p38Render() {
    if (P38.view === 'party') return p38PartyPick();
    if (P38.view === 'cand') return p38Cand();
    if (P38.view === 'prep') return p38Prep();
    if (P38.view === 'count') return p38Count();
    if (P38.view === 'result') return p38Result();
    return p38Home();
}

function p38Home() {
    const sets = p38Sets(), groups = p38Groups(), t = p38Totals(groups, sets), rec = P38.rec;
    const top = groups.slice().sort(function (a, b) { return b.value - a.value; }).slice(0, 8);
    const term = rec.term ? '<div class="p38-oath" style="margin-bottom:14px;padding:16px"><div style="color:#fde68a;font-weight:800;letter-spacing:2px">MAUJOODA RASHTRAPATI</div><h2 style="font-size:1.5rem">' + esc(rec.term.name) + '</h2><div style="color:#cbd5e1">' + esc(rec.term.tag) + ' | ' + (rec.term.side === 'you' ? 'Aapke gathbandhan ke' : 'Virodhi gathbandhan ke') + ' | ' + rec.term.from + ' se ' + (rec.term.from + 5) + '</div></div>' : '';
    const body = '<div class="s34-parl"><div class="s37-panel"><h3>ELECTORAL COLLEGE</h3>' + term +
        '<p style="color:#cbd5e1;font-size:.88rem;margin:0">Rashtrapati ko Lok Sabha, Rajya Sabha ke chune hue saansad aur sabhi vidhan sabhaon ke vidhayak chunte hain. Har vote ka mulya alag hota hai. Jeetne ke liye 50% se zyada chahiye.</p>' + p38Bar(t) +
        '<div class="s37-chips"><div class="s37-chip">Aapka<b style="color:#4ade80">' + p38Pct(t.you / t.total) + '%</b></div><div class="s37-chip">Tatastha<b style="color:#cbd5e1">' + p38Pct(t.neu / t.total) + '%</b></div><div class="s37-chip">Virodhi<b style="color:#f87171">' + p38Pct(t.opp / t.total) + '%</b></div></div></div>' +
        '<div class="s37-panel"><h3>SABSE BADE MATDAATA</h3>' +
        top.map(function (g) { return '<div class="s37-sup"><span class="t"><b>' + esc(g.label) + '</b></span><span>' + p38Pct(g.value / t.total) + '% vote</span></div>'; }).join('') +
        '<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="s30-btn go" onclick="p38GoCand()">RASHTRAPATI CHUNAV ' + rec.year + ' SHURU KARO</button></div></div></div>';
    p38Show('Rashtrapati Chunav', 'Saal ' + rec.year + ' | Desh ka sarvochch pad', body);
}

function p38GoCand() { P38.view = 'party'; p38PartyPick(); }
function p38PartyPick() {
    const groups = p38Groups(), names = {};
    groups.forEach(function (g) { Object.keys(g.parties).forEach(function (p) { names[p] = 1; }); });
    try { if (window.CareerMode && CareerMode.hasParty()) names[CareerMode.getParty().name] = 1; } catch (e) {}
    const rows = Object.keys(names).map(function (p) {
        const sets = s37Sets({ you: p, pick: p }), t = p38Totals(groups, sets);
        let own = 0; const strong = [];
        groups.forEach(function (g) { const v = (g.parties[p] || 0) * g.valEach; own += v; if (g.value && v / g.value >= 0.4) strong.push(g.label); });
        return { p: p, pct: t.you / t.total, own: own / t.total, strong: strong.slice(0, 4) };
    }).filter(function (r) { return r.own > 0.003 || r.pct > 0.1; }).sort(function (a, b) { return b.pct - a.pct; }).slice(0, 24);
    const html = rows.map(function (r, i) {
        return '<div class="s37-st s37-prow' + (P38.rec.pick === r.p ? ' sel' : '') + '" data-p="' + esc(r.p) + '" onclick="p38PickParty(this.dataset.p)" style="border-left:5px solid ' + s37Col(r.p) + ';cursor:pointer;animation:s34In .4s both;animation-delay:' + (i * 0.03) + 's"><div style="display:flex;align-items:center;gap:12px">' + s22Logo(r.p, 46) + '<div style="flex:1;min-width:0"><b>' + esc(r.p) + '</b><br><small style="color:#94a3b8">Gathbandhan samet: ' + (r.pct * 100).toFixed(1) + '% vote | Sirf party: ' + (r.own * 100).toFixed(1) + '%' + (r.strong.length ? '<br>Mazboot: ' + esc(r.strong.join(', ')) : '') + '</small></div><div style="text-align:right"><b style="font-size:1.7rem;color:' + (r.pct >= 0.5 ? '#4ade80' : '#fbbf24') + '">' + (r.pct * 100).toFixed(0) + '%</b></div></div><div class="s37-bar" style="margin-top:8px"><i style="width:' + Math.min(100, r.pct * 100).toFixed(1) + '%;background:' + s37Col(r.p) + '"></i></div></div>';
    }).join('');
    p38Show('Party chuno', 'Kis party ki taraf se Rashtrapati ka ummeedwar utarna hai?', '<div class="s37-panel"><h3>ELECTORAL COLLEGE MEIN KISKA KITNA VOTE</h3><p style="color:#cbd5e1;font-size:.88rem;margin:0 0 10px">Jis party ki zyada Lok Sabha / Rajya Sabha seat hai aur jis state mein sarkar ya zyada vidhayak hain, wahan se use zyada vote milte hain. Jeet ke liye 50% chahiye.</p>' + html + '</div>');
}
function p38PickParty(p) { P38.rec.pick = p; P38.rec.you = p; p38Save(); P38.view = 'cand'; p38Cand(); }
function p38Cand() {
    const cards = P38_CANDS.map(function (c, i) {
        const ini = c.name.replace(/^(Dr\.|Smt\.|Shri|Justice|Gen\.\s*\(Retd\.\))\s*/, '').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
        return '<div class="p38-cand" style="animation-delay:' + (i * 0.05) + 's" onclick="p38Pick(' + i + ')"><div class="av">' + esc(ini) + '</div><h4>' + esc(c.name) + '</h4><div class="tg">' + esc(c.tag) + '</div><p>' + esc(c.desc) + '</p>' +
            '<small>Ashar: +' + c.appeal + '% virodhi vote' + (c.loyal ? ' | apne dal mein bharosa' : '') + '<br>Pakad: ' + esc(c.regions.join(', ')) + '</small></div>';
    }).join('');
    const sets0 = p38Sets(); let plist = [];
    try { plist = Object.keys((sets0 && sets0.ys) || {}); if (sets0 && sets0.you && plist.indexOf(sets0.you) < 0) plist.unshift(sets0.you); } catch (e) {}
    const profs = Object.keys(P38_PROFS);
    const custom = '<div class="s37-panel" style="margin-top:16px"><h3>APNA KHUD KA UMMEEDWAR</h3>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">' +
        '<div><label style="color:#94a3b8;font-size:.8rem">Naam</label><input id="p38-cn" placeholder="Ummeedwar ka naam" style="width:100%;padding:10px;border-radius:10px;border:1px solid #334155;background:#0b1220;color:#fff"></div>' +
        '<div><label style="color:#94a3b8;font-size:.8rem">Kaun hain (pesha)</label><select id="p38-cp" style="width:100%;padding:10px;border-radius:10px;background:#0b1220;color:#fff;border:1px solid #334155">' + profs.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') + '</select></div>' +
        '<div><label style="color:#94a3b8;font-size:.8rem">Kis party se ladwana hai</label><select id="p38-cparty" style="width:100%;padding:10px;border-radius:10px;background:#0b1220;color:#fff;border:1px solid #334155">' + (plist.length ? plist : ['Nirdaliy']).map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') + '</select></div></div>' +
        '<div style="margin-top:12px"><button class="s30-btn go" onclick="p38Custom()">IS UMMEEDWAR KO UTARO</button></div></div>';
    p38Show('Apna Ummeedwar Chuno', 'Taiyar chehre chuno ya apna khud ka ummeedwar utaro.', '<div class="p38-cands">' + cards + '</div>' + custom);
}
const P38_PROFS = {
    'Vaigyanik': { appeal: 6, desc: 'Vigyan jagat ka jaana-maana naam. Tatastha dalon ko bhata hai.', regions: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Delhi'] },
    'Shiksha-vid': { appeal: 5, desc: 'Shiksha jagat ka sammanit chehra.', regions: ['Uttar Pradesh', 'Bihar', 'West Bengal', 'Delhi'] },
    'Purv Nyayadheesh': { appeal: 5, desc: 'Saaf chhavi, sabhi dalon mein izzat.', regions: ['Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar'] },
    'Sainik / General': { appeal: 6, desc: 'Desh-bhakti aur anushasan ki chhavi.', regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Himachal Pradesh', 'Uttarakhand'] },
    'Khiladi': { appeal: 6, desc: 'Yuvaon aur parivaron mein lokpriya.', regions: ['Haryana', 'Punjab', 'Maharashtra', 'Kerala', 'Manipur'] },
    'Samajsevi': { appeal: 5, desc: 'Zameen se jude, gareebon ke saathi.', regions: ['Odisha', 'Jharkhand', 'Chhattisgarh', 'Bihar'] },
    'Chikitsak': { appeal: 5, desc: 'Doctor, jisne desh ki sewa ki.', regions: ['Kerala', 'Tamil Nadu', 'Gujarat', 'Maharashtra'] },
    'Kalakar / Lekhak': { appeal: 4, desc: 'Sanskritik chehra, har ilake mein pehchaan.', regions: ['West Bengal', 'Maharashtra', 'Delhi', 'Karnataka'] },
    'Varishth Rajneta': { appeal: 3, desc: 'Lambe anubhav wala rajneta, dal mein bharosa.', regions: ['Uttar Pradesh', 'Bihar', 'Maharashtra'] }
};
function p38Custom() {
    const nm = ((document.getElementById('p38-cn') || {}).value || '').trim();
    if (!nm) { alert('Ummeedwar ka naam likho.'); return; }
    const pr = (document.getElementById('p38-cp') || {}).value, pt = (document.getElementById('p38-cparty') || {}).value, P = P38_PROFS[pr] || P38_PROFS['Vaigyanik'];
    const ix = P38_CANDS.findIndex(function (c) { return c.id === 'custom'; }); if (ix >= 0) P38_CANDS.splice(ix, 1);
    P38_CANDS.push({ id: 'custom', name: nm, tag: pr, desc: P.desc + ' (' + pt + ' ka ummeedwar)', appeal: P.appeal, loyal: 1, regions: P.regions, party: pt, custom: true });
    p38Pick(P38_CANDS.length - 1);
}
function p38Pick(i) {
    P38.candIdx = i;
    P38.model = p38NewModel(i);
    P38.msg = '';
    P38.view = 'prep';
    p38Prep();
}

function p38Share(m, key) {
    const g = m.groups.filter(function (x) { return x.key === key; })[0];
    const tot = m.groups.reduce(function (a, x) { return a + x.value; }, 0);
    return g ? g.value / tot : 0;
}
function p38NeutralParties(m) {
    const val = {};
    let tot = 0;
    m.groups.forEach(function (g) {
        Object.keys(g.parties).forEach(function (p) {
            const v = g.parties[p] * g.valEach; tot += v;
            if (s37Side(m.sets, p) === 'neu' && p !== 'Others') val[p] = (val[p] || 0) + v;
        });
    });
    return Object.keys(val).map(function (p) { return { p: p, share: val[p] / tot }; }).filter(function (x) { return x.share >= 0.004; }).sort(function (a, b) { return b.share - a.share; });
}

function p38Prep() {
    const m = P38.model, keep = document.querySelector('#s38-pres .s37-list'), top = keep ? keep.scrollTop : 0;
    const ev = p38Eval(m, false), pctY = ev.Y / ev.total;
    const t = { you: ev.Y, neu: 0, opp: ev.R, total: ev.total };
    const bar = '<div class="p38-bar"><i style="width:' + (pctY * 100).toFixed(2) + '%;background:#22c55e">' + (pctY > 0.1 ? esc(m.Y.name.split(' ').slice(-1)[0]) + ' ' + p38Pct(pctY) + '%' : '') + '</i><i style="width:' + ((1 - pctY) * 100).toFixed(2) + '%;background:#ef4444">' + (1 - pctY > 0.1 ? esc(m.R.name.split(' ').slice(-1)[0]) + ' ' + p38Pct(1 - pctY) + '%' : '') + '</i></div><div class="p38-leg"><span>Peeli line = jeet ka aankda</span><span>' + (pctY > 0.5 ? 'Aap aage' : 'Aap peeche') + '</span></div>';
    let neu = '';
    p38NeutralParties(m).slice(0, 8).forEach(function (x) {
        const cost = 20 + Math.round(x.share * 100 * 8), done = m.support[x.p], tried = m.done['s:' + x.p];
        neu += '<div class="s37-sup"><span class="t"><b>' + esc(x.p) + '</b> (' + p38Pct(x.share) + '% vote)</span><button class="s37-b"' + (tried || m.fund < cost ? ' disabled' : '') + ' onclick="p38Support(\'' + esc(x.p).replace(/'/g, "\\'") + '\',' + cost + ')">' + (done ? 'Saath hain' : (tried ? 'Koshish ho chuki' : 'Manao ' + cost + ' Cr')) + '</button></div>';
    });
    const states = m.groups.filter(function (g) { return g.state; }).sort(function (a, b) { return b.value - a.value; }).slice(0, 14);
    let cards = '';
    states.forEach(function (g) {
        const share = g.value / ev.total, cost = 15 + Math.round(share * 100 * 10), tried = m.done['c:' + g.state];
        let yv = 0, ov = 0, nv = 0;
        Object.keys(g.parties).forEach(function (p) { const v = g.parties[p] * g.valEach, s = s37Side(m.sets, p); if (s === 'you') yv += v; else if (s === 'opp') ov += v; else nv += v; });
        cards += '<div class="s37-st"><div class="h"><b>' + esc(g.state) + '</b><span>' + p38Pct(share) + '% vote</span></div>' +
            '<div class="s37-bar"><i style="width:' + (yv / g.value * 100).toFixed(1) + '%;background:#22c55e"></i><i style="width:' + (nv / g.value * 100).toFixed(1) + '%;background:#64748b"></i><i style="width:' + (ov / g.value * 100).toFixed(1) + '%;background:#ef4444"></i></div>' +
            '<div class="p">' + (m.Y.regions.indexOf(g.state) >= 0 ? 'Aapke ummeedwar ki yahan pakad hai. ' : '') + (m.crossState[g.state] ? 'Cross-voting safal. ' : '') + (m.failState[g.state] ? 'Sauda pakda gaya. ' : '') + '</div>' +
            '<div class="s37-act"><button class="s37-b o"' + (tried || m.fund < cost ? ' disabled' : '') + ' onclick="p38Cross(\'' + esc(g.state).replace(/'/g, "\\'") + '\',' + cost + ')">' + (tried ? 'Koshish ho chuki' : 'Cross-voting (' + cost + ' Cr)') + '</button></div></div>';
    });
    const body = '<div class="s37-grid"><div class="s37-list">' + cards + '</div><div><div class="s37-panel"><h3>' + esc(m.Y.name.toUpperCase()) + ' (AAPKA)</h3>' +
        '<div style="color:#fde68a;font-size:.85rem;margin-bottom:4px">Virodhi ka ummeedwar: <b>' + esc(m.R.name) + '</b> (' + esc(m.R.tag) + ')</div>' + bar +
        '<div class="s37-fund">Khazana: ' + m.fund + ' Cr</div>' + (P38.msg ? '<div class="s37-msg">' + esc(P38.msg) + '</div>' : '') +
        '<h3 style="margin-top:12px">TATASTHA DAL</h3>' + (neu || '<div style="color:#94a3b8;font-size:.85rem">Koi bada tatastha dal nahi.</div>') +
        '<h3 style="margin-top:12px">BADE DAANV</h3>' +
        '<div class="s37-sup"><span class="t"><b>Whip jaari karo</b><br><small>Apne dalon mein toot aadhi se bhi kam (40 Cr)</small></span><button class="s37-b g"' + (m.whip || m.fund < 40 ? ' disabled' : '') + ' onclick="p38Whip()">' + (m.whip ? 'Jaari' : '40 Cr') + '</button></div>' +
        '<div class="s37-sup"><span class="t"><b>Antaratma ki awaaz</b><br><small>Desh bhar mein apeel, 60% safal (60 Cr)</small></span><button class="s37-b g"' + (m.done.appeal || m.fund < 60 ? ' disabled' : '') + ' onclick="p38Appeal()">' + (m.done.appeal ? (m.appeal ? 'Safal' : 'Bekar gayi') : '60 Cr') + '</button></div>' +
        '<div style="margin-top:14px"><button class="s30-btn go" onclick="p38GoCount()">VOTING SHURU KARO</button></div></div></div></div>';
    p38Show('Rashtrapati Chunav ' + P38.rec.year, 'Rann-neeti: vote jodo, phir voting.', body);
    const nl = document.querySelector('#s38-pres .s37-list');
    if (nl) nl.scrollTop = top;
}
function p38Support(p, cost) {
    const m = P38.model;
    if (m.done['s:' + p] || m.fund < cost) return;
    m.fund -= cost; m.done['s:' + p] = 1;
    if (Math.random() < 0.65) { m.support[p] = 1; P38.msg = p + ' ne aapke ummeedwar ko samarthan dene ka vaada kiya!'; }
    else { m.fund += Math.round(cost / 2); P38.msg = p + ' maane nahi. Aadha paisa wapas mila.'; }
    p38Prep();
}
function p38Cross(st, cost) {
    const m = P38.model;
    if (m.done['c:' + st] || m.fund < cost) return;
    m.fund -= cost; m.done['c:' + st] = 1;
    if (Math.random() < 0.7) { m.crossState[st] = 0.2; P38.msg = st + ': cross-voting safal! Virodhi vidhayakon ke kuch vote aapko milenge.'; }
    else { m.failState[st] = 0.03; m.fund = Math.max(0, m.fund - 5); P38.msg = st + ': sauda pakda gaya! Aapke apne vidhayak bhi naraz, 5 Cr jurmana.'; }
    p38Prep();
}
function p38Whip() { const m = P38.model; if (m.whip || m.fund < 40) return; m.fund -= 40; m.whip = true; P38.msg = 'Whip jaari: apne dalon mein toot aur virodhi ki sendh dono kam.'; p38Prep(); }
function p38Appeal() {
    const m = P38.model;
    if (m.done.appeal || m.fund < 60) return;
    m.fund -= 60; m.done.appeal = 1;
    if (Math.random() < 0.6) { m.appeal = true; P38.msg = 'Antaratma ki awaaz ki apeel chali! Kai sansad aur vidhayak aapki taraf jhuke.'; }
    else { m.failAll = 0.01; P38.msg = 'Apeel ulti padi, aapke kuch log naraz ho gaye.'; }
    p38Prep();
}

function p38GoCount() {
    const m = P38.model;
    P38.news = [];
    const stGroups = m.groups.filter(function (g) { return g.state; });
    for (let i = 0; i < 3; i++) {
        const g = stGroups[Math.floor(Math.random() * stGroups.length)];
        if (!m.aiState[g.state]) { m.aiState[g.state] = 0.03; P38.news.push('Virodhi ne ' + g.state + ' mein sendh lagayi.'); }
    }
    p38NeutralParties(m).forEach(function (x) {
        if (!m.support[x.p] && Math.random() < 0.35) { m.aiSupport[x.p] = 1; P38.news.push(x.p + ' virodhi ke ummeedwar ke saath chala gaya.'); }
    });
    const ev = p38Eval(m, true);
    const rows = ev.rows.slice(0, 2).concat(ev.rows.slice(2).sort(function (a, b) { return (b.y + b.r) - (a.y + a.r); }));
    P38.res = ev;
    P38.rows = rows;
    P38.shown = 0;
    P38.view = 'count';
    p38Count();
    if (P38.timer) clearInterval(P38.timer);
    P38.timer = setInterval(function () {
        P38.shown++;
        if (P38.shown >= P38.rows.length) { clearInterval(P38.timer); P38.timer = null; }
        p38Count();
    }, 420);
}
function p38Skip() { if (P38.timer) { clearInterval(P38.timer); P38.timer = null; } P38.shown = P38.rows.length; p38Count(); }

function p38Count() {
    const m = P38.model, rows = P38.rows || [], done = P38.shown >= rows.length;
    let Y = 0, R = 0;
    rows.slice(0, P38.shown).forEach(function (r) { Y += r.y; R += r.r; });
    const tot = P38.res.total, need = tot / 2;
    const list = rows.slice(0, P38.shown).slice().reverse().map(function (r) {
        const w = r.y > r.r;
        return '<div class="s37-row"><span class="n">' + esc(r.label) + '</span><div class="s37-dots"><span><i style="background:#22c55e"></i>Aap ' + p38Fmt(r.y) + '</span><span><i style="background:#ef4444"></i>Virodhi ' + p38Fmt(r.r) + '</span></div><small style="color:' + (w ? '#86efac' : '#fca5a5') + '">' + (w ? 'Aap aage' : 'Virodhi aage') + '</small></div>';
    }).join('');
    const bar = '<div class="p38-bar"><i style="width:' + (Y / tot * 100).toFixed(2) + '%;background:#22c55e"></i><i style="width:' + (R / tot * 100).toFixed(2) + '%;background:#ef4444"></i></div><div class="p38-leg"><span>' + esc(m.Y.name) + '</span><span>' + esc(m.R.name) + '</span></div>';
    const body = '<div class="s37-grid"><div class="s37-list">' + (list || '<div class="s30-empty">Voting ki ginti shuru ho rahi hai...</div>') + '</div><div class="s37-panel"><h3>GINTI</h3>' + bar +
        '<div class="s37-chips"><div class="s37-chip">Aapke<b style="color:#4ade80">' + p38Fmt(Y) + '</b></div><div class="s37-chip">Virodhi<b style="color:#f87171">' + p38Fmt(R) + '</b></div><div class="s37-chip">Jeet ka aankda<b>' + p38Fmt(need) + '</b></div></div>' +
        (done ? P38.news.map(function (n) { return '<div class="s37-msg">' + esc(n) + '</div>'; }).join('') : '') +
        '<div style="color:#94a3b8;font-size:.85rem">' + P38.shown + ' / ' + rows.length + ' samooh ki ginti pooree</div>' +
        '<div style="margin-top:14px">' + (done ? '<button class="s30-btn go" onclick="p38GoResult()">NATIJA</button>' : '<button class="s30-btn ghost sm" onclick="p38Skip()">Seedha natija</button>') + '</div></div></div>';
    p38Show('Matganana', 'Rashtrapati chunav ' + P38.rec.year, body);
}

function p38GoResult() {
    const m = P38.model, ev = P38.res, win = ev.Y > ev.R;
    const w = win ? m.Y : m.R;
    P38.rec.term = { name: w.name, tag: w.tag, side: win ? 'you' : 'opp', from: P38.rec.year, pct: Math.round((win ? ev.Y : ev.R) / ev.total * 1000) / 10 };
    P38.rec.history = (P38.rec.history || []).concat([P38.rec.term]).slice(-6);
    P38.rec.you = P38.rec.you || (m.sets && m.sets.you);
    p38Save();
    P38.view = 'result';
    p38Result();
}
function p38Result() {
    const m = P38.model, ev = P38.res, t = P38.rec.term, win = t.side === 'you';
    const body = '<div class="p38-oath"><div class="big">' + (win ? '&#127942;' : '&#127963;') + '</div><div style="color:#fde68a;font-weight:800;letter-spacing:3px">' + (win ? 'AAPKA UMMEEDWAR JEETA' : 'VIRODHI KA UMMEEDWAR JEETA') + '</div>' +
        '<h2>' + esc(t.name) + '</h2><div style="color:#cbd5e1;margin-bottom:8px">' + esc(t.tag) + ' | ' + t.pct + '% electoral vote</div>' +
        '<p style="color:#e2e8f0;max-width:640px;margin:0 auto 14px">' + (win ? 'Rashtrapati Bhavan mein aapka apna Rashtrapati hoga. Sarkar ke bill aur Rajya Sabha ke manonit sadasyon par aapko suvidha rahegi.' : 'Rashtrapati virodhi gathbandhan ke hain. Sarkar ko bill pass karwane mein dikkat aa sakti hai.') + '</p>' +
        '<div class="s37-chips" style="justify-content:center"><div class="s37-chip">Aap<b style="color:#4ade80">' + p38Fmt(ev.Y) + '</b></div><div class="s37-chip">Virodhi<b style="color:#f87171">' + p38Fmt(ev.R) + '</b></div></div>' +
        '<div style="margin-top:12px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="s30-btn go" onclick="p38Next()">AGLA CHUNAV (5 SAAL BAAD)</button><button class="s30-btn ghost sm" onclick="P38.view=\'home\';p38Render()">Home</button></div></div>';
    p38Show('Shapath Grahan', 'Naye Rashtrapati ka elaan', body);
}
function p38Next() { const r = P38.rec; r.year = 2026; p38Save(); P38.view = 'home'; p38Render(); }

// ---------- dashboard button ----------
function p38Badge() {
    const bar = document.querySelector('#main-dashboard .dash-bottom-bar');
    if (!bar) return;
    let b = bar.querySelector('[data-pres]');
    if (!b) {
        b = document.createElement('button');
        b.className = 'house-btn';
        b.setAttribute('data-pres', '1');
        b.onclick = function () { openHouse('president'); };
        b.style.backgroundImage = 'linear-gradient(90deg,#7c2d12,#1e3a8a)';
        bar.appendChild(b);
    }
    const rec = P38.rec || p38Load();
    b.innerHTML = '<span>PRESIDENT</span><small>' + (rec && rec.term ? 'Rashtrapati: ' + esc(rec.term.name) : 'Chunav ' + (rec ? rec.year : P38_FIRST_YEAR)) + '</small>';
}
const _openHouseS38 = openHouse;
openHouse = function (t) {
    if (t === 'president') p38Open(); else _openHouseS38(t);
};
P38.rec = p38Load();
p38Badge();
setTimeout(p38Badge, 1500);


// ================= CAREER HUB LINK: Lok Sabha ka natija career party ke achievement mein =================
(function () {
    var _prevFsReport = fsReport;
    fsReport = function () {
        _prevFsReport.apply(this, arguments);
        try {
            if (!window.CareerMode || !CareerMode.hasParty || !CareerMode.hasParty() || !CareerMode.reportNational) return;
            var cp = CareerMode.getParty().name;
            if (selectedYouParty !== cp || !fsState || fsState._careerDone) return;
            fsState._careerDone = true;
            var seats = [];
            Object.keys(seatResults).forEach(function (k) {
                if (seatResults[k] === cp) { var p = k.split('|'); seats.push({ state: p[0], seat: p[1] }); }
            });
            var gov = fsState.gov === 'you';
            CareerMode.reportNational({ party: cp, seats: seats, gov: gov, pm: gov && !!fsState.pm && fsState.pm.party === cp });
        } catch (e) { console.warn('career link', e); }
    };
})();


// ===== STAGE 37: dashboard par hara continue button hamesha band (Lok Sabha page ka chhota button rahega) =====
(function () {
    if (document.getElementById('s37h-css')) return;
    const st = document.createElement('style'); st.id = 's37h-css';
    st.textContent = '#s34-dash-cont{display:none!important}';
    document.head.appendChild(st);
    setInterval(function () { const b = document.getElementById('s34-dash-cont'); if (b) b.remove(); }, 1500);
})();


// ===== STAGE 37b: Rajya Sabha / Rashtrapati animation, LS war-room buttons =====
(function () {
    if (document.getElementById('s37x-css')) return;
    const st = document.createElement('style'); st.id = 's37x-css';
    st.textContent = '@keyframes s37grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes s37pop{0%{opacity:0;transform:scale(.6)}70%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}@keyframes s37glow{0%,100%{box-shadow:0 0 0 rgba(250,204,21,0)}50%{box-shadow:0 0 26px rgba(250,204,21,.45)}}' +
        '.s37-st{transition:transform .2s,box-shadow .2s}.s37-st:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(0,0,0,.35)}' +
        '.s37-bar i,.p38-bar i{transform-origin:left;animation:s37grow 1s ease both}' +
        '.s37-b{transition:filter .15s,transform .15s}.s37-b:hover:not(:disabled){filter:brightness(1.18);transform:translateY(-1px)}' +
        '.s37-chip b{animation:s37pop .6s ease both}.s37-panel{animation:s34In .5s both}' +
        '.p38-cand{transition:transform .2s,border-color .2s}.p38-cand:hover{transform:translateY(-4px) scale(1.02)}' +
        '.p38-oath{animation:s34In .6s both,s37glow 2.4s infinite}.s37-verdict{animation:s37pop .5s ease both}' +
        '#s37-wrbtns{position:fixed;left:14px;bottom:14px;z-index:60;display:none;gap:8px}#s37-wrbtns button{padding:9px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:rgba(15,23,42,.9);color:#e2e8f0;font-weight:700;cursor:pointer}#s37-wrbtns button:hover{background:#1e3a5f}' +
        '#s37-seatbox{position:fixed;inset:0;z-index:99997;background:rgba(3,8,14,.8);display:flex;align-items:center;justify-content:center;padding:14px}#s37-seatbox .bx{width:min(520px,96vw);max-height:86vh;overflow:auto;background:#0f172a;border:1px solid #38bdf8;border-radius:18px;padding:18px;color:#e2e8f0;animation:s34In .4s both}';
    document.head.appendChild(st);
})();
function s37SeatsBox() {
    const old = document.getElementById('s37-seatbox'); if (old) { old.remove(); return; }
    let rows = [];
    try { rows = computeLeads().seats.filter(function (x) { return x.margin <= 10; }).sort(function (a, b) { return a.margin - b.margin; }); } catch (e) {}
    const d = document.createElement('div'); d.id = 's37-seatbox';
    d.innerHTML = '<div class="bx"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:1.15rem">Kaante ki seat (10% ke andar)</b><button onclick="document.getElementById(\'s37-seatbox\').remove()" style="background:none;border:0;color:#94a3b8;font-size:1.5rem;cursor:pointer">&times;</button></div>' +
        (rows.length ? rows.slice(0, 60).map(function (x) { const col = x.side === 'you' ? '#22c55e' : (x.side === 'opp' ? '#ef4444' : '#94a3b8'); return '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)"><span><b>' + esc(x.pc) + '</b><br><small style="color:#94a3b8">' + esc(x.st) + '</small></span><span style="text-align:right;color:' + col + '"><b>' + (x.side === 'you' ? 'Aap aage' : (x.side === 'opp' ? 'Virodhi aage' : 'Anya aage')) + '</b><br><small>' + x.margin.toFixed(1) + '% antar</small></span></div>'; }).join('') : '<p style="color:#94a3b8;margin-top:12px">Abhi koi seat 10% ke andar ki takkar mein nahi hai (ya is phase ke rujhan abhi nahi aaye).</p>') + '</div>';
    d.addEventListener('click', function (e) { if (e.target === d) d.remove(); });
    document.body.appendChild(d);
}
setInterval(function () {
    try {
        const wr = document.getElementById('warroom-screen'), on = wr && !wr.classList.contains('hidden');
        let box = document.getElementById('s37-wrbtns');
        if (!box) {
            box = document.createElement('div'); box.id = 's37-wrbtns';
            box.innerHTML = '<button onclick="if(confirm(\'War-room se bahar jaana hai? Game auto-save hai.\')){ if(typeof goBackToDashboardS34===\'function\') goBackToDashboardS34(); else location.reload(); }">&larr; Bahar</button><button onclick="s37SeatsBox()">&#127919; Kaante ki seat</button>';
            document.body.appendChild(box);
        }
        box.style.display = on ? 'flex' : 'none';
        if (on) document.querySelectorAll('#warroom-screen button, #warroom-screen div').forEach(function (e) { if (e.children.length === 0 && /^Developer$/i.test((e.textContent || '').trim())) { e.style.display = 'none'; } if (e.tagName === 'BUTTON' && /Phase data jaanch/i.test(e.textContent || '')) e.style.display = 'none'; });
    } catch (e) {}
}, 1500);

(function () {
    if (document.getElementById('s37y-css')) return;
    const st = document.createElement('style'); st.id = 's37y-css';
    st.textContent = '.s37-mini{margin:8px 0}.s37-mini .r{display:grid;grid-template-columns:22px 1.1fr 1.3fr 38px;gap:8px;align-items:center;font-size:.78rem;margin:4px 0;color:#cbd5e1}.s37-mini .r>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.s37-mini .bx{height:7px;border-radius:4px;background:#0a1220;overflow:hidden}.s37-mini .bx i{display:block;height:100%;border-radius:4px;transform-origin:left;animation:s37grow 1s ease both}.s37-mini b{text-align:right}.s37-prow{transition:transform .2s,box-shadow .2s}.s37-prow:hover{transform:translateX(4px);box-shadow:0 8px 22px rgba(0,0,0,.35)}.s37-prow.sel{outline:2px solid #facc15}';
    document.head.appendChild(st);
})();
