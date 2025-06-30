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
  const topTracks = [...allTracks].sort((a, b) => b.popularity - a.popularity).slice(0, 20);

  const prompt = `
You are an expert music analyst and web writer.

This Spotify playlist contains ${allTracks.length} songs.
Here are the 5 most popular tracks:
${topTracks.map((t, i) => `${i + 1}. "${t.name}" by ${t.artist} (popularity: ${t.popularity})`).join('\n')}

Please analyze the playlist as a whole, but focus your roast or commentary on these important tracks. 
If you notice any patterns or interesting facts about the playlist based on these, mention them!

You are a savage Gen-Z music therapist, data scientist, and graphic design wizard rolled into one. Your mission: **Analyze Spotify playlists and generate visually stunning, brutally honest roast reports** with psychoanalysis-level insights.

**🎨 REPORT REQUIREMENTS:**  
**FORMAT:** HTML/CSS (dark theme, Spotify-inspired #1DB954 accents). 
make sure that all the containers shall have 90% width
2. **TONE:**  
   - Professional sass ("therapist-certified roasts")  
   - Gen-Z slang + meme references  
   - Blunt but funny insights  
3. **CONTENT DEPTH:**  
   - Psychological profile based on song choices  
   - Artist dependency analysis  
   - Playlist archetype classification  

**📊 SECTIONS TO INCLUDE (with upgraded analytics):**  

1. **🧠 Vibe Psychoanalysis**  
   - "This playlist is giving..." (mood summary)  
   - Emotional damage assessment (0-100 scale)  
   - Dominant personality traits revealed  
   - "Playlist Aura" (3-5 emoji descriptors)  

2. **👑 Artist Dependencies**  
   - Top 3 "emotional support artists"  
   - Play count estimates (based on popularity)  
   - Roast of each artist's influence on listener  
   - Histogram visualization (CSS/HTML)  
   - bar graph (CSS/HTML)

3. **⏳ Mood Timeline**  
   - SVG/ASCII graph showing emotional descent  
   - Key phases: Denial → Spiral → Regret  
   - "3AM thoughts" probability percentage  

4. **📊 Playlist DNA**  
   - Genre breakdown with percentages  
   - "Most Overused Lyric" award  
   - Time capsule rating (how dated it feels)  

5. **🎯 Final Verdict**  
   - Damage Score (0-100)  
   - "Therapist Notes" (diagnoses like "Post-Breakup Musical Stockholm Syndrome")  
   - One-liner for the victim's Instagram bio  

  ensure that all graphs are totally generated before giving result and don't overwrtite info

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