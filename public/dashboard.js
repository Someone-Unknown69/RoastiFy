const tracks = JSON.parse(localStorage.getItem("tracks") || "[]");
const container = document.getElementById("tracks-container");

if (tracks.length === 0) {
  container.textContent = "No tracks found.";
} else {
    async function getReport(tracks) {
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
            "content": "What is the meaning of life?"
          }
        ]
      })
    });
    const data = await response.json()
    return data;
  }


  getReport(tracks).then(aiResult => {
    container.textContent = JSON.stringify(aiResult, null, 2);
  }).catch(err => {
    container.textContent = "AI request failed: " + err.message;
  });

}