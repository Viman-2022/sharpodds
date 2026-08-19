/**
 * SHARPODDS - App Logic
 */

const STATE = {
    isMock: true,
    oddsFormat: 'decimal', // decimal | fractional
    currentSport: 'soccer_epl',
    selectedBookies: JSON.parse(localStorage.getItem('SHARP_ODDS_BOOKIES')) || [],
    restrictedBookies: JSON.parse(localStorage.getItem('SHARP_ODDS_RESTRICTED')) || [],
    customBookies: JSON.parse(localStorage.getItem('SHARP_ODDS_CUSTOM_BOOKIES')) || [],
    hideRestricted: JSON.parse(localStorage.getItem('SHARP_ODDS_HIDE_REST')) || false,
    data: []
};

const ALL_BOOKMAKERS = [
    { key: 'bet365', name: 'Bet365', variance: 1.0 },
    { key: 'williamhill', name: 'William Hill', variance: 0.99 },
    { key: 'betfair_sb_uk', name: 'Betfair SB', variance: 1.01 },
    { key: 'paddypower', name: 'Paddy Power', variance: 1.0 },
    { key: 'skybet', name: 'SkyBet', variance: 0.99 },
    { key: 'ladbrokes_uk', name: 'Ladbrokes', variance: 0.98 },
    { key: 'coral', name: 'Coral', variance: 0.99 },
    { key: 'unibet', name: 'Unibet', variance: 1.02 },
    { key: 'betfred_uk', name: 'Betfred', variance: 0.98 },
    { key: 'sport888', name: '888Sport', variance: 1.01 },
    { key: 'virginbet', name: 'Virgin Bet', variance: 1.0 },
    { key: 'livescorebet', name: 'Livescore', variance: 0.99 },
    { key: 'midnite', name: 'Midnite', variance: 1.01 },
    { key: 'boylesports', name: 'Boylesports', variance: 0.98 },
    { key: 'betvictor', name: 'BetVictor', variance: 1.02 },
    { key: 'betway', name: 'Betway', variance: 1.0 },
    { key: 'grosvenor', name: 'Grosvenor', variance: 1.01 },
    { key: 'casumo', name: 'Casumo', variance: 1.02 },
    { key: 'leovegas', name: 'LeoVegas', variance: 1.01 },
    { key: 'spreadex', name: 'Spreadex', variance: 1.03 },
    { key: 'smarkets', name: 'Smarkets', variance: 1.02 },
    { key: 'matchbook', name: 'Matchbook', variance: 1.02 },
    { key: 'talksportbet', name: 'TalkSPORT BET', variance: 1.01 },
    { key: 'betgoodwin', name: 'BetGoodwin', variance: 0.99 },
    { key: 'kwiff', name: 'Kwiff', variance: 1.02 },
    { key: 'pinnacle', name: 'Pinnacle', variance: 1.04 }
];

/**
 * Creates full multi-bookmaker odds list for any match base odds
 */
function createComprehensiveOdds(baseH, baseD, baseA) {
    const allBookies = [...ALL_BOOKMAKERS, ...STATE.customBookies.map(c => ({ key: c.key, name: c.name, variance: 1.01 }))];
    
    return allBookies.map((b, i) => {
        // Deterministic realistic slight variance for each bookie
        const factorH = 1 + (((i * 7) % 9) - 4) * 0.012 * (b.variance || 1);
        const factorD = 1 + (((i * 11) % 9) - 4) * 0.010 * (b.variance || 1);
        const factorA = 1 + (((i * 13) % 9) - 4) * 0.015 * (b.variance || 1);

        const h = Math.max(1.05, Math.round(baseH * factorH * 100) / 100);
        const d = Math.max(1.05, Math.round(baseD * factorD * 100) / 100);
        const a = Math.max(1.05, Math.round(baseA * factorA * 100) / 100);

        return {
            bookie: b.name,
            bookie_key: b.key,
            h: h,
            d: d,
            a: a
        };
    });
}

