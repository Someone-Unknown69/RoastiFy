document.querySelector(".analyze-button").addEventListener("click", async () => {
  const url = document.getElementById("playlist-link").value;

  if (!url || !url.includes("playlist/")) {
    document.getElementById("output").textContent = "Please enter a valid Spotify playlist URL.";
    return;
  }

  try {
    const res = await fetch("/api/playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlistUrl: url }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch playlist data.");
    }

    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(data.tracks, null, 2);
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }

  
});