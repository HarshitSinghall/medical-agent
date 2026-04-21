// api/proxy-n8n.js
// A simple Vercel serverless function to proxy requests to n8n webhook, bypassing CORS

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // The n8n webhook URL (test for now)
  const n8nUrl = 'https://leaduapi.app.n8n.cloud/webhook-test/dcf38fa5-23d0-4958-b4dc-aa83d111463f';

  try {
    const n8nRes = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await n8nRes.text();
    res.status(n8nRes.status).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
