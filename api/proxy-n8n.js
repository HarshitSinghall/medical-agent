// api/proxy-n8n.js
// A simple Vercel serverless function to proxy requests to n8n webhook, bypassing CORS

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Build query string from all query parameters
  const params = new URLSearchParams(req.query).toString();
  const n8nUrl = `https://leadupai.app.n8n.cloud/webhook/my-workflow?${params}`;

  try {
    const n8nRes = await fetch(n8nUrl, { method: 'GET' });
    const data = await n8nRes.text();
    res.status(n8nRes.status).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
