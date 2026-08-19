/**
 * Tribune Trader — Glossary Tooltip System
 * Scans all text nodes for known terms and wraps them in hoverable tooltip spans.
 * Definitions sourced from: stan-s949-oscillator-analysis.md, tickstrike-analysis.md,
 * tpt-service-analysis.md, senate debate, and TRIBUNE-TRADER-MASTER.md
 */

const GLOSSARY = {
  // ── OSCILLATOR ──────────────────────────────────────────────────────────────
  "S949": "Stan's primary decision instrument. A cyclical momentum oscillator developed by Rob Mitchell, one of the largest S&P traders of the 1980s. Runs on a ±40 scale; green when rising, red when falling. Stan: \"This tells me more than anything.\"",
  "Cyclical Momentum Oscillator": "A technical indicator measuring the rate of change in price momentum over the market's natural cycle. Peaks and troughs align with price swing highs and lows. Divergence between the oscillator and price is the core trade signal.",
  "oscillator": "A bounded technical indicator that fluctuates between a high and low value, used to measure momentum. Stan's S949 runs on a ±40 scale with 0 as the neutral midpoint.",
  "±40": "The scale of Stan's S949 oscillator: +40 is maximum bullish momentum, -40 is maximum bearish momentum. The zero line divides bullish from bearish territory.",
  "zero line": "The dashed red horizontal line at 0 on the S949 oscillator. Crossing the zero line signals a momentum shift. The oscillator's relationship to the zero line indicates the broader trend direction.",
  "Rob Mitchell": "Creator of the S949 oscillator. One of the largest S&P futures traders in the 1980s. Stan received the indicator personally after meeting him in Oceanside, CA. The tool remains proprietary and has never been publicly released.",
  "divergence": "When the oscillator and price move in opposite directions at comparable swing points. If price sets a new high but the oscillator reads lower than the previous peak, momentum is weakening even as price extends. This is the core trade signal in Stan's system.",
  "Type 2 Divergence": "With-trend divergence — Stan's preferred setup. In an uptrend: price makes a higher low but oscillator makes a lower low (they disagree). Entry at the close of the signal candle. Target: prior swing high. Trading with the trend increases probability significantly.",
  "Type 1 Divergence": "Counter-trend divergence — picking tops and bottoms against the prevailing trend. Riskier than Type 2 but effective with this specific oscillator. Stan: \"You really don't want to do it, but it works pretty effectively with this.\"",
  "Gann Swing": "Stan's preferred method for identifying pivot points. A bar qualifies as a swing high when higher than bars on both sides; swing low when lower. More structurally precise than standard zigzag, which can skip or delay pivot recognition. Required for valid divergence comparison.",
  "swing high": "A price peak where the bar is higher than the bars immediately before and after it. Oscillator peaks at swing highs are compared across time to detect divergence.",
  "swing low": "A price trough where the bar is lower than the bars immediately before and after it. Oscillator troughs at swing lows are compared to detect bullish divergence.",
  "BUY signal": "A bullish divergence signal plotted by the S949 at a swing low. Displayed as a green upward arrow + \"BUY\" label on the chart. Entry at the close of the signal candle.",
  "SELL signal": "A bearish divergence signal plotted by the S949 at a swing high. Displayed as a magenta downward arrow + \"SELL\" label. Entry or exit at the close of the signal candle.",
  "momentum": "The rate of change of price movement. A market can be rising in price while losing momentum, which is the key divergence condition Stan trades. The oscillator measures this directly.",

  // ── ORDER FLOW ───────────────────────────────────────────────────────────────
  "TickStrike": "Real-time order flow meter by FinancialJuice. Shows buying (green) vs selling (red) pressure on a numeric scale. Stan's sweet spot: 11-14. Two channels: visual numeric readout and audio (sparse ticks = buying, machine-gun = selling). Stan: \"Nothing tells you what's going on right this second except order flow.\"",
  "order flow": "The real-time balance of aggressive buying (hitting the ask) versus aggressive selling (hitting the bid). TickStrike measures this. Stan uses it as live confirmation for oscillator signals, as it reflects what institutional algorithms are doing at this exact moment.",
  "FinancialJuice": "Provider of the TickStrike tool and financial data feed. Their widget can be embedded on any webpage. Internal data sourcing algorithm is proprietary (black box). Website: financialjuice.com.",
  "sweet spot": "TickStrike readings of 11-14. Indicates decisive institutional aggression. Stan's most reliable confirmation zone. Below 11 = active but not peak. Above 14 = extreme, may signal exhaustion.",
  "probing": "TickStrike reading of 8. Stan's warning level. The market is testing but not yet committed. Neither side is pressing hard. Treat as a signal under evaluation, not yet confirmed.",
  "Cumulative Delta": "The running difference between aggressive buying volume and aggressive selling volume. OrderFlowCumulativeDelta in NinjaScript is the technical equivalent of what TickStrike displays. Phase 2 plan: replace the TickStrike embed with this native calculation.",

  // ── SIGNAL STATES ─────────────────────────────────────────────────────────────
  "CONFIRMED": "Signal state: oscillator BUY or SELL signal plus TickStrike 10+ in the same direction. Both layers agree. Highest-probability entry. Green indicator.",
  "CONFLICTED": "Signal state: oscillator gives a signal but TickStrike is pressing the opposite direction. Wait or reduce position size. Real-time order flow is fighting the structural setup. Amber indicator.",
  "NEUTRAL": "Signal state: TickStrike below 9 or flipping without commitment. Low conviction on both sides. Oscillator signals generated here lack real-time confirmation. Gray indicator.",

  // ── PROP TRADING ──────────────────────────────────────────────────────────────
  "prop firm": "Proprietary trading firm. Funds traders to trade on their behalf, keeping a profit split (e.g., 20% to firm, 80% to trader). Traders use the firm's capital, not their own. Evaluation period required before funded account is granted.",
  "funded account": "A simulated trading account backed by a prop firm's capital. Real cash is paid on withdrawals. Stan's TPT account: $150,000 funded, 80/20 split once PRO status is earned.",
  "Take Profit Trader": "TPT. The prop firm Stan uses for manual trading. Florida LLC, founded 2021. Funds NQ futures traders after a Test phase. 80/20 split (PRO), 90/10 (PRO+). Critical note: TPT explicitly prohibits automated or bot trading. All trades must be manually executed.",
  "TPT": "Take Profit Trader. Stan's current prop trading firm. Manual trading only. See: Take Profit Trader.",
  "trailing drawdown": "A dynamic maximum loss limit that follows the trader's peak balance upward. If balance reaches $155,000 on a $150K account, the floor moves up too. Designed to protect the prop firm's capital. Once the floor reaches starting balance, it locks permanently.",
  "EOD Trailing Drawdown": "End-of-Day trailing drawdown. Floor adjusts once per day at 5pm ET based on end-of-day balance. More forgiving than intraday trailing drawdown because intraday unrealized gains don't raise the floor.",
  "intraday trailing drawdown": "The PRO account drawdown mechanic at TPT. Floor adjusts in real time, including unrealized (open) gains. If a trade swings to +$3,000 unrealized, the floor immediately rises by $3,000, even if you close at +$1,000. The most challenging aspect of the TPT PRO structure.",
  "Profit Target": "The minimum profit required to pass the Test phase and earn PRO status. On Stan's $150K account: $9,000. Must be reached while following all risk rules.",
  "PRO Account": "The funded account status at Take Profit Trader, earned by passing the Test. 80/20 profit split (trader keeps 80%). Intraday trailing drawdown applies. Up to 3 resets available.",
  "PRO+": "The live-exchange upgrade from PRO at TPT. 90/10 profit split. EOD (not intraday) trailing drawdown. No buffer requirement. Real orders go to the actual exchange. Auto-promotion implemented March 2026.",
  "buffer zone": "At TPT PRO: the first $4,500 of profit on a $150K account must be reached before the first withdrawal is available. Buffer = starting balance + drawdown amount. Once cleared, withdraw with no minimum or maximum.",
  "profit split": "The percentage of profits split between the trader and the prop firm. TPT PRO: 80/20 (you keep 80%). TPT PRO+: 90/10 (you keep 90%). Stan's current setup: PRO (80/20).",
  "reset": "Restarting a PRO account to its starting balance after hitting the drawdown limit. At TPT: up to 3 resets per PRO account, approximately $199 each.",
  "consistency rule": "TPT Test-phase rule: no single trading day can account for more than 50% of total net P&L. Encourages steady, disciplined trading rather than one big lucky day. Violating raises the effective profit target but does not fail the account.",
  "drawdown floor": "The minimum balance a trader's account must stay above. If balance touches or crosses the floor, the account is immediately liquidated. Calculated as: peak balance minus drawdown limit.",

  // ── INSTRUMENTS ───────────────────────────────────────────────────────────────
  "NQ": "E-mini NASDAQ-100 Futures. Stan's primary trading instrument. Tracks the NASDAQ-100 index. Each point = $20 profit or loss. Traded on CME Globex. Typical session range: hundreds of points. Stan's entry example: bought at 29,708, target 29,746 = 38 points = $760 on one contract.",
  "NASDAQ-100": "An index of the 100 largest non-financial companies listed on the NASDAQ exchange. Tech-heavy: includes Apple, Microsoft, NVIDIA, Tesla, Amazon. The NQ futures contract tracks this index.",
  "ES": "E-mini S&P 500 Futures. The most widely traded futures contract in the world. Each point = $50. Traded on CME Globex. Broader market exposure than NQ, less tech-concentrated.",
  "MNQ": "Micro E-mini NASDAQ-100. One-tenth the size of NQ: each point = $2 (vs NQ's $20). Ideal for learning, testing strategies, or trading with less capital at risk. Same market dynamics as NQ.",
  "MES": "Micro E-mini S&P 500. One-tenth the size of ES: each point = $5 (vs ES's $50). Same market exposure as ES at reduced contract size.",
  "YM": "E-mini Dow Jones Industrial Average Futures. Tracks the Dow Jones index (30 large-cap US companies). Each point = $5.",
  "RTY": "E-mini Russell 2000 Futures. Tracks 2,000 small-cap US companies. More volatile than NQ or ES. Each point = $50.",
  "GC": "Gold Futures. Traded on COMEX. Each contract = 100 troy ounces. Key safe-haven asset. Moves inversely to USD strength in many market regimes.",
  "CME": "Chicago Mercantile Exchange. The regulated exchange where NQ, ES, and most US futures contracts are traded. All TPT accounts use CME-approved data providers (Tradovate, NinjaTrader, Rithmic).",
  "futures contract": "An agreement to buy or sell a standardized asset at a predetermined price on a future date. NQ futures allow trading the NASDAQ-100 index with leverage. Unlike stocks, futures expire and roll to the next contract (e.g., SEP26 becomes DEC26).",
  "candlestick": "A price chart element showing open, high, low, and close for one time period. Stan uses 5-minute candles. The body shows open-to-close; wicks show the high and low. Color indicates direction: cyan (up) and yellow (down) on Stan's NinjaTrader setup.",
  "Point of Control": "POC. The price level with the highest trading volume during a session. Shown in Stan's volume profile (dProfile) panel. Often acts as support or resistance. Heavy volume at a level indicates strong market interest.",
  "volume profile": "A histogram on the right side of Stan's chart showing how much trading activity occurred at each price level during the session. Called dProfile in Stan's NinjaTrader setup.",
  "ATM Strategy": "Automated Trade Management. NinjaTrader's bracket order system. Stan uses \"NQ - Profit 42 Ticks\" to automatically set take-profit and stop-loss targets when entering a trade. 42 ticks = ~$840 per contract at $20/point.",

  // ── PLATFORMS ─────────────────────────────────────────────────────────────────
  "NinjaTrader": "Professional futures trading platform Stan has used since 2003. Includes advanced charting, order execution via Trade Eight brokerage, custom indicators via NinjaScript, REST API, WebSocket market data, and a native MCP server for AI integration. Free for charting and strategy development.",
  "NinjaScript": "C#-based programming language embedded in NinjaTrader. Used to build custom indicators (like reading the S949 oscillator values) and automated strategies. The Tribune Trader automation will use NinjaScript to interface with Stan's live platform.",
  "Trade Eight": "NinjaTrader's integrated brokerage arm. Stan executes all his futures trades through Trade Eight. Provides the actual order routing to CME exchanges.",
  "TradingView": "Financial charting platform used by millions of traders. Provides embeddable chart widgets for any website. The live NQ chart on this dashboard uses TradingView's free widget with real CME_MINI:NQ1! data.",
  "Rithmic": "A CME-approved futures data provider used by TPT. Handles order routing and execution in simulation (SIM) mode for Test and PRO accounts.",
  "Tradovate": "A CME-approved futures platform and data provider used by TPT. Alternative to Rithmic for order execution. Also integrates with NinjaTrader.",

  // ── TECH TERMS ────────────────────────────────────────────────────────────────
  "OrderFlowCumulativeDelta": "A native NinjaScript method that calculates the difference between aggressive buying volume and aggressive selling volume per bar. Returns a DataSeries that can be used to replicate TickStrike readings inside NinjaTrader. Zero latency. Phase 2 primary signal path.",
  "MCP Server": "Model Context Protocol server. NinjaTrader's AI integration layer, available at docs.ninjatrader.com/_mcp/server. Allows AI agents to query account data, place orders, and monitor positions directly. Tribune Trader Phase 2 will use this for execution.",
  "REST API": "Representational State Transfer Application Programming Interface. NinjaTrader's web API for placing and managing orders programmatically. Authenticated with API tokens. Supports automated order placement (isAutomated=true flag). Combined with the MCP server for full automation.",
  "WebSocket": "A real-time bidirectional communication protocol. NinjaTrader uses a separate WebSocket API for streaming live market data. Lower latency than polling REST endpoints. Required for real-time position monitoring in Phase 2.",
  "iframe": "An HTML element that embeds another webpage within the current page. The FinancialJuice TickStrike widget is embedded as an iframe. Phase 1 plan: embed the free widget. Limitation: no programmatic access to the underlying data values.",
  "screen capture": "The data collection method for Phase 1. Stan's screen is recorded every 2 seconds during live trading sessions. Every oscillator reading, TickStrike level, and decision is captured visually for the AI training dataset.",
  "Ollama": "Local AI model runtime for running open models like Llama and Mistral on your own hardware. Relevant to the Private/Local training route: training data stays on-premises, Stan's methodology never leaves the machine.",
  "CSP": "Content Security Policy. A web security header controlling which external resources a page can load. Required when embedding the FinancialJuice widget: frame-src must include financialjuice.com.",
};