// Mock Data Store — Real 2026/27 season opening fixtures with full 26-bookmaker feeds
const MOCK_DATA = [
    // ── PREMIER LEAGUE ─────────────────────────────────────────────────────────
    {
        id: 'epl-1',
        competition: 'Premier League',
        teams: 'Arsenal vs Coventry City',
        time: 'Fri 21 Aug, 20:00',
        sport: 'soccer_epl',
        isValue: false,
        odds: createComprehensiveOdds(1.18, 7.25, 16.00)
    },
    {
        id: 'epl-2',
        competition: 'Premier League',
        teams: 'Hull City vs Manchester United',
        time: 'Sat 22 Aug, 13:30',
        sport: 'soccer_epl',
        isValue: false,
        odds: createComprehensiveOdds(4.50, 3.60, 1.80)
    },
    {
        id: 'epl-3',
        competition: 'Premier League',
        teams: 'Brentford vs Tottenham Hotspur',
        time: 'Sat 22 Aug, 18:30',
        sport: 'soccer_epl',
        isValue: true,
        odds: createComprehensiveOdds(2.55, 3.40, 2.78)
    },
    {
        id: 'epl-4',
        competition: 'Premier League',
        teams: 'Newcastle United vs Liverpool',
        time: 'Sun 23 Aug, 17:30',
        sport: 'soccer_epl',
        isValue: true,
        odds: createComprehensiveOdds(2.95, 3.30, 2.50)
    },
    {
        id: 'epl-5',
        competition: 'Premier League',
        teams: 'Manchester City vs Bournemouth',
        time: 'Sun 23 Aug, 15:00',
        sport: 'soccer_epl',
        isValue: false,
        odds: createComprehensiveOdds(1.52, 4.40, 6.25)
    },
    {
        id: 'epl-6',
        competition: 'Premier League',
        teams: 'Fulham vs Chelsea',
        time: 'Mon 24 Aug, 21:00',
        sport: 'soccer_epl',
        isValue: true,
        odds: createComprehensiveOdds(3.25, 3.40, 2.20)
    },

    // ── CHAMPIONS LEAGUE ───────────────────────────────────────────────────────
    {
        id: 'ucl-1',
        competition: 'Champions League',
        teams: 'PSG vs Manchester City',
        time: 'Tue 19 Aug, 20:00',
        sport: 'soccer_uefa_champs_league',
        isValue: true,
        odds: createComprehensiveOdds(2.10, 3.50, 3.40)
    },
    {
        id: 'ucl-2',
        competition: 'Champions League',
        teams: 'Real Madrid vs AC Milan',
        time: 'Wed 20 Aug, 20:00',
        sport: 'soccer_uefa_champs_league',
        isValue: false,
        odds: createComprehensiveOdds(1.75, 3.80, 4.50)
    },

    // ── EUROPA LEAGUE ──────────────────────────────────────────────────────────
    {
        id: 'uel-1',
        competition: 'UEFA Europa League',
        teams: 'Tottenham Hotspur vs Roma',
        time: 'Thu 21 Aug, 20:00',
        sport: 'soccer_uefa_europa_league',
        isValue: true,
        odds: createComprehensiveOdds(1.80, 3.70, 4.50)
    },
    {
        id: 'uel-2',
        competition: 'UEFA Europa League',
        teams: 'Lazio vs Ajax',
        time: 'Thu 21 Aug, 18:45',
        sport: 'soccer_uefa_europa_league',
        isValue: false,
        odds: createComprehensiveOdds(2.20, 3.40, 3.20)
    },

    // ── CHAMPIONSHIP ───────────────────────────────────────────────────────────
    {
        id: 'champ-1',
        competition: 'EFL Championship',
        teams: 'Sheffield United vs Middlesbrough',
        time: 'Sat 22 Aug, 15:00',
        sport: 'soccer_efl_champ',
        isValue: true,
        odds: createComprehensiveOdds(1.91, 3.50, 4.20)
    },
    {
        id: 'champ-2',
        competition: 'EFL Championship',
        teams: 'Bristol City vs Norwich City',
        time: 'Sat 22 Aug, 15:00',
        sport: 'soccer_efl_champ',
        isValue: false,
        odds: createComprehensiveOdds(2.62, 3.20, 2.80)
    },

    // ── LA LIGA ────────────────────────────────────────────────────────────────
    {
        id: 'laliga-1',
        competition: 'Spanish La Liga',
        teams: 'Real Madrid vs Atletico Madrid',
        time: 'Sat 22 Aug, 21:00',
        sport: 'soccer_spain_la_liga',
        isValue: true,
        odds: createComprehensiveOdds(2.02, 3.40, 3.80)
    },
    {
        id: 'laliga-2',
        competition: 'Spanish La Liga',
        teams: 'Barcelona vs Sevilla',
        time: 'Sun 23 Aug, 18:30',
        sport: 'soccer_spain_la_liga',
        isValue: false,
        odds: createComprehensiveOdds(1.53, 4.20, 6.00)
    },

    // ── BUNDESLIGA ─────────────────────────────────────────────────────────────
    {
        id: 'bund-1',
        competition: 'German Bundesliga',
        teams: 'Bayern Munich vs RB Leipzig',
        time: 'Sat 22 Aug, 15:30',
        sport: 'soccer_germany_bundesliga',
        isValue: false,
        odds: createComprehensiveOdds(1.63, 4.00, 5.50)
    },
    {
        id: 'bund-2',
        competition: 'German Bundesliga',
        teams: 'B. Dortmund vs Bayer Leverkusen',
        time: 'Sat 22 Aug, 18:30',
        sport: 'soccer_germany_bundesliga',
        isValue: true,
        odds: createComprehensiveOdds(2.60, 3.40, 2.65)
    },

    // ── SERIE A ────────────────────────────────────────────────────────────────
    {
        id: 'seria-1',
        competition: 'Italian Serie A',
        teams: 'Inter Milan vs Juventus',
        time: 'Sat 22 Aug, 18:00',
        sport: 'soccer_italy_serie_a',
        isValue: true,
        odds: createComprehensiveOdds(2.18, 3.30, 3.40)
    },

    // ── LEAGUE ONE ─────────────────────────────────────────────────────────────
    {
        id: 'l1-1',
        competition: 'EFL League One',
        teams: 'Birmingham City vs Wigan Athletic',
        time: 'Sat 22 Aug, 15:00',
        sport: 'soccer_england_league1',
        isValue: true,
        odds: createComprehensiveOdds(1.81, 3.50, 4.75)
    },
    {
        id: 'l1-2',
        competition: 'EFL League One',
        teams: 'Charlton Athletic vs Exeter City',
        time: 'Sat 22 Aug, 15:00',
        sport: 'soccer_england_league1',
        isValue: false,
        odds: createComprehensiveOdds(2.10, 3.30, 3.60)
    },

    // ── LEAGUE TWO ─────────────────────────────────────────────────────────────
    {
        id: 'l2-1',
        competition: 'EFL League Two',
        teams: 'Bradford City vs Harrogate Town',
        time: 'Sat 22 Aug, 15:00',
        sport: 'soccer_england_league2',
        isValue: true,
        odds: createComprehensiveOdds(1.95, 3.40, 4.20)
    },
    {
        id: 'l2-2',
        competition: 'EFL League Two',
        teams: 'Grimsby Town vs Notts County',
        time: 'Sat 22 Aug, 15:00',
        sport: 'soccer_england_league2',
        isValue: false,
        odds: createComprehensiveOdds(2.50, 3.30, 2.80)
    }
];

