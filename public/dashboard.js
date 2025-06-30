const tracks = JSON.parse(localStorage.getItem("tracks") || "[]");
const container = document.getElementById("tracks-container");

if (tracks.length === 0) {
  container.textContent = "No tracks found.";
} else {
  async function getReport(tracks) {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracks })
    });
    const data = await response.json();
    return data;
  }

  getReport(tracks).then(aiResult => {
    container.innerHTML = aiResult.message; // Render the AI's HTML report
  }).catch(err => {
    container.textContent = "AI request failed: " + err.message;
  });
}