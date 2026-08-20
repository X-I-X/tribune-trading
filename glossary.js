/**
 * Tribune Trader  -  Glossary Tooltip System v2
 * Hover over any dotted-underline term for an instant definition.
 * Covers: trading terms, platform terms, tech terms  -  all sourced from the
 * S949/TickStrike/TPT analysis docs, Senate debate, and master handoff.
 */

const GLOSSARY = {
  // Trading: Oscillator
  "S949":                      "Stan's primary decision instrument. A cyclical momentum oscillator built by Rob Mitchell  -  one of the largest S&P traders of the 1980s. Runs on a ±40 scale inside NinjaTrader. Green line = rising momentum, red = falling. The core signal is divergence: when price and oscillator disagree at swing points. Stan: \"This tells me more than anything.\"",
  "cyclical momentum oscillator":"A technical indicator measuring the rate of change in price momentum across the market's natural cycle. Unlike fixed-period indicators (RSI, MACD), it adapts to the instrument's own rhythm. Peaks and troughs align with price swing highs and lows  -  making divergence visually obvious.",
  "oscillator":                "A bounded technical indicator that fluctuates between a high and low value. Stan's S949 runs on a ±40 scale. Zero is the neutral midpoint. Green = rising, red = falling. Primary use: detecting divergence between oscillator and price.",
  "zero line":                 "The dashed red line at 0 on the S949 oscillator. Separates bullish territory (above) from bearish (below). When the oscillator crosses zero, momentum is shifting direction. Stan watches for divergence relative to both the zero line and prior oscillator peaks/troughs.",
  "Rob Mitchell":              "Creator of the S949 oscillator. One of the largest S&P pit traders of the 1980s. Stan received the indicator personally after meeting him in Oceanside, CA. The indicator is proprietary  -  Stan does not own the source code and has spent 10 years trying to reverse-engineer it without success.",
  "divergence":                "When price and oscillator move in opposite directions at comparable swing points. Price makes a new high but oscillator peaks lower = weakening momentum = potential reversal. This is the core trade signal. Stan uses the rocket analogy: a rocket can still be rising while the fuel (momentum) is already spent.",
  "Type 2 Divergence":         "Stan's preferred setup  -  WITH the trend. In an uptrend: price makes a higher low, oscillator makes a lower low. They disagree = buy signal. Entry at the close of the divergence candle. Target: prior swing high. Trading with the trend dramatically increases probability.",
  "Type 1 Divergence":         "Counter-trend divergence  -  picking tops and bottoms AGAINST the prevailing trend. Riskier than Type 2. Stan: \"You really don't want to do it, but it works pretty effectively with this.\" Requires extra confirmation.",
  "Gann Swing":                "Stan's method for identifying pivot points. A swing high qualifies only when the bar is higher than the bars on both sides; swing low when lower. More structurally precise than the standard zigzag indicator, which can skip or delay pivot recognition. Required for valid divergence comparisons.",
  "swing high":                "A price peak where the bar is higher than both adjacent bars. Oscillator peaks at swing highs are compared across time to detect bearish divergence. Stan's Gann Swing draws the connecting arrows automatically.",
  "swing low":                 "A price trough where the bar is lower than both adjacent bars. Oscillator troughs at swing lows are compared to detect bullish divergence. The core comparison point for Type 2 buy setups.",
  "BUY signal":                "A bullish divergence signal plotted by the S949 indicator at a swing low. Displayed as a green upward arrow + \"BUY\" text label on the NinjaTrader price panel. Entry: close of the signal candle. Target: prior swing high.",
  "SELL signal":               "A bearish divergence signal plotted by the S949 at a swing high. Displayed as a magenta downward arrow + \"SELL\" label. Entry or exit at the close of the signal candle.",
  "momentum":                  "The rate of change of price movement. A market can be rising in price while losing momentum  -  this is the divergence condition Stan trades. The oscillator measures this directly, ahead of price confirmation.",

  // Trading: Order Flow
  "TickStrike":                "Real-time order flow meter by FinancialJuice. Measures buying pressure (green) vs selling pressure (red) on a 0-16+ numeric scale. Stan's sweet spot: 11-14. Two channels: visual (numeric + color) and audio (sparse ticks = buying, machine-gun cadence = selling). Stan: \"Nothing tells you what's going on right this second except order flow.\"",
  "order flow":                "The real-time balance of aggressive buying (hitting the ask) vs aggressive selling (hitting the bid). TickStrike measures this. Reflects what institutional algorithms (BofA, Wells Fargo hedging) are doing at this exact moment  -  before price moves.",
  "FinancialJuice":            "Provider of the TickStrike order flow tool. Their free widget can be embedded on any site. The internal data-sourcing algorithm is proprietary (black box). Website: financialjuice.com. Free trial available. Paid plans: ~$99/mo or $997-1,497 lifetime.",
  "sweet spot":                "TickStrike readings of 11-14. Indicates decisive institutional aggression  -  the algos are pressing hard. Stan's most reliable confirmation zone. Below 11 = active but not peak conviction. Above 14 = extreme, may signal exhaustion.",
  "probing":                   "TickStrike reading of 8. Stan's personal warning level. The market is testing a direction but not yet committed. Neither side is pressing hard. Treat any oscillator signal at this level as conditional, not confirmed.",
  "Cumulative Delta":          "The running difference between aggressive buying and aggressive selling volume. NinjaTrader's native OrderFlowCumulativeDelta method computes this per bar. It is the technical equivalent of what TickStrike displays  -  and Tribune Trader's Phase 2 plan for replacing the widget with a native, zero-latency signal.",

  // Signal States
  "CONFIRMED":                 "Signal state: oscillator BUY or SELL plus TickStrike 10+ in the same direction. Both analytical layers agree. Highest-probability entry point. This is when Stan enters. Green indicator on the dashboard.",
  "CONFLICTED":                "Signal state: oscillator gives a directional signal but TickStrike is pressing the opposite way. Real-time order flow is fighting the structural setup. Wait or reduce position size. Amber indicator on the dashboard.",
  "NEUTRAL":                   "Signal state: TickStrike below 9 or flipping without commitment. Low conviction on both sides. No decisive institutional pressure. Oscillator signals generated here lack real-time confirmation. Gray indicator.",

  // Prop Trading
  "prop firm":                 "Proprietary trading firm. Provides funded accounts to traders who pass an evaluation. Keeps a profit split (typically 10-20%). Traders use the firm's capital, not their own. Examples: Take Profit Trader (TPT), Topstep, Apex Trader Funding.",
  "funded account":            "A trading account backed by a prop firm's capital. Real cash is paid out on withdrawal requests. Stan's $150K TPT account: 80/20 split once PRO status is earned. All orders route through regulated data providers (Tradovate, Rithmic).",
  "Take Profit Trader":        "TPT. The prop firm Stan uses for manual discretionary trading. Florida LLC, founded 2021. Evaluation phases: Test → PRO → PRO+. 80/20 split (PRO), 90/10 (PRO+). Critical: TPT explicitly prohibits automated and bot trading. All trades must be manually executed. The Tribune Trader bot must use a different, automation-permitted firm.",
  "TPT":                       "Take Profit Trader. Stan's current prop firm. Manual trading only. See: Take Profit Trader.",
  "trailing drawdown":         "A dynamic maximum loss limit that follows the trader's peak balance upward. At TPT PRO: tracks unrealized peak equity in real time. If a trade temporarily hits +$3,000 unrealized, the drawdown floor rises by $3,000  -  even if the trade closes at +$1,000. The most challenging mechanic of the PRO structure.",
  "intraday trailing drawdown":"The PRO account drawdown mechanic: floor adjusts in real time, including on unrealized (open) positions. Punishes wide-swinging strategies even when they're ultimately profitable. Requires precise entry timing  -  exactly what the oscillator + TickStrike system provides.",
  "EOD Trailing Drawdown":     "End-of-Day trailing drawdown. Floor adjusts once per day at 5pm ET based on the end-of-day settled balance  -  not intraday swings. Far more forgiving than the intraday version. Used in TPT Test phase and PRO+ accounts.",
  "Profit Target":             "The minimum net profit required to pass the Test phase. Stan's $150K account: $9,000 target. Must be achieved while respecting all risk rules. No time limit  -  subscription runs monthly until you pass.",
  "PRO Account":               "Funded account status at TPT, earned by passing the Test. 80/20 profit split (you keep 80%). Intraday trailing drawdown applies. Day-one withdrawals once the buffer is cleared. Up to 3 resets available at ~$199 each. Manual trading only.",
  "PRO+":                      "Live-exchange upgrade from PRO at TPT. Real orders go to the CME exchange. 90/10 profit split. End-of-day (not intraday) trailing drawdown  -  much more forgiving. No buffer requirement. Auto-promotion implemented March 2026.",
  "buffer zone":               "At TPT PRO: the drawdown amount ($4,500 on $150K) must be earned before the first withdrawal is available. Buffer = starting balance + max drawdown. Once cleared, withdraw with no minimum or maximum restriction.",
  "profit split":              "The % of profits divided between trader and prop firm. TPT PRO: 80/20 (you keep 80%). TPT PRO+: 90/10. Topstep and Apex have competitive splits  -  verify current terms directly.",
  "reset":                     "Restarting a PRO account to its starting balance after hitting the drawdown limit. TPT allows up to 3 resets per PRO account at approximately $199 each.",
  "consistency rule":          "TPT Test-phase rule: no single trading day can represent more than 50% of total net P&L. Prevents passing on one lucky trade. Violating raises the effective profit target but does not fail the account.",
  "drawdown floor":            "The minimum balance a trader's account must stay above. If the balance touches or crosses the floor (including unrealized losses), the account is immediately liquidated. Calculated as: peak balance minus the drawdown limit.",

  // Instruments
  "NQ":                        "E-mini NASDAQ-100 Futures. Stan's primary trading instrument. Tracks the NASDAQ-100 index. 1 point = $20. Traded on CME Globex. Highly liquid, tech-heavy exposure. Stan's 8/17 session example: bought at 29,708, target 29,746 = 38 points = $760 on one contract.",
  "NASDAQ-100":                "An index of the 100 largest non-financial companies listed on NASDAQ. Heavy tech weighting: Apple, Microsoft, NVIDIA, Tesla, Amazon, Meta. The NQ futures contract (and QQQ ETF) track this index. The primary market for Tribune Trader.",
  "ES":                        "E-mini S&P 500 Futures. Most widely traded futures contract globally. 1 point = $50. Tracks the S&P 500 index (500 large-cap US companies). Broader market exposure than NQ, less tech concentration.",
  "MNQ":                       "Micro E-mini NASDAQ-100. One-tenth the size of NQ: 1 point = $2 (vs NQ's $20). Same market dynamics as NQ at dramatically lower capital requirement. Ideal for testing Tribune Trader automation before scaling to full NQ contracts.",
  "MES":                       "Micro E-mini S&P 500. One-tenth of ES: 1 point = $5. Same market exposure as ES at reduced contract size.",
  "QQQ":                       "Invesco QQQ Trust. An ETF (exchange-traded fund) tracking the NASDAQ-100 index. Moves nearly identically to NQ futures during market hours. Used on this dashboard as a free proxy for NQ chart data, since CME futures require a TradingView subscription on free embeds.",
  "CME":                       "Chicago Mercantile Exchange. The regulated exchange where NQ, ES, and most US futures contracts are traded. All TPT accounts route through CME-approved data providers (Tradovate, Rithmic). CME Globex is the electronic trading platform that runs nearly 24 hours.",
  "futures contract":          "An agreement to buy or sell a standardized asset at a set price on a future expiry date. NQ futures (NQ SEP26) expire quarterly and must be rolled to the next contract. Each NQ contract controls the equivalent of ~$20 per index point. NQ SEP26 = the September 2026 expiry.",
  "candlestick":               "A price chart element showing open, high, low, and close for one time period. Stan uses 5-minute candles. The body = open to close. Wicks = the high and low extremes. Stan's NinjaTrader setup uses cyan (up) and yellow (down) candle colors.",
  "Point of Control":          "POC. The price level with the highest trading volume during a session, shown in the volume profile panel. Often acts as support or resistance. Heavy volume at a level means the market has strong interest there.",
  "volume profile":            "A histogram (dProfile in Stan's setup) on the right edge of the chart showing trading activity at each price level. Helps identify where the market has accepted or rejected price. Wide bars = high-activity levels. Narrow bars = thin volume, potential for faster moves.",
  "ATM Strategy":              "Automated Trade Management. NinjaTrader's bracket order system for setting profit targets and stop losses at entry. Stan uses \"NQ - Profit 42 Ticks\"  -  42 ticks = 10.5 points = ~$210 per contract. Executes the bracket automatically once the entry order fills.",

  // Platforms
  "NinjaTrader":               "Professional futures trading platform Stan has used since 2003. Provides advanced charting, order execution via Trade Eight brokerage, NinjaScript automation, REST API, WebSocket market data, and a native MCP server for AI integration. Free for charting and strategy development. Commissions from $0.09/trade live.",
  "NinjaScript":               "C#-based programming language embedded within NinjaTrader. Used to write custom indicators (like reading S949 oscillator values) and automated strategies. Tribune Trader Phase 2 will use NinjaScript to extract oscillator and order flow signals and route them to the TRIBUNE agent.",
  "Trade Eight":               "NinjaTrader's integrated brokerage. Stan executes all NQ trades through Trade Eight. Routes orders to CME exchanges. Supports automated orders (isAutomated=true flag). Compatible with TPT's Tradovate and Rithmic data providers.",
  "TradingView":               "Financial charting platform providing live market data and embeddable chart widgets. The NQ chart on this dashboard uses TradingView's free widget (showing QQQ as a proxy  -  CME futures require TradingView Pro for the free embedded widget).",
  "Rithmic":                   "A CME-approved futures data provider used by TPT and many prop firms. Handles order routing and execution for Test and PRO accounts in SIM mode. High-performance data feed used by institutional traders.",
  "Tradovate":                 "A CME-approved futures trading platform and data provider. Used by TPT as an alternative to Rithmic. Also integrates natively with NinjaTrader.",

  // Tech
  "OrderFlowCumulativeDelta":  "Native NinjaScript API method: computes the difference between aggressive buying and selling volume per bar. Zero latency  -  runs inside NinjaTrader's own process. Tribune Trader Phase 2 plan: use this to generate a TickStrike-equivalent signal natively, eliminating the need for the external FinancialJuice widget.",
  "MCP Server":                "Model Context Protocol server. NinjaTrader has a native MCP server at docs.ninjatrader.com/_mcp/server. Allows AI agents (like TRIBUNE) to query account data, monitor positions, and place orders via structured tool calls. Simplifies Phase 2 integration significantly.",
  "REST API":                  "Representational State Transfer API. NinjaTrader's web API for programmatic order management. Swagger-documented. Authenticated with API tokens. Automated orders use isAutomated=true. Tribune Trader Phase 2 execution path.",
  "WebSocket":                 "Real-time bidirectional communication protocol. NinjaTrader uses a separate WebSocket API for streaming live market data. Lower latency than polling REST. Required for real-time position and equity monitoring in the Phase 2 drawdown circuit breaker.",
  "iframe":                    "HTML element that embeds another webpage inside the current page. The FinancialJuice TickStrike widget is delivered as an iframe. Limitation: no programmatic access to the underlying data values from the parent page.",
  "screen capture":            "Tribune Trader's Phase 1 data collection method. Stan's screen is recorded every 2 seconds during live sessions. Every oscillator reading, TickStrike level, and trade decision is captured for the AI training dataset. The foundation of the learn-from-Stan roadmap.",
  "Ollama":                    "Local AI model runtime for running open-source models (Llama, Mistral, etc.) on your own hardware. Relevant to the Private/Local training route: Stan's proprietary trading methodology stays on-premises and is never sent to external APIs.",
  "TRIBUNE":                   "The AI trading agent being built by Tribune Inc. Will receive oscillator + order flow signals from NinjaScript and execute trades autonomously on an automation-permitted prop platform. Named after Tribune Inc. Currently in Phase 1 (monitoring and data capture).",
  "circuit breaker":           "An automated hard stop that halts trading when a risk threshold is breached. Tribune Trader Phase 2 architecture includes two independent circuit breakers: one inside NinjaScript (within NinjaTrader) and one at the TRIBUNE server level. Either can flatten all positions and halt trading.",
};

