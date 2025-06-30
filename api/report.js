export default async function handler(req, res) {
  let body = req.body;
  if (req.method === "POST" && typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }
  const { tracks } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "No OpenRouter API key set" });
  }

  const limitedTracks = (tracks || []).slice(0, 10).map(t => ({
    name: t.name,
    artist: t.artist
  }));

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "thedrummer/anubis-70b-v1.1",
      "messages": [
      {
        "role": "user",
        "content": "Roast this Spotify playlist: " + JSON.stringify(limitedTracks)
      }
  ]
  })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}