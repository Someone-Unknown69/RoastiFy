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

    // Sort by popularity and pick top 20
  const topTracks = [...allTracks].sort((a, b) => b.popularity - a.popularity);

  const prompt = `
You are an expert music analyst and web writer.

This Spotify playlist contains ${allTracks.length} songs.
Here are the 5 most popular tracks:
${topTracks.slice(0, 5).map((t, i) => `${i + 1}. "${t.name}" by ${t.artist} (popularity: ${t.popularity})`).join('\n')}

Analyze the playlist as a whole, focusing your roast and commentary on these tracks.  
Generate a JSON object with 5 keys ("page1"..."page5"), each containing a concise, fully responsive HTML string for:

- page1: Vibe Psychoanalysis (mood summary, emotional damage score, dominant traits, playlist aura emojis)
- page2: Artist Dependencies (top 3 artists, play count estimates, roast, responsive bar/histogram)
- page3: Track Roast (top 10 tracks, roast, popularity graph of top 5, 10 least popular tracks)
- page4: Mood Timeline (SVG/ASCII graph, Denial→Spiral→Regret, 3AM thoughts %)
- page5: Playlist DNA (genre breakdown, most overused lyric, time capsule rating)
- page6: Final Verdict (damage score, therapist notes, IG bio one-liner)

**Requirements:**  
- Output must be a pure JSON object, no markdown, code blocks, or explanations.
- Each HTML string: dark theme, Spotify #1DB954 accents, 90% width, mobile-friendly, valid HTML/CSS.
- All graphs/visuals must be complete and responsive. If not possible, omit and mention why.
- Be concise, visually clear, and avoid filler.

**Example output:**  
{
  "page1": "<html>...</html>",
  "page2": "<html>...</html>",
  "page3": "<html>...</html>",
  "page4": "<html>...</html>",
  "page5": "<html>...</html>",
  "page6": "<html>...</html>"
}
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
      "messages": [
      {
        "role": "user",
        "content": prompt
      }
  ]
  })
  });

  if (response.status === 429) {
  return res.status(429).json({ message: "Rate limit exceeded. Please wait and try again later. (The developer is using free AI model so this shi happens" });
  }

  const data = await response.json()
  let aiMessage = data?.choices?.[0]?.message?.content || "";
  aiMessage = aiMessage.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

  let pagesHtml;
  try {
    pagesHtml = JSON.parse(aiMessage);
  } catch (e) {
    return res.status(500).json({ message: "AI did not return valid JSON.", raw: aiMessage });
  }

  res.status(response.status).json({ message: pagesHtml });
}