// ── Tooltip UI ────────────────────────────────────────────────────────────────

const CSS = `
.gl {
  border-bottom: 1.5px dotted rgba(122,26,92,0.6);
  cursor: help;
  position: relative;
}
.gl-tip {
  position: fixed;
  background: #0A0B12;
  color: #EFEBE2;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Inter', 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  width: 300px;
  max-width: min(300px, 90vw);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 9999;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  border: 1px solid rgba(122,26,92,0.4);
  text-transform: none;
  letter-spacing: 0;
}
.gl-tip.gl-visible { opacity: 1; }
.gl-tip-term {
  font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: #B44BC0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  display: block;
  margin-bottom: 7px;
  font-weight: 600;
}
`;

function injectCSS(css) {
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
}

// Single floating tip element
let tipEl;
function tip() {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'gl-tip';
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

function showTip(term, def, anchor) {
  const t = tip();
  t.innerHTML = `<span class="gl-tip-term">${term}</span>${def}`;
  t.classList.add('gl-visible');
  const r = anchor.getBoundingClientRect();
  const tw = Math.min(300, window.innerWidth * 0.9);
  let left = r.left + r.width / 2 - tw / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
  // Try above first, flip below if not enough room
  if (r.top > 160) {
    t.style.top = '';
    t.style.bottom = (window.innerHeight - r.top + 8) + 'px';
  } else {
    t.style.bottom = '';
    t.style.top = (r.bottom + 8) + 'px';
  }
  t.style.left = left + 'px';
}
function hideTip() { tip().classList.remove('gl-visible'); }

// ── Injection ────────────────────────────────────────────────────────────────

function applyGlossary(root) {
  root = root || document.body;
  // Sort by length descending: match "Type 2 Divergence" before "divergence"
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  // How many times each term may be annotated per page
  const counts = {};

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName.toLowerCase();
      if (['script','style','code','pre','noscript','textarea','input','a','button'].includes(tag))
        return NodeFilter.FILTER_REJECT;
      if (p.closest('.gl') || p.closest('.gl-tip') || p.closest('nav') || p.closest('[class*="tradingview"]'))
        return NodeFilter.FILTER_REJECT;
      if (node.nodeValue.trim().length < 3) return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const text = node.nodeValue;
    for (const term of terms) {
      const key = term.toLowerCase();
      if ((counts[key] || 0) >= 3) continue; // max 3 per page

      // Build regex: word boundary aware but handles multi-word terms
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Use lookahead/lookbehind for non-alphanumeric boundaries
      const rx = new RegExp(`(?<![\\w])(${escaped})(?![\\w])`, 'gi');

      if (!rx.test(text)) continue;
      rx.lastIndex = 0;

      const frag = document.createDocumentFragment();
      let last = 0, replaced = false, m;

      while ((m = rx.exec(text)) !== null && !replaced) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const span = document.createElement('span');
        span.className = 'gl';
        span.textContent = m[0];
        const t2 = term; // closure
        span.addEventListener('mouseenter', () => showTip(t2, GLOSSARY[t2], span));
        span.addEventListener('mouseleave', hideTip);
        frag.appendChild(span);
        last = m.index + m[0].length;
        replaced = true;
      }
      if (!replaced) continue;

      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
      counts[key] = (counts[key] || 0) + 1;
      break; // one term per text node
    }
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
injectCSS(CSS);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyGlossary());
} else {
  // Small delay to let dynamic content (TradingView etc.) settle
  setTimeout(() => applyGlossary(), 300);
}