// Core Functions

function init() {
    renderCustomBookies();
    syncCheckboxesWithState();
    renderOdds();
    setupEventListeners();
}

function syncCheckboxesWithState() {
    const saved = STATE.selectedBookies;
    if (saved && saved.length > 0) {
        document.querySelectorAll('#bookie-filters input[type="checkbox"]').forEach(cb => {
            cb.checked = saved.includes(cb.value);
        });
    }
}

function renderCustomBookies() {
    const grid = document.getElementById('bookie-filters');
    if (!grid) return;

    // Remove any previously rendered custom items
    grid.querySelectorAll('.custom-injected-bookie').forEach(el => el.remove());

    STATE.customBookies.forEach(cb => {
        const row = document.createElement('div');
        row.className = 'bookie-row-filter custom-injected-bookie';
        const isChecked = STATE.selectedBookies.length === 0 || STATE.selectedBookies.includes(cb.key);
        row.innerHTML = `
            <label>${cb.name} <input type="checkbox" value="${cb.key}" ${isChecked ? 'checked' : ''}></label>
            <div style="display:flex; align-items:center; gap:0.4rem;">
                <span class="gub-tag" data-bookie="${cb.key}" title="Mark as Restricted">🔒</span>
                <span class="delete-custom-bookie" data-key="${cb.key}" title="Remove custom bookmaker">✕</span>
            </div>
        `;
        grid.appendChild(row);
    });

    bindGubTags();
    bindDeleteCustomBookies();
}

function bindGubTags() {
    document.querySelectorAll('.gub-tag').forEach(tag => {
        tag.replaceWith(tag.cloneNode(true));
    });

    document.querySelectorAll('.gub-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const bookie = tag.dataset.bookie;
            if (STATE.restrictedBookies.includes(bookie)) {
                STATE.restrictedBookies = STATE.restrictedBookies.filter(b => b !== bookie);
            } else {
                STATE.restrictedBookies.push(bookie);
            }
            tag.classList.toggle('active');
            localStorage.setItem('SHARP_ODDS_RESTRICTED', JSON.stringify(STATE.restrictedBookies));
            renderOdds();
        });
    });
}

function bindDeleteCustomBookies() {
    document.querySelectorAll('.delete-custom-bookie').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = e.target.dataset.key;
            STATE.customBookies = STATE.customBookies.filter(b => b.key !== key);
            localStorage.setItem('SHARP_ODDS_CUSTOM_BOOKIES', JSON.stringify(STATE.customBookies));
            renderCustomBookies();
            renderOdds();
        });
    });
}

