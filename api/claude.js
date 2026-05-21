export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {apiKey, body} = req.body;
  if(!apiKey) return res.status(400).json({error:'No API key'});
  try{
    const r = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':apiKey,
        'anthropic-version':'2023-06-01',
        'anthropic-beta':'web-search-2025-03-05'
      },
      body: JSON.stringify(body)
    });
    const d = await r.json();
    res.status(200).json(d);
  }catch(e){
    res.status(500).json({error:e.message});
  }
}
