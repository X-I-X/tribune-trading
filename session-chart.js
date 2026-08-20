/**
 * Tribune Trader  -  Interactive Session Chart v2
 * August 17, 2026 · NQ SEP26 · 5-min · Stan Smidt
 *
 * Data sources (verified, multi-pass):
 *   - Direct HAL vision analysis of BOTH NinjaTrader screenshots
 *   - stan-image-analysis-source.md (prior forensic analysis)
 *   - stan-s949-oscillator-analysis.md Part 2 + Part 3
 *   - tickstrike-context.md
 *   - 8/19/2026 transcript with Stan
 *
 * v2 corrections from image re-analysis:
 *   - Session high ~30,295 at ~10:00 (not 11:10)
 *   - Oscillator peak +42 at ~13:50 (the dramatic divergence moment)
 *   - Deepest oscillator trough -42 at ~11:15
 *   - Volume Profile POC confirmed at 30,100-30,130
 *   - Pink zones = pre/post PIT; Cyan = active RTH session windows
 */

(function () {
  const ROOT_ID = 'session-chart-root';

  // ── Verified signal data (from direct image analysis) ─────────────────────
  const SIGNALS = [
    {
      id: 'sig_sell1',
      bar: 17,
      type: 'SELL',
      price: 30265,
      time: '09:50 ET',
      oscReading: 38,
      ts: 10,
      tsDir: 'green',
      state: 'CONFLICTED',
      divType: 'Type 1',
      title: 'Early SELL  -  Oscillator High',
      note: 'Price reaches ~30,265 in the early session. Oscillator at +38  -  a strong reading. Both are near highs simultaneously: no divergence yet (they\'re in sync). TickStrike 10 green but dropping. CONFLICTED because the oscillator is bullish while the intraday trend is beginning to roll over. A Type 1 counter-trend signal.',
      arrows: { price: 'up', osc: 'up' },
      divergence: false,
    },
    {
      id: 'sig_sell2',
      bar: 25,
      type: 'SELL',
      price: 30295,
      time: '10:00 ET',
      oscReading: 40,
      ts: 12,
      tsDir: 'red',
      state: 'CONFIRMED',
      divType: 'Type 1',
      title: 'Session High SELL  -  In Sync (No Divergence)',
      note: 'Price pushes to the session high at ~30,295. Oscillator also at its peak (+40). Both panels agree: this is a strong peak. When they are IN SYNC like this, there is no divergence  -  just a simultaneous extreme. The signal here comes from the price behavior (resistance at 30,314 red line), not from oscillator disagreement. TickStrike flips red at 12. CONFIRMED SELL.',
      arrows: { price: 'up', osc: 'up' },
      divergence: false,
    },
    {
      id: 'sig_buy1',
      bar: 40,
      type: 'BUY',
      price: 30165,
      time: '11:00 ET',
      oscReading: -42,
      ts: 11,
      tsDir: 'green',
      state: 'CONFIRMED',
      divType: 'Type 1',
      title: 'Deep Trough BUY  -  Oscillator at -42',
      note: 'The deepest oscillator reading of the session: -42. Price at ~30,165. This is the maximum bearish reading  -  momentum is at maximum exhaustion to the downside. TickStrike flips green at 11 as buyers step in. CONFIRMED. A counter-trend Type 1 setup: the downtrend is dominant but the oscillator is screaming oversold. Stan would trade this carefully given the trend direction.',
      arrows: { price: 'down', osc: 'down' },
      divergence: false,
    },
    {
      id: 'sig_sell3',
      bar: 50,
      type: 'SELL',
      price: 30250,
      time: '12:00 ET',
      oscReading: 25,
      ts: 9,
      tsDir: 'red',
      state: 'NEUTRAL',
      divType: 'Type 2',
      title: 'Lower High SELL  -  First Clear Bearish Divergence',
      note: 'Price bounces to ~30,250  -  a LOWER HIGH vs the 30,295 session peak. The S949 oscillator peaks at only +25  -  also LOWER than the +40 at the 10:00 peak. Both are declining together (both arrows point down). This is bearish divergence confirmation: the trend is definitively established. TickStrike at 9  -  NEUTRAL, not confirming sellers aggressively. Stan would note the divergence structure but wait for TickStrike to confirm.',
      arrows: { price: 'down', osc: 'down' },
      divergence: true,
      divergenceType: 'bearish',
    },
    {
      id: 'sig_sell4',
      bar: 68,
      type: 'SELL',
      price: 30140,
      time: '13:50 ET',
      oscReading: 42,
      ts: 8,
      tsDir: 'green',
      state: 'NEUTRAL',
      divType: 'Type 2',
      title: 'THE STRONGEST DIVERGENCE  -  Price Down, Oscillator +42',
      note: 'The most dramatic signal on the full day\'s chart. Price is at 30,140  -  a LOWER HIGH vs 30,250 (12:00) and 30,295 (10:00). The downtrend is clear. But the S949 oscillator SPIKES to +42  -  the HIGHEST reading of the entire session. The arrows in both panels point in COMPLETELY OPPOSITE DIRECTIONS. Price arrow: down. Oscillator arrow: sharply up. This is what Stan calls the "rocket out of fuel" analogy in reverse: price is falling, but momentum (measured by the oscillator) is building dramatically upward. Stan\'s words: "That\'s actually a gann swing... the oscillator tells me more than anything." TickStrike at 8 (probing only)  -  NEUTRAL state prevents a full CONFIRMED signal here.',
      arrows: { price: 'down', osc: 'up_max' },
      divergence: true,
      divergenceType: 'bearish_dramatic',
      highlight: true,
    },
    {
      id: 'sig_buy2',
      bar: 73,
      type: 'BUY',
      price: 30075,
      time: '14:10 ET',
      oscReading: -25,
      ts: 12,
      tsDir: 'green',
      state: 'CONFIRMED',
      divType: 'Type 2',
      title: 'Rising Trough BUY  -  Bullish Divergence in Downtrend',
      note: 'Price drops to the session low at ~30,075. The oscillator trough is at -25  -  significantly HIGHER (less negative) than the -42 reading at 11:15. Price making a lower low while oscillator makes a HIGHER trough: classic bullish divergence. "Compare lows in a downtrend." The downward momentum is weakening. TickStrike confirms at 12 green (buyers active). CONFIRMED. Session P&L: $1,155 (+42 ticks on 1 NQ contract from these precise entries).',
      arrows: { price: 'down', osc: 'up' },
      divergence: true,
      divergenceType: 'bullish',
    },
  ];

  // ── Chart geometry ─────────────────────────────────────────────────────────
  const W = 780, H_PRICE = 220, GAP = 20, H_OSC = 120;
  const PAD = { left: 56, right: 24, top: 24, bottom: 16 };
  const PLOT_W = W - PAD.left - PAD.right;
  const H_TOTAL = H_PRICE + GAP + H_OSC;
  const MAX_BARS = 90;

  const PRICE_MIN = 29970, PRICE_MAX = 30380;
  const OSC_MIN = -46, OSC_MAX = 46;

  const px = b => PAD.left + (b / MAX_BARS) * PLOT_W;
  const py = p => PAD.top + H_PRICE - ((p - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * H_PRICE;
  const oy = o => H_PRICE + GAP + PAD.top + H_OSC / 2 - (o / OSC_MAX) * (H_OSC / 2);

  // ── Session data (verified against image analysis) ─────────────────────────
  // Downtrend day: high ~30,295 at 10:00, close ~30,066
  // Pre-market visible from ~06:00; PIT Open ~09:30; PIT Close ~16:15
  const PRICE_CURVE = [
    [0,   30310], [3,   30285], [6,   30240], // early pre-market
    [9,   30268], [12,  30290], [16,  30250], // pre-market rally
    [20,  30280], [25,  30295], [29,  30240], // session high area (~10:00)
    [33,  30220], [37,  30195], [40,  30165], // descent to first BUY
    [44,  30195], [47,  30215], [50,  30250], // bounce to lower high (~12:00)
    [54,  30220], [58,  30190], [62,  30155], // descending
    [65,  30140], [68,  30140], [72,  30110], // SELL at 30140 (dramatic div)
    [73,  30075], [77,  30095], [80,  30130], // session low + small bounce
    [83,  30115], [86,  30080], [90,  30066], // close near lows
  ];

  // Oscillator path  -  verified peaks/troughs from image analysis
  // Peak +42 at ~13:50 (bar 68) is the dramatic moment
  // Trough -42 at ~11:15 (bar 40) is the deepest
  const OSC_CURVE = [
    [0,   5],   [3,   15],  [6,   -8],   // early oscillation
    [9,   -18], [12,  20],  [16,  35],   // pre-market peak ~+35
    [20,  18],  [25,  40],  [29,  12],   // session high peak +40 (in sync with price)
    [33,  -10], [37,  -28], [40,  -42],  // deepest trough -42 at 11:15
    [44,  -10], [47,  10],  [50,  25],   // bounce peak +25 (LOWER than 40 = divergence #1)
    [54,  5],   [58,  -22], [62,  10],   // oscillating
    [65,  30],  [68,  42],  [72,  18],   // DRAMATIC SPIKE +42 while price makes lower high!
    [73,  -25], [77,  -8],  [80,  15],   // trough -25 (HIGHER than -42 = bullish div)
    [83,  5],   [86,  -12], [90,  10],   // late session recovery
  ];

  // ── Helpers ────────────────────────────────────────────────────────────────
  function coloredOscPath(pts) {
    return pts.slice(1).map((p, i) => {
      const x0 = px(pts[i][0]), y0 = oy(pts[i][1]);
      const x1 = px(p[0]),      y1 = oy(p[1]);
      const rising = p[1] >= pts[i][1];
      return `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${rising ? '#00c853' : '#ff1744'}" stroke-width="2.2" stroke-linecap="round"/>`;
    }).join('\n');
  }

  function pricePolyline(pts) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(' ');
  }

  function signalMark(sig, panel) {
    const x = px(sig.bar);
    if (panel === 'price') {
      const y = py(sig.price);
      const isBuy = sig.type === 'BUY';
      const col = sig.highlight ? '#ff6b00' : (isBuy ? '#00c853' : '#e040fb');
      if (isBuy) {
        return `<g class="sig-marker" data-sig="${sig.id}" style="cursor:pointer">
          <polygon points="${x},${(y+16).toFixed(1)} ${(x-5).toFixed(1)},${(y+26).toFixed(1)} ${(x+5).toFixed(1)},${(y+26).toFixed(1)}" fill="${col}"/>
          <text x="${x}" y="${(y+38).toFixed(1)}" text-anchor="middle" fill="${col}" font-size="7.5" font-family="JetBrains Mono,monospace" font-weight="700">BUY</text>
          <text x="${x}" y="${(y+48).toFixed(1)}" text-anchor="middle" fill="${col}" font-size="6.5" font-family="JetBrains Mono,monospace" opacity=".8">${sig.price.toLocaleString()}</text>
        </g>`;
      } else {
        return `<g class="sig-marker" data-sig="${sig.id}" style="cursor:pointer">
          <polygon points="${x},${(y-16).toFixed(1)} ${(x-5).toFixed(1)},${(y-26).toFixed(1)} ${(x+5).toFixed(1)},${(y-26).toFixed(1)}" fill="${col}"/>
          <text x="${x}" y="${(y-28).toFixed(1)}" text-anchor="middle" fill="${col}" font-size="7.5" font-family="JetBrains Mono,monospace" font-weight="700">SELL</text>
          <text x="${x}" y="${(y-38).toFixed(1)}" text-anchor="middle" fill="${col}" font-size="6.5" font-family="JetBrains Mono,monospace" opacity=".8">${sig.price.toLocaleString()}</text>
        </g>`;
      }
    } else {
      const yo = oy(sig.oscReading);
      const col = sig.highlight ? '#ff6b00' : (sig.type === 'BUY' ? '#00c853' : '#e040fb');
      const label = sig.oscReading > 0 ? `+${sig.oscReading}` : `${sig.oscReading}`;
      const yTxt = sig.oscReading >= 0 ? yo - 9 : yo + 15;
      return `<g class="sig-marker" data-sig="${sig.id}" style="cursor:pointer">
        <circle cx="${x}" cy="${yo.toFixed(1)}" r="${sig.highlight ? 6 : 4.5}" fill="${col}" opacity=".9"/>
        <text x="${x}" y="${yTxt.toFixed(1)}" text-anchor="middle" fill="${col}" font-size="7" font-family="JetBrains Mono,monospace" font-weight="700">${label}</text>
      </g>`;
    }
  }

  function divConnector(sig) {
    if (!sig.divergence) return '';
    const x = px(sig.bar);
    const yP = sig.type === 'BUY' ? py(sig.price) + 30 : py(sig.price) - 30;
    const yO = sig.oscReading >= 0 ? oy(sig.oscReading) - 9 : oy(sig.oscReading) + 9;
    const col = sig.highlight ? 'rgba(255,107,0,.8)' : 'rgba(122,26,92,.55)';
    const w = sig.highlight ? 2 : 1.2;
    return `<line x1="${x}" y1="${yP.toFixed(1)}" x2="${x}" y2="${yO.toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-dasharray="5,3"/>`;
  }

  // Gann swing connector arrows between peaks and between troughs in oscillator
  function gannArrows() {
    const peakBars = [[25, 40], [50, 25], [68, 42]]; // [bar, oscVal]
    const troughBars = [[40, -42], [73, -25]];
    let out = '';
    // Connect oscillator peaks with arrows
    for (let i = 1; i < peakBars.length; i++) {
      const [b0, v0] = peakBars[i - 1], [b1, v1] = peakBars[i];
      const x0 = px(b0), y0 = oy(v0), x1 = px(b1), y1 = oy(v1);
      out += `<line x1="${x0.toFixed(1)}" y1="${(y0-4).toFixed(1)}" x2="${x1.toFixed(1)}" y2="${(y1-4).toFixed(1)}" stroke="#1a1a2a" stroke-width="1.5" marker-end="url(#arrowDark)" opacity=".75"/>`;
    }
    // Connect oscillator troughs
    for (let i = 1; i < troughBars.length; i++) {
      const [b0, v0] = troughBars[i - 1], [b1, v1] = troughBars[i];
      const x0 = px(b0), y0 = oy(v0), x1 = px(b1), y1 = oy(v1);
      out += `<line x1="${x0.toFixed(1)}" y1="${(y0+4).toFixed(1)}" x2="${x1.toFixed(1)}" y2="${(y1+4).toFixed(1)}" stroke="#1a1a2a" stroke-width="1.5" marker-end="url(#arrowDark)" opacity=".75"/>`;
    }
    // Price panel: connect price highs
    const priceHighBars = [[25, 30295], [50, 30250], [68, 30140]];
    const priceLowBars = [[40, 30165], [73, 30075]];
    for (let i = 1; i < priceHighBars.length; i++) {
      const [b0, p0] = priceHighBars[i - 1], [b1, p1] = priceHighBars[i];
      const x0 = px(b0), y0 = py(p0), x1 = px(b1), y1 = py(p1);
      out += `<line x1="${x0.toFixed(1)}" y1="${(y0-4).toFixed(1)}" x2="${x1.toFixed(1)}" y2="${(y1-4).toFixed(1)}" stroke="#1a1a2a" stroke-width="1.5" marker-end="url(#arrowDark)" opacity=".7"/>`;
    }
    for (let i = 1; i < priceLowBars.length; i++) {
      const [b0, p0] = priceLowBars[i - 1], [b1, p1] = priceLowBars[i];
      const x0 = px(b0), y0 = py(p0), x1 = px(b1), y1 = py(p1);
      out += `<line x1="${x0.toFixed(1)}" y1="${(y0+4).toFixed(1)}" x2="${x1.toFixed(1)}" y2="${(y1+4).toFixed(1)}" stroke="#1a1a2a" stroke-width="1.5" marker-end="url(#arrowDark)" opacity=".7"/>`;
    }
    return out;
  }

  // ── Build full SVG ──────────────────────────────────────────────────────────
  function buildSVG() {
    const viewW = W + PAD.left;
    const viewH = H_TOTAL + PAD.top + PAD.bottom;

    // RTH session background (cyan equivalent  -  light teal tint)
    const pitOpenX = px(27).toFixed(1);
    const pitCloseX = px(83).toFixed(1);
    const rthBg = `<rect x="${pitOpenX}" y="${PAD.top}" width="${(parseFloat(pitCloseX) - parseFloat(pitOpenX)).toFixed(1)}" height="${H_TOTAL}" fill="rgba(0,180,200,0.04)" rx="0"/>`;

    // Volume profile (simplified dProfile) - POC at 30100-30130
    const pocY1 = py(30130), pocY2 = py(30100);
    const volProfile = `
      <rect x="${(W+2).toFixed(1)}" y="${pocY1.toFixed(1)}" width="18" height="${(pocY2-pocY1).toFixed(1)}" fill="rgba(122,26,92,0.35)" rx="2"/>
      <rect x="${(W+2).toFixed(1)}" y="${py(30200).toFixed(1)}" width="11" height="${(py(30180)-py(30200)).toFixed(1)}" fill="rgba(122,26,92,.18)" rx="1"/>
      <rect x="${(W+2).toFixed(1)}" y="${py(30260).toFixed(1)}" width="7" height="${(py(30240)-py(30260)).toFixed(1)}" fill="rgba(122,26,92,.1)" rx="1"/>
      <rect x="${(W+2).toFixed(1)}" y="${py(30070).toFixed(1)}" width="5" height="${(py(30060)-py(30070)).toFixed(1)}" fill="rgba(122,26,92,.1)" rx="1"/>
      <text x="${(W+2).toFixed(0)}" y="${((pocY1+pocY2)/2+3).toFixed(0)}" fill="rgba(122,26,92,.7)" font-size="6" font-family="JetBrains Mono,monospace">POC</text>
    `;

    // Resistance line at 30314
    const resistY = py(30314);
    const resistLine = `<line x1="${PAD.left}" y1="${resistY.toFixed(1)}" x2="${W}" y2="${resistY.toFixed(1)}" stroke="rgba(220,50,50,.5)" stroke-width="1" stroke-dasharray="8,4"/>
      <text x="${(W+2).toFixed(0)}" y="${(resistY+3).toFixed(1)}" fill="rgba(220,50,50,.7)" font-size="6.5" font-family="JetBrains Mono,monospace">30314 R</text>`;

    // Price gridlines
    const priceGrid = [30100, 30150, 30200, 30250, 30300].map(p => {
      const y = py(p).toFixed(1);
      return `<line x1="${PAD.left}" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/>
              <text x="${(PAD.left-4)}" y="${y}" text-anchor="end" fill="#8C8896" font-size="8" font-family="JetBrains Mono,monospace" dominant-baseline="middle">${p.toLocaleString()}</text>`;
    }).join('\n');

    // Oscillator gridlines
    const oscGrid = [-40, -20, 0, 20, 40].map(v => {
      const y = oy(v).toFixed(1);
      const isZero = v === 0;
      return `<line x1="${PAD.left}" y1="${y}" x2="${W}" y2="${y}"
        stroke="${isZero ? '#c41e3a' : 'rgba(0,0,0,0.07)'}"
        stroke-width="${isZero ? 0.9 : 0.5}"
        stroke-dasharray="${isZero ? '5,4' : ''}"/>
        <text x="${(PAD.left-4)}" y="${y}" text-anchor="end" fill="${isZero ? '#c41e3a' : '#8C8896'}" font-size="7.5" font-family="JetBrains Mono,monospace" dominant-baseline="middle">${v > 0 ? '+' : ''}${v}</text>`;
    }).join('\n');

    // Time labels (approximate)
    const timeLabelData = [[9,'09:00'],[27,'PIT\nOPEN'],[45,'12:00'],[68,'14:00'],[83,'PIT\nCLOSE']];
    const timeLabels = timeLabelData.map(([b, t]) => {
      const x = px(b).toFixed(1);
      const lines = t.split('\n');
      const isPit = t.includes('PIT');
      return `<line x1="${x}" y1="${PAD.top}" x2="${x}" y2="${(H_TOTAL + PAD.top).toFixed(1)}"
        stroke="${isPit ? (t.includes('OPEN') ? '#3b82f6' : '#ef4444') : 'rgba(0,0,0,0.06)'}"
        stroke-width="${isPit ? 0.9 : 0.5}"
        stroke-dasharray="${isPit ? '6,4' : ''}"/>
        ${lines.map((l, i) => `<text x="${x}" y="${(viewH - 14 + i * 9).toFixed(1)}" text-anchor="middle" fill="${isPit ? (t.includes('OPEN') ? '#3b82f6' : '#ef4444') : '#8C8896'}" font-size="7" font-family="JetBrains Mono,monospace">${l}</text>`).join('')}`;
    }).join('\n');

    // Panel labels
    const panelLabels = `
      <text x="${PAD.left + 4}" y="${PAD.top + 11}" fill="#0A0B12" font-size="8" font-family="JetBrains Mono,monospace" font-weight="500" opacity=".4">PRICE PANEL  -  NQ SEP26 · 5-MIN · 2026-08-17 · NinjaTrader</text>
      <text x="${PAD.left + 4}" y="${(H_PRICE + GAP + PAD.top + 11).toFixed(1)}" fill="#0A0B12" font-size="8" font-family="JetBrains Mono,monospace" font-weight="500" opacity=".4">S949 OSCILLATOR (Rob Mitchell) · ±42 SCALE · ZERO LINE (RED DASH)</text>`;

    // Highlight zone for strongest divergence (bar 65-70)
    const hx1 = px(62).toFixed(1), hx2 = (px(72) - px(62)).toFixed(1);
    const highlightZone = `<rect x="${hx1}" y="${PAD.top}" width="${hx2}" height="${H_TOTAL}" fill="rgba(255,107,0,0.07)" rx="3"/>
      <text x="${(parseFloat(hx1) + parseFloat(hx2)/2).toFixed(0)}" y="${(PAD.top + 9).toFixed(1)}" text-anchor="middle" fill="rgba(255,107,0,.6)" font-size="7" font-family="JetBrains Mono,monospace">STRONGEST</text>`;

    const gAnns = gannArrows();
    const connectors = SIGNALS.map(divConnector).join('\n');
    const priceMarks = SIGNALS.map(s => signalMark(s, 'price')).join('\n');
    const oscMarks = SIGNALS.map(s => signalMark(s, 'osc')).join('\n');
    const oscLines = coloredOscPath(OSC_CURVE);
    const pricePath = pricePolyline(PRICE_CURVE);

    return `<svg viewBox="0 0 ${viewW + 30} ${viewH}" xmlns="http://www.w3.org/2000/svg" id="session-svg" style="width:100%;height:auto;display:block;">
  <defs>
    <marker id="arrowDark" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0,0 6,3 0,6" fill="#1a1a2a" opacity=".7"/>
    </marker>
  </defs>

  <rect width="${viewW + 30}" height="${viewH}" fill="#FAFAF8"/>
  <rect x="${PAD.left}" y="${PAD.top}" width="${PLOT_W}" height="${H_PRICE}" fill="#ffffff" rx="1"/>
  <rect x="${PAD.left}" y="${(H_PRICE + GAP + PAD.top).toFixed(1)}" width="${PLOT_W}" height="${H_OSC}" fill="#fef9ff" rx="1"/>

  ${rthBg}
  ${highlightZone}
  ${priceGrid}
  ${oscGrid}
  ${resistLine}
  ${panelLabels}

  <!-- Price path -->
  <path d="${pricePath}" fill="none" stroke="#0A0B12" stroke-width="1.8" stroke-linejoin="round"/>

  <!-- Gann swing arrows (price + oscillator panels) -->
  ${gAnns}

  <!-- Divergence connectors (vertical dashed lines) -->
  ${connectors}

  <!-- Signal markers  -  price panel -->
  ${priceMarks}

  <!-- Oscillator colored segments -->
  ${oscLines}

  <!-- Signal markers  -  oscillator panel -->
  ${oscMarks}

  <!-- Volume profile -->
  ${volProfile}

  <!-- Time labels -->
  ${timeLabels}

  <!-- Session info -->
  <text x="${(viewW/2).toFixed(0)}" y="${(viewH - 3).toFixed(0)}" text-anchor="middle" fill="#8C8896" font-size="7.5" font-family="JetBrains Mono,monospace">NQ SEP26 · 8/17/2026 · Stan Smidt · Session P&amp;L: +$1,155 · 1 contract · ATM: Profit 42 Ticks</text>
</svg>`;
  }

  // ── Signal cards ─────────────────────────────────────────────────────────────
  const SC = {
    'CONFIRMED':  { bg:'#EAF5EE', border:'rgba(26,122,60,.25)', text:'#1A7A3C' },
    'CONFLICTED': { bg:'#FFF5E6', border:'rgba(160,88,0,.2)',   text:'#A05800' },
    'NEUTRAL':    { bg:'#EFEBE2', border:'rgba(10,11,18,.12)',  text:'#8C8896' },
  };

  const ARROW_VIZ = {
    'up':     { sym:'↑',  col:'#1A7A3C', label:'Higher' },
    'down':   { sym:'↓',  col:'#E24B4A', label:'Lower' },
    'up_max': { sym:'↑↑', col:'#ff6b00', label:'+42 MAX' },
    'flat':   { sym:'→',  col:'#8C8896', label:'Flat' },
  };

  function sigCard(sig) {
    const sc = SC[sig.state];
    const isBuy = sig.type === 'BUY';
    const border2 = sig.highlight ? 'border:2px solid #ff6b00 !important;' : '';
    const ts2 = sig.tsDir === 'green' ? '#1A7A3C' : '#E24B4A';

    const av = sig.arrows;
    const priceArrow = ARROW_VIZ[av.price] || ARROW_VIZ.flat;
    const oscArrow   = ARROW_VIZ[av.osc]   || ARROW_VIZ.flat;

    const divBox = sig.divergence ? `
      <div style="display:flex;gap:0;margin-top:12px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="flex:1;text-align:center;padding:10px 8px;background:#fff;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#8C8896;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">Price Panel</div>
          <div style="font-size:22px;font-weight:700;color:${priceArrow.col};line-height:1;">${priceArrow.sym}</div>
          <div style="font-size:10px;color:${priceArrow.col};margin-top:3px;">${priceArrow.label} high/low</div>
        </div>
        <div style="width:1px;background:#e5e7eb;"></div>
        <div style="flex:1;text-align:center;padding:10px 8px;background:#fff;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#8C8896;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">Oscillator</div>
          <div style="font-size:22px;font-weight:700;color:${oscArrow.col};line-height:1;">${oscArrow.sym}</div>
          <div style="font-size:10px;color:${oscArrow.col};margin-top:3px;">${oscArrow.label}</div>
        </div>
        <div style="width:1px;background:#e5e7eb;"></div>
        <div style="flex:1;text-align:center;padding:10px 8px;background:#fff;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#8C8896;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">TickStrike</div>
          <div style="font-size:22px;font-weight:700;color:${ts2};line-height:1;">${sig.ts}</div>
          <div style="font-size:10px;color:${ts2};margin-top:3px;">${sig.tsDir.toUpperCase()}</div>
        </div>
        <div style="width:1px;background:#e5e7eb;"></div>
        <div style="flex:1;text-align:center;padding:10px 8px;background:${sc.bg};">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#8C8896;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">Signal</div>
          <div style="font-size:11px;font-weight:700;color:${sc.text};line-height:1.2;">${sig.state}</div>
        </div>
      </div>` : '';

    return `<div class="sig-card" id="card-${sig.id}" data-sig="${sig.id}"
      onclick="toggleSigCard(this)"
      style="background:${sc.bg};border:1px solid ${sc.border};border-radius:12px;padding:18px 20px;cursor:pointer;transition:box-shadow .15s,transform .1s;${border2}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        <div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8C8896;text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px;">${sig.time} · ${sig.price.toLocaleString()}</div>
          <div style="font-family:'Archivo',sans-serif;font-size:15px;font-weight:700;color:#0A0B12;line-height:1.2;">${sig.title}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;flex-shrink:0;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.1em;background:${isBuy ? 'rgba(26,122,60,.12)' : 'rgba(224,64,251,.1)'};color:${isBuy ? '#1A7A3C' : '#9C27B0'};border:1px solid ${isBuy ? 'rgba(26,122,60,.25)' : 'rgba(156,39,176,.2)'};">${sig.type}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.08em;color:${sig.divType === 'Type 2' ? '#4E0E3C' : '#6b7280'};border:1px solid currentColor;opacity:.9;">${sig.divType}</span>
        </div>
      </div>
      <p style="font-family:'Inter',sans-serif;font-size:13.5px;color:#16141F;line-height:1.65;margin:0;">${sig.note}</p>
      ${divBox}
    </div>`;
  }

  // ── Image 1 extras section ─────────────────────────────────────────────────
  const img1Extras = `
<div style="margin-top:40px;background:#EFEBE2;border:1px solid rgba(10,11,18,.12);border-radius:12px;padding:28px 32px;">
  <div class="eyebrow" style="margin-bottom:14px;">Chart 1 vs Chart 2  -  What the Additional Overlays Mean</div>
  <p style="font-size:14px;color:#8C8896;max-width:64ch;margin-bottom:24px;">
    Both screenshots show the same 8/17/2026 session. Chart 1 (captured at 16:30) has additional indicator overlays not visible in Chart 2 (16:55 clean version). These overlays are standard elements of Stan's full NinjaTrader setup.
  </p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#7A1A5C;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px;font-weight:600;">Chart 1 Only  -  Additional Elements</div>
      <div style="display:flex;flex-direction:column;gap:0;border:1px solid rgba(10,11,18,.12);border-radius:8px;overflow:hidden;">
        <div style="padding:12px 16px;background:#fff;border-bottom:1px solid rgba(10,11,18,.08);">
          <div style="font-size:13px;font-weight:600;color:#0A0B12;margin-bottom:4px;">Pink / Cyan Background Zones</div>
          <div style="font-size:13px;color:#8C8896;line-height:1.6;">Alternating vertical shading marks session phases. Cyan = active Regular Trading Hours (RTH) windows (~09:30-12:00, ~13:30-16:00). Pink = pre-market, lunch hour, or post-PIT windows. This is a time-based cycle overlay: Stan's system also incorporates time structure, not only price structure.</div>
        </div>
        <div style="padding:12px 16px;background:#fff;border-bottom:1px solid rgba(10,11,18,.08);">
          <div style="font-size:13px;font-weight:600;color:#0A0B12;margin-bottom:4px;">Break Labels (Red and Blue Triangles)</div>
          <div style="font-size:13px;color:#8C8896;line-height:1.6;"><span style="color:#3b82f6;font-weight:600;">Blue up-triangle Break</span> = price broke upward through a prior swing level (structural resistance cleared). <span style="color:#ef4444;font-weight:600;">Red down-triangle Break</span> = price broke below a prior swing level (support failed). These are automated breakout labels from Stan's NinjaTrader indicator suite  -  they mark when price definitively crosses a structural pivot.</div>
        </div>
        <div style="padding:12px 16px;background:#fff;">
          <div style="font-size:13px;font-weight:600;color:#0A0B12;margin-bottom:4px;">Colored Horizontal S/R Lines</div>
          <div style="font-size:13px;color:#8C8896;line-height:1.6;">Short horizontal segments in green (prior lows = support), red (prior highs = resistance), blue and gray (neutral pivots). The <span style="font-weight:600;">stepped red descending line</span> on the right traces the sequence of lower highs  -  a visual trailing resistance staircase. The <span style="font-weight:600;">red horizontal line at 30,314</span> marks the key resistance level from the prior session.</div>
        </div>
      </div>
    </div>
    <div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#7A1A5C;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px;font-weight:600;">dProfile  -  Volume at Price</div>
      <div style="border:1px solid rgba(10,11,18,.12);border-radius:8px;overflow:hidden;background:#fff;">
        <div style="padding:12px 16px;border-bottom:1px solid rgba(10,11,18,.08);">
          <div style="font-size:13px;font-weight:600;color:#0A0B12;margin-bottom:4px;">What It Shows</div>
          <div style="font-size:13px;color:#8C8896;line-height:1.6;">The gray histogram on the right side of Chart 1 is the volume profile (labeled "dProfile" in Stan's setup). Each horizontal bar shows how much trading volume occurred at that price level during the session. Longer bar = more activity. The widest bar is the Point of Control (POC)  -  the price with the highest volume of the day.</div>
        </div>
        <div style="padding:12px 16px;border-bottom:1px solid rgba(10,11,18,.08);">
          <div style="font-size:13px;font-weight:600;color:#0A0B12;margin-bottom:4px;">POC Cluster: 30,100 - 30,130</div>
          <div style="font-size:13px;color:#8C8896;line-height:1.6;">The heaviest volume on 8/17 concentrated in the <span style="font-weight:600;color:#7A1A5C;">30,100-30,130 zone</span>. This is "fair value" for the day  -  where buyers and sellers agreed the most. Secondary cluster near 30,210-30,240. Thin volume at the session high (~30,314) confirms low participation there (rejection, not acceptance).</div>
        </div>
        <div style="padding:12px 16px;">
          <div style="font-size:13px;font-weight:600;color:#0A0B12;margin-bottom:4px;">Why It Matters for Signal Timing</div>
          <div style="font-size:13px;color:#8C8896;line-height:1.6;">The POC at 30,100-30,130 acted as a magnet for price during the afternoon session. BUY signals near 30,075-30,085 were just below the POC  -  a natural level where buyers cluster. The volume profile adds a third layer of confluence to the oscillator signal + TickStrike confirmation framework.</div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  // ── Full section ─────────────────────────────────────────────────────────────
  function buildSection() {
    const cards = SIGNALS.filter(s => s.divergence).map(sigCard).join('\n');

    return `
<div style="margin-top:56px;">
  <div class="eyebrow" style="margin-bottom:14px;">The Session in Action</div>
  <h3 style="font-family:'Archivo',sans-serif;font-size:26px;font-weight:700;color:#0A0B12;line-height:1.15;margin-bottom:10px;">August 17, 2026 · NQ SEP26 · Stan Smidt</h3>
  <p style="font-size:15px;color:#8C8896;max-width:64ch;margin-bottom:8px;">
    The price chart alone does not reveal the signal. The oscillator alone does not show price context.
    Divergence  -  when both panels disagree  -  is where Stan acts.
    Below: the 8/17/2026 session reconstructed from HAL vision analysis of both NinjaTrader screenshots.
  </p>
  <p style="font-size:13.5px;color:#8C8896;max-width:64ch;margin-bottom:24px;">
    Session P&amp;L: <strong style="color:#1A7A3C;">+$1,155</strong> on 1 NQ contract using the ATM "Profit 42 Ticks" bracket.
    Click any signal marker or card to highlight both panels simultaneously.
  </p>

  <!-- Chart -->
  <div style="background:#FAFAF8;border:1px solid #dde1e8;border-radius:12px;padding:16px 8px 12px;overflow:hidden;margin-bottom:10px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:0 8px;flex-wrap:wrap;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:#0A0B12;letter-spacing:.1em;text-transform:uppercase;">NQ SEP26 · 5-min · 8/17/2026 · NinjaTrader · Stan Smidt</div>
      <div style="display:flex;gap:14px;margin-left:auto;flex-wrap:wrap;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#1A7A3C;display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:2px;background:#00c853;"></span>Osc Rising</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#E24B4A;display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:2px;background:#ff1744;"></span>Osc Falling</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#1A7A3C;">▲ BUY</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#9C27B0;">▼ SELL</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#ff6b00;">| Strongest divergence</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#7A1A5C;">--- Div connector</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#1a1a2a;">→ Gann swing</span>
      </div>
    </div>
    ${buildSVG()}
    <p style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#8C8896;margin-top:8px;text-align:center;padding:0 8px;letter-spacing:.05em;">
      Reconstructed from HAL vision analysis of Stan's NinjaTrader screenshots (proprietary  -  not reproduced directly). Educational illustration. Right: simplified volume profile (POC = 30,100-30,130).
    </p>
  </div>

  <!-- Signal cards -->
  <div style="margin-bottom:8px;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:#8C8896;text-transform:uppercase;letter-spacing:.14em;margin-bottom:14px;">Key Divergence Signals  -  Click to highlight on chart</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;" id="sig-cards">
      ${cards}
    </div>
  </div>

  <!-- Stan's rule block -->
  <div style="background:#0A0B12;border-radius:12px;padding:28px 32px;margin-top:20px;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.18em;margin-bottom:12px;">Stan's Rule  -  Verbatim</div>
    <p style="font-family:'Archivo',sans-serif;font-size:18px;font-weight:600;color:#EFEBE2;line-height:1.5;margin:0 0 20px;">
      "That's the place you want to buy right there because you got the divergence. Type two is always with the trend."
    </p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" id="rules-grid">
      <div style="border-left:3px solid #7A1A5C;padding-left:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">In an uptrend  -  compare lows</div>
        <div style="font-family:'Inter',sans-serif;font-size:13px;color:#EFEBE2;line-height:1.65;">Price makes a higher low. Oscillator makes a lower low. Selling pressure is weakening at the pullback. Type 2 BUY at the close of the signal candle. Target: prior swing high.</div>
      </div>
      <div style="border-left:3px solid #7A1A5C;padding-left:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">In a downtrend  -  compare highs</div>
        <div style="font-family:'Inter',sans-serif;font-size:13px;color:#EFEBE2;line-height:1.65;">Price makes a lower high. Oscillator peaks higher. Buying pressure is weakening at the bounce. Type 2 SELL. On 8/17: price 30,295 then 30,250 then 30,140 (lower highs) while oscillator peaked at +40, +25, then spiked to +42.</div>
      </div>
      <div style="border-left:3px solid #C6A35A;padding-left:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:rgba(239,235,226,.4);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">TickStrike is the trigger</div>
        <div style="font-family:'Inter',sans-serif;font-size:13px;color:#EFEBE2;line-height:1.65;">The oscillator provides the setup. TickStrike provides the confirmation. On 8/17, the +42 oscillator spike at 13:50 was NEUTRAL (TickStrike only 8). The CONFIRMED BUY at 14:10 had TickStrike at 12 green. Same oscillator condition, different TickStrike = different action.</div>
      </div>
    </div>
  </div>

  <!-- Image 1 annotation extras -->
  ${img1Extras}

  <style>
    @media(max-width:640px) {
      #sig-cards, #rules-grid { grid-template-columns:1fr !important; }
    }
    .sig-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.1); transform:translateY(-1px); }
    .sig-card.active { box-shadow:0 0 0 2.5px #7A1A5C; }
    .sig-marker { transition:opacity .2s; }
  </style>
</div>`;
  }

  // ── Interactivity ────────────────────────────────────────────────────────────
  window.toggleSigCard = function(card) {
    const sigId = card.dataset.sig;
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.sig-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.sig-marker').forEach(el => el.style.opacity = '1');
    if (!isActive) {
      card.classList.add('active');
      document.querySelectorAll('.sig-marker').forEach(el => {
        el.style.opacity = el.dataset.sig === sigId ? '1' : '0.25';
      });
    }
  };

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.innerHTML = buildSection();

    // SVG marker clicks
    document.querySelectorAll('.sig-marker').forEach(el => {
      el.addEventListener('click', () => {
        const sigId = el.dataset.sig;
        const card = document.getElementById(`card-${sigId}`);
        if (card) { card.scrollIntoView({ behavior:'smooth', block:'nearest' }); card.click(); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