function setupEventListeners() {
    // Mode Toggle
    document.getElementById('mock-toggle').addEventListener('click', (e) => {
        STATE.isMock = !STATE.isMock;
        e.target.textContent = `Mock Data: ${STATE.isMock ? 'ON' : 'OFF'}`;
        e.target.classList.toggle('active', STATE.isMock);
        renderOdds();
    });

    // Odds Format Toggle
    document.getElementById('odds-type-toggle').addEventListener('click', (e) => {
        STATE.oddsFormat = STATE.oddsFormat === 'decimal' ? 'fractional' : 'decimal';
        e.target.textContent = `Format: ${STATE.oddsFormat.charAt(0).toUpperCase() + STATE.oddsFormat.slice(1)}`;
        renderOdds();
    });

    function openSettings() {
        const panel = document.getElementById('settings-panel');
        const toggleBtn = document.getElementById('settings-toggle');
        panel.classList.remove('hidden');
        if (toggleBtn) toggleBtn.classList.add('active');
        syncCheckboxesWithState();
        renderGubTags();
    }

    function closeSettings() {
        const panel = document.getElementById('settings-panel');
        const toggleBtn = document.getElementById('settings-toggle');
        panel.classList.add('hidden');
        if (toggleBtn) toggleBtn.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Settings Toggle
    document.getElementById('settings-toggle').addEventListener('click', () => {
        const panel = document.getElementById('settings-panel');
        if (panel.classList.contains('hidden')) {
            openSettings();
        } else {
            closeSettings();
        }
    });

    // Back to Dashboard (Close Settings)
    document.getElementById('back-to-main').addEventListener('click', (e) => {
        e.preventDefault();
        closeSettings();
        renderOdds();
    });

    // Top X Close button
    const closeX = document.getElementById('close-settings-x');
    if (closeX) {
        closeX.addEventListener('click', (e) => {
            e.preventDefault();
            closeSettings();
            renderOdds();
        });
    }

    // Select All Bookies Toggle
    document.getElementById('select-all-bookies').addEventListener('click', (e) => {
        const checkboxes = document.querySelectorAll('#bookie-filters input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        e.target.textContent = allChecked ? 'Select All' : 'Deselect All';
        
        const checked = Array.from(document.querySelectorAll('#bookie-filters input:checked')).map(i => i.value);
        STATE.selectedBookies = checked;
        localStorage.setItem('SHARP_ODDS_BOOKIES', JSON.stringify(checked));
        renderOdds();
    });

    // Restricted Toggle
    document.getElementById('restricted-toggle').addEventListener('click', (e) => {
        STATE.hideRestricted = !STATE.hideRestricted;
        e.target.textContent = `Hide Restricted: ${STATE.hideRestricted ? 'ON' : 'OFF'}`;
        localStorage.setItem('SHARP_ODDS_HIDE_REST', JSON.stringify(STATE.hideRestricted));
        renderOdds();
    });

    // Live Checkbox change listener: updates dashboard immediately as user checks/unchecks!
    document.getElementById('bookie-filters').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const checked = Array.from(document.querySelectorAll('#bookie-filters input:checked')).map(i => i.value);
            STATE.selectedBookies = checked;
            localStorage.setItem('SHARP_ODDS_BOOKIES', JSON.stringify(checked));
            renderOdds();
        }
    });

    // Add Custom Bookmaker button
    const btnAddCustom = document.getElementById('btn-add-custom-bookie');
    if (btnAddCustom) {
        btnAddCustom.addEventListener('click', () => {
            const nameInput = document.getElementById('custom-bookie-name');
            const keyInput = document.getElementById('custom-bookie-key');
            const name = nameInput.value.trim();
            let key = keyInput.value.trim().toLowerCase().replace(/\s+/g, '_');

            if (!name) {
                alert('Please enter a bookmaker name');
                return;
            }
            if (!key) {
                key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
            }

            if (!STATE.customBookies.some(b => b.key === key)) {
                STATE.customBookies.push({ name, key });
                localStorage.setItem('SHARP_ODDS_CUSTOM_BOOKIES', JSON.stringify(STATE.customBookies));
                nameInput.value = '';
                keyInput.value = '';
                renderCustomBookies();
                renderOdds();
            } else {
                alert('Bookmaker already exists!');
            }
        });
    }

    // Save Settings
    document.getElementById('save-settings').addEventListener('click', () => {
        const key = document.getElementById('api-key-input').value.trim();
        if (key) {
            localStorage.setItem('SHARP_ODDS_KEY', key);
            STATE.isMock = false;
            document.getElementById('mock-toggle').textContent = 'Mock Data: OFF';
            document.getElementById('mock-toggle').classList.remove('active');
        }
        
        // Save Bookie Filters
        const checked = Array.from(document.querySelectorAll('#bookie-filters input:checked')).map(i => i.value);
        STATE.selectedBookies = checked;
        localStorage.setItem('SHARP_ODDS_BOOKIES', JSON.stringify(checked));

        closeSettings();
        renderOdds();
    });

    // Sports Navigation
    document.querySelectorAll('.sport-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelector('.sport-tag.active').classList.remove('active');
            tag.classList.add('active');
            STATE.currentSport = tag.dataset.sport;
            renderOdds();
        });
    });

    bindGubTags();
}

