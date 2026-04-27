export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { code, redirect_uri } = req.body;
  try {
    const params = new URLSearchParams({
      code: code,
      client_id: 'df15bff0-d329-4298-a29c-c261bfe37293',
      client_secret: 'brnh0ud98v',
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    });
    const response = await fetch('https://api.upstox.com/v2/login/authorization/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: params.toString()
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
