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
Generate a JSON object with 6 keys ("page1"..."page6"), each containing a concise, fully responsive HTML fragment for a single <div class="report-section">...</div> container (not a full HTML page).

ABSOLUTELY DO NOT include any explanations, markdown, code blocks, or extra text.
Return ONLY a valid JSON object as your entire response.
If you cannot generate the JSON, return: {"page1":"","page2":"","page3":"","page4":"","page5":"","page6":""}

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

**TASK:**  
Return a pure JSON object with 6 keys: "page1", "page2", "page3", "page4", "page5", "page6.  
Each key's value must be a complete, concise, responsive HTML string for that section, following these topics:

Page 1. **🧠 Vibe Psychoanalysis**  
   - "This playlist is giving..." (mood summary)  
   - Emotional damage assessment (0-100 scale)  
   - Dominant personality traits revealed  
   - "Playlist Aura" (3-5 emoji descriptors)  

Page 2. **👑 Artist Dependencies**  
   - Top 3 "emotional support artists"  
   - Play count estimates (based on popularity)  
   - Roast of each top 3 artist's influence on listener  
   - Histogram visualization (CSS/HTML)  
   - bar graph (CSS/HTML)
   - Make the graphs correctly , take some time but don't present incomplete graphs

Page 3. ** Track Roast**
    - top 10 tracks of user
    - roast em brutually
    - popularity graph of top 5 songs
    - also include top 10 least populatr tracks that user listens

Page 4. **⏳ Mood Timeline**  
   - SVG/ASCII graph showing emotional descent  
   - Key phases: Denial → Spiral → Regret  
   - "3AM thoughts" probability percentage  

Page 5. **📊 Playlist DNA**  
   - Genre breakdown with percentages  
   - "Most Overused Lyric" award  
   - Time capsule rating (how dated it feels)  

Page 6. **🎯 Final Verdict**  
   - Damage Score (0-100)  
   - "Therapist Notes" (diagnoses like "Post-Breakup Musical Stockholm Syndrome")  
   - One-liner for the victim's Instagram bio  



**REQUIREMENTS:**  
- Output must be a pure JSON object, no markdown, no code blocks, no explanations.
- Each HTML string must be fully responsive, dark themed, Spotify #1DB954 accents, 90% width containers, mobile-friendly.
- Use valid HTML/CSS only. If you can't generate a correct graph, omit it and mention why.
- Keep each page concise and visually clear—avoid unnecessary filler or repeated info.

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
  console.log("RAW AI API RESPONSE:", data); // <-- Add this line

  let aiMessage = data.choices?.[0]?.message?.content || "Null";
  console.log("AI MESSAGE CONTENT:", aiMessage); // <-- Add this line

  aiMessage = aiMessage.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

  let pagesHtml;
  try {
    pagesHtml = JSON.parse(aiMessage);
    console.log(pagesHtml)
  } catch (e) {
    return res.status(500).json({ message: "AI did not return valid JSON.", raw: aiMessage });
  }

  res.status(response.status).json({ message: pagesHtml });
}