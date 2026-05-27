export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {apiKey, body} = req.body;
  if(!apiKey) return res.status(400).json({error:'No API key'});
  try{
    // Fetch latest available models and pick best sonnet
    let model = 'claude-sonnet-4-5'; // fallback
    try{
      const mr = await fetch('https://api.anthropic.com/v1/models', {
        headers: {'x-api-key': apiKey, 'anthropic-version': '2023-06-01'}
      });
      const md = await mr.json();
      if(md.data && md.data.length){
        // Pick latest sonnet model
        const sonnet = md.data
          .filter(m => m.id.includes('sonnet'))
          .sort((a,b) => b.id.localeCompare(a.id))[0];
        if(sonnet) model = sonnet.id;
      }
    }catch(e){}

    const payload = {...body, model};
    const r = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':apiKey,
        'anthropic-version':'2023-06-01'
      },
      body: JSON.stringify(payload)
    });
    const d = await r.json();
    res.status(200).json(d);
  }catch(e){
    res.status(500).json({error:e.message});
  }
}
