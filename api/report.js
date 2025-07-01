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

**VISUAL & CONTENT UPGRADE:**
- Make each <div class="report-section"> visually bold and engaging, not plain or minimal.
- Use creative CSS: gradients, cards, badges, icons, emojis, progress bars, SVGs, and shadow effects.
- Add micro-details: playlist personality badges, fun facts, top lyric snippet, energy/vibe meters, roast badges, etc.
- Use Spotify-style UI: rounded cards, neon #1DB954 highlights, playful microcopy, and modern layouts.
- Each section should feel like a unique, interactive dashboard card, not a boring text block.
- Use more color, spacing, and visual hierarchy for clarity and appeal.
- Add more data-driven insights and playful Gen-Z roasts.

**STRICT OUTPUT:**
- Output must be a pure JSON object, no markdown, code blocks, or explanations.
- Each value must be a single <div class="report-section">...</div> container, dark theme, Spotify #1DB954 accents, 90% width, mobile-friendly, valid HTML/CSS.
- All graphs/visuals must be complete and responsive. If not possible, omit and mention why.
- Be concise, visually clear, and avoid filler.
- Return ONLY a valid JSON object as your entire response. Do NOT include any text, markdown, code blocks, or explanations—just the JSON.

 **TONE:**  
   - Professional sass ("therapist-certified roasts")  
   - Gen-Z slang + meme references  
   - Blunt but funny insights  
 **CONTENT DEPTH:**  
   - Psychological profile based on song choices  
   - Artist dependency analysis (top 10 artists)
   - Playlist archetype classification  


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



**Requirements:**
- Output must be a pure JSON object, no markdown, code blocks, or explanations.
- Each value must be a single <div class="report-section">...</div> container, dark theme, Spotify #1DB954 accents, 90% width, mobile-friendly, valid HTML/CSS.
- All graphs/visuals must be complete and responsive. If not possible, omit and mention why.
- Be concise, visually clear, and avoid filler.

**IMPORTANT:**
Return ONLY a valid JSON object as your entire response. Do NOT include any text, markdown, code blocks, or explanations—just the JSON.

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