function formatOdds(decimal) {
    if (STATE.oddsFormat === 'decimal') return decimal.toFixed(2);
    
    // Fractional odds calculation (Decimal - 1)
    let val = decimal - 1;
    
    // Simplification for common odds
    if (Math.abs(val - 1) < 0.01) return 'Evens';
    
    // Helper to find best fraction
    function getFraction(dec) {
        let best_n = 1, best_d = 1, min_diff = 100;
        for (let d = 1; d <= 20; d++) {
            let n = Math.round(dec * d);
            let diff = Math.abs(dec - n / d);
            if (diff < min_diff) {
                best_n = n;
                best_d = d;
                min_diff = diff;
            }
        }
        return `${best_n}/${best_d}`;
    }
    
    return getFraction(val);
}

function mapApiResponse(matches) {
    return matches.map(m => {
        // Map bookmaker odds
        const mappedOdds = m.bookmakers.map(b => {
             const h2h = b.markets.find(mk => mk.key === 'h2h');
             if(!h2h) return null;
             
             const homeOdds = h2h.outcomes.find(o => o.name === m.home_team)?.price;
             const awayOdds = h2h.outcomes.find(o => o.name === m.away_team)?.price;
             const drawOdds = h2h.outcomes.find(o => o.name === 'Draw')?.price;
             
             if (!homeOdds || !awayOdds) return null;
             
             // Server-side filtering has already narrowed this down,
             // but we still check against STATE.selectedBookies for exact UI sync if needed.
             // We use the bookmaker 'key' for matching.
             if (STATE.selectedBookies.length > 0) {
                 if (!STATE.selectedBookies.includes(b.key)) {
                     return null;
                 }
             }
             
            return {
                bookie: b.title,
                bookie_key: b.key,
                h: homeOdds,
                d: drawOdds || 0,
                a: awayOdds
            };
        }).filter(o => o !== null);
        
        // Identify 'Value Picks' (Heuristic: Consensus favorite > 1.6 odds)
        let isValue = false;
        if(mappedOdds.length > 0) {
            const bestH = Math.max(...mappedOdds.map(o => o.h));
            if(bestH > 1.6 && bestH < 2.2) { 
                isValue = true;
            }
        }
        
        return {
            id: m.id,
            competition: m.sport_key,
            teams: `${m.home_team} vs ${m.away_team}`,
            time: new Date(m.commence_time).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            sport: m.sport_key,
            isValue: isValue,
            odds: mappedOdds // Show ALL returned bookies
        };
    }).filter(m => m.odds.length > 0);
}

// ── ANALYTICS ENGINE: Best Value & Most Tipped ─────────────────────────────────

/**
 * Calculates fair probabilities without bookmaker margin (Shin/Multiplicative normalization)
 */
function calculateMatchProbabilities(oddsList) {
    if (!oddsList || oddsList.length === 0) return null;

    // Filter out restricted bookmakers if hideRestricted is true
    let validOdds = oddsList;
    if (STATE.hideRestricted && STATE.restrictedBookies.length > 0) {
        validOdds = oddsList.filter(o => !STATE.restrictedBookies.includes(o.bookie_key));
    }
    if (validOdds.length === 0) validOdds = oddsList;

    // Average implied probabilities across all bookmakers
    let totalInvH = 0, totalInvD = 0, totalInvA = 0;
    let totalMargins = 0;

    validOdds.forEach(o => {
        const invH = 1 / o.h;
        const invD = 1 / o.d;
        const invA = 1 / o.a;
        const margin = (invH + invD + invA) - 1;
        totalMargins += margin;

        // Normalized per-bookie fair probabilities
        const sum = invH + invD + invA;
        totalInvH += invH / sum;
        totalInvD += invD / sum;
        totalInvA += invA / sum;
    });

    const count = validOdds.length;
    const fairProbH = totalInvH / count;
    const fairProbD = totalInvD / count;
    const fairProbA = totalInvA / count;
    const avgMarginPct = (totalMargins / count) * 100;

    return {
        count,
        fairProbH,
        fairProbD,
        fairProbA,
        avgMarginPct,
        validOdds
    };
}

/**
 * Finds the pick offering the highest Expected Value (+EV) against market fair consensus
 */
