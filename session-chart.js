/**
 * Tribune Trader — Interactive Session Chart
 * August 17, 2026 · NQ SEP26 · 5-min · Stan Smidt
 *
 * Reconstructed from:
 *   - stan-image-analysis-source.md (HAL vision analysis of both NinjaTrader screenshots)
 *   - stan-s949-oscillator-analysis.md (Part 2 Image Forensics + Part 3 Stan's Method)
 *   - tickstrike-context.md
 *   - 8/19/2026 meeting transcript with Stan
 *
 * Shows the two-panel layout Stan uses: price (top) + S949 oscillator (bottom).
 * The key insight: when price and oscillator DISAGREE, that is the signal.
 */

(function () {
  const ROOT_ID = 'session-chart-root';

  // ── Session data (verified from image forensics) ──────────────────────────
  //
  // Bars represent 5-min candles from ~09:30 ET (PIT open) onwards.
  // Prices are actual levels observed on 8/17/2026 NQ SEP26.
  // Oscillator readings are from HAL vision analysis of the S949 panel.
  // TickStrike readings are from Stan's transcript context (ranges, not tick-precise).

  const SIGNALS = [
    {
      id: 'sig1',
      bar: 5,        // ~09:40 ET
      type: 'BUY',
      price: 30175,
      time: '09:40 ET',
      oscReading: -28,
      ts: 9,          // TickStrike level (from transcript: "9 can be good")
      tsDir: 'green',
      state: 'NEUTRAL',
      divType: 'Type 1',
      divLabel: 'Counter-Trend',
      title: 'First BUY — Type 1 Counter-Trend',
      note: 'Price makes a low at 30,175. Oscillator trough is relatively shallow. Trend is not yet clearly established. This is a Type 1 signal — Stan trades against the forming downtrend. TickStrike at 9 (probing, not in the sweet spot). State: NEUTRAL.',
      arrows: { price: 'down', osc: 'flat' },
      divergence: false,
    },
    {
      id: 'sig2',
      bar: 12,       // ~09:55 ET
      type: 'SELL',
      price: 30265,
      time: '09:55 ET',
      oscReading: 32,
      ts: 11,
      tsDir: 'green',
      state: 'CONFLICTED',
      divType: 'Type 1',
      divLabel: 'Counter-Trend',
      title: 'First SELL — Oscillator High',
      note: 'Price reaches 30,265 — the first significant peak. Oscillator is at +32 (strong bullish reading). This SELL at a price high is a Type 1 counter-trend. High TickStrike (11) is still bullish — creating a CONFLICTED state. A disciplined trader would reduce size here.',
      arrows: { price: 'up', osc: 'up' },
      divergence: false,
    },
    {
      id: 'sig3',
      bar: 22,       // ~11:10 ET — session HIGH with bearish divergence
      type: 'SELL',
      price: 30300,
      time: '11:10 ET',
      oscReading: 18,
      ts: 13,
      tsDir: 'red',
      state: 'CONFIRMED',
      divType: 'Type 1',
      divLabel: 'Bearish Divergence at High',
      title: 'Session High — Bearish Divergence SELL',
      note: 'Price pushes to 30,300 — a new high (higher than the 30,265 peak). But the S949 oscillator peaks at only +18 — LOWER than the +32 reading on the previous rally. Price went up; momentum went down. The rocket still appears to be climbing, but the fuel is spent. TickStrike flips red at 13 — institutional selling confirming the divergence. Signal state: CONFIRMED.',
      arrows: { price: 'up', osc: 'down' }, // KEY DIVERGENCE
      divergence: true,
      divergenceType: 'bearish',
      quoteKey: 'session_high',
    },
    {
      id: 'sig4',
      bar: 31,       // ~11:35 ET
      type: 'BUY',
      price: 30205,
      time: '11:35 ET',
      oscReading: -14,
      ts: 11,
      tsDir: 'green',
      state: 'CONFIRMED',
      divType: 'Type 2',
      divLabel: 'With-Trend',
      title: 'First Type 2 BUY — Downtrend Pullback',
      note: 'The downtrend is now established (lower highs, lower lows). Price pulls back to 30,205. Oscillator trough at -14 — much shallower than earlier readings. Selling momentum is weakening on this pullback. This is a Type 2 signal: WITH the trend (trending down), at a pullback. TickStrike 11 green confirms buyers stepping in briefly. Stan: "That\'s the place you want to buy right there because you got the divergence."',
      arrows: { price: 'down', osc: 'up' }, // Type 2 bullish divergence in downtrend
      divergence: true,
      divergenceType: 'bullish',
      quoteKey: 'type2',
    },
    {
      id: 'sig5',
      bar: 52,       // ~13:35 ET — THE STRONGEST DIVERGENCE
      type: 'SELL',
      price: 30148,
      time: '13:35 ET',
      oscReading: 40,
      ts: 8,
      tsDir: 'green',
      state: 'NEUTRAL',
      divType: 'Type 2',
      divLabel: 'STRONGEST — Dramatic Divergence',
      title: 'Strongest Divergence of the Session',
      note: 'The most dramatic signal on the chart. Price is at 30,148 — a LOWER high vs the 30,255 bounce before it (lower high in downtrend). But the S949 oscillator SPIKES to +40 — the maximum possible reading, the highest reading all session. Both panels\' arrows point in OPPOSITE directions. Price arrow: down. Oscillator arrow: sharply up. TickStrike is only at 8 (probing), keeping state NEUTRAL — a reminder that even a spectacular oscillator divergence needs confirmation.',
      arrows: { price: 'down', osc: 'up_max' }, // THE STRONGEST — dramatic opposite arrows
      divergence: true,
      divergenceType: 'bearish_dramatic',
      highlight: true,
      quoteKey: 'strongest',
    },
    {
      id: 'sig6',
      bar: 56,       // ~13:45 ET — session LOW
      type: 'BUY',
      price: 30075,
      time: '13:45 ET',
      oscReading: -38,
      ts: 12,
      tsDir: 'green',
      state: 'CONFIRMED',
      divType: 'Type 2',
      divLabel: 'With-Trend BUY',
      title: 'Session Low — Type 2 BUY, CONFIRMED',
      note: 'After the dramatic divergence signal at 13:35, price drops to the session low at 30,075. Oscillator reaches -38 (deep bearish). TickStrike 12 green — buyers hitting the ask. CONFIRMED state: oscillator signal + order flow aligned. This is the ideal Type 2 setup in a downtrend: oscillator at a key low, TickStrike confirming buyers. Stan\'s session P&L of $1,155 came from being on the right side of these precise entries.',
      arrows: { price: 'down', osc: 'up' },
      divergence: true,
      divergenceType: 'bullish',
      quoteKey: 'pnl',
    },
    {
      id: 'sig7',
      bar: 67,       // ~14:30-15:05 ET
      type: 'BUY',
      price: 30085,
      time: '15:05 ET',
      oscReading: -28,
      ts: 12,
      tsDir: 'green',
      state: 'CONFIRMED',
      divType: 'Type 2',
      divLabel: 'Rising Troughs — Momentum Shift',
      title: 'Rising Oscillator Troughs — Diminishing Selling Pressure',
      note: 'Price makes another low at 30,085 — similar to the session low. But the oscillator trough is now at -28, significantly higher (less negative) than the -38 trough at 13:45. Compare lows in a downtrend: price similar, oscillator rising. Selling momentum is running out. TickStrike 12 green confirms. CONFIRMED state. This pattern — price holding a level while oscillator troughs rise — signals the downtrend may be losing force.',
      arrows: { price: 'flat', osc: 'up' },
      divergence: true,
      divergenceType: 'bullish',
    },
  ];

  // ── SVG chart geometry ────────────────────────────────────────────────────
  const W = 760, H_PRICE = 220, GAP = 18, H_OSC = 120, H_TOTAL = H_PRICE + GAP + H_OSC;
  const PAD = { left: 52, right: 20, top: 20, bottom: 12 };
  const PLOT_W = W - PAD.left - PAD.right;
  const MAX_BARS = 75;

  const PRICE_MIN = 29980, PRICE_MAX = 30360;
  const OSC_MIN = -45, OSC_MAX = 45;

  function px(bar) {
    return PAD.left + (bar / MAX_BARS) * PLOT_W;
  }
  function py(price) {
    return PAD.top + H_PRICE - ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * H_PRICE;
  }
  function oy(osc) {
    const base = H_PRICE + GAP + PAD.top;
    return base + H_OSC / 2 - (osc / OSC_MAX) * (H_OSC / 2);
  }

  // ── Price path (simplified 8/17 session skeleton) ─────────────────────────
  // Derived from image forensics: downtrend day, two rally attempts, descending staircase
  const PRICE_CURVE = [
    [0,   30310], [3,   30260], [5,   30175], // pre-open + first low
    [8,   30230], [12,  30265], [16,  30200], // bounce + first SELL
    [19,  30240], [22,  30300], [26,  30210], // rally to session high + pullback
    [31,  30205], [34,  30255], [38,  30190], // SELL at 30300 area, Type 2 buy
    [44,  30215], [48,  30155], [52,  30148], // mid-session descending
    [56,  30075], [60,  30130], [65,  30152], // session low + bounce
    [70,  30085], [73,  30130], [75,  30095], // late session
  ];

  // ── Oscillator path ─────────────────────────────────────────────────────────
  // Peaks at price highs, troughs at price lows, BUT key divergences where they disagree
  const OSC_CURVE = [
    [0,   8],   [3,   -12], [5,   -28],  // early session
    [8,   0],   [12,  32],  [16,  -8],   // strong peak at first SELL (32)
    [19,  5],   [22,  18],  [26,  -4],   // LOWER peak at session high (18 vs 32) = DIVERGENCE
    [31,  -14], [34,  12],  [38,  -20],  // Type 2 shallow trough
    [44,  8],   [48,  -32], [52,  40],   // DRAMATIC: price lower high but osc SPIKES to +40
    [56,  -38], [60,  10],  [65,  15],   // session low trough + bounce
    [70,  -28], [73,  8],   [75,  -18],  // rising troughs (less negative = weakening sellers)
  ];

  // ── Build SVG ──────────────────────────────────────────────────────────────
  function svgPath(pts, yFn) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p[0]).toFixed(1)},${yFn(p[1]).toFixed(1)}`).join(' ');
  }

  function coloredOscPath(pts) {
    const segments = [];
    for (let i = 1; i < pts.length; i++) {
      const x0 = px(pts[i-1][0]), y0 = oy(pts[i-1][1]);
      const x1 = px(pts[i][0]),   y1 = oy(pts[i][1]);
      const rising = pts[i][1] >= pts[i-1][1];
      segments.push(`<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${rising ? '#00c853' : '#ff1744'}" stroke-width="2" stroke-linecap="round"/>`);
    }
    return segments.join('\n');
  }

  function signalArrow(sig, forPanel) {
    const x = px(sig.bar);
    if (forPanel === 'price') {
      const y = py(sig.price);
      if (sig.type === 'BUY') {
        return `<g class="sig-marker" data-sig="${sig.id}" style="cursor:pointer">
          <polygon points="${x},${(y+18).toFixed(1)} ${(x-6).toFixed(1)},${(y+30).toFixed(1)} ${(x+6).toFixed(1)},${(y+30).toFixed(1)}" fill="#00c853" opacity="0.95"/>
          <text x="${x}" y="${(y+44).toFixed(1)}" text-anchor="middle" fill="#00c853" font-size="7" font-family="JetBrains Mono,monospace" font-weight="600">BUY</text>
        </g>`;
      } else {
        return `<g class="sig-marker" data-sig="${sig.id}" style="cursor:pointer">
          <polygon points="${x},${(y-18).toFixed(1)} ${(x-6).toFixed(1)},${(y-30).toFixed(1)} ${(x+6).toFixed(1)},${(y-30).toFixed(1)}" fill="${sig.highlight ? '#ff1744' : '#e040fb'}" opacity="0.95"/>
          <text x="${x}" y="${(y-32).toFixed(1)}" text-anchor="middle" fill="${sig.highlight ? '#ff1744' : '#e040fb'}" font-size="7" font-family="JetBrains Mono,monospace" font-weight="600">SELL</text>
        </g>`;
      }
    } else {
      const yo = oy(sig.oscReading);
      const col = sig.highlight ? '#ff6b00' : (sig.type === 'BUY' ? '#00c853' : '#e040fb');
      if (sig.oscReading >= 0) {
        return `<g class="sig-marker" data-sig="${sig.id}" style="cursor:pointer">
          <circle cx="${x}" cy="${yo.toFixed(1)}" r="5" fill="${col}" opacity="0.9"/>
          <text x="${x}" y="${(yo-8).toFixed(1)}" text-anchor="middle" fill="${col}" font-size="7" font-family="JetBrains Mono,monospace">${sig.oscReading > 0 ? '+' : ''}${sig.oscReading}</text>
        </g>`;
      } else {
        return `<g class="sig-marker" data-sig="${sig.id}" style="cursor:pointer">
          <circle cx="${x}" cy="${yo.toFixed(1)}" r="5" fill="${col}" opacity="0.9"/>
          <text x="${x}" y="${(yo+14).toFixed(1)}" text-anchor="middle" fill="${col}" font-size="7" font-family="JetBrains Mono,monospace">${sig.oscReading}</text>
        </g>`;
      }
    }
  }

  function divergenceArrow(sig) {
    if (!sig.divergence) return '';
    const x = px(sig.bar);
    const yP = sig.type === 'BUY' ? py(sig.price) + 34 : py(sig.price) - 34;
    const yO = sig.oscReading >= 0 ? oy(sig.oscReading) - 8 : oy(sig.oscReading) + 8;
    // Connecting dashed line between panels
    return `<line x1="${x}" y1="${yP.toFixed(1)}" x2="${x}" y2="${yO.toFixed(1)}"
      stroke="${sig.highlight ? '#ff6b00' : 'rgba(122,26,92,0.5)'}"
      stroke-width="${sig.highlight ? 2 : 1}"
      stroke-dasharray="4,3" opacity="0.7"/>`;
  }

  function buildSVG() {
    const viewW = W + PAD.left;
    const viewH = H_TOTAL + PAD.top + PAD.bottom;

    // Price gridlines
    const priceGridLines = [30100, 30150, 30200, 30250, 30300].map(p => {
      const y = py(p).toFixed(1);
      return `<line x1="${PAD.left}" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
              <text x="${(PAD.left-4).toFixed(0)}" y="${y}" text-anchor="end" fill="#8C8896" font-size="8" font-family="JetBrains Mono,monospace" dominant-baseline="middle">${p.toLocaleString()}</text>`;
    }).join('\n');

    // Oscillator gridlines
    const oscGridLines = [-40, -20, 0, 20, 40].map(v => {
      const y = oy(v).toFixed(1);
      const isZero = v === 0;
      return `<line x1="${PAD.left}" y1="${y}" x2="${W}" y2="${y}"
        stroke="${isZero ? '#c41e3a' : 'rgba(0,0,0,0.08)'}"
        stroke-width="${isZero ? 0.8 : 0.5}"
        stroke-dasharray="${isZero ? '4,3' : 'none'}"/>
        <text x="${(PAD.left-4).toFixed(0)}" y="${y}" text-anchor="end" fill="${isZero ? '#c41e3a' : '#8C8896'}" font-size="7" font-family="JetBrains Mono,monospace" dominant-baseline="middle">${v > 0 ? '+' : ''}${v}</text>`;
    }).join('\n');

    // PIT Open vertical line
    const pitX = px(10).toFixed(1);
    const pitOpen = `<line x1="${pitX}" y1="${PAD.top}" x2="${pitX}" y2="${(H_TOTAL + PAD.top).toFixed(1)}" stroke="#3b82f6" stroke-width="0.8" stroke-dasharray="6,3" opacity="0.6"/>
      <text x="${pitX}" y="${(PAD.top + 8).toFixed(1)}" fill="#3b82f6" font-size="7" font-family="JetBrains Mono,monospace" text-anchor="middle">PIT OPEN</text>`;

    // Panel labels
    const panelLabels = `
      <text x="${PAD.left + 4}" y="${(PAD.top + 12).toFixed(1)}" fill="#16141F" font-size="8" font-family="JetBrains Mono,monospace" font-weight="600" opacity="0.5">PRICE PANEL — NQ SEP26 · 5-MIN · 2026-08-17</text>
      <text x="${PAD.left + 4}" y="${(H_PRICE + GAP + PAD.top + 12).toFixed(1)}" fill="#16141F" font-size="8" font-family="JetBrains Mono,monospace" font-weight="600" opacity="0.5">S949 OSCILLATOR — ±40 SCALE · ZERO LINE (DASHED RED)</text>
    `;

    // Highlight bar for strongest divergence (sig5)
    const sig5x = px(SIGNALS.find(s => s.id === 'sig5').bar);
    const highlightBar = `<rect x="${(sig5x - 12).toFixed(1)}" y="${PAD.top}" width="24" height="${(H_TOTAL).toFixed(1)}" fill="rgba(255,107,0,0.06)" rx="3"/>`;

    // Divergence arrows (connecting panels)
    const divArrows = SIGNALS.map(divergenceArrow).join('\n');

    // Signal markers — price panel
    const priceMarkers = SIGNALS.map(s => signalArrow(s, 'price')).join('\n');

    // Signal markers — oscillator panel
    const oscMarkers = SIGNALS.map(s => signalArrow(s, 'osc')).join('\n');

    // Oscillator colored segments
    const oscLines = coloredOscPath(OSC_CURVE);

    // Price path (simplified candles as smooth line)
    const pricePath = svgPath(PRICE_CURVE, py);

    // Session label
    const sessionLabel = `<text x="${(W/2 + PAD.left).toFixed(0)}" y="${(viewH - 2).toFixed(0)}" text-anchor="middle" fill="#8C8896" font-size="8" font-family="JetBrains Mono,monospace">NQ SEP26 · Aug 17, 2026 · Stan Smidt · Session P&L: +$1,155</text>`;

    return `<svg viewBox="0 0 ${viewW} ${viewH}" xmlns="http://www.w3.org/2000/svg" id="session-svg" style="width:100%;height:auto;display:block;">
  <!-- Background -->
  <rect width="${viewW}" height="${viewH}" fill="#FAFAF8" rx="2"/>
  <rect x="${PAD.left}" y="${PAD.top}" width="${PLOT_W}" height="${H_PRICE}" fill="#ffffff"/>
  <rect x="${PAD.left}" y="${H_PRICE + GAP + PAD.top}" width="${PLOT_W}" height="${H_OSC}" fill="#fef9ff"/>

  <!-- Divider -->
  <line x1="${PAD.left}" y1="${(H_PRICE + PAD.top + GAP/2).toFixed(1)}" x2="${W}" y2="${(H_PRICE + PAD.top + GAP/2).toFixed(1)}" stroke="#e5e7eb" stroke-width="1"/>

  ${highlightBar}
  ${priceGridLines}
  ${oscGridLines}
  ${pitOpen}
  ${panelLabels}

  <!-- Price line -->
  <path d="${pricePath}" fill="none" stroke="#0A0B12" stroke-width="1.5" stroke-linejoin="round"/>

  <!-- Divergence connectors -->
  ${divArrows}

  <!-- Price markers -->
  ${priceMarkers}

  <!-- Oscillator colored lines -->
  ${oscLines}

  <!-- Oscillator markers -->
  ${oscMarkers}

  ${sessionLabel}
</svg>`;
  }

  // ── Signal detail cards ────────────────────────────────────────────────────
  const STATE_COLORS = {
    'CONFIRMED':  { bg: '#EAF5EE', border: 'rgba(26,122,60,.25)', text: '#1A7A3C' },
    'CONFLICTED': { bg: '#FFF5E6', border: 'rgba(160,88,0,.2)',   text: '#A05800' },
    'NEUTRAL':    { bg: '#EFEBE2', border: 'rgba(10,11,18,.12)',  text: '#8C8896' },
  };

  function signalCard(sig) {
    const sc = STATE_COLORS[sig.state];
    const typeColor = sig.divType === 'Type 2' ? '#4E0E3C' : '#6b7280';
    const isHighlight = sig.highlight ? 'border:2px solid #ff6b00 !important;' : '';
    const tsColor = sig.tsDir === 'green' ? '#1A7A3C' : '#E24B4A';

    // Divergence arrow visualization
    const arrowViz = (dir, label) => {
      const arrows = {
        'up':      { sym: '↑', col: '#1A7A3C' },
        'down':    { sym: '↓', col: '#E24B4A' },
        'up_max':  { sym: '↑↑', col: '#ff6b00' },
        'flat':    { sym: '→', col: '#8C8896' },
      };
      const a = arrows[dir] || arrows.flat;
      return `<span style="font-weight:700;color:${a.col};font-size:16px;">${a.sym}</span> <span style="font-size:11px;color:#8C8896;">${label}</span>`;
    };

    const divergenceViz = sig.divergence ? `
      <div style="display:flex;gap:20px;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin:12px 0 0;">
        <div style="text-align:center;flex:1;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8C8896;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">Price Panel</div>
          ${arrowViz(sig.arrows.price, sig.type === 'BUY' ? 'lower low' : 'higher/lower high')}
        </div>
        <div style="width:1px;background:#e5e7eb;"></div>
        <div style="text-align:center;flex:1;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8C8896;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">Oscillator Panel</div>
          ${arrowViz(sig.arrows.osc, sig.oscReading > 0 ? `+${sig.oscReading}` : `${sig.oscReading}`)}
        </div>
        <div style="width:1px;background:#e5e7eb;"></div>
        <div style="text-align:center;flex:1;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8C8896;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">TickStrike</div>
          <span style="font-weight:700;color:${tsColor};font-size:16px;">${sig.ts}</span>
          <span style="font-size:11px;color:${tsColor};"> ${sig.tsDir.toUpperCase()}</span>
        </div>
      </div>` : '';

    return `<div class="sig-card" id="card-${sig.id}" data-sig="${sig.id}"
      style="background:${sc.bg};border:1px solid ${sc.border};border-radius:12px;padding:18px 20px;cursor:pointer;transition:box-shadow .15s,transform .15s;${isHighlight}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8C8896;text-transform:uppercase;letter-spacing:.14em;margin-bottom:4px;">${sig.time} · NQ ${sig.price.toLocaleString()}</div>
          <div style="font-family:'Archivo',sans-serif;font-size:15px;font-weight:700;color:#0A0B12;">${sig.title}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;align-items:center;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.1em;background:${sig.type === 'BUY' ? 'rgba(26,122,60,.1)' : 'rgba(224,64,251,.1)'};color:${sig.type === 'BUY' ? '#1A7A3C' : '#9C27B0'};border:1px solid ${sig.type === 'BUY' ? 'rgba(26,122,60,.2)' : 'rgba(156,39,176,.2)'};">${sig.type}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.1em;color:${typeColor};border:1px solid currentColor;opacity:.8;">${sig.divType}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.1em;background:${sc.bg};color:${sc.text};border:1px solid ${sc.border};">${sig.state}</span>
        </div>
      </div>
      <p style="font-family:'Inter',sans-serif;font-size:13.5px;color:#16141F;line-height:1.65;margin:0;">${sig.note}</p>
      ${divergenceViz}
    </div>`;
  }

  // ── Full section HTML ──────────────────────────────────────────────────────
  function buildSection() {
    const cards = SIGNALS.filter(s => s.divergence).map(signalCard).join('\n');

    return `
<div style="margin-top:56px;">
  <div class="eyebrow" style="margin-bottom:16px;">The Session in Action</div>
  <h3 style="font-family:'Archivo',sans-serif;font-size:26px;font-weight:700;color:#0A0B12;line-height:1.15;margin-bottom:10px;">August 17, 2026 · NQ SEP26 · 5-min · Stan Smidt</h3>
  <p style="font-size:15px;color:#8C8896;max-width:64ch;margin-bottom:24px;">
    Both panels are required. The price chart alone does not reveal the signal. The oscillator alone does not show price context.
    The divergence — when both panels <em>disagree</em> — is where Stan acts.
    Below: the actual session reconstructed from image forensics and Stan's verbal explanation.
    Hover or tap any signal to see the full read.
  </p>

  <!-- Chart container -->
  <div style="background:#FAFAF8;border:1px solid #dde1e8;border-radius:12px;padding:16px;overflow:hidden;margin-bottom:28px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:#0A0B12;letter-spacing:.12em;text-transform:uppercase;">NQ SEP26 · 5-min · 2026-08-17 · NinjaTrader · Stan Smidt</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-left:auto;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#1A7A3C;"><span style="display:inline-block;width:12px;height:2px;background:#00c853;margin-right:4px;vertical-align:middle;"></span>Oscillator Rising</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#E24B4A;"><span style="display:inline-block;width:12px;height:2px;background:#ff1744;margin-right:4px;vertical-align:middle;"></span>Oscillator Falling</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#1A7A3C;">▲ BUY</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#9C27B0;">▼ SELL</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#ff6b00;">| STRONGEST DIVERGENCE</span>
      </div>
    </div>
    ${buildSVG()}
    <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8C8896;margin-top:10px;text-align:center;letter-spacing:.06em;">
      Reconstructed from HAL vision analysis of Stan's NinjaTrader screenshots. Not a live data feed. Educational illustration only.
      Cyan/yellow NinjaTrader candle colors normalized to price line for clarity.
    </p>
  </div>

  <!-- Signal explanation cards -->
  <div style="margin-bottom:16px;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:#8C8896;text-transform:uppercase;letter-spacing:.16em;margin-bottom:16px;">Key Divergence Signals — Click for detail</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;" id="sig-cards">
      ${cards}
    </div>
  </div>

  <!-- The core insight -->
  <div style="background:#0A0B12;border-radius:12px;padding:28px 32px;margin-top:8px;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.18em;margin-bottom:14px;">Stan's Rule</div>
    <p style="font-family:'Archivo',sans-serif;font-size:18px;font-weight:600;color:#EFEBE2;line-height:1.5;margin:0 0 16px;">
      "That's the place you want to buy right there because you got the divergence.
      Type two is always with the trend."
    </p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px;" class="responsive-3col">
      <div style="border-left:3px solid #7A1A5C;padding-left:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">Compare Lows (uptrend)</div>
        <div style="font-family:'Inter',sans-serif;font-size:13px;color:#EFEBE2;line-height:1.6;">In an uptrend, look at the pullback lows. Price makes a higher low while oscillator makes a lower low: weakening selling pressure. Type 2 BUY.</div>
      </div>
      <div style="border-left:3px solid #7A1A5C;padding-left:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">Compare Highs (downtrend)</div>
        <div style="font-family:'Inter',sans-serif;font-size:13px;color:#EFEBE2;line-height:1.6;">In a downtrend, look at the bounce highs. Price makes a lower high while oscillator peaks higher: weakening buying pressure. Type 2 SELL.</div>
      </div>
      <div style="border-left:3px solid #C6A35A;padding-left:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">TickStrike confirms</div>
        <div style="font-family:'Inter',sans-serif;font-size:13px;color:#EFEBE2;line-height:1.6;">Even with a perfect oscillator signal, wait for TickStrike 10+ in the same direction. Oscillator is the setup. Order flow is the trigger. Both agree: CONFIRMED.</div>
      </div>
    </div>
  </div>

  <style>
    @media(max-width:600px) {
      #sig-cards { grid-template-columns:1fr !important; }
      .responsive-3col { grid-template-columns:1fr !important; }
    }
    .sig-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.1); transform:translateY(-2px); }
    .sig-card.active { box-shadow:0 0 0 2px #7A1A5C; }
  </style>
</div>`;
  }

  // ── Inject ─────────────────────────────────────────────────────────────────
  function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.innerHTML = buildSection();

    // Card highlight interaction
    document.querySelectorAll('.sig-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.sig-card').forEach(c => c.classList.remove('active'));
        card.classList.toggle('active');
        // Highlight corresponding SVG marker
        const sigId = card.dataset.sig;
        document.querySelectorAll(`[data-sig]`).forEach(el => {
          el.style.opacity = el.dataset.sig === sigId ? '1' : '0.4';
        });
        if (!card.classList.contains('active')) {
          document.querySelectorAll(`[data-sig]`).forEach(el => el.style.opacity = '1');
        }
      });
    });

    // SVG marker click -> highlight card
    document.querySelectorAll('.sig-marker').forEach(marker => {
      marker.addEventListener('click', () => {
        const sigId = marker.dataset.sig;
        const card = document.getElementById(`card-${sigId}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          card.click();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
