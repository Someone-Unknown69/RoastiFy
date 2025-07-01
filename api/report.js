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
Analyze the playlist as a whole, focusing your roast and commentary on these tracks.
Generate a JSON object with 6 keys ("page1"..."page6"), each containing a concise, fully responsive HTML fragment for a single <div class="report-section">...</div> container (not a full HTML page).

**VISUAL & CONTENT UPGRADE:**
- Make each <div class="report-section"> visually bold and engaging, not plain or minimal.
- Use creative CSS: gradients, cards, badges, icons, emojis, progress bars, SVGs, and shadow effects.
- Add micro-details: playlist personality badges, fun facts, top lyric snippet, energy/vibe meters, roast badges, etc.
- Use Spotify-style UI: rounded cards, neon #1DB954 highlights, playful microcopy, and modern layouts.
- Each section should feel like a unique, interactive dashboard card, not a boring text block.
- Use more color, spacing, and visual hierarchy for clarity and appeal.
- Add more data-driven insights and playful Gen-Z roasts.

**STRICT OUTPUT:**
- All graphs/visuals must be complete and responsive. If not possible, omit and mention why.
- Be concise, visually clear, and avoid filler.

do not include followup text like "Here is the html .... " basically generate only required element
Do NOT include any notes, disclaimers, or explanations about the HTML, CSS, responsiveness, or Gen-Z slang in your output. Only return the actual HTML report content, nothing else.

2. **TONE:**  
   - Professional sass ("therapist-certified roasts")  
   - Gen-Z slang + meme references  
   - Blunt but funny insights  
3. **CONTENT DEPTH:**  
   - Psychological profile based on song choices  
   - Artist dependency analysis (top 10 artists)
   - Playlist archetype classification  

**📊 SECTIONS TO INCLUDE (with upgraded analytics):**  

Page1. **🧠 Vibe Psychoanalysis**  
   - "This playlist is giving..." (mood summary)  
   - Emotional damage assessment (0-100 scale)  
   - Dominant personality traits revealed  
   - "Playlist Aura" (3-5 emoji descriptors)  
   - A final sarcastic quote in big box with labbeling as vibefy

Page2. **👑 Artist Dependencies**  
   - Top 5 "emotional support artists"  
   - Play count estimates (based on popularity)  
   - Roast of each top 3 artist's influence on listener  
   - Histogram visualization of top 3 artist(CSS/HTML)  
   - Make the graphs correctly , take some time but don't present incomplete graphs

Page3. ** Track Roast**
    - top 10 tracks of user
    - show estimate plays of each track in top 5 according to popularity
    - roast top 5 tracks individually
    - popularity pie chart of top 5 songs
    - Make the pie chart colorful with CSS/HTML supportive
    - also include top 10 least populatr tracks that user listens and roast each of them

Page4. **⏳ Mood Timeline**  
   - SVG/ASCII graph showing emotional descent  
   - Key phases: Denial → Spiral → Regret  
   - "3AM thoughts" probability percentage  
   - Give some suggestions for songs that will fix the mood of the user

Page5. **📊 Playlist DNA**  
   - Genre breakdown with percentages  
   - A graph of genre breakdown with colors and make it CSS/HTML Friendly
   - "Most Overused Lyric" award  
   - Time capsule rating (how dated it feels)  

Page6. **🎯 Final Verdict**  
   - Damage Score (0-100)  
   - "Therapist Notes" (diagnoses like "Post-Breakup Musical Stockholm Syndrome")  
   - Funny medicines that have names based on the songs to add some sarcasm
   - One-liner for the victim's Instagram bio  

**Requirements:**
- All graphs/visuals must be complete and responsive. If not possible, omit and mention why.
- Be concise, visually clear, and avoid filler.

**Example output:**
{
  "page1": "<div class=\"report-section\">...</div>",
  "page2": "<div class=\"report-section\">...</div>",
  "page3": "<div class=\"report-section\">...</div>",
  "page4": "<div class=\"report-section\">...</div>",
  "page5": "<div class=\"report-section\">...</div>",
  "page6": "<div class=\"report-section\">...</div>"
}
`;
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "google/gemini-2.0-flash-001",
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
  console.log("RAW AI API RESPONSE:", data);

  let aiMessage = data.choices?.[0]?.message?.content || "Null";
  aiMessage = aiMessage.replace(/```json\n?|```/g, '').trim();
  console.log(aiMessage)

  let parsedMessage = JSON.parse(aiMessage);

  console.log(parsedMessage.page1)

  res.status(response.status).json(parsedMessage);
}