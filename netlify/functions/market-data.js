// Tribune Trader — Market Data Proxy
// Proxies Yahoo Finance QQQ 5-min data server-side to bypass browser CORS restrictions.
// Netlify Functions run on Node.js with no CORS restrictions.

const https = require('https');

exports.handler = async function () {
  const url =
    'https://query1.finance.yahoo.com/v8/finance/chart/QQQ' +
    '?interval=5m&range=1d&includePrePost=false';

  try {
    const data = await new Promise((resolve, reject) => {
      const req = https.get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
              'Chrome/120.0.0.0 Safari/537.36',
            Accept: 'application/json,*/*',
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              reject(new Error('JSON parse failed: ' + body.slice(0, 200)));
            }
          });
        }
      );
      req.on('error', reject);
      req.setTimeout(8000, () => {
        req.destroy();
        reject(new Error('request timeout'));
      });
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=25, s-maxage=25',
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
