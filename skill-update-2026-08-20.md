# Tribune Trader — Session Skill Update
**Date:** 2026-08-20
**Session commits:** `9a968dd` (bug fixes), `[auth commit pending]` (password gate)

---

## Previous Skill File (2026-08-20 earlier)
https://res.cloudinary.com/dthdxjmgb/raw/upload/v1787192204/tribune-trader/tribune-trader-skill-2026-08-20.md

## Previous Session Handoff (2026-08-19)
https://res.cloudinary.com/dthdxjmgb/raw/upload/v1787187808/senate-sessions/tribune-trader-session-handoff-2026-08-19.md

---

## What Was Fixed This Session

### Bug 1 — SIM Oscillator (commit 9a968dd)
- **Problem:** `initSimulation()` fed CMO tiny near-random-walk prices (±1.5pt drifts at ~19800). CMO on that data = jagged/meaningless noise.
- **Fix:** In SIM fallback, replaced CMO computation with smooth multi-frequency sinusoidal: `sin(t)*22 + sin(t*1.7+1.2)*12 + sin(t*0.4)*6 + noise`. Coloring (green above zero / red below zero) was already correct in `drawOscillator()` — no changes needed there.
- **LIVE mode:** CMO from real QQQ prices unchanged. Correct.

### Bug 2 — Overlay Annotations Looping (commit 9a968dd)
- **Problem 1:** `ann.age = 0` in `drawDivergenceOverlay()` caused annotations to cycle forever on a fixed timer.
- **Problem 2 (new, found in code review):** `syncOverlayToMarket()` was only called at init + window resize, never on data refresh. So overlay positions never updated even when new real pairs were detected every 30s.
- **Problem 3:** When no real pairs detected, two hardcoded demo positions looped continuously at fixed % of screen — unrelated to actual chart.
- **Fix:** Removed `ann.age = 0` loop. Added `syncOverlayToMarket()` to `refreshData()` (runs every 30s). Removed demo fallback positions — overlay is blank when no real signal detected.

### Password Gate (auth commit)
- **Files added:** `login.html`, `auth-check.js`
- **Mechanism:** `auth-check.js` inlined into `<head>` of `index.html` + `dashboard.html`. Checks `sessionStorage.getItem('tt_auth') === 'granted'`. If not set, redirects to `/login.html?next=<destination>`.
- **Login:** SHA-256 comparison via SubtleCrypto. Raw password never stored anywhere. Hash in `login.html`.
- **Crawler protection:** `robots.txt` (disallow all) + `X-Robots-Tag: noindex` in `netlify.toml` already in place. Auth gate added on top.
- **Session scope:** Auth resets on browser close (sessionStorage, not localStorage). Deliberate — internal tool, short sessions preferred.

---

## Current Repo State
- **GitHub:** https://github.com/X-I-X/tribune-trading
- **Live:** https://tribune-trading.netlify.app
- **Local:** /home/node/.openclaw/workspace/tribune-trading/
- **Stack:** Pure static HTML/CSS/JS — Archivo + Inter + JetBrains Mono
- **Deploy:** Netlify auto-deploys from main

## Key Files
| File | Purpose |
|------|---------|
| `index.html` | Landing page |
| `dashboard.html` | Bloomberg-style trading dashboard |
| `login.html` | Password gate — Tribune branded |
| `auth-check.js` | Inline auth redirect — runs before page renders |
| `session-chart.js` | 8/17/2026 session reconstruction |
| `glossary.js` | 45+ hover tooltip definitions |
| `robots.txt` | Disallow all crawlers |
| `netlify.toml` | X-Robots-Tag noindex headers |

---

## Stan's System Understanding (unchanged — see previous skill file)
Decision hierarchy: S949 Oscillator → Divergence (T1/T2) → TickStrike (OVERRIDES ALL) → Fibonacci entry.
Four divergence patterns fully documented. Critical: pivot-selection is swing-based, not fixed lookback.

---

## Open Items (unchanged from previous skill file)
1. Stan consent before public launch
2. TickStrike NQ coverage verification (financialjuice.com login required)
3. Prop firm selection for bot (Topstep/Apex/Earn2Trade — TPT prohibits bots)
4. Data capture plan — screen capture during Stan's live sessions
5. Stan's exact Fibonacci levels — need NinjaTrader template
6. Stan's pivot-selection logic — needs live sessions
7. Phase 2 architecture — NinjaScript signal extraction
8. Confirm "S949" label with Stan
9. Verify TVC:NDX works free on embedded TradingView
10. Tribune Inc. incorporation — still blocking across all projects

---

## How to Resume Next Session
1. Read this file OR local copy: `infinite-agent/skills/tribune-trader/SKILL.md`
2. Pull repo: `cd /home/node/.openclaw/workspace/tribune-trading && git pull`
3. Check live: https://tribune-trading.netlify.app (requires password)
4. Check dashboard: https://tribune-trading.netlify.app/dashboard
5. Ask Heisenberg what to work on next