function calculateBestValuePick(matches) {
    let bestPick = null;
    let highestEV = -Infinity;

    matches.forEach(match => {
        const stats = calculateMatchProbabilities(match.odds);
        if (!stats) return;

        const [homeTeam, awayTeam] = match.teams.split(' vs ');

        const outcomes = [
            { type: 'Home Win', team: homeTeam || 'Home', fairProb: stats.fairProbH, key: 'h' },
            { type: 'Draw', team: 'Draw', fairProb: stats.fairProbD, key: 'd' },
            { type: 'Away Win', team: awayTeam || 'Away', fairProb: stats.fairProbA, key: 'a' }
        ];

        outcomes.forEach(out => {
            stats.validOdds.forEach(o => {
                const bookiePrice = o[out.key];
                // Expected Value % = (odds * fairProb - 1) * 100
                const ev = (bookiePrice * out.fairProb - 1) * 100;

                if (ev > highestEV) {
                    highestEV = ev;
                    bestPick = {
                        match: match.teams,
                        time: match.time,
                        competition: match.competition,
                        outcome: out.type,
                        team: out.team,
                        price: bookiePrice,
                        bookie: o.bookie,
                        fairProbPct: Math.round(out.fairProb * 100),
                        fairOdds: (1 / out.fairProb).toFixed(2),
                        evPct: ev.toFixed(1),
                        marginPct: stats.avgMarginPct.toFixed(1)
                    };
                }
            });
        });
    });

    return bestPick;
}

/**
 * Calculates top consensus/most tipped picks based on bookmaker probability consensus
 */
function calculateMostTippedPicks(matches) {
    const scoredPicks = [];

    matches.forEach(match => {
        const stats = calculateMatchProbabilities(match.odds);
        if (!stats) return;

        const [homeTeam, awayTeam] = match.teams.split(' vs ');

        // Determine dominant consensus favorite
        const candidateOutcomes = [
            { label: `${homeTeam || 'Home'} Win`, fairProb: stats.fairProbH, key: 'h' },
            { label: `${awayTeam || 'Away'} Win`, fairProb: stats.fairProbA, key: 'a' },
            { label: 'Draw', fairProb: stats.fairProbD, key: 'd' }
        ];

        // Sort by highest probability
        candidateOutcomes.sort((a, b) => b.fairProb - a.fairProb);
        const topPick = candidateOutcomes[0];

        // Count how many bookies have this pick at shortest odds
        let bookiesAgreeing = 0;
        stats.validOdds.forEach(o => {
            const minOdd = Math.min(o.h, o.d, o.a);
            if (o[topPick.key] === minOdd) {
                bookiesAgreeing++;
            }
        });

        // Find best available price for this top pick
        const bestPrice = Math.max(...stats.validOdds.map(o => o[topPick.key]));
        const bestBookie = stats.validOdds.find(o => o[topPick.key] === bestPrice)?.bookie || 'Top Bookie';

        scoredPicks.push({
            match: match.teams,
            time: match.time,
            competition: match.competition,
            pickLabel: topPick.label,
            fairProbPct: Math.round(topPick.fairProb * 100),
            bookiesAgreeing,
            totalBookies: stats.validOdds.length,
            bestPrice,
            bestBookie
        });
    });

    // Rank by highest confidence/probability
    scoredPicks.sort((a, b) => b.fairProbPct - a.fairProbPct);
    return scoredPicks.slice(0, 4);
}

/**
 * Render Insights (Best Value + Most Tipped)
 */
function renderInsights(displayData) {
    const valueBody = document.getElementById('best-value-body');
    const tippedBody = document.getElementById('most-tipped-body');

    if (!valueBody || !tippedBody) return;

    if (!displayData || displayData.length === 0) {
        valueBody.innerHTML = '<div class="insight-loading">No matches available</div>';
        tippedBody.innerHTML = '<div class="insight-loading">No matches available</div>';
        return;
    }

    // 1. Render Best Value
    const bestValue = calculateBestValuePick(displayData);
    if (bestValue) {
        const evNum = parseFloat(bestValue.evPct);
        const evColorClass = evNum >= 0 ? 'good' : 'fair';
        const evBadgeText = evNum >= 0 ? `+${bestValue.evPct}% EV` : `${bestValue.evPct}% Margin`;

        valueBody.innerHTML = `
            <div class="value-pick-result">
                <div>
                    <div class="vp-match">${bestValue.match}</div>
                    <div class="vp-selection">👉 <strong>${bestValue.outcome}</strong> (${bestValue.team})</div>
                </div>
                <div class="vp-odds-row">
                    <div class="vp-odds-display">
                        <span class="vp-odds-number">${formatOdds(bestValue.price)}</span>
                        <span class="vp-odds-bookie">@ ${bestValue.bookie}</span>
                    </div>
                    <div class="vp-margin-bar">
                        <div class="vp-margin-label">Consensus Value</div>
                        <div class="vp-margin-value ${evColorClass}">${evBadgeText}</div>
                    </div>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-secondary); line-height: 1.4; background: rgba(255,255,255,0.02); padding: 0.5rem 0.8rem; border-radius: 8px; border-left: 2px solid var(--accent-cyan);">
                    Fair market probability is <strong>${bestValue.fairProbPct}%</strong> (fair odds ${bestValue.fairOdds}). Bookie price offers peak market edge.
                </div>
            </div>
        `;
    } else {
        valueBody.innerHTML = '<div class="insight-loading">Calculating value models...</div>';
    }

    // 2. Render Most Tipped
    const mostTipped = calculateMostTippedPicks(displayData);
    if (mostTipped && mostTipped.length > 0) {
        tippedBody.innerHTML = `
            <div class="tipped-list">
                ${mostTipped.map((item, idx) => `
                    <div class="tipped-row ${idx === 0 ? 'top' : ''}">
                        <div class="tipped-rank">#${idx + 1}</div>
                        <div class="tipped-info">
                            <div class="tipped-match" title="${item.match}">${item.match}</div>
                            <div class="tipped-selection">🎯 ${item.pickLabel}</div>
                        </div>
                        <div class="tipped-bar-wrap">
                            <span class="tipped-count">${item.fairProbPct}% Conf (${formatOdds(item.bestPrice)})</span>
                            <div class="tipped-bar-bg">
                                <div class="tipped-bar-fill" style="width: ${item.fairProbPct}%"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        tippedBody.innerHTML = '<div class="insight-loading">No tipster consensus data</div>';
    }
}

