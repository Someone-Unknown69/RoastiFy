const tracks = JSON.parse(localStorage.getItem("tracks") || "[]");
const container = document.getElementById("tracks-container");

if (tracks.length === 0) {
  container.textContent = "No tracks found.";
} else {
  container.innerHTML = tracks.map(
    t => `<div>
      <strong>${t.name}</strong> by ${t.artist} (Popularity: ${t.popularity})
    </div>`
  ).join("");
}