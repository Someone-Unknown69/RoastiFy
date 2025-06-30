export default async function handler(req, res) {
  let body = req.body;
  if (req.method === "POST" && typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }
  const { tracks } = body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "No OpenRouter API key set" });
  }

  const allTracks = tracks.map(t => ({
    name: t.name,
    artist: t.artist,
    popularity: t.popularity
  }));

    // Sort by popularity and pick top 5
  const topTracks = [...allTracks].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

  const prompt = `
You are an expert music analyst and web writer.

This Spotify playlist contains ${allTracks.length} songs.
Here are the 5 most popular tracks:
${topTracks.map((t, i) => `${i + 1}. "${t.name}" by ${t.artist} (popularity: ${t.popularity})`).join('\n')}

Please analyze the playlist as a whole, but focus your roast or commentary on these important tracks. 
If you notice any patterns or interesting facts about the playlist based on these, mention them!

**Return your entire response as a complete, styled HTML report.**
Include:
- A catchy heading for the report
- A summary paragraph
- A bulleted or numbered list of the top tracks with your comments
- Any fun or roast-style remarks
- Use basic HTML tags (h2, p, ul/ol, li, strong, em, etc.)
- Optionally, add a little inline CSS for color or emphasis

Do NOT include markdown or code blocks, just pure HTML.
make it spotify color themed and also increase the amount of spacing and info
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "google/gemini-2.5-flash-lite-preview-06-17",
      "messages": [
      {
        "role": "user",
        "content": prompt
      }
  ]
  })
  });

  const data = await response.json()
  const aiMessage = data?.choices?.[0]?.message?.content || "No response from AI.";
  res.status(response.status).json({ message: aiMessage });
}