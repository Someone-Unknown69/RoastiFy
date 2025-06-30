export default async function handler(req, res) {
  const { tracks } = req.body;
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
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
  res.status(200).json(data);
}