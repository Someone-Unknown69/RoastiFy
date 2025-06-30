export default async function handler(req, res) {
  const { tracks } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log(apiKey)
  if (!apiKey) {
    return res.status(500).json({ error: "No OpenRouter API key set" });
  }

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
          "content": "Analyze these tracks: " + JSON.stringify(tracks)
        }
      ]
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}