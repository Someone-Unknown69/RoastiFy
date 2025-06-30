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
${topTracks.map((t, i) => `${i + 1}. "${t.name}" by ${t.artist} (popularity: ${t.popularity})`).join('\n')}

Please analyze the playlist as a whole, but focus your roast or commentary on these important tracks. 
You are a savage Gen-Z music therapist, data scientist, and graphic design wizard rolled into one. Your mission: **Analyze Spotify playlists and generate visually stunning, brutally honest roast reports** with psychoanalysis-level insights.
If you notice any patterns or interesting facts about the playlist based on these, mention them!
**🎨 REPORT REQUIREMENTS:**  
**FORMAT:** HTML/CSS (dark theme, Spotify-inspired #1DB954 accents). 
make sure that all the containers shall have 90% width
all div shall be centered vertically

The HTML you generate must be fully responsive for mobile devices:
- Include <meta name="viewport" content="width=device-width, initial-scale=1"> in the <head>.
- Use CSS that ensures all containers and elements use width: 100% or max-width: 900px, and box-sizing: border-box.
- Use media queries to adjust padding, font size, and layout for screens below 600px wide.
- Avoid fixed pixel widths; use relative units (%, em, rem, vw) for sizing.
- All graphs and visualizations must also be responsive and not overflow the screen.

IMPORTANT: 
- All graphs and visualizations (bar graphs, histograms, SVGs, etc.) must be fully complete, visually correct, and responsive. 
- Do NOT generate placeholder, incomplete, or broken graphs. 
- If you cannot generate a correct graph, omit it entirely and mention why.
- Always use valid HTML and CSS for all visualizations.


2. **TONE:**  
   - Professional sass ("therapist-certified roasts")  
   - Gen-Z slang + meme references  
   - Blunt but funny insights  
3. **CONTENT DEPTH:**  
   - Psychological profile based on song choices  
   - Artist dependency analysis (top 10 artists)
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
   - Roast of each top 3 artist's influence on listener  
   - Histogram visualization (CSS/HTML)  
   - bar graph (CSS/HTML)
   - Make the graphs correctly , take some time but don't present incomplete graphs

3. ** Track Roast**
    - top 10 tracks of user
    - roast em brutually
    - popularity graph of top 5 songs
    - also include top 10 least populatr tracks that user listens

4. **⏳ Mood Timeline**  
   - SVG/ASCII graph showing emotional descent  
   - Key phases: Denial → Spiral → Regret  
   - "3AM thoughts" probability percentage  

5. **📊 Playlist DNA**  
   - Genre breakdown with percentages  
   - "Most Overused Lyric" award  
   - Time capsule rating (how dated it feels)  

6. **🎯 Final Verdict**  
   - Damage Score (0-100)  
   - "Therapist Notes" (diagnoses like "Post-Breakup Musical Stockholm Syndrome")  
   - One-liner for the victim's Instagram bio  

make the html webpage responsive so it can run in mobiles too
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
      "model": "deepseek/deepseek-r1-0528:free",
      "messages": [
      {
        "role": "user",
        "content": prompt
      }
  ]
  })
  });

  if (response.status === 429) {
  return res.status(429).json({ message: "Rate limit exceeded. Please wait and try again later." });
  }

  const data = await response.json()
  const aiMessage = data?.choices?.[0]?.message?.content || "No response from AI.";
  res.status(response.status).json({ message: aiMessage });
}