# Tribune Trader

Stan's 30-year trading system — visualized and automated.

**Status:** Phase 1 MVP (Demo) — Senate architecture in progress.

- [Dashboard](dashboard.html) — Bloomberg-style live trading dashboard
- [System](index.html) — Overview of the trading methodology

## What This Is

Tribune Trader is the software layer around Stan Smidt's professional NASDAQ futures trading system. Stan has traded NQ futures for 30+ years using two primary tools:
- **S949 Cyclical Momentum Oscillator** — proprietary Rob Mitchell oscillator, Stan's primary signal
- **TickStrike** — real-time order flow meter (FinancialJuice)

The project goal: monitor Stan, train AI on his decision-making, then run it autonomously — with no emotion, no burnout, no limits.

## Stack

- Static HTML/CSS/JS — no framework
- TradingView widgets for live NQ chart data
- Netlify deployment
- Custom canvas oscillator visualization

## Not Financial Advice

This is a demonstration dashboard for internal use. Not financial advice.