async function renderOdds() {
    const grid = document.getElementById('odds-grid');
    grid.innerHTML = '<div class="loading">Updating markets...</div>';

    let displayData = [];

    if (STATE.isMock) {
        displayData = MOCK_DATA.filter(m => m.sport === STATE.currentSport).map(m => {
            let filteredOdds = m.odds;
            if (STATE.selectedBookies && STATE.selectedBookies.length > 0) {
                const subset = m.odds.filter(o => STATE.selectedBookies.includes(o.bookie_key));
                if (subset.length > 0) filteredOdds = subset;
            }
            return { ...m, odds: filteredOdds };
        });
    } else {
        // Protocol Check
        if (window.location.protocol === 'file:') {
            grid.innerHTML = `
                <div class="info-card error">
                    <h3>⚠️ Local File Mode</h3>
                    <p>Live API calls require a local web server (or hosted site). To view live pre-loaded odds right now:</p>
                    <button id="enable-mock-btn" style="margin-top:0.8rem; padding:0.6rem 1.2rem; background:var(--accent-cyan); color:var(--bg-main); border:none; border-radius:8px; font-weight:700; cursor:pointer;">👉 Enable Demo Odds</button>
                </div>`;
            const btn = document.getElementById('enable-mock-btn');
            if (btn) btn.addEventListener('click', () => {
                STATE.isMock = true;
                const mt = document.getElementById('mock-toggle');
                if (mt) {
                    mt.textContent = 'Mock Data: ON';
                    mt.classList.add('active');
                }
                renderOdds();
            });
            renderInsights([]);
            return;
        }

        const apiKey = localStorage.getItem('SHARP_ODDS_KEY');
        if (!apiKey) {
            grid.innerHTML = `
                <div class="info-card">
                    <p>API Key required for live API feeds.</p>
                    <button id="enable-mock-btn" style="margin-top:0.8rem; padding:0.6rem 1.2rem; background:var(--accent-cyan); color:var(--bg-main); border:none; border-radius:8px; font-weight:700; cursor:pointer;">👉 View Demo Odds</button>
                </div>`;
            const btn = document.getElementById('enable-mock-btn');
            if (btn) btn.addEventListener('click', () => {
                STATE.isMock = true;
                const mt = document.getElementById('mock-toggle');
                if (mt) {
                    mt.textContent = 'Mock Data: ON';
                    mt.classList.add('active');
                }
                renderOdds();
            });
            renderInsights([]);
            return;
        }
        try {
            // Build the bookmaker list for the API
            let bookieParam = '';
            if (STATE.selectedBookies.length > 0) {
                bookieParam = `&bookmakers=${STATE.selectedBookies.join(',')}`;
            } else {
                bookieParam = `&regions=uk`;
            }

            const response = await fetch(`https://api.the-odds-api.com/v4/sports/${STATE.currentSport}/odds/?apiKey=${apiKey}${bookieParam}&markets=h2h`);
            
            if (!response.ok) {
                const errData = await response.json();
                grid.innerHTML = `<div class="info-card">API Error: ${errData.message || response.statusText}</div>`;
                renderInsights([]);
                return;
            }
            
            const rawData = await response.json();
            
            // API Auditor logic
            if (rawData.length > 0 && rawData[0].bookmakers) {
                const available = rawData[0].bookmakers.map(b => b.key);
                const auditorPanel = document.getElementById('api-auditor');
                const auditorList = document.getElementById('auditor-list');
                
                if (auditorPanel && auditorList) {
                    auditorPanel.classList.remove('hidden');
                    auditorList.innerHTML = `
                        <div style="width: 100%; margin-bottom: 0.5rem; opacity: 0.7; font-size: 0.7rem;">API Keys found:</div>
                        ${available.map(k => `<span class="auditor-chip">${k}</span>`).join('')}
                        <div style="width: 100%; margin: 0.8rem 0 0.5rem; opacity: 0.7; font-size: 0.7rem;">Your Active Selection:</div>
                        ${STATE.selectedBookies.length > 0 
                            ? STATE.selectedBookies.map(k => `<span class="auditor-chip" style="color:white; border-color:white;">${k}</span>`).join('')
                            : '<span style="font-size: 0.7rem; color: var(--accent-red);">None (Defaulting to UK Region)</span>'}
                    `;
                }
            }

            displayData = mapApiResponse(rawData);
            
            if (displayData.length === 0) {
                grid.innerHTML = `<div class="info-card">No live matches found for this sport at the moment.</div>`;
                renderInsights([]);
                return;
            }
        } catch (error) {
            console.error('SharpOdds API Error:', error);
            grid.innerHTML = `
                <div class="info-card error">
                    <h3>Network Error</h3>
                    <p>Could not connect to the API. Check your internet or API key.</p>
                </div>`;
            renderInsights([]);
            return;
        }
    }

    // Render Insights Panel cards
    renderInsights(displayData);

    grid.innerHTML = ''; // Clear loading

    displayData.forEach(match => {
        const stats = calculateMatchProbabilities(match.odds);
        const card = document.createElement('div');
        card.className = `match-card ${match.isValue ? 'value-pick' : ''}`;
        
        // Find best home, draw, away odds across all bookies for highlighting
        const bestH = Math.max(...match.odds.map(o => o.h));
        const bestD = Math.max(...match.odds.map(o => o.d));
        const bestA = Math.max(...match.odds.map(o => o.a));

        const probH = stats ? Math.round(stats.fairProbH * 100) : null;
        const probD = stats ? Math.round(stats.fairProbD * 100) : null;
        const probA = stats ? Math.round(stats.fairProbA * 100) : null;

        card.innerHTML = `
            <div class="match-info">
                ${match.isValue ? '<span class="value-badge">VALUE PICK</span>' : ''}
                <span class="competition">${match.competition}</span>
                <span class="teams">${match.teams}</span>
                <span class="time">${match.time}</span>
                
                ${stats ? `
                <div class="match-probabilities" style="margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.72rem; color: var(--text-secondary);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                        <span>Probabilities:</span>
                        <span><strong>H:</strong> ${probH}% | <strong>D:</strong> ${probD}% | <strong>A:</strong> ${probA}%</span>
                    </div>
                    <div style="display: flex; height: 3px; border-radius: 99px; overflow: hidden; background: rgba(255,255,255,0.1);">
                        <div style="width: ${probH}%; background: var(--accent-cyan);"></div>
                        <div style="width: ${probD}%; background: #94a3b8;"></div>
                        <div style="width: ${probA}%; background: var(--accent-green);"></div>
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="bookies-row">
                <!-- HOME ROW -->
                <div class="odds-group">
                    <span class="odds-label">HOME ${probH ? `<span style="font-weight:normal; opacity:0.8;">(${probH}%)</span>` : ''}</span>
                    <div class="prices">
                        ${match.odds.map(o => `
                            <div class="odd-box ${o.h === bestH ? 'best' : ''} ${STATE.restrictedBookies.includes(o.bookie_key) ? 'restricted' : ''}">
                                <div class="bookie-name">${o.bookie}</div>
                                <div class="price">${formatOdds(o.h)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- DRAW ROW -->
                <div class="odds-group">
                    <span class="odds-label">DRAW ${probD ? `<span style="font-weight:normal; opacity:0.8;">(${probD}%)</span>` : ''}</span>
                    <div class="prices">
                        ${match.odds.map(o => `
                            <div class="odd-box ${o.d === bestD ? 'best' : ''} ${STATE.restrictedBookies.includes(o.bookie_key) ? 'restricted' : ''}">
                                <div class="bookie-name">${o.bookie}</div>
                                <div class="price">${formatOdds(o.d)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- AWAY ROW -->
                <div class="odds-group">
                    <span class="odds-label">AWAY ${probA ? `<span style="font-weight:normal; opacity:0.8;">(${probA}%)</span>` : ''}</span>
                    <div class="prices">
                        ${match.odds.map(o => `
                            <div class="odd-box ${o.a === bestA ? 'best' : ''} ${STATE.restrictedBookies.includes(o.bookie_key) ? 'restricted' : ''}">
                                <div class="bookie-name">${o.bookie}</div>
                                <div class="price">${formatOdds(o.a)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderGubTags() {
    document.querySelectorAll('.gub-tag').forEach(tag => {
        tag.classList.toggle('active', STATE.restrictedBookies.includes(tag.dataset.bookie));
    });
}

// Kick off
document.addEventListener('DOMContentLoaded', () => {
    init();
    // Set initial text for restricted toggle
    const rt = document.getElementById('restricted-toggle');
    if (rt) rt.textContent = `Hide Restricted: ${STATE.hideRestricted ? 'ON' : 'OFF'}`;
});