// ── Tooltip injection ──────────────────────────────────────────────────────────

const TOOLTIP_CSS = `
.gl {
  border-bottom: 1px dotted rgba(122,26,92,.5);
  cursor: help;
  position: relative;
  display: inline;
}
.gl-tip {
  position: fixed;
  background: #0A0B12;
  color: #EFEBE2;
  padding: 11px 15px;
  border-radius: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  width: 280px;
  max-width: 90vw;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 9999;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  text-transform: none;
  letter-spacing: 0;
  border: 1px solid rgba(122,26,92,.3);
}
.gl-tip.visible { opacity: 1; }
.gl-tip-term {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  color: #7A1A5C;
  text-transform: uppercase;
  letter-spacing: .1em;
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}
`;

// Inject CSS
(function injectCSS() {
  const style = document.createElement('style');
  style.textContent = TOOLTIP_CSS;
  document.head.appendChild(style);
})();

// Create single floating tooltip element
let tipEl = null;
function getTip() {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'gl-tip';
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

function showTip(term, def, targetEl) {
  const tip = getTip();
  tip.innerHTML = `<span class="gl-tip-term">${term}</span>${def}`;
  tip.classList.add('visible');
  positionTip(targetEl, tip);
}

function positionTip(el, tip) {
  const rect = el.getBoundingClientRect();
  const tw = 280;
  let left = rect.left + rect.width / 2 - tw / 2;
  let top = rect.top - 8;

  // Clamp to viewport
  left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
  // Flip below if not enough space above
  if (top - 120 < 0) { top = rect.bottom + 8; tip.style.transform = 'translateY(0)'; }
  else { top = rect.top - 8; tip.style.transform = 'translateY(-100%)'; }

  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
}

function hideTip() {
  const tip = getTip();
  tip.classList.remove('visible');
}

// ── DOM injection ──────────────────────────────────────────────────────────────

function applyGlossaryTooltips(rootEl) {
  rootEl = rootEl || document.body;
  // Sort terms longest-first to avoid partial matches (e.g. "Type 2 Divergence" before "divergence")
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const seen = new Set();

  const walker = document.createTreeWalker(
    rootEl,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName.toLowerCase();
        if (['script','style','code','pre','noscript','textarea','input','select'].includes(tag))
          return NodeFilter.FILTER_REJECT;
        if (p.classList.contains('gl') || p.closest('.gl'))
          return NodeFilter.FILTER_REJECT;
        if (p.classList.contains('gl-tip'))
          return NodeFilter.FILTER_REJECT;
        if (node.nodeValue.trim().length < 2) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  // Track how many times each term has been annotated (limit to 3 per page for readability)
  const termCount = {};

  nodes.forEach(textNode => {
    const text = textNode.nodeValue;
    for (const term of terms) {
      const lc = term.toLowerCase();
      if ((termCount[lc] || 0) >= 3) continue;

      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<![\\w])(${escaped})(?![\\w])`, 'gi');

      if (!regex.test(text)) continue;
      regex.lastIndex = 0;

      // Replace first match in this text node
      const fragment = document.createDocumentFragment();
      let lastIdx = 0;
      let match;
      let replaced = false;

      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        if (replaced) break; // one match per text node
        fragment.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
        const span = document.createElement('span');
        span.className = 'gl';
        span.textContent = match[0];
        const canonicalTerm = term;
        span.addEventListener('mouseenter', e => showTip(canonicalTerm, GLOSSARY[canonicalTerm], span));
        span.addEventListener('mouseleave', hideTip);
        fragment.appendChild(span);
        lastIdx = match.index + match[0].length;
        replaced = true;
      }
      if (!replaced) continue;

      fragment.appendChild(document.createTextNode(text.slice(lastIdx)));
      textNode.parentNode.replaceChild(fragment, textNode);
      termCount[lc] = (termCount[lc] || 0) + 1;
      break; // one term per text node
    }
  });
}

// Run after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyGlossaryTooltips());
} else {
  applyGlossaryTooltips();
